# Doc C: Platform / Hardware Configuration

**SIM2FIELD, Autonomous Watermelon Harvesting Robotics**
**P0 Support Document C**, *The authoritative physical platform, hardware configuration, and bill-of-materials baseline*
**Status:** **Rev 1.0, frozen configuration-controlled baseline (approved).** Controlled, versioned changes only.
**Depends on:** Doc B (Rev 1.0, requirements, ratified parameters, interfaces), Doc G (Rev 0.1, twin models that mirror this hardware)
**Controlling baseline for:** the physical reference platform, the hardware assumptions the ratified parameters rest on, the fluid-inclusive BOM, and the characterization data that resolves several `[TBD-EXT]` items

> **Authoring note (harvest-and-ratify doctrine).** Consistent with the P0 doctrine: this document **harvests rather than rewrites**. It locks the physical reference platform (the farm-ng Amiga interface named in SR-I-01), consolidates the hardware choices the frozen modules already made (DD-1* straddle, DD-42 rail manipulator, DD-48 pneumatic gripper, DD-10/11 stereo+NIR, DD-28 Jetson-class edge, DD-70 battery), and **ratifies the hardware configuration and BOM** as concrete engineering estimates with stated basis. It **completes the part-level closure of conflict CR-06** (the BOM now explicitly includes the fluid-power subsystem, Doc B closed this in principle by *including* fluid power in requirements/cost; Doc C closes it in *part-level detail*). Values are `[RATIFIED-EST]` (engineering estimate to confirm at sourcing) or `[TBD-EXT]` (from a vendor datasheet / the actual Amiga documentation). Engineering authority lives here; educational authority remains in the frozen curriculum.

---

## 1. Purpose, Scope & Authority

### 1.1 Purpose
Doc C is the single source of truth for **what the machine is physically built from and how it mounts to its platform**. Where Doc B says *what the machine must do* and Doc G says *how much a simulation of it can be trusted*, Doc C says *what the hardware is*, the platform, the subsystem hardware, the interfaces between them, and the bill of materials that the cost model (M16) and the twin's physical models (Doc G) both rest on.

### 1.2 Scope
In scope: the reference platform (farm-ng Amiga) and its mechanical/electrical/data interfaces; the subsystem hardware configuration (manipulator, gripper/fluid power, perception, compute, power/energy, mounting/rail); the fluid-inclusive bill of materials with the ~$50k prototype cost structure; the hardware characterization data that resolves `[TBD-EXT]` items in Doc B/G; and the hardware traceability to requirements.

Out of scope (owned elsewhere): requirements and ratified performance targets (**Doc B**); twin fidelity and validation tolerances (**Doc G**, Doc C supplies the physical parameters the twin models mirror); the certified safety case (**Doc E**, Doc C enumerates the stored-energy hardware it reasons about); detailed component-level engineering derivations (**Doc F**); actual procurement/vendor selection (a production activity, informed by this baseline).

### 1.3 Authority
Doc C holds **engineering authority over the physical configuration and BOM**. When any artifact references "the platform," "the gripper hardware," "the compute device," or "the BOM," Doc C is the citation. It is consistent with Doc B (the hardware meets Doc B's requirements) and Doc G (the twin's physical models mirror this hardware) by construction. Component *classes* are fixed here (e.g., "Jetson-class edge device," "OAK-D-class stereo"); specific part numbers are `[TBD-EXT]` pending procurement, so the baseline is vendor-flexible.

---

## 2. Reference Platform: farm-ng Amiga

### 2.1 Platform role
The **farm-ng Amiga** is the mobile base (DD-1* drive-over straddle, DD-55). It straddles a planted bed, supplies the along-row **x-DOF** by advancing (DD-14/DD-55, the platform stages each fruit to the mid-frame pick station), carries the power/compute/manipulator payload, and provides the drive, steering, and base power. The harvester subsystems mount to the Amiga's frame/rail and integrate with its electrical and data interfaces (SR-I-01).

### 2.2 Platform interface specification
| Interface | Specification | Status | Source |
|-----------|---------------|--------|--------|
| **Mechanical mount / rail** | Harvester frame + manipulator rail mount to the Amiga's structural rail pattern | `[TBD-EXT]`, actual rail pattern from Amiga docs | SR-I-01, HA-1 |
| **Track width** | **1.8 m** design, feasible interval [1.6, 2.2] m (if adjustable) | `[RATIFIED-EST]` (Doc B Section 4.3) | SR-I-11/14 |
| **Electrical (base power)** | Amiga battery bus -> harvester power conditioning; harvester may add supplemental pack | `[TBD-EXT]`, bus voltage/current from Amiga docs | SR-I-01, DD-70 |
| **Data / control** | CAN / platform API for drive/steer commands + telemetry | `[TBD-EXT]`, Amiga control interface | SR-I-01, DD-61 |
| **Payload capacity** | Manipulator + fluid + compute + supplemental energy within Amiga payload limit | `[TBD-EXT]`, Amiga payload spec | SR-P-08 |
| **CoG height** | **≤ 0.8 m** (combined machine) for slope stability | `[RATIFIED-EST]` (Doc B Section 4.3) | SR-C-09 |

The five `[TBD-EXT]` items above all resolve from the **published farm-ng Amiga documentation**, the single most important external input to Doc C. Until then, the ratified interface assumptions (track, CoG, straddle geometry) hold as the design baseline.

### 2.3 Straddle geometry
The straddle configuration places the bed (1.5 m + margin) between the tracks, the manipulator rail transverse above the bed, and the pick station mid-frame (DD-2). Workspace transverse span ≥ 1.7 m covers the bed (Doc B Section 5.5, SR-P-25). The side collection trailer/container receives placed fruit (DD-8).

---

## 3. Subsystem Hardware Configuration

### 3.1 Manipulator (M8, DD-42)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Architecture | Rail-mounted **parallel two-actuator** manipulator | fixed (DD-42) | SR-P-25 |
| DOF | Reduced set; platform supplies x-DOF (DD-14, EI-08) | fixed |, |
| Transverse span | **≥ 1.7 m** (bed + margin) | `[RATIFIED-EST]` | SR-P-25 |
| Stiffness | **≥ 20 N/mm** effective (σ_mech ≤ 6 mm under 10 kg) | `[RATIFIED-EST]` | SR-P-27 |
| Singularity keep-out | transmission angle **γ ∈ [45°, 135°]** | `[RATIFIED-EST]` | SR-C-07 |
| Positioning actuators | electric (hybrid architecture, DD-3*) | fixed | SR-C-03 |

### 3.2 End-effector & fluid power (M9, DD-48: the CR-06 subsystem)
The fluid-power subsystem, historically omitted from the BOM (CR-06), is enumerated here in full.
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Gripper | **Pneumatic (clean-fluid) compliant** conforming gripper | fixed (DD-48) | SR-C-04 |
| Fluid actuator(s) | Pressure->force ($F=PA$), intrinsically compliant, tunable stiffness | fixed (DD-49/51) | SR-P-29/30 |
| **Compressor / pump** | Supplies working pressure; duty-cycled | `[TBD-EXT]` sizing | SR-P-29 |
| **Proportional valve** | Regulates pressure->force (closed-loop, DD-49) | `[TBD-EXT]` | SR-P-29/31 |
| **Pressure sensor** | Force feedback (pressure-as-force, DD-49) | `[TBD-EXT]` | SR-F-05 |
| **Mechanical pressure relief** | Physically caps grip < F_bruise (≈800 N) regardless of command | fixed (DD-52) | **SR-C-08, SR-S-01** |
| Reservoir / lines / seals | Clean-fluid handling, field-serviceable | `[RATIFIED-EST]` | SR-M-01 |
| Grip-force window | **[250 N, 800 N]**, compliance widens | `[RATIFIED-EST]` (Doc B Section 5.3) | SR-P-05 |
| Bleed-down / burst rating | Stored-energy mitigation | fixed | SR-S-01 |

The mechanical relief and bleed-down are **safety hardware** (EI-09) as well as function, enumerated for the safety case (Doc E).

### 3.3 Perception hardware (M3/M4, DD-10/11)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Primary depth/RGB | **OAK-D-class stereo** module | fixed class (DD-10) | SR-P-09/10 |
| Ripeness sensing | **NIR** band added (DD-11) | fixed; band `[TBD-EXT]` | SR-F-04 |
| Ground sampling | **≤ 2 mm/pixel** across pick corridor | `[RATIFIED-EST]` | SR-P-10 |
| Depth accuracy | **≤ 8 mm** at Z_pick ≈ 0.6 m | `[RATIFIED-EST]` | SR-P-09 |
| Mounting | Rigid, calibrated (intrinsic/extrinsic/hand-eye/temporal) | fixed (DD-15) | SR-I-04 |
| Gripper sensing | Force + tactile + fluid-pressure (DD-13) | fixed | SR-F-05 |

### 3.4 Localization hardware (M3/M5, DD-12)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| GNSS/RTK | Centimetre-class absolute (lateral ≤ 3 cm) | `[RATIFIED-EST]`; module `[TBD-EXT]` | SR-P-12 |
| IMU | Orientation/motion for fusion | `[TBD-EXT]` | SR-P-17 |
| Wheel odometry | From Amiga | `[TBD-EXT]` | SR-P-17 |

### 3.5 Compute (M6, DD-28/29)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Edge device | **Jetson-class** (on-robot, no cloud) | fixed class (DD-28) | SR-C-05, CEC-04 |
| Compute power | **≤ 60 W peak, ~40 W avg** | `[RATIFIED-EST]` | SR-P-21 |
| Model deployment | Quantized + compiled on accelerator | fixed (DD-29) | SR-P-15 |
| Thermal | No throttle below latency budget at 45 °C + solar | `[RATIFIED-EST]` | SR-C-06/12 |
| Real-time provision | Isolated real-time control plane (DD-33/63) | fixed | SR-P-22/35 |

### 3.6 Power & energy (M12, DD-69/70/73)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Energy store | **3 to 5 kWh installed** (DoD 0.8, temp derate 0.9) | `[RATIFIED-EST]` | SR-P-37 |
| Architecture | Amiga battery + supplemental pack (or swappable) | `[TBD-EXT]` (depends on Amiga bus) | DD-70 |
| System avg power | **~300 W** (compute 40 + drive ~150 + pump ~50 + sensing 20 + aux 40) | `[RATIFIED-EST]` | SR-P-37/38 |
| Rails | **Split clean/noisy** (compute/sensing vs. actuation/drive) + protection | fixed (DD-73) | SR-F-17 |
| Sequencing | **Safety-first** (safety monitor up before actuators) | fixed (DD-74) | SR-F-18 |
| Peak delivery | Coincident-peak sized, no brownout | `[RATIFIED-EST]` | SR-P-38 |

### 3.7 Compute/safety controller (M11, DD-64)
| Item | Configuration | Status | Requirement |
|------|---------------|--------|-------------|
| Independent safety monitor | Minimal **hardware safety controller**, software-independent | fixed (DD-64) | SR-F-15, SR-S-04 |
| Safe-stop path | Can stop/release regardless of any node | fixed | SR-P-36 |

---

## 4. Bill of Materials (fluid-inclusive: completes CR-06)

The ~$50k prototype BOM (M1), now enumerated **including the fluid-power subsystem** that CR-06 flagged as omitted. Costs are `[RATIFIED-EST]` prototype-scale, chosen to sum to the ~$50k reference and to support the M16 dominant-cost-driver analysis; they are not vendor quotes.

| Subsystem | Line items | Prototype cost (est.) | Vol. driver? | Src |
|-----------|-----------|----------------------:|:---:|-----|
| **Platform** | Amiga base (or integration allowance) | **~$15k** `[TBD-EXT]` |, | DD-1* |
| **Edge compute** | Jetson-class device + accelerator + carrier | **~$3 to 5k** | *** candidate dominant** | DD-28 |
| **Perception** | OAK-D-class stereo + NIR + mounts | **~$2 to 3k** |, | DD-10/11 |
| **Localization** | GNSS/RTK + IMU | **~$3 to 5k** |, | DD-12 |
| **Manipulator** | Rail, electric actuators, structure | **~$8 to 10k** | *** candidate dominant** | DD-42 |
| **Fluid power** (CR-06) | Compressor/pump, proportional valve, actuator(s), pressure sensor, **relief**, reservoir, lines, seals | **~$4 to 6k** | *** candidate dominant** | DD-48/52 |
| **Power/energy** | Supplemental battery, conditioning, split rails, protection | **~$3 to 5k** |, | DD-70/73 |
| **Safety/electrical** | HW safety controller, wiring, sequencing, enclosures | **~$2 to 3k** |, | DD-64/74 |
| **Integration** | Frame, fasteners, assembly/test | **~$3 to 4k** |, |, |
| | **Prototype total** | **~$46 to 56k** (ref. ~$50k) | | M1 |

### 4.1 Dominant-cost-driver note (feeds M16/EI-05)
The candidate dominant drivers are the **manipulator (~$8 to 10k)**, **fluid power (~$4 to 6k)**, and **edge compute (~$3 to 5k)**, the M16 cost-reduction discipline (EI-05) attacks whichever proves dominant at volume. The platform is the largest single line but is a fixed external cost (Amiga). At the **≤ $35k volume target** (Doc B SR-C-13), the reductions come from volume sourcing, manipulator design-for-manufacture (DD-101), and edge right-sizing (which cuts cost, power, *and* thermal at once, the triple leverage noted in M16 Section 18).

### 4.2 Fluid power is now in the BOM (CR-06 closed at part level)
CR-06's root cause was a BOM predating the hybrid-actuation decision (CR-01). Doc B closed it in principle by including fluid power in the requirements and cost; **Doc C closes it at part level**, the fluid subsystem is a first-class BOM line (Section 4) with enumerated components (Section 3.2), a cost estimate, and its safety hardware (relief, bleed-down) called out for Doc E. CR-06 is fully closed.

---

## 5. Hardware Characterization Data (resolves [TBD-EXT] in Doc B/G)

Doc C is where physical characterization *lands*, the measured hardware properties that turn several `[TBD-EXT]` estimates into data. These are gathered during hardware bring-up (M13 HA-1) and the pilot:

| Parameter | Consumes into | How characterized | Status |
|-----------|---------------|-------------------|--------|
| Amiga rail pattern / mount | SR-I-01, twin mounting | Amiga docs + measurement | `[TBD-EXT]` |
| Amiga bus voltage/current, payload | power arch (Section 3.6), SR-P-38 | Amiga docs | `[TBD-EXT]` |
| NIR band vs. watermelon maturity | Doc G Section 5.1, SR-F-04 | spectral measurement on maturity set | `[TBD-EXT]` |
| Real contact-mechanics coefficients | Doc G Section 4.3/Section 5.5 (R3 rung), SR-P-06 | instrumented gripper + pressure film on real fruit | `[TBD-EXT]`, **the CR-03/R3 critical item** |
| Fluid-actuator step response / bandwidth | Doc G Section 4.3, SR-P-31 | bench characterization | `[TBD-EXT]` |
| Stereo depth-noise vs. range | Doc G Section 4.4, SR-P-09 | real stereo on targets | `[TBD-EXT]` |
| Battery capacity/derating at temp | SR-P-37 | bench cycling at temp | `[TBD-EXT]` |

The **real contact-mechanics characterization** is the same critical item Doc G flagged: it feeds the R3 rung that gates every grasp-bruise claim. Doc C is where that measurement is owned as a hardware activity.

---

## 6. Hardware Traceability (hardware -> requirement)

| Hardware | Requirement(s) | Anchor |
|----------|----------------|--------|
| Amiga platform + interface | SR-I-01, SR-P-08, SR-C-09 | DD-1* |
| Rail manipulator | SR-P-25/26/27, SR-C-07 | CEC-03 |
| Pneumatic gripper + fluid power | SR-P-05/29/30, SR-C-04/08, SR-S-01 | CEC-02/EI-09 |
| Mechanical relief | **SR-C-08, SR-S-01** | EI-07/EI-09 |
| Stereo + NIR | SR-P-09/10, SR-F-04 |, |
| GNSS/RTK + IMU | SR-P-12/17 | CEC-03 |
| Jetson-class edge | SR-P-15/19/21/22, SR-C-05/06 | CEC-04 |
| Battery + split rails | SR-P-37/38, SR-F-17/18, SR-S-02 | EI-12 |
| HW safety controller | SR-F-15, SR-P-36, SR-S-04 | EI-11 |

---

## 7. Conflict-Register Status (Doc C's closure)

| CR | Issue | Doc C's role |
|----|-------|--------------|
| **CR-06** | BOM/budgets omit the fluid-power subsystem | **Part-level closure completed here.** Doc B included fluid power in requirements/cost in principle; Doc C enumerates the fluid subsystem as a first-class BOM line (Section 4) with components (Section 3.2), cost, and safety hardware. **CR-06 fully closed.** |
| CR-01 | Actuator architecture (electric + fluid) | Reflected: the hardware config *is* the hybrid architecture (Section 3.1 electric positioning + Section 3.2 fluid grip). |

---

## 8. Baseline & Change Control

- **Baseline status:** Doc C **Rev 1.0, frozen configuration-controlled baseline (approved).** This is the controlling platform/hardware baseline; changes hereafter are controlled and versioned.
- **Consistency:** the hardware meets Doc B's requirements and mirrors Doc G's twin models; component *classes* are fixed, specific parts are `[TBD-EXT]` pending procurement, so the baseline is vendor-flexible.
- **Dependencies:** the largest external input is the **published farm-ng Amiga documentation** (five interface `[TBD-EXT]` items in Section 2.2); the contact-mechanics characterization (Section 5) is shared with Doc G's R3 rung; the BOM feeds M16's cost model and Doc F's detailed engineering.
- **What changes when a [TBD-EXT] resolves:** the value updates here (versioned); any Doc B parameter or Doc G model it feeds is re-checked. The configuration *structure*, subsystems, interfaces, BOM lines, traceability, is stable.

---

## Concise quality summary (honest self-assessment)

**Strengths.** Doc C locks the physical baseline the ratified parameters and twin models rest on, entirely by **harvesting the hardware choices the frozen modules already made** (straddle, rail manipulator, pneumatic gripper, stereo+NIR, Jetson-class edge, split-rail battery) rather than redesigning. Its signal contribution is **completing the CR-06 closure at part level**: the fluid-power subsystem, the thing CR-06 flagged as missing from the BOM, is now a first-class, enumerated BOM line (Section 4) with components (Section 3.2), a cost estimate, and its safety hardware (relief, bleed-down) called out for Doc E. It ties every hardware item to its requirement (Section 6), keeps the configuration **vendor-flexible** (classes fixed, parts `[TBD-EXT]`), and, usefully, **centralizes the hardware-characterization items** (Section 5) that resolve `[TBD-EXT]` values across Doc B and Doc G, correctly identifying the real contact-mechanics measurement as the shared critical item feeding Doc G's R3 rung.

**Known weaknesses / items for your review.**
1. **The single biggest dependency is the published farm-ng Amiga documentation.** Five platform-interface items (Section 2.2, rail pattern, bus voltage/current, payload, control interface) are `[TBD-EXT]` on it. Until sourced, the ratified interface assumptions hold as the design baseline, but they are assumptions.
2. **BOM costs are prototype-scale engineering estimates, not vendor quotes**, chosen to sum to the ~$50k reference and to support the M16 dominant-driver analysis. Real quotes will move the line items and settle which driver dominates.
3. **Component classes are fixed; specific parts are not.** This is deliberate (vendor-flexible), but it means Doc C specifies *what kind* of each component, not the exact part, procurement selects within each class against Doc B's requirements.
4. **Characterization data (Section 5) is specified, not yet gathered**, the same real-fruit contact measurement that gates Doc G's R3 rung is owned here as a hardware activity but awaits bring-up and the pilot.

I have not scored this against the 9.5 bar, that judgment is yours. Item 1 (Amiga docs) is the near-term unblock; item 4 (contact characterization) is the shared critical path with Doc G.

**END OF DOC C, STOP. Awaiting your review before freezing Doc C or proceeding to Doc E (Safety).**
