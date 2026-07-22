#!/usr/bin/env node
/* Executable check for MODULE-03 Section 25 homework (numeric problems 1,2,3,5,6).
   Recomputes answers from Section 7.1 (FoV/GSD), 7.3 (depth error, baseline sizing),
   7.5 (RSS budget) with an illustrative [VERIFY@PUB] parameter set. Prints EXPECT lines;
   verify-solutions.js asserts each appears in solutions/M03-homework-solutions.md. */
"use strict";

// P1: FoV = 2 atan(s/2f); W = Z s/f; GSD = W/N
const s = 6, f_mm = 8, N = 1920;                     // mm, mm, px [VERIFY@PUB]
const Z1 = 0.5, Z2 = 1.5, fruit = 250;               // m, m, mm
const FoV = Math.round(2 * Math.atan(s / (2 * f_mm)) * 180 / Math.PI);   // deg
const gsd = Z => (Z * s / f_mm * 1000 / N);          // mm/px
const GSD1 = gsd(Z1).toFixed(2), GSD2 = gsd(Z2).toFixed(2);

// P2: b_min = Z^2 dd / (f dZreq); dZ = Z^2 dd / (f b)
const f_px = 2500, dd = 0.25, Zpick = 0.5, dZreq = 0.002;   // px, px, m, m [VERIFY@PUB]
const bmin = Zpick*Zpick*dd/(f_px*dZreq);            // m
const bmin_mm = (bmin*1000).toFixed(1);              // 12.5 mm
const dZpick = Zpick*Zpick*dd/(f_px*bmin);           // m (= dZreq)
const dZ2x = Math.round(2*Zpick*2*Zpick*dd/(f_px*bmin) * 1000); // mm at twice range

// P3: RSS sensing budget, solve for mechanism term
const c = 30, sZ = Math.round(dZpick*1000), scal = 3, she = 4, ssync = 2;  // mm
const smech = Math.sqrt((c/3)**2 - (sZ*sZ + scal*scal + she*she + ssync*ssync)).toFixed(1); // sqrt(67)=8.2

// P5 (grad): range beyond which depth noise dominates the other sensing terms
const sOther = Math.sqrt(scal*scal + she*she + ssync*ssync);  // mm
const kmm = dd/(f_px*bmin)*1000;                     // sZ(Z) = k Z^2 (mm, Z in m)
const Zcrit = Math.sqrt(sOther/kmm).toFixed(2);      // m

// P6 (grad): fluid-pressure sensor range from a Module-2 window (F = P A)
const A = 0.002, Fmax = 159;                          // m^2 (20 cm^2), N (M2 upper bound)
const Pmax = (Fmax/A/1000).toFixed(1);               // kPa

const expects = [
  `${FoV} deg`, GSD1, GSD2,                           // P1
  bmin_mm, `${dZ2x} mm`,                              // P2
  smech,                                              // P3
  Zcrit,                                              // P5
  `${Pmax} kPa`,                                      // P6
];
for (const e of expects) console.log("EXPECT " + e);
