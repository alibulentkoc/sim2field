# Core Engineering Concepts Register

**Path:** `curriculum/_core-concepts.md`
**Document class:** Living catalog / curriculum backbone
**Authority:** This register is the authoritative index of the recurring engineering **concepts** and **insights** used across the SIM2FIELD curriculum. The **Curriculum Standards Manual (Doc I)** defines *how* Core Engineering Concepts and Engineering Insights are presented and formatted; it references this register but does not duplicate its content. Individual modules **introduce, reinforce, master, and apply** these anchors and link back here.
**Synchronization:** This register is kept synchronized with the **Knowledge Architecture** (Phase-1 Curriculum Architecture, Section 2 matrix). Any change to an anchor's status must be reflected in both.

> **Two kinds of anchor, one register (Design Rule).**
> - **Core Engineering Concept (CEC)**, an enduring engineering **design tool** that recurs throughout the curriculum. *A CEC explains how engineers analyze or design.*
> - **Engineering Insight (EI)**, concise engineering **judgment** distilled from a module's content: a memorable lesson that helps students think like practicing engineers. *An EI explains how experienced engineers think.*
>
> Every Insight should naturally reinforce one or more Core Engineering Concepts without duplicating them. Target across the whole curriculum: a small, memorable set, roughly **6 to 10 CECs** and **15 to 20 EIs**, not hundreds of isolated observations.

---

## What qualifies as a Core Engineering Concept (CEC)

A CEC is a **recurring design tool**, an idea a student uses repeatedly, across multiple modules, to reason about the machine. Not every important idea is a CEC; the set is deliberately small so that each entry becomes a memorable, load-bearing anchor rather than one item in a long glossary. The test:

1. It is a *tool for design or analysis*, not merely a fact.
2. It recurs as an active instrument in **three or more modules**.
3. It is designated at its **point of mastery** (the module that owns it), not merely at first mention.

**Designation discipline (from Module 3 onward):** when a concept becomes fundamental, explicitly evaluate it against this test. If it qualifies, add it here, reference it in the relevant modules, and update the Knowledge Architecture if needed. Prefer few, strong anchors over many weak ones.

**CEC set status, effectively complete (from Module 14 onward, per instructor direction after M13).** The six designated CECs (CEC-01...CEC-06) are treated as the complete anchor set for the remainder of the curriculum. Modules 14 to 17 shall **not** mint new CECs unless an *extraordinary* case emerges, a genuinely new, enduring, cross-module analytical tool that none of the six already covers. The standing per-module CEC evaluation continues, but its expected and default outcome is "no new CEC, this is an existing anchor applied." Engineering Insights (one per module) remain the normal vehicle for new judgment lessons.

**CURRICULUM ARCHITECTURE FROZEN (instructor direction after M17 approval).** All 17 modules (M1 to M17) are frozen Rev 1.0/1.1 baselines; the anchor architecture is final at **6 CECs (CEC-01...CEC-06) + 14 EIs (EI-04...EI-17)**; the Engineering Insight sequence concludes with EI-17. No new CECs, no new EIs, no new permanent framework layers, and no changes to the module sequence or governing conventions are to be introduced. Future work is **production and implementation only**, worked examples, instructor resources, figures, CAD, HTML widgets, digital-twin assets, laboratory infrastructure, assessment materials, and build/implementation, realizing the tiered "build specification" placeholders (Section 20, Section 23) and the [VERIFY@PUB] items against the P0 documents. This register and the frozen modules are the controlling baseline any production work must conform to.

**Configuration-control policy (authoritative; full text in `CURRICULUM-INDEX.md`).** Modules are **frozen except for errata**. P0 documents (Doc B/C/E/F/G/H/I/J) are **revision-controlled**. Production assets **derive from** the frozen modules and P0 baselines. Future research belongs in **new revisions or successor artifacts**, never in modifications to the educational baseline, so the curriculum stays stable and citable while the engineering evolves beneath it.

**Callout conventions** (formatting owned by Doc I):
- **Introduction/mastery callout**, a boxed `Core Engineering Concept, CEC-NN: <Name>` block placed at the point of mastery, giving the canonical one-line statement and a link to this register.
- **Callback reference**, a light `Core concept in use` note in later modules, naming the CEC and stating how the module extends or applies it.

---

## Register

### CEC-01: The Systems Engineering Signal-to-Action Spine

- **Concept ID:** CEC-01
- **Official name:** The Systems Engineering Signal-to-Action Spine
- **First introduced:** Module 1, Section 6.4 (Functional decomposition)
- **Mastered in:** Module 1 (as the organizing framework); deepened to full system-integration mastery in Module 13
- **Reinforced in:** Every module, M2 (Act-stage physical constraints), M3 to M5 (Perceive), M6 to M7 (Decide), M8 to M10 (Act), M11 to M12 (Integrate)
- **Applied in:** Module 13 (System Integration & Bring-Up), Module 17 (Capstone)
- **Short definition:** The harvester is one machine that turns a camera frame into a grasped fruit; it decomposes by *function* into **Perceive -> Decide -> Act**, bound by **Integrate -> Deploy**. Every module advances one stage of this spine, and every subsystem exists because the spine requires it.
- **Engineering significance:** Provides the stable partition of the system, organized by the flow of information/action rather than by components, so interfaces (what each stage produces) remain fixed even as component choices change. It is the reason the curriculum coheres as *one machine* and the map onto which every later module locates itself. Prevents the integration-class failures that arise when subsystems are designed without a shared functional backbone.
- **Mathematical foundations:** Primarily an architectural concept; quantified through the budgets that allocate each stage's requirements, the **cycle-time budget** ($T_\text{cycle} \le d/v$) and the **placement error budget** (RSS allocation), both introduced in Module 1, Section 7. These budgets convert the spine's qualitative stages into verifiable per-stage requirements.
- **Related concepts:** CEC-02 (the Grip-Force Window is the Act-stage physical constraint); the cycle-time and error budgets (Module 1 Section 7, candidate CEC-03, see *Watchlist*).
- **Module references:** Introduced M1 Section 6.4; budgets M1 Section 7; reinforced M2 to M12; mastered/applied M13; applied M17.
- **Knowledge-Architecture link:** thread *"Systems engineering & requirements"*, Introduced M1, Mastered M13, Applied M17.

---

### CEC-02: The Grip-Force Window

- **Concept ID:** CEC-02
- **Official name:** The Grip-Force Window
- **First introduced:** Module 2, Section 7.4
- **Mastered in:** Module 2
- **Reinforced in:** Module 7 (bounds the learned grasp-force policy), Module 9 (the requirement the fluid-powered gripper must satisfy)
- **Applied in:** Module 9 (gripper & force-control design), Module 14 (verification of grasp performance), Module 15 (safety bounds), Module 17 (Capstone)
- **Short definition:** A grasp on a heavy, bruise-prone fruit succeeds only inside a window bounded below by slip and above by bruising: $F_\text{slip} \le F_\text{grip} \le F_\text{bruise}$. The window can be narrow or empty; the design lever that opens it is **compliance**.
- **Engineering significance:** Converts the vague requirement "don't damage the fruit" into a two-sided, quantitative constraint every grasp must satisfy. Its narrowness is the quantitative argument for compliant, force-regulated gripping, and the relation $F_\text{bruise}\propto (E^\ast)^{-2}$ makes fluid-powered compliance a *derived* answer rather than an assumed one, the point at which the Fluid-Powered Physical AI thesis becomes a number. An empty window is a design defect, diagnosable and fixable via the physical levers (compliance, conformance, friction, gentler motion, added contacts).
- **Mathematical foundations:** Hertzian contact, $p_\text{max} = \left(6F(E^\ast)^2/\pi^3 R_\text{eff}^2\right)^{1/3}$, giving $F_\text{bruise} = \pi^3 R_\text{eff}^2 p_\text{br}^3 / 6(E^\ast)^2$; Coulomb friction, $F_\text{slip} = m(g+a_\text{dyn})/2\mu$; feasibility, $F_\text{slip} \le F_\text{bruise}$. (Module 2, Section 7.)
- **Related concepts:** CEC-01 (the Act-stage constraint on the spine); contact mechanics; compliance and force control; fluid power; the error budget (localization accuracy that lands the grasp inside the window).
- **Module references:** Introduced/mastered M2 Section 7.4; reinforced M7, M9; applied M9, M14, M15, M17.
- **Knowledge-Architecture link:** threads *"Fruit contact & damage mechanics"* (Mastered M2) and *"Force / compliance control"* (Introduced M2, Mastered M11/M9 context).

---

### CEC-03: The Placement Error Budget

- **Concept ID:** CEC-03
- **Official name:** The Placement (Localization) Error Budget
- **First introduced:** Module 1, Section 7.2 (error-budget seed)
- **Mastered in:** Module 5 (assembled in full, allocated, designated), Section 6.7/Section 7.5
- **Reinforced in:** Module 3, Section 7.5 (sensing terms $\sigma_Z,\sigma_\text{cal},\sigma_\text{he},\sigma_\text{sync}$ added)
- **Applied in:** Module 8 (mechanism-tolerance allocation $\sigma_\text{mech}$), Module 13 (integration), Module 14 (verification), Module 17 (Capstone)
- **Short definition:** Independent placement-error sources combine in quadrature, $\sigma_\text{place}=\sqrt{\sum_i\sigma_i^2}$, and the grasp succeeds only if $3\sigma_\text{place}\le c$, the capture tolerance tied to the Grip-Force Window (CEC-02). The budget both tests feasibility and allocates a maximum error to every subsystem.
- **Engineering significance:** Converts a single system-level accuracy requirement ("land the grasp inside the capture tolerance") into concrete, verifiable per-subsystem requirements, telling perception, calibration, estimation, and mechanism exactly how accurate each must be. It binds otherwise-independent subsystems into one accuracy contract, and its quadrature form reveals the dominant error source, which is where design effort should go (see EI-05). An empty budget (3σ > c) is a diagnosable design defect with named fixes (stage closer, recalibrate, tighten mechanism repeatability).
- **Mathematical foundations:** Root-sum-square combination $\sigma_\text{place}=\sqrt{\sum_i\sigma_i^2}$; the $3\sigma\le c$ acceptance rule; covariance propagation through transforms $\Sigma_y=J\Sigma_xJ^\top$ (Module 5, Section 7.2/Section 7.5); the stereo depth term $\sigma_Z\propto Z^2$ (Module 3, Section 7.3) as the frequent dominant contributor.
- **Related concepts:** CEC-02 (the capture tolerance $c$ the budget must meet); CEC-01 (the spine, a false position wastes a cycle); EI-05 (Attack the Dominant Error Source, the judgment that operates on this budget).
- **Module references:** Introduced M1 Section 7.2; sensing terms M3 Section 7.5; mastered/designated M5 Section 6.7/Section 7.5; applied M8, M13, M14, M17.
- **Knowledge-Architecture link:** thread *"Error budget & tolerance allocation"*, Introduced M1, Reinforced M3, Mastered M5, Applied M8/M13/M14; and the *"3-D geometry & localization"* / *"Sensor fusion & state estimation"* threads Mastered M5.

---

### CEC-04: The No-Cloud Edge Boundary

- **Concept ID:** CEC-04
- **Official name:** The No-Cloud Edge Boundary (Runtime / Development Partition)
- **First introduced:** Module 1 (SR-C-01, DD-4, the no-cloud constraint)
- **Mastered in:** Module 6 (edge deployment), Section 6.2/Section 11.3
- **Reinforced in:** Module 4, Section 17 (train off-robot / infer on-robot)
- **Applied in:** Module 7 (grasp-policy development vs. runtime), Module 9 (grasp control on the edge), Module 11 (real-time nodes), Module 12 (power/thermal), Module 13 (integration)
- **Short definition:** Every capability is partitioned into a **runtime** side (on-robot, inside the real-time control loop, with no network dependency) and a **development** side (off-robot: training, synthesis, calibration, compilation, analysis, updates). No runtime path may depend on an off-robot resource; the control loop closes entirely on-robot within latency, power, and thermal budgets.
- **Engineering significance:** A field has no guaranteed connectivity, so a control loop that depends on the network stalls when it drops. The boundary is a design *tool*: engineers apply it to classify each capability (runtime vs. development), to frame the on-robot optimization problem (fit runtime compute within budgets), and to *audit* the architecture for hidden cloud dependencies. It is enforceable in tooling (a build check that fails on a runtime off-robot reference), turning a principle into a verified property.
- **Mathematical foundations:** Not an equation but an architectural partition; its quantitative side is the compute budgets it governs, latency/throughput budgets, the roofline model (compute- vs memory-bound), Amdahl's law, and quantization-error vs. speed tradeoffs (Module 6, Section 6.4/Section 7).
- **Related concepts:** CEC-01 (the cycle-time budget the on-robot loop must meet); CEC-03 (compute latency becomes the σ_sync placement-error term); EI-04 (accuracy-vs-latency operating point on the edge); EI-06 (measure on the target); reinforces EI-05 (dominant latency).
- **Module references:** Introduced M1; reinforced M4 Section 17; mastered/designated M6 Section 6.2/Section 11.3; applied M7, M9, M11, M12, M13.
- **Knowledge-Architecture link:** thread *"Edge deployment & optimization"*, Mastered M6; *"Real-time systems"* Introduced M6, Mastered M11.

---

### CEC-05: The Sim-to-Real Pipeline

- **Concept ID:** CEC-05
- **Official name:** The Sim-to-Real Pipeline (Train-in-Simulation, Transfer-to-Field)
- **First introduced:** Module 4, Section 6.5/Section 12 (perception synthetic data & domain randomization), building on Module 3 virtual sensors
- **Mastered in:** Module 7 (grasp-policy sim-to-real, the full train->randomize->transfer->validate loop for a deployable bounded controller), Section 6.4/Section 11.3
- **Reinforced in:** Module 4 (perception data generation)
- **Applied in:** Module 9 (fluid-grasp control developed via the pipeline), Module 13 (system twin), Module 14 (transfer validation), Module 17 (Capstone)
- **Short definition:** Develop and validate learned behaviors in simulation under deliberately randomized conditions (domain randomization), then transfer to the field, **measuring and closing the reality gap** with real-data validation as an acceptance gate. A design tool for building learned components safely and cheaply before, and instead of, large-scale real-world experiments.
- **Engineering significance:** Real experiments for perception and especially grasping are slow, costly, and can destroy fruit; the digital twin supplies massive, safe, cheap, labeled experience. But a policy or model that overfits the simulator fails in the field, so the pipeline's discipline, randomize the conditions the learner must survive, then *validate on real data before trusting*, is what makes learned behavior deployable. It is the operational bridge across the development/runtime boundary (CEC-04): learning happens on the development side, but transfer must be earned and measured, never assumed.
- **Mathematical foundations:** Domain randomization as robust optimization, $\pi^\ast=\arg\max_\pi \mathbb{E}_{\xi\sim p(\xi)}[\mathbb{E}_\pi[G\mid\xi]]$ over randomized simulator parameters $\xi$; the reality gap as distribution shift between $p(\xi)$ and the field; the robustness-optimality tradeoff in choosing $p(\xi)$ (Module 7, Section 7.3).
- **Related concepts:** CEC-04 (development/runtime boundary, training is development-side); CEC-02 (the grasp reward's safety bound); EI-06 (measure on the target, validate on real); EI-07 (bound the learner that this pipeline trains).
- **Module references:** Introduced M4 Section 6.5/Section 12; reinforced M4; mastered/designated M7 Section 6.4/Section 11.3; applied M9, M13, M14, M17.
- **Knowledge-Architecture link:** thread *"Sim-to-real & synthetic data"*, Introduced M4, Mastered M7, Applied M9/M13/M14; supports the *"Decision & grasp policy"* thread Introduced M7 (mastered physically M9).

---

### CEC-06: The Simulation-First Fidelity Ladder

- **Concept ID:** CEC-06
- **Official name:** The Simulation-First Fidelity Ladder
- **First introduced:** Module 1 (simulation-first lifecycle seed); reinforced in every module's Simulation/Twin activities (M3 to M12)
- **Mastered in:** Module 13 (system-level twin fidelity management; the whole ladder assembled and CR-03 closed), Section 6.4/Section 11.3
- **Reinforced in:** M3 to M12 (each Sim/Twin activity is a fidelity-and-validation judgment); especially M9 (the contact/fluid rung specified)
- **Applied in:** M14 (V&V draws on the validated twin as evidence), M15 (safety case evidence), M17 (Capstone)
- **Short definition:** Match the fidelity of a model/simulation to the decision it must inform, identify where fidelity is *binding* (the decisions whose outcome changes across fidelity levels), and validate each rung against reality before trusting it, climbing the ladder (kinematic -> dynamic -> contact/fluid -> sensor-in-loop -> HIL -> prototype -> field) deliberately, spending fidelity effort where the decision is sensitive to it. The analytical tool that makes a simulation-first program *rigorous* rather than merely simulated.
- **Engineering significance:** A simulation-first program lives or dies on whether its simulations can be trusted for the decisions they inform. The ladder makes that trust earned and rung-specific: it prevents both *over-trusting* a low-fidelity sim (a grasp that "succeeds" in kinematics but bruises on real contact, CR-03) and *over-investing* in fidelity a decision does not need. It is what turns the digital twin from an optimistic guess into a validated *evidence source* for verification (M14) and the safety case (M15).
- **Mathematical foundations:** Fidelity-decision sensitivity $\partial D/\partial f$ (a decision is fidelity-sensitive if its outcome changes with fidelity level $f$; required fidelity = the lowest level at which $D$ stabilizes); per-rung reality gap $g_f=|\text{twin}_f-\text{real}|\le\text{tol}_f$ as the acceptance gate (Module 13, Section 7.1 to 7.2).
- **Related concepts:** CEC-05 (the sim-to-real *learning-transfer* pipeline, a learned-behavior tool; CEC-06 governs fidelity/validation of *any* model-based decision, physical or learned); CEC-03 (budgets validated per rung); EI-06 (measure on the target / validate against reality); EI-13 (integrate early using the twin). Distinct from the simulation-first *lifecycle* (a process/sequence); CEC-06 is the analytical judgment exercised within it.
- **Module references:** Introduced M1; reinforced M3 to M12; mastered/designated M13 Section 6.4/Section 11.3; applied M14, M15, M17.
- **Knowledge-Architecture link:** thread *"Simulation-first & digital twin"*, Introduced M1, Reinforced M3 to M12, Mastered M13, Applied M14/M15/M17.

---

## Watchlist (candidate CECs, not yet designated)

Concepts under evaluation. They will be promoted to the register only at their point of mastery and only if they meet the three-module recurrence test, per the designation discipline above.

| Candidate | Likely ID | Likely owner (mastery) | Rationale to watch |
|-----------|:---------:|------------------------|--------------------|
| *(none currently)* |, |, | The Simulation-First Fidelity Ladder was promoted to **CEC-06** at Module 13. No candidates are presently under evaluation; new candidates are added only if a genuinely enduring cross-module analytical tool emerges in M14 to M17. |

---

## Engineering Insights Index

Engineering Insights (EI) capture **engineering judgment**, memorable, transferable lessons that go beyond the mathematics and help students think like practicing engineers. They are numbered by owning module (EI-04 originates in Module 4) and applied **prospectively from Module 4** (Modules 1 to 3 are frozen and were not retrofitted). One per module by default; a second only for a genuinely independent, recurring lesson.

**Insight template** (used throughout): *ID, Title, one-sentence principle, brief explanation (1 to 3 paragraphs), why it matters for SIM2FIELD, related CECs, later modules where revisited.* Insights are not equations or definitions; they are judgment.

### EI-04: Optimize the Metric That Maps to the Mission

- **Insight ID:** EI-04
- **Title:** Optimize the Metric That Maps to the Mission
- **Owning module:** Module 4 (Section 7.4)
- **One-sentence principle:** Choose and tune your performance metric from the real-world consequence of each error, not from what is conventional, symmetric, or easy to report.
- **Explanation:** Every model or subsystem exposes a family of behaviors; selecting the one to deploy is an engineering decision, not a statistical default. When the cost of different error types is asymmetric, a symmetric metric (accuracy, F1) silently optimizes the wrong objective. The experienced engineer first writes down what each error *costs the mission*, then selects the operating point, and even the metric, that maximizes mission value, reaching for a bigger model only if that point is still inadequate. The trap it avoids is "leaderboard engineering": improving a convenient number while the thing that actually matters gets worse. The lesson generalizes beyond perception to latency budgets, safety thresholds, and control tolerances, all metric choices that should be derived from consequence.
- **Why it matters for SIM2FIELD:** Yield is the machine's economic reason to exist. Recall maps to yield (a missed ripe melon is lost revenue); precision maps to wasted pick cycles against the cycle-time budget (**CEC-01**). Setting the detector's operating point from this asymmetry, biasing toward recall, is the difference between a detector that scores well and a harvester that pays for itself.
- **Related Core Engineering Concepts:** CEC-01 (the Signal-to-Action Spine, perception serves the mission; false positives spend its cycle-time budget).
- **Revisited in:** M6 (accuracy-vs-latency operating point on the edge), M14 (validating whole-system harvest success, not component accuracy), M16 (yield -> techno-economics that quantify the cost ratio behind the operating point).

---

### EI-05: Attack the Dominant Error Source

- **Insight ID:** EI-05
- **Title:** Attack the Dominant Error Source
- **Owning module:** Module 5 (Section 7.4)
- **One-sentence principle:** In a quadrature (root-sum-square) budget, the largest term dominates the total, find it and reduce it first; effort spent shrinking small contributors is almost wasted.
- **Explanation:** The RSS math is unforgiving in a useful way: when one source dominates, the total is essentially that source, and improvements elsewhere stay invisible until the dominant term is brought down to the level of the others. Inexperienced engineers optimize the term they understand best or can change most easily; experienced engineers first *budget*, then identify the dominant contributor, spend their effort there, and repeat until no single term dominates. The habit generalizes to any additive budget, attack the critical path in a schedule, the biggest line item in a cost model, the highest-severity item in a risk register.
- **Why it matters for SIM2FIELD:** The placement budget (CEC-03) frequently has depth error at range as its dominant term, which is exactly why the architecture stages fruit to a close pick station (M3 DD-14) rather than chasing calibration to the third decimal. Knowing the dominant term tells you *which subsystem to improve* to land the grasp inside the Grip-Force Window (CEC-02), and stops wasted effort on terms that cannot move the total.
- **Related Core Engineering Concepts:** CEC-03 (the budget this insight operates on); CEC-02 (the tolerance it must meet).
- **Revisited in:** M6 (dominant latency in the cycle-time budget), M8 (dominant mechanism-tolerance term), M12 (dominant power/thermal load), M14 (dominant reliability risk).

---

### EI-06: Measure on the Target

- **Insight ID:** EI-06
- **Title:** Measure on the Target, Performance Intuition Lies
- **Owning module:** Module 6 (Section 6.4/Section 6.8)
- **One-sentence principle:** Never optimize from assumption; profile the real workload on the real hardware under real load, because the bottleneck, and the delivered performance, is almost never where intuition puts it.
- **Explanation:** Engineers routinely guess wrong about where time, power, and heat go. A "slow" model may be memory-bound rather than compute-bound; the real latency may hide in data movement or a synchronization stall; an accelerator's advertised throughput rarely survives contact with a real workload; and a device that passes cold throttles hot. The discipline is to instrument and measure on the *deployment target* under representative load *before* changing anything, attack the *measured* dominant cost (EI-05), then measure again. This defeats the twin traps of premature optimization (effort on a non-bottleneck) and platform substitution (a workstation is not the robot's edge device). It is the empirical partner to EI-05: you cannot attack the dominant term until you have honestly measured which term dominates.
- **Why it matters for SIM2FIELD:** The perception+control loop must fit latency, power, and thermal budgets on the actual on-robot device, not a laptop; latency measured on real hardware becomes σ_sync in the placement budget (CEC-03) and the perception share of the cycle-time budget (CEC-01). Guessing yields a machine that works in the lab and stalls, or overheats, in the field.
- **Related Core Engineering Concepts:** CEC-04 (the edge boundary and its compute budgets); CEC-01 (cycle-time); CEC-03 (latency -> σ_sync). Reinforces EI-05.
- **Revisited in:** M12 (power/thermal measured on hardware), M13 (integration / hardware-in-the-loop), M14 (verification on real hardware under field conditions).

---

### EI-07: Bound the Learner

- **Insight ID:** EI-07
- **Title:** Bound the Learner, A Policy Is a Proposal, Not an Authority
- **Owning module:** Module 7 (Section 6.5/Section 7.4)
- **One-sentence principle:** Never give a learned component unbounded authority over a physical action; wrap its output in a verified envelope and a deterministic fallback so the worst a wrong decision can do is bounded.
- **Explanation:** Learned policies are powerful but opaque and occasionally wrong in ways training never revealed. On a machine that exerts force on a fragile fruit and moves near people, an unbounded wrong action is unacceptable, and "train a better policy" never fully closes the risk, because an opaque policy cannot be verified the way a controller can. The experienced engineer treats the policy's output as a *proposal* that must pass through verified guards (physical limits, reach and keep-out, uncertainty checks) and is replaced by a deterministic fallback when rejected or unavailable. This bounds the blast radius of any learning failure and makes the *system* verifiable even though the *policy* is not. The judgment generalizes: wherever learning enters a consequential loop, design the envelope first.
- **Why it matters for SIM2FIELD:** The grasp policy proposes an approach and a force/compliance target; it is clipped to the Grip-Force Window (CEC-02), reach limits, and keep-out zones, and gated on pose covariance (CEC-03) and ripeness confidence (EI-04), with a deterministic fallback (a conservative fixed-compliance grasp or a skip) when out-of-bounds or too uncertain. This is what lets the machine use learning without risking the fruit or a bystander, and what lets the safety case be made about the bounds and fallback rather than the inscrutable policy.
- **Related Core Engineering Concepts:** CEC-02 (the window that bounds the grasp), CEC-05 (the pipeline that trains the bounded learner), CEC-04 (runtime boundary); reinforces the system-level AI rule from CEC-01.
- **Revisited in:** M9 (grasp force control with the window as the enforced bound), M11 (the independent safety monitor as an outer guard), M15 (safety & ethics, the bounded-learner safety case).

---

### EI-08: The Cheapest Degree of Freedom Is the One You Design Out

- **Insight ID:** EI-08
- **Title:** The Cheapest Degree of Freedom Is the One You Design Out
- **Owning module:** Module 8 (Section 7.5)
- **One-sentence principle:** Before adding an axis, joint, or sensor to solve a problem, ask whether the architecture can remove the need for it, a degree of freedom you never build costs nothing, never breaks, never needs calibration, and never hits a singularity.
- **Explanation:** Complexity accretes one reasonable-looking addition at a time, another joint for reach, another sensor for a corner case, each locally justified and collectively fatal, since every added DOF is more cost, mass, calibration, failure modes, control burden, and singular configurations. The experienced engineer's instinct runs the other way: reshape the *system* so the hard part disappears. The removed element is the most reliable one on the machine, because it does not exist. The judgment generalizes, the most robust component is the absent one, and architectural simplification usually beats component sophistication. It is not free, though: offloading a function couples the remaining system to whatever now supplies it, so the discipline is to move complexity to where it is cheapest to bear, not to pretend it vanished.
- **Why it matters for SIM2FIELD:** Letting the drive-over rover supply the fore/aft (x) motion removes an entire arm axis, making the manipulator a simple, stiff, closed-form-analyzable two-actuator mechanism whose workspace, precision (the σ_mech budget, CEC-03), and singularities can all be characterized exactly. That tractability, and the arm's ability to land the grasp inside the Grip-Force Window (CEC-02), is a direct dividend of the Module 1 systems decision. The cost is a real coupling: the mechanism's workspace now depends on track width and its timing on the drive (CEC-01).
- **Related Core Engineering Concepts:** CEC-01 (the DOF offload couples to the cycle-time/drive), CEC-03 (few DOF makes the precision budget analyzable), CEC-02 (a stiff, simple arm lands inside the window).
- **Revisited in:** M9 (fewer axes to force-control), M10 (the mobility platform that supplies the offloaded DOF), M13 (the track-width/stability integration tradeoff).

---

### EI-09: Let the Physics Regulate

- **Insight ID:** EI-09
- **Title:** Let the Physics Regulate, Passive Compliance Is Control You Can Trust
- **Owning module:** Module 9 (Section 6.6/Section 6.8/Section 6.9)
- **One-sentence principle:** Design inherent mechanical compliance into an interaction so the mechanism regulates force and fails gently on its own, reducing what the active controller, sensor, and compute must do, and must get right.
- **Explanation:** Active control is fast but fallible, it depends on sensing, computation, and timing that can lag, err, or drop out, and a stiff actuator under pure active control transmits the full consequence of any error straight into the environment. Passive compliance changes the *failure mode*: a fluid-backed, back-drivable actuator absorbs a mistimed or wrong command, yielding rather than crushing, so the worst case is bounded by physics, not by software correctness. The experienced engineer therefore places as much regulation as possible in the mechanics, compliance, back-drivability, mechanical limits, relief valves, and reserves active control for the refinement physics cannot provide. This makes the system both more robust (fewer things must be right) and safer (failures degrade gently). Distinct from EI-08 (which removes a degree of freedom via architecture), EI-09 exploits inherent *dynamics* to reduce control burden and guarantee a safe worst case. The judgment: prefer inherent, always-on physical guarantees over computed ones for the consequences you cannot afford.
- **Why it matters for SIM2FIELD:** The fluid-powered compliant gripper holds a heavy, bruise-prone fruit; compliance keeps peak pressure low passively (CEC-02), back-drivability absorbs placement error (CEC-03) and control latency (CEC-04), and a mechanical pressure relief makes "never exceed the bruise force" a physical fact regardless of what the AI or controller commands. The AI makes the grasp *good*; the physics makes it *safe*, which is why Fluid-Powered Physical AI pairs fluid compliance with AI rather than relying on AI alone.
- **Related Core Engineering Concepts:** CEC-02 (compliance opens/holds the window passively), CEC-03 (compliance absorbs residual placement error), CEC-04 (compliance relaxes the control-latency requirement); reinforces EI-07 (physics is the ultimate bound on the learner) and shares a family with EI-08.
- **Revisited in:** M11 (control architecture and the safety monitor), M13 (integration), M15 (safety & ethics, compliance and relief as inherent safety properties).

---

### EI-10: The Field Is the Spec

- **Insight ID:** EI-10
- **Title:** The Field Is the Spec, Design for the Envelope's Edges, Not the Demo Row
- **Owning module:** Module 10 (Section 6.6)
- **One-sentence principle:** A field robot is judged by how it handles the hardest conditions in its operating envelope, the steepest slope, the roughest terrain, the tightest headland, the worst light, so define the envelope explicitly and design and validate at its edges, not at the comfortable average.
- **Explanation:** Systems that work "usually" fail in deployment, because the field reliably presents the rare-but-inevitable hard case, and a machine that stalls on a small fraction of rows can be uneconomical or unsafe. The average condition is not the requirement; the operating envelope's corners are. Experienced engineers name the envelope (slope, terrain roughness, crop density, weather, light) up front, design for its edges with margin, and validate there, because the demo row proves nothing about the row that breaks the machine. This is distinct from EI-06 ("measure on the target," about honest measurement): EI-10 is about *choosing the design and validation point at the envelope's edge*. It is the difference between a prototype and a product.
- **Why it matters for SIM2FIELD:** The harvester must drive uneven, sloped, dusty rows while straddling a bed and carrying a swinging 5 to 10 kg payload, turning at headlands, keeping the bed centered so the arm's fixed workspace (M8) covers the fruit. A machine stable and accurate on flat ground can tip or lose the bed on a slope, so drive speed (CEC-01), stability margin, and navigation accuracy (CEC-03) must be designed for the worst row in the field, not the test plot, and coverage of the whole field, including its hard corners, is what makes the machine pay (M16).
- **Related Core Engineering Concepts:** CEC-01 (drive speed within the envelope), CEC-03 (navigation accuracy keeps fruit in the workspace across conditions); reinforces EI-06 (measure the real field) and EI-08 (the offloaded DOF must work across the envelope).
- **Revisited in:** M12 (environmental/thermal envelope), M14 (V&V across the envelope), M15 (safety across the envelope), M16 (deployment, reliability, and coverage economics).

---

### EI-11: Make the Guard Independent of What It Guards

- **Insight ID:** EI-11
- **Title:** Make the Guard Independent of What It Guards
- **Owning module:** Module 11 (Section 6.6)
- **One-sentence principle:** A safety function that depends on the correctness of the thing it protects against is not a safety function, build the guard with its own inputs, its own verified logic, and its own execution context so the failure it guards against cannot also disable it.
- **Explanation:** Guards accrete naturally around a complex system (a bound here, a limit there), but a guard sharing logic, threads, clock, or fate with the component it protects fails exactly when that component fails, precisely when it is needed. The experienced engineer makes the safety function *independent*: it observes the hazard through its own sensing, decides with simple verified logic that does not trust the mission or the learned policy, and acts through a path that does not depend on the subsystem it might have to stop. Independence is what turns a pile of guards into a safety function, and it is best reinforced by *defense in depth*, an independent monitor layered with physics-speed physical bounds, so no single failure defeats safety. This is distinct from EI-07 (bound the learner) and EI-09 (let physics regulate): those establish *what* the bounds are; EI-11 establishes that the *enforcer* of those bounds must not share fate with what it constrains.
- **Why it matters for SIM2FIELD:** The machine exerts force on fragile fruit and moves a heavy payload near people. Every module produced a guard (grasp bound M7, singularity keep-out M8, mechanical relief/compliance M9, stability limit M10); M11 composes them under an **independent safety monitor** that can command a safe stop or gentle release regardless of what the behavior node or grasp policy believes, plus a minimal hardware safety controller for the last-resort stop that depends on no software. Combined with the physics-speed bounds (relief, compliance, EI-09), the machine has defense in depth: physical bounds that cannot be commanded past, an independent monitor that can always stop it, and learned components bounded by both (EI-07).
- **Related Core Engineering Concepts:** CEC-01 (worst-case timing composition is the cycle-time budget applied to software), CEC-03 (time sync / message age), CEC-04 (all on-robot, no cloud in the safety loop); reinforces EI-07 (bound the learner) and EI-09 (physical bounds act beneath the monitor).
- **Revisited in:** M13 (integration/bring-up of the safety architecture), M14 (V&V, fault-injection and timing evidence), M15 (safety & ethics, the certified safety case, independence hardening, residual risk).

---

### EI-12: Size to the Worst-Case Operating Point

- **Insight ID:** EI-12
- **Title:** Size to the Worst-Case Operating Point, Not the Nameplate
- **Owning module:** Module 12 (Section 6.2 to 6.5)
- **One-sentence principle:** Size energy, power delivery, and cooling for the coincident worst-case operating point the field will actually deliver, hot, dusty, peak concurrent load, sagging battery, not for datasheet-nominal, room-temperature numbers.
- **Explanation:** Budgets built from nameplate figures fail at the operating point that matters, because peaks coincide, efficiencies fall at temperature, batteries sag under load and cold, and the sun adds heat the datasheet never mentioned. The experienced engineer identifies the *coincident* worst case, the loads that spike together, at the envelope's temperature extreme, with degraded airflow and a half-discharged store, and sizes to it with margin. This is the concrete sizing discipline behind EI-10 (the field is the spec): where EI-10 says design and validate at the envelope's edges, EI-12 says *the numbers you size to are the edge numbers, not the average ones.* A machine sized to nameplate works in the demo and quietly fails in July.
- **Why it matters for SIM2FIELD:** The harvester's battery and cooling must carry a full shift on a 45 °C afternoon at coincident peak (drive on a slope + fluid pump cycling + an inference burst) with dust-clogged airflow and a sagging battery. Sized to a 20 °C bench with clean airflow and average draw, the machine browns out or throttles the edge compute, and throttling blows the cycle-time budget (CEC-01), missing fruit. Sizing to the coincident worst case with margin is what lets the machine work the whole field, the whole day.
- **Related Core Engineering Concepts:** CEC-01 (throttling at the thermal edge is a cycle-time failure), CEC-03 (the power/thermal budget reuses the sum-and-attack-the-dominant-term method), CEC-04 (all loads on-robot); reinforces EI-05 (attack the dominant load) and EI-10 (the field is the spec).
- **Revisited in:** M13 (integration under load), M14 (V&V at the envelope edge), M15 (power/thermal + stored-energy safety), M16 (endurance and coverage economics).

---

### EI-13: Integrate Early and Often

- **Insight ID:** EI-13
- **Title:** Integrate Early and Often, The Surprises Live Between the Modules
- **Owning module:** Module 13 (Section 6.1/Section 6.6)
- **One-sentence principle:** The failures that matter most at the system level are the interactions no module owns, resource contention, timing coupling, interface drift, dynamic coupling, so integrate continuously (in the twin first) rather than at the end, and expect the system to behave differently than the sum of its verified parts.
- **Explanation:** Each subsystem can pass its own tests and the machine still fail, because emergent behavior is invisible in a validated part and appears only when the parts run together. Big-bang integration at the end of a program hides which interaction broke; incremental, continuous integration adds one interface at a time and localizes each surprise to the subsystem that introduced it, an $O(n)$ debug path instead of an $O(n^2)$ interaction search. The digital twin is what makes early, continuous integration affordable and safe: the surprises surface cheaply in simulation before steel and fluid are committed. The experienced engineer therefore treats integration as a distinct, continuous engineering activity, a place to *hunt* emergence, not a final assembly step.
- **Why it matters for SIM2FIELD:** The machine's hardest failure class (Module 1) is integration failure. Couplings that no single module modeled, arm swing eroding platform stability on a slope (M8/M9/M10), fluid compliance softening placement stiffness (M9/M8), perception/control/navigation contending for the edge device's compute and power (M6/M11/M12), one loop's jitter perturbing another (M11), appear only when everything runs together. Integrating early and continuously in the twin surfaces these cheaply, which is the whole point of the simulation-first bet.
- **Related Core Engineering Concepts:** CEC-06 (the twin, at matched validated fidelity, makes early integration cheap and trustworthy); CEC-01 and CEC-03 (the budgets whose *composition* integration verifies); reinforces EI-11 (the safety architecture must be verified in the integrated system, not in isolation).
- **Revisited in:** M14 (V&V, integrated test campaigns and emergent-behavior discovery), M15 (safety, integrated hazards), M17 (Capstone, full-system integration).

---

### EI-14: Validate Adversarially

- **Insight ID:** EI-14
- **Title:** Validate Adversarially, Try to Break It Before the Field Does
- **Owning module:** Module 14 (Section 6.5)
- **One-sentence principle:** Validation that only demonstrates success proves little; prove a machine by deliberately seeking the conditions that break it, the operating envelope's hardest cases, because the field will run that adversarial test whether or not you did.
- **Explanation:** A machine shown on the easy row proves only that it can do the easy row. The failures that end a program appear at the envelope's edges (steep slope, worst light, dense occlusion, most-variable fruit, dustiest air, most-worn state), so validation must go looking for them: design tests to *fail* the machine, find where it fails, and either fix it or bound the envelope honestly. A corollary the experienced engineer trusts: a validation campaign that finds *no* failures is more suspicious than one that finds and fixes several, it usually means the tests were too easy, not that the machine is flawless. This is distinct from EI-10 (which says *design* to the envelope's edges): EI-14 is the *proving-stage* discipline of actively attacking those edges to generate honest evidence, and it applies with special force to opaque learned components that cannot be verified by inspection.
- **Why it matters for SIM2FIELD:** The harvester's grasp-success and no-bruise rates, its stability, and its perception all degrade at the envelope's hard cases, and its learned components (M4/M7) are unverifiable by inspection, so their trustworthiness must be *earned* by statistical, adversarial validation across the envelope (EI-10) and by fault injection against the safety architecture (EI-11). Demonstrating easy successes would hide exactly the failures the grower's field will find; adversarial validation surfaces them first, at the engineer's cost rather than the grower's.
- **Related Core Engineering Concepts:** CEC-06 (adversarial claims are often fidelity-sensitive and field-mandatory); CEC-02/CEC-03 (the grasp and placement claims validated adversarially); reinforces EI-10 (the field is the spec), EI-05 (adversarial testing reveals the dominant failure mode), and EI-07/EI-11 (verifying the bounds and monitor hold under attack).
- **Revisited in:** M15 (safety, adversarial hazard analysis and fault injection), M16 (deployment, field validation and reliability in real conditions), M17 (Capstone, acceptance by adversarial validation).

---

### EI-15: Safety Is a Property You Argue For

- **Insight ID:** EI-15
- **Title:** Safety Is a Property You Argue For, Not a Box You Check
- **Owning module:** Module 15 (Section 6.1/Section 6.6/Section 6.7)
- **One-sentence principle:** Safety is not a feature you add but an explicit, evidence-backed, falsifiable argument that residual risk is acceptable, a claim a skeptical reviewer could attack, so build that argument honestly, including where it is weakest.
- **Explanation:** A pile of guards is not safety; safety is the *composition* of mitigations plus the structured argument that, given the evidence, the residual risk is acceptable. "We added guards" is not an answer to "is it safe?"; "here is the hazard, the mitigation, the evidence and its fidelity, and the residual risk, and here is why that residual is acceptable" is. The argument must be falsifiable, a safety claim no reviewer can challenge is one no one has actually checked, which is why an honest safety case *states* its residual risk (a nonzero value argued acceptable beats a claimed zero) and invites adversarial review. This is the meta-insight that binds the course's judgment lessons: physical bounds (EI-09), a bounded learner (EI-07), an independent monitor (EI-11), respected envelope limits (EI-10/EI-12), verified adversarially (EI-14) on fidelity-appropriate evidence (CEC-06), none of it is *safety* until it is argued.
- **Why it matters for SIM2FIELD:** The harvester swings a heavy payload, moves on slopes, stores energy in two domains (fluid + electrical), and makes decisions with opaque learned components near people. Certifying it safe means assembling all its defense-in-depth layers into one goal-structured safety case on the V&V evidence, certifying the independence its layers depend on, stating the residual risk explicitly, and letting a reviewer attack it, because a machine deployed on an unfalsifiable safety claim is a machine no one has actually proven safe, and the people who share its field bear the cost of that gap.
- **Related Core Engineering Concepts:** CEC-06 (safety evidence carries its validated fidelity rung; inadmissible evidence weakens the argument); reinforces EI-07/EI-09/EI-11 (the mitigations the argument certifies), EI-10/EI-12 (the envelope the argument bounds), and EI-14 (the adversarial validation that supplies honest evidence).
- **Revisited in:** M16 (deployment decision and operating limits rest on the safety case), M17 (Capstone, the machine's acceptance is its safety case surviving review).

---

### EI-16: The Machine That Ships Is the One That Pencils Out

- **Insight ID:** EI-16
- **Title:** The Machine That Ships Is the One That Pencils Out
- **Owning module:** Module 16 (Section 6.1 to 6.3)
- **One-sentence principle:** Technical excellence that does not close the business case does not deploy, so cost, manufacturability, and deployment economics are engineering requirements from the start, not an afterthought bolted on at the end.
- **Explanation:** A machine that works but exceeds the cost-per-acre of the alternative it would replace never reaches a field: the grower will not buy, the investor will not fund, and the crop keeps being harvested the old way. The experienced engineer therefore treats cost, manufacturability, and deployment economics as first-class requirements that shape every design decision, and assembles the unit economics from the engineering itself, throughput (CEC-01), coverage and endurance (M10/M12), uptime (M14), and *marketable* yield (the bruise/miss rate, M9/CEC-02, is revenue). The deploy decision is honest and tri-state, deploy / deploy-with-limits / not-yet, and remains a *projection* until a pilot validates it in the real field (CEC-06/EI-14). Cost is itself a budget with a dominant term (EI-05): the machine is made affordable by attacking the dominant cost driver, not by trimming cheap parts.
- **Why it matters for SIM2FIELD:** Module 1 set a ~$50k prototype cost and a mission to harvest economically; every downstream choice, the single arm, the DOF reduction (EI-08), the pneumatic gripper (M9), the edge-compute sizing (M6), was partly a cost decision serving the deployment case. This module adds them up and tests the total against manual harvest, showing the machine pays only under a high-utilization service model and only within a defined deployment envelope (EI-10), the honest answer to whether the whole course's work reaches a real field.
- **Related Core Engineering Concepts:** CEC-01 (throughput -> economics), CEC-02 (bruise rate -> marketable yield/revenue), CEC-06 (the cost model is a projection until pilot-validated); reinforces EI-05 (attack the dominant cost driver), EI-10 (design to the deployment envelope), EI-12 (endurance -> coverage/uptime), and EI-15 (deploy honestly, within the safety limits).
- **Revisited in:** M17 (Capstone, the machine's acceptance requires that it works, is safe, *and* pencils out).

---

### EI-17: Optimize the System, Not the Subsystem

- **Insight ID:** EI-17
- **Title:** Optimize the System, Not the Subsystem, The Whole Is a Negotiation You Must Own
- **Owning module:** Module 17 (Capstone) (Section 6.3/Section 11.1)
- **One-sentence principle:** The best machine is never the sum of locally-optimal subsystems; it is a negotiated whole in which each part is deliberately compromised to serve the system, and the engineer's central responsibility is to own that whole, the budgets that compose, the tradeoffs that couple, the emergent behavior no subsystem owns, and the residual risk and limits.
- **Explanation:** Local optima do not sum to the system optimum. The course proved this repeatedly: the arm was made simple by giving up a degree of freedom (EI-08); the gripper traded stiffness for compliance (EI-09); the perception model traded recall for power and cost (EI-04/EI-05); the track width was negotiated among reach, stability, and maneuverability (M8/M10). Designing the machine *is* managing these negotiations, holding competing goods together and deciding among them with defensible reasons, and then owning the result: being accountable for the composed budgets, the coupled tradeoffs, the emergent behavior, the residual risk, the where-not-to-deploy, and the labor/equity consequences. This is the meta-insight every prior Engineering Insight was an instance of; it is the disposition that separates a subsystem specialist from a systems engineer, and it can only be taught where the whole must be composed at once, the capstone.
- **Why it matters for SIM2FIELD:** The whole course was a sequence of deliberate subsystem compromises made for the system's sake, and the capstone is where they must cohere into one machine that works, is proven, is safe, and pencils out. A design that optimizes each subsystem in isolation misses its composed budgets, its economics, or its safety; a design that composes them, and whose engineer owns the residual honestly, is the course's true deliverable and the enduring practice the graduate carries to the next physical-AI system.
- **Related Core Engineering Concepts:** CEC-01 (the systems spine taken to its conclusion, the whole); composes all six anchors together; reinforces EI-13 (integrate early to find emergence), EI-15 (own and argue the residual honestly), and EI-16 (the negotiated whole must also pencil out).
- **Revisited in:** every future physical-AI system the graduate designs, the meta-insight is the course's destination.

---

| Rev | Date | Change |
|-----|------|--------|
| 1.0 | (this pass) | Register created. Designated CEC-01 (Signal-to-Action Spine) and CEC-02 (Grip-Force Window); anchored into Modules 1 and 2 (Rev 1.1). Established the watchlist (candidate CEC-03 = Error Budget, to be designated at M5). |
| 1.1 | (this pass) | Added the **Engineering Insights Index** and the CEC/EI Design Rule. Registered **EI-04** (Optimize the Metric That Maps to the Mission), originating in Module 4. Added the Synthetic-Data / Sim-to-Real Pipeline to the CEC watchlist (designate at M7). |
| 1.2 | (this pass) | **Promoted CEC-03 (The Placement Error Budget)** from watchlist to full designation at its Module 5 mastery; removed it from the watchlist and anchored it into Module 5. Registered **EI-05** (Attack the Dominant Error Source), originating in Module 5. Marked the error-budget thread Mastered at M5 in the Knowledge-Architecture links. |
| 1.3 | (this pass) | **Promoted CEC-04 (The No-Cloud Edge Boundary)** from watchlist to full designation at its Module 6 mastery; removed it from the watchlist and anchored it into Module 6. Registered **EI-06** (Measure on the Target), originating in Module 6. Explicitly declined to mint a separate latency-budget CEC (kept within the CEC-01 budget family) to preserve a small anchor set. |
| 1.4 | (this pass) | **Promoted CEC-05 (The Sim-to-Real Pipeline)** from watchlist to full designation at its Module 7 mastery; removed it from the watchlist and anchored it into Module 7. Registered **EI-07** (Bound the Learner), originating in Module 7. Declined to mint RL/imitation as a separate CEC (kept as a technique in the decision thread). Anchor set now 5 CECs + 4 EIs. |
| 1.5 | (this pass) | Registered **EI-08** (The Cheapest Degree of Freedom Is the One You Design Out), originating in Module 8. **No new CEC** minted at M8: kinematics/Jacobian is a technique, and the σ_mech work is CEC-03 *applied*, explicitly declined to over-mint. Anchor set now 5 CECs + 5 EIs. |
| 1.6 | (this pass) | Registered **EI-09** (Let the Physics Regulate), originating in Module 9 (fluid-power mastery). **No new CEC** minted at this mastery point by deliberate restraint: CEC-02 (Grip-Force Window) already anchors fluid-powered compliance and is *realized* here, a fluid-force-control CEC would duplicate it. Flagged in the M9 quality summary as a one-line register change if a distinct fluid-power CEC is preferred. Anchor set now 5 CECs + 6 EIs. |
| 1.7 | (this pass) | Registered **EI-10** (The Field Is the Spec), originating in Module 10. **No new CEC** minted: mobility/navigation/stability are techniques, and the drive-speed and lateral-navigation budgets are CEC-01 and CEC-03 *applied*. Module 10 resolves the M8 track-width tradeoff (SR-I-11). Anchor set now 5 CECs + 7 EIs. |
| 1.8 | (this pass) | Registered **EI-11** (Make the Guard Independent of What It Guards), originating in Module 11. **No new CEC** minted: ROS 2 / real-time scheduling are techniques, worst-case latency composition is CEC-01 *applied* (feeding CEC-03 σ_sync), and the independent-safety-monitor / defense-in-depth architecture is judgment + a Knowledge-Architecture thread carried into the M15 safety case, not a new analytical design tool. Anchor set now 5 CECs + 8 EIs. |
| 1.9 | (this pass) | Registered **EI-12** (Size to the Worst-Case Operating Point), originating in Module 12. **No new CEC** minted: the power and thermal budgets are the CEC-03 budget-and-attack-the-dominant-term method (EI-05) *applied* to energy and heat, one enduring analytical tool spanning accuracy, energy, and heat, not three parallel CECs. Anchor set now 5 CECs + 9 EIs. |
| 1.10 | (this pass) | **Promoted CEC-06 (The Simulation-First Fidelity Ladder)** from watchlist to full designation at its Module 13 mastery, the scheduled evaluation point. Argued against three tests (recurrence across M3 to M12; analytical, not procedural; distinct from CEC-05 which transfers *learned* behaviors while CEC-06 governs fidelity/validation of *any* model-based decision). First new CEC since CEC-05 (M7); the intervening M8 to M12 all correctly declined, making this promotion credible rather than inflationary. Watchlist now empty. Registered **EI-13** (Integrate Early and Often), originating in Module 13. Anchor set now **6 CECs + 10 EIs**. |
| 1.11 | (this pass) | Recorded the **CEC-set-complete** direction (instructor, after M13): CEC-01...CEC-06 are the complete anchor set; M14 to M17 mint no new CEC barring an extraordinary case. Registered **EI-14** (Validate Adversarially), originating in Module 14. **No new CEC** at M14: evidence-to-fidelity matching is CEC-06 *applied*; dominant-failure-mode attack is EI-05 *applied*, the set covers the proving domain. Anchor set now **6 CECs + 11 EIs**. |
| 1.12 | (this pass) | Registered **EI-15** (Safety Is a Property You Argue For), originating in Module 15. **No new CEC**: M15 *certifies* the defense-in-depth thread (EI-07/EI-09/EI-11) that M11 declined to mint as a CEC, safety is the composition of existing anchors, argued, on CEC-06 evidence. The instructor reaffirmed the set-complete decision at M14. Anchor set now **6 CECs + 12 EIs**. |
| 1.13 | (this pass) | Registered **EI-16** (The Machine That Ships Is the One That Pencils Out), originating in Module 16. **No new CEC**: the cost budget is the CEC-03 budget-and-attack-the-dominant-term method (EI-05) *applied* to money, the **fourth** quantity one analytical tool now governs (accuracy, energy/heat, reliability, cost), the strongest vindication of the small anchor set. Set-complete decision reaffirmed at M15. Anchor set now **6 CECs + 13 EIs**. |
| 1.14 | (this pass) | Registered **EI-17** (Optimize the System, Not the Subsystem, Own the Whole), originating in Module 17 (Capstone), the course's final, synthesizing meta-insight, the lesson every prior EI instantiated. **No new CEC**: the capstone *exercises* all six CECs together and mints none; system-level synthesis is CEC-01's systems view taken to its conclusion. **CURRICULUM COMPLETE: 17 modules (M1 to M17), all frozen or pending final approval, anchored by the final set of 6 CECs + 14 EIs (EI-04...EI-17).** The CEC set closed at six per instructor direction after M13; the EI set lands at 14, within the ~15 to 20 target range given one-per-module from M4. |
