#!/usr/bin/env node
/* SIM2FIELD build drift guard.
   For every <asset>-src.html listed in build-manifest.json, re-render it through
   the real prerender.js and byte-compare the result against the committed,
   shipped <asset>.html. If any generated file differs from a fresh render of its
   source - i.e. someone hand-edited the output, or forgot to re-run the build -
   this exits non-zero and names the offending file. It also verifies the source
   is pure ASCII (prerender expects ascii_clean'd TeX) and that both files exist.

   The math source of truth is the TeX in each -src.html. The shipped .html is a
   build product; this guard makes that relationship enforceable in CI.

   Usage:
     node verify-build.js
   Output dir (where the shipped .html live) defaults to the parent of build/.
   Override for out-of-tree checks:
     OUT_DIR=/path/to/site node verify-build.js
*/
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const BUILD_DIR = __dirname;
const OUT_DIR = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.resolve(BUILD_DIR, "..");
const PRERENDER = path.join(BUILD_DIR, "prerender.js");

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, "build-manifest.json"), "utf8")).assets;
} catch (e) {
  console.error("could not read build-manifest.json:", e.message);
  process.exit(2);
}

const failures = [];
let checked = 0;
const total = Object.keys(manifest).length;

for (const [src, out] of Object.entries(manifest)) {
  const srcPath = path.join(BUILD_DIR, src);
  const outPath = path.join(OUT_DIR, out);

  if (!fs.existsSync(srcPath)) { failures.push(`${src}: MISSING source`); continue; }
  if (!fs.existsSync(outPath)) { failures.push(`${out}: MISSING generated output (expected at ${outPath})`); continue; }

  // Source must be pure ASCII (prerender consumes ascii_clean'd TeX; Unicode here
  // signals an uncleaned source that will not round-trip deterministically).
  const srcBytes = fs.readFileSync(srcPath);
  if (srcBytes.some(b => b > 0x7f)) {
    failures.push(`${src}: source contains non-ASCII bytes (run ascii_clean.py on the source)`);
  }

  // Reproduce the output from the source through the real build.
  const tmp = path.join(os.tmpdir(), `verify-${src.replace(/[^\w.-]/g, "_")}.html`);
  try {
    execFileSync("node", [PRERENDER, srcPath, tmp], { cwd: BUILD_DIR, stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const msg = (e.stderr && e.stderr.toString().trim()) || e.message;
    failures.push(`${src}: prerender FAILED - ${msg}`);
    continue;
  }

  const regen = fs.readFileSync(tmp);
  const committed = fs.readFileSync(outPath);
  checked++;

  if (!regen.equals(committed)) {
    let diffAt = -1;
    const n = Math.min(regen.length, committed.length);
    for (let i = 0; i < n; i++) { if (regen[i] !== committed[i]) { diffAt = i; break; } }
    if (diffAt < 0) diffAt = n; // one is a prefix of the other (length differs)
    const ctx = committed.slice(Math.max(0, diffAt - 45), diffAt + 45).toString("utf8").replace(/\n/g, "\\n");
    failures.push(
      `${out}: DRIFT from ${src}\n` +
      `      re-rendered output differs from committed file; first difference at byte ${diffAt} ` +
      `(committed ${committed.length} B, re-render ${regen.length} B)\n` +
      `      committed near diff: ...${ctx}...`
    );
  }
  try { fs.unlinkSync(tmp); } catch (_) {}
}

console.log(`drift guard: re-rendered and checked ${checked}/${total} assets against their -src.html`);
if (failures.length) {
  console.error("\nFAIL - generated files are out of sync with their source:");
  for (const f of failures) console.error("  - " + f);
  console.error("\nFix: for each drifted asset, re-run");
  console.error("       node prerender.js <asset>-src.html ../<asset>.html");
  console.error("     then commit the regenerated output. Never hand-edit the shipped .html.");
  process.exit(1);
}
console.log("PASS - every generated .html byte-matches a fresh render of its -src.html. No drift.");
