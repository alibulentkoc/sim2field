#!/usr/bin/env node
/* SIM2FIELD figure-binding guard.
   Closes the manifest <-> shipped-HTML drift class: a figure can ship in a module
   edition yet be absent from media-manifest.json, so a re-render would silently drop
   it (verify-build.js only covers the KaTeX assets, not module HTML). This guard makes
   that reproducible-from-source contract enforceable.

   For every module NN and every shipped edition (module-NN.html and, if present,
   module-NN.author.html), each REAL figure - <figure class="figure fig-real"> carrying
   a <span class="fid">ID</span> - must:
     1. have a matching binding in media-manifest.json (inlineFigures, or anchor7.figure),
     2. and that binding's fragment must resolve to an existing F-*.svg under OUT_DIR.

   Usage:
     node verify-figures.js
   Shipped HTML + fragments default to the parent of build/. Override for out-of-tree:
     OUT_DIR=/path node verify-figures.js
*/
"use strict";
const fs = require("fs");
const path = require("path");

const BUILD_DIR = __dirname;
const OUT_DIR = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.resolve(BUILD_DIR, "..");

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, "media-manifest.json"), "utf8"));
} catch (e) {
  console.error("could not read media-manifest.json:", e.message);
  process.exit(2);
}

// id -> fragment for every figure the manifest binds (inlineFigures + anchor7.figure).
function boundFigures(cfg) {
  const map = new Map();
  const add = (f) => { if (f && f.id && f.fragment) map.set(f.id, f.fragment); };
  (cfg.inlineFigures || []).forEach(add);
  if (cfg.anchor7 && cfg.anchor7.figure) add(cfg.anchor7.figure);
  return map;
}

// Ids of the real (produced, injected) figures in a shipped edition. Placeholder slots
// (<figure class="figure slot">) and the ASCII spine (<figure class="figure diagram">)
// carry a fid too but are deliberately excluded: only fig-real is a shipped figure.
function shippedRealFids(html) {
  const ids = [];
  const re = /<figure class="figure fig-real">([\s\S]*?)<\/figure>/g;
  let m;
  while ((m = re.exec(html))) {
    const fid = (m[1].match(/class="fid">([^<]+)</) || [])[1];
    if (fid) ids.push(fid);
  }
  return ids;
}

const editions = ["html", "author.html"];
const failures = [];
let modsChecked = 0, figsChecked = 0;

for (const NN of Object.keys(manifest).sort()) {
  if (!/^\d\d$/.test(NN)) continue;
  const bound = boundFigures(manifest[NN]);
  let sawEdition = false;
  const reported = new Set();
  for (const ed of editions) {
    const file = path.join(OUT_DIR, `module-${NN}.${ed}`);
    if (!fs.existsSync(file)) continue;
    sawEdition = true;
    const html = fs.readFileSync(file, "utf8");
    for (const fid of shippedRealFids(html)) {
      figsChecked++;
      if (!bound.has(fid)) {
        const k = "MISS:" + fid;
        if (!reported.has(k)) { reported.add(k); failures.push(`module-${NN}: ships real figure ${fid}, but it has NO binding in media-manifest.json (a re-render would drop it)`); }
        continue;
      }
      const frag = bound.get(fid);
      if (!fs.existsSync(path.join(OUT_DIR, frag))) {
        const k = "NOFILE:" + fid;
        if (!reported.has(k)) { reported.add(k); failures.push(`module-${NN}: binding ${fid} -> ${frag} does not resolve (no such file under OUT_DIR)`); }
      }
    }
  }
  if (sawEdition) modsChecked++;
}

console.log(`figure guard: checked ${figsChecked} shipped real-figure references across ${modsChecked} modules`);
if (failures.length) {
  console.error(`\nFAIL - ${failures.length} shipped figure(s) lack a resolving manifest binding:`);
  for (const f of failures) console.error("  - " + f);
  console.error("\nFix: add the figure's inlineFigures binding (id, section, fragment) to media-manifest.json");
  console.error("     so a re-render reproduces the shipped edition, and ensure the F-*.svg exists under OUT_DIR.");
  process.exit(1);
}
console.log("PASS - every shipped real figure has a resolving inlineFigures/anchor7 binding.");
