#!/usr/bin/env node
/* Executable check for MODULE-10 Section 25 homework (numeric problems 1,2,3,4,5).
   Recomputes drive-speed/throughput (7.1), tip-over angle and side-slope margin (7.2),
   arm-swing dynamic margin and max safe slope (7.3), the track-width interval stability
   check (7.4/7.2), and the lateral navigation budget split (7.4) from an illustrative
   [VERIFY@PUB] parameter set. Prints EXPECT lines; verify-solutions.js asserts each appears
   in solutions/M10-homework-solutions.md. */
"use strict";
const degOf = r => Math.round(r * 180 / Math.PI);
const D2R = Math.PI / 180;

// P1: drive speed from the pick cycle
const d = 0.5, Tcycle = 8, Tmove = 2;                                  // m, s, s [VERIFY@PUB]
const vCont = d / Tcycle;                                             // continuous no-miss
const rateIdx = 1 / (Tcycle + Tmove);                                // fruit/s, stop-and-pick
const vIdx = d * rateIdx;                                            // effective index speed

// P2: static side-slope stability, half-track (w/2), CoG height h
const w = 0.7, h = 0.4, slope = 15;                                   // m, m, deg [VERIFY@PUB]
const tipDeg = w2 => Math.atan((w2) / h);
const thetaTip = degOf(tipDeg(w / 2));                               // tip-over angle
const margin = (w / 2) * Math.cos(slope * D2R) - h * Math.sin(slope * D2R);
const hLow = 0.3, thetaTipLow = degOf(Math.atan((w / 2) / hLow));    // lower CoG -> larger angle

// P3: arm-swing CoG shift and max safe working slope with a safety margin
const mFruit = 9, rSwing = 0.5, mTotal = 150, safety = 0.05;         // kg, m, kg, m [VERIFY@PUB]
const Delta = mFruit * rSwing / mTotal;                             // lateral CoG shift
// solve (w/2)cos t - h sin t = safety + Delta  ->  R cos(t+phi) = rhs
const R = Math.hypot(w / 2, h), phi = Math.atan2(h, w / 2);
const rhs = safety + Delta;
const thetaSafe = degOf(Math.acos(rhs / R) - phi);                  // max safe slope

// P4: track-width interval [reach(M8), maneuver], stability at both ends
const wLo = 0.55, wHi = 0.90, wPick = 0.75;                          // m [VERIFY@PUB]
const tipLo = degOf(Math.atan((wLo / 2) / h)), tipHi = degOf(Math.atan((wHi / 2) / h));

// P5: lateral nav budget 3 sigma_lat <= W_ws/2 - margin, equal split center/localization
const Wws = 0.55, navMargin = 0.05;                                  // m [VERIFY@PUB]
const sigLat = (Wws / 2 - navMargin) / 3 * 1000;                    // mm
const sigEach = sigLat / Math.SQRT2;                               // mm, equal split

const expects = [
  `${vCont.toFixed(3)} m/s`, `${rateIdx.toFixed(2)} fruit/s`, `${vIdx.toFixed(3)} m/s`,  // P1
  `${thetaTip} deg`, `${margin.toFixed(3)} m`, `${thetaTipLow} deg`,                     // P2
  `${Delta.toFixed(3)} m`, `${thetaSafe} deg`,                                           // P3
  `${tipLo} deg`, `${tipHi} deg`, `${wPick.toFixed(2)} m`,                               // P4
  `${sigLat.toFixed(0)} mm`, `${sigEach.toFixed(0)} mm`,                                 // P5
];
for (const e of expects) console.log("EXPECT " + e);
