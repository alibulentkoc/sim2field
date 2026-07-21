# Module 8: Manipulator Kinematics, Workspace & Singularities

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M8, **Part IV, Act**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation (kinematic twin) + Software-in-the-Loop
**Prerequisites:** M1 (spine, DOF-reduction decision, cycle-time budget CEC-01), M2 (payload mass, Grip-Force Window CEC-02), M5 (placement error budget CEC-03 and the σ_mech allocation, EI-05), M7 (the bounded grasp proposal the arm must reach). Math: linear algebra (matrices, transforms), trigonometry, calculus (Jacobian).
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 7**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module opens the **Act** stage and inherits the mechanism-tolerance allocation $\sigma_\text{mech}$ issued by M5 (SR-I-07). It resolves the recorded M1/TS-1 weakness that *workspace couples to track width*. P0-document authority tagged **[->Doc B/D/G/H/I]**; perishable/geometry values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** **Engineering Insight EI-08** and the module's **Engineering Design Review**.

> *Core concept in use.* This module begins the **Act** stage of **CEC-01 (the Signal-to-Action Spine)**. It takes the bounded grasp proposal (M7), a target pose the arm must reach, and answers three questions of mechanism: *can the arm reach it* (workspace), *how precisely can it get there* ($\sigma_\text{mech}$ against **CEC-03**), and *where does the mechanism become unsafe or uncontrollable* (singularities). The grasp itself (fluid force control) is **M9**.

---

## 1. Module Overview

**Mission.** The mechanism must now physically bring the gripper to the grasp pose, accurately and safely, fast enough to keep pace. This module is the kinematics of the manipulator, the geometry and mathematics that turn a desired end-effector pose into achievable joint motions, that define the region the arm can actually reach, and that expose the configurations where the mechanism loses controllability.

**Previous milestone.** The machine has decided where to grasp and how hard.

**Engineering problem.** The SIM2FIELD manipulator is deliberately simple, and that simplicity is a design decision inherited from Module 1: because the drive-over rover supplies the fore/aft (x) degree of freedom, the arm itself does not need to reach fore/aft, the fruit is driven to a fixed pick station. The manipulator is a rail-mounted, parallel two-actuator mechanism that positions the gripper within the transverse plane at that station. Fewer degrees of freedom means a smaller, cheaper, stiffer, more analyzable arm, the payoff of the systems decision made five modules ago, now cashed in.

**Design tension.** Three results organize the module. Workspace: the set of reachable gripper poses, which, as Module 1's trade study warned, is coupled to the rover's track width. Precision: the arm must place the gripper within the mechanism-tolerance budget σ_mech that Module 5 allocated, so the grasp lands inside the Grip-Force Window's capture tolerance (CEC-03 -> CEC-02). Singularities: configurations where the mechanism's Jacobian degenerates and small joint motions cause large, uncontrollable end-effector motions. The transmission angle γ is the practical singularity metric for this parallel mechanism, and staying away from γ-degeneracy is both a precision and a safety requirement.

**What this module resolves.** The module makes the track-width coupling quantitative and resolves it, meets the σ_mech precision budget, and keeps the mechanism clear of γ-degeneracy. Its Engineering Insight distills the lesson that ties these together: the cheapest degree of freedom is the one you design out.


## 2. Learning Objectives

- **LO-M8.1** Derive the forward and inverse kinematics of the rail-mounted parallel manipulator and compute joint values for a target gripper pose., *Bloom: Apply*
- **LO-M8.2** Characterize the manipulator workspace and quantify its coupling to the rover track width; select geometry to cover the required pick region., *Bloom: Analyze (with Evaluate)*
- **LO-M8.3** Form the manipulator Jacobian and use it to relate joint and end-effector velocities/forces., *Bloom: Apply*
- **LO-M8.4** Identify singularities via the Jacobian and the transmission angle γ, and define keep-out margins., *Bloom: Analyze*
- **LO-M8.5** Translate the inherited placement-tolerance allocation $\sigma_\text{mech}$ (CEC-03) into positioning-repeatability and stiffness requirements., *Bloom: Evaluate*
- **LO-M8.6** Justify the DOF-reduction design decision (vehicle supplies x) in cost, precision, and reliability terms (EI-08)., *Bloom: Evaluate*
- **LO-M8.7** Specify the kinematic twin model needed to verify reach, precision, and singularity avoidance., *Bloom: Create*

Maps to course objectives **LO5** (primary), **LO2/LO6** (reinforcing), and ABET **SO1, SO2**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Compute forward and inverse kinematics for the parallel manipulator and check reachability of a target., *Bloom: Apply*
2. Map the workspace and state how track width bounds it., *Bloom: Analyze*
3. Build the Jacobian and read velocity/force transmission from it., *Bloom: Apply*
4. Locate singularities and set a transmission-angle keep-out., *Bloom: Analyze*
5. Convert an error allocation into mechanism repeatability and stiffness specs., *Bloom: Evaluate*
6. Defend a DOF-reduction decision quantitatively., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Module 1's failure taxonomy named *manipulation failure*: the mechanism reaches the wrong place, cannot reach at all, or passes through a configuration where it loses control. Each of those is a *kinematics* failure before it is a controls or gripper failure, and this module is the defense.

The tension is concrete. The grasp must land inside a capture tolerance of a few centimetres (CEC-02), and Module 5's error budget already spent most of that tolerance on perception and calibration, leaving the mechanism a *small* allocation $\sigma_\text{mech}$ (CEC-03). A floppy or imprecise arm blows that allocation and the grasp misses, regardless of how good perception was. At the same time, the arm must actually **reach** every fruit that arrives at the pick station, and the reachable region is not free geometry: in the drive-over architecture it is bounded by how wide the rover straddles the bed (track width). Reach too little and fruit at the edges of the bed are unharvestable; widen the track for reach and you compromise stability and field maneuverability (the recorded TS-1 weakness). And threaded through both is the hazard of **singularities**, poses where the mechanism's Jacobian degenerates so that a small commanded motion demands enormous joint speed (uncontrollable) or a modest external load produces runaway motion (unsafe). For a machine swinging a 5 to 10 kg payload near the ground and, eventually, near people, singularity avoidance is not an elegance; it is a safety requirement.

The motivating insight is the one Module 1 planted and this module proves: **the most reliable, cheapest, most precise degree of freedom is the one you don't build.** By letting the vehicle supply x, the arm becomes analyzable enough that its workspace, precision, and singularities can all be characterized in closed form, and that analyzability is itself a design deliverable.

---

## Engineering Failure Cases (kinematics-specific)

Sharpening Module 1's *manipulation* class at its kinematic roots:

- **Out-of-reach fruit.** A target at the edge of the bed lies outside the workspace; it cannot be harvested. *Motivates* the workspace/track-width analysis (Section 6.3, Section 7.2) and geometry selection.
- **Tolerance-budget overrun.** The arm's positioning repeatability or compliance exceeds $\sigma_\text{mech}$; the grasp lands outside the capture tolerance and slips/bruises. *Motivates* the precision->stiffness requirement derivation (Section 7.5, CEC-03).
- **Singularity encounter.** The commanded path crosses a Jacobian degeneracy; the arm demands impossible joint speed or loses controllability under the payload. *Motivates* singularity/transmission-angle analysis and keep-out (Section 6.5, Section 7.4).
- **Payload-induced deflection.** The 5 to 10 kg fruit (M2) deflects a compliant structure, moving the true gripper pose away from the commanded one. *Motivates* the stiffness allocation and static analysis (Section 7.5).

Each is a kinematic design decision away from prevention.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** linear algebra (matrix multiplication, rank, determinant, condition number, for the Jacobian); trigonometry and planar geometry (for the mechanism); introductory calculus (partial derivatives, for the Jacobian); the M1 DOF-reduction decision and cycle-time budget; the M2 payload mass and Grip-Force Window; the M5 placement budget (CEC-03) and its σ_mech allocation; the M7 bounded grasp target the arm must reach.

**Introduced here, used later:** the vocabulary of manipulator kinematics, *forward/inverse kinematics, configuration space, workspace/reachable set, Jacobian, manipulability, singularity, transmission angle γ, repeatability vs. accuracy, static stiffness, keep-out*. Developed at applied (L2) depth with an L3 grad extension; full screw-theory/robotics formalism is referenced [->Doc H].

**Where this sits in the dependency graph.** M8 hard-depends on M1 (DOF decision), M2 (payload), and M5 (σ_mech, CEC-03), and consumes M7's grasp target. It **masters** the manipulator-kinematics thread; it **applies CEC-03** (turning the allocated σ_mech into mechanism specs) and reinforces EI-05 (the dominant mechanism-tolerance term). It hands forward: the mechanism's reachable workspace and singularity-free operating region to M9 (which mounts the fluid gripper and controls force within it) and M10 (mobility/alignment that presents fruit within reach); the stiffness/structural requirements to M9/M12; and the kinematic twin model to M13.

---

## 6. Theory

### 6.1 Configuration, task, and the kinematics map
The manipulator's **configuration** is its joint variables (here, the two actuator extensions of the parallel mechanism); its **task** is the gripper pose at the pick station. **Forward kinematics** maps configuration -> pose; **inverse kinematics** maps a desired pose -> the configuration(s) that achieve it. Because the vehicle supplies x (M1 DD-1), the arm's task space is the transverse plane at the station, a low-dimensional, analyzable problem by design.

### 6.2 The rail-mounted parallel manipulator
The mechanism positions the gripper point G with two actuators (cylinders) whose base anchors are $B_1,B_2$ on the rail; each actuator length is $L_i = |G - B_i|$. Given a target G, inverse kinematics is direct, each required length is the distance from G to its base anchor:
$$ L_i = \lVert G - B_i \rVert. $$
Forward kinematics (given the two lengths, find G) is the intersection of two circles, a closed-form, two-solution problem whose branch is fixed by the mechanism's assembly. This parallel arrangement is stiff and light (actuators carry load in tension/compression, not bending), which matters for both precision (Section 6.6) and payload (M2).

### 6.3 Workspace and the track-width coupling
The **workspace** is the set of gripper points G reachable within actuator stroke limits and without singularity. Its transverse extent is bounded by the base-anchor separation, which is set by the **rover track width** (how wide the machine straddles the bed), the coupling Module 1's TS-1 flagged. The design task: choose track width and actuator geometry so the workspace covers the required pick region (the full bed width where fruit arrive) with margin, *without* widening the track so far that stability and field maneuverability suffer (a trade quantified in Section 7.2 and revisited at M13 integration). This module resolves the flagged weakness by turning it into an explicit geometry choice.

### 6.4 The Jacobian
The **Jacobian** J relates joint velocities to end-effector velocity, $\dot{x} = J\,\dot{q}$, and (by duality) end-effector force to joint force, $\tau = J^\top F$. It is the local linearization of the kinematics and the single most useful object in manipulator analysis: it tells you how motion and force transmit between joint and task space at each configuration, how precisely the end-effector can be positioned, and, through its degeneracies, where the mechanism fails.

### 6.5 Singularities and the transmission angle γ
A **singularity** is a configuration where J loses rank ($\det J \to 0$). Two consequences, both bad: in a velocity singularity, achieving a small end-effector motion demands unbounded joint speed (loss of controllability); in a force singularity, a modest external load is resisted only by unbounded joint force (or, dually, produces runaway motion). For this parallel two-actuator mechanism the practical, geometric singularity metric is the **transmission angle γ**, the angle at which the actuators drive the gripper point. Near γ = 0° or 180° the mechanism is singular: force transmits poorly and motion is ill-conditioned. The design keeps the operating region bounded away from those extremes (a γ **keep-out**, e.g. maintain γ within a safe band [VERIFY@PUB]). Because the arm swings a heavy payload, this keep-out is a **safety** requirement, not only a performance one.

### 6.6 Precision: repeatability, accuracy, and stiffness
Two distinct notions: **accuracy** (does the gripper reach the commanded absolute pose?) and **repeatability** (does it return to the same pose reliably?). For grasping a driven-to-station fruit, repeatability and *stiffness under payload* dominate: the 5 to 10 kg fruit (M2) plus dynamic swing loads deflect the structure, moving the true gripper pose off the commanded one. The mechanism's contribution to placement error, $\sigma_\text{mech}$, is set by joint repeatability, backlash, and static deflection under load. Module 5 allocated a *budget* for $\sigma_\text{mech}$ (CEC-03); this module converts that budget into concrete **repeatability and stiffness requirements** (Section 7.5), the mechanism's half of the accuracy contract.

### 6.7 Fluid-powered actuation and back-drivability (kinematic view)
The actuators are fluid-powered (the hybrid decision, M1 DD-3), which shapes the kinematics-adjacent behavior: fluid actuators are compliant and back-drivable, so the *effective* end-effector stiffness is set partly by fluid stiffness (a controllable quantity, mastered in M9), not only structural stiffness. This is a preview of the M9 coupling, the mechanism's precision is partly a *control* problem through the fluid, not purely a *structural* one, and it is why compliance that helps bruise-avoidance (M2) also softens positioning stiffness, a tradeoff M9 must manage.

---

## 7. Mathematics

Rigor tier for M8: **L2 to L3**. Central results: the closed-form kinematics/workspace, the Jacobian/singularity condition, and the σ_mech -> mechanism-spec conversion.

### 7.1 Inverse and forward kinematics
Inverse: $L_i = \lVert G - B_i\rVert$ for target $G=(y,z)$ and anchors $B_i$. Forward: solve the two-circle intersection $\lVert G-B_1\rVert=L_1,\ \lVert G-B_2\rVert=L_2$ for G, selecting the assembly branch. *Use:* command joint lengths for any in-workspace target; detect out-of-reach targets when no real solution exists.

### 7.2 Workspace extent vs. track width (central)
With anchor separation $w$ (set by track width) and actuator stroke $[L_\text{min},L_\text{max}]$, the reachable transverse span is a function $\text{span}(w, L_\text{min}, L_\text{max})$, an annular-intersection region. Require $\text{span} \ge W_\text{bed} + \text{margin}$ (cover the bed). This gives a *minimum* track width for reach; stability/maneuverability (M10/M13) give a *maximum*. The design point is the intersection, and if it is empty, the architecture must change (taller stroke, offset station, or a second actuator pair). *Use:* resolves the TS-1 track-width coupling as a bounded feasibility problem, a set-based result in the spirit of CEC-01/CEC-03.

### 7.3 The Jacobian
Differentiate the forward kinematics: $J = \partial x/\partial q$, giving $\dot x = J\dot q$ and $\tau = J^\top F$. For the parallel mechanism, J is built from the actuator direction unit vectors. *Use:* velocity/force transmission and the basis for singularity and precision analysis.

### 7.4 Singularity condition and transmission angle
Singularity: $\det J = 0$ (equivalently the actuator lines become geometrically degenerate). The **transmission angle** γ between the actuator action and the gripper motion satisfies $\det J \propto \sin\gamma$ (schematically), so $\gamma \to 0,180°$ is singular. Define **manipulability** $\mu = \sqrt{\det(JJ^\top)}$ as a scalar distance-from-singularity; require $\mu \ge \mu_\text{min}$ and $\gamma \in [\gamma_\text{min}, \gamma_\text{max}]$ across the workspace. *Use:* a quantitative keep-out that guarantees controllable, safe force transmission everywhere the arm operates.

### 7.5 From σ_mech (CEC-03) to mechanism requirements (central)
The placement budget allocated $\sigma_\text{mech}$. Decompose it into contributors: joint repeatability $\sigma_\text{rep}$, backlash/hysteresis $\sigma_\text{bl}$, and static deflection under load $\sigma_\text{defl}=F_\text{load}/k_\text{eff}$ (with $k_\text{eff}$ the effective end-effector stiffness). Then
$$ \sigma_\text{mech} = \sqrt{\sigma_\text{rep}^2 + \sigma_\text{bl}^2 + \sigma_\text{defl}^2} \ \le\ \text{(M5 allocation)}. $$
Given the allocation and the payload $F_\text{load}$ (M2), solve for the required stiffness $k_\text{eff}\ge F_\text{load}/\sigma_\text{defl,allowed}$ and the required joint repeatability, the mechanism's concrete specs. Note the Jacobian scales joint error into task error, so error is worst near singularities (small $\mu$), another reason for the γ keep-out. *Use:* CEC-03 applied, an allocated budget becomes buildable requirements; and EI-05 recurs (attack whichever of $\sigma_\text{rep},\sigma_\text{bl},\sigma_\text{defl}$ dominates). **Grad (L3):** propagate joint covariance to task covariance via $\Sigma_x = J\Sigma_q J^\top$ and show the error blow-up as $\mu\to0$.

> ### Engineering Insight, EI-08: The Cheapest Degree of Freedom Is the One You Design Out
> **Before adding an axis, joint, or sensor to solve a problem, ask whether the *architecture* can remove the need for it; a degree of freedom you never build costs nothing, never breaks, never needs calibration, and never hits a singularity.**
>
> Complexity has a way of accreting one reasonable-looking addition at a time, another joint for reach, another sensor for a corner case, another mode for an exception. Each is locally justified and collectively fatal: every added DOF is more cost, mass, calibration, failure modes, control burden, and singular configurations. The experienced engineer's instinct runs the other way, reshape the *system* so the hard part disappears. Here, letting the drive-over rover supply the fore/aft motion removes an entire arm axis: the manipulator becomes a simple, stiff, closed-form-analyzable two-actuator mechanism whose workspace, precision, and singularities can all be characterized exactly. The removed axis is the most reliable one on the machine, because it does not exist.
>
> The judgment generalizes: the most robust component is the absent one, and architectural simplification usually beats component sophistication. But it is not free, offloading a DOF to the vehicle *couples* the mechanism's workspace to track width (this module) and its timing to the drive (CEC-01); the discipline is to move complexity to where it is cheapest to bear, not to pretend it vanished.
>
> **Why it matters for SIM2FIELD.** The whole manipulation stack, reachability, the σ_mech precision budget (CEC-03), singularity safety, is tractable *only because* the arm has few degrees of freedom. That tractability is a direct dividend of the Module 1 systems decision, and it is why a simple machine can meet a hard requirement.
>
> *Related concepts:* CEC-01 (the DOF offload couples to the cycle-time/drive), CEC-03 (few DOF makes the precision budget analyzable), CEC-02 (a stiff simple arm lands inside the window). *Revisited in:* M9 (fewer axes to force-control), M10 (the vehicle that supplies the offloaded DOF), M13 (the track-width/stability integration tradeoff). See the [register](curriculum/_core-concepts.md).

---

## 8. Engineering Principles

1. **Design DOF out before designing it in** (EI-08): the absent axis is the most reliable.
2. **Reach is geometry with limits**, workspace is bounded by stroke and track width; size it to cover the bed with margin.
3. **The Jacobian governs motion, force, and error**, read precision and singularities from it.
4. **Stay out of singularities** with a manipulability/transmission-angle keep-out, a safety, not just performance, requirement.
5. **An allocated tolerance is a mechanism spec** (CEC-03): convert $\sigma_\text{mech}$ into repeatability and stiffness.
6. **Precision under load, not just no-load**, the payload deflects the structure; stiffness is budgeted.
7. **Move complexity to where it is cheapest to bear**, and track the couplings you create (track width, timing).

---

## 9. System Requirements

Derived from the mechanism mission; apply CEC-03. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-25 | Performance | The manipulator workspace shall cover the pick region (bed width + margin) [VERIFY@PUB] at the station. | Kinematic analysis + twin |
| SR-P-26 | Performance | Mechanism placement error shall satisfy the allocated $\sigma_\text{mech}$ (CEC-03) under the payload load (M2). | Analysis + measurement |
| SR-P-27 | Performance | Effective end-effector stiffness shall be $\ge k_\text{eff,req}$ so static deflection under payload stays within budget (Section 7.5). | Static test |
| SR-C-07 | Constraint | The operating region shall maintain manipulability $\mu \ge \mu_\text{min}$ and transmission angle $\gamma\in[\gamma_\text{min},\gamma_\text{max}]$ (singularity keep-out). | Analysis + test |
| SR-P-28 | Performance | Inverse kinematics + motion shall complete within the align/grab share of the cycle-time budget (CEC-01). | Timed test |
| SR-I-11 | Interface | Track width shall be jointly consistent with workspace reach (this module) and stability/maneuverability (M10/M13). | Integration review |
| SR-I-12 | Interface | A kinematic twin model (reach, Jacobian, singularity map) shall exist for verification. | Review (->Doc G) |

Traceability: SR-P-25/28 -> CEC-01, M10; **SR-P-26/27 -> CEC-03/CEC-02, M9**; SR-C-07 -> safety (M15); SR-I-11 -> M10/M13 (resolves TS-1 coupling); SR-I-12 -> twin/M13.

---

## 10. Design Decisions

- **DD-42 Rail-mounted parallel two-actuator manipulator** (vehicle supplies x). *Rationale:* Section 6.1 to 6.2, EI-08; stiff, light, closed-form-analyzable. *Serves:* SR-P-25/26, CEC-01. (Cashes M1 DD-1.)
- **DD-43 Track width sized to workspace with margin, bounded by stability.** *Rationale:* Section 7.2; cover the bed without compromising the platform. *Serves:* SR-P-25, SR-I-11. (Resolves TS-1.)
- **DD-44 Manipulability/transmission-angle keep-out.** *Rationale:* Section 6.5/Section 7.4; controllable, safe force transmission with a heavy payload. *Serves:* SR-C-07.
- **DD-45 Stiffness sized from the σ_mech allocation and payload.** *Rationale:* Section 7.5, CEC-03; land inside the capture tolerance under load. *Serves:* SR-P-26/27.
- **DD-46 Fluid-actuator compliance treated as controllable stiffness.** *Rationale:* Section 6.7; effective stiffness is partly a fluid-control quantity. *Serves:* SR-P-27 (realized in M9).
- **DD-47 Closed-form IK/FK on the edge.** *Rationale:* the low-DOF mechanism makes real-time exact kinematics trivial (CEC-01/CEC-04). *Serves:* SR-P-28.

---

## 11. Trade Studies

### 11.1 TS-15: Manipulator kinematic architecture
**Alternatives:** (A) **rail-mounted parallel 2-actuator** (vehicle supplies x); (B) **serial 3-DOF arm** at the station; (C) **serial 5 to 6-DOF arm**; (D) **gantry XYZ**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Parallel-2 | B: Serial-3 | C: Serial-6 | D: Gantry |
|--------------------|:---:|:---:|:---:|:---:|
| Stiffness / precision under 5 to 10 kg (0.24) | 5 | 3 | 2 | 4 |
| Simplicity / cost / reliability (0.22) | 5 | 4 | 2 | 3 |
| Workspace fit at the station (0.18) | 4 | 4 | 5 | 4 |
| Analyzability (closed-form kinematics/singularity) (0.16) | 5 | 4 | 2 | 4 |
| Speed within cycle-time budget (0.12) | 5 | 4 | 3 | 3 |
| Footprint on the platform (0.08) | 4 | 4 | 3 | 2 |
| **Weighted total** | **4.70** | **3.76** | **2.78** | **3.50** |

**Selected: A (rail-mounted parallel 2-actuator).** It wins decisively on stiffness, simplicity, and analyzability, all downstream dividends of offloading x to the vehicle (EI-08). A 6-DOF arm's dexterity is unnecessary because the drive-over architecture removes the need for it, while its compliance and cost are liabilities under a heavy payload. Recorded weakness: the parallel mechanism's workspace is more tightly coupled to track width (DD-43/Section 7.2) and it has orientation limits, acceptable because the pick task needs position, not full orientation, at a staged fruit.

### 11.2 TS-16: Singularity-avoidance strategy (summary)
**Alternatives:** avoid by workspace design, avoid by online manipulability monitoring, redundant DOF to escape. **Criteria:** safety guarantee, simplicity, cost. **Outcome:** **design-time workspace bounding + online γ/μ monitoring**, keep the required pick region strictly inside the singularity-free set (design-time), and monitor μ/γ at runtime as a safety check (feeding M15). A redundant DOF is rejected (contradicts EI-08 and adds the very complexity the architecture removed).

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **Manipulator kinematics / the Jacobian.** *Verdict: not a new CEC.* Foundational and mastered here, but it is a *technique/toolset* specific to mechanism design rather than a cross-module recurring design tool at the anchor level; captured in the Knowledge-Architecture kinematics thread.
- **Singularity / transmission-angle keep-out.** *Verdict: not a new CEC.* Important and safety-relevant, but local to mechanism and its safety treatment (M15); does not recur as an independent design tool across many modules.
- **σ_mech application.** *Verdict: no new CEC, this is CEC-03 applied,* exactly as designated in M5; M8 is an application site, and EI-05 recurs (dominant mechanism-tolerance term). *(No new CEC this module; one EI added, EI-08, within discipline.)*

> **Cross-module synthesis note (lightweight).** Three anchors meet in this module's geometry: **EI-08** (design the DOF out) is *why* the mechanism is simple; that simplicity is what makes **CEC-03** (the σ_mech budget) analyzable in closed form; and staying in the singularity-free region is what lets the arm reliably land the grasp inside **CEC-02** (the Grip-Force Window). Simplicity, precision, and safety are the same decision viewed three ways.

> **Simulation-first hook.** Reach, the Jacobian/singularity map, and σ_mech under load are all verifiable in the **kinematic twin** (Section 12, Section 13) before hardware, including sweeping track width to resolve the TS-1 coupling (SR-I-11) in simulation.

---

## 12. Simulation Activities

M8 runs at **Simulation (kinematic twin) + SIL**. The twin already carries the rail-mounted mechanism; this module turns it into a kinematic analysis instrument.

**SA-1, Reachability map.** Sweep target points across the pick region in the twin; mark reachable vs. out-of-reach via the IK solution's existence (Section 7.1). *Outcome:* the workspace made visible; out-of-reach fruit identified (SR-P-25).

**SA-2, Track-width sweep.** Vary the anchor separation (track width) and watch the workspace grow/shrink relative to the bed width (Section 7.2); find the minimum track width for full coverage. *Outcome:* the TS-1 coupling resolved quantitatively in sim (SR-I-11).

**SA-3, Singularity map.** Compute μ and γ across the workspace; shade the singular/near-singular region and confirm the required pick region sits inside the keep-out (Section 7.4). *Outcome:* a verified singularity-free operating region (SR-C-07).

**SA-4, Precision under load.** Apply the payload (M2) in the twin and measure end-effector deflection vs. commanded pose; compare σ_mech to the M5 allocation (Section 7.5, CEC-03). *Outcome:* the mechanism's half of the accuracy contract checked in sim.

---

## 13. Digital Twin Activities

**DTA-1, Kinematic-model specification (deliverable to Doc G).** Specify the twin's kinematic model: FK/IK, the Jacobian, the μ/γ singularity map, and a load-deflection (stiffness) model for σ_mech. *Outcome:* SR-I-12; the kinematic verification model.

**DTA-2, σ_mech budget instrument.** In the twin, decompose σ_mech into repeatability, backlash, and deflection terms; identify the dominant one (EI-05) and confirm the total meets the M5 allocation (CEC-03). *Outcome:* mechanism specs traced to the budget.

**DTA-3, Reach/stability co-design handoff.** Package the workspace-vs-track-width curve for the M10/M13 stability tradeoff (SR-I-11). *Outcome:* the TS-1 coupling handed forward as data, not a warning.

---

## 14. Hardware Activities

*(Tiered: measurement protocols at specification level.)*

**HA-1, Repeatability & stiffness protocol.** Specify measurement of joint repeatability, backlash, and static deflection under the payload load to verify σ_mech (SR-P-26/27). *Deliverable:* mechanism precision data for CEC-03.

**HA-2, Singularity/transmission-angle verification.** Specify how to confirm μ/γ stay within keep-out across the workspace on hardware (SR-C-07). *Deliverable:* a measured singularity-free region.

---

## 15. Software Activities

**SWA-1, Kinematics module.** Specify the FK/IK/Jacobian module (closed-form, edge-resident, CEC-04) that the motion controller (M11) and grasp controller (M9) call, including reachability and μ/γ checks as guards. *Outcome:* the kinematic service the Act stage depends on.

**SWA-2, Singularity guard.** Specify a runtime guard that rejects or reshapes any commanded path approaching the μ/γ keep-out (feeding the safety monitor, M11/M15). *Outcome:* singularity avoidance as an enforced, testable property.

---

## 16. ROS 2 Integration

The kinematics become a service/library the **motion controller node** (M11) uses to convert bounded grasp targets (M7) into joint commands, with reachability and μ/γ guards (SWA-2) checked before motion. The closed-form, low-DOF kinematics are cheap enough to run at control rate on the edge (CEC-04) without threatening the cycle-time budget (CEC-01). The singularity guard publishes to the **safety monitor** (M11/M15). M11 masters the real-time motion node; M8 fixes the kinematic contract and the guards it must enforce.

---

## 17. AI Integration

M8 is largely classical, and deliberately so (EI-08: analyzable geometry over learned complexity), but it bounds the learned layer above it:

- **The workspace and singularity keep-out are hard bounds on the grasp policy (M7/EI-07).** The bounding layer clips the policy's proposed target to the *reachable, singularity-free* set, this module supplies exactly that set. A learned proposal outside the workspace or inside the singular region is rejected here.
- **σ_mech feeds the policy's uncertainty reasoning.** The mechanism's positioning uncertainty is one input to whether a grasp will land in the window (M7's decision), closing a loop from CEC-03 through the policy.

No learning is trained in this module; its role is to *bound* the learned Act stage with verified geometry.

---

## 18. Edge Computing Integration

The low-DOF, closed-form kinematics are trivial to run in real time on the edge device (CEC-04): FK/IK is a distance calculation and a two-circle intersection; the Jacobian and μ/γ checks are a few operations. This is a direct dividend of EI-08, a 6-DOF arm would need iterative IK and heavier singularity handling, spending compute and risking the cycle-time budget (CEC-01). The kinematic service therefore adds negligible latency (unlike perception, M6), leaving the compute budget for the heavy perception stage.

---

## 19. Fluid Power Integration

M8 sets the **structural and geometric stage** for the fluid-powered grasp that M9 masters. Two couplings are fixed here: (1) **effective stiffness is partly fluid stiffness** (Section 6.7), the fluid actuators' compliance, which M2 wants for bruise-avoidance and M9 controls, also softens positioning stiffness, so the σ_mech budget (SR-P-27) must be met by *structural* stiffness plus *controllable fluid* stiffness together; (2) the actuators' back-drivability shapes the singularity behavior, near a singularity, a compliant fluid actuator yields rather than transmitting a runaway force, a partial *mitigation* of singularity hazard that M9/M15 can exploit but must not rely on in place of the keep-out. M8 hands M9 the reachable, singularity-free workspace and the stiffness budget within which the fluid grasp controller must operate.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M8-1, Workspace / Track-Width Explorer.** Sliders for track width and actuator stroke; live reachable-region overlay on the bed width, flagging coverage gaps (Section 7.2, resolves TS-1). *Goal:* feel the reach/track coupling.
- **W-M8-2, Singularity Map.** μ and γ shaded across the workspace with the keep-out band and the pick region overlaid; drag the target to see the transmission angle change. *Goal:* Section 6.5/Section 7.4.
- **W-M8-3, IK Solver Visualizer.** Click a target; show the two actuator lengths and the two-circle FK branches; flag out-of-reach. *Goal:* Section 7.1.
- **W-M8-4, σ_mech Budget & Stiffness.** Sliders for repeatability, backlash, and stiffness/payload; live σ_mech vs. the M5 allocation with the dominant term highlighted (EI-05). *Goal:* CEC-03 applied.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M8-1** The rail-mounted parallel manipulator: rail, base anchors $B_1,B_2$, actuators $L_1,L_2$, gripper point G at the pick station (annotated).
- **CAD-M8-2** Workspace envelope overlaid on the bed cross-section, showing the track-width coupling and coverage margin.
- **CAD-M8-3** Transmission angle γ and the singular configurations at the workspace edges.
Format per ->Doc J (SVG mechanism/geometry diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M8-1 | Parallel mechanism geometry ($B_i$, $L_i$, G) | Section 6.2 |
| F-M8-2 | FK as two-circle intersection (two branches) | Section 7.1 |
| F-M8-3 | **Workspace vs. track width (coverage of the bed)** | Section 7.2 (central, resolves TS-1) |
| F-M8-4 | Jacobian: velocity/force transmission | Section 6.4/Section 7.3 |
| F-M8-5 | Singularity map (μ, γ) with keep-out and pick region | Section 6.5/Section 7.4 |
| F-M8-6 | σ_mech decomposition & stiffness-under-load | Section 7.5 (CEC-03) |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M8-1** The gripper sweeping the workspace, the reachable region filling in, and track width widening/narrowing it, the TS-1 coupling in motion.
- **AN-M8-2** The arm approaching a singularity: γ shrinking, joint speed spiking, and the keep-out halting it.
- **AN-M8-3** The payload deflecting the structure, moving the true gripper pose off the commanded one, then stiffness restoring it.

---

## 24. Laboratory

**Lab M8, Kinematics, Workspace, and the Mechanism Tolerance Budget**

- **Objectives.** (1) Derive/compute FK and IK for the parallel manipulator; (2) map the workspace and find the minimum track width to cover the bed; (3) build the Jacobian and locate singularities via μ/γ; (4) convert the inherited σ_mech allocation into repeatability/stiffness specs; (5) verify in the kinematic twin.
- **Equipment.** The kinematic twin; the mechanism geometry and stroke limits [VERIFY@PUB]; the σ_mech allocation from Lab M5; notebook. **Safety:** computer-based (real mechanism handling, if any, follows lab safety for a payload-bearing arm).
- **Procedure.**
  1. Compute IK ($L_i=\lVert G-B_i\rVert$) and FK (two-circle intersection) for a set of targets; flag out-of-reach (Section 7.1).
  2. Map the workspace; sweep track width to find the minimum covering the bed + margin (Section 7.2); record the reach-vs-track curve (SR-I-11).
  3. Form the Jacobian; compute μ and γ across the workspace; shade the keep-out and confirm the pick region is inside it (Section 7.4, SR-C-07).
  4. Decompose the inherited σ_mech into repeatability, backlash, and deflection; using the payload (M2), solve for required stiffness and repeatability (Section 7.5, CEC-03); identify the dominant term (EI-05).
  5. Verify reach, singularity-freedom, and σ_mech under load in the twin (SA-1..4).
- **Data collection.** IK/FK results and reachability; reach-vs-track curve; μ/γ map; σ_mech decomposition and derived specs; twin verification.
- **Analysis.** What minimum track width covers the bed, and what does it cost stability (hand to M10/M13)? Which σ_mech term dominates? Is the pick region safely inside the keep-out under all loads?
- **Discussion.** How does EI-08 (design out the x-axis) make every part of this analysis tractable? How does σ_mech trade against the perception terms in CEC-03? Why is the singularity keep-out a safety requirement?
- **Deliverables.** A 4 to 6 page report: kinematics, workspace/track-width result, singularity map, σ_mech->specs derivation, twin verification.
- **Rubric (100 pts).** FK/IK & reachability (18); workspace/track-width analysis (20, resolves TS-1); Jacobian & singularity map (20); σ_mech->specs (22, CEC-03); twin verification (10); communication (10). *Graduate band adds:* joint->task covariance propagation $\Sigma_x=J\Sigma_qJ^\top$ and the error blow-up near singularities, with a cited source.
- **Expected results.** A minimum track width that covers the bed with modest margin; a comfortably singularity-free pick region with a γ keep-out; a σ_mech dominated (often) by static deflection under the heavy payload, driving a concrete stiffness requirement; confirmation that the simple mechanism meets the budget precisely because it is simple (EI-08).

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **IK/FK.** For given anchors and a target, compute the two actuator lengths; for given lengths, find G (both branches) and identify the assembly branch.
2. **Workspace/track width.** For given stroke limits, find the minimum anchor separation (track width) to reach a target span; state the coverage margin.
3. **Jacobian/singularity.** Form the Jacobian at two configurations; compute μ and γ; state which is nearer a singularity and why it is unsafe under payload.
4. **σ_mech -> specs.** Given the σ_mech allocation and payload, decompose the budget and solve for the required effective stiffness and joint repeatability; identify the dominant term (EI-05).
5. **(Grad) Error propagation.** Propagate a joint covariance to task covariance via $\Sigma_x=J\Sigma_qJ^\top$; evaluate at a near-singular configuration and interpret the blow-up.
6. **(Grad) Reach/stability co-design.** Formulate the track-width choice as a constrained problem (reach lower bound from this module, stability upper bound from M10) and identify the feasible interval or show it is empty and what must change.

---

## 26. Quiz

1. **(MC)** Offloading the fore/aft (x) motion to the rover primarily buys the arm: (a) more dexterity; (b) simplicity, stiffness, and analyzability; (c) higher payload; (d) longer reach. **[b]**
2. **(MC)** A manipulator singularity is a configuration where: (a) the arm is fastest; (b) the Jacobian loses rank, so motion/force transmission degenerates; (c) the gripper is strongest; (d) stiffness is highest. **[b]**
3. **(MC)** The manipulator workspace in the drive-over design is bounded chiefly by: (a) fruit mass; (b) actuator stroke and track width; (c) camera FoV; (d) battery. **[b]**
4. **(MC)** σ_mech (the mechanism's placement error) is set mainly by: (a) camera noise; (b) repeatability, backlash, and deflection under load; (c) drive speed; (d) ripeness. **[b]**
5. **(Short)** State EI-08 and give the SIM2FIELD example. **[The cheapest DOF is the one you design out; letting the rover supply fore/aft x removes an arm axis, yielding a simple, stiff, analyzable mechanism.]**
6. **(Calc)** Anchors $B_1=(-0.3,0)$, $B_2=(0.3,0)$ m; target $G=(0,0.4)$ m. Compute $L_1,L_2$. **[$L_i=\sqrt{0.3^2+0.4^2}=0.5$ m each.]**
7. **(Calc)** σ_rep=2 mm, σ_bl=1 mm, σ_defl=6 mm (RSS). Compute σ_mech and name the dominant term. **[$\sqrt{4+1+36}=\sqrt{41}\approx6.4$ mm; dominant = deflection (stiffen the structure, EI-05).]**
8. **(Design)** Why is the transmission-angle keep-out a *safety* requirement, not just performance? **[Near a singularity the arm demands unbounded joint speed/force or loses control of a heavy payload, a hazard.]**
9. **(Critical thinking)** How does σ_mech interact with the perception error terms in CEC-03? **[They RSS-combine into total placement error; the mechanism inherits whatever the perception/calibration terms leave within 3σ ≤ c.]**
10. **(Critical thinking)** Why is closed-form kinematics on the edge essentially free here, and what makes it so? **[Few DOF (EI-08): IK is a distance calc, FK a two-circle intersection, negligible compute, unlike iterative IK for a 6-DOF arm.]**

---

## 27. Challenge Problems

- **CP-M8-A, The reach/stability/precision co-design.** Jointly choose track width and actuator geometry to (i) cover the bed (reach), (ii) keep the pick region singularity-free, (iii) meet σ_mech under payload, and (iv) respect a stability bound (M10). Identify the binding constraint and whether the feasible set is non-empty. (Bridges CEC-01, CEC-03, EI-08, and M10.)
- **CP-M8-B, Stiffness vs. compliance tension.** M2 wants compliance (bruise-avoidance); this module wants stiffness (precision). With fluid actuators providing controllable stiffness (M9), design an operating scheme that is compliant at contact yet stiff enough for placement; specify what M9 must control. (Sets up M9.)
- **CP-M8-C, Singularity-safe path.** Given a start and grasp target that would naively cross a near-singular region, design a path that stays within the μ/γ keep-out; specify the runtime guard that enforces it. (Feeds M11/M15.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your workspace analysis assumes rigid links and fixed anchors. How do payload deflection and fluid-actuator compliance (M9) violate that, and does your σ_mech budget already account for them or only for kinematic error? Where would an optimistic rigidity assumption first bite?
2. **Tradeoffs.** You offloaded the x-axis to the vehicle (EI-08), simplifying the arm but coupling workspace to track width and timing to the drive. Defend that choice to a reviewer who argues a 3-DOF arm would decouple reach from the platform. What did you actually gain, and what did you pay?
3. **Risk.** Track width must be wide enough to reach the bed and narrow enough for stability (M10). What if that interval is empty for some bed widths? What is your fallback, and does it change the machine or the crop it can serve?
4. **Verification.** You verified reach, singularities, and σ_mech in the kinematic twin. A reviewer notes the twin used nominal geometry and stiffness. How do manufacturing tolerances and wear change the singularity map and σ_mech over the machine's life, and how would you verify the keep-out holds as the mechanism ages?
5. **Subsystem interaction.** σ_mech is one term in CEC-03 alongside perception, calibration, and estimation. If perception's terms grow (e.g., worse lighting inflates σ_Z), does the mechanism have to compensate, and is that even possible? Who arbitrates the re-allocation, and against what capture tolerance (CEC-02)?
6. **Safety.** The singularity keep-out is a safety requirement. What guarantees the runtime guard cannot command a path through a singularity even if the grasp policy (M7) proposes one, and what happens to the heavy payload if a singularity is entered anyway?

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (kinematics, workspace, Jacobian, singularities, σ_mech) are the core (~3 h); EI-08 (Section 7.5) and the track-width resolution (Section 7.2) are the peaks. Trade studies (Section 11) and twin activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M8 is a separate 2 to 3 h session.
- **Common misconceptions.** (1) "More DOF is better", EI-08 reverses this. (2) Confusing accuracy and repeatability, for a staged fruit, repeatability + stiffness dominate. (3) Treating singularities as abstract math, tie them to the heavy-payload safety hazard. (4) Forgetting deflection under load, no-load precision is not the spec.
- **On EI-08 and CEC-03.** EI-08 is the *judgment* (design the DOF out); the σ_mech work is *CEC-03 applied* (an allocated budget becomes mechanism specs). Emphasize that the simplicity EI-08 buys is *what makes* CEC-03 analyzable here, the synthesis note in Section 11.3 makes this explicit.
- **On the introduce->master pattern.** M8 hands M9 a reachable, singularity-free workspace and a stiffness budget; M9 builds the fluid grasp control inside it. Make the responsibility split explicit.
- **Where to push graduate students.** Covariance propagation through J (HW5), the reach/stability co-design (HW6, CP-M8-A), the singularity-safe path (CP-M8-C).
- **Thread to keep visible.** Close by naming hand-offs: reachable/singularity-free workspace + stiffness budget -> M9; track-width/stability curve -> M10/M13; singularity guard -> M11/M15.

---

## 29. Research Frontiers

- **Landmark grounding.** Standard robotics-kinematics references (forward/inverse kinematics, the manipulator Jacobian, manipulability, singularities); the parallel-mechanism and transmission-angle literature; classical structural-stiffness analysis for manipulators. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Stiffness modeling and design of parallel/compliant manipulators for heavy, delicate handling; variable-stiffness and fluidic actuation for agricultural manipulation; singularity-robust and manipulability-aware motion planning; task-based mechanism synthesis (designing the simplest mechanism that covers a required task workspace).
- **Open problems.** Co-designing mechanism stiffness with fluid-control compliance for a bruise-prone heavy payload; guaranteeing singularity-free operation under manufacturing tolerance and wear; automatic reach/stability co-optimization for drive-over field machines.
- **Suggested thesis directions.** (1) A task-optimal parallel mechanism synthesized to cover a bed-width workspace with guaranteed manipulability margin. (2) Combined structural-plus-fluidic stiffness design meeting a placement budget while preserving contact compliance. (3) Lifetime-robust singularity keep-out accounting for tolerance and wear.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Robotics-kinematics references (forward/inverse kinematics, Jacobian, manipulability, singularities), Section 6, Section 7.
- Parallel-mechanism / transmission-angle literature, the mechanism class and its singularity metric (Section 6.2, Section 6.5).
- Manipulator-stiffness / structural-analysis references, σ_mech and deflection under load (Section 6.6, Section 7.5).
- Motion-planning references (manipulability-aware / singularity-robust), the keep-out and guards (Section 7.4; M11).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 7**, and (forthcoming) Doc B, Doc D, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters manipulator kinematics for the case machine and delivers three tied-together results, a closed-form workspace that **resolves the Module-1 TS-1 track-width coupling** as a bounded feasibility problem, a Jacobian/transmission-angle **singularity keep-out** framed as a safety (not just performance) requirement, and the conversion of M5's inherited **σ_mech allocation into buildable stiffness/repeatability specs (CEC-03 applied)**. Its Engineering Insight, **EI-08 (design the DOF out)**, is genuinely new and distinct, and, via the lightweight synthesis note, is shown to be *why* the σ_mech budget is analyzable and the grasp can land in the Grip-Force Window: simplicity, precision, and safety as one decision. The explicit CEC evaluation correctly mints no new CEC (kinematics is a technique; σ_mech is CEC-03 applied), preserving the small anchor set. The introduce->master pattern is honored (M8 hands M9 a bounded workspace and stiffness budget). All 30 sections present; the Engineering Design Review is included and framed as judgment; consistency with the frozen modules and the case-machine geometry (rail-mounted parallel mechanism, $L_i=|G-B_i|$, γ metric) is maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Bed/pick-region width, stroke limits, γ/μ keep-out band, and stiffness targets depend on Doc B/D and real geometry; the kinematics, workspace, singularity, and budget *methods* are exact.
2. **σ_mech feasibility depends on the M5 allocation and payload numbers**, both of which carry their own [VERIFY@PUB] flags; the derivation is exact but its numeric closure awaits Doc B.
3. **Effective stiffness couples to M9's fluid control** (Section 6.7/Section 19), the σ_mech budget is met by structure *plus* controllable fluid stiffness, so its final verification depends on the M9 grasp controller (introduce->master forward dependency, flagged).
4. **Reach/stability co-design is set up but not closed**, the track-width interval depends on the M10 stability bound, authored later (SR-I-11); this module hands forward the curve, not the final number.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 4 close chiefly by authoring Doc B/D and by reaching M9/M10.

**END OF MODULE 8, STOP. Awaiting your review before freezing Module 8 or proceeding to Module 9.**
