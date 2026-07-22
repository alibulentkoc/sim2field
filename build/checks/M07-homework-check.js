#!/usr/bin/env node
/* Executable check for MODULE-07 Section 25 homework (numeric problems 1 and 3).
   Recomputes the value-based pick sequence V_i = w_r r_i (1-u_i)/c_i with admit/defer
   gating (7.1) and the safe-set action projection a_exec = clamp(a_pi, window) (7.4) from
   an illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines; verify-solutions.js
   asserts each appears in solutions/M07-homework-solutions.md. */
"use strict";
const f2 = x => x.toFixed(2);

// P1: gate candidates, then sequence admitted by descending V
const wr = 1, rMin = 0.6, uMax = 0.4;                                  // [VERIFY@PUB]
const cand = [
  { n: "A", r: 0.90, u: 0.20, c: 1.0 },
  { n: "B", r: 0.75, u: 0.10, c: 1.2 },
  { n: "C", r: 0.55, u: 0.30, c: 1.0 },   // deferred: ripeness below floor
  { n: "D", r: 0.85, u: 0.50, c: 0.8 },   // deferred: uncertainty above gate
  { n: "E", r: 0.80, u: 0.35, c: 1.5 },
];
const admitted = cand.filter(x => x.r >= rMin && x.u <= uMax)
  .map(x => ({ ...x, V: wr * x.r * (1 - x.u) / x.c }))
  .sort((a, b) => b.V - a.V);
const deferred = cand.filter(x => !(x.r >= rMin && x.u <= uMax)).map(x => x.n);
const order = admitted.map(x => x.n).join(", ");

// P3: project a proposed action onto the Grip-Force Window [Flo, Fhi] (from M2)
const Flo = 110, Fhi = 159;                                            // N [VERIFY@PUB]
const clamp = a => Math.min(Fhi, Math.max(Flo, a));
const over = clamp(185), under = clamp(95), inside = clamp(130);       // 159, 110, 130

const expects = [
  f2(admitted[0].V), f2(admitted[1].V), f2(admitted[2].V),             // P1 values: 0.72, 0.56, 0.35
  order,                                                               // "A, B, E"
  `defer ${deferred[0]} and ${deferred[1]}`,                           // "defer C and D"
  `${over} N`, `${under} N`, `${inside} N`,                            // P3: 159 N, 110 N, 130 N
];
for (const e of expects) console.log("EXPECT " + e);
