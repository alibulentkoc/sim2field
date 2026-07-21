# Module 17: Capstone: The Integrated Design Challenge

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M17, **Part VII, Deploy**, *Capstone / Course Synthesis*
**Template:** 30-section module standard, adapted for a synthesis-and-project module, **Delivery:** the capstone is a student-produced integrated design; this module provides the framework, criteria, and challenge
**Estimated time:** the capstone spans the final weeks, a multi-session integrated design project with milestone reviews
**Prerequisites:** all of **M1 to M16**, the capstone exercises the entire curriculum. Math: system-level composition of every budget (accuracy, timing, energy, reliability, cost).
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 16**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This is the **capstone**: it synthesizes the whole course into one integrated design challenge whose acceptance is that the machine **works, is proven, is safe, and pencils out**. It introduces **no new technical content**, it *exercises* the six Core Engineering Concepts and the thirteen Engineering Insights together. The **CEC set is complete** (six anchors); this module mints **no new CEC**. P0-document authority tagged **[->Doc B-I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** the course's final **Engineering Insight EI-17**, the synthesizing meta-insight, and the module's **Engineering Design Review** (a full-system review).

> *All core concepts, at once.* The capstone is where the six anchors stop being separate tools and become one design practice: the **Signal-to-Action Spine (CEC-01)** organizes the machine; the **Grip-Force Window (CEC-02)** and **Placement Error Budget (CEC-03)** set the physical bounds; the **No-Cloud Edge Boundary (CEC-04)** partitions runtime from development; the **Sim-to-Real Pipeline (CEC-05)** and the **Fidelity Ladder (CEC-06)** make the simulation-first evidence trustworthy. A student who can wield all six together, and the judgment insights that go with them, has mastered the course.

---

## 1. Module Overview

**Mission.** The capstone asks the question those modules were always leading toward: can you put it all together, defend it as a whole, and take responsibility for the result? This module is not new material, it is the integrated design challenge in which a student (or team) produces a complete, coherent, defensible design of the SIM2FIELD machine (or a specified variant) and argues that it satisfies the only acceptance criterion that matters at the end: it works (meets its functional mission), is proven (verified and validated on admissible evidence), is safe (a certified safety case), and pencils out (a deployment case that beats the alternative). Nothing less is a finished engineering design.

**Previous milestone.** Sixteen modules built a machine one discipline at a time.

**Engineering problem.** The challenge is deliberately a synthesis rather than a new subsystem, because the hardest engineering skill is not designing a part well, the course taught that sixteen times, but composing the parts into a whole in which each is deliberately compromised to serve the system.

**Design tension.** The capstone surfaces every tension the course built: the arm made simple by offloading a DOF (EI-08) couples workspace to the platform (M8/M10); the compliance that protects fruit (M9/EI-09) softens the stiffness placement needs (M8); the model that improves recall (M4) costs power, heat, and money (M12/M16); the safety margin (M15) and the cost-per-acre (M16) pull against each other. A student who can hold all of these at once, decide among them with reasons, and own the emergent whole has learned what the course set out to teach.

**What this module resolves.** The capstone's framework is the six Core Engineering Concepts as an integrated design practice and the thirteen Engineering Insights as the judgment that guides their use. Its deliverable is a design and its defense, including, crucially, an honest account of the residual risks, the unproven claims, and the conditions under which the machine should not deploy. And its Engineering Insight is the meta-lesson every prior insight was an instance of, the one that only a capstone can teach: the best system is never the sum of locally-optimal parts; it is a negotiated whole the engineer must own.


## 2. Learning Objectives

- **LO-M17.1** Synthesize the full curriculum into a coherent, complete machine design spanning sensing through deployment., *Bloom: Create*
- **LO-M17.2** Apply all six Core Engineering Concepts together in one design and show how they compose., *Bloom: Create (with Evaluate)*
- **LO-M17.3** Resolve the system-level tensions (the tradeoffs that couple subsystems) with defended decisions., *Bloom: Evaluate (with Create)*
- **LO-M17.4** Assemble the acceptance argument: works (functional), proven (V&V), safe (safety case), pencils out (deployment), on admissible evidence., *Bloom: Evaluate*
- **LO-M17.5** Transfer the concepts and insights to a design variant (a new crop, platform, or constraint), demonstrating the tools are general., *Bloom: Create*
- **LO-M17.6** Defend the whole design under adversarial review, including honest residual risk and where-not-to-deploy., *Bloom: Evaluate*
- **LO-M17.7** Reflect on the engineering practice the course taught: judgment under constraint, honesty, and ownership of the whole (EI-17)., *Bloom: Evaluate (with Create)*

Maps to **all** course objectives (the capstone is the integrative assessment) and to ABET **SO1-SO7**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered the capstone can, without prompting:

1. Produce a complete, coherent machine design across all subsystems., *Bloom: Create*
2. Wield all six CECs together and show their composition., *Bloom: Create*
3. Resolve coupled system tradeoffs with defended reasons., *Bloom: Evaluate*
4. Assemble a four-part acceptance argument on admissible evidence., *Bloom: Evaluate*
5. Transfer the tools to a new design problem., *Bloom: Create*
6. Defend the whole under review, owning its residual risks honestly., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Every prior module ended by handing something forward; the capstone is where all those hand-offs must fit into one hand. It exists because **engineering is ultimately the discipline of the whole**, a career is not spent designing perfect parts in isolation but composing imperfect parts into systems that work, and the capstone is the first place a student must do that at full scale and own the result. The motivation is that the market, the field, and the people who share it do not grade subsystems; they grade the machine.

The motivation is also honest about what the course has and has not proven. Across sixteen modules the machine was designed to be feasible, bounded, safe, and economic, but much of its evidence is *specified rather than gathered*: the twin's contact fidelity awaits validation (CR-03/Doc G), the field campaigns await a season (M14), the safety case awaits hardware certification (M15), the deployment case awaits a pilot (M16). The capstone's motivation is to assemble the *argument* the machine could make, with every claim carrying its evidence and its fidelity (CEC-06), and to be candid about the residual: what is proven, what is projected, and what must still be earned. An engineer who can state that honestly is more trustworthy than one who claims a finished proof.

And the deepest motivation is the one that outlasts this particular machine: the capstone is where the six analytical tools and thirteen judgment insights stop being course content and become *how the student thinks*. The test of that is transfer, can the student take the Grip-Force Window, the error budget, the fidelity ladder, the dominant-term discipline, the bounded-learner rule, and the rest, and apply them to a *different* problem (a new crop, a new platform, a new constraint)? If so, the course succeeded: it taught not a watermelon harvester but a way of engineering physical-AI systems. The motivation for the capstone is to prove that transfer, and to send the student out able to own a whole machine.

---

## Engineering Failure Cases (capstone / whole-system)

The failures the capstone must guard against are the whole-system ones the course has been building toward:

- **Locally-optimal, globally-wrong.** Each subsystem is optimized alone; the composed machine misses its budget, its economics, or its safety. *Motivates* system-level optimization and the negotiated whole (Section 6, EI-17).
- **Unowned emergence.** A coupling no subsystem owned (arm-swing<->stability, compliance<->placement, accuracy<->cost) breaks the machine. *Motivates* owning the whole (EI-13/EI-17).
- **Overclaimed acceptance.** The design asserts "works/safe/pays" beyond its evidence. *Motivates* the honest, fidelity-tagged acceptance argument (Section 6.4, CEC-06/EI-15).
- **Non-transferable understanding.** The student can recite the watermelon design but cannot apply the tools to a variant. *Motivates* the transfer challenge (Section 6.5, LO-M17.5).
- **Abdicated responsibility.** No one owns the residual risk, the where-not-to-deploy, or the labor/equity consequences. *Motivates* ownership as the capstone's core (Section 6.6, EI-17/EI-15).

---

## 5. Background Knowledge

**Assumed:** the entire curriculum, M1 to M16, every subsystem, the six CECs, the thirteen EIs, all budgets and their composition (M13), the V&V and reliability evidence (M14), the safety case (M15), and the deployment case (M16). The capstone assumes fluency, not first exposure.

**Introduced here, used forever:** nothing *new*, the capstone's contribution is *integration and transfer*. It formalizes the acceptance argument (works/proven/safe/pays) and the practice of owning a negotiated whole. The vocabulary is the course's own, now wielded together.

**Where this sits in the dependency graph.** M17 depends on all of M1 to M16 and closes the curriculum. It **masters** nothing new; it **exercises everything**, and it **tests transfer** to a variant. It hands forward: the graduate's ability to engineer physical-AI systems, the course's true deliverable.

---

## 6. Theory (the Integration Framework)

The capstone's "theory" is not new physics but the **framework for composing** what the course built.

### 6.1 The six concepts as one design practice
The CECs are not six separate lenses but one integrated practice:

- **CEC-01 (Signal-to-Action Spine)** is the *organizing structure*, every subsystem is a stage on the sense->perceive->decide->act->move->integrate path, and the cycle-time budget binds them.
- **CEC-02 (Grip-Force Window)** and **CEC-03 (Placement Error Budget)** are the *physical bounds* the machine must live inside, the grasp force and the placement accuracy that success requires.
- **CEC-04 (No-Cloud Edge Boundary)** is the *runtime/development partition*, what must run on the machine vs. what is built off it.
- **CEC-05 (Sim-to-Real Pipeline)** and **CEC-06 (Fidelity Ladder)** are the *evidence discipline*, how learned behaviors transfer and how any simulation-based claim earns trust.

A complete design uses all six at once: the spine organizes it, the bounds constrain it, the boundary partitions it, and the evidence discipline proves it.

### 6.2 The thirteen insights as judgment
The EIs are the *judgment* that guides the tools, and the capstone reveals they form families: **mission-alignment** (EI-04 optimize the mission metric), **dominant-term discipline** (EI-05, recurring across accuracy/energy/reliability/cost), **measure-and-design-for-reality** (EI-06 measure on target, EI-10 the field is the spec, EI-12 size to the worst case, EI-14 validate adversarially), **simplicity-and-physics** (EI-08 design the DOF out, EI-09 let physics regulate), **bounded-autonomy-and-safety** (EI-07 bound the learner, EI-11 independent guard, EI-15 argue for safety), **integration** (EI-13 integrate early), and **economics** (EI-16 pencil out). The capstone is where a student draws on the right judgment at the right moment.

### 6.3 The system as a negotiation (the central framework)
The course's recurring lesson, now explicit: **no subsystem optimum is the system optimum.** Every subsystem was deliberately compromised to serve the whole, the arm gave up a DOF for simplicity (EI-08), the gripper traded stiffness for compliance (EI-09/M9), the model traded recall for power/cost (M4/M12/M16), the track width was negotiated among reach, stability, and maneuverability (M8/M10). Designing the machine *is* managing these negotiations, and the capstone's core skill is holding the competing goods together and deciding among them with defensible reasons, the meta-insight EI-17 names.

### 6.4 The acceptance argument (works / proven / safe / pays)
A finished design makes one four-part claim, each part on admissible evidence (CEC-06):

- **Works**, meets the functional mission (harvests marketable melons within the cycle-time and placement budgets, CEC-01/02/03).
- **Proven**, verified and validated (M14), each claim at its appropriate fidelity, with the unproven items flagged.
- **Safe**, a certified safety case (M15), independence established, residual risk stated and acceptable.
- **Pencils out**, a deployment case (M16) that beats the alternative within a defined envelope, a projection until the pilot.

The argument is honest about fidelity and residual, it is a *case*, made to be reviewed and attacked (EI-15), not an assertion.

### 6.5 Transfer: the tools are general
Mastery is transfer. The capstone challenges the student to apply the six CECs and the insights to a **variant**, a different crop (a delicate berry, a heavy squash), a different platform, or a new constraint (steeper terrain, tighter budget, human-collaborative operation). The Grip-Force Window, the placement budget, the fidelity ladder, the dominant-term discipline, the bounded-learner rule, none is watermelon-specific; they are the design tools of physical-AI systems. A student who can re-derive a new machine with them has learned the course, not the case study.

### 6.6 Ownership of the whole (the engineer's responsibility)
The capstone's final framework element is not analytical but professional: someone must **own the whole**, the composed budgets, the coupled tradeoffs, the emergent behavior no subsystem owns, the residual risk, the where-not-to-deploy, and the labor/equity consequences (M15/M16). Ownership means being accountable for the machine as a system and honest about its limits. This is the disposition the course aimed to instill, and the capstone is where the student practices it.

---

## 7. Mathematics (System-Level Composition)

Rigor tier for M17: **integrative L2**. No new mathematics, the capstone *composes* the course's budgets into one system model.

### 7.1 The composed system model
Assemble, together and consistently: the placement budget $3\sigma_\text{place}\le c$ (CEC-03, all contributors), the cycle-time budget $T_\text{cycle}\le d/v$ (CEC-01, all stages, shared resources), the grip-force window $F_\text{slip}\le F\le F_\text{bruise}$ (CEC-02), the power/thermal budget (M12), the reliability/MTBF (M14), and the cost-per-acre (M16). *Use:* verify the whole design satisfies every budget simultaneously, the composition M13 began, now complete and closed to the economics.

### 7.2 System-level optimization vs. local optima
Show, for at least one coupled pair (e.g., compliance <-> placement stiffness, or recall <-> power/cost), that the system optimum differs from either subsystem's local optimum, the mathematical face of EI-17. *Use:* justify a deliberately "suboptimal" subsystem choice that serves the whole. **Grad (L3):** frame the machine as a constrained multi-objective optimization (harvest value - cost, subject to safety, placement, cycle-time, power) and discuss the Pareto front and why a single scalar objective misleads.

### 7.3 The evidence-weighted acceptance
Each acceptance claim carries a confidence and an evidence fidelity (CEC-06); the overall acceptance is only as strong as its weakest load-bearing claim. *Use:* identify the argument's weakest link (usually a field-mandatory, not-yet-gathered claim) and state it honestly, the quantitative form of EI-15.

---

## 8. Engineering Principles (Synthesized)

The course's principles, distilled:

1. **Organize by the spine, bound by the physics** (CEC-01/02/03).
2. **Partition runtime from development; earn every simulation claim** (CEC-04/05/06).
3. **Attack the dominant term**, in accuracy, energy, reliability, and cost (EI-05).
4. **Prefer simplicity and let physics do the work** (EI-08/EI-09).
5. **Bound autonomy; make the guard independent; argue for safety** (EI-07/EI-11/EI-15).
6. **Design and validate for the real field, adversarially** (EI-06/EI-10/EI-12/EI-14).
7. **Optimize the system, not the subsystem, and own the whole** (EI-17), *and it must pencil out* (EI-16).

---

## 9. System Requirements (Capstone Acceptance Criteria)

The capstone's requirements are the machine's *acceptance criteria*, the four-part claim, on admissible evidence. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-A-01 | Acceptance | **Works:** the design shall meet the functional mission within the cycle-time (CEC-01) and placement (CEC-03) budgets, grasping marketable fruit (CEC-02). | Composed-budget verification (M13/M14) |
| SR-A-02 | Acceptance | **Proven:** every top claim shall rest on admissible evidence at the appropriate fidelity (CEC-06), with unproven items flagged. | V&V matrix (M14) |
| SR-A-03 | Acceptance | **Safe:** a certified safety case (independence established, residual risk stated acceptable) shall hold (M15). | Safety-case review (M15) |
| SR-A-04 | Acceptance | **Pencils out:** a deployment case shall beat the alternative within a defined envelope (M16), as a pilot-validated projection. | Deployment case (M16) |
| SR-A-05 | Acceptance | The design shall resolve the system-level tradeoffs with defended decisions (EI-17). | Design review |
| SR-A-06 | Acceptance | The concepts/insights shall be demonstrated transferable to a specified variant. | Transfer exercise |
| SR-A-07 | Acceptance | The design shall be defended under adversarial review, owning residual risk and where-not-to-deploy. | Final review |

Traceability: **SR-A-01...04 -> the whole curriculum**; SR-A-05 -> EI-17; SR-A-06 -> transfer/LO-M17.5; SR-A-07 -> EI-15/EI-17.

---

## 10. Design Decisions (the Capstone Decision Set)

The capstone's "design decisions" are the student's, this module specifies that they must be **made, composed, and defended** as a set:

- **DD-104 A complete, coherent decision set** spanning all subsystems (the DD-01...DD-103 space), shown to compose. *Serves:* SR-A-01.
- **DD-105 Explicit resolution of each system-level tension** (track-width, compliance<->stiffness, accuracy<->cost, safety<->throughput) with defended reasons. *Serves:* SR-A-05, EI-17.
- **DD-106 An evidence plan** mapping every acceptance claim to its fidelity and gathering status (CEC-06). *Serves:* SR-A-02.
- **DD-107 The certified safety case and deployment case** as gates (both must pass). *Serves:* SR-A-03/04.
- **DD-108 A transfer design** applying the tools to a variant. *Serves:* SR-A-06.
- **DD-109 An honest residual-and-limits statement** (unproven claims, where-not-to-deploy). *Serves:* SR-A-07, EI-15.

---

## 11. Trade Studies (the Whole-Machine Negotiation)

### 11.1 TS-33: The system-level negotiation
The capstone's trade study is the *whole machine* as a negotiation among competing goods. Rather than one axis, it composes the course's coupled tensions and asks the student to find the system point that best serves the mission, demonstrating EI-17. Representative coupled tensions (each a prior module's tradeoff, now held together):

| Tension | Pulls one way | Pulls the other | Where the course resolved it |
|---------|---------------|-----------------|------------------------------|
| Track width | reach (M8), stability | maneuverability (M10) | feasible interval (M10, SR-I-11) |
| Grip compliance | bruise-avoidance (M2/M9) | placement stiffness (M8) | tunable fluid stiffness (M9) |
| Perception model | recall/yield (M4) | power, heat, cost (M12/M16) | mission-cost operating point (EI-04) + dominant-term (EI-05) |
| Autonomy | capability | verifiability/safety (M7/M15) | bounded learner + independent monitor (EI-07/EI-11) |
| Throughput | coverage/economics (M16) | stability, placement (M10/M13) | index motion + composed budgets (M10/M13) |
| Safety margin | risk reduction (M15) | cost-per-acre (M16) | defense in depth + honest residual (EI-15) |

**The capstone task:** resolve these *together* into one coherent machine, defending why each subsystem is compromised as it is *for the system's sake*. There is no single "right" answer, there is a defensible negotiated whole, which is the deliverable.

### 11.2 TS-34: The transfer variant (summary)
The student selects (or is assigned) a **variant**, e.g., a delicate soft-fruit harvester, a heavier-crop machine, a steeper-terrain deployment, or a human-collaborative configuration, and re-derives the key decisions using the same six CECs and the insights. **Criteria:** correct transfer of the tools, identification of what changes (the bounds, the dominant terms, the envelope) and what stays (the framework). **Outcome:** a demonstration that the course taught general physical-AI engineering, not a single machine.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement: final)*
The **CEC set is complete** (six anchors); the capstone mints no new CEC and *exercises all six together*.

- **The integration framework / systems synthesis.** *Verdict: no new CEC.* It is the *composition* of CEC-01...CEC-06, not a new tool; the capstone is where the six are used at once.
- **System-level optimization / the negotiated whole.** *Verdict: no new CEC, it is CEC-01's systems view* (the spine as the whole) taken to its conclusion, guided by the new judgment insight EI-17.
- **EI-17 (Optimize the System, Not the Subsystem, Own the Whole)** is added as the course's final Engineering Insight, the meta-lesson every prior insight was an instance of. *(No new CEC; one final EI, closing the set at 13 insights + the meta-insight.)*

> **Cross-module synthesis note (the course's closing synthesis).** The six Core Engineering Concepts and thirteen Engineering Insights were never a checklist; they were one coherent way of engineering a physical-AI system, organize by the spine (CEC-01), live inside the physical bounds (CEC-02/03), partition runtime from development (CEC-04), earn every simulation claim (CEC-05/06), and let a small set of judgments (dominant-term, simplicity, physics, bounded autonomy, design-for-reality, integration, economics) guide the tools, all in service of a **negotiated whole the engineer owns (EI-17)**. That the same six tools and the dominant-term discipline governed accuracy, energy, reliability, and cost, four quantities, one method, is the course's clearest evidence that these anchors are the durable, transferable core. The watermelon harvester was the vehicle; this practice is the destination.

> **Simulation-first hook (final).** The capstone's acceptance is a *simulation-first argument made honest*: the validated twin (CEC-06) carries the claims it can bear, the pilot and field campaigns (EI-14) carry the rest, and every claim states its fidelity. The machine is accepted not when a demo succeeds but when the four-part argument, works, proven, safe, pays, survives adversarial review with its residual risk owned.

---

## 12. Simulation Activities (Capstone Integration)

The capstone's activities are the phases of the integrated design project; the twin is the primary integration and evidence environment (CEC-06), with pilot/field for the field-mandatory claims.

**CA-1, Full-machine composition in the twin.** Compose the complete design (all subsystems, all decisions) in the validated twin (M13) and run the end-to-end mission; verify the composed budgets (Section 7.1) hold together. *Outcome:* an integrated design that runs.

**CA-2, System-tradeoff resolution.** For each coupled tension (Section 11.1), run the twin to explore the tradeoff and select and defend the system point (EI-17). *Outcome:* a defended negotiated whole.

**CA-3, Acceptance-argument assembly.** Assemble the four-part acceptance argument (works/proven/safe/pays) on twin + specified field evidence, each claim fidelity-tagged (CEC-06); flag the field-mandatory items. *Outcome:* the honest acceptance case.

**CA-4, Transfer to a variant.** Re-derive the key decisions for the assigned variant (Section 11.2) in the twin, showing what changes and what stays. *Outcome:* demonstrated transfer.

---

## 13. Digital Twin Activities (Capstone)

**DTA-1, The capstone twin as the design-and-evidence environment.** Use the full-fidelity-ladder twin (M13) to design, integrate, and generate admissible evidence for the capstone, at the fidelity each claim requires (CEC-06). *Outcome:* the simulation-first backbone of the capstone.

**DTA-2, Pilot/field evidence plan.** Specify the pilot and field campaigns (M14/M16) that must gather the field-mandatory evidence the twin cannot bear (grasp-bruise statistics, safety certification, cost-per-acre). *Outcome:* the honest boundary of the argument.

**DTA-3, The living design record.** Specify the capstone deliverable as a living record (design + evidence + residual + limits) updated as evidence is gathered, the practice of a real engineering program. *Outcome:* an owned, maintainable design.

---

## 14. Hardware Activities (Capstone)

*(Tiered: the capstone's hardware/field work is the prototype bring-up, pilot, and certification the prior modules specified, integrated.)*

**HA-1, Prototype bring-up (integrated).** Specify the incremental, safety-first bring-up (M13 plan) of the composed machine, with go/no-go gates. *Deliverable:* a brought-up prototype (or its plan) against the twin reference.

**HA-2, Certification & pilot (integrated).** Specify the joint safety certification (M15) and deployment pilot (M16) as the capstone's field gates, the machine is accepted only when both pass. *Deliverable:* the field-evidence plan closing the acceptance argument.

---

## 15. Software Activities (Capstone)

**SWA-1, The integrated software system.** Specify the complete node graph (M11), the safety architecture (M11/M15), and the operations/fleet software (M16) as one deployable system. *Outcome:* the machine's software as a whole.

**SWA-2, The acceptance-and-evidence toolchain.** Specify the tooling that assembles the V&V matrix (M14), safety case (M15), and deployment model (M16) into the reviewable acceptance argument. *Outcome:* the capstone's defensible case, tool-supported.

---

## 16. ROS 2 Integration (Capstone)

The capstone integrates the complete ROS 2 system mastered in M11, every node, the real-time control plane, the independent safety monitor, the operations software, into one running machine, verified in the twin and (in the pilot) on hardware. No new architecture; the capstone is where the whole graph runs together and is defended as a system.

---

## 17. AI Integration (Capstone)

The capstone integrates all five AI threads, detection/ripeness (M4), localization/fusion (M5), the grasp policy (M7/M9), navigation/row-following (M10), and any operations learning (M16), as one bounded, monitored, edge-resident system (CEC-04), each learned component contained by its bounds (EI-07) and the independent monitor (EI-11), each validated adversarially and statistically (EI-14) on fidelity-appropriate evidence (CEC-05/06). The capstone's AI claim is not "the models are good" but "the *bounded system* is safe, proven, and economic despite the models being opaque", the course's central AI-safety thesis, demonstrated whole.

---

## 18. Edge Computing Integration (Capstone)

The capstone verifies the complete edge system: all learned and control workloads sharing the device within the compute (M6), timing (M11/CEC-01), and power/thermal (M12) budgets, on-robot with no cloud in the loop (CEC-04), at the envelope's edge (EI-10/EI-12). The edge is where the whole machine's real-time and energy reality is finally composed, the capstone confirms it closes.

---

## 19. Fluid Power Integration (Capstone)

The capstone integrates fluid power as it appears throughout the whole: the compliant grasp that opens the Grip-Force Window (CEC-02/M9), the passive-safety physics beneath the monitor (EI-09/M15), a stored-energy hazard in the safety case (M15), a cost/serviceability item in the deployment case (M16), and a power/thermal load in the energy budget (M12). Fluid-powered physical AI, the course's thesis, is shown whole: the fluid provides the *physical* trustworthiness (compliance, relief, graceful failure) that lets *opaque AI* be deployed safely on a fragile, valuable crop. The capstone is where that thesis is defended as a complete, working, economic machine.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M17-1, The Whole-Machine Dashboard.** All budgets at once (placement, cycle-time, grip-force, power/thermal, reliability, cost-per-acre) with the composed design's status against each; change a subsystem decision and watch every budget move, the negotiated whole made tangible (EI-17). *Goal:* Section 7.1, Section 11.1.
- **W-M17-2, System-Tradeoff Navigator.** The coupled tensions (Section 11.1) as linked sliders; moving one (e.g., compliance) shifts the others (placement, bruise, stiffness), the negotiation visualized. *Goal:* EI-17.
- **W-M17-3, Acceptance-Argument Builder.** Assemble works/proven/safe/pays with each claim's evidence and fidelity; highlights the weakest load-bearing (field-mandatory) claim (Section 6.4/Section 7.3, CEC-06/EI-15). *Goal:* the honest case.
- **W-M17-4, Transfer Studio.** Pick a variant (soft fruit, heavy crop, steep terrain, collaborative); the tool re-derives which bounds, dominant terms, and envelope change and which stay, transfer demonstrated (Section 6.5). *Goal:* generality of the tools.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M17-1** The complete machine, all subsystems integrated, annotated with the six CECs where each lives.
- **CAD-M17-2** The system-tradeoff map (the coupled tensions and their resolutions).
- **CAD-M17-3** The acceptance argument as a structure (works/proven/safe/pays -> evidence -> residual).
Format per ->Doc J (SVG system/synthesis diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M17-1 | The complete machine with the six CECs located | Section 6.1 |
| F-M17-2 | **The system as a negotiation (coupled tensions & resolutions)** | Section 6.3/Section 11.1 (central, EI-17) |
| F-M17-3 | The four-part acceptance argument (works/proven/safe/pays) | Section 6.4 |
| F-M17-4 | Composed budgets, all at once, vs. limits | Section 7.1 |
| F-M17-5 | Transfer to a variant (what changes / what stays) | Section 6.5 |
| F-M17-6 | The course map: six CECs + thirteen EIs as one practice | Section 6.1 to 6.2 (closing synthesis) |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M17-1** Changing one subsystem decision rippling through every budget, the negotiated whole responding (EI-17).
- **AN-M17-2** The acceptance argument assembling claim by claim, each with its evidence fidelity, the weakest link highlighted (EI-15/CEC-06).
- **AN-M17-3** The tools transferring to a variant: the framework staying fixed while the bounds and dominant terms re-derive (Section 6.5).

---

## 24. The Capstone Project

**The Integrated Design Challenge, the course's culminating deliverable.**

- **Charge.** Produce a complete, coherent, defensible design of the SIM2FIELD watermelon harvester (or an assigned variant) that **works, is proven, is safe, and pencils out**, and defend it under adversarial review, owning its residual risk and limits.
- **Phases & milestones.**
  1. **Architecture & decision set**, compose the full design (all subsystems), locating the six CECs; milestone review of coherence.
  2. **System-tradeoff resolution**, resolve every coupled tension (Section 11.1) with defended reasons (EI-17); milestone review of the negotiated whole.
  3. **Composed-budget verification**, verify all budgets hold together in the twin (Section 7.1, M13); milestone review of feasibility.
  4. **Acceptance argument**, assemble works/proven/safe/pays on fidelity-tagged evidence (CEC-06), flagging field-mandatory items; milestone review of honesty.
  5. **Transfer**, re-derive the key decisions for the assigned variant (Section 6.5); milestone review of generality.
  6. **Final defense**, adversarial full-system review (below), presenting the design, the acceptance argument, the residual risk, and the where-not-to-deploy.
- **Deliverables.** (a) A complete design document (architecture, decisions, tradeoff resolutions, composed budgets); (b) the four-part acceptance argument with an evidence/fidelity matrix; (c) the safety case (M15) and deployment case (M16) as gates; (d) the transfer exercise; (e) an honest residual-and-limits statement; (f) the final defense.
- **Assessment (100 pts).** Design coherence & completeness (16); system-tradeoff resolution (18, EI-17); composed-budget verification (14); acceptance argument & evidence honesty (20, CEC-06/EI-15); safety & deployment gates (14, M15/M16); transfer (10); final defense & ownership of residual (8). *No single "right" design, the deliverable is a defensible negotiated whole with an honest acceptance argument.*
- **Expected results.** A machine design that is feasible, bounded, safe, and economic *as a whole*, whose defense is strengthened (not weakened) by honestly stating what is proven, what is projected, and where it should not deploy, and a demonstration that the student can carry the tools to a new problem. A capstone that claims a finished proof is weaker than one that owns its residual (EI-15); a capstone that optimizes subsystems without composing them fails the central test (EI-17).

---

## 25. Homework (Capstone Milestones)

The capstone replaces conventional homework with the milestone deliverables above (phases 1 to 6). Interim reflective exercises:

1. **Compose the budgets.** Assemble the placement, cycle-time, grip-force, power/thermal, reliability, and cost budgets for your design and show they hold together (or where they don't).
2. **Resolve a tension.** Take one coupled tension (Section 11.1) and defend your system-level resolution, showing the system optimum differs from either subsystem's local optimum (EI-17).
3. **Weakest link.** Identify the weakest load-bearing claim in your acceptance argument and state honestly what evidence would strengthen it (CEC-06/EI-15).
4. **(Grad) Multi-objective framing.** Frame the machine as a constrained multi-objective optimization; sketch the Pareto front for two objectives and explain why a single scalar objective misleads.
5. **(Grad) Transfer analysis.** For your variant, enumerate which CECs' *bounds* change, which *dominant terms* shift, and which framework elements stay fixed, and what that says about the tools' generality.

---

## 26. Quiz (Synthesis)

1. **(MC)** The best system design is: (a) the sum of locally-optimal subsystems; (b) a negotiated whole in which parts are compromised to serve the system (EI-17); (c) the cheapest; (d) the fastest. **[b]**
2. **(MC)** A finished engineering design's acceptance argument has four parts: (a) fast/cheap/light/small; (b) works / proven / safe / pencils out; (c) sense/plan/act/move; (d) design/build/test/ship. **[b]**
3. **(MC)** The strongest capstone defense: (a) claims a finished proof of everything; (b) states honestly what is proven, projected, and where not to deploy (EI-15); (c) shows only successes; (d) omits residual risk. **[b]**
4. **(MC)** That the dominant-term method governed accuracy, energy, reliability, and cost shows: (a) the tools are narrow; (b) a small set of anchors is general and transferable (CEC-03/EI-05); (c) each needs its own CEC; (d) nothing. **[b]**
5. **(Short)** State EI-17 and why the capstone teaches it. **[Optimize the system, not the subsystem, the best machine is a negotiated whole the engineer must own; only composing all subsystems and tradeoffs at once (the capstone) reveals that local optima don't sum to the system optimum.]**
6. **(Short)** Name the six CECs and, in a phrase, what each does. **[CEC-01 spine (organize); CEC-02 grip-force window (grasp bound); CEC-03 placement budget (accuracy bound); CEC-04 edge boundary (runtime/dev partition); CEC-05 sim-to-real (learning transfer); CEC-06 fidelity ladder (trust any sim claim).]**
7. **(Synthesis)** Why is fluid-powered physical AI the course's thesis? **[Fluid provides physical trustworthiness (compliance, relief, graceful failure) that lets opaque AI be deployed safely on a fragile, valuable crop, physics makes the AI's worst case safe.]**
8. **(Synthesis)** Why does transfer to a variant test mastery? **[It shows the student learned general physical-AI design tools, not a single watermelon machine, the framework stays while the bounds/dominant terms/envelope re-derive.]**
9. **(Critical thinking)** Why can a machine that optimizes every subsystem still fail? **[Local optima don't compose: coupled tradeoffs and emergent behavior mean the system optimum requires compromising subsystems, the negotiated whole (EI-17).]**
10. **(Critical thinking)** Why is owning the residual risk part of the engineering, not an addendum? **[Someone must be accountable for the whole, the unproven claims, the where-not-to-deploy, the labor/equity consequences; abdicating that is a failure of engineering responsibility (EI-15/EI-17/SO4).]**

---

## 27. Challenge Problems (Capstone Extensions)

- **CP-M17-A, The multi-arm variant.** Re-derive the machine for a multi-end-effector configuration that relaxes the single-arm cycle-time constraint (M1): show what changes across the spine (throughput, CEC-01), the placement budget (parallel grasps), the safety architecture (more actuators to monitor), and the economics (cost vs. coverage). Defend whether it pencils out better than the single-arm baseline. (Full-system transfer.)
- **CP-M17-B, The soft-fruit variant.** Transfer the design to a delicate soft fruit (e.g., a berry or tomato): show how the Grip-Force Window narrows (CEC-02), the compliance/force control tightens (M9/EI-09), the perception changes (M4), and the economics shift, and which framework elements stay identical. (Demonstrates generality.)
- **CP-M17-C, The honest program plan.** Given the machine's current state (much evidence specified, not gathered), write the program plan to *actually* reach deployment: which P0 documents (Doc B-I) to author, which twin rungs to validate (CR-03), which field campaigns to run, in what order, with what gates, the real path from this curriculum to a fielded machine. (The bridge from course to reality.)

---

## Engineering Design Review (Final Full-System Review)

*Not graded in the usual sense, this IS the capstone's final defense. The review board attacks the whole machine; the student owns it.*

1. **The whole.** Present your machine as a system, not a collection of subsystems. Where did you deliberately compromise a subsystem to serve the whole, and can you defend each compromise (EI-17)?
2. **The budgets.** Do all budgets, placement (CEC-03), cycle-time (CEC-01), grip-force (CEC-02), power/thermal (M12), reliability (M14), cost-per-acre (M16), hold *together*? Show the composition, and name any that are tight or emergently broken.
3. **The evidence.** For each acceptance claim (works/proven/safe/pays), what is the evidence and its fidelity (CEC-06)? Which claims are field-mandatory and not yet gathered? What is your argument's weakest link, and do you state it honestly (EI-15)?
4. **The safety.** Is the safety case certified, independence established, residual risk stated? Does the machine's low residual secretly rest on a common-cause assumption or inadmissible evidence?
5. **The economics & responsibility.** Does it pencil out, and for whom (the deployment envelope)? What are the labor and equity consequences (M15/M16), and where should this machine *not* deploy?
6. **The transfer.** Take your variant: what did the tools reveal changes, and what stayed? Convince the board you learned general physical-AI engineering, not one machine.
7. **Ownership.** You are accountable for this whole machine. State its residual risks, its unproven claims, and its limits, and defend that an honest account of these makes your design *more* trustworthy, not less.

---

## 28. Instructor Notes

- **Structure.** The capstone spans the final weeks as a project with the six milestone reviews (Section 24). It is assessed on the integrated whole and its honest defense, not on any subsystem. Adversarial peer/faculty review at the final defense is essential, it embodies EI-15 and EI-17.
- **Common failure modes to coach against.** (1) Subsystem optimization without composition (fails EI-17). (2) Overclaimed acceptance (fails EI-15/CEC-06). (3) Reciting the watermelon design without transfer (fails LO-M17.5). (4) Abdicating the residual/limits/equity (fails ownership).
- **On no new CEC.** The capstone *exercises* all six CECs together and mints none, the completion of the set-complete discipline. EI-17 is the course's final judgment insight: the meta-lesson every prior insight instantiated.
- **On honesty as the highest standard.** The strongest capstone owns its residual; a claimed finished proof is a weaker, less professional deliverable. Reward candor about what is projected vs. proven.
- **On the course's arc.** Use the closing synthesis (Section 11.3 note, Section 6): the watermelon harvester was the vehicle; the six CECs, thirteen EIs, and the practice of owning a negotiated whole are the destination. That the dominant-term method spanned four quantities is the clearest proof the tools are general.
- **Grading philosophy.** There is no single correct design; assess coherence, defended tradeoffs, evidence honesty, and ownership. A defensible negotiated whole with an honest acceptance argument is the target.

---

## 29. Research Frontiers (Where the Field Goes Next)

- **The state of the field.** Autonomous agricultural harvesting of delicate, high-value crops remains an open, active frontier; the SIM2FIELD approach, fluid-powered physical AI, simulation-first, bounded autonomy, defense-in-depth safety, reflects current directions but the problems are unsolved at deployment scale [VERIFY@PUB].
- **Open problems the course's tools frame.** Validated high-fidelity contact/fluid simulation (closing CR-03-type gaps, CEC-06); certifiable safety for opaque learned control (EI-07/EI-11/EI-15); sim-to-real transfer for contact-rich delicate manipulation (CEC-05); robust field operation across the full environmental envelope (EI-10); and equitable, economically-viable deployment for diverse growers (EI-16/M15).
- **Where a graduate can contribute.** Each thesis direction across the course's modules is a real research contribution; the capstone's variants (multi-arm, soft-fruit, collaborative) are genuine open problems. The graduate leaves able to frame and attack them with the course's tools.
- **The enduring lesson.** The specific machine will be superseded; the practice, organize by the spine, bound by the physics, earn every simulation claim, attack the dominant term, prefer simplicity and physics, bound autonomy and argue for safety, design for the real field, optimize the system and own the whole, is durable, and transfers to whatever physical-AI system the graduate builds next.

---

## 30. References & Course Close

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- The complete SIM2FIELD curriculum, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, and **Modules 1 to 16**, is the capstone's reference base.
- Systems-engineering synthesis / integrated-design references, composing subsystems into a whole (Section 6).
- The domain references of every prior module, drawn on together.
- Governing documents Doc B-I (forthcoming), the production, requirements, fluid, safety, twin, and reference documents that carry the curriculum to a fielded machine (CP-M17-C).

---

## Concise quality summary (honest self-assessment)

**Strengths.** The capstone closes the curriculum by making the student *compose and own the whole*: it introduces no new technical content and instead exercises the **six Core Engineering Concepts together as one design practice** and the **thirteen Engineering Insights as the judgment that guides them**, culminating in an acceptance argument, **works, proven, safe, pencils out**, carried on fidelity-tagged, admissible evidence (CEC-06) and defended, adversarially, with its **residual risk and where-not-to-deploy owned honestly (EI-15)**. Its central framework, the **system as a negotiation** (Section 6.3/Section 11.1), holds every coupled tension the course built (track-width, compliance<->stiffness, accuracy<->cost, safety<->throughput) and asks the student to resolve them *together*, the skill no single module could teach. Its final Engineering Insight, **EI-17 (Optimize the System, Not the Subsystem, Own the Whole)**, is the meta-lesson every prior insight instantiated. It tests **transfer** to a variant (soft fruit, multi-arm, steep terrain), proving the tools are general physical-AI engineering rather than a single machine, and its closing synthesis names the course's destination: a durable practice, evidenced by one dominant-term method spanning four quantities. Consistent with your direction, it mints **no new CEC**; the CEC set closes at six and the insight set at fourteen (EI-04...EI-17). All 30 sections present (adapted for a synthesis/project module); the Engineering Design Review is the final full-system defense; the synthesis notes are the course's closing reflection; consistency with all sixteen frozen modules maintained.

**Known weaknesses / items for your review.**
1. **The capstone is a framework and challenge, not pre-solved.** By design, it specifies the integrated design *challenge*, milestones, acceptance criteria, and assessment rather than a single worked solution, because the deliverable is a defensible negotiated whole with no unique right answer. If you want a *worked reference solution* (one fully-composed example design + acceptance argument) as an instructor aid, that is a natural addition I can author.
2. **Much of the machine's evidence remains specified, not gathered**, the capstone honestly assembles the *argument* the machine could make, with field-mandatory claims flagged; CP-M17-C makes the path to real evidence (the P0 documents, twin validation, field campaigns) an explicit deliverable.
3. **Targets remain [VERIFY@PUB]** throughout, inherited from the modules the capstone composes.
4. **The variant challenges are framed, not fully worked**, they are genuine transfer exercises for the student, not authored solutions.

I have not scored this against the 9.5 bar, that judgment is yours. This completes the 17-module curriculum.

**END OF MODULE 17, CAPSTONE COMPLETE. This is the final module of the SIM2FIELD curriculum. STOP. Awaiting your review before freezing Module 17 and closing the curriculum.**
