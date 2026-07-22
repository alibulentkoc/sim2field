#!/usr/bin/env node
/* Executable check for MODULE-02 Section 25 homework (numeric problems 1-5).
   Recomputes every numeric answer from Section 7.1-7.4 formulas with an illustrative
   [VERIFY@PUB] parameter set. Prints one `EXPECT <string>` per answer; verify-solutions.js
   asserts each appears in solutions/M02-homework-solutions.md. */
"use strict";
const r = (x, n) => Number(x.toFixed(n));
const g = 9.81;

// P1: mass from ellipsoid volume, m = rho (4/3) pi a b c
const rho = 1000;                                            // ~water [VERIFY@PUB]
const mass = ([a,b,c]) => (rho * (4/3) * Math.PI * a*b*c).toFixed(1);
const mA = mass([0.13,0.12,0.12]), mB = mass([0.15,0.12,0.12]), mC = mass([0.12,0.10,0.10]);
const p95 = (6.0 + 1.645*1.5).toFixed(1);                   // dist mean 6.0, sd 1.5 kg -> 95th

// P2: anti-bruise upper bound F_bruise = pi^3 Reff^2 pbr^3 / (6 Estar^2)
const Reff = 0.08, Estar = 0.6e6, pbr = 1.2e5;              // compliant pad [VERIFY@PUB]
const Fbruise = E => Math.PI**3 * Reff**2 * pbr**3 / (6 * E**2);
const Fbr = Math.round(Fbruise(Estar));                     // N
const FbrHalf = Math.round(Fbruise(Estar/2));               // pad half as stiff
const pct = Math.round((Fbruise(Estar/2)/Fbruise(Estar) - 1) * 100); // exact scaling: E^-2 -> +300%

// P3: anti-slip lower bound F_slip = m(g+adyn)/(2mu); F_min = ns F_slip
const m95 = 8, mu = 0.7, adyn = 3, ns = 1.5;               // [VERIFY@PUB]
const Fslip = Math.round(m95*(g+adyn)/(2*mu));             // N
const Fmin = Math.round(ns * m95*(g+adyn)/(2*mu));         // N
const feasible = Fmin <= Fbr;                              // window non-empty?

// P4: placement height from impact bruise energy, h = Ebr/(m g)
const mHeavy = 10, Ebr = 1.0;                              // J [VERIFY@PUB]
const hmm = Math.round(Ebr/(mHeavy*g) * 1000);            // mm

// P5 (grad): a stiff pad closes the window (F_bruise < F_slip)
const Estiff = 3e6;
const FbrStiff = r(Fbruise(Estiff), 1);                   // N, << F_min -> empty

const expects = [
  String(mA), String(mB), String(mC), String(p95),        // P1
  String(Fbr), String(FbrHalf), pct + "%",                // P2
  String(Fslip), String(Fmin), (feasible ? "feasible" : "empty"), // P3
  hmm + " mm",                                            // P4
  String(FbrStiff),                                        // P5
];
for (const e of expects) console.log("EXPECT " + e);
