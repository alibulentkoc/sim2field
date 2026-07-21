# Module 15: Safety, Ethics & Responsible Deployment

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M15, **Part VI, Prove**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory/case-study session + homework
**Lifecycle stage (this module):** Prototype -> Field -> Deployment (safety certification & ethics)
**Prerequisites:** M7 (bounded learner, EI-07), M9 (fluid stored energy, mechanical relief, passive compliance, EI-09), M10 (operating envelope, EI-10), M11 (independent safety monitor, guard composition, EI-11), M12 (electrical/battery stored energy, EI-12), M13 (integrated machine, validated twin evidence, CEC-06), M14 (V&V and reliability evidence, adversarial validation, EI-14). Math: risk quantification, probability of hazardous events.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 14**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **certifies** what earlier modules *built*: it assembles the **independent safety monitor (M11/EI-11)**, the **passive-safety physics (M9/EI-09)**, the **bounded learner (M7/EI-07)**, and the **stored-energy hazards (M9 fluid + M12 electrical)** into a formal **safety case** on **M14's V&V evidence**, and it addresses the **ethics and responsible deployment** of an autonomous machine that works near people. The **CEC set is complete** (six anchors); this module mints **no new CEC**. P0-document authority tagged **[->Doc B/C/E/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-15** and the module's **Engineering Design Review**.

> *Core concepts converging on the safety case.* This module gathers the machine's whole defense-in-depth into one argument: the physical bounds (**EI-09**, relief, compliance), the independent monitor (**EI-11**), the bounded learner (**EI-07**), the envelope limits (**EI-10/EI-12**), verified adversarially (**EI-14**) on fidelity-appropriate evidence (**CEC-06**). Safety is not a subsystem; it is the composition the course has been building all along, now made into a certifiable claim.

---

## 1. Module Overview

**Mission.** This module is where the machine's scattered safety features become a single, defensible safety case: a structured argument that the machine's residual risk is acceptable, backed by the verification and reliability evidence M14 produced. And it is where a harder question than "does it work?" gets its due: should it work this way, near these people, with these consequences? Safety and ethics are the disciplines that decide whether an autonomous machine belongs in a field at all.

**Previous milestone.** Everything the course built to be safe must now be proven safe, and proven safe to someone, a grower, a worker, a regulator, the public.

**Engineering problem.** The safety material is already designed; this module certifies it. The course built defense in depth deliberately: physical bounds that cannot be commanded past (the mechanical relief and passive compliance, M9/EI-09), an independent safety monitor that can always stop the machine (M11/EI-11), a bounded learner whose worst case is contained (M7/EI-07), and envelope limits the machine respects (M10/EI-10). It also created two stored-energy hazard domains, pressurized fluid (M9) and the battery (M12), that a fault could touch together. This module performs the hazard analysis that names every way the machine could harm a person, fruit, or itself; the risk assessment that estimates each hazard's severity and likelihood; and the safety case that argues, hazard by hazard, that the mitigations reduce residual risk to an acceptable level, certifying, in particular, the independent monitor's independence (the claim EI-11 rests on).

**Design tension.** Then the module turns to ethics and responsible deployment, which no amount of engineering evidence settles. An autonomous harvester changes agricultural labor, concentrates capability, operates near workers, collects data about land and people, and can fail in ways that harm livelihoods as well as bodies. Responsible deployment means facing these honestly: the labor impact, the safety of the people who share the field, the environmental footprint, the data and accountability questions, and the humility to bound where the machine should not operate.

**What this module resolves.** The module's Engineering Insight is the one that separates a safety feature from a safety culture: safety is a property you argue for, not a box you check, it is an explicit, evidence-backed, falsifiable claim about residual risk that a skeptical reviewer could attack, and the engineer's job is to make that argument honestly, including where it is weakest.


## 2. Learning Objectives

- **LO-M15.1** Perform a hazard analysis for the machine (to people, fruit, and itself), including the two stored-energy domains (M9/M12)., *Bloom: Analyze (with Create)*
- **LO-M15.2** Assess risk (severity × likelihood) per hazard and set acceptance criteria., *Bloom: Evaluate*
- **LO-M15.3** Construct a safety case: claim -> argument -> evidence, certifying the defense-in-depth mitigations on M14's evidence., *Bloom: Create*
- **LO-M15.4** Certify the independent safety monitor's independence and reaction time (M11/EI-11) against fault-injection evidence., *Bloom: Evaluate*
- **LO-M15.5** Analyze the residual risk after all mitigations and argue its acceptability honestly (EI-15)., *Bloom: Evaluate (with Analyze)*
- **LO-M15.6** Analyze the ethics of deployment: labor, worker safety, environment, data, accountability, and where not to operate., *Bloom: Evaluate*
- **LO-M15.7** Specify safe deployment: operating limits, human interaction, maintenance-safety, and incident response., *Bloom: Create*

Maps to course objectives **LO7** (primary), **LO1/all** (integrative), and ABET **SO4 (ethics/professional responsibility)** primarily, **SO1/SO2**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Enumerate the machine's hazards, including combined stored-energy faults., *Bloom: Analyze*
2. Assess and rank risk and set acceptance criteria., *Bloom: Evaluate*
3. Build a claim-argument-evidence safety case on V&V evidence., *Bloom: Create*
4. Certify the safety monitor's independence against fault-injection evidence., *Bloom: Evaluate*
5. Argue residual-risk acceptability honestly, including weaknesses., *Bloom: Evaluate*
6. Reason through the deployment ethics and bound where not to operate., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1 placed a machine that exerts force and moves a heavy payload into a field where, eventually, people work. From that moment, safety stopped being optional and ethics stopped being abstract. This module exists because **a capable machine is not a deployable one until its risk is understood, bounded, argued, and owned**, and because engineers, not markets or regulators alone, carry the professional responsibility to refuse or reshape a deployment that harms people or livelihoods.

The safety motivation is concrete and cumulative. The machine can bruise fruit (an economic harm), but it can also injure: a heavy arm swinging a 5 to 10 kg payload, a mobile platform on a slope, pressurized fluid and a charged battery each storing energy that a fault could release, and opaque learned components making decisions in a shared space. Each module built a mitigation, but a pile of mitigations is not safety. Safety is the *argument* that, taken together and given the evidence, the residual risk is acceptable, and that argument must be explicit enough to be *attacked*, because a safety claim no reviewer can challenge is a claim no one has actually checked. The motivation for the formal safety case is that "we added guards" is not an answer to "is it safe?"; "here is the hazard, the mitigation, the evidence, and the residual risk, and here is why that residual is acceptable" is.

The independence claim deserves special motivation. The whole defense-in-depth rests on EI-11, that the safety monitor can stop the machine *regardless* of what fails elsewhere. But independence is easy to claim and easy to violate quietly (a shared clock, a shared power rail, a shared assumption). This module *certifies* independence against M14's fault-injection evidence, because the safety architecture is only worth what its independence is actually verified to be.

And the ethics motivation is the one engineering evidence cannot discharge. An autonomous harvester reshapes farm labor, displacing some work, changing other work, concentrating capability in those who can afford the machine. It shares space with workers whose safety depends on the machine's design. It collects data about land, yield, and people. It can fail in ways that cost a grower a season. None of these is settled by a passing test; they are questions of responsibility that a professional engineer must face rather than externalize. The motivation for this module's ethics content is that *responsible* deployment, not merely *possible* deployment, is part of the engineering, and the humility to bound where the machine should not go is a design decision like any other.

---

## Engineering Failure Cases (safety-and-ethics-specific)

Sharpening the highest-stakes failures:

- **Human injury.** The arm/payload or platform strikes or crushes a person in the shared field. *Motivates* hazard analysis, the independent monitor, keep-clear zones, and safe interaction (Section 6.2 to 6.4, EI-11).
- **Stored-energy release.** A fault releases pressurized fluid (M9) or battery energy (M12), separately or together. *Motivates* the two-domain stored-energy hazard analysis and mitigations (Section 6.3).
- **Safety-independence violation.** The monitor shares a hidden dependency (clock/power/assumption) with what it guards and fails with it. *Motivates* the independence certification (Section 6.5, EI-11).
- **Unbounded-learner harm.** A learned component acts outside its bounds and the containment fails. *Motivates* certifying the bounded-learner defense (Section 6.4, EI-07/EI-09).
- **Ethical failure.** Deployment harms workers' safety or livelihoods, misuses data, or operates where it should not. *Motivates* the ethics/responsible-deployment analysis (Section 6.7 to 6.8).
- **Overclaimed safety.** The safety case asserts more than the evidence supports; the machine is deployed on an unfalsifiable claim. *Motivates* the argue-don't-assert discipline (Section 6.6, EI-15).

Each is prevented by an honest safety or ethics discipline.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** probability and risk (severity × likelihood); the M7 bounded learner (EI-07); the M9 fluid stored energy, mechanical relief, and passive compliance (EI-09); the M10 operating envelope (EI-10); the M11 independent safety monitor, guard composition, and fault injection (EI-11); the M12 electrical/battery stored energy (EI-12); the M13 integrated machine and validated twin evidence (CEC-06); the M14 V&V and reliability evidence and adversarial validation (EI-14).

**Introduced here, used later:** the vocabulary of safety and ethics, *hazard analysis, risk assessment (severity/likelihood), ALARP/acceptable risk, safety case (claim-argument-evidence / goal-structuring), functional safety, independence/common-cause failure, safe state, keep-clear/human-interaction safety, lockout/maintenance safety, incident response; and deployment ethics, labor impact, worker safety, environmental footprint, data governance, accountability, dual-use, distributive effects*. Developed at applied (L2) depth; formal functional-safety standards and ethics frameworks are referenced [->Doc H].

**Where this sits in the dependency graph.** M15 depends on the safety-relevant design of M7/M9/M10/M11/M12 and the evidence of M13/M14. It **masters** the safety-case and ethics/responsible-deployment threads; it **applies** EI-07/EI-09/EI-10/EI-11/EI-12 (certifying their mitigations), EI-14 (adversarial safety testing), and CEC-06 (evidence fidelity for safety claims). It hands forward: the safety case and deployment limits to M16 (cost/deployment) and M17 (the capstone must satisfy them); and the residual-risk register to operations.

---

## 6. Theory

### 6.1 Safety is a system property, argued
No single feature makes the machine safe; safety is the *composition* of mitigations plus the *argument* that the composition reduces residual risk to acceptable. The course built the composition (defense in depth); this module builds the argument (the safety case). The argument must be explicit, evidence-backed, and falsifiable, a claim a skeptical reviewer could attack (EI-15).

### 6.2 Hazard analysis
Enumerate every way the machine could cause harm, to **people** (struck/crushed by arm, payload, or platform; stored-energy release; pinch points; slope roll-over near a person), to **fruit** (bruise/drop, economic), and to **itself/property** (tip-over, collision, fire). Systematic methods (hazard identification, HAZOP-style what-ifs, the FMEA from M14) ensure coverage, including *combined* faults (both stored-energy domains, M9+M12) and *adversarial* conditions (EI-14). A hazard missed here is a hazard unmitigated.

### 6.3 Stored energy: two domains
The machine stores energy in **pressurized fluid** (M9) and in the **battery** (M12). Each is a hazard (burst, sudden release, arc/fire), and a fault could involve both (e.g., an electrical fault energizing a valve, or a collision breaching both). Mitigations: relief/bleed-down and burst-rated components (fluid); fusing, isolation, thermal management, and safe-shutdown (electrical); guarding and lockout for both. The safety case treats them together, not as two separate problems (a common-cause-failure concern).

### 6.4 Certifying the defense in depth
The machine's safety layers, now certified:

- **Physical bounds (EI-09).** The mechanical relief caps grip force at $F_\text{bruise}$ at physics speed; passive compliance yields rather than crushing. Certified: the relief holds after wear (M14 durability), and compliance bounds contact force.
- **Independent monitor (EI-11).** Can stop/safe the machine regardless of mission logic; a minimal hardware controller provides a software-independent last resort. Certified: independence (Section 6.5) and reaction time $L_\text{detect}+L_\text{react}\le T_\text{harm}$ (M11/M14 fault injection).
- **Bounded learner (EI-07).** Learned outputs are clipped to verified bounds with a deterministic fallback. Certified: the bounds hold under adversarial and fault conditions (M14).
- **Envelope limits (EI-10/EI-12).** The machine refuses/degrades outside its safe envelope (slope, thermal). Certified: envelope-edge validation (M14).

Defense in depth means no *single* failure defeats safety; the safety case must show this for each hazard.

### 6.5 Independence and common-cause failure (certifying EI-11)
The monitor's value rests entirely on **independence**: it must not share a failure mode with what it guards. This module certifies independence by tracing the monitor's dependencies, inputs, clock, power, compute, and *assumptions*, and showing none is common-cause with the mission logic or the hazard source (or, where a dependency is shared, that it is itself protected). The minimal hardware safety controller exists precisely to break the last software dependency. A **common-cause failure** (one fault disabling both the function and its guard) is the safety case's most important thing to rule out.

### 6.6 The safety case: claim, argument, evidence
A **safety case** is a structured argument that the machine is acceptably safe. Its form: a top **claim** ("residual risk is acceptable for the defined operation"), decomposed into sub-claims per hazard, each supported by an **argument** (the mitigation strategy) and **evidence** (from M14, tests, analysis, fault injection, reliability), with the *fidelity* of that evidence stated (CEC-06). Crucially, it also states **residual risk** and **assumptions/limits** honestly. This is the goal-structured argument a reviewer or regulator evaluates, and its integrity depends on being falsifiable (EI-15).

### 6.7 Residual risk and acceptability
No machine is zero-risk; the question is whether residual risk is **acceptable**, reduced as low as reasonably practicable and below a threshold appropriate to the operation and those exposed. Acceptability is a *judgment*, informed by likelihood × severity, by who bears the risk (a worker did not consent the way an operator did), and by comparison to the status quo (manual harvest has its own risks). The safety case names the residual risk explicitly rather than implying zero, because an honest small residual is trustworthy where a claimed zero is not (EI-15).

### 6.8 Ethics and responsible deployment
Engineering evidence cannot settle whether the machine *should* deploy. Responsible deployment weighs:

- **Labor.** The machine displaces, changes, and concentrates agricultural work; who benefits and who bears the cost is an engineering-adjacent responsibility, not an externality.
- **Worker safety.** People share the field; their safety depends on design choices (keep-clear, detection of humans, safe interaction) they did not make and often cannot see.
- **Environment.** Energy source, materials, soil impact, and lifecycle footprint (->M16).
- **Data & accountability.** The machine collects data about land, yield, and possibly people; who owns it, who is accountable when it fails, and how failures are investigated.
- **Dual-use / misuse and distributive effects.** Capability concentrated in those who can afford it; potential for misuse; effects on small vs. large growers.
- **Where not to operate.** The humility to bound the machine's deployment, conditions, proximity to people, uses, it should refuse. Bounding *out* is a design decision.

The engineer's professional responsibility (ABET SO4) is to face these, not externalize them.

### 6.9 Safe deployment and operations
Certification is not the end; safe *operation* requires defined operating limits (the envelope, M10), human-interaction rules (keep-clear zones, human detection, predictable behavior), maintenance safety (lockout/tagout, stored-energy bleed-down before service), operator training, and an **incident-response** plan (how a harm is detected, stopped, reported, investigated, and fixed, reliability/safety growth). The safety case is a living document, updated as the field reveals what the analysis missed.

---

## 7. Mathematics

Rigor tier for M15: **L2**. Central results: risk quantification and the reaction-time safety margin (recapped from M11 in the safety frame).

### 7.1 Risk = severity × likelihood
Rank each hazard by severity $S$ and likelihood $L$ (per cycle/hour, from the M14 FMEA/reliability data) into a risk $R=S\times L$; prioritize mitigation by $R$ (the dominant *risk*, an EI-05-style focus). *Use:* a risk-ranked hazard register; direct safety effort where risk is highest.

### 7.2 Reaction-time safety margin (EI-11, safety frame)
For a hazard, require detection + reaction faster than harm: $L_\text{detect}+L_\text{react}\le T_\text{harm}$, with margin. Physical bounds (relief, compliance, EI-09) act at physics speed, effectively $L_\text{react}\approx 0$ for the force hazard, providing margin the software monitor lacks. *Use:* certify each time-critical hazard is caught in time, and show where physics (not software) provides the guarantee.

### 7.3 Residual risk and defense-in-depth composition
With independent layers of failure probabilities $p_i$, the probability all fail (a hazard reaching harm) is $\prod_i p_i$ **only if** the layers are independent, which is exactly why independence (Section 6.5) is certified. Common-cause failure breaks the product (the layers fail together), so the residual is dominated by common-cause terms. *Use:* show residual risk is acceptably low *and* that the low number does not secretly rest on a common-cause assumption. **Grad (L3):** model common-cause with a beta-factor and show its dominance of the residual.

---

## 8. Engineering Principles

1. **Safety is composed and argued**, defense in depth plus a falsifiable safety case (EI-15).
2. **Enumerate every hazard**, including combined stored-energy faults (M9+M12).
3. **Certify independence** (EI-11): rule out common-cause failure, or the layers aren't independent.
4. **Let physics provide the fastest guarantee** (EI-09): relief/compliance act before software can.
5. **State residual risk honestly**, an honest small residual beats a claimed zero.
6. **Face the ethics**, labor, worker safety, environment, data, accountability, and where not to operate.
7. **Safety is operational and living**, limits, human-interaction rules, maintenance safety, incident response.

---

## 9. System Requirements

Derived from the safety/ethics mission; certify prior mitigations. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-S-03 | Safety | A hazard analysis shall enumerate hazards to people/fruit/property, incl. combined stored-energy faults, with a risk-ranked register. | Hazard analysis review |
| SR-S-04 | Safety | The independent safety monitor's independence (no common-cause with mission/hazard) and reaction time shall be certified (EI-11). | Independence analysis + fault injection (M14) |
| SR-S-05 | Safety | The defense-in-depth mitigations (physical bounds EI-09, bounded learner EI-07, envelope EI-10/12) shall each be certified on M14 evidence. | Safety-case review |
| SR-S-06 | Safety | Residual risk shall be assessed and argued acceptable for the defined operation, stated explicitly. | Safety-case review |
| SR-S-07 | Safety | Human-interaction safety (keep-clear/human detection, predictable behavior) and maintenance safety (lockout, bleed-down) shall be specified. | Review + test |
| SR-E-01 | Ethics | A responsible-deployment analysis (labor, worker safety, environment, data, accountability, where-not-to-operate) shall be documented. | Review |
| SR-E-02 | Ethics | Operating limits shall bound the machine out of conditions/proximities it should not operate in. | Review + runtime enforcement |

Traceability: SR-S-03 -> M14 FMEA; **SR-S-04/05 -> EI-07/09/11, M14 fault injection**; SR-S-06 -> Section 6.7, EI-15; SR-S-07 -> operations; SR-E-01/02 -> ethics (SO4), M16.

---

## 10. Design Decisions

- **DD-90 Risk-ranked hazard register incl. combined stored-energy faults.** *Rationale:* Section 6.2 to 6.3; coverage and prioritization. *Serves:* SR-S-03.
- **DD-91 Independence certification of the safety monitor** (rule out common-cause; HW last resort). *Rationale:* Section 6.5, EI-11. *Serves:* SR-S-04.
- **DD-92 Defense-in-depth safety case (claim-argument-evidence, fidelity-tagged).** *Rationale:* Section 6.4/Section 6.6, CEC-06. *Serves:* SR-S-05.
- **DD-93 Explicit residual-risk statement + acceptability argument.** *Rationale:* Section 6.7, EI-15; honesty over a claimed zero. *Serves:* SR-S-06.
- **DD-94 Human-interaction & maintenance-safety design** (keep-clear, human detection, lockout, bleed-down). *Rationale:* Section 6.9. *Serves:* SR-S-07.
- **DD-95 Responsible-deployment analysis + operating-limit bounding.** *Rationale:* Section 6.8, SO4. *Serves:* SR-E-01/02.
- **DD-96 Living safety case + incident-response plan.** *Rationale:* Section 6.9; safety grows with field experience. *Serves:* SR-S-06.

---

## 11. Trade Studies

### 11.1 TS-29: Human-presence safety strategy
**Alternatives:** (A) **exclusion only** (no people in the field during operation); (B) **human detection + safe-stop** (perception detects people, monitor stops); (C) **collaborative** (designed for close human proximity); (D) **defense in depth: exclusion zone + detection + physical safe behavior**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B/Doc E).

| Criterion (weight) | A: Exclusion | B: Detect+stop | C: Collaborative | D: Defense-in-depth |
|--------------------|:---:|:---:|:---:|:---:|
| Risk reduction to people (0.32) | 4 | 3 | 2 | 5 |
| Operational practicality in a working field (0.22) | 2 | 4 | 5 | 4 |
| Verifiability of the safety claim (0.20) | 5 | 3 | 2 | 4 |
| Dependence on perception (opaque) (0.14) | 5 | 2 | 1 | 4 |
| Cost / complexity (0.12) | 5 | 3 | 2 | 3 |
| **Weighted total** | **3.86** | **3.14** | **2.52** | **4.30** |

**Selected: D (defense in depth, exclusion zone + human detection + physically safe behavior).** Combine an administrative exclusion zone during autonomous operation, human detection as a monitored layer, and physically safe behavior (compliance, bounded speed/force, predictable motion, the independent monitor) so that no *single* layer failing, including the opaque human-detector, permits harm. Pure collaborative operation is rejected at this stage: certifying safety for close human proximity with opaque perception exceeds what the evidence can support (a candid limit, EI-15). Recorded weakness: exclusion reduces some operational flexibility and relies on administrative controls that must be enforced, carried into deployment (SR-S-07/E-02).

### 11.2 TS-30: Safety-case rigor (summary)
**Alternatives:** informal checklist, standards-aligned functional-safety case, goal-structured safety case with explicit residual risk. **Criteria:** rigor, reviewability, honesty about residual, effort. **Outcome:** **goal-structured, standards-informed safety case with explicit residual-risk statements**, a falsifiable claim-argument-evidence structure a reviewer can attack (EI-15), aligned with functional-safety practice [VERIFY@PUB standard], not a checklist that hides the residual.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
The **CEC set is complete** (six anchors); the default outcome is "existing anchor applied," and a new CEC requires an extraordinary case.

- **Safety-case methodology / hazard analysis / risk assessment.** *Verdict: no new CEC.* Mastered *techniques*, captured in the safety thread, not a new analytical anchor.
- **The defense-in-depth safety architecture.** *Verdict: no new CEC, this certifies the composition already anchored by EI-07/EI-09/EI-11*; M11 explicitly evaluated and declined a safety CEC, holding it as judgment + thread. That decision stands; M15 *certifies* the thread, it does not re-mint it. *No extraordinary case: safety is the composition of existing anchors, argued.*
- **Evidence fidelity for safety claims.** *Verdict: CEC-06 applied* (safety evidence carries its validated rung, exactly as in M14).
- **EI-15 (Safety Is a Property You Argue For)** is added as this module's Engineering Insight, reinforcing EI-11/EI-14 and the whole defense-in-depth. *(No new CEC; one EI added, within discipline and the set-complete direction.)*

> **Cross-module synthesis note (lightweight).** The safety case is where the course's judgment insights stop being separate lessons and become one argument: **EI-09** (physics bounds the worst case), **EI-07** (the learner is bounded), **EI-11** (the guard is independent), **EI-10/EI-12** (the envelope is respected), all verified **EI-14** (adversarially) on **CEC-06** (fidelity-appropriate) evidence, and **EI-15** is the meta-insight that binds them: none of it is safety until it is *argued*, honestly and falsifiably, as an explicit claim about residual risk.

> **Simulation-first hook.** Safety evidence obeys CEC-06 with the highest bar: fidelity-sensitive and adversarial safety claims (human-interaction, stored-energy, monitor reaction) are field/HIL-validated (EI-14), and the twin supports only the claims its validated rungs admit, an unvalidated twin result is inadmissible in a safety case.

---

## 12. Simulation Activities

M15 runs at **Prototype -> Field -> Deployment** for certification; the twin/HIL supports only claims its validated rungs admit (CEC-06), and the highest-stakes claims are field/HIL-validated.

**SA-1, Hazard analysis & risk register.** Build the risk-ranked hazard register (people/fruit/property, combined stored-energy faults) from the design and the M14 FMEA (Section 6.2 to 6.3, SR-S-03). *Outcome:* the coverage-complete hazard basis of the safety case.

**SA-2, Fault-injection for safety certification.** Reuse the M11/M14 fault-injection suite to certify the monitor's reaction time and the defense-in-depth layers under injected faults and adversarial conditions (Section 6.4 to 6.5, EI-11/EI-14, SR-S-04/05). *Outcome:* evidence the layers hold.

**SA-3, Common-cause / independence analysis.** Trace the monitor's dependencies (inputs, clock, power, compute, assumptions) and test whether any single fault disables both a function and its guard (Section 6.5, SR-S-04). *Outcome:* independence certified or a common-cause found and fixed.

**SA-4, Residual-risk composition.** Compose the defense-in-depth layer probabilities (Section 7.3), identify the common-cause-dominated residual, and assess acceptability (Section 6.7, SR-S-06). *Outcome:* an honest residual-risk number.

---

## 13. Digital Twin Activities

**DTA-1, Safety-evidence admissibility (CEC-06).** Specify, per safety claim, the evidence and its fidelity rung, flagging which safety claims are field/HIL-mandatory (human-interaction, stored-energy, reaction time). *Outcome:* SR-S-05; a safety case that never rests on inadmissible twin evidence.

**DTA-2, Adversarial safety scenarios (EI-14).** Specify the adversarial/edge scenarios the safety case must survive (human in the path, slope + payload, combined stored-energy fault, monitor-node hang) and the pass criteria. *Outcome:* safety validated by attack, not demo.

**DTA-3, Living safety-case & incident-response linkage.** Specify how field incidents update the hazard register and safety case (safety growth). *Outcome:* a living safety case (SR-S-06/DD-96).

---

## 14. Hardware Activities

*(Tiered: certification and field protocols at specification level, safety's highest-stakes evidence is hardware/field.)*

**HA-1, Stored-energy safety verification.** Specify tests of relief/bleed-down (fluid, M9), electrical isolation/shutdown (M12), and combined-fault behavior; verify lockout for maintenance (Section 6.3, SR-S-03/07). *Deliverable:* stored-energy certification evidence.

**HA-2, Monitor independence & reaction-time verification.** Specify hardware fault-injection confirming the monitor (and HW safety controller) stops the machine within $T_\text{harm}$ independent of software (SR-S-04). *Deliverable:* independence & reaction-time certification.

**HA-3, Human-interaction safety verification.** Specify verification of keep-clear enforcement, human detection performance (with its false-negative rate honestly bounded), and predictable safe behavior (SR-S-07). *Deliverable:* human-safety evidence (with residual stated).

---

## 15. Software Activities

**SWA-1, Safety-case toolchain & traceability.** Specify the goal-structured safety-case artifact linking claims -> arguments -> evidence (M14) -> residual risk, with fidelity tags and version control (living document). *Outcome:* a reviewable, maintainable safety case.

**SWA-2, Runtime safety-limit enforcement.** Specify runtime enforcement of operating limits and where-not-to-operate bounds (envelope, proximity), integrated with the safety monitor (M11) and power/thermal management (M12). *Outcome:* the ethics/where-not-to-operate decision made enforceable (SR-E-02).

---

## 16. ROS 2 Integration

M15 certifies, rather than changes, the M11 safety architecture. It consumes the safety monitor's logged activations, guard arbitration, and fault-injection results as *evidence*, and it specifies the runtime enforcement of operating limits and keep-clear/human-detection behavior within the existing node graph. The safety monitor and its hardware controller are the subject of the independence certification (Section 6.5). On-robot (CEC-04). The safety case cites the integrated system's behavior (M13) under adversarial and fault conditions (M14) as its evidence base.

---

## 17. AI Integration

The machine's opaque learned components are a central safety and ethics concern, and this module certifies their containment rather than trusting them:

- **Bounded-learner certification (EI-07).** The safety case shows learned outputs are contained by verified bounds and a deterministic fallback, tested adversarially (M14), the *system* is certified safe though the policy is not verifiable.
- **Human detection is a monitored layer, not a sole safeguard.** Because a learned human-detector has a nonzero false-negative rate, the safety strategy (TS-29 D) never relies on it alone, defense in depth with exclusion and physically safe behavior. Its false-negative rate is *stated*, not hidden (EI-15).
- **Ethics of opaque decisions.** Accountability for a learned component's failure, the data it was trained on, and its behavior on populations/conditions unseen in training are ethics questions (Section 6.8), not just engineering ones.

The certified claim is about the *bounded system's* safety, with learned components' limits made explicit.

---

## 18. Edge Computing Integration

Safety-critical functions run on-robot (CEC-04), the no-cloud boundary is itself a safety property (no network dependency in the safety loop). This module certifies that the safety monitor's compute and power are available and independent (Section 6.5, tying to M12's safety-first power sequencing) and that safety functions meet their timing on the real edge under load (M14). A safety function that depends on the cloud, or that can be starved by perception load, is not independent, certified here.

---

## 19. Fluid Power Integration

The fluid grasp (M9) is central to the safety case in two opposite ways. As a **hazard**: pressurized fluid stores energy (burst, sudden release), and this is one of the two stored-energy domains the analysis treats together with the battery (Section 6.3, SR-S-03). As a **mitigation**: the mechanical relief and passive compliance (EI-09) are the machine's fastest, most trustworthy safety layer, acting at physics speed, bounding grip force below the bruise/injury threshold regardless of software (Section 6.4/Section 7.2). The safety case certifies both: that the stored-energy hazard is mitigated (relief, bleed-down, burst rating, guarding), and that the passive-safety physics still holds after a season of wear (M14 durability). Fluid power is simultaneously a risk to bound and the source of the strongest safety guarantee, a duality the safety case must state clearly.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M15-1, Hazard & Risk Register.** Enter hazards with severity/likelihood; live risk ranking and the dominant risk highlighted (Section 7.1); combined stored-energy faults flagged. *Goal:* Section 6.2 to 6.3.
- **W-M15-2, Defense-in-Depth Explorer.** Toggle safety layers (physical bound, monitor, bounded learner, envelope) on/off and watch residual risk change; show a common-cause fault defeating multiple layers at once (Section 6.4 to 6.5, Section 7.3). *Goal:* independence & composition.
- **W-M15-3, Safety-Case Builder.** Assemble claim->argument->evidence with fidelity tags; flags a claim whose evidence is inadmissible for its fidelity (CEC-06) or that asserts more than the evidence supports (EI-15). *Goal:* Section 6.6.
- **W-M15-4, Responsible-Deployment Dashboard.** Sliders/toggles for labor, worker-proximity, data, and environment considerations; surfaces the tradeoffs and where-not-to-operate bounds (Section 6.8). *Goal:* ethics made explicit.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M15-1** The defense-in-depth safety architecture: physical bounds, independent monitor + HW controller, bounded learner, envelope limits, layered, with the common-cause concern annotated.
- **CAD-M15-2** Hazard map of the machine: pinch/crush points, stored-energy domains (fluid + electrical), keep-clear zone.
- **CAD-M15-3** The safety case as a goal structure (claim -> sub-claims -> arguments -> evidence -> residual risk).
Format per ->Doc J (SVG safety/architecture diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M15-1 | Risk-ranked hazard register (severity × likelihood) | Section 6.2/Section 7.1 |
| F-M15-2 | Two stored-energy domains (fluid + electrical) & combined fault | Section 6.3 |
| F-M15-3 | **Defense-in-depth layers & the common-cause concern** | Section 6.4/Section 6.5 (central, EI-11) |
| F-M15-4 | Safety case: claim -> argument -> evidence -> residual risk | Section 6.6 (EI-15) |
| F-M15-5 | Reaction-time margin (physics-speed vs. software) | Section 7.2 (EI-09) |
| F-M15-6 | Responsible-deployment considerations map | Section 6.8 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M15-1** A hazard progressing toward harm and being caught by successive defense-in-depth layers; then a common-cause fault defeating several layers at once, motivating independence (EI-11).
- **AN-M15-2** The mechanical relief (physics-speed) capping force before the software monitor could react, why physics provides the fastest guarantee (EI-09).
- **AN-M15-3** A safety-case claim being attacked by a reviewer and either holding (with evidence) or failing (over-claimed), safety as an argument (EI-15).

---

## 24. Laboratory / Case-Study Session

**Lab M15, Building the Safety Case and Facing the Ethics**

- **Objectives.** (1) Build a risk-ranked hazard register incl. combined stored-energy faults; (2) certify the safety monitor's independence and reaction time against fault-injection evidence; (3) construct a goal-structured safety case on M14 evidence with explicit residual risk; (4) analyze the deployment ethics and bound where-not-to-operate; (5) practice attacking the safety case (adversarial review).
- **Equipment.** The M14 V&V/reliability evidence and fault-injection results; the design (M7/M9/M10/M11/M12); a safety-case template; an ethics-framework reference [VERIFY@PUB]; notebook. **Safety:** any hardware follows lockout/bleed-down and the safety architecture.
- **Procedure.**
  1. Enumerate hazards (people/fruit/property, combined stored-energy) and rank by risk (Section 6.2 to 6.3, Section 7.1, SR-S-03).
  2. Trace the monitor's dependencies; test for common-cause; certify independence and reaction time on fault-injection evidence (Section 6.5, EI-11, SR-S-04).
  3. Build the safety case: for each top hazard, claim -> mitigation argument -> M14 evidence (with fidelity, CEC-06) -> residual risk; state acceptability (Section 6.6 to 6.7, SR-S-05/06).
  4. Analyze deployment ethics (labor, worker safety, environment, data, accountability); specify where-not-to-operate bounds (Section 6.8, SR-E-01/02).
  5. Adversarial review: a peer team attacks the safety case; strengthen or honestly concede each challenged claim (EI-15).
- **Data collection.** Hazard/risk register; independence analysis; safety case with residual risk; ethics analysis and operating bounds; adversarial-review findings.
- **Analysis.** What is the dominant risk? Is the monitor truly independent (any common-cause)? Which claims survive adversarial review, and which reveal a weak residual? What deployment bounds does responsibility require?
- **Discussion.** Why is safety an argument, not a checklist (EI-15)? Why certify independence specifically (EI-11)? Why does physics give the fastest guarantee (EI-09)? Which ethics questions can engineering *not* settle?
- **Deliverables.** A safety case (claim-argument-evidence with residual risk) + a responsible-deployment analysis with operating bounds, 6 to 8 pages.
- **Rubric (100 pts).** Hazard/risk register (16); independence certification (18, EI-11); safety case with residual risk (26, EI-15/CEC-06); ethics & where-not-to-operate (24, SO4); adversarial-review response (6); communication (10). *Graduate band adds:* common-cause (beta-factor) residual modeling (Section 7.3 grad) and a cited source.
- **Expected results.** A risk register with a clear dominant hazard; an independence analysis that finds at least one subtle shared dependency to fix; a safety case whose honesty is *strengthened* by stating a nonzero residual; an ethics analysis that yields real operating bounds (not platitudes); and an adversarial review that exposes at least one over-claim, the case for EI-15.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Hazard/risk.** Enumerate five machine hazards (incl. one combined stored-energy fault); rank by severity × likelihood; identify the dominant risk.
2. **Independence.** For the safety monitor, list its dependencies and identify one plausible common-cause failure; propose how to break it (EI-11).
3. **Safety case.** For one hazard, write the claim -> argument -> evidence (from M14) -> residual risk, tagging evidence fidelity (CEC-06); state whether the residual is acceptable and why.
4. **Ethics.** Analyze one deployment-ethics dimension (labor, worker safety, data, or environment) for the machine; propose a responsible design/operating choice and a where-not-to-operate bound.
5. **(Grad) Common-cause residual.** Model residual risk for a two-layer defense with a common-cause (beta) factor; show how common-cause dominates the residual and what independence buys.
6. **(Grad) Contested ethics.** Take a genuinely contested deployment question (e.g., labor displacement) and lay out the strongest cases on multiple sides; state what an engineer's professional responsibility requires regardless of which side one favors.

---

## 26. Quiz

1. **(MC)** A safety case is: (a) a checklist of features; (b) a falsifiable claim-argument-evidence argument that residual risk is acceptable; (c) a datasheet; (d) a demo. **[b]**
2. **(MC)** Defense in depth reduces risk only if the layers are: (a) identical; (b) independent (no common-cause failure); (c) software; (d) fast. **[b]**
3. **(MC)** The fastest, most trustworthy safety guarantee for grip force comes from: (a) the AI policy; (b) the mechanical relief/compliance acting at physics speed (EI-09); (c) the cloud; (d) the operator. **[b]**
4. **(MC)** An honest safety case states residual risk as: (a) zero; (b) an explicit nonzero value argued acceptable; (c) unknown; (d) not applicable. **[b]**
5. **(Short)** State EI-15 and why it matters. **[Safety is a property you argue for, not a box you check, an explicit, evidence-backed, falsifiable claim about residual risk; a claim no reviewer can attack is one no one has actually checked.]**
6. **(Short)** Name the two stored-energy domains and why they're treated together. **[Pressurized fluid (M9) and the battery (M12); a single fault could involve both (common-cause), so the safety case treats them jointly, not separately.]**
7. **(Design)** Why is human detection never the sole safeguard for people in the field? **[It's an opaque learned component with a nonzero false-negative rate; defense in depth (exclusion + physically safe behavior + monitor) ensures no single layer failing permits harm.]**
8. **(Design)** How does certifying independence (EI-11) change the residual-risk math? **[Independent layers multiply failure probabilities ($\prod p_i$); a common-cause fault breaks the product, so the residual is dominated by common-cause terms, which is why independence must be certified.]**
9. **(Critical thinking)** Why can engineering evidence not settle whether the machine *should* deploy? **[Labor, worker safety, data, environment, and distributive effects are value/responsibility questions (SO4) a passing test cannot answer; responsible deployment weighs them explicitly.]**
10. **(Critical thinking)** Why is a validation/safety report that found *no* failures suspicious? **[It usually means the tests were too easy (not adversarial, EI-14); an honest campaign attacks the hard cases and finds/fixes failures.]**

---

## 27. Challenge Problems

- **CP-M15-A, The full safety case.** Construct the machine's top-level safety case: the top claim, sub-claims per dominant hazard, mitigation arguments, M14 evidence (with fidelity), the certified independence, and the explicit residual risk, and identify the single weakest link a regulator would attack first. (The capstone acceptance rests on this.)
- **CP-M15-B, Common-cause hunt.** Systematically search the defense-in-depth layers for common-cause failures (shared power, clock, compute, assumptions, sensing); for each found, propose a fix that restores independence; quantify the residual before/after (EI-11). (Feeds deployment.)
- **CP-M15-C, Responsible-deployment brief.** Write a responsible-deployment brief for a real grower context: labor impact and mitigation, worker-safety design, environmental footprint (->M16), data governance, accountability for failures, and explicit where-not-to-operate bounds. Defend a recommendation to deploy, deploy-with-limits, or not-yet. (Directly informs M16/M17.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence, and expect the board to attack.*

1. **Assumptions.** Your safety case assumes the defense-in-depth layers are independent. Trace each layer's dependencies (power, clock, compute, sensing, assumptions) and show there is no common-cause failure, or admit where one exists and how the residual accounts for it (EI-11).
2. **Tradeoffs.** You chose exclusion + detection + physically-safe behavior over collaborative operation. Defend that to a reviewer who wants people working alongside the machine for productivity. What can you *not* yet certify, and is deferring collaboration honest or overcautious (EI-15)?
3. **Risk.** State your residual risk explicitly. Is it truly as-low-as-reasonably-practicable, and does the number secretly rest on a common-cause assumption or an inadmissible (over-fidelity) piece of evidence (CEC-06)?
4. **Verification.** Which safety claims rest on twin evidence, and are those claims fidelity-appropriate (CEC-06)? Which are field/HIL-mandatory, and have you gathered that evidence or only specified it (EI-14)?
5. **Subsystem interaction.** The mechanical relief (M9) is both a hazard component (stored energy) and a safety mitigation (physics-speed bound). If it drifts with wear (M14), does it fail toward hazard or toward safety, and who owns that failure mode across reliability and safety?
6. **Ethics.** Who bears the risk of this machine (the operator? nearby workers? the grower's season?), and did they consent to it the way the operator did? What is your where-not-to-operate bound, and is it enforced at runtime (SR-E-02) or merely documented?

---

## 28. Instructor Notes

- **Timing.** Section 6.2 to 6.6 (hazard analysis, defense-in-depth certification, independence, the safety case) are the core (~3 h); Section 6.7 to 6.8 (residual risk, ethics) and EI-15 are the peaks. Trade studies (Section 11) and the safety-case/ethics session (Section 12, Section 24) are interactive (~2 h). The lab is a build-and-attack session (peer adversarial review is essential).
- **Common misconceptions.** (1) "We added guards, so it's safe", safety is the *argument* (EI-15). (2) Layers reduce risk regardless, only if *independent* (EI-11). (3) Residual risk should be zero, an honest nonzero is more trustworthy. (4) Ethics is separate from engineering, responsible deployment is part of the engineering (SO4). (5) Human detection makes proximity safe, it's one opaque layer, never sole.
- **On no new CEC.** M15 *certifies* the defense-in-depth thread that M11 declined to mint as a CEC; that decision stands. Safety is the *composition* of existing anchors (EI-07/09/10/11/12), argued (EI-15), on CEC-06 evidence, a strong demonstration that the completed set suffices.
- **On ethics teaching.** Present contested questions (labor especially) with the strongest cases on multiple sides, per good pedagogy; the professional-responsibility point (SO4) is that the engineer must *face* them, not that one answer is mandated. Keep it honest and non-preachy.
- **On adversarial review.** The peer attack on the safety case is the point of the lab, a case that survives attack (or honestly concedes) is the deliverable, embodying EI-15.
- **Where to push graduate students.** Common-cause modeling (HW5), contested-ethics analysis (HW6, CP-M15-C), the full safety case (CP-M15-A).
- **Thread to keep visible.** Close by naming hand-offs: the safety case + deployment limits -> M16 (cost/deployment) and M17 (the capstone must satisfy them); the residual-risk register -> operations.

---

## 29. Research Frontiers

- **Landmark grounding.** Functional-safety and safety-case references (hazard analysis, risk assessment, goal-structured argumentation); robotics/autonomy safety references; engineering-ethics and responsible-innovation references. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Safety cases and assurance arguments for learning-enabled autonomous systems; runtime assurance and independent monitors with certified independence; human-detection and safe human-robot interaction for field/agricultural robots; ethics and labor-impact frameworks for agricultural automation; data governance and accountability for autonomous machines.
- **Open problems.** Certifiable safety for autonomy with opaque learned components; verifying independence/absence of common-cause in complex systems; safe close human-robot collaboration in unstructured fields; equitable deployment of agricultural automation; accountability frameworks for autonomous-machine failures.
- **Suggested thesis directions.** (1) A certified-independent runtime safety monitor with a machine-checkable common-cause analysis. (2) A defense-in-depth human-safety architecture for field robots that does not rely on any single opaque detector. (3) A responsible-deployment framework for agricultural automation addressing labor, worker safety, and equity with the grower and worker as stakeholders.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Functional-safety / safety-case references, hazard analysis, risk, goal-structured argument, residual risk (Section 6.2 to 6.7).
- Robotics/autonomy safety references, independent monitors, human-interaction safety, common-cause (Section 6.4 to 6.5; EI-11).
- Engineering-ethics / responsible-innovation references, labor, worker safety, data, accountability (Section 6.8; SO4).
- Learning-enabled-system assurance literature, certifying bounded opaque components (Section 6.4; EI-07).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 14**, and (forthcoming) Doc B, Doc E, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** This module *certifies* what the course built: it assembles the machine's **defense in depth**, physical bounds (EI-09), the independent monitor (EI-11), the bounded learner (EI-07), envelope limits (EI-10/EI-12), into a formal, goal-structured **safety case** on **M14's evidence**, and it certifies the one claim everything rests on: the monitor's **independence** (ruling out common-cause failure, the thing that silently breaks defense in depth). It treats the machine's **two stored-energy domains** (fluid + electrical) *together*, states **residual risk explicitly** (an honest nonzero over a claimed zero), and, distinctively for an engineering module, takes **ethics and responsible deployment** seriously as professional responsibility (SO4): labor, worker safety, environment, data, accountability, and the humility of *where not to operate*, presented with the strongest cases on multiple sides rather than preached. Its Engineering Insight, **EI-15 (Safety Is a Property You Argue For)**, is the meta-insight binding the course's judgment lessons into one falsifiable argument, embodied in the lab's adversarial peer review. Consistent with your direction, it mints **no new CEC**, safety is the *composition* of existing anchors, argued, and the Section 11.3 evaluation makes that case explicitly. All 30 sections present; the Engineering Design Review is written to be *attacked* (as a real board would); one lightweight synthesis note (the judgment insights becoming one argument); consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets/standards are [VERIFY@PUB].** The specific functional-safety standard, risk-acceptance thresholds, and reaction-time numbers depend on Doc B/E and the regulatory context; the safety-case, hazard-analysis, and independence *methods* are exact.
2. **The strongest safety evidence is field/HIL-mandatory and specified, not gathered.** Human-interaction, stored-energy, and reaction-time certification await hardware and field trials (EI-14/CEC-06); the module builds the *argument structure* and the evidence *requirements*.
3. **Independence certification is method-not-verdict here.** Whether a real common-cause exists (shared power/clock/assumption) awaits the actual dependency trace on built hardware; the method to find and break it is exact.
4. **The ethics content frames responsibilities; it does not (and should not) dictate a single deployment verdict.** It equips the engineer to reason and bound, consistent with presenting contested questions fairly, a deliberate choice, flagged so you can adjust emphasis for your context.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 3 close chiefly by authoring Doc B/E/G and by field certification; item 4 is a pedagogical stance you may tune.

**END OF MODULE 15, STOP. Awaiting your review before freezing Module 15 or proceeding to Module 16.**
