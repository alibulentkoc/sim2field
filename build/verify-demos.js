#!/usr/bin/env node
/* SIM2FIELD demo-binding guard.
   Closes the manifest <-> shipped-HTML drift class for embedded interactive demos,
   the same way verify-figures.js does for figures. Every demo embedded in a shipped
   module edition (a <div class="widget-embed demo"> ... <iframe src="..."> block) must
   have a resolving inlineDemos binding in media-manifest.json whose file exists under
   OUT_DIR, and every inlineDemos binding must resolve to an existing file.

   Usage:  node verify-demos.js            (OUT_DIR=/path to check out-of-tree outputs)
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

function boundDemos(cfg) {
  const m = new Map(); // file -> exists
  for (const d of (cfg.inlineDemos || [])) if (d.file) m.set(d.file, fs.existsSync(path.join(OUT_DIR, d.file)));
  return m;
}

function embeddedDemos(html) {
  const out = [];
  const re = /<div class="widget-embed demo">[\s\S]*?<iframe\b[^>]*\bsrc="([^"]+)"[\s\S]*?<\/iframe><\/div>/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

const editions = ["html", "author.html"];
const failures = [];
let mods = 0, checked = 0;

for (const NN of Object.keys(manifest).sort()) {
  if (!/^\d\d$/.test(NN)) continue;
  const bound = boundDemos(manifest[NN]);
  for (const [file, exists] of bound) if (!exists) failures.push(`module-${NN}: inlineDemos file ${file} does not exist under OUT_DIR`);
  let saw = false;
  const reported = new Set();
  for (const ed of editions) {
    const fp = path.join(OUT_DIR, `module-${NN}.${ed}`);
    if (!fs.existsSync(fp)) continue;
    saw = true;
    const html = fs.readFileSync(fp, "utf8");
    for (const src of embeddedDemos(html)) {
      checked++;
      if (!bound.has(src)) { const k = "MISS:" + src; if (!reported.has(k)) { reported.add(k); failures.push(`module-${NN}.${ed}: embeds demo ${src} with NO inlineDemos binding`); } }
      else if (!bound.get(src)) { const k = "NOFILE:" + src; if (!reported.has(k)) { reported.add(k); failures.push(`module-${NN}: demo ${src} bound but file missing under OUT_DIR`); } }
    }
  }
  if (saw) mods++;
}

console.log(`demo guard: checked ${checked} embedded demo references across ${mods} modules`);
if (failures.length) {
  console.error(`\nFAIL - ${failures.length} demo binding issue(s):`);
  for (const f of failures) console.error("  - " + f);
  console.error("\nFix: bind each embedded demo in media-manifest.json inlineDemos (id, section, file) with an existing file.");
  process.exit(1);
}
console.log("PASS - every embedded demo has a resolving inlineDemos binding whose file exists.");
