# Module 3: Sensing Modalities & Sensor Physics

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M3, **Part II, Perceive**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation (virtual sensor models) + Digital Twin, this module *defines the virtual-sensor models* the twin needs
**Prerequisites:** M1 (systems framing, budgets, the Signal-to-Action Spine), M2 (fruit/field physics, ripeness cues, the Grip-Force Window). Math: linear algebra, trigonometry.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Authored consistent with frozen **Module 1 Rev 1.1** and **Module 2 Rev 1.1**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. P0-document authority is tagged **[->Doc B]**, **[->Doc G]**, **[->Doc H]**, **[->Doc I]**; perishable/vendor values are tagged **[VERIFY@PUB]**. Core Engineering Concepts are cited per the [register](curriculum/_core-concepts.md).

> *Core concept in use.* This module opens the **Perceive** stage of **CEC-01 (the Signal-to-Action Spine)**. Its entire job is to choose the physical measurements from which the later Perceive modules (M4 detection, M5 localization) will build the 3-D target the **Act** stage consumes.

---

## 1. Module Overview

**Mission.** This module decides how to sense the mature watermelon: which physical signals to measure, with which sensors, at what accuracy, and why. It is the first module of the Perceive stage, and it establishes the raw material every downstream perception and control decision consumes.

**Previous milestone.** A robot cannot act on what it cannot sense. Module 2 told us what must be perceived: a mature watermelon's presence, ripeness, and 3-D pose, hidden in a variable canopy under outdoor light.

**Engineering problem.** The engineering discipline here is sensor selection from first principles, working backward from a sensing requirement to the physical property that carries the information to the sensor that transduces it, rather than forward from a catalog of hardware. We treat sensors the way a systems engineer must: as instruments with quantifiable resolution, accuracy, noise, bandwidth, field of view, range, and field robustness, each of which propagates into the machine's performance budgets.

**Design tension.** The module's central quantitative result is the stereo depth-accuracy relation: depth uncertainty grows with the square of range, δZ ∝ Z²/(f·b). This single relation drives where the camera is mounted, how wide the stereo baseline must be, and how close the fruit must be before a grasp can be trusted, and it feeds directly into the placement error budget introduced in Module 1. It is also our first formal encounter with a concept we are watching for Core designation: the error budget (see Section 7.5 and the explicit CEC evaluation in Section 11.3).

**What this module resolves.** By the module's end you will be able to specify a sensing suite for the harvester, primary depth-and-color perception, ripeness sensing, localization sensing, and the tactile/force sensing that closes the grasp loop, and to justify each choice against a requirement traceable to the fruit, the field, and the two Core Engineering Concepts already established.


## 2. Learning Objectives

- **LO-M3.1** Explain the sensing chain (physical property -> transduction -> signal -> information) and derive sensing requirements from the perception and control needs of the machine., *Bloom: Understand (with Analyze)*
- **LO-M3.2** Apply the thin-lens and field-of-view relations to size a camera's coverage, resolution, and ground sampling for the pick corridor., *Bloom: Apply*
- **LO-M3.3** Derive stereo depth and its error, δZ ∝ Z²/(f·b), and size a stereo baseline for a required depth accuracy at the pick range., *Bloom: Analyze*
- **LO-M3.4** Compare sensing modalities (passive stereo, structured light, LiDAR/ToF, spectral/NIR, acoustic, GNSS/IMU, tactile) and justify a suite against field constraints., *Bloom: Evaluate*
- **LO-M3.5** Specify intrinsic, extrinsic (including hand-eye), and temporal calibration procedures and explain how calibration error enters the placement error budget., *Bloom: Apply (with Analyze)*
- **LO-M3.6** Specify the virtual-sensor models (FoV, range, noise) the digital twin requires to test perception simulation-first., *Bloom: Create*

Maps to course objectives **LO3** (primary), **LO2** (reinforcing), and ABET **SO1, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Turn a perception need into quantified sensor requirements (accuracy, FoV, rate, spectral band, force range)., *Bloom: Create*
2. Size a camera's FoV, resolution, and ground sampling for a stated working distance., *Bloom: Apply*
3. Compute stereo depth error at range and choose a baseline that meets a depth-accuracy requirement., *Bloom: Analyze*
4. Select a sensing suite for an outdoor field robot and defend it against sunlight, dust, and range limits., *Bloom: Evaluate*
5. Specify a calibration procedure and trace its residual error into the placement budget., *Bloom: Apply (with Analyze)*
6. Specify virtual-sensor models for the twin and state what each must reproduce to be trustworthy., *Bloom: Create*

---

## 4. Engineering Motivation

Perception failures, the first item in Module 1's failure taxonomy, usually begin not in the neural network but in the **sensor**. A detector cannot recover information the sensor never captured: if the camera is blinded by sun, if depth is too noisy at the fruit's range, if the spectral band that reveals ripeness was never measured, then no amount of downstream cleverness recovers the lost signal. The quality ceiling of the entire Perceive stage is set here, at the physics of measurement.

Consider what the machine actually demands of its senses. It must find a green fruit against green leaves in full sun and deep shade, a demand on *dynamic range and spectral content*. It must know the fruit's position accurately enough to land a grasp inside the Grip-Force Window's spatial capture tolerance, a demand on *depth accuracy*, and stereo depth degrades with the square of distance, so this demand dictates geometry. It must judge ripeness, which lives partly *inside* the fruit, a demand for sensing beyond the visible. It must know where the rover is in the row, a demand on *localization sensing*. And it must feel how hard it is squeezing so it can stay inside the Grip-Force Window, a demand for *tactile and force sensing* that the earlier modules named but did not provide.

Each of these is a physics problem before it is an algorithm problem. Choose the wrong modality and the field defeats it: structured-light and time-of-flight depth sensors, so effective indoors, are overwhelmed by sunlight; a single RGB channel cannot see the internal water content that signals ripeness; a depth sensor with too short a baseline cannot resolve the fruit's position at a useful standoff. The motivation for this module is simple and strict: **get the physics of sensing right, or everything built on top of it inherits an unfixable deficit.**

---

## Engineering Failure Cases (sensing-specific)

Sharpening Module 1's *perception* and *environmental* failure classes to their root at the sensor:

- **Blinded or washed-out sensing (environmental -> perception).** Direct sun, glare off a wet rind, or deep shade drives the sensor outside its usable dynamic range; the fruit is invisible not to the algorithm but to the pixel. *Motivates* the dynamic-range, exposure, and modality-robustness analysis in Section 6, Section 7 and the outdoor-first modality trade in Section 11.
- **Depth-starved localization (perception -> localization).** The depth sensor's noise at the fruit's standoff exceeds the accuracy the grasp needs; the 3-D target handed to M5 is too uncertain to land inside the capture tolerance. *Motivates* the stereo depth-error relation (Section 7.3) and its feed into the error budget (Section 7.5), and drives camera placement.
- **Missing-modality ripeness error (perception).** The suite never measured the physical signal that distinguishes mature from immature fruit, so ripeness classification is guessing. *Motivates* the multi-cue sensing requirement (from Module 2's CEC-linked ripeness catalog) and the spectral/acoustic modality discussion.
- **Uncalibrated frame error (integration -> localization).** Intrinsics, stereo extrinsics, or hand-eye calibration drift, so a perfectly detected pixel maps to the wrong place in the robot frame. *Motivates* the calibration procedures of Section 6.6/Section 7 and their explicit entry into the placement budget.

Every one of these is a preventable sensor-physics failure, and each maps to a design activity in this module.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** linear algebra and rigid-body transforms at an introductory level (used for frames and calibration); trigonometry (used for FoV and triangulation); the M1 budget/spine vocabulary; the M2 ripeness-cue catalog and the Grip-Force Window (which sets the force-sensing requirement).

**Introduced here, used later:** the vocabulary of sensing, *resolution, accuracy vs. precision, noise, SNR, dynamic range, bandwidth/latency, field of view, ground sampling distance, disparity, baseline, intrinsic/extrinsic/hand-eye calibration, spectral band*. Optics and stereo geometry are developed at applied (L2) level; full radiometry and camera-model derivations are referenced [->Doc H notation].

**Where this sits in the dependency graph.** M3 hard-depends on M1 and M2. It **masters** sensor physics & selection; **introduces** the tactile/force/pressure-sensing that the grasp loop needs (a hand-off to M9 and CEC-02); **reinforces** the 3-D geometry thread (feeding M5) and the power/electrical thread (sensor interfaces, feeding M12). It hands the chosen sensor suite and its error characteristics forward to M4 (the model input space), M5 (localization and fusion), M6 (compute load of the sensor stream), M9 (grasp force sensing), and M12 (electrical integration).

---

## 6. Theory

### 6.1 The sensing chain and sensor characteristics
A sensor converts a **physical property** into a **signal** through a **transduction** mechanism, from which the system extracts **information**. Every link degrades the signal, and a systems engineer characterizes each sensor by a fixed vocabulary that propagates into budgets:

- **Resolution**, the smallest distinguishable change (spatial, spectral, or force).
- **Accuracy vs. precision**, closeness to truth vs. repeatability; both matter, and calibration targets accuracy while noise governs precision.
- **Noise & SNR**, random fluctuation; the signal-to-noise ratio bounds what any downstream algorithm can recover.
- **Dynamic range**, the span from smallest to largest measurable signal; the crux of the outdoor sun/shade problem.
- **Bandwidth / latency**, how fast the sensor reports; latency spends the cycle-time budget (CEC-01) and can stale a target's position before the grasp closes.
- **Field of view & range**, the spatial extent and depth over which the sensor is useful.
- **Field robustness**, tolerance to dust, moisture, vibration, temperature, and light.

Sensor selection is the disciplined act of matching these characteristics to requirements, never choosing hardware before the requirement is quantified.

### 6.2 Optical imaging and the thin-lens model
The primary perception sensor is a camera. The thin-lens model relates focal length $f$, sensor dimension $s$, and the **field of view** by $\text{FoV} = 2\arctan\!\big(s/2f\big)$. Combined with pixel count, this fixes the **ground sampling distance** (how many millimetres of fruit each pixel spans) at a working distance, the spatial resolution the detector (M4) inherits. Depth of field, exposure, and dynamic range determine whether the fruit is in focus and correctly exposed across the field's lighting extremes. The engineering task is to choose $f$, sensor, and mounting so the pick corridor is covered at sufficient ground resolution while keeping the fruit within the depth of field.

### 6.3 Depth sensing by triangulation (stereo)
To place a fruit in 3-D, the machine needs **depth**, and the field-robust way to get it outdoors is **passive stereo triangulation**. Two cameras separated by a **baseline** $b$ see a feature at slightly different image positions; the difference is the **disparity** $d$. With focal length $f$ (in pixels), depth is
$$ Z = \frac{f\,b}{d}. $$
Disparity is inversely proportional to depth, near objects shift a lot, far objects barely at all, which is the root of stereo's defining limitation, quantified in Section 7.3. Alternative depth modalities (structured light, time-of-flight/LiDAR) are surveyed in Section 6.5 and traded in Section 11; their Achilles' heel outdoors is sunlight, which passive stereo tolerates.

### 6.4 Sensing beyond the visible: spectral and acoustic
Module 2 established that ripeness is multi-cue and partly internal. Two modality families reach where RGB cannot:

- **Spectral / NIR.** Near-infrared reflectance correlates with internal water and sugar content, giving a physical handle on ripeness that visible color alone lacks. Multispectral or hyperspectral sensing measures reflectance in bands chosen to separate mature from immature tissue.
- **Acoustic.** The pressurized shell's resonance ("thump") shifts with maturity; a controlled tap and microphone, or a contact resonance measurement, transduces this cue.

Neither is decisive alone; both are inputs the fusion stage (M5) and the learned classifier (M4) combine. M3's job is to decide which bands/cues to *measure* so the information exists to be fused.

### 6.5 Localization sensing
The rover must know where it is in the row (to drive and to convert a fruit's camera-frame position into a field/robot-frame position). The relevant sensors:

- **GNSS, with RTK correction**, for absolute position at centimetre class [VERIFY@PUB] under open sky;
- **IMU** (accelerometers + gyros) for orientation and short-term motion, fused to bridge GNSS gaps;
- **Wheel/rover odometry** for dead reckoning.
These are introduced here as modalities and characteristics; their **fusion** into a state estimate is mastered in M5.

### 6.6 Tactile, force, and pressure sensing: closing the grasp loop
The Grip-Force Window (**CEC-02**) is only enforceable if the machine can *measure* grasp force. This module introduces the sensors that make closed-loop grasp-force regulation (Module 2's DD-7) possible:

- **Load cells / force sensors** at the gripper structure, measure net grasp force.
- **Tactile arrays** on the pads, measure the *distribution* of contact pressure, the very quantity (peak pressure) that bruising depends on (M2 Section 7.2).
- **Fluid pressure sensors** in the compliant actuator, in a fluid-powered gripper, line pressure is a direct proxy for grip force, the natural control variable (the fluid-power hook developed in M9).

The requirement these sensors must meet is set by CEC-02: their range must cover $[F_\text{slip}, F_\text{bruise}]$ and their resolution must be fine enough to keep the controller comfortably inside a possibly narrow window.

### 6.7 Calibration: making measurements mean something in the robot frame
A measurement is only useful if it is expressed correctly in the frame where the robot acts. Three calibrations are required:

- **Intrinsic**, the camera's internal model (focal length, principal point, distortion), so pixels map to rays.
- **Extrinsic**, the geometric relation between sensors (stereo pair) and between each sensor and the robot; **hand-eye calibration** relates the camera frame to the manipulator frame so a detected fruit becomes a reachable target.
- **Temporal**, synchronizing sensor streams so fused measurements refer to the same instant (a latency error masquerades as a position error on a moving platform).

Residual calibration error is not incidental: it is a named term in the placement error budget (Section 7.5), and uncalibrated frames are a classic localization/integration failure.

---

## 7. Mathematics

Rigor tier for M3: **L2** (applied), with an L3 grad extension on stereo error propagation. The central result is the stereo depth-error relation and its use in baseline sizing; it feeds the placement error budget.

### 7.1 Field of view and ground sampling
For sensor dimension $s$ and focal length $f$, $\text{FoV}=2\arctan(s/2f)$. At working distance $Z$, the imaged ground width is $W = 2Z\tan(\text{FoV}/2) = Z\,s/f$, and with $N$ pixels across, the **ground sampling distance** is $\text{GSD} = W/N$. *Use:* choose $f$ and $N$ so the fruit spans enough pixels for reliable detection (an M4 requirement) across the corridor width.

### 7.2 Stereo depth
From Section 6.3, $Z = f b/d$ with $f$ in pixels, baseline $b$, disparity $d$ (pixels). *Use:* fixes the geometric relationship between the sensor design ($f$, $b$) and the depth it can report at a given disparity.

### 7.3 Stereo depth error: the module's central result
Differentiating $Z=fb/d$ with respect to disparity gives the depth uncertainty for a disparity-measurement uncertainty $\delta d$:
$$ \frac{\partial Z}{\partial d} = -\frac{fb}{d^2} = -\frac{Z^2}{fb} \quad\Longrightarrow\quad \boxed{\;\delta Z \;\approx\; \frac{Z^{2}}{f\,b}\,\delta d\;} $$
**Depth error grows with the square of range.** Doubling the standoff quadruples the depth uncertainty for the same disparity noise. The design levers are immediate: larger focal length $f$, larger baseline $b$, sub-pixel disparity estimation (smaller $\delta d$), and, most powerfully, **working at shorter range $Z$**. This is precisely why the SIM2FIELD architecture stages each fruit to a fixed, close pick station (Module 1 DD-2): it shrinks $Z$ where accuracy matters most. *Use:* given a required depth accuracy $\delta Z_\text{req}$ at the pick range $Z_\text{pick}$, solve for the minimum baseline $b_\text{min} = Z_\text{pick}^2\,\delta d / (f\,\delta Z_\text{req})$.

> *Grad extension (L3).* Propagate error through the full pixel->camera->robot chain, combining disparity noise, calibration residual, and extrinsic uncertainty; show that beyond a range the $Z^2$ term dominates and no downstream filter recovers the lost accuracy.

### 7.4 Noise, SNR, and dynamic range
Model sensor noise as approximately Gaussian with standard deviation set by photon statistics and read noise; the achievable disparity precision $\delta d$ (and hence $\delta Z$) improves with SNR and sub-pixel matching. The **dynamic range** requirement is set by the field's lighting extremes: the sensor must not saturate in sun nor vanish in shade within one scene, a direct driver of sensor choice and exposure strategy.

### 7.5 The placement error budget (assembled here, mastered in M5)
The grasp must land inside the spatial capture tolerance $c$ tied to the Grip-Force Window (a misplaced grasp lands outside the window and slips or bruises). The independent contributors combine by root-sum-square (M1 Section 7.2):
$$ \sigma_\text{total} = \sqrt{\sigma_Z^2 + \sigma_\text{cal}^2 + \sigma_\text{he}^2 + \sigma_\text{sync}^2 + \sigma_\text{mech}^2}\, , \qquad 3\sigma_\text{total}\le c. $$
This module supplies the *sensing* terms, depth error $\sigma_Z$ (Section 7.3), calibration residual $\sigma_\text{cal}$, hand-eye error $\sigma_\text{he}$, and temporal-sync error $\sigma_\text{sync}$, and hands the assembled budget to M5 (which masters the estimation) and M8 (which owns $\sigma_\text{mech}$). The error budget is a recurring design tool across M1, M3, M5, and M8; Section 11.3 evaluates it explicitly for Core Engineering Concept designation.

---

## 8. Engineering Principles

1. **Requirement before hardware.** Quantify the sensing need, then select the modality that meets it, never the reverse.
2. **The sensor sets the ceiling.** No algorithm recovers information the sensor never captured; perception quality is capped at transduction.
3. **Design for the field's extremes, not its average**, dynamic range and modality robustness are chosen for full sun *and* deep shade, dust, and moisture.
4. **Depth accuracy is geometry.** $\delta Z \propto Z^2/(fb)$ makes short range, long baseline, and long focal length the levers; stage the fruit close.
5. **Calibration is a budget line, not a checkbox.** Residual frame error enters the placement budget directly.
6. **Measure what you must control.** Enforcing the Grip-Force Window (CEC-02) requires force/tactile/pressure sensing sized to the window.
7. **Simulation-first sensing.** Virtual sensors (FoV, range, noise) must exist in the twin before perception is trusted.

---

## 9. System Requirements

Derived from the sensing needs of the machine; refine and extend the M1/M2 baseline. IDs continue the scheme; [->Doc B] will formalize. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-09 | Performance | The depth sensor shall provide depth accuracy $\le \delta Z_\text{req}$ at the pick range $Z_\text{pick}$ [VERIFY@PUB], sized via Section 7.3. | Analysis + calibrated measurement |
| SR-P-10 | Performance | The imaging sensor shall provide ground sampling $\le$ [VERIFY@PUB] mm/pixel across the pick corridor (M4 detection need). | Analysis + test |
| SR-P-11 | Performance | The sensing suite shall operate across the field lighting range [VERIFY@PUB] without saturation or signal loss (dynamic range). | Environmental test |
| SR-F-04 | Functional | The suite shall measure the ripeness cues cataloged in M2 Section 6.4 sufficient to meet SR-F-03 (mature/immature discrimination). | Test (M4) |
| SR-F-05 | Functional | The suite shall measure grasp force/contact pressure over the range $[F_\text{slip}, F_\text{bruise}]$ (CEC-02) with resolution sufficient for closed-loop control. | Bench test (M9) |
| SR-P-12 | Performance | Localization sensing (GNSS/RTK + IMU + odometry) shall support rover pose to [VERIFY@PUB] in the row. | Field test (M5/M10) |
| SR-I-04 | Interface | All sensors shall be calibrated (intrinsic, extrinsic, hand-eye, temporal) with residual error budgeted into the placement error budget. | Calibration + analysis |
| SR-I-05 | Interface | Virtual-sensor models (FoV, range, noise) shall exist in the twin as controlled models. | Review (->Doc G) |

Traceability: SR-P-09/10/11 -> M4/M5; SR-F-04 -> M4; **SR-F-05 -> M9 (enforces CEC-02)**; SR-P-12 -> M5/M10; SR-I-04 -> the error budget (M5/M8); SR-I-05 -> the twin (M13, [->Doc G]).

---

## 10. Design Decisions

- **DD-10 Passive stereo RGB as primary perception sensor.** *Rationale:* field-robust depth under sunlight where structured-light/ToF fail (Section 6.3, Section 11.1); provides color for detection and ripeness cues. *Serves:* SR-P-09/10/11. (Case machine: an OAK-D-class stereo module [VERIFY@PUB].)
- **DD-11 Add spectral/NIR sensing for ripeness.** *Rationale:* internal ripeness signal invisible to RGB (Section 6.4). *Serves:* SR-F-04. (Scope/priority ratified in ->Doc B.)
- **DD-12 GNSS/RTK + IMU + odometry for localization.** *Rationale:* absolute + inertial + dead-reckoning fusion for row-scale pose (Section 6.5). *Serves:* SR-P-12.
- **DD-13 Force + tactile + fluid-pressure sensing at the gripper.** *Rationale:* enforce CEC-02 with closed-loop grasp-force control; fluid pressure as the natural proxy (Section 6.6). *Serves:* SR-F-05. (Realized in M9.)
- **DD-14 Stage the fruit close (reaffirms M1 DD-2).** *Rationale:* Section 7.3, short range minimizes depth error where the grasp needs it most. *Serves:* SR-P-09.
- **DD-15 Full calibration regime.** intrinsic + extrinsic + hand-eye + temporal, with residuals budgeted. *Serves:* SR-I-04.

---

## 11. Trade Studies

### 11.1 TS-5: Depth-sensing modality
**Alternatives:** (A) **passive stereo**; (B) **active structured light**; (C) **LiDAR**; (D) **time-of-flight (ToF)**. Scored 1 to 5 against field-driven criteria (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Stereo | B: Structured light | C: LiDAR | D: ToF |
|--------------------|:---:|:---:|:---:|:---:|
| Robustness in direct sunlight (0.30) | 5 | 1 | 4 | 2 |
| Depth accuracy at pick range (0.20) | 4 | 5 | 4 | 4 |
| Spatial/color resolution for detection (0.18) | 5 | 4 | 2 | 3 |
| Canopy/edge behavior (0.12) | 4 | 3 | 3 | 3 |
| Cost & integration on the platform (0.12) | 4 | 4 | 2 | 4 |
| Compute load of the stream (0.08) | 3 | 4 | 4 | 4 |
| **Weighted total** | **4.44** | **2.86** | **3.42** | **2.98** |

**Selected: A (passive stereo)**, with LiDAR retained as an optional complement for longer-range row context. Sunlight robustness is decisive outdoors and eliminates structured light and ToF as primaries; stereo also supplies the color the detector and ripeness cues need. Recorded weakness: stereo depth degrades as $Z^2$ (Section 7.3), which the close-staging decision (DD-14) mitigates but does not remove, a constraint carried into M5's fusion design.

### 11.2 TS-6: Ripeness sensing modality (resolving M2 TS-4)
**Alternatives:** RGB-color only, +NIR/spectral, +acoustic, full multi-cue fusion. **Criteria:** discrimination across maturity, robustness to lighting/soil, cost/complexity, field practicality. **Outcome:** **RGB + selective NIR**, fused, as the practical core, with acoustic reserved for high-value verification; full learned fusion is designed in M4 to M5. *Rationale:* RGB carries external cues cheaply; NIR adds the internal signal RGB cannot; acoustic adds cost/mechanism for marginal gain in a fast pick cycle (CEC-01 cycle-time pressure). Scopes the M4 dataset to RGB+NIR labels (SR-F-04).

### 11.3 Explicit Core Engineering Concept evaluation *(required from Module 3 onward)*
Two concepts in this module were evaluated against the CEC test (recurring *design tool*, active in ≥3 modules, designated at mastery):

- **Stereo depth-error relation ($\delta Z\propto Z^2/fb$).** *Verdict: not a standalone CEC.* It is a powerful result but is one *contributor* to a broader recurring tool, the **error budget**, rather than a cross-module design instrument in its own right. It is captured as a design driver here and feeds the budget.
- **The placement error budget (RSS allocation).** *Verdict: qualifies, but designate at mastery.* It is introduced in M1 (Section 7.2), supplied with sensing terms here (Section 7.5), and mastered in **M5** (localization & estimation), recurring again in M8 (mechanism tolerance), clearly a recurring design tool across ≥3 modules. Per the designation discipline, it is **placed on the register watchlist as candidate CEC-03** and will be formally designated when **Module 5** masters it, not minted prematurely here.

This keeps the Core set small and each anchor earned. [Register updated accordingly.]

> **Simulation-first hook.** The modality choice and the depth-error result are testable in the twin's virtual-sensor models (Section 12, Section 13) before any camera is mounted, the FoV cone and detection range already present in the twin become a calibrated virtual sensor with a noise model.

---

## 12. Simulation Activities

M3 operates at the **Simulation (virtual sensors)** stage and *defines the twin's virtual-sensor models*. The existing twin already carries a camera FoV cone, an adjustable aim, a detection range, and an occlusion gate; this module formalizes these into calibrated virtual sensors with noise [->Doc G].

**SA-1, Calibrate the virtual camera.** Set the twin's virtual camera intrinsics (focal length, FoV) and confirm the imaged corridor width and ground sampling match the Section 7.1 predictions for the chosen sensor. *Outcome:* the twin's camera is a modeled instrument, not a generic viewport.

**SA-2, Instantiate the stereo depth-error model.** Add a depth-noise model $\delta Z \approx (Z^2/fb)\,\delta d$ to the twin's perception, and observe depth uncertainty grow as the fruit's range increases. Confirm that staging the fruit close (DD-14) collapses the error. *Outcome:* Section 7.3 is experienced, and the close-staging decision is justified in simulation.

**SA-3, Dynamic-range stress.** Vary the twin's lighting between "full sun" and "deep shade" extremes and observe where a fixed-exposure virtual sensor saturates or loses the fruit; relate to SR-P-11. *Outcome:* the outdoor dynamic-range requirement is made concrete.

**SA-4, Force-sensor virtual model.** Add a virtual grasp-force/pressure signal to the twin's gripper spanning $[F_\text{slip},F_\text{bruise}]$ (CEC-02) so the later grasp-control modules (M7/M9) have a sensed force to close on. *Outcome:* the twin can now represent the feedback CEC-02 requires.

---

## 13. Digital Twin Activities

**DTA-1, Virtual-sensor model specification (deliverable to Doc G).** Write the controlled specification for each virtual sensor the twin needs: RGB-stereo (FoV, GSD, disparity noise -> depth noise), NIR (band, ripeness-signal model), GNSS/IMU (pose noise), and grasp force/pressure (range, resolution). *Outcome:* SR-I-05 satisfied; a concrete Doc G input.

**DTA-2, Calibration-in-the-loop.** In the twin, inject a small extrinsic/hand-eye miscalibration and observe the resulting placement offset; then "calibrate it out." *Outcome:* students see calibration residual as a placement-budget term (Section 7.5), not an abstraction, an honest look at an integration/localization failure mode.

**DTA-3, Sensing-to-budget audit.** Using the virtual sensors, estimate the sensing terms of the placement error budget ($\sigma_Z$, $\sigma_\text{cal}$, $\sigma_\text{he}$, $\sigma_\text{sync}$) and RSS-combine them; compare $3\sigma$ to the capture tolerance $c$. Hand the result forward to M5. *Outcome:* the budget (candidate CEC-03) is populated with real sensing numbers.

---

## 14. Hardware Activities

*(Tiered: characterization/calibration protocols at specification level; runnable where hardware exists.)*

**HA-1, Camera characterization & intrinsic calibration protocol.** Specify (and, with hardware, run) intrinsic calibration and measurement of FoV, GSD at working distance, and dynamic-range behavior in bright/dim conditions. *Deliverable:* an intrinsic-calibration record and measured GSD feeding SR-P-10 and Doc B.

**HA-2, Stereo baseline & depth-accuracy check.** Specify a protocol to measure depth accuracy vs. range for the chosen stereo module and compare to Section 7.3; determine whether the baseline meets SR-P-09 at $Z_\text{pick}$. *Deliverable:* a depth-accuracy curve and baseline verdict.

**HA-3, Force/pressure sensor selection note.** Specify the range/resolution a grasp force or fluid-pressure sensor must meet to cover $[F_\text{slip},F_\text{bruise}]$ (CEC-02), and list candidate sensor classes [VERIFY@PUB]. *Deliverable:* a force-sensing requirement handed to M9.

---

## 15. Software Activities

**SWA-1, Sensor-driver abstraction.** Sketch a driver/interface abstraction that presents each sensor to the rest of the system as a timestamped, calibrated measurement in a named frame, decoupling downstream perception (M4/M5) from specific hardware. *Outcome:* the sensor-abstraction pattern M11 will formalize as ROS 2 nodes.

**SWA-2, Timestamp & sync plan.** Specify how sensor streams are timestamped and synchronized (the temporal-calibration requirement), and why a sync error becomes a position error on the moving rover. *Outcome:* the $\sigma_\text{sync}$ budget term is made a concrete software responsibility.

---

## 16. ROS 2 Integration

M3 introduces sensing at the **interface** level that M11 masters. Each sensor becomes a ROS 2 driver node publishing timestamped, calibrated measurements on typed topics (image pairs, depth, NIR, GNSS/IMU, force/pressure) with quality-of-service appropriate to its plane: high-rate perception data on the perception (Ethernet) plane, force/pressure feedback on or near the real-time (CAN) control plane so the grasp loop meets its timing (CEC-01 latency). The **sensor-driver abstraction** (SWA-1) is the design pattern that keeps perception and control code independent of specific hardware, the antidote to the integration failure of hardware-coupled subsystems.

---

## 17. AI Integration

The sensor suite **defines the input space of every learned model** in the machine, so the choices made here bound M4 to M7:

- **Input channels = modalities chosen here.** RGB, stereo disparity/depth, and NIR are the tensors the detector/ripeness models (M4) and fusion (M5) consume; a cue not sensed cannot be learned.
- **Data quality caps model quality.** SNR, dynamic range, and GSD (this module) set the ceiling on achievable detection recall, the metric Module 2 tied to yield.
- **Virtual sensors enable synthetic data.** The twin's calibrated virtual sensors (Section 12, Section 13) are the renderers for the synthetic-data pipeline (M4): they must reproduce the real sensors' FoV, GSD, and noise for synthetic-to-real transfer to hold.
- **Sensed force enables learned grasping.** The force/tactile/pressure signals (DD-13) are the observations the grasp-force policy (M7 framework, M9 physical) acts on, always bounded by CEC-02.

The system-level AI rule holds: learned outputs are bounded by sensed physical limits (never command outside a sensed, verified envelope).

---

## 18. Edge Computing Integration

Sensor choice sets the **compute and bandwidth load** the edge device (M6) must carry: stereo image pairs at frame rate are a heavy data stream, and their processing latency spends the cycle-time budget (CEC-01). Two consequences are fixed here: (1) the sensor data rate and the on-robot processing budget must be reconciled in M6, a high-resolution, high-rate suite can exceed the edge device's throughput; (2) the **runtime vs. development** distinction (CR-05) appears at the sensor level, the same physical sensors feed the *runtime* control loop (on-robot, no cloud) and the *development* synthetic-data/calibration pipeline (off-robot); the boundary must be explicit so no runtime perception path depends on off-robot resources.

---

## 19. Fluid Power Integration

M3 supplies the **sensing** half of fluid-powered grasp control, the feedback without which CEC-02 cannot be enforced:

- **Pressure as the control signal.** In a fluid-powered compliant gripper, actuator line pressure is a direct, measurable proxy for grasp force (Section 6.6). The **fluid-pressure sensor** is therefore the primary feedback element of the grasp loop, and its range/resolution are set by the Grip-Force Window.
- **Tactile distribution vs. net force.** A load cell reports net force; a tactile array reports the *pressure distribution* whose peak (M2 Section 7.2) is what actually bruises. Both are specified here so M9 can choose the control variable (net force, peak pressure, or both).
- **Sensing the compliance.** Because a fluid actuator's compliance couples pressure, position, and force, the sensor set must observe enough of that coupling for the M9 controller to regulate force through a compliant medium, a requirement handed forward with SR-F-05.

M3 chooses and sizes the fluid-grasp sensors; M9 designs the fluid circuit and the AI-assisted controller that closes the loop on them.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M3-1, Stereo Depth-Error Explorer.** Inputs: focal length $f$, baseline $b$, disparity noise $\delta d$, range $Z$. Outputs: $\delta Z(Z)$ curve, the $Z^2$ growth, and a baseline-sizing solver for a target $\delta Z_\text{req}$ at $Z_\text{pick}$. *Goal:* make Section 7.3 and DD-14 tangible.
- **W-M3-2, FoV / Ground-Sampling Calculator.** Inputs: sensor size, $f$, pixel count, working distance -> FoV, corridor width, GSD; flags when GSD is too coarse for detection. *Goal:* Section 7.1.
- **W-M3-3, Modality-vs-Sunlight Visualizer.** A slider from shade to full sun showing each depth modality's usable region (stereo robust, structured-light/ToF failing). *Goal:* Section 11.1 intuition.
- **W-M3-4, Force-Sensor Range Checker.** Overlays a candidate sensor's range/resolution on the Grip-Force Window (CEC-02) to confirm coverage. *Goal:* SR-F-05.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M3-1** Sensor placement on the machine: stereo/NIR camera pose over the pick corridor, GNSS/IMU location, gripper force/tactile/pressure sensors (annotated).
- **CAD-M3-2** Stereo triangulation geometry ($f$, $b$, disparity -> $Z$) as a labeled optical diagram.
- **CAD-M3-3** Camera-frame <-> robot-frame (hand-eye) transform illustration for calibration.
Format per ->Doc J (SVG for optical/geometry diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M3-1 | The sensing chain (property -> transduction -> signal -> information) | Section 6.1 |
| F-M3-2 | Thin-lens / FoV / GSD geometry | Section 6.2/Section 7.1 |
| F-M3-3 | Stereo triangulation and disparity | Section 6.3/Section 7.2 |
| F-M3-4 | **Depth error vs. range** ($\delta Z\propto Z^2/fb$) with baseline-sizing | Section 7.3 (central) |
| F-M3-5 | Modality robustness vs. sunlight (stereo/SL/LiDAR/ToF) | Section 11.1 |
| F-M3-6 | Ripeness cue <-> modality (RGB/NIR/acoustic) | Section 6.4/Section 11.2 |
| F-M3-7 | Calibration frames (intrinsic/extrinsic/hand-eye/temporal) | Section 6.7 |
| F-M3-8 | Placement error budget with sensing terms populated | Section 7.5 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M3-1** Depth error growing as the fruit recedes, then collapsing as it is staged close, the moving form of F-M3-4/DD-14.
- **AN-M3-2** A scene sweeping from shade to full sun with each depth modality dropping out as light rises, F-M3-5.
- **AN-M3-3** A miscalibrated hand-eye transform producing a placement miss, then corrected, DTA-2.

---

## 24. Laboratory

**Lab M3, Specifying and Sizing the Sensing Suite**

- **Objectives.** (1) Size the camera (FoV, GSD) for the pick corridor; (2) derive the stereo baseline for a required depth accuracy at the pick range; (3) populate the sensing terms of the placement error budget; (4) select a sensing suite and defend it against field constraints; (5) specify the twin's virtual-sensor models.
- **Equipment.** The digital twin with virtual-sensor models; a stereo dataset or a stereo camera where available [VERIFY@PUB]; a calibration target; spreadsheet/notebook. **Safety:** computer/bench work; standard lab practice; if outdoors, sun/eye precautions when handling optics.
- **Procedure.**
  1. For the chosen sensor and a stated working distance, compute FoV, corridor width, and GSD (Section 7.1); check GSD against the detection need (SR-P-10).
  2. Using Section 7.3, compute depth error vs. range for a candidate $f$, $b$, $\delta d$; size $b_\text{min}$ for $\delta Z_\text{req}$ at $Z_\text{pick}$ (SR-P-09). Show the $Z^2$ effect explicitly.
  3. In the twin (SA-2, DTA-3), measure depth uncertainty vs. range and compare to your calculation.
  4. Estimate the sensing budget terms ($\sigma_Z,\sigma_\text{cal},\sigma_\text{he},\sigma_\text{sync}$), RSS-combine, and compare $3\sigma$ to the capture tolerance $c$ (candidate CEC-03).
  5. Complete the modality trade (TS-5) for your stated field conditions and select a suite; confirm the force/pressure sensor covers the Grip-Force Window (SR-F-05, CEC-02).
  6. Write the virtual-sensor model specification (DTA-1).
- **Data collection.** FoV/GSD table; depth-error curve (calc vs. twin); budget table; trade matrix; suite selection; virtual-sensor spec.
- **Analysis.** Which lever ($f$, $b$, $Z$, $\delta d$) most improves depth accuracy for your case? Does the suite keep $3\sigma \le c$? Where does the field (sun/dust) most threaten the suite?
- **Discussion.** Why does staging the fruit close do more for accuracy than a bigger baseline? What did the budget reveal about which subsystem must improve? Which requirement is binding?
- **Deliverables.** A 4 to 6 page report: sizing, depth-error analysis (calc + twin), populated budget, trade & selection, virtual-sensor specification.
- **Rubric (100 pts).** FoV/GSD sizing (15); stereo depth-error & baseline sizing (22); error-budget population (18); modality trade & suite defense (20); virtual-sensor specification (15); communication (10). *Graduate band adds:* L3 error propagation through the full pixel->robot chain and a cited source.
- **Expected results.** Depth error rising as $Z^2$, dominating beyond a modest range and motivating close staging; a baseline that meets $\delta Z_\text{req}$ only at short range; a sensing budget that is feasible only with close staging and good calibration; passive stereo + NIR selected for the field.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **FoV & GSD.** For a given sensor size, focal length, and pixel count, compute FoV and GSD at two working distances; state whether the fruit spans enough pixels for detection.
2. **Depth error & baseline sizing.** Given $f$, $\delta d$, $Z_\text{pick}$, and $\delta Z_\text{req}$, size the minimum baseline; then show how $\delta Z$ changes if the fruit is imaged at twice the range.
3. **Sensing error budget.** Given the four sensing σ-terms, RSS-combine and determine the maximum tolerable mechanism error $\sigma_\text{mech}$ that still yields $3\sigma \le c$ (hand-off to M8).
4. **Modality choice.** Justify, in a short paragraph with criteria, why passive stereo beats structured light for this outdoor task; name the one condition under which your answer would flip.
5. **(Grad) Full-chain propagation.** Propagate disparity, calibration, and extrinsic uncertainty through pixel->camera->robot; identify the range beyond which depth noise dominates and argue why no filter recovers it.
6. **(Grad) Force-sensing design.** Given a Grip-Force Window from a Module 2 result, specify the range and resolution a fluid-pressure sensor must meet, and the sampling rate needed to keep the grasp loop stable within the cycle-time budget (CEC-01).

---

## 26. Quiz

1. **(MC)** Stereo depth error grows approximately with: (a) $Z$; (b) $Z^2$; (c) $1/Z$; (d) constant. **[b]**
2. **(MC)** Structured-light and ToF depth sensors struggle outdoors mainly because of: (a) cost; (b) sunlight overwhelming the active signal; (c) weight; (d) low resolution. **[b]**
3. **(MC)** Ground sampling distance (GSD) most directly limits: (a) depth accuracy; (b) how many pixels span the fruit for detection; (c) frame rate; (d) grip force. **[b]**
4. **(MC)** Hand-eye calibration relates: (a) two stereo cameras; (b) the camera frame to the manipulator frame; (c) GNSS to IMU; (d) pixels to disparity. **[b]**
5. **(Short)** Write the stereo depth-error relation and name the three most effective levers to reduce $\delta Z$. **[$\delta Z\approx (Z^2/fb)\delta d$; reduce $Z$ (stage close), increase $b$, increase $f$ (also reduce $\delta d$ via sub-pixel matching).]**
6. **(Calc)** $f=800$ px, $b=0.10$ m, $\delta d=0.2$ px. Compute $\delta Z$ at $Z=1.0$ m and $Z=2.0$ m. **[$\delta Z=Z^2\delta d/(fb)$: at 1 m ≈ 2.5 mm; at 2 m ≈ 10 mm, 4×.]**
7. **(Calc)** For $\delta Z_\text{req}=5$ mm at $Z_\text{pick}=1.2$ m with $f=800$ px, $\delta d=0.2$ px, size $b_\text{min}$. **[$b_\text{min}=Z^2\delta d/(f\,\delta Z)=1.44\cdot0.2/(800\cdot0.005)\approx0.072$ m.]**
8. **(Design)** Which sensor makes the Grip-Force Window (CEC-02) enforceable, and what sets its required range? **[A grasp force / fluid-pressure / tactile sensor; range set by $[F_\text{slip},F_\text{bruise}]$.]**
9. **(Critical thinking)** Why does the architecture stage the fruit to a close pick station rather than sense it at a distance? **[Depth error ∝ $Z^2$; short range is the strongest accuracy lever, DD-14.]**
10. **(Critical thinking)** Why is a temporal-sync error effectively a position error on this machine? **[The rover moves; a delayed measurement refers to a past pose, displacing the target, a $\sigma_\text{sync}$ budget term.]**

---

## 27. Challenge Problems

- **CP-M3-A, Close the sensing-to-grasp chain.** Combine the depth-error budget (this module) with the Grip-Force Window's spatial capture tolerance (CEC-02) to find the maximum pick range at which a grasp still lands inside the window at $3\sigma$. Relate the answer to the staging decision (DD-14) and the cycle-time budget (CEC-01). (Bridges CEC-01, CEC-02, and candidate CEC-03.)
- **CP-M3-B, Design a sunlight-robust ripeness sensor.** Propose a sensing arrangement (bands, geometry, shading) that measures a ripeness cue reliably across the field's full lighting range; specify how you would validate it and what it costs in cycle time and compute.
- **CP-M3-C, Specify a validated virtual sensor.** Write the specification and validation plan for a twin virtual-stereo sensor whose depth-noise model is trustworthy enough to size the baseline in simulation, including the real measurements needed to validate it and the acceptance criteria. (Engages Doc G and the sim-first doctrine.)

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (sensor physics, optics, stereo error) are the core (~2.5 h). The trade study and CEC evaluation (Section 11) plus twin activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M3 is a separate 2 to 3 h session.
- **Common misconceptions.** (1) "A better camera fixes depth", depth accuracy is geometry ($Z$, $b$, $f$), not megapixels. (2) Treating GSD and depth accuracy as the same thing, they are different budgets. (3) Assuming indoor depth sensors transfer outdoors, sunlight is the decider. (4) Forgetting calibration is a budget term, DTA-2 exists to make it visceral.
- **On the CEC evaluation (Section 11.3).** Use this as a teaching moment about *restraint*: not every important relation is a Core Concept. Show students the reasoning that keeps the error budget on the watchlist for M5 rather than minting it here, modeling disciplined designation.
- **Where to push graduate students.** Full-chain error propagation (HW5), the validated-virtual-sensor spec (CP-M3-C), and the sensing-to-grasp range limit (CP-M3-A).
- **Thread to keep visible.** Close by naming the hand-offs: the chosen suite is M4's input space, the depth error is M5's fusion problem and the seed of CEC-03, and the force sensing is what makes CEC-02 enforceable in M9.

---

## 29. Research Frontiers

- **Landmark grounding.** Standard references in multiple-view geometry and camera models (e.g., Hartley & Zisserman) for stereo and calibration; classical sensor-fusion and estimation texts (hand-off to M5); the agricultural-sensing literature on optical/spectral ripeness assessment. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Learned stereo and monocular-depth networks that improve accuracy and robustness over classical matching; event cameras and high-dynamic-range imaging for harsh outdoor lighting; compact hyperspectral and single-shot spectral sensors for in-field quality assessment; high-resolution tactile and vision-based tactile sensors for delicate manipulation; tight GNSS-RTK/visual-inertial fusion for field robots.
- **Open problems.** Reliable depth and detection under extreme, rapidly changing field illumination; low-cost internal-quality (ripeness) sensing at harvest speed; calibration that stays valid under field vibration and thermal drift; tactile sensing durable enough for abrasive field contact.
- **Suggested thesis directions.** (1) An HDR/event-based perception front end characterized specifically for green-on-green fruit under full sun. (2) A learned stereo depth model with calibrated uncertainty that feeds the placement error budget directly. (3) A compact NIR ripeness sensor with in-field self-calibration against a reference.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Multiple-view-geometry / camera-model reference (e.g., Hartley & Zisserman, *Multiple View Geometry*), thin lens, stereo, calibration (Section 6, Section 7).
- Sensor and instrumentation references, sensor characteristics, noise, SNR, dynamic range (Section 6.1).
- Agricultural optical/spectral sensing literature, NIR/hyperspectral and acoustic ripeness assessment (Section 6.4, Section 11.2).
- GNSS/RTK and inertial-navigation references, localization sensing (Section 6.5; fusion in M5).
- Tactile-sensing / soft-manipulation-sensing literature, grasp force and contact-pressure sensing (Section 6.6; CEC-02).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Module 1 Rev 1.1**, **Module 2 Rev 1.1**, and (forthcoming) Doc B, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters sensor selection from first principles and produces a single memorable result, the stereo depth-error relation $\delta Z\propto Z^2/(fb)$, that (a) drives concrete architecture (close staging, baseline sizing), (b) feeds the placement error budget, and (c) continues the course's window/budget pattern established by CEC-01 and CEC-02. It exercises the new Core Engineering Concept convention correctly from the first opportunity: it opens with a spine (CEC-01) callback, enforces CEC-02 by specifying the force/pressure sensing that makes the Grip-Force Window controllable, and performs the *explicit CEC evaluation* your standing rule requires, designating no new CEC, but placing the error budget on the watchlist as candidate CEC-03 for designation at its M5 mastery. All 30 sections are present; the tiered contract, simulation-first doctrine (virtual-sensor models specified for the twin), and consistency with the frozen modules are maintained.

**Known weaknesses / items for your review.**
1. **Numeric targets are [VERIFY@PUB].** Required depth accuracy, GSD, lighting range, localization accuracy, and specific sensor parts are flagged pending Doc B and field data; the physics, relations, and sizing method are exact.
2. **Ripeness sensing is scoped, not solved.** TS-6 resolves the modality emphasis (RGB+NIR) but defers the learned discrimination to M4 to M5, as the architecture intends.
3. **Virtual sensors are specified, not built.** DTA-1 produces the specification; implementation depends on Doc G, the same critical path noted for M2/M9.
4. **Candidate CEC-03 is deferred by design.** The error budget is not yet a full Core Concept; if you would prefer it designated now rather than at M5 mastery, that is a one-line change to the register, flagged rather than decided unilaterally.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 and 3 close chiefly by authoring Doc B and Doc G.

**END OF MODULE 3, STOP. Awaiting your review before freezing Module 3 or proceeding to Module 4.**
