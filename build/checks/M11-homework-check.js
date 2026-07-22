#!/usr/bin/env node
/* Executable check for MODULE-11 Section 25 homework (numeric problems 2,4,5).
   Recomputes worst-case grasp-force loop latency L_wc = sum(C_i+S_i+D_i) and its dominant
   node (7.1), the safety-monitor reaction budget L_detect+L_react <= T_harm (7.4), and a
   response-time schedulability test with blocking for the control plane (7.3) from an
   illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines; verify-solutions.js asserts
   each appears in solutions/M11-homework-solutions.md. */
"use strict";

// P2: worst-case loop latency across nodes (C compute, S sched/queue, D comms), ms
const nodes = [
  { n: "sensor",     C: 0.5, S: 0.2, D: 0.3 },
  { n: "estimator",  C: 1.0, S: 0.3, D: 0.3 },
  { n: "controller", C: 0.8, S: 0.2, D: 0.3 },
  { n: "driver",     C: 0.5, S: 0.2, D: 0.2 },
];                                                                     // [VERIFY@PUB]
const perNode = nodes.map(x => ({ n: x.n, t: x.C + x.S + x.D }));
const Lwc = perNode.reduce((a, b) => a + b.t, 0);                     // 4.8 ms
const deadline = 10;                                                  // ms (100 Hz grasp loop)
const marginL = deadline - Lwc;                                       // 5.2 ms
const dom = perNode.reduce((a, b) => a.t >= b.t ? a : b);            // estimator, 1.6 ms

// P4: safety-monitor reaction budget, L_detect + L_react <= T_harm
const monitorHz = 500, Lreact = 5, Tharm = 20;                       // Hz, ms, ms [VERIFY@PUB]
const Ldetect = 1000 / monitorHz;                                    // 2 ms (one monitor period)
const Lsafe = Ldetect + Lreact;                                      // 7 ms
const marginH = Tharm - Lsafe;                                       // 13 ms

// P5: rate-monotonic response-time test with blocking, R_i = C_i + B_i + sum_hp ceil(R/T_j)C_j
const tasks = [
  { n: "force", T: 10, C: 2, B: 1 },
  { n: "drive", T: 20, C: 3, B: 1 },
];                                                                     // hp order first [VERIFY@PUB]
function responseTime(i) {
  const me = tasks[i];
  let R = me.C + me.B;
  for (let k = 0; k < 50; k++) {
    let next = me.C + me.B;
    for (let j = 0; j < i; j++) next += Math.ceil(R / tasks[j].T) * tasks[j].C;
    if (next === R) break;
    R = next;
  }
  return R;
}
const R1 = responseTime(0), R2 = responseTime(1);                    // 3 ms, 6 ms

const expects = [
  `${Lwc.toFixed(1)} ms`, `${marginL.toFixed(1)} ms`, dom.n, `${dom.t.toFixed(1)} ms`,  // P2
  `${Ldetect.toFixed(0)} ms`, `${Lreact} ms`, `${Lsafe.toFixed(0)} ms`, `${Tharm} ms`,  // P4
  `${R1} ms`, `${R2} ms`,                                                                // P5
];
for (const e of expects) console.log("EXPECT " + e);
