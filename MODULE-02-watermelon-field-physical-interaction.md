# Module 2: The Watermelon, the Field & Physical Interaction

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M2, **Part I, Frame the System**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 4 to 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation (fruit contact & damage models) + Digital Twin, this module *defines* the fruit-contact model the twin needs
**Prerequisites:** M1 (systems framing, requirements, budgets). Math: statics, introductory dynamics, algebra.
**Revision:** **1.1, frozen baseline (approved).** Rev 1.1 introduces the Core Engineering Concept convention (defines **CEC-02**, the Grip-Force Window, and references **CEC-01**); no engineering content, equations, requirements, labs, or technical discussion changed. Controlled changes only.

> **Authoring note (governance).** Authored consistent with the frozen **Module 1 Rev 1.0**, the approved Phase-0 Foundation, and the Phase-1 Curriculum Architecture. Where a P0 document will later hold authority the text is tagged **[->Doc B]** (System Design Specification), **[->Doc G]** (Simulation & Digital-Twin Architecture), **[->Doc H]** (Engineering Standards), **[->Doc I]** (Curriculum Standards). Perishable or cultivar/field-dependent values are tagged **[VERIFY@PUB]** and consolidated for later ratification.

---

## 1. Module Overview

**Mission.** This module goes to the source of the machine's constraints, the watermelon and the field. Before we can size a gripper, choose a drive speed, or write a damage requirement with a real number in it, we must understand the object we are handling: how heavy it is and how that mass varies, how its rind carries load and how it bruises, how ripeness reveals itself to a sensor, and how every one of these properties scatters across a real field rather than sitting at a convenient nominal value.

**Previous milestone.** Module 1 established the machine, the method, and one hard truth: the harvester's constraints do not originate in the robot, they originate in the watermelon and the field.

**Engineering problem.** The intellectual spine of this module mirrors Module 1 deliberately: there, a budget produced a feasibility window, the drive speed at which a single arm can keep pace; here, the physics of contact and friction produces another feasibility window, the grip-force window: a grasp must be firm enough not to drop a 5 to 10 kg fruit, yet gentle enough not to bruise it. We will derive both bounds from first principles.

**Design tension.** We discover that the window can be uncomfortably narrow (or, for a poor design, empty), and show that the way to open it is compliance, the physical property that fluid-powered gripping provides. This is where the curriculum's Fluid-Powered Physical AI thesis stops being a claim and becomes a number.

**What this module resolves.** By the module's end you will have turned the abstract system requirement "do not damage the fruit" (SR-P-02 from Module 1) into a set of quantitative, verifiable sub-requirements that Modules 8 and 9 must satisfy, and you will have specified the fruit-contact model the digital twin needs in order to test them simulation-first.

> *Core concept in use.* This module sits on the Act stage of CEC-01 (the Signal-to-Action Spine) and produces the physical constraint that stage must honor. That constraint, CEC-02 (the Grip-Force Window), is introduced formally in Section 7.4.


## 2. Learning Objectives

On completing this module, a student will be able to:

- **LO-M2.1** Describe the mechanical structure of a watermelon and explain how rind, flesh, and turgor determine its load-bearing and bruising behavior., *Bloom: Understand*
- **LO-M2.2** Apply Hertzian contact reasoning to relate grasp force, contact geometry, and compliance to peak contact pressure on the rind., *Bloom: Apply*
- **LO-M2.3** Derive the grip-force window, the lower (anti-slip) and upper (anti-bruise) bounds, and determine whether it is feasible for a given design., *Bloom: Analyze (with Evaluate)*
- **LO-M2.4** Derive a maximum safe placement/drop height from an impact-energy bruise threshold., *Bloom: Apply*
- **LO-M2.5** Treat field and fruit variability statistically and select design values (e.g., percentiles) rather than nominal points., *Bloom: Apply (with Analyze)*
- **LO-M2.6** Translate fruit and field physics into verifiable system requirements for the gripper, structure, placement, and perception., *Bloom: Create*
- **LO-M2.7** Specify the fruit-contact and damage model the digital twin requires to verify handling requirements., *Bloom: Create (with Evaluate)*

These map to course objectives **LO2** (primary), **LO5/LO3** (reinforcing), and ABET **SO1, SO6**. [->Doc I confirms the mapping convention.]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Estimate a watermelon's mass and inertia from its dimensions and explain the handling consequences., *Bloom: Apply*
2. Compute peak contact pressure for a given grasp force, pad geometry, and compliance, and compare it to a bruise threshold., *Bloom: Apply (with Evaluate)*
3. Derive both bounds of the grip-force window and diagnose an empty window, proposing physically grounded fixes., *Bloom: Analyze (with Create)*
4. Set a maximum placement height from an impact-energy budget., *Bloom: Apply*
5. Choose design values from a distribution and justify the chosen percentile against a failure consequence., *Bloom: Evaluate*
6. Write fruit-derived, verifiable requirements and hand them, with traceability, to the mechanism, gripper, placement, and perception modules., *Bloom: Create*
7. Specify what physics the twin's fruit-contact model must capture to verify a stated handling requirement., *Bloom: Evaluate (with Create)*

---

## 4. Engineering Motivation

An engineer who begins by designing a gripper has already made a mistake: they have chosen a form before understanding the object that form must serve. Every hard number in this machine's specification, the maximum grip force, the minimum, the safe placement height, the required gripper stroke, the payload the arm must lift, even the features the perception model must learn, is dictated by the fruit and the field, not by the robot. This module is where those numbers are born.

Consider what "handle a watermelon" actually demands. The fruit weighs 5 to 10 kg [VERIFY@PUB, cultivar and maturity dependent], so the grip must resist that weight plus the dynamic loads of lifting and swinging, a *minimum* force set by friction and physics. Yet the same rind that must bear that grip will bruise if local contact pressure exceeds a tissue-failure threshold, a *maximum* force set by biomechanics. These two limits define a window, and nothing about the fruit guarantees the window is wide. Grip too lightly and a 7 kg melon slips free at the top of a swing and is destroyed on the ground; grip too hard and it arrives in the bin already bruised, unsellable. The engineering target is the narrow band between two failures, and the fruit decides how narrow.

Now add the field. No two melons share a mass, a diameter, an orientation, or a ripeness. The design cannot be tuned to one perfect fruit; it must succeed across a *distribution*, the small and the large, the firm and the soft, the exposed and the canopy-buried. A gripper sized for the average melon fails on a quarter of the crop. This is why the module treats variability as a first-class engineering input, not noise to be averaged away.

The payoff is conceptual and course-defining: **the physics of this fruit is the reason the machine is built the way it is.** The narrowness of the grip-force window is the quantitative argument for compliant, force-regulated gripping; the mass distribution sizes the structure and actuation; the ripeness cues define the perception problem; the impact threshold shapes the mission's placement behavior. Understand the watermelon, and the rest of the machine's requirements follow with the force of physics rather than the softness of preference.

---

## Engineering Failure Cases (payload-specific)

Module 1 surveyed the six failure classes at the system level. This module sharpens the two that originate at the fruit interface, because their root causes are the physics developed here.

- **Bruise-on-grasp (a manipulation failure with a physics root).** The gripper closes with more peak contact pressure than the rind tolerates. The fruit looks fine leaving the field and is unsellable by the packing house. Root cause: the design lived at or above the upper bound of the grip-force window, often because it used rigid contact (small contact patch -> high peak pressure) or open-loop force. *Motivates Section 7's Hertzian analysis, the compliance argument for M9, and closed-loop grasp-force control.*
- **Slip-and-drop (a manipulation failure with a physics root).** The grip is below the anti-slip bound; the fruit shifts or falls during lift, swing, or transfer, and impacts hard enough to bruise or shatter. Root cause: insufficient normal force for the friction available, or a placement height whose impact energy exceeds the bruise threshold. *Motivates Section 7's friction and impact-energy budgets, the mission's controlled-LOWER behavior, and pad-material selection in M9.*

Both failures are two sides of one window. The rest of the module makes that window quantitative so later modules can engineer inside it.

---

## 5. Background Knowledge

**Assumed (from prerequisites and M1):** statics (forces, friction, free-body diagrams); introductory dynamics (Newton's second law, simple kinematics of lift/swing); algebra; the M1 vocabulary of requirements, budgets, margins, and feasibility windows.

**Introduced here, used later:** the mechanical vocabulary of produce handling, *rind/exocarp, flesh/mesocarp, turgor, contact pressure, Hertzian contact, bruise threshold (quasi-static and impact), coefficient of friction, size/mass distribution, ripeness cue*. Contact mechanics is introduced at an applied (L2) level; the full elasticity theory is referenced, not derived from scratch [->Doc H notation].

**Where this sits in the dependency graph.** M2 hard-depends only on M1. It **masters** fruit contact & damage mechanics; it **introduces** the fluid-power/compliance and force-control threads (with their physical motivation) and the sensor-physics thread (what must be sensed for ripeness); it **reinforces** manipulator-kinematics and actuation context. It hands quantitative handling requirements forward to M8 (structure/kinematics), M9 (gripper, fluid power, force control), M4 (ripeness perception), and M13/M14 (twin model, verification).

---

## 6. Theory

### 6.1 What a watermelon is, mechanically
A watermelon is a thin-walled, internally pressurized shell. The **rind** (exocarp plus a firm hypodermis) is the load-bearing structure, a curved, relatively stiff shell a few millimetres to a centimetre thick. The **flesh** (mesocarp) is a soft, high-water-content tissue held in compression by cellular **turgor** (internal water pressure in living cells). Mechanically, this matters in three ways: (1) the rind carries and distributes external contact load, so its local failure is what "bruising" of the outer product means; (2) the pressurized flesh gives the whole fruit a global stiffness and a characteristic acoustic response (the basis of "thumping"); (3) as the fruit ripens and post-harvest cells begin to break down, both stiffness and failure thresholds drift, so mechanical properties are a function of maturity, not constants [VERIFY@PUB values].

**Geometry and mass.** The fruit is approximately an ellipsoid. Treating it as one lets us estimate volume from measured axes and mass from volume and density; density is near that of water but varies with internal structure and maturity. Mass and the mass *distribution* across a field are primary design drivers (Section 7.1, Section 7.5).

### 6.2 Bruising as a mechanical failure
Bruising is mechanical damage to tissue: cells rupture or separate when local stress exceeds their failure limit, causing internal softening and discoloration that may not be visible at harvest but appears days later. Two damage modes matter to a harvester:

- **Quasi-static (grip) damage.** Sustained contact pressure from the gripper exceeds the rind/tissue failure pressure. The controlling variable is **peak contact pressure**, not total force, which is why *how* the force is applied (contact area, compliance) matters as much as *how much* (Section 6.3).
- **Dynamic (impact) damage.** A drop or hard placement delivers kinetic energy to a small contact region on impact. The controlling variable is **impact energy** (and how it is absorbed). This sets a maximum safe placement height (Section 7.4) and explains why the mission *lowers* fruit into the bin rather than dropping it.

A useful engineering idealization: each tissue has an approximate **bruise-threshold pressure** $p_\text{br}$ (for quasi-static contact) and an approximate **bruise-threshold energy** $E_\text{br}$ (for impact). Both are distributions, not single numbers, and both depend on maturity [VERIFY@PUB]. We design against a conservative percentile, per Section 7.5.

### 6.3 Contact mechanics: why compliance is the whole game
When a gripper pad presses on the curved rind, the two bodies meet over a finite **contact patch**. For a curved elastic body pressed against a surface, Hertzian contact theory gives the size of that patch and the pressure distribution within it. The engineering consequence we need is qualitative-then-quantitative:

- For a given **total force**, a **larger contact patch** means a **lower peak pressure** (the force is spread over more area).
- A **more compliant** contact (a softer pad, or a fluid-backed pad that conforms to the rind) **enlarges the contact patch** and **flattens the pressure distribution**, lowering the peak.

Therefore two grippers applying the *same* force to the *same* fruit can produce completely different peak pressures, one safely below $p_\text{br}$, the other bruising. **Compliance is the design variable that lets a gripper apply enough force to hold the fruit without exceeding the pressure that damages it.** This single fact is the physical foundation of the course's fluid-powered compliant-gripping thesis: fluid power provides intrinsic, conforming compliance at the contact, widening the safe operating window. The math of Section 7.2 makes this quantitative.

### 6.4 Ripeness: the fruit talking to a sensor
A harvester must pick *mature* fruit and leave the rest, so ripeness is a system requirement, and ripeness must be *observable*. Watermelon ripeness expresses itself through several physical cues, each with a matched sensing modality (introduced here; sensor physics mastered in M3, perception in M4):

- **Ground-spot color** (where the fruit rested on soil) shifts from white toward creamy yellow, an optical/color cue.
- **Tendril/vine dieback** near the fruit, a visual/contextual cue.
- **Acoustic response** ("thump"), the pressurized shell's resonance changes with maturity, an acoustic cue.
- **Density / internal structure**, correlates with sugar and water content, accessible via spectral/NIR sensing.
- **Rind sheen and surface texture**, optical cues.

The engineering point: ripeness is **probabilistic and multi-cue**. No single cue is decisive, which is exactly why later modules fuse modalities (M5) and learn from data (M4) rather than thresholding one channel. This module's job is to catalog the cues and their variability so the perception dataset (M4) and sensing suite (M3) can be designed to capture them.

### 6.5 The field as a statistical environment
Every fruit property varies, and so does its context: along-row spacing, size and mass, orientation, depth of canopy occlusion, soil unevenness, and the environmental envelope (temperature, dust, humidity, light). A harvester does not meet the average fruit in the average condition; it meets a *distribution* of fruit in a *distribution* of conditions. The correct design posture, carried from M1's set-based thinking, is to characterize these distributions and design to a defensible percentile of each, accepting and quantifying the residual failure rate at the tails (which the damage- and success-rate requirements, SR-P-01/02, then bound).

---

## 7. Mathematics

Rigor tier for M2: **L2** (applied), with an L3 grad extension on contact mechanics. Three quantitative results are developed; together they produce the grip-force window and the placement-height limit that become requirements.

### 7.1 Mass and inertia from geometry
Model the fruit as an ellipsoid with semi-axes $a,b,c$. Volume $V=\tfrac{4}{3}\pi abc$; mass $m=\rho V$ with density $\rho \approx \rho_\text{water}$ (adjust for maturity [VERIFY@PUB]). For handling dynamics (lift, swing), the fruit's inertia about the grasp point affects the torque the arm must supply and the dynamic load on the grip; approximating the fruit as a solid ellipsoid gives principal moments $I \propto \tfrac{1}{5}m(\cdot)$ of the semi-axes. *Use:* mass sets the anti-slip force (Section 7.3) and the payload the structure/actuation must carry; inertia sets dynamic grip demand during motion.

### 7.2 Peak contact pressure and the anti-bruise (upper) bound
For a curved elastic body pressed with force $F$ against a compliant pad, Hertzian contact gives a contact-patch radius $a_c$ and a peak pressure $p_\text{max}$ of the forms
$$ a_c = \left(\frac{3 F R_\text{eff}}{4 E^\ast}\right)^{1/3}, \qquad p_\text{max} = \frac{3F}{2\pi a_c^{2}} \;=\; \left(\frac{6 F (E^\ast)^2}{\pi^3 R_\text{eff}^2}\right)^{1/3}, $$
where $R_\text{eff}$ is the effective contact radius (fruit curvature combined with pad curvature) and $E^\ast$ is the **effective modulus** combining fruit and pad stiffness. Two consequences drive the design:

1. **Peak pressure grows only as $F^{1/3}$**, sub-linearly, so modest force increases are relatively forgiving, but there is still a force at which $p_\text{max}=p_\text{br}$.
2. **Peak pressure grows as $(E^\ast)^{2/3}$**, softening the contact (lower $E^\ast$, i.e., a compliant/fluid-backed pad) or increasing conformance (larger effective area) **directly lowers peak pressure for the same holding force.** This is the quantitative statement of Section 6.3.

**Anti-bruise bound.** The largest safe grasp force satisfies $p_\text{max}(F_\text{bruise}) = p_\text{br}$; solving,
$$ F_\text{bruise} \;=\; \frac{\pi^3 R_\text{eff}^2\, p_\text{br}^{3}}{6 (E^\ast)^2}. $$
A stiffer contact (large $E^\ast$) *shrinks* $F_\text{bruise}$; a compliant contact *raises* it, widening the window from the top.

> *Grad extension (L3).* Derive $a_c$ and $p_\text{max}$ from Hertzian half-space theory; discuss where the elastic idealization breaks down for a viscoelastic, pressurized biological shell, and how a conforming pad violates the small-contact assumption in a *favorable* direction.

### 7.3 Friction and the anti-slip (lower) bound
A two-pad grip holds the fruit by friction. To prevent slip under gravity plus the peak dynamic acceleration $a_\text{dyn}$ of lift/swing, each pad's normal force $F$ must satisfy (two contacts, friction coefficient $\mu$):
$$ 2\,\mu F \;\ge\; m\,(g + a_\text{dyn}) \quad\Longrightarrow\quad F_\text{slip} \;=\; \frac{m\,(g + a_\text{dyn})}{2\,\mu}. $$
A safety factor $n_s$ is applied: $F_\text{min} = n_s\,F_\text{slip}$. *Levers:* higher-friction pad material (larger $\mu$) or gentler motion (smaller $a_\text{dyn}$) lowers the required force, widening the window from the bottom.

### 7.4 The grip-force window (the module's central result)
Combining Section 7.2 and Section 7.3, a feasible grasp exists only if
$$ \boxed{\,F_\text{slip} \;\le\; F_\text{grip} \;\le\; F_\text{bruise}\,} $$

> ### Core Engineering Concept, CEC-02: The Grip-Force Window
> **A grasp on a heavy, bruise-prone fruit succeeds only inside a window bounded below by slip and above by bruising: $F_\text{slip} \le F_\text{grip} \le F_\text{bruise}$. The window can be narrow or empty; the design lever that *opens* it is compliance, because $F_\text{bruise}\propto (E^\ast)^{-2}$, which is why fluid-powered compliant gripping is central to this machine.**
>
> *Owned and introduced here (Module 2, Section 7.4). Recurs as the requirement the gripper must satisfy (M9), the safety bound on the learned grasp policy (M7), and a verification target (M14). See the [Core Engineering Concepts Register](curriculum/_core-concepts.md).*
i.e. the anti-slip minimum must not exceed the anti-bruise maximum. If $F_\text{slip} > F_\text{bruise}$, **the window is empty** and *no grasp force succeeds* for that design, the fruit cannot be held firmly enough without bruising. The physically grounded fixes are exactly the levers above: **lower $E^\ast$ (compliance)** and **enlarge $R_\text{eff}$ (conformance)** to raise $F_\text{bruise}$; **raise $\mu$ (pad material)** and **reduce $a_\text{dyn}$ (gentler trajectories)** to lower $F_\text{slip}$; or add contacts (a cradle rather than two pads) to distribute both. Note the through-line to Module 1: as with the cycle-time window, the physics does not hand us a design, it hands us a *constraint that a design must open*, and the compliance lever is why fluid power is central.

### 7.5 Designing to a distribution
Mass, $p_\text{br}$, $\mu$, and size all vary. Because slip and bruise sit at opposite tails, a robust design does not use nominal values: it sizes $F_\text{min}$ against a **high-mass percentile** (worst case for slip) and checks $F_\text{bruise}$ against a **low-threshold, stiff-contact percentile** (worst case for bruising). The window must remain non-empty across the joint distribution to the target success/damage percentile (SR-P-01/02). Where it closes at the tails, the residual failure rate is quantified and either accepted (within SR-P-02) or engineered out. This is set-based design (M1 Section 7.3) applied to the payload.

---

## 8. Engineering Principles

1. **Characterize the object before designing the tool.** Every downstream number descends from fruit and field physics.
2. **Peak pressure, not total force, causes bruising**, so contact geometry and compliance are first-class design variables.
3. **Compliance opens the safe window.** Softening and conforming the contact raises the anti-bruise bound; this is the physical mandate for fluid-powered gripping.
4. **Every grasp lives in a window bounded by two failures** (slip below, bruise above); an empty window is a design defect, not bad luck.
5. **Design to distributions and percentiles, not nominal values.**
6. **Physics becomes requirements.** A handling constraint is only engineering once it is a verifiable number handed to a subsystem.
7. **Simulation-first for contact.** Handling claims are tested in a twin whose fruit-contact fidelity is specified here before any hardware grasp is trusted.

---

## 9. System Requirements

Derived from the physics above; these refine Module 1's SR-P-02 (damage rate) and SR-P-04 (placement) into quantitative, verifiable sub-requirements. IDs continue the `SR-<type>-<n>` scheme and will be formalized in Doc B [->Doc B]. Targets tagged [VERIFY@PUB] pending cultivar/field data.

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-05 | Performance | The end-effector shall regulate grasp force within the fruit's grip-force window $[F_\text{slip},F_\text{bruise}]$ across the design mass/threshold distribution. | Analysis + twin test + bench test (M9/M14) |
| SR-P-06 | Performance | Peak rind contact pressure shall not exceed the bruise-threshold percentile $p_\text{br}$ [VERIFY@PUB] under any commanded grasp. | Contact analysis + measurement |
| SR-P-07 | Performance | Placement/drop impact energy shall not exceed the impact bruise threshold $E_\text{br}$ [VERIFY@PUB] => bounded placement height (Section 7.4). | Analysis + drop test |
| SR-C-04 | Constraint | The gripper shall accommodate the fruit size distribution from the [low]th to [high]th percentile [VERIFY@PUB] (stroke and conformance). | Test across a size set |
| SR-P-08 | Performance | The structure and actuation shall handle the high-mass percentile payload with margin (Section 7.1). | Analysis (M8/M9) |
| SR-F-03 | Functional | Perception shall discriminate mature from immature fruit using the ripeness cues cataloged in Section 6.4 to the accuracy required by SR-P-01. | Test (M4) |
| SR-I-03 | Interface | The fruit-contact/damage model (parameters, thresholds) shall be a controlled shared model consumed by the twin, the grasp controller, and V&V. | Review (->Doc G) |

Each row traces up to a ConOps handling need (M1 Section 6.3) and forward to its owning module. SR-P-05/06/08 and SR-C-04 -> **M9/M8**; SR-P-07 -> mission placement (**M8/M10**) and **M14**; SR-F-03 -> **M4**; SR-I-03 -> the twin model (**M13**, **[->Doc G]**).

---

## 10. Design Decisions

System-level decisions this module's physics *forces*. (Component-level gripper design is M9; here we fix the direction the physics dictates.)

- **DD-6 Compliant, conforming contact.** The end-effector shall contact the rind through compliant, conforming pads (not rigid points), to hold peak pressure below $p_\text{br}$ at the required holding force. *Rationale:* Section 7.2, compliance raises $F_\text{bruise}$. *Serves:* SR-P-05/06. (Realized as fluid-powered compliance in M9.)
- **DD-7 Closed-loop grasp-force regulation.** Grasp force shall be *regulated* to sit inside the window, not applied open-loop. *Rationale:* the window can be narrow and fruit-specific; only feedback keeps every fruit inside it. *Serves:* SR-P-05. (Realized as AI-assisted force control in M9.)
- **DD-8 Controlled placement, not dropping.** Fruit shall be lowered to within the safe impact height before release. *Rationale:* Section 7.4 impact-energy bound. *Serves:* SR-P-07. (Realized in the mission FSM's LOWER-before-RELEASE behavior, M10/M13.)
- **DD-9 Distribution-based sizing.** Gripper stroke, structure, and actuation shall be sized to fruit percentiles, not nominal values. *Rationale:* Section 7.5. *Serves:* SR-C-04, SR-P-08.

These decisions are the physics-mandated inputs to the M9 gripper trade study; DD-6 in particular is the point at which "fluid-powered compliant gripping" becomes the *derived* answer rather than an assumed one.

---

## 11. Trade Studies

### 11.1 TS-3: End-effector contact strategy
**Question:** how should the machine contact and hold a heavy, bruise-prone, size-varying fruit? **Alternatives:** (A) **rigid pinch fingers**; (B) **compliant conforming pads** (fluid-backed); (C) **suction/vacuum**; (D) **passive cradle/scoop**. Scored 1 to 5 against physics-derived criteria (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Rigid pinch | B: Compliant pads | C: Suction | D: Cradle |
|--------------------|:---:|:---:|:---:|:---:|
| Low peak contact pressure / anti-bruise (0.28) | 2 | 5 | 3 | 4 |
| Grip security on 5 to 10 kg / anti-slip (0.22) | 4 | 4 | 2 | 5 |
| Tolerance to size & shape variation (0.18) | 2 | 4 | 3 | 4 |
| Robustness to dust/dirt/wet rind (0.14) | 4 | 4 | 1 | 4 |
| Compatibility with force regulation (0.10) | 3 | 5 | 2 | 2 |
| Mechanism/plumbing complexity (0.08) | 4 | 3 | 3 | 3 |
| **Weighted total** | **2.80** | **4.36** | **2.50** | **4.10** |

**Selected: B (compliant conforming pads), with cradle features (D) as a hybrid.** Compliant pads win on the decisive criterion, low peak pressure, while remaining compatible with closed-loop force regulation (DD-7); cradle geometry contributes anti-slip support for the heaviest fruit. Suction is defeated by a dusty, wet, irregular rind; rigid pinch is defeated by peak pressure. Recorded weakness for M9 scrutiny: compliant/fluid contact adds plumbing and a pressure-control loop, and its performance depends on pad material and fluid choice, the exact subjects M9 masters.

### 11.2 TS-4: Ripeness sensing emphasis (summary)
**Alternatives:** single-cue optical (ground-spot color), acoustic (thump), spectral/NIR (internal), **multi-cue fusion**. **Criteria:** accuracy across maturity, robustness to lighting/soil, sensing cost/complexity, field practicality. **Outcome:** *multi-cue fusion*, no single cue is reliable across the maturity and field-condition distributions (Section 6.4/Section 6.5); this defers the detailed modality trade to M3 (sensor physics) and the fusion/learning design to M4 to M5. Recorded here so the perception dataset (SR-F-03) is scoped to capture *multiple* cues from the outset.

> **Simulation-first hook.** Both trade results make testable claims, "compliant pads keep peak pressure below threshold at the required force," "the window stays non-empty across the mass distribution." Section 12, Section 13 specify the twin fidelity needed to test them before any fruit is squeezed.

---

## 12. Simulation Activities

M2 operates at the first lifecycle stage, **Simulation of fruit contact and damage**, and it is the module that *defines the fruit-contact model the twin needs*. The current kinematic twin has no contact or damage physics (Foundation conflict CR-03); this module specifies the minimum model to add [->Doc G fidelity ladder].

**SA-1, Instantiate the fruit model.** Populate the twin's fruit with the Section 7.1 properties: mass drawn from a distribution, ellipsoidal geometry, and the contact parameters ($R_\text{eff}$, $E^\ast$, $p_\text{br}$, $\mu$, $E_\text{br}$). *Outcome:* the twin's fruit is a parameterized physical object, not a static mesh.

**SA-2, Exercise the grip-force window.** Command a range of grasp forces in the twin and observe the two failure flags: **slip** (below $F_\text{slip}$, the fruit shifts/falls) and **bruise** (above $F_\text{bruise}$, peak pressure exceeds $p_\text{br}$). Locate the feasible band and confirm it matches the Section 7.4 prediction. *Outcome:* the central result is verified in simulation, not just derived.

**SA-3, Impact/placement test.** Vary release height; observe when impact energy exceeds $E_\text{br}$ and the bruise flag trips on landing. Read off the maximum safe placement height (SR-P-07). *Outcome:* the mission's LOWER-before-RELEASE behavior (DD-8) is justified by simulation.

**SA-4, Compliance sweep.** Reduce the pad's effective modulus $E^\ast$ and watch $F_\text{bruise}$ (and therefore the window) widen. *Outcome:* students *see* compliance opening the window, the fluid-power thesis made visible.

---

## 13. Digital Twin Activities

**DTA-1, Specify the fruit-contact model (deliverable to Doc G).** Write the minimum specification for the twin's fruit-contact/damage model: which physics it must represent (Hertzian peak pressure vs. force and compliance; friction-based slip; impact-energy bruising), the parameters it exposes, and the fidelity tier it belongs to. *Outcome:* a concrete input to the Simulation & Digital-Twin Architecture (SR-I-03), and a direct, honest engagement with CR-03.

**DTA-2, Validate-ability audit.** For SR-P-05 (grip-force window) and SR-P-07 (placement), state exactly what the twin must measure to verify each, and what real-world data (bench pressure tests, drop tests) would be needed to *validate* the twin model itself. *Outcome:* students distinguish simulation from validated simulation, the difference between a model that runs and one you can trust.

**DTA-3, Distribution in the twin.** Run a batch of grasps across the fruit mass/threshold distribution (Section 7.5) and estimate the fraction that fall outside the window (predicted damage/slip rate). Relate to SR-P-01/02. *Outcome:* a simulated, statistical damage-rate estimate, the twin as a requirements-verification instrument.

---

## 14. Hardware Activities

*(Tiered: characterization protocol at specification level; may be run as a physical lab where fruit is available, see Section 24.)*

**HA-1, Fruit characterization protocol.** Specify (and, if fruit is available, execute) the measurement of mass, principal dimensions, and ripeness cues across a sample, producing the distributions Section 7.5 needs. *Deliverable:* a characterization dataset feeding the twin model and Doc B targets [VERIFY@PUB].

**HA-2, Pad-material friction note.** Specify a simple protocol to estimate the pad-rind friction coefficient $\mu$ for candidate pad materials (the Section 7.3 lever). *Deliverable:* a $\mu$ estimate that bounds $F_\text{slip}$; informs M9 pad selection. (No destructive bruise testing is prescribed here; bruise-threshold characterization is referenced to the literature and to controlled M14 testing for safety and food-handling reasons.)

---

## 15. Software Activities

**SWA-1, The fruit model as a shared data structure.** Define the fruit-model parameter set (geometry, mass, contact/damage thresholds, ripeness-cue descriptors) as a controlled schema consumed by the twin, the grasp controller (M9), and V&V (M14), SR-I-03. *Outcome:* one authoritative fruit model, not divergent copies.

**SWA-2, Ripeness cues to perception features.** Sketch how the Section 6.4 cues map to features/labels for the M4 perception dataset (ripeness classes, per-cue annotations, required variability). *Outcome:* a dataset-design seed for M4 (SR-F-03), ensuring the data captures multiple cues.

---

## 16. ROS 2 Integration

M2 is a physical-modeling module; it introduces no runtime ROS 2 nodes of its own. Its integration contribution is an **interface**: the controlled fruit-contact/damage model (SR-I-03) is the shared parameterization that later nodes depend on, the grasp/force-control node (M9) reads its thresholds, the perception node (M4) reads its ripeness descriptors, and the safety/V&V tooling (M14/M15) reads its limits. Establishing this shared model now prevents the classic integration failure (M1's failure taxonomy) of subsystems each carrying a private, inconsistent notion of "the fruit."

---

## 17. AI Integration

The fruit and field physics **defines the perception learning problem** even though no model is trained here:

- **Ripeness as a learning target.** Section 6.4's multi-cue, probabilistic ripeness is why M4 uses learned, multi-feature discrimination rather than a single threshold. The cue catalog specifies the *labels* the dataset needs (SR-F-03).
- **Variability as the data requirement.** Section 6.5's distributions (size, occlusion, lighting, orientation) define the *coverage* the perception dataset must have, and therefore the **synthetic-data** generation targets (M4): the twin's parameterized fruit (SA-1) is a synthetic-data source for exactly this variability.
- **Grasp-force policy target.** The grip-force window (Section 7.4) is the objective the M7/M9 learned grasp-force policy optimizes within, the physics defines the reward's feasible region and its safety bounds.

The system-level AI rule from M1 holds: a learned ripeness or grasp decision is always bounded by the physical limits established here (never command outside the window), keeping learning inside a verified envelope.

---

## 18. Edge Computing Integration

No new edge requirement originates in M2, but two on-robot consequences are fixed here: (1) ripeness inference (M4) and grasp-force regulation (M9) must run **on-robot** within the control loop (SR-C-01, DD-4), so the fruit-model thresholds and ripeness features must be lightweight enough to evaluate at loop rate on the edge device (budgeted in M6); (2) the fruit-contact model's *runtime* form (the thresholds the controller enforces) is distinct from its *development* form (the richer model used to generate synthetic data and validate the twin), an instance of the development/runtime boundary (CR-05) at the payload level.

---

## 19. Fluid Power Integration

This module supplies the **quantitative motivation** for fluid-powered compliant gripping, the "Introduced" cell for the fluid-power and force-control threads, grounded in physics rather than assertion:

- **The problem statement is a pressure problem.** Bruising is peak-contact-pressure exceeding $p_\text{br}$ (Section 6.2, Section 7.2). Holding a heavy fruit demands force; not bruising demands that the force arrive as *low peak pressure*. Reconciling these is a compliance-and-force-control problem.
- **Compliance raises the safe ceiling.** Section 7.2 shows $F_\text{bruise}\propto (E^\ast)^{-2}$, softening the contact directly widens the grip-force window. A fluid-backed pad conforms to the irregular rind, enlarging $R_\text{eff}$ and lowering $E^\ast$ simultaneously.
- **Pressure is a natural force proxy.** A fluid-powered grip makes the control variable (fluid pressure) a direct, measurable proxy for contact force, the physical basis for the closed-loop, AI-assisted grasp-force regulation (DD-7) that M9 masters.
- **Back-drivability protects against transients.** A compliant fluid actuator yields under an unexpected load spike (a shifting fruit, a mispredicted pose), absorbing energy that a stiff actuator would transmit into the rind.

M2 states, with numbers, *why the machine needs fluid-powered compliance*; M9 designs the circuit, valves, actuator, and controller that deliver it, and M15 addresses its stored-energy safety.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

Specifications for the media/web team; fit the existing shell without redesign [->Doc J].

- **W-M2-1, Grip-Force Window Calculator.** Inputs: fruit mass (or percentile), $\mu$, safety factor, pad $E^\ast$, $R_\text{eff}$, $p_\text{br}$. Outputs: $F_\text{slip}$, $F_\text{bruise}$, the window bar, and a feasible/empty verdict; a "soften the pad" slider that visibly widens the window. *Goal:* let students feel the window and the compliance lever.
- **W-M2-2, Hertzian Contact Visualizer.** Slider on force and compliance -> animated contact patch and peak-pressure readout vs. $p_\text{br}$ (green/red). *Goal:* Section 7.2 made tactile.
- **W-M2-3, Placement-Height / Impact-Energy Calculator.** Inputs: mass, drop height, $E_\text{br}$ -> impact energy vs. threshold and max safe height. *Goal:* justify DD-8.
- **W-M2-4, Distribution Explorer.** A fruit mass/size histogram with a percentile selector feeding W-M2-1, showing how the window's feasibility changes across the crop. *Goal:* Section 7.5.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M2-1** Watermelon anatomical cross-section (rind/hypodermis/flesh, turgor) with load-path callouts.
- **CAD-M2-2** Contact-patch geometry: rigid pad vs. compliant/fluid-backed pad on the curved rind (same force, different patch/pressure).
- **CAD-M2-3** Gripper conformance across the size distribution (small/median/large fruit in the same gripper).
Format per ->Doc J (SVG diagrams; renderings for anatomy).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M2-1 | Watermelon anatomy & load path | Section 6.1 |
| F-M2-2 | Quasi-static vs. impact damage modes | Section 6.2 |
| F-M2-3 | Hertzian contact: force/compliance -> peak pressure | Section 6.3/Section 7.2 |
| F-M2-4 | **Grip-force window diagram** (slip vs. bruise bounds; empty-window case) | Section 7.4 (central) |
| F-M2-5 | Compliance widening the window ($F_\text{bruise}$ vs. $E^\ast$) | Section 7.2/Section 19 |
| F-M2-6 | Impact energy vs. placement height | Section 7.4 |
| F-M2-7 | Fruit mass/size distribution & design percentiles | Section 7.5 |
| F-M2-8 | Ripeness cue catalog (cue <-> modality) | Section 6.4 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M2-1** Contact patch and peak pressure evolving as grasp force rises and as the pad softens, the moving form of F-M2-3/F-M2-5.
- **AN-M2-2** The grip-force window: a force dial moving between the slip floor and bruise ceiling, tripping each failure at the bounds; then the window widening as compliance increases.
- **AN-M2-3** Drop vs. controlled-lower placement, with the impact-energy bruise flag on the hard drop only.

---

## 24. Laboratory

**Lab M2, Characterizing the Payload: Deriving Grasp-Force and Handling Limits**

- **Objectives.** (1) Characterize watermelon mass/size (and, where safe, ripeness cues) as distributions; (2) compute the grip-force window and diagnose its feasibility; (3) derive the maximum safe placement height; (4) write three fruit-derived requirements and specify the twin's fruit-contact model.
- **Equipment.** Either a provided characterization dataset [VERIFY@PUB] *or* real watermelons with a scale and calipers; candidate pad-material samples for a friction estimate; the digital twin. **Safety:** watermelons are heavy, use proper lifting technique (the 5 to 10 kg payload is itself a design driver); no destructive bruise testing is performed in this lab (bruise thresholds are taken from provided data/literature).
- **Procedure.**
  1. Measure/collect mass and principal dimensions for a sample of ≥10 fruit; build the mass and size distributions; identify the high-mass and low-mass percentiles you will design to (Section 7.5).
  2. Estimate the pad-rind friction coefficient $\mu$ for one candidate material (HA-2 protocol).
  3. Using provided $p_\text{br}$, $R_\text{eff}$, and pad $E^\ast$ [VERIFY@PUB], compute $F_\text{bruise}$ (Section 7.2) and, from the high-mass percentile and a chosen safety factor, $F_\text{slip}$ (Section 7.3).
  4. Establish the grip-force window; state whether it is feasible; if narrow or empty, propose two physically grounded fixes and predict their effect (Section 7.4).
  5. From $E_\text{br}$ [VERIFY@PUB], compute the maximum safe placement height (Section 7.4).
  6. In the twin, run SA-2/SA-3 and compare the observed window and placement limit to your hand calculations.
  7. Write three verifiable requirements (one each for grip-force regulation, placement height, and size accommodation) and a one-paragraph specification of the twin's fruit-contact model (DTA-1).
- **Data collection.** Mass/size tables and distributions; $\mu$ estimate; window bounds; placement-height limit; twin comparison.
- **Analysis.** Compare hand-derived and twin-observed windows; identify which lever most widens the window for your fruit; quantify the fraction of the distribution that falls outside the window and relate it to SR-P-01/02.
- **Discussion.** Why does compliance help more than raw force? What did designing to a percentile change versus using the mean? Which requirement most constrains M9?
- **Deliverables.** A 4 to 6 page report with distributions, the window derivation and feasibility verdict, the placement-height limit, three requirements, and the twin-model specification.
- **Rubric (100 pts).** Characterization & distributions (18); contact-pressure & anti-bruise bound (18); friction & anti-slip bound (14); window feasibility & fixes (20); placement-height limit (10); requirements & twin-model spec (15); communication (5). *Graduate band adds:* an L3 derivation of the Hertzian result and a sensitivity analysis of the window to $E^\ast$ and $\mu$, with one cited source.
- **Expected results.** A grip-force window that is feasible but not wide for a rigid pad and clearly wider for a compliant one; a maximum placement height on the order of a few centimetres for a hard drop [VERIFY@PUB], justifying controlled lowering; correct identification of compliance as the dominant lever and of the high-mass tail as the binding slip case.

---

## 25. Homework

Tiered: all students do 1 to 4; graduate students add 5 to 6. (Solutions in the instructor set.)

1. **Mass & payload.** Given three fruit with measured semi-axes and a density, estimate their masses; identify the payload the structure must carry at the 95th percentile of a supplied distribution.
2. **Contact pressure & anti-bruise bound.** For a given $R_\text{eff}$, $E^\ast$, and $p_\text{br}$, compute $F_\text{bruise}$; then recompute with a pad half as stiff and report the percentage change in the window's upper bound.
3. **Anti-slip bound & window.** For a high-percentile mass, $\mu$, dynamic acceleration, and safety factor, compute $F_\text{slip}$; combine with problem 2 to state the window and whether it is feasible.
4. **Placement height.** From an impact bruise-energy threshold, derive the maximum safe drop height for the heaviest design fruit; comment on the mission implication.
5. **(Grad) Empty-window design.** Construct a (realistic) parameter set for which the window is empty. Then, changing only physically justifiable levers, reopen it, and quantify each lever's contribution. Identify which lever fluid power provides.
6. **(Grad) Distribution & residual risk.** Given joint variability in mass and $p_\text{br}$, estimate the fraction of fruit outside the window for a fixed-force vs. a regulated-force gripper; relate the difference to SR-P-02 and to DD-7.

---

## 26. Quiz

Auto-gradable for the existing HTML quiz widget (keys in the instructor set).

1. **(MC)** Bruising is most directly caused by exceeding a limit on: (a) total grasp force; (b) peak contact pressure; (c) grip duration; (d) fruit mass. **[b]**
2. **(MC)** For the same holding force, a more compliant (softer) pad produces: (a) higher peak pressure; (b) lower peak pressure; (c) unchanged peak pressure; (d) higher only if wet. **[b]**
3. **(MC)** The grip-force window is bounded below by ___ and above by ___: (a) bruise / slip; (b) slip / bruise; (c) mass / friction; (d) cost / speed. **[b]**
4. **(MC)** Designing gripper stroke to the fruit *size distribution* rather than the mean primarily protects against: (a) bruising the average fruit; (b) failing on the large/small tails of the crop; (c) slower cycle time; (d) sensor noise. **[b]**
5. **(Short)** State the feasibility condition for the grip-force window and what an empty window means physically. **[$F_\text{slip}\le F_\text{bruise}$; empty => no force both holds and spares the fruit, the design must change (compliance, $\mu$, cradle).]**
6. **(Calc)** $m=7$ kg, $\mu=0.6$, $a_\text{dyn}=2$ m/s², two pads, safety factor 1.5. Compute $F_\text{min}$. **[$F_\text{slip}=7(9.81+2)/(2\cdot0.6)\approx68.9$ N; $F_\text{min}=1.5\times\approx103$ N.]**
7. **(Calc)** If $F_\text{bruise}\propto (E^\ast)^{-2}$, halving $E^\ast$ multiplies the anti-bruise bound by: **[4×.]**
8. **(Design)** Which single physical change most directly widens the window from the top, and which fluid-power property provides it? **[Lower contact stiffness $E^\ast$ / greater conformance; fluid-backed compliance.]**
9. **(Critical thinking)** Why is ripeness treated as multi-cue and probabilistic rather than a single color threshold? **[No single cue is reliable across maturity and field/lighting variability; fusion of cues is needed, motivates M4 to M5.]**
10. **(Critical thinking)** Why does the mission lower fruit into the bin instead of dropping it? **[Impact energy scales with drop height; beyond a small height it exceeds the bruise-energy threshold, DD-8/SR-P-07.]**

---

## 27. Challenge Problems

- **CP-M2-A, The joint feasible region.** Combine the M1 cycle-time window with the M2 grip-force window and the fruit size distribution to define the *joint* feasible design region for {drive speed, grip force, gripper stroke}. Identify the binding constraint and the fruit percentile at which the region first closes. (Bridges M1<->M2; seeds capstone.)
- **CP-M2-B, Compliance vs. control.** For a fruit whose $p_\text{br}$ varies widely with unknown maturity, compare two strategies for staying inside the window: maximizing passive compliance vs. tightening closed-loop force control. Under what variability does each win? What does the combination buy? (Sets up M7/M9.)
- **CP-M2-C, Specify a validated twin.** Write the specification for a fruit-contact/damage twin model good enough to *certify* SR-P-06, including the bench and drop experiments required to validate it and the acceptance criteria for twin-vs-hardware agreement. (Engages Doc G and CR-03 directly.)

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (physics and the window) are the core (~2 h). The trade study (Section 11) and simulation activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M2 is a separate 2 to 3 h session; a real-fruit version is memorable if logistics allow, but the dataset version is fully sufficient.
- **Common misconceptions to pre-empt.** (1) "Grip harder to be safe", the window has *two* bounds; harder can bruise. (2) Confusing force with pressure, stress the $F$-vs-$p_\text{max}$ distinction; it is the crux. (3) Designing to the average fruit, force the percentile mindset. (4) Believing the current twin can already test handling, DTA-2/CP-M2-C exist to expose the contact-fidelity gap (CR-03) and make it a deliverable.
- **Where to push graduate students.** The L3 Hertzian derivation, the empty-window reopening exercise (HW5), and the validated-twin specification (CP-M2-C).
- **Safety & food handling.** Do not prescribe destructive bruise testing in class; take $p_\text{br}$/$E_\text{br}$ from provided data or literature. Emphasize lifting ergonomics for the real payload.
- **Assessment emphasis.** Reward the *window reasoning* and the compliance argument over rote plug-in; a student who can diagnose and reopen an empty window has met the module's core intent. [->Doc I rubric bands.]
- **Thread to keep visible.** Close by naming the forward hand-offs: this window is the requirement M9 must satisfy, the payload M8 must carry, the ripeness M4 must learn, and the model M13 must simulate.

---

## 29. Research Frontiers

- **Landmark grounding.** Postharvest and agricultural-engineering literature on the mechanical properties and bruising of fruits and vegetables; classical contact mechanics (Hertz; Johnson's *Contact Mechanics*) for the pressure-force relationships; the soft-robotics-for-agriculture literature on compliant produce handling. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Data-driven and finite-element bruise-prediction models coupling contact mechanics to tissue damage; nondestructive ripeness sensing (hyperspectral/NIR, acoustic resonance) with learned classifiers; soft and variable-stiffness grippers with embedded tactile/pressure sensing for delicate produce; synthetic-data pipelines that model produce and canopy variability for perception training.
- **Open problems.** Predictive, transferable bruise models that hold across cultivars and maturities; standardized whole-fruit handling-damage metrics; robust ripeness estimation under field lighting and occlusion; principled coupling of passive compliance and active force control for wide-variability payloads.
- **Suggested thesis directions.** (1) A contact-to-cell-damage model that outputs a $p_\text{br}$ distribution usable directly as a grasp-controller bound. (2) A variable-stiffness fluid gripper that adapts $E^\ast$ per fruit to keep the window open across the crop distribution. (3) A multi-cue ripeness estimator with calibrated uncertainty feeding a risk-aware harvest decision.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries live in `references/bibliography.md` [->Doc H citation standard].*

- Agricultural / postharvest engineering references on the mechanical properties and bruising of produce, damage modes, thresholds, ripeness-property relationships.
- A standard contact-mechanics reference (e.g., Johnson, *Contact Mechanics*), Hertzian contact, peak-pressure relations (Section 7.2).
- Soft-robotics and agricultural-gripping review articles, compliant handling of delicate, variable produce.
- Nondestructive ripeness/quality-sensing literature (optical, spectral/NIR, acoustic), the Section 6.4 cue basis; hand-off to M3/M4.
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, **Module 1 Rev 1.0**, and (forthcoming) Doc B (System Design Specification), Doc G (Simulation & Digital-Twin Architecture).

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module is anchored entirely to the payload and field, and it produces a single, memorable, quantitative result, the grip-force window $F_\text{slip}\le F_\text{grip}\le F_\text{bruise}$, that (a) parallels Module 1's cycle-time window, preserving the course's systems-thinking spine and writing style, (b) converts the vague "don't damage the fruit" requirement into verifiable sub-requirements (SR-P-05...08, SR-C-04), and (c) makes the Fluid-Powered Physical AI thesis *quantitative*: compliance is shown, with the $F_\text{bruise}\propto(E^\ast)^{-2}$ relation, to open the window. All 30 template sections are present; the tiered contract is honored; simulation-first is realized concretely by specifying the twin's fruit-contact model (a direct, honest engagement with Foundation conflict CR-03). Consistency with Module 1 and the approved architecture is maintained throughout (fluid power/compliance/force-control threads Introduced here exactly as the Phase-1 knowledge matrix requires; fruit contact & damage mechanics Mastered).

**Known weaknesses / items for your review.**
1. **Threshold values are [VERIFY@PUB].** $p_\text{br}$, $E_\text{br}$, density, and size/mass percentiles are cultivar- and maturity-dependent and are flagged, not asserted; they will be ratified in Doc B against real characterization data. The physics and method are exact; the numbers are placeholders.
2. **The Hertzian model is an idealization** for a viscoelastic, turgor-pressurized biological shell; the module says so and the grad extension examines where it breaks down, but the quantitative bounds should be validated experimentally (CP-M2-C) before they gate hardware.
3. **The fruit-contact twin model is specified, not built.** DTA-1 produces the specification; implementation depends on Doc G and is on the same critical path flagged for M9.
4. **Ripeness is cataloged, not solved.** The module scopes the perception problem (SR-F-03) but correctly defers modality and learning design to M3 to M5.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 3 close chiefly by authoring Doc B (thresholds) and Doc G (the validated twin contact model), the two documents this module, like Module 1, is sequenced ahead of.

**END OF MODULE 2, STOP. Awaiting your review before freezing Module 2 or proceeding to Module 3.**
