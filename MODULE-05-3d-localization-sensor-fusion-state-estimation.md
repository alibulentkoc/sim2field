# Module 5: 3-D Localization, Sensor Fusion & State Estimation

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M5, **Part II, Perceive**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation + Software-in-the-Loop (estimator in the loop, twin ground truth)
**Prerequisites:** M1 (spine, budgets, the error-budget seed), M2 (Grip-Force Window & capture tolerance), M3 (sensor suite, calibration, depth error), M4 (detections/masks the localizer consumes). Math: linear algebra, probability.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 4**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. P0-document authority tagged **[->Doc B/D/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** the formal designation of **CEC-03 (the Placement Error Budget)** at its mastery point; **Engineering Insight EI-05**; and the first **Engineering Design Review** section (prospective from Module 5).

> *Core concept in use.* This module completes the **Perceive** stage of **CEC-01 (the Signal-to-Action Spine)**: it turns M4's 2-D detections into the single deliverable the **Act** stage consumes, a 3-D fruit pose in the robot frame, *with its uncertainty*. That uncertainty must be small enough to land the grasp inside **CEC-02 (the Grip-Force Window)**'s capture tolerance, which is why this module finally assembles and masters the error budget.

---

## 1. Module Overview

**Mission.** This module builds the bridge from perception to action: it turns a 2-D detection plus depth into a 3-D fruit pose in the robot frame, fuses the machine's several sensors into a coherent state estimate, and, crucially, attaches a calibrated uncertainty to that pose.

**Previous milestone.** Perception has, until now, produced pixels with meaning: M4 says there is a ripe fruit, here in the image, with this extent. But the manipulator does not act in the image, it acts in the robot's own 3-D frame.

**Engineering problem.** Uncertainty is the theme. A grasp target is not a point; it is a point plus a covariance, and whether the grasp succeeds depends on whether that uncertainty fits inside the capture tolerance tied to the Grip-Force Window (CEC-02).

**Design tension.** This is where the curriculum's recurring error budget, introduced as a seed in Module 1, given its sensing terms in Module 3, is finally assembled in full, allocated across subsystems, and mastered. Because that budget is a design tool the machine returns to again and again (mechanism tolerance in M8, integration in M13, verification in M14), this module formally elevates it to a Core Engineering Concept: CEC-03, the Placement Error Budget. The module's second lesson is one every estimation engineer learns the hard way and that the RSS math makes precise: the total is dominated by the largest term. Effort spent shrinking a small error source barely moves the sum; the win is in finding and attacking the dominant source. That judgment becomes this module's Engineering Insight (EI-05).

**What this module resolves.** By the end you will compute pixel->robot pose through a chain of coordinate frames, fuse sensors with a filter that propagates uncertainty, assemble and allocate the placement error budget, and know exactly which subsystem to push on to make the grasp land.


## 2. Learning Objectives

- **LO-M5.1** Back-project a detected pixel with depth into a 3-D point and transform it through the machine's coordinate frames to a robot-frame pose., *Bloom: Apply*
- **LO-M5.2** Represent and chain rigid-body transforms (SE(3)) between camera, manipulator, rover, and field frames., *Bloom: Apply*
- **LO-M5.3** Explain and apply recursive state estimation (Kalman/EKF; particle filtering conceptually) to fuse stereo, IMU, GNSS, and odometry., *Bloom: Apply (with Understand)*
- **LO-M5.4** Propagate uncertainty through transforms and fusion, producing a pose with a calibrated covariance., *Bloom: Analyze*
- **LO-M5.5** Assemble, allocate, and evaluate the placement error budget (CEC-03) against the Grip-Force Window's capture tolerance (CEC-02)., *Bloom: Evaluate (with Create)*
- **LO-M5.6** Identify the dominant error source in a budget and target it (EI-05)., *Bloom: Analyze (with Evaluate)*
- **LO-M5.7** Specify how the digital twin's ground-truth pose validates localization accuracy., *Bloom: Create*

Maps to course objectives **LO3** (primary), **LO2/LO5** (reinforcing), and ABET **SO1, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Compute a robot-frame fruit pose from a pixel, a depth, intrinsics, and a frame chain., *Bloom: Apply*
2. Build and chain homogeneous transforms and propagate a covariance through them., *Bloom: Analyze*
3. Set up a Kalman/EKF update fusing two or more sensors and interpret its gain and covariance., *Bloom: Apply*
4. Assemble a placement error budget, allocate per-subsystem limits, and test $3\sigma \le c$., *Bloom: Evaluate*
5. Diagnose the dominant error source and justify where to spend engineering effort., *Bloom: Evaluate*
6. Specify a twin-ground-truth validation for localization error., *Bloom: Create*

---

## 4. Engineering Motivation

Module 1's failure taxonomy named *localization failure*: the fruit is detected but placed wrongly in space, so a grasp aimed at a phantom position slips or bruises. This module is the defense against that failure, and it reveals that "localization" is really two engineering problems stacked together, **geometry** (getting the frame transforms right) and **uncertainty** (knowing how wrong the estimate might be).

The geometry alone is unforgiving: a fruit's position must pass from the image, through the camera model, through the camera-to-manipulator transform (the hand-eye calibration from M3), through the rover's pose in the field, and an error anywhere in that chain lands the grasp in the wrong place. But geometry is only half the job. Even a perfectly modeled chain carries *noise*, disparity noise, calibration residual, GNSS scatter, timing jitter on a moving platform, and the grasp succeeds only if the *combined* uncertainty is smaller than the gripper's capture tolerance. A localizer that reports a confident-looking point with no honest uncertainty is dangerous: it invites the grasp to close where the fruit probably is not.

So the motivating question is sharp and quantitative: *given every error source in the machine, is the fruit's estimated position accurate enough, often enough, to land inside the Grip-Force Window?* Answering it requires assembling the whole placement error budget, and the moment you do, a second truth appears: one source usually dominates. On this machine it is frequently stereo depth error at range (which is exactly why the architecture stages fruit close, M3 DD-14). The budget does not just tell you whether you will succeed; it tells you *which subsystem to fix* if you will not. That is the engineering leverage this module delivers.

---

## Engineering Failure Cases (localization-specific)

Sharpening Module 1's *localization* and *integration* failure classes:

- **Frame-chain error.** A transform in the pixel->robot chain is wrong or stale (bad extrinsics, drifted hand-eye, uncorrected rover pose); the fruit is confidently mislocated. *Motivates* the transform mathematics (Section 6.2, Section 6.3) and calibration's budget entry.
- **Over-confident estimate.** The estimator reports a tight covariance it has not earned (mis-modeled sensor noise), so the grasp trusts a position it should not. *Motivates* honest uncertainty modeling and covariance propagation (Section 6.4, Section 7.4).
- **Dominant-source neglect.** Effort is spent polishing a small error term while the dominant one (often depth at range) is left untouched; the budget never closes. *Motivates* the error-budget assembly (Section 7.5, CEC-03) and EI-05.
- **Latency-as-position error.** Fusion or processing latency lets the estimate refer to a past instant on the moving rover, displacing the target. *Motivates* temporal synchronization (M3) as a budget term and the cycle-time interaction (CEC-01).

Each is preventable with the geometry-plus-uncertainty discipline this module builds.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** linear algebra (matrix-vector products, inverses, eigen-intuition for covariance); probability (Gaussian distributions, mean/covariance, conditional expectation); the M1 error-budget seed and RSS; the M2 capture tolerance $c$ (CEC-02); the M3 camera intrinsics, calibration, and depth-error model; the M4 detection/mask the localizer consumes.

**Introduced here, used later:** the vocabulary of localization and estimation, *back-projection, homogeneous transform, SE(3), frame chain, covariance propagation, recursive estimation, Kalman/EKF/particle filter, process/measurement noise, innovation, filter gain, occlusion gate*. Estimation is developed at applied (L2) depth with an L3 grad extension; full estimation theory is referenced [->Doc H].

**Where this sits in the dependency graph.** M5 hard-depends on M3 (sensors, calibration, depth error) and M4 (detections), and on M1/M2 (budget, tolerance). It **masters** the 3-D geometry/localization and sensor-fusion/estimation threads, and **masters the error-budget thread, designated here as CEC-03.** It hands forward: the 3-D fruit pose *with covariance* to the decision/grasp stage (M7) and the manipulator (M8/M9); the mechanism-tolerance allocation to M8; the localizer node interface to M11; and the validated localization model to M13/M14.

---

## 6. Theory

### 6.1 The localization problem, precisely stated
Given a detection (pixel region + mask, M4) and a depth (stereo, M3), produce the fruit's 3-D pose in the **robot frame**, the frame in which the manipulator plans, together with a covariance describing how uncertain that pose is. This decomposes into a **geometry** problem (frames and transforms) and an **estimation** problem (fusing noisy sources and propagating uncertainty).

### 6.2 From pixel to 3-D: back-projection
A calibrated camera (intrinsics matrix $K$ from M3) maps a 3-D camera-frame point to a pixel. Inverting this with a known depth $Z$ **back-projects** a pixel $(u,v)$ to a 3-D point in the camera frame:
$$ \mathbf{P}_c = Z\,K^{-1}\begin{bmatrix} u \\ v \\ 1 \end{bmatrix}. $$
The mask centroid (M4) plus the stereo depth (M3) at that location yields the fruit's camera-frame position. Everything downstream is moving this point into the frame where the robot acts.

### 6.3 Rigid-body transforms and the frame chain
Positions move between frames by **homogeneous transforms**, a rotation $R\in SO(3)$ and translation $\mathbf t$ packed into a $4\times4$ matrix $T=\begin{bmatrix} R & \mathbf t \\ \mathbf 0 & 1\end{bmatrix}\in SE(3)$. The machine has a chain of frames: **camera -> manipulator/base -> rover -> field.** The fruit's robot-frame pose is obtained by composing transforms:
$$ \mathbf P_\text{robot} = T_{\text{robot}\leftarrow\text{camera}}\;\mathbf P_c, \qquad \mathbf P_\text{field} = T_{\text{field}\leftarrow\text{robot}}\;\mathbf P_\text{robot}. $$
$T_{\text{robot}\leftarrow\text{camera}}$ is the **hand-eye** calibration (M3); $T_{\text{field}\leftarrow\text{robot}}$ comes from the rover's estimated pose (GNSS/IMU/odometry, fused below). A single wrong or stale transform in this chain is the frame-chain failure mode.

### 6.4 Uncertainty is part of the answer
Each input carries noise: depth ($\sigma_Z$, growing as $Z^2$, M3), calibration/hand-eye residual, and rover-pose uncertainty. Noise **propagates through the transforms**: for a function $\mathbf y=f(\mathbf x)$ with input covariance $\Sigma_x$, the first-order output covariance is $\Sigma_y = J\,\Sigma_x\,J^\top$ (with $J$ the Jacobian). The deliverable of localization is therefore not a point but a **pose with covariance**, the honest statement of where the fruit is *and how sure we are*. Downstream (M7/M9) must use this covariance, not just the mean.

### 6.5 Sensor fusion by recursive estimation
No single sensor gives the best state: GNSS is absolute but slow and occasionally lost; IMU is fast but drifts; odometry dead-reckons; stereo gives fruit position but degrades with range. **Fusion** combines them so the estimate is better than any one alone. The workhorse is the **Kalman filter** (and its nonlinear extensions):

- **Predict**, advance the state and inflate its covariance by the motion model and process noise: $\hat{\mathbf x}^-=F\hat{\mathbf x}$, $P^-=FPF^\top+Q$.
- **Update**, correct with a measurement $\mathbf z$, weighting by the **Kalman gain** $K=P^-H^\top(HP^-H^\top+R)^{-1}$: $\hat{\mathbf x}=\hat{\mathbf x}^-+K(\mathbf z-H\hat{\mathbf x}^-)$, $P=(I-KH)P^-$.

The gain automatically trusts each source in inverse proportion to its noise, the mathematical form of "believe the more certain sensor more." For the nonlinear frame/motion relationships here, the **Extended/Unscented KF** linearizes or samples; where the fruit-pose belief is multimodal (heavy occlusion), a **particle filter** represents arbitrary distributions at higher compute cost. The filter also produces the covariance Section 6.4 needs. *What this changes about the machine:* each update shrinks the pose covariance, and it is that shrinking, not a better mean, that lets a fruit clear the occlusion gate (Section 6.6) and land inside the capture tolerance the Grip-Force Window sets (Section 6.7), the whole reason to fuse sensors here.

### 6.6 The occlusion gate
Not every detection is localizable. A heavily occluded fruit yields an unreliable mask and depth, inflating covariance beyond usefulness. The **occlusion gate** (present in the twin) rejects detections whose estimated uncertainty exceeds a threshold, refusing to hand the Act stage a target it cannot trust. This is uncertainty-driven decision-making in miniature, and a direct application of Section 6.4.

### 6.7 The placement error budget: assembled and mastered
Everything above feeds one question tied to the Grip-Force Window: *will the grasp land inside the capture tolerance $c$?* The independent placement error sources combine in quadrature and must satisfy the $3\sigma$ rule (M1 Section 7.2, M3 Section 7.5):
$$ \sigma_\text{place} = \sqrt{\sigma_Z^2 + \sigma_\text{cal}^2 + \sigma_\text{he}^2 + \sigma_\text{sync}^2 + \sigma_\text{est}^2 + \sigma_\text{mech}^2}\,,\qquad 3\sigma_\text{place}\le c. $$
This is the machine's central accuracy contract. It is *introduced* in M1, *supplied* with sensing terms in M3, and *mastered here*, assembled in full (adding the estimation term $\sigma_\text{est}$ this module produces), allocated to each subsystem as a requirement, and used to decide feasibility. Because it recurs as a design tool across M1, M3, **M5**, M8, M13, and M14, it is elevated to a Core Engineering Concept:

> ### Core Engineering Concept, CEC-03: The Placement Error Budget
> **Independent placement-error sources combine in quadrature, $\sigma_\text{place}=\sqrt{\sum_i \sigma_i^2}$, and the grasp succeeds only if $3\sigma_\text{place}\le c$, the capture tolerance tied to the Grip-Force Window (CEC-02). The budget both tests feasibility and allocates a maximum error to every subsystem.**
>
> *Introduced M1 Section 7.2; sensing terms added M3 Section 7.5; **mastered and designated here (M5, Section 6.7/Section 7.5)**. Reinforced/applied in M8 (mechanism tolerance), M13 (integration), M14 (verification). It converts a system-level accuracy requirement into per-subsystem requirements and reveals the dominant source (see EI-05). See the [register](curriculum/_core-concepts.md).*

---

## 7. Mathematics

Rigor tier for M5: **L2 to L3**. The central results are the pose-with-covariance and the assembled, allocated error budget.

### 7.1 Back-projection and the transform chain
Compute $\mathbf P_c = ZK^{-1}[u,v,1]^\top$ (Section 6.2), then $\mathbf P_\text{robot}=T_{\text{robot}\leftarrow\text{camera}}\,[\mathbf P_c;1]$ (Section 6.3). *Use:* the deterministic pixel->robot pose; the geometric backbone of localization.

### 7.2 Covariance propagation
For each stage $\mathbf y=f(\mathbf x)$, $\Sigma_y=J\Sigma_x J^\top$. Chaining stages composes the Jacobians; the fruit-pose covariance in the robot frame is the accumulated result. *Use:* turns per-source noise into the pose covariance that the occlusion gate and the grasp module consume.

### 7.3 The Kalman/EKF update (applied)
Given predict/update equations (Section 6.5), work a small fusion example (e.g., GNSS + odometry for rover position, or stereo + prior for fruit position): compute the gain, the corrected estimate, and the reduced covariance. *Use:* see fusion *reduce* uncertainty and weight sources by their noise. **Grad (L3):** derive the EKF linearization and discuss consistency (a filter that under-reports covariance is over-confident, the Section 6.4 hazard).

### 7.4 The dominant-term result (foundation for EI-05)
In $\sigma_\text{place}=\sqrt{\sum_i\sigma_i^2}$, if one term $\sigma_\text{max}$ is much larger than the rest, then $\sigma_\text{place}\approx\sigma_\text{max}$: the total is set by the biggest source. Quantitatively, halving a term that is $1/3$ of the total reduces $\sigma_\text{place}$ by only ~2%, while halving the dominant term nearly halves it. *Use:* the mathematical justification for attacking the dominant source first, and, on this machine, for staging the fruit close, since depth error ($\propto Z^2$) is often the dominant term.

> ### Engineering Insight, EI-05: Attack the Dominant Error Source
> **In a quadrature (root-sum-square) budget, the largest term dominates the total, find it and reduce it first; effort spent shrinking small contributors is almost wasted.**
>
> The RSS math is unforgiving in a useful way: when one source dominates, the total is essentially that source, and improvements elsewhere are invisible until the dominant term is brought down to the level of the others. Inexperienced engineers optimize the term they understand best or can change most easily; experienced engineers first *budget*, then identify the dominant contributor, and spend their effort there, repeating until no single term dominates. The habit generalizes to any additive budget: attack the critical path in a schedule, the biggest line item in a cost model, the highest-severity item in a risk register.
>
> **Why it matters for SIM2FIELD.** The placement budget (CEC-03) frequently has depth error at range as its dominant term, which is precisely why the architecture stages fruit to a close pick station (M3 DD-14) rather than chasing calibration to the third decimal. Knowing the dominant term tells you *which subsystem to improve* to make the grasp land inside the Grip-Force Window (CEC-02), and stops wasted effort on terms that cannot move the total.
>
> *Related concepts:* CEC-03 (the budget this insight operates on), CEC-02 (the tolerance it must meet). *Revisited in:* M6 (dominant latency in the cycle-time budget), M8 (dominant mechanism-tolerance term), M12 (dominant power/thermal load), M14 (dominant reliability risk). See the [register](curriculum/_core-concepts.md).

### 7.5 Assembling and allocating the budget (central)
Populate $\sigma_\text{place}$ with numbers: $\sigma_Z$ (M3, at the staged range), $\sigma_\text{cal},\sigma_\text{he}$ (calibration residuals, M3), $\sigma_\text{sync}$ (timing × rover speed), $\sigma_\text{est}$ (filter-reported), $\sigma_\text{mech}$ (M8, provisional). Test $3\sigma_\text{place}\le c$. If it fails, use EI-05 to find the dominant term and either tighten it or **re-allocate**, e.g., stage closer (cut $\sigma_Z$), recalibrate ($\sigma_\text{cal},\sigma_\text{he}$), or demand more mechanism repeatability from M8 ($\sigma_\text{mech}$). *Use:* this is CEC-03 in action, the accuracy contract that binds perception, calibration, estimation, and mechanism together.

---

## 8. Engineering Principles

1. **A target is a distribution, not a point.** Deliver pose *with covariance*; downstream must use both.
2. **Geometry and uncertainty are co-equal.** A correct transform chain with dishonest uncertainty is unsafe.
3. **Fuse to reduce uncertainty**, the filter weights sources by their noise; give it honest noise models.
4. **Budget, then attack the dominant term** (EI-05); do not polish small contributors.
5. **Refuse untrustworthy targets.** The occlusion gate is uncertainty-driven; declining a bad grasp beats attempting it.
6. **Latency is a position error** on a moving platform, synchronize and budget it.
7. **Validate against independent ground truth** (twin, then field); a filter that under-reports covariance must be caught.

---

## 9. System Requirements

Derived from the localization mission; master the accuracy contract. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-16 | Performance | Robot-frame fruit-pose error shall satisfy the placement budget $3\sigma_\text{place}\le c$ (CEC-03/CEC-02) at the pick station. | Analysis + twin/field measurement |
| SR-F-08 | Functional | The localizer shall output fruit pose **with a calibrated covariance**, not a bare point. | Test (covariance consistency) |
| SR-F-09 | Functional | An occlusion/uncertainty gate shall reject targets whose covariance exceeds a threshold. | Test |
| SR-P-17 | Performance | Rover-state estimation (GNSS/IMU/odometry fusion) shall support the field->robot transform to the budgeted accuracy. | Field test |
| SR-P-18 | Performance | Estimation + fusion latency shall fit its share of the cycle-time budget (CEC-01). | Benchmark |
| SR-I-07 | Interface | The mechanism-tolerance allocation $\sigma_\text{mech}$ shall be issued to M8 as a derived requirement. | Review (traceability) |
| SR-I-08 | Interface | The twin shall supply ground-truth pose to validate localization error. | Review (->Doc G) |

Traceability: SR-P-16 -> CEC-03/CEC-02, M9; SR-F-08/09 -> grasp decision (M7); SR-P-17 -> M10; SR-P-18 -> CEC-01/M6; **SR-I-07 -> M8 (allocated tolerance)**; SR-I-08 -> twin (M13).

---

## 10. Design Decisions

- **DD-22 Back-projection + explicit frame chain** (camera->robot->field) for pose. *Rationale:* Section 6.2 to 6.3; transparent, calibratable geometry. *Serves:* SR-P-16.
- **DD-23 EKF fusion of GNSS + IMU + odometry** for rover state; **stereo + prior** for fruit position. *Rationale:* Section 6.5; good accuracy at edge-affordable compute. *Serves:* SR-P-17, SR-P-18. (Particle filter reserved for multimodal occlusion cases.)
- **DD-24 Pose with covariance as the localizer output.** *Rationale:* Section 6.4; downstream must reason about uncertainty. *Serves:* SR-F-08.
- **DD-25 Uncertainty-driven occlusion gate.** *Rationale:* Section 6.6; refuse untrustworthy targets. *Serves:* SR-F-09.
- **DD-26 Close staging to shrink the dominant term.** reaffirms M3 DD-14 on error-budget grounds (EI-05). *Serves:* SR-P-16.
- **DD-27 Classical fusion baseline, learned option.** *Rationale:* interpretable, verifiable baseline; learned fusion evaluated as enhancement (Section 11.2). *Serves:* SR-F-08.

---

## 11. Trade Studies

### 11.1 TS-9: State estimator
**Alternatives:** (A) **EKF**; (B) **UKF**; (C) **particle filter**; (D) **learned/end-to-end estimator**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: EKF | B: UKF | C: Particle | D: Learned |
|--------------------|:---:|:---:|:---:|:---:|
| Accuracy under mild nonlinearity (0.24) | 4 | 5 | 5 | 4 |
| Compute cost within edge budget (0.24) | 5 | 4 | 2 | 3 |
| Honest/consistent uncertainty (0.20) | 4 | 4 | 5 | 2 |
| Handles multimodal (occlusion) belief (0.16) | 2 | 2 | 5 | 3 |
| Verifiability / interpretability (0.16) | 5 | 5 | 4 | 2 |
| **Weighted total** | **4.08** | **4.04** | **3.92** | **2.94** |

**Selected: A (EKF) as the baseline**, with a **particle filter invoked for heavy-occlusion multimodal cases** and UKF as a drop-in if linearization proves lossy. EKF wins on compute (CEC-01/edge) and interpretability while giving honest covariance. Learned end-to-end estimation is deferred (weak uncertainty guarantees, hard to verify), a capstone/research option. Recorded weakness: EKF can be over-confident under strong nonlinearity; mitigated by consistency checking (Section 7.3 grad) and the occlusion gate.

### 11.2 TS-10: Fusion coupling & learned vs. classical (summary)
**Alternatives:** loosely-coupled classical, tightly-coupled classical, learned fusion. **Criteria:** accuracy, uncertainty honesty, compute, verifiability. **Outcome:** **tightly-coupled classical** for the rover state (better accuracy, still verifiable); learned fusion evaluated only as an enhancement with a classical fallback (the system-level AI rule: learning bounded by a verified baseline). Scopes M7/M13 integration.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **The placement error budget.** *Verdict: promoted from watchlist to full CEC, **CEC-03**, designated here at mastery* (Section 6.7). It is a recurring analytical/design tool (M1->M3->**M5**->M8->M13->M14), satisfying the recurrence and mastery tests. The register is updated accordingly, and the Knowledge Architecture's error-budget thread is marked Mastered at M5.
- **Recursive state estimation (Kalman/EKF).** *Verdict: not a separate CEC.* It is a mastered *technique* within this module rather than a cross-module recurring anchor; it is captured in the Knowledge Architecture's estimation thread, not the CEC set (keeping the anchor set small per the Design Rule).
- **EI-05 (Attack the Dominant Error Source)** is added as an Engineering Insight, reinforcing CEC-03. *(One new CEC, one new EI this module.)*

> **Simulation-first hook.** The twin supplies exact ground-truth pose (SR-I-08), so localization error and covariance *consistency* can be measured in SIL before any field data, and the assembled budget (CEC-03) tested against the capture tolerance in simulation.

---

## 12. Simulation Activities

M5 runs at **Simulation + SIL** with the twin as the **ground-truth oracle** for localization.

**SA-1, Pixel->robot pose in the loop.** Feed M4 detections (on twin imagery) through back-projection and the frame chain; compare the computed robot-frame pose to the twin's known fruit pose. *Outcome:* localization geometry validated against exact ground truth.

**SA-2, Covariance consistency check.** Compare the localizer's reported covariance to the empirical error distribution over many twin trials; detect over-/under-confidence. *Outcome:* an honest-uncertainty audit (guards the Section 6.4 hazard).

**SA-3, Fusion reduces uncertainty.** Run the EKF fusing simulated GNSS+IMU+odometry; watch the covariance shrink at each update and grow during prediction. *Outcome:* fusion's value made visible.

**SA-4, Budget vs. capture tolerance.** Assemble $\sigma_\text{place}$ from twin-measured terms and test $3\sigma\le c$ (CEC-03/CEC-02); vary staging range and watch the dominant depth term move the verdict (EI-05). *Outcome:* the accuracy contract exercised in simulation.

---

## 13. Digital Twin Activities

**DTA-1, Ground-truth validation harness (deliverable to Doc G).** Specify how the twin exposes exact fruit and rover poses to score localization error and covariance consistency. *Outcome:* SR-I-08; the standing localization regression test.

**DTA-2, Error-budget instrument.** In the twin, measure each budget term ($\sigma_Z,\sigma_\text{cal},\sigma_\text{he},\sigma_\text{sync},\sigma_\text{est}$) and RSS-combine; identify the dominant term (EI-05) and record the mechanism-tolerance allocation $\sigma_\text{mech}$ for M8. *Outcome:* CEC-03 populated with real numbers; SR-I-07 issued.

**DTA-3, Occlusion-gate tuning.** Sweep the gate threshold in the twin; trade rejected-good-fruit (yield loss, recall, EI-04 link) against accepted-bad-grasps (damage). *Outcome:* the gate set from consequence, connecting EI-04 and CEC-03.

---

## 14. Hardware Activities

*(Tiered: calibration and measurement protocols at specification level.)*

**HA-1, Frame-chain calibration protocol.** Specify measurement of hand-eye and extrinsic transforms and their residuals ($\sigma_\text{he},\sigma_\text{cal}$) feeding the budget. *Deliverable:* calibration residuals for CEC-03.

**HA-2, Localization accuracy protocol.** Specify how to measure real robot-frame pose error against a surveyed reference at the pick station to verify SR-P-16. *Deliverable:* a field localization-error procedure (hand-off to M14).

---

## 15. Software Activities

**SWA-1, Localizer module.** Specify the localizer that consumes detections (M4) + depth (M3) + rover state and emits **pose-with-covariance** plus a gate decision. *Outcome:* the interface M11 will realize as a node.

**SWA-2, Filter implementation & consistency test.** Specify the EKF implementation and an automated covariance-consistency test (normalized innovation squared) run against the twin. *Outcome:* an estimator that is not just accurate but *honest*.

---

## 16. ROS 2 Integration

The localizer is a **perception/estimation node** subscribing to detections (M4), depth (M3), and rover-state topics, and publishing a **fruit pose with covariance** plus a gate flag, consumed by the decision/grasp stage (M7) and manipulator (M8/M9). Interface decisions fixed here: a pose-with-covariance message type (never a bare point), timestamps for temporal alignment ($\sigma_\text{sync}$), and placement of the estimator on the perception plane with its output crossing to the control plane at a defined rate (CEC-01 latency). M11 masters the realization; M5 fixes the contract that the Act stage receives uncertainty, not false precision.

---

## 17. AI Integration

- **Learned vs. classical fusion (TS-10).** Classical EKF is the verifiable baseline; learned fusion/depth-completion is evaluated as an enhancement, always with a classical fallback and honest uncertainty, the system AI rule.
- **Uncertainty for learning.** The pose covariance (Section 6.4) is exactly the signal a risk-aware grasp policy (M7) needs: it should act confidently on tight covariances and cautiously (or defer) on loose ones, a direct use of CEC-03 output by the AI decision layer.
- **Detections in, pose out.** This module consumes M4's learned detections and converts them to metric targets; perception-model errors (EI-04's operating point) propagate into $\sigma_\text{est}$ here, a cross-module coupling the budget makes explicit.

---

## 18. Edge Computing Integration

Estimation adds compute and latency that spend the cycle-time budget (CEC-01): the filter and covariance propagation run every cycle on the edge device. Two constraints fixed here, mastered in M6: (1) the estimator choice (EKF over particle filter, TS-9) is partly an *edge-budget* decision, particle filters are accurate but compute-heavy; (2) fusion latency becomes $\sigma_\text{sync}$ in the placement budget on the moving rover, linking edge timing (M6) directly to localization accuracy (CEC-03). Attacking the dominant *latency* term is EI-05 applied to the time budget.

---

## 19. Fluid Power Integration

M5 produces the target the fluid-powered grasp acts on, and its **covariance is the input the compliant grasp must tolerate**. The link to CEC-02 is now quantitative: the grasp lands inside the Grip-Force Window only if $3\sigma_\text{place}\le c$ (CEC-03). Where localization uncertainty is large relative to $c$, the compliant, fluid-backed gripper's tolerance to positional error (its conformance widens the effective capture region) is what rescues the grasp, meaning M9's fluid compliance is not only a bruising remedy (M2) but also a *localization-uncertainty* remedy. This module hands M9 both the pose and the covariance it must absorb.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M5-1, Error-Budget Assembler.** Sliders for each $\sigma$ term and the capture tolerance $c$; live $\sigma_\text{place}$, $3\sigma$ vs. $c$ verdict, and a highlighted **dominant term** (EI-05); a "stage closer" control that shrinks $\sigma_Z$. *Goal:* CEC-03 + EI-05 made tactile.
- **W-M5-2, Frame-Chain Visualizer.** A pixel back-projected and transformed through camera->robot->field frames, with a wrong/stale transform toggled to show the frame-chain failure. *Goal:* Section 6.2 to 6.3.
- **W-M5-3, Kalman Fusion Sandbox.** Two noisy sensors fused; sliders on each noise; watch the gain and the covariance shrink. *Goal:* Section 6.5.
- **W-M5-4, Covariance-vs-Window Overlay.** The pose covariance ellipse drawn over the Grip-Force Window's capture tolerance, showing grasp feasibility as uncertainty changes. *Goal:* CEC-02<->CEC-03 link.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M5-1** The machine's coordinate frames (camera, manipulator/base, rover, field) with transforms labeled.
- **CAD-M5-2** Pose covariance ellipsoid on a fruit at the pick station, overlaid with the capture tolerance.
Format per ->Doc J (SVG geometry/frame diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M5-1 | Back-projection (pixel + depth -> camera point) | Section 6.2 |
| F-M5-2 | Frame chain camera->robot->field with transforms | Section 6.3 |
| F-M5-3 | Covariance propagation through a transform | Section 6.4/Section 7.2 |
| F-M5-4 | Kalman predict/update cycle with covariance | Section 6.5 |
| F-M5-5 | **Placement error budget (RSS) with dominant term highlighted** | Section 6.7/Section 7.5 (central) |
| F-M5-6 | Covariance ellipse vs. capture tolerance (grasp feasibility) | Section 7.5 / CEC-02 |
| F-M5-7 | Occlusion/uncertainty gate decision | Section 6.6 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M5-1** A pixel back-projecting and riding the frame chain to a robot-frame point, with a covariance ellipsoid attached.
- **AN-M5-2** The Kalman covariance shrinking on updates and growing on prediction as sensors report.
- **AN-M5-3** The error budget re-balancing as staging range changes, the dominant depth term collapsing (EI-05).

---

## 24. Laboratory

**Lab M5, Localizing the Fruit and Closing the Error Budget**

- **Objectives.** (1) Compute robot-frame fruit pose from detection + depth + frame chain; (2) fuse sensors with an EKF and propagate covariance; (3) assemble and allocate the placement error budget (CEC-03) and test $3\sigma\le c$; (4) identify and attack the dominant term (EI-05); (5) validate against twin ground truth.
- **Equipment.** The digital twin (ground-truth pose); provided detections/depth or a stereo dataset [VERIFY@PUB]; an EKF implementation/notebook. **Safety:** computer-based.
- **Procedure.**
  1. Back-project provided detections and transform through the frame chain to robot-frame poses (SA-1); compare to twin ground truth; report error.
  2. Propagate input covariances through the chain (Section 7.2); compare the reported covariance to the empirical error spread (SA-2), is the estimator honest?
  3. Fuse GNSS+IMU+odometry (or stereo+prior) with the EKF; record the covariance reduction (SA-3).
  4. Assemble $\sigma_\text{place}$ from measured terms; test $3\sigma\le c$; if it fails, identify the dominant term and apply EI-05 (stage closer, recalibrate, or tighten $\sigma_\text{mech}$); record the mechanism-tolerance allocation for M8 (SR-I-07).
  5. Tune the occlusion gate against the yield-vs-damage trade (DTA-3).
- **Data collection.** Pose-error table (vs. ground truth); covariance-consistency result; fusion covariance-reduction log; budget table with dominant term; gate-tuning results.
- **Analysis.** Which term dominates, and by how much does attacking it move $3\sigma$? Is the estimator over-confident? What $\sigma_\text{mech}$ does M8 inherit?
- **Discussion.** Why deliver covariance, not a point? How does staging range trade against the budget (EI-05)? How should the grasp module use the covariance (CEC-02)?
- **Deliverables.** A 4 to 6 page report: pose-error validation, covariance consistency, fusion result, assembled/allocated budget with dominant-term analysis, gate tuning.
- **Rubric (100 pts).** Pose computation & validation (18); covariance propagation & consistency (18); EKF fusion (16); budget assembly/allocation & $3\sigma$ test (22, CEC-03); dominant-term analysis (14, EI-05); communication (12). *Graduate band adds:* EKF consistency (NIS) analysis and a covariance-propagation derivation, with a cited source.
- **Expected results.** Localization error consistent with the budget; a covariance that must be checked for honesty; depth-at-range as the usual dominant term, collapsing when staged close; a concrete $\sigma_\text{mech}$ handed to M8; a gate threshold set from the yield/damage consequence.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Back-projection & transform.** Given intrinsics, a pixel, a depth, and a hand-eye transform, compute the robot-frame fruit position.
2. **Covariance propagation.** Propagate a given input covariance through a stated transform ($\Sigma_y=J\Sigma_xJ^\top$); report the output uncertainty.
3. **Error budget.** Assemble $\sigma_\text{place}$ from six terms; test $3\sigma\le c$; identify the dominant term and compute the effect of halving it vs. halving a small term (EI-05).
4. **Kalman update.** Given predict/update matrices and a measurement, compute the gain, updated estimate, and updated covariance; interpret the gain.
5. **(Grad) EKF consistency.** Define the normalized innovation squared and explain how it detects an over-confident filter; propose a corrective action.
6. **(Grad) Allocation optimization.** Given a fixed capture tolerance and the cost of reducing each error source, allocate the budget to meet $3\sigma\le c$ at minimum effort, a constrained optimization that formalizes EI-05.

---

## 26. Quiz

1. **(MC)** The localizer's proper output is: (a) a pixel; (b) a bare 3-D point; (c) a 3-D pose with covariance; (d) a bounding box. **[c]**
2. **(MC)** In an RSS budget with one dominant term, the total is approximately: (a) the sum of all terms; (b) the smallest term; (c) the dominant term; (d) the average. **[c]**
3. **(MC)** The Kalman gain weights a measurement in proportion to: (a) its age; (b) the inverse of its noise (relative to the prediction); (c) its magnitude; (d) the frame rate. **[b]**
4. **(MC)** The occlusion/uncertainty gate exists to: (a) speed the filter; (b) reject targets too uncertain to grasp safely; (c) improve recall; (d) calibrate the camera. **[b]**
5. **(Short)** State CEC-03 and its pass condition. **[Independent placement errors combine in quadrature; grasp succeeds iff $3\sigma_\text{place}\le c$, the capture tolerance from CEC-02.]**
6. **(Calc)** Terms 10, 4, 3, 2 mm (RSS). Compute $\sigma_\text{place}$ and name the dominant term. **[$\sqrt{100+16+9+4}=\sqrt{129}\approx11.4$ mm; dominant = 10 mm term.]**
7. **(Calc)** In problem 6, by how much does halving the 10 mm term reduce $\sigma_\text{place}$ vs. halving the 2 mm term? **[Halving 10->5: $\sqrt{25+16+9+4}=\sqrt{54}\approx7.35$ mm (-36%). Halving 2->1: $\sqrt{100+16+9+1}=\sqrt{126}\approx11.22$ mm (-1.5%). EI-05.]**
8. **(Design)** How should the grasp module (M9) use the pose covariance rather than the mean alone? **[Act confidently on tight covariance; widen approach / rely on compliance / defer on loose covariance relative to $c$.]**
9. **(Critical thinking)** Why is staging the fruit close the most effective localization decision on this machine? **[Depth error ∝ $Z^2$ is often the dominant budget term; short range collapses it, EI-05 + M3 DD-14.]**
10. **(Critical thinking)** Why is an over-confident filter dangerous even if its mean is accurate? **[It under-reports uncertainty, so the gate and grasp trust positions they should not, attempting grasps that miss the window.]**

---

## 27. Challenge Problems

- **CP-M5-A, The full pick success model.** Combine the detection operating point (EI-04, M4), the placement budget (CEC-03), and the Grip-Force Window (CEC-02) into a single probability-of-successful-pick model; use it to choose staging range and operating point jointly under the cycle-time budget (CEC-01). (Bridges four modules and three anchors.)
- **CP-M5-B, Minimum-effort budget closure.** Given per-source reduction costs, formulate and solve the allocation that meets $3\sigma\le c$ at least cost (formalizing EI-05); identify the shadow price of the capture tolerance.
- **CP-M5-C, Design a covariance-aware grasp interface.** Specify how the localizer's covariance is consumed by the grasp policy (M7) and the compliant gripper (M9): what the grasp does for tight vs. loose covariance, and how fluid compliance (M9) absorbs residual localization error to widen the effective capture region.

---

## Engineering Design Review

*Not graded. These are the questions a review board would ask. Argue positions with evidence; the goal is engineering judgment, not a "right answer."*

1. **Assumptions.** The placement budget (CEC-03) assumes error sources are independent and Gaussian so they add in quadrature. Where in this machine might that fail, e.g., correlated calibration and hand-eye errors from a shared fixture, or non-Gaussian depth outliers from occlusion? How would each violation change your allocation, and how would you detect it?
2. **Tradeoffs.** You chose an EKF over a particle filter primarily on compute grounds. Defend that choice to a reviewer who argues the fruit-pose belief is genuinely multimodal under heavy occlusion. State the specific condition under which you would switch, and how you would know it at runtime.
3. **Risk.** Your dominant term is depth error, controlled by staging the fruit close. What happens to the budget, and the grasp, if staging fails and a fruit is localized at longer range? What runtime safeguard prevents an unsafe grasp in that case, and does it cost yield?
4. **Verification.** You validated localization error against twin ground truth, but the twin's virtual sensors were tuned by your team. A reviewer challenges the independence of that validation. What additional, independent evidence would make the localization accuracy claim credible before field deployment?
5. **Subsystem interaction.** The localizer emits a pose covariance. Precisely how should the grasp module (M9) and the compliant gripper use that covariance, not just the mean, and what should the machine do when the covariance is large relative to the Grip-Force Window's capture tolerance (CEC-02)?
6. **Interaction / timing.** Better fusion generally means more computation and latency, which spends the cycle-time budget (CEC-01) and *increases* $\sigma_\text{sync}$ on the moving rover. Who owns this cross-subsystem tradeoff, and how would you set the estimation effort so accuracy and throughput are jointly acceptable?

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (geometry, estimation, the budget) are the core (~3 h); the CEC-03 designation (Section 6.7) and EI-05 (Section 7.4) are the intellectual peaks. Trade studies + CEC evaluation (Section 11) and twin activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M5 is a separate 2 to 3 h session. The Engineering Design Review works well as a live, whole-class discussion (~30 to 40 min).
- **Common misconceptions.** (1) Treating localization as a point, not a distribution, force pose-with-covariance. (2) Trusting a filter's covariance blindly, teach consistency checking. (3) Optimizing the easy error term, EI-05 exists to break this habit. (4) Thinking calibration is one-and-done, it drifts and is a live budget term.
- **On CEC-03 and EI-05.** Emphasize the pairing: the CEC is the *tool* (the budget); the Insight is the *judgment* (attack the dominant term). Students should leave able to both build a budget and know where to spend effort on it.
- **On the Engineering Design Review.** Make clear it is not assessment. Reward disagreement supported by reasoning; these questions mirror real design-review probes and build the habit of defending decisions under challenge.
- **Where to push graduate students.** EKF consistency (HW5), minimum-effort allocation (HW6, CP-M5-B), and the covariance-aware grasp interface (CP-M5-C).
- **Thread to keep visible.** Close by naming hand-offs: pose+covariance -> M7 decision / M9 grasp; $\sigma_\text{mech}$ allocation -> M8; validated localizer -> M13/M14.

---

## 29. Research Frontiers

- **Landmark grounding.** Standard references in multiple-view geometry (camera models, triangulation) and in estimation/sensor fusion (Kalman/EKF/particle filtering); the visual-inertial and GNSS-fusion literature for field robots. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Learned and hybrid estimators with calibrated uncertainty; visual-inertial odometry and tightly-coupled GNSS-VIO for agricultural platforms; uncertainty-aware and amodal perception that localizes partially occluded objects; differentiable filtering that blends classical structure with learned components while retaining uncertainty.
- **Open problems.** Reliable, well-calibrated uncertainty from learned localization; robust multimodal fruit-pose estimation under severe occlusion; drift-free field-scale localization without RTK; principled, automatic error-budget allocation across learned and classical subsystems.
- **Suggested thesis directions.** (1) A differentiable, uncertainty-calibrated fruit localizer whose covariance provably feeds the grasp decision. (2) Occlusion-robust amodal 3-D localization for canopy-buried fruit. (3) An automatic CEC-03 allocator that minimizes total design effort to meet the capture tolerance.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Multiple-view-geometry reference (e.g., Hartley & Zisserman), projection, back-projection, transforms (Section 6.2 to 6.3).
- Estimation / sensor-fusion references (Kalman/EKF/UKF/particle filtering), recursive estimation and uncertainty (Section 6.5).
- Visual-inertial / GNSS-fusion literature, rover-state estimation for field robots (Section 6.5).
- Robotics kinematics/transform references, SE(3) and frame chains (Section 6.3; hand-off to M8).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 4**, and (forthcoming) Doc B, Doc D, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters 3-D localization, fusion, and state estimation, and, the curriculum's payoff for this module, **assembles and formally designates CEC-03 (the Placement Error Budget)** at its mastery point, closing the accuracy contract that binds perception, calibration, estimation, and mechanism to the Grip-Force Window (CEC-02). It pairs the tool with judgment via **EI-05 (Attack the Dominant Error Source)**, derived rigorously from the RSS math and tied to the machine's close-staging decision. It treats a target correctly as a *distribution* (pose + covariance), which is the graduate-level point most courses miss. All 30 sections are present; the new **Engineering Design Review** section is included and framed as judgment, not assessment; every standing convention is exercised (spine callback, CEC-02/CEC-03 links, the explicit CEC evaluation that promotes CEC-03 and adds EI-05, Bloom tags, module-specific failure cases). Simulation-first is realized concretely: the twin is the ground-truth oracle for localization error and covariance consistency.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Capture tolerance, per-source σ values, and localization-accuracy targets depend on Doc B and real calibration/field data; the geometry, estimation, and budget *methods* are exact.
2. **$\sigma_\text{mech}$ is issued but not yet owned.** The mechanism-tolerance allocation is handed to M8 (SR-I-07); its feasibility is confirmed only when M8 is authored, a forward dependency, flagged.
3. **Covariance honesty depends on real sensor-noise models.** The consistency checks are specified; their validity rests on M3 noise models and real data (the sim-to-real caveat).
4. **The twin ground-truth harness is specified, not built** (Doc G), the same critical path noted since M2.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B and Doc G and by proceeding to M8.

**END OF MODULE 5, STOP. Awaiting your review before freezing Module 5 or proceeding to Module 6.**
