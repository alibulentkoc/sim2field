#!/usr/bin/env node
/* SIM2FIELD solutions guard.
   For every homework check script build/checks/M<NN>-homework-check.js, run it and
   assert every `EXPECT <string>` line it prints appears verbatim in that module's
   solutions/M<NN>-homework-solutions.md. This ties each authored numeric homework
   answer to an independent, executable recomputation (campaign rule: every numeric
   answer is backed by an executable check script).
   Usage:  node verify-solutions.js       (OUT_DIR=/path to check out-of-tree solutions)
*/
"use strict";
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const BUILD_DIR = __dirname;
const OUT_DIR = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.resolve(BUILD_DIR, "..");
const CHECKS = path.join(BUILD_DIR, "checks");

let scripts = [];
try { scripts = fs.readdirSync(CHECKS).filter(f => /^M\d\d-homework-check\.js$/.test(f)).sort(); }
catch (e) { /* no checks dir yet */ }

const failures = [];
let checked = 0, verified = 0;

for (const s of scripts) {
  const NN = s.match(/^M(\d\d)/)[1];
  const sol = path.join(OUT_DIR, "solutions", `M${NN}-homework-solutions.md`);
  if (!fs.existsSync(sol)) { failures.push(`M${NN}: check script exists but solutions/M${NN}-homework-solutions.md is missing`); continue; }
  let out = "";
  try { out = cp.execFileSync("node", [path.join(CHECKS, s)], { encoding: "utf8" }); }
  catch (e) { failures.push(`M${NN}: check script FAILED - ${((e.stderr || e.message || "") + "").trim().split("\n").pop()}`); continue; }
  const solTxt = fs.readFileSync(sol, "utf8");
  const wants = out.split("\n").filter(l => l.startsWith("EXPECT ")).map(l => l.slice(7).trim());
  if (!wants.length) { failures.push(`M${NN}: check script printed no EXPECT lines`); continue; }
  checked++;
  for (const w of wants) {
    verified++;
    if (!solTxt.includes(w)) failures.push(`M${NN}: computed answer ${JSON.stringify(w)} not found in solutions/M${NN}-homework-solutions.md`);
  }
}

console.log(`solutions guard: ran ${checked} homework check script(s), verified ${verified} numeric answer(s) against their solutions`);
if (failures.length) {
  console.error(`\nFAIL - ${failures.length} solution/check issue(s):`);
  for (const f of failures) console.error("  - " + f);
  console.error("\nFix: make each solution state the value its check script computes (or correct the check).");
  process.exit(1);
}
console.log("PASS - every homework check script's computed answers appear in its solutions file.");
