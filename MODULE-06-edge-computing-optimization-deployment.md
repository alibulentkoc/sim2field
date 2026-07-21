# Module 6: Edge Computing, Optimization & Deployment

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M6, **Part III, Decide (compute substrate)**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Software-in-the-Loop -> **Hardware-in-the-Loop**, the twin drives the real edge device
**Prerequisites:** M1 (cycle-time budget CEC-01, no-cloud constraint), M4 (the perception model to deploy), M5 (the estimator to run, CEC-03 latency term σ_sync). Math: algorithms basics, probability.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 5**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. P0-document authority tagged **[->Doc B/C/E/G/H/I]**; perishable/vendor values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** formal designation of **CEC-04 (the No-Cloud Edge Boundary)** at its mastery point; **Engineering Insight EI-06**; and the module's **Engineering Design Review** section.

> *Core concept in use.* This module builds the **compute substrate** on which the **Signal-to-Action Spine (CEC-01)** actually runs. Perceive (M4/M5) and Decide/Act (M7 to M9) are only real if they execute on-robot, in time, that is what this module guarantees.

---

## 1. Module Overview

**Mission.** This module makes the machine's intelligence deployable: it fits the perception-and-control pipeline onto the edge device within the cycle-time budget, optimizes the models to get there, and crosses from software-in-the-loop to hardware-in-the-loop, where the digital twin drives the real compute hardware.

**Previous milestone.** Every capability built so far, detection, ripeness, localization, the estimator that carries covariance, has been designed as if computation were free. It is not. On a machine in a field, computation happens on a small on-robot device, under hard limits of latency, power, and heat, with no cloud to offload to.

**Engineering problem.** The organizing constraint is one this course has carried since Module 1 and now masters: no cloud in the control loop. A field has no guaranteed network; a control loop that depends on one stalls when it drops. Everything the machine needs to decide and act must close on-robot.

**Design tension.** This runtime-versus-development boundary is a recurring design tool: it governs what computation is allowed in the loop and what belongs offline, and because it recurs across the perception, decision, grasp, and integration modules, this module elevates it to a Core Engineering Concept: CEC-04, the No-Cloud Edge Boundary. The module's practical lesson is one every performance engineer learns painfully: your intuition about where the time and heat go is usually wrong. Datasheets promise throughput the real workload never sees; a "slow" model turns out to be memory-bound, not compute-bound; an accelerator throttles under field heat. The discipline is to measure on the actual target under real load, then attack the measured bottleneck, the module's Engineering Insight (EI-06), which sharpens EI-05's "attack the dominant term" into "first, measure it."

**What this module resolves.** By the end you will assemble a latency/power budget on real edge hardware, optimize a model to meet it without surrendering the recall that protects yield, and verify the whole stack in hardware-in-the-loop.


## 2. Learning Objectives

- **LO-M6.1** Explain the no-cloud edge architecture and partition every capability into runtime (on-robot) and development (off-robot) sides., *Bloom: Understand (with Analyze)*
- **LO-M6.2** Assemble an end-to-end latency budget for the perception+control pipeline and fit it within the cycle-time budget (CEC-01) on the target device., *Bloom: Apply (with Evaluate)*
- **LO-M6.3** Apply the roofline model and Amdahl's law to locate the true bottleneck of a workload., *Bloom: Analyze*
- **LO-M6.4** Optimize a model (quantization, pruning, distillation, compilation, accelerators) and quantify the accuracy-latency-power tradeoff., *Bloom: Apply (with Evaluate)*
- **LO-M6.5** Measure latency, throughput, power, and thermal behavior on the real edge device under representative load., *Bloom: Apply*
- **LO-M6.6** Design and run a hardware-in-the-loop test in which the twin drives the deployed stack., *Bloom: Create*
- **LO-M6.7** Select an operating point that meets latency/power budgets while protecting mission-critical accuracy (EI-04 on the edge)., *Bloom: Evaluate*

Maps to course objectives **LO5** (primary), **LO3/LO7** (reinforcing), and ABET **SO1, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Draw the no-cloud runtime/development partition for the machine and audit that no runtime path crosses it., *Bloom: Analyze*
2. Build a latency/power budget and test it against the cycle-time budget on real hardware., *Bloom: Evaluate*
3. Use roofline/Amdahl reasoning to find the bottleneck before optimizing., *Bloom: Analyze*
4. Quantize/compile a model and report the accuracy, latency, and energy change., *Bloom: Apply*
5. Measure on the target device and distinguish datasheet from delivered performance., *Bloom: Apply*
6. Specify and run a hardware-in-the-loop test with the twin., *Bloom: Create*

---

## 4. Engineering Motivation

Module 4 named the *latency-overrun* failure: accuracy that arrives too late is worthless. This module is where that failure is prevented, and it turns out that "make it run on-robot" is not a packaging afterthought but a genuine engineering problem with its own physics of computation.

The pressures are concrete and simultaneous. **Latency:** the perception+control pipeline must complete within the perception-and-control share of the cycle-time budget (CEC-01), or the machine cannot keep pace with its own driving speed. **Power:** the device draws from a finite rail; every watt spent computing is a watt not driving or actuating, and energy per inference sets how long the machine runs. **Heat:** an SoC that overheats *throttles*, its delivered performance silently collapses below its datasheet, and a pipeline that passed on the bench fails in the sun. **Connectivity:** there is none to rely on, so nothing in the loop may depend on the cloud. And underneath all of it, the trap that ends careers: **"it worked on my laptop."** A workstation GPU is not the robot's edge device; performance measured on the wrong platform is a fiction.

The motivation, then, is that intelligence is only useful if it is *deployable*, fast enough, cool enough, frugal enough, and self-contained enough to run in a field. This module supplies the discipline to get there: budget the compute, find the real bottleneck by measurement, optimize the model against a mission-aware operating point, and prove it in hardware-in-the-loop before the field ever sees it.

---

## Engineering Failure Cases (edge-deployment-specific)

Sharpening Module 1's *environmental* and *integration* failure classes at the compute substrate:

- **Latency overrun.** The pipeline is accurate but exceeds its cycle-time share on the target device; the machine stalls or drops fruit. *Motivates* the latency budget (Section 7.1) and optimization (Section 6.5).
- **Thermal throttle in the field.** The device passes on the bench, then throttles under sun and enclosure heat; delivered performance collapses. *Motivates* thermal/power analysis (Section 6.6) and measuring on the target (EI-06).
- **Cloud-dependence in the loop.** A runtime path quietly depends on a network service; it stalls when connectivity drops. *Motivates* the no-cloud boundary audit (CEC-04, Section 6.2).
- **Accuracy lost to optimization.** Aggressive quantization/pruning meets latency but sacrifices the recall that protects yield. *Motivates* the accuracy-latency operating point (Section 6.5, EI-04 revisit).
- **Optimizing the wrong thing.** Effort is spent on a non-bottleneck because performance was guessed, not measured. *Motivates* EI-06 and roofline/Amdahl reasoning (Section 6.4).

Each is a design or discipline failure this module prevents.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** basic algorithms and complexity; the M1 cycle-time budget (CEC-01) and no-cloud constraint (SR-C-01, DD-4); the M4 perception model and its latency target (SR-P-15); the M5 estimator and the σ_sync latency term of the placement budget (CEC-03). Elementary probability for accuracy metrics.

**Introduced here, used later:** the vocabulary of edge deployment, *latency vs throughput, pipeline, roofline (compute- vs memory-bound, arithmetic intensity), Amdahl's law, quantization (INT8), pruning/sparsity, distillation, operator fusion, compilation/graph optimization, accelerator (GPU/DLA/NPU), thermal throttling, energy per inference, hardware-in-the-loop*. Treated at applied (L2) depth; real-time scheduling is introduced but **mastered in M11** [->Doc H].

**Where this sits in the dependency graph.** M6 hard-depends on M4 (model) and M5 (estimator), and on M1 (budgets, no-cloud). It **masters** the edge-deployment/optimization thread and **designates CEC-04**; it **reinforces** the power/embedded thread (feeding M12) and **introduces** real-time scheduling (feeding M11). It hands forward: the deployed, budgeted runtime stack to M7/M9 (which run their decision/grasp loops on it), the measured power/thermal profile to M12, and the real-time timing constraints to M11.

---

## 6. Theory

### 6.1 The edge computing problem
The machine computes on an on-robot system-on-chip with accelerators (a Jetson-class device [VERIFY@PUB]), drawing from a shared power rail inside a hot enclosure, with no dependable network. The problem: run the full perceive->decide->act pipeline **on that device, within latency, power, and thermal budgets, with no cloud in the loop.** Every later runtime capability inherits this substrate.

### 6.2 The no-cloud boundary: runtime vs development
Partition every capability into two sides:

- **Runtime (on-robot, in the loop):** detection, localization, decision, grasp control, safety, everything the machine needs to perceive and act, closing entirely on-robot with no network dependency.
- **Development (off-robot):** training, synthetic-data generation, calibration computation, heavy analysis, model compilation, over-the-air updates, done off the robot, at development time, and *delivered* as artifacts.

The rule: **no runtime path may depend on an off-robot resource.** This boundary is a design *tool*, you apply it to classify each capability and to audit the architecture for hidden cloud dependencies, and it recurs across perception (M4), decision/grasp (M7/M9), and real-time integration (M11). It is designated here (Section 11.3) as CEC-04.

### 6.3 Latency and throughput
**Latency** is the time from input to result for one item; **throughput** is items per second. A pipeline can have high throughput yet unacceptable latency (deep buffering), or low latency yet insufficient throughput. The harvester needs both: end-to-end latency within the cycle-time share (CEC-01), and throughput ≥ the fruit arrival rate. Latency also feeds accuracy: on the moving rover, processing latency becomes the σ_sync term in the placement budget (CEC-03), slow compute literally displaces the target.

### 6.4 Finding the bottleneck: roofline and Amdahl
Two tools locate where performance is actually lost:

- **Roofline model.** Achievable performance is bounded by $\min(\text{peak compute},\ \text{arithmetic intensity}\times\text{memory bandwidth})$. A workload is **compute-bound** (limited by FLOPs) or **memory-bound** (limited by data movement); the fix differs entirely. Many perception kernels are memory-bound, so "a faster core" does nothing, a classic misdiagnosis.
- **Amdahl's law.** Overall speedup from accelerating a fraction $p$ of the work by factor $s$ is $\text{speedup}=1/\big((1-p)+p/s\big)$. The un-accelerated part caps the gain: optimizing a 20%-of-time stage to infinite speed yields at most 1.25×. The bottleneck governs, a reinforcement of EI-05 (attack the dominant term) in the time domain.

### 6.5 Model optimization and the accuracy-latency-power tradeoff
To fit the budget, shrink the model's runtime cost:

- **Quantization** (e.g., FP32->INT8): fewer bits per weight/activation, large speed/energy gains on integer accelerators, at a bounded accuracy cost (quantization error).
- **Pruning/sparsity:** remove low-importance weights/channels.
- **Knowledge distillation:** train a small model to mimic a large one.
- **Operator fusion & compilation** (TensorRT-class graph optimization): fuse ops, pick optimal kernels for the specific accelerator, often the largest single win with no accuracy loss.
- **Accelerator mapping:** place work on the GPU/DLA/NPU best suited to it.

Every technique except pure compilation trades some accuracy for speed/energy. The choice of how far to push is an **operating-point** decision, and per EI-04, it is made from consequence: preserve the recall that protects yield (M4), spend the accuracy you can afford elsewhere. Accuracy that overruns latency is worthless; accuracy sacrificed below the yield threshold is also worthless. The optimum lives between.

### 6.6 Power and thermal reality
Delivered performance is not the datasheet. Under sustained load in a hot enclosure, an SoC **thermally throttles**, dropping clocks to protect itself, so a pipeline validated cold can miss its latency budget hot. **Power** is budgeted too: energy per inference ($\text{power}\times\text{latency}$) times inferences per harvest sets the energy draw, competing with drive and actuation on a shared rail. These are *physical* constraints measured on the real device under real thermal conditions, never assumed. (Power/thermal design is mastered in M12; M6 fixes the budgets and the measurement discipline.)

### 6.7 Real-time considerations (introduced; mastered in M11)
The control loop needs **bounded worst-case latency**, not merely good average latency, a single late cycle can destabilize grasp-force regulation (CEC-02) or miss a fruit. This introduces determinism, scheduling, and worst-case analysis, which M11 masters; here we note that the edge stack must be architected so the real-time control path is isolated from best-effort perception jitter.

### 6.8 Hardware-in-the-loop (HIL)
The lifecycle now advances from SIL to **HIL**: the digital twin generates sensor streams and scenes that drive the *real* edge device running the *deployed* stack, measuring true latency, power, and thermal behavior against the budgets, the last validation before field hardware, and the honest test that catches "worked on my laptop."

---

## 7. Mathematics

Rigor tier for M6: **L2** (applied). The central result is latency/power budget closure on the target device.

### 7.1 The latency budget (central result)
Allocate the perception-and-control share of the cycle time:
$$ T_\text{compute} = t_\text{detect} + t_\text{localize} + t_\text{decide} + t_\text{control} \;\le\; T_\text{cycle,compute-share}\ \ (\text{from CEC-01}). $$
Populate with **measured** per-stage latencies on the target device (EI-06), identify the dominant stage (EI-05), optimize it (Section 6.5), and re-measure. If it will not close, the levers are: optimize the dominant stage, move work to a faster accelerator, reduce input resolution/rate (trading accuracy, EI-04), or increase the cycle-time budget by staging/slowing (interacting with CEC-01 and throughput).

### 7.2 Throughput and arrival rate
Throughput must satisfy $\text{rate} \ge d/v$-implied arrival (M1). Pipelining raises throughput without lowering per-item latency; but buffering that raises latency can violate Section 7.1 and inflate σ_sync (CEC-03). *Use:* balance latency and throughput, not one at the other's expense.

### 7.3 Roofline and Amdahl (applied)
Place each kernel on the roofline (compute- vs memory-bound) to choose the right optimization; apply Amdahl's law to bound the payoff of accelerating a given stage. *Use:* avoid optimizing a non-bottleneck (EI-06).

### 7.4 Quantization-error vs speed
Model the accuracy cost of INT8 quantization against its latency/energy benefit; choose the quantization scheme that meets latency while keeping recall above the yield threshold (EI-04). **Grad (L3):** analyze per-layer sensitivity and mixed-precision allocation, a budget-allocation problem structurally identical to CEC-03 (spend precision where it matters most).

### 7.5 Energy per harvest
$E_\text{inference}=P\times T_\text{latency}$; per-harvest energy $=E_\text{inference}\times(\text{inferences})+\ldots$. *Use:* size the compute energy against the power/thermal budget (hand-off to M12).

---

## 8. Engineering Principles

1. **The loop closes on-robot.** No runtime dependency crosses the no-cloud boundary (CEC-04).
2. **Measure on the target, then optimize** (EI-06); datasheet ≠ delivered performance.
3. **Find the bottleneck first** (roofline/Amdahl, EI-05); optimizing a non-bottleneck is wasted.
4. **Optimization is an operating-point decision** (EI-04): meet latency/power while protecting mission-critical accuracy.
5. **Design for the hot, loaded device**, validate under real thermal and load conditions, not cold and idle.
6. **The control path needs bounded worst-case latency**, not just a good average.
7. **Prove it in hardware-in-the-loop** before the field.

---

## 9. System Requirements

Derived from the deployment mission; master the compute contract. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-19 | Performance | End-to-end perception+control latency shall fit the cycle-time compute share (CEC-01) on the target device **under thermal load**. | HIL measurement |
| SR-C-05 | Constraint | No runtime path shall depend on off-robot/cloud resources (CEC-04). | Architecture audit + test |
| SR-P-20 | Performance | Post-optimization detection recall shall remain $\ge$ the yield threshold (EI-04/SR-P-13). | Benchmark on target |
| SR-P-21 | Performance | Compute power draw and energy-per-harvest shall fit the power budget [VERIFY@PUB]. | Measurement (M12) |
| SR-C-06 | Constraint | The device shall not thermally throttle below the latency budget under field conditions. | Thermal test |
| SR-P-22 | Performance | The real-time control path shall meet a bounded worst-case latency [VERIFY@PUB]. | Timing test (M11) |
| SR-I-09 | Interface | A hardware-in-the-loop rig (twin -> edge device) shall exist to verify the deployed stack. | Review (->Doc G) |

Traceability: SR-P-19 -> CEC-01; **SR-C-05 -> CEC-04**; SR-P-20 -> EI-04/M4; SR-P-21 -> M12; SR-C-06 -> M12; SR-P-22 -> M11; SR-I-09 -> twin/M13.

---

## 10. Design Decisions

- **DD-28 On-robot-only runtime (no cloud in the loop).** *Rationale:* Section 6.2; field connectivity is not guaranteed. *Serves:* SR-C-05. (CEC-04.)
- **DD-29 Quantized + compiled models on the edge accelerator.** *Rationale:* Section 6.5; large speed/energy gains meeting latency. *Serves:* SR-P-19/21.
- **DD-30 Measure-on-target optimization workflow.** profile on the device under load, attack the measured bottleneck. *Rationale:* Section 6.4, EI-06. *Serves:* SR-P-19.
- **DD-31 Recall-preserving operating point.** cap optimization aggressiveness to hold recall ≥ yield threshold. *Rationale:* EI-04. *Serves:* SR-P-20.
- **DD-32 Thermal/power headroom and graceful degradation.** design with margin; degrade to a safe, lower-rate mode under throttle rather than failing. *Rationale:* Section 6.6. *Serves:* SR-C-06.
- **DD-33 Isolate the real-time control path** from best-effort perception jitter. *Rationale:* Section 6.7. *Serves:* SR-P-22. (Realized in M11.)
- **DD-34 HIL verification rig.** *Rationale:* Section 6.8; catch throttling/latency before the field. *Serves:* SR-I-09.

---

## 11. Trade Studies

### 11.1 TS-11: Model-optimization strategy
**Alternatives:** (A) **compilation/fusion only**; (B) **+INT8 quantization**; (C) **+pruning**; (D) **+distillation**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Compile | B: +Quantize | C: +Prune | D: +Distill |
|--------------------|:---:|:---:|:---:|:---:|
| Latency/energy gain (0.30) | 3 | 5 | 4 | 4 |
| Accuracy (recall) retention (0.28) | 5 | 4 | 3 | 4 |
| Engineering effort / toolchain (0.20) | 5 | 4 | 3 | 2 |
| Hardware-accelerator support (0.12) | 4 | 5 | 3 | 4 |
| Robustness/maintainability (0.10) | 5 | 4 | 3 | 3 |
| **Weighted total** | **4.12** | **4.44** | **3.34** | **3.56** |

**Selected: B (compilation + INT8 quantization)** as the primary path, the best latency/energy gain with manageable, controllable accuracy loss and strong accelerator support; pruning/distillation held as further levers if the budget still will not close. Recorded weakness: INT8 accuracy loss must be checked against the recall threshold per fruit condition (DD-31, EI-04), and quantization sensitivity varies by layer (Section 7.4 grad).

### 11.2 TS-12: Edge compute hardware (summary)
**Alternatives:** CPU-only, SoC+GPU, SoC+GPU+DLA/NPU, FPGA. **Criteria:** latency at required accuracy, power/energy, cost, toolchain maturity, real-time determinism. **Outcome:** **SoC + GPU + DLA-class accelerator** (Jetson-class [VERIFY@PUB]), the mature toolchain, good performance-per-watt, and heterogeneous accelerators let perception and control share one device within budget. FPGA reserved for fixed, latency-critical kernels if needed.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **The No-Cloud Edge Boundary (runtime/development partition).** *Verdict: promoted from watchlist to full CEC, **CEC-04**, designated here at mastery.* It is a recurring design *tool*, introduced M1 (SR-C-01/DD-4), reinforced M4 (train-off/infer-on), **mastered M6** (edge deployment), applied M7/M9 (decision/grasp on-robot) and M11 (real-time). It is used repeatedly to classify capabilities and audit the architecture for hidden cloud dependence, meeting the recurrence and mastery tests. Register and Knowledge-Architecture links updated.
- **The latency/power budget.** *Verdict: not a separate CEC.* It is another instance of the **budget** pattern already anchored by CEC-01 (cycle-time) and CEC-03 (error); minting a third budget-CEC would dilute the set. It is treated as CEC-01 applied to compute, and reinforces EI-05 in the time domain.
- **EI-06 (Measure on the Target)** is added as this module's Engineering Insight, reinforcing CEC-04 and EI-05. *(One new CEC, one new EI, within discipline.)*

> **Simulation-first hook.** The deployed stack is validated in **hardware-in-the-loop** (Section 6.8, Section 12): the twin drives the real edge device, so latency/power/thermal are measured against the budgets on true hardware before the field, the concrete SIL->HIL transition this module owns.

---

## 12. Simulation Activities

M6 owns the **SIL -> HIL** transition; its activities move from simulated to real compute.

**SA-1, Latency budget in SIL.** Instrument the perception+control pipeline in software and assemble the latency budget (Section 7.1); identify the dominant stage. *Outcome:* a first budget and bottleneck (to be re-measured on hardware).

**SA-2, Optimization sweep.** Apply compilation and INT8 quantization; record latency, energy, and recall at each step; plot the accuracy-latency frontier and choose the operating point (EI-04). *Outcome:* a defended optimization operating point.

**SA-3, Roofline placement.** Profile the heaviest kernels and place them on the roofline (compute- vs memory-bound); predict which optimization will actually help (Section 6.4). *Outcome:* bottleneck diagnosis before effort (EI-06).

**SA-4, HIL dry run.** Drive the deployed stack on the edge device with twin-generated sensor streams; compare measured latency to the SIL estimate, expose the gap. *Outcome:* the "measure on target" lesson made concrete (EI-06).

---

## 13. Digital Twin Activities

**DTA-1, HIL rig specification (deliverable to Doc G).** Specify the hardware-in-the-loop setup: the twin streams synchronized sensor data to the real edge device running the deployed stack; the rig logs latency, power, and temperature against budgets. *Outcome:* SR-I-09; the standing deployment test.

**DTA-2, Thermal-load test.** Run the HIL rig to sustained thermal load and observe throttling; verify the latency budget holds hot, not just cold (SR-C-06). *Outcome:* an honest field-condition check.

**DTA-3, No-cloud audit.** Trace every runtime data path in the twin/stack and confirm none crosses the no-cloud boundary (CEC-04, SR-C-05). *Outcome:* a documented boundary audit.

---

## 14. Hardware Activities

*(Tiered: benchmarking/measurement protocols at specification level; runnable on the target device.)*

**HA-1, On-target benchmark protocol.** Specify measurement of per-stage latency, throughput, power, and temperature on the edge device under representative load, the empirical basis for the budget (EI-06). *Deliverable:* a benchmark harness and results template.

**HA-2, Thermal characterization.** Specify how to measure throttling onset and sustained-vs-burst performance in a representative enclosure/thermal environment. *Deliverable:* a throttling curve feeding SR-C-06 and M12.

---

## 15. Software Activities

**SWA-1, Optimization & deployment pipeline.** Specify the reproducible pipeline: trained model -> compile/quantize -> validate accuracy on target -> package -> deploy (development-time), with versioning and rollback. *Outcome:* the edge-MLOps workflow (Doc E).

**SWA-2, Runtime/development boundary enforcement.** Specify a build/deploy check that fails if a runtime component references an off-robot service (an automated CEC-04 guard). *Outcome:* the no-cloud boundary enforced in tooling, not just intention.

---

## 16. ROS 2 Integration

M6 **introduces** the real-time considerations M11 masters. The deployed nodes run on the edge device; the architecture must isolate the **real-time control path** (bounded worst-case latency, SR-P-22) from best-effort perception (which may jitter under load). Node placement, executor/scheduler choice, and quality-of-service are introduced here as *deployment* concerns, the perception plane and control plane share one device but must not share timing fate. M11 formalizes the scheduling; M6 fixes the requirement that the control loop's timing is protected from perception jitter (DD-33).

---

## 17. AI Integration

This is the module where development-time AI meets the runtime machine:

- **Optimization is model surgery with an accuracy budget.** Quantization/pruning/distillation/compilation (Section 6.5) are applied under the constraint that recall stays above the yield threshold (EI-04), the accuracy-latency operating point.
- **The boundary is enforced (CEC-04).** Training, synthesis, and compilation are development-time; only the optimized inference artifact runs on-robot. SWA-2 makes this an automated check.
- **Edge MLOps.** Model versioning, on-target validation, and controlled (development-time, not runtime-cloud) updates, the lifecycle Doc E owns, feeding the drift-monitoring introduced in M4.
- **Measured, not assumed (EI-06).** Model performance claims are only valid measured on the target under load; a model's benchmark on a workstation is not evidence for the robot.

---

## 18. Edge Computing Integration

This module *is* the edge-computing integration point for the whole machine, it is where CEC-04 is mastered. It fixes: the runtime/development partition (Section 6.2), the latency/power/thermal budgets (Section 7), the optimization operating point (Section 6.5), and the HIL verification (Section 6.8). Every later runtime capability (M7 decision, M9 grasp control, M11 real-time nodes) is allocated onto this substrate and inherits its budgets. The power/thermal *design* (as opposed to budgeting) is handed to M12; the real-time *scheduling* to M11.

---

## 19. Fluid Power Integration

The edge device runs the **grasp-control loop** (M9), so its timing directly governs grasp-force regulation within the Grip-Force Window (CEC-02). Two couplings are fixed here: (1) the control loop needs **bounded worst-case latency** (SR-P-22, DD-33), jitter in force regulation can push the grasp outside the window or destabilize it; (2) the edge's compute latency contributes to σ_sync in the placement budget (CEC-03), so slow perception literally degrades where the compliant gripper closes. Fluid-power compliance provides tolerance to these timing imperfections (a slow or slightly late command meets a compliant, back-drivable actuator rather than a stiff one), but the timing budget must still be met. M9 designs the loop; M6 guarantees the substrate can run it in time.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M6-1, Latency-Budget Builder.** Inputs: per-stage latencies (with a "measured vs. datasheet" toggle), cycle-time share. Outputs: total vs. budget, highlighted dominant stage (EI-05), pass/fail, and an Amdahl payoff estimator for accelerating each stage. *Goal:* Section 7.1/Section 7.3.
- **W-M6-2, Accuracy-Latency Frontier.** Slider over optimization aggressiveness showing recall vs. latency vs. energy and the recall-threshold line (EI-04). *Goal:* Section 6.5.
- **W-M6-3, Roofline Explorer.** Plot kernels by arithmetic intensity vs. performance; show compute- vs memory-bound regions and which optimization helps. *Goal:* Section 6.4.
- **W-M6-4, Thermal-Throttle Simulator.** Load vs. temperature vs. delivered clock, showing the latency budget breaking as the device heats. *Goal:* Section 6.6 (SR-C-06).

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M6-1** Compute topology: edge SoC + accelerators, sensor and actuator interfaces, power/thermal path (block diagram).
- **CAD-M6-2** The no-cloud boundary: runtime (on-robot) vs. development (off-robot) partition with data paths (annotated; CEC-04).
Format per ->Doc J (SVG block diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M6-1 | No-cloud runtime/development partition | Section 6.2 (CEC-04) |
| F-M6-2 | End-to-end latency budget within the cycle time | Section 7.1 |
| F-M6-3 | Roofline (compute- vs memory-bound) | Section 6.4 |
| F-M6-4 | Amdahl's-law payoff vs. accelerated fraction | Section 6.4 |
| F-M6-5 | **Accuracy-latency-energy frontier with recall threshold** | Section 6.5 (central, EI-04) |
| F-M6-6 | Thermal throttling: delivered vs. datasheet performance | Section 6.6 |
| F-M6-7 | SIL->HIL rig (twin drives real edge device) | Section 6.8 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M6-1** The latency budget filling stage by stage, the dominant stage shrinking under optimization, and the total crossing under the budget line.
- **AN-M6-2** A device heating under load, clocks dropping, and the latency budget being breached, then margin/degradation saving it.
- **AN-M6-3** The no-cloud audit: data paths lighting up, one attempting to cross the boundary and being blocked.

---

## 24. Laboratory

**Lab M6, Deploying the Pipeline to the Edge**

- **Objectives.** (1) Assemble the latency/power budget on the target device; (2) find the bottleneck by measurement (roofline/Amdahl); (3) optimize a model and quantify the accuracy-latency-energy tradeoff; (4) choose a recall-preserving operating point; (5) verify in hardware-in-the-loop under thermal load.
- **Equipment.** The target edge device (or a provided profile/emulation) [VERIFY@PUB]; the perception+estimator stack (M4/M5); the twin as HIL driver; measurement tooling (latency, power, temperature). **Safety:** electrical/thermal care with the device; standard lab practice.
- **Procedure.**
  1. Benchmark per-stage latency, power, and temperature on the target under representative load (HA-1); assemble the budget (Section 7.1) and compare to the SIL estimate, note the gap (EI-06).
  2. Profile the heaviest kernels; place them on the roofline; predict the useful optimization (Section 6.4).
  3. Apply compilation + INT8 quantization (TS-11); measure latency/energy/recall at each step; plot the frontier.
  4. Choose the operating point that meets the latency budget while holding recall ≥ threshold (EI-04); justify it.
  5. Run HIL under sustained thermal load; verify the budget holds hot (SR-C-06); audit for no-cloud dependencies (DTA-3).
- **Data collection.** On-target budget table (measured vs. SIL); roofline placement; optimization frontier; chosen operating point; HIL thermal results; no-cloud audit.
- **Analysis.** Where was the real bottleneck vs. your guess (EI-06)? How much did quantization cost in recall? Did the budget hold under heat?
- **Discussion.** Why is measuring on the target essential? What would you degrade first under thermal stress? How does compute latency feed σ_sync (CEC-03) and the cycle-time budget (CEC-01)?
- **Deliverables.** A 4 to 6 page report: measured budget, bottleneck analysis, optimization frontier, operating-point defense, HIL/thermal results, no-cloud audit.
- **Rubric (100 pts).** On-target budgeting (18); bottleneck diagnosis via roofline/Amdahl (18); optimization & tradeoff quantification (20); operating-point defense (16, EI-04); HIL/thermal verification (18); communication (10). *Graduate band adds:* per-layer mixed-precision sensitivity analysis (Section 7.4) and a cited source.
- **Expected results.** A measured budget that differs from the SIL estimate (motivating EI-06); a bottleneck often memory-bound (so "faster core" would not help); quantization meeting latency with a small, checkable recall cost; the budget holding only with thermal margin/degradation.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Latency budget.** Given per-stage latencies and a cycle-time compute share, assemble the budget, test it, and identify the stage to optimize first (EI-05).
2. **Amdahl's law.** A stage is 30% of runtime; compute the maximum overall speedup from accelerating only it by 4× and by ∞; interpret.
3. **Roofline.** Given a kernel's arithmetic intensity and the device's peak compute and memory bandwidth, determine whether it is compute- or memory-bound and which optimization helps.
4. **Optimization tradeoff.** Given latency/recall at FP32, INT8, and pruned settings, choose the operating point that meets a latency budget while holding recall ≥ threshold; justify (EI-04).
5. **(Grad) Mixed precision.** Given per-layer quantization sensitivity, allocate precision to meet latency at maximum recall, a budget-allocation problem mirroring CEC-03.
6. **(Grad) Energy per harvest.** From power and latency, estimate compute energy over a harvest run; compare to a power budget and state the M12 implication.

---

## 26. Quiz

1. **(MC)** "No cloud in the control loop" is required primarily because: (a) cloud is expensive; (b) field connectivity is not guaranteed and a networked loop stalls; (c) latency is always lower on-device; (d) privacy. **[b]**
2. **(MC)** A memory-bound kernel is best improved by: (a) a faster compute core; (b) reducing/rearranging data movement; (c) more threads only; (d) higher clock only. **[b]**
3. **(MC)** Amdahl's law says overall speedup is limited by: (a) the fastest stage; (b) the un-accelerated fraction; (c) the number of cores; (d) memory size. **[b]**
4. **(MC)** Thermal throttling means: (a) the device speeds up when hot; (b) delivered performance drops below datasheet under sustained heat; (c) power increases; (d) accuracy improves. **[b]**
5. **(Short)** State CEC-04 and the one rule it imposes on runtime paths. **[The No-Cloud Edge Boundary: capabilities split into runtime (on-robot, in the loop) and development (off-robot); no runtime path may depend on an off-robot resource.]**
6. **(Calc)** A stage is 25% of runtime; accelerate it 5×. Overall speedup? **[$1/(0.75+0.25/5)=1/0.80=1.25×$.]**
7. **(Calc)** INT8 cuts latency from 40 ms to 18 ms and recall from 0.92 to 0.90 (threshold 0.88). Does it meet a 20 ms budget while preserving recall? **[Yes: 18 ≤ 20 ms and 0.90 ≥ 0.88.]**
8. **(Design)** Why measure performance on the target device rather than a workstation? **[EI-06: the bottleneck, throttling, and delivered throughput differ on real hardware; workstation numbers are not evidence for the robot.]**
9. **(Critical thinking)** How does compute latency degrade grasp placement accuracy? **[On the moving rover it becomes σ_sync in the placement budget (CEC-03), displacing the target.]**
10. **(Critical thinking)** Why can accuracy sacrificed to optimization be as bad as latency overrun? **[Below the recall/yield threshold, missed fruit is lost revenue, the optimization defeated the mission (EI-04).]**

---

## 27. Challenge Problems

- **CP-M6-A, Joint compute/accuracy/throughput optimization.** Given the cycle-time budget (CEC-01), the recall threshold (EI-04), and the device's roofline, choose model, quantization, and staging jointly to maximize harvested-fruit-per-hour. Identify the binding constraint. (Bridges CEC-01, CEC-04, EI-04.)
- **CP-M6-B, Thermal-robust deployment.** Design a deployment that holds the latency budget across the field's thermal range, including a graceful-degradation policy; specify how you would validate it in HIL and what it costs in yield when degraded.
- **CP-M6-C, No-cloud architecture proof.** Specify an architecture and an automated test suite that *prove* no runtime path depends on the cloud, including how updates and monitoring happen without violating the boundary at runtime. (Formalizes CEC-04; feeds M11/M15 and Doc E.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your latency budget uses per-stage numbers. Are they measured on the target under load, or estimated/from a workstation? Where would an optimistic assumption most likely hide, and how would it surface only in the field (EI-06)?
2. **Tradeoffs.** You quantized to INT8 to meet latency. Defend the recall you sacrificed to a reviewer who argues any yield loss is unacceptable. At what recall would you refuse to quantize further, and how did you choose that line (EI-04)?
3. **Risk.** The device throttles under sustained field heat. What is your evidence it will not breach the latency budget hot, and what does the machine do if it does? Does your degradation policy cost fruit, and is that acceptable?
4. **Verification.** You validated in hardware-in-the-loop driven by the twin. A reviewer notes the twin's sensor streams may be gentler than the field (fewer objects, cleaner data). How do you make the HIL load representative, and what field evidence would close the gap?
5. **Subsystem interaction.** Compute latency feeds both the cycle-time budget (CEC-01) and σ_sync in the placement budget (CEC-03), and the control path needs bounded worst-case latency for stable grasp regulation (CEC-02). Who owns these cross-couplings, and how do you keep perception jitter from destabilizing control?
6. **Boundary.** Convince the board that no runtime path depends on the cloud (CEC-04). What automated evidence do you have, and how do model updates and monitoring happen without crossing the boundary at runtime?

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (edge problem, boundary, budgets, roofline/Amdahl, optimization) are the core (~2.5 h); the CEC-04 designation (Section 11.3) and EI-06 are the peaks. Trade studies (Section 11) and SIL->HIL activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M6 is a separate 2 to 3 h session on real (or emulated) hardware.
- **Common misconceptions.** (1) "Faster core fixes it", many kernels are memory-bound (roofline). (2) Trusting datasheet/bench numbers, measure on target under load (EI-06). (3) Optimizing accuracy away to hit latency, EI-04 caps this. (4) Treating no-cloud as a slogan, SWA-2/CP-M6-C make it an enforced, tested property.
- **On CEC-04 and EI-06.** CEC-04 is the *tool* (the runtime/development partition you apply and audit); EI-06 is the *judgment* (measure on the target). Both are essential and distinct. Note EI-05 recurs here (dominant latency), point it out so students feel an insight return.
- **Where to push graduate students.** Mixed-precision allocation (HW5), joint optimization (CP-M6-A), and the no-cloud proof (CP-M6-C).
- **Thread to keep visible.** Close by naming hand-offs: the deployed substrate -> M7/M9 (decision/grasp run here); power/thermal profile -> M12; real-time timing -> M11.

---

## 29. Research Frontiers

- **Landmark grounding.** Foundational references on the roofline model and on parallel-speedup limits (Amdahl); the edge-AI/embedded-inference literature on quantization, pruning, distillation, and compilation. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Hardware-aware neural architecture search and mixed-precision quantization; efficient transformer/vision inference on embedded accelerators; compiler/runtime advances (graph optimization, kernel autotuning) for edge SoCs; on-device continual/federated learning that respects a no-cloud runtime; energy- and thermal-aware scheduling for field robots.
- **Open problems.** Guaranteed worst-case latency for learned perception on shared edge devices; maintaining accuracy under aggressive quantization for small/occluded objects; thermal-robust sustained performance in field enclosures; verifiable no-cloud architectures with safe update paths.
- **Suggested thesis directions.** (1) A thermal-aware deployment controller that trades model precision for sustained latency under field heat. (2) Mixed-precision quantization driven by mission-value (recall) rather than average accuracy. (3) A provably no-cloud runtime with a certified development/runtime boundary.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Roofline-model and parallel-performance references (roofline; Amdahl's law), bottleneck analysis (Section 6.4).
- Edge-AI / efficient-inference literature, quantization, pruning, distillation, compilation (Section 6.5).
- Embedded-systems / real-time references, latency, determinism, scheduling (Section 6.7; mastered M11).
- Power/thermal-aware computing literature, throttling, energy per inference (Section 6.6; M12).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 5**, and (forthcoming) Doc B, Doc C, Doc E, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters edge deployment and **formally designates CEC-04 (the No-Cloud Edge Boundary)** at its true mastery point, the runtime/development partition that recurs across perception, decision, grasp, and integration, now an audited, tooling-enforced property rather than a slogan. It adds a genuinely distinct Engineering Insight, **EI-06 (Measure on the Target)**, which sharpens EI-05 into an empirical discipline without duplicating it. The module keeps the "budget" family disciplined, explicitly declining to mint a third budget-CEC, treating latency as CEC-01 applied to compute, exactly the restraint you asked for. It grounds optimization in the mission via EI-04 (protect recall), advances the lifecycle from SIL to HIL, and connects compute latency to both the cycle-time budget (CEC-01) and the placement budget (CEC-03, σ_sync). All 30 sections present; the Engineering Design Review is included and framed as judgment; every standing convention is exercised; consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Latency, power, thermal, and worst-case-timing targets and the specific device depend on Doc B/C and real hardware measurement; the budgeting and optimization *methods* are exact.
2. **Real-time scheduling is introduced, not mastered.** Bounded worst-case latency (SR-P-22) is stated as a requirement and deferred to M11 for its realization, a forward dependency, flagged.
3. **HIL rig and thermal envelope are specified, not built.** They depend on Doc G and real hardware, the same critical path noted since M2, now including physical compute hardware.
4. **CEC-04 vs. the budget family.** I judged the No-Cloud Boundary a CEC and the latency budget *not* a separate CEC; if you would prefer the latency budget also anchored (or CEC-04 held on the watchlist instead), both are one-line register changes, flagged, not decided unilaterally.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 3 close chiefly by authoring Doc B/C/E/G and by reaching M11/M12.

**END OF MODULE 6, STOP. Awaiting your review before freezing Module 6 or proceeding to Module 7.**
