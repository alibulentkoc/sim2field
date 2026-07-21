# Doc E: Safety

**SIM2FIELD, Autonomous Watermelon Harvesting Robotics**
**P0 Support Document E**, *The authoritative safety-case, hazard-analysis, and responsible-deployment baseline*
**Status:** **Rev 1.0, frozen configuration-controlled baseline (approved).** Revision-controlled; living document (updates with field incidents).
**Depends on:** Doc B (Rev 1.0, SR-S/SR-E requirements, ratified safety parameters), Doc C (Rev 1.0, enumerated stored-energy hardware), Doc G (Rev 1.0, evidence-admissibility rules; safety claims ride validated rungs)
**Controlling baseline for:** the machine's safety case, hazard register, independence certification, stored-energy analysis, and responsible-deployment framing

> **Authoring note (harvest-and-ratify doctrine).** Consistent with the P0 doctrine and the configuration-control policy: this document **harvests rather than rewrites**. It consolidates the M15 safety architecture (the nine-part theory, the defense-in-depth layers M15 certified, the two-domain stored-energy analysis, the independence certification, the responsible-deployment framing) into one configuration-controlled safety baseline. It reasons over **Doc C's enumerated stored-energy hardware** (fluid relief/bleed-down, battery) and applies **Doc G's evidence-admissibility rules** (a safety claim is only as strong as the validated rung under it). It introduces **no new safety architecture**, it makes the M15 safety case concrete and citable. Values are `[RATIFIED-EST]` or `[TBD-EXT]`; the specific functional-safety standard and risk-acceptance thresholds are `[TBD-EXT]` on the regulatory/deployment context. Educational authority remains in M15; engineering authority over the safety case lives here.

---

## 1. Purpose, Scope & Authority

### 1.1 Purpose
Doc E is the single source of truth for **whether the machine is safe, and how that is argued**. The curriculum established (M15) that safety is not a feature but an explicit, evidence-backed, falsifiable argument that residual risk is acceptable (EI-15). Doc E is where that argument becomes a configuration-controlled artifact: the hazard register, the defense-in-depth safety case (claim -> argument -> evidence), the certification of the safety monitor's independence, the two-domain stored-energy analysis, the residual-risk statement, and the responsible-deployment framing. When any artifact asserts "the machine is safe," Doc E is the citation, and it states, honestly, what is certified, what is field-mandatory, and what residual remains.

### 1.2 Scope
In scope: the risk-ranked hazard register; the defense-in-depth safety case structure and the certification of each layer; the independence / common-cause analysis of the safety monitor; the stored-energy analysis across both domains (fluid + electrical); the residual-risk statement and acceptability argument; human-interaction and maintenance safety; the responsible-deployment analysis (labor, worker safety, environment, data, accountability, where-not-to-operate); and the incident-response framing.

Out of scope (owned elsewhere): requirements and ratified safety parameters (**Doc B**, Doc E argues the machine meets them); the stored-energy *hardware* itself (**Doc C**, Doc E reasons about it); the evidence *fidelity rules* (**Doc G**, Doc E consumes them); the V&V *evidence* that populates the safety case (**M14**, Doc E is the argument that evidence supports); detailed component derivations (**Doc F**). Doc E is the **safety argument**; the evidence it cites lives in the twin (Doc G), the hardware (Doc C), and the V&V campaign (M14).

### 1.3 Authority
Doc E holds **engineering authority over the safety case and its residual-risk claims**. It is consistent with Doc B (it argues the SR-S/SR-E requirements are met), Doc C (it reasons over the enumerated hazards), and Doc G (its evidence rides validated rungs) by construction. It is a **living document** (DD-96): field incidents update the hazard register and the case (safety growth). The specific functional-safety standard it aligns to is `[TBD-EXT]` on the deployment context; the *structure* (goal-structured claim-argument-evidence with explicit residual) is fixed.

### 1.4 The safety thesis (from M15)
Safety is the **composition** of the machine's defense-in-depth mitigations plus the **argument** that, given the evidence, the residual risk is acceptable. The composition was built across the course (physical bounds EI-09, bounded learner EI-07, independent monitor EI-11, envelope limits EI-10/EI-12); M15 certified it; Doc E is the argument, made to be reviewed and attacked (EI-15). "We added guards" is not an answer to "is it safe?", "here is the hazard, the mitigation, the evidence and its fidelity, and the residual, and here is why that residual is acceptable" is.

---

## 2. Hazard Register (risk-ranked)

### 2.1 Method
Hazards are enumerated across three targets, **people**, **fruit** (economic), and **the machine/property**, including *combined* faults (both stored-energy domains) and *adversarial* conditions (EI-14). Each is ranked by **risk = severity × likelihood** (SR-S-03, DD-90); likelihood draws on the M14 FMEA/reliability data. The register is the coverage-complete basis of the safety case; a hazard missed here is a hazard unmitigated.

### 2.2 The register (reference: populated by the M14 FMEA)
| ID | Hazard | Target | Severity | Likelihood | Risk | Primary mitigation |
|----|--------|--------|:--------:|:----------:|:----:|--------------------|
| HZ-01 | Arm/payload strikes or crushes a person | People | High | Low* | **High** | Exclusion zone + independent monitor + physically-safe behavior (Section 4) |
| HZ-02 | Platform tip-over on slope near a person | People | High | Low* | **High** | Slope envelope (≤12°) + stability margin + envelope enforcement |
| HZ-03 | Fluid stored-energy release (burst/sudden) | People/machine | Med-High | Low | **Med-High** | Relief, burst rating, bleed-down, guarding (Doc C Section 3.2) |
| HZ-04 | Battery stored-energy release (arc/fire/thermal) | People/machine | High | Low | **Med-High** | Fusing, isolation, thermal mgmt, safe-shutdown (Doc C Section 3.6) |
| HZ-05 | **Combined** stored-energy fault (electrical -> fluid, or collision breaching both) | People/machine | High | Very Low | **Med** | Two-domain joint analysis (Section 3); common-cause review (Section 5) |
| HZ-06 | Grip crushes/bruises fruit (economic) | Fruit | Low | Med | **Med** | Grip-force window + mechanical relief (CEC-02/EI-09) |
| HZ-07 | Unbounded learned action (grasp/nav out of bounds) | People/fruit/machine | Med-High | Low | **Med** | Bounded learner + independent monitor (EI-07/EI-11) |
| HZ-08 | Pinch/crush at maintenance (stored energy not bled) | People (operator) | High | Low | **Med-High** | Lockout/tagout + bleed-down procedure (Section 6) |
| HZ-09 | Collision with obstacle/person during drive | People/machine | Med-High | Low | **Med** | Human detection (monitored layer) + safe-stop + bounded speed |

*Likelihood is *low by design* precisely because of the mitigations; the register records residual likelihood **after** the defense-in-depth is credited (Section 4), with the honest caveat that credit is only earned once the layer is certified on admissible evidence (Doc G).

### 2.3 The dominant risk
Applying the dominant-term discipline (EI-05) to *risk*: the **human-harm hazards (HZ-01/02)** dominate by severity, and the **stored-energy hazards (HZ-03/04/05)** by combined severity × the difficulty of certifying independence. Safety effort concentrates there (Section 4, Section 5), not on the low-risk items, the same "attack the dominant term" logic the course used for accuracy, energy, reliability, and cost, now for risk.

---

## 3. Stored-Energy Analysis (two domains)

### 3.1 The two domains (Doc C hardware)
The machine stores energy in **pressurized fluid** (Doc C Section 3.2, compressor/pump, actuator, lines) and in the **battery** (Doc C Section 3.6, 3 to 5 kWh). Each is a hazard (burst/sudden release; arc/fire/thermal), and, critically, a single fault could involve **both** (HZ-05): an electrical fault energizing a valve, or a collision breaching both. The safety case treats them **together**, not as two separate problems (a common-cause concern, Section 5).

### 3.2 Fluid domain (SR-S-01)
| Aspect | Mitigation | Hardware (Doc C) |
|--------|-----------|------------------|
| Overpressure / burst | Burst-rated components; **mechanical relief** caps pressure | Section 3.2 relief |
| Sudden release | **Bleed-down** on shutdown/service; guarding | Section 3.2 bleed-down |
| Stored energy at service | Lockout + bleed before maintenance (Section 6) | procedure |

The **mechanical relief is dual-purpose**: a stored-energy hazard component *and* the machine's fastest safety mitigation (physics-speed grip-force bound, EI-09), a duality the case states explicitly (Section 4.2).

### 3.3 Electrical domain (SR-S-02)
| Aspect | Mitigation | Hardware (Doc C) |
|--------|-----------|------------------|
| Over-current / short | Fusing, over-current protection, split rails | Section 3.6 protection |
| Arc / fire / thermal | Isolation, thermal management, safe-shutdown | Section 3.6 |
| Stored energy at service | Isolation + lockout before maintenance (Section 6) | procedure |

### 3.4 Combined-fault analysis (HZ-05)
The joint analysis asks: can one fault release both domains, or can one domain's fault trigger the other? Mitigations: physical/electrical separation of the domains where feasible; the safety-first power sequencing (Doc C Section 3.6, DD-74) that de-energizes actuation on fault; and the common-cause review (Section 5) that ensures no single fault defeats both the function and its guard across domains.

---

## 4. Defense-in-Depth Safety Case

### 4.1 Structure (goal-structured, claim -> argument -> evidence)
The safety case is a structured argument (SR-S-05, DD-92): a top **claim** ("residual risk is acceptable for the defined operation"), decomposed into sub-claims per hazard (Section 2), each supported by an **argument** (the mitigation) and **evidence** (from M14, at its validated fidelity per Doc G), with **residual risk** and **assumptions/limits** stated. It is falsifiable, built to be attacked (EI-15).

### 4.2 The certified layers
Each defense-in-depth layer, with what certifies it (SR-S-05):

| Layer | Mechanism | Certified by | Anchor |
|-------|-----------|--------------|--------|
| **Physical bounds** | Mechanical relief caps grip < F_bruise at physics speed; passive compliance yields | Relief test + durability (M14); holds after wear | **EI-09** |
| **Independent monitor** | Can safe-stop/release regardless of mission logic; HW controller | Independence (Section 5) + reaction time ≤ 200 ms (fault injection, M14) | **EI-11** |
| **Bounded learner** | Learned outputs clipped to verified bounds; deterministic fallback | Bounds hold under adversarial + fault conditions (M14) | **EI-07** |
| **Envelope limits** | Machine refuses/degrades outside safe envelope (slope, thermal) | Envelope-edge validation (M14) | **EI-10/EI-12** |

Defense in depth means **no single failure defeats safety**, the case must show this for each hazard, which is exactly why independence (Section 5) is the load-bearing certification.

### 4.3 The physics-speed guarantee (why EI-09 is special)
The mechanical relief and passive compliance act at **physics speed**, effectively zero reaction latency for the grip-force hazard, providing a margin the software monitor cannot. The reaction-time requirement $L_\text{detect}+L_\text{react}\le T_\text{harm}$ (SR-P-36, ≤ 200 ms software) is *backstopped* by a physics-speed bound that needs no detection at all. Where physics provides the guarantee, the case rests on the strongest possible evidence (a physical law, not a software timing argument).

### 4.4 Evidence admissibility (Doc G rules applied)
Every safety claim rides a **validated fidelity rung** (Doc G Section 8): a claim verified only in an unvalidated or under-fidelity twin is **inadmissible**. In particular, the fidelity-sensitive and adversarial safety claims, human-interaction (HZ-01/09), stored-energy (HZ-03/04/05), monitor reaction (HZ-07), are **field/HIL-mandatory** (Doc G rungs R5/R6), not twin-provable. The safety case states, per claim, the evidence, its rung, and its validation status, and flags what remains field-mandatory and ungathered.

---

## 5. Independence & Common-Cause Certification (the load-bearing claim)

### 5.1 Why independence is the crux
The entire defense-in-depth rests on the safety monitor being **independent**, able to stop the machine *regardless* of what fails elsewhere (EI-11, SR-S-04). Independence is easy to claim and easy to violate quietly (a shared clock, a shared power rail, a shared assumption). If the monitor shares a failure mode with what it guards, the layers are not independent and the residual-risk math (Section 6) collapses. This is the safety case's most important thing to rule out.

### 5.2 The dependency trace
Independence is certified by tracing the monitor's dependencies and showing none is common-cause with the mission logic or the hazard source (or, where shared, that it is itself protected):

| Dependency | Monitor's source | Shared with mission? | Resolution |
|------------|------------------|----------------------|------------|
| **Compute** | Minimal **HW safety controller** (Doc C Section 3.7), software-independent | No, separate from the Jetson | Breaks the software common-cause (DD-64) |
| **Power** | Safety-first sequenced rail (Doc C Section 3.6, DD-74); monitor up before actuators | Partially (battery) | Protected: monitor's rail prioritized; brownout de-energizes actuation, not the monitor |
| **Clock** | Independent timing | No | Verified separate |
| **Inputs/sensing** | Direct hazard sensing where possible | Partially | Monitor uses independent sensing for its safe-stop trigger |
| **Assumptions** | Minimal, explicit |, | Reviewed for hidden shared assumptions |

### 5.3 Common-cause failure (CCF) review
A **CCF** is one fault disabling both a function and its guard. The review (SR-S-04) systematically searches the defense-in-depth layers for shared power, clock, compute, sensing, and assumptions. The HW safety controller (Doc C Section 3.7) exists precisely to break the last software dependency. Any CCF found is fixed (restore independence) or explicitly carried into the residual (Section 6) with its probability. **Until the dependency trace is run on built hardware, independence is certified in method, not yet in verdict** (honest limit).

### 5.4 Residual-risk composition (why independence matters quantitatively)
With independent layers of failure probabilities $p_i$, the probability a hazard reaches harm is $\prod_i p_i$, *only if the layers are independent*. Common-cause breaks the product (layers fail together), so the residual is dominated by common-cause terms. The safety case shows the residual is acceptably low **and** that the low number does not secretly rest on an unverified independence assumption (Doc G: the independence evidence must itself be admissible).

---

## 6. Residual Risk, Human & Maintenance Safety

### 6.1 Residual-risk statement (SR-S-06)
No machine is zero-risk. The case states residual risk **explicitly**, a nonzero value argued acceptable, rather than implying zero, because an honest small residual is trustworthy where a claimed zero is not (EI-15). Acceptability is a judgment informed by likelihood × severity, by *who bears the risk* (a worker did not consent as an operator did), and by comparison to the status quo (manual harvest has its own risks). Residual-risk acceptance thresholds are `[TBD-EXT]` on the functional-safety standard and deployment context.

### 6.2 Human-interaction safety (SR-S-07)
People share the field; the strategy (TS-29: **defense in depth, exclusion zone + human detection + physically-safe behavior**) ensures no single layer failing permits harm:
- **Exclusion zone**, administrative keep-clear during autonomous operation.
- **Human detection**, a *monitored layer*, never the sole safeguard (it is an opaque learned component with a nonzero false-negative rate, stated not hidden).
- **Physically-safe behavior**, bounded speed/force, compliance, predictable motion, the independent monitor.

Pure close human-robot collaboration is **not certified at this stage** (a candid limit, EI-15), certifying safety for close proximity with opaque perception exceeds what the evidence can support.

### 6.3 Maintenance safety (SR-S-07)
Servicing a machine with two stored-energy domains requires: **lockout/tagout**, **bleed-down of fluid pressure** (Doc C Section 3.2), **electrical isolation** (Doc C Section 3.6), and defined safe states before any component is touched (HZ-08). These procedures are part of the safety case, not an operations afterthought.

### 6.4 Incident response & living case (DD-96)
The safety case is **living**: a defined incident-response plan (how a harm is detected, stopped, reported, investigated, fixed) feeds the hazard register and case updates, safety growth. A field incident is not just an operations event; it is evidence that updates the argument.

---

## 7. Responsible Deployment (SR-E-01/02)

Engineering evidence cannot settle whether the machine *should* deploy. The responsible-deployment analysis (M15 Section 6.8) weighs, and Doc E documents:

| Dimension | Consideration | Design/operating response |
|-----------|---------------|---------------------------|
| **Labor** | Displaces/changes/concentrates agricultural work | Documented honestly; service model (M16 TS-31) widens access |
| **Worker safety** | People share the field; depend on design they can't see | Human-interaction safety (Section 6.2); their safety is designed-in |
| **Environment** | Energy source, materials, lifecycle footprint | LCA reconciled with cost (SR-S-08, M16) |
| **Data & accountability** | Machine collects land/yield/possibly-people data; who's accountable on failure | Data governance + accountability framing; incident response (Section 6.4) |
| **Distributive effects** | Capability concentrated in those who can afford it | Service/co-op models; small-grower access (M16) |
| **Where not to operate** | Conditions/proximities the machine should refuse | **Runtime-enforced operating limits** (SR-E-02), bounding *out* is a design decision |

The engineer's professional responsibility (ABET SO4) is to *face* these, not externalize them. Doc E presents contested questions (labor especially) with the strongest cases on multiple sides, it equips the reasoning and bounds the operation; it does not preach a single verdict.

### 7.1 Where-not-to-operate (runtime-enforced)
SR-E-02 makes the ethics concrete: the machine's operating limits (envelope, proximity to people) are **enforced at runtime** by the safety monitor (Doc C Section 3.7) and power/thermal management, not merely documented. The where-not-to-operate bound is an enforceable safety property, closing the loop between the ethics analysis and the machine's behavior.

---

## 8. Traceability (safety requirement -> mitigation -> evidence)

| Requirement | Mitigation (Section) | Evidence rung (Doc G) | Hardware (Doc C) |
|-------------|----------------|------------------------|------------------|
| SR-S-01 (fluid stored energy) | Section 3.2 relief/bleed/burst | R3/R5 + field | Section 3.2 |
| SR-S-02 (battery stored energy) | Section 3.3 fusing/isolation/thermal | R5 + field | Section 3.6 |
| SR-S-03 (hazard register) | Section 2 risk-ranked register | R6 (FMEA data, M14) |, |
| SR-S-04 (monitor independence) | Section 5 dependency trace + CCF | R5/R6 fault injection | Section 3.7 HW controller |
| SR-S-05 (defense-in-depth certified) | Section 4 certified layers | R3 to R6 per layer | Section 3.1/3.2/3.5 |
| SR-S-06 (residual stated) | Section 6.1 explicit residual | R6 |, |
| SR-S-07 (human/maintenance safety) | Section 6.2/6.3 | R5/R6 + procedure | Section 3.2/3.6 |
| SR-E-01 (responsible deployment) | Section 7 analysis | review |, |
| SR-E-02 (where-not-to-operate) | Section 7.1 runtime enforcement | R5 + review | Section 3.7 monitor |

Every safety/ethics requirement traces to a mitigation, the fidelity rung that must supply its admissible evidence, and (where physical) the Doc C hardware, the B<->C<->E<->G loop closed for safety.

---

## 9. Conflict-Register Status

All seven conflicts (CR-01...07) were closed across the curriculum and the P0 set (Doc B closed CR-02/06/07; Doc G closed CR-03; Doc C completed CR-06; CR-01/04/05 resolved in-curriculum). Doc E introduces no new conflicts; it *consumes* the resolved baseline, the hybrid actuation (CR-01) supplies the fluid relief that is both hazard and mitigation; the fluid subsystem (CR-06) is now in the hazard analysis; the perishable safety values (CR-07) are ratified in Doc B and carried here.

---

## 10. Baseline & Change Control

- **Baseline status:** Doc E **Rev 1.0, frozen configuration-controlled baseline (approved).** The controlling safety baseline; revision-controlled and, per DD-96, a **living document** that updates with field incidents.
- **Consistency:** argues Doc B's SR-S/SR-E requirements are met; reasons over Doc C's stored-energy hardware; rides Doc G's validated evidence rungs. No new safety architecture, harvested from M15.
- **Dependencies:** the specific functional-safety standard and risk-acceptance thresholds are `[TBD-EXT]` on the regulatory/deployment context; the independence *verdict* awaits the dependency trace on built hardware; the fidelity-sensitive safety evidence (human-interaction, stored-energy, reaction time) is field/HIL-mandatory (Doc G R5/R6) and specified-not-gathered.
- **What changes when evidence arrives:** a claim's status moves from "argued on estimate" to "certified on admissible evidence"; the residual updates; the living case and hazard register incorporate incidents. The *structure*, hazard register, defense-in-depth case, independence certification, responsible-deployment framing, is stable.

---

## Concise quality summary (honest self-assessment)

**Strengths.** Doc E turns the M15 safety architecture into a configuration-controlled, citable safety baseline entirely by **harvesting**, the nine-part safety theory, the four certified defense-in-depth layers, the two-domain stored-energy analysis, the independence certification, and the responsible-deployment framing, with **no new architecture**. It is properly wired into the frozen P0 set: it **reasons over Doc C's enumerated stored-energy hardware** (fluid relief/bleed-down, battery), applies **Doc G's evidence-admissibility rules** (safety claims ride validated rungs; fidelity-sensitive claims are field/HIL-mandatory), and argues **Doc B's SR-S/SR-E requirements** are met, the B<->C<->E<->G loop closed for safety (Section 8). It centers the **independence / common-cause certification** as the load-bearing claim (Section 5) with a concrete dependency trace, treats the two stored-energy domains **jointly** (Section 3), states **residual risk explicitly** (Section 6.1, honest nonzero over claimed zero), makes **where-not-to-operate a runtime-enforced property** (Section 7.1) rather than a documented aspiration, and applies the dominant-term discipline to *risk* (Section 2.3). It is a **living document** (incident-response feeds the case) and presents contested ethics fairly (SO4) without preaching.

**Known weaknesses / items for your review.**
1. **The functional-safety standard and risk-acceptance thresholds are `[TBD-EXT]`.** They depend on the regulatory/deployment context; the safety-case *structure* (goal-structured claim-argument-evidence with explicit residual) is fixed, the specific standard and numeric thresholds are not.
2. **Independence is certified in method, not verdict.** Whether a real common-cause exists (shared power/clock/assumption) awaits the dependency trace on built hardware (Section 5.3); the method to find and break it is exact.
3. **The strongest safety evidence is field/HIL-mandatory and specified-not-gathered**, human-interaction, stored-energy, and reaction-time certification await hardware and field trials (Doc G R5/R6); Doc E builds the argument structure and states what evidence each claim needs.
4. **The hazard register's likelihoods are post-mitigation estimates** pending the M14 FMEA data; the register structure and the dominant-risk judgment are sound, the specific likelihoods await reliability data.
5. **Responsible-deployment framing equips reasoning; it does not dictate a verdict**, a deliberate stance (fair presentation of contested questions), flagged so you can tune emphasis for your context.

I have not scored this against the 9.5 bar, that judgment is yours. Items 2 to 3 (independence verdict, field-mandatory evidence) are the real safety critical-path, the same hardware bring-up and pilot that Doc C/Doc G depend on.

**END OF DOC E, frozen Rev 1.0.**
