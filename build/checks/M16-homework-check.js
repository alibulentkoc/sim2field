#!/usr/bin/env node
/* Executable check for MODULE-16 Section 25 homework (numeric problems 1,2,3,5,6).
   Recomputes TCO/season and the dominant cost driver (7.1/7.3), cost-per-acre and net
   value/acre with bruise+recall loss (7.1/7.2), the break-even acreage vs manual (7.4), the
   learning-curve unit cost (7.3 grad), and the utilization-driven cost/acre for own vs
   service (7.4 grad) from an illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines;
   verify-solutions.js asserts each appears in solutions/M16-homework-solutions.md. */
"use strict";
const money = n => "$" + Math.round(n).toLocaleString("en-US");
const money2 = n => "$" + n.toFixed(2);

// P1: TCO/season from BOM (build) amortized over life + operating cost
const bom = [
  { n: "manipulator", c: 12000 },
  { n: "chassis",     c: 10000 },
  { n: "compute",     c: 8000 },
  { n: "battery",     c: 6000 },
  { n: "frame",       c: 4000 },
];                                                                     // USD [VERIFY@PUB]
const build = bom.reduce((a, x) => a + x.c, 0);                       // 40,000
const life = 5, opCost = 1500 + 3000 + 4000;                         // seasons; energy+maint+supervision
const TCO = build / life + opCost;                                   // 16,500 /season
const dom = bom.reduce((a, x) => a.c >= x.c ? a : x);               // manipulator
const cheap = bom.find(x => x.n === "frame");
const saveDom = dom.c * 0.25 / life;                                // /season from 25% off dominant
const saveCheap = cheap.c * 0.25 / life;                            // /season from 25% off cheap part

// P2: cost-per-acre and net value/acre
const hours = 60 * 8, rate = 0.5, uptime = 0.85;                    // season h, acres/h, - [VERIFY@PUB]
const acres = hours * rate * uptime;                                // 204 acres/season
const costAcre = Math.round(TCO / acres);                          // $/acre
const yieldLb = 40000, price = 0.15, loss = 0.05 + 0.03;           // lb/acre, $/lb, bruise+recall
const revAcre = yieldLb * price * (1 - loss);                      // $/acre
const netAcre = revAcre - costAcre;
const manualAcre = 600;                                             // manual harvest $/acre [VERIFY@PUB]

// P3: break-even acres where machine TCO == manual cost
const breakeven = TCO / manualAcre;                                // acres

// P5: learning curve C(n) = C1 * n^(-b), b = -log2(LR)
const LR = 0.90, b = -Math.log2(LR);
const unitAt = n => build * Math.pow(n, -b);
const C100 = unitAt(100);                                          // cumulative-100 unit cost
const manip100 = dom.c * Math.pow(100, -b);                       // dominant driver at n=100

// P6: utilization-driven cost/acre, own (low use) vs service (high use)
const ownAcres = 20, svcAcres = 200;                              // [VERIFY@PUB]
const ownCostAcre = TCO / ownAcres;                              // 825
const svcCostAcre = TCO / svcAcres;                             // 82.5

const expects = [
  money(TCO), dom.n, money(saveDom), money(saveCheap),               // P1
  `${acres.toFixed(0)} acres`, money(costAcre), money(revAcre), money(netAcre), money(manualAcre),  // P2
  `${breakeven.toFixed(1)} acres`,                                   // P3
  money(C100), money(manip100),                                     // P5
  money(ownCostAcre), money2(svcCostAcre),                          // P6
];
for (const e of expects) console.log("EXPECT " + e);
