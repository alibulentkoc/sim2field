# Doc F: Detailed Engineering References

**SIM2FIELD, Autonomous Watermelon Harvesting Robotics**
**P0 Support Document F**, *The authoritative mechanical, electrical, fluid, and software/implementation engineering reference layer*
**Status:** **Rev 1.0, frozen configuration-controlled baseline (approved).** Revision-controlled.
**Depends on:** Doc B (Rev 1.0, requirements & ratified parameters), Doc C (Rev 1.0, hardware config), Doc G (Rev 1.0, twin models), Doc E (Rev 1.0, safety)
**Controlling baseline for:** the engineering relations, sizing methods, and implementation guidance underlying the frozen modules' Section 7 (Mathematics) and design decisions

> **Authoring note (harvest-and-ratify doctrine).** Consistent with the P0 doctrine and configuration-control policy: this document **harvests rather than rewrites**. It is the **reference layer**, it consolidates the engineering relations the frozen modules already derived in their Section 7 (Mathematics) sections and design decisions, organizes them by discipline (mechanical, fluid, electrical/power, software/control), and states the sizing methods and implementation guidance that realize the ratified parameters (Doc B Section 5). It **derives no new engineering** and changes no module; it collects and cross-references what the curriculum established, pointing to landmark references (**Doc H** bibliography) rather than reproducing copyrighted material. Relations are stated in the modules' own notation. Where a method yields a number, that number is the ratified value from Doc B (cited, not re-derived). Educational authority remains in the modules; engineering-reference authority lives here.

---

## 1. Purpose, Scope & Authority

### 1.1 Purpose
Doc F is the single source of truth for **the engineering relations and sizing methods that underlie the machine**. Where Doc B says *what* the parameters are, Doc C says *what hardware* realizes them, and Doc G says *how the twin models them*, Doc F says *how the engineering works*, the equations, sizing procedures, and implementation guidance an engineer uses to derive, check, or reproduce the design. It is the bridge from the curriculum's teaching-level mathematics (module Section 7) to a working engineering reference.

### 1.2 Scope
In scope, organized by discipline: mechanical engineering (manipulator kinematics, workspace, singularities, stiffness/structure); fluid power (actuator dynamics, force/pressure, compliance, relief); electrical/power (power/energy budget, thermal, rails, protection); software/control (real-time control, force loops, the ROS 2 graph, edge deployment); and the cross-cutting error-budget and cycle-time composition methods. Each relation is harvested from the owning module's Section 7 and cross-referenced to the requirement it serves and the ratified value it yields.

Out of scope (owned elsewhere): requirements/values (**Doc B**); hardware config/BOM (**Doc C**); twin fidelity (**Doc G**); the safety case (**Doc E**); the full bibliography (**Doc H**, Doc F cites landmark references by role); pedagogy (the modules). Doc F is the *engineering reference*, not the requirements, the hardware, or the teaching.

### 1.3 Authority
Doc F holds **reference authority over the engineering relations and sizing methods**. When any artifact needs "the equation for X" or "how Y is sized," Doc F is the citation. It is consistent with the modules (it harvests their Section 7) and with Doc B (its methods yield Doc B's ratified values) by construction. It reproduces **no copyrighted text**; it states relations in the modules' notation and points to landmark references (Doc H) for derivations and standards.

### 1.4 Notation
Symbols follow the frozen modules: $\sigma$ (standard deviation / error-budget term), $\gamma$ (transmission angle), $\mu$ (manipulability), $L_i$ (actuator length), $F$ (force), $P$ (pressure), $A$ (area), $k$ (stiffness), $\tau_d$ (dead time/latency), $R_\text{thermal}$ (thermal resistance), $T_\text{cycle}$ (cycle time). Ratified numeric values are cited from Doc B Section 5.

---

## 2. Mechanical Engineering Reference (M8)

### 2.1 Manipulator kinematics (rail-mounted parallel two-actuator)
The reference architecture (DD-42) is a parallel two-actuator mechanism. For a gripper point $G$ and actuator base points $B_i$, the **inverse kinematics** gives each actuator length directly:
$$L_i = |G - B_i|$$
a closed-form relation (DD-47) cheap enough for the edge (no iterative solver). Forward kinematics recovers $G$ from $(L_1, L_2)$ by intersection of the two length circles/spheres. *Serves:* SR-P-25/28; *reference:* parallel-mechanism kinematics (Doc H).

### 2.2 The Jacobian, manipulability, and singularities
The Jacobian $J$ maps actuator rates to gripper velocity ($\dot G = J\,\dot L$). Two conditioning metrics govern the safe operating region:
- **Manipulability** $\mu = \sqrt{\det(JJ^\top)}$, must stay $\ge \mu_\text{min}$ (well-conditioned motion).
- **Transmission angle** $\gamma$, must stay in the keep-out interval **[45°, 135°]** (Doc B Section 5.5, SR-C-07), away from the singularities where force transmission collapses (DD-44).

The singularity map over the workspace is precomputed; the operating region is the subset satisfying both metrics. *Serves:* SR-C-07; *reference:* screw theory / manipulability (Doc H).

### 2.3 Workspace sizing
The workspace must cover the pick region, bed width (1.5 m) + margin => **transverse span ≥ 1.7 m** (Doc B Section 5.5, SR-P-25), within the γ/μ keep-out. Track width is jointly constrained: the reach lower bound (workspace) and the stability upper bound (M10) define the feasible interval **[1.6 m, 2.2 m]**, design **1.8 m** (Doc B Section 4.3, SR-I-11/14). *Serves:* SR-P-25, SR-I-11.

### 2.4 Stiffness and structural deflection
Effective end-effector stiffness $k_\text{eff}$ must keep static deflection under the payload within the mechanism error allocation:
$$\delta = \frac{F_\text{payload}}{k_\text{eff}} \le \sigma_\text{mech}\ \text{(budget)}$$
For a 10 kg payload (≈100 N) and $\sigma_\text{mech} = 6$ mm (Doc B Section 5.2), $k_\text{eff,req} \ge 20$ N/mm (Doc B Section 5.5, SR-P-27, DD-45). Structure is sized so the *combined* actuator + structural compliance meets this while the gripper still presents *contact* compliance for bruise-avoidance (the M8/M9 stiffness<->compliance coupling; Section 3.4). *Serves:* SR-P-26/27; *reference:* machine-design stiffness (Doc H).

---

## 3. Fluid-Power Engineering Reference (M9)

### 3.1 Pressure-to-force
The fluid actuator converts pressure to force through the effective area:
$$F = P\,A$$
Force is regulated by controlling pressure (DD-49, "pressure-as-force"), read back by the pressure sensor (Doc C Section 3.2). The grip-force window **[250 N, 800 N]** (Doc B Section 5.3) maps to a pressure range via $A$. *Serves:* SR-P-29, SR-F-05; *reference:* fluid-power fundamentals (Doc H).

### 3.2 Intrinsic compliance and tunable stiffness
A fluid actuator is **intrinsically compliant**, the working fluid's compressibility (pneumatic) or line compliance gives a spring-like behavior:
$$k_\text{fluid} \propto \frac{A^2}{V}\,(\text{bulk modulus term})$$
so stiffness rises with area and falls with trapped volume. This makes stiffness *tunable* (DD-51), the same actuator can present higher stiffness for placement accuracy or lower stiffness (softer contact) for bruise-avoidance, the controllable margin at the heart of CEC-02 (DD-46/50). *Serves:* SR-P-30; *reference:* pneumatic compliance / impedance control (Doc H).

### 3.3 Force-control bandwidth and latency
The force loop must be fast enough for the grab/lift/swing timing (CEC-01) yet stable under the measured edge latency (CEC-04). Bandwidth is bounded by the dead time $\tau_d$ (sensing + compute + valve response): loop bandwidth must sit **below the limit set by $\tau_d$** for stability (DD-53). The real-time control loop worst-case is **≤ 20 ms** (Doc B Section 5.5, SR-P-22/35); the force-control bandwidth is tuned to that measured latency. Intrinsic compliance *helps*, it raises latency tolerance (a softer actuator is more forgiving of delay). *Serves:* SR-P-31; *reference:* sampled-data control / impedance control (Doc H).

### 3.4 The stiffness <-> compliance coupling (M8<->M9)
A key cross-subsystem relation: placement accuracy wants *high* end-effector stiffness (Section 2.4), while bruise-avoidance wants *low* contact stiffness (compliance). The resolution (DD-46/50/51): the fluid actuator provides **controllable** stiffness, stiff enough during positioning to meet $\sigma_\text{mech}$, compliant during contact to stay in the grip-force window. This is the negotiated whole (EI-17) at the mechanism level. *Serves:* SR-P-27/30.

### 3.5 The mechanical relief (physics-speed bound)
The mechanical pressure relief (Doc C Section 3.2, DD-52) physically caps pressure, and thus grip force via $F=PA$, below $F_\text{bruise}$ (≈800 N), **regardless of any controller or policy command** (SR-C-08). It acts at physics speed (effectively zero latency), providing the safety guarantee the software force loop cannot (EI-09; the physics-speed backstop of Doc E Section 4.3). This is both a functional bound (keeps grasp in the window) and safety hardware (Doc E Section 3.2). *Serves:* SR-C-08, SR-S-01; *reference:* relief-valve design (Doc H).

---

## 4. Electrical & Power Engineering Reference (M12)

### 4.1 Power budget (peak and average)
The power budget is built two ways (DD-69): **average** (for energy/endurance) and **coincident peak** (for delivery/no-brownout). Average draw ≈ **300 W** (Doc B Section 5.5: compute 40 + drive ~150 + pump ~50 + sensing 20 + aux 40). Coincident peak sums the *simultaneous* worst-case draws (drive + pump + compute together), which sizes the bus/regulation/battery C-rate (SR-P-38). *Serves:* SR-P-37/38; *reference:* power-systems sizing (Doc H).

### 4.2 Energy store sizing (with derating)
Usable energy = average power × shift hours; installed energy adds derating and margin:
$$E_\text{installed} = \frac{P_\text{avg}\cdot t_\text{shift}}{\text{DoD}\cdot k_\text{temp}}\cdot(1+\text{margin})$$
For ~300 W × 8 h = 2.4 kWh usable, DoD 0.8, temp derate 0.9: ≈ 3.3 kWh, rounded to **3 to 5 kWh installed** (Doc B Section 5.5, SR-P-37, DD-70). *Serves:* SR-P-37; *reference:* battery sizing/derating (Doc H).

### 4.3 Thermal budget
Component temperature rise over ambient is governed by dissipation and thermal resistance:
$$T_\text{comp} = T_\text{ambient} + Q\cdot R_\text{thermal} + \text{(solar load)}$$
The design point is **45 °C ambient + solar** (Doc B Section 4.2); the constraint is *no throttle below the cycle-time/latency budget* (SR-C-06/12). The dust<->airflow<->sealing tradeoff (DD-75) sets the cooling approach (Doc C: sealed with managed airflow). Efficiency effort targets the **dominant thermal/power load** (DD-71, EI-05), often the edge compute, whose right-sizing cuts cost, power, *and* heat at once. *Serves:* SR-C-12; *reference:* thermal management (Doc H).

### 4.4 Rails, protection, sequencing
Power distribution **splits clean (compute/sensing) from noisy (actuation/drive) rails** with protection (fusing, over-current, brownout) (DD-73, SR-F-17). **Safety-first sequencing** brings up the safety monitor / HW controller *before* enabling actuators (DD-74, SR-F-18), a power-architecture property that supports the independence claim (Doc E Section 5.2). *Serves:* SR-F-17/18; *reference:* power-distribution design (Doc H).

---

## 5. Software & Control Engineering Reference (M6/M7/M11)

### 5.1 The ROS 2 node graph
The software is a **ROS 2 node graph with typed interfaces and per-link QoS** (DD-62), split into a **real-time control plane** and a **best-effort perception plane** (DD-63, SR-C-10) so perception jitter cannot perturb control. The independent safety monitor (DD-64) and the unified guard arbitration with defined precedence (DD-65) sit in the control plane. *Serves:* SR-C-10, SR-F-15/16; *reference:* ROS 2 / real-time robotics (Doc H).

### 5.2 Real-time timing and worst-case latency
Each control loop must meet its deadline with **bounded worst-case latency** $L_\text{wc} \le$ deadline (SR-P-35, DD-66). The force loop's worst-case is **≤ 20 ms** (Doc B Section 5.5). Timing is verified, not assumed (worst-case analysis + HIL). Clock/message synchronization keeps consumed data within its $\sigma_\text{sync}$ allocation (SR-C-11, DD-68), the timing contribution to the placement budget (CEC-03). *Serves:* SR-P-35, SR-C-11; *reference:* real-time scheduling (Doc H).

### 5.3 The reaction-time safety margin
For each hazard, detection + reaction must beat harm:
$$L_\text{detect} + L_\text{react} \le T_\text{harm}$$
with margin (SR-P-36, Doc E Section 4.3). Software achieves ≤ 200 ms (Doc B Section 5.5); the mechanical relief (Section 3.5) backstops the grip-force hazard at physics speed. *Serves:* SR-P-36; *reference:* functional-safety timing (Doc H).

### 5.4 Edge deployment
Models are **quantized and compiled** onto the edge accelerator (DD-29), sized so inference fits the perception share (≤ 100 ms) within the compute/power/thermal budget (Doc B Section 5.5), on-robot with no cloud in the loop (DD-28, CEC-04). The optimization workflow is **measure-on-target** (DD-30, EI-06), latency/power/accuracy measured on the actual device, not estimated. *Serves:* SR-P-15/19/21; *reference:* edge-ML deployment (Doc H).

### 5.5 The bounded-learner pattern
Learned components (perception M4, grasp policy M7) output **proposals** to a verified bounding layer that clips to the safe set (grip-force window ∩ reach ∩ keep-out), with a **deterministic fallback** (DD-37/38, SR-F-11/12, SR-P-23, EI-07). This is the software pattern that makes opaque AI safe: the *system* is bounded even though the policy is not. *Serves:* SR-F-11/12, SR-P-23; *reference:* runtime assurance / safe RL (Doc H).

---

## 6. Cross-Cutting Methods

### 6.1 The error-budget method (CEC-03, the course's signature)
The placement budget composes independent error terms by root-sum-square and holds the result within the capture tolerance:
$$3\sigma_\text{place} = 3\sqrt{\textstyle\sum_i \sigma_i^2} \le c$$
With the ratified allocation (Doc B Section 5.2: σ_Z=8, σ_cal=3, σ_he=3, σ_sync=4, σ_est=4, σ_mech=6 mm), RSS = 12.2 mm => 3σ = 36.7 mm ≤ c = 40 mm. The method's discipline (EI-05): **identify and attack the dominant term** (here σ_Z, depth), the same method that governs energy (M12), reliability (M14), and cost (M16). *Serves:* SR-P-04/16; *reference:* error propagation (Doc H).

### 6.2 The cycle-time budget (CEC-01)
The cycle time composes the spine's stage latencies within the throughput target:
$$T_\text{cycle} = \sum_\text{stages} t_\text{stage} \le \frac{d}{v}$$
With $d = 1.2$ m and $T_\text{cycle} \le 6$ s => $v \le 0.2$ m/s (Doc B Section 5.1); the stage shares (perception ≤ 300 ms, control ≤ 20 ms, act/move) fit with margin. Shared-resource contention (compute/power) is accounted at the system level (M13). *Serves:* SR-P-03; *reference:* real-time budgeting (Doc H).

### 6.3 The dominant-term discipline (EI-05): one method, four quantities
The reference method that recurs across the machine: any budget (accuracy, energy/heat, reliability, cost) has a **dominant term**, and effort spent anywhere else barely moves the total, so identify it ($\partial(\text{total})/\partial(\text{term})$ largest) and attack it. This single method, sharpened from the CEC-03 error budget, governs **four quantities** across the design (placement M5, energy M12, reliability M14, cost M16), the clearest evidence the engineering tools are general. *Reference:* optimization / sensitivity analysis (Doc H).

---

## 7. Reference Index (relation -> module -> requirement -> ratified value)

| Relation | Module | Requirement | Ratified value (Doc B) |
|----------|--------|-------------|------------------------|
| $L_i = |G-B_i|$ (IK) | M8 | SR-P-25/28 | span ≥ 1.7 m |
| $\mu, \gamma$ keep-out | M8 | SR-C-07 | γ ∈ [45°,135°] |
| $\delta = F/k_\text{eff} \le \sigma_\text{mech}$ | M8 | SR-P-27 | k_eff ≥ 20 N/mm |
| $F = PA$ | M9 | SR-P-29 | window [250,800] N |
| $k_\text{fluid} \propto A^2/V$ | M9 | SR-P-30 | tunable stiffness |
| bandwidth vs. $\tau_d$ | M9 | SR-P-31 | stable ≤ 20 ms |
| relief caps $F < F_\text{bruise}$ | M9 | SR-C-08 | ≤ 800 N hard |
| $E_\text{installed}$ (derated) | M12 | SR-P-37 | 3 to 5 kWh |
| $T_\text{comp} = T_a + QR_\text{thermal}$ | M12 | SR-C-12 | 45 °C + solar |
| $L_\text{wc} \le$ deadline | M11 | SR-P-35 | ≤ 20 ms |
| $L_\text{detect}+L_\text{react} \le T_\text{harm}$ | M11/M15 | SR-P-36 | ≤ 200 ms |
| $3\sigma_\text{place} = 3\sqrt{\sum\sigma_i^2} \le c$ | M5 | SR-P-04 | 3σ ≤ 40 mm |
| $T_\text{cycle} \le d/v$ | M1 | SR-P-03 | ≤ 6 s, v ≤ 0.2 m/s |

---

## 8. Baseline & Change Control

- **Baseline status:** Doc F **Rev 1.0, frozen configuration-controlled baseline (approved).** The controlling engineering-reference baseline; revision-controlled.
- **Consistency:** every relation is harvested from a frozen module's Section 7; every number it yields is the ratified Doc B value (cited, not re-derived). No new engineering.
- **Dependencies:** the landmark references (Doc H) supply the derivations and standards Doc F points to (no copyrighted text reproduced here); the ratified values come from Doc B; the hardware from Doc C.
- **What changes when a value is re-ratified:** Doc F cites Doc B, so a re-ratified value flows through automatically; the *relations* (the engineering) are stable, they are physics and mathematics, not estimates.

---

## Concise quality summary (honest self-assessment)

**Strengths.** Doc F is the **reference layer** the production stack needed: it consolidates the engineering relations the frozen modules already derived in their Section 7 sections, kinematics ($L_i=|G-B_i|$, μ/γ), fluid power ($F=PA$, tunable $k_\text{fluid}$, bandwidth-vs-latency, the physics-speed relief), electrical/power (peak-and-average budget, derated energy sizing, thermal), software/control (the ROS 2 plane split, worst-case timing, the bounded-learner pattern), and the cross-cutting error-budget and cycle-time methods, organized by discipline, each **cross-referenced to its requirement and the ratified Doc B value it yields** (Section 7 index). It surfaces the key cross-subsystem relations as first-class engineering (the M8<->M9 stiffness<->compliance coupling Section 3.4; the physics-speed relief Section 3.5) and names the **dominant-term method as one reference governing four quantities** (Section 6.3). It reproduces **no copyrighted text**, it states relations in the modules' notation and points to landmark references (Doc H) by role, consistent with harvest-not-rewrite.

**Known weaknesses / items for your review.**
1. **Doc F is a reference layer, not a derivation text.** It states the relations and sizing methods and cites where the full derivations live (the modules' Section 7 and Doc H); it deliberately does not reproduce textbook derivations or copyrighted standards. If you want fuller worked derivations, those are a production asset (worked examples) that would derive from this reference.
2. **The landmark references are cited by role, not enumerated**, the actual bibliography is Doc H (next-but-one in the queue); Doc F points to "fluid-power fundamentals (Doc H)" etc. rather than specific citations, pending Doc H.
3. **Every number is inherited from Doc B**, Doc F is a reference, so it re-derives no values; if a Doc B value is an estimate, Doc F's method yields that estimate (the relations are exact; the inputs may be `[RATIFIED-EST]`).
4. **Discipline coverage matches the modules**, mechanical/fluid/electrical/software are covered because the modules derived them; there is no separate civil/structural-foundations content because the curriculum did not require it (the machine mounts to the Amiga).

I have not scored this against the 9.5 bar, that judgment is yours. Item 2 (Doc H bibliography) is the natural next dependency; the relations themselves are complete and exact.

**END OF DOC F, frozen Rev 1.0.**
