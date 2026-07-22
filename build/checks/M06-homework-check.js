#!/usr/bin/env node
/* Executable check for MODULE-06 Section 25 homework (numeric problems 1,2,3,4,6).
   Recomputes the latency budget (7.1), Amdahl speedup (7.3), the roofline ridge/attainable
   rate (7.3), the quantization operating point (7.4), and per-harvest energy (7.5) from an
   illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines; verify-solutions.js asserts
   each appears in solutions/M06-homework-solutions.md. */
"use strict";
const f2 = x => x.toFixed(2);

// P1: latency budget T_compute = sum(stages) <= cycle-time compute share
const stages = { detect: 12, localize: 6, decide: 2, control: 3 };   // ms [VERIFY@PUB]
const Tbudget = 25;                                                    // ms compute-share (CEC-01)
const Tcompute = Object.values(stages).reduce((a, b) => a + b, 0);    // 23
const margin = Tbudget - Tcompute;                                    // 2
const dominant = Object.keys(stages).reduce((a, b) => stages[a] >= stages[b] ? a : b);
const domMs = stages[dominant];

// P2: Amdahl S = 1 / ((1-f) + f/s)
const f = 0.30;
const amdahl = s => 1 / ((1 - f) + (s === Infinity ? 0 : f / s));
const S4 = f2(amdahl(4)), Sinf = f2(amdahl(Infinity));

// P3: roofline ridge = peak/BW; kernel is memory-bound if AI < ridge
const peak = 2000, BW = 100, AI = 8;                                  // GFLOP/s, GB/s, FLOP/byte [VERIFY@PUB]
const ridge = peak / BW;                                              // 20 FLOP/byte
const bound = AI < ridge ? "memory-bound" : "compute-bound";
const attainable = Math.min(peak, AI * BW);                          // 800 GFLOP/s

// P4: pick lowest-latency op point meeting latency<=budget AND recall>=floor
const ops = [
  { name: "FP32", ms: 45, recall: 0.92 },
  { name: "INT8", ms: 18, recall: 0.90 },
  { name: "pruned", ms: 12, recall: 0.86 },
];
const latMax = 20, recallFloor = 0.88;                                // [VERIFY@PUB]
const feasible = ops.filter(o => o.ms <= latMax && o.recall >= recallFloor)
                    .sort((a, b) => a.ms - b.ms);
const chosen = feasible[0];

// P6: per-harvest compute energy E = P*T over a run of N inferences
const P = 15, Tlat = 0.018, Ninf = 2000;                              // W, s, inferences [VERIFY@PUB]
const Einf = P * Tlat;                                                // 0.27 J
const Erun = Math.round(Einf * Ninf);                                // 540 J
const Wh = (Erun / 3600).toFixed(2);                                 // 0.15 Wh

const expects = [
  `${Tcompute} ms`, `${margin} ms`, dominant, `${domMs} ms`,          // P1
  S4, Sinf,                                                           // P2
  `${ridge} FLOP/byte`, bound, `${attainable} GFLOP/s`,               // P3
  chosen.name, `${chosen.ms} ms`, f2(chosen.recall),                 // P4
  `${Einf.toFixed(2)} J`, `${Erun} J`, `${Wh} Wh`,                    // P6
];
for (const e of expects) console.log("EXPECT " + e);
