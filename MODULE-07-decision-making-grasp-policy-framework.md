# Module 7: Decision-Making & Grasp-Policy Framework

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M7, **Part III, Decide**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 to 6 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation (policy training) + Software-in-the-Loop
**Prerequisites:** M1 (spine, cycle-time budget), M2 (Grip-Force Window CEC-02), M4 (ripeness confidence, EI-04, sim-to-real seed), M5 (pose-with-covariance CEC-03), M6 (edge substrate & no-cloud boundary CEC-04). Math: probability, linear algebra.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 6**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. This module **introduces** the grasp policy; the *physical* fluid-powered force control that executes it is **mastered in M9** (the deliberate introduce->master split). P0-document authority tagged **[->Doc B/E/G/H/I]**; perishable values tagged **[VERIFY@PUB]**. Recurring anchors cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** formal designation of **CEC-05 (the Sim-to-Real Pipeline)** at its mastery point; **Engineering Insight EI-07**; and the module's **Engineering Design Review**.

> *Core concept in use.* This module is the **Decide** stage of **CEC-01 (the Signal-to-Action Spine)**: it consumes the localized, ripeness-scored fruit *with covariance* (M4/M5) and produces two things the **Act** stage needs, a *task decision* (which fruit, in what order, whether to attempt) and a *grasp proposal* (approach and force/compliance targets), the latter bounded by the **Grip-Force Window (CEC-02)**.

---

## 1. Module Overview

**Mission.** The machine must now decide and plan to act, the hinge of the whole system. This module builds two coupled decision layers. The first is task decision-making: given a field of candidate fruit, which to attempt, in what order, and whether to attempt at all, under the uncertainty M5 hands over. The second is the grasp policy: how to approach and grasp a specific fruit, a problem hard enough, given variable shape and occlusion, that it is best framed as a learned policy.

**Previous milestone.** Perception has done its work: the machine knows where the ripe fruit are, how sure it is of each, and what each looks like.

**Engineering problem.** Framing the grasp as learning raises the defining engineering tension of applied AI: a learned policy is powerful but opaque, and this one commands force on a fragile fruit and motion near people.

**Design tension.** The resolution, this module's Engineering Insight, is to treat the policy's output as a proposal, not an authority: wrap it in verified guards (the Grip-Force Window, reach limits, uncertainty thresholds) and a deterministic fallback, so the worst a bad decision can do is bounded. That principle is what makes learning deployable on a real machine.

**What this module resolves.** The module also masters the discipline that makes learned control possible here at all. Real grasp experiments are slow, expensive, and can destroy fruit; the digital twin supplies massive, safe, cheap experience. But a policy trained in a clean simulator fails in the messy field unless the training deliberately randomizes the conditions the policy must survive and the result is validated on real data. This train-in-simulation, transfer-to-field discipline, introduced for perception data in Module 4, reaches full form here for a control policy, and because it recurs across the curriculum as a design tool, this module elevates it to CEC-05, the Sim-to-Real Pipeline. Consistent with the introduce->master split, M7 frames the policy, its training, and its bounds; M9 masters the physical fluid-powered control that carries it out.


## 2. Learning Objectives

- **LO-M7.1** Design the mission/task decision logic (a state machine) that sequences the harvest and gates attempts under uncertainty., *Bloom: Create*
- **LO-M7.2** Formulate grasping as a decision policy (MDP: states, actions, reward) with a reward tied to the Grip-Force Window (CEC-02)., *Bloom: Apply (with Create)*
- **LO-M7.3** Compare learned (RL/imitation), analytic, and hybrid grasp strategies and justify a choice., *Bloom: Evaluate*
- **LO-M7.4** Design a sim-to-real training pipeline with domain randomization and a real-validation gate (CEC-05)., *Bloom: Create*
- **LO-M7.5** Bound a learned policy with verified guards and a deterministic fallback (EI-07)., *Bloom: Analyze (with Create)*
- **LO-M7.6** Use pose covariance (CEC-03) and ripeness confidence (EI-04) as decision inputs, not just point values., *Bloom: Apply (with Evaluate)*
- **LO-M7.7** Specify the twin's role as the policy training environment and reality-gap instrument., *Bloom: Create*

Maps to course objectives **LO4** (primary), **LO3/LO7** (reinforcing), and ABET **SO1, SO2, SO6**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Design a harvest decision FSM with uncertainty- and ripeness-aware gating and sequencing., *Bloom: Create*
2. Write an MDP for grasping with a safety-bounded reward., *Bloom: Apply*
3. Choose and defend a grasp strategy (learned/analytic/hybrid) for variable fruit., *Bloom: Evaluate*
4. Design a domain-randomized sim-to-real pipeline with a real-validation acceptance gate., *Bloom: Create*
5. Wrap a policy in verified bounds and a deterministic fallback and argue the resulting system is verifiable., *Bloom: Analyze*
6. Feed covariance and confidence into decisions and explain the consequence of ignoring them., *Bloom: Evaluate*

---

## 4. Engineering Motivation

Between a perfect perception system and a successful harvest lies a decision, and decisions are where good information is squandered or used. Module 5 handed over not a point but a distribution, a fruit pose with covariance, and Module 4 a ripeness with a confidence. A decision layer that collapses these to point values throws away exactly the information that separates a safe attempt from a reckless one. The motivation begins here: **decide with the uncertainty, not despite it.**

The grasp itself is the hardest action the machine performs. A watermelon's shape varies, its exact surface is uncertain, it is partly occluded, and the grasp must land inside the narrow Grip-Force Window (CEC-02) at a position known only to within a covariance (CEC-03). Hand-coding a grasp for every case is brittle; the problem invites learning. But learning introduces its own hazard: a policy is a function fit to data, occasionally and unpredictably wrong outside that data, and here a wrong action bruises fruit or endangers a bystander. The naïve response, "train a better policy", never fully closes the risk, because you cannot verify an opaque policy the way you verify a controller.

The engineering resolution, and the reason this module exists as a *framework* module, is architectural: **let the policy propose and let verified logic dispose.** The policy suggests an approach and a force; a verified envelope clips that suggestion to the physically safe set and substitutes a deterministic fallback when the suggestion is out of bounds or the situation is too uncertain. This bounds the consequence of any learning failure and makes the *system* verifiable even though the *policy* is not, the central judgment of deploying AI in a physical loop. And because training such a policy on real fruit is impractical, the module masters the sim-to-real pipeline that lets the machine learn safely in a twin and transfer to the field.

---

## Engineering Failure Cases (decision-and-policy-specific)

Sharpening Module 1's classes at the decision layer:

- **Uncertainty-blind decision.** The decision layer treats an uncertain pose as certain and attempts a grasp that localization never supported; slip or bruise follows. *Motivates* covariance-aware gating/sequencing (Section 6.2) and CEC-03 use.
- **Unbounded learned action.** The policy proposes a force or motion outside the safe set and it is executed; fruit or bystander harmed. *Motivates* the verified bounding layer and fallback (Section 6.5, EI-07).
- **Reality-gap collapse.** A policy trained in a clean simulator meets field physics it never saw and fails. *Motivates* domain randomization and real validation (Section 6.4, CEC-05).
- **Reward hacking / mis-specification.** A learned policy optimizes the letter of a reward (e.g., "grip firmly") while violating its intent (bruising); *motivates* reward design tied to the Grip-Force Window and honest evaluation (Section 6.3, Section 7.3).
- **Decision-throughput conflict.** Over-deliberating each fruit blows the cycle-time budget (CEC-01). *Motivates* bounded-time decision logic (Section 6.2).

Each is prevented by a design choice in this module.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** probability and expectation (for MDPs, reward, randomization); the M2 Grip-Force Window (CEC-02) and its capture tolerance; the M4 ripeness confidence and operating-point judgment (EI-04); the M5 pose-with-covariance (CEC-03) and occlusion gate; the M6 edge substrate and no-cloud boundary (CEC-04). No prior RL is assumed; it is built from a defined baseline.

**Introduced here, used later:** the vocabulary of decision and policy learning, *task/mission FSM, decision under uncertainty, MDP (state/action/reward/policy/return), reinforcement learning, imitation/behavioral cloning, reward design, domain randomization, reality gap, sim-to-real transfer, action bounding/projection, deterministic fallback*. Treated at applied (L2) depth with an L3 grad extension; full RL theory is referenced [->Doc H].

**Where this sits in the dependency graph.** M7 hard-depends on M4/M5 (decision inputs), M2 (the safety bound), and M6 (runtime substrate). It **masters** the decision/behavior thread and **the sim-to-real pipeline (designated here as CEC-05)**; it **introduces** the grasp-policy thread (physical mastery deferred to M9). It hands forward: the grasp proposal (approach + force/compliance targets) and its verified bounds to **M9** (which builds the fluid-powered controller that executes them); the mission FSM and behavior node to **M11**; and the safety-envelope requirements to **M15**.

---

## 6. Theory

### 6.1 Two decision layers
The Decide stage has a **task layer** (which fruit, what order, whether to attempt, the mission FSM) and an **action layer** (how to grasp a chosen fruit, the grasp policy). They are separated because they operate at different rates and verifiabilities: the task layer is discrete, auditable logic; the action layer is a continuous, possibly learned policy. Keeping them distinct lets the machine verify the sequencing logic independently of the opaque grasp policy.

### 6.2 Task decision-making under uncertainty
The mission FSM sequences `DRIVE -> STAGE -> ALIGN -> GRAB -> LIFT -> SWING -> LOWER -> RELEASE` and, crucially, decides **whether** to attempt each candidate. Inputs are the M4 ripeness confidence and the M5 pose covariance: a low-confidence or high-covariance target is **gated out** (deferred or skipped) rather than risked, the occlusion/uncertainty gate (M5) elevated to a decision. Among admitted targets, sequencing balances value (ripeness), reachability (M8 preview), uncertainty, and cycle cost (CEC-01). This is decision-making that *uses* the distributions perception provides.

### 6.3 Framing the grasp as a policy (MDP)
Grasping is modeled as a **Markov Decision Process**: a **state** (fruit pose+covariance, mask/shape, ripeness, gripper state), an **action** (approach direction, contact placement, force/compliance targets), a **reward**, and a **policy** π mapping states to actions. The reward is where engineering judgment lives: it rewards a secure, unbruised grasp *inside the Grip-Force Window* (CEC-02) and penalizes slip, bruise, and miss. A poorly designed reward is *hacked*, the policy satisfies its letter while violating its intent, so the reward is tied explicitly to the physical window, not a proxy.

### 6.4 Learning the policy, and the sim-to-real pipeline
Two learning modes combine: **imitation learning** (behavioral cloning from demonstrations) bootstraps a safe initial policy; **reinforcement learning** refines it against the reward. Neither can be trained on real fruit at scale, too slow, too destructive. The policy is therefore trained in the **digital twin**, which supplies massive, safe, cheap episodes. The hazard is the **reality gap**: a policy that overfits the simulator's exact physics fails in the field. The remedy is **domain randomization**, training across a deliberately randomized distribution of contact parameters, fruit properties, sensor noise, and lighting so the policy learns to be *robust* rather than tuned to one simulator. Transfer is then **validated on real data** before the policy is trusted. This **train-in-sim -> randomize -> transfer -> validate** loop is the Sim-to-Real Pipeline, mastered here (Section 11.3, CEC-05).

### 6.5 Bounding the learner
A learned policy's output is a **proposal**, never a direct command. It passes through a **verified bounding layer** that:

- **clips** the proposed force/compliance to the Grip-Force Window (CEC-02) and the proposed motion to reach/joint limits (M8) and keep-out zones (M15);
- **checks** the decision's inputs, if pose covariance (CEC-03) or ripeness confidence (EI-04) is too poor, the proposal is rejected;
- **falls back** to a deterministic behavior (a conservative fixed-compliance grasp, a re-approach, or a skip) when the proposal is rejected or the policy is unavailable.

Because the bounding layer is deterministic and verifiable, the *system* is verifiable even though the policy is not. This is the architectural expression of this module's Engineering Insight (EI-07) and the system-level AI rule carried since Module 1.

### 6.6 The introduce->master split
M7 delivers the *framework*: the decision logic, the MDP and reward, the training pipeline, the bounds, and the fallback. It does **not** build the physical force controller, that is M9, where fluid-powered compliance and AI-assisted force regulation execute the bounded proposal on real hardware. Separating the two lets the policy be designed against the *physics requirement* (the window) before the actuator exists.

---

## 7. Mathematics

Rigor tier for M7: **L2 to L3**. Central results: the safety-bounded grasp MDP and the domain-randomization (robust-transfer) formulation.

### 7.1 Value-based pick sequencing
Assign each admitted fruit a value $V_i = \dfrac{w_r\,r_i\,(1-u_i)}{c_i}$ with ripeness $r_i$, normalized uncertainty $u_i$ (from covariance, CEC-03), cycle cost $c_i$, weight $w_r$. Sequence by descending $V_i$ subject to reachability and the cycle-time budget (CEC-01). *Use:* uncertainty- and value-aware ordering, bounded in decision time.

### 7.2 The grasp MDP and return
State $s$, action $a$, policy $\pi(a|s)$, reward $R(s,a)$, discounted return $G=\sum_t \gamma^t R_t$; the policy maximizes $\mathbb E_\pi[G]$. Reward (schematic): $R = +R_\text{success}\cdot\mathbb{1}[\text{grasp inside window}] - \lambda_\text{slip}\mathbb{1}[\text{slip}] - \lambda_\text{bruise}\mathbb{1}[\text{bruise}] - \lambda_\text{miss}\mathbb{1}[\text{miss}]$, with the window membership from CEC-02. *Use:* frames learning with a mission-tied, safety-aware objective.

### 7.3 Domain randomization as robust transfer (central)
Let simulator parameters $\xi$ (contact stiffness, friction, mass, sensor noise, lighting) be drawn from a randomization distribution $p(\xi)$. Train the policy to maximize *expected* return over that distribution:
$$ \pi^\ast=\arg\max_\pi\ \mathbb E_{\xi\sim p(\xi)}\big[\mathbb E_\pi[G\mid \xi]\big]. $$
A policy optimal in expectation across a broad $p(\xi)$ is robust to the specific real-world $\xi$ it later meets, the mathematical statement of why randomization transfers. The **reality gap** is the distribution shift between $p(\xi)$ and the field; it is *measured* by validating real performance against sim performance, and *closed* by widening/retuning $p(\xi)$ until the gap is acceptable. **Grad (L3):** relate to robust/distributionally-robust optimization; discuss why too-wide randomization degrades peak performance (the robustness-optimality tradeoff).

### 7.4 Action bounding as projection
Given a proposed action $a_\pi$, the executed action is the projection onto the safe set $\mathcal S$ (the intersection of the Grip-Force Window, reach limits, keep-out, and uncertainty gates): $a_\text{exec}=\Pi_{\mathcal S}(a_\pi)$ if $\mathcal S\neq\varnothing$ and the situation passes the confidence checks; otherwise $a_\text{exec}=a_\text{fallback}$. *Use:* the formal statement of "propose, then bound" (EI-07). The worst-case executed action is bounded by $\mathcal S$ regardless of the policy.

---

## 8. Engineering Principles

1. **Decide with the distribution.** Use covariance (CEC-03) and confidence (EI-04); gate what you cannot support.
2. **Separate task logic from action policy** so the auditable part stays auditable.
3. **Tie the reward to the physics** (the Grip-Force Window), or the policy will hack a proxy.
4. **A learned policy is a proposal, not an authority** (EI-07): bound it and give it a deterministic fallback.
5. **Train in sim, randomize, transfer, validate** (CEC-05); never trust a policy that has only seen the simulator.
6. **Bounded decision time**, deliberation spends the cycle-time budget (CEC-01).
7. **Design the policy against the requirement, not the actuator** (introduce->master); the window exists before the gripper does.

---

## 9. System Requirements

Derived from the decision mission; frame the grasp policy. IDs continue; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-F-10 | Functional | The task layer shall gate grasp attempts on pose covariance (CEC-03) and ripeness confidence (EI-04) thresholds. | Test |
| SR-F-11 | Functional | The grasp policy shall output approach + force/compliance targets as a **proposal** to a verified bounding layer. | Review + test |
| SR-P-23 | Performance | Every executed grasp action shall lie within the safe set (Grip-Force Window CEC-02 ∩ reach ∩ keep-out); out-of-bounds proposals shall be clipped or replaced by fallback. | Analysis + test |
| SR-F-12 | Functional | A deterministic fallback grasp/behavior shall exist for rejected proposals or policy unavailability. | Test |
| SR-D-02 | Data | The policy shall be trained with domain randomization and its sim-to-real transfer validated on real data before deployment (CEC-05). | Sim + real validation |
| SR-P-24 | Performance | Decision + policy-inference latency shall fit the decision share of the cycle-time budget (CEC-01) on the edge (CEC-04). | Benchmark |
| SR-I-10 | Interface | The twin shall serve as the policy training environment and reality-gap instrument. | Review (->Doc G) |

Traceability: SR-F-10 -> CEC-03/EI-04; **SR-F-11/SR-P-23/SR-F-12 -> M9 (executes the bounded proposal); EI-07**; SR-D-02 -> CEC-05; SR-P-24 -> CEC-01/CEC-04/M6; SR-I-10 -> twin/M13.

---

## 10. Design Decisions

- **DD-35 Mission FSM for task sequencing** with uncertainty/ripeness gating. *Rationale:* Section 6.2; auditable discrete logic. *Serves:* SR-F-10.
- **DD-36 Value-based pick ordering** (Section 7.1). *Rationale:* maximize harvested value within the cycle budget. *Serves:* SR-F-10, CEC-01.
- **DD-37 Learned grasp policy as proposer** (imitation-bootstrapped RL). *Rationale:* Section 6.4; handles variable fruit better than hand-coding. *Serves:* SR-F-11.
- **DD-38 Verified bounding layer + deterministic fallback.** *Rationale:* Section 6.5, EI-07; make the system verifiable despite an opaque policy. *Serves:* SR-P-23, SR-F-12.
- **DD-39 Train-in-sim with domain randomization, validate on real** (CEC-05). *Rationale:* Section 6.4; safe, cheap, transferable learning. *Serves:* SR-D-02.
- **DD-40 Policy inference on the edge; training off-robot** (CEC-04). *Rationale:* runtime/development boundary. *Serves:* SR-P-24.
- **DD-41 Reward tied to the Grip-Force Window** (Section 6.3). *Rationale:* prevent reward hacking; align learning with the physics. *Serves:* SR-P-23.

---

## 11. Trade Studies

### 11.1 TS-13: Grasp strategy
**Alternatives:** (A) **analytic/hand-coded grasp planning**; (B) **pure learned policy**; (C) **hybrid: learned proposer + verified bounds**; (D) **teleoperation**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Analytic | B: Pure learned | C: Hybrid | D: Teleop |
|--------------------|:---:|:---:|:---:|:---:|
| Performance on variable/occluded fruit (0.26) | 3 | 5 | 5 | 3 |
| Verifiability / safety (0.24) | 5 | 2 | 5 | 3 |
| Robustness (reality gap, edge cases) (0.18) | 4 | 3 | 4 | 4 |
| Data/effort to develop (0.14) | 3 | 3 | 3 | 2 |
| Autonomy / no-network (CEC-04) (0.10) | 5 | 5 | 5 | 1 |
| Cycle-time fit (0.08) | 4 | 4 | 4 | 2 |
| **Weighted total** | **3.94** | **3.58** | **4.62** | **2.82** |

**Selected: C (hybrid, learned proposer + verified bounds).** It captures the learned policy's strength on variable fruit while retaining the analytic layer's verifiability and safety, the direct embodiment of EI-07. Teleoperation is defeated by the no-network constraint (CEC-04); pure learning is defeated on verifiability. Recorded weakness: the hybrid's guarantees are only as good as the bounding layer's models (window, reach, keep-out), which must themselves be verified (M9/M15).

### 11.2 TS-14: Learning approach (summary)
**Alternatives:** pure RL, pure imitation, **imitation-bootstrapped RL**. **Criteria:** sample efficiency, training safety, peak performance, reality-gap robustness. **Outcome:** **imitation-bootstrapped RL in sim**, imitation gives a safe, competent start; RL refines against the reward; both under domain randomization. Real fruit is used only for validation (SR-D-02), never bulk training.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **The Sim-to-Real Pipeline (train-in-sim, randomize, transfer, validate).** *Verdict: promoted from watchlist to full CEC, **CEC-05**, designated here at mastery.* It was *introduced* for perception data in M4; here it reaches full form for a **control policy**, the complete train->randomize->transfer->validate loop, and it recurs as a design tool in M9 (grasp control developed this way), M13 (system twin), and M14 (validation). It meets the recurrence and mastery tests. M7 is the genuine mastery point because this is where the pipeline is used to produce a *deployable bounded controller*, not merely a dataset. Register and Knowledge-Architecture links updated.
- **Reinforcement/imitation learning.** *Verdict: not a separate CEC.* A mastered *technique* within the policy, captured in the Knowledge-Architecture decision thread, not the anchor set (Design Rule; keep anchors few).
- **EI-07 (Bound the Learner)** is added as this module's Engineering Insight, reinforcing CEC-02, CEC-04, and CEC-05. *(One new CEC, one new EI, within discipline.)*

> **Simulation-first hook.** The policy is trained and bounded entirely in the twin (CEC-05); the twin is also the reality-gap instrument (SR-I-10). Nothing about grasping is trusted from simulation alone, real validation is a gate (SR-D-02), the CEC-05 discipline in action.

---

## 12. Simulation Activities

M7 runs at **Simulation (policy training) + SIL**. The twin is the policy's training environment and the reality-gap instrument, the concrete realization of CEC-05.

**SA-1, Task-FSM in the loop.** Run the mission FSM on twin scenes; observe uncertainty/ripeness gating (SR-F-10) admit or defer candidates and value-based sequencing order them. *Outcome:* decision logic exercised against realistic candidate fields.

**SA-2, Train the grasp policy.** Bootstrap by imitation, then refine by RL against the window-tied reward (Section 6.3, Section 7.2), all in the twin under domain randomization. *Outcome:* a bounded grasp policy without a single real fruit harmed.

**SA-3, Domain-randomization sweep.** Vary the randomization distribution $p(\xi)$ (contact, friction, mass, sensor noise) and observe robustness vs. peak performance (Section 7.3). *Outcome:* students feel the robustness-optimality tradeoff and choose $p(\xi)$.

**SA-4, Bounding & fallback test.** Inject adversarial/out-of-bounds policy proposals; confirm the bounding layer clips to the safe set or invokes the fallback (Section 7.4, EI-07). *Outcome:* the "propose, then bound" architecture verified in SIL.

---

## 13. Digital Twin Activities

**DTA-1, Training-environment specification (deliverable to Doc G).** Specify the twin as an RL/imitation environment: state/action/reward interfaces, the randomization distribution, and episode protocols. *Outcome:* SR-I-10; the reproducible training environment.

**DTA-2, Reality-gap instrument.** Specify how sim policy performance is compared to real validation performance, the acceptance gate for transfer, and how $p(\xi)$ is retuned when the gap is too large (CEC-05). *Outcome:* an honest transfer-validation protocol (SR-D-02).

**DTA-3, Bounded-policy regression suite.** A fixed twin scenario set (including edge cases and out-of-bounds situations) that every policy version must pass with its bounds and fallback intact. *Outcome:* continuous verification of the bounded system (hand-off to M14).

---

## 14. Hardware Activities

*(Tiered: validation and demonstration protocols at specification level; real fruit used only for validation.)*

**HA-1, Real grasp-validation protocol.** Specify a limited real-fruit protocol to *validate* (not train) the transferred policy: success/slip/bruise rates against the sim prediction, measuring the reality gap (CEC-05, SR-D-02). *Deliverable:* a transfer-validation dataset and gap estimate.

**HA-2, Fallback demonstration.** Specify a bench demonstration that the deterministic fallback safely handles rejected proposals and policy dropout (SR-F-12). *Deliverable:* a fallback-behavior verification record.

---

## 15. Software Activities

**SWA-1, Decision/behavior node & bounding layer.** Specify the behavior node (mission FSM + sequencing) and the verified bounding layer (clip-to-safe-set + fallback) as separate, independently testable components. *Outcome:* the auditable-logic/opaque-policy separation realized in software (M11 realizes as nodes).

**SWA-2, Policy artifact & versioning.** Specify how a trained, validated, bounded policy is versioned and deployed (development-time) to the edge (CEC-04), with the fallback always present. *Outcome:* safe policy lifecycle (Doc E).

---

## 16. ROS 2 Integration

The Decide stage becomes two nodes with a deliberate trust boundary: a **behavior/decision node** (mission FSM, gating, sequencing, auditable) and a **grasp-policy node** (the learned proposer), with the **verified bounding layer** between the policy and the actuators. The bounding layer subscribes to the policy proposal, the pose covariance (M5), and the limits, and publishes a *bounded* grasp command to the manipulator/gripper controllers (M8/M9); it is the software location where EI-07 is enforced. The independent **safety monitor** (M11/M15) sits further out still. M11 masters the node graph and real-time execution; M7 fixes the interfaces and the trust boundary.

---

## 17. AI Integration

This module frames two of the machine's five AI threads, the **learned grasp policy** and the **sim-to-real pipeline (CEC-05)**, and states the rule that governs all learned components:

- **Policy learning.** Imitation-bootstrapped RL in the twin, reward tied to the Grip-Force Window (CEC-02); the policy is a *proposer*.
- **Sim-to-real (CEC-05).** Domain randomization for transfer; real validation as an acceptance gate; the reality gap measured and closed, never assumed away.
- **The bounding rule (EI-07).** Every learned output is clipped to a verified safe set with a deterministic fallback, the system-level AI rule carried since Module 1, here given its architectural form. Learning informs the loop; verified logic bounds it.

Development (training, randomization) is off-robot; runtime (bounded inference + fallback) is on-robot (CEC-04).

---

## 18. Edge Computing Integration

Policy inference and decision logic run **on-robot** (CEC-04) within the decision share of the cycle-time budget (CEC-01); training and domain randomization are development-time and off-robot. Two constraints fixed here: (1) the deployed policy must be optimized to meet its latency share on the edge device (M6), a learned policy too large to run in time is as useless as a slow detector (EI-04/EI-06 recur); (2) the bounding layer and fallback are lightweight, deterministic, and always resident, so safety never depends on the policy's compute finishing in time, a late or failed policy yields the fallback, not an unbounded action.

---

## 19. Fluid Power Integration

M7 produces the **grasp proposal the fluid-powered gripper will execute**, approach, and **force/compliance targets**, but stops at the framework boundary. The policy's action space is defined in terms the fluid system understands: a target grip force (or fluid pressure proxy) and a target compliance, both **bounded by the Grip-Force Window (CEC-02)** before they ever reach an actuator. This is the deliberate introduce->master seam: M7 specifies *what* force/compliance the grasp should aim for and guarantees it is in-window; **M9 masters** *how* the fluid circuit, valves, actuator, and AI-assisted controller achieve and regulate it on real hardware. Framing the policy's output as in-window force/compliance targets means M9 inherits a safe, well-posed control objective rather than an unbounded command.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M7-1, Decision-Gate Explorer.** Sliders for covariance and ripeness-confidence thresholds; a field of candidate fruit is admitted/deferred and sequenced by value (Section 6.2/Section 7.1); shows yield vs. risk as thresholds move. *Goal:* uncertainty-aware decisions (CEC-03/EI-04).
- **W-M7-2, Reward & Reward-Hacking Sandbox.** Edit reward weights; watch a schematic policy either grasp safely or "hack" a proxy (grip too hard), illustrating Section 6.3. *Goal:* reward-design judgment.
- **W-M7-3, Domain-Randomization / Reality-Gap Visualizer.** Widen/narrow $p(\xi)$ and see sim vs. real performance and the gap (Section 7.3, CEC-05). *Goal:* the robustness-optimality tradeoff.
- **W-M7-4, Propose-then-Bound Demonstrator.** A policy proposal shown being clipped to the safe set (window ∩ reach) or replaced by fallback (Section 7.4, EI-07). *Goal:* the bounding architecture made visible.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M7-1** Decide-stage architecture: behavior node -> grasp-policy node -> verified bounding layer -> actuators, with the safety monitor outside (annotated; shows the EI-07 trust boundary).
- **CAD-M7-2** Grasp action parameters on a fruit: approach vector, contact placement, force/compliance targets, overlaid with the Grip-Force Window bound.
Format per ->Doc J (SVG architecture/annotation diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M7-1 | Two decision layers (task FSM vs. grasp policy) | Section 6.1 |
| F-M7-2 | Mission FSM with uncertainty/ripeness gating | Section 6.2 |
| F-M7-3 | The grasp MDP (state/action/reward/policy) | Section 6.3 |
| F-M7-4 | Sim-to-real pipeline (train->randomize->transfer->validate) | Section 6.4 (CEC-05) |
| F-M7-5 | **Propose-then-bound: action projected onto the safe set / fallback** | Section 6.5/Section 7.4 (central, EI-07) |
| F-M7-6 | Domain randomization & the reality gap | Section 7.3 |
| F-M7-7 | Value-based pick sequencing | Section 7.1 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M7-1** A policy proposal being clipped to the Grip-Force Window / reach set, then a rejected proposal triggering the deterministic fallback, EI-07 in motion.
- **AN-M7-2** Domain randomization: the same grasp across randomized physics, then transferring to a "real" scene; the reality gap shrinking as $p(\xi)$ widens.
- **AN-M7-3** The mission FSM gating an uncertain fruit and sequencing the rest by value.

---

## 24. Laboratory

**Lab M7, Framing and Bounding the Grasp Policy**

- **Objectives.** (1) Design the harvest decision FSM with uncertainty/ripeness gating and value sequencing; (2) formulate the grasp MDP and a window-tied reward; (3) train a policy in the twin under domain randomization; (4) build the verified bounding layer + fallback; (5) measure the reality gap via limited real validation.
- **Equipment.** The digital twin as RL/imitation environment; a policy-training toolkit [VERIFY@PUB]; a provided real validation set (or limited real-fruit demo); notebook. **Safety:** training is simulated; any real-fruit validation follows lab safety and uses the fallback-guarded system.
- **Procedure.**
  1. Implement the mission FSM; set covariance/confidence gates (SR-F-10) and the value function (Section 7.1); test admission/sequencing on twin candidate fields.
  2. Define the grasp MDP and reward tied to the Grip-Force Window (Section 6.3); identify one reward-hacking failure and fix it.
  3. Train (imitation -> RL) in the twin under a chosen $p(\xi)$; sweep $p(\xi)$ and record robustness vs. peak performance (Section 7.3).
  4. Implement the bounding layer (clip to window ∩ reach) and the deterministic fallback; test with adversarial proposals (SA-4), confirm no out-of-bounds action executes (SR-P-23).
  5. Validate transfer on the real set; compute the reality gap (success/slip/bruise sim vs. real); decide accept/retune (CEC-05, SR-D-02).
- **Data collection.** Gating/sequencing results; reward and hacking fix; randomization sweep; bounding-layer test log; reality-gap table.
- **Analysis.** How do gate thresholds trade yield vs. risk? How wide should $p(\xi)$ be? Did any proposal escape the bounds? How large is the reality gap, and does it pass the acceptance gate?
- **Discussion.** Why is the bounded system verifiable when the policy is not (EI-07)? Why validate on real data before trusting the policy (CEC-05)? How does decision latency interact with the cycle-time budget (CEC-01)?
- **Deliverables.** A 4 to 6 page report: decision FSM, MDP/reward, randomization study, bounding-layer verification, reality-gap validation.
- **Rubric (100 pts).** Decision FSM & gating (16); MDP/reward design incl. hacking fix (18); training & randomization study (18); bounding layer & fallback verification (22, EI-07); reality-gap validation (16, CEC-05); communication (10). *Graduate band adds:* the robust-optimization view of domain randomization (Section 7.3 grad) and a cited source.
- **Expected results.** Gating that trades a little yield for much less risk; a reward that must be repaired to prevent hacking; a randomization width that improves transfer up to a point then erodes peak performance; a bounding layer that provably admits no out-of-bounds action; a measurable reality gap that the validation gate either accepts or sends back for retuning.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Decision gating.** Given candidate fruit with ripeness confidence and pose covariance, apply thresholds to admit/defer and sequence by the value function; justify the thresholds in yield/risk terms.
2. **Reward design.** Write a grasp reward tied to the Grip-Force Window; then show a reward-hacking exploit of a naïve alternative and how the window-tied version prevents it.
3. **Bounding & fallback.** Given a policy proposal and a safe set (window ∩ reach), compute the executed action by projection; specify the fallback for the empty-set / low-confidence case.
4. **Sim-to-real.** Explain, with the robust-transfer formulation, why domain randomization transfers; name one failure mode of too-narrow and one of too-wide randomization.
5. **(Grad) Robust optimization.** Cast domain randomization as maximizing expected (or worst-case) return over $p(\xi)$; discuss the robustness-optimality tradeoff and how you would choose $p(\xi)$.
6. **(Grad) Verifiable learned system.** Argue how a bounded learned policy can satisfy a safety requirement that the policy alone cannot be verified to meet; identify what must be verified instead (the bounds, fallback, and their models).

---

## 26. Quiz

1. **(MC)** A learned grasp policy's output should be treated as: (a) a direct command; (b) a proposal to a verified bounding layer; (c) ground truth; (d) a measurement. **[b]**
2. **(MC)** Domain randomization transfers because the policy is trained to: (a) memorize one simulator; (b) maximize return across a distribution of randomized conditions; (c) ignore physics; (d) use less data. **[b]**
3. **(MC)** The grasp reward is tied to the Grip-Force Window primarily to: (a) speed training; (b) prevent reward hacking / align learning with safe physics; (c) reduce compute; (d) improve perception. **[b]**
4. **(MC)** A high pose covariance should cause the task layer to: (a) grasp faster; (b) gate/defer the attempt; (c) increase force; (d) ignore it. **[b]**
5. **(Short)** State EI-07 and how it makes a learned system verifiable. **[A learned policy is a proposal, not an authority; bounding its output to a verified safe set with a deterministic fallback makes the system verifiable even though the policy is not.]**
6. **(Short)** Name the four stages of the Sim-to-Real Pipeline (CEC-05). **[Train in sim -> domain-randomize -> transfer -> validate on real (retune the gap).]**
7. **(Design)** Where in the architecture is EI-07 enforced, and what two things does that layer do? **[The verified bounding layer between policy and actuators; it clips proposals to the safe set and invokes a deterministic fallback when out-of-bounds/low-confidence.]**
8. **(Design)** Why is the grasp policy *introduced* here but *mastered* in M9? **[M7 frames the policy, reward, training, and in-window targets against the physics requirement; M9 builds the fluid-powered force controller that physically executes the bounded proposal.]**
9. **(Critical thinking)** Why validate a transferred policy on real data before trusting it, even after heavy randomization? **[The reality gap (distribution shift) may remain; only real validation measures it, CEC-05/EI-06.]**
10. **(Critical thinking)** Why keep task logic separate from the grasp policy? **[The discrete task logic stays auditable/verifiable independent of the opaque policy; separation preserves system verifiability.]**

---

## 27. Challenge Problems

- **CP-M7-A, End-to-end risk-aware decision.** Combine ripeness confidence (EI-04), pose covariance (CEC-03), and the Grip-Force Window (CEC-02) into a per-fruit success probability, and design a decision policy that maximizes expected harvested value under the cycle-time budget (CEC-01), including when to skip. (Bridges four anchors.)
- **CP-M7-B, Design the bounding layer as a safety case.** Specify the verified bounding layer and fallback as a safety argument: what must be true (window model, reach model, uncertainty gate, fallback correctness) for "no out-of-bounds action executes" to hold, and how each is verified. (Feeds M15.)
- **CP-M7-C, Close a reality gap.** Given sim-vs-real grasp results showing a gap, propose a domain-randomization and validation plan to close it to an acceptance threshold; specify what real data you need and how you would know the gap is closed. (Formalizes CEC-05.)

---

## Engineering Design Review

*Not graded. The questions a review board would ask; argue with evidence.*

1. **Assumptions.** Your policy is trained in the twin under a chosen randomization distribution. What are you *assuming* the twin captures well enough for transfer (contact physics, occlusion, lighting), and where is that assumption weakest? How would a wrong assumption show up only in the field (CEC-05)?
2. **Tradeoffs.** You chose a hybrid learned-proposer-plus-verified-bounds design over both pure analytic and pure learned. Defend it to a reviewer who says the bounding layer just re-implements the hard part analytically. What does the learned component actually buy, and how would you show it?
3. **Risk.** Suppose the grasp policy proposes a plausible-but-wrong action in a situation absent from training. Trace what happens through your architecture. Is the worst-case outcome bounded, and by what (EI-07)? What residual risk remains?
4. **Verification.** You cannot verify the policy directly. Convince the board the *system* is safe anyway. Precisely what do you verify instead, and what evidence (bounding-layer proofs, fallback tests, real validation) do you bring?
5. **Subsystem interaction.** The decision layer consumes M5's covariance and M4's confidence and emits an in-window force/compliance target to M9. If M5 becomes over-confident (under-reports covariance), how does that propagate through your gates and bounds, and who is responsible for catching it?
6. **Reward.** Your reward is tied to the Grip-Force Window. A reviewer worries the policy will still find a loophole (e.g., succeeding in sim by exploiting a contact-model artifact). How do you detect reward hacking, and how does real validation (CEC-05) guard against it?

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (two decision layers, the MDP, sim-to-real, bounding) are the core (~3 h); the CEC-05 designation (Section 11.3) and EI-07 are the peaks. Trade studies (Section 11) and twin training activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M7 is a separate 2 to 3 h session (simulated training; real fruit only for validation).
- **Common misconceptions.** (1) "Just train a better policy", the point is bounding, not perfection (EI-07). (2) Treating sim success as field success, CEC-05/real validation. (3) Collapsing covariance/confidence to point values, force distribution-aware decisions. (4) Reward = "grip hard", reward hacking; tie to the window.
- **On CEC-05 and EI-07.** CEC-05 is the *tool* (the train->transfer->validate pipeline); EI-07 is the *judgment* (bound the learner). Emphasize that together they are what make learned control deployable on a machine that can harm fruit or people. Note EI-04/EI-06 recur (latency, measure-on-target).
- **On the introduce->master split.** Be explicit that M7 designs the policy against the *requirement* (the window) and M9 builds the *actuator control*, a deliberate separation students should be able to defend.
- **Where to push graduate students.** Robust-optimization view (HW5), verifiable-learned-system argument (HW6, CP-M7-B), reality-gap closure (CP-M7-C).
- **Thread to keep visible.** Close by naming hand-offs: the bounded in-window grasp proposal -> M9 (fluid force control); the mission FSM/behavior node -> M11; the safety-envelope requirements -> M15.

---

## 29. Research Frontiers

- **Landmark grounding.** Foundational references in reinforcement learning and imitation learning; the robot-grasping literature (analytic and learned grasp synthesis); the sim-to-real and domain-randomization literature. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Sim-to-real transfer with structured/automatic domain randomization and system identification; safe reinforcement learning and shielded/constrained policies (verified bounds around learned control); offline RL and learning from demonstrations for manipulation; foundation/robot-policy models for few-shot grasping; uncertainty-aware policies that defer under low confidence.
- **Open problems.** Provable safety guarantees for learned manipulation policies; reliable, automatic reality-gap closure; reward specification that resists hacking for contact-rich tasks; sample-efficient transfer for deformable/fragile-object grasping.
- **Suggested thesis directions.** (1) A shielded grasp policy with a formally verified bounding layer tied to a physical grip-force model. (2) Automatic domain-randomization tuning driven by measured reality-gap feedback. (3) An uncertainty-aware harvest decision policy that provably respects the placement and grip-force budgets.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Reinforcement-learning and imitation-learning references, MDPs, policy learning, behavioral cloning (Section 6.3 to 6.4).
- Robot-grasping literature (analytic and learned grasp synthesis), grasp planning and policies (Section 6.3).
- Sim-to-real / domain-randomization references, transfer and the reality gap (Section 6.4, Section 7.3; CEC-05).
- Safe / constrained / shielded RL literature, bounding learned control (Section 6.5; EI-07).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 6**, and (forthcoming) Doc B, Doc E, Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters task decision-making and frames the grasp policy while making its central lesson an *engineering* one: a learned policy is a **proposal bounded by verified logic**, captured as **EI-07 (Bound the Learner)**, the judgment that makes a system verifiable even when its policy is not. It formally designates **CEC-05 (the Sim-to-Real Pipeline)** at its genuine mastery point, where the full train->randomize->transfer->validate loop produces a deployable bounded controller, not merely a dataset, while explicitly declining to mint RL/imitation as a separate CEC, keeping the anchor set small. It decides *with* uncertainty (CEC-03) and confidence (EI-04), ties the reward to the Grip-Force Window (CEC-02) to prevent reward hacking, respects the no-cloud boundary (CEC-04), and honors the deliberate introduce->master seam with M9. All 30 sections present; the Engineering Design Review is included and framed as judgment; cross-module callouts are lightweight; consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Gate thresholds, reward weights, randomization ranges, and latency shares depend on Doc B/E and real data; the formulations (MDP, robust-transfer, projection-bounding) are exact.
2. **Guarantees rest on the bounding layer's models.** "No out-of-bounds action" is only as strong as the window, reach, and keep-out models it clips to, verified in M9/M15, flagged here.
3. **The reality gap is framed and instrumented, not yet closed.** Real validation is specified as a gate (CEC-05); actual transfer results await hardware and the twin's contact fidelity (Doc G/CR-03).
4. **Physical grasp control is deferred to M9** by design (introduce->master); M7's guarantees about in-window targets are confirmed only when M9's controller is authored.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 3 close chiefly by authoring Doc B/E/G and by reaching M9.

**END OF MODULE 7, STOP. Awaiting your review before freezing Module 7 or proceeding to Module 8.**
