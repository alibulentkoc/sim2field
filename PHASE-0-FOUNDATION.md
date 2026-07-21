# PHASE-0-FOUNDATION.md
## SIM2FIELD Educational Platform: Engineering & Documentation Foundation

**Document class:** Governing / authoritative-architecture
**Status:** Draft for approval (Phase 0 deliverable)
**Scope:** Establishes the baseline assessment, conflict resolutions, risk posture, gap priorities, and the architecture of the ten source-of-truth documents that every future module, lab, simulation, and asset will reference.
**Case machine:** SIM2FIELD, autonomous drive-over watermelon harvester on the farm-ng Amiga platform, hybrid actuation (electric positioning + fluid-powered compliant gripping), validated simulation-first.

> **Convention used throughout.** Perishable specifics, edge-device prices, current model versions (e.g. the latest YOLO release), specific part numbers, are written as engineering placeholders tagged **[VERIFY@PUB]** with an approximate early-2026 value where one is useful. This keeps the foundation rigorous without asserting figures that will silently expire.

---

## 1. Executive Summary

**Overall assessment.** SIM2FIELD enters formal curriculum development from an unusually strong position for an educational project: it is anchored to a *single, coherent, physically-grounded case machine* rather than a survey of disconnected robots, and it already owns three assets most programs never build, (1) a **working browser digital twin** with real closed-form kinematics, singularity metrics, and a mission state machine; (2) a **costed reference design** (≈$50k prototype BOM with a matching ≈$650k research-grant financial model); and (3) a **deployed, functioning HTML platform** with an embedded live simulation and interactive assessment. The pedagogical thesis, teach engineering by building one robot, following the robot's own signal-to-action data path, is sound and defensible against the graduate-program benchmark.

**Readiness for curriculum development.** **Not yet, by design.** The project is ready to author its *foundation*, but three preconditions must be closed before Module 1 is written: (a) the actuator architecture must be formally re-baselined to the approved **hybrid** (electric positioning + fluid-powered compliant gripping), because the current design-spec text explicitly removed fluid power and the twin models no fluid dynamics; (b) a **System Design Specification** must exist as the single referenced baseline (today the "spec" is a teaching artifact, not a controlled document); and (c) the **Simulation & Digital-Twin Architecture** must define the fidelity the simulation-first doctrine now demands of the fluid-power subsystem. These are scoped in Section 6 and Section 10.

**Major strengths.**
- Single-machine spine with a genuine, inspectable digital twin, rare and high-value.
- Design decisions already carry quantitative justification (DOF reduction, transmission-angle singularity handling, occlusion-gated perception, no-cloud edge boundary).
- A costed BOM and a funding-grade financial model give the manufacturing/techno-economic thread real material.
- A deployed platform means content has a definite, testable delivery target.

**Highest-priority risks** (full register in Section 5).
- **R-01 (High):** Fluid-power pillar is not yet represented in the machine baseline or the twin -> curriculum could be written against an actuation story the reference design contradicts.
- **R-02 (High):** No controlled source-of-truth documents exist yet -> modules risk referencing shifting or personal artifacts, creating downstream inconsistency across a multi-month build.
- **R-03 (Med-High):** Perishable technical specifics (edge HW, model versions) will age -> dated material if not systematically flagged and centralized.
- **R-04 (Med-High):** Scope tension between the deployed 7-module short course and the proposed 16-module graduate architecture -> ambiguous target unless resolved before authoring.

**Recommended next actions** (minimum critical path, expanded in Section 9, Section 10).
1. Approve this foundation (Phase 0).
2. Author the **System Design Specification (Doc B)** re-baselined to hybrid actuation, the keystone every module cites.
3. Author the **Simulation & Digital-Twin Architecture (Doc G)** including the required fluid-power model fidelity.
4. Lock the **Curriculum Standards (Doc I)** and **Visual & Media Standards (Doc J)** so Module 1 is authored against fixed templates.
5. Only then begin Phase 3 (Module 1).

---

## 2. Baseline Inventory

Each existing artifact is assessed against the graduate-rigor bar and the source-of-truth role it must eventually play. Maturity is scored **L1 (concept)** -> **L2 (teaching-grade)** -> **L3 (controlled/authoritative)**.

### 2.1 Design Specification (live-site `spec-design.html`)
- **Purpose.** States measurable system/subsystem requirements (functional / performance / constraint) for the harvester.
- **Maturity.** **L2.** Well-formed, verifiable requirements with a verification-method table, but explicitly framed as a *teaching artifact*, not a controlled baseline.
- **Strengths.** Requirements are testable and typed; verification methods named; already covers perception error, cycle time, damage rate, no-cloud constraint, singularity/collision bounds.
- **Weaknesses.** No configuration control (no rev, owner, change log); actuation described as electric-only, now superseded by hybrid; no fluid-power requirements; no traceability IDs linking requirements to subsystems or tests.
- **Missing.** Fluid-power/grasp-compliance requirements; power/thermal budget requirements for a compressor/pump; requirement-to-verification traceability matrix; margin and design-factor policy.
- **Recommended improvements.** Promote to controlled **Doc B**; add hybrid actuation requirements; introduce requirement IDs and a traceability matrix; add a margins/reserves policy.

### 2.2 Bill of Materials (live-site `spec-bom.html`)
- **Purpose.** Subsystem-organized costed hardware list; anchor for cost/manufacturability teaching.
- **Maturity.** **L2.** Realistic, subsystem-grouped, sums to a stated cap; taught as a decision record rather than a shopping list.
- **Strengths.** Cost concentration and single-point-of-failure reasoning already present; COTS-vs-fabricated distinction made.
- **Weaknesses.** No fluid-power line items (compressor/receiver, valves, regulators, compliant actuator, pressure sensors); prices perishable and not centrally flagged; no sourcing/lead-time or dual-source column; no mass or power roll-up.
- **Missing.** Fluid subsystem BOM; mass budget; power budget cross-reference; lead-time/risk annotations.
- **Recommended improvements.** Add the fluid-power subsystem; add mass and power columns feeding the system budgets; tag every perishable price **[VERIFY@PUB]**; cross-reference each line to a requirement ID.

### 2.3 System Architecture (live-site `spec-architecture.html`)
- **Purpose.** Reference hardware + software architecture: sensors, compute planes, buses, ROS 2 node graph, real-time boundary, supervisory state machine, software stack.
- **Maturity.** **L2.** Strong conceptual architecture; the two-compute-plane and real-time-boundary decisions are graduate-quality.
- **Strengths.** CAN/Ethernet separation, safety monitor as an independent process, mission FSM, and stack recommendations are all sound and well-argued.
- **Weaknesses.** Conflates hardware and software architectures that should become two controlled documents (Doc C and Doc D); no fluid-power control plane; no electrical/power architecture; no interface-control detail (ICDs); AI and edge treated inline rather than as their own architectures (Docs E, F).
- **Missing.** Fluid-power control loop and its placement relative to the real-time boundary; electrical/power distribution architecture; formal interface definitions.
- **Recommended improvements.** Split into Doc C (Hardware) and Doc D (Software); extract AI (Doc E), Edge (Doc F); add the fluid control plane and its timing.

### 2.4 HTML Educational Platform (deployed, `alibulentkoc.github.io/watermelon/`)
- **Purpose.** Delivery vehicle: landing page, module pages, embedded live simulation, interactive quizzes, spec/reference pages.
- **Maturity.** **L2->L3 as a shell.** Deployed and functioning; navigation and templates are stable and are to be preserved (per project rule).
- **Strengths.** Live, embeds the simulation inline, has a working auto-graded quiz mechanism, consistent templates, a fixed, testable content target.
- **Weaknesses.** Current *content* is short-course depth, below the graduate bar; page templates' capacity for 30-section modules (figures, widgets, long math) is unproven; no defined content-injection contract (how authored Markdown maps into templates).
- **Missing.** A documented content model (which Markdown structures render where); math/diagram rendering policy (e.g. KaTeX/MathJax, SVG figure conventions).
- **Recommended improvements.** Capture the **content-injection contract** in Doc J (Visual & Media Standards); confirm template capacity for the heaviest module before authoring.

### 2.5 Digital Twin / Simulation (`demo.html`, Three.js)
- **Purpose.** Interactive kinematic/behavioral simulation of the harvester; embedded teaching and design sandbox.
- **Maturity.** **L2.** Real closed-form parallel-mechanism kinematics, transmission-angle singularity metric, keep-out/stroke constraints, mission FSM, occlusion-gated perception, adjustable camera, genuinely more than an animation.
- **Strengths.** Physically grounded; already the connective tissue across topics; runs in-browser with no install.
- **Weaknesses.** Geometric/kinematic only, **no dynamics, no contact mechanics, no fluid-power model**; single-fidelity (no SIL/HIL path defined); not parameterized from a controlled spec (constants live in code, not traced to Doc B).
- **Missing.** Lumped-parameter fluid model (pressure/flow/valve/actuator-force) required by simulation-first doctrine for the fluid subsystem; contact/grasp dynamics; a defined fidelity ladder (kinematic -> dynamic -> SIL -> HIL).
- **Recommended improvements.** Define the fidelity ladder in Doc G; parameterize the twin from Doc B; add the fluid-power and grasp-contact models needed to teach the compliant gripper simulation-first.

### 2.6 Existing Course Content (7-module Markdown)
- **Purpose.** Current teaching material feeding the deployed site.
- **Maturity.** **L2.** Coherent short course on the signal-to-action spine; sound but not to the 30-section graduate template.
- **Strengths.** Correct, specific to the machine, already structured and cross-linked.
- **Weaknesses.** Depth, math, trade studies, V&V, and fluid power below target; no simulation-first framing per module; not mapped to student-outcome/ABET IDs.
- **Missing.** Fluid-power content entirely; digital-twin activity per module; research frontiers; formal references.
- **Recommended improvements.** Treat as *survey-track* source; re-author to the graduate architecture (Phase 1's 16-module set) under the 30-section template.

### 2.7 Supporting Documentation (grant proposal `SIM2FIELD` draft, push/README/repo guides)
- **Purpose.** Funding narrative and repository operational docs.
- **Maturity.** **L2.** The proposal already carries the technical narrative (five AI threads, DOF reduction, sweep-and-segment perception) and a verified financial model.
- **Strengths.** Provides ready material for the manufacturing/cost and research-frontiers threads; financial model is internally consistent.
- **Weaknesses.** Proposal actuation language predates the hybrid decision; repo docs are operational, not authoritative-engineering.
- **Recommended improvements.** Harvest the proposal's techno-economic and frontier content into Docs A/E/F; reconcile actuation language with the hybrid baseline.

---

## 3. Coverage Matrix

Existing project vs. the intended authoritative documentation set. **Status:** Complete / Partial / Missing (assessed as *authoritative* documents, not teaching artifacts). **Priority:** P0 (blocks Module 1) -> P3 (later). **Dependencies** name the documents each relies on.

| ID | Authoritative Document | Status | Nearest existing source | Priority | Depends on |
|----|------------------------|--------|-------------------------|----------|-----------|
| A | Project Design Handbook | Missing | Scattered across README/proposal | P1 | B, I, J |
| B | System Design Specification | **Partial** | `spec-design.html` (L2) | **P0** |, (keystone) |
| C | Hardware Architecture | **Partial** | `spec-architecture.html` (HW parts) | **P0** | B |
| D | Software Architecture | **Partial** | `spec-architecture.html` (SW parts) | P1 | B, C |
| E | AI Architecture | Partial | Proposal AI threads; course M2 to M3 | P1 | B, D, F |
| F | Edge Computing Architecture | Partial | Course M3; architecture page | P1 | B, C, D, E |
| G | Simulation & Digital-Twin Architecture | **Partial** | `demo.html` + course refs | **P0** | B, C, E |
| H | Engineering Standards Manual | Missing | Implicit conventions only | P1 |, |
| I | Curriculum Standards Manual | **Partial** | Module template (v3.0) + course | **P0** | H, J |
| J | Visual & Media Standards Manual | Missing | HTML shell conventions (implicit) | **P0** |, |

**Reading:** four documents are **P0** (B, C-subset, G, I, J) and gate Module 1. Nothing is yet *Complete* at the authoritative (L3) level, every "Partial" is a promotable L2 teaching artifact, which is good news: we are refactoring and controlling existing material, not inventing from nothing.

---

## 4. Conflict Register

Every substantive inconsistency between machine spec, curriculum spec, educational philosophy, and prior engineering decisions. Each carries a **final decision**; where a decision is already agreed it is recorded as **RESOLVED**.

### CR-01: Actuator architecture: electric-only baseline vs. fluid-power pillar **[RESOLVED]**
- **Description.** Master Prompt v3.0 designates Fluid-Powered Physical AI a defining curriculum pillar. The current design spec explicitly states the manipulator uses *electric* linear actuators "in place of the simulated hydraulics."
- **Root cause.** During earlier design work the arm was deliberately re-baselined electric for field-maintenance simplicity; v3.0 later elevated fluid power to a curriculum-defining role. The two baselines were set at different times for different objectives.
- **Engineering impact.** Determines actuation, power/thermal budget, plumbing, control loops, safety (stored fluid energy), mass, and cost across the whole machine.
- **Educational impact.** Determines whether fluid power is a genuine, machine-embedded thread or a bolt-on, the difference between meeting and missing v3.0's intent.
- **Recommended resolution -> FINAL DECISION: Hybrid Architecture.**
  - **Electric positioning**, the parallel two-cylinder mechanism retains electric linear actuators for gripper-node positioning in the transverse plane (preserves the validated kinematic baseline and twin).
  - **Fluid-powered compliant gripping**, the end-effector grasp is fluid-driven, making compliance, pressure/force regulation, valve dynamics, and soft manipulation first-class exactly where they carry the most technical and pedagogical value: contact with a heavy, bruise-prone fruit.
  - **Simulation-first validation**, the fluid subsystem is modeled and validated in the twin before any hardware claim.
  - *Door left open* to a fuller fluid-powered architecture (option a) in a later revision if desired.

### CR-02: Design-spec text contradicts the hybrid decision
- **Description.** `spec-design.html` / MAN-series requirements describe electric actuation and a "compliant paddle gripper" without a fluid circuit.
- **Root cause.** Spec predates CR-01's resolution.
- **Engineering impact.** If left unamended, the keystone document contradicts the machine the curriculum teaches.
- **Educational impact.** Students would cite a baseline inconsistent with the fluid-power modules.
- **Recommended resolution / decision.** Re-baseline in **Doc B**: retain electric positioning requirements; add a fluid-power gripping requirement set (grasp-force range, compliance/back-drivability, pressure-control bandwidth, food-safe media, stored-energy safety). Amend the gripper description to a **fluid-actuated compliant gripper** with tactile/load feedback. **Owner: Doc B author. Milestone: before Module 1.**

### CR-03: Digital twin has no fluid-power (or contact) fidelity vs. simulation-first doctrine
- **Description.** v3.0 mandates Simulation -> Twin -> Hardware -> Field for *every* subsystem; the twin is currently kinematic-only.
- **Root cause.** Twin was built to teach kinematics/mission logic, before fluid power and simulation-first became pillars.
- **Engineering impact.** The most novel subsystem (fluid compliant grasp) cannot currently be validated simulation-first.
- **Educational impact.** Fluid-power modules would lack the twin activity the doctrine requires.
- **Recommended resolution / decision.** Define a **fidelity ladder** in **Doc G** (kinematic -> dynamic/contact -> fluid lumped-parameter SIL -> HIL) and specify the minimum fluid model (pressure dynamics, valve flow, actuator force-vs-pressure, compliance) needed before the gripper modules. **Milestone: Doc G before Module 1; fluid model implemented before the gripper module.**

### CR-04: Scope: deployed 7-module short course vs. proposed 16-module graduate architecture
- **Description.** The live site is a ~28-hour short course; Phase-1 architecture proposes 16 modules + capstone at graduate depth.
- **Root cause.** Project ambition rose from "short course" to "flagship graduate program" across prompt revisions.
- **Engineering / educational impact.** Ambiguous target module count, depth, and calendar; risk of authoring to the wrong bar.
- **Recommended resolution / decision.** Adopt the **16-module graduate architecture as the master**, with the existing 7-module set retained as a derived **survey track**. Confirm at Phase 2 approval. Compression options remain available and are dependency-safe. **Decision pending your Phase-2 approval; recorded here so authoring does not start against an ambiguous scope.**

### CR-05: "No cloud in the control loop" vs. cloud/GPU for training & synthetic data
- **Description.** The edge doctrine forbids cloud in the *control loop*; the AI thread requires substantial off-robot GPU for training, synthetic-data generation, and model optimization.
- **Root cause.** Two different lifecycle phases (runtime vs. development) share the word "cloud."
- **Engineering impact.** Minimal if the boundary is drawn explicitly; severe confusion if not.
- **Educational impact.** Students must learn *where* the runtime/development boundary sits.
- **Recommended resolution / decision.** Formalize a **runtime-vs-development boundary** in **Doc F (Edge)** and **Doc E (AI)**: cloud/off-robot permitted for training, synthetic data, and optimization; **prohibited in the real-time control loop**; opportunistic telemetry sync allowed. Not a true conflict, a definition to be stated once, authoritatively. **RESOLVED as a documentation action.**

### CR-06: BOM and budgets omit the fluid-power subsystem
- **Description.** The $50k BOM has no fluid components; mass/power budgets don't exist yet.
- **Root cause.** Predates CR-01.
- **Engineering impact.** Cost, mass, and power roll-ups are currently wrong for the hybrid machine.
- **Educational impact.** Manufacturing/techno-economic modules would teach an incomplete cost model.
- **Recommended resolution / decision.** Add a fluid-power subsystem to the BOM (compressor/receiver or pump, accumulator, regulator, proportional/directional valves, compliant actuator, pressure/force sensors, filtration); introduce **mass** and **power** budgets that the BOM feeds. Rebalance within or explicitly re-cap the prototype budget. **Owner: Doc B/C. Milestone: before the manufacturing/cost module.**

### CR-07: Perishable specifics stated as if permanent
- **Description.** Edge-device prices, model versions, and part numbers appear as fixed facts in teaching artifacts.
- **Root cause.** Normal drift; no central currency policy.
- **Impact.** Dated material; loss of credibility.
- **Recommended resolution / decision.** Adopt the **[VERIFY@PUB]** convention platform-wide, centralized in **Doc H (Engineering Standards)**; perishable values live in one referenced table, not scattered in prose. **RESOLVED as a standards action.**

---

## 5. Engineering Risk Register

Ranked by **Priority = Probability × Impact** (each 1 to 5; Priority bands: ≥16 Critical, 9 to 15 High, 4 to 8 Medium, ≤3 Low). Mitigations are actionable, not aspirational.

| ID | Risk | Type | Prob | Impact | Priority | Mitigation |
|----|------|------|:---:|:---:|:---:|-----------|
| R-01 | Fluid-power pillar not reflected in machine baseline/twin; curriculum authored against contradicted actuation | Technical | 4 | 5 | **20 Crit** | Close CR-01/02/03 before Module 1: re-baseline Doc B, define fluid model in Doc G |
| R-02 | No controlled source-of-truth docs -> cross-module inconsistency over a multi-month build | Documentation | 4 | 4 | **16 Crit** | Author P0 docs (B, C-subset, G, I, J) and freeze; all modules cite by ID |
| R-03 | Perishable specifics age (edge HW, model versions, prices) | Documentation | 5 | 3 | **15 High** | [VERIFY@PUB] convention + single perishable-values table in Doc H |
| R-04 | Scope ambiguity (7 vs 16 modules) -> authoring to wrong depth | Educational | 3 | 4 | **12 High** | Resolve CR-04 at Phase-2 approval; master = 16, survey track = 7 |
| R-05 | Twin fidelity gap (no dynamics/contact/fluid) blocks simulation-first for gripper | Technical | 4 | 4 | **16 Crit** | Fidelity ladder in Doc G; implement fluid + contact model before gripper module |
| R-06 | HTML template capacity unproven for 30-section modules (heavy math/figures/widgets) | Integration | 3 | 4 | **12 High** | Prove heaviest-module render against shell before authoring; capture content-injection contract in Doc J |
| R-07 | Sim-to-real gap: policies/models tuned in twin fail in field | Technical | 4 | 3 | **12 High** | Domain randomization + real held-out validation policy stated in Doc E/G |
| R-08 | Stored-energy hazard from pneumatic/hydraulic system near people & food | Technical/Safety | 3 | 5 | **15 High** | Functional-safety requirements in Doc B; hazard analysis authored in safety module; food-safe media mandated |
| R-09 | Single-maintainer documentation (bus factor = 1) | Maintenance | 4 | 3 | **12 High** | Governance + change-control in Doc A; templates in Doc I/J make contributions reproducible |
| R-10 | Content-shell coupling: authored Markdown doesn't map cleanly into fixed templates | Integration | 3 | 3 | **9 High** | Define content model + rebuild pipeline in Doc J; keep source Markdown as build input |
| R-11 | Fluid-power module math/complexity exceeds audience prerequisites | Educational | 3 | 3 | **9 High** | Prerequisite primers; tiered depth (UG core vs grad extension) per Doc I |
| R-12 | AI/tool-assisted student work obscures genuine understanding | Educational | 3 | 3 | **9 High** | Live design-review defense; rubric rewards quantitative defense (Doc I) |
| R-13 | Scope creep across a multi-month build; never reaching Module N | Educational/PM | 4 | 3 | **12 High** | One-module-at-a-time workflow with explicit STOP gates; roadmap milestones (Section 9) |
| R-14 | Long-term link/version rot (CDN three.js, external refs) in deployed platform | Maintenance | 3 | 2 | **6 Med** | Pin versions; vendor-neutral references in Doc H; periodic audit |

**Posture summary.** The three Critical risks (R-01, R-02, R-05) are all *foundation* risks, they are retired precisely by completing and freezing the P0 documents this phase defines. That is the strongest possible argument for doing Phase 0 before any module.

---

## 6. Gap Analysis

Highest-value missing engineering information required before curriculum development, ordered by the ten prescribed categories. Each gap notes **what is missing**, **why it blocks**, and the **document that closes it**.

1. **System definition.** *Missing:* a controlled requirements baseline with IDs, traceability, margins policy, and the hybrid actuation requirement set. *Blocks:* every module cites the system; without a frozen baseline all citations drift. *Closes in:* **Doc B (P0).**
2. **Hardware.** *Missing:* fluid-power subsystem definition (source, storage, regulation, valves, compliant actuator, sensing, filtration), electrical/power distribution, mass & power budgets, interface definitions. *Blocks:* mechatronics, integration, power, manufacturing modules. *Closes in:* **Doc C (P0 subset), Doc B budgets.**
3. **Software.** *Missing:* controlled ROS 2 architecture with the fluid-control node, real-time boundary placement of the pressure/force loop, ICDs, CI/CD policy. *Blocks:* integration and controls modules. *Closes in:* **Doc D (P1).**
4. **AI.** *Missing:* formal AI architecture, model roles (detection, ripeness, grasp policy), data & synthetic-data pipeline, training/validation protocol, the runtime/development boundary. *Blocks:* perception and decision/grasp modules. *Closes in:* **Doc E (P1).**
5. **Edge computing.** *Missing:* device selection criteria and budgets (latency/power/thermal), optimization/containerization pipeline, no-cloud control-loop boundary stated authoritatively. *Blocks:* edge module and any on-robot inference claim. *Closes in:* **Doc F (P1).**
6. **Digital twin.** *Missing:* fidelity ladder, fluid-power & contact models, parameterization from Doc B, SIL/HIL path. *Blocks:* simulation-first delivery of every subsystem, gripper especially. *Closes in:* **Doc G (P0).**
7. **Verification & validation.** *Missing:* staged test architecture with entry gates, FMEA method, reliability targets, field-metric definitions. *Blocks:* V&V module and the credibility of every performance claim. *Closes in:* **Doc B (V&V requirements) + Doc H (methods).**
8. **Safety.** *Missing:* functional-safety requirements, stored-fluid-energy hazard treatment, food-safety of contact surfaces/media, standards mapping, interlock architecture. *Blocks:* safety module and any field-deployment claim. *Closes in:* **Doc B (safety reqs) + Doc H (standards).**
9. **Manufacturing.** *Missing:* DFM guidance, complete costed BOM incl. fluid subsystem, mass budget, techno-economic model. *Blocks:* manufacturing/cost/sustainability module. *Closes in:* **Doc B/C (BOM, budgets) + Doc A (handbook context).**
10. **Educational assets.** *Missing:* content-injection contract (Markdown->template), math/figure/widget rendering policy, module/lab/quiz templates locked to the 30-section standard, visual identity spec. *Blocks:* authoring any module that renders correctly in the shell. *Closes in:* **Doc I (curriculum) + Doc J (visual/media), both P0.**

**Critical-path gaps (must close before Module 1):** #1, #2 (subset), #6, #10 -> Docs **B, C(subset), G, I, J**.

---

## 7. Authoritative Document Architecture

Section hierarchy (headings + brief descriptions only) for each of the ten documents. **These are architectures, not the documents.** Lengths and asset counts are planning estimates.

> **Global conventions (apply to all ten).** Each document opens with a control block (ID, revision, owner, approval, change log), a purpose/scope/audience statement, a definitions/acronyms list, and a references section; and closes with revision history. Perishable data is centralized (Doc H) and referenced, never inlined.

---

### A. Project Design Handbook
- **Purpose.** The umbrella narrative and governance document that orients any newcomer to SIM2FIELD and points to the other nine as controlled references.
- **Audience.** Faculty, contributors, students (orientation), external adopters.
- **Dependencies.** References B-J; governs none technically but binds all editorially.
- **Major sections.**
  1. Project vision, thesis (one robot, signal-to-action), and the fluid-powered Physical AI framing.
  2. The SIM2FIELD machine at a glance (system portrait, hybrid actuation story).
  3. Documentation ecosystem & how to navigate the ten documents.
  4. Governance: ownership, change control, review cadence, versioning/tagging.
  5. Contribution workflow (authoring -> review -> integration into the HTML shell).
  6. Roadmap & release strategy (private -> public).
  7. Glossary pointer and document index.
- **Estimated length.** 15 to 25 pp. **Diagrams.** System portrait, documentation-dependency map, governance flow. **Tables.** Document index; roles/responsibilities. **Appendices.** Change-control template; contribution checklist.

### B. System Design Specification *(keystone, P0)*
- **Purpose.** The single controlled requirements baseline every module cites; defines *what the system must do and how well*, including hybrid actuation.
- **Audience.** All engineers/authors; the reference for all V&V.
- **Dependencies.** Source for C-G; consumes H (standards, margins).
- **Major sections.**
  1. Operating context & concept of operations (field, crop, ConOps, mission).
  2. Stakeholder needs -> system requirements (with IDs).
  3. Functional architecture & functional decomposition.
  4. Performance requirements (harvest rate, cycle time, damage rate, localization error, autonomy).
  5. **Actuation requirements, hybrid:** electric positioning; **fluid-powered compliant gripping** (grasp-force range, compliance/back-drivability, pressure-control bandwidth, food-safe media, stored-energy limits).
  6. Interface requirements (mechanical, electrical, data, fluid).
  7. Environmental, safety, food-safety, and regulatory constraints.
  8. Budgets & margins policy (mass, power, thermal, cost, with reserves).
  9. Verification & validation requirements (method per requirement).
  10. Requirement-to-verification traceability matrix.
- **Estimated length.** 40 to 70 pp. **Diagrams.** ConOps, functional block diagram, interface diagram, budget roll-ups. **Tables.** Requirements register; traceability matrix; budget tables. **Appendices.** Requirement-writing style; margin policy; acronym list.

### C. Hardware Architecture *(P0 subset: mechanical + fluid + electrical)*
- **Purpose.** Defines the physical machine: structure, mechanism, **fluid-power subsystem**, electrical/power distribution, sensing hardware, and their interfaces.
- **Audience.** Mechanical, mechatronics, electrical engineers; integration and manufacturing authors.
- **Dependencies.** Derives from B; feeds D, F, G, and the BOM.
- **Major sections.**
  1. Platform & chassis (Amiga drive-over, adjustable stance).
  2. Manipulator mechanism (parallel two-cylinder, electric positioning), geometry, workspace, singularity envelope.
  3. **Fluid-power subsystem**, source (compressor/receiver or pump), storage/accumulation, regulation, proportional/directional valves, compliant actuator, filtration, sensing; P&ID; stored-energy safety.
  4. End-effector & compliant gripper (fluid-actuated), mechanical interface to the mechanism.
  5. Sensing hardware (stereo, NIR, LiDAR, GNSS/IMU, tactile/load), mounting, FOV, calibration references.
  6. Electrical & power distribution, architecture, fusing, EMI, grounding.
  7. Interface control (mechanical/electrical/fluid), ICDs.
  8. Mass & power budgets (feed B).
- **Estimated length.** 45 to 70 pp. **Diagrams.** Exploded assembly, mechanism FBD, **fluid P&ID**, electrical one-line, sensor-placement layout. **Tables.** Component register; interface matrix; mass/power roll-ups. **Appendices.** Datasheet index [VERIFY@PUB]; calibration procedures pointer.

### D. Software Architecture *(P1)*
- **Purpose.** Defines the on-robot software: ROS 2 graph, real-time boundary, the fluid-control node, buses, supervisory logic, and DevOps.
- **Audience.** Software, controls, integration engineers.
- **Dependencies.** Derives from B, C; feeds E, F, G integration.
- **Major sections.**
  1. Architecture principles (real-time vs best-effort planes; safety monitor independence).
  2. ROS 2 node/topic/service graph (incl. perception, localization, **grasp/pressure-force control**, drive, safety).
  3. Real-time boundary & scheduling; determinism.
  4. Bus architecture (CAN control plane; Ethernet perception plane) & message/ICD summary.
  5. Supervisory state machine (mission FSM) & guards.
  6. Fluid-control software (pressure/force loop, valve command, fault handling) and its placement.
  7. DevOps: build, containerization, CI/CD, simulation-in-the-loop hooks.
  8. Logging, telemetry, opportunistic sync.
- **Estimated length.** 40 to 60 pp. **Diagrams.** ROS graph, real-time boundary, state diagram, sequence/timing diagrams. **Tables.** Node/topic registry; QoS profiles. **Appendices.** Message/ICD catalog; coding standards pointer.

### E. AI Architecture *(P1)*
- **Purpose.** Defines model roles, data lifecycle, training/validation, and the runtime/development boundary for all learned components.
- **Audience.** AI/ML, CV, edge engineers.
- **Dependencies.** Derives from B; couples to D, F, G.
- **Major sections.**
  1. AI system overview & model inventory (detection, ripeness, segmentation, **grasp policy**).
  2. Data architecture, real capture, labeling, **synthetic-data pipeline** (diffusion augmentation, NeRF/Gaussian-splat reconstruction).
  3. Perception models, architecture choices (YOLO-family [VERIFY@PUB], ViT/VLM), metrics.
  4. Sensor fusion & 3-D localization models.
  5. **Grasp-learning**, DRL policy, tactile/force inputs, domain randomization, rule-based safety fallback.
  6. Training, evaluation & held-out validation protocol; reproducibility.
  7. Runtime/development boundary (no cloud in control loop; cloud for training/optimization).
  8. Model lifecycle, versioning, drift monitoring.
- **Estimated length.** 40 to 60 pp. **Diagrams.** Model-inventory map, data-pipeline flow, training/deployment flow. **Tables.** Model registry; dataset registry; metric definitions. **Appendices.** Reward-design notes; augmentation catalog.

### F. Edge Computing Architecture *(P1)*
- **Purpose.** Defines on-robot compute, optimization, containerization, and the budgets that bound them.
- **Audience.** Edge, embedded, software engineers.
- **Dependencies.** Derives from B, C, D, E.
- **Major sections.**
  1. Edge principles & the no-cloud control-loop boundary.
  2. Compute topology (edge module + platform Brain; role split).
  3. Device selection criteria & candidates (Jetson/Coral/Intel classes [VERIFY@PUB]).
  4. Inference optimization (quantization, pruning, compilation) & accuracy-revalidation policy.
  5. Containerization & deployment pipeline (Docker, image lifecycle).
  6. Latency / throughput / power / thermal budgets & reconciliation with cycle-time.
  7. Failure handling, watchdogs, degraded modes.
- **Estimated length.** 30 to 45 pp. **Diagrams.** Compute topology, deployment pipeline, budget waterfalls. **Tables.** Device comparison [VERIFY@PUB]; budget tables. **Appendices.** Benchmark method; optimization checklist.

### G. Simulation & Digital-Twin Architecture *(P0)*
- **Purpose.** Defines the simulation-first spine: fidelity ladder, models (kinematic -> dynamic/contact -> **fluid lumped-parameter** -> SIL/HIL), parameterization from B, and validation workflow.
- **Audience.** Twin engineers, all module authors (each module has a twin activity).
- **Dependencies.** Derives from B, C, E; governs every module's simulation activity.
- **Major sections.**
  1. Simulation-first doctrine & the Sim -> Twin -> HW -> Field pipeline.
  2. Fidelity ladder & when each tier is required.
  3. Kinematic/behavioral model (current browser twin), scope & parameterization from Doc B.
  4. Dynamic & contact model (grasp mechanics, fruit contact/damage).
  5. **Fluid-power model** (pressure/flow, valve dynamics, actuator force-vs-pressure, compliance), the minimum for gripper simulation-first.
  6. Virtual sensors & synthetic-data generation hooks (couples to E).
  7. SIL/HIL architecture & digital commissioning; parameter estimation.
  8. Validation: twin-vs-hardware correlation, regression-test-bed role.
- **Estimated length.** 35 to 55 pp. **Diagrams.** Fidelity ladder, twin architecture, fluid model schematic, SIL/HIL loop. **Tables.** Model-fidelity matrix; parameter source table (-> Doc B). **Appendices.** Twin parameter list; validation protocol.

### H. Engineering Standards Manual *(P1)*
- **Purpose.** The conventions every document and module obey: units, symbols, margins, safety/standards mapping, and the centralized perishable-values policy.
- **Audience.** All authors.
- **Dependencies.** Referenced by all; depends on none.
- **Major sections.**
  1. Units, symbols, notation, sign conventions.
  2. Requirement- and specification-writing standards.
  3. Margin, reserve, and design-factor policy.
  4. Safety & functional-safety conventions; applicable standards mapping (machinery, agricultural, food-contact) [VERIFY@PUB].
  5. V&V methodology (test staircase, FMEA, reliability).
  6. **Perishable-values policy** and the single centralized [VERIFY@PUB] table.
  7. Referencing & citation standards.
- **Estimated length.** 20 to 30 pp. **Diagrams.** Test-staircase, FMEA workflow. **Tables.** Symbol table; standards map; perishable-values master table. **Appendices.** Templates (requirement, FMEA row, trade study).

### I. Curriculum Standards Manual *(P0)*
- **Purpose.** Locks the pedagogical contract: the 30-section module template, tiered depth, lab/quiz templates, outcome mapping, and assessment policy.
- **Audience.** All content authors, instructors.
- **Dependencies.** Depends on H, J; governs every module/lab/quiz.
- **Major sections.**
  1. Educational philosophy (one robot; why/what/how/when/where/tradeoffs/limits/failure/verification/future).
  2. **30-section module template**, definition of each section and its depth tier (UG core vs grad extension).
  3. Tiered-delivery contract (core authored in full; production layer as build spec).
  4. Lab template & rubric standard.
  5. Quiz/assessment template & item types.
  6. Learning-outcome & ABET-style mapping convention (per-module SO table).
  7. Simulation-first requirement per module (mandatory twin activity).
  8. Accessibility & readability standards.
- **Estimated length.** 25 to 40 pp. **Diagrams.** Module-template map, outcome-mapping schema. **Tables.** Section-by-section template spec; rubric templates. **Appendices.** Exemplar section stubs (structure only).

### J. Visual & Media Standards Manual *(P0)*
- **Purpose.** Defines the visual identity and, critically, the **content-injection contract** between authored Markdown and the fixed HTML shell.
- **Audience.** Authors, media/CAD producers, web maintainer.
- **Dependencies.** Depends on the existing HTML shell; referenced by every asset.
- **Major sections.**
  1. Visual identity (palette, type, spacing), as-built from the deployed shell (preserve, don't redesign).
  2. **Content model / injection contract**, how Markdown structures map into templates; math rendering (KaTeX/MathJax policy); table & code conventions.
  3. Figure standards (engineering diagrams, block diagrams, FBDs, schematics, P&IDs), style, format (SVG), labeling.
  4. CAD & exploded-assembly standards.
  5. Animation standards (concept spec format for the media team).
  6. Interactive HTML widget standards (incl. the quiz mechanism, embedded-simulation pattern).
  7. Accessibility (contrast, alt text, keyboard, reduced motion).
  8. Asset naming, versioning, and repository placement.
- **Estimated length.** 20 to 35 pp. **Diagrams.** Template-injection map, figure style sheet, widget catalog. **Tables.** Asset-type registry; naming convention. **Appendices.** Figure checklist; widget spec template.

---

## 8. Dependency Map

How the ten authoritative documents support each production output. Arrows read "supports / is cited by."

```
                         +-----------------------------------------------+
                         |   H  Engineering Standards   J  Visual/Media    |  (cross-cutting;
                         |        (units, margins,          (identity,     |   referenced by
                         |         V&V, safety,             injection       |   everything)
                         |         perishable table)        contract)       |
                         +--------------+-----------------------+----------+
                                        |                        |
              +-------------------------v------------+          |
              |  B  System Design Specification       |          |
              |     (keystone requirements baseline)  |          |
              +---+-------+-------+-------+-----------+          |
                  |       |       |       |                      |
        +---------v--+ +--v----+ +v-----+ +v------------+        |
        | C Hardware | | D SW  | | E AI | | G Sim/Twin  |        |
        | (mech/fluid| |(ROS2, | |(models| |(fidelity    |        |
        |  /electr.) | | RT)   | | data) | | ladder,fluid|        |
        +-----+------+ +--+----+ +--+----+ |  model)     |        |
              |           |         |      +------+------+        |
              |        +--v---------v--+          |               |
              |        | F Edge Compute|          |               |
              |        | (budgets,     |          |               |
              |        |  deploy)      |          |               |
              |        +------+--------+          |               |
              +---------------+-----------+-------+---------------+
                                          v
                        +--------------------------------------+
                        |  I  Curriculum Standards               |
                        |  (30-sec template, tiers, rubrics,     |
                        |   simulation-first per module)         |
                        +-------------------+--------------------+
                                            v
        +------------------------------------------------------------------+
        |  PRODUCTION OUTPUTS (every module authored against the above)      |
        |  - Modules   - Labs   - Quizzes   - Challenge problems              |
        |  - Simulation/twin activities   - Interactive HTML widgets          |
        |  - CAD & exploded assemblies    - Figures & animations             |
        |  - Instructor resources         - GitHub repository structure       |
        +------------------------------------------------------------------+

   A  Project Design Handbook  -->  wraps and indexes all of the above (governance,
                                    navigation, contribution workflow, release).
```

**Key reads.**
- **B is load-bearing:** C, D, E, G all derive from it; a change in B propagates everywhere, so it is frozen first and changed only under control.
- **H and J are cross-cutting:** they touch every document and every asset; they must exist before authoring even though they contain no system requirements.
- **I sits between architecture and production:** it converts engineering truth (B-H) into teachable modules under the fixed visual contract (J).
- **A is editorial, not technical:** it can mature last, but a stub exists early to hold governance.

---

## 9. Development Roadmap

Recommended writing order with relative effort (S/M/L/XL), criticality, dependencies, and the approval milestone that gates the next step. Ordering minimizes rework by writing load-bearing and cross-cutting documents first.

| Order | Document | Effort | Criticality | Depends on | Approval milestone |
|:---:|----------|:---:|:---:|-----------|--------------------|
| 1 | **J, Visual & Media Standards** | M | P0 | HTML shell | M-J: injection contract proven against heaviest mock module |
| 2 | **H, Engineering Standards** | M | P1->P0* |, | M-H: conventions + perishable table adopted |
| 3 | **B, System Design Specification** | XL | P0 | H | **M-B: baseline frozen (keystone gate)** |
| 4 | **G, Simulation & Digital-Twin Architecture** | L | P0 | B, (C stub) | M-G: fidelity ladder + fluid model scope approved |
| 5 | **C, Hardware Architecture** (mech+fluid+electrical) | L | P0 subset | B | M-C: fluid P&ID + budgets approved |
| 6 | **I, Curriculum Standards** | M | P0 | H, J | **M-I: 30-section template + rubrics locked** |
| 7 | **D, Software Architecture** | L | P1 | B, C | M-D |
| 8 | **E, AI Architecture** | L | P1 | B, D | M-E |
| 9 | **F, Edge Computing Architecture** | M | P1 | B, C, D, E | M-F |
| 10 | **A, Project Design Handbook** | M | P1 | B-J | M-A: governance + index complete |

*H is nominally P1 but promoted to run early because B cannot be written to standard without it.

**Module-1 gate.** Curriculum authoring (Phase 3) begins only after **M-J, M-H, M-B, M-G, M-C(subset), M-I** are approved. D, E, F, A can mature in parallel with early modules because Modules 1 to 2 (system framing, crop/physics) do not yet depend on the software/AI/edge baselines, a deliberate sequencing so authoring is not blocked on the entire document set.

**Effort note.** B and the four architecture docs (C, D, E, G) are the bulk of the work; H, I, J are smaller but must come first. This front-loads the cheapest cross-cutting documents to unblock the expensive ones.

---

## 10. Readiness Assessment

**Is the project ready to begin curriculum development (Module 1)?, No, and it should not.**

The project is *ready to build its foundation*, which is the correct next activity. Beginning Module 1 now would author graduate content against (a) an actuation baseline the reference design contradicts, (b) a twin that cannot validate the fluid-power pillar simulation-first, and (c) no frozen requirements or locked templates, reintroducing exactly the inconsistency this phase exists to prevent. The three Critical risks (R-01, R-02, R-05) are all retired by completing the foundation, not by starting modules.

**Minimum work required before Module 1** (the critical path; everything else may run in parallel):

1. **Approve Phase 0** (this document).
2. **M-J, Visual & Media Standards**, including the content-injection contract, proven against a heaviest-case mock module page in the existing shell. *(Retires R-06, R-10.)*
3. **M-H, Engineering Standards**, including the centralized perishable-values policy. *(Retires R-03.)*
4. **M-B, System Design Specification**, re-baselined to the hybrid architecture with fluid-power gripping requirements, IDs, and traceability. *(Retires R-01 in spec; anchors R-02.)*
5. **M-G, Simulation & Digital-Twin Architecture**, defining the fidelity ladder and the minimum fluid-power model. *(Retires R-05; enables simulation-first delivery.)*
6. **M-C(subset), Hardware Architecture** for the mechanism + fluid subsystem + budgets. *(Completes the hybrid machine definition.)*
7. **M-I, Curriculum Standards**, locking the 30-section template, tiers, and rubrics. *(Retires R-04 depth ambiguity; enables consistent authoring.)*
8. **Confirm scope (CR-04):** adopt the 16-module master with the 7-module survey track, a Phase-2 decision.

On completion of items 1 to 7 and the CR-04 confirmation, the project is ready for **Phase 2 (curriculum architecture refinement)** and then **Phase 3 (Module 1)**. Until then, authoring modules is premature.

**Recommendation.** Approve this foundation, then commission the documents in the Section 9 order. The single highest-leverage next artifact is **Doc B (System Design Specification)** re-baselined to hybrid actuation, it is the keystone every subsequent module, lab, simulation, and assessment will cite.

---

## Appendix: Phase 0 self-review record (summary)

This foundation was reviewed in three passes before submission. Pass 1 caught that the original inventory treated the "spec/BOM/architecture" as authoritative when they are teaching-grade (L2) artifacts, corrected to a promotion model. Pass 2 caught that the fluid-power decision had cost, mass, power, twin-fidelity, and safety consequences that were not yet registered, added CR-02/03/06 and R-05/R-08. Pass 3 caught that the roadmap risked blocking all authoring on the full document set, corrected by defining a Module-1 gate that lets D/E/F/A mature in parallel with early modules whose dependencies they do not touch.

**END OF PHASE 0, STOP. Awaiting approval before Phase 2.**
