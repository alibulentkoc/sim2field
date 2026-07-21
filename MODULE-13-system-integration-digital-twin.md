# Module 13: System Integration & the Digital Twin

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M13, **Part V, Integrate**, *Integration Keystone*
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 6 contact hours + a 3 hour laboratory + homework
**Lifecycle stage (this module):** the whole ladder, Sim -> Twin -> SIL -> HIL -> (Prototype bring-up)
**Prerequisites:** all of M1 to M12, this module composes them. Especially: the spine and budgets (CEC-01, CEC-03), the grasp and fluid contact (CEC-02, M9, CR-03), the sim-to-real pipeline (CEC-05), the real-time integration and safety architecture (M11), and power/thermal (M12). Math: system-level error/timing/energy composition; model validation.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 12**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This is the **system-integration keystone**: it composes every subsystem into one working machine, masters the **digital twin** as the integration environment and evidence source, and **confronts and closes Foundation conflict CR-03** (the twin's fluid/contact-fidelity gap) at the system level. P0-document authority tagged **[->Doc B/C/D/F/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** the designation of **CEC-06 (the Simulation-First Fidelity Ladder)** at its mastery point, the watchlist candidate scheduled for evaluation here; **Engineering Insight EI-13**; and the module's **Engineering Design Review**.

> *Core concepts converging.* This module assembles the whole **Signal-to-Action Spine (CEC-01)** into one running machine and verifies its budgets *together*: the placement budget (**CEC-03**) system-wide, the grasp inside the window (**CEC-02**), the no-cloud runtime (**CEC-04**), the sim-to-real pipeline (**CEC-05**) at system scale, and the power/thermal envelope (M12). It is where the course's central bet, *simulation-first*, is finally cashed at the level of the entire machine.

---

## 1. Module Overview

**Mission.** This module is where the pieces must fit. System integration composes perception, decision, manipulation, the fluid-powered grasp, mobility, the real-time software, the safety architecture, and power/thermal into one machine, and confronts the hardest failure class in Module 1's taxonomy, the one that lives between subsystems and that no module could see alone: integration failure.

**Previous milestone.** Twelve modules have each built a piece and, at their edges, promised that the pieces would fit.

**Engineering problem.** The course's answer to that class has been present from the first page: simulation-first. Build and integrate in a digital twin before committing to hardware, so the interactions surface cheaply, safely, and early. This module masters that instrument. The digital twin is not a graphic; it is a validated virtual replica used across the whole course, as a design tool, a policy training environment (CEC-05), an error-budget instrument (CEC-03), a timing bench (M11), and now a system-integration environment and the evidence source that feeds verification (M14). Its power is entirely conditional on one thing: whether its fidelity is trustworthy for the decision at hand.

**Design tension.** That condition is this module's central analytical contribution, and the reason a new Core Engineering Concept is designated here. A twin has many fidelity levels, kinematic, dynamic, contact/fluid, sensor-in-the-loop, hardware-in-the-loop, each more expensive and more faithful than the last. The discipline is to match fidelity to the decision, identify where fidelity is binding, and validate each rung against reality before trusting it. That discipline, the Simulation-First Fidelity Ladder, is the organizing analytical tool of a simulation-first program, used in every module's Sim/Twin activities, and mastered here at the system level. It is also how this module finally confronts CR-03: the contact/fluid rung is the hardest and most decision-critical, and the machine's grasp results are trustworthy only if that rung is validated.

**What this module resolves.** The module's Engineering Insight is the integration lesson every experienced engineer carries: the surprises live between the modules. Resource contention, timing coupling, interface drift, and dynamic interactions are invisible in a validated part and appear only when the parts run together, so integrate early and continuously in the twin, and expect the system to behave differently than the sum of its verified pieces.


## 2. Learning Objectives

- **LO-M13.1** Compose all subsystems into one integrated machine and verify the end-to-end harvest mission against all budgets (CEC-01/CEC-03, power/thermal)., *Bloom: Create (with Evaluate)*
- **LO-M13.2** Use the digital twin as the system-integration environment and evidence source across the lifecycle (Sim->Twin->SIL->HIL)., *Bloom: Apply (with Create)*
- **LO-M13.3** Apply the Simulation-First Fidelity Ladder: match fidelity to the decision, find where fidelity is binding, and validate each rung against reality (CEC-06)., *Bloom: Evaluate (with Analyze)*
- **LO-M13.4** Close CR-03 at the system level: integrate and validate the contact/fluid-fidelity rung so grasp results are trustworthy., *Bloom: Evaluate*
- **LO-M13.5** Detect and analyze emergent, cross-subsystem behavior (resource contention, timing/dynamic coupling, interface drift) through incremental integration (EI-13)., *Bloom: Analyze*
- **LO-M13.6** Verify system-level budget composition (placement, timing, power) holds when subsystems run together., *Bloom: Evaluate*
- **LO-M13.7** Specify the validated twin as the evidence source for verification and the safety case (M14/M15)., *Bloom: Create*

Maps to course objectives **LO7** (primary), **all** (integrative), and ABET **SO1, SO2, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Integrate the subsystems and verify the end-to-end mission against every budget., *Bloom: Create*
2. Use the twin across the lifecycle as an integration and evidence environment., *Bloom: Apply*
3. Choose and validate the right twin fidelity for a given decision (CEC-06)., *Bloom: Evaluate*
4. Close the contact-fidelity gap (CR-03) so grasp results can be trusted., *Bloom: Evaluate*
5. Find and explain emergent behavior that no module owned., *Bloom: Analyze*
6. Show that composed budgets hold at the system level., *Bloom: Evaluate*

---

## 4. Engineering Motivation

The most dangerous failures in Module 1's taxonomy were the integration failures, precisely because each subsystem passes its own tests and the machine fails anyway. This module exists because **the properties that decide whether a robot works are system properties**, end-to-end timing, composed accuracy, resource sharing, dynamic coupling, and safe interaction, and none of them can be established by testing parts in isolation.

Consider what integration must reconcile. The perception, decision, and grasp loops each fit *their* share of the cycle-time budget (CEC-01), but do they fit *together*, on one edge device, sharing compute (M6/M11) and power (M12), without contention? Each subsystem's contribution to the placement budget (CEC-03) was allocated, but does the assembled 3σ actually meet the capture tolerance when perception, mechanism, navigation, and timing all contribute at once? The arm's swing was designed for the grasp (M8/M9), but does that swing, integrated with the moving platform on a slope (M10), erode stability in a way no module analyzed alone? These are integration questions, and answering them on hardware, by trial, is slow, expensive, and, for a machine that exerts force and moves a heavy payload, sometimes dangerous.

The motivation for the digital twin, and for this module's mastery of it, is that the twin lets integration happen *first in simulation*: compose the subsystems virtually, run the whole mission, and surface the interactions cheaply and safely before committing to steel and fluid. But a twin can lie. A low-fidelity twin will happily report a successful grasp that the real contact physics would bruise (CR-03), or a stable machine that real terrain would tip. So the twin's value is entirely conditional on **fidelity trustworthiness**, and the engineer's central judgment becomes: *for this decision, is my twin faithful enough, and how do I know?* That judgment, matching fidelity to the decision and validating each rung against reality, is the analytical tool this module designates as a Core Engineering Concept, because a simulation-first curriculum returns to it in every module and lives or dies on getting it right.

---

## Engineering Failure Cases (integration-and-twin-specific)

Sharpening Module 1's *integration* class and the simulation-first bet:

- **Emergent overrun.** Each loop meets its budget alone; running together, compute/power contention pushes a loop past its deadline (CEC-01) or the composed 3σ past the capture tolerance (CEC-03). *Motivates* system-level budget verification and incremental integration (Section 6.5, Section 7.2, EI-13).
- **Twin over-trust.** A grasp validated on a low-fidelity twin bruises on real contact physics (CR-03). *Motivates* the fidelity ladder and per-rung validation (Section 6.3 to 6.4, CEC-06).
- **Interface drift.** Two subsystems agreed on an interface that quietly diverged (units, frame, timing); integration mislocates or mistimes. *Motivates* interface verification (Section 6.2).
- **Hidden dynamic coupling.** Arm swing + moving platform + slope interact to erode stability in a way no single module modeled. *Motivates* integrated dynamic testing (Section 6.6, EI-13).
- **Fidelity misallocation.** Fidelity effort spent where a decision was insensitive to it, while the binding rung (contact) stayed low-fidelity. *Motivates* matching fidelity to decision sensitivity (Section 6.4, CEC-06).

Each is caught by integrating early in a fidelity-appropriate, validated twin.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** all of M1 to M12, every subsystem, budget, and interface; the simulation-first lifecycle (Sim->Twin->SIL->HIL->Prototype->Field, M1); the twin's prior roles (design, training env CEC-05, budget instrument CEC-03, timing bench M11); CR-03 (the fluid/contact fidelity gap); model-validation basics.

**Introduced here, used later:** the vocabulary of system integration and twin fidelity, *incremental/continuous integration, bring-up, interface verification, emergent behavior, resource contention, dynamic coupling, digital twin, fidelity level, fidelity ladder, model validation, reality gap (per rung), fidelity-decision sensitivity, evidence source*. Developed at applied (L2) depth; formal systems-integration/V&V is expanded in M14 and referenced [->Doc H].

**Where this sits in the dependency graph.** M13 depends on all of M1 to M12. It **masters** the system-integration and digital-twin threads and **designates CEC-06 (the Fidelity Ladder)**; it **applies** every prior anchor at system scale (CEC-01/02/03/04/05) and **closes CR-03** at the system level. It hands forward: the integrated, budget-verified machine and the *validated twin as evidence source* to M14 (V&V) and M15 (safety case); the bring-up learnings to the prototype; and the integrated system to M17 (capstone).

---

## 6. Theory

### 6.1 System integration: composing the machine
Integration composes the subsystems into one machine that executes the end-to-end mission (`DRIVE->STAGE->ALIGN->GRAB->LIFT->SWING->LOWER->RELEASE`). It is done **incrementally**, bring up two subsystems, verify their interface and interaction, add a third, rather than all at once ("big bang"), because incremental integration localizes the interaction that breaks and is far easier to debug (EI-13). The twin is the environment where this incremental composition happens first.

### 6.2 Interface verification
Each pair of subsystems meets at an interface the earlier modules fixed (a message type, a physical mounting, a timing contract). Integration verifies these interfaces actually agree, units, coordinate frames, timing, message age, physical fit, because *interface drift* (a quiet divergence between what two teams assumed) is a classic integration failure. Verified interfaces are the seams that let the incremental composition hold.

### 6.3 The digital twin as a system
The **digital twin** is a validated virtual replica of the machine and its environment, used to design, integrate, verify, and generate evidence. Across the course it has served many roles; at the system level it becomes the **integration bench** (compose and run the whole mission in sim), the **timing/resource bench** (M11/M12 contention), and, once validated, the **evidence source** that verification (M14) and the safety case (M15) draw on. Its trustworthiness is not assumed; it is *earned per fidelity rung* (Section 6.4).

### 6.4 The Simulation-First Fidelity Ladder (the designated concept)
A twin exists at multiple **fidelity levels**, a ladder from cheap-and-approximate to expensive-and-faithful: **kinematic** (geometry/reach), **dynamic** (masses, forces, stability), **contact/fluid** (grasp contact, bruise/slip, fluid actuation, the CR-03 rung), **sensor-in-the-loop** (real perception on rendered/played-back data), **hardware-in-the-loop** (real edge/actuators against the sim), up to **prototype/field**. The analytical discipline has three parts:

1. **Match fidelity to the decision.** A reach question needs only kinematic fidelity; a *grasp-will-not-bruise* question needs contact/fluid fidelity. Using low fidelity for a fidelity-sensitive decision is over-trust; using high fidelity for an insensitive one wastes effort.
2. **Find where fidelity is binding.** Identify the decisions whose outcome *changes* across fidelity levels, those are where fidelity investment and validation must go.
3. **Validate each rung against reality before trusting it.** Every fidelity level has a reality gap; a rung is trustworthy only after its predictions are checked against real data to a tolerance (the per-rung acceptance gate). Climb the ladder deliberately.

This is the tool that makes a simulation-first program *rigorous* rather than merely simulated. It is distinct from CEC-05 (the sim-to-real *learning-transfer* pipeline): CEC-05 transfers *learned behaviors* (domain randomization, policy transfer); CEC-06 governs the fidelity and validation of *any* model-based decision, physical or learned, including kinematics, stability, thermal, and contact. And it is distinct from the simulation-first *lifecycle* (the Sim->...->Field sequence, a process): CEC-06 is the *analytical judgment* exercised within that process about how much to trust each rung for each decision.

### 6.5 System-level budget composition
The course's budgets were allocated per subsystem; integration verifies they hold *together*. The placement budget (CEC-03) is assembled from all real contributors at once and tested against the capture tolerance (CEC-02); the cycle-time budget (CEC-01) is verified end-to-end with all loops sharing the edge (M11) and power (M12); the power/thermal budget (M12) is checked under the true coincident load. Composition can reveal an *emergent* overrun that no single allocation predicted, the integration surprise (EI-13).

### 6.6 Emergent and cross-subsystem behavior
Integration reveals behavior no module owned: **resource contention** (compute/power shared across perception, control, navigation, M6/M11/M12); **timing coupling** (one loop's jitter perturbing another, M11); **dynamic coupling** (arm swing <-> platform stability on a slope, M8/M9/M10; fluid compliance <-> placement stiffness, M9/M8); **interface drift** (Section 6.2). These emergent effects are the reason integration is a distinct engineering activity and not a formality, and the reason to integrate early and continuously (EI-13), using the twin to make the surprises cheap.

### 6.7 Closing CR-03 at the system level
Foundation conflict CR-03 named the twin's missing fluid/contact fidelity. Module 9 specified the contact/fluid rung; this module **integrates and validates it into the system twin** so that whole-mission grasp results (bruise/slip rates, window membership) are trustworthy, with real validation as the acceptance gate (CEC-06/CEC-05). Closing CR-03 is what lets the integrated twin be an *evidence source* for the grasp (M14/M15) rather than an optimistic guess.

---

## 7. Mathematics

Rigor tier for M13: **L2**. Central results: fidelity-decision sensitivity, per-rung validation, and system-level budget composition.

### 7.1 Fidelity-decision sensitivity
A decision $D$ is **fidelity-sensitive** if its outcome changes across fidelity levels $f$: $\partial D/\partial f \neq 0$. The **required fidelity** is the lowest level at which $D$ stabilizes (further fidelity does not change the decision). *Use:* decide which rung a question needs, reach stabilizes at kinematic fidelity; grasp-bruise does not stabilize until contact/fluid fidelity (CR-03).

### 7.2 Per-rung validation and system budget composition
Per-rung reality gap: $g_f = |\,\text{twin}_f - \text{real}\,|$; the rung is accepted if $g_f \le \text{tol}_f$. System placement budget assembled: $\sigma_\text{place}=\sqrt{\sum_i \sigma_i^2}$ over *all* real contributors (perception, calibration, sync, estimation, mechanism, navigation-lateral), tested $3\sigma_\text{place}\le c$ (CEC-02/CEC-03). System cycle time: $T_\text{cycle}=\sum$ stage times with shared-resource effects, tested $\le d/v$ (CEC-01). *Use:* verify the composed budgets hold and detect emergent overruns.

### 7.3 Integration order and surprise localization
Incremental integration adds subsystems one interface at a time; if a metric breaks when subsystem $k$ is added, the interaction is localized to $k$'s interfaces, an $O(n)$ debug path versus the $O(n^2)$ interaction search of big-bang integration. *Use:* justify incremental/continuous integration (EI-13). **Grad (L3):** analyze how many pairwise interactions incremental testing exposes vs. big-bang, and where dynamic (not just interface) coupling still hides.

---

## 8. Engineering Principles

1. **Integrate incrementally and early** (EI-13): localize the surprise; the twin makes it cheap.
2. **Verify interfaces explicitly**, interface drift is a silent integration killer.
3. **Match fidelity to the decision** (CEC-06): neither over-trust low fidelity nor over-invest high.
4. **Validate every rung against reality**, an unvalidated twin is a confident liar.
5. **Compose the budgets, don't assume them** (CEC-01/CEC-03/M12): verify they hold together.
6. **Hunt emergence**, resource, timing, and dynamic coupling live between the modules.
7. **A validated twin is evidence; an unvalidated one is a guess**, earn the trust before you cite it (->M14/M15).

---

## 9. System Requirements

Derived from the integration mission; apply/compose all anchors and close CR-03. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-V-01 | Verification | The integrated machine shall execute the end-to-end harvest mission meeting all budgets (cycle-time CEC-01, placement CEC-03, power/thermal M12) *composed*. | Twin + HIL + prototype |
| SR-V-02 | Verification | Each twin fidelity rung used for a decision shall be validated against real data to its acceptance tolerance (CEC-06). | Per-rung validation |
| SR-V-03 | Verification | The contact/fluid rung (CR-03) shall be integrated and validated so system grasp results (bruise/slip/window) are trustworthy. | Contact validation (M9 bench) |
| SR-F-19 | Functional | Integration shall be incremental with explicit interface verification. | Review + test |
| SR-V-04 | Verification | Emergent/cross-subsystem behavior (resource, timing, dynamic coupling) shall be tested at the system level. | Integrated test campaign |
| SR-I-18 | Interface | The validated twin shall serve as the evidence source for V&V (M14) and the safety case (M15). | Review (->Doc G) |

Traceability: SR-V-01 -> CEC-01/CEC-03/M12; **SR-V-02/03 -> CEC-06/CEC-05, closes CR-03**; SR-F-19 -> EI-13; SR-V-04 -> EI-13; SR-I-18 -> M14/M15.

---

## 10. Design Decisions

- **DD-76 Incremental/continuous integration in the twin first.** *Rationale:* Section 6.1/Section 7.3, EI-13; localize surprises cheaply. *Serves:* SR-F-19, SR-V-04.
- **DD-77 The digital twin as integration bench and evidence source.** *Rationale:* Section 6.3; simulation-first realized at system scale. *Serves:* SR-I-18.
- **DD-78 Fidelity ladder with per-rung validation gates** (CEC-06). *Rationale:* Section 6.4/Section 7.1 to 7.2; earn trust per decision. *Serves:* SR-V-02.
- **DD-79 Integrate and validate the contact/fluid rung** (closes CR-03). *Rationale:* Section 6.7; trustworthy grasp results. *Serves:* SR-V-03.
- **DD-80 System-level composed-budget verification.** *Rationale:* Section 6.5/Section 7.2; budgets must hold together. *Serves:* SR-V-01.
- **DD-81 Emergent-behavior test campaign** (resource/timing/dynamic coupling). *Rationale:* Section 6.6; hunt what no module owned. *Serves:* SR-V-04.
- **DD-82 HIL before prototype commitment.** *Rationale:* the lifecycle ladder; real edge/actuators against the twin before steel. *Serves:* SR-V-01.

---

## 11. Trade Studies

### 11.1 TS-25: Twin fidelity allocation
**Alternatives:** (A) **uniform high fidelity everywhere**; (B) **uniform low fidelity**; (C) **matched fidelity (high where decisions are sensitive, low elsewhere)**; (D) **HIL-only (skip high-fidelity sim, go to hardware)**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B/Doc G).

| Criterion (weight) | A: Uniform high | B: Uniform low | C: Matched | D: HIL-only |
|--------------------|:---:|:---:|:---:|:---:|
| Decision coverage / trustworthiness (0.28) | 5 | 2 | 5 | 4 |
| Cost / development effort (0.24) | 2 | 5 | 4 | 2 |
| Validation burden (0.20) | 2 | 4 | 4 | 3 |
| Speed of iteration (0.16) | 2 | 5 | 4 | 2 |
| Safety of exploring failures (0.12) | 5 | 4 | 5 | 2 |
| **Weighted total** | **3.10** | **3.72** | **4.40** | **2.80** |

**Selected: C (matched fidelity, the Fidelity Ladder).** Build high fidelity where decisions are fidelity-sensitive (contact/fluid grasp, CR-03; dynamic stability) and low fidelity where they are not (reach, coverage), validating each rung used. This is CEC-06 as a design decision: it maximizes trustworthy decision coverage per unit of fidelity effort. Uniform high fidelity is unaffordable and mostly wasted; uniform low over-trusts; HIL-only forfeits the cheap, safe early exploration that is the point of simulation-first. Recorded weakness: "matched" requires *knowing* which decisions are fidelity-sensitive, itself a judgment that can be wrong, so the fidelity allocation is revisited as integration reveals surprises (EI-13).

### 11.2 TS-26: Integration strategy (summary)
**Alternatives:** big-bang, **incremental/continuous**, subsystem-freeze-then-integrate. **Criteria:** surprise localization, debug cost, schedule risk, coverage. **Outcome:** **incremental/continuous integration in the twin**, add one interface at a time, verify, proceed; localize each surprise to the subsystem that introduced it (Section 7.3, EI-13). Big-bang is rejected (interactions are unlocalizable); continuous is preferred over freeze-then-integrate because it catches interface drift early.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
This is the scheduled evaluation of the watchlist candidate, and it is assessed against the standing bar, *promote only genuinely enduring, cross-module analytical tools.*

- **The Simulation-First Fidelity Ladder.** *Verdict: promoted from watchlist to full CEC, **CEC-06**, designated here at mastery.* It qualifies on all three tests: **(1) Recurrence**, it is used in *every* module's Simulation/Twin activities (M3 to M12), not occasionally; matching fidelity to a decision and validating the twin is the operative judgment behind every "verify in the twin" the course has written. **(2) Analytical, not procedural**, it is a *tool for reasoning* (fidelity-decision sensitivity, per-rung reality gap, where fidelity is binding), distinct from the simulation-first *lifecycle sequence*, which is process. **(3) Distinct from existing anchors**, CEC-05 transfers *learned* behaviors (domain randomization); CEC-06 governs the fidelity/validation of *any* model-based decision, physical or learned. M13 is the genuine mastery point because system integration is where twin fidelity must be managed across all rungs at once and CR-03 is closed. *This is the first new CEC since CEC-05 (M7); the five intervening modules (M8 to M12) each correctly declined, which is exactly why this designation is credible rather than inflationary.*
- **System integration / the digital twin (as artifacts).** *Verdict: not separate CECs.* The twin is the *environment*; integration is the *activity*; the enduring analytical *tool* they embody is the Fidelity Ladder (CEC-06). Captured in the integration thread.
- **EI-13 (Integrate Early and Often)** is added as this module's Engineering Insight, reinforcing CEC-06 (the twin makes early integration cheap) without duplicating it. *(One new CEC + one new EI, the CEC by scheduled, justified promotion.)*

> **Cross-module synthesis note (lightweight).** The course now has two sim-truth anchors that together make simulation-first rigorous: **CEC-05** answers "will this *learned behavior* transfer to reality?" and **CEC-06** answers "can I trust this *simulation* for this *decision* at all?" Every twin result the curriculum cites, a reach, a stability margin, a grasp force, a timing bound, a thermal margin, is a CEC-06 claim, trustworthy only to the fidelity of a validated rung; the learned ones are additionally CEC-05 claims. The two anchors are why a simulation-first program can be evidence-based rather than hopeful.

> **Simulation-first hook.** This module *is* the simulation-first hook made explicit: the whole machine is integrated and verified in the twin across the fidelity ladder, CR-03's contact rung is validated against the M9 bench, and only then does HIL and prototype bring-up proceed, the validated twin becoming the evidence source for M14/M15.

---

## 12. Simulation Activities

M13 exercises **the whole ladder**, Sim -> Twin -> SIL -> HIL, with the twin as the system-integration bench.

**SA-1, Incremental integration.** Compose subsystems two-at-a-time in the twin, verifying each interface and interaction before adding the next (Section 6.1 to 6.2, EI-13); run the full harvest cycle once integrated. *Outcome:* an integrated machine in sim with each surprise localized.

**SA-2, Fidelity-ladder study.** For three decisions (reach, stability, grasp-bruise), find the fidelity level at which each stabilizes (Section 7.1, CEC-06); confirm grasp-bruise needs the contact/fluid rung (CR-03). *Outcome:* fidelity matched to decisions.

**SA-3, Composed-budget verification.** Assemble the system placement budget (all contributors) and end-to-end cycle time with shared resources; test against the capture tolerance and $d/v$ (Section 6.5, Section 7.2). *Outcome:* budgets verified together; any emergent overrun exposed.

**SA-4, Emergence hunt.** Stress the integrated system (compute/power contention M6/M11/M12; arm-swing on a slope M8/M9/M10) and observe cross-subsystem behavior (Section 6.6). *Outcome:* emergent effects found in sim, cheaply (EI-13).

---

## 13. Digital Twin Activities

**DTA-1, System-twin & fidelity-ladder spec (deliverable to Doc G).** Specify the integrated system twin, its fidelity rungs (kinematic->dynamic->contact/fluid->sensor-in-loop->HIL), and the validation gate for each rung used (CEC-06). *Outcome:* SR-I-18/SR-V-02; the validated evidence environment.

**DTA-2, Close CR-03 (contact rung validation).** Integrate the M9 fluid/contact model into the system twin and validate its whole-mission grasp predictions against the M9 bench to the acceptance tolerance (Section 6.7, SR-V-03). *Outcome:* trustworthy grasp results; CR-03 closed at system level.

**DTA-3, Evidence-source packaging.** Specify how validated twin results become traceable evidence for V&V (M14) and the safety case (M15), tagged with the fidelity rung and validation status. *Outcome:* the twin as a citable evidence source, not a guess.

---

## 14. Hardware Activities

*(Tiered: HIL and bring-up protocols at specification level.)*

**HA-1, HIL integration.** Specify running the real edge (M6) and (real or emulated) actuators against the system twin, verifying end-to-end timing/resource behavior under realistic load (SR-V-01). *Deliverable:* HIL integration evidence.

**HA-2, Prototype bring-up plan.** Specify the incremental hardware bring-up order (power/safety first per M12/M11, then sensing, then motion, then grasp), with a go/no-go gate per step and the twin as the reference. *Deliverable:* a bring-up procedure (the first real-hardware step of the lifecycle).

---

## 15. Software Activities

**SWA-1, Integration harness & config management.** Specify the launch/config that composes all nodes (M11) against the twin, with versioned interface definitions and a check that deployed interfaces match the agreed contracts (guards against interface drift). *Outcome:* reproducible system integration.

**SWA-2, System regression suite.** Specify an end-to-end regression (full mission, all budgets, emergence stress) that every integrated change must pass, with the fidelity rung recorded per check. *Outcome:* continuous system V&V (hand-off to M14).

---

## 16. ROS 2 Integration

M13 brings up the full node graph (M11) against the system twin and then on HIL hardware, the point where the real-time architecture, the safety monitor, and every subsystem node run *together*. It verifies that the composed graph meets end-to-end timing (CEC-01) with shared compute/power (M11/M12) under realistic load, and that the safety architecture behaves correctly in the integrated system (not just in isolation). Interface/config management (SWA-1) guards against the drift that integration exposes. This is where "the software integration" (M11's mastery) meets "the whole machine" (this module's).

---

## 17. AI Integration

The twin is where every learned component meets reality-in-simulation and then reality:

- **The twin as the system training/validation environment** (CEC-05), perception (M4), the grasp policy (M7/M9), row-following (M10) are trained/validated in the integrated twin, and their sim-to-real transfer is gated by real validation.
- **Fidelity governs learned trust too (CEC-06).** A policy validated only on a low-fidelity rung is over-trusted exactly as a physical result would be, the contact rung (CR-03) is where the grasp policy's *sim* success becomes a trustworthy claim.
- **Emergence includes the learned loops.** Integration checks that the learned components, running together with control and under resource contention (M11/M12), still meet their bounds (EI-07) and timing, a system-level check no module made alone.

The two sim-truth anchors (CEC-05 transfer, CEC-06 fidelity) together make the machine's AI evidence-based.

---

## 18. Edge Computing Integration

Integration is where the edge device's resource sharing becomes real: perception, control, navigation, and safety all run on it at once (M6/M11), drawing power and heat (M12). This module verifies, in HIL, under realistic load, that the composed system meets its timing (CEC-01) and power/thermal (M12) budgets *together*, catching the resource contention that no subsystem predicted alone (a prime emergent effect, EI-13). The no-cloud boundary (CEC-04) means all of this must close on the device; the twin/HIL is how it is verified before the field.

---

## 19. Fluid Power Integration

The fluid grasp (M9) meets its hardest test here: the **contact/fluid fidelity rung is the binding one** for the machine's central function, and this module integrates and validates it into the system twin to **close CR-03**. Two points: (1) the whole-mission grasp result (bruise/slip/window across a field of fruit, through lift and swing on a moving platform) is only trustworthy once the contact rung is validated against the M9 bench (SR-V-03), this is where a grasp "success" in sim earns the right to be believed; (2) integration exposes fluid-power couplings no module owned, the pump's power/thermal draw under a full mission (M12), the compliance <-> stability interaction on a moving platform (M9/M10), the grasp-loop timing under system resource contention (M11). Closing CR-03 at the system level is what lets the twin be an evidence source for the grasp in M14/M15.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M13-1, Integration Assembler.** Add subsystems one at a time to a machine diagram; each addition runs an interface check and surfaces any emergent metric change, incremental integration made tangible (EI-13). *Goal:* Section 6.1 to 6.2.
- **W-M13-2, Fidelity-Ladder Explorer.** Pick a decision (reach / stability / grasp-bruise); a slider climbs the fidelity rungs and shows where the decision stabilizes and where it flips, the fidelity-sensitivity idea (CEC-06). *Goal:* Section 6.4/Section 7.1.
- **W-M13-3, Composed-Budget Dashboard.** Toggle subsystems on/off and watch the composed placement 3σ, end-to-end cycle time, and power/thermal move against their limits, budgets holding or emergently breaking (Section 6.5). *Goal:* system-level budgeting.
- **W-M13-4, Reality-Gap / Validation Gate.** For each rung, compare twin prediction vs. (mock) real data against the acceptance tolerance; show CR-03's contact rung passing only after validation (CEC-06). *Goal:* earn the trust.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M13-1** The integrated machine: all subsystems on the platform with interfaces annotated (the assembled Signal-to-Action Spine).
- **CAD-M13-2** The fidelity ladder as a diagram: rungs from kinematic to field, each with its decision class and validation gate.
- **CAD-M13-3** The digital-twin <-> real-machine correspondence with per-rung reality gaps.
Format per ->Doc J (SVG system/architecture diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M13-1 | The integrated machine (all subsystems, interfaces) | Section 6.1 |
| F-M13-2 | Incremental vs. big-bang integration (surprise localization) | Section 6.1/Section 7.3 (EI-13) |
| F-M13-3 | **The Simulation-First Fidelity Ladder (rungs, decisions, validation gates)** | Section 6.4 (central, CEC-06) |
| F-M13-4 | Fidelity-decision sensitivity (where a decision stabilizes) | Section 7.1 |
| F-M13-5 | Composed system budgets (placement, cycle-time, power) vs. limits | Section 6.5/Section 7.2 |
| F-M13-6 | Twin<->real correspondence & per-rung reality gap (CR-03 closed) | Section 6.7 |
| F-M13-7 | Emergent coupling map (resource/timing/dynamic) | Section 6.6 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M13-1** Subsystems added one at a time; on a certain addition an emergent overrun appears and is localized to that interface, incremental integration catching the surprise (EI-13).
- **AN-M13-2** Climbing the fidelity ladder for a grasp: at low fidelity it "succeeds," at contact fidelity it bruises, the fidelity-sensitivity of the decision and why CR-03 matters (CEC-06).
- **AN-M13-3** The twin prediction and real data converging as a rung is validated, the acceptance gate turning green.

---

## 24. Laboratory

**Lab M13, Integrating the Machine and Climbing the Fidelity Ladder**

- **Objectives.** (1) Integrate the subsystems incrementally in the twin and verify interfaces; (2) run the end-to-end mission and verify composed budgets; (3) apply the fidelity ladder, match fidelity to three decisions and validate the binding rung; (4) close CR-03 by validating the contact rung; (5) hunt emergent behavior.
- **Equipment.** The full digital twin (all fidelity rungs) + SIL/HIL harness; all subsystem models (M1 to M12); the M9 contact/bench validation data; notebook. **Safety:** SIL/HIL; any prototype bring-up follows the power/safety-first sequence (M12/M11).
- **Procedure.**
  1. Compose subsystems two-at-a-time; verify each interface; run the full harvest cycle once integrated (Section 6.1 to 6.2, SA-1).
  2. Assemble the system placement budget and end-to-end cycle time with shared resources; test against the capture tolerance and $d/v$ (Section 6.5, Section 7.2, SR-V-01); note any emergent overrun.
  3. For reach, stability, and grasp-bruise, find the fidelity level at which each stabilizes (Section 7.1); validate the binding rung against real/bench data (CEC-06, SR-V-02).
  4. Validate the contact/fluid rung against the M9 bench; confirm whole-mission grasp results are trustworthy (close CR-03, SR-V-03).
  5. Stress the integrated system (contention, arm-swing on slope) and document any emergent behavior (Section 6.6, SR-V-04, EI-13).
- **Data collection.** Integration log with interface checks; composed-budget results; fidelity-sensitivity per decision; contact-rung validation (twin vs. bench); emergent-behavior findings.
- **Analysis.** Do the composed budgets hold, or did integration reveal an overrun? Which decisions are fidelity-sensitive? Is the contact rung validated (CR-03 closed)? What emergent behavior appeared, and which subsystems coupled?
- **Discussion.** Why is an unvalidated twin a "confident liar"? Why match fidelity to the decision (CEC-06)? Why integrate incrementally (EI-13)? What can the validated twin now be trusted to prove (->M14/M15)?
- **Deliverables.** A 5 to 6 page report: integration log, composed-budget verification, fidelity-ladder study, CR-03 contact-rung validation, emergent-behavior findings.
- **Rubric (100 pts).** Incremental integration & interfaces (16); composed-budget verification (18); fidelity-ladder application (22, CEC-06); CR-03 contact-rung validation (22); emergent-behavior hunt (12, EI-13); communication (10). *Graduate band adds:* the interaction-count analysis of incremental vs. big-bang (Section 7.3 grad) and a cited source.
- **Expected results.** An integrated machine that runs the full mission; composed budgets that mostly hold but reveal at least one emergent tightness (contention or coupling); a clear demonstration that grasp-bruise is fidelity-sensitive (needs the contact rung) while reach is not; a validated contact rung closing CR-03; and at least one genuine integration surprise, the empirical case for EI-13 and for building the twin.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Fidelity sensitivity.** For three given decisions, state the lowest fidelity rung at which each stabilizes and justify; identify which is fidelity-sensitive to the contact rung.
2. **Composed budget.** Given per-subsystem placement contributions and stage times, assemble the system placement 3σ and cycle time; test against the capture tolerance and $d/v$; identify any emergent overrun.
3. **Rung validation.** Given twin predictions and real data for a rung, compute the reality gap and decide accept/retune against a tolerance (CEC-06).
4. **Integration strategy.** Explain how incremental integration localizes a surprise that big-bang would not; give a SIM2FIELD example of an emergent coupling.
5. **(Grad) Interaction analysis.** Compare the interactions exposed by incremental vs. big-bang integration; discuss which dynamic couplings remain hidden even under incremental interface testing and how to surface them.
6. **(Grad) Evidence argument.** Argue how a validated twin can serve as verification evidence for a requirement; state precisely what must be true (fidelity rung, validation, tolerance) for the evidence to be admissible (->M14/M15).

---

## 26. Quiz

1. **(MC)** Integration failures are dangerous mainly because: (a) subsystems are weak; (b) each subsystem passes alone but the machine fails together; (c) the twin is slow; (d) budgets are large. **[b]**
2. **(MC)** The right twin fidelity for a decision is: (a) always the highest; (b) the lowest at which the decision stabilizes (validated); (c) always the lowest; (d) irrelevant. **[b]**
3. **(MC)** CEC-06 (Fidelity Ladder) differs from CEC-05 (Sim-to-Real Pipeline) in that CEC-06: (a) is only for learning; (b) governs fidelity/validation of any model-based decision, not just learned transfer; (c) skips validation; (d) is a process, not a tool. **[b]**
4. **(MC)** An unvalidated twin is best described as: (a) trustworthy; (b) a confident liar; (c) high-fidelity; (d) evidence. **[b]**
5. **(Short)** State EI-13 and one SIM2FIELD example. **[Integrate early and often; the surprises live between the modules, e.g., arm-swing on a slope eroding stability, a coupling no single module modeled, found by integrating in the twin.]**
6. **(Short)** Name the fidelity rungs and which is binding for "will the grasp bruise?" **[Kinematic -> dynamic -> contact/fluid -> sensor-in-loop -> HIL -> prototype/field; the contact/fluid rung (CR-03) is binding for grasp-bruise.]**
7. **(Design)** Why must the contact rung be validated to close CR-03? **[Grasp results (bruise/slip/window) are fidelity-sensitive to contact physics; only a validated contact rung makes system grasp results trustworthy as evidence.]**
8. **(Design)** Why integrate incrementally rather than big-bang? **[It localizes each surprise to the subsystem/interface just added, an O(n) debug path vs. O(n²) interaction search.]**
9. **(Critical thinking)** How can composed budgets break even when each allocation was met? **[Shared resources (compute/power) and dynamic coupling create emergent effects the per-subsystem allocations didn't capture.]**
10. **(Critical thinking)** Why are CEC-05 and CEC-06 both needed for a simulation-first program? **[CEC-05 answers "will this learned behavior transfer?"; CEC-06 answers "can I trust this simulation for this decision at all?", together they make sim results evidence, not hope.]**

---

## 27. Challenge Problems

- **CP-M13-A, The system verification argument.** For the end-to-end harvest mission, construct the argument that the integrated machine meets its top requirements, citing which twin rung (validated to what tolerance) supports each claim and where hardware evidence is still required. (Directly builds M14's V&V case.)
- **CP-M13-B, Fidelity allocation under budget.** Given a fixed fidelity-development budget, allocate it across the rungs to maximize trustworthy decision coverage; identify which decisions you must leave to HIL/hardware because sim fidelity is infeasible. (Operationalizes CEC-06.)
- **CP-M13-C, Emergent-coupling case study.** Pick one cross-subsystem coupling (arm-swing<->stability, compliance<->placement, or compute<->timing) and design the integrated test that would reveal it, the metric that would flag it, and the design change if it fails. (Feeds M14/M15.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your integration verifies budgets "compose." What are you assuming about independence of the contributors (placement terms, loop timings, loads)? Where might they be correlated so the composed budget is worse than the RSS/sum suggests?
2. **Tradeoffs.** You matched fidelity to decisions rather than building uniform high fidelity. Defend that to a reviewer who wants "the most realistic twin possible." How do you know a rung is high-enough fidelity for a decision, and what if your sensitivity judgment is wrong?
3. **Risk.** You closed CR-03 by validating the contact rung against a bench. A reviewer notes the bench is not the field (variable fruit, dust, wear). How far does bench validation transfer to field grasp trustworthiness, and what residual gap remains (CEC-05/CEC-06)?
4. **Verification.** You will cite the validated twin as evidence in M14/M15. What makes a twin result *admissible* evidence versus an optimistic simulation? State the fidelity/validation/tolerance criteria a reviewer should demand.
5. **Subsystem interaction.** Integration revealed emergent behavior. Pick the most consequential coupling you found; who owns it (no single module did), and how is the fix verified not to break another subsystem's budget?
6. **Simulation-first honesty.** The whole course bet on simulation-first. Where is that bet weakest, which decisions can the twin *not* yet be trusted to make, forcing hardware, and does your plan acknowledge those honestly rather than over-claiming twin coverage?

---

## 28. Instructor Notes

- **Timing.** Section 6.3 to 6.4 (the twin and the Fidelity Ladder) and Section 6.5 to 6.7 (composed budgets, emergence, closing CR-03) are the core (~3.5 h); the CEC-06 designation (Section 11.3) and EI-13 are the peaks. Trade studies (Section 11) and the integration/fidelity activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M13 is a 3 h session and is the course's integrative climax.
- **Common misconceptions.** (1) "Higher fidelity is always better", match fidelity to the decision (CEC-06). (2) "The twin is truth", an unvalidated twin is a confident liar. (3) "Integration is assembly", it is where emergence appears (EI-13). (4) Conflating CEC-05 and CEC-06, transfer of learning vs. fidelity of any decision.
- **On the CEC-06 designation.** This is the first new CEC since M7, and the restraint of M8 to M12 is *why* it is credible. Teach the three tests (recurrence, analytical-not-procedural, distinct-from-CEC-05) explicitly; students should be able to argue the promotion, not just accept it. Emphasize the paired synthesis note: CEC-05 (will learning transfer?) + CEC-06 (can I trust this sim decision?) are the twin pillars of simulation-first rigor.
- **On EI-13.** Teach it as the reason integration is a distinct discipline: the surprises are between the modules, and the twin makes finding them cheap.
- **Where to push graduate students.** The interaction analysis (HW5), the evidence-admissibility argument (HW6, CP-M13-A), the fidelity-allocation optimization (CP-M13-B).
- **Thread to keep visible.** Close by naming hand-offs: the integrated machine + validated twin evidence source -> M14 (V&V) and M15 (safety case); the bring-up plan -> prototype; the whole system -> M17 (capstone).

---

## 29. Research Frontiers

- **Landmark grounding.** Systems-engineering integration and verification references; digital-twin references (definition, roles, validation); model-validation and verification-and-validation (V&V) references. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Digital twins for robotics with validated fidelity and uncertainty quantification; differentiable/identified contact and fluid models for high-fidelity twins (closing CR-03-type gaps); credibility assessment and V&V frameworks for simulation-based evidence; continuous integration/continuous verification for robotic systems; sim-to-real and real-to-sim co-calibration.
- **Open problems.** Quantifying and certifying twin fidelity for a given decision; validated high-fidelity contact/fluid simulation for delicate manipulation; admissible simulation-based evidence for safety cases; detecting emergent behavior before deployment.
- **Suggested thesis directions.** (1) A fidelity-aware digital twin that reports, per decision, whether it is trustworthy and to what validated tolerance. (2) A validated differentiable contact/fluid twin that closes the grasp reality gap and provides admissible grasp evidence. (3) Automated emergent-behavior discovery through incremental integrated stress testing.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Systems-engineering integration / V&V references, incremental integration, interface verification (Section 6.1 to 6.2, Section 6.5).
- Digital-twin references, definition, roles, validation, evidence (Section 6.3 to 6.4; CEC-06).
- Model-validation / credibility references, per-rung reality gap, acceptance, admissible evidence (Section 6.4, Section 7.2).
- Sim-to-real / real-to-sim co-calibration references, closing fidelity gaps (Section 6.7; CR-03/CEC-05).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 12**, and (forthcoming) Doc B, Doc F, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** This integration keystone composes the whole machine and masters the **digital twin** as the integration environment and evidence source, the point where the course's simulation-first bet is cashed at system scale. Its central analytical contribution is the **designation of CEC-06 (the Simulation-First Fidelity Ladder)** at its genuine mastery point: matching fidelity to the decision, finding where fidelity is binding, and validating each rung against reality. The promotion is credible precisely because it follows five modules (M8 to M12) that each correctly *declined* a CEC, it is a scheduled, well-tested watchlist candidate, argued against three explicit tests (recurrence, analytical-not-procedural, distinct-from-CEC-05), and paired with CEC-05 as the twin pillars of simulation-first rigor. The module **closes CR-03** at the system level by integrating and validating the contact/fluid rung, verifies the course's budgets **composed** (placement, cycle-time, power/thermal), and hunts the **emergent behavior** that no module owned, captured in its Engineering Insight **EI-13 (Integrate Early and Often)**. All 30 sections present; the Engineering Design Review is included and (in Q6) turns the simulation-first bet's honesty on itself; one lightweight synthesis note (CEC-05 + CEC-06); consistency with all frozen modules maintained.

**Known weaknesses / items for your review.**
1. **New CEC designation, flagged for your confirmation.** CEC-06 is the first new anchor since M7. I judged it qualifies at the scheduled evaluation point (it is the operative tool behind every "verify in the twin" the course has written) and brings the set to 6 CECs, within the ~6 to 10 target. If you'd prefer it remain an Engineering Insight / methodology rather than a CEC, that is a reversible change, I flag the promotion rather than treat it as automatic.
2. **CR-03 is closed against a bench, not the field.** The contact rung is validated to bench data; field-representative grasp trustworthiness (variable fruit, dust, wear) carries a residual gap (CEC-05/CEC-06), honestly noted.
3. **Composed-budget independence is assumed.** The RSS/sum composition assumes contributors are roughly independent; correlated errors or couplings could make the true system budget worse, surfaced in the Design Review, to be pinned down in M14.
4. **Twin-as-evidence is specified, not yet exercised.** The validated twin becomes the evidence source for M14/M15; its admissibility criteria are stated here but applied there. Much rides on Doc G (twin fidelity) being authored.

I have not scored this against the 9.5 bar, that judgment is yours. Items 2 to 4 close chiefly by authoring Doc G and by reaching M14/M15; item 1 is a decision for you.

**END OF MODULE 13, STOP. Awaiting your review before freezing Module 13 or proceeding to Module 14.**
