#!/usr/bin/env node
/* Executable check for MODULE-01 Section 25 homework (numeric problems 2, 3, 5).
   Recomputes every numeric answer from the module's Section 7 inputs and prints one
   `EXPECT <string>` line per answer. verify-solutions.js runs this and asserts each
   printed string appears verbatim in solutions/M01-homework-solutions.md, tying the
   authored answer to an independent computation. [VERIFY@PUB] inputs use the module's
   illustrative Section 7 values. */
"use strict";
const r = (x, n) => Number(x.toFixed(n));

// Section 7.1 cycle-time allocation (seconds)
const terms = { detect:0.3, plan:0.2, align:1.0, grasp:1.0, lift:0.8, transfer:1.5, place:0.8, return:1.0 };
const Tcycle = Object.values(terms).reduce((a,b)=>a+b, 0);   // 6.6
const d = 1.2, vwalk = 0.4;                                  // [VERIFY@PUB], Section 7.1

// Problem 2: single-arm max speed, and end-effectors to sustain walking pace
const vmax = r(d / Tcycle, 2);                               // 0.18 m/s
const N = Math.ceil(Tcycle / (d / vwalk));                  // ceil(6.6/3.0) = 3

// Problem 3: RSS error budget, solve for the mechanism term
const c = 30, cap = c / 3;                                  // 10 mm
const s_loc = 6, s_he = 3, s_dyn = 4;                       // given three of four
const s_mech = r(Math.sqrt(cap*cap - (s_loc*s_loc + s_he*s_he + s_dyn*s_dyn)), 1); // sqrt(39)=6.2

// Problem 5 (grad): margin at v=0.15 m/s, sensitivity, dominant term
const v5 = 0.15, Tarr = r(d / v5, 1);                       // 8.0 s
const margin = r(Tarr - Tcycle, 1);                         // 1.4 s
const sens = r(-d / (Tcycle*Tcycle), 3);                    // -0.028 (m/s)/s
const dominant = Object.entries(terms).sort((a,b)=>b[1]-a[1])[0][1]; // 1.5 s (t_transfer)

// self-consistency (guards against a broken formula silently matching a wrong solution)
if (Math.abs(Tcycle - 6.6) > 1e-9) throw new Error("Tcycle allocation changed");
if (N < 1) throw new Error("N invalid");

const expects = [ String(vmax), `N = ${N}`, String(s_mech), String(margin), String(sens), String(dominant) ];
for (const e of expects) console.log("EXPECT " + e);
