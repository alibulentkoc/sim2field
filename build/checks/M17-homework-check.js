#!/usr/bin/env node
/* Executable check for MODULE-17 Section 25 capstone (composed system model, exercises 1-2).
   Recomputes, from each originating module's formula, the six course budgets and shows they
   hold together (7.1): placement 3-sigma<=c (M3/M8/M13, CEC-03), grip-force window
   F_slip<=F<=F_bruise (M2, CEC-02), cycle time T<=d/v (M10/M13, CEC-01), thermal
   T_comp<=T_limit (M12), reliability MTBF (M14), cost-per-acre and net value (M16). Then the
   compliance<->stiffness system-vs-local optimum (7.2, EI-17). Illustrative [VERIFY@PUB]
   parameters consistent with those modules. Prints EXPECT lines; verify-solutions.js asserts
   each appears in solutions/M17-homework-solutions.md. */
"use strict";
const money = n => "$" + Math.round(n).toLocaleString("en-US");
const g = 9.81;

// Placement budget (CEC-03): RSS of all real contributors, 3-sigma vs capture tolerance
const sig = [3, 3, 2, 2, 5, 3];                                       // mm 1-sigma [VERIFY@PUB]
const threeSig = 3 * Math.sqrt(sig.reduce((a, s) => a + s * s, 0));   // 23.2 mm
const cCap = 30;                                                      // mm

// Grip-force window (CEC-02): anti-slip lower bound and anti-bruise upper bound
const Fslip = 8 * (g + 3) / (2 * 0.7) * 1.5;                          // ~110 N (M2)
const Fbruise = E => Math.PI ** 3 * 0.08 ** 2 * 1.2e5 ** 3 / (6 * E * E);
const Fhi = Fbruise(0.6e6);                                          // ~159 N (compliant pad)

// Cycle-time budget (CEC-01): mitigated stages (pump pipelined, no shared-resource serialize)
const Tcycle = [1.4, 0.4, 1.1, 1.0, 1.3, 0.6].reduce((a, b) => a + b, 0);  // 5.8 s
const dv = 0.5 / 0.08;                                               // 6.25 s

// Thermal budget (M12): steady-state component temperature vs limit
const Tcomp = 40 + (60 + 20) * 0.5, Tlimit = 85;                     // 80, 85 deg C

// Reliability (M14): series-system MTBF
const MTBF = 1000 / (0.5 + 1.2 + 0.8 + 0.3 + 0.2);                   // 333 h

// Cost (M16): cost-per-acre and net value/acre
const TCO = 40000 / 5 + 8500, acres = 60 * 8 * 0.5 * 0.85;
const costAcre = Math.round(TCO / acres);                           // 81
const netAcre = 40000 * 0.15 * (1 - 0.08) - costAcre;              // 5439

// System-vs-local optimum (EI-17): stiff pad (mechanism-local) empties the grip window
const FhiStiff = Fbruise(3e6);                                      // ~6.4 N (window empty)

const holds = threeSig <= cCap && Fslip <= Fhi && Tcycle <= dv && Tcomp <= Tlimit && costAcre < 600;
if (!holds) throw new Error("composed budgets should all hold in the resolved design");

const expects = [
  `${threeSig.toFixed(1)} mm`, `${cCap} mm`,                          // placement
  `${Fslip.toFixed(0)} N`, `${Fhi.toFixed(0)} N`,                    // grip window
  `${Tcycle.toFixed(1)} s`, `${dv.toFixed(2)} s`,                    // cycle time
  `${Tcomp.toFixed(0)} deg C`, `${Tlimit} deg C`,                    // thermal
  `${MTBF.toFixed(0)} h`,                                             // reliability
  money(costAcre), money(netAcre),                                   // cost
  `${FhiStiff.toFixed(1)} N`,                                         // EI-17 local optimum
];
for (const e of expects) console.log("EXPECT " + e);
