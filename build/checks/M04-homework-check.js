#!/usr/bin/env node
/* Executable check for MODULE-04 Section 25 homework (numeric problems 1, 2, 6).
   Recomputes detection metrics (Section 7.2) and the mission operating point (Section 7.4)
   from an illustrative [VERIFY@PUB] prediction table and PR curve. Prints EXPECT lines;
   verify-solutions.js asserts each appears in solutions/M04-homework-solutions.md. */
"use strict";
const f2 = x => x.toFixed(2), f3 = x => x.toFixed(3);

// P1: metrics at two IoU thresholds (10 predictions, 8 ground-truth fruit)
const ious = [0.85, 0.72, 0.68, 0.55, 0.52, 0.48, 0.40, 0.30, 0.20, 0.10];  // [VERIFY@PUB]
const GT = 8, Npred = ious.length;
function metrics(thr) {
  const TP = ious.filter(v => v >= thr).length, FP = Npred - TP, FN = GT - TP;
  const P = TP/(TP+FP), R = TP/(TP+FN), F1 = 2*P*R/(P+R);
  return { TP, FP, FN, P, R, F1 };
}
const m5 = metrics(0.5), m7 = metrics(0.7);

// P2: mission value U(tau) propto ratio*R - FPrate; tau* = argmax
const tau = [0.3, 0.5, 0.7, 0.9], Rc = [0.95, 0.85, 0.65, 0.40], FPr = [0.40, 0.20, 0.08, 0.02];
function opt(ratio) {
  const U = tau.map((t,i) => ratio*Rc[i] - FPr[i]);
  let b = 0; for (let i = 1; i < U.length; i++) if (U[i] > U[b]) b = i;
  return { tauStar: tau[b], Rstar: Rc[b], Umax: U[b] };
}
const o5 = opt(5);   // ratio v_H/c_F = 5  -> high-recall operating point
const o1 = opt(1);   // P6: low ratio shifts tau* up

const expects = [
  // P1 @0.5 and @0.7
  `TP=${m5.TP}`, `FP=${m5.FP}`, `FN=${m5.FN}`, f2(m5.P), f3(m5.R), f2(m5.F1),
  f2(m7.P), f2(m7.R), f2(m7.F1),
  // P2
  `tau* = ${o5.tauStar}`, f2(o5.Rstar), f2(o5.Umax),
  // P6 (ratio 1 optimum sits at a higher tau)
  `tau* = ${o1.tauStar}`, f2(o1.Umax),
];
for (const e of expects) console.log("EXPECT " + e);
