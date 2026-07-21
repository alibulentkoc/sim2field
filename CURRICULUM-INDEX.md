# SIM2FIELD - Curriculum Index & Frozen Baseline

**Autonomous Watermelon Harvesting Robotics - a graduate curriculum in Fluid-Powered Physical AI**

**Status:** Architecture **FROZEN & COMPLETE** - curriculum, Concept Register, Curriculum Index, and P0 engineering baselines (Doc B/C/E/F/G) all frozen. **PRODUCTION PHASE active.** No new architectural documents are created unless explicitly requested; work is now producing the instructional experience (worked examples, derivations, figures, CAD, widgets, animations, labs, homework, challenge problems, instructor notes, reference solutions) - all deriving from the frozen baselines.
**Anchor architecture (final):** 6 Core Engineering Concepts (CEC-01...CEC-06) + 14 Engineering Insights (EI-04...EI-17).
**Case machine:** drive-over watermelon harvester on a farm-ng Amiga rover; rail-mounted parallel 2-cylinder manipulator; mid-frame pick station; occlusion-gated OAK-D stereo perception; Jetson edge (no cloud in the control loop); pneumatic compliant gripper with AI-assisted force regulation; mission FSM DRIVE-&gt;STAGE-&gt;ALIGN-&gt;GRAB-&gt;LIFT-&gt;SWING-&gt;LOWER-&gt;RELEASE.

---

## Governing documents

| Document | Role |
|----------|------|
| `PHASE-0-FOUNDATION.md` | Foundation: scope, conflict register (CR-01...), locked decisions |
| `PHASE-1-CURRICULUM-ARCHITECTURE.md` | Curriculum architecture: 26-thread x M1-M17 knowledge matrix, sequence, production order |
| `curriculum/_core-concepts.md` | The Concept & Insight Register - 6 CECs + 14 EIs, designation discipline, watchlist (empty), change log (Rev 1.14) |

---

## The 17 modules (all frozen Rev 1.0/1.1)

**Part I-II - Sense & Perceive**
- **M1** Systems Engineering - `MODULE-01-systems-engineering.md` - CEC-01 (Signal-to-Action Spine); cycle-time feasibility
- **M2** Watermelon Field & Physical Interaction - `MODULE-02-...` - CEC-02 (Grip-Force Window); Hertzian contact/damage
- **M3** Sensing Modalities & Sensor Physics - `MODULE-03-...` - stereo depth error; deferred error-budget to M5
- **M4** Vision, Deep Learning, Detection & Ripeness - `MODULE-04-...` - EI-04 (Optimize the Mission Metric)
- **M5** 3D Localization, Sensor Fusion & State Estimation - `MODULE-05-...` - CEC-03 (Placement Error Budget); EI-05 (Attack the Dominant Term)

**Part III - Decide**
- **M6** Edge Computing, Optimization & Deployment - `MODULE-06-...` - CEC-04 (No-Cloud Edge Boundary); EI-06 (Measure on the Target)
- **M7** Decision-Making & Grasp-Policy Framework - `MODULE-07-...` - CEC-05 (Sim-to-Real Pipeline); EI-07 (Bound the Learner)

**Part IV - Act**
- **M8** Manipulator Kinematics, Workspace & Singularities - `MODULE-08-...` - EI-08 (Design the DOF Out); resolves track-width coupling
- **M9** Actuation, Fluid Power & AI-Assisted Grasp-Force Control - `MODULE-09-...` - *Fluid-power keystone*; EI-09 (Let the Physics Regulate); closes CR-01
- **M10** Mobility, Navigation & Field Operation - `MODULE-10-...` - EI-10 (The Field Is the Spec); closes track-width tradeoff (SR-I-11)

**Part V - Integrate**
- **M11** ROS 2, Real-Time Systems & Software Integration - `MODULE-11-...` - EI-11 (Make the Guard Independent); independent safety monitor
- **M12** Power, Embedded Systems & Electrical Integration - `MODULE-12-...` - EI-12 (Size to the Worst-Case Operating Point)
- **M13** System Integration & the Digital Twin - `MODULE-13-...` - *Integration keystone*; CEC-06 (Fidelity Ladder); EI-13 (Integrate Early); closes CR-03

**Part VI - Prove**
- **M14** Verification, Validation & Reliability - `MODULE-14-...` - EI-14 (Validate Adversarially)
- **M15** Safety, Ethics & Responsible Deployment - `MODULE-15-...` - EI-15 (Safety Is a Property You Argue For)

**Part VII - Deploy**
- **M16** Manufacturing, Cost, Sustainability & Deployment - `MODULE-16-...` - EI-16 (The Machine That Ships Pencils Out)
- **M17** Capstone: The Integrated Design Challenge - `MODULE-17-...` - EI-17 (Optimize the System, Not the Subsystem); exercises all six CECs

---

## The anchor architecture (final)

**Core Engineering Concepts (recurring analytical design tools):**
CEC-01 Signal-to-Action Spine / CEC-02 Grip-Force Window / CEC-03 Placement Error Budget / CEC-04 No-Cloud Edge Boundary / CEC-05 Sim-to-Real Pipeline / CEC-06 Simulation-First Fidelity Ladder.

**Engineering Insights (recurring judgment lessons), EI-04...EI-17** - one per module from M4, concluding with the synthesizing meta-insight EI-17.

**A signature result:** the *budget-and-attack-the-dominant-term* method (CEC-03 / EI-05) governs **four** quantities across the curriculum - accuracy (M5), energy & heat (M12), reliability (M14), and cost (M16) - the clearest evidence the anchor set is small, general, and transferable.

**Conflicts resolved:** CR-01 (hybrid actuation) closed at M9; CR-03 (twin fluid/contact fidelity) closed at M13.

---

## Conventions in force across all modules

30-section module template / tiered delivery (core authored in full; CAD Sec. 21 / figures Sec. 22 / animations Sec. 23 / HTML widgets Sec. 20 as **build specifications**) / Bloom's tags on every LO/SO / module-specific Engineering Failure Cases / Engineering Design Review (from M5) / explicit Sec. 11.3 CEC evaluation / lightweight cross-module synthesis notes / honest per-module weaknesses (not self-scored) / perishable specs flagged `[VERIFY@PUB]` / forward-refs tagged `[-&gt;Doc ...]`.

---

## Production & implementation roadmap (future work - no architecture changes)

The frozen curriculum defines *what* to build; production realizes it. Priority order, with the tiered placeholders and `[VERIFY@PUB]` items as the backlog:

1. **P0 support documents** - the critical path, in ratified priority order: **Doc B** OK *(frozen Rev 1.0 - requirements & system architecture; 123 requirements, DD/TS/CR registers, ratified parameter set)* -&gt; **Doc G** OK *(frozen Rev 1.0 - digital-twin fidelity; six-rung ladder, per-rung validation tolerances, R3 completes CR-03, evidence-admissibility rules)* -&gt; **Doc C** OK *(frozen Rev 1.0 - platform/hardware config; fluid-inclusive BOM completes CR-06, vendor-flexible)* -&gt; **Doc E** OK (frozen Rev 1.0 - safety case) -&gt; **Doc F** OK (frozen Rev 1.0 - engineering reference layer) -&gt; **Doc H/I/J** (bibliography, learning mappings, CAD/graphics standards). The three foundation baselines **B (requirements) &lt;-&gt; C (hardware) &lt;-&gt; G (simulation)** are distinct but tightly coupled, with bidirectional traceability among them. See M17 CP-M17-C for the ordered path to a fielded machine.
2. **Worked examples & reference solutions** - e.g., a fully-composed capstone reference design + acceptance argument; worked numeric examples resolving `[VERIFY@PUB]` placeholders against Doc B.
3. **Figures & CAD** - realize the Sec. 22 figure and Sec. 21 CAD build specs (SVG per Doc J).
4. **Interactive HTML widgets** - realize the Sec. 20 widget specs (the existing HTML course shell is preserved).
5. **Digital-twin assets** - build the fidelity-ladder twin (Doc G), especially the contact/fluid rung (CR-03) as the evidence source for M13-M16.
6. **Laboratory infrastructure** - realize the Sec. 24 labs and HIL/bench harnesses.
7. **Assessment materials** - expand Sec. 25-Sec. 27 (homework, quizzes, challenge problems) into full banks with rubrics.
8. **Implementation** - prototype bring-up, pilot, and the field/durability/safety campaigns the modules specify.

All production work conforms to the frozen modules and this register as the controlling baseline.

### P0 production doctrine (standing principles)

Every P0 document (Doc B OK, then G, C, E, F, H/I/J) is authored under four principles:
- **Harvest rather than rewrite** - consolidate what the frozen modules already established; do not redesign.
- **Ratify rather than reinvent** - turn perishable `[VERIFY@PUB]` placeholders into concrete, consistent engineering estimates with stated basis, flagged `[RATIFIED-EST]`/`[TBD-EXT]`.
- **Preserve traceability** - every entry cites its source module; the P0 layer adds structure and values, never new architecture.
- **Separate authority** - educational authority stays in the curriculum (modules + Concept & Insight Register); engineering authority lives in the P0 documentation. The two are consistent by construction.

---

## Production Assets Register (Production Phase - active)

Assets derive from the frozen modules and P0 baselines; each cites its source module and the ratified values it uses. Standing pattern for worked examples: **thesis -> full derivation -> live instrument -> principle (EI) -> Engineering Takeaway (the next action)**.

**MANDATORY pre-delivery check (every HTML asset, no exceptions).** Before presenting any HTML, run `ascii_clean.py` and confirm it reports CLEAN: zero raw non-ASCII bytes and zero entities outside `{&nbsp; &amp; &lt; &gt; &quot;}`. All special glyphs (section sign, dashes, middle dot, math symbols, Greek, arrows, sub/superscripts) are converted to readable ASCII (e.g. "Sec.", "sqrt", "sigma", "gamma", "&lt;=", "-&gt;", "&lt;sub&gt;i&lt;/sub&gt;"). The user must never see a special-character glyph. This runs immediately before `present_files`, never relying on any automatic process. A substitution must also preserve meaning and leave no artifact: operators stay operators (middle-dot -&gt; `*` multiply, never `/`), and dropped icons must not leave orphaned leading spaces.

**FROZEN VISUAL LANGUAGE (Rev 1.0, binding for every production asset).** The M5 publication-quality refactor (`M5-placement-error-budget-worked-example.html`) is the permanent reference template. Every asset - new or refactored - uses it, and does not experiment with alternate layouts absent a compelling instructional reason; consistency outranks novelty. The standard: (a) **all mathematics rendered by KaTeX** from ASCII LaTeX source (CDN: cdnjs KaTeX 0.16.9 + auto-render, `\[..\]` display / `\(..\)` inline, `renderMathInElement` on DOMContentLoaded then init) - never HTML-entity or sub/sup emulation; curriculum notation preserved exactly (`\sigma_Z`, `\sigma_{\mathrm{cal}}`, `T_{\mathrm{cycle}}`, `F_{\mathrm{bruise}}`); (b) **SVG hero panel** (technical-drawing frame, grid, corner registration ticks, tab label) providing layout/annotation only, with the KaTeX governing equation + engineering subtitle on top; (c) **derivations restructured** as statement -&gt; equation -&gt; explanation -&gt; engineering consequence, generous whitespace, no dense math blocks; (d) **SVG only for diagrams** (force/geometry/budget/block/coordinate/callout), never for ordinary equations; (e) **shared design system** - watermelon palette, Space Grotesk / IBM Plex Mono / Inter + KaTeX, consistent equation panels, insight/takeaway/kicker styles, reduced-motion + focus-visible; (f) **live readouts stay plain mono text** (KaTeX labels rendered once, not re-rendered per update).

**PRODUCTION STANDARD ARCHITECTURE (Rev 1.1, supersedes the CDN/runtime-KaTeX method above for all NEW work).** To satisfy the 12-point production mandate (deterministic rendering, dependency stability, graceful degradation, browser independence), the delivered files are now **fully self-hosted with math pre-rendered at build time - zero runtime KaTeX, zero external CDN.** Pipeline (tooling in `/home/claude/build/`, mirrored to `outputs/build/`, pinned in `package.json`): (1) author `<asset>-src.html` with ASCII LaTeX in `\\(..\\)`/`\\[..\\]` and any JS-built interactive labels in a `<script id="ktx-data" type="application/json">{"key":"latex"}</script>` block; (2) run `ascii_clean.py` on the **SOURCE ONLY**; (3) `node prerender.js <src> <out>` renders every equation + label to **static KaTeX HTML** via `katex.renderToString` (pinned katex 0.16.9); (4) the delivered HTML links vendored CSS by relative path - `vendor/katex/katex.min.css` (+ `vendor/katex/fonts/`, 20 woff2) and `vendor/fonts/fonts.css` (self-hosted Space Grotesk / IBM Plex Mono / Inter, 10 woff2, `@font-face` local) - **no `<script src>`, no cdnjs, no Google Fonts**; (5) graceful degradation: all primary content (hero, derivations, insight, takeaway, readout labels) is static and readable with JS disabled, with a `<noscript>` note in each interactive; JS is enhancement-only; (6) accessibility: semantic `<main>`/`<section>` + `aria-labelledby`, `role="math"`/`role="img"` + `aria-label`, `aria-live` on dynamic regions, `:focus-visible`, `prefers-reduced-motion`, `type="button"`. **CRITICAL - do NOT run `ascii_clean.py` on the pre-rendered output:** KaTeX legitimately emits Unicode inside `.katex` spans and MathML (that is correct, accessible typeset math), so the cleaner would corrupt it. ASCII discipline now guards the SOURCE (authored prose + LaTeX); KaTeX owns rendered math. The shared `vendor/` folder (508K) is deploy-with-the-folder; `outputs/build/BUILD.md` documents reproduction. **Exemplar: `M5-placement-error-budget-worked-example.html` (Rev 1.1).** Every other asset is migrated to this architecture one at a time. **Migration status:** M5 (done, exemplar), M9 (done), M8 (done), M4 (done). Pending: M6, CEC-01, CEC-05, CEC-06, EI-05, index.html, M5-homework, M9-homework. KaTeX LaTeX in SOURCES is ASCII, so `ascii_clean` still reports CLEAN on sources - verify per asset.

**SEMANTIC COLOR TOKENS (Rev 1.2, binding).** All color is referenced through semantic design tokens; no component may contain a raw hex or rgba value - the ONLY place raw color literals live is the `:root` theme block (the single documented exception is `<meta name="theme-color">`, which by HTML spec cannot take a `var()` and is itself a theme declaration). Token set: surfaces `--bg/--surface/--surface-2/--surface-3/--border/--border-strong/--grid-line`; text `--text-primary/--text-secondary/--text-muted/--text-lede/--text-cons/--text-on-accent`; semantic `--accent/--accent-dim/--accent-strong/--danger/--danger-text/--danger-dim/--warn/--info/--accent-2`; plus per-asset palettes (e.g. `--seg-*`) and tints. **Browser-independence rules baked in:** paint BOTH `html` and `body`; every major container declares BOTH `background` and `color`; intentional theme via `color-scheme:dark` + `<meta theme-color>` + `text-size-adjust:100%`; SVG colors set via inline `style="fill:var(--token)"` (presentation attributes cannot take `var()`); JS-built elements set colors from `var(--token)` strings; KaTeX `\textcolor` hexes are mapped to tokens at build time by `prerender.js` (color:#hex -> color:var(--token)). **Readability-first values:** small text is never a dim shade - kickers/labels use `--accent-dim` (#86ba35, ~8:1), muted labels `--text-muted` (#adb4a2, ~8:1), emphasis text `--danger-text` (#f697a4, ~8:1), small mono labels weight 500. All structural text verified >=7.5:1 on every surface. **Colored math** uses KaTeX `\htmlClass{c-warn|c-accent|c-danger-text}{...}` (build runs with `trust:true`) mapped to tokens via `.katex .c-*{color:var(--token)}` - this emits NO hex anywhere (style, MathML, or x-tex annotation), and is preferred over the `\textcolor` hex->token post-process (kept in `prerender.js` as a safety net). **Exemplar: M5 (Rev 1.2, no colored math); M9 (Rev 1.2, colored-math reference).** Migration status Rev 1.2: M5 done, M9 done, M8 done, M4 done (all four station instruments tokenized). M6 done (all module worked-examples tokenized; M6 was a full rebuild from the pre-refactor entity-math version). CEC-01/05/06 done, EI-05 done (full rebuilds from pre-refactor). All 6 module worked-examples + all 4 cross-cutting instruments now Rev 1.2. index (course hub) done - migrated off CDN Google Fonts to self-hosted vendor fonts, fully tokenized, browser-independent; content frozen Rev 1.0 preserved. M5 + M9 homeworks done (migrated off CDN fonts; entity math -> KaTeX; tokenized; reveal-solutions toggle preserved; 6 problems + 6 checked solutions each). ROLLOUT COMPLETE: all 12 assets are Rev 1.2 and under the drift guard.

**Definition of done (acceptance checklist).** An asset is not complete until it satisfies ALL of:
1. **Mathematically correct** - every displayed number and relation verified against an independent calculation; illustrative/synthetic models labeled as such, never passed off as measured data.
2. **Consistent with the frozen architecture** - correct CEC/EI citations; no contradiction with the 6-CEC + 14-EI anchor.
3. **Consistent with Doc B/C/G** - every ratified value matches the frozen baselines.
4. **Pedagogically complete** - the full arc: thesis -> derivation -> instrument -> principle -> Engineering Takeaway.
5. **Visually polished** - consistent design system, responsive, keyboard-focusable, reduced-motion respected.
6. **Interaction earns its place** - interactive only where interaction teaches something static text cannot; otherwise static.
7. **Ends with actionable engineering guidance** - a decision-oriented Engineering Takeaway, not just the principle restated.
8. **Publication quality** - ASCII-clean, well-formed, no artifacts, ready to ship.

| Asset | Type | Realizes | Source | Status |
|-------|------|----------|--------|--------|
| `M5-placement-error-budget-worked-example.html` | Interactive worked example | CEC-03 placement budget, EI-05 dominant term; live variance stack | M5 Sec. 7 / Doc B Sec. 5.2 | OK Complete |
| `M9-grip-force-window-worked-example.html` | Interactive worked example | CEC-02 grip-force window, EI-09 physics regulates; force gauge + two-bounds fault toggle | M9 Sec. 7 / Doc B Sec. 5.3 / Doc F Sec. 3 | OK Complete |
| `M8-kinematics-singularity-explorer.html` | Interactive worked example | Kinematics (L_i=||G-B_i||), gamma keep-out (SR-C-07), EI-08; draggable workspace/singularity map | M8 Sec. 7 / Doc B Sec. 4.3/Sec. 5.5 / Doc F Sec. 2 | OK Complete |
| `M4-detection-operating-point-worked-example.html` | Interactive worked example | Mission-derived operating point U(tau), EI-04; live PR curve + cost-ratio slider | M4 Sec. 7 / Doc B Sec. 5.4 (recall >= 90%) | OK Complete |
| `EI05-dominant-term-through-line-worked-example.html` | Cross-cutting worked example | EI-05 across four quantities (accuracy M5, energy M12, reliability M14, cost M16); four-panel small multiples, shared halve-dominant-vs-small move | M5 Sec. 7.4 / Doc B Sec. 5.2/5.5 / Doc C Sec. 4 | OK Complete |
| `M6-edge-latency-boundary-worked-example.html` | Interactive worked example | CEC-04 no-cloud edge boundary, EI-06 measure-on-target; latency budget bar + edge/cloud toggle showing unbounded network tail | M6 Sec. 7 / Doc B Sec. 5.5 (ctrl <= 20ms, s2a <= 300ms, <= 60W) | OK Complete |
| `CEC01-signal-to-action-spine-worked-example.html` | Cross-cutting worked example | CEC-01 signal-to-action spine + cycle-time budget (T_cycle <= d/v); mission-FSM timeline, SWING slider + two-arm toggle; integrates M4/M5/M8/M9/M10 | M1 Sec. 7.1 / Doc B (T_cycle <= 6s, v <= 0.2 m/s) | OK Complete |
| `CEC06-fidelity-ladder-worked-example.html` | Conceptual worked example | CEC-06 simulation fidelity ladder (R1-R6) + evidence admissibility; claim/evidence-rung/validation-frontier selector, over-trust vs admissible verdicts | Module 13 / Doc G (six rungs, per-rung validation) | OK Complete |
| `CEC05-sim-to-real-pipeline-worked-example.html` | Conceptual worked example | CEC-05 sim-to-real pipeline; domain randomization as robust optimization + reality gap; SVG performance curve, breadth/field sliders, validation gate hides the gap until measured | Module 7 Sec. 7.3 (illustrative model) | OK Complete |
| `index.html` | Course hub / production dashboard | Navigable entry point over all nine instruments; spine hero (4 stations), filterable card grid (all/core/station/cross-cutting), per-instrument component tracker (D/I/F/H/L pills), header production bar (auto-syncs from card data), 6/6 CEC coverage. **FROZEN Rev 1.0.** | Derived from the nine instruments + frozen anchor | OK Complete (frozen) |
| `M5-placement-error-budget-homework.html` | Homework set - REFERENCE TEMPLATE | First assessment asset and the **frozen reference template for all course homework** (FROZEN Rev 1.0). Pattern: a difficulty ramp of ~6 problems balancing computation -&gt; analysis -&gt; design -&gt; engineering judgment (mirroring professional practice, not textbook drill), each with an attempt-first reference solution that ends on the engineering lesson; links to its instrument; print-reveals solutions; every number independently checked. | Doc B Sec. 5.2 / M5 Sec. 7.4 | OK Complete (frozen template) |
| `M9-grip-force-window-homework.html` | Homework set | Built to the frozen M5 template: six problems (compute F=P*A, map window to pressure, size the actuator, compliance/force-error, defend the safety relief [judgment], firmer-cultivar challenge) with attempt-first solutions; all numbers independently checked | Doc B Sec. 5.3 / Doc C / M9 | OK Complete |

Backlog (candidates): M9 grip-force / pressure-as-force instrument; M8 IK & singularity-map explorer; M5 companion homework set & lab manual; EI-05 through-line worked examples (energy M12, reliability M14, cost M16); figures/CAD/animations per module Sec. 21-Sec. 23 build specs; capstone reference solution.

---

## Configuration-Control Policy (authoritative)

The governance model made fully explicit. Each artifact class has a defined change discipline:

| Artifact class | Change discipline |
|----------------|-------------------|
| **Modules (M1-M17)** | **Frozen except for errata.** Content is baselined Rev 1.0/1.1; the only permitted changes are corrections of error (typos, broken cross-references, factual slips) - not redesign, new concepts, or scope changes. Errata are versioned. |
| **P0 documents (Doc B, C, E, F, G, H, I, J)** | **Revision-controlled.** Baselined at Rev 1.0, then changed through controlled, versioned revisions as `[RATIFIED-EST]` values are measured, `[TBD-EXT]` items resolve, or engineering matures. Each revision preserves traceability to the frozen modules. |
| **Production assets** (figures, CAD, HTML widgets, twin software, labs, assessments, instructor resources) | **Derive from the frozen modules and the P0 baselines.** They realize the tiered build specifications (Sec. 20-Sec. 23) and the ratified parameters; they conform to the controlling baselines and never redefine them. |
| **Future research & improvements** | **Belong in new revisions, not in the educational baseline.** New findings, better estimates, and design evolutions enter through P0 revisions or clearly-marked successor artifacts - the frozen curriculum is not modified to chase them. |

**Principle:** the educational baseline is stable so that engineering can evolve beneath it. A measured value, a new result, or a design improvement is a *P0 revision* or a *new artifact* - never a disturbance to the frozen teaching modules. This keeps the curriculum citable and reproducible while the engineering, hardware, and evidence mature toward a fielded machine.

### BUILD DRIFT GUARD (Rev 1.2, binding)
The shipped `<asset>.html` files are GENERATED from `build/<asset>-src.html` (TeX source of truth) via `prerender.js`. `build/verify-build.js` + `build/build-manifest.json` re-render every source and byte-compare to the committed output, failing on any drift; `.github/workflows/verify-build.yml` runs it in CI (`npm ci` + `npm run verify`) on every push/PR. KaTeX is exact-pinned (0.16.9) with a committed `package-lock.json` so re-rendering is deterministic. NEVER hand-edit a shipped `.html`: edit the `-src.html`, run `npm run build`, commit the regenerated output, and add new assets to `build-manifest.json`. Current state: ALL 12 assets PASS the guard - 6 module worked-examples, 4 cross-cutting instruments, the course hub, and 2 homeworks. Rev 1.2 rollout complete. (byte-identical to a fresh render).
