# Module 10: Mobility, Navigation & Field Operation

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M10, **Part IV, Act (platform)**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation + Software-in-the-Loop
**Prerequisites:** M1 (spine, cycle-time budget CEC-01, Amiga interface, DOF-reduction), M3/M5 (localization, GNSS/IMU, CEC-03), M6 (on-robot compute CEC-04), M8 (the workspace and the track-width reach bound, EI-08), M9 (the payload the base carries during a grasp). Math: dynamics, statics, controls basics.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 9**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **builds the fore/aft (x) degree of freedom that EI-08 offloaded to the vehicle** and **closes the reach/stability track-width tradeoff M8 handed forward (SR-I-11)**. P0-document authority tagged **[->Doc B/C/D/G/H/I]**; perishable/field values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-10** and the module's **Engineering Design Review**.

> *Core concept in use.* This module owns the **DRIVE / STAGE / ALIGN** front of the mission FSM on the **Signal-to-Action Spine (CEC-01)**. It supplies the motion the arm does not (**EI-08**), sets the drive speed that the cycle-time budget bounds (**CEC-01**: $v\le d/T_\text{cycle}$), and keeps the bed centered so the fruit falls inside the arm's fixed workspace (**CEC-03 / M8**).

---

## 1. Module Overview

**Mission.** This module builds the mobile platform and its navigation, the subsystem that carries the whole machine down the row, presents each fruit to the station (the offloaded x-degree-of-freedom, now made real), stays upright under a heavy swinging payload, and does all of it across a real field rather than a flat test plot.

**Previous milestone.** Two modules ago, the manipulator was made simple by a promise: the fruit would be driven to a fixed pick station, so the arm need not reach fore/aft. This module keeps that promise.

**Engineering problem.** The engineering here is where the machine meets the world's mess. The drive is not free to go any speed: it is governed by the pick cycle (CEC-01), outrun the arm and fruit are missed. The platform is not free to be any width: it must straddle wide enough for the arm to reach the bed (M8's reach bound) yet narrow enough to maneuver the field, and stable enough not to tip on a slope while the arm swings 5 to 10 kg to the side. Navigation is not free to be approximate: if the rover drifts off the bed, the fruit falls outside the arm's fixed workspace and cannot be grasped no matter how good perception was.

**Design tension.** This module closes the track-width tradeoff Module 8 flagged, resolving reach, maneuverability, and stability into a feasible interval, and it makes the lateral navigation accuracy a budgeted requirement tied to the workspace.

**What this module resolves.** Its Engineering Insight is the one every field-robotics engineer learns and every demo obscures: the field is the spec. A machine judged on a flat, clean, well-lit test row proves nothing about the sloped, dusty, occluded row that will actually break it. Design and validate against the hard corners of the operating envelope, not its comfortable middle, because in the field, the hard corner always arrives.


## 2. Learning Objectives

- **LO-M10.1** Explain the drive-over mobile platform and how it supplies the fore/aft (x) motion offloaded from the arm (EI-08), staging fruit to the pick station., *Bloom: Understand (with Apply)*
- **LO-M10.2** Relate drive speed to the cycle-time budget ($v\le d/T_\text{cycle}$, CEC-01) and choose a motion strategy (continuous-stage vs. index vs. stop-and-pick)., *Bloom: Apply (with Evaluate)*
- **LO-M10.3** Analyze static and dynamic stability (tip-over on slope with payload and arm swing) and derive a stability margin., *Bloom: Analyze*
- **LO-M10.4** Close the track-width tradeoff: intersect the reach lower bound (M8), maneuverability upper bound, and stability constraint into a feasible interval., *Bloom: Evaluate (with Create)*
- **LO-M10.5** Design navigation (GNSS/RTK + IMU + vision row-following) and budget lateral accuracy so fruit stays in the arm's workspace (CEC-03/M8)., *Bloom: Create*
- **LO-M10.6** Define the field operating envelope and design/validate to its edges, not its average (EI-10)., *Bloom: Evaluate*
- **LO-M10.7** Specify the twin's rover-motion, stability, and navigation models for verification., *Bloom: Create*

Maps to course objectives **LO5** (primary), **LO3/LO7** (reinforcing), and ABET **SO1, SO2, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Explain how the vehicle supplies the arm's missing DOF and stages fruit to the station., *Bloom: Understand*
2. Set drive speed from the cycle-time budget and pick a motion strategy., *Bloom: Apply*
3. Compute a tip-over/stability margin under payload, arm swing, and slope., *Bloom: Analyze*
4. Resolve track width against reach, maneuverability, and stability., *Bloom: Evaluate*
5. Budget navigation lateral error against the workspace half-width., *Bloom: Create*
6. Define an operating envelope and argue a design/validation plan for its edges., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1's failure taxonomy named two classes this module owns: *mobility/integration failures* (the drive or navigation fails, the machine can't keep pace or loses the bed) and *environmental failures* (the field defeats the machine physically, slope, mud, dust, terrain). Both are where field robots most often die, and both are where a laboratory prototype and a deployable product diverge.

The motivation begins with a debt. Module 8 bought a simple, precise arm by offloading the fore/aft motion to the vehicle, but that motion is only "free" if the vehicle actually delivers it: it must stage each fruit to the station accurately enough for the fixed workspace, at a speed the pick cycle allows, without stopping (or the throughput collapses). Then comes stability: the same wide straddle that lets the arm reach the bed raises questions of tip-over when the machine works a slope with a 5 to 10 kg fruit swinging to one side, the base's stability is not a base-only property but a *whole-machine* one, coupling the arm's motion (M8/M9) to the platform. Then navigation: the drive-over architecture only works if the rover stays centered on the bed; a lateral drift moves every fruit toward or past the edge of the arm's fixed reach, so navigation accuracy is not a nicety but a term in whether the grasp is even possible.

And underneath all of it is the field itself. A machine designed and tuned on flat, dry, well-lit ground will meet a sloped, dusty, rutted, variably-lit row and behave nothing like the demo. The motivation for this module's discipline is that the operating envelope's *edges*, the steepest slope, the roughest terrain, the tightest headland, the worst light, are the real requirement. Design for them, and the machine works in the field; design for the average, and it works only in the video.

---

## Engineering Failure Cases (mobility-and-field-specific)

Sharpening Module 1's *mobility* and *environmental* classes:

- **Outrun the arm.** Drive speed exceeds $d/T_\text{cycle}$; fruit arrive faster than the pick cycle and are missed. *Motivates* the drive-speed/cycle-time coupling (Section 6.2, CEC-01) and motion-strategy choice.
- **Tip-over.** On a side slope with the arm swinging the payload, the CoG projection leaves the support polygon; the machine tips. *Motivates* the stability analysis (Section 6.3, Section 7.3) and the low-CoG/track-width design.
- **Lose the bed.** Navigation drifts laterally; fruit fall outside the arm's fixed workspace and become unreachable. *Motivates* the navigation lateral-error budget (Section 6.5, Section 7.4) tied to M8.
- **Field defeats the machine.** Mud, ruts, dust, or a headland turn the demo never saw stalls or mislocates the rover. *Motivates* the operating-envelope discipline (Section 6.6, EI-10).

Each is a design or validation decision away from prevention.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** statics and dynamics (CoG, support polygon, moments, for stability); basic vehicle motion and controls; the M1 cycle-time budget (CEC-01) and Amiga interface (SR-I-01); the M3/M5 localization suite (GNSS/RTK, IMU, odometry) and placement budget (CEC-03); the M8 workspace and its track-width reach bound (SR-I-11); the M9 payload the base carries during a grasp.

**Introduced here, used later:** the vocabulary of mobility and field operation, *drive-over straddle, staging, differential/skid steer, support polygon, stability margin, tip-over/critical slope, row-following, headland turn, field coverage, operating envelope, lateral navigation error*. Developed at applied (L2) depth; full mobile-robot navigation is referenced [->Doc H].

**Where this sits in the dependency graph.** M10 hard-depends on M1 (platform, cycle-time), M8 (reach bound, workspace), and M3/M5 (localization). It **masters** the mobility/navigation/field-operation thread; it **applies** CEC-01 (drive speed/staging) and CEC-03 (lateral nav accuracy -> fruit in workspace), and **resolves SR-I-11** (the track-width interval). It hands forward: the staged, aligned fruit presentation to M8/M9 (the Act stage it feeds); the platform stability and envelope to M12 (power/terrain) and M15 (safety); the drive/nav nodes to M11; and the coverage/throughput model to M16.

---

## 6. Theory

### 6.1 The drive-over mobile platform
The machine is a rover that **straddles a single planted bed** and travels down the row on the Amiga platform (M1 SR-I-01). Its drive supplies the **fore/aft (x) motion** the arm lacks (EI-08), and its width sets the straddle. Steering is typically differential/skid (independent side drives), giving in-place or tight turning for headlands. The platform is the moving frame in which the pick station, arm, and trailer all live.

### 6.2 Motion, staging, and the cycle-time coupling
As the rover advances, fruit "arrive" at the pick station at interval $T_\text{arrival}=d/v$ (M1). Three motion strategies present the fruit:

- **Stop-and-pick:** halt at each fruit, grasp, resume. Simplest, most stable during the pick, but slowest (drive time added to every cycle).
- **Index (move-stop-move):** advance by one fruit spacing, stop briefly to pick. A middle ground.
- **Continuous drive-over-and-stage:** never stop; the arm tracks/stages the fruit as the rover moves. Fastest, but demands the arm compensate for motion and stresses the cycle-time budget hardest.

The choice is governed by the cycle-time budget (**CEC-01**): continuous motion is only feasible if $T_\text{cycle}\le d/v$ for the chosen speed, which (from M1's single-arm result) is tight, so many designs index or stop-and-pick unless multiple end-effectors or generous spacing allow continuous. The drive speed is therefore set by the *pick cycle*, not by how fast the terrain allows, a direct application of CEC-01 to the platform.

### 6.3 Stability: a whole-machine property
The machine stays upright while its center of gravity (CoG) projects inside the **support polygon** (the wheel contact footprint). Two threats:

- **Static / slope:** on a side slope of angle $\theta$, gravity shifts the CoG projection downhill; tip-over impends when it reaches the downhill support edge. For track width $w$ and CoG height $h$, the critical side-slope angle is approximately $\tan\theta_\text{tip}\approx (w/2)/h$, **wider track and lower CoG raise the tip-over angle.**
- **Dynamic / arm swing:** the arm swinging a 5 to 10 kg fruit (M8/M9) laterally shifts the CoG by $\Delta = m_\text{fruit}\,r_\text{swing}/m_\text{total}$, eroding the margin transiently; combined with a slope, this is the worst case.

Crucially, base stability depends on the *arm's* motion and the *payload*, it is a **whole-machine** property. The base cannot be designed without the arm, and the safe operating envelope couples slope, arm configuration, and payload.

### 6.4 The track-width tradeoff, closed
Module 8 established a **lower** bound on track width: the straddle must be wide enough for the arm to reach across the bed (workspace covers the pick region). This module adds the other bounds:

- **Reach lower bound** (M8): $w \ge w_\text{reach}$.
- **Stability**: wider $w$ *helps* the tip-over angle (Section 6.3), so stability pushes toward the wider end, but only with a low CoG; it does not by itself cap $w$.
- **Maneuverability / field-fit upper bound**: the machine must fit the bed/row spacing, turn at headlands, and transport on roads, this **caps** $w \le w_\text{maneuver}$.

The feasible track width is the interval $[w_\text{reach},\,w_\text{maneuver}]$, with stability favoring the upper part (plus low CoG). If the interval is empty (reach needs more width than maneuverability allows), the architecture must change, a taller/longer arm stroke, an offset station, or a narrower bed target. This **closes SR-I-11** as a bounded design decision rather than a warning.

### 6.5 Navigation and the lateral accuracy budget
The drive-over architecture works only if the rover stays centered on the bed, because a lateral offset moves every fruit toward the edge of the arm's *fixed* workspace. Navigation fuses:

- **GNSS/RTK** for global row/waypoint following (M3/M5);
- **IMU + odometry** for smooth short-term motion;
- **Vision row-following**, detecting the crop row/bed edges (M4-style perception) to keep the bed centered locally, robust to GNSS drift under canopy.

The **lateral navigation error** $\sigma_\text{lat}$ (bed-centering + localization) must keep the fruit within the workspace half-width minus margin: $\sigma_\text{lat}$ budgeted so $3\sigma_\text{lat}\le W_\text{workspace}/2 - \text{margin}$, a lateral cousin of the placement budget (CEC-03), coupling navigation accuracy to the mechanism's reach (M8).

### 6.6 Field operation and the operating envelope
Real fields impose headland turns (turning at row ends into the next bed), coverage patterns (which rows in which order), obstacle handling, slopes, ruts, dust, and variable light. The disciplined way to design for this is to define an explicit **operating envelope**, the ranges of slope, terrain roughness, crop density, weather, and light within which the machine is required to work, and to design and validate at its *edges* (steepest slope with payload, roughest terrain, tightest headland, worst light). The envelope is the real specification; the average condition is not (EI-10).

---

## 7. Mathematics

Rigor tier for M10: **L2**. Central results: the drive-speed/cycle-time coupling, the tip-over stability margin, and the track-width interval and lateral budget.

### 7.1 Drive speed and coverage
$v \le d/T_\text{cycle}$ (CEC-01) for continuous no-miss operation; for index/stop-and-pick, the effective rate is $1/(T_\text{cycle}+T_\text{move})$. Field coverage time $\approx \text{area}/(\text{swath}\times v_\text{eff}) + \text{turn overhead}$. *Use:* set drive speed from the pick cycle and estimate throughput (hand to M16 economics).

### 7.2 Static and slope stability
Stability margin on level ground: horizontal distance from CoG projection to the nearest support edge. On side slope $\theta$: $\text{margin}(\theta) \approx (w/2)\cos\theta - h\sin\theta$; tip-over at $\tan\theta_\text{tip}=(w/2)/h$. *Use:* find the maximum safe side slope for given $w,h$; size $w$ (within the interval) and minimize $h$ to meet the envelope's max slope.

### 7.3 Dynamic stability with arm swing (central)
The arm swinging the payload shifts CoG laterally by $\Delta = m_\text{fruit}\,r_\text{swing}/m_\text{total}$; the worst-case margin is $\text{margin}(\theta) - \Delta$ (swing toward the downhill edge on a slope). Require $\text{margin}(\theta_\text{max}) - \Delta_\text{max} \ge \text{safety margin}$. *Use:* couples arm motion (M8/M9) to base design; may constrain the arm's swing trajectory or the max working slope. **Grad (L3):** add lateral acceleration from turning/terrain to the dynamic margin.

### 7.4 Track-width interval and lateral navigation budget
Feasible track width: $[w_\text{reach}\,(\text{M8}),\ w_\text{maneuver}]$, checked for stability (Section 7.2 to 7.3). Lateral nav budget: $3\sigma_\text{lat}\le W_\text{workspace}/2 - \text{margin}$, with $\sigma_\text{lat}=\sqrt{\sigma_\text{center}^2+\sigma_\text{loc}^2}$ (bed-centering + localization). *Use:* resolve SR-I-11 and size the navigation accuracy requirement against the workspace (M8/CEC-03).

---

## 8. Engineering Principles

1. **The vehicle is part of the manipulator**, it supplies the offloaded DOF (EI-08); its accuracy and speed are manipulation requirements.
2. **Drive speed is set by the cycle, not the terrain** (CEC-01): $v\le d/T_\text{cycle}$.
3. **Stability is a whole-machine property**, arm, payload, slope, and base interact; design them together.
4. **Wide enough to reach, narrow enough to maneuver, low enough to stay upright**, resolve track width as an interval.
5. **Navigation accuracy is a manipulation budget** (CEC-03): keep fruit in the workspace.
6. **The field is the spec** (EI-10): design and validate at the envelope's edges.
7. **Coverage, not just peak**, the machine must work the whole field, including its hard corners.

---

## 9. System Requirements

Derived from the mobility/field mission; apply CEC-01/03 and close SR-I-11. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-F-14 | Functional | The platform shall stage each fruit to the pick station (supply the x-DOF) within the presentation tolerance (M8 workspace). | Test |
| SR-P-32 | Performance | Drive speed shall be governed by the cycle-time budget ($v\le d/T_\text{cycle}$, CEC-01) for the chosen motion strategy. | Timed test |
| SR-C-09 | Constraint | The machine shall remain stable (margin > 0 with safety factor) across the envelope's max slope with payload and worst-case arm swing. | Stability analysis + test |
| SR-I-14 | Interface | Track width shall lie in the feasible interval $[w_\text{reach},w_\text{maneuver}]$ (resolves SR-I-11). | Integration analysis |
| SR-P-33 | Performance | Lateral navigation error shall satisfy $3\sigma_\text{lat}\le W_\text{workspace}/2-\text{margin}$ (fruit stays reachable, CEC-03/M8). | Field test |
| SR-P-34 | Performance | The machine shall operate across the defined field envelope (slope, terrain, light, headlands) [VERIFY@PUB]. | Field trials at envelope edges |
| SR-I-15 | Interface | A twin rover-motion/stability/navigation model shall exist for verification. | Review (->Doc G) |

Traceability: SR-F-14/SR-P-32 -> CEC-01, M8/M9; SR-C-09 -> M9 payload/M15 safety; **SR-I-14 -> resolves M8 SR-I-11**; SR-P-33 -> CEC-03/M8; SR-P-34 -> EI-10, M12/M14; SR-I-15 -> twin/M13.

---

## 10. Design Decisions

- **DD-55 Drive-over straddle on the Amiga platform** supplying the x-DOF. *Rationale:* Section 6.1, EI-08; cashes M1 DD-1. *Serves:* SR-F-14.
- **DD-56 Motion strategy chosen by cycle-time margin** (continuous if $T_\text{cycle}\le d/v$; else index/stop-and-pick). *Rationale:* Section 6.2, CEC-01. *Serves:* SR-P-32.
- **DD-57 Low CoG + track width in the feasible interval** for slope stability. *Rationale:* Section 6.3/Section 7.2, resolves SR-I-11. *Serves:* SR-C-09, SR-I-14.
- **DD-58 Fused navigation: GNSS/RTK + IMU + vision row-following.** *Rationale:* Section 6.5; global waypoints + local bed-centering robust to canopy GNSS drift. *Serves:* SR-P-33.
- **DD-59 Explicit operating envelope; design/validate to its edges.** *Rationale:* Section 6.6, EI-10. *Serves:* SR-P-34.
- **DD-60 Arm-swing/slope coupling constrains working slope or swing trajectory.** *Rationale:* Section 7.3; whole-machine stability. *Serves:* SR-C-09.
- **DD-61 On-robot navigation** (CEC-04). *Rationale:* no cloud in the loop. *Serves:* SR-P-33.

---

## 11. Trade Studies

### 11.1 TS-19: Motion strategy
**Alternatives:** (A) **continuous drive-over-and-stage**; (B) **index (move-stop-move)**; (C) **stop-and-pick**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Continuous | B: Index | C: Stop-and-pick |
|--------------------|:---:|:---:|:---:|
| Throughput vs. cycle-time budget (0.30) | 5 | 4 | 2 |
| Stability during the pick (0.22) | 2 | 4 | 5 |
| Arm/control complexity (moving-target grasp) (0.20) | 2 | 4 | 5 |
| Localization/placement ease (static vs. moving) (0.16) | 2 | 4 | 5 |
| Energy efficiency (0.12) | 4 | 3 | 3 |
| **Weighted total** | **3.14** | **3.88** | **3.86** |

**Selected: B (index, move-stop-move)** as the baseline, with **C (stop-and-pick)** as the conservative fallback and **A (continuous)** reserved for cases with generous fruit spacing or multiple end-effectors. Index captures most of the throughput while grasping a *stationary* fruit (far simpler placement, the arm and localization were all designed for a staged, not moving, target) and keeping the machine stable during the pick. Continuous is attractive for throughput but forces moving-target grasping that stresses the cycle-time budget (M1's single-arm result) and the placement budget (CEC-03). Recorded weakness: index adds drive-stop-drive time to the cycle (a CEC-01 cost), the continuous option is revisited if a multi-arm capstone variant relaxes the single-arm constraint.

### 11.2 TS-20: Navigation architecture (summary)
**Alternatives:** GNSS/RTK-only, vision row-following-only, **fused RTK + vision + IMU**. **Criteria:** global accuracy, robustness under canopy/GNSS dropout, bed-centering precision, cost. **Outcome:** **fused**, RTK gives global row structure, vision keeps the bed centered locally where canopy degrades GNSS, IMU smooths both. This is the CEC-03 lateral budget realized in navigation.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **Mobility / navigation / stability analysis.** *Verdict: no new CEC.* These are mastered *techniques* for the platform (tip-over, row-following, coverage), captured in the Knowledge-Architecture mobility thread, not the anchor set.
- **The drive-speed / cycle-time coupling and the lateral nav budget.** *Verdict: no new CEC, these are CEC-01 and CEC-03 applied* to the platform ($v\le d/T_\text{cycle}$; $3\sigma_\text{lat}\le W/2-\text{margin}$). Recognizing them as existing anchors applied is exactly the restraint the discipline requires.
- **EI-10 (The Field Is the Spec)** is added as this module's Engineering Insight. *(No new CEC this module; one EI added, within discipline.)*

> **Cross-module synthesis note (lightweight).** The track-width number nobody could set alone gets set here: M8's *reach* wanted it wide, maneuverability wants it narrow, and stability (with a low CoG) wants it wide, so the feasible interval and the final choice are a three-module negotiation (M8 reach ∩ M10 maneuverability ∩ stability), resolving the SR-I-11 the kinematics module could only flag.

> **Simulation-first hook.** Drive/staging, the tip-over margin under arm swing and slope, and the lateral nav budget are all verifiable in the **twin** (Section 12, Section 13) before field trials, including the track-width sweep that closes SR-I-11.

---

## 12. Simulation Activities

M10 runs at **Simulation + SIL**; the twin already carries the rover, so this module turns it into a mobility/stability/navigation instrument.

**SA-1, Drive and staging.** Run the DRIVE/STAGE cycle in the twin; verify each fruit is presented to the pick station within the presentation tolerance (SR-F-14) at a speed satisfying $v\le d/T_\text{cycle}$ (CEC-01). *Outcome:* the offloaded x-DOF verified in motion.

**SA-2, Tip-over margin.** Sweep side-slope angle and arm-swing configuration in the twin; measure the stability margin (Section 7.2 to 7.3) and find the max safe slope with payload (SR-C-09). *Outcome:* the whole-machine stability envelope.

**SA-3, Track-width sweep (closes SR-I-11).** Vary track width; overlay M8's reach coverage, the stability margin, and a maneuverability/field-fit limit; identify the feasible interval and a design point (Section 7.4). *Outcome:* the track-width tradeoff resolved in sim.

**SA-4, Lateral nav budget.** Inject bed-centering and localization error; confirm fruit stays within the workspace half-width at $3\sigma_\text{lat}$ (Section 7.4, CEC-03); observe fruit lost when the budget is exceeded. *Outcome:* navigation accuracy tied to reach.

---

## 13. Digital Twin Activities

**DTA-1, Mobility/stability/nav model spec (deliverable to Doc G).** Specify the twin's rover-motion, CoG/stability, and navigation models (including slope and arm-swing coupling). *Outcome:* SR-I-15; the mobility verification model.

**DTA-2, Envelope test matrix (EI-10).** Specify a twin test matrix that spans the *edges* of the operating envelope (max slope, roughest terrain, tightest headland, worst light for row-following), not just nominal conditions. *Outcome:* an envelope-edge verification plan (feeds M14).

**DTA-3, Track-width/stability co-design package.** Package the SA-3 result (feasible interval + chosen width + stability margin) for the M13 integration record and back to M8. *Outcome:* SR-I-11/SR-I-14 closed with data.

---

## 14. Hardware Activities

*(Tiered: field/bench protocols at specification level.)*

**HA-1, Stability verification protocol.** Specify a tilt-table / slope test measuring the tip-over margin with payload and arm swing (SR-C-09). *Deliverable:* a measured stability envelope.

**HA-2, Navigation accuracy protocol.** Specify a field protocol measuring lateral bed-centering error under RTK+vision fusion across the envelope (SR-P-33). *Deliverable:* a lateral-error dataset for CEC-03/M8.

---

## 15. Software Activities

**SWA-1, Navigation & drive-control nodes.** Specify the navigation stack (RTK/IMU/vision fusion, row-following, headland turning, coverage) and the drive controller, edge-resident (CEC-04). *Outcome:* the DRIVE/STAGE/ALIGN realization (M11 masters the node graph).

**SWA-2, Stability guard.** Specify a runtime guard that limits working slope / constrains arm swing when the stability margin is threatened (feeds the safety monitor, M11/M15). *Outcome:* stability as an enforced runtime property.

---

## 16. ROS 2 Integration

Mobility becomes a **navigation node** (fusing RTK/IMU/vision for row-following and coverage) and a **drive-control node**, realizing the DRIVE/STAGE/ALIGN front of the mission FSM (M7 behavior layer). The navigation runs on-robot (CEC-04) and shares the compute budget with perception (M6). A **stability guard** (SWA-2) publishes to the safety monitor (M11/M15). Drive-speed commands are coupled to the behavior layer's cycle timing (CEC-01). M11 masters the real-time node graph; M10 fixes the navigation/drive contracts and the stability guard.

---

## 17. AI Integration

- **Vision row-following.** Crop-row/bed-edge detection (M4-style perception) keeps the bed centered where GNSS drifts under canopy, a learned perception component on the navigation side, bounded like all learned components (a deterministic RTK/odometry fallback if vision fails, per the EI-07 pattern).
- **Coverage/route planning** can use optimization/learning, but stays bounded by field constraints and the operating envelope.
- **On-robot (CEC-04).** Navigation perception and control run on the edge; no cloud in the loop.

No new learned subsystem is mastered here; navigation reuses the perception and bounding patterns already established.

---

## 18. Edge Computing Integration

Navigation adds compute (row-following perception, fusion, path planning) that shares the edge budget with the harvest perception stack (M6). Two constraints fixed here: (1) navigation perception competes with detection/localization for the device, the compute budget (M6) must accommodate both, or they must be scheduled so neither starves (M11); (2) drive/navigation control is a real-time loop with bounded latency (M6/M11), though it is far less demanding than the grasp or perception loops. On-robot only (CEC-04); the field's lack of connectivity is *why* the platform navigates autonomously.

---

## 19. Fluid Power Integration

Mobility is largely outside the fluid-power thread, the drive is the platform's own (electric, per the Amiga [VERIFY@PUB]), but two couplings matter: (1) the platform **carries and stabilizes the fluid grasp subsystem (M9)** during motion, so the payload and the swinging arm (with its fluid gripper) are part of the stability analysis (Section 6.3); (2) if the design later uses fluid power for any drive/steering assist or leveling (e.g., active suspension to hold the platform level on slopes, improving stability), that would enter the fluid-power budget (Doc F) and the stored-energy safety case (M15), noted as an option, not a baseline. The baseline keeps fluid power at the gripper (M9) and the drive electric (EI-08's "complexity where it's cheapest").

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M10-1, Drive-Speed / Cycle-Time Coupler.** Sliders for fruit spacing, cycle time, and motion strategy; shows max drive speed ($v\le d/T_\text{cycle}$), throughput, and whether continuous is feasible (CEC-01). *Goal:* Section 6.2.
- **W-M10-2, Tip-Over / Stability Explorer.** Sliders for track width, CoG height, slope, and arm-swing payload shift; live stability margin and max safe slope (Section 7.2 to 7.3). *Goal:* whole-machine stability.
- **W-M10-3, Track-Width Interval Resolver.** Overlays reach coverage (M8), maneuverability limit, and stability margin vs. track width; highlights the feasible interval and design point (Section 7.4, SR-I-11). *Goal:* close the tradeoff visually.
- **W-M10-4, Lateral-Nav Budget vs. Workspace.** Slider for nav error showing fruit moving toward/past the workspace edge as $\sigma_\text{lat}$ grows (Section 7.4, CEC-03). *Goal:* nav accuracy as a manipulation budget.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M10-1** Drive-over straddle geometry: track width, wheelbase, CoG, support polygon, bed underneath (annotated).
- **CAD-M10-2** Tip-over on a side slope with the arm swinging the payload (CoG projection vs. support edge).
- **CAD-M10-3** Row-following / bed-centering: the rover keeping the bed within the arm's workspace.
Format per ->Doc J (SVG platform/geometry diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M10-1 | Drive-over platform and staging to the pick station | Section 6.1/Section 6.2 |
| F-M10-2 | Motion strategies (continuous / index / stop-and-pick) vs. cycle time | Section 6.2 (CEC-01) |
| F-M10-3 | Support polygon & CoG on a slope (tip-over) | Section 6.3/Section 7.2 |
| F-M10-4 | Arm-swing CoG shift eroding the stability margin | Section 7.3 |
| F-M10-5 | **Track-width interval: reach ∩ maneuverability ∩ stability** | Section 7.4 (central, SR-I-11) |
| F-M10-6 | Lateral nav budget vs. workspace half-width | Section 7.4 (CEC-03) |
| F-M10-7 | Operating envelope (slope/terrain/light) with design-at-edges | Section 6.6 (EI-10) |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M10-1** The rover driving and staging fruit to the station at a speed set by the cycle-time budget; speeding up until fruit are missed.
- **AN-M10-2** The machine on an increasing side slope with the arm swinging the payload; the CoG projection creeping to the support edge and the guard limiting the slope/swing.
- **AN-M10-3** Track width widening/narrowing: reach coverage improving, maneuverability worsening, stability changing, the feasible interval emerging.

---

## 24. Laboratory

**Lab M10, Mobility, Stability, and Closing the Track-Width Tradeoff**

- **Objectives.** (1) Set drive speed from the cycle-time budget and choose a motion strategy; (2) compute the tip-over stability margin under payload, arm swing, and slope; (3) close the track-width interval (reach ∩ maneuverability ∩ stability); (4) budget lateral navigation error against the workspace; (5) verify across the operating-envelope edges in the twin.
- **Equipment.** The digital twin (rover motion, stability, navigation); the M8 workspace/reach bound and M9 payload; field-envelope parameters [VERIFY@PUB]; notebook. **Safety:** computer-based (real platform tests follow slope/tilt safety).
- **Procedure.**
  1. For a given fruit spacing and cycle time, compute the max drive speed and choose a motion strategy (Section 6.2, TS-19); estimate throughput.
  2. Compute the stability margin vs. side slope for the platform geometry; add the arm-swing CoG shift; find the max safe working slope (Section 7.2 to 7.3, SR-C-09).
  3. Overlay reach (M8), maneuverability limit, and stability vs. track width; identify the feasible interval and pick a design width (Section 7.4, closes SR-I-11).
  4. Budget lateral navigation error so fruit stays in the workspace at $3\sigma_\text{lat}$ (Section 7.4, CEC-03).
  5. In the twin, verify drive/staging, stability, and nav at the *edges* of the operating envelope (max slope, worst light, tight headland), not just nominal (EI-10, DTA-2).
- **Data collection.** Drive-speed/throughput; stability-vs-slope curve with arm-swing; track-width overlay and chosen width; lateral budget; envelope-edge results.
- **Analysis.** Which motion strategy fits the cycle-time budget? What is the max safe slope, and does it meet the envelope? Is the track-width interval non-empty? What lateral accuracy does navigation need?
- **Discussion.** Why is stability a whole-machine property? Why is the field envelope's edge the real spec (EI-10)? How does drive speed couple to CEC-01 and nav accuracy to CEC-03?
- **Deliverables.** A 4 to 6 page report: drive/strategy, stability analysis, track-width resolution, lateral budget, envelope-edge verification.
- **Rubric (100 pts).** Drive-speed/strategy (16); stability analysis with arm swing (22); track-width interval resolution (22, SR-I-11); lateral nav budget (18, CEC-03); envelope-edge verification (12, EI-10); communication (10). *Graduate band adds:* dynamic stability with turning/terrain acceleration (Section 7.3 grad) and a cited source.
- **Expected results.** A motion strategy (often index) that fits the cycle-time budget; a max safe slope that constrains the envelope and may limit arm swing on slopes; a non-empty but possibly tight track-width interval; a lateral nav accuracy requirement of a few centimetres; and envelope-edge cases that reveal failures the nominal case hid (EI-10).

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Drive speed & throughput.** Given fruit spacing and cycle time, compute the max continuous drive speed and the effective rate for index and stop-and-pick; recommend a strategy.
2. **Slope stability.** Given track width and CoG height, compute the tip-over side-slope angle and the stability margin at a stated slope; state the effect of lowering the CoG.
3. **Arm-swing stability.** Add the arm-swing CoG shift to problem 2; find the max safe working slope with payload; propose one mitigation.
4. **Track-width interval.** Given the M8 reach lower bound and a maneuverability upper bound, state the feasible interval; check stability at both ends; pick a width and justify.
5. **(Grad) Lateral budget.** Given workspace half-width and margin, derive the required $\sigma_\text{lat}$; split it between bed-centering and localization and specify each subsystem's target.
6. **(Grad) Envelope design.** Define an operating envelope for a stated field; identify the binding edge case for stability, navigation, and throughput respectively, and how you would validate each.

---

## 26. Quiz

1. **(MC)** The rover supplies which motion the arm lacks? (a) grip; (b) fore/aft (x); (c) lift; (d) rotation. **[b]**
2. **(MC)** Drive speed for no-miss continuous operation is bounded by: (a) battery; (b) $d/T_\text{cycle}$ (CEC-01); (c) slope only; (d) track width. **[b]**
3. **(MC)** A wider track and lower CoG make the machine: (a) less stable; (b) more stable (higher tip-over slope); (c) faster; (d) unchanged. **[b]**
4. **(MC)** If the rover drifts laterally off the bed, the fruit: (a) becomes easier to grasp; (b) moves toward/out of the arm's fixed workspace; (c) ripens faster; (d) is unaffected. **[b]**
5. **(Short)** State EI-10 and one SIM2FIELD example. **[The field is the spec: design/validate at the envelope's edges, e.g., the max safe slope with a swinging payload, not flat ground.]**
6. **(Calc)** Track width $w=1.6$ m, CoG height $h=0.8$ m. Compute the tip-over side-slope angle. **[$\tan\theta=(w/2)/h=0.8/0.8=1 \Rightarrow \theta=45°$.]**
7. **(Calc)** Fruit spacing $d=1.2$ m, cycle time $T_\text{cycle}=6$ s. Max continuous drive speed? **[$v\le d/T_\text{cycle}=0.20$ m/s.]**
8. **(Design)** Why does the track-width choice require M8 and M10 together? **[M8 sets the reach lower bound; M10 sets the maneuverability upper bound and stability; the feasible width is their intersection, SR-I-11.]**
9. **(Critical thinking)** Why is base stability a whole-machine property? **[The arm's swing and the payload shift the CoG; stability depends on arm configuration, payload, and slope together, not the base alone.]**
10. **(Critical thinking)** Why choose index over continuous motion despite lower throughput? **[Index grasps a stationary fruit, far simpler placement (CEC-03) and more stable, while continuous forces moving-target grasping that stresses the cycle-time and placement budgets.]**

---

## 27. Challenge Problems

- **CP-M10-A, The reach/stability/maneuverability/throughput co-design.** Jointly choose track width, CoG, drive speed, and motion strategy to satisfy reach (M8), stability across the envelope (this module), and the cycle-time budget (CEC-01). Identify the binding constraint and whether the feasible set is non-empty for a stated field. (Bridges CEC-01, CEC-03, EI-08, M8.)
- **CP-M10-B, Slope-limited operation policy.** Design a runtime policy that trades working slope against arm-swing amplitude to hold a stability margin; specify what the machine does when the envelope edge is reached (slow, re-orient, skip, refuse). (Feeds M15.)
- **CP-M10-C, Envelope validation plan.** For a real field, define the operating envelope and a validation plan that exercises its edges (steepest slope, roughest terrain, worst light, tightest headland); specify pass/fail criteria and what field data closes each (EI-10, feeds M14).

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your stability analysis uses a nominal CoG and rigid ground. How do a shifting payload, soft/uneven ground, and dynamic terrain loading violate that, and does your safety margin cover the realistic worst case or only the static one?
2. **Tradeoffs.** You chose index motion over continuous for placement simplicity, paying throughput. Defend that to a reviewer focused on harvest rate and cost (M16). Under what conditions (spacing, multi-arm, cycle-time margin) would you switch to continuous?
3. **Risk.** The machine works a side slope with the arm swinging a 5 to 10 kg fruit. What is the true worst-case stability margin, and what runtime guard prevents a tip-over if an operator sends it onto a steeper slope than designed? Does the guard cost coverage?
4. **Verification.** You validated in the twin and on a test row. A reviewer notes both were gentler than the target field. How do you make the envelope validation representative of the *worst* field you must serve, not the demo plot (EI-10)?
5. **Subsystem interaction.** Navigation accuracy determines whether fruit lands in the arm's fixed workspace (M8), drive speed is bounded by the pick cycle (CEC-01), and arm swing couples to stability. Who owns these three cross-couplings, and what happens if tightening one (e.g., faster drive) breaks another (missed fruit or reduced stability)?
6. **Envelope.** Is your operating envelope defined explicitly, and does the machine *know* its edges at runtime? What does it do when it detects it is outside the envelope (too steep, too rough, GNSS lost under canopy), degrade safely or push on?

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (platform, drive/cycle coupling, stability, track-width, nav budget) are the core (~2.5 h); the track-width resolution (Section 7.4, closing SR-I-11) and EI-10 are the peaks. Trade studies (Section 11) and twin activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M10 is a separate 2 to 3 h session.
- **Common misconceptions.** (1) "The base is separate from the arm", stability is a whole-machine property. (2) "Faster drive = more harvest", drive speed is capped by the cycle (CEC-01). (3) Designing for flat ground, EI-10 forces the slope/terrain edges. (4) Treating nav as separate from grasping, lateral accuracy is a manipulation budget (CEC-03).
- **On EI-10.** Teach it as the prototype-vs-product divide: the demo row proves nothing about the row that breaks the machine. Tie it forward to M12 (environmental), M14 (V&V), M15 (safety), M16 (deployment/coverage).
- **On closing SR-I-11.** Make explicit that M8 could only *flag* the track-width tradeoff; this module *resolves* it because stability and maneuverability live here, a nice example of a cross-module dependency closing.
- **Where to push graduate students.** Dynamic stability with turning (HW5-adjacent), the four-way co-design (CP-M10-A), and the envelope validation plan (CP-M10-C).
- **Thread to keep visible.** Close by naming hand-offs: staged/aligned fruit -> M8/M9; stability/envelope -> M12/M15; drive/nav nodes -> M11; coverage/throughput -> M16.

---

## 29. Research Frontiers

- **Landmark grounding.** Mobile-robot navigation and motion-planning references; vehicle stability / tip-over analysis references; the agricultural-navigation literature (RTK-GNSS guidance, vision-based crop-row following). *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Robust vision-based crop-row following under canopy and variable light; RTK-GNSS/visual-inertial fusion for under-canopy field robots; terrain-aware and active-stability control for slope operation; whole-body stability accounting for manipulator motion on mobile bases; energy- and coverage-optimal field path planning.
- **Open problems.** Reliable navigation under GNSS-denied canopy; guaranteed stability for mobile manipulators on slopes with dynamic payloads; robust operation across the full weather/terrain envelope; coverage planning that maximizes harvested value, not just area.
- **Suggested thesis directions.** (1) Under-canopy row-following with certified lateral accuracy tied to a manipulator workspace budget. (2) Whole-body stability control coupling arm-swing trajectories to slope for a drive-over harvester. (3) Envelope-aware operation that detects and safely degrades at the edges of its terrain/weather envelope.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Mobile-robot navigation / motion-planning references, drive control, path planning, coverage (Section 6.1 to 6.6).
- Vehicle-stability / tip-over references, support polygon, slope stability, dynamic margin (Section 6.3, Section 7.2 to 7.3).
- Agricultural-navigation literature (RTK guidance, vision crop-row following), bed-centering and field operation (Section 6.5).
- Mobile-manipulator / whole-body stability references, arm-swing/base coupling (Section 7.3).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 9**, and (forthcoming) Doc B, Doc C, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters mobility, navigation, and field operation, and it does the two structural jobs the curriculum assigned it: it **builds the fore/aft DOF that EI-08 offloaded** (making "the vehicle is part of the manipulator" concrete) and it **closes the track-width tradeoff M8 could only flag (SR-I-11)** by resolving reach, maneuverability, and stability into a feasible interval. It treats stability correctly as a **whole-machine property** (arm swing + payload + slope), and it makes **navigation accuracy a manipulation budget** (lateral error vs. workspace, CEC-03) rather than a separate concern. Its Engineering Insight, **EI-10 (The Field Is the Spec)**, is genuinely distinct, the prototype-vs-product discipline of designing to the envelope's edges, and it seeds M12/M14/M15/M16. The explicit CEC evaluation correctly mints no new CEC (mobility is technique; the drive-speed and lateral budgets are CEC-01/CEC-03 applied), preserving the anchor set. All 30 sections present; the Engineering Design Review is included; one lightweight synthesis note; consistency with the frozen modules and the case machine maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Track-width bounds, CoG height, max slope, fruit spacing, and lateral-accuracy targets depend on Doc B/C and the real platform/field; the stability, coupling, and budget *methods* are exact.
2. **The track-width interval's closure depends on M8's reach bound and a maneuverability limit**, both carrying [VERIFY@PUB] geometry; the resolution *method* is exact but the final number awaits Doc B/C.
3. **Motion-strategy choice (index) is baselined but coupled to the single-arm cycle-time result (M1)**, a multi-arm capstone variant could reopen it toward continuous; flagged, not foreclosed.
4. **Envelope edges are specified for validation, not yet validated**, real field trials at the envelope's corners (EI-10) await hardware and Doc G/twin fidelity.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/C/G and by field validation.

**END OF MODULE 10, STOP. Awaiting your review before freezing Module 10 or proceeding to Module 11.**
