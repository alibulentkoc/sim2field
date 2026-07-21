# SIM2FIELD: Production Architecture Review

**Status:** Production STOPPED for review. No new HTML, no migration, no redesign, no module rewrites.
**Scope:** Verify that the production system faithfully represents the complete authored curriculum, not just its interactive worked examples.
**Method:** Every claim below is grounded in a direct scan of the repository (module files, specified media IDs, and the built asset tree), not from memory.

---

## Executive summary

The authored curriculum is **complete**: 17 modules, 30 sections each, fully written including theory, mathematics, requirements, trade studies, failure analysis, labs, homework, quizzes, and challenge problems. The **production layer is a thin slice of what those modules specify**, roughly 9 of 67 interactive widgets, and none of the 116 figures, 47 CAD illustrations, 50 animations, or 17 quizzes. Critically, the **authored modules themselves are not surfaced in the student-facing web product at all**; only the worked-example widgets are, and the hub frames the entire course as "nine instruments," which hides the 17-module curriculum behind its smallest layer.

The core finding: **the review process was evaluating the worked-example layer as if it were the curriculum.** It is not. The correct canonical source is `MODULE-XX.md`; the HTML is one generated realization of one section (Section 20) of each module.

---

## Phase 1: Curriculum Audit

**Authored text:** all 17 modules are complete to the 30-section template. In every module the *core* sections (motivation, theory, mathematics, requirements, design decisions, trade studies, lab, homework, quiz, challenge, references, self-assessment) are authored in full; sections **20 to 23 (widgets, CAD, figures, animations) are build specifications by design**, they name and scope the media for a production team, they do not contain it.

**Built assets** (the entire production output): 9 interactive worked-example instruments, 2 homework pages, 1 course hub, plus legacy twin sims. **No figure, CAD, animation, image, or quiz asset files exist in the tree.**

| # | Module | Section/30 authored | Interactive built | Homework HTML | Figures built/spec | Widgets built/spec | CAD built/spec | Anim built/spec | Lab | Quiz |
|---|--------|:--:|:--|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| M1 | The Harvesting Problem & Systems Engineering | 30/30 | [x] Signal-to-Action Spine |, | 0/7 | 1/3 | 0/3 | 0/2 | text | text |
| M2 | The Watermelon, the Field & Physical Interaction | 30/30 |, |, | 0/8 | 0/4 | 0/3 | 0/3 | text | text |
| M3 | Sensing Modalities & Sensor Physics | 30/30 |, |, | 0/8 | 0/4 | 0/3 | 0/3 | text | text |
| M4 | Vision & Deep Learning for Detection & Ripeness | 30/30 | [x] Detection Operating Point |, | 0/7 | 1/4 | 0/2 | 0/3 | text | text |
| M5 | 3-D Localization, Sensor Fusion & State Estimation | 30/30 | [x] Placement Error Budget, [x] EI-05 through-line | [x] | 0/7 | 2/4 | 0/2 | 0/3 | text | text |
| M6 | Edge Computing, Optimization & Deployment | 30/30 | [x] No-Cloud Edge Boundary |, | 0/7 | 1/4 | 0/2 | 0/3 | text | text |
| M7 | Decision-Making & Grasp-Policy Framework | 30/30 | [x] Sim-to-Real Pipeline (CEC-05) |, | 0/7 | 1/4 | 0/2 | 0/3 | text | text |
| M8 | Manipulator Kinematics, Workspace & Singularities | 30/30 | [x] Kinematics & Singularities |, | 0/6 | 1/4 | 0/3 | 0/3 | text | text |
| M9 | Actuation, Fluid Power & AI-Assisted Grasp-Force Control | 30/30 | [x] Grip-Force Window | [x] | 0/7 | 1/4 | 0/3 | 0/3 | text | text |
| M10 | Mobility, Navigation & Field Operation | 30/30 |, |, | 0/7 | 0/4 | 0/3 | 0/3 | text | text |
| M11 | ROS 2, Real-Time Systems & Software Integration | 30/30 |, |, | 0/7 | 0/4 | 0/3 | 0/3 | text | text |
| M12 | Power, Embedded Systems & Electrical Integration | 30/30 |, |, | 0/6 | 0/4 | 0/3 | 0/3 | text | text |
| M13 | System Integration & the Digital Twin | 30/30 | [x] Fidelity Ladder (CEC-06) |, | 0/7 | 1/4 | 0/3 | 0/3 | text | text |
| M14 | Verification, Validation & Reliability | 30/30 |, |, | 0/7 | 0/4 | 0/3 | 0/3 | text | text |
| M15 | Safety, Ethics & Responsible Deployment | 30/30 |, |, | 0/6 | 0/4 | 0/3 | 0/3 | text | text |
| M16 | Manufacturing, Cost, Sustainability & Deployment | 30/30 |, |, | 0/6 | 0/4 | 0/3 | 0/3 | text | text |
| M17 | Capstone: The Integrated Design Challenge | 30/30 |, |, | 0/6 | 0/4 | 0/3 | 0/3 | n/a | text |

**Totals.** Authored sections: **510/510 (100%).** Interactive widgets: **~9/67 (~13%)**, covering **8/17 modules**. Figures: **0/116.** CAD: **0/47.** Animations: **0/50.** Homework realized as HTML: **2/17** (authored 17/17). Quizzes realized: **0/17** (authored 17/17). Labs realized as dedicated assets: **0** (authored 16/16; the capstone has none by design; the two legacy twin sims support labs generally, not per-module).

**Modules with zero production assets:** M2, M3, M10, M11, M12, M14, M15, M16, M17 (nine modules).

**Reading of the audit.** The *curriculum* is done; the *production* of its media and assessment layer has barely begun, and what exists is concentrated in the worked-example widget of eight modules. There is no "incomplete module", there are complete modules whose specified figures, animations, CAD, quizzes, and most widgets are still specifications.

---

## Phase 2: Educational Architecture (the intended student experience)

The **module is the lesson.** The authored 30-section module is the thing a student moves through top to bottom; every other artifact is a beat *inside* that arc. The intended sequence, per the module template:

```
Read module: Why This Course Exists -> Overview -> Learning Objectives
        v
Engineering Motivation + Engineering Failure Cases   (why the problem is hard; Section 4)
        v
Theory (Section 6), read with FIGURES at each concept       (emergence, ConOps, the spine, requirements)
        v
Mathematics (Section 7), work through the DERIVATION         (cycle-time budget, error budget, ...)
        v
Use the INTERACTIVE WIDGET (Section 20)                        <- the HTML worked example lives HERE
        v
Simulation / Digital-Twin activities (Section 12, Section 13)          (measure the result in the twin)
        v
LAB (Section 24)                                                (do it hands-on, produce a report)
        v
HOMEWORK (Section 25) -> QUIZ (Section 26) -> CHALLENGE PROBLEMS (Section 27)
        v
Research Frontiers (Section 29) -> References (Section 30)
```

**How the module and the HTML are meant to fit together.** The HTML worked example is the realization of **Section 20, one widget**, embedded at the point in the reading where a derived tension becomes manipulable. Example (M1): the student reads the cycle-time derivation in Section 7.1, reaches the result *v ≤ d/T_cycle ≈ 0.18 m/s*, and then the **Signal-to-Action Spine** widget lets them drag the SWING stage and toggle a second arm to *feel* the constraint they just derived. The widget does not teach the derivation; it makes the already-taught derivation interactive. The same pattern holds for the placement-error budget (M5), the grip-force window (M9), and the rest.

The worked example is therefore **one instrument inside a module**, not a replacement for it. A student who only sees the widget has skipped the motivation, the theory, the trade studies, the failure analysis, the lab, and the assessment, roughly 25 of 30 sections.

---

## Phase 3: Canonical Source of Truth

**`MODULE-XX.md` is the single authoritative source.** Everything else is generated from it and must trace back to it:

```
MODULE-XX.md            <- CANONICAL (all educational content: prose, theory, math, rationale)
   +--> Figures (F-MX-*)         generated artifact  -> production image
   +--> Widgets (W-MX-*)         generated artifact  -> production HTML fragment
   +--> CAD (CAD-MX-*)           generated artifact  -> production render
   +--> Animations (AN-MX-*)     generated artifact  -> production media
   +--> Lab (Section 24)                generated artifact  -> lab handout / twin activity
   +--> Homework (Section 25)           generated artifact  -> problem set
   +--> Quiz (Section 26)               generated artifact  -> auto-gradable widget
```

**Duplication risk found.** The current worked-example HTML **re-authors** educational prose, each has its own thesis, derivation narrative, "concept" statement, and takeaway, written separately from the module rather than transcluded or generated from it. Right now those copies are *consistent* with the modules, but they are a **second source**: the module and the HTML can drift independently. The build drift-guard protects each HTML file from silent self-edits, but it does **not** check the HTML against its module, so a module revision would not propagate, and a reviewer comparing the two would find two authorities for the same content.

**Rule to enforce:** educational content lives in the module and nowhere else. Widgets carry the *interaction* plus the minimum framing needed to stand at their embed point; any exposition they show should be generated from the module, so the module cannot be contradicted by its own artifact.

---

## Phase 4: Curriculum Fidelity

**Within the slice they cover, the built worked examples are faithful.** Spot-checking the built instruments against their module sections: the numeric content matches exactly (e.g., M1's 6.6 s cycle / 0.18 m/s / dominant SWING reproduce Section 7.1; M5's variance stack and 40 mm gate reproduce Section 7.2; M9's slip/bruise window reproduces its ratified values), the CEC/EI statements match the module's concept boxes, and canonical terminology is preserved inside the widgets. No numeric value was found simplified or altered, the drift-guard has kept those exact.

**But relative to the whole module, most intellectual content is absent from production.** The worked example is a *compression to the central derivation + concept + takeaway*. The following authored content has **no production representation at all** (in any module):

| Curriculum element | In the modules | In production |
|---|:--:|:--:|
| Engineering Motivation (Section 4) | [x] 17/17 | [ ] none |
| Theoretical development (Section 6) | [x] 17/17 | [ ] none |
| Derivations (Section 7) | [x] 17/17 | [~] only the one derivation each widget is built around (8 modules) |
| Trade studies (Section 11) | [x] (present where authored) | [ ] none |
| Engineering judgment / design rationale (Section 8, Section 10) | [x] 17/17 | [ ] none |
| Systems-engineering discussion | [x] 17/17 | [ ] none |
| Engineering Failure Cases | [x] 17/17 | [ ] none |
| Industry Perspective | [x] (M1; not a universal section) | [ ] none |
| Research context (Section 29) | [x] 17/17 | [ ] none |

**Verdict.** Production has **not** rewritten or falsified the curriculum, but it has **omitted** the great majority of it and **compressed** each module to its interactive worked example. If the HTML is mistaken for the deliverable, the student receives the applied result without the reasoning, motivation, judgment, and failure analysis that are the intellectual core of SIM2FIELD. This is exactly the failure the review exists to catch. The fix is not to enrich the worked examples; it is to stop treating them as the module and to surface the modules themselves.

---

## Phase 5: Terminology Audit

**Inside the worked-example bodies, canonical vocabulary is largely intact:** the CEC names (CEC-01...06), the EI names (EI-04...17), "Signal-to-Action Spine," "Placement Error Budget," "Grip-Force Window," "Fidelity Ladder," "Sim-to-Real Pipeline," and the FSM stage names all appear correctly.

**The drift is at the hub and navigation level, where production reframed the curriculum in generic/instrument language:**

| Location | Production wording (found) | Canonical curriculum wording |
|---|---|---|
| Hub eyebrow (`index.html`) | "Interactive Instruments" | "Graduate Curriculum, 17 Modules" |
| Hub hero (`index.html`) | "**Nine instruments** for one machine" | "**Seventeen modules** ..."; instruments are one layer |
| Hub / preview nouns | "instrument," "instrument suite," "the suite," "assets" | "module," "worked example (a module's Section 20 widget)" |
| Course framing | course = a set of nine instruments | course = 17 modules; each has an embedded worked example |
| Preview shell (`course-preview.html`) | "worked examples," "the suite" | "modules," with worked examples as embedded components |

**Why this matters:** "nine instruments" is not a cosmetic label, it silently redefines the unit of the course from *module* to *instrument* and understates its scope by nearly half (9 vs 17, and instruments vs full lessons). A student (or reviewer) who reads the hub concludes the course *is* nine interactives.

**Recommendation:** restore module-centric vocabulary everywhere in navigation, headings, and framing. The course is **17 modules**; a worked example is "**Module N, Section 20 interactive worked example**," a component, never the unit. Keep the CEC/EI canonical names (already correct). Lock this in a glossary (Phase 8).

---

## Phase 6: Student Experience: today vs. intended vs. gap

**What a student experiences today (via the web product):**
- Lands on a hub titled "nine instruments for one machine."
- For **8 of 17 modules**, can open a worked example: read a short thesis, work one derivation, manipulate one interactive, read a one-paragraph concept and a four-point takeaway.
- For **9 of 17 modules**, there is nothing.
- Homework exists for **2** modules; there are **no** figures, animations, CAD, quizzes, or rendered module lessons.
- The **authored 30-section modules are not surfaced at all** in the web experience, they exist only as `.md` source files a student never sees.
- Net: the student experiences ~13% of the specified interactive layer and **0% of the authored expository curriculum** through the product.

**What the intended finished experience should be:**
- A student opens **Module N** and reads the complete lesson, motivation, failure cases, theory, mathematics, with figures at each concept, the worked-example widget embedded at the derivation, the twin activities, then the lab, homework, and quiz, closing with research frontiers.
- All 17 modules present; each carries its full intellectual arc; the interactives are beats inside the reading, not the whole of it.

**The gap (explicit):**
1. **The modules are not rendered/surfaced** in production, the single largest gap. The canonical content is invisible to students.
2. **Figures 0/116, CAD 0/47, animations 0/50**, the entire visual layer is unbuilt.
3. **Widgets ~9/67**; nine modules have no interactive.
4. **Homework 2/17 realized; quizzes 0/17**, the assessment layer is almost entirely unrealized.
5. **Framing** presents the course as instruments, hiding the module structure.

The gap is not finish or polish. It is that production currently exposes a thin application slice and conceals the curriculum behind it.

---

## Phase 7: Recommended Production Architecture

**Recommendation: Option A, module-centric.** The rendered **module is the page**; figures, the worked-example widget, the lab, homework, and quiz are **embedded at their authored positions**; the worked examples become embedded components generated from (or transcluded into) the module, not standalone substitutes.

```
MODULE-XX.md  --render-->  Module N page (full 30-section lesson, design-system styled)
                              +- figures embedded at their Section-anchors
                              +- Section 20 worked-example WIDGET embedded at the derivation
                              +- lab / homework / quiz embedded at Section 24, Section 26
                              +- everything traces to the one .md source
```

**Why Option A, not B or C:**
- **It makes the module the single source of truth and the unit of experience** (fixes Phases 3 to 6 at once). Content is authored once, rendered once; artifacts are generated, never duplicated, so the drift you're worried about becomes structurally impossible.
- **It restores the full intellectual depth.** The motivation, theory, trade studies, and failure analysis reach the student because the module *is* the page.
- **It matches authored intent.** The modules literally specify their Section 20 widgets as things to be *injected into the existing HTML shell*, i.e., embedded in a module page, which is Option A by construction.
- **It reuses what exists.** The Rev 1.2 design system becomes the module-page style; the 9 built widgets become the first embedded components with no rework of their engineering.
- **Option B (standalone HTML lessons) is the architecture that produced this problem.** It fragments a 17-module curriculum into a gallery of instruments, forces each instrument to re-author exposition (paraphrase + drift), and structurally hides the modules. Reject it.
- **Option C:** no third architecture is warranted; A is the faithful and the simplest.

**Consequence for the existing HTML (later, not now):** the worked-example pages are refactored from *whole pages* into *embeddable widget fragments* that a module page mounts at its Section 20 anchor. Their engineering content is already correct and drift-guarded; only their outer page shell changes. This is a downstream task to schedule after the freeze, not part of this review.

---

## Phase 8: Freeze Before Further Production

Freeze these now, before a single additional asset is produced:

1. **Curriculum content**, the 17 modules (already Rev 1.0/1.1) are the canonical, authoritative source. Reaffirm: no educational content is authored anywhere but a module; production never paraphrases a module into HTML.
2. **Terminology**, lock the canonical SIM2FIELD glossary: *module* (the unit), *worked example* (a module's Section 20 widget), the six CEC names, the EI-04...17 names, "signal-to-action spine," "fidelity ladder," "Fluid-Powered Physical AI," "Engineering Failure Cases," the FSM stage names. Ban generic substitutions ("instrument suite," "nine instruments") in navigation and framing.
3. **Production architecture**, Option A (module-as-page, embedded components, single-source rule). Lock before building.
4. **Design system**, the Rev 1.2 design language (tokens, typography, components, self-hosted fonts, browser-independence, accessibility) is frozen and becomes the module-page style. Keep as-is.
5. **Module structure**, the 30-section template and the single-source / no-duplication rule.

**Do NOT freeze yet (these are the next design tasks, to settle before mass production):**
- the **module-page rendering pipeline** (Markdown-with-math -> styled module page; figure and widget injection contract);
- the **navigation / information architecture**, redesigned module-first (17 modules, each expandable to its 30 sections, worked example as an embedded beat);
- the **widget-embedding contract** (how a built worked example mounts inside a module page).

Freeze the *foundations* (curriculum, terminology, architecture decision, design system, module structure); design the *rendering and navigation* next; only then resume producing figures, widgets, and assessments, module by module, generated from the single source.

---

## One honest caveat about this review

This audit measured **existence and fidelity** (what is authored, what is built, whether the built assets match their source), which can be established from the files. It did **not** re-grade the *pedagogical quality* of all 17 modules section-by-section, each module carries its own honest self-assessment listing its known weaknesses (mostly `[VERIFY@PUB]` illustrative values pending Doc B), and those stand. If you want, a follow-up pass can verify each module's internal self-assessment against its content. That is a separate exercise from this architecture review and is not required to act on the recommendations above.
