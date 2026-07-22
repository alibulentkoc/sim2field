#!/usr/bin/env node
/* Executable check for MODULE-14 Section 25 homework (numeric problems 2 and 3).
   Recomputes the zero-failure demonstration sample size n >= ln(alpha)/ln(R) and what a
   demo (n=1) proves (7.1); and the series-system MTBF, its dominant failure mode, and the
   MTBF gain from halving the dominant vs a minor mode (7.3) from an illustrative [VERIFY@PUB]
   parameter set. Prints EXPECT lines; verify-solutions.js asserts each appears in
   solutions/M14-homework-solutions.md. */
"use strict";

// P2: sample size to demonstrate reliability R at confidence 1-alpha with zero failures
const R = 0.99, alpha = 0.05;                                         // [VERIFY@PUB]
const n = Math.ceil(Math.log(alpha) / Math.log(R));                  // 299 trials
const demoR = Math.pow(alpha, 1 / 1) * 100;                         // n=1 proves R >= 5%

// P3: series-system failure rate (per 1000 h), MTBF, dominant mode, targeted improvement
const modes = [
  { n: "perception", lam: 0.5 },
  { n: "hydraulic",  lam: 1.2 },
  { n: "drive",      lam: 0.8 },
  { n: "compute",    lam: 0.3 },
  { n: "sensors",    lam: 0.2 },
];                                                                     // failures / 1000 h [VERIFY@PUB]
const sum = ms => ms.reduce((a, m) => a + m.lam, 0);
const lamSys = sum(modes);                                            // 3.0
const MTBF = 1000 / lamSys;                                          // h
const dom = modes.reduce((a, m) => a.lam >= m.lam ? a : m);         // hydraulic
const minor = modes.find(m => m.n === "sensors");

const halve = target => sum(modes.map(m => m.n === target ? { ...m, lam: m.lam / 2 } : m));
const MTBFdom = 1000 / halve(dom.n);                                // fix dominant
const MTBFmin = 1000 / halve(minor.n);                              // fix minor
const gainDom = (MTBFdom / MTBF - 1) * 100;                         // %
const gainMin = (MTBFmin / MTBF - 1) * 100;                         // %

const expects = [
  `${n} trials`, `${demoR.toFixed(0)}%`,                              // P2
  `${MTBF.toFixed(0)} h`, dom.n,                                      // P3
  `${MTBFdom.toFixed(0)} h`, `${MTBFmin.toFixed(0)} h`,
  `${gainDom.toFixed(0)}%`, `${gainMin.toFixed(1)}%`,
];
for (const e of expects) console.log("EXPECT " + e);
