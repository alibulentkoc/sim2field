#!/usr/bin/env node
/* Executable check for MODULE-15 Section 25 homework (numeric problems 1 and 5).
   Recomputes the risk-ranked hazard register R = severity x likelihood and its dominant
   risk (7.1), and the beta-factor common-cause residual for a two-layer defense showing
   common-cause dominance (7.3) from an illustrative [VERIFY@PUB] parameter set. Prints
   EXPECT lines; verify-solutions.js asserts each appears in solutions/M15-homework-solutions.md. */
"use strict";

// P1: risk = severity x likelihood (likelihood per 1000 h, from the M14 FMEA)
const hazards = [
  { n: "over-force",    S: 4,  L: 1.2 },
  { n: "tip-over",      S: 9,  L: 0.3 },
  { n: "stored-energy", S: 10, L: 0.5 },   // combined hydraulic+electrical stored-energy fault
  { n: "collision",     S: 8,  L: 0.4 },
  { n: "pinch",         S: 6,  L: 0.6 },
];                                                                     // [VERIFY@PUB]
const risk = hazards.map(h => ({ n: h.n, R: h.S * h.L }));
const byName = n => risk.find(r => r.n === n).R;
const dom = risk.reduce((a, r) => a.R >= r.R ? a : r);              // stored-energy, 5.0

// P5: two-layer defense with beta-factor common-cause
const p = 0.01, beta = 0.1;                                          // per-layer fail prob, CC fraction [VERIFY@PUB]
const indepResidual = p * p;                                        // both fail if truly independent
const ccTerm = beta * p;                                            // common-cause floor
const totalResidual = Math.pow((1 - beta) * p, 2) + ccTerm;        // beta-model residual
const ccRatio = Math.round(ccTerm / indepResidual);                // how much CC dominates

const expects = [
  dom.n, `${dom.R.toFixed(1)}`, `${byName("over-force").toFixed(1)}`,
  `${byName("tip-over").toFixed(1)}`, `${byName("collision").toFixed(1)}`,
  `${byName("pinch").toFixed(1)}`,                                    // P1
  indepResidual.toFixed(4), ccTerm.toFixed(3), totalResidual.toFixed(5), `${ccRatio}x`,  // P5
];
for (const e of expects) console.log("EXPECT " + e);
