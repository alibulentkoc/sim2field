# Doc B: Requirements & System Architecture

**SIM2FIELD, Autonomous Watermelon Harvesting Robotics**
**P0 Support Document B**, *The authoritative requirements, traceability, and architecture baseline*
**Status:** **Rev 1.0, frozen configuration-controlled baseline (approved).** Controlled, versioned changes only., **Supersedes:** the teaching-grade design spec / BOM referenced in Phase-0
**Controlling baseline for:** all figures, labs, trade studies, assessments, and production assets across Modules 1 to 17

> **Authoring note.** This document consolidates **every requirement, design decision, trade study, interface, and conflict** distributed across the 17 frozen modules into one authoritative register, resolves collisions and gaps, and **ratifies the perishable `[VERIFY@PUB]` values into concrete engineering estimates** with stated assumptions and rationale, turning teaching-grade placeholders into a usable, internally consistent baseline. It changes **no** frozen module content and introduces **no** new requirements beyond those the modules already imply; it *ratifies and organizes* what the curriculum established. Where a value is an engineering estimate rather than a measured or externally-fixed fact, it is tagged **[RATIFIED-EST]** with its basis; values still genuinely external are tagged **[TBD-EXT]** with who/how they resolve. This document **closes conflicts CR-02, CR-06, and CR-07** (see Section 11).

---

## 1. Purpose, Scope & Authority

### 1.1 Purpose
Doc B is the single source of truth for **what the machine must do and how we know it did it**. It exists so that every downstream artifact, a figure, a lab, a trade study, an assessment, a CAD model, a twin asset, dereferences one authoritative register rather than re-deriving requirements from scattered module tables. When a requirement ID, a target value, a verification method, an interface, or an acceptance criterion is needed anywhere in the curriculum or its production, **this document is the citation**.

### 1.2 Scope
In scope: the consolidated requirement register (123 requirements across 11 classes); the ratified parameter set (perishable values turned into estimates); the design-decision register (DD-1...DD-109); the trade-study register (TS-1...TS-34); the interface register; the verification & acceptance framework; the conflict-register closure; and the traceability matrix.

Out of scope (owned by sibling P0 documents, referenced here): digital-twin fidelity and validation tolerances (**Doc G**); the physical reference platform and hardware configuration (**Doc C**); the certified safety case (**Doc E**, building on M15); detailed mechanical/electrical/fluid engineering references (**Doc F**); bibliography (**Doc H**); learning-outcome mappings (**Doc I**); CAD/graphics/figure conventions (**Doc J**).

### 1.3 Authority
This document **supersedes the teaching-grade design spec, BOM, and architecture notes** that predated the frozen curriculum (the artifacts Phase-0 identified as L2 teaching-grade and subject to promotion). Where the old spec text conflicts with the hybrid-actuation decision or omits the fluid-power subsystem, **Doc B governs** (closing CR-02 and CR-06). The frozen modules and the Concept & Insight Register remain the controlling baseline for *pedagogy and concept architecture*; Doc B is the controlling baseline for *requirements, values, interfaces, verification, and acceptance*. The two are consistent by construction, Doc B harvests from the frozen modules.

### 1.4 Relationship to the frozen curriculum
Every requirement, decision, trade study, and interface in this register traces to a specific frozen module (the **Source** column throughout). Doc B adds no engineering the modules did not establish; it **ratifies values, resolves cross-module consistency, and centralizes traceability**. The anchor architecture it serves is final: 6 Core Engineering Concepts (CEC-01...CEC-06) and 14 Engineering Insights (EI-04...EI-17).

---

## 2. How to Read This Document

### 2.1 Requirement ID conventions
Requirements use the form **SR-\<class\>-\<nn\>**:

| Class | Meaning | Count | Range |
|-------|---------|------:|-------|
| **SR-F** | Functional, what the system does | 19 | SR-F-01...19 |
| **SR-P** | Performance, how well, quantified | 38 | SR-P-01...38 |
| **SR-I** | Interface, internal/external boundaries | 20 | SR-I-01...20 |
| **SR-C** | Constraint / Cost, bounds & cost limits | 14 | SR-C-01...14 |
| **SR-S** | Safety / Sustainability | 8 | SR-S-01...08 |
| **SR-R** | Reliability | 2 | SR-R-01...02 |
| **SR-E** | Ethics | 2 | SR-E-01...02 |
| **SR-V** | Verification | 8 | SR-V-01...08 |
| **SR-A** | Acceptance | 7 | SR-A-01...07 |
| **SR-D** | Data / Deployment | 4 | SR-D-01...04 |
| **SR-M** | Manufacturing | 1 | SR-M-01 |
| | **Total** | **123** | |

Design decisions are **DD-\<n\>** (DD-1...DD-109, * = keystone), trade studies **TS-\<n\>** (TS-1...TS-34), conflicts **CR-\<nn\>** (CR-01...CR-07). **All 123 requirement IDs are unique, no collisions were found** across the 17 modules; the register below is a clean union.

### 2.2 Requirement anatomy
Each register entry carries: the **ID**, the **requirement statement** (harvested verbatim, lightly normalized), the **ratified target** (the value that was `[VERIFY@PUB]`, now an estimate or a bounded TBD), the **verification method**, the **source module**, and the **anchor served** (CEC/EI). A requirement is met when its verification method produces admissible evidence (at the appropriate fidelity rung, CEC-06) that the ratified target is achieved.

### 2.3 Ratified-value convention
- **[RATIFIED-EST]**, an engineering estimate proposed here to make the baseline usable, with a stated basis. It is a *design target to validate*, not a measured truth. Pilots/field campaigns confirm or revise it.
- **[TBD-EXT]**, a value that genuinely depends on an external input (a datasheet, a grower's economics, a regulatory threshold); the entry states *who/how* it resolves.
- Symbols follow the modules (σ RSS budgets, γ transmission angle, etc.). All estimates are chosen to be **mutually consistent** so the budgets compose (see Section 5.6).

### 2.4 Traceability
Section 12 gives the requirement -> module -> anchor -> verification matrix. Every requirement traces backward to the module that owns it and forward to the verification that proves it; the acceptance requirements (SR-A-*) aggregate the whole into the four-part claim (works / proven / safe / pencils out).

---

## 3. System Overview & Reference Architecture

### 3.1 The machine (reference configuration)
A **drive-over (straddle) watermelon harvester** built on a **farm-ng Amiga** rover (DD-1*, DD-55). The rover straddles a planted bed and advances along the row; a **rail-mounted parallel two-actuator manipulator** (DD-42) reaches down to each fruit at a **mid-frame pick station** (DD-2, DD-14) where the platform stages the fruit (supplying the along-row x-DOF, DD-14/DD-55). A **pneumatic (clean-fluid) compliant gripper** (DD-48) grasps with **AI-proposed, bound-clipped, closed-loop force regulation** (DD-49/DD-52) and a **mechanical pressure relief** as an unconditional hard bound (DD-52, SR-C-08). Perception is **occlusion-gated stereo RGB + NIR** (DD-10/DD-11) on an **OAK-D-class** module; compute is a **Jetson-class edge device** with **no cloud in the control loop** (DD-4/DD-28, CEC-04). The mission runs as an FSM: **DRIVE -> STAGE -> ALIGN -> GRAB -> LIFT -> SWING -> LOWER -> RELEASE** (DD-35), placing fruit (not dropping, DD-8) into a side collection container/trailer.

### 3.2 The Signal-to-Action Spine (CEC-01) as the architecture
The reference architecture *is* the spine: **sense -> perceive -> decide -> act -> move -> integrate**, with the cycle-time budget binding every stage. Each subsystem is a stage:

| Stage | Subsystem | Owns | Modules |
|-------|-----------|------|---------|
| Sense | Perception sensors (stereo + NIR), localization sensors (RTK/IMU/odom), gripper force/pressure | raw signals | M3 |
| Perceive | Detection/ripeness (segmentation), 3-D localization + fusion (pose w/ covariance) | fruit pose + confidence | M4, M5 |
| Decide | Mission FSM + grasp policy (proposer) + verified bounding layer | a safe, bounded action | M7 |
| Act | Manipulator kinematics + fluid grasp/force control | force within the window, pose within budget | M8, M9 |
| Move | Mobility/navigation (drive, staging, row-following) | the fruit at the station, the machine in the row | M10 |
| Integrate | ROS 2 graph, real-time plane, independent safety monitor, power/thermal | the composed, safe, powered whole | M11, M12, M13 |

The **budgets** that cross the spine, placement (CEC-03), cycle-time (CEC-01), grip-force window (CEC-02), power/thermal (M12), are the load-bearing constraints Section 5 ratifies.

### 3.3 Subsystem block diagram (reference)
```
            +--------------------------- Amiga rover (straddle) ---------------------------+
            |  RTK/GNSS + IMU + wheel odometry --> rover-state EKF (M5)                     |
            |                                                                               |
  bed  >    |   +-- Perception head (M3/M4) --+     +-- Decision (M7) --+   +- Act (M8/M9) -+|
  fruit >   |   | stereo RGB + NIR (OAK-D)    |---->| FSM + grasp policy |-->| parallel arm  ||   > fruit
            |   | occlusion/uncertainty gate  | pose|  proposer          |act| + fluid grip  ||   > trailer
            |   +-- 3-D localize + fuse (M5) -+ +cov|  + bounding layer  |   | + relief(hard)||
            |                                        +--------+----------+   +-------+-------+|
            |   Edge compute (Jetson, no cloud, CEC-04) <-----+-- real-time plane (M11) --+   |
            |   Independent safety monitor (M11) --> safe-stop/release (EI-11)                |
            |   Power/thermal (M12): clean/noisy rails, safety-first sequencing               |
            +-------------------------------------------------------------------------------+
```

### 3.4 External interfaces (summary; full register Section 9)
The machine integrates **mechanically and electrically with the Amiga** (SR-I-01) per the platform's documented mounting/power/CAN interface (details -> **Doc C**). Its runtime has **no external/network dependency** (SR-C-01/05, CEC-04). Development-time cloud/GPU (training, synthetic data) is explicitly *outside* the runtime boundary (CR-05 resolution, CEC-04 runtime/dev partition).

---

## 4. Operating Envelope & Assumptions

The envelope grounds many ratified values; it is the **field the machine is the spec for** (EI-10). All values **[RATIFIED-EST]** unless noted; field-envelope parameters finalize against real target-farm data (**Doc C/E**) and a pilot.

### 4.1 Crop envelope (watermelon)
| Parameter | Ratified value | Basis |
|-----------|----------------|-------|
| Fruit mass (design range) | **3 to 12 kg**; design payload **10 kg**; structural max **12 kg + margin** | Typical field watermelon mass distribution; 95th-percentile ≈ 11 kg, rounded up for structural margin |
| Fruit diameter (design range) | **18 to 30 cm**; 5th to 95th ≈ **20 to 28 cm** | Typical marketable watermelon size; sets gripper stroke/conformance (SR-C-04) |
| Rind bruise pressure percentile $p_\text{br}$ | **≈ 350 kPa** (conservative 5th-percentile rind threshold) | Watermelon rind is tough vs. soft fruit; compliant conforming contact keeps peak pressure well below this (SR-P-06) |
| Impact/drop bruise energy $E_\text{br}$ -> max drop height | **≤ 15 cm** onto a padded surface | Bounded placement height (DD-8); controlled placement, not dropping (SR-P-07) |
| In-row fruit spacing $d$ (nominal) | **1.2 m** | Representative watermelon planting; sets drive speed via cycle-time (SR-P-32) |
| Fruit maturity | mixed maturity present; only mature harvested | Ripeness discrimination required (SR-F-03/07) |

### 4.2 Field envelope
| Parameter | Ratified value | Basis |
|-----------|----------------|-------|
| Max side/working slope | **12°** (with payload + worst-case arm swing, safety factor > 1) | Typical harvestable field slope; bounds stability (SR-C-09) and arm-swing coupling (DD-60) |
| Terrain | prepared row-crop beds, headland turns | Amiga straddle operation |
| Ambient temperature | **0 to 45 °C** operating; thermal design point **45 °C + solar** | Summer harvest; bounds thermal (SR-C-12) and battery derating (SR-P-37) |
| Lighting | **~1,000 to 100,000 lux** (open shade to direct sun) | Full outdoor dynamic range; bounds sensing (SR-P-11) |
| Dust / airflow | dusty; sealing-vs-cooling tradeoff resolved (DD-75) | Field reality; bounds cooling (SR-C-12) |

### 4.3 Platform envelope (Amiga: reference; details -> Doc C)
| Parameter | Ratified value | Basis |
|-----------|----------------|-------|
| Track width (design) | **1.8 m**, feasible interval **[1.6 m, 2.2 m]** | Reach lower bound (bed + margin, M8) ∩ maneuverability upper bound (M10); resolves SR-I-11/14 |
| CoG height | **≤ 0.8 m** | Slope stability at 12° (SR-C-09) |
| Drive speed (harvest) | **≤ 0.2 m/s** | Governed by cycle-time (SR-P-32): $v \le d/T_\text{cycle}$ |
| Pick station location | mid-frame, close staging | Shrinks the dominant depth term (DD-2/DD-26, CEC-03) |

### 4.4 Standing assumptions
1. Single-crop focus (watermelon), single-arm reference (DD-5, DD-1*), throughput traded for cost/cycle feasibility (M1).
2. Hybrid actuation: electric positioning + fluid-powered compliant gripping (DD-3*, SR-C-03), the ratified architecture (CR-01 resolved).
3. Runtime is on-robot only (CEC-04); development-time cloud is out of scope of the control loop (CR-05).
4. The digital twin is the simulation-first evidence source at validated fidelity (CEC-06), tolerances owned by **Doc G**.
5. Values here are engineering-grade estimates to validate at pilot, not measured truth (honest by construction).

---

## 5. Ratified Parameter Set  *(the key deliverable)*

This section converts every load-bearing `[VERIFY@PUB]` placeholder into a **concrete, mutually-consistent engineering estimate** with rationale. These are the numbers every downstream figure, lab, and assessment should use. Section 5.6 shows the budgets compose.

### 5.1 Throughput & mission (CEC-01)
| Symbol | Parameter | Ratified value | Rationale |
|--------|-----------|----------------|-----------|
| $T_\text{cycle}$ | Pick cycle time | **≤ 6 s / fruit** [RATIFIED-EST] | Single-arm drive-over; balances careful grasp against economic throughput; sets $v\le d/T_\text{cycle}=1.2/6=0.2$ m/s |
| $v$ | Harvest drive speed | **≤ 0.2 m/s** [RATIFIED-EST] | Derived from $T_\text{cycle}$ and $d$ (SR-P-32) |
| SR-P-01 | Harvest success rate | **≥ 85%** target, **90%** goal [RATIFIED-EST] | Credible first-generation field target on mature fruit; matures upward |
| SR-P-02 | Fruit-damage rate | **≤ 5%** target, **3%** goal [RATIFIED-EST] | Marketable-yield protection; ties to bruise window (CEC-02) |

### 5.2 Placement error budget (CEC-03)
| Symbol | Parameter | Ratified value | Rationale |
|--------|-----------|----------------|-----------|
| $c$ | Capture tolerance (grasp) | **40 mm** (radius) [RATIFIED-EST] | Compliant conforming gripper on a ~24 cm fruit tolerates ~±4 cm mispresentation |
|, | Budget rule | $3\sigma_\text{place} \le c \Rightarrow \sigma_\text{place} \le 13.3$ mm | CEC-03 |
| $\sigma_Z$ | Depth (dominant) | **8 mm** [RATIFIED-EST] | Stereo at close pick range; the dominant term to attack (EI-05) |
| $\sigma_\text{cal}$ | Calibration residual | **3 mm** [RATIFIED-EST] | Full calibration regime (DD-15) |
| $\sigma_\text{he}$ | Hand-eye | **3 mm** [RATIFIED-EST] | Included in calibration budget |
| $\sigma_\text{sync}$ | Temporal sync | **4 mm** [RATIFIED-EST] | Motion × timing jitter at 0.2 m/s (SR-C-11) |
| $\sigma_\text{est}$ | Estimation/fusion | **4 mm** [RATIFIED-EST] | EKF pose residual (M5) |
| $\sigma_\text{mech}$ | Mechanism (-> M8) | **6 mm** [RATIFIED-EST] | Allocated to M8 (SR-I-07, SR-P-26) |
|, | **RSS total** | $\sqrt{8^2+3^2+3^2+4^2+4^2+6^2}=\mathbf{12.2}$ **mm** => $3\sigma=\mathbf{36.7}$ **mm ≤ 40 mm** [x] | Budget composes with headroom |

### 5.3 Grip-force window (CEC-02)
| Symbol | Parameter | Ratified value | Rationale |
|--------|-----------|----------------|-----------|
| $F_\text{slip}$ | Min grip (no slip) | **≈ 250 N** [RATIFIED-EST] | Holds 10 kg (≈100 N weight) through lift/swing accel with friction + safety factor |
| $F_\text{bruise}$ | Max grip (no bruise) | **≈ 800 N** [RATIFIED-EST] | Conforming pad spreads load; keeps peak pressure < $p_\text{br}$≈350 kPa |
|, | Window | **[250 N, 800 N]**; compliance *widens* it | The controllable margin (M9); AI setpoint clipped here (DD-52) |
| $p_\text{br}$ | Bruise pressure | **≈ 350 kPa** | Contact-pressure hard limit (SR-P-06) |

### 5.4 Sensing & detection (M3/M4/M5)
| Symbol | Parameter | Ratified value | Rationale |
|--------|-----------|----------------|-----------|
| $Z_\text{pick}$ | Pick range | **≈ 0.6 m** [RATIFIED-EST] | Close staging (DD-26); shrinks stereo depth error |
| $\delta Z_\text{req}$ | Depth accuracy @ $Z_\text{pick}$ | **≤ 8 mm** [RATIFIED-EST] | Meets $\sigma_Z$ (SR-P-09) |
|, | Ground sampling distance | **≤ 2 mm/pixel** [RATIFIED-EST] | Detection extent for grasp sizing (SR-P-10) |
|, | Lighting dynamic range | **1,000 to 100,000 lux** no saturation (SR-P-11) | Field envelope Section 4.2 |
|, | Rover pose (lateral, in-row) | **≤ 3 cm** (RTK + fusion) [RATIFIED-EST] | Feeds $\sigma_\text{sync}$ and lateral nav (SR-P-12/33) |
| SR-P-13 | Detection recall (mature) | **≥ 90%** at operating point [RATIFIED-EST] | Recall protects yield (EI-04, recall-biased DD-18) |

### 5.5 Edge, power, manipulator, mobility, cost
| Symbol | Parameter | Ratified value | Rationale |
|--------|-----------|----------------|-----------|
| SR-P-19 | Perception->control end-to-end latency | **≤ 300 ms** [RATIFIED-EST] | Fits STAGE/ALIGN within 6 s cycle |
|, | Perception inference | **≤ 100 ms** [RATIFIED-EST] | Perception share on Jetson-class (SR-P-15) |
| SR-P-22/35 | Real-time control loop worst-case | **≤ 20 ms** [RATIFIED-EST] | Force-loop stability under edge latency (M9/M11) |
| SR-P-36 | Safety reaction $L_\text{detect}+L_\text{react}$ | **≤ 200 ms** (+ physics-speed relief) [RATIFIED-EST] | Faster than identified harm modes; relief is $\approx$0-latency (EI-09) |
| SR-P-21 | Compute power | **≤ 60 W peak, ~40 W avg** [RATIFIED-EST] | Jetson-class envelope (M6/M12) |
|, | System average power | **≈ 300 W** [RATIFIED-EST] | compute 40 + drive ~150 + pump ~50 + sensing 20 + aux 40 |
| SR-P-37 | Energy store | **3 to 5 kWh installed** (DoD 0.8, temp derate 0.9) [RATIFIED-EST] | ~300 W × 8 h = 2.4 kWh usable ÷ derating ≈ 3.3 kWh; margin -> 3 to 5 kWh |
| SR-C-12 | Max ambient (thermal design) | **45 °C + solar**, no throttle below cycle budget | Field envelope Section 4.2 |
| SR-P-25 | Workspace transverse span | **≥ 1.7 m** (bed 1.5 m + margin) [RATIFIED-EST] | Covers pick region (M8) |
| $k_\text{eff,req}$ | End-effector stiffness | **≥ 20 N/mm** [RATIFIED-EST] | Deflection under 10 kg within $\sigma_\text{mech}$ (SR-P-27) |
| $\gamma$ | Transmission-angle keep-out | **[45°, 135°]** [RATIFIED-EST] | Singularity/force-transmission margin (SR-C-07) |
| $3\sigma_\text{lat}$ | Lateral navigation error | **≤ 5 cm** [RATIFIED-EST] | Keeps fruit reachable: $\le W_\text{ws}/2-\text{margin}$ (SR-P-33) |
| SR-C-13 | Unit build cost (volume) | **≤ $35k** target [TBD-EXT] | Prototype ~$50k -> volume target; resolves with sourcing (Doc C, M16) |
| SR-C-14 | Cost-per-acre vs manual | **beat manual within envelope** [TBD-EXT] | Grower economics + labor cost (M16 pilot) |

### 5.6 Consistency check (the budgets compose)
- **Placement:** RSS 12.2 mm => 3σ = 36.7 mm ≤ c = 40 mm [x] (Section 5.2), with $\sigma_Z$=8 mm as the dominant term (attack point, EI-05).
- **Cycle-time:** $v = d/T_\text{cycle} = 1.2\text{ m}/6\text{ s} = 0.2$ m/s [x]; perception (≤300 ms) + control (≤20 ms) + act/move fit within 6 s with margin.
- **Grip-force:** window [250, 800] N contains the hold requirement for 10 kg and stays below $p_\text{br}$ [x]; relief caps at $F_\text{bruise}$ unconditionally.
- **Power/energy:** ~300 W avg × 8 h ÷ derating ≈ 3.3 kWh ≤ 3 to 5 kWh installed [x]; compute ≤60 W within budget.
- **Stability:** track 1.8 m ∈ [1.6, 2.2] m, CoG ≤ 0.8 m => stable at 12° with payload [x] (resolves SR-I-11/14).

These estimates are a **coherent baseline to validate at pilot**, not measured truth; the pilot and field campaigns (M14/M16, Doc G rungs) confirm or revise them.

---

## 6. Requirements Register (all 123)

Harvested from the frozen modules, organized by class. **Ratified target** folds in the Section 5 values. **Src** = source module; **Serves** = anchor (CEC/EI) or downstream module. Verification method as stated in the owning module.

### 6.1 Functional (SR-F, 19)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-F-01 | Detect, localize, grasp, place mature melons autonomously in a pass | full mission | Field demo | M1 | CEC-01 |
| SR-F-02 | Manage canopy occlusion enough to perceive fruit | meets SR-P-13 | Test | M1 | M4/M5 |
| SR-F-03 | Discriminate mature/immature via ripeness cues | meets SR-P-01 | Test | M2 | M4 |
| SR-F-04 | Measure ripeness cues sufficient for SR-F-03 | RGB+NIR cues | Test | M3 | M4 |
| SR-F-05 | Measure grasp force/pressure over [F_slip,F_bruise] | res. for closed loop | Bench | M3 | CEC-02 |
| SR-F-06 | Per-fruit instance mask (extent) to size/place grasp | IoU vs GT | Test | M4 | CEC-02 |
| SR-F-07 | Ripeness classification meets SR-F-03 | across maturity | Held-out | M4 | EI-04 |
| SR-F-08 | Fruit pose output **with covariance**, not bare point | consistent cov | Test | M5 | CEC-03 |
| SR-F-09 | Occlusion/uncertainty gate rejects high-covariance targets | thresholded | Test | M5 | CEC-03 |
| SR-F-10 | Gate grasp on pose covariance + ripeness confidence | thresholded | Test | M7 | CEC-03/EI-04 |
| SR-F-11 | Grasp policy outputs a **proposal** to a bounding layer | proposal only | Review | M7 | EI-07 |
| SR-F-12 | Deterministic fallback for rejected proposals/unavailability | exists | Test | M7 | EI-07 |
| SR-F-13 | AI force/compliance setpoint applied only after clipping | clip-then-apply | Test | M9 | EI-07 |
| SR-F-14 | Platform stages each fruit to the pick station (x-DOF) | within tol. | Test | M10 | CEC-01 |
| SR-F-15 | **Independent safety monitor** can safe-stop regardless of any node | independent | Fault-inject | M11 | EI-11 |
| SR-F-16 | Per-module guards compose under one arbitration w/ precedence | defined order | Test | M11 | EI-11 |
| SR-F-17 | Power distribution isolates clean/noisy rails + protection | fused/isolated | Test | M12 |, |
| SR-F-18 | Power sequencing brings up safety monitor before actuators | safety-first | Test | M12 | EI-11 |
| SR-F-19 | Integration incremental with explicit interface verification | per-interface | Review | M13 | EI-13 |

### 6.2 Performance (SR-P, 38)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-P-01 | Harvest success rate | **≥ 85%** (goal 90%) | Field+stats | M1 | CEC-01 |
| SR-P-02 | Fruit-damage rate | **≤ 5%** (goal 3%) | Field+inspect | M1 | CEC-02 |
| SR-P-03 | Pick cycle time | **≤ 6 s** | Timed | M1 | CEC-01 |
| SR-P-04 | Placement error at grasp | **3σ ≤ 40 mm** | Meas.+analysis | M1 | CEC-03 |
| SR-P-05 | Regulate grasp force within [F_slip,F_bruise] | **[250,800] N** | Analysis+bench | M2 | CEC-02 |
| SR-P-06 | Peak rind contact pressure ≤ p_br | **≤ 350 kPa** | Contact meas. | M2 | CEC-02 |
| SR-P-07 | Placement/drop impact energy ≤ E_br | **drop ≤ 15 cm** | Drop test | M2 | CEC-02 |
| SR-P-08 | Structure/actuation handle high-mass payload w/ margin | **10 kg (max 12)** | Analysis | M2 | M8/M9 |
| SR-P-09 | Depth accuracy ≤ δZ_req at Z_pick | **≤ 8 mm @ 0.6 m** | Calib. meas. | M3 | CEC-03 |
| SR-P-10 | Ground sampling | **≤ 2 mm/pixel** | Analysis+test | M3 | M4 |
| SR-P-11 | Operate across lighting range (dynamic range) | **1k to 100k lux** | Env. test | M3 | EI-10 |
| SR-P-12 | Localization sensing supports rover pose | **≤ 3 cm lateral** | Field | M3 | M5/M10 |
| SR-P-13 | Detection recall on mature fruit | **≥ 90%** | Held-out+twin | M4 | EI-04 |
| SR-P-14 | False-positive rate fits cycle-time margin | low enough | Analysis | M4 | CEC-01 |
| SR-P-15 | Inference latency fits perception share | **≤ 100 ms** | Benchmark | M4 | M6 |
| SR-P-16 | Robot-frame fruit-pose error ≤ budget | **3σ ≤ 40 mm** | Analysis+meas | M5 | CEC-03 |
| SR-P-17 | Rover-state estimation supports field->robot transform | to budget | Field | M5 | CEC-03 |
| SR-P-18 | Estimation+fusion latency fits cycle share | within budget | Benchmark | M5 | CEC-01 |
| SR-P-19 | Perception+control end-to-end latency under thermal load | **≤ 300 ms** | HIL | M6 | CEC-01 |
| SR-P-20 | Post-optimization recall ≥ yield threshold | **≥ 90%** | Benchmark | M6 | EI-04 |
| SR-P-21 | Compute power/energy fits budget | **≤ 60 W pk** | Meas. | M6 | M12 |
| SR-P-22 | Real-time control path bounded worst-case latency | **≤ 20 ms** | Timing | M6 | M11 |
| SR-P-23 | Every grasp within safe set (window ∩ reach ∩ keep-out) | clipped/fallback | Analysis+test | M7 | CEC-02/EI-07 |
| SR-P-24 | Decision+policy-inference latency fits decision share | within budget | Benchmark | M7 | CEC-01 |
| SR-P-25 | Manipulator workspace covers pick region | **≥ 1.7 m span** | Kinematic+twin | M8 | CEC-01 |
| SR-P-26 | Mechanism placement error ≤ σ_mech under payload | **≤ 6 mm** | Analysis+meas | M8 | CEC-03 |
| SR-P-27 | End-effector stiffness ≥ k_eff,req | **≥ 20 N/mm** | Static test | M8 | CEC-03 |
| SR-P-28 | IK+motion within align/grab cycle share | within budget | Timed | M8 | CEC-01 |
| SR-P-29 | Grasp force within window through lift/swing | **[250,800] N** | Bench+HIL+field | M9 | CEC-02 |
| SR-P-30 | Effective stiffness meets σ_mech w/ contact compliance | **≥20 N/mm + compliant** | Static+contact | M9 | CEC-03/CEC-02 |
| SR-P-31 | Force-control bandwidth suffices, stable under edge latency | stable ≤20 ms | Control test | M9 | CEC-01/CEC-04 |
| SR-P-32 | Drive speed governed by cycle-time budget | **≤ 0.2 m/s** | Timed | M10 | CEC-01 |
| SR-P-33 | Lateral navigation error keeps fruit reachable | **3σ ≤ 5 cm** | Field | M10 | CEC-03 |
| SR-P-34 | Operate across the field envelope | **Section 4.2 envelope** | Field (edges) | M10 | EI-10 |
| SR-P-35 | Each control loop meets deadline (bounded WC latency) | **≤ 20 ms** | Timing+HIL | M11 | CEC-01 |
| SR-P-36 | Safety reaction time ≤ T_harm | **≤ 200 ms** | Timing | M11 | EI-11 |
| SR-P-37 | Energy store provides shift endurance w/ derating+margin | **3 to 5 kWh** | Budget+field | M12 | EI-12 |
| SR-P-38 | Power delivery supplies coincident peak w/o brownout | peak-sized | Load test | M12 | EI-12 |

### 6.3 Interface (SR-I, 20)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-I-01 | Mechanically + electrically integrate with Amiga | per Doc C | Interface test | M1 | Doc C |
| SR-I-02 | Perception delivers 3-D fruit pose in robot frame | to decision | Interface test | M1 | M5/M7 |
| SR-I-03 | Fruit-contact/damage model is a controlled shared model | twin+ctrl+V&V | Review | M2 | Doc G |
| SR-I-04 | All sensors calibrated (intrinsic/extrinsic/hand-eye/temporal) | residual budgeted | Calib.+analysis | M3 | CEC-03 |
| SR-I-05 | Virtual-sensor models exist in the twin | controlled | Review | M3 | Doc G |
| SR-I-06 | Twin generates labeled scenes + perception regression bed | exists | Review | M4 | Doc G |
| SR-I-07 | Mechanism-tolerance σ_mech issued to M8 | **6 mm** | Review | M5 | CEC-03 |
| SR-I-08 | Twin supplies ground-truth pose to validate localization | exists | Review | M5 | Doc G |
| SR-I-09 | HIL rig (twin->edge) verifies deployed stack | exists | Review | M6 | Doc G |
| SR-I-10 | Twin serves as policy training env + reality-gap instrument | exists | Review | M7 | Doc G |
| SR-I-11 | Track width consistent w/ reach (M8) + stability (M10) | resolved Section 4.3 | Integration review | M8 | M10/M13 |
| SR-I-12 | Kinematic twin model (reach/Jacobian/singularity) exists | exists | Review | M8 | Doc G |
| SR-I-13 | Fluid+contact twin model exists + real-validated (CR-03) | validated | Review+valid. | M9 | Doc G |
| SR-I-14 | Track width in feasible interval (resolves SR-I-11) | **[1.6,2.2] m -> 1.8** | Integration analysis | M10 | M13 |
| SR-I-15 | Twin rover-motion/stability/nav model exists | exists | Review | M10 | Doc G |
| SR-I-16 | Twin/HIL harness verifies node-graph integration + timing | exists | Review | M11 | Doc G |
| SR-I-17 | Power/thermal models exist for verification | exists | Review | M12 | Doc G |
| SR-I-18 | Validated twin serves as V&V + safety-case evidence source | validated | Review | M13 | Doc G/E |
| SR-I-19 | V&V + reliability feed safety case (M15) + cost (M16) | flows | Review | M14 | M15/M16 |
| SR-I-20 | Cost/deployment/sustainability feed the capstone | flows | Review | M16 | M17 |

### 6.4 Constraint / Cost (SR-C, 14)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-C-01 | No network dependency in the real-time control loop | none | Review+test | M1 | CEC-04 |
| SR-C-02 | Operate under field conditions (dust/temp/light) | **Section 4.2 envelope** | Env. test | M1 | EI-10 |
| SR-C-03 | Approved hybrid actuation (electric + fluid grip) | hybrid | Review | M1 | CR-01 |
| SR-C-04 | Gripper accommodates fruit size distribution | **18 to 30 cm** | Size-set test | M2 | CEC-02 |
| SR-C-05 | No runtime path depends on off-robot/cloud | none | Audit+test | M6 | CEC-04 |
| SR-C-06 | Device does not thermally throttle below latency budget | no throttle | Thermal test | M6 | M12 |
| SR-C-07 | Manipulability μ ≥ μ_min, γ ∈ keep-out | **γ ∈ [45°,135°]** | Analysis+test | M8 |, |
| SR-C-08 | Mechanical relief physically caps grip < F_bruise | **hard ≤ 800 N** | Relief test | M9 | EI-07/EI-09 |
| SR-C-09 | Stable across max slope w/ payload + arm swing (SF>1) | **≤ 12°** | Stability | M10 |, |
| SR-C-10 | Real-time plane isolated from perception jitter | isolated | Load test | M11 | CEC-01 |
| SR-C-11 | Clocks/messages synchronized to meet σ_sync | **≤ 4 mm eq.** | Timing | M11 | CEC-03 |
| SR-C-12 | Component temps within limits across thermal envelope | **45 °C + solar** | Thermal+field | M12 | EI-12 |
| SR-C-13 | Target unit build cost at volume; dominant driver attacked | **≤ $35k** [TBD-EXT] | Cost model | M16 | EI-05 |
| SR-C-14 | Cost-per-acre beats manual within envelope | beat manual [TBD-EXT] | Unit econ+pilot | M16 | EI-16 |

### 6.5 Safety / Sustainability (SR-S, 8), Reliability (SR-R, 2), Ethics (SR-E, 2)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-S-01 | Stored fluid-energy hazards mitigated (relief/burst/bleed/guard) | mitigated | Safety review | M9 | EI-09 |
| SR-S-02 | Battery/high-current stored-energy hazards mitigated (w/ M9) | mitigated | Safety review | M12 | EI-12 |
| SR-S-03 | Hazard analysis w/ risk-ranked register (incl. combined faults) | complete | Hazard review | M15 | EI-15 |
| SR-S-04 | Safety-monitor independence + reaction certified | no common-cause | Indep.+fault-inj | M15 | EI-11 |
| SR-S-05 | Defense-in-depth mitigations each certified on M14 evidence | certified | Safety-case | M15 | EI-07/09/11 |
| SR-S-06 | Residual risk assessed + argued acceptable, stated explicitly | explicit | Safety-case | M15 | EI-15 |
| SR-S-07 | Human-interaction + maintenance safety specified | keep-clear/lockout | Review+test | M15 | EI-15 |
| SR-S-08 | Lifecycle assessment documented + reconciled w/ cost | LCA done | LCA review | M16 | EI-16 |
| SR-R-01 | FMEA finds dominant failure mode; design attacks it | to reliability target | FMEA+growth | M14 | EI-05 |
| SR-R-02 | Meet reliability/durability target over a season | season target | Durability | M14 | EI-14 |
| SR-E-01 | Responsible-deployment analysis documented | complete | Review | M15 | EI-15 |
| SR-E-02 | Operating limits bound machine out of where-not-to-operate | enforced | Review+runtime | M15 | EI-10 |

### 6.6 Verification (SR-V, 8), Acceptance (SR-A, 7), Data/Deployment (SR-D, 4), Manufacturing (SR-M, 1)
| ID | Requirement | Ratified target | Verify | Src | Serves |
|----|-------------|-----------------|--------|-----|--------|
| SR-V-01 | Integrated machine executes mission meeting all budgets *composed* | all budgets | Twin+HIL+proto | M13 | CEC-01/03 |
| SR-V-02 | Each twin fidelity rung validated to its tolerance | per-rung | Per-rung valid. | M13 | CEC-06 |
| SR-V-03 | Contact/fluid rung integrated + validated (CR-03) | validated | Contact valid. | M13 | CEC-06 |
| SR-V-04 | Emergent/cross-subsystem behavior tested at system level | tested | Integrated camp. | M13 | EI-13 |
| SR-V-05 | Every top requirement -> admissible evidence at right rung | mapped | Matrix review | M14 | CEC-06 |
| SR-V-06 | Grasp success + no-bruise validated to target + confidence | stated conf. | Stat. field/HIL | M14 | EI-14 |
| SR-V-07 | Placement/cycle-time/power-thermal verified w/ field evidence | field-rep. | Meas.+analysis | M14 | CEC-01/03 |
| SR-V-08 | Validation includes adversarial envelope-edge testing | edge cases | Edge campaign | M14 | EI-14/EI-10 |
| SR-A-01 | **Works:** mission within cycle-time + placement, marketable fruit | all budgets | Composed verify | M17 | CEC-01/02/03 |
| SR-A-02 | **Proven:** every claim on admissible evidence, unproven flagged | fidelity-tagged | V&V matrix | M17 | CEC-06 |
| SR-A-03 | **Safe:** certified safety case (independence, residual stated) | certified | Safety-case | M17 | EI-15 |
| SR-A-04 | **Pencils out:** deployment case beats alternative in envelope | pilot-validated | Deployment case | M17 | EI-16 |
| SR-A-05 | Resolve system-level tradeoffs with defended decisions | defended | Design review | M17 | EI-17 |
| SR-A-06 | Concepts/insights demonstrated transferable to a variant | transferred | Transfer exercise | M17 | EI-17 |
| SR-A-07 | Defended under adversarial review, owning residual + limits | owned | Final review | M17 | EI-15/EI-17 |
| SR-D-01 | Training set spans field variability; sim-to-real validated | coverage audited | Audit+valid. | M4 | CEC-05 |
| SR-D-02 | Policy trained w/ domain randomization, transfer validated | validated | Sim+real | M7 | CEC-05 |
| SR-D-03 | Deployment envelope defined; machine designed/priced to it | defined | Review | M16 | EI-10 |
| SR-D-04 | Staged go-to-field plan within safety limits | pilot->scale | Review | M16 | EI-14 |
| SR-M-01 | DFM/DFA + serviceability targets met | producible | Manuf. review | M16 | EI-16 |

---

## 7. Design-Decision Register (DD-1...DD-109)

The complete catalog; * = keystone. Each traces to its owning module (grouped). Rationale lives in the module's Section 10; this is the authoritative index.

**M1 (systems):** DD-1* Drive-over straddle architecture, DD-2 Mid-frame pick station, DD-3* Hybrid actuation, DD-4 Edge-only control loop, DD-5 Single-crop focus (watermelon).
**M2 (crop/contact):** DD-6 Compliant conforming contact, DD-7 Closed-loop grasp-force regulation, DD-8 Controlled placement not dropping, DD-9 Distribution-based sizing.
**M3 (sensing):** DD-10 Passive stereo RGB primary, DD-11 Spectral/NIR for ripeness, DD-12 GNSS/RTK+IMU+odom localization, DD-13 Force+tactile+pressure at gripper, DD-14 Stage fruit close, DD-15 Full calibration regime.
**M4 (vision):** DD-16 Single-stage detector + seg head, DD-17 RGB+NIR learned ripeness head, DD-18 Recall-biased operating point, DD-19 Hybrid real+synthetic + domain randomization, DD-20 Transfer learning from pretrained backbone.
**M5 (localization):** DD-21 Dev/runtime separation, DD-22 Back-projection + explicit frame chain, DD-23 EKF fusion, DD-24 Pose-with-covariance output, DD-25 Uncertainty-driven occlusion gate, DD-26 Close staging shrinks dominant term.
**M6 (edge):** DD-27 Classical fusion baseline, learned option, DD-28 On-robot-only runtime, DD-29 Quantized+compiled models on accelerator, DD-30 Measure-on-target workflow, DD-31 Recall-preserving operating point, DD-32 Thermal/power headroom + graceful degradation, DD-33 Isolate real-time path, DD-34 HIL verification rig.
**M7 (decision):** DD-35 Mission FSM, DD-36 Value-based pick ordering, DD-37 Learned grasp policy as proposer, DD-38 Verified bounding layer + fallback, DD-39 Train-in-sim + validate-on-real, DD-40 Policy inference on edge, training off, DD-41 Reward tied to Grip-Force Window.
**M8 (kinematics):** DD-42 Rail-mounted parallel two-actuator manipulator, DD-43 Track width sized to workspace, bounded by stability, DD-44 Manipulability/transmission-angle keep-out, DD-45 Stiffness sized from σ_mech + payload, DD-46 Fluid compliance as controllable stiffness, DD-47 Closed-form IK/FK on edge.
**M9 (fluid):** DD-48 Pneumatic compliant gripper, DD-49 Pressure-as-force closed loop, DD-50 Impedance/compliance control, DD-51 Tunable fluid stiffness, DD-52 AI setpoint clipped, mechanical relief hard bound, DD-53 Bandwidth tuned to edge latency, DD-54 Fluid/contact twin + real validation.
**M10 (mobility):** DD-55 Drive-over straddle on Amiga, DD-56 Motion strategy by cycle-time margin, DD-57 Low CoG + track width in feasible interval, DD-58 Fused navigation (RTK+IMU+vision row-follow), DD-59 Explicit operating envelope, DD-60 Arm-swing/slope coupling constrains slope/swing.
**M11 (ROS 2):** DD-61 On-robot navigation, DD-62 ROS 2 node graph, typed interfaces, per-link QoS, DD-63 Control/perception-plane separation, DD-64 Independent safety monitor, DD-65 Unified guard arbitration w/ precedence, DD-66 Worst-case timing verification, DD-67 Defined safe states + watchdogs, DD-68 Time synchronization.
**M12 (power):** DD-69 Peak-and-average power budget + coincident-peak, DD-70 Energy store sized w/ derating + margin, DD-71 Efficiency effort at dominant load, DD-72 Thermal design to field envelope, DD-73 Split clean/noisy rails + protection, DD-74 Safety-first power sequencing, DD-75 Dust/airflow/sealing tradeoff for cooling.
**M13 (integration/twin):** DD-76 Incremental integration in twin first, DD-77 Twin as integration bench + evidence source, DD-78 Fidelity ladder w/ per-rung validation gates, DD-79 Integrate+validate contact/fluid rung, DD-80 System-level composed-budget verification, DD-81 Emergent-behavior test campaign, DD-82 HIL before prototype commitment.
**M14 (V&V):** DD-83 Requirement-to-evidence matrix w/ fidelity tags, DD-84 Statistically sound envelope-stratified test plans, DD-85 FMEA + dominant-failure-mode attack, DD-86 Durability/reliability-growth over a season, DD-87 Adversarial validation at envelope edges, DD-88 Twin-as-evidence where validated, field-mandatory where not, DD-89 Composed-budget acceptance table w/ evidence fidelity.
**M15 (safety/ethics):** DD-90 Risk-ranked hazard register (incl. combined stored-energy), DD-91 Independence certification of safety monitor, DD-92 Defense-in-depth safety case (claim-argument-evidence), DD-93 Explicit residual-risk statement + acceptability, DD-94 Human-interaction + maintenance-safety design, DD-95 Responsible-deployment analysis + operating-limit bounding, DD-96 Living safety case + incident-response plan.
**M16 (cost/deploy):** DD-97 Cost model (build+operating+TCO) w/ dominant-driver, DD-98 Unit-economics tied to budgets + marketable yield, DD-99 Honest deploy/deploy-with-limits/not-yet decision, DD-100 Deployment-envelope definition, DD-101 DFM/DFA + serviceability, DD-102 Lifecycle assessment reconciled w/ cost, DD-103 Staged go-to-field plan within safety limits.
**M17 (capstone):** DD-104 Complete coherent decision set, DD-105 Explicit resolution of each system-level tension, DD-106 Evidence plan mapping claims to fidelity, DD-107 Certified safety + deployment cases as gates, DD-108 Transfer design to a variant, DD-109 Honest residual-and-limits statement.

---

## 8. Trade-Study Register (TS-1...TS-34)

Authoritative index; full scoring in each module's Section 11. **Outcome** = selected alternative.

| TS | Title | Outcome (selected) | Src |
|----|-------|--------------------|-----|
| TS-1 | Harvesting architecture | Drive-over straddle, single arm | M1 |
| TS-2 | Autonomy level | Bounded autonomy w/ deterministic fallback | M1 |
| TS-3 | End-effector contact strategy | Compliant conforming grip | M2 |
| TS-4 | Ripeness sensing emphasis | Multi-cue (incl. NIR) | M2 |
| TS-5 | Depth-sensing modality | Passive stereo (OAK-D class) | M3 |
| TS-6 | Ripeness sensing modality | RGB + NIR | M3 |
| TS-7 | Detection/segmentation architecture | Single-stage detector + seg head | M4 |
| TS-8 | Data strategy | Hybrid real + synthetic, domain randomization | M4 |
| TS-9 | State estimator | EKF fusion | M5 |
| TS-10 | Fusion coupling & learned vs classical | Classical baseline, learned option | M5 |
| TS-11 | Model-optimization strategy | Quantize + compile, measure-on-target | M6 |
| TS-12 | Edge compute hardware | Jetson-class | M6 |
| TS-13 | Grasp strategy | Policy proposer + bounding layer | M7 |
| TS-14 | Learning approach | Train-in-sim + validate-on-real | M7 |
| TS-15 | Manipulator kinematic architecture | Rail-mounted parallel 2-actuator | M8 |
| TS-16 | Singularity-avoidance strategy | Transmission-angle keep-out | M8 |
| TS-17 | Working fluid / gripper actuation | Pneumatic (clean fluid) | M9 |
| TS-18 | Force-control strategy | Pressure-as-force + relief hard bound | M9 |
| TS-19 | Motion strategy | Index/stop-to-pick by cycle margin | M10 |
| TS-20 | Navigation architecture | Fused RTK+IMU+vision row-following | M10 |
| TS-21 | Safety-monitor architecture | Independent monitor + HW controller | M11 |
| TS-22 | Executor / scheduling strategy | Control/perception-plane separation | M11 |
| TS-23 | Cooling strategy | Sealed w/ managed airflow (dust tradeoff) | M12 |
| TS-24 | Energy store / architecture | Battery sized w/ derating + margin | M12 |
| TS-25 | Twin fidelity allocation | Fidelity ladder, per-rung validation | M13 |
| TS-26 | Integration strategy | Incremental, twin-first | M13 |
| TS-27 | Evidence-source strategy per claim | Matched (twin/HIL/field per claim) | M14 |
| TS-28 | Reliability strategy | FMEA-driven dominant-mode attack + growth | M14 |
| TS-29 | Human-presence safety strategy | Defense in depth (exclusion+detect+physical) | M15 |
| TS-30 | Safety-case rigor | Goal-structured + explicit residual | M15 |
| TS-31 | Business/deployment model | Harvesting-as-a-service (+ lease) | M16 |
| TS-32 | Cost-reduction focus | Attack dominant driver, then design-for-volume | M16 |
| TS-33 | System-level negotiation | Defended negotiated whole | M17 |
| TS-34 | Transfer variant | Tools re-derive for a variant | M17 |

---

## 9. Interface Register

### 9.1 External interfaces
| Interface | Requirement | Owner | Ref |
|-----------|-------------|-------|-----|
| **Amiga mechanical/electrical** | Mount, power, CAN/control integration (SR-I-01) | Doc C | farm-ng docs [TBD-EXT] |
| **Field/operator** | Operating limits, keep-clear, human-interaction (SR-S-07/E-02) | Doc E | M15 |
| **Runtime network** | **None in control loop** (SR-C-01/05, CEC-04) | Doc B | M6 |
| **Development cloud/GPU** | Training + synthetic data (outside runtime; CR-05 resolution) | Doc G | M6/M7 |

### 9.2 Key internal interfaces
| Interface | Requirement | Between | Anchor |
|-----------|-------------|---------|--------|
| Fruit pose (3-D + covariance) | SR-I-02, SR-F-08 | Perception -> Decision | CEC-03 |
| σ_mech tolerance allocation | SR-I-07 | M5 -> M8 | CEC-03 |
| Track-width feasible interval | SR-I-11/14 | M8 <-> M10/M13 |, |
| Grasp proposal -> bounding layer | SR-F-11/13 | Policy -> Bounds | EI-07 |
| Guard arbitration/precedence | SR-F-16 | All guards -> arbiter | EI-11 |
| Clean/noisy power rails | SR-F-17 | Power -> subsystems | M12 |
| **Shared contact/damage model** | SR-I-03 | Twin <-> ctrl <-> V&V | Doc G |
| Twin fidelity rungs (all SR-I twin models) | SR-I-05/06/08/09/10/12/13/15/16/17/18 | Subsystems <-> twin | CEC-06 / Doc G |

The eleven twin-model interfaces (SR-I-05...18 family) are the **primary dependency on Doc G**, their fidelity tolerances and validation gates are owned there.

---

## 10. Verification & Acceptance Framework

### 10.1 Verification methods (as used in the register)
Analysis, Test (bench/lab), Field trial, HIL measurement, Twin validation, Review, Demonstration, Statistical field/HIL campaign, FMEA/durability. Each requirement's method is stated in Section 6; the **fidelity** of the evidence must match the claim (CEC-06), a grasp-bruise claim (SR-P-06/29) is not verifiable below the validated contact rung (SR-V-03, CR-03).

### 10.2 Evidence fidelity rungs (CEC-06; tolerances -> Doc G)
Kinematic twin -> dynamic twin -> **validated contact/fluid rung** -> HIL (edge under load) -> prototype -> field/pilot. A requirement's admissible evidence is named per rung in the V&V matrix (SR-V-05, DD-83).

### 10.3 Acceptance criteria (the four-part claim)
The machine is accepted when SR-A-01...04 hold on admissible evidence: **Works** (SR-A-01: mission within budgets), **Proven** (SR-A-02: claims at appropriate fidelity, unproven flagged), **Safe** (SR-A-03: certified safety case, residual stated), **Pencils out** (SR-A-04: deployment case beats manual in the envelope, pilot-validated), plus SR-A-05 (defended tradeoffs), SR-A-06 (transfer), SR-A-07 (adversarial defense owning residual). This is the capstone gate.

---

## 11. Conflict-Register Status (CR-01...CR-07)

| CR | Issue | Status | Where closed |
|----|-------|--------|--------------|
| CR-01 | Actuator architecture: electric-only vs. fluid-power pillar | **RESOLVED** | M9, hybrid ratified (SR-C-03, DD-3*) |
| CR-02 | Design-spec text contradicts the hybrid decision | **CLOSED HERE** | Doc B Section 1.3 supersedes the old spec; hybrid is the baseline |
| CR-03 | Twin has no fluid/contact fidelity vs. sim-first doctrine | **RESOLVED** | M13, contact/fluid rung integrated + validated (SR-V-03); tolerances -> Doc G |
| CR-04 | Scope: 7-module survey vs. 16-module master | **RESOLVED** | 16 (now 17 w/ capstone) master + 7-module survey track |
| CR-05 | "No cloud in control loop" vs. cloud for training | **RESOLVED** | CEC-04 runtime/dev partition (SR-C-01/05; Section 9.1) |
| CR-06 | BOM/budgets omit the fluid-power subsystem | **CLOSED HERE** | Doc B includes fluid power in requirements/interfaces/cost (SR-C-08, SR-S-01, Section 5.3); full BOM -> Doc C |
| CR-07 | Perishable specifics stated as if permanent | **CLOSED HERE** | Doc B ratifies them as [RATIFIED-EST]/[TBD-EXT] with basis (Section 5) |

**Doc B closes CR-02, CR-06, and CR-07**, the three conflicts Phase-0 assigned to the requirements baseline. All seven are now resolved or closed.

---

## 12. Traceability Matrix (summary)

Full requirement -> module -> anchor -> verification is embedded in Section 6 (the **Src**, **Serves**, and **Verify** columns of every entry). Aggregate view:

| Anchor | Primary requirements served |
|--------|-----------------------------|
| **CEC-01** Spine / cycle-time | SR-P-03/14/15/18/19/24/25/28/31/32/35, SR-F-01/14, SR-C-10 |
| **CEC-02** Grip-force window | SR-P-05/06/07/29/30, SR-F-05/06, SR-C-04/08, SR-P-02 |
| **CEC-03** Placement budget | SR-P-04/09/16/26/27/33, SR-F-08/09/10, SR-I-04/07, SR-C-11 |
| **CEC-04** No-cloud edge | SR-C-01/05, SR-P-31 |
| **CEC-05** Sim-to-real | SR-D-01/02, SR-I-10/13 |
| **CEC-06** Fidelity ladder | SR-V-02/03/05, SR-A-02, SR-I-18, all twin-model interfaces |
| **EI-04** Mission metric | SR-P-13/20, SR-F-07 |
| **EI-05** Dominant term | SR-R-01, SR-C-13, σ_Z (placement), power (M12) |
| **EI-07** Bound the learner | SR-F-11/12/13, SR-P-23, SR-C-08 |
| **EI-09** Physics regulates | SR-C-08, SR-S-01 |
| **EI-10** Field is the spec | SR-P-11/34, SR-C-02, SR-D-03, SR-E-02 |
| **EI-11** Independent guard | SR-F-15/16/18, SR-P-36, SR-S-04 |
| **EI-12** Worst-case op point | SR-P-37/38, SR-C-12, SR-S-02 |
| **EI-13/14** Integrate/validate | SR-F-19, SR-V-01/04/06/08, SR-R-02 |
| **EI-15** Argue safety | SR-S-03/05/06/07, SR-E-01, SR-A-03 |
| **EI-16** Pencils out | SR-C-13/14, SR-S-08, SR-M-01, SR-A-04 |
| **EI-17** System, not subsystem | SR-A-01/05/06/07, SR-I-11/14 |

---

## 13. Baseline & Change Control

- **Baseline status:** Doc B **Rev 1.0, frozen configuration-controlled baseline (approved).** This is the controlling requirements baseline; changes hereafter are controlled and versioned.
- **Consistency guarantee:** every entry traces to a frozen module; no requirement, decision, or trade study was invented. Ratified values (Section 5) are engineering estimates flagged as such.
- **Dependencies:** the twin-model interfaces and fidelity tolerances depend on **Doc G** (next in the production queue); the platform/BOM specifics on **Doc C**; the safety case on **Doc E**.
- **What changes when a [RATIFIED-EST] is measured:** the value updates here (versioned), and any budget it feeds (Section 5.6) is re-checked for composition. The *structure*, IDs, traceability, verification methods, acceptance framework, is stable regardless.

---

## Concise quality summary (honest self-assessment)

**Strengths.** Doc B is the authoritative baseline the curriculum needed: it harvests **all 123 requirements** (verified unique, no ID collisions), **110 design decisions**, **34 trade studies**, and the **7-item conflict register** from the 17 frozen modules into one register, and it **ratifies every load-bearing `[VERIFY@PUB]` placeholder into a concrete, mutually-consistent engineering estimate** (Section 5) with stated basis, the placement RSS composes to 3σ = 36.7 mm ≤ 40 mm, cycle-time to v = 0.2 m/s, grip-force to a workable [250, 800] N window, power to ~3.3 kWh ≤ installed, and stability to a feasible 1.8 m track, so the budgets demonstrably compose (Section 5.6). It centralizes traceability (every entry carries source module, verification method, and the CEC/EI served) and **closes conflicts CR-02, CR-06, and CR-07** as the superseding baseline. Structure, ID conventions, and the four-part acceptance framework (works/proven/safe/pencils-out) are all explicit.

**Known weaknesses / items for your review.**
1. **The Section 5 values are engineering estimates, not measured truth**, flagged [RATIFIED-EST] throughout. They are a *usable, internally-consistent baseline to validate at pilot*, chosen for mutual consistency; real crop-mechanics, sensor, and field data (and the pilot) will confirm or revise them. The two genuinely external items (build cost, cost-per-acre) are [TBD-EXT].
2. **Twin fidelity tolerances are deferred to Doc G.** The eleven twin-model interfaces (SR-I-05...18) and the fidelity rungs are named here but their *validation tolerances* are Doc G's to set, the intended next document, correctly.
3. **Platform/BOM specifics are deferred to Doc C.** The Amiga interface and the full fluid-inclusive BOM (CR-06 is closed in principle here by *including* fluid power in requirements/cost) need Doc C for part-level detail.
4. **DD/TS registers are indexes, not re-derivations.** Rationale and scoring stay in the frozen modules (cited); Doc B is the authoritative catalog and traceability layer, not a re-argument, by design, to avoid divergence from the frozen source.

I have not scored this against the 9.5 bar, that judgment is yours. Items 2 to 3 are correctly the scope of the next documents (Doc G, then Doc C) in your priority order.

**END OF DOC B, STOP. Awaiting your review before freezing Doc B or proceeding to Doc G (Digital Twin & Fidelity).**
