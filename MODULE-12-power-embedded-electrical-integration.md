# Module 12: Power, Embedded Systems & Electrical Integration

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M12, **Part V, Integrate**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Software-in-the-Loop / bench + Hardware-in-the-Loop
**Prerequisites:** M1 (spine, cycle-time budget CEC-01, Amiga interface), M5 (error budget CEC-03 & EI-05 method), M6 (edge compute draw, CEC-04), M8/M9 (actuation & fluid-power loads), M10 (drive/mobility loads, operating envelope EI-10), M11 (embedded real-time nodes to power/host). Math: electrical power/energy, thermal balance, basic circuits.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 11**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **budgets the electrical, power, and thermal loads** the whole machine now implies and applies **EI-05** (attack the dominant term) to the power/thermal budget and **EI-10** (the field is the spec) to the electrical/thermal envelope. P0-document authority tagged **[->Doc B/C/D/F/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-12** and the module's **Engineering Design Review**.

> *Core concept in use.* This module supplies the **energy the whole Signal-to-Action Spine (CEC-01) consumes**. Every stage the course built, sense, perceive, decide, actuate, move, integrate, draws power and makes heat; here those draws are budgeted into a runtime (endurance) and a thermal envelope, using the same **budget-and-attack-the-dominant-term** method (CEC-03/EI-05) that governed placement accuracy.

---

## 1. Module Overview

**Mission.** This module budgets both the machine's power and its heat: the power/energy budget that sets how long the machine works between charges (endurance and field coverage), and the thermal budget that keeps compute and actuation within their limits in a hot, dusty, sun-loaded field.

**Previous milestone.** A harvesting robot is only as autonomous as its energy allows. Every subsystem the course has designed draws power, the edge computer running perception and control (M6), the electric positioning mechanism (M8), the fluid-power gripper's pump/compressor (M9), the drive motors (M10), the sensors (M3), and the embedded nodes hosting it all (M11), and every watt drawn becomes both a demand on a finite energy store and a source of heat that must go somewhere.

**Engineering problem.** The engineering is the same discipline the course used for accuracy, now applied to energy. Just as the placement error budget (CEC-03) summed per-subsystem contributions and attacked the dominant one (EI-05), the power budget sums per-subsystem draws, sizes the energy store to the required endurance, and attacks the dominant load, which, on this machine, is a real question: is it the edge GPU, the fluid-power pump, or the drive? The answer decides where efficiency effort pays.

**Design tension.** The thermal budget is where the field bites hardest (EI-10): a compute or power stage that runs cool on a bench at 20 °C can throttle or fail at 45 °C in the sun under dust-blocked airflow, so the thermal envelope must be designed to the field's edges, not the lab's comfort.

**What this module resolves.** The module's Engineering Insight distills the trap every power-and-thermal engineer meets: the budget that matters is the one measured at the worst-case operating point, not the nameplate. Peak draws coincide, efficiencies fall at temperature, batteries sag under load and cold, and the sun adds heat the datasheet never mentioned, so a budget built from typical numbers is a budget that fails in July. Sizing to the coincident worst case, with margin, is what turns a machine that works in the demo into one that works a full shift in the field.


## 2. Learning Objectives

- **LO-M12.1** Build the machine's power budget: sum per-subsystem draws (compute, actuation, fluid power, drive, sensing) into peak and average electrical load., *Bloom: Create*
- **LO-M12.2** Size the energy store (battery) to a required endurance/coverage, accounting for depth-of-discharge, sag, and temperature derating., *Bloom: Apply (with Evaluate)*
- **LO-M12.3** Identify the dominant power load and target efficiency effort there (EI-05)., *Bloom: Analyze*
- **LO-M12.4** Build the thermal budget: balance generated heat against dissipation across the field's thermal envelope (EI-10)., *Bloom: Create*
- **LO-M12.5** Design the electrical integration and embedded power architecture (buses, regulation, protection, power sequencing) for the real-time system (M11)., *Bloom: Create*
- **LO-M12.6** Reconcile power/thermal limits with the cycle-time budget (CEC-01) and operating envelope (M10)., *Bloom: Evaluate*
- **LO-M12.7** Specify the twin/bench models for power and thermal verification., *Bloom: Create*

Maps to course objectives **LO6** (primary), **LO1/LO7** (reinforcing), and ABET **SO1, SO2**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Assemble a peak-and-average power budget across all subsystems., *Bloom: Create*
2. Size a battery to an endurance target with realistic derating., *Bloom: Apply*
3. Find the dominant load and direct efficiency effort (EI-05)., *Bloom: Analyze*
4. Build a thermal balance and check it across the field envelope., *Bloom: Create*
5. Design the power distribution, regulation, and protection architecture., *Bloom: Create*
6. Reconcile energy/thermal limits with throughput and the envelope., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1's failure taxonomy included the quiet killers of field robots: the machine that runs out of energy mid-row, and the machine that overheats and throttles until it misses its cycle. Neither is a dramatic crash; both end the shift. This module exists because **energy and heat are system-level budgets** that no subsystem owns alone, and because they are where a laboratory prototype most often fails to become a field machine.

The motivation compounds a debt the whole course has accumulated. Each module optimized its own function and, in doing so, spent power and made heat: the edge module (M6) chose a GPU to hit its latency budget, and that GPU draws tens of watts and needs cooling; the fluid-power module (M9) added a pump or compressor whose duty cycle draws real energy; the drive (M10) moves a heavy machine over rough ground. Individually reasonable, these draws sum to a total that must be *stored, delivered, and cooled*, and if the sum exceeds what a practical battery and cooling system can provide for a working shift, the machine is uneconomical no matter how well it grasps. The motivation for a disciplined budget is that the total is not obvious until it is added up, and that the dominant term (EI-05) is where efficiency effort actually moves the number.

And then the field intervenes (EI-10). Batteries deliver less when cold and sag under peak load; power electronics and compute lose efficiency and throttle when hot; the sun loads the machine with heat the bench never saw; dust blocks the airflow the cooling design assumed. A power-and-thermal budget built from datasheet-nominal, room-temperature numbers is a budget that quietly fails at the operating point that matters. The motivation for this module's central discipline is that the machine must be sized to the **coincident worst case in the real envelope**, the hot afternoon, peak concurrent draw, dusty filters, low battery, because that is the operating point the field will reliably deliver, and the only one that proves the machine can work a full shift.

---

## Engineering Failure Cases (power-and-thermal-specific)

Sharpening Module 1's endurance/environmental classes:

- **Energy exhaustion mid-shift.** The power budget was built from average, not peak-coincident, draw; the battery empties before the coverage target. *Motivates* peak-and-average budgeting and realistic sizing (Section 6.2 to 6.3, Section 7).
- **Thermal throttling / shutdown.** Compute or power electronics overheat in field conditions and throttle (missing the cycle-time budget, CEC-01) or shut down. *Motivates* the thermal budget across the envelope (Section 6.5, EI-10).
- **Brownout / sag under peak.** Coincident peak draw (drive + pump + compute) sags the bus and resets a controller. *Motivates* the coincident-peak analysis and bus/regulation design (Section 6.4, Section 6.6).
- **Dominant-load blind spot.** Efficiency effort is spent on a minor load while the dominant one is untouched; endurance barely moves. *Motivates* attacking the dominant term (Section 6.4, EI-05).
- **Cold/hot derating ignored.** Battery capacity and electronics limits are taken at 25 °C; the field's temperature extremes break the budget. *Motivates* temperature derating (Section 6.3, Section 6.5, EI-12).

Each is a budgeting or integration decision away from prevention.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** electrical power ($P=VI$), energy ($E=\int P\,dt$, Wh), basic circuits and regulation; heat generation and dissipation (conduction/convection, thermal resistance); the M1 cycle-time budget (CEC-01) and platform; the M5 error-budget *method* and EI-05 (attack the dominant term); the M6 edge compute draw (CEC-04); the M8/M9 actuation and fluid-power loads; the M10 drive loads and operating envelope (EI-10); the M11 embedded nodes to power and host.

**Introduced here, used later:** the vocabulary of power and thermal engineering, *power budget (peak/average/duty cycle), energy store sizing, depth-of-discharge, C-rate, voltage sag, temperature derating, coincident peak, power bus/rail, regulation, protection (fusing, over-current, brownout), power sequencing, thermal budget/balance, thermal resistance, throttling, airflow/dust, thermal envelope*. Developed at applied (L2) depth; detailed power electronics/thermal design is referenced [->Doc F/H].

**Where this sits in the dependency graph.** M12 hard-depends on every load-generating module (M6 compute, M8/M9 actuation/fluid, M10 drive, M3 sensing) and consumes the M11 embedded system to power/host. It **masters** the power/energy, embedded-power, and thermal threads; it **applies** CEC-01 (throttling threatens the cycle budget), CEC-03/EI-05 (budget-and-attack-the-dominant, now for power/heat), CEC-04 (all loads are on-robot), and EI-10 (envelope-edge design). It hands forward: the sized energy store and endurance/coverage to M16 (economics/deployment); the power/thermal safety items (battery, high-current, stored energy interplay with M9) to M15; and the power/thermal models to M13/M14.

---

## 6. Theory

### 6.1 The machine's loads
Every subsystem is an electrical load with a characteristic draw and duty cycle: **compute** (the edge device, M6, steady tens of watts, GPU peaks during inference); **actuation** (the electric positioning mechanism, M8, peaks during moves); **fluid power** (the pump/compressor for the gripper, M9, duty-cycled to maintain pressure); **drive** (motors, M10, sustained, spiking on slopes/rough ground); **sensing** (M3, modest, steady); **embedded/aux** (M11 hosts, comms, cooling fans, steady). The power budget is the disciplined sum of these across the mission.

### 6.2 The power budget (peak and average)
Two numbers matter. **Average power** $\bar P$ (draw × duty cycle, summed) sets **energy per shift** and thus battery size and endurance. **Peak power** $P_\text{peak}$, and specifically the **coincident peak** (which loads can spike together: drive on a slope + a pump cycle + an inference burst), sets the bus/regulation and battery discharge (C-rate) requirements. A budget that uses average where peak matters (or ignores coincidence) undersizes the delivery and browns out. This is the power analogue of the placement budget's RSS: sum honestly, and know which term dominates.

### 6.3 Sizing the energy store
Required energy $E_\text{req}=\bar P \times t_\text{shift}$, adjusted for **usable fraction**: batteries are not fully dischargeable (depth-of-discharge limit), sag under high C-rate, and **derate with temperature** (cold reduces capacity; heat reduces life). So the installed capacity is $E_\text{install}=E_\text{req}/(\text{DoD}\times f_\text{temp}\times f_\text{sag})$ with margin. Endurance and field coverage (M10/M16) follow directly. The Amiga platform's own battery/interface (M1 SR-I-01) bounds what is available [VERIFY@PUB].

### 6.4 The dominant load (EI-05 applied)
Endurance is moved by attacking whichever load dominates average energy. Is it the edge GPU (steady, ~tens of watts), the fluid-power pump (duty-cycled but continuous pressure maintenance), or the drive (sustained motion)? The answer is machine-specific and must be *computed*, not assumed, and it redirects effort: if the drive dominates, lighter/slower operation or regenerative options help; if compute dominates, model/edge efficiency (M6) helps; if fluid power dominates, reducing pressure-maintenance duty (accumulators, better sealing, lower working pressure, M9) helps. This is EI-05 in the power domain: **attack the dominant term, not the convenient one.**

### 6.5 The thermal budget and the field envelope (EI-10 applied)
Heat generated ≈ power dissipated (most drawn power becomes heat). It must leave the machine: $Q_\text{gen}=Q_\text{dissipated}$ at steady state, with component temperature $T_\text{comp}=T_\text{ambient}+Q\cdot R_\text{thermal}$. The design must hold $T_\text{comp}\le T_\text{limit}$ **across the field's thermal envelope**, high ambient (a 45 °C afternoon [VERIFY@PUB]), **solar load** (sun on the machine), and **degraded airflow** (dust-clogged filters/heatsinks). A cooling design validated on a 20 °C bench with clean airflow can throttle the compute (breaking CEC-01) or shut down at the field's edge. The thermal envelope is the real spec (EI-10), and dust/solar are its harshest, most-often-ignored terms.

### 6.6 Electrical integration and embedded power architecture
The subsystems share a **power distribution** architecture: a main bus from the battery, regulated rails for compute/sensors/logic (clean, low-noise) separated from the noisy high-current actuation/drive rails, with **protection** (fusing, over-current, reverse-polarity, brownout detection) and **power sequencing** (bring up rails in a safe order; the safety monitor and its hardware controller, M11, must be powered and functional before actuators are enabled). Noise isolation matters: switching the drive/pump must not corrupt sensor signals or reset the compute. This is the electrical realization of the M11 integration.

### 6.7 Coupling to the rest of the machine
Power and thermal limits are not isolated: **throttling** violates the cycle-time budget (CEC-01); **endurance** sets field coverage and economics (M10/M16); **battery/high-current/stored-energy** hazards join the fluid stored-energy hazard (M9) in the safety case (M15); and the **cooling airflow** competes with dust ingress and enclosure sealing (an envelope tradeoff, EI-10). The power/thermal budget is a system negotiation, like every other budget in the course.

---

## 7. Mathematics

Rigor tier for M12: **L2**. Central results: the power/energy budget with derating, and the thermal balance across the envelope.

### 7.1 Power and energy budget
Average: $\bar P=\sum_i P_i\,d_i$ (draw × duty cycle). Energy per shift: $E_\text{shift}=\bar P\,t_\text{shift}$. Coincident peak: $P_\text{peak}=\max_t \sum_i P_i(t)$ over the mission (identify which loads coincide). *Use:* size energy (battery) from $\bar P$; size delivery (bus/C-rate) from $P_\text{peak}$.

### 7.2 Energy-store sizing with derating
$E_\text{install}=\dfrac{E_\text{shift}}{\text{DoD}\cdot f_\text{temp}\cdot f_\text{sag}}\times(1+\text{margin})$; endurance $t=\dfrac{E_\text{usable}}{\bar P}$; coverage $\approx t\times v_\text{eff}\times\text{swath}$ (M10). *Use:* size the battery to a real shift at the envelope's temperature, not nominal.

### 7.3 Dominant-load analysis (EI-05)
Rank $\{P_i d_i\}$; the largest is the dominant energy term. Sensitivity: $\partial E_\text{shift}/\partial(\text{efficiency of load }i)$ is largest for the dominant load, so a given efficiency gain there moves endurance most. *Use:* direct efficiency effort quantitatively (EI-05 in the power domain).

### 7.4 Thermal balance across the envelope (central)
Steady state: $T_\text{comp}=T_\text{ambient}+ (Q_\text{gen}+Q_\text{solar})\,R_\text{thermal}$. Require $T_\text{comp}\le T_\text{limit}$ at the **worst-case** $T_\text{ambient}$ (envelope max) with **degraded** $R_\text{thermal}$ (dust) and **added** $Q_\text{solar}$. Solve for the required cooling ($R_\text{thermal}$ target) or the allowable $Q_\text{gen}$ (which may cap sustained compute/actuation). *Use:* design cooling to the field edge; find whether the machine must throttle on the hottest afternoon (a CEC-01 risk). **Grad (L3):** transient thermal (thermal mass, duty-cycled peaks), a short peak may be absorbed by thermal mass without steady-state throttling.

---

## 8. Engineering Principles

1. **Budget power like accuracy** (CEC-03 method): sum honestly, peak *and* average, and find the dominant term.
2. **Attack the dominant load** (EI-05): efficiency effort pays only where the energy is.
3. **Size to the worst-case operating point** (EI-12/EI-10): coincident peak, hot, dusty, sagging, not nameplate.
4. **Heat is the shadow of power**, every watt drawn must be dissipated across the thermal envelope.
5. **Separate clean and noisy power**, protect compute/sensing from actuation/drive switching.
6. **Sequence power for safety**, the safety monitor is up before actuators are enabled (M11).
7. **Throttling is a cycle-time failure** (CEC-01) and endurance is a coverage/economics number (M10/M16), power/thermal is a system budget.

---

## 9. System Requirements

Derived from the power/thermal mission; apply CEC-01/CEC-03 method/EI-05/EI-10. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-37 | Performance | The energy store shall provide the required shift endurance/coverage at the envelope's temperature, with DoD/sag/temp derating and margin. | Budget + bench + field |
| SR-P-38 | Performance | The power delivery (bus, regulation, battery C-rate) shall supply the coincident peak load without brownout. | Peak analysis + load test |
| SR-C-12 | Constraint | Component temperatures shall stay within limits across the thermal envelope (max ambient + solar + degraded airflow) without throttling below the cycle-time budget (CEC-01). | Thermal analysis + field test |
| SR-F-17 | Functional | Power distribution shall isolate clean (compute/sensing) from noisy (actuation/drive) rails and include protection (fusing, over-current, brownout). | Review + test |
| SR-F-18 | Functional | Power sequencing shall bring up the safety monitor/hardware safety controller (M11) before enabling actuators. | Test |
| SR-S-02 | Safety | Battery/high-current/stored-energy hazards shall be mitigated and included in the safety case (with M9 fluid stored energy). | Safety review (M15) |
| SR-I-17 | Interface | Power/thermal models shall exist for verification (twin/bench). | Review (->Doc G) |

Traceability: SR-P-37 -> M10/M16 (coverage/economics); SR-P-38 -> Section 6.4 coincident peak; **SR-C-12 -> CEC-01 (throttling), EI-10**; SR-F-17/18 -> M11; SR-S-02 -> M9/M15; SR-I-17 -> twin/M13.

---

## 10. Design Decisions

- **DD-69 Peak-and-average power budget with coincident-peak analysis.** *Rationale:* Section 6.2/Section 7.1; size energy and delivery correctly. *Serves:* SR-P-37/38.
- **DD-70 Energy store sized with DoD/sag/temperature derating + margin.** *Rationale:* Section 6.3/Section 7.2; a real shift at the envelope temperature. *Serves:* SR-P-37.
- **DD-71 Efficiency effort directed at the computed dominant load.** *Rationale:* Section 6.4/Section 7.3, EI-05. *Serves:* SR-P-37.
- **DD-72 Thermal design to the field envelope** (max ambient + solar + degraded airflow). *Rationale:* Section 6.5/Section 7.4, EI-10/EI-12. *Serves:* SR-C-12.
- **DD-73 Split clean/noisy power rails with protection.** *Rationale:* Section 6.6; protect compute/sensing. *Serves:* SR-F-17.
- **DD-74 Safety-first power sequencing.** *Rationale:* Section 6.6; monitor up before actuators. *Serves:* SR-F-18.
- **DD-75 Dust/airflow/sealing envelope tradeoff resolved for cooling.** *Rationale:* Section 6.5/Section 6.7; cooling vs. ingress. *Serves:* SR-C-12.

---

## 11. Trade Studies

### 11.1 TS-23: Cooling strategy
**Alternatives:** (A) **passive (heatsink/conduction)**; (B) **forced-air (fans + filtered intake)**; (C) **sealed enclosure + heat exchanger**; (D) **liquid cooling**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B/Doc F).

| Criterion (weight) | A: Passive | B: Forced-air | C: Sealed+HX | D: Liquid |
|--------------------|:---:|:---:|:---:|:---:|
| Cooling capacity at envelope max + solar (0.26) | 2 | 4 | 4 | 5 |
| Dust/ingress robustness (0.24) | 5 | 2 | 5 | 4 |
| Simplicity / reliability / cost (0.20) | 5 | 4 | 3 | 2 |
| Power overhead of cooling (0.14) | 5 | 3 | 3 | 2 |
| Mass / packaging (0.16) | 4 | 4 | 3 | 2 |
| **Weighted total** | **3.86** | **3.36** | **3.78** | **3.34** |

**Selected: A (passive) where thermal load allows, escalating to C (sealed enclosure + heat exchanger) for the heat-dense compute/power electronics.** Passive is most reliable and dust-proof but capacity-limited; forced-air's filtered intake is exactly what the field's dust degrades (the EI-10 failure mode); a sealed enclosure with an external heat exchanger keeps dust out while still shedding the compute's heat. The choice is load-dependent: passive for low-dissipation items, sealed+HX for the GPU/power stage. Recorded weakness: sealed+HX adds mass and cost and its capacity must be verified at the envelope max with solar load, flagged for SR-C-12 field testing.

### 11.2 TS-24: Energy store / architecture (summary)
**Alternatives:** platform (Amiga) battery only, supplemental battery pack, swappable packs, (hybrid genset, rejected for emissions/noise near produce/field). **Criteria:** endurance/coverage, recharge/turnaround, mass, cost, safety. **Outcome:** **platform battery + sized supplemental pack, swappable for shift turnaround**, meet endurance with margin and swap to extend the working day, keeping within the Amiga's electrical interface [VERIFY@PUB]. This ties directly to M16 coverage economics.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **The power/energy budget and the thermal budget.** *Verdict: no new CEC, these are the CEC-03 budget method applied* to power and heat (sum per-subsystem contributions, size to requirement, attack the dominant term via EI-05). Recognizing them as the *same analytical tool* in a new domain, rather than minting parallel "power-budget" and "thermal-budget" CECs, is exactly the restraint the discipline requires; the budget-and-dominant-term method is one enduring tool, and CEC-03 already is it.
- **Embedded power / electrical integration.** *Verdict: not a CEC.* Mastered techniques, captured in the electrical-integration thread.
- **EI-12 (Size to the Worst-Case Operating Point)** is added as this module's Engineering Insight, reinforcing EI-10 (the field is the spec) and the CEC-03/EI-05 budget discipline. *(No new CEC this module; one EI added, within discipline.)*

> **Cross-module synthesis note (lightweight).** The budget method the course designated for *accuracy* (CEC-03: sum the terms, attack the dominant one, EI-05) turns out to be the same method for *energy* and *heat*, three different physical quantities, one analytical tool. That reuse is the argument for keeping the anchor set small: a good design tool is domain-general, and minting a new CEC for each quantity it touches would hide, not reveal, that generality.

> **Simulation-first hook.** The power and thermal budgets are modeled in the twin/bench (Section 12, Section 13), including a hot, dusty, high-load envelope-edge scenario, before field trials confirm endurance and thermal margin (EI-10/EI-12).

---

## 12. Simulation Activities

M12 runs at **bench/SIL -> HIL**; the twin and a power/thermal model become the budgeting instruments.

**SA-1, Power budget assembly.** In a model, sum per-subsystem draws (compute M6, actuation M8, fluid pump M9, drive M10, sensing M3) with duty cycles into average and coincident-peak power (Section 6.2, Section 7.1). *Outcome:* the machine's power budget with the dominant term identified.

**SA-2, Endurance/coverage sizing.** From the budget and a battery model (DoD, sag, temp derating), compute installed capacity, endurance, and field coverage across ambient temperatures (Section 6.3, Section 7.2, SR-P-37). *Outcome:* endurance vs. temperature curve (hand to M16).

**SA-3, Thermal envelope sweep.** Model $T_\text{comp}$ vs. ambient with solar load and degraded airflow; find the throttle/limit point and required cooling (Section 6.5, Section 7.4, SR-C-12). *Outcome:* the thermal margin at the envelope edge (EI-10).

**SA-4, Dominant-load sensitivity.** Vary each load's efficiency and observe endurance change; confirm the dominant load moves it most (Section 7.3, EI-05). *Outcome:* efficiency effort directed quantitatively.

---

## 13. Digital Twin Activities

**DTA-1, Power/thermal model spec (deliverable to Doc G).** Specify the twin/bench power model (per-subsystem draw, duty cycles, battery derating) and thermal model (generation, $R_\text{thermal}$, solar, ambient). *Outcome:* SR-I-17; the power/thermal verification models.

**DTA-2, Envelope-edge scenario (EI-10/EI-12).** Specify a worst-case scenario, hot afternoon, coincident peak (drive on slope + pump + inference), dusty filters, low battery, and the pass criteria (no brownout, no throttle below CEC-01, endurance met). *Outcome:* the operating point that actually proves the machine (feeds M14).

**DTA-3, Coverage/economics handoff.** Package endurance and coverage vs. temperature for M16 economics and M10 field planning. *Outcome:* energy tied to harvest economics.

---

## 14. Hardware Activities

*(Tiered: bench/field protocols at specification level.)*

**HA-1, Power-draw characterization.** Specify bench measurement of each subsystem's real draw and duty cycle (vs. datasheet), and the machine's average/peak (SR-P-37/38). *Deliverable:* a measured power budget (validates the model, EI-06).

**HA-2, Thermal field verification.** Specify a hot-day/solar field measurement of component temperatures under sustained load with realistic dust (SR-C-12). *Deliverable:* thermal margin at the envelope edge.

**HA-3, Protection/sequencing verification.** Specify tests of fusing/over-current/brownout and safety-first power sequencing (SR-F-17/18). *Deliverable:* electrical-safety verification (feeds M15).

---

## 15. Software Activities

**SWA-1, Power/thermal telemetry & management.** Specify on-robot monitoring of battery state, per-rail current, and temperatures, with a management policy (throttle order, low-battery return-to-base) that respects the safety monitor (M11) and cycle-time budget. *Outcome:* runtime power/thermal awareness.

**SWA-2, Envelope-aware operation.** Specify how the machine detects approaching power/thermal limits and degrades gracefully (slow, pause to cool, return to charge) rather than browning out or throttling silently (EI-10 tie-in). *Outcome:* fail-operational power/thermal behavior (feeds M15).

---

## 16. ROS 2 Integration

Power and thermal management become **monitoring nodes** feeding the safety monitor and behavior layer (M11): battery/rail/temperature telemetry publishes at low rate; a management policy can request the behavior node slow or pause (respecting the cycle-time budget, CEC-01) and can trigger a safe return-to-base at low battery. Critically, the **power sequencing** ensures the safety monitor and its hardware controller (M11) are powered and functional before actuators are enabled (SR-F-18), an electrical precondition of the safety architecture. On-robot (CEC-04). M11 owns the real-time graph; M12 powers and thermally bounds it.

---

## 17. AI Integration

M12 constrains the AI more than it uses it: the edge compute that runs perception and policy (M4/M5/M7) is a major power and thermal load, so **the AI's energy and heat cost is a first-class budget item.** Two couplings: (1) a bigger/heavier model (M4) that improves recall may raise power and heat enough to shorten endurance or force throttling (breaking CEC-01), the accuracy/energy tradeoff must be evaluated at the system level, not just for accuracy; (2) model/edge efficiency work (M6) is *the* lever if compute is the dominant load (EI-05). Learning may also help power management (predictive thermal/energy management), but any such component is bounded and monitored like all others (EI-07/EI-11). This closes a loop: the AI's appetite (M4/M6) is paid for here.

---

## 18. Edge Computing Integration

This module supplies the edge device's power and cooling, the physical substrate M6 assumed. Three couplings fixed here: (1) the compute draw (M6) is a top candidate for the dominant load (EI-05), so edge efficiency (quantization, right-sized models) pays in *endurance*, not just latency; (2) **thermal throttling is a cycle-time failure**, if the GPU throttles at the envelope's temperature, the perception/control latency M6 budgeted (CEC-01) is blown, so the thermal design (Section 6.5) directly protects the compute budget; (3) the sealed-enclosure cooling (TS-23) must shed the compute's heat without admitting dust. The edge module's performance is only real if this module keeps it powered and cool at the field edge.

---

## 19. Fluid Power Integration

The fluid-power gripper (M9) is an electrical load and a shared safety concern here. Two couplings: (1) the **pump/compressor** maintaining grip pressure draws power on a duty cycle, a candidate dominant load (EI-05); reducing its duty (accumulators, lower working pressure, better sealing, M9 choices) is an endurance lever, tying the fluid-power design to the energy budget; (2) the fluid system's **stored energy** hazard (M9) joins the battery/high-current hazards in this module's electrical safety scope and the M15 safety case (SR-S-02), the machine now has two stored-energy domains (fluid and electrical) that the safety case must treat together. The baseline keeps working pressure modest (M9 pneumatic choice) partly *for* this power/thermal/safety budget.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M12-1, Power Budget Builder.** Sliders for each subsystem's draw and duty cycle; live average and coincident-peak power, endurance, and the dominant-load bar (EI-05). *Goal:* Section 6.2/Section 6.4.
- **W-M12-2, Battery Sizing & Derating.** Sliders for capacity, DoD, temperature, and C-rate/sag; live usable energy, endurance, and coverage (Section 6.3). *Goal:* realistic sizing.
- **W-M12-3, Thermal Envelope Explorer.** Sliders for ambient, solar load, dust (raises $R_\text{thermal}$), and dissipation; live component temperature vs. limit and throttle point (Section 6.5/Section 7.4, EI-10). *Goal:* thermal-margin intuition.
- **W-M12-4, Dominant-Load Sensitivity.** Improve one load's efficiency and watch endurance move most for the dominant one (Section 7.3, EI-05). *Goal:* direct effort where energy is.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M12-1** Power distribution architecture: battery -> main bus -> clean/noisy rails -> subsystems, with protection and sequencing (annotated).
- **CAD-M12-2** Thermal path: heat sources (GPU, drives, pump), sealed enclosure + heat exchanger, solar load, dust on airflow.
- **CAD-M12-3** Power budget stacked bar (per-subsystem draw) with the dominant load highlighted.
Format per ->Doc J / Doc F (electrical/thermal schematic conventions).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M12-1 | Machine power budget (per-subsystem, average & coincident peak) | Section 6.2 |
| F-M12-2 | Battery sizing with DoD/temp/sag derating | Section 6.3/Section 7.2 |
| F-M12-3 | **Dominant-load analysis (where efficiency pays)** | Section 6.4/Section 7.3 (EI-05) |
| F-M12-4 | Thermal balance vs. ambient + solar + dust (throttle point) | Section 6.5/Section 7.4 (EI-10) |
| F-M12-5 | Power distribution: clean/noisy rails, protection, sequencing | Section 6.6 |
| F-M12-6 | Endurance/coverage vs. temperature | Section 7.2 (->M16) |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M12-1** Subsystem draws stacking into the coincident peak as drive climbs a slope while the pump cycles and inference bursts, the brownout risk.
- **AN-M12-2** Component temperature rising as ambient + solar climb and dust clogs airflow, reaching the throttle point and the cycle-time budget breaking (EI-10).
- **AN-M12-3** Improving the dominant load's efficiency vs. a minor one, and the endurance bar moving far more for the former (EI-05).

---

## 24. Laboratory

**Lab M12, Power, Thermal, and Endurance Budgeting to the Field Envelope**

- **Objectives.** (1) Build the machine's peak-and-average power budget; (2) size the energy store with realistic derating and compute endurance/coverage; (3) find and attack the dominant load (EI-05); (4) build the thermal balance and check it at the envelope edge (EI-10/EI-12); (5) verify against a bench/twin model.
- **Equipment.** The power/thermal model + twin; measured or datasheet subsystem draws [VERIFY@PUB]; battery and thermal parameters; notebook. **Safety:** if any real high-current/battery work, follow electrical-safety and battery-handling procedures.
- **Procedure.**
  1. Assemble the power budget: per-subsystem draw × duty cycle -> average; identify coincident peaks (Section 6.2, Section 7.1).
  2. Size the battery for a target shift with DoD/temp/sag derating; compute endurance and coverage at nominal and at the envelope's temperature (Section 6.3, Section 7.2, SR-P-37).
  3. Rank loads; identify the dominant one; test an efficiency improvement there vs. elsewhere and compare endurance change (Section 7.3, EI-05).
  4. Build the thermal balance; find $T_\text{comp}$ at max ambient + solar + degraded airflow; determine the required cooling or the throttle point (Section 7.4, SR-C-12).
  5. Compare to the bench/twin model; report the margin at the envelope edge (DTA-2).
- **Data collection.** Power budget table (avg/peak, dominant term); battery sizing and endurance/coverage vs. temperature; efficiency-sensitivity result; thermal balance and throttle point; model comparison.
- **Analysis.** What is the dominant load, and how much does attacking it help? Does the machine meet endurance at the envelope temperature? Does it throttle on the hottest afternoon? What margin remains?
- **Discussion.** Why size to the coincident worst case, not nameplate (EI-12)? Why is the power budget the same method as the placement budget (CEC-03/EI-05)? How does throttling threaten CEC-01?
- **Deliverables.** A 4 to 6 page report: power budget, battery sizing/endurance, dominant-load analysis, thermal envelope check, model verification.
- **Rubric (100 pts).** Power budget (18); battery sizing & endurance with derating (20); dominant-load analysis (18, EI-05); thermal envelope check (24, EI-10/EI-12); model verification (10); communication (10). *Graduate band adds:* transient thermal (thermal-mass absorption of peaks, Section 7.4 grad) and a cited source.
- **Expected results.** A budget with a clear dominant load (often compute or drive); a battery size larger than a naïve nominal estimate once derating is applied; an efficiency effort that only moves endurance meaningfully when aimed at the dominant load; and a thermal margin that is comfortable at 20 °C but tight, possibly throttling, at the envelope's hot, dusty edge, vindicating EI-12.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Power budget.** Given subsystem draws and duty cycles, compute average and coincident-peak power; identify the dominant energy term.
2. **Battery sizing.** For a target shift and average power, size the installed capacity with DoD, temperature, and sag derating; compute endurance.
3. **Dominant load (EI-05).** Given the ranked loads, compute the endurance gain from a stated efficiency improvement on the dominant vs. a minor load; recommend where to invest.
4. **Thermal balance.** Given generation, thermal resistance, ambient, and solar load, compute component temperature; determine whether it throttles at the envelope max and what cooling is needed.
5. **(Grad) Transient thermal.** With thermal mass, determine whether a duty-cycled peak load is absorbed without steady-state throttling; find the sustainable duty cycle.
6. **(Grad) Accuracy/energy tradeoff.** A larger detection model (M4) raises recall but also power/heat; evaluate the system-level tradeoff (endurance and throttling vs. yield) and recommend an operating point.

---

## 26. Quiz

1. **(MC)** Battery size (endurance) is set primarily by: (a) peak power; (b) average power over the shift with derating; (c) voltage; (d) the dominant peak only. **[b]**
2. **(MC)** Power-delivery/bus sizing and brownout are set by: (a) average power; (b) the coincident peak load; (c) ambient temperature; (d) DoD. **[b]**
3. **(MC)** Thermal throttling of the edge compute is dangerous because it: (a) saves energy; (b) blows the latency/cycle-time budget (CEC-01); (c) improves accuracy; (d) cools the battery. **[b]**
4. **(MC)** To improve endurance most, direct efficiency effort at: (a) any convenient load; (b) the dominant energy load (EI-05); (c) the smallest load; (d) the sensors. **[b]**
5. **(Short)** State EI-12 and one SIM2FIELD example. **[Size to the worst-case operating point, not the nameplate: e.g., battery and cooling sized for a hot, dusty afternoon at coincident peak with a sagging battery, not a 20 °C bench.]**
6. **(Calc)** Loads: compute 60 W (100% duty), drive 200 W (40%), pump 150 W (20%). Average power? **[$60+80+30=170$ W; dominant = compute at 60 W avg... check: drive 80 W avg is largest -> dominant is drive.]**
7. **(Calc)** Average 170 W, shift 6 h, DoD 0.8, temp factor 0.9. Installed capacity? **[$E_\text{shift}=1020$ Wh; $E_\text{install}=1020/(0.8\times0.9)\approx1417$ Wh.]**
8. **(Design)** Why size the thermal design to max ambient + solar + dust, not the bench? **[The field reliably delivers that operating point; a bench-validated cooling design throttles/fails there, EI-10/EI-12.]**
9. **(Critical thinking)** Why is the power budget "the same tool" as the placement budget (CEC-03)? **[Both sum per-subsystem contributions, size to a requirement, and attack the dominant term (EI-05), one analytical method across accuracy, energy, and heat.]**
10. **(Critical thinking)** How can a better perception model *hurt* the machine? **[Higher power/heat may shorten endurance or cause throttling that breaks the cycle-time budget, an accuracy/energy system tradeoff, not a pure win.]**

*(Quiz note: item 6 illustrates that the dominant term must be computed, not guessed, the drive's 80 W average exceeds compute's 60 W here, though intuition often says "compute." That is exactly the EI-05 lesson.)*

---

## 27. Challenge Problems

- **CP-M12-A, Full energy-and-thermal shift design.** Size the battery and cooling for a full working shift at the field's thermal envelope, meeting endurance/coverage (M10/M16) without brownout or throttling (CEC-01). Identify the binding constraint (energy, delivery, or heat) and the dominant load. (Bridges CEC-01, CEC-03/EI-05, EI-10, M10, M16.)
- **CP-M12-B, Accuracy/energy/throughput co-design.** Given the M4 model options (recall vs. compute), M6 efficiency levers, and this module's budgets, choose an operating point that maximizes harvested value per charge, balancing recall (yield), power (endurance), and throttling (throughput). (System-level optimization.)
- **CP-M12-C, Two stored-energy domains.** Design the combined safety treatment of fluid stored energy (M9) and electrical/battery stored energy for the M15 safety case: hazards, mitigations, and interactions (e.g., a fault energizing both). (Feeds M15.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your power budget uses subsystem draws that may be datasheet-nominal at room temperature. How do real duty cycles, temperature, and aging change them, and does your margin cover the gap between nameplate and measured (EI-06/EI-12)?
2. **Tradeoffs.** You chose passive cooling where possible and a sealed enclosure for the compute. Defend that to a reviewer who wants simple forced-air fans. What does dust do to the fan design over a season, and what does the sealed enclosure cost in mass and capacity?
3. **Risk.** On the hottest afternoon, at coincident peak, with dusty filters and a half-discharged battery, does the machine brown out or throttle? Walk the worst case; what is the margin, and what does the machine do when it approaches the limit?
4. **Verification.** You verified the budget in a model and on a bench. A reviewer notes both were cooler and cleaner than the field. How do you make the power/thermal verification represent the real envelope edge (EI-10), and what field data closes it?
5. **Subsystem interaction.** Improving the perception model (M4) raised recall but also power and heat. Who owns the decision that trades yield against endurance and throttling, and how is that tradeoff surfaced rather than buried in a subsystem choice?
6. **Safety.** The machine now stores energy in two domains, pressurized fluid (M9) and the battery. What happens in a fault that touches both, and what does the M15 safety case need beyond each domain's individual mitigations?

---

## 28. Instructor Notes

- **Timing.** Section 6.2 to 6.4 (power budget, sizing, dominant load) and Section 6.5 (thermal envelope) are the core (~3 h); EI-12 and the CEC-03/EI-05 reuse (Section 11.3 synthesis note) are the peaks. Trade studies (Section 11) and the budgeting activities (Section 12) form an interactive block (~1.5 h). Lab M12 is a separate 2 to 3 h session.
- **Common misconceptions.** (1) "Average power sizes everything", peak/coincident sizes delivery. (2) Intuiting the dominant load, compute it (quiz item 6). (3) Bench thermal = field thermal, EI-10/EI-12. (4) "Better model is always better", its energy/heat cost is a system tradeoff.
- **On EI-12 and the no-CEC decision.** EI-12 (size to the worst-case operating point) is the *judgment*; the *tool* is CEC-03's budget method reused for power/heat with EI-05. Make the reuse explicit, it is the strongest example yet of why the anchor set stays small: one method, three quantities (accuracy, energy, heat).
- **On the couplings.** This module closes loops opened earlier: the AI's appetite (M4/M6), the fluid pump's duty (M9), the drive's energy (M10) all get *paid for* here, and throttling ties back to CEC-01. Teach it as the module where the machine's promises meet its energy reality.
- **Where to push graduate students.** Transient thermal (HW5), accuracy/energy co-design (HW6, CP-M12-B), two-domain stored-energy safety (CP-M12-C).
- **Thread to keep visible.** Close by naming hand-offs: endurance/coverage -> M16; power/thermal/battery safety -> M15; power/thermal models -> M13/M14.

---

## 29. Research Frontiers

- **Landmark grounding.** Battery/energy-storage and electric-vehicle power-budgeting references; power-electronics and embedded power-distribution references; electronics thermal-management references. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Energy-efficient edge AI for power-constrained robots; predictive thermal/energy management for field robots; high-density, dust-tolerant cooling for outdoor embedded compute; battery health/derating modeling under field temperature and load; energy-aware task/coverage planning that maximizes harvested value per charge.
- **Open problems.** Reliable thermal design for high-power edge AI in hot, dusty, solar-loaded field conditions; accurate field-representative power/thermal prediction; co-optimizing accuracy, energy, and throughput for a working shift; safe integration of multiple stored-energy domains.
- **Suggested thesis directions.** (1) Energy-and-thermal-aware operation that maximizes harvested value per charge across the field envelope. (2) Dust-tolerant high-capacity cooling for field edge-AI compute validated at the envelope edge. (3) Unified stored-energy safety analysis for combined fluid and electrical systems on a field robot.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Battery / energy-storage / power-budgeting references, sizing, DoD, derating, endurance (Section 6.2 to 6.3, Section 7.1 to 7.2).
- Power-electronics / embedded power-distribution references, buses, regulation, protection, sequencing (Section 6.6).
- Electronics thermal-management references, thermal balance, cooling, throttling (Section 6.5, Section 7.4).
- Field-robotics energy/thermal literature, operation across the environmental envelope (Section 6.5; EI-10/EI-12).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 11**, and (forthcoming) Doc B, Doc C, Doc F, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module budgets the machine's **energy and heat**, the two quietest killers of field robots, and it does so by *reusing the course's own budget method*: it treats the power and thermal budgets as the **CEC-03 budget-and-attack-the-dominant-term tool (EI-05) applied to new quantities**, rather than inventing parallel frameworks. It sizes energy to a **real shift at the envelope temperature** (DoD/sag/temperature derating), sizes delivery to the **coincident peak**, and directs efficiency effort at the **computed dominant load** (with a quiz item deliberately overturning the intuitive answer). It designs the thermal system to the **field's hot, dusty, solar-loaded edge (EI-10)**, ties throttling explicitly back to the **cycle-time budget (CEC-01)**, and closes loops opened earlier, the AI's power/heat appetite (M4/M6), the fluid pump's duty (M9), the drive's energy (M10) are all *paid for* here. Its Engineering Insight, **EI-12 (Size to the Worst-Case Operating Point)**, sharpens EI-10 into a concrete sizing discipline. The explicit CEC evaluation correctly mints **no new CEC**, the strongest example yet of one analytical tool spanning three physical quantities. All 30 sections present; the Engineering Design Review is included; one lightweight synthesis note (the CEC-03 method reused); consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Subsystem draws, battery capacity, ambient/solar extremes, and thermal parameters depend on Doc B/C/F and real hardware; the budgeting, sizing, and thermal *methods* are exact.
2. **The dominant load is machine-specific and currently illustrative.** Which of compute/drive/pump dominates depends on real measured draws (Doc F/bench); the *method* to find and attack it is exact, but the answer awaits data.
3. **Thermal margin at the envelope edge is modeled, not field-validated.** The hot/dusty/solar worst case is specified (EI-10/EI-12); real thermal validation awaits hardware and Doc G/field trials.
4. **Two stored-energy domains now exist (fluid + electrical).** Their combined safety treatment is set up here but authored in the M15 safety case (SR-S-02/CP-M12-C).

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/C/F/G and by bench/field validation.

**END OF MODULE 12, STOP. Awaiting your review before freezing Module 12 or proceeding to Module 13.**
