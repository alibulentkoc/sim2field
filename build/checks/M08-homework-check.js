#!/usr/bin/env node
/* Executable check for MODULE-08 Section 25 homework (numeric problems 1,2,3,4,6).
   Two-actuator parallel mechanism: anchors B_i = (+/-w/2, 0), actuator lengths
   L_i = ||G - B_i|| (7.1); reachable span vs track width (7.2); manipulability
   mu = |sin gamma| with gamma the angle between actuator unit vectors (7.3/7.4);
   sigma_mech decomposition into stiffness/repeatability specs (7.5); reach/stability
   feasible interval (7.2 co-design). Illustrative [VERIFY@PUB] parameters. Prints EXPECT
   lines; verify-solutions.js asserts each appears in solutions/M08-homework-solutions.md. */
"use strict";
const hypot = (a, b) => Math.sqrt(a * a + b * b);
const deg = r => Math.round(r * 180 / Math.PI);

// P1: inverse kinematics for a target, plus the assembly branch
const w = 0.6, G = { y: 0.1, z: 0.5 };                                 // m [VERIFY@PUB]
const B1 = { y: -w / 2, z: 0 }, B2 = { y: w / 2, z: 0 };
const L1 = hypot(G.y - B1.y, G.z - B1.z);                             // 0.640 m
const L2 = hypot(G.y - B2.y, G.z - B2.z);                             // 0.539 m
const branch = G.z > 0 ? "upper" : "lower";                          // arm above track

// P2: min track width to span the bed; in the w<=a regime the reachable span equals w
const Lmax = 0.7, z0 = 0.4, Wbed = 0.5, marginReq = 0.05;            // m [VERIFY@PUB]
const a = Math.sqrt(Lmax * Lmax - z0 * z0);                          // outer reach at height z0
const minW = Wbed + marginReq;                                       // span == w -> 0.55 m
const feasibleReach = minW <= a;                                     // 0.55 <= 0.574
const coverMargin = (minW - Wbed).toFixed(2);                        // 0.05 m

// P3: manipulability at two configs via angle between actuator unit vectors
function mu(Gy, Gz) {
  const l1 = hypot(Gy - B1.y, Gz - B1.z), l2 = hypot(Gy - B2.y, Gz - B2.z);
  const u1 = [(Gy - B1.y) / l1, (Gz - B1.z) / l1];
  const u2 = [(Gy - B2.y) / l2, (Gz - B2.z) / l2];
  const c = u1[0] * u2[0] + u1[1] * u2[1];
  const g = Math.acos(c);
  return { mu: Math.sin(g), gamma: deg(g) };
}
const cA = mu(0.1, 0.5), cB = mu(0.0, 2.0);                          // A well-conditioned, B near-parallel

// P4: sigma_mech = sqrt(rep^2 + bl^2 + defl^2) <= allocation; solve stiffness
const alloc = 6, sRep = 2, sBl = 1.5, Fload = 90;                    // mm, mm, mm, N [VERIFY@PUB]
const sDefl = Math.sqrt(alloc * alloc - sRep * sRep - sBl * sBl);    // 5.45 mm
const keff = (Fload / (sDefl / 1000) / 1000);                        // kN/m
const terms = { deflection: sDefl, repeatability: sRep, backlash: sBl };
const dominant = Object.keys(terms).reduce((a, b) => terms[a] >= terms[b] ? a : b);

// P6: reach lower bound (P2) and stability upper bound (M10) -> feasible interval
const wMaxStability = 0.90;                                           // m, from M10 [VERIFY@PUB]
const feasibleInterval = minW <= wMaxStability;

const expects = [
  `${L1.toFixed(3)} m`, `${L2.toFixed(3)} m`, branch,                 // P1
  `${minW.toFixed(2)} m`, `${coverMargin} m`,                        // P2
  cA.mu.toFixed(2), `${cA.gamma} deg`, cB.mu.toFixed(2), `${cB.gamma} deg`,  // P3
  `${sDefl.toFixed(2)} mm`, `${keff.toFixed(1)} kN/m`, dominant,      // P4
  `${wMaxStability.toFixed(2)} m`,                                    // P6
];
if (!feasibleReach || !feasibleInterval) throw new Error("infeasible illustrative set");
for (const e of expects) console.log("EXPECT " + e);
