#!/usr/bin/env node
/* Executable check for MODULE-12 Section 25 homework (numeric problems 1,2,3,4,5).
   Recomputes the average/coincident-peak power budget and dominant term (7.1), battery
   sizing with derating and endurance (7.2), the dominant-load endurance sensitivity (7.3),
   steady-state thermal balance and throttle check (7.4), and the sustainable duty cycle
   from a thermal-limit average (7.4 grad) from an illustrative [VERIFY@PUB] parameter set.
   Prints EXPECT lines; verify-solutions.js asserts each appears in the solutions file. */
"use strict";

// P1: power budget, average P_i*d_i and coincident peak
const loads = [
  { n: "drive",    P: 300, d: 0.6 },
  { n: "arm",      P: 250, d: 0.5 },
  { n: "compute",  P: 60,  d: 1.0 },
  { n: "sensors",  P: 25,  d: 1.0 },
  { n: "aux",      P: 40,  d: 0.7 },
];                                                                     // W, - [VERIFY@PUB]
const avgOf = l => l.P * l.d;
const Pavg = loads.reduce((a, l) => a + avgOf(l), 0);                 // 418 W
const Ppeak = loads.reduce((a, l) => a + l.P, 0);                     // 675 W coincident
const dom = loads.reduce((a, l) => avgOf(a) >= avgOf(l) ? a : l);    // drive
const domAvg = avgOf(dom);                                           // 180 W

// P2: battery sizing with derating, endurance
const tShift = 6, DoD = 0.8, fTemp = 0.9, fSag = 0.95, margin = 0.2;  // h, - [VERIFY@PUB]
const Eshift = Pavg * tShift;                                         // Wh
const Einstall = Eshift / (DoD * fTemp * fSag) * (1 + margin);        // 4400 Wh
const Eusable = Einstall * DoD * fTemp * fSag;                        // Wh
const endurance = Eusable / Pavg;                                    // h

// P3: 10% efficiency gain on dominant vs a minor load -> endurance change
const eff = 0.10;
const saveDom = domAvg * eff;                                         // 18 W
const minor = loads.find(l => l.n === "aux"), saveMin = avgOf(minor) * eff;  // 2.8 W
const gainDom = (Pavg / (Pavg - saveDom) - 1) * 100;                 // %
const gainMin = (Pavg / (Pavg - saveMin) - 1) * 100;                 // %

// P4: steady-state thermal balance, throttle check
const Qgen = 60, Rclean = 0.5, Tamb = 40, Qsolar = 20, Tlimit = 85;  // W, C/W, C [VERIFY@PUB]
const Tclean = Tamb + (Qgen + Qsolar) * Rclean;                      // 80 deg C
const Rdust = 0.6, Tdust = Tamb + (Qgen + Qsolar) * Rdust;           // 88 deg C -> throttles
const Rreq = (Tlimit - Tamb) / (Qgen + Qsolar);                     // required C/W

// P5: sustainable duty cycle so thermal-limited average is not exceeded
const Qpeak = 120, Qbase = 40;                                       // W [VERIFY@PUB]
const Qallow = (Tlimit - Tamb) / Rclean;                            // 90 W
const duty = (Qallow - Qbase) / (Qpeak - Qbase);                    // 0.625

const expects = [
  `${Pavg} W`, `${Ppeak} W`, dom.n, `${domAvg} W`,                    // P1
  `${Einstall.toFixed(0)} Wh`, `${endurance.toFixed(1)} h`,          // P2
  `${saveDom.toFixed(0)} W`, `${saveMin.toFixed(1)} W`,
  `${gainDom.toFixed(1)}%`, `${gainMin.toFixed(1)}%`,                 // P3
  `${Tclean.toFixed(0)} deg C`, `${Tdust.toFixed(0)} deg C`, `${Rreq.toFixed(2)} C/W`,  // P4
  `${Qallow.toFixed(0)} W`, duty.toFixed(3),                          // P5
];
for (const e of expects) console.log("EXPECT " + e);
