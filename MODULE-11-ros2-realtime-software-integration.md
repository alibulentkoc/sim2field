# Module 11: ROS 2, Real-Time Systems & Software Integration

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M11, **Part V, Integrate**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Software-in-the-Loop -> Hardware-in-the-Loop
**Prerequisites:** M1 (spine, cycle-time budget CEC-01), M5 (localizer node/pose interface), M6 (edge substrate, bounded-latency requirement, CEC-04), M7 (behavior node, grasp-policy node, bounding layer, EI-07), M8 (kinematics service, singularity guard), M9 (grasp-force control node), M10 (nav/drive nodes, stability guard). Math: real-time scheduling, basic queuing/timing analysis.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 10**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **masters the real-time software integration** that many prior modules referenced forward, the node graph, the real-time control plane, and the **independent safety monitor** (M6 DD-33, M7, M8, M9, M10). P0-document authority tagged **[->Doc B/E/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-11** and the module's **Engineering Design Review**.

> *Core concept in use.* This module realizes the **Integrate** binding of the **Signal-to-Action Spine (CEC-01)**: it turns the per-stage nodes the whole course has specified into one running, real-time distributed system whose control plane meets bounded worst-case latency (M6/CEC-04) and whose **independent safety monitor** can halt motion regardless of what the mission logic believes.

---

## 1. Module Overview

**Mission.** This module takes the interfaces the course has fixed and composes them into one running distributed system, a graph of ROS 2 nodes exchanging typed messages under timing contracts, and it makes that system meet the property no single node can guarantee alone: real-time correctness.

**Previous milestone.** Every module so far has designed a piece of software and, at its edge, described an interface: perception publishes a detection, localization a pose-with-covariance, the behavior layer a bounded grasp proposal, the grasp controller a valve command. Each module said "M11 realizes the node graph."

**Engineering problem.** The central discipline is real-time systems. The machine's control loops, grasp-force regulation (M9), drive/stability (M10), motion (M8), need not merely fast average behavior but bounded worst-case latency: a single late cycle can bruise a fruit, miss a target, or tip the machine. Meanwhile the perception plane moves heavy, bursty sensor and inference data whose jitter must never leak into the control plane.

**Design tension.** So the architecture separates the two: a real-time control plane with guaranteed timing, and a best-effort perception plane with high throughput, isolated so that a slow neural network never starves the force loop. This separation, introduced as a requirement in Module 6, is finally engineered here.

**What this module resolves.** This is where the machine's most important safety element is built: the independent safety monitor. Every prior module produced a guard, the grasp bound (M7/M9), the singularity keep-out (M8), the stability limit (M10), and every one of them noted "feeds the safety monitor, M11/M15." That monitor is an independent node that can command a safe stop or release regardless of what the mission logic, the grasp policy, or any other node believes. Its independence is the point: a safety function that depends on the correctness of the thing it protects against is not a safety function. That principle, build the guard so it cannot be defeated by the failure it guards against, is this module's Engineering Insight.


## 2. Learning Objectives

- **LO-M11.1** Compose the machine's subsystems into a ROS 2 node/topic graph with typed interfaces and quality-of-service contracts., *Bloom: Create*
- **LO-M11.2** Distinguish real-time from best-effort computation and separate the control plane from the perception plane., *Bloom: Analyze (with Create)*
- **LO-M11.3** Analyze worst-case latency and jitter for a control loop and choose scheduling/executors to bound them., *Bloom: Analyze*
- **LO-M11.4** Design an independent safety monitor that can halt/safe the machine regardless of other nodes' state (EI-11)., *Bloom: Create (with Evaluate)*
- **LO-M11.5** Integrate the per-module guards (grasp bound, singularity, stability) into a coherent runtime safety architecture., *Bloom: Create*
- **LO-M11.6** Verify timing and integration in SIL and hardware-in-the-loop against the cycle-time budget (CEC-01) and bounded-latency requirement (M6)., *Bloom: Evaluate*
- **LO-M11.7** Specify the twin's role in software integration and timing verification., *Bloom: Create*

Maps to course objectives **LO7** (primary), **LO5/LO6** (reinforcing), and ABET **SO1, SO2, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Draw the machine's node/topic graph with interfaces and QoS., *Bloom: Create*
2. Separate real-time control from best-effort perception and justify the isolation., *Bloom: Analyze*
3. Estimate a control loop's worst-case latency and choose scheduling to bound it., *Bloom: Analyze*
4. Design an independent safety monitor and argue its independence., *Bloom: Create*
5. Assemble the per-module guards into one runtime safety architecture., *Bloom: Create*
6. Verify integration and timing in SIL/HIL against the budgets., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1's failure taxonomy called *integration failure* the hardest to find, because it lives *between* components: each subsystem works alone, and the machine fails together. This module is the defense against that class, and it exists because the properties that matter most in a running robot, timing, ordering, isolation, and safe failure, are **system** properties that no individual node can establish.

Consider what has been designed in isolation. The grasp-force loop (M9) is stable *given* a bounded control latency; the localizer (M5) is honest *given* correct timestamps; the behavior layer (M7) is safe *given* that its bounds are actually enforced; the drive (M10) is stable *given* that its guard fires in time. Every one of those "given"s is a real-time integration requirement, and if the software that composes these nodes lets perception jitter delay the force loop, or lets a message arrive stale, or lets a guard run too late, the isolated correctness evaporates. A neural network that occasionally takes 80 ms instead of 20 ms is fine on the perception plane and catastrophic if it shares a thread with the force controller. The motivation for real-time discipline is that **correctness in the field is a timing property**, not just a logical one.

And the safety motivation is starker. The machine exerts force on a fragile fruit and moves a heavy payload, soon, near people. Every prior module built a guard, but a guard is only as good as its *independence*: if the safety stop depends on the same mission logic, the same policy, or the same thread that might fail, it fails with them. The motivation for the independent safety monitor is that the one function you cannot allow to fail must not share fate with the functions it protects against. Building that independence correctly, and composing all the guards into one coherent, verifiable safety architecture, is the reason this module is where the machine becomes trustworthy, not just functional.

---

## Engineering Failure Cases (integration-and-timing-specific)

Sharpening Module 1's *integration* class at its real-time roots:

- **Priority inversion / plane bleed.** Best-effort perception jitter delays the real-time control loop; force regulation (M9) destabilizes or the drive guard (M10) fires late. *Motivates* control/perception plane separation and scheduling (Section 6.3 to 6.4).
- **Stale message.** A perception or pose message is consumed after it is valid on the moving rover; the target is mislocated (σ_sync, CEC-03). *Motivates* timestamping, QoS, and time synchronization (Section 6.2, Section 6.5).
- **Non-independent safety.** The safety stop shares logic/thread with the mission and fails when the mission fails. *Motivates* the independent safety monitor (Section 6.6, EI-11).
- **Guard race.** Two guards (singularity, stability, grasp bound) conflict or a command slips between checks. *Motivates* the unified runtime safety architecture (Section 6.7).
- **Unbounded worst case.** The loop meets its average deadline but occasionally overruns; the rare late cycle bruises or misses. *Motivates* worst-case (not average) timing analysis (Section 6.4, Section 7).

Each is a real-time design decision away from prevention.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** basic operating-systems/concurrency concepts (threads, scheduling, latency); the M1 cycle-time budget (CEC-01) and spine; the M6 edge substrate, no-cloud boundary (CEC-04), and bounded-worst-case-latency requirement (SR-P-22, DD-33); the node interfaces fixed by M5/M7/M8/M9/M10; the per-module guards those modules specified.

**Introduced here, used later:** the vocabulary of ROS 2 and real-time systems, *node, topic, service, action, message type, quality-of-service (QoS), executor, callback, real-time vs. best-effort, control plane vs. perception plane, worst-case execution time, jitter, deadline, priority, scheduling, time synchronization, safety monitor, watchdog, fail-safe/fail-operational*. Developed at applied (L2) depth; formal real-time schedulability is referenced [->Doc H].

**Where this sits in the dependency graph.** M11 hard-depends on M6 (timing substrate) and consumes the node interfaces of M5/M7/M8/M9/M10. It **masters** the ROS 2 / real-time / software-integration thread and the **runtime safety architecture (the independent safety monitor)**; it **applies** CEC-01 (composes the pipeline within the cycle-time budget), CEC-04 (all nodes on-robot), and realizes the M6 bounded-latency requirement. It hands forward: the integrated, timing-verified software system to M13 (system integration/bring-up); the safety architecture to M15 (safety case); and the runtime timing evidence to M14 (V&V).

---

## 6. Theory

### 6.1 The machine as a distributed system (ROS 2)
The harvester is a set of concurrent **nodes** exchanging **messages** on **topics** (publish/subscribe), with request/response **services** and long-running **actions**. This is the ROS 2 model, and the course has been building its graph all along: perception nodes (M4), a localizer (M5), a behavior node + grasp-policy node + bounding layer (M7), a kinematics service + singularity guard (M8), a grasp-force controller (M9), navigation + drive + stability guard (M10), and, added here, an **independent safety monitor**. The message *types* are the interfaces the prior modules fixed (e.g., pose-with-covariance, bounded grasp proposal); this module composes them.

### 6.2 Quality of service and time
ROS 2 topics carry **QoS** contracts, reliability (reliable vs. best-effort), durability, history/depth, and deadlines, chosen per link: reliable, low-latency QoS for control commands; best-effort, high-throughput QoS for bursty images. **Time** is first-class: every message is timestamped, and nodes must share a synchronized clock so fused/consumed data refers to the correct instant, the σ_sync term of the placement budget (CEC-03) is a *timing* property enforced here.

### 6.3 Real-time vs. best-effort, and plane separation
Not all computation is equal. **Real-time** work (grasp-force loop M9, drive/stability M10, motion M8, the safety monitor) must meet deadlines with **bounded worst-case latency**; **best-effort** work (detection/localization M4/M5) wants high throughput but tolerates jitter. The architecture therefore separates a **control plane** (real-time, deterministic, isolated) from a **perception plane** (best-effort, high-throughput), so that a neural network occasionally taking longer cannot delay the force loop. This separation was *required* in M6 (DD-33); it is *engineered* here through executor/thread assignment, priorities, and (where available) a real-time OS/scheduler.

### 6.4 Worst-case latency, jitter, and scheduling
A control loop's guarantee is its **worst-case** latency, not its average: the rare 80 ms cycle is what bruises or misses. Analysis sums worst-case execution times along the loop, accounts for scheduling delay and blocking, and compares to the deadline. **Scheduling** (priority assignment, executor choice, CPU/core affinity) is chosen to keep the control plane's worst case bounded, e.g., pinning the force loop to a core, giving it priority, and preventing priority inversion. The result must fit the relevant share of the cycle-time budget (CEC-01) and satisfy M9's stability-under-latency analysis (which used the *measured* latency, EI-06).

### 6.5 Time synchronization
On a moving rover, a timing error is a position error (σ_sync, CEC-03). Nodes and sensors must share a synchronized clock so that a pose fused from stereo + IMU + odometry refers to one instant, and a command executes against a current, not stale, target. Synchronization (and bounded message age via QoS deadlines) is how the integration prevents the stale-message failure.

### 6.6 The independent safety monitor (the safety keystone)
The machine's safety rests on a node that is **independent** of the mission logic it protects against. The safety monitor:

- **watches** the guards and states the prior modules produce, grasp force vs. the window (M9), manipulability/γ (M8), stability margin (M10), heartbeat/watchdog from every critical node;
- **can act**, command a safe stop, a safe grasp release, or a bounded halt, **regardless** of what the behavior node, grasp policy, or any other node commands;
- **does not depend** on the correctness of the mission logic, the learned policy, or the perception it guards: it has its own inputs, its own simple verified logic, and (ideally) its own execution context, so a failure in the system it protects cannot disable it.

This independence is what turns a pile of guards into a safety *function*. Combined with the *physical* bounds from earlier modules (the mechanical relief M9/EI-09, the singularity-free workspace M8), the machine has defense in depth: physical bounds that cannot be commanded past, and an independent monitor that can always command a stop. The learned components (M7) are bounded by both (EI-07). This is the architectural realization of the system-level AI-safety rule carried since Module 1.

### 6.7 Composing the guards
The per-module guards must form one coherent architecture, not a race: a single arbitration point decides the machine's safe state, guards have defined precedence (safety stop overrides motion overrides mission), and no command reaches an actuator without passing the relevant checks. The bounding layer (M7), kinematics/singularity guard (M8), grasp bound (M9), and stability guard (M10) are composed under the safety monitor's authority. Verifying this composition, that no command slips between checks, is a core deliverable (and a hand-off to the M15 safety case).

### 6.8 Fail-safe and fail-operational
When something fails, the machine must reach a **safe state**: a fail-safe stop (halt, release the fruit gently via compliance, M9/EI-09) for most faults, and fail-operational (degrade to a reduced mode) for others (e.g., lose vision row-following -> fall back to RTK, M10). Watchdogs detect node death/hang; the safe state is defined and reachable from any fault the analysis identifies. What "safe" means (stop vs. degrade) is a safety-case decision (M15); M11 builds the mechanism.

---

## 7. Mathematics

Rigor tier for M11: **L2**. Central results: worst-case latency composition and the bounded-latency/deadline test.

### 7.1 Worst-case loop latency
For a control loop traversing nodes $1..n$ with worst-case execution times $C_i$, scheduling/queuing delays $S_i$, and communication delays $D_i$:
$$ L_\text{wc} = \sum_i (C_i + S_i + D_i) \;\le\; \text{deadline}. $$
*Use:* verify the grasp-force and drive loops meet their deadlines under worst case, not average; the deadline derives from CEC-01 (cycle-time share) and M9 (stability-under-latency).

### 7.2 Jitter and its budget
Jitter (variation in latency/period) feeds σ_sync (CEC-03) and control instability (M9). Bound period jitter $\Delta T$ and end-to-end age so $3\sigma_\text{sync}$ stays within its placement-budget allocation. *Use:* connect scheduling quality to placement accuracy, a timing property with a mechanical consequence.

### 7.3 Schedulability (introduced)
For periodic real-time tasks, a utilization/response-time test decides whether all deadlines are met; plane separation and priority assignment are chosen so the control plane is schedulable independent of perception load. *Use:* justify that the force/drive loops keep their deadlines regardless of what perception is doing. **Grad (L3):** response-time analysis with blocking (priority-inheritance) for the control tasks.

### 7.4 Safety-monitor coverage and latency
The safety monitor must detect a hazardous state and act within a **safety reaction time** shorter than the time for harm to occur (e.g., detect over-force/instability and release/stop before a bruise or tip). Require $L_\text{detect}+L_\text{react} \le T_\text{harm}$. *Use:* size the monitor's rate and the actuator's safe-stop time; note the physical bounds (relief M9, compliance EI-09) buy margin because they act at physics speed, not software speed.

---

## 8. Engineering Principles

1. **Compose by interface**, the message types the modules fixed are the integration contract.
2. **Separate the planes**, real-time control isolated from best-effort perception; jitter must not cross.
3. **Guarantee the worst case, not the average**, a rare late cycle is a real failure.
4. **Time is data**, synchronize clocks; stale is wrong (σ_sync, CEC-03).
5. **Safety must be independent** (EI-11): the guard cannot share fate with what it guards against.
6. **Defense in depth**, physical bounds (relief, workspace) *plus* an independent monitor *plus* bounded learning (EI-07).
7. **Define and reach a safe state** for every identified fault (fail-safe/fail-operational).

---

## 9. System Requirements

Derived from the integration mission; realize the M6 timing requirement and master the safety architecture. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-35 | Performance | Each control loop shall meet its deadline with bounded worst-case latency $L_\text{wc}\le$ deadline (CEC-01/M9). | Timing analysis + HIL test |
| SR-C-10 | Constraint | The real-time control plane shall be isolated from best-effort perception jitter. | Load test |
| SR-F-15 | Functional | An **independent safety monitor** shall be able to command a safe stop/release regardless of any other node's state (EI-11). | Fault-injection test |
| SR-F-16 | Functional | The per-module guards (grasp bound, singularity, stability, watchdogs) shall compose under a single arbitration with defined precedence. | Review + test |
| SR-P-36 | Performance | Safety reaction time shall satisfy $L_\text{detect}+L_\text{react}\le T_\text{harm}$ for identified hazards. | Timing test |
| SR-C-11 | Constraint | Clocks/messages shall be synchronized so consumed data meets its σ_sync allocation (CEC-03). | Timing test |
| SR-I-16 | Interface | A twin/HIL harness shall verify node-graph integration and timing. | Review (->Doc G) |

Traceability: SR-P-35/SR-C-10 -> CEC-01/M6/M9; **SR-F-15/16, SR-P-36 -> M15 (safety case), EI-11**; SR-C-11 -> CEC-03; SR-I-16 -> twin/M13.

---

## 10. Design Decisions

- **DD-62 ROS 2 node graph with typed interfaces and per-link QoS.** *Rationale:* Section 6.1 to 6.2; compose the fixed interfaces. *Serves:* SR-C-11.
- **DD-63 Control-plane / perception-plane separation** (executors, priorities, core affinity, RT scheduler). *Rationale:* Section 6.3 to 6.4; isolate real-time from best-effort. *Serves:* SR-P-35, SR-C-10.
- **DD-64 Independent safety monitor** with its own inputs, verified logic, and execution context. *Rationale:* Section 6.6, EI-11. *Serves:* SR-F-15, SR-P-36.
- **DD-65 Unified guard arbitration with defined precedence** (safety > motion > mission). *Rationale:* Section 6.7; no command bypasses checks. *Serves:* SR-F-16.
- **DD-66 Worst-case timing verification** (analysis + HIL under load). *Rationale:* Section 6.4/Section 7; guarantee deadlines. *Serves:* SR-P-35.
- **DD-67 Defined safe states + watchdogs** (fail-safe default; fail-operational where specified). *Rationale:* Section 6.8. *Serves:* SR-F-15.
- **DD-68 Time synchronization across nodes/sensors.** *Rationale:* Section 6.5; bound message age. *Serves:* SR-C-11.

---

## 11. Trade Studies

### 11.1 TS-21: Safety-monitor architecture
**Alternatives:** (A) **independent monitor node, separate context**; (B) **monitor as a high-priority thread in the main process**; (C) **distributed checks in each node, no central monitor**; (D) **hardware safety controller (separate MCU)**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Indep. node | B: HP thread | C: Distributed | D: HW controller |
|--------------------|:---:|:---:|:---:|:---:|
| Independence from mission failure (0.30) | 4 | 2 | 2 | 5 |
| Reaction latency (0.20) | 4 | 4 | 4 | 5 |
| Coverage / global view of hazards (0.18) | 5 | 4 | 2 | 3 |
| Verifiability / simplicity (0.16) | 4 | 3 | 2 | 5 |
| Cost / complexity (0.16) | 4 | 4 | 4 | 2 |
| **Weighted total** | **4.18** | **3.24** | **2.68** | **4.30** |

**Selected: a hybrid of A + D**, an **independent monitor node** for rich, global hazard logic (grasp/singularity/stability/watchdog arbitration) *and* a **minimal hardware safety controller** for the last-resort stop that cannot depend on any software (an e-stop/relief-enable path). Together they give both coverage and true independence, defense in depth in the safety architecture itself. Pure distributed checks (C) are rejected: no global view, hard to verify. Recorded weakness: two safety layers must be reconciled (precedence, avoiding conflict), a verification burden handed to M15.

### 11.2 TS-22: Executor / scheduling strategy (summary)
**Alternatives:** single default executor, multi-threaded executor with priorities, separate RT process for control, RTOS/PREEMPT-RT. **Criteria:** worst-case bound, isolation, complexity, portability. **Outcome:** **control in a separate high-priority RT context (RT-patched OS or separate process/core), perception in a best-effort executor**, the plane separation of DD-63, giving the control loop a bounded worst case independent of perception load.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **The independent safety monitor / defense-in-depth safety architecture.** *Verdict: evaluated as a candidate; not minted as a CEC, captured as EI-11 plus a Knowledge-Architecture thread.* It is architecturally central, but its *recurring design-tool* character is best expressed as the **judgment** "make the guard independent of what it guards" (EI-11), which reinforces the existing bounding anchors (EI-07, EI-09) rather than adding a parallel design *tool* like a budget or a window. The concrete safety *architecture* is mastered here and carried into the M15 safety case as a thread, not a new CEC. *(Consistent with "promote CECs only when they become enduring cross-module design tools", this is judgment + architecture, not a new analytical tool.)*
- **ROS 2 / real-time scheduling.** *Verdict: not a CEC.* Mastered techniques, captured in the integration/real-time thread.
- **Worst-case latency composition.** *Verdict: not a new CEC, it is CEC-01 applied* to software timing (the cycle-time budget realized as loop deadlines), and it feeds CEC-03 (σ_sync). *(No new CEC this module; one EI added, EI-11.)*

> **Cross-module synthesis note (lightweight).** Every guard the course built now converges under one authority: the grasp bound (M7), the singularity keep-out (M8), the mechanical relief and compliance (M9/EI-09), and the stability guard (M10) are composed here beneath the **independent safety monitor**, physical bounds that cannot be commanded past, plus a monitor that can always command a stop, plus learning bounded by both (EI-07). Defense in depth is not one mechanism but the *composition* this module assembles.

> **Simulation-first hook.** The node graph, timing, and safety monitor are verified in SIL and then **HIL** (Section 12, Section 13), including fault-injection (kill a node, stall a loop, command an out-of-bounds action) to prove the monitor and guards respond within the safety reaction time before any field run.

---

## 12. Simulation Activities

M11 runs at **SIL -> HIL**; the twin becomes the integration and timing test bench.

**SA-1, Compose the node graph.** Bring up all nodes (perception, localizer, behavior/bounding, kinematics, grasp control, nav/drive, safety monitor) against the twin; verify the interfaces connect and a full DRIVE->...->RELEASE cycle runs (Section 6.1). *Outcome:* the integrated system running in sim.

**SA-2, Plane-separation load test.** Inject heavy/bursty perception load and confirm the control-plane loops (grasp force, drive) keep their deadlines regardless (Section 6.3 to 6.4, SR-C-10). *Outcome:* isolation verified under stress.

**SA-3, Worst-case timing.** Measure loop latency distributions under load; confirm $L_\text{wc}\le$ deadline (Section 7.1, SR-P-35) and jitter within the σ_sync budget (Section 7.2, CEC-03). *Outcome:* timing guarantees evidenced.

**SA-4, Safety-monitor fault injection.** Kill/stall nodes, command out-of-bounds actions, and force hazard states; confirm the independent monitor and composed guards reach the safe state within the reaction time (Section 6.6 to 6.7, Section 7.4, SR-F-15/16/SR-P-36). *Outcome:* the safety architecture proven in sim before HIL/field.

---

## 13. Digital Twin Activities

**DTA-1, Integration/HIL harness spec (deliverable to Doc G).** Specify the SIL and hardware-in-the-loop harness: which nodes run against the twin vs. real edge hardware (M6), timing instrumentation, and the fault-injection suite. *Outcome:* SR-I-16; the integration/timing verification bench.

**DTA-2, Timing regression suite.** A fixed set of load/timing scenarios every software change must pass (deadlines met, jitter bounded, monitor reaction within budget). *Outcome:* continuous timing V&V (hand-off to M14).

**DTA-3, Safety-architecture verification package.** Package the guard-composition and monitor-independence evidence (fault-injection results, precedence tests) for the M15 safety case. *Outcome:* safety evidence traced from build to case.

---

## 14. Hardware Activities

*(Tiered: HIL and bring-up protocols at specification level.)*

**HA-1, HIL timing verification.** Specify running the control plane on the real edge device (M6) driving simulated/real actuators, measuring worst-case latency and jitter under realistic load (SR-P-35). *Deliverable:* HIL timing evidence.

**HA-2, Hardware safety-controller verification.** Specify verification that the minimal hardware safety controller (TS-21 option D) executes a last-resort stop independent of all software (SR-F-15). *Deliverable:* an independent-stop verification record (feeds M15).

---

## 15. Software Activities

**SWA-1, Node-graph & launch/config.** Specify the full node graph, message types (the fixed interfaces), per-link QoS, executor/thread/core assignment, and launch/configuration (CEC-04, on-robot). *Outcome:* the runnable integrated system (bring-up in M13).

**SWA-2, Safety monitor & watchdogs.** Specify the independent safety-monitor node (inputs, verified logic, safe-state commands), the guard arbitration with precedence, and per-node watchdogs/heartbeats (EI-11, DD-64/65/67). *Outcome:* the runtime safety architecture in software.

---

## 16. ROS 2 Integration

This module *is* the ROS 2 integration, the mastery point of the thread every prior module deferred to it. It composes the fixed interfaces into a running graph, assigns QoS and scheduling to separate the control and perception planes, synchronizes time, and adds the independent safety monitor and guard arbitration. It realizes the M6 bounded-latency requirement (DD-33/SR-P-22) as engineered scheduling, and it makes the mission FSM (M7 behavior layer) the sequencer over a real-time substrate. Downstream, M13 brings this graph up on the integrated machine; M14 verifies its timing; M15 certifies its safety architecture.

---

## 17. AI Integration

M11 hosts the learned components but does not add one; its job is to **run them safely in real time**:

- **Perception on the best-effort plane.** Detection/localization/row-following (M4/M5/M10) live on the perception plane, where their variable latency (a slow inference) cannot delay control (Section 6.3), the systemic expression of "measure and isolate the learned component's timing" (EI-06).
- **The bounded policy under the monitor.** The grasp policy's proposal (M7) is bounded by the M7 layer, executed by M9, and overseen by the independent safety monitor, three layers, none of which trusts the policy (EI-07/EI-11).
- **Timing determinism for control, throughput for learning.** The architecture gives each what it needs, and prevents the learned components from ever holding the real-time loops hostage.

No cloud in the loop (CEC-04); all learned inference is on-robot and plane-isolated.

---

## 18. Edge Computing Integration

M11 turns the M6 edge substrate into a correctly scheduled real-time machine. The edge device runs both planes: the control plane with bounded worst-case latency (pinned, prioritized) and the perception plane with high throughput (best-effort). Two couplings fixed here: (1) the compute budget (M6) must be *partitioned* so perception cannot starve control, plane separation is how; (2) the bounded-latency requirement M6 stated as a target is here *achieved and verified* through scheduling and HIL measurement (EI-06). The no-cloud boundary (CEC-04) is why all of this must be solved on the device rather than offloaded.

---

## 19. Fluid Power Integration

M11 does not build fluid hardware, but it **hosts and safeguards the fluid grasp control (M9)** in real time. Three couplings: (1) the grasp-force loop is a **control-plane, real-time** task whose bounded latency M11 guarantees, the stability M9 proved *assumed* this (Section 6.4/Section 7.1); (2) the mechanical relief and passive compliance (M9/EI-09) are the *physics-speed* safety layer beneath the software safety monitor, they act faster than any software reaction and buy the monitor timing margin (Section 7.4); (3) a safe-release command (fail-safe, Section 6.8) uses the gripper's compliance to set the fruit down gently rather than dropping it. The software safety architecture and the fluid physical bounds are complementary layers of the same defense in depth.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M11-1, Node-Graph Explorer.** Interactive graph of nodes/topics with message types and QoS; hover a link to see its timing contract; toggle control vs. perception plane coloring. *Goal:* Section 6.1 to 6.3.
- **W-M11-2, Plane-Separation / Load Simulator.** Slider for perception load; watch the control-loop latency stay flat (separated) vs. spike (shared), the priority-inversion failure and its fix (Section 6.3 to 6.4). *Goal:* isolation intuition.
- **W-M11-3, Worst-Case Latency Budget.** Stacked $C_i+S_i+D_i$ along a control loop vs. the deadline; adjust node times to see the worst case breach or meet (Section 7.1). *Goal:* worst-case (not average) thinking.
- **W-M11-4, Safety-Monitor Fault Injector.** Buttons to kill a node / stall a loop / command out-of-bounds; watch the monitor drive the machine to a safe state within the reaction time, and show what fails if the monitor is *not* independent (Section 6.6, EI-11). *Goal:* the independence principle made visible.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M11-1** System software architecture: node graph with control plane / perception plane separation and the independent safety monitor + hardware safety controller (annotated).
- **CAD-M11-2** The guard-arbitration stack: mission -> motion -> safety precedence, with each module's guard feeding in.
- **CAD-M11-3** Timing diagram of a grasp cycle across nodes (worst-case latency along the loop).
Format per ->Doc J (SVG architecture/timing diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M11-1 | The machine as a ROS 2 node/topic graph (fixed interfaces) | Section 6.1 |
| F-M11-2 | Control plane vs. perception plane separation | Section 6.3 |
| F-M11-3 | Worst-case latency along a control loop vs. deadline | Section 6.4/Section 7.1 |
| F-M11-4 | Time synchronization and message age (σ_sync) | Section 6.5 (CEC-03) |
| F-M11-5 | **Independent safety monitor + guard arbitration (defense in depth)** | Section 6.6/Section 6.7 (central, EI-11) |
| F-M11-6 | Fail-safe/fail-operational state machine | Section 6.8 |
| F-M11-7 | Safety reaction time vs. time-to-harm | Section 7.4 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M11-1** Perception load spiking while the control-plane loop stays flat (separated) then, in a "shared" counterfactual, the loop stalling and a fruit bruising, plane separation in action.
- **AN-M11-2** A fault injected (node killed / out-of-bounds command) and the independent safety monitor driving the machine to a safe stop within the reaction time; then the same fault with a *non-independent* monitor failing to act (EI-11).
- **AN-M11-3** A grasp cycle traversing the node graph with the worst-case latency accumulating and staying under the deadline.

---

## 24. Laboratory

**Lab M11, Integrating the Machine and Building the Independent Safety Monitor**

- **Objectives.** (1) Compose the node graph from the fixed interfaces; (2) separate control and perception planes and verify isolation under load; (3) analyze/measure worst-case control-loop latency; (4) build an independent safety monitor and guard arbitration; (5) verify the safety architecture by fault injection in SIL/HIL.
- **Equipment.** The digital twin + SIL/HIL harness; the edge device (M6) [VERIFY@PUB]; the prior modules' node stubs/interfaces; timing instrumentation; notebook. **Safety:** SIL/HIL (no field motion); fault-injection is simulated.
- **Procedure.**
  1. Bring up the node graph against the twin; run a full harvest cycle; confirm the interfaces connect (Section 6.1, SA-1).
  2. Assign QoS/executors to separate the planes; inject perception load; measure control-loop latency with and without separation (Section 6.3 to 6.4, SR-C-10).
  3. Compute the worst-case latency of the grasp-force loop ($\sum C_i+S_i+D_i$) and compare to its deadline (Section 7.1, SR-P-35); check jitter vs. σ_sync (CEC-03).
  4. Implement the independent safety monitor (inputs from the guards, safe-state commands) and guard arbitration with precedence (Section 6.6 to 6.7, EI-11).
  5. Fault-inject (kill a node, stall a loop, command out-of-bounds, force a hazard state); confirm the machine reaches a safe state within $L_\text{detect}+L_\text{react}\le T_\text{harm}$ (Section 7.4, SR-F-15/16, SR-P-36); repeat with a deliberately *non-independent* monitor and observe the failure.
- **Data collection.** Node-graph diagram; latency distributions (separated vs. shared); worst-case latency vs. deadline; fault-injection outcomes and reaction times; independent vs. non-independent comparison.
- **Analysis.** Does separation bound the control worst case? Does the monitor act in time under every injected fault? What fails when the monitor is not independent?
- **Discussion.** Why is worst-case (not average) the guarantee that matters? Why must the safety monitor be independent (EI-11)? How do the physical bounds (relief, compliance) complement the software monitor?
- **Deliverables.** A 5 to 6 page report: node graph, plane-separation result, worst-case timing, safety-monitor design, fault-injection verification.
- **Rubric (100 pts).** Node-graph integration (16); plane separation & isolation (18); worst-case timing analysis (18); independent safety monitor & arbitration (24, EI-11); fault-injection verification (14); communication (10). *Graduate band adds:* response-time analysis with blocking (Section 7.3 grad) and a cited source.
- **Expected results.** A control plane whose worst-case latency stays bounded regardless of perception load; a safety monitor that reaches the safe state within the reaction time under every injected fault; and a clear demonstration that a *non-independent* monitor fails exactly when it is needed, the empirical case for EI-11.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Node graph.** Draw the machine's node/topic graph from the fixed interfaces; label each link real-time vs. best-effort and assign a QoS.
2. **Worst-case latency.** Given per-node $C_i,S_i,D_i$ for the grasp-force loop, compute $L_\text{wc}$ and compare to a deadline; identify the dominant term (EI-05 recurs).
3. **Plane separation.** Explain how a slow perception inference could bruise a fruit if it shared a thread with the force loop, and how plane separation prevents it.
4. **Safety monitor.** Specify an independent safety monitor for one hazard (over-force or tip-over): its inputs, logic, safe-state command, and reaction-time requirement; argue its independence.
5. **(Grad) Schedulability.** For a set of periodic control tasks, apply a response-time test (with blocking) to show the control plane meets deadlines independent of perception load.
6. **(Grad) Defense in depth.** For the grasp, enumerate the layers (learned bound M7, controller M9, mechanical relief EI-09, independent monitor EI-11) and analyze the residual risk if each single layer fails; state what the M15 safety case must close.

---

## 26. Quiz

1. **(MC)** A control loop's real-time guarantee is its: (a) average latency; (b) worst-case latency vs. deadline; (c) best case; (d) throughput. **[b]**
2. **(MC)** Separating the control and perception planes prevents: (a) high throughput; (b) perception jitter from delaying real-time control; (c) time sync; (d) grasping. **[b]**
3. **(MC)** The safety monitor must be independent because: (a) it is faster; (b) a guard that shares fate with what it guards fails with it; (c) it saves compute; (d) ROS 2 requires it. **[b]**
4. **(MC)** A stale (out-of-date) message on a moving rover causes: (a) faster picking; (b) a position/target error (σ_sync); (c) better stability; (d) nothing. **[b]**
5. **(Short)** State EI-11 and one SIM2FIELD example. **[Make the guard independent of what it guards: the safety monitor has its own inputs/logic/context and can stop the machine regardless of the mission logic or grasp policy it protects against.]**
6. **(Calc)** Loop nodes with $C+S+D$ of 4, 6, 3, 5 ms. Compute $L_\text{wc}$; deadline 20 ms, met? **[$L_\text{wc}=18$ ms ≤ 20 ms, met (2 ms margin).]**
7. **(Calc)** Detect latency 8 ms, react latency 10 ms, time-to-harm 25 ms. Is the safety reaction adequate? **[$8+10=18\le25$ ms, adequate (7 ms margin).]**
8. **(Design)** How do the physical bounds (relief, compliance) complement the software safety monitor? **[They act at physics speed, faster than software, bounding the worst case and buying the monitor reaction-time margin; defense in depth.]**
9. **(Critical thinking)** Why verify timing in HIL under load, not just average in SIL? **[Worst-case latency under realistic perception load is what bruises/misses; average SIL numbers hide the rare overrun (EI-06/EI-10).]**
10. **(Critical thinking)** Why does the learned grasp policy never get real-time priority over the safety monitor? **[It is a bounded proposal (EI-07); safety must not depend on an opaque, occasionally-wrong component, the monitor and physical bounds override it (EI-11).]**

---

## 27. Challenge Problems

- **CP-M11-A, The full safety architecture.** Assemble the machine's defense in depth: the learned bound (M7), controller (M9), mechanical relief/compliance (M9/EI-09), composed guards (M8/M10), and the independent monitor + hardware controller (this module). Specify precedence, the safe states, and the single residual risk after all layers. (Directly feeds the M15 safety case.)
- **CP-M11-B, Worst-case timing under contention.** Given the perception and control tasks with execution times and periods, design the scheduling (priorities, cores, executors) that guarantees the grasp-force and drive loops meet deadlines under maximum perception load; prove the bound. (Realizes M6/M9 timing.)
- **CP-M11-C, Fail-operational degradation.** Design the degradation ladder for the identified faults (lose vision -> RTK; lose a sensor -> slow/stop; node hang -> watchdog safe-stop); specify which faults are fail-safe vs. fail-operational and why. (Feeds M14/M15.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your worst-case latency analysis assumes bounded execution times for every node, including the learned ones. How do you bound a neural network's execution time, and what happens to your guarantee if a perception node occasionally exceeds its assumed worst case?
2. **Tradeoffs.** You split the safety function between an independent software monitor and a minimal hardware controller. Defend the added complexity to a reviewer who wants one mechanism. What does each layer catch that the other cannot, and how do you prevent them from conflicting?
3. **Risk.** Suppose the independent safety monitor node itself hangs. What detects that, and what is the machine's behavior, does it fail safe, and how fast? Is there anything the monitor's own failure cannot make safe?
4. **Verification.** You verified timing in SIL and HIL under synthetic load. A reviewer notes the field's load (dust, dense fruit, edge cases) may exceed your synthetic worst case. How do you make the timing verification represent the real worst case (EI-10), and what margin do you carry?
5. **Subsystem interaction.** The grasp-force loop's stability (M9) assumed a bounded latency this module must guarantee. If the guarantee is violated in a rare corner, does M9 degrade gracefully (compliance, EI-09) or fail? Who owns the contract between the timing you provide and the stability M9 assumed?
6. **Safety independence.** State precisely what the safety monitor depends on. If any of those dependencies (its inputs, clock, power, compute) is shared with the mission logic, is it truly independent? What is the weakest link in its independence, and how is it hardened (feeds M15)?

---

## 28. Instructor Notes

- **Timing.** Section 6.3 to 6.4 (planes, worst-case timing) and Section 6.6 to 6.7 (the independent safety monitor and guard composition) are the core (~3 h) and the peaks; EI-11 is the takeaway. Trade studies (Section 11) and the SIL/HIL fault-injection work (Section 12, Section 13) form an interactive block (~1.5 h). Lab M11 is a 2 to 3 h session and is the course's integration climax.
- **Common misconceptions.** (1) "Average latency is fine", the worst case is the guarantee. (2) "Safety is a feature of each node", safety is an independent, composed property (EI-11). (3) Ignoring plane separation, a slow inference *will* eventually bruise a fruit if it shares the control thread. (4) Treating the monitor as software-only, the physical bounds (M9/EI-09) are part of the defense.
- **On EI-11 and the no-CEC decision.** EI-11 is the *judgment* (make the guard independent); it reinforces EI-07/EI-09 rather than adding a new analytical *tool*, which is why no CEC is minted, worst-case timing is CEC-01 applied. Make defense in depth the visible theme: physical bounds + independent monitor + bounded learning.
- **On the convergence.** This is the module where every prior guard meets; teach it as the payoff of the whole course's discipline of building guards as it went.
- **Where to push graduate students.** Schedulability with blocking (HW5), defense-in-depth residual risk (HW6, CP-M11-A), scheduling proof (CP-M11-B).
- **Thread to keep visible.** Close by naming hand-offs: the integrated timing-verified system -> M13 (bring-up); the safety architecture + evidence -> M15 (safety case); the timing regression -> M14 (V&V).

---

## 29. Research Frontiers

- **Landmark grounding.** ROS 2 / DDS architecture and real-time robotics references; real-time scheduling and response-time analysis references; the functional-safety literature (independent monitors, safety architectures, watchdogs). *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Real-time ROS 2 executors and deterministic scheduling for mobile manipulators; runtime monitoring / runtime assurance (simplex-style architectures) for learning-enabled robots; bounded-time inference and timing-predictable ML on edge devices; formal verification of safety monitors and guard composition; time synchronization for distributed robot systems.
- **Open problems.** Bounding worst-case execution time for learned components; provably-independent safety monitors for learning-enabled autonomy; certifiable real-time guarantees on general-purpose edge hardware; verifying that composed guards leave no gap.
- **Suggested thesis directions.** (1) A runtime-assurance architecture with a formally independent safety monitor for a learning-enabled harvester. (2) Timing-predictable scheduling that guarantees control-plane deadlines under worst-case perception load. (3) Formal verification of guard composition (no command bypasses a check) for a mobile manipulator.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- ROS 2 / DDS and real-time robotics references, node graph, QoS, executors (Section 6.1 to 6.3).
- Real-time scheduling / response-time analysis references, worst-case latency, schedulability (Section 6.4, Section 7).
- Functional-safety / runtime-assurance literature, independent monitors, safety architectures, watchdogs (Section 6.6 to 6.8; EI-11).
- Time-synchronization references, clock sync and message age (Section 6.5; CEC-03).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 10**, and (forthcoming) Doc B, Doc E, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** This module masters real-time software integration, the point where the course's per-stage nodes become **one running distributed system** with guaranteed timing. It engineers the **control-plane / perception-plane separation** that Module 6 could only require, so a slow learned inference can never delay the force loop, and it insists on **worst-case (not average) latency** as the guarantee that actually protects a fruit. Its safety contribution is the keystone: the **independent safety monitor** that can halt or safe the machine *regardless* of the mission logic or grasp policy, composing every guard the course built (M7 bound, M8 singularity, M9 relief/compliance, M10 stability) into one **defense-in-depth** architecture, physical bounds that cannot be commanded past, plus a monitor that can always command a stop, plus learning bounded by both. Its Engineering Insight, **EI-11 (Make the Guard Independent of What It Guards)**, is genuinely distinct and reinforces EI-07/EI-09 without duplicating them. The explicit CEC evaluation correctly mints **no new CEC** (real-time integration is technique; worst-case timing is CEC-01 applied; the safety architecture is judgment + a thread, not a new analytical tool), consistent with promoting CECs only as enduring cross-module design tools. All 30 sections present; the Engineering Design Review is included; one lightweight synthesis note (the convergence of all guards); consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Deadlines, worst-case latencies, reaction times, and jitter budgets depend on Doc B/E and the real edge hardware; the timing composition and safety-architecture *methods* are exact.
2. **The safety monitor is built here but certified in M15.** M11 provides the mechanism and the fault-injection evidence; the *safety case* (residual risk, independence hardening, what "safe" means per hazard) is authored in M15, an honest introduce->certify split.
3. **Worst-case bounds for learned components are assumed, not proven.** Bounding a neural network's execution time is an open problem (flagged in Section 29); the architecture mitigates by plane isolation, but the guarantee rests on the assumed bound holding.
4. **HIL harness is specified, not built.** Real timing verification under field-representative load awaits Doc G and hardware; synthetic load may understate the field worst case (EI-10).

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/E/G and by reaching M13/M15.

**END OF MODULE 11, STOP. Awaiting your review before freezing Module 11 or proceeding to Module 12.**
