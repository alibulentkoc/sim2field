# Module 14: Verification, Validation & Reliability

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M14, **Part VI, Prove**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** HIL -> Prototype -> Field (evidence generation)
**Prerequisites:** M1 (requirements, spine, cycle-time budget CEC-01), M5 (error budget CEC-03, EI-05 dominant-term method), M9 (grasp/bruise outcomes, CR-03), M10 (operating envelope, EI-10), M11 (safety architecture, fault injection), M12 (envelope-edge operating point, EI-12), M13 (integrated machine, validated twin as evidence source, CEC-06). Math: probability, statistics, reliability/failure analysis.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 13**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **proves** the machine: it verifies requirements, validates against the field, and analyzes reliability, drawing on the **validated twin as an evidence source (CEC-06)** established in M13. The **CEC set is treated as complete** (six anchors); this module mints **no new CEC** and applies existing ones. P0-document authority tagged **[->Doc B/C/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-14** and the module's **Engineering Design Review**.

> *Core concept in use.* This module closes the loop on **every budget the course set**: it verifies the placement budget (**CEC-03**) is met, the grasp stays in the window (**CEC-02**), the cycle time holds (**CEC-01**), and the power/thermal envelope is satisfied (M12), using twin, HIL, and field evidence at the fidelity each claim requires (**CEC-06**). Verification is where the spine's promises are checked, not asserted.

---

## 1. Module Overview

**Mission.** Verification, validation, and reliability are the disciplines that convert design intent and simulation results into defensible evidence: verification asks "did we build the machine right?" (does it meet its requirements?), validation asks "did we build the right machine?" (does it do the job in the real field?), and reliability asks "will it keep working?" (how often does it fail, and how does it degrade over a season?).

**Previous milestone.** A machine that should work and a machine that is proven to work are separated by this module. The course has been accumulating the raw material all along: every module wrote requirements with verification methods; every module set a budget (placement, cycle-time, grasp-force, power, thermal); Module 13 produced the validated twin as an evidence source.

**Engineering problem.** This module organizes that material into a coherent verification and validation campaign: it maps each requirement to the evidence that proves it, and, crucially, to the fidelity rung (CEC-06) that evidence lives on. A requirement about reach can be verified in a kinematic twin; a requirement that the grasp will not bruise cannot be verified below the validated contact rung and, ultimately, field data. Knowing which evidence is admissible for which claim is the discipline that keeps a V&V campaign honest.

**Design tension.** Reliability adds the dimension of time and repetition. A machine that grasps one melon perfectly must grasp thousands across a season, in dust and heat and wear. This module analyzes failure modes, estimates failure rates, and, applying the course's dominant-term discipline (EI-05) to reliability, identifies the dominant failure mode and attacks it, because reliability effort spent anywhere but the dominant risk barely moves the number.

**What this module resolves.** It treats a subtle truth the whole course has circled: a metric measured on a comfortable test set lies about field performance. The module's Engineering Insight is that validation must be adversarial, you prove a machine by trying to break it across the operating envelope's hard cases, not by demonstrating it on the easy ones, because the field will run the adversarial test whether or not you did.


## 2. Learning Objectives

- **LO-M14.1** Distinguish verification (meets requirements) from validation (does the real job) and structure a V&V campaign mapping requirements to evidence., *Bloom: Create*
- **LO-M14.2** Match each requirement's evidence to the appropriate fidelity rung (twin/HIL/field) and argue its admissibility (CEC-06)., *Bloom: Evaluate*
- **LO-M14.3** Design statistically sound test plans (sample size, coverage of the envelope) for performance claims (grasp success, placement, cycle time)., *Bloom: Create (with Analyze)*
- **LO-M14.4** Analyze reliability: failure modes (FMEA), failure-rate estimation, and identify/attack the dominant failure mode (EI-05)., *Bloom: Analyze*
- **LO-M14.5** Design adversarial validation across the operating envelope's edges rather than nominal demonstrations (EI-14/EI-10)., *Bloom: Create (with Evaluate)*
- **LO-M14.6** Verify the composed budgets (CEC-01/CEC-03, power/thermal) with field-representative evidence., *Bloom: Evaluate*
- **LO-M14.7** Specify the V&V role of the validated twin and where hardware/field evidence is mandatory., *Bloom: Create*

Maps to course objectives **LO7** (primary), **LO1/all** (integrative), and ABET **SO1, SO2, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Build a requirements-to-evidence V&V matrix., *Bloom: Create*
2. Assign the right fidelity rung to each verification claim and defend admissibility., *Bloom: Evaluate*
3. Design a statistically sound, envelope-covering test plan., *Bloom: Create*
4. Perform an FMEA and find/attack the dominant failure mode., *Bloom: Analyze*
5. Design adversarial validation that tries to break the machine., *Bloom: Create*
6. Verify composed budgets with field-representative data., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1 warned that the failures which end field-robot programs are rarely the ones caught in the lab, they are the reliability failures that accumulate over a season and the validation failures that appear only in the real field. This module exists because **a claim without admissible evidence is an opinion**, and a machine deployed on opinions harms fruit, wastes a grower's season, and, where it moves a heavy payload near people, endangers them.

The motivation sharpens around three honesties. First, the honesty of *evidence*: it is tempting to verify a requirement with whatever is cheapest, a low-fidelity simulation, a bench demo, a single lucky field run, but a grasp-will-not-bruise claim proven only in a kinematic twin is not proven at all (CEC-06). The V&V campaign must match evidence to claim, and admit where only field data will do. Second, the honesty of *statistics*: "it worked in the demo" is a sample of one; a machine that must grasp thousands of melons needs test plans with enough samples, across enough of the envelope, to bound the real success rate, and to state the confidence honestly. Third, the honesty of *adversarial validation*: a machine demonstrated on the easy row proves only that it can do the easy row. The field will present the sloped, dusty, occluded, worst-case row (EI-10), so validation must go looking for failure there deliberately, because the alternative is letting the field find it first, at the grower's expense.

Reliability adds the motivation of *scale and time*. One perfect grasp is an anecdote; a season of grasps is the product. Failure modes that are negligible per-cycle become certain over ten thousand cycles; wear, dust, heat, and vibration degrade what was fine on day one. The dominant-term discipline the course used for accuracy and energy (EI-05) applies again: find the failure mode that dominates the machine's downtime or damage, and attack *it*, because a program that hardens the wrong failure mode spends effort without buying reliability. The motivation for this module is that the field is the final examiner, and it grades on evidence, statistics, and a full season, so the machine must be proven the way the field will test it.

---

## Engineering Failure Cases (V&V-and-reliability-specific)

Sharpening Module 1's classes at the proving stage:

- **Inadmissible evidence.** A requirement is "verified" on a fidelity rung too low for the claim; the machine fails in the field the sim said it passed. *Motivates* evidence-to-fidelity matching (Section 6.2, CEC-06).
- **Undersized test.** A success rate is claimed from too few samples over too little of the envelope; the true field rate is worse. *Motivates* statistically sound, envelope-covering test plans (Section 6.3, Section 7.1 to 7.2).
- **Dominant-failure blind spot.** Reliability effort hardens a minor failure mode while the dominant one drives downtime/damage. *Motivates* FMEA and dominant-mode attack (Section 6.4, EI-05).
- **Demo-not-validation.** The machine is shown on easy rows; the hard cases were never tested. *Motivates* adversarial validation across the envelope (Section 6.5, EI-14/EI-10).
- **Wear/drift over a season.** Day-one performance degrades as components wear, filters clog, calibration drifts. *Motivates* durability/reliability-growth testing (Section 6.6).

Each is prevented by an honest V&V or reliability discipline.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** probability and statistics (distributions, confidence intervals, sample size, hypothesis testing); the M1 requirements and cycle-time budget (CEC-01); the M5 error budget (CEC-03) and EI-05 dominant-term method; the M9 grasp/bruise outcomes and CR-03; the M10 operating envelope (EI-10); the M11 safety architecture and fault injection; the M12 envelope-edge operating point (EI-12); the M13 integrated machine and *validated twin as evidence source* (CEC-06).

**Introduced here, used later:** the vocabulary of V&V and reliability, *verification vs. validation, requirement-to-evidence traceability, evidence admissibility, test plan, sample size/confidence, coverage, FMEA (failure modes and effects), failure rate, MTBF, reliability growth, durability, adversarial/edge-case validation, acceptance criteria*. Developed at applied (L2) depth; formal reliability engineering is referenced [->Doc H].

**Where this sits in the dependency graph.** M14 depends on all prior modules (their requirements and budgets) and especially M13 (the validated twin/evidence). It **masters** the V&V and reliability threads; it **applies** CEC-01/CEC-02/CEC-03 (verifies the budgets), CEC-06 (evidence admissibility per rung), EI-05 (dominant failure mode), EI-10/EI-12 (envelope-edge validation). It hands forward: the verification evidence and reliability analysis to M15 (the safety case builds on V&V) and M16 (reliability drives cost/deployment economics); and to M17 (the capstone's acceptance criteria).

---

## 6. Theory

### 6.1 Verification vs. validation
**Verification** confirms the machine meets its *specified requirements* ("did we build it right?"), each requirement from M1 onward has a verification method (analysis, test, review, demonstration). **Validation** confirms the machine does its *actual job in the real field* ("did we build the right thing?"), it tests against the mission and the grower's need, not just the spec, and can reveal that a met requirement was the *wrong* requirement. Both are needed: a machine can pass verification (meets spec) and fail validation (spec didn't capture the field).

### 6.2 Evidence, admissibility, and fidelity (CEC-06 applied)
Every verification claim rests on *evidence*, and evidence has a **fidelity**. A claim is only as strong as the rung its evidence lives on: reach -> kinematic twin; stability -> dynamic twin; grasp-will-not-bruise -> *validated contact rung and field data* (CR-03/CEC-06); timing -> HIL under load. The V&V campaign builds a **requirement-to-evidence matrix** that names, for each requirement, the evidence *and its fidelity rung*, and flags where only hardware/field data is admissible. This is CEC-06 as the backbone of verification: an unvalidated or under-fidelity twin result is not admissible evidence.

### 6.3 Statistically sound test planning
A performance claim (grasp success rate, placement 3σ, cycle time) is a *statistical* claim and needs a test plan: **sample size** sufficient to bound the metric to a stated confidence, and **coverage** of the operating envelope (fruit variability, slope, light, dust) so the sample represents the field. A success rate $\hat p$ from $n$ trials has a confidence interval that narrows with $n$; claiming a high reliability requires many trials (and, for rare failures, either very large $n$ or accelerated/edge-case testing). "It worked in the demo" is $n=1$ with no coverage, not evidence.

### 6.4 Reliability and the dominant failure mode (EI-05 applied)
**Reliability** is the probability the machine performs over time/cycles without failure. Analysis proceeds by **FMEA** (enumerate failure modes, their effects, likelihood, and detectability), **failure-rate estimation** (per-cycle or per-hour rates -> MTBF), and, the key judgment, **identifying the dominant failure mode**: the one contributing most to downtime, damage, or missed harvest. The dominant-term discipline (EI-05) says attack *it*: a given reliability effort moves the machine's overall failure rate most when aimed at the dominant mode. Reliability grows by iterating (test -> find dominant mode -> fix -> retest, reliability growth).

### 6.5 Adversarial validation across the envelope (the insight)
Validation that only demonstrates success proves little; **adversarial validation** deliberately seeks the conditions that break the machine, the envelope's edges (EI-10): steepest slope, worst light, densest occlusion, most variable fruit, dustiest air, most-worn state. You design tests to *fail* the machine, find where it fails, and either fix it or bound the envelope honestly. This is the difference between a demo and a proof: the field runs the adversarial test regardless, so the engineer must run it first.

### 6.6 Durability and reliability growth over a season
A season is thousands of cycles under wear, dust, heat, and vibration. Durability testing (accelerated life, sustained operation, environmental) reveals modes that day-one testing cannot: calibration drift (re-inflating the placement budget, CEC-03), filter clogging (thermal, M12), seal wear (fluid, M9), fastener loosening (vibration). Reliability is *grown* across iterations, and the machine's acceptance is a reliability target over a representative season, not a single good day.

### 6.7 Composed-budget verification with field evidence
Module 13 verified the budgets composed in the twin; this module verifies them with **field-representative evidence**: the placement 3σ measured across real fruit and conditions (CEC-03), the cycle time under real load (CEC-01), the power/thermal margin on a hot dusty day (M12/EI-12). Where the twin is validated (CEC-06), it supplies much of this; where it is not, field data is mandatory. The verified budgets, with their evidence and fidelity, are the core of the acceptance argument (->M15/M16).

---

## 7. Mathematics

Rigor tier for M14: **L2**. Central results: test-plan sample size/confidence, and reliability/failure-rate composition.

### 7.1 Success-rate confidence
For a grasp success rate, $\hat p = s/n$ from $s$ successes in $n$ trials; the confidence interval width scales $\sim\sqrt{\hat p(1-\hat p)/n}$ (use an exact/binomial interval for small $s$ or extreme $\hat p$). To *demonstrate* a high reliability $R$ with confidence $1-\alpha$ and zero failures, $n \ge \ln(\alpha)/\ln(R)$. *Use:* size the validation campaign; show why "99% reliable" needs hundreds of trials, not a demo.

### 7.2 Coverage and stratified testing
Partition the envelope (slope × light × fruit-size × dust) into strata; allocate samples so each stratum, especially the hard edges (EI-10/EI-14), is represented. *Use:* a success rate that is *representative*, not biased toward easy conditions.

### 7.3 Reliability, failure rate, and the dominant mode (EI-05)
System failure rate (series approximation) $\lambda_\text{sys}\approx\sum_i \lambda_i$; MTBF $=1/\lambda_\text{sys}$; reliability over $t$: $R(t)=e^{-\lambda_\text{sys}t}$. Rank $\{\lambda_i\}$; the largest is the **dominant failure mode**, and $\partial\lambda_\text{sys}/\partial\lambda_i$ is largest there, so a fractional reduction of the dominant mode moves $\lambda_\text{sys}$ most. *Use:* direct reliability effort quantitatively (EI-05 in the reliability domain). **Grad (L3):** distinguish per-cycle vs. per-time modes and wear-out (increasing hazard) from random failures.

### 7.4 Composed-budget verification with uncertainty
Report each verified budget (placement 3σ, cycle time, power/thermal margin) with its *evidence fidelity* and a confidence/margin. A budget "met" in an unvalidated twin (CEC-06) is reported as such, not as field-proven. *Use:* an honest acceptance table where every claim carries its evidence rung.

---

## 8. Engineering Principles

1. **Verify against the spec, validate against the field**, both, and know which you're doing.
2. **Evidence has fidelity** (CEC-06): a claim is only as strong as the validated rung under it.
3. **Statistics, not anecdotes**, size the test to the claim; state the confidence.
4. **Cover the envelope, especially its edges** (EI-10), a representative sample, not an easy one.
5. **Find and attack the dominant failure mode** (EI-05), reliability effort pays only where the failures are.
6. **Validate adversarially** (EI-14): try to break it before the field does.
7. **Prove a season, not a day**, reliability is grown and demonstrated over representative time.

---

## 9. System Requirements

Derived from the proving mission; verify all prior budgets. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-V-05 | Verification | Every top-level requirement shall map to admissible evidence at the appropriate fidelity rung (CEC-06). | Requirement-to-evidence matrix review |
| SR-V-06 | Verification | Grasp success and no-bruise rates shall be validated to a stated target and confidence across the envelope. | Statistical field/HIL test |
| SR-V-07 | Verification | Placement (CEC-03), cycle-time (CEC-01), and power/thermal (M12) budgets shall be verified with field-representative evidence. | Measurement + analysis |
| SR-R-01 | Reliability | An FMEA shall identify failure modes and the dominant mode; the design shall attack the dominant mode to a reliability target (EI-05). | FMEA + reliability-growth test |
| SR-R-02 | Reliability | The machine shall meet a reliability/durability target over a representative season (wear, dust, heat, vibration). | Durability/accelerated-life test |
| SR-V-08 | Verification | Validation shall include adversarial testing at the operating-envelope edges (EI-14/EI-10). | Edge-case test campaign |
| SR-I-19 | Interface | V&V evidence and reliability analysis shall feed the safety case (M15) and cost/deployment (M16). | Review |

Traceability: SR-V-05 -> CEC-06; SR-V-06/07 -> CEC-01/02/03, M12; **SR-R-01 -> EI-05**; SR-R-02 -> durability; SR-V-08 -> EI-10/EI-14; SR-I-19 -> M15/M16.

---

## 10. Design Decisions

- **DD-83 Requirement-to-evidence matrix with fidelity tags** (CEC-06). *Rationale:* Section 6.2; admissible evidence per claim. *Serves:* SR-V-05.
- **DD-84 Statistically sound, envelope-stratified test plans.** *Rationale:* Section 6.3/Section 7.1 to 7.2; representative, confidence-bounded claims. *Serves:* SR-V-06/07.
- **DD-85 FMEA + dominant-failure-mode attack** (EI-05). *Rationale:* Section 6.4/Section 7.3; reliability effort where it pays. *Serves:* SR-R-01.
- **DD-86 Durability / reliability-growth testing over a representative season.** *Rationale:* Section 6.6; prove time, not a day. *Serves:* SR-R-02.
- **DD-87 Adversarial validation at envelope edges** (EI-14). *Rationale:* Section 6.5; break it first. *Serves:* SR-V-08.
- **DD-88 Twin-as-evidence where validated; field-mandatory where not** (CEC-06). *Rationale:* Section 6.2/Section 6.7; honest evidence sourcing. *Serves:* SR-V-05/07.
- **DD-89 Composed-budget acceptance table with evidence fidelity.** *Rationale:* Section 6.7/Section 7.4; the honest acceptance argument. *Serves:* SR-V-07.

---

## 11. Trade Studies

### 11.1 TS-27: Evidence-source strategy per claim
**Alternatives:** (A) **twin-heavy** (verify mostly in the validated twin); (B) **field-heavy** (verify mostly in the field); (C) **HIL-heavy**; (D) **matched (twin where validated, HIL for timing, field for fidelity-sensitive/adversarial claims)**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B/Doc G).

| Criterion (weight) | A: Twin-heavy | B: Field-heavy | C: HIL-heavy | D: Matched |
|--------------------|:---:|:---:|:---:|:---:|
| Admissibility / trustworthiness per claim (0.30) | 3 | 5 | 4 | 5 |
| Cost / time / fruit consumed (0.24) | 5 | 2 | 4 | 4 |
| Coverage of the envelope (0.20) | 4 | 3 | 3 | 5 |
| Safety of testing failures (0.14) | 5 | 2 | 4 | 4 |
| Statistical power achievable (0.12) | 4 | 3 | 4 | 4 |
| **Weighted total** | **4.06** | **3.24** | **3.86** | **4.58** |

**Selected: D (matched).** Use the validated twin (CEC-06) for claims it can support at admissible fidelity (reach, much of timing, budget composition), HIL for real-timing/resource claims, and field data for the fidelity-sensitive and adversarial claims that only reality can settle (grasp-bruise across real fruit, envelope-edge validation). This maximizes trustworthy coverage per unit of cost and fruit, the V&V-side expression of CEC-06. Recorded weakness: "matched" requires correctly judging which claims the twin can bear, so the evidence matrix is reviewed as field data either confirms or overturns twin predictions (reliability growth for the evidence itself).

### 11.2 TS-28: Reliability strategy (summary)
**Alternatives:** test-to-target only, FMEA-driven dominant-mode attack, redundancy-everywhere, run-to-failure-and-fix. **Criteria:** reliability gain per effort, cost/mass, coverage of real modes. **Outcome:** **FMEA-driven dominant-mode attack with reliability growth**, find the dominant failure mode, fix it, retest, repeat (EI-05); add redundancy only where the dominant mode and the safety case (M15) demand it. Redundancy-everywhere is rejected (cost/mass without targeting the real risk, an anti-EI-08/EI-05 pattern).

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
Per instructor direction after M13, the **CEC set is treated as complete** (six anchors); the evaluation's default outcome is "existing anchor applied," and a new CEC requires an extraordinary case.

- **V&V methodology / reliability analysis (FMEA, test planning).** *Verdict: no new CEC.* Mastered *techniques*, captured in the V&V/reliability thread, not new analytical anchors.
- **Evidence-to-fidelity matching.** *Verdict: no new CEC, this is CEC-06 applied* to verification (the fidelity ladder governing which evidence is admissible for which claim). A prime example of the completed set covering the new domain.
- **Dominant-failure-mode attack.** *Verdict: no new CEC, this is EI-05 applied* to reliability (the dominant-term method, now over failure rates), reinforcing that one method spans accuracy, energy, heat, and reliability.
- **EI-14 (Validate Adversarially)** is added as this module's Engineering Insight, reinforcing EI-10 (the field is the spec) with the proving-stage judgment to *seek* failure. *(No new CEC; one EI added, within discipline, and consistent with the set-complete direction.)*

> **Cross-module synthesis note (lightweight).** Three of the course's anchors converge on the acceptance table: **CEC-06** decides *what evidence is admissible* for each requirement, **EI-05** decides *where reliability effort goes* (the dominant failure mode), and **EI-10/EI-14** decide *where to test* (the envelope's adversarial edges). Proving the machine is not one activity but the disciplined application of tools the course already built, the clearest sign the anchor set is complete.

> **Simulation-first hook.** The validated twin (CEC-06) supplies admissible evidence for the claims it can bear and is itself *validated* against field data here; where the twin cannot bear a claim (fidelity-sensitive grasp-bruise, adversarial edges), field evidence is mandatory, the honest boundary of the simulation-first bet.

---

## 12. Simulation Activities

M14 runs at **HIL -> Prototype -> Field** for evidence generation; the validated twin (M13/CEC-06) is one evidence source among several.

**SA-1, Evidence-matrix build.** For each top-level requirement, assign the evidence and its fidelity rung (twin/HIL/field) and flag field-mandatory claims (Section 6.2, SR-V-05). *Outcome:* the requirement-to-evidence backbone.

**SA-2, Test-plan sizing.** For grasp success and placement, compute the sample size and envelope stratification needed for a target confidence (Section 7.1 to 7.2, SR-V-06). *Outcome:* statistically defensible test plans.

**SA-3, FMEA & dominant-mode analysis.** Enumerate failure modes in the (validated) twin and from design; estimate rates; identify the dominant mode and simulate its reduction (Section 6.4, Section 7.3, EI-05). *Outcome:* reliability effort directed.

**SA-4, Adversarial edge campaign.** Drive the twin/HIL to the envelope's edges (slope, light, occlusion, dust, wear) and to fidelity-sensitive cases; record where the machine fails (Section 6.5, EI-14). *Outcome:* failures found in sim/HIL before the field.

---

## 13. Digital Twin Activities

**DTA-1, Twin-as-evidence validation & admissibility (CEC-06).** Specify how each twin-sourced verification claim is validated against field data to its tolerance, and the admissibility record (rung, validation, confidence). *Outcome:* SR-V-05; twin evidence that is citable, not assumed.

**DTA-2, Reliability-growth instrument.** Specify the twin/HIL loop for reliability growth: run -> identify dominant mode -> fix -> retest, with the failure-rate trend recorded. *Outcome:* a reliability-growth trajectory (feeds SR-R-01/02).

**DTA-3, Acceptance-evidence package.** Package the verified composed budgets (CEC-01/03, power/thermal) with their evidence fidelity for M15 (safety) and M16 (economics). *Outcome:* the honest acceptance table (SR-V-07).

---

## 14. Hardware Activities

*(Tiered: field/durability protocols at specification level, hardware and field data are where much of this module's evidence must come from.)*

**HA-1, Field validation campaign.** Specify the statistically sound, envelope-stratified field trials for grasp success/no-bruise, placement, and cycle time (SR-V-06/07), including adversarial edge cases (SR-V-08). *Deliverable:* field evidence with confidence bounds.

**HA-2, Durability / reliability-growth test.** Specify sustained/accelerated operation over a representative season-equivalent (wear, dust, heat, vibration) with failure logging and dominant-mode tracking (SR-R-01/02). *Deliverable:* reliability-growth data and MTBF estimate.

**HA-3, Calibration-drift check.** Specify periodic re-verification of the placement budget (CEC-03) as the machine wears/drifts. *Deliverable:* drift data (feeds maintenance/M16).

---

## 15. Software Activities

**SWA-1, V&V data pipeline & test harness.** Specify automated logging, metrics, and confidence computation for the test campaign (grasp outcomes, placement, timing, failures) with envelope-stratum tagging. *Outcome:* reproducible, statistically summarized evidence.

**SWA-2, Regression & reliability dashboards.** Specify continuous regression (the M13 system suite) plus a reliability dashboard (failure-mode counts, dominant mode, MTBF trend). *Outcome:* living V&V/reliability evidence (feeds M15/M16).

---

## 16. ROS 2 Integration

V&V instruments the integrated node graph (M11/M13): logging and metrics nodes capture per-cycle outcomes (grasp force vs. window, placement error, loop latencies, guard/monitor activations, faults) with envelope-stratum tags. The fault-injection harness (M11) is reused for reliability and adversarial testing. The safety monitor's activations are logged as reliability/safety events (feeds M15). On-robot logging respects the compute/power budgets (M6/M12). M14 does not change the architecture; it *proves* it with recorded evidence.

---

## 17. AI Integration

The learned components (perception M4, grasp policy M7/M9, row-following M10) are among the hardest things to verify, and this module treats them honestly:

- **Statistical validation, not demonstration.** Learned-component performance (recall, grasp success) is validated statistically across the envelope (Section 6.3), not shown on easy cases, the adversarial discipline (EI-14) matters most for opaque models.
- **Fidelity-appropriate evidence (CEC-06).** A policy validated only in low-fidelity sim is inadmissible for a field claim; grasp-bruise needs the validated contact rung and field data (CR-03).
- **Bounded-learner verification.** V&V confirms the bounds (EI-07) and the independent monitor (EI-11) actually contain the learned components under adversarial and fault conditions, verifying the *system* even though the policy is opaque.
- **Reliability of learning.** Distribution shift over a season (new fruit, conditions) is a reliability/failure mode (drift); monitored and re-validated (feeds M16 maintenance).

The bounded system, not the policy, is what gets certified, verified adversarially and statistically.

---

## 18. Edge Computing Integration

V&V verifies the edge system's real behavior: worst-case timing under field-representative load (CEC-01/M11), power/thermal margin at the envelope edge (M12/EI-12), and their stability over a season (drift, thermal cycling). These are verified in HIL and field (the admissible rungs for timing/thermal), since a bench average (CEC-06) is inadmissible for a worst-case field claim. Thermal/timing failures are logged as reliability events. The no-cloud boundary (CEC-04) means all evidence is generated on-device, in the field.

---

## 19. Fluid Power Integration

The fluid grasp (M9) is the machine's central function and its hardest V&V target. Three points: (1) grasp success and **no-bruise rates** must be validated *statistically across real fruit and the envelope*, the fidelity-sensitive claim that only the validated contact rung (CR-03/CEC-06) plus field data can settle; (2) fluid-power **reliability** modes (seal wear, leaks, pump duty, relief drift) enter the FMEA and are candidates for the dominant failure mode (EI-05), a drifting relief is both a reliability and a *safety* concern (M15); (3) the **relief and compliance** safety functions (EI-09) are verified under adversarial and fault conditions (does the relief still cap force after a season of wear?). The grasp's proof is a statistical, envelope-covering, season-long argument, not a bench demo.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M14-1, Evidence-Matrix Builder.** A requirements list with a fidelity-rung selector per claim; flags inadmissible pairings (e.g., grasp-bruise verified in kinematic twin), CEC-06 as V&V backbone. *Goal:* Section 6.2.
- **W-M14-2, Sample-Size / Confidence Calculator.** Sliders for target reliability, confidence, and observed failures; live required sample size and confidence interval (Section 7.1). *Goal:* statistics-not-anecdotes.
- **W-M14-3, FMEA / Dominant-Mode Explorer.** Enter failure modes and rates; live system failure rate, MTBF, and the dominant mode highlighted; reduce one and watch MTBF move (Section 7.3, EI-05). *Goal:* attack the dominant mode.
- **W-M14-4, Adversarial-Envelope Tester.** Slide through envelope edges (slope/light/occlusion/dust/wear) and watch the success rate fall where the machine is weak (Section 6.5, EI-14/EI-10). *Goal:* validate by breaking.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M14-1** The V&V pyramid: sim -> twin (validated) -> HIL -> prototype -> field, with which claims each rung can prove (CEC-06).
- **CAD-M14-2** FMEA / reliability block diagram with the dominant failure mode highlighted.
- **CAD-M14-3** Envelope-coverage map: test strata across slope × light × fruit × dust, edges emphasized.
Format per ->Doc J (SVG V&V/reliability diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M14-1 | Verification vs. validation (build-it-right vs. right-thing) | Section 6.1 |
| F-M14-2 | **Requirement-to-evidence matrix with fidelity rungs** | Section 6.2 (central, CEC-06) |
| F-M14-3 | Sample size vs. confidence/reliability | Section 7.1 |
| F-M14-4 | FMEA & dominant failure mode (MTBF) | Section 6.4/Section 7.3 (EI-05) |
| F-M14-5 | Adversarial envelope coverage (edges emphasized) | Section 6.5 (EI-14/EI-10) |
| F-M14-6 | Reliability growth over iterations / a season | Section 6.6 |
| F-M14-7 | Composed-budget acceptance table with evidence fidelity | Section 6.7/Section 7.4 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M14-1** A claim being "verified" in a low-fidelity twin, then failing in the field, then correctly verified once the evidence is matched to the right rung (CEC-06).
- **AN-M14-2** A confidence interval narrowing as trials accumulate, the demo (n=1) vs. a sized campaign.
- **AN-M14-3** Reducing the dominant failure mode moving MTBF far more than reducing a minor one (EI-05).

---

## 24. Laboratory

**Lab M14, Proving the Machine: Evidence, Statistics, and Reliability**

- **Objectives.** (1) Build a requirement-to-evidence matrix with fidelity rungs; (2) size a statistically sound, envelope-stratified test plan; (3) perform an FMEA and find/attack the dominant failure mode; (4) design adversarial validation at the envelope edges; (5) assemble the composed-budget acceptance table with evidence fidelity.
- **Equipment.** The validated twin + HIL harness (M13); the requirements set (M1 to M13); field/durability data or a data model [VERIFY@PUB]; statistics tools; notebook. **Safety:** any hardware/field testing follows the safety architecture (M11) and envelope limits (M10/M15).
- **Procedure.**
  1. For each top-level requirement, assign evidence and its fidelity rung; flag field-mandatory (fidelity-sensitive/adversarial) claims (Section 6.2, SR-V-05).
  2. For grasp success and placement, compute required sample size for a target confidence and stratify across the envelope (Section 7.1 to 7.2, SR-V-06).
  3. Build an FMEA; estimate failure rates; identify the dominant mode and quantify the MTBF gain from attacking it vs. a minor mode (Section 7.3, EI-05, SR-R-01).
  4. Design an adversarial validation plan targeting the envelope edges and fidelity-sensitive cases; predict where the machine fails (Section 6.5, EI-14, SR-V-08).
  5. Assemble the composed-budget acceptance table (placement, cycle-time, power/thermal) with each claim's evidence fidelity and confidence (Section 6.7/Section 7.4, SR-V-07).
- **Data collection.** Evidence matrix; test-plan sizes/strata; FMEA and dominant mode with MTBF sensitivity; adversarial plan; acceptance table.
- **Analysis.** Which claims are field-mandatory? How many trials does the reliability target need? What is the dominant failure mode and how much does attacking it help? Where do you predict the machine fails adversarially?
- **Discussion.** Why is evidence fidelity (CEC-06) the backbone of honest V&V? Why validate adversarially (EI-14)? Why does the dominant-mode discipline (EI-05) recur yet again? What can the twin prove, and what must the field prove?
- **Deliverables.** A 5 to 6 page V&V/reliability plan: evidence matrix, test plans, FMEA/dominant mode, adversarial plan, acceptance table.
- **Rubric (100 pts).** Evidence matrix with fidelity (20, CEC-06); test-plan sizing/coverage (18); FMEA & dominant mode (20, EI-05); adversarial validation plan (18, EI-14); acceptance table (14); communication (10). *Graduate band adds:* wear-out vs. random-failure hazard modeling (Section 7.3 grad) and a cited source.
- **Expected results.** An evidence matrix that reveals several claims are field-mandatory (not twin-provable); a sample size far larger than a demo; a clear dominant failure mode whose attack moves MTBF most; an adversarial plan that predicts the machine's weak edges; and an acceptance table where every claim honestly carries its evidence fidelity, the difference between "should work" and "proven."

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Evidence matrix.** For five given requirements, assign evidence and fidelity rung; identify which are field-mandatory and why (CEC-06).
2. **Sample size.** For a target reliability and confidence with zero allowed failures, compute the required number of trials; interpret what a demo (n=1) actually proves.
3. **FMEA / dominant mode.** Given failure modes and rates, compute system MTBF, identify the dominant mode, and quantify the MTBF gain from a stated reduction there vs. a minor mode (EI-05).
4. **Adversarial plan.** For the operating envelope, design a validation plan that targets the edges; state the pass/fail criteria and what a failure would tell you (EI-14).
5. **(Grad) Wear-out.** Distinguish random from wear-out failures for two SIM2FIELD modes; model the increasing hazard and its effect on a season-long reliability estimate.
6. **(Grad) Evidence admissibility.** Argue whether a validated-twin result is admissible for a stated grasp-bruise requirement; specify exactly what validation (rung, tolerance, field confirmation) would make it admissible (CEC-06).

---

## 26. Quiz

1. **(MC)** Verification vs. validation: verification asks, validation asks, (a) same thing; (b) "built it right (meets spec)?" vs. "built the right thing (does the field job)?"; (c) cost vs. speed; (d) sim vs. hardware. **[b]**
2. **(MC)** A grasp-will-not-bruise claim is admissibly verified by: (a) a kinematic twin; (b) the validated contact rung + field data (CEC-06); (c) a single demo; (d) a datasheet. **[b]**
3. **(MC)** "It worked in the demo" is: (a) sufficient evidence; (b) a sample of one with no coverage; (c) a reliability proof; (d) a confidence interval. **[b]**
4. **(MC)** Reliability effort moves MTBF most when aimed at: (a) any mode; (b) the dominant failure mode (EI-05); (c) the rarest mode; (d) the cheapest fix. **[b]**
5. **(Short)** State EI-14 and one SIM2FIELD example. **[Validate adversarially, try to break the machine at the envelope's hard cases (steep slope, worst light, dense occlusion, worn state) rather than demoing easy rows, because the field will run that test regardless.]**
6. **(Calc)** To demonstrate R=0.99 reliability at 95% confidence with zero failures, how many trials? **[$n\ge\ln(0.05)/\ln(0.99)\approx 299$ trials.]**
7. **(Calc)** Modes with rates 5, 2, 1 (per 1000 cycles). System rate and dominant mode? **[$\lambda_\text{sys}=8/1000$; MTBF=125 cycles; dominant = the 5/1000 mode (attack it, EI-05).]**
8. **(Design)** Why match evidence to fidelity rung (CEC-06) in V&V? **[A claim is only as strong as the validated rung under it; low-fidelity evidence for a fidelity-sensitive claim is inadmissible and fails in the field.]**
9. **(Critical thinking)** Why can a machine pass verification but fail validation? **[It met the spec, but the spec didn't capture the real field need, right build, wrong requirement.]**
10. **(Critical thinking)** Why is one perfect grasp not a reliability result? **[Reliability is over thousands of cycles under wear/dust/heat; rare per-cycle failures become certain at scale, and day-one performance degrades, a season, not a day.]**

---

## 27. Challenge Problems

- **CP-M14-A, The acceptance argument.** Assemble the full acceptance case for the machine: each top requirement, its evidence, the fidelity rung, the statistical confidence, and the residual (unproven or field-only) items. Identify the weakest link in the argument. (Directly feeds M15's safety case and M16's go/no-go.)
- **CP-M14-B, Dominant-mode reliability growth.** Given an FMEA and a reliability target, plan a reliability-growth campaign (test -> fix dominant mode -> retest) and estimate the iterations/MTBF trajectory to reach the target (EI-05). (Operationalizes reliability growth.)
- **CP-M14-C, Adversarial campaign design.** Design the adversarial validation campaign that would most efficiently expose the machine's true failure boundary across the envelope; specify strata, sample allocation, and stop criteria (EI-14/EI-10). (Feeds M15/M16.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your acceptance argument leans on twin evidence for several claims. What are you assuming about the twin's validation (CEC-06), and for which claims would a reviewer rightly demand field data instead? Where is twin evidence being stretched past its validated rung?
2. **Tradeoffs.** You matched evidence sources per claim (twin/HIL/field) to control cost and fruit consumed. Defend that to a reviewer who wants everything field-validated. What do you lose by twin-verifying a claim, and how do you bound that risk?
3. **Risk.** Your reliability effort targets the dominant failure mode. What if the FMEA missed a mode, or a minor mode becomes dominant under wear/season effects? How does your plan catch a wrong dominant-mode judgment before deployment?
4. **Verification.** Your grasp success rate is a statistical claim. Is your sample size and envelope coverage sufficient for the target confidence, including the rare no-bruise failures? What's the true confidence interval, and does it meet the grower's need?
5. **Subsystem interaction.** Reliability and safety overlap (a drifting relief is both). Who owns a failure mode that is both a reliability and a safety concern, and how do the M14 reliability evidence and the M15 safety case stay consistent about it?
6. **Adversarial honesty.** Did your validation genuinely try to break the machine at the envelope's hard edges, or did it accumulate easy successes? Show the failures you found, a validation campaign that found no failures is more suspicious than one that found and fixed several (EI-14).

---

## 28. Instructor Notes

- **Timing.** Section 6.1 to 6.3 (V&V, evidence/fidelity, statistics) and Section 6.4 to 6.5 (reliability, dominant mode, adversarial validation) are the core (~3 h); EI-14 and the CEC-06/EI-05 reuse (Section 11.3) are the peaks. Trade studies (Section 11) and the V&V-planning activities (Section 12) form an interactive block (~1.5 h). Lab M14 is a separate 2 to 3 h session.
- **Common misconceptions.** (1) Verification = validation, they answer different questions. (2) A demo is evidence, it's n=1. (3) "Verified in the twin" is unconditional, only to the validated rung (CEC-06). (4) Reliability = one good run, it's a season of statistics. (5) Validation shows success, no, it *seeks failure* (EI-14).
- **On the reuse of anchors.** Point out that this "proving" module mints no new CEC and instead applies CEC-06 (evidence fidelity), EI-05 (dominant mode), and EI-10 (envelope), the clearest demonstration that the anchor set is complete and domain-general. EI-14 is the new *judgment* (validate adversarially).
- **On honesty.** The recurring theme is honesty, of evidence, statistics, and adversarial effort. A validation report with no failures found should raise a reviewer's suspicion, not their confidence.
- **Where to push graduate students.** Wear-out modeling (HW5), evidence admissibility (HW6, CP-M14-A), adversarial campaign design (CP-M14-C).
- **Thread to keep visible.** Close by naming hand-offs: V&V evidence + reliability analysis -> M15 (safety case) and M16 (cost/deployment); acceptance argument -> M17 (capstone criteria).

---

## 29. Research Frontiers

- **Landmark grounding.** Verification-and-validation and systems-engineering test references; reliability-engineering references (FMEA, failure-rate/MTBF, reliability growth); statistical test-design references. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Validation of learning-enabled autonomous systems (statistical guarantees, adversarial/edge-case testing); simulation-based/credibility-assessed evidence for certification; scenario-based and coverage-driven testing for field robots; reliability growth and prognostics/health management for agricultural machinery; rare-failure estimation for high-reliability autonomy.
- **Open problems.** Admissible simulation-based evidence for safety-relevant claims; statistically sound validation of opaque learned components; efficient adversarial discovery of an autonomy's failure boundary; season-long reliability prediction from accelerated tests.
- **Suggested thesis directions.** (1) A credibility-assessed twin-plus-field evidence framework that states, per requirement, the admissible confidence. (2) Adversarial validation that efficiently maps a harvester's failure boundary across its envelope. (3) Reliability-growth and prognostics for a fluid-powered field manipulator over a season.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Verification-and-validation / systems-engineering test references, V&V structure, evidence, acceptance (Section 6.1 to 6.2).
- Reliability-engineering references (FMEA, failure rate/MTBF, reliability growth), Section 6.4/Section 6.6, Section 7.3.
- Statistical test-design references, sample size, confidence, coverage (Section 6.3, Section 7.1 to 7.2).
- Learning-enabled-system validation / adversarial-testing literature, verifying opaque components (Section 6.5; EI-14).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 13**, and (forthcoming) Doc B, Doc C, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** This module turns "should work" into "proven," organizing the whole course's requirements and budgets into an honest **verification-validation-reliability campaign**. Its backbone is **CEC-06 applied to evidence**: every verification claim is matched to the *fidelity rung* that can admissibly support it, and the campaign flags where only field data will do, the discipline that keeps V&V from self-deception. It insists on **statistics over anecdotes** (sample size and envelope coverage for every performance claim), applies the course's **dominant-term method (EI-05) to reliability** (find and attack the dominant failure mode, one method now spanning accuracy, energy, heat, *and* reliability), and proves a **season, not a day**. Its Engineering Insight, **EI-14 (Validate Adversarially)**, sharpens EI-10 into the proving-stage judgment to *seek* failure at the envelope's edges, with the memorable corollary that a validation campaign finding no failures should raise suspicion, not confidence. Consistent with your direction, it treats the **CEC set as complete** and mints no new CEC, using the explicit evaluation to show how the six anchors cover the proving domain. All 30 sections present; the Engineering Design Review is included (Q6 turns adversarial honesty on the campaign itself); one lightweight synthesis note (CEC-06 + EI-05 + EI-10/EI-14 converging on the acceptance table); consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Reliability targets, sample sizes, confidence levels, and MTBF numbers depend on Doc B/C and real field/durability data; the V&V/reliability *methods* and formulas are exact.
2. **Much of the strongest evidence is field-mandatory and not yet gathered.** The module *specifies* the field/durability campaigns (grasp-bruise statistics, reliability growth, adversarial edges); actually running them awaits hardware, a season, and Doc G (twin fidelity) for the twin-admissible portion.
3. **Twin-as-evidence rests on M13's validation.** Wherever a claim is twin-verified, its admissibility inherits the CEC-06 validation from M13/Doc G; if that validation is weaker than assumed, some claims drop to field-mandatory, flagged honestly.
4. **The dominant failure mode is method-not-answer here.** Which mode dominates (fluid seal, calibration drift, thermal, mechanical) awaits real failure data; the FMEA/dominant-mode *method* is exact, the answer is not yet in hand.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/C/G and by running the field/durability campaigns.

**END OF MODULE 14, STOP. Awaiting your review before freezing Module 14 or proceeding to Module 15.**
