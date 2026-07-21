# Doc G: Digital Twin & Fidelity

**SIM2FIELD, Autonomous Watermelon Harvesting Robotics**
**P0 Support Document G**, *The authoritative digital-twin architecture, fidelity ladder, and validation-tolerance baseline*
**Status:** **Rev 1.0, frozen configuration-controlled baseline (approved).** Controlled, versioned changes only.
**Depends on:** Doc B (Rev 1.0, requirements, the eleven twin-model interfaces SR-I-05...18, CEC-06 evidence framework); Doc C (Rev 1.0, the physical hardware the twin models mirror; Section 5 physical parameters and the shared contact-mechanics characterization)
**Controlling baseline for:** the twin-as-evidence claims in Modules 13 to 17, the CEC-06 fidelity discipline, all V&V evidence admissibility, and the capstone acceptance argument

> **Authoring note (harvest-and-ratify doctrine).** Consistent with the P0 doctrine: this document **harvests rather than rewrites**. Every module wrote a *"deliverable to Doc G"* specification in its Digital Twin Activities section; Doc G consolidates those eleven specifications into one authoritative twin architecture, **ratifies the per-rung validation tolerances** the modules deferred (as `[RATIFIED-EST]` with basis), and preserves traceability back to the frozen modules. It introduces **no new architecture**, it makes the simulation-first evidence discipline (CEC-06) concrete and usable. Engineering authority lives here; educational authority remains in the frozen curriculum. Perishable values are tagged `[RATIFIED-EST]` (an estimate to validate) or `[TBD-EXT]` (genuinely external). This document is the **engineering answer to conflict CR-03** (the twin's missing fluid/contact fidelity), building on its M13 resolution.

---

## 1. Purpose, Scope & Authority

### 1.1 Purpose
Doc G is the single source of truth for **the digital twin and how much any simulation result can be trusted**. The curriculum's entire evidence strategy is simulation-first (CEC-05/CEC-06): the twin designs, integrates, trains, verifies, and, once validated, serves as the *evidence source* for V&V (M14), the safety case (M15/Doc E), and the deployment case (M16). That strategy is only rigorous if each fidelity level is validated against reality to a stated tolerance before it is trusted. Doc G defines the twin's architecture, its fidelity ladder, and, the key deliverable, **the per-rung validation tolerances and acceptance gates** that make a twin result *admissible evidence*.

### 1.2 Scope
In scope: the twin architecture and its component models (the eleven SR-I twin-model interfaces); the fidelity ladder (six rungs) and the CEC-06 matching/validation discipline made concrete; the ratified per-rung validation tolerances and acceptance gates; the contact/fluid rung specification that closes CR-03; the synthetic-data pipeline and sim-to-real transfer validation (CEC-05); the HIL architecture; and the evidence-admissibility rules that V&V (M14) and the safety case (M15/Doc E) consume.

Out of scope (owned elsewhere, referenced here): the requirements and their ratified targets (**Doc B**, Doc G validates *against* those targets); the physical platform and hardware (**Doc C**); the certified safety case itself (**Doc E**, Doc G supplies its evidence-admissibility rules); detailed engineering references (**Doc F**); the twin's *software implementation* (a production asset, built to this spec).

### 1.3 Authority
Doc G holds **engineering authority over twin fidelity and evidence admissibility**. When any artifact, a module claim, a V&V result, a safety argument, a figure, asserts "verified in the twin," Doc G defines whether that assertion is admissible: at which rung, validated to which tolerance, for which class of decision. A twin result that has not passed its rung's acceptance gate is **not admissible evidence** (the CEC-06 discipline). Doc G is consistent with Doc B by construction (it validates against Doc B's ratified targets) and with the frozen modules (it harvests their twin specifications).

### 1.4 Relationship to CEC-05 and CEC-06
The two simulation anchors are distinct and both live here:
- **CEC-05, Sim-to-Real Pipeline:** transfers *learned behaviors* (domain randomization, policy transfer) from sim to field; owns the synthetic-data pipeline and transfer-validation gates (Section 6).
- **CEC-06, Simulation-First Fidelity Ladder:** governs the fidelity and validation of *any* model-based decision, physical or learned, including kinematics, stability, thermal, and contact; owns the ladder, the matching discipline, and the per-rung tolerances (Section 3, Section 4).

Doc G is where both stop being principles and become an engineering specification with numbers.

---

## 2. Twin Architecture (harvested from the modules)

### 2.1 Roles of the twin across the lifecycle
The twin is a **validated virtual replica** of the machine and its environment used to design, integrate, train, verify, and generate evidence. Its roles, established across the frozen modules:

| Role | What it does | Modules | Interface |
|------|--------------|---------|-----------|
| **Virtual-sensor bench** | Models each sensor (stereo, NIR, GNSS/IMU, force/pressure) | M3 | SR-I-05 |
| **Labeled-scene generator** | Renders training/regression scenes (synthetic data) | M4 | SR-I-06, SR-D-01 |
| **Ground-truth oracle** | Exact fruit/rover pose to score localization + covariance | M5 | SR-I-08 |
| **HIL rig** | Streams sim sensor data to the real edge running the deployed stack | M6 | SR-I-09 |
| **Policy training environment** | RL/imitation env + reality-gap instrument | M7 | SR-I-10 |
| **Kinematic model** | FK/IK, Jacobian, μ/γ singularity map, load-deflection | M8 | SR-I-12 |
| **Contact/fluid model** | Fluid-actuator dynamics, contact mechanics, bruise/slip (CR-03) | M9 | SR-I-13 |
| **Mobility/stability/nav model** | Rover motion, CoG/stability, navigation, slope & arm-swing coupling | M10 | SR-I-15 |
| **Integration/HIL harness** | SIL/HIL node-graph + timing + fault injection | M11 | SR-I-16 |
| **Power/thermal model** | Per-subsystem draw, duty cycles, derating; thermal generation/dissipation | M12 | SR-I-17 |
| **System twin & evidence source** | Integrated fidelity-ladder twin; validated evidence for M14/M15 | M13 | SR-I-18, SR-V-02 |

These eleven interfaces are the twin's **specification set**, each was written as a "deliverable to Doc G" in its module; Section 5 consolidates their model specifications.

### 2.2 The system twin (M13)
At the system level the component models compose into one **system twin** that runs the whole mission (DRIVE->...->RELEASE) and reveals behavior no module owned: **resource contention** (compute/power shared across perception/control/nav, M6/M11/M12), **timing coupling** (loop jitter, M11), **dynamic coupling** (arm-swing <-> stability on a slope; fluid compliance <-> placement stiffness, M8/M9/M10), and **interface drift**. The system twin is the integration bench, the timing/resource bench, and, once validated, the evidence source. Its trustworthiness is earned per rung (Section 3, Section 4), never assumed.

---

## 3. The Fidelity Ladder (CEC-06 made concrete)

### 3.1 The six rungs
The twin exists at multiple fidelity levels, cheap-and-approximate to expensive-and-faithful:

| Rung | Fidelity level | Models | What it can decide | Owning module |
|-----:|----------------|--------|--------------------|---------------|
| **R1** | **Kinematic** | geometry, reach, FK/IK, Jacobian, singularity | reach, workspace coverage, singularity keep-out | M8 |
| **R2** | **Dynamic** | masses, inertias, forces, stability, motion | stability, dynamic coupling, timing under motion | M8/M10 |
| **R3** | **Contact/Fluid** | contact mechanics, bruise/slip, fluid-actuator dynamics | grasp-will-not-bruise, slip, window membership *(CR-03 rung)* | M9 |
| **R4** | **Sensor-in-the-loop** | virtual sensors on rendered/played-back data | perception performance, detection/localization | M3/M4/M5 |
| **R5** | **Hardware-in-the-loop (HIL)** | real edge/actuators against the sim | real timing, power, thermal, deployed-stack behavior | M6/M11/M12 |
| **R6** | **Prototype / Field** | the real machine in the real field | everything, the highest rung, the ground truth | M14/M16 |

### 3.2 The three-part discipline (CEC-06)
1. **Match fidelity to the decision.** A reach question needs only R1; a grasp-will-not-bruise question needs R3 (or R6). Using a low rung for a fidelity-sensitive decision is *over-trust*; using a high rung for an insensitive one *wastes effort*.
2. **Find where fidelity is binding.** Identify decisions whose outcome *changes* across rungs, that is where fidelity investment and validation must go (an EI-05-style dominant-term focus applied to fidelity).
3. **Validate each rung against reality before trusting it.** Every rung has a reality gap; a rung is trustworthy only after its predictions are checked against real data to a **tolerance**, the per-rung acceptance gate (Section 4). Climb deliberately.

### 3.3 Decision -> minimum-admissible-rung map
Which rung is the *minimum* admissible evidence for each class of claim (the admissibility rule V&V and the safety case consume):

| Decision class | Min. rung | Rationale | Example requirements |
|----------------|:--------:|-----------|----------------------|
| Reach / workspace / singularity | R1 | purely geometric | SR-P-25, SR-C-07, SR-I-12 |
| Stability / dynamic coupling | R2 | needs masses/forces | SR-C-09, SR-P-08 |
| **Grasp-will-not-bruise / slip / window** | **R3 -> R6** | **fidelity-sensitive; field-mandatory for final claim** | **SR-P-05/06/29/30, SR-P-02** |
| Perception performance (recall, localization) | R4 -> R6 | sim-validated, field-confirmed | SR-P-13/16, SR-F-08 |
| Real timing / power / thermal | R5 | must be on real hardware under load | SR-P-19/22/35, SR-P-37, SR-C-12 |
| Cycle-time composition | R2 -> R5 | composed, then HIL-confirmed | SR-P-03, SR-V-01 |
| Final acceptance (works/safe/pays) | R6 | pilot/field is the ground truth | SR-A-01...04 |

The rule of thumb: **the more a decision depends on physical contact, real timing, or field reality, the higher the minimum admissible rung**, and the fidelity-sensitive grasp claims (R3) and all final claims (R6) can never be settled by the low rungs.

---

## 4. Ratified Per-Rung Validation Tolerances  *(the key deliverable)*

Each rung is trustworthy only after its predictions are validated against real data to a tolerance. Doc B deferred these tolerances to Doc G; this section ratifies them. All **[RATIFIED-EST]** unless noted, engineering targets that the twin's actual validation campaign confirms or revises. A rung **passes its acceptance gate** when the stated fraction of its predictions fall within tolerance of measured reality.

### 4.1 R1: Kinematic rung
| Quantity | Validation tolerance | Gate | Validated against | Basis |
|----------|----------------------|------|-------------------|-------|
| End-effector position (FK/IK) | **≤ 3 mm** vs. measured pose | 95% of poses | CMM / motion-capture on prototype arm | Well below σ_mech = 6 mm (Doc B Section 5.2) so kinematic error is not the binding term |
| Reach envelope boundary | **≤ 10 mm** | boundary match | measured workspace | Coarse; reach is a margin question |
| Singularity map (γ, μ) | **γ within 2°** of measured | map match | joint-torque measurement near keep-out | Keeps the [45°,135°] keep-out (Doc B Section 5.5) trustworthy |

### 4.2 R2: Dynamic rung
| Quantity | Validation tolerance | Gate | Validated against | Basis |
|----------|----------------------|------|-------------------|-------|
| Stability margin (tip-over) | **≤ 10%** relative error | conservative side | tilt-table / instrumented slope test | Margin must be trustworthy at 12° (SR-C-09); err conservative |
| Arm-swing <-> platform coupling | **≤ 15%** on peak reaction | trend + peak | instrumented swing on slope | Dynamic coupling is a design-bound, not a fine number |
| Settling / motion timing | **≤ 20 ms** vs. measured | per-motion | encoder logs | Feeds the cycle-time composition (CEC-01) |

### 4.3 R3: Contact/Fluid rung *(closes CR-03: the critical rung)*
| Quantity | Validation tolerance | Gate | Validated against | Basis |
|----------|----------------------|------|-------------------|-------|
| Peak rind contact pressure | **≤ 15%** vs. measured | 90% of grasps within tol. | instrumented gripper + pressure film on real fruit | The bruise claim (SR-P-06, p_br≈350 kPa) is fidelity-sensitive; 15% keeps the margin meaningful |
| Grip force vs. commanded | **≤ 10%** | 95% | load cell on bench | Force regulation in the window [250,800] N (SR-P-29) |
| Bruise/no-bruise outcome | **≥ 90%** classification agreement | outcome match | real grasp + post-inspection | The outcome the twin must predict to be an evidence source (SR-V-03) |
| Slip onset | **≤ 20%** on slip threshold | onset match | pull-test on real fruit | Slip bounds F_slip (SR-P-29) |
| Fluid-actuator pressure/force dynamics | **≤ 10%** on step response | bandwidth + gain | bench characterization | Force-control bandwidth stable under edge latency (SR-P-31) |

**This is the rung CR-03 named as missing.** M9 specified the model; M13 integrated it; Doc G ratifies its validation tolerances. Until R3 passes these gates on real fruit, **no grasp-bruise claim is admissible above an estimate**, the honest boundary of the simulation-first bet (Doc B SR-P-02/06/29, SR-V-03).

### 4.4 R4: Sensor-in-the-loop rung
| Quantity | Validation tolerance | Gate | Validated against | Basis |
|----------|----------------------|------|-------------------|-------|
| Stereo depth noise model | **≤ 20%** on σ_Z vs. real | distribution match | real stereo on scene targets | σ_Z = 8 mm is the dominant placement term (Doc B Section 5.2); its model must be honest |
| Detection recall (sim vs. real) | **≤ 5 pts** recall gap | gap bound | held-out real imagery | Recall ≥ 90% must transfer (SR-P-13/20, CEC-05) |
| Localization error + covariance consistency | **≤ 15%** on σ; covariance consistent (χ² in band) | consistency test | ground-truth field data (R6) | Pose-with-covariance must be calibrated (SR-F-08, SR-P-16) |
| NIR ripeness-signal model | **≤ 10%** on signal vs. real | signal match | real NIR on maturity set | Ripeness discrimination (SR-F-04/07) |

### 4.5 R5: Hardware-in-the-loop rung
| Quantity | Validation tolerance | Gate | Validated against | Basis |
|----------|----------------------|------|-------------------|-------|
| End-to-end latency (perception->control) | **measured on real edge**, ≤ budget | worst-case ≤ 300 ms | HIL timing logs | Real timing is R5-mandatory (SR-P-19, no sim substitute) |
| Real-time control loop worst-case | **≤ 20 ms** measured | 100% of cycles | HIL timing | SR-P-22/35 (CEC-01) |
| Compute power / energy | **≤ 10%** vs. measured | budget check | HIL power meter | SR-P-21, energy store sizing (SR-P-37) |
| Thermal (steady + throttle onset) | **≤ 5 °C** vs. measured; no throttle below budget | thermal gate | HIL thermal chamber | SR-C-12 at 45 °C + solar |

*R5 tolerances are largely "measure on real hardware" rather than "match a model", because timing, power, and thermal are exactly the quantities a twin should not be trusted to predict (they are R5/R6-mandatory).*

### 4.6 R6: Prototype/Field rung
R6 *is* reality, the ground truth against which R1 to R5 are validated, and the mandatory rung for the final acceptance claims (SR-A-01...04). Its "tolerance" is the requirement itself, measured statistically with the envelope coverage and confidence M14 specifies (SR-V-06, DD-84). The field/pilot is where grasp-bruise statistics, reliability, and cost-per-acre become *proven* rather than projected.

### 4.7 The binding rung (dominant-fidelity focus)
Applying EI-05 to fidelity: the **R3 contact/fluid rung is the binding one** for this machine, the grasp-bruise decision is both the most safety/economically consequential and the most fidelity-sensitive, and it is the rung CR-03 flagged as historically missing. Fidelity investment and validation effort concentrate on R3 (and its R6 confirmation), because that is where twin trust is both hardest to earn and most load-bearing. R1/R2 are comparatively easy to validate; R5 is measured, not modeled; R3 is where the simulation-first bet is won or lost.

---

## 5. Component-Model Specifications (the eleven twin-model interfaces)

Consolidated from each module's "deliverable to Doc G" specification. Each model states what it represents, its owning rung(s), its key parameters, and its validation gate (Section 4). Parameters marked `[RATIFIED-EST]` are engineering estimates; `[TBD-EXT]` await external data (datasheets, characterization).

### 5.1 Virtual-sensor models (SR-I-05, M3, R4)
Controlled model per sensor:
- **RGB-stereo (OAK-D-class):** FoV, ground sampling ≤ 2 mm/pixel, disparity noise -> depth noise σ_Z(Z) with σ_Z ≈ 8 mm at Z_pick = 0.6 m [RATIFIED-EST]; validate depth-noise model to ≤ 20% (Section 4.4).
- **NIR:** band selection [TBD-EXT], ripeness-signal model vs. maturity; validate signal to ≤ 10%.
- **GNSS/RTK + IMU:** pose-noise model (lateral ≤ 3 cm), bias/drift; validate covariance consistency.
- **Grasp force/pressure:** range [0, ~1000 N] / [0, ~400 kPa], resolution sufficient for closed-loop; validate to load cell.

### 5.2 Labeled-scene / synthetic-data generator (SR-I-06, SR-D-01, M4, R4)
Renders labeled scenes for training and perception regression: randomized parameters (lighting 1k to 100k lux, fruit size/pose/maturity, occlusion, dust, background), label formats (instance masks, 3-D pose, ripeness), and the real/synthetic split. Serves CEC-05 transfer; the transfer-validation gate is Section 6. *(Shared deliverable with Doc E for the synthetic-data pipeline governance.)*

### 5.3 Ground-truth oracle (SR-I-08, M5, R4/R6)
Exposes exact fruit and rover poses so localization error and covariance *consistency* are scored in SIL before field data; the standing localization regression. Validation: covariance χ² in band against R6 ground truth (Section 4.4).

### 5.4 Kinematic model (SR-I-12, M8, R1)
FK/IK (closed-form, edge-deployable), the Jacobian, the μ/γ singularity map, and a load-deflection (stiffness) model for σ_mech = 6 mm. Validate per Section 4.1 (position ≤ 3 mm, γ within 2°).

### 5.5 Contact/fluid model (SR-I-13, M9, R3: closes CR-03)
The critical model. Specifies: fluid-actuator dynamics (pressure->force, bandwidth), contact mechanics (Hertzian peak pressure vs. M2 thresholds, p_br ≈ 350 kPa), and the bruise/slip outcome model over the fruit distribution. Fidelity tier: R3. Validate per Section 4.3 (pressure ≤ 15%, force ≤ 10%, outcome ≥ 90% agreement, on real fruit). This model *is* the CR-03 resolution's engineering substance (DD-54, SR-V-03).

### 5.6 Mobility/stability/nav model (SR-I-15, M10, R2)
Rover-motion, CoG/stability (tip-over margin at slope), and navigation models, including slope × arm-swing coupling (DD-60). Validate per Section 4.2 (stability ≤ 10% conservative).

### 5.7 Power/thermal model (SR-I-17, M12, R5)
Per-subsystem draw and duty cycles, battery derating (DoD 0.8, temp 0.9), coincident-peak; thermal generation, R_thermal, solar, ambient (design 45 °C). Validate per Section 4.5 (power ≤ 10%, thermal ≤ 5 °C), largely measured on the bench/HIL, not trusted from the model alone.

### 5.8 Kinematic/HIL/policy/integration harnesses (SR-I-09/10/16, M6/M7/M11, R4/R5)
- **HIL rig (SR-I-09, M6):** twin streams synchronized sensor data to the real edge running the deployed stack; logs latency/power/temperature vs. budgets (R5).
- **Policy training environment (SR-I-10, M7):** RL/imitation env, state/action/reward interfaces, randomization distribution, episode protocols, and the reality-gap instrument (CEC-05).
- **Integration/HIL harness (SR-I-16, M11):** SIL + HIL node-graph, timing instrumentation, and the fault-injection suite (reused for M14 reliability and M15 safety).

### 5.9 System twin & fidelity-ladder (SR-I-18, SR-V-02, M13, R1 to R6)
The integrated twin composing Section 5.1 to 5.8, its six rungs (Section 3.1), and the per-rung validation gate (Section 4). Once each used rung passes its gate, the system twin is the **evidence source** for V&V (M14) and the safety case (M15/Doc E). This is the deliverable that makes simulation-first *rigorous*.

---

## 6. Sim-to-Real Pipeline & Transfer Validation (CEC-05)

Distinct from the fidelity ladder: CEC-05 governs the transfer of **learned behaviors** from sim to field.

### 6.1 The pipeline
Learned components (detection/ripeness M4, grasp policy M7) are trained in the twin with **domain randomization** (Section 5.2's randomized parameters) and transferred to the field. The pipeline: render randomized labeled data -> train -> validate transfer on real data -> deploy bounded (EI-07).

### 6.2 Transfer-validation gates
Transfer is **not trusted from sim alone**, real validation is a gate (SR-D-01/02):
| Learned component | Transfer gate | Basis |
|-------------------|---------------|-------|
| Detection/ripeness (M4) | recall gap sim->real ≤ 5 pts; recall ≥ 90% on real held-out | SR-P-13/20 |
| Grasp policy (M7/M9) | policy outputs within window on real fruit; bruise outcome validated at R3/R6 | SR-D-02, SR-P-29 |

### 6.3 Relationship to bounding
Transfer validation confirms the learned component is *good enough*; the bounding layer (EI-07) and independent monitor (EI-11) contain it regardless, so a transfer-gap failure degrades performance, never safety. CEC-05 (transfer) and CEC-06 (fidelity) together make the learned parts trustworthy: one earns the behavior, the other earns the evidence.

---

## 7. HIL Architecture (R5)

The hardware-in-the-loop rig is the bridge between sim and field: the twin generates the world, the **real edge device and (progressively) real actuators** run against it, and the rig measures exactly the R5-mandatory quantities, real timing, power, thermal, deployed-stack behavior, that a twin must not be trusted to predict. HIL precedes prototype commitment (DD-82): it catches throttling, latency violations, and integration faults before hardware is built, at sim cost. The fault-injection suite (SR-I-16) runs here for reliability (M14) and safety (M15) evidence.

---

## 8. Evidence-Admissibility Rules (what V&V and the safety case consume)

The operational output of Doc G, the rules M14/M15/Doc E apply to every claim:

1. **A twin result is admissible evidence only at a validated rung.** If the rung has not passed its Section 4 acceptance gate, the result is an estimate, not evidence (CEC-06).
2. **Match the rung to the claim (Section 3.3).** A grasp-bruise claim (R3->R6) verified only at R1 is inadmissible, over-trust.
3. **Field-mandatory claims cannot be closed in the twin.** Grasp-bruise statistics, reliability over a season, and cost-per-acre require R6 (SR-A-01...04, SR-V-06).
4. **State the rung and its validation with every claim.** The V&V matrix (DD-83, SR-V-05) records, per requirement: evidence, rung, validation status, confidence.
5. **The binding rung (R3) gates the grasp evidence.** Until R3 passes on real fruit, the machine's central function is proven only to an estimate, flagged honestly (EI-15).

These rules are what make "verified in the twin" a *defensible* statement rather than an optimistic one, the discipline CEC-06 exists to enforce.

---

## 9. Conflict-Register Status (Doc G's closure)

| CR | Issue | Doc G's role |
|----|-------|--------------|
| **CR-03** | Twin has no fluid/contact fidelity vs. simulation-first doctrine | **Engineering closure completed here.** M9 specified the contact/fluid model; M13 integrated/validated it into the system twin; **Doc G Section 4.3 + Section 5.5 ratify its validation tolerances and acceptance gate**, the R3 rung is now a specified, tolerance-bounded, field-validatable evidence source. CR-03 is resolved in doctrine (M13) and made concrete in engineering (Doc G). |
| CR-05 | "No cloud in control loop" vs. cloud for training | Reaffirmed: training/synthetic-data (Section 5.2, Section 6) is development-time, outside the runtime boundary (Doc B Section 9.1, CEC-04). |

---

## 10. Traceability (twin interfaces -> rungs -> requirements -> hardware)

Each twin model mirrors a specific piece of Doc C hardware (the **HW (Doc C)** column) and validates specific Doc B requirements, closing the loop across all three baselines.

| Interface | Model (Section 5) | Rung(s) | Validates requirement(s) | HW (Doc C) |
|-----------|-----------|---------|--------------------------|------------|
| SR-I-05 | Virtual sensors | R4 | SR-P-09/10/11 | Section 3.3 stereo+NIR |
| SR-I-06 | Synthetic data | R4 | SR-D-01, SR-P-13 | Section 3.3 perception |
| SR-I-08 | Ground-truth oracle | R4/R6 | SR-P-16, SR-F-08 | Section 3.4 localization |
| SR-I-09 | HIL rig | R5 | SR-P-19/21/22, SR-C-06 | Section 3.5 edge |
| SR-I-10 | Policy training env | R4 | SR-D-02 | Section 3.5 edge |
| SR-I-12 | Kinematic model | R1 | SR-P-25/26, SR-C-07 | Section 3.1 manipulator |
| **SR-I-13** | **Contact/fluid model** | **R3** | **SR-P-05/06/29/30, SR-V-03 (CR-03)** | **Section 3.2 fluid power** |
| SR-I-15 | Mobility/stability/nav | R2 | SR-C-09, SR-P-33/34 | Section 2 platform |
| SR-I-16 | Integration/HIL harness | R5 | SR-P-35, SR-F-15/16 | Section 3.5/3.7 edge+safety |
| SR-I-17 | Power/thermal model | R5 | SR-P-37/38, SR-C-12 | Section 3.6 power |
| SR-I-18 | System twin | R1 to R6 | SR-V-01/02, SR-A-02 | all |

Every twin interface Doc B deferred is now specified, assigned a rung, given a validation tolerance (Section 4), traced to the requirements it validates, and **linked to the Doc C hardware it mirrors**, the tightly-coupled, bidirectionally-traceable B<->C<->G baseline.

---

## 11. Baseline & Change Control

- **Baseline status:** Doc G **Rev 1.0, frozen configuration-controlled baseline (approved).** This is the controlling twin/fidelity baseline; changes hereafter are controlled and versioned.
- **Consistency:** every model and rung traces to a frozen module's "deliverable to Doc G" spec; no new architecture. Validation tolerances (Section 4) are `[RATIFIED-EST]` engineering targets flagged as such.
- **Dependencies (bidirectional):** validates **against Doc B**'s ratified targets; **mirrors Doc C**'s physical hardware, the twin's component models (Section 5) represent the Doc C configuration, and the R3 contact-mechanics characterization (Section 4.3/Section 5.5) is the *same* item Doc C Section 5 owns as a hardware activity (one measurement, two consumers). Supplies evidence-admissibility rules **to Doc E** (safety) and to M14's V&V. The physical data that *sets* the `[TBD-EXT]` values (NIR band, real fruit contact data, stereo depth-noise, battery derating) comes from **Doc C** characterization and the pilot. Traceability is bidirectional: Doc C Section 5/Section 6 point to Doc G rungs; Doc G Section 5/Section 10 point to Doc C hardware.
- **What changes when a rung is validated:** the tolerance's status moves from `[RATIFIED-EST]` (target) to validated (measured), and any claim resting on that rung becomes admissible evidence. The *structure*, rungs, admissibility rules, traceability, is stable.

---

## Concise quality summary (honest self-assessment)

**Strengths.** Doc G makes the curriculum's simulation-first philosophy **rigorous rather than merely simulated**: it harvests the eleven "deliverable to Doc G" specifications the modules already wrote into one authoritative twin architecture (Section 2, Section 5), lays out the **six-rung fidelity ladder** (Section 3) with a concrete **decision -> minimum-admissible-rung map** (Section 3.3), and, the key deliverable, **ratifies per-rung validation tolerances and acceptance gates** (Section 4) that turn "verified in the twin" into a defensible, tolerance-bounded claim. It identifies the **R3 contact/fluid rung as the binding one** (EI-05 applied to fidelity) and gives it the engineering substance that **completes the CR-03 closure** (Section 4.3, Section 5.5, Section 9): the rung CR-03 flagged as missing is now specified, tolerance-bounded, and field-validatable. It keeps CEC-05 (learned-behavior transfer) and CEC-06 (any model-based decision) properly distinct (Section 6), and its **evidence-admissibility rules** (Section 8) are the operational output M14 and Doc E consume. Every interface, rung, and tolerance traces to a frozen module (Section 10); no architecture was invented.

**Known weaknesses / items for your review.**
1. **The Section 4 tolerances are engineering estimates `[RATIFIED-EST]`.** They are defensible targets (chosen relative to the budgets they protect, e.g., R1 ≤ 3 mm sits below σ_mech = 6 mm; R3 ≤ 15% keeps the bruise margin meaningful), but the *actual* validation campaign confirms or revises them. They are targets for the twin's validation, not measured reality.
2. **R3 validation is specified, not yet performed.** The contact/fluid rung's gates require real fruit + instrumented gripper data; until that campaign runs, grasp-bruise claims remain estimates (honestly flagged), this is the real critical-path item for the whole simulation-first bet.
3. **Some model parameters are `[TBD-EXT]`** (NIR band, real contact-mechanics coefficients), they resolve with Doc C characterization and the pilot.
4. **The twin's software implementation is out of scope**, Doc G is the specification; building the twin to it is a production asset.

I have not scored this against the 9.5 bar, that judgment is yours. Item 2 (R3 validation) is the single most load-bearing future action for the curriculum's evidence claims.

**END OF DOC G, frozen Rev 1.0.**
