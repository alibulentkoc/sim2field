# Module 1: The Harvesting Problem & Systems Engineering

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M1, **Part I, Frame the System**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 4 to 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation + Digital Twin, the twin is the *system-of-interest* under observation
**Revision:** **1.1, frozen baseline (approved).** Rev 1.1 adds the Core Engineering Concept convention (introduces **CEC-01**, the Signal-to-Action Spine); no engineering content, equations, requirements, labs, or technical discussion changed. Controlled changes only.

> **Authoring note (governance).** Per the approved Phase-1 production order, the P0 documents (Doc B *System Design Specification*, Doc I *Curriculum Standards*, Doc J *Visual & Media Standards*) normally precede module authoring. This module is authored ahead of them by direction; it is the lowest-risk module to do so because it *establishes* the requirement baseline the later documents formalize. Every place a P0 document will later hold authority is tagged **[->Doc B]**, **[->Doc I]**, or **[->Doc H]**. Perishable or field-dependent values are tagged **[VERIFY@PUB]**.

---

## Why This Course Exists

Of all the tasks a farm still asks of human hands, the selective harvest of heavy fruit is among the last that machines have failed to take over, and understanding that failure is the beginning of this course.

**Selective harvesting is one of the hardest problems in agricultural robotics** because it refuses every shortcut that made earlier farm machines succeed. A combine does not *find* a grain of wheat; it processes the field as a medium. A watermelon harvester must locate one specific object, decide whether it is ready, reach it without crushing it, and place it unbruised, thousands of times a day, in dust and glare, on uneven ground, with no one to help it when it hesitates. Every one of those verbs, *find, decide, reach, place*, is an unsolved-in-isolation research problem, and they must all succeed together, in seconds, or the machine is worthless. This is not a problem you can buy your way out of with a better camera or a stronger arm. It is a problem you must *engineer*.

**Watermelons make an exceptional engineering case study** precisely because they concentrate the difficulty. They are heavy enough (5 to 10 kg) to demand real structural force, yet delicate enough that the same force, misapplied, ruins the product. They are green on green, camouflaged against their own canopy in changing outdoor light. They lie on the soil, individually placed, often hidden. A student who can engineer a machine to harvest a watermelon has confronted, in one concrete system, the full stack of modern robotics: perception under camouflage, 3-D localization under occlusion, learned decision-making, compliant manipulation of a fragile heavy object, real-time control with no cloud to lean on, and the systems discipline that binds it all. Master this one machine and the transferable lessons reach far beyond a single crop.

**The stakes are not academic.** Agricultural labor for hand-harvested crops is growing scarcer and costlier across much of the world, the work is physically punishing, and the people who do it are ageing out faster than they are replaced. At the same time, agriculture is under pressure to become more sustainable, to waste less, to use inputs more precisely, to remain economically viable for the small and mid-sized growers who cannot absorb ever-rising labor costs. A machine that can harvest selectively, affordably, and gently is not a convenience; it is part of how a food system stays resilient. That is the human problem behind the engineering one.

**Why perception alone is insufficient:** a machine that can see every ripe melon perfectly has accomplished nothing if it cannot reach or safely grasp them. **Why manipulation alone is insufficient:** the most elegant compliant gripper is useless if perception never tells it where, or whether, to close. The two are worthless apart, and even together they fail without **complete systems engineering**, the discipline that turns competing subsystems into one machine whose timing, error budgets, interfaces, and failure modes actually close. The hard failures in this field, as you will see, almost never live inside a single component; they live in the *interactions* between components, which is exactly the territory systems engineering exists to govern.

**Why Fluid-Powered Physical AI is central.** A watermelon is heavy and fragile at once, so handling it is a problem of *force control and compliance*, not force maximization. Rigid, stiff actuators fight this reality; fluid power embraces it, the working fluid yields, the grip is naturally back-drivable, and pressure becomes a direct proxy for the force a bruise-prone rind can tolerate. Marry that intrinsic compliance to an AI policy that learns how much force each fruit needs, and you have a machine that is gentle *by design* rather than by luck. This union, physical compliance from fluid power, adaptive intelligence from AI, validated first in simulation, is what we call **Fluid-Powered Physical AI**, and it is why this curriculum treats fluid power as a defining technology rather than one actuator among many.

**Why SIM2FIELD was created.** Most robotics education teaches perception, control, and machine learning as separate abstractions and leaves the hardest part, making them work together in the real world, as an exercise. SIM2FIELD was built to do the opposite: to teach engineering the way it is actually practiced, through the complete design of one real machine, with a working digital twin you can drive, instrument, and extend from the first day. Every concept enters because the robot needs it; nothing is taught for its own sake.

**By the end, you will have built something real.** You will not merely have read about harvesting robots, you will have designed, simulated, validated, and *defended* one. That is the promise of this course, and the next page states it plainly.

---

## By the End of This Course You Will Be Able To...

You will leave this curriculum able to stand in front of an engineering review board and defend a robotic harvesting system you designed, with numbers, not adjectives. Concretely, you will be able to:

- **Design robotic harvesting systems**, frame the problem, decompose it by function, and architect a complete machine against real agronomic and operational constraints.
- **Apply systems engineering**, write verifiable requirements, allocate time and error budgets, run trade studies, and manage the interfaces where systems actually fail.
- **Develop perception pipelines**, detect and localize camouflaged fruit under occlusion, recover 3-D pose from stereo geometry, and fuse sensors into a reliable target.
- **Deploy AI at the edge**, optimize and containerize models to run on-robot under hard latency, power, and thermal budgets, with no cloud in the control loop.
- **Integrate hardware and software**, compose subsystems with ROS 2 across a real-time boundary, governed by an independent safety monitor.
- **Use Digital Twins**, develop every subsystem simulation-first, through the Sim -> Twin -> SIL -> HIL -> Prototype -> Field -> Deployment lifecycle, and use the twin as your evidence source.
- **Design Fluid-Powered Physical AI systems**, engineer compliant, fluid-powered grasping with AI-assisted force regulation for a heavy, bruise-prone payload.
- **Defend engineering decisions with quantitative evidence**, justify every choice with a budget, a trade study, or twin-and-field data, and know, honestly, where your design is weakest.

Everything between here and the capstone builds toward that capability, one subsystem at a time, on one machine.

---

## 1. Module Overview

This module establishes three things the rest of the curriculum depends on: **the machine** (what SIM2FIELD is and does), **the problem** (why autonomous heavy-fruit harvest is genuinely hard), and **the method** (systems engineering, the discipline that turns a vague goal into a machine whose every subsystem exists for a traceable reason).

We do not begin with a gripper or a neural network. We begin the way a competent engineering organization begins: by asking what the system must accomplish, decomposing that into functions, writing requirements that are actually verifiable, and allocating budgets, time, error, mass, power, before any component is chosen. By the end, you will have used the live digital twin not as a demo but as the *system-of-interest*: you will map its subsystems, measure its cycle time, and discover, through a budget you derive yourself, a hard design tension that motivates decisions made in later modules.

The organizing idea for the whole course is introduced here: **follow the signal.** A watermelon harvester is, at its core, a machine that turns a camera frame into a grasped fruit. Every subsequent module advances one stage of that signal-to-action path, and every stage exists because the systems analysis in this module says it must.

---

## 2. Learning Objectives

On completing this module, a student will be able to:

- **LO-M1.1** Explain, in systems terms, why autonomous watermelon harvesting resists the mechanization strategies that succeeded for grain and other bulk crops., *Bloom: Understand*
- **LO-M1.2** Decompose the harvester by *function* (not component) into the signal-to-action spine, and justify each function against an operational or agronomic need., *Bloom: Analyze (with Evaluate)*
- **LO-M1.3** Write measurable, verifiable system requirements of the correct type (functional, performance, constraint, interface) and attach a verification method to each., *Bloom: Create (with Apply)*
- **LO-M1.4** Derive and allocate engineering budgets, cycle-time and error budgets in particular, and interpret what a budget reveals about feasibility., *Bloom: Apply (with Analyze)*
- **LO-M1.5** Construct a weighted trade study and defend an architecture selection quantitatively., *Bloom: Evaluate (with Create)*
- **LO-M1.6** Map the system-of-interest onto the digital twin and use the twin to measure a system-level property (cycle time)., *Bloom: Apply*

These map to course objectives **LO1** (primary), **LO6/LO7/LO8** (reinforcing), and ABET **SO1, SO2**. [->Doc I confirms the mapping convention.]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Take a stakeholder statement of need and produce a small set of verifiable requirements with verification methods and traceability IDs., *Bloom: Create*
2. Draw the functional decomposition of a field robot and explain what each function hands to the next., *Bloom: Analyze (with Understand)*
3. Build a cycle-time budget from a throughput target and read off whether a single-arm architecture can keep pace., *Bloom: Apply (with Evaluate)*
4. Combine independent error sources by root-sum-square and allocate an error budget against a capture tolerance., *Bloom: Apply*
5. Populate and defend a weighted decision matrix for a system architecture choice., *Bloom: Evaluate*
6. Use the digital twin to observe and measure a system-level behavior and relate it to the requirements., *Bloom: Apply (with Analyze)*

---

## 4. Engineering Motivation

Mechanized grain harvest is a solved problem: a combine treats the crop as a bulk medium, cut, thresh, separate, clean, with no need to locate, identify, or delicately handle an individual object. That strategy fails completely for watermelon, and understanding *why* is the entry point to the whole system.

A watermelon presents four simultaneous difficulties that no single component solves:

1. **It must be individually found.** Fruit are discrete, irregularly spaced, and lie on the soil, frequently occluded by their own canopy. The machine cannot process the field as a medium; it must perceive each target.
2. **It is camouflaged.** A mature watermelon is green on green, in variable outdoor lighting. Detection is a genuine perception problem, not a color threshold.
3. **It is heavy and delicate at once.** At 5 to 10 kg [VERIFY@PUB, cultivar-dependent], the fruit demands real structural force to lift, yet its rind bruises under excessive or poorly distributed contact pressure. Handling is a force-*control* problem, not a force-*maximization* problem, the seed of this course's fluid-powered compliant-gripping thesis.
4. **It is embedded in a variable, unstructured field.** Dust, uneven ground, changing light, vines that wrap mechanisms, and no reliable network connection. The environment is adversarial to both mechanism and computer.

The economic pressure is equally real: harvest labor for heavy hand-picked crops is increasingly scarce and costly [VERIFY@PUB, regional labor data; quantified in M16], and the work is physically punishing. There is a genuine, unmet need.

The systems lesson is the punchline: **none of these difficulties is solvable in isolation.** A brilliant gripper cannot help if perception never finds the fruit; perfect perception is wasted if the mechanism cannot reach or the machine cannot keep pace with its own driving speed. The harvester is an *emergent* system, it succeeds only when perception, decision, manipulation, mobility, and integration are co-designed against shared constraints. That is precisely why the discipline of this module, systems engineering, is not administrative overhead but the core engineering activity.

---

## Engineering Failure Cases

Harvesting robots rarely fail for exotic reasons. They fail in a small number of recurring ways, and each failure class is a preview of a later module, the curriculum is, in one sense, an organized response to this list. Understanding *how* these machines break is the fastest route to understanding why each subsystem is engineered the way it is.

- **Perception failures.** The machine cannot find the fruit, or finds fruit that is not there. A green melon vanishes into a green canopy; harsh sunlight and shadow defeat a detector tuned indoors; a partially occluded fruit is missed entirely. Missed fruit is lost yield; false detections waste cycles. *Motivates M4 (vision & deep learning)*, detection under camouflage and lighting, and the choice of metrics (recall to protect yield), *and M2* (why the fruit is hard to see in the first place).

- **Localization failures.** The fruit is detected but placed wrongly in 3-D space. Stereo depth degrades with distance; calibration drifts; the target's estimated position is stale by the time the gripper arrives. A grasp aimed at a phantom position bruises or misses. *Motivates M5 (3-D localization, fusion & estimation)* and the **error budget** you build in this module (Section 7.2), the discipline that tells each subsystem how accurate it must be.

- **Manipulation failures.** The mechanism reaches the right place but fails at contact, it drops the fruit, crushes the rind, or cannot reach because the arm hit a singularity or a keep-out. Too little force and the fruit slips; too much and it bruises. *Motivates M8 (kinematics, workspace, singularities)* and *M9 (fluid-powered compliant gripping & AI force control)*, the compliant, force-regulated grasp that a heavy, fragile payload demands.

- **Integration failures.** Every subsystem works alone; the machine fails together. A perception frame arrives too late for the control loop; two processes contend for the same bus; a timing assumption made in one subsystem is violated by another. These are the hardest failures to find because they live *between* components. *Motivates M11 (ROS 2 & real-time integration) and M13 (system integration & bring-up)*, and the entire systems-engineering method of this module.

- **Environmental failures.** The field defeats the machine physically. Dust fouls optics and mechanisms; vines wrap a moving part; heat throttles the compute; condensation or vibration degrades a sensor. A demo-day machine dies in a real row. *Motivates M3 (sensor physics & field robustness), M12 (power, thermal, EMI), M14 (V&V under field conditions), and M15 (safety)*, designing for the world as it is, not the lab.

- **Systems-engineering failures.** The deepest class: the machine was built to the wrong requirements, or to requirements that never closed. The cycle-time budget was never checked and the arm cannot keep pace with the vehicle; error sources were never allocated and no subsystem knew its tolerance; interfaces were never controlled and integration surprised everyone. Nothing "broke", the system was never coherent. *Motivates this module directly*, and the requirement, budget, and trade-study discipline that governs all the others.

Read down that list and the course reveals itself: each module exists because one of these failure classes must be engineered away, and the systems method exists to make sure the fixes actually compose into one working machine.

> ### Industry Perspective
>
> Commercial agricultural-robotics developers and academic labs attack the harvesting problem from different ends, and a good engineer learns from both.
>
> **How industry approaches it.** Companies building selective-harvest machines tend to organize around a single, unforgiving metric set, success rate, damage rate, and cost per unit harvested, measured over long hours in real fields. They favor robustness and serviceability over novelty: a slightly less clever design that survives dust, runs a full shift, and can be repaired by a technician usually beats a more sophisticated one that only works in a demo. Field reliability, uptime, and total cost of ownership dominate their decisions, and they iterate against seasons, not sprints.
>
> **How industrial development differs from academic research.** Academic work rightly pushes the frontier, new perception models, new manipulation strategies, new learning methods, and is measured by novelty and rigor on benchmarks. Industry is measured by whether the machine pays for itself in a grower's field. The gap between "works in a paper" and "works for a season" is exactly the integration, reliability, safety, and cost engineering that research often treats as someone else's job. Neither perspective is complete alone: research without deployment discipline produces demos; deployment without research stagnates.
>
> **How SIM2FIELD bridges both.** This platform deliberately teaches to the seam. It carries research-grade content, edge AI, learned grasping, digital twins, fluid-powered compliance, while insisting on the industrial disciplines that make such content real: measurable requirements, budgets that must close, staged verification, field-honest failure analysis, and a costed bill of materials. You will learn to reach for the frontier *and* to defend, with numbers, why your design will still be running at the end of the row. That dual habit, ambitious in method, ruthless about evidence, is the engineer this course intends to produce.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** basic linear algebra (vectors, matrices); ability to read a datasheet; comfort with elementary probability and units. No prior robotics, control, or ML is assumed, each is built from a defined baseline in later modules.

**Introduced here, used throughout:** the vocabulary of systems engineering, *requirement, function, interface, budget, margin, verification, validation, traceability, concept of operations (ConOps)*. Precise definitions appear in Section 6 and are consolidated in the course glossary. [->Doc H will hold the controlled definitions and notation.]

**Where this sits in the dependency graph:** M1 has no hard prerequisites (it is the entry node) and hands the requirement baseline and functional decomposition to *every* downstream module. Nothing later may introduce a system-level requirement that contradicts the baseline established here without a controlled change [->Doc B].

---

## 6. Theory

### 6.1 Systems thinking and emergence
A *system* is a set of interacting elements whose collective behavior is not present in any element alone. The harvester *harvests*; no subsystem does. This is **emergence**, and it has a hard engineering consequence: correctness cannot be established component-by-component. A perception module verified in isolation and a gripper verified in isolation can still yield a machine that bruises fruit, because the failure lives in their *interaction* (e.g., localization latency that lets the fruit's apparent position stale before the grasp closes). Systems engineering exists to manage exactly the properties that live between components.

### 6.2 The systems-engineering lifecycle
We adopt the classical decomposition-and-integration lifecycle (often drawn as a "V"): needs -> requirements -> functional design -> subsystem design -> implementation -> subsystem verification -> system integration -> system verification -> validation. The left side *decomposes* intent into ever-more-specific specifications; the right side *integrates and proves* the built system against those specifications. Two distinctions matter immediately:

- **Verification vs. validation.** *Verification* asks "did we build the system right?" (does it meet its requirements?). *Validation* asks "did we build the right system?" (does it meet the stakeholder's actual need?). A harvester can pass every requirement (verified) and still be commercially useless (invalid) if the requirements captured the wrong need. Both are engineered, not assumed. [Depth in M14.]
- **Function vs. form.** *Function* is what the system must do ("localize the fruit in the robot frame"); *form* is how it is realized ("an OAK-D stereo camera feeding a CNN"). Requirements and decomposition are written in the language of function so that form remains a design decision to be traded, not an assumption baked in prematurely.

### 6.3 Concept of Operations (ConOps)
Before requirements, a system needs a ConOps, a narrative of how the machine is used in the world. For SIM2FIELD (abbreviated; full ConOps is a Doc B deliverable [->Doc B]): *A drive-over rover straddles a single planted bed and travels down the row at walking pace. An onboard perception system detects and localizes mature fruit ahead. As the rover advances, each target is brought to a fixed pick station within the wheelbase, where a rail-mounted manipulator grasps it with a compliant, fluid-powered end-effector and transfers it to a side-towed collection trailer. All perception and control run on-robot; there is no network dependency in the control loop. A human supervises, does not tele-operate.*

Every later requirement, budget, and subsystem is traceable to a sentence in that narrative. That is the point of a ConOps: it is the root of the traceability tree.

### 6.4 Functional decomposition: the signal-to-action spine
Decomposing the ConOps by function yields the backbone of the entire course:

```
   PERCEIVE  ->  DECIDE  ->  ACT  ->  (all bound by) INTEGRATE  ->  DEPLOY
   --------     ------     ---                     ---------     ------
   detect &     plan the   position, grasp,        power, compute, safety,
   localize     pick &     lift, transfer,         real-time comms, the
   the fruit    the grasp  release the fruit        machine as one system
```

Each function is a *verb the system must perform*, each hands a defined product to the next (perception hands a 3-D target; decision hands a grasp command; action hands a placed fruit), and each maps to a later module. This decomposition is not arbitrary, it follows the **flow of information through the machine**, which is the most stable way to partition a robot because the interfaces (what each stage produces) are the least likely thing to change even as components do.

> ### Core Engineering Concept, CEC-01: The Systems Engineering Signal-to-Action Spine
> **The harvester is one machine that turns a camera frame into a grasped fruit. It decomposes by *function* into Perceive -> Decide -> Act, bound together by Integrate -> Deploy. Every module of this course advances exactly one stage of this spine, and every subsystem exists because the spine requires it.**
>
> *Owned and introduced here (Module 1, Section 6.4). This is a recurring conceptual anchor: each later module opens by locating itself on the spine. See the [Core Engineering Concepts Register](curriculum/_core-concepts.md) for where it is reinforced and applied.*

### 6.5 Requirements
A requirement is a single, verifiable statement of something the system must do or a constraint it must satisfy. Four types are used throughout:

- **Functional**, a behavior the system must exhibit ("shall detect mature fruit").
- **Performance**, how well ("shall achieve success rate ≥ target").
- **Constraint**, an imposed limit ("shall not require network connectivity in the control loop").
- **Interface**, a boundary condition ("shall mount to the Amiga platform's rail pattern").

A well-formed requirement is **verifiable, unambiguous, necessary, and traceable**. "The system shall be fast" is none of these; "the system shall complete one pick-place cycle in ≤ T seconds, verified by timed field trials" is all four. The discipline of rewriting needs into verifiable requirements is a graded skill in this module (Section 25).

### 6.6 Budgets, margins, and error allocation
A **budget** partitions a system-level quantity across contributors. Three budgets recur across the course: **time** (cycle-time), **error** (placement/localization), and **resource** (mass/power [depth in M12]). A **margin** is the reserve between capability and requirement:

$$ \text{margin} = \frac{\text{capability} - \text{requirement}}{\text{requirement}} $$

Positive margin is headroom; negative margin means the design cannot meet the requirement as configured. Budgets are computed *before* component selection because they tell you what performance each subsystem must deliver, and, as Section 7 shows, sometimes reveal that the architecture itself must change. The formal math of both budgets is developed in Section 7.

---

## 7. Mathematics

Rigor tier for M1: **L1 to L2** (conceptual to applied). Two budgets are developed quantitatively; both recur throughout the course.

### 7.1 The cycle-time budget (throughput feasibility)
The drive-over architecture advances continuously; fruit "arrive" at the pick station at an interval set by their spacing and the drive speed. Let

- $d$ = along-row spacing between fruit [m] [VERIFY@PUB, field/cultivar dependent, illustratively $d \approx 1.2$ m],
- $v$ = drive speed [m/s] (adjustable; walking pace $\approx 0.4$ m/s),
- $T_\text{arrival} = d/v$ = interval between successive fruit arriving at the station.

The **pick cycle** decomposes into sequential functions:
$$ T_\text{cycle} = t_\text{detect} + t_\text{plan} + t_\text{align} + t_\text{grasp} + t_\text{lift} + t_\text{transfer} + t_\text{place} + t_\text{return} $$

Illustrative allocation (seconds; refined against the twin in the lab):

| Term | $t_\text{detect}$ | $t_\text{plan}$ | $t_\text{align}$ | $t_\text{grasp}$ | $t_\text{lift}$ | $t_\text{transfer}$ | $t_\text{place}$ | $t_\text{return}$ | **Σ** |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| value | 0.3 | 0.2 | 1.0 | 1.0 | 0.8 | 1.5 | 0.8 | 1.0 | **6.6** |

**The feasibility condition for a single end-effector that never stops the vehicle** is
$$ T_\text{cycle} \le T_\text{arrival} = d/v \quad\Longrightarrow\quad v \le \frac{d}{T_\text{cycle}}. $$

With the illustrative numbers, $v \le 1.2/6.6 \approx 0.18$ m/s. **This is the module's central teaching result:** the budget shows that a single arm forces the rover *below* comfortable walking pace, or the vehicle must periodically pause, or the architecture must change (multiple end-effectors, buffering, or a faster transfer). The budget did not describe a design, it *constrained* one, and exposed a tension that Modules 8 to 10 (mechanism, actuation, mobility) and the capstone must resolve. This is exactly what systems budgets are for.

### 7.2 The placement error budget (grasp feasibility)
The grasp succeeds only if the end-effector arrives within the gripper's **capture tolerance** $c$ (half-width over which the compliant paddles can still corral the fruit; illustratively $c \approx \pm 30$ mm). Independent error sources combine by **root-sum-square** (valid for independent, zero-mean sources):
$$ \sigma_\text{total} = \sqrt{\sigma_\text{loc}^2 + \sigma_\text{he}^2 + \sigma_\text{mech}^2 + \sigma_\text{dyn}^2} $$
where $\sigma_\text{loc}$ = perception/localization error, $\sigma_\text{he}$ = hand-eye calibration error, $\sigma_\text{mech}$ = mechanism positioning error, $\sigma_\text{dyn}$ = dynamic/settling error. A common allocation rule requires $3\sigma_\text{total} \le c$ (≈99.7% capture). Given a capture tolerance, this **allocates** a maximum error to each subsystem, e.g., it tells the perception team (M4 to M5) how accurate localization must be, and the mechanism team (M8) how repeatable positioning must be. Error allocation is how a system-level requirement becomes a set of subsystem requirements.

### 7.3 Margin and set-based reasoning
Applying Section 6.6's margin definition to each budget yields the reserve carried into design. More generally, the feasible design space is the **intersection** of all constraint sets (cycle-time, error, mass, power, cost); a design is viable only if that intersection is non-empty. Early in a program the honest engineering question is often not "what is optimal?" but "is the feasible set even non-empty?", a set-based mindset this course returns to at every integration checkpoint.

---

## 8. Engineering Principles

Distilled, reusable principles this module establishes:

1. **Decompose by function, then choose form.** Partition by the flow of information/action; defer component choice so it can be traded.
2. **Every requirement is verifiable or it is not a requirement.** Attach a verification method at the moment of writing.
3. **Budget before you build.** Time, error, and resource budgets precede component selection and can invalidate an architecture on paper, cheaply.
4. **Interfaces are where systems fail.** Name and control every product handed between functions.
5. **Carry explicit margin.** Reserve is a design decision, not an accident.
6. **Simulation-first.** The twin is the first place a requirement is tested; a claim without twin (and later field) evidence is provisional.
7. **Traceability is the spine.** Every requirement traces up to a ConOps need and down to a verification, no orphans.

---

## 9. System Requirements

A top-level baseline is established here and will be formalized, versioned, and given full traceability in the System Design Specification [->Doc B]. IDs follow `SR-<type>-<n>` (F functional, P performance, C constraint, I interface). Illustrative targets are tagged [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-F-01 | Functional | The system shall detect, localize, grasp, and place mature watermelons from a planted bed into a collection container autonomously during a harvest pass. | Field demonstration |
| SR-F-02 | Functional | The system shall manage canopy occlusion sufficiently to perceive fruit meeting the detection requirement. | Test |
| SR-P-01 | Performance | The system shall achieve harvest success rate ≥ [VERIFY@PUB] % on mature fruit. | Field trial + statistics (M14) |
| SR-P-02 | Performance | The system shall keep fruit-damage rate ≤ [VERIFY@PUB] %. | Field trial + inspection |
| SR-P-03 | Performance | The system shall sustain a pick cycle ≤ $T_\text{cycle}$ consistent with the throughput target (Section 7.1). | Timed trial |
| SR-P-04 | Performance | Placement error at grasp shall satisfy $3\sigma_\text{total} \le c$ (Section 7.2). | Measurement + analysis |
| SR-C-01 | Constraint | The system shall not depend on network connectivity within the real-time control loop. | Design review + test |
| SR-C-02 | Constraint | The system shall operate under field conditions (dust, temperature, variable outdoor lighting) [ranges -> Doc B]. | Environmental test |
| SR-C-03 | Constraint | Actuation shall follow the approved hybrid architecture: electric positioning + fluid-powered compliant gripping. | Design review |
| SR-I-01 | Interface | The system shall mechanically and electrically integrate with the farm-ng Amiga platform. | Interface test |
| SR-I-02 | Interface | Perception shall deliver a 3-D fruit pose in the robot frame to the decision function. | Interface test (M5/M7) |

Each row traces to a ConOps sentence (Section 6.3) and forward to the subsystem module that owns it. Orphan requirements (no parent need or no verification) are defects [->Doc B enforces traceability].

---

## 10. Design Decisions

The system-level decisions that shape everything downstream. Each is stated with its rationale and the requirement it serves; the ones marked * are examined as trade studies in Section 11.

- **DD-1 * Drive-over straddle architecture.** The rover straddles the bed and works beneath its own frame. *Rationale:* keeps the downward camera sight-line clear of the manipulator and lets the **vehicle supply the fore/aft (x) degree of freedom**, the fruit is driven to the arm rather than the arm reaching fore/aft. Serves SR-F-01, SR-P-03. (This DOF reduction is a recurring theme; mechanism consequences in M8.)
- **DD-2 Mid-frame pick station.** Fruit are grasped at a fixed station inside the wheelbase. *Rationale:* a single, well-characterized pick pose simplifies perception hand-off and mechanism workspace. Serves SR-P-04.
- **DD-3 * Hybrid actuation.** Electric positioning + fluid-powered compliant gripping + AI-assisted grasp-force regulation. *Rationale:* electric axes give precise, maintainable positioning; fluid power gives natural compliance and back-drivability at the one place it matters most, contact with a heavy, bruise-prone fruit. Serves SR-C-03, SR-P-02. (Mastered in M9.)
- **DD-4 Edge-only control loop.** All perception and control run on-robot. *Rationale:* fields lack reliable connectivity; a control loop that depends on a network stalls. Serves SR-C-01. (Mastered in M6.)
- **DD-5 Single-crop focus (watermelon).** *Rationale:* depth over breadth; a fully specified single case teaches more than a shallow multi-crop survey. Pumpkin appears only as a capstone contrast case.

---

## 11. Trade Studies

A trade study makes a decision *defensible* by scoring alternatives against weighted criteria. One full study is presented (architecture); a second is summarized. Weights and scores are illustrative and become a graded skill in Section 25/Section 27. Method: score each alternative 1 to 5 per criterion, multiply by weight, sum; highest weighted total wins, but the *reasoning*, not the arithmetic, is the deliverable.

### 11.1 TS-1: Harvesting architecture
**Alternatives:** (A) **Drive-over straddle** with mid-frame pick; (B) **Side-mounted arm** reaching from a machine beside the bed; (C) **Gantry over bed** with an overhead arm on a portal.

| Criterion (weight) | A: Drive-over | B: Side arm | C: Gantry |
|--------------------|:---:|:---:|:---:|
| Camera-fruit sight line kept clear (0.25) | 5 | 2 | 4 |
| DOF count / mechanism simplicity (0.20) | 5 | 3 | 3 |
| Footprint & field maneuverability (0.15) | 4 | 4 | 2 |
| Payload path / transfer simplicity (0.15) | 4 | 3 | 3 |
| Stability with heavy payload (0.15) | 4 | 2 | 4 |
| Integration with Amiga platform (0.10) | 5 | 3 | 2 |
| **Weighted total** | **4.55** | **2.75** | **3.20** |

**Selected: A (drive-over straddle).** It wins primarily by keeping the perception sight-line clear and by offloading the fore/aft DOF to the vehicle, which cascades into a simpler mechanism (M8). The honest weakness recorded for later scrutiny: the drive-over stance couples mechanism workspace to track width, examined quantitatively in M8 and in the M13 integration study. [Criteria weights are a stakeholder input to be ratified in ->Doc B.]

### 11.2 TS-2: Autonomy level (summary)
**Alternatives:** full autonomy, assisted (human-in-the-loop corrections), tele-operation. **Criteria:** labor economics, field connectivity, safety, technical risk. **Outcome:** *supervised full autonomy*, tele-op is defeated by the same connectivity constraint that drives DD-4, and the labor economics (M16) only close if the machine runs without a dedicated operator per unit. Full study deferred to the capstone as a candidate track.

> **Simulation-first hook.** Both trade studies make claims, "clear sight line," "simpler mechanism," "achievable cycle time", that are *testable in the digital twin now* and in the field later. Section 12, Section 13 turn the twin into the evidence source, closing the loop from decision to measurement without waiting for hardware.

---

## 12. Simulation Activities

The digital twin is used here as the **system-of-interest**, an executable model of the ConOps against which system-level claims are checked before hardware exists (the first stage of the Sim -> Twin -> SIL -> HIL -> Prototype -> Field -> Deployment lifecycle).

**SA-1, Observe the functional decomposition made concrete.** Run a harvest in the twin and watch the mission state machine progress `DRIVE -> STAGE -> ALIGN -> GRAB -> LIFT -> SWING -> LOWER -> RELEASE`. Each transition is one function from Section 6.4 executing. Students annotate which spine stage (perceive/decide/act) each state belongs to. *Outcome:* the abstract decomposition becomes an observed sequence.

**SA-2, Measure the cycle time.** Time a full pick-place cycle in the twin and decompose the elapsed time into the Section 7.1 terms as far as the twin exposes them. Compare the measured $T_\text{cycle}$ to the illustrative 6.6 s allocation and to $T_\text{arrival}=d/v$ at the current drive speed. *Outcome:* students confirm or refute the single-arm feasibility result with their own measurement.

**SA-3, Perturb an architecture parameter.** Vary the drive speed and observe when the machine can no longer keep pace (state machine stalls / fruit missed). *Outcome:* the Section 7.1 inequality $v \le d/T_\text{cycle}$ is experienced, not just derived.

These activities require only the deployed twin; no new fidelity is needed (M1 operates at the twin's existing kinematic/behavioral tier). [Fidelity ladder -> Doc G.]

---

## 13. Digital Twin Activities

Beyond one-off observation, the twin is used as a **measurement instrument** and a **requirements checkpoint**.

**DTA-1, Subsystem mapping overlay.** Students produce a labeled diagram that maps each physical element visible in the twin (rover, rails, manipulator node, gripper, camera, trailer, canopy tools) onto its spine function and its owning module (M2 to M16). *Deliverable feeds:* the lab (Section 24) and the capstone brief CP-0.

**DTA-2, Requirement instrumentation.** For two system requirements from Section 9 (SR-P-03 cycle time, SR-P-04 placement/settling), students identify *what would have to be measured in the twin* to verify them, and *what the twin cannot yet measure* (e.g., fruit-damage rate needs contact fidelity the current twin lacks). *Outcome:* students learn the difference between a requirement that the current simulation tier can verify and one that needs a higher fidelity tier, a direct, honest encounter with the fidelity ladder and with Conflict CR-03 from the Foundation (twin fluid/contact fidelity gap).

**DTA-3, Trade-study evidence.** Using the twin, gather one quantitative data point supporting or challenging the TS-1 claim that the drive-over stance keeps the camera sight-line clear (e.g., observe the onboard camera view during a pick and note whether the manipulator occludes it). *Outcome:* a trade-study assertion is backed by simulation evidence.

---

## 14. Hardware Activities

*(Tiered: specification-level for a systems module; full hardware labs begin at M3.)*

**HA-1, Platform interface familiarization.** Study the farm-ng Amiga platform's published mechanical/electrical interface [VERIFY@PUB, current platform spec] and list the physical and electrical interfaces SR-I-01 implies (mounting pattern, power rails, data/CAN access). *Deliverable:* a one-page interface inventory that seeds the Hardware Architecture [->Doc C].

**HA-2, Requirement-to-hardware reality check.** For SR-C-02 (field environment), enumerate the environmental stresses (dust ingress, temperature, vibration, humidity/condensation) that will later constrain component selection. No hardware is operated; the activity trains the habit of connecting a constraint requirement to physical reality. [Environmental ranges -> Doc B.]

---

## 15. Software Activities

*(Conceptual for M1; ROS 2 depth in M11.)*

**SWA-1, Sketch the node graph from the decomposition.** Translate the Section 6.4 spine into a conceptual node-and-topic sketch: a perception node publishing a 3-D target, a decision node publishing a grasp command, controller nodes for arm/drive/gripper, and an independent safety monitor. Students mark which links are real-time-critical. *Outcome:* the functional decomposition is shown to map directly onto a software architecture, previewing M11.

**SWA-2, Identify the development/runtime boundary.** Mark, on the sketch, what runs on-robot in the control loop versus what is a development-time activity (training, synthetic data) that must not appear in the runtime loop (SR-C-01, DD-4). *Outcome:* students internalize the boundary that Conflict CR-05 formalizes.

---

## 16. ROS 2 Integration

At the system level, SIM2FIELD is a **distributed real-time system**, and ROS 2 is its nervous system. This module introduces only the framing that M11 masters:

- The spine functions become ROS 2 **nodes**; the products handed between them become **topics/services** with quality-of-service contracts.
- The control plane (real-time motor/safety traffic) is architecturally separated from the perception plane (heavy sensor/inference data), introduced here as a *requirement-driven* decision (SR-C-01, real-time integrity), realized in M11 to M12.
- The **safety monitor** is introduced as an *independent* node that can halt motion regardless of what the mission logic believes, a systems principle (defense does not depend on the correctness of what it defends against) fully developed in M11/M15.

No ROS 2 code is written in M1; the deliverable is the *architecture-level* recognition that the functional decomposition is already, in effect, a node graph.

---

## 17. AI Integration

This module positions AI at the **system** level so later modules can go deep without losing the thread. SIM2FIELD carries five AI threads; each is introduced here with its place in the system and its lifecycle side (development vs. runtime):

1. **Generative synthetic data** (development-time), diffusion/NeRF-style scene synthesis to grow perception training data where field data is scarce (M4).
2. **Multi-modal perception & fusion** (runtime), combining RGB, stereo, and other modalities into a robust 3-D target (M4 to M5).
3. **Learned grasp policy** (runtime, with fallback), an AI-assisted grasp-force policy for the compliant gripper (framework in M7, physical mastery in M9).
4. **Live digital twin** (both), the twin as training environment and as an online reasoning/monitoring aid (M13).
5. **Optimized edge inference** (runtime), quantized/compiled models meeting on-robot latency/power budgets (M6).

The **system-level rule** stated here and enforced throughout: *learning may inform the control loop but a verified deterministic fallback always bounds it* (SR-C-01 and the safety principle above). The development/runtime boundary (CR-05) is a system invariant, not a per-module footnote.

---

## 18. Edge Computing Integration

The no-cloud constraint (SR-C-01, DD-4) is fundamentally a **systems** decision introduced here and mastered in M6. Its rationale, stated at system level:

- **Connectivity is not guaranteed** in a field; a control loop that needs the network stalls when the network drops. This is a *hard* constraint, not a performance preference.
- **Latency and data gravity** reinforce it: perception data is large and the control loop is fast; moving decisions off-robot adds delay the cycle-time budget cannot afford.
- **Consequence for the architecture:** all runtime inference and control are allocated to on-robot compute; the cloud/off-robot is confined to development-time work. The compute topology (edge module + platform brain) and the latency/power/thermal budgets that make this feasible are M6/M12 deliverables; M1 only fixes the *requirement* and its rationale.

---

## 19. Fluid Power Integration

Module 1 **introduces** the fluid-power thesis at the system level (the "I" cell in the knowledge matrix); M9 masters it. The systems argument:

- The payload is **heavy and delicate simultaneously** (Section 4). The handling requirement (SR-P-02, damage rate) is therefore a **force-control and compliance** problem, not a force-maximization problem.
- **Rigid electric grippers** deliver precise position but stiff, non-back-drivable contact, poorly matched to corralling an irregular, bruise-prone fruit whose exact surface is uncertain.
- **Fluid-powered compliant gripping** provides *intrinsic* mechanical compliance (the working fluid yields), natural back-drivability, and pressure-as-a-proxy-for-force control, a strong match to the requirement, at the one interface where compliance matters most.
- The **hybrid** decision (DD-3) keeps electric positioning (precise, maintainable) and places fluid power exactly at the contact interface, the technically and pedagogically strongest allocation, and the reason fluid power is a defining thread of this curriculum rather than an actuator footnote.

M1 states *why* the system wants fluid-powered compliance; the fluid mechanics, valve dynamics, pressure/force control, and stored-energy safety are developed in M9 (and the safety angle in M15).

---

## 20. Interactive HTML Components  *(build specification: tiered)*

Specifications for the media/web team; authored to fit the existing HTML shell without redesign [->Doc J holds the injection contract]. Not implemented in this document.

- **W-M1-1, Requirements Budget Calculator.** Inputs: fruit spacing $d$, drive speed $v$, and the eight Section 7.1 cycle-time terms. Outputs: $T_\text{cycle}$, $T_\text{arrival}=d/v$, feasibility verdict ($v \le d/T_\text{cycle}$), and a live waterfall bar. *Pedagogical goal:* let students feel the single-arm feasibility tension. *Pattern:* reuse the existing quiz-widget styling; pure in-page JS (no storage).
- **W-M1-2, Error-Budget Allocator.** Inputs: capture tolerance $c$ and the four Section 7.2 σ-sources. Output: $\sigma_\text{total}$, $3\sigma$ vs. $c$ pass/fail, and per-source allocation sliders that must keep $3\sigma_\text{total}\le c$. *Goal:* internalize RSS allocation.
- **W-M1-3, Subsystem-Mapping Overlay.** The embedded twin with clickable hotspots that reveal each element's spine function and owning module. *Goal:* DTA-1 as an interactive figure.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M1-1** System context / drive-over stance: rover straddling a bed with the pick station and trailer called out (isometric).
- **CAD-M1-2** Signal-to-action functional block rendered over the machine (annotated overlay, not a mechanical part).
- **CAD-M1-3** Interface callout: Amiga mounting/rail interface (feeds HA-1 and ->Doc C).
Format and style per ->Doc J (SVG for diagrams; CAD exports for renderings).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M1-1 | Signal-to-action spine diagram | Anchors Section 6.4; reused course-wide |
| F-M1-2 | ConOps narrative panel | Visualizes Section 6.3 |
| F-M1-3 | Functional decomposition tree | Section 6.4 formal tree |
| F-M1-4 | Requirement traceability schematic (need -> req -> verification) | Section 6.5/Section 9 |
| F-M1-5 | Cycle-time budget waterfall | Section 7.1 result |
| F-M1-6 | Error-budget RSS diagram | Section 7.2 |
| F-M1-7 | TS-1 weighted decision matrix (styled) | Section 11.1 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M1-1** The mission cycle (`DRIVE...RELEASE`) with the active spine function highlighted at each state, the moving version of F-M1-1/F-M1-3.
- **AN-M1-2** Cycle-time-vs-arrival race: two timelines showing the machine keeping pace or falling behind as $v$ changes, the animated form of the Section 7.1 result.

---

## 24. Laboratory

**Lab M1, Systems Decomposition and Budget Allocation for the SIM2FIELD Harvester**

- **Objectives.** (1) Decompose the harvester by function and map it onto the twin; (2) measure system cycle time in the twin; (3) derive and defend a cycle-time and an error budget; (4) verify a requirement and identify one the current twin cannot verify.
- **Equipment.** The deployed digital twin (browser); a spreadsheet or notebook; no physical hardware or PPE required (computer-based). **Safety:** standard workstation ergonomics; no hazards.
- **Procedure.**
  1. Run three harvest cycles in the twin (SA-1); record the state sequence and label each state with its spine function.
  2. Time five complete pick-place cycles; record per-cycle $T_\text{cycle}$ and compute mean and standard deviation.
  3. At the current drive speed, compute $T_\text{arrival}=d/v$ (use the twin's parameters; where a value is not exposed, state your assumption and tag it [VERIFY@PUB]).
  4. Evaluate the single-arm feasibility condition $v \le d/T_\text{cycle}$; if violated, propose two architectural responses and predict their effect.
  5. Construct an error budget: choose a capture tolerance $c$, allocate the four σ-sources so that $3\sigma_\text{total}\le c$, and justify the allocation.
  6. Pick two requirements from Section 9; describe how you would verify each in the twin, and identify at least one that the current twin fidelity cannot verify (explain why).
- **Data collection.** Cycle-time table (5 runs), computed statistics, budget tables (time and error), requirement-verification notes.
- **Analysis.** Compare measured $T_\text{cycle}$ to the Section 7.1 allocation; interpret the feasibility result; discuss which subsystem your error allocation stresses most.
- **Discussion.** What did the budget reveal that inspection of the machine did not? Which requirement most constrains the design? Where did the twin's fidelity limit your verification?
- **Deliverables.** A 3 to 5 page lab report (decomposition diagram, data tables, budgets, requirement analysis, discussion).
- **Rubric (100 pts).** Functional decomposition & twin mapping (20); cycle-time measurement & statistics (20); feasibility analysis & architectural response (20); error-budget allocation & justification (20); requirement-verification insight incl. fidelity limits (15); clarity & engineering communication (5). *Graduate band additionally requires:* a sensitivity comment (how the feasibility verdict moves with $d$ and $v$) and one cited source.
- **Expected results.** Measured $T_\text{cycle}$ on the order of the illustrative 6.6 s; the feasibility condition typically forces $v$ well below walking pace for a single end-effector, motivating multi-effector or buffering strategies; students correctly identify fruit-damage rate as a requirement the current twin cannot verify (needs contact fidelity, links to Doc G / CR-03).

---

## 25. Homework

Full problem set (solutions in the instructor set [->instructor/]). Tiered: all students do 1 to 4; graduate students add 5 to 6.

1. **Requirements rewriting.** Given five vague stakeholder statements (e.g., "the robot should be gentle," "it should be fast," "it shouldn't need the internet"), rewrite each as a verifiable requirement of the correct type with a verification method. Identify which Section 9 requirement each maps to.
2. **Cycle-time budget.** Given a target throughput (fruit/min) [VERIFY@PUB] and a fruit spacing, derive the maximum drive speed for a single end-effector, and the number of end-effectors required to sustain walking pace. Show the inequality and the arithmetic.
3. **Error budget.** Given a capture tolerance and three of four σ-sources, solve for the maximum allowable fourth source under the $3\sigma \le c$ rule. State which subsystem that source belongs to and which module owns it.
4. **Functional decomposition.** Decompose the *canopy-management* problem (clearing leaves/vines to see and reach fruit) by function, and place each function on the spine. Identify the interface it presents to perception.
5. **(Grad) Margin and sensitivity.** For the cycle-time budget, compute the margin at a stated drive speed and the sensitivity $\partial v_\text{max}/\partial T_\text{cycle}$; interpret which cycle term is the highest-leverage target for improvement.
6. **(Grad) Trade-study construction.** Build a weighted decision matrix for the *autonomy-level* trade (TS-2), choosing and justifying your own criteria and weights; defend the selection in one paragraph and name the strongest objection to your own result.

---

## 26. Quiz

Auto-gradable set for the existing HTML quiz widget (keys in the instructor set). Mix of multiple-choice, short-answer, calculation, design, and critical-thinking items.

1. **(MC)** Emergence in a system means: (a) the system is complicated; (b) system behavior is not present in any single component; (c) components fail together; (d) the system self-assembles. **[b]**
2. **(MC)** "The robot shall be fast" fails as a requirement primarily because it is not: (a) ambitious; (b) verifiable; (c) expensive; (d) documented. **[b]**
3. **(MC)** In the drive-over architecture, the fore/aft (x) degree of freedom is supplied by: (a) a base yaw motor; (b) the vehicle driving the fruit to the station; (c) the wrist; (d) the gripper. **[b]**
4. **(MC)** Verification vs. validation: verification asks ___; validation asks ___. (a) is it safe / is it legal; (b) did we build it right / did we build the right thing; (c) is it fast / is it cheap; (d) does it run / does it compile. **[b]**
5. **(Short answer)** State the single-arm feasibility condition relating drive speed $v$, fruit spacing $d$, and cycle time $T_\text{cycle}$, and explain what a violation implies. **[$v \le d/T_\text{cycle}$; violation => the vehicle outruns the pick cycle, must slow, pause, add end-effectors, or buffer.]**
6. **(Calculation)** With $d=1.2$ m and $T_\text{cycle}=6.0$ s, compute the maximum non-stopping drive speed. **[0.20 m/s]**
7. **(Calculation)** Three independent error sources are 8, 10, and 6 mm. Compute $\sigma_\text{total}$ (RSS) and state whether $3\sigma \le 30$ mm holds. **[≈14.1 mm; $3\sigma≈42.3$ mm > 30 mm => fails.]**
8. **(Design)** The fruit-damage requirement (SR-P-02) most directly motivates which actuation choice, and why? **[Fluid-powered compliant gripping, intrinsic compliance/force control for a bruise-prone payload.]**
9. **(Critical thinking)** Give one system-level reason the no-cloud constraint (SR-C-01) is a *hard constraint* rather than a performance preference. **[Field connectivity is not guaranteed; a control loop needing the network stalls when it drops.]**
10. **(Critical thinking)** Why decompose by function before choosing components? **[Keeps form as a tradeable decision; functional interfaces are the most stable partition as components change.]**

---

## 27. Challenge Problems

Open-ended; no single correct answer. Suitable for graduate work or teams.

- **CP-M1-A, Derive the economic cycle-time target.** Build a simple labor-cost model for hand harvest [VERIFY@PUB inputs] and derive the cycle time (and end-effector count) at which the autonomous machine reaches cost parity. Identify which assumption your conclusion is most sensitive to. (Connects to M16; seeds capstone track D.)
- **CP-M1-B, Propose and trade an alternative architecture.** Conceive a harvesting architecture not in TS-1 (e.g., a conveyor-assisted windrow-and-collect, or a multi-arm drive-over). Build the weighted trade against the drive-over baseline and state the strongest reason your alternative *loses*, the mark of honest engineering.
- **CP-M1-C, Design a twin experiment for an unverifiable requirement.** Choose a requirement the current twin cannot verify (e.g., damage rate). Specify the *minimum* new simulation fidelity (what physics, what fidelity tier) that would make it verifiable, and what field data you would need to validate that new twin model. (Directly engages the Doc G fidelity ladder and CR-03.)

---

## 28. Instructor Notes

- **Timing.** Sections 4 to 7 are the conceptual core (~2 h). The trade study (Section 11) and the twin activities (Section 12, Section 13) work well as an interactive block (~1.5 h). Lab M1 is a separate 2 to 3 h session. Homework/quiz are asynchronous.
- **Common misconceptions to pre-empt.** (1) Students conflate *function* and *component*, insist on verb-first function statements. (2) They treat requirements as prose wishes, enforce "verifiable or it's not a requirement." (3) They read the cycle-time result as a failure of the design rather than as the budget *doing its job*; frame it as a discovery, the reason later modules exist. (4) They assume the twin can verify anything, DTA-2 and CP-M1-C exist to puncture this and to seed the fidelity-ladder mindset.
- **Where to push graduate students.** Sensitivity analysis on the budgets (HW5), self-critique of their own trade weights (HW6, CP-B), and the fidelity-gap reasoning (CP-C).
- **Assessment emphasis.** Reward *quantitative defense* over completeness; a smaller analysis defended with numbers beats a broad one defended with adjectives. [->Doc I formalizes the rubric bands.]
- **Thread to keep visible.** End the module by returning to the signal-to-action spine and naming, for each stage, the module that will master it, students should leave with the whole course mapped onto the one machine.

---

## 29. Research Frontiers

- **Landmark grounding.** The systems-engineering method used here is standard practice codified in the INCOSE and NASA systems-engineering handbooks; agricultural-robotics harvesting has an established review literature surveying selective-harvest robots and their perception/manipulation challenges. *(Consult current editions; specific citations belong in the reference set below and are not reproduced here.)*
- **Recent advances (survey the current literature [VERIFY@PUB]).** Model-based systems engineering (MBSE) and digital-twin-centered design are increasingly applied to field robots; requirement-driven co-design of perception and manipulation is an active theme; techno-economic modeling of selective-harvest robots is maturing as pilots report field data.
- **Open problems.** Systematic methods for allocating error and time budgets across learned (stochastic) and classical (deterministic) subsystems; principled fidelity-selection for digital twins (how much physics is *enough* to verify a given requirement); standard benchmarks for whole-system harvest success rather than component metrics.
- **Suggested thesis directions.** (1) A budget-allocation framework that treats a learned perception stage's error distribution as a first-class input to mechanism tolerance design. (2) Fidelity-driven digital-twin design: automatically selecting the minimum model fidelity to verify a requirement. (3) A techno-economic co-design tool linking cycle-time architecture to cost parity for a given crop and labor market.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full bibliographic entries live in the repository reference set (`references/bibliography.md`) [->Doc H citation standard].*

- Systems-engineering handbooks (INCOSE SE Handbook; NASA Systems Engineering Handbook), lifecycle, requirements, verification/validation, traceability.
- A foundational systems-engineering text (e.g., a standard graduate SE text), functional decomposition, trade studies, margins.
- Agricultural / selective-harvesting robotics review articles, problem framing, perception and manipulation challenges for fruit harvest.
- farm-ng Amiga platform documentation [VERIFY@PUB], platform interfaces (HA-1, ->Doc C).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, and (forthcoming) Doc B System Design Specification, Doc G Simulation & Digital-Twin Architecture.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module is anchored throughout to the SIM2FIELD machine, no generic systems-engineering content appears without a direct line to the harvester. The central mathematical result (the single-arm cycle-time feasibility condition) is derived, made testable in the twin, and used to motivate later modules, which is exactly the "teach engineering through design" intent. All 30 template sections are present; the tiered contract is honored (core content, theory, math, requirements, trade studies, lab, homework, quiz, challenge problems, research frontiers, is authored in full; CAD/figures/animations/HTML widgets are build specifications). Fluid power and the simulation-first lifecycle are introduced at the system level exactly where the Phase-1 knowledge matrix says they should be.

**Known weaknesses / items for your review.**
1. **Illustrative numbers pending Doc B.** Success-rate, damage-rate, spacing, and labor-cost figures are tagged [VERIFY@PUB]; they are pedagogically reasonable but not yet ratified, because the System Design Specification (Doc B) that should own them is not authored (the Wave-0 sequencing noted at the top). Every such value is flagged, not hidden.
2. **Verification methods are named, not detailed.** Full verification procedures belong to M14 and Doc B; here they are stated at requirement granularity only.
3. **The quiz/homework keys and rubric bands** assume the Curriculum Standards Manual (Doc I) conventions that are not yet locked; if Doc I later sets different weighting, Section 24, Section 26 inherit that change.
4. **Trade-study weights are illustrative.** They are presented as a defensible example and as a graded skill, but the ratified stakeholder weights are a Doc B input.

I have not scored this against the 9.5 bar, that judgment is yours. The four items above are where I would direct the first revision pass, and closing them is largely a matter of authoring the Wave-0 documents (chiefly Doc B) that this module was deliberately sequenced ahead of.

**END OF MODULE 1, STOP. Awaiting your review before Phase 3 (revision) or Phase 4 (Module 2).**
