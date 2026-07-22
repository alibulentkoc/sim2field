#!/usr/bin/env node
/* Executable check for MODULE-13 Section 25 homework (numeric problems 2,3,5).
   Recomputes the composed system placement 3-sigma and cycle time with a shared-resource
   effect, tested against capture tolerance and d/v (7.2); the per-rung reality gap and
   accept/retune decision (7.2); and the incremental-vs-big-bang interaction counts (7.3)
   from an illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines; verify-solutions.js
   asserts each appears in solutions/M13-homework-solutions.md. */
"use strict";

// P2: system placement budget (RSS over all real contributors), tested 3-sigma <= c
const sig = { perc: 3, cal: 3, sync: 2, est: 2, mech: 5, nav: 3 };    // mm, 1-sigma [VERIFY@PUB]
const sPlace = Math.sqrt(Object.values(sig).reduce((a, s) => a + s * s, 0));  // sqrt(60)
const threeSig = 3 * sPlace;                                          // mm
const capTol = 30;                                                    // mm (CEC-02)
const placeOK = threeSig <= capTol;

// cycle time: sum of stage times + emergent shared-resource serialization, tested <= d/v
const stages = [1.4, 0.4, 1.1, 1.0, 1.3, 0.6];                        // s [VERIFY@PUB]
const naive = stages.reduce((a, b) => a + b, 0);                     // 5.8 s
const shared = 0.6;                                                   // pump contention (emergent)
const Tcycle = naive + shared;                                       // 6.4 s
const d = 0.5, v = 0.08, budget = d / v;                             // 6.25 s (CEC-01)
const overrun = Tcycle - budget;                                     // emergent overrun

// P3: per-rung reality gap g = |twin - real|, accept if g <= tol
const kin = { twin: 0.640, real: 0.652, tol: 0.015 };                // m, kinematic rung [VERIFY@PUB]
const gKin = Math.abs(kin.twin - kin.real) * 1000;                  // mm
const kinDecision = gKin <= kin.tol * 1000 ? "accept" : "retune";
const con = { twin: 159, real: 178, tol: 15 };                       // N, contact rung [VERIFY@PUB]
const gCon = Math.abs(con.twin - con.real);                         // N
const conDecision = gCon <= con.tol ? "accept" : "retune";

// P5: interaction counts, big-bang O(n^2) vs incremental O(n)
const n = 6;                                                          // subsystems [VERIFY@PUB]
const bigbang = n * (n - 1) / 2;                                     // 15 pairwise
const incremental = n - 1;                                          // 5 interface steps

const expects = [
  `${sPlace.toFixed(1)} mm`, `${threeSig.toFixed(1)} mm`,             // P2 placement
  `${Tcycle.toFixed(1)} s`, `${budget.toFixed(2)} s`, `${overrun.toFixed(2)} s`,  // P2 timing
  `${gKin.toFixed(0)} mm`, kinDecision, `${gCon} N`, conDecision,     // P3
  `${bigbang} pairwise`, `${incremental} interface`,                 // P5
];
if (!placeOK) throw new Error("placement should pass in illustrative set");
for (const e of expects) console.log("EXPECT " + e);
