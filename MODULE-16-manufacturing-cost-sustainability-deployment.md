# Module 16: Manufacturing, Cost, Sustainability & Deployment

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M16, **Part VII, Deploy**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory/case-study session + homework
**Prerequisites:** M1 (system requirements, ~$50k prototype BOM, cycle-time budget CEC-01), M8/M9 (mechanism & fluid hardware, manufacturability, cost), M10/M12 (coverage, endurance, throughput), M14 (reliability/MTBF, maintenance), M15 (safety case, deployment limits, responsible-deployment ethics). Math: cost modeling, unit economics, lifecycle/sustainability accounting.
**Lifecycle stage (this module):** Deployment (manufacturing, cost, sustainability, go-to-field)
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 15**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module closes the loop from a working, safe machine to a **manufacturable, affordable, sustainable, deployable** one: it turns the ~$50k prototype BOM into a cost model, ties **endurance/reliability (M12/M14)** to **coverage and cost-per-acre**, and applies the course's dominant-term discipline (**EI-05**) to cost and the envelope discipline (**EI-10**) to the market/field. The **CEC set is complete** (six anchors); this module mints **no new CEC**. P0-document authority tagged **[->Doc B/C/E/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-16** and the module's **Engineering Design Review**.

> *Core concept in use.* This module converts the machine's *engineering* budgets into an *economic* one. The cycle-time budget (**CEC-01**) becomes throughput; endurance (M12/EI-12) and reliability (M14/EI-05) become uptime and coverage; and the whole is judged by **cost-per-acre (or per-melon)** against manual harvest, the number that decides whether the machine deploys at all. Cost is budgeted with the same *sum-and-attack-the-dominant-term* method (CEC-03/EI-05) used for accuracy, energy, and reliability.

---

## 1. Module Overview

**Mission.** This module answers the question: can the machine be built, afforded, sustained, and deployed, and does it actually pay, compared to the manual harvest it would replace? Manufacturing, cost, sustainability, and deployment are the disciplines that decide whether the whole course's work reaches a real field or stays a prototype.

**Previous milestone.** A machine that grasps melons safely and reliably is an engineering success and a business question mark.

**Engineering problem.** The economics are unforgiving and specific. The machine has a build cost (the ~$50k prototype BOM from Module 1, which must fall toward a producible price), an operating cost (energy, maintenance, labor to supervise), and a value delivered (melons harvested, at a quality the packing house accepts, over the acres it can cover in a season). The decisive metric is cost-per-acre (or per-marketable-melon) against the manual alternative, and that number is built from the engineering the course already produced: throughput from the cycle-time budget (CEC-01), coverage from endurance and drive speed (M10/M12), uptime from reliability (M14), and quality from the no-bruise grasp (M9/CEC-02). This module assembles those into a unit-economics model and asks whether the machine clears the bar.

**Design tension.** It also applies two disciplines the course has used repeatedly. Cost is a budget with a dominant term (EI-05): the machine's cost is dominated by a few components, likely the compute, the fluid-power system, the sensors, or the platform, and cost-reduction effort pays only when aimed at the dominant driver, exactly as reliability and energy effort did. And the market is an envelope (EI-10): a machine that pencils out on a large, flat, uniform farm may not on a small, hilly, diverse one, so the deployment target must be defined and the machine designed to its economics, not an average that fits no one.

**What this module resolves.** Then comes sustainability, the lifecycle footprint (energy source, materials, manufacturing, end-of-life) that responsible deployment (M15) requires accounting for, and manufacturability: designing the mechanism, fluid system, and electronics so they can actually be produced at cost and serviced in the field. The module's Engineering Insight is the one that keeps engineering honest against economics: the machine that ships is the one that pencils out, technical excellence that does not close the business case does not deploy, so cost, manufacturability, and the deployment economics are engineering requirements from the start, not an afterthought bolted on at the end.


## 2. Learning Objectives

- **LO-M16.1** Build a cost model (build + operating cost) from the BOM and identify the dominant cost driver (EI-05)., *Bloom: Create (with Analyze)*
- **LO-M16.2** Compute unit economics, cost-per-acre / per-marketable-melon, from throughput (CEC-01), coverage (M10/M12), uptime (M14), and quality (M9)., *Bloom: Apply (with Evaluate)*
- **LO-M16.3** Compare the machine's economics to manual harvest and assess the deployment case (deploy / deploy-with-limits / not-yet)., *Bloom: Evaluate*
- **LO-M16.4** Analyze the market/deployment envelope and design to its economics rather than an average (EI-10)., *Bloom: Evaluate*
- **LO-M16.5** Assess manufacturability (design-for-manufacture/assembly, serviceability) of the mechanism, fluid, and electronics., *Bloom: Analyze (with Create)*
- **LO-M16.6** Analyze lifecycle sustainability (energy, materials, manufacturing, end-of-life) consistent with responsible deployment (M15)., *Bloom: Evaluate*
- **LO-M16.7** Specify a deployment plan: pilot, support/maintenance, scaling, within the safety limits (M15)., *Bloom: Create*

Maps to course objectives **LO6** (primary), **LO1/all** (integrative), and ABET **SO2, SO4**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Build a build+operating cost model and find the dominant cost driver., *Bloom: Create*
2. Compute cost-per-acre from the engineering budgets., *Bloom: Apply*
3. Judge the deployment case against manual harvest., *Bloom: Evaluate*
4. Define the deployment envelope and design to its economics., *Bloom: Evaluate*
5. Assess manufacturability and serviceability., *Bloom: Analyze*
6. Analyze the lifecycle sustainability footprint., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1 set a ~$50k prototype cost and a mission to harvest watermelons economically. This module exists because **an engineering success that does not pencil out never reaches a field**, the grower will not buy, the investor will not fund, and the melons will keep being picked by hand. The motivation is that cost, manufacturability, and deployment economics are not the business team's problem to solve after engineering finishes; they are engineering *requirements* that shape every prior decision, and the course has been quietly serving them all along.

The economics trace straight back through the machine. The single-arm decision (M1) traded throughput for cost and cycle-time feasibility. The DOF-reduction (M8, EI-08) made the arm cheaper and simpler. The pneumatic gripper (M9) was chosen partly for cost, cleanliness, and a lower safety burden. The edge-compute choice (M6) balanced capability against power, heat, and cost. Every one of these was, in part, a cost decision, and this module finally *adds them up* and tests the total against the value the machine delivers. That value is itself engineering-determined: throughput from the cycle-time budget (CEC-01), coverage from endurance and speed (M10/M12), uptime from reliability (M14), and, critically, *marketable* yield from the no-bruise grasp (M9/CEC-02), because a bruised melon is not just a missed grasp but lost revenue. The motivation for the unit-economics model is that it closes the loop: it shows whether the sum of the engineering decisions produces a machine that beats manual harvest on cost-per-acre, which is the only question the market asks.

Two familiar disciplines recur with new stakes. Cost, like accuracy and energy and reliability, is a **budget with a dominant term** (EI-05): a handful of components dominate the BOM, and cost-reduction effort spent anywhere else barely moves the price, so the machine is made affordable by attacking the dominant cost driver, not by trimming the cheap parts. And the **market is an envelope** (EI-10): the deployment economics that work on a 500-acre flat farm may fail on a 20-acre hilly one, so the machine must be aimed at a defined deployment target and designed to *its* economics. The motivation is honesty about who the machine is for and whether, for them, it pays.

And sustainability adds the motivation of responsibility over time. The machine's lifecycle, the energy it runs on, the materials it is built from, the emissions of its manufacture, its end-of-life, is part of the responsible deployment (M15) the course committed to, and increasingly part of the economics (energy cost, regulation, buyer preference). A machine that pays only by externalizing its footprint is not sustainably deployable. The motivation is that *responsible* and *economic* deployment must be reconciled, not traded off in the dark.

---

## Engineering Failure Cases (cost-and-deployment-specific)

Sharpening the deployment-stage failures:

- **Doesn't pencil out.** The machine works but cost-per-acre exceeds manual harvest; it never sells. *Motivates* the unit-economics model and cost-vs-manual comparison (Section 6.2 to 6.3, Section 7).
- **Dominant-cost blind spot.** Cost-reduction effort trims cheap parts while the dominant driver (e.g., compute or fluid system) is untouched; the price barely moves. *Motivates* dominant-cost-driver attack (Section 6.4, EI-05).
- **Wrong market.** The machine is designed to an average farm that doesn't exist; it fits neither the large nor the small grower. *Motivates* deployment-envelope definition (Section 6.5, EI-10).
- **Unmanufacturable / unserviceable.** A design that works as a prototype can't be produced at cost or fixed in the field. *Motivates* design-for-manufacture/assembly and serviceability (Section 6.6).
- **Externalized footprint.** The machine "pays" only by ignoring its lifecycle/energy/material cost. *Motivates* sustainability accounting (Section 6.7, M15).
- **Quality-as-revenue miss.** Bruise/damage rate (M9) is treated as a technical metric, not lost marketable yield. *Motivates* tying quality to unit economics (Section 6.2).

Each is a cost/deployment decision away from prevention.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** basic cost modeling and unit economics (fixed/variable cost, amortization, break-even); the M1 requirements and ~$50k prototype BOM; the M8/M9 hardware (mechanism, fluid) as cost/manufacturing items; the M10/M12 coverage, endurance, and throughput; the M14 reliability/MTBF and maintenance; the M15 safety case, deployment limits, and responsible-deployment ethics.

**Introduced here, used later:** the vocabulary of cost, manufacturing, and deployment, *bill of materials (BOM), build vs. operating cost, unit economics, cost-per-acre / per-unit, throughput/coverage/uptime, amortization/depreciation, total cost of ownership, break-even, design-for-manufacture/assembly (DFM/DFA), serviceability, lifecycle assessment (LCA)/sustainability, deployment/market envelope, pilot, go-to-field plan*. Developed at applied (L2) depth; detailed manufacturing/LCA methods are referenced [->Doc H].

**Where this sits in the dependency graph.** M16 depends on nearly every module (their hardware, budgets, reliability, and safety limits). It **masters** the manufacturing/cost/sustainability/deployment threads; it **applies** CEC-01 (throughput->economics), CEC-02 (quality->marketable yield), EI-05 (dominant cost driver), EI-10/EI-12 (market/deployment envelope, endurance), EI-15 (deploy within the safety case). It hands forward: the cost model, deployment case, and go-to-field plan to M17 (the capstone must produce a deployable, affordable, safe machine).

---

## 6. Theory

### 6.1 Cost structure: build, operate, own
Three cost views. **Build cost**, the BOM plus assembly/test, is what the machine costs to produce (the ~$50k prototype must fall toward a producible unit price at volume). **Operating cost**, energy (M12), maintenance/parts (M14 reliability), and supervision labor, is what it costs to run per season. **Total cost of ownership (TCO)** amortizes build cost over the machine's life and adds operating cost, giving the true per-season cost that unit economics divide by coverage.

### 6.2 Unit economics: cost-per-acre and marketable yield
The decisive metric is **cost-per-acre** (or per-marketable-melon): $\text{cost/acre} = \dfrac{\text{TCO per season}}{\text{acres covered per season}}$. Acres covered come from throughput (cycle-time budget, CEC-01), drive speed/coverage (M10), endurance (M12), and **uptime** (reliability, M14), a machine down 20% of the season covers 20% fewer acres. And **value** depends on *marketable* yield: the no-bruise grasp (M9/CEC-02) is revenue, because a bruised melon is a harvested melon that earns nothing. Unit economics thus assemble the whole course's engineering into one number.

### 6.3 The deployment case: versus manual harvest
The machine deploys only if it beats the alternative, manual harvest, on the grower's real economics (cost-per-acre, labor availability, harvest-window timeliness, quality). The comparison is honest only if it uses *realistic* machine numbers (real uptime, real bruise rate, real coverage) against *realistic* manual numbers (labor cost and availability, which are themselves under pressure). The output is a decision: **deploy**, **deploy-with-limits**, or **not-yet**, the same honest tri-state as the safety case (M15).

### 6.4 Cost as a budget with a dominant driver (EI-05 applied)
The BOM, like every budget in the course, has a **dominant term**: a few components (likely the edge compute, the fluid-power system, the sensors, or the platform) dominate the build cost, and $\partial\text{cost}/\partial(\text{component }i)$ is largest for the dominant one. Cost-reduction effort, volume sourcing, design simplification, substitution, pays only when aimed there. This is EI-05 in the cost domain: **attack the dominant cost driver, not the convenient cheap part.** (And the course's design decisions, EI-08's DOF reduction, M9's pneumatic choice, were already cost attacks on dominant drivers.)

### 6.5 The deployment/market envelope (EI-10 applied)
Economics are not uniform across farms: field size, terrain (slope, from M10), crop uniformity, labor cost, and harvest window all vary, and a machine that pencils out on one farm may not on another. The disciplined move is to **define the deployment envelope**, the farm profile the machine is *for* (size range, terrain, crop), and design/price to *its* economics, rather than to an average farm that exists nowhere. This is EI-10 applied to the market: design to the target's edges, not the mean.

### 6.6 Manufacturability and serviceability
A prototype that works is not a product that ships. **Design-for-manufacture/assembly (DFM/DFA)** reduces part count, uses producible processes, and eases assembly, lowering unit cost at volume (attacking the dominant cost driver, Section 6.4). **Serviceability** matters as much: a field machine must be maintainable by a grower's technician, accessible components, standard parts, the stored-energy-safe service procedures (M15 lockout/bleed-down), and the reliability-driven maintenance schedule (M14). Manufacturability and serviceability are cost drivers over the machine's life, not just at build.

### 6.7 Lifecycle sustainability
Responsible deployment (M15) requires accounting for the machine's **lifecycle footprint**: the energy source it runs on (grid mix, renewable, the M12 battery's embodied and end-of-life impact), the materials it is built from, the emissions of manufacture, and end-of-life (recycling, disposal). A **lifecycle assessment (LCA)** frames this. Sustainability is increasingly also economics (energy cost, regulation, buyer preference), but it is first a responsibility: a machine that pays only by externalizing its footprint is not sustainably deployable. The sustainability analysis and the cost model must be reconciled, not traded in the dark.

### 6.8 The go-to-field / deployment plan
Deployment is staged: a **pilot** (a small, monitored deployment that validates the economics and reliability in the real field, the ultimate adversarial validation, EI-14, and the highest fidelity rung, CEC-06), a **support/maintenance** structure (parts, service, training), and a **scaling** plan, all within the **safety limits and where-not-to-operate bounds (M15)**. The plan is honest about what the pilot must prove before scaling, and it treats the safety case and the economic case as joint gates.

---

## 7. Mathematics

Rigor tier for M16: **L2**. Central results: unit-economics composition and the dominant-cost-driver analysis.

### 7.1 TCO and cost-per-acre
$\text{TCO/season} = \dfrac{\text{build cost}}{\text{life (seasons)}} + \text{operating cost/season}$ (energy + maintenance + supervision). Acres/season $= \text{throughput}\times\text{uptime}\times\text{season length}$, with throughput from CEC-01/M10 and uptime from M14. $\text{cost/acre}=\text{TCO}/\text{acres}$. *Use:* the deploy/no-deploy number; sensitivity to each engineering input.

### 7.2 Marketable-yield value
Revenue/acre $= (\text{yield/acre})\times(1-\text{loss rate})\times\text{price}$, where loss rate includes the **bruise/damage rate** (M9/CEC-02) and missed-fruit rate (recall, M4). Net value/acre $=$ revenue/acre $-$ cost/acre. *Use:* shows a percentage point of bruise rate is a direct revenue loss, quality is economics.

### 7.3 Dominant cost driver (EI-05)
Rank BOM line items by cost; the largest is the dominant driver; $\partial\text{build cost}/\partial c_i$ is largest there, and volume/design leverage moves it most. *Use:* direct cost-reduction effort quantitatively. **Grad (L3):** include volume/learning-curve effects (unit cost falls with cumulative production) and their differential impact on the dominant driver.

### 7.4 Break-even and the deployment decision
Break-even acres (or seasons) where machine cost/acre $=$ manual cost/acre; the machine wins above break-even coverage. Include realistic uptime and quality. *Use:* the honest deploy / deploy-with-limits / not-yet decision against the deployment envelope (Section 6.5). Report with the *fidelity* of the inputs (CEC-06, a cost model built on unvalidated field numbers is a projection, not a proof).

---

## 8. Engineering Principles

1. **Cost is an engineering requirement from the start**, not an afterthought (EI-16).
2. **Budget cost with a dominant driver** (EI-05): attack it, not the cheap parts.
3. **Unit economics assemble the engineering** (CEC-01/M10/M12/M14) into cost-per-acre.
4. **Quality is revenue**, the bruise rate (M9/CEC-02) is lost marketable yield.
5. **Design to the deployment envelope** (EI-10): a defined target farm, not an average.
6. **Manufacturable and serviceable, or it doesn't ship**, DFM/DFA and field maintenance.
7. **Reconcile sustainability with economics** (M15), don't pay by externalizing the footprint.

---

## 9. System Requirements

Derived from the deployment mission; convert engineering to economics. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-C-13 | Cost | The machine shall achieve a target unit build cost [VERIFY@PUB] at production volume, with the dominant cost driver identified and attacked (EI-05). | Cost model + BOM review |
| SR-C-14 | Cost | Cost-per-acre (incl. TCO, uptime M14, marketable yield M9) shall beat manual harvest within the deployment envelope. | Unit-economics analysis + pilot |
| SR-M-01 | Manufacturing | The design shall meet DFM/DFA and serviceability targets (part count, producible processes, field-maintainable, stored-energy-safe service). | Manufacturing review |
| SR-D-03 | Deployment | The deployment envelope (target farm profile) shall be defined and the machine designed/priced to its economics (EI-10). | Review |
| SR-S-08 | Sustainability | A lifecycle assessment (energy, materials, manufacturing, end-of-life) shall be documented and reconciled with the cost model (M15). | LCA review |
| SR-D-04 | Deployment | A staged go-to-field plan (pilot -> support -> scale) shall be specified within the M15 safety/where-not-to-operate limits. | Review |
| SR-I-20 | Interface | Cost, deployment, and sustainability analyses shall feed the capstone (M17). | Review |

Traceability: SR-C-13 -> EI-05; **SR-C-14 -> CEC-01/CEC-02, M10/M12/M14**; SR-M-01 -> manufacturing; SR-D-03 -> EI-10; SR-S-08 -> M15; SR-D-04 -> M15, EI-14/CEC-06; SR-I-20 -> M17.

---

## 10. Design Decisions

- **DD-97 Cost model (build + operating + TCO) with dominant-driver analysis.** *Rationale:* Section 6.1/Section 6.4, EI-05. *Serves:* SR-C-13.
- **DD-98 Unit-economics (cost-per-acre) tied to the engineering budgets and marketable yield.** *Rationale:* Section 6.2/Section 7.1 to 7.2. *Serves:* SR-C-14.
- **DD-99 Honest deploy / deploy-with-limits / not-yet decision vs. manual.** *Rationale:* Section 6.3/Section 7.4. *Serves:* SR-C-14.
- **DD-100 Deployment-envelope definition; design/price to the target farm.** *Rationale:* Section 6.5, EI-10. *Serves:* SR-D-03.
- **DD-101 DFM/DFA + serviceability (stored-energy-safe, reliability-driven maintenance).** *Rationale:* Section 6.6, M14/M15. *Serves:* SR-M-01.
- **DD-102 Lifecycle assessment reconciled with the cost model.** *Rationale:* Section 6.7, M15. *Serves:* SR-S-08.
- **DD-103 Staged go-to-field plan within safety limits.** *Rationale:* Section 6.8, M15/EI-14. *Serves:* SR-D-04.

---

## 11. Trade Studies

### 11.1 TS-31: Business/deployment model
**Alternatives:** (A) **sell the machine** (grower owns); (B) **harvesting-as-a-service** (operator brings the machine); (C) **lease/subscription**; (D) **cooperative ownership** (shared among small growers). Scored 1 to 5 (weights illustrative; ratified in ->Doc B/Doc E).

| Criterion (weight) | A: Sell | B: Service | C: Lease | D: Co-op |
|--------------------|:---:|:---:|:---:|:---:|
| Access for small/diverse growers (0.26) | 2 | 5 | 4 | 5 |
| Utilization of the machine (amortize cost) (0.24) | 3 | 5 | 4 | 4 |
| Grower cost/risk exposure (0.20) | 2 | 5 | 4 | 4 |
| Support/maintenance & uptime (M14) (0.16) | 3 | 5 | 4 | 3 |
| Revenue predictability for the maker (0.14) | 4 | 4 | 5 | 3 |
| **Weighted total** | **2.68** | **4.86** | **4.16** | **3.94** |

**Selected: B (harvesting-as-a-service) as the primary model, with C (lease) for larger growers.** Service maximizes machine *utilization* (harvesting many farms amortizes the high build cost against far more acres, directly improving cost-per-acre, Section 7.1), lowers the grower's risk and capital barrier (widening access, an equity point from M15), and concentrates the specialized maintenance/uptime burden (M14) with the operator who can bear it. Selling to individual growers strands an expensive, seasonally-idle machine on one farm, poor utilization, poor economics, and inequitable access. Recorded weakness: service requires logistics (moving the machine between farms within harvest windows) and an operator business, carried into the go-to-field plan (SR-D-04).

### 11.2 TS-32: Cost-reduction focus (summary)
**Alternatives:** trim many small items, **attack the dominant cost driver**, redesign for volume manufacture, defer cost work. **Criteria:** cost reduction per effort, risk, time. **Outcome:** **attack the dominant cost driver, then design-for-volume**, identify the BOM's dominant term (likely compute or fluid system) and reduce it via sourcing/design/substitution (EI-05), then apply DFM/DFA for the volume-manufacture learning curve. Trimming small items is rejected as low-leverage.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
The **CEC set is complete** (six anchors); the default is "existing anchor applied," and a new CEC requires an extraordinary case.

- **Cost modeling / unit economics / TCO.** *Verdict: no new CEC.* Mastered *techniques* for the deployment domain, captured in the cost/deployment thread, and, notably, the *cost budget* is the CEC-03 budget-and-attack-the-dominant-term method (EI-05) applied to money, exactly as M12 applied it to energy/heat and M14 to reliability. One method, now a *fourth* quantity.
- **Manufacturing (DFM/DFA) / sustainability (LCA).** *Verdict: no new CEC.* Mastered techniques, captured in the manufacturing/sustainability threads.
- **The deployment envelope.** *Verdict: no new CEC, this is EI-10 applied* to the market (design to the target's edges, not the average).
- **EI-16 (The Machine That Ships Is the One That Pencils Out)** is added as this module's Engineering Insight, reinforcing EI-05 (dominant cost driver) and EI-15 (deploy honestly, within limits). *(No new CEC; one EI added, within discipline and the set-complete direction.)*

> **Cross-module synthesis note (lightweight).** The dominant-term method, **CEC-03**'s budgeting discipline sharpened by **EI-05**, has now governed *four* quantities across the course: **accuracy** (M5 placement budget), **energy and heat** (M12), **reliability** (M14 failure modes), and now **cost** (M16 BOM). That a single analytical tool spans accuracy, energy, reliability, and money is the strongest possible vindication of keeping the anchor set small: a great design tool is quantity-agnostic, and minting a separate CEC for each quantity would have hidden exactly this unity.

> **Simulation-first hook.** The cost/deployment model is a *projection* until the **pilot** validates it in the real field (the highest fidelity rung, CEC-06; the ultimate adversarial validation, EI-14). Cost-per-acre computed from unvalidated field numbers is reported as a projection with its input fidelity, never as a proven result.

---

## 12. Simulation Activities

M16 is at **Deployment**; the "simulation" here is economic and lifecycle modeling, validated by the pilot (the highest fidelity rung, CEC-06).

**SA-1, Cost model & dominant driver.** Build the build/operating/TCO cost model from the BOM; rank line items; identify the dominant cost driver and model its reduction (Section 6.1/Section 6.4, Section 7.3, EI-05, SR-C-13). *Outcome:* where cost-reduction effort pays.

**SA-2, Unit economics.** Compute cost-per-acre from throughput (CEC-01), coverage (M10), endurance (M12), uptime (M14), and marketable yield (M9/CEC-02); run sensitivity on each engineering input (Section 6.2/Section 7.1 to 7.2, SR-C-14). *Outcome:* the deploy/no-deploy number and its drivers.

**SA-3, Deployment-envelope economics.** Sweep the farm profile (size, terrain, labor cost) and find where the machine beats manual harvest (break-even), the deployment envelope (Section 6.5/Section 7.4, EI-10, SR-D-03). *Outcome:* who the machine is for.

**SA-4, Lifecycle assessment.** Model the lifecycle footprint (energy source, materials, manufacturing, end-of-life) and reconcile it with the cost model (Section 6.7, SR-S-08). *Outcome:* sustainability and economics together.

---

## 13. Digital Twin Activities

*(For a deployment module, the "twin" role is the economic/lifecycle model and the pilot as its validation.)*

**DTA-1, Economic-model spec & fidelity.** Specify the cost/unit-economics/LCA model, its inputs (from the engineering budgets), and, per CEC-06, the fidelity of each input (measured vs. projected), flagging what the pilot must validate. *Outcome:* an honest, fidelity-tagged economic projection (SR-C-14).

**DTA-2, Pilot as validation (EI-14/CEC-06).** Specify the pilot that validates cost-per-acre, uptime, and marketable yield in the real field, the highest fidelity rung and the ultimate adversarial test of the economics. *Outcome:* the plan to turn a projection into evidence (SR-D-04).

**DTA-3, Capstone handoff.** Package the cost model, deployment case, envelope, and go-to-field plan for M17. *Outcome:* the deployment inputs to the capstone (SR-I-20).

---

## 14. Hardware Activities

*(Tiered: manufacturing and pilot protocols at specification level.)*

**HA-1, Manufacturability review.** Specify a DFM/DFA and serviceability review of the mechanism (M8), fluid system (M9), and electronics (M12): part count, producible processes, field-maintainability, stored-energy-safe service (M15) (SR-M-01). *Deliverable:* a manufacturability/serviceability assessment.

**HA-2, Pilot deployment.** Specify a small, monitored field pilot that measures real cost-per-acre, uptime, bruise/marketable yield, and reliability within the safety limits (M15) (SR-C-14/SR-D-04). *Deliverable:* validated deployment economics (the go/no-go evidence).

---

## 15. Software Activities

**SWA-1, Cost/economics model tool.** Specify the parameterized cost-per-acre model (inputs from all prior budgets) with sensitivity and break-even analysis, and input-fidelity tagging. *Outcome:* a reusable deployment-decision tool.

**SWA-2, Fleet/operations & maintenance software (service model).** Specify (for the harvesting-as-a-service model) scheduling, utilization tracking, telemetry-driven maintenance (M14), and safety-limit enforcement (M15) across a fleet. *Outcome:* the operational software of deployment.

---

## 16. ROS 2 Integration

Deployment reuses the machine's telemetry (M11/M14) for operational value: uptime, cycle-time achieved (CEC-01), bruise/marketable-yield rate (M9), energy/thermal (M12), and safety-event logs (M15) feed the cost model with *real* numbers (replacing projections, raising their CEC-06 fidelity) and drive telemetry-based maintenance. For the service model, fleet software aggregates this across machines. No new robot architecture; deployment *instruments and operationalizes* the existing system for economics and maintenance.

---

## 17. AI Integration

The learned components have direct economic consequences, closed here:

- **Recall is revenue, bruise is loss.** Detection recall (M4) sets missed-fruit loss and grasp bruise rate (M7/M9) sets damage loss; both enter marketable yield (Section 7.2), so the accuracy/operating-point choices (EI-04) were *economic* choices, now quantified.
- **Compute is a dominant cost/energy driver.** The AI's edge hardware (M6) is a candidate dominant cost (SR-C-13) and energy (M12) driver; model/edge efficiency is a cost lever (EI-05), tying the AI's appetite to the price of the machine.
- **AI in operations.** Learning may optimize fleet scheduling/maintenance (service model), bounded and monitored like all learned components (EI-07/EI-11).

The AI's quality and cost are now line items in the deployment decision, not abstract metrics.

---

## 18. Edge Computing Integration

The edge compute (M6) is a likely **dominant cost and energy driver** (SR-C-13, EI-05), so this module's cost-reduction discipline points squarely at it: right-sizing the model/hardware (M6 efficiency) reduces build cost, operating energy (M12), *and* thermal burden at once, a triple leverage on the dominant term. The no-cloud boundary (CEC-04) is also an operating-cost choice: on-robot compute avoids per-acre connectivity cost and dependency in the field. The edge decision, made for latency in M6, is revisited here for its cost/energy consequence.

---

## 19. Fluid Power Integration

The fluid-power system (M9) is both a cost/manufacturing item and a serviceability consideration. As **cost**: the pump/compressor, valves, actuators, and sensing are a candidate dominant BOM driver (EI-05), and the M9 pneumatic choice was already, in part, a cost/cleanliness/safety decision. As **manufacturing/serviceability**: fluid systems need producible, reliable, field-serviceable components (seals, lines, relief) with stored-energy-safe service procedures (M15 bleed-down/lockout) and a reliability-driven maintenance schedule (M14, seal wear, relief drift). The sustainability view (Section 6.7) also notes the working fluid's lifecycle (clean pneumatic vs. hydraulic oil disposal, an M9/M16 tie). Fluid power's cost, manufacturability, and serviceability are line items in the deployment case.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M16-1, Cost-per-Acre Calculator.** Inputs for build cost, life, operating cost, throughput (CEC-01), uptime (M14), coverage (M10), and bruise rate (M9); live cost-per-acre vs. a manual-harvest line, with break-even (Section 7.1 to 7.2/Section 7.4). *Goal:* the deploy/no-deploy number.
- **W-M16-2, Dominant Cost-Driver Explorer.** BOM line items with a live ranking and the dominant driver highlighted; reduce one and watch build cost move most for the dominant (Section 6.4/Section 7.3, EI-05). *Goal:* attack the dominant driver.
- **W-M16-3, Deployment-Envelope Map.** Sliders for farm size, terrain/slope (M10), and labor cost; shades where the machine beats manual harvest, the deployment envelope (Section 6.5, EI-10). *Goal:* who the machine is for.
- **W-M16-4, Lifecycle-Footprint Dashboard.** Energy source, materials, manufacturing, end-of-life toggles; live footprint reconciled against cost (Section 6.7). *Goal:* sustainability + economics together.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M16-1** BOM cost breakdown (stacked bar) with the dominant cost driver highlighted.
- **CAD-M16-2** Cost-per-acre vs. coverage/uptime, with the manual-harvest break-even line.
- **CAD-M16-3** Lifecycle stages (materials -> manufacture -> operation -> end-of-life) with footprint per stage.
Format per ->Doc J (SVG cost/economics diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M16-1 | Cost structure (build / operating / TCO) | Section 6.1 |
| F-M16-2 | **Cost-per-acre vs. manual harvest (break-even)** | Section 6.2 to 6.3/Section 7.1 (central) |
| F-M16-3 | Dominant cost driver (BOM ranked) | Section 6.4/Section 7.3 (EI-05) |
| F-M16-4 | Marketable yield: bruise/miss rate -> revenue | Section 7.2 (M9/CEC-02) |
| F-M16-5 | Deployment envelope (farm profile where it pays) | Section 6.5 (EI-10) |
| F-M16-6 | Lifecycle assessment (footprint by stage) | Section 6.7 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M16-1** Cost-per-acre falling below the manual-harvest line as coverage/utilization rises (service model), the break-even reached.
- **AN-M16-2** Reducing the dominant cost driver moving build cost far more than trimming a cheap part (EI-05).
- **AN-M16-3** The deployment envelope shading in as farm profile varies, where the machine pays and where it doesn't (EI-10).

---

## 24. Laboratory / Case-Study Session

**Lab M16, The Deployment Case: Does the Machine Pay?**

- **Objectives.** (1) Build the cost model and find the dominant cost driver; (2) compute cost-per-acre from the engineering budgets and marketable yield; (3) compare to manual harvest and make an honest deploy decision; (4) define the deployment envelope; (5) assess manufacturability, sustainability, and specify a go-to-field plan.
- **Equipment.** The BOM (M1) and engineering budgets (CEC-01, M9, M10, M12, M14); manual-harvest cost data [VERIFY@PUB]; a cost-model tool; an LCA reference; notebook.
- **Procedure.**
  1. Build build/operating/TCO cost; rank the BOM; identify the dominant driver and model a reduction (Section 6.4/Section 7.3, EI-05, SR-C-13).
  2. Compute cost-per-acre from throughput, coverage, uptime, and marketable yield (bruise rate); run sensitivity (Section 6.2/Section 7.1 to 7.2, SR-C-14).
  3. Compare to manual harvest; determine break-even; make an honest deploy / deploy-with-limits / not-yet decision (Section 6.3/Section 7.4).
  4. Define the deployment envelope (farm profile where it pays) and check the design/price against it (Section 6.5, EI-10, SR-D-03).
  5. Assess manufacturability/serviceability and lifecycle sustainability; specify a staged go-to-field plan within the safety limits (Section 6.6 to 6.8, M15, SR-M-01/S-08/D-04).
- **Data collection.** Cost model & dominant driver; cost-per-acre & sensitivity; manual comparison & break-even; deployment envelope; manufacturability/LCA notes; go-to-field plan.
- **Analysis.** What is the dominant cost driver and how much does attacking it help? Does the machine beat manual harvest, and for which farms? What does the pilot need to validate? What is the sustainability footprint?
- **Discussion.** Why is cost an engineering requirement from the start (EI-16)? Why does the dominant-term method recur *again* (now for money)? Why is the bruise rate a revenue number? Where does the machine *not* pay, and is that honest?
- **Deliverables.** A deployment case: cost model, unit economics, deploy decision, envelope, manufacturability/sustainability assessment, and go-to-field plan, 6 to 8 pages.
- **Rubric (100 pts).** Cost model & dominant driver (18, EI-05); unit economics & marketable yield (22); manual comparison & honest decision (18); deployment envelope (14, EI-10); manufacturability + sustainability (18); go-to-field plan (10); communication (, , folded in). *Graduate band adds:* volume/learning-curve modeling (Section 7.3 grad) and a cited source.
- **Expected results.** A dominant cost driver (often compute or the fluid/platform) whose attack moves price most; a cost-per-acre that beats manual harvest *only* under the service model's high utilization and only within a defined farm envelope; a bruise rate that visibly costs revenue; and an honest deploy-with-limits decision naming what the pilot must prove, the case for EI-16.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Cost model.** From a given BOM and operating costs, compute TCO per season; identify the dominant cost driver and the effect of a stated reduction there vs. a cheap part (EI-05).
2. **Cost-per-acre.** Given throughput, uptime, coverage, and bruise rate, compute cost-per-acre and net value/acre; compare to a manual-harvest figure.
3. **Deployment envelope.** For three farm profiles (size/terrain/labor cost), determine where the machine beats manual harvest; state the deployment envelope (EI-10).
4. **Manufacturability/sustainability.** Identify two DFM/DFA improvements and one serviceability improvement for the machine; note one lifecycle-footprint concern and a mitigation.
5. **(Grad) Volume economics.** Model the unit-cost learning curve with cumulative production; show its differential effect on the dominant cost driver and the price needed for the deployment envelope.
6. **(Grad) Business-model economics.** Compare sell vs. service vs. lease on cost-per-acre via utilization; show why utilization (amortization) dominates the small-grower access question (M15 equity).

---

## 26. Quiz

1. **(MC)** The decisive deployment metric is: (a) top speed; (b) cost-per-acre (or per-marketable-melon) vs. manual harvest; (c) part count; (d) peak power. **[b]**
2. **(MC)** Cost-reduction effort pays most when aimed at: (a) any cheap part; (b) the dominant cost driver (EI-05); (c) the smallest line item; (d) the safest part. **[b]**
3. **(MC)** A 2% bruise rate (M9) is, economically: (a) irrelevant; (b) a direct ~2% loss of marketable yield/revenue; (c) a safety issue only; (d) a power cost. **[b]**
4. **(MC)** Designing to an "average farm" that doesn't exist is a failure of: (a) safety; (b) the deployment-envelope discipline (EI-10); (c) manufacturing; (d) timing. **[b]**
5. **(Short)** State EI-16 and one SIM2FIELD example. **[The machine that ships is the one that pencils out: cost/manufacturability/deployment economics are engineering requirements from the start, e.g., the single-arm and DOF-reduction choices were partly cost decisions serving the deployment case.]**
6. **(Calc)** Build $40k over 5 seasons; operating $6k/season; covers 200 acres/season. Cost-per-acre? **[TCO=$8k+$6k=$14k/season; $14{,}000/200=$70/acre.]**
7. **(Calc)** BOM: compute $12k, fluid $6k, platform $10k, sensors $5k, misc $7k. Dominant driver? **[Compute at $12k, attack it first (EI-05).]**
8. **(Design)** Why does the harvesting-as-a-service model improve cost-per-acre? **[It raises machine utilization (amortizes the high build cost over far more acres across many farms), lowering TCO per acre, and widens access for small growers.]**
9. **(Critical thinking)** Why is the dominant-term method (EI-05) appearing for a fourth time here meaningful? **[It has now governed accuracy, energy/heat, reliability, and cost, one quantity-agnostic tool, vindicating the small anchor set (CEC-03/EI-05).]**
10. **(Critical thinking)** Why is a cost-per-acre from unvalidated field numbers a projection, not a proof? **[Its inputs (uptime, bruise rate, coverage) are low-fidelity until the pilot validates them in the real field, CEC-06/EI-14; report it with input fidelity.]**

---

## 27. Challenge Problems

- **CP-M16-A, The full deployment case.** Assemble the machine's deployment case: cost model with dominant driver, cost-per-acre vs. manual across the envelope, marketable-yield sensitivity, manufacturability, sustainability, and a staged go-to-field plan within the M15 safety limits, and make an honest, defended deploy / deploy-with-limits / not-yet recommendation. (Directly feeds the capstone, M17.)
- **CP-M16-B, Attack the dominant cost driver.** For the identified dominant driver, design a concrete cost-reduction plan (sourcing, design simplification, substitution, volume) with the projected cost-per-acre impact; verify it doesn't break a safety (M15) or quality (M9) requirement. (Operationalizes EI-05.)
- **CP-M16-C, Reconcile sustainability and economics.** For a stated energy source and material set, compute the lifecycle footprint and reconcile it with cost-per-acre; find a change that improves both, and one where they trade off, and defend a choice (M15). (Feeds responsible deployment.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your cost-per-acre rests on assumed uptime, bruise rate, and coverage. What are those numbers' fidelity (CEC-06), measured or projected, and which most swing the deploy decision? What must the pilot validate before you trust the result?
2. **Tradeoffs.** You chose harvesting-as-a-service over selling. Defend that to a reviewer who wants growers to own the machine. What does the service model cost in logistics, and does it genuinely widen access or just shift the economics?
3. **Risk.** Your machine beats manual harvest only within a defined envelope and under high utilization. What happens if labor costs fall, the harvest window compresses, or utilization is lower than modeled? How robust is the deploy decision to those swings?
4. **Verification.** Your deployment case is a projection until the pilot. What exactly must the pilot prove (cost-per-acre, uptime, marketable yield, safety in the field), and what is your go/no-go criterion for scaling (EI-14)?
5. **Subsystem interaction.** The bruise rate (M9) is a quality metric, an energy consideration (rework), and a revenue number here. Who owns the target bruise rate now that it's revenue, and does the M9 grasp design need to be tighter than the technical spec required?
6. **Responsibility.** Your economics improve with utilization, which favors large operations. Does the machine's deployment widen or narrow the gap between large and small growers (M15 equity), and is your business model choice defensible on that ground as well as on cost?

---

## 28. Instructor Notes

- **Timing.** Section 6.1 to 6.4 (cost structure, unit economics, dominant driver) and Section 6.5 to 6.8 (envelope, manufacturability, sustainability, go-to-field) are the core (~3 h); EI-16 and the fourth-quantity dominant-term synthesis (Section 11.3) are the peaks. Trade studies (Section 11) and the deployment-case lab (Section 24) are interactive (~2 h).
- **Common misconceptions.** (1) "Cost is the business team's job", it's an engineering requirement (EI-16). (2) Trimming cheap parts saves money, attack the dominant driver (EI-05). (3) Bruise rate is only technical, it's revenue. (4) One average farm, design to the envelope (EI-10). (5) Sustainability is separate from cost, reconcile them (M15).
- **On no new CEC and the fourth quantity.** Highlight that the dominant-term method (CEC-03/EI-05) now spans accuracy, energy, reliability, and cost, the single strongest evidence for the completed, small anchor set. EI-16 is the new *judgment* (technical excellence must pencil out).
- **On honesty.** The deploy decision is a tri-state (deploy / deploy-with-limits / not-yet) like the safety case, and a projection until the pilot. Teach students to report economics with input fidelity, not false precision.
- **On equity (M15 tie).** The business-model choice has distributive consequences; present it as both an economic and a responsibility question (SO4), fairly.
- **Where to push graduate students.** Volume/learning-curve economics (HW5), business-model/access analysis (HW6, CP-M16-C), the full deployment case (CP-M16-A).
- **Thread to keep visible.** Close by naming the hand-off: the cost model, deployment case, envelope, and go-to-field plan -> M17 (the capstone must deliver a machine that works, is safe, *and* pencils out).

---

## 29. Research Frontiers

- **Landmark grounding.** Engineering economics / cost-modeling references; design-for-manufacture/assembly references; lifecycle-assessment/sustainability references; agricultural-economics and farm-labor references. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Techno-economic analysis of agricultural robotics and robots-as-a-service models; total-cost-of-ownership and utilization modeling for field automation; lifecycle assessment of robotic vs. manual harvest; labor-economics and equity studies of agricultural automation; design-for-serviceability for field machinery.
- **Open problems.** Robust techno-economic modeling under uncertain uptime/yield; equitable deployment models for small and diverse growers; full lifecycle sustainability of field robots (battery, materials, end-of-life); reconciling economic and environmental optimization.
- **Suggested thesis directions.** (1) A techno-economic and utilization model for harvesting-as-a-service across diverse farm profiles. (2) A lifecycle assessment comparing robotic and manual watermelon harvest end-to-end. (3) Design-for-serviceability and cost-reduction of a fluid-powered field manipulator for volume production.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Engineering-economics / cost-modeling references, TCO, unit economics, break-even (Section 6.1 to 6.3, Section 7).
- Design-for-manufacture/assembly and serviceability references, DFM/DFA, field maintenance (Section 6.6).
- Lifecycle-assessment / sustainability references, footprint accounting (Section 6.7).
- Agricultural-economics / farm-labor references, cost-per-acre vs. manual, equity (Section 6.3, Section 6.5).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 15**, and (forthcoming) Doc B, Doc C, Doc E.

---

## Concise quality summary (honest self-assessment)

**Strengths.** This module closes the loop from a working, safe machine to a **deployable, affordable, sustainable** one, converting the course's *engineering* budgets into an *economic* one: cost-per-acre assembled from throughput (CEC-01), coverage/endurance (M10/M12), uptime (M14), and, critically, **marketable yield**, making the bruise rate (M9/CEC-02) a *revenue* number rather than a technical metric. It applies the course's **dominant-term method (EI-05) to cost**, the *fourth* quantity (after accuracy, energy, and reliability) that one analytical tool has governed, which the synthesis note names as the strongest vindication of the small anchor set. It defines the **deployment envelope (EI-10)** honestly (who the machine is *for*), selects a **harvesting-as-a-service** model that improves both economics and small-grower access (an M15 equity tie), and treats **sustainability** and **manufacturability/serviceability** as first-class. Its Engineering Insight, **EI-16 (The Machine That Ships Is the One That Pencils Out)**, makes cost an engineering requirement from the start, and the deploy decision is an honest tri-state (deploy / deploy-with-limits / not-yet), a *projection* until the pilot validates it (CEC-06/EI-14). Consistent with your direction, **no new CEC** is minted. All 30 sections present; the Engineering Design Review probes economics, robustness, and equity; one lightweight synthesis note (the dominant-term method's fourth quantity); consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Nearly everything is [VERIFY@PUB] and pilot-dependent.** Costs, uptime, bruise rate, coverage, manual-harvest baselines, and farm profiles depend on Doc B/C and real pilot data; the cost-modeling and unit-economics *methods* are exact, but the numbers are projections until the field validates them.
2. **The deploy decision is a projection, not a proof.** By design (Section 6.8, CEC-06/EI-14), the go/no-go rests on the pilot; the module builds the model and the decision *structure*, not the validated verdict.
3. **The dominant cost driver is method-not-answer.** Which BOM item dominates (compute, fluid, platform, sensors) awaits real sourcing/volume data; the EI-05 method to find and attack it is exact.
4. **Sustainability (LCA) is framed, not fully quantified.** The lifecycle accounting is specified and reconciled-in-principle with cost; a full LCA needs real material/energy/end-of-life data (Doc C/E).

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/C/E and by running the pilot.

**END OF MODULE 16, STOP. Awaiting your review before freezing Module 16 or proceeding to Module 17 (the Capstone).**
