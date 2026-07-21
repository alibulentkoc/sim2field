# Module 4: Vision & Deep Learning for Detection & Ripeness

**Course:** SIM2FIELD, Autonomous Watermelon Harvesting Robotics
**Module ID:** M4, **Part II, Perceive**
**Template:** 30-section module standard, **Delivery:** tiered (core authored in full; CAD/figures/animations/HTML widgets as build specifications)
**Estimated time:** 5 contact hours + a 2 to 3 hour laboratory + homework
**Lifecycle stage (this module):** Simulation (synthetic data) + Software-in-the-Loop (model in the loop)
**Prerequisites:** M1 (spine, budgets), M2 (ripeness cues, Grip-Force Window), M3 (sensor suite, the model's input space, virtual sensors). Math: probability, linear algebra.
**Revision:** **1.0, frozen baseline (approved).** Controlled changes only, and only if a future architectural conflict requires one.

> **Authoring note (governance).** Consistent with frozen **Modules 1 to 3 (Rev 1.1/1.1/, )**, the Phase-0 Foundation, and the Phase-1 Curriculum Architecture. P0-document authority tagged **[->Doc B/E/G/H/I]**; perishable/vendor values tagged **[VERIFY@PUB]**. Recurring anchors are cited per the [Concept & Insight Register](curriculum/_core-concepts.md). **New this module:** the first **Engineering Insight** (EI-04), per the Engineering Insight convention (prospective from Module 4).

> *Core concept in use.* This module is the intelligence of the **Perceive** stage of **CEC-01 (the Signal-to-Action Spine)**. It consumes the sensor suite chosen in M3 and produces the detected, classified fruit that M5 localizes and the **Act** stage grasps.

---

## 1. Module Overview

**Mission.** This module builds the intelligence that turns the sensors' output into meaning. Given stereo-RGB and NIR imagery of a canopy, the perception model must answer three questions for every candidate fruit: is it there (detection), exactly where is its extent (instance segmentation, so the grasp knows the fruit's boundary), and is it ripe (classification).

**Previous milestone.** Module 3 chose the sensors. The model must do this against the two adversaries Module 2 named, camouflage (green on green) and occlusion, under the lighting extremes Module 3 characterized.

**Engineering problem.** The naive framing of this module is "train a neural network." The engineering framing, the one that separates a demo from a harvester, is different: the model is only as good as the objective you optimize and the data you feed it. So this module gives equal weight to three things: the model (architecture and training), the metric (which is a design decision with economic consequences), and the data (including synthetic data generated in the digital twin).

**Design tension.** A larger network tuned to the wrong metric harvests less fruit than a smaller one tuned to the right one; a model trained on data that does not span the field's variability fails in the field regardless of its benchmark score. The module's central quantitative result is the operating-point decision: where to set the detector's confidence threshold, derived not from a leaderboard but from the asymmetric cost of errors on this machine, a missed ripe melon is lost revenue, a false detection is a wasted pick cycle.

**What this module resolves.** That derivation crystallizes into this module's Engineering Insight (EI-04), the first of the curriculum's practical-judgment anchors: the machine turns canopy imagery into trustworthy per-fruit detection, extent, and ripeness decisions, with the operating point set by economics rather than by a benchmark.


## 2. Learning Objectives

- **LO-M4.1** Explain how convolutional networks extract hierarchical image features and why they suit fruit detection under camouflage., *Bloom: Understand*
- **LO-M4.2** Compare detection/segmentation architectures (single-stage, two-stage, transformer-based) and select one against real-time and accuracy constraints., *Bloom: Evaluate*
- **LO-M4.3** Define and compute detection metrics (precision, recall, IoU, mAP) and interpret a precision-recall curve., *Bloom: Apply*
- **LO-M4.4** Derive a detector operating point from the mission's asymmetric error costs, protecting yield., *Bloom: Analyze (with Evaluate)*
- **LO-M4.5** Design a data strategy, real capture, annotation, and synthetic-data generation in the twin, that spans field variability., *Bloom: Create*
- **LO-M4.6** Execute the development-time AI lifecycle (dataset -> train -> validate -> benchmark) and distinguish it from the runtime system., *Bloom: Apply (with Analyze)*
- **LO-M4.7** Specify the digital twin's role as a labeled-scene generator and perception regression test-bed., *Bloom: Create*

Maps to course objectives **LO3** (primary), **LO4** (reinforcing), and ABET **SO1, SO6, SO7**. [->Doc I]

---

## 3. Student Outcomes

A student who has mastered this module can, without prompting:

1. Explain, to a non-specialist, why detection here is a learning problem and not a color threshold., *Bloom: Understand*
2. Select and justify a detection/segmentation architecture for a real-time edge harvester., *Bloom: Evaluate*
3. Compute precision, recall, IoU, and mAP from raw predictions and read a PR curve., *Bloom: Apply*
4. Choose a confidence threshold from an error-cost model and defend it in yield terms., *Bloom: Analyze (with Evaluate)*
5. Design a labeled dataset, real plus synthetic, that covers the field's variability, and justify the split., *Bloom: Create*
6. Distinguish development-time training from runtime inference and place each correctly., *Bloom: Analyze*
7. Specify how the twin generates labeled scenes and regression-tests the detector., *Bloom: Create*

---

## 4. Engineering Motivation

The perception failure that opens Module 1's taxonomy is, in practice, usually a *data* or *metric* failure disguised as a model failure. A detector that scores well on a curated benchmark and then misses a quarter of the crop in the field has not failed at deep learning; it has failed at engineering, it was optimized for the wrong number, or trained on data that did not resemble the field. This module exists to prevent that, and it treats the model as one of three co-equal design objects: architecture, metric, and data.

Consider the stakes concretely. The machine's economic purpose is yield, fruit harvested per pass. Every ripe melon the detector misses (a false negative) is revenue left in the field; every phantom detection (a false positive) sends the manipulator on a wasted cycle that spends the cycle-time budget (CEC-01). These costs are **not symmetric**, and a model tuned to a symmetric metric like overall accuracy quietly optimizes the wrong thing. Meanwhile the camouflage and occlusion that make the problem hard are exactly the conditions under-represented in casual datasets, so a data strategy that does not deliberately span the field's variability bakes in field failure.

The motivation, then, is judgment as much as technique: a practicing perception engineer spends as much effort defining the objective and curating the data as designing the network, because on a real machine, those are where performance is won or lost. This module builds that judgment, and names it as the module's Engineering Insight.

---

## Engineering Failure Cases (perception-model-specific)

Sharpening Module 1's *perception* failure class to its roots in the model, metric, and data:

- **Metric-mission mismatch.** The model was tuned to accuracy or F1, not to the recall the mission needs; it looks good on paper and leaves fruit in the field. *Motivates* the operating-point derivation (Section 7.4) and EI-04.
- **Distribution shift (train ≠ field).** Training data lacked the field's lighting, occlusion, or ripeness variability; the model generalizes poorly where it matters. *Motivates* the data-strategy design (Section 6.5) and synthetic-data coverage (Section 12).
- **Sim-to-real gap.** Synthetic training data was too clean or too uniform; the model overfits the renderer and fails on real imagery. *Motivates* domain randomization and the sim-to-real validation discipline (Section 11.2, Section 12).
- **Latency overrun.** The most accurate model cannot run within the cycle-time budget on the edge device; accuracy that arrives too late is worthless. *Motivates* the architecture trade against latency (Section 11.1) and the hand-off to edge optimization (M6).

Each is a design decision away from prevention, and each maps to an activity in this module.

---

## 5. Background Knowledge

**Assumed (from prerequisites):** probability (distributions, conditional probability, expectation, for metrics and loss); linear algebra (tensors, matrix operations, for convolutions and networks); the M1 budget/spine vocabulary; the M2 ripeness-cue catalog (the classification target); the M3 sensor suite (the model's input channels) and virtual sensors (the synthetic-data renderers).

**Introduced here, used later:** the vocabulary of learned perception, *convolution, feature map, backbone, detection head, instance segmentation, anchor, loss function, backpropagation, transfer learning, precision/recall/IoU/mAP, operating point/threshold, domain randomization, sim-to-real*. Networks are treated at applied (L2) depth with an L3 grad extension; full optimization theory is referenced [->Doc H].

**Where this sits in the dependency graph.** M4 hard-depends on M3 (input space) and M1/M2. It **masters** the deep-learning detection & ripeness thread; **reinforces** edge-deployment (models to be optimized in M6) and the systems/spine thread; and hands forward detected, segmented, ripeness-classified fruit to M5 (localization/fusion), the model's compute/latency profile to M6 (edge), and the perception node interface to M11 (ROS 2).

---

## 6. Theory

### 6.1 Why learning, not thresholding
A mature watermelon is green against green leaves in variable light, often partly hidden. No fixed rule over color or edges separates fruit from canopy across the field's variability. Learned models succeed because they extract **hierarchical, context-dependent features**, texture, shape, shading, and surrounding context, rather than a single hand-set criterion. The engineering consequence: the model's competence comes from the *data distribution* it was trained on, which is why data is a first-class design object here.

### 6.2 Convolutional feature extraction
A convolutional neural network applies learned filters across the image, building from low-level features (edges, texture) to high-level ones (fruit-like regions). Weight sharing (the same filter everywhere) makes this efficient and translation-tolerant, a fruit is recognized wherever it appears. Stacked convolutions with non-linearities and downsampling form a **backbone** that produces feature maps; task-specific **heads** then read those maps for detection, segmentation, and classification.

### 6.3 Detection, segmentation, and ripeness heads
Three outputs matter to the harvester:

- **Detection**, locate each fruit (a bounding region + confidence). Answers "is it there, and roughly where."
- **Instance segmentation**, a per-fruit mask giving the fruit's *extent* and shape, which the grasp needs to size and place its contact (linking to CEC-02: the grasp must fit the fruit).
- **Ripeness classification**, a per-instance label (mature/immature, possibly graded), using the RGB + NIR cues from M2/M3.

Architecturally these are heads on a shared backbone. **Single-stage detectors** (YOLO-family [VERIFY@PUB]) predict all outputs in one pass, fast, suited to real-time edge inference. **Two-stage detectors** propose then refine, often more accurate, slower. **Transformer-based** detectors (DETR-style) and **vision transformers / vision-language models** [VERIFY@PUB] can be more accurate and flexible (open-vocabulary, few-shot) but are data- and compute-hungry. The choice is a trade against the cycle-time budget and the edge device (Section 11.1, M6).

### 6.4 Training in one paragraph
A model learns by minimizing a **loss** that penalizes wrong predictions, classification loss (cross-entropy), localization loss (box/mask regression), combined into one objective, via **gradient descent** and backpropagation over labeled examples. **Transfer learning** (starting from a backbone pretrained on large image sets) sharply reduces the labeled data needed. Overfitting (memorizing training data) is countered with regularization, augmentation, and honest held-out validation. The details are standard; the engineering leverage is in the *objective* and the *data*, treated next.

### 6.5 Data: the real product of a perception effort
The dataset determines the model's field competence. A sound data strategy has three parts: **real capture** (field imagery spanning the conditions of SectionM2/M3, lighting, occlusion, maturity, cultivar); **annotation** (boxes, masks, ripeness labels, expensive, quality-critical); and **synthetic generation** (labeled scenes rendered in the digital twin, where labels are free and rare/hazardous cases can be manufactured). The twin's virtual sensors (M3) are the renderers; **domain randomization**, varying lighting, texture, pose, and clutter in simulation, combats the **sim-to-real gap** so a model trained partly on synthetic data still works on real imagery. The union must *cover the field's variability*, or the model inherits a blind spot (a distribution-shift failure).

### 6.6 Evaluation metrics and the operating point
Predictions are scored against ground truth with:

- **IoU** (intersection over union), overlap of predicted and true region; the correctness criterion for a "hit."
- **Precision** = TP/(TP+FP), of what was flagged, how much was real (protects against wasted cycles).
- **Recall** = TP/(TP+FN), of what was real, how much was found (protects yield).
- **mAP**, mean average precision across thresholds; a standard aggregate benchmark.

Crucially, a single trained model exposes a whole family of behaviors via its **confidence threshold**: lowering it raises recall and lowers precision (the **precision-recall curve**). *Which point on that curve to operate at is a design decision*, and, as Section 7.4 shows, it must be made from the mission's error costs, not from a benchmark. This is the pivot from technique to judgment.

---

## 7. Mathematics

Rigor tier for M4: **L2** (applied), with an L3 grad extension on the operating-point optimization and class-imbalance effects. The central result is the mission-derived operating point.

### 7.1 Convolution and loss (applied)
Discrete 2-D convolution of image $I$ with kernel $K$: $(I*K)(x,y)=\sum_{i,j}I(x-i,y-j)\,K(i,j)$. Classification cross-entropy for true class $y$ and predicted probability $\hat p$: $\mathcal L_\text{cls}=-\sum_c y_c\log\hat p_c$. Total detection loss combines classification, localization, and (if used) mask terms with weights. Gradient descent updates parameters $\theta \leftarrow \theta - \eta\,\nabla_\theta \mathcal L$. *Use:* enough to reason about training behavior and the effect of class imbalance (Section 7.5 grad).

### 7.2 Metric definitions
With true/false positives/negatives after an IoU-thresholded match: $\text{Precision}=\frac{TP}{TP+FP}$, $\text{Recall}=\frac{TP}{TP+FN}$, $F_1=\frac{2PR}{P+R}$. Sweeping the confidence threshold traces the **PR curve**; the area-derived **mAP** aggregates it. *Use:* quantify a model and, more importantly, expose the operating-point family.

### 7.3 The precision-recall trade
Lowering the confidence threshold $\tau$ admits more detections: recall $R(\tau)$ rises, precision $P(\tau)$ falls. There is no single "best" $\tau$ in the abstract, only a best $\tau$ *for a stated objective*. The objective on this machine is economic, not statistical.

### 7.4 The mission-derived operating point (central result)
Assign each detection outcome its mission consequence: a **true positive** yields harvested-fruit value $v_H$; a **false negative** forfeits it (lost yield, $-v_H$ relative to harvesting it); a **false positive** costs a wasted pick cycle $c_F$, and, because that cycle is spent against the cycle-time budget (**CEC-01**), it also risks throughput. Expected mission value per candidate, as a function of threshold $\tau$, is approximately
$$ U(\tau) \;\propto\; v_H\,R(\tau)\;-\;c_F\,\big(\text{false-positive rate}(\tau)\big), $$
and the engineering operating point is $\tau^\ast=\arg\max_\tau U(\tau)$. Because a missed ripe melon ($v_H$) is typically worth far more than a wasted cycle ($c_F$), and wasted cycles are bounded by the cycle-time margin, not catastrophic, **the optimum biases toward high recall**: set $\tau$ low enough to find nearly all ripe fruit, accepting extra false positives so long as their cycles fit the budget. *This is the quantitative reason a harvester is tuned for recall*, and it is derived from consequence, not convention.

> ### Engineering Insight, EI-04: Optimize the Metric That Maps to the Mission
> **Choose and tune your performance metric from the real-world consequence of each error, not from what is conventional, symmetric, or easy to report.**
>
> Every model exposes a family of behaviors; picking the one to ship is an engineering decision, not a statistical default. On this machine the two error types are not equal, a missed ripe melon is lost revenue, a false alarm is only a wasted cycle, so tuning to a symmetric score like accuracy or F1 silently optimizes the wrong objective. The experienced engineer first writes down what each error *costs the mission*, then selects the operating point (and even the metric) that maximizes mission value, and only then reaches for a bigger model if that point is still not good enough.
>
> The trap this avoids is "leaderboard engineering", improving a number that is easy to measure while the thing that actually matters gets worse. It generalizes far beyond perception: latency budgets, safety thresholds, and control tolerances are all metric choices that should be derived from consequence.
>
> **Why it matters for SIM2FIELD.** Yield is the machine's reason to exist; recall maps to yield, precision maps to wasted cycles against the cycle-time budget (**CEC-01**). Getting the operating point right is the difference between a detector that scores well and a harvester that pays for itself.
>
> *Related concepts:* CEC-01 (the spine, perception serves the mission; false positives spend its cycle-time budget). *Revisited in:* M6 (accuracy-vs-latency operating point on the edge), M14 (validating whole-system harvest success, not component accuracy), M16 (yield -> techno-economics). See the [register](curriculum/_core-concepts.md).

### 7.5 (Grad, L3) Class imbalance and threshold sensitivity
Fruit pixels are rare relative to background; derive how class imbalance skews the loss and the PR curve, and how re-weighting or focal-style losses restore sensitivity to the minority (fruit) class. Analyze $\partial U/\partial\tau$ near the optimum to show how sensitive the operating point is to the cost ratio $v_H/c_F$, and therefore how important it is to estimate that ratio (an M16 economics input) rather than guess it.

---

## 8. Engineering Principles

1. **The objective is a design choice.** Derive the metric and operating point from mission consequence (EI-04), not convention.
2. **The dataset is the product.** Field competence comes from data coverage; curate for variability deliberately.
3. **Recall protects yield; precision protects the cycle budget.** Know which your mission weights more, and by how much.
4. **Synthetic data buys coverage, if the sim-to-real gap is managed** via domain randomization and real validation.
5. **Accuracy that misses the latency budget is worthless.** Perception is a real-time subsystem (CEC-01), not an offline benchmark.
6. **Separate development from runtime.** Train off-robot; infer on-robot; never let a runtime path depend on a training-time resource.
7. **Validate on held-out real data.** A benchmark number is a hypothesis until tested on data the model never saw.

---

## 9. System Requirements

Derived from the perception mission; refine SR-F-03/04 (M2/M3). IDs continue the scheme; [->Doc B] formalizes. Targets [VERIFY@PUB].

| ID | Type | Requirement (abbreviated) | Verification method |
|----|------|---------------------------|---------------------|
| SR-P-13 | Performance | Detection recall on mature fruit shall be $\ge$ [VERIFY@PUB] at the operating point chosen per Section 7.4. | Held-out real + twin test |
| SR-P-14 | Performance | False-positive rate shall be low enough that wasted cycles fit the cycle-time margin (CEC-01). | Analysis + test |
| SR-F-06 | Functional | The model shall output a per-fruit instance mask (extent) sufficient to size and place the grasp (CEC-02). | Test (IoU vs. ground truth) |
| SR-F-07 | Functional | Ripeness classification accuracy shall meet SR-F-03 across the maturity distribution. | Held-out test |
| SR-P-15 | Performance | Inference latency shall fit the perception share of the cycle-time budget on the target edge device. | Benchmark (M6) |
| SR-D-01 | Data | The training set (real + synthetic) shall span the field variability defined in M2/M3; synthetic-to-real transfer shall be validated. | Coverage audit + real validation |
| SR-I-06 | Interface | The twin shall generate labeled scenes and serve as the perception regression test-bed. | Review (->Doc G/E) |

Traceability: SR-P-13/14 -> operating point (EI-04, CEC-01); SR-F-06 -> grasp sizing (CEC-02, M9); SR-P-15 -> M6; SR-D-01 -> data pipeline (M4/M13); SR-I-06 -> twin (M13, [->Doc G/E]).

---

## 10. Design Decisions

- **DD-16 Single-stage detector + instance-segmentation head.** *Rationale:* real-time inference within the cycle-time budget while providing fruit extent for the grasp (Section 6.3, Section 11.1). *Serves:* SR-P-15, SR-F-06. (Case machine: a YOLO-family segmentation model [VERIFY@PUB].)
- **DD-17 RGB + NIR input with a learned ripeness head.** *Rationale:* combine external and internal cues (M2/M3) for robust ripeness. *Serves:* SR-F-07.
- **DD-18 Recall-biased operating point.** *Rationale:* Section 7.4 mission-value optimum; protect yield. *Serves:* SR-P-13/14. (EI-04.)
- **DD-19 Hybrid real + synthetic data with domain randomization.** *Rationale:* buy variability coverage cheaply while managing the sim-to-real gap (Section 6.5). *Serves:* SR-D-01.
- **DD-20 Transfer learning from a pretrained backbone.** *Rationale:* cut labeled-data cost and training time. *Serves:* SR-D-01.
- **DD-21 Development/runtime separation.** train off-robot; deploy an optimized model on-robot (M6). *Serves:* SR-C-01 (no cloud in the loop).

---

## 11. Trade Studies

### 11.1 TS-7: Detection/segmentation architecture
**Alternatives:** (A) **single-stage detector+seg** (YOLO-family); (B) **two-stage** (propose+refine); (C) **transformer/DETR-style**; (D) **VLM/open-vocabulary**. Scored 1 to 5 (weights illustrative; ratified in ->Doc B).

| Criterion (weight) | A: Single-stage | B: Two-stage | C: Transformer | D: VLM |
|--------------------|:---:|:---:|:---:|:---:|
| Recall at real-time edge latency (0.30) | 5 | 3 | 3 | 2 |
| Detection/mask accuracy (0.22) | 4 | 5 | 5 | 4 |
| Data efficiency / label cost (0.18) | 4 | 3 | 2 | 4 |
| Edge deployability (size/optimizable) (0.16) | 5 | 3 | 2 | 1 |
| Flexibility (new cultivars/few-shot) (0.14) | 3 | 3 | 4 | 5 |
| **Weighted total** | **4.34** | **3.52** | **3.28** | **2.98** |

**Selected: A (single-stage detector + segmentation head).** It wins on the decisive criterion, recall within the real-time edge budget (CEC-01), while remaining optimizable for the edge (M6). Transformers/VLMs are retained as offline/research tools and for open-vocabulary adaptation (a capstone/future direction). Recorded weakness: single-stage models can trail two-stage accuracy on small/occluded fruit; mitigated by data strategy (DD-19) and the recall-biased operating point (DD-18).

### 11.2 TS-8: Data strategy
**Alternatives:** real-only, synthetic-heavy, **hybrid real+synthetic with domain randomization**. **Criteria:** variability coverage, label cost, sim-to-real risk, field performance. **Outcome:** **hybrid**, real data anchors realism and validation; synthetic data (twin-rendered, domain-randomized) supplies coverage of rare/hazardous/under-sampled cases cheaply. Real held-out validation is mandatory (SR-D-01) to bound the sim-to-real gap.

### 11.3 Explicit Core Engineering Concept evaluation *(standing requirement)*
- **Detector operating point / recall-protects-yield.** *Verdict: not a CEC, it is an Engineering Insight (EI-04).* It is a judgment principle ("derive the metric from consequence"), not a recurring analytical/design *tool*; per the Design Rule (a CEC explains how engineers *analyze/design*; an EI explains how experienced engineers *think*), it is designated as an Insight and reinforces CEC-01.
- **Synthetic-data / sim-to-real pipeline (with domain randomization).** *Verdict: qualifies as a candidate; designate at mastery.* It is a recurring *design tool*, introduced here, feeding on M3's virtual sensors, and **mastered in M7** (grasp sim-to-real), recurring in M13 (twin). Added to the register **watchlist as candidate CEC** for designation at M7, not minted here. *(No new CEC minted in M4; one Insight added.)*

> **Simulation-first hook.** The architecture and operating-point choices are testable in SIL against twin-rendered labeled scenes (Section 12) before any field data exists, and the twin becomes the standing regression test-bed for every future model change.

---

## 12. Simulation Activities

M4 operates at **Simulation (synthetic data)** and **SIL (model in the loop)**. The digital twin, with the virtual sensors specified in M3, becomes a **labeled-scene generator** and a **regression test-bed** [->Doc G/E].

**SA-1, Generate labeled synthetic scenes.** Render canopy scenes in the twin with fruit at varied pose, occlusion, maturity, and lighting; export images with *free, exact* labels (boxes, masks, ripeness). *Outcome:* a synthetic dataset covering cases that are rare or hazardous to capture in the field.

**SA-2, Domain randomization.** Systematically vary lighting, texture, clutter, and camera pose across renders to reduce the sim-to-real gap. *Outcome:* a model trained partly on synthetic data that transfers to real imagery.

**SA-3, Software-in-the-loop detection.** Run the trained detector on twin imagery inside the perception loop; observe detections, masks, and ripeness feeding the (stubbed) decision stage. *Outcome:* the Perceive->Decide hand-off exercised in SIL before hardware.

**SA-4, Operating-point sweep.** Sweep the confidence threshold in SIL and plot the PR curve and the mission-value $U(\tau)$ from Section 7.4; locate $\tau^\ast$. *Outcome:* EI-04 made empirical.

---

## 13. Digital Twin Activities

**DTA-1, Synthetic-data pipeline specification (deliverable to Doc E/G).** Specify how the twin renders labeled scenes: which parameters are randomized, label formats, and the real/synthetic split. *Outcome:* a controlled synthetic-data pipeline (SR-D-01, SR-I-06).

**DTA-2, Perception regression test-bed.** Define a fixed twin scene suite with known ground truth; every model change is re-scored against it to catch regressions. *Outcome:* the twin as continuous perception V&V (hand-off to M14).

**DTA-3, Sim-to-real audit.** Specify the real held-out set and the acceptance criterion for synthetic-to-real transfer (how much real-data performance may lag synthetic before the pipeline is rejected). *Outcome:* an honest bound on the sim-to-real gap (SR-D-01).

---

## 14. Hardware Activities

*(Tiered: data-capture and benchmarking protocols at specification level.)*

**HA-1, Field data-capture protocol.** Specify how real imagery is captured to span the M2/M3 variability (times of day, weather, maturity, cultivar, occlusion) with the chosen sensor suite. *Deliverable:* a capture plan feeding SR-D-01.

**HA-2, Edge inference benchmark protocol.** Specify how to measure the model's latency and accuracy on the target edge device (hand-off to M6), so SR-P-15 can be verified. *Deliverable:* a benchmark procedure and template.

---

## 15. Software Activities

**SWA-1, Training/evaluation pipeline.** Specify the reproducible pipeline: dataset versioning, training config, held-out evaluation, metric reporting (precision/recall/IoU/mAP + the mission-value $U$). *Outcome:* a reproducible development-time workflow (SR-D-01).

**SWA-2, Model versioning & monitoring plan.** Specify how trained models are versioned, and how field performance is monitored for drift (a runtime concern feeding continuous improvement). *Outcome:* the model-lifecycle discipline the AI Architecture (Doc E) will own.

---

## 16. ROS 2 Integration

The detector is a **perception node** publishing, per frame, a set of fruit detections with masks, ripeness labels, and confidences on the perception (Ethernet) plane, consumed by the localization node (M5). Interface-level concerns fixed here: a typed detection message (extent + ripeness + confidence + timestamp), quality-of-service suited to bursty perception traffic, and the development/runtime separation (the *trained* model is deployed as an optimized artifact; training tooling never runs in the robot's loop). M11 masters the node/graph realization; M4 fixes the interface and the timing target (SR-P-15).

---

## 17. AI Integration

This is the curriculum's core **development-time AI** module; it instantiates the full lifecycle for the detection/ripeness models:

- **Dataset definition & collection**, real capture (HA-1) spanning field variability.
- **Annotation**, boxes, masks, ripeness labels; quality control.
- **Synthetic-data generation**, twin-rendered, domain-randomized labeled scenes (SA-1/2, DTA-1).
- **Training & validation**, transfer learning, held-out real validation, the mission-derived operating point (Section 7.4).
- **Benchmarking**, precision/recall/IoU/mAP *and* mission-value $U$; regression test-bed (DTA-2).
- **Optimization & deployment**, handed to M6 (quantization/compilation for the edge) under the no-cloud runtime boundary.
- **Monitoring & versioning**, drift detection and model versioning (SWA-2), feeding continuous improvement (Doc E).

The **runtime vs. development boundary** (CR-05) is explicit: all training/synthesis/optimization is off-robot; only the optimized inference model runs on-robot in the control loop. EI-04 governs how the objective is set throughout.

---

## 18. Edge Computing Integration

Perception is where the edge budget is most stressed: a detection+segmentation model on high-rate stereo imagery is the machine's heaviest on-robot computation, and its latency spends the perception share of the cycle-time budget (CEC-01). Two design constraints are fixed here and mastered in M6: (1) the model must be **optimizable** (quantization/pruning/compilation) to meet SR-P-15 on the target device without losing the recall that EI-04 protects, the accuracy-vs-latency operating point is itself an EI-04 decision on the edge; (2) the model runs **on-robot only** (SR-C-01), so no perception path may depend on off-robot compute at runtime.

---

## 19. Fluid Power Integration

M4's link to fluid power is indirect but real: perception produces the **fruit extent (mask)** and **ripeness** that the grasp decision consumes. The mask sizes and places the compliant grasp within the fruit's boundary (feeding CEC-02's spatial requirement), and the ripeness label gates *whether* to grasp at all. A perception error therefore propagates into the grasp: a mask that misjudges extent can push the contact toward the rind's high-curvature region where peak pressure (M2 Section 7.2) is worst. Thus perception accuracy (this module) is upstream of grip safety (CEC-02, M9), a dependency made explicit so the grasp module can bound its behavior against perception uncertainty.

---

## 20. Interactive HTML Components  *(build specification: tiered)*

- **W-M4-1, Operating-Point / Mission-Value Explorer.** Sliders for the cost ratio $v_H/c_F$ and the confidence threshold $\tau$; shows the PR curve, $U(\tau)$, and the optimum $\tau^\ast$, EI-04 made interactive. *Goal:* internalize metric-from-consequence.
- **W-M4-2, Precision/Recall/IoU Sandbox.** Drag predicted vs. ground-truth boxes to see TP/FP/FN, IoU, precision, and recall update live. *Goal:* Section 7.2 intuition.
- **W-M4-3, Domain-Randomization Gallery.** A twin scene re-rendered under randomized lighting/texture/pose to illustrate synthetic-data coverage and the sim-to-real idea. *Goal:* Section 6.5/Section 12.
- **W-M4-4, Detection Overlay on the Twin.** The embedded twin with live detection boxes/masks/ripeness overlaid on rendered fruit. *Goal:* Perceive-stage made visible.

---

## 21. CAD Illustrations  *(build specification: tiered)*

- **CAD-M4-1** Perception data-flow: sensor suite (M3) -> backbone -> detection/segmentation/ripeness heads -> detected fruit (annotated block diagram, not mechanical).
- **CAD-M4-2** Instance mask defining grasp extent on a fruit (links perception output to the gripper contact region, CEC-02).
Format per ->Doc J (SVG block/flow diagrams).

---

## 22. Required Figures  *(build specification: tiered)*

| ID | Figure | Purpose |
|----|--------|---------|
| F-M4-1 | CNN feature hierarchy (edges -> fruit) | Section 6.2 |
| F-M4-2 | Detection vs. instance segmentation vs. ripeness heads | Section 6.3 |
| F-M4-3 | Precision/Recall/IoU definitions (TP/FP/FN diagram) | Section 7.2 |
| F-M4-4 | **PR curve and the mission-value operating point $\tau^\ast$** | Section 7.4 (central) |
| F-M4-5 | Data strategy: real + synthetic + domain randomization | Section 6.5/Section 11.2 |
| F-M4-6 | Sim-to-real: synthetic vs. real performance and the gap | Section 12 |
| F-M4-7 | Development vs. runtime AI boundary | Section 17 |

---

## 23. Required Animations  *(build specification: tiered)*

- **AN-M4-1** The confidence threshold sliding along the PR curve while $U(\tau)$ rises to its peak, EI-04 in motion.
- **AN-M4-2** Domain randomization: one scene re-rendered under many conditions, then a model generalizing to a real frame.
- **AN-M4-3** Detection/mask/ripeness overlays appearing on canopy fruit as the model runs.

---

## 24. Laboratory

**Lab M4, Building and Tuning the Perception Model**

- **Objectives.** (1) Train/evaluate a fruit detector+segmenter (or analyze a provided one); (2) compute precision/recall/IoU/mAP and read the PR curve; (3) derive the mission-value operating point (EI-04); (4) design a real+synthetic data strategy; (5) specify the twin's synthetic-data and regression roles.
- **Equipment.** A provided labeled dataset (real + twin-synthetic) and a training/eval environment [VERIFY@PUB]; the digital twin for synthetic generation; notebook. **Safety:** computer-based; standard practice.
- **Procedure.**
  1. Train (or load) a single-stage detector+segmentation model; produce predictions on a held-out real set.
  2. Compute precision, recall, IoU, and mAP; plot the PR curve (Section 7.2).
  3. Using a supplied (or estimated) cost ratio $v_H/c_F$, compute $U(\tau)$ and locate $\tau^\ast$ (Section 7.4); state the recall and false-positive rate at $\tau^\ast$ and interpret in yield terms (EI-04).
  4. Generate a batch of domain-randomized synthetic scenes in the twin (SA-1/2); retrain or fine-tune and measure the change in real held-out performance, quantify the sim-to-real benefit and gap.
  5. Run the model in SIL on the twin regression suite (DTA-2); record any regressions.
  6. Write three requirements (recall at operating point, mask IoU for grasp, latency target) and the synthetic-data pipeline specification (DTA-1).
- **Data collection.** Metric tables; PR curve; $U(\tau)$ and $\tau^\ast$; real-vs-synthetic results; regression-suite scores.
- **Analysis.** How does $\tau^\ast$ move with the cost ratio? How much did synthetic data help, and where did the sim-to-real gap remain? Which requirement is binding, recall, latency, or mask quality?
- **Discussion.** Why is accuracy the wrong headline metric here? What would you change if false positives became expensive (e.g., damaging a mis-grasped fruit)? How does the operating point interact with the cycle-time budget (CEC-01)?
- **Deliverables.** A 4 to 6 page report: metrics + PR curve, operating-point derivation, data-strategy results, regression outcome, requirements + pipeline spec.
- **Rubric (100 pts).** Metric computation & PR curve (18); operating-point derivation & yield interpretation (22, ties to EI-04); data strategy & sim-to-real analysis (22); SIL/regression use of the twin (18); requirements & pipeline spec (12); communication (8). *Graduate band adds:* the L3 class-imbalance analysis and a sensitivity study of $\tau^\ast$ to $v_H/c_F$, with a cited source.
- **Expected results.** A PR curve showing the recall/precision trade; a $\tau^\ast$ biased toward high recall for realistic cost ratios; a measurable but incomplete sim-to-real benefit from synthetic data (motivating real validation); correct identification that accuracy alone would mislead.

---

## 25. Homework

Tiered: all do 1 to 4; graduate add 5 to 6.

1. **Metrics.** Given a table of predictions vs. ground truth with IoU values, compute TP/FP/FN at two thresholds, then precision, recall, and F1 at each.
2. **Operating point.** Given a PR curve (tabulated) and a cost ratio $v_H/c_F$, compute $U(\tau)$ at several thresholds and identify $\tau^\ast$; state the recall you would deploy and why (EI-04).
3. **Data coverage.** Given the M2/M3 variability axes, design a dataset plan (real + synthetic) specifying what each source must cover and why synthetic is used where it is.
4. **Architecture choice.** Justify single-stage over transformer for this task in a short paragraph; name the one condition that would flip your choice.
5. **(Grad) Class imbalance.** Derive how heavy background/fruit imbalance biases a naïve cross-entropy loss and how re-weighting/focal loss corrects it; relate to recall at the operating point.
6. **(Grad) Sensitivity of $\tau^\ast$.** Show how $\tau^\ast$ shifts as $v_H/c_F$ varies over a plausible range; argue why estimating this ratio (an M16 economics task) is a perception-engineering concern.

---

## 26. Quiz

1. **(MC)** On a harvester, a false negative (missed ripe fruit) primarily costs: (a) a wasted cycle; (b) lost yield/revenue; (c) a bruised fruit; (d) nothing. **[b]**
2. **(MC)** Lowering the detector's confidence threshold generally: (a) raises precision, lowers recall; (b) raises recall, lowers precision; (c) raises both; (d) changes neither. **[b]**
3. **(MC)** Instance segmentation (a mask) is needed beyond a bounding box mainly to: (a) speed inference; (b) give the grasp the fruit's extent/shape; (c) reduce labeling; (d) improve ripeness. **[b]**
4. **(MC)** Synthetic data from the twin most directly helps by: (a) eliminating real data; (b) providing free, exact labels and coverage of rare cases; (c) removing the sim-to-real gap; (d) reducing model size. **[b]**
5. **(Short)** State EI-04 in one sentence and give the SIM2FIELD reason recall is favored. **[Optimize the metric that maps to the mission; recall is favored because a missed melon is lost yield while a false positive only spends a bounded cycle.]**
6. **(Calc)** From TP=80, FP=20, FN=20, compute precision and recall. **[P=0.80, R=0.80.]**
7. **(Calc)** Boxes overlap with intersection 30 and union 60 area units; compute IoU. **[0.50.]**
8. **(Design)** Which two requirements does perception hand to the grasp module, and to which Core Concept do they attach? **[Fruit extent/mask (grasp sizing) and ripeness gate; attach to CEC-02.]**
9. **(Critical thinking)** Why can a model with higher accuracy harvest less fruit than one with lower accuracy? **[Accuracy is symmetric; a model tuned for accuracy may have lower recall, missing ripe fruit, EI-04.]**
10. **(Critical thinking)** Why must training stay off-robot while inference runs on-robot? **[Runtime/development boundary: no cloud/training resource in the control loop (SR-C-01); the field has no guaranteed network.]**

---

## 27. Challenge Problems

- **CP-M4-A, The end-to-end operating point.** Combine the detection operating point (this module), the depth/localization error budget (M3, candidate CEC-03), and the Grip-Force Window's capture tolerance (CEC-02) to define the *system* success condition for a pick, and choose $\tau$ to maximize whole-system harvest value under the cycle-time budget (CEC-01). (Bridges four modules.)
- **CP-M4-B, Close the sim-to-real gap.** Propose and justify a domain-randomization and validation strategy that would let a mostly-synthetic-trained detector meet a real-field recall target; specify how you would *prove* it before field deployment.
- **CP-M4-C, Design a drift monitor.** Specify a runtime monitor that detects when field performance is degrading (distribution shift) without ground-truth labels, and what the machine should do when it fires (degrade to a safe behavior). (Feeds M14/M15 and Doc E.)

---

## 28. Instructor Notes

- **Timing.** Section 6, Section 7 (CNNs, metrics, the operating point) are the core (~2.5 h), with Section 7.4 and EI-04 as the intellectual peak. Trade studies + CEC evaluation (Section 11) and twin activities (Section 12, Section 13) form an interactive block (~1.5 h). Lab M4 is a separate 2 to 3 h session (a provided model/dataset keeps it tractable).
- **Common misconceptions.** (1) "Bigger model = better harvester", objective and data dominate. (2) Reporting accuracy/mAP as the headline, force the mission-value framing. (3) Believing synthetic data removes the sim-to-real gap, it manages, not erases it. (4) Treating latency as an afterthought, it is a hard budget (CEC-01).
- **On EI-04.** This is the curriculum's first Engineering Insight; teach it as *judgment*, not a formula, the habit of deriving the metric from consequence. Reference it forward at M6 (edge latency/accuracy) and M14 (system-level success) so students feel it recur.
- **Where to push graduate students.** Class-imbalance derivation (HW5), $\tau^\ast$ sensitivity (HW6), drift monitor (CP-M4-C).
- **Thread to keep visible.** Close by naming hand-offs: detections/masks/ripeness -> M5 localization; model compute/latency -> M6 edge; the perception node interface -> M11; the mask -> the grasp's spatial requirement (CEC-02, M9).

---

## 29. Research Frontiers

- **Landmark grounding.** Foundational deep-learning and CNN references; the object-detection and instance-segmentation literature (single-stage/two-stage families); the agricultural-vision literature on fruit detection and ripeness estimation. *(Consult current editions; entries in the reference set, not reproduced here.)*
- **Recent advances (survey current literature [VERIFY@PUB]).** Vision transformers and open-vocabulary/vision-language models for few-shot and novel-cultivar detection; self-supervised and foundation-model pretraining reducing labeled-data needs; advanced synthetic-data and neural-rendering (diffusion, NeRF/Gaussian-splatting) pipelines for agricultural scenes; uncertainty-aware detection and out-of-distribution monitoring for field robustness.
- **Open problems.** Reliable detection of small/occluded fruit under extreme field lighting; ripeness estimation that generalizes across cultivars and seasons; closing the sim-to-real gap with guarantees; label-efficient learning for new crops.
- **Suggested thesis directions.** (1) A cost-sensitive, uncertainty-aware detector whose operating point is set automatically from an economic model (EI-04 automated). (2) A neural-rendering synthetic-data pipeline for watermelon canopies with measured sim-to-real transfer. (3) An unsupervised field-drift monitor triggering safe degradation.

---

## 30. References

*Cited by role; consult current editions. No copyrighted text is reproduced. Full entries in `references/bibliography.md` [->Doc H].*

- Deep-learning and CNN foundational references, convolution, training, generalization (Section 6).
- Object-detection and instance-segmentation literature (single-stage/two-stage/transformer families), architectures and metrics (Section 6.3, Section 7.2).
- Agricultural computer-vision literature, fruit detection, ripeness estimation, field datasets (Section 6.1, Section 6.4).
- Synthetic-data / domain-randomization / neural-rendering references, the data-strategy basis (Section 6.5, Section 12).
- SIM2FIELD governing documents, `PHASE-0-FOUNDATION.md`, `PHASE-1-CURRICULUM-ARCHITECTURE.md`, `curriculum/_core-concepts.md`, **Modules 1 to 3**, and (forthcoming) Doc B, Doc E (AI Architecture), Doc G.

---

## Concise quality summary (honest self-assessment)

**Strengths.** The module masters learned detection/segmentation/ripeness while making its central lesson an *engineering* one: the operating point is derived from the mission's asymmetric error costs, not a benchmark, captured as the curriculum's first **Engineering Insight (EI-04)**, tied directly to CEC-01 and the cycle-time budget. It exercises every standing convention: the spine callback (CEC-01), the CEC-02 hand-off (mask -> grasp extent), the required explicit CEC evaluation (mints no CEC; adds the sim-to-real pipeline to the watchlist for M7 designation), Bloom-tagged objectives, and a module-specific failure-case section. It gives data and metric design equal standing with the model, which is the graduate-level engineering point. All 30 sections present; tiered contract, simulation-first (twin as synthetic-data generator and regression test-bed), and consistency with the frozen modules maintained.

**Known weaknesses / items for your review.**
1. **Targets are [VERIFY@PUB].** Recall/precision/latency/ripeness-accuracy targets and specific model families depend on Doc B and Doc E and on real data; the methods (metrics, operating-point derivation, data strategy) are exact.
2. **The cost ratio $v_H/c_F$ is assumed, not established.** EI-04's operating point depends on an economic ratio that is genuinely an M16 output; I flag this dependency rather than inventing a number.
3. **Synthetic-data and regression test-bed are specified, not built.** They depend on Doc E/G, the same critical path noted since M2.
4. **The sim-to-real pipeline's CEC designation is deferred to M7** by the disciplined-restraint rule; if you would prefer it designated now, that is a one-line register change, flagged, not decided unilaterally.

I have not scored this against the 9.5 bar, that judgment is yours. Items 1 to 3 close chiefly by authoring Doc B, Doc E, and Doc G.

**END OF MODULE 4, STOP. Awaiting your review before freezing Module 4 or proceeding to Module 5.**
