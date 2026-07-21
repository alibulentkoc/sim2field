# Module Rendering Directive

Status: normative contract for the SIM2FIELD digital textbook renderer. This
document defines how a single authored module becomes published chapters. It
describes the behavior implemented in build/render-module.js (v1.3) and states
the parts that are still module-01-specific so the path to all 17 modules is
explicit. It obeys the frozen writing standard in PRODUCTION-STANDARD.md.

## 1. Purpose and principle

One source, two editions. Each authored file MODULE-XX.md is the single source of
truth. The renderer never re-authors content; it composes, styles, and gates
what the author already wrote, then injects finished media. Two editions are
produced from that one source:

- Student edition: the mission-led reading. Learning content plus finished,
  embedded media only. No production scaffolding.
- Author edition: everything in the student edition plus production
  specifications, figure placeholders, governance and instructor notes, and
  answer keys.

If a fact appears in a chapter, it came from the module or from a finished media
asset. Nothing is invented at render time.

## 2. Inputs and invocation

Command:

    node render-module.js <MODULE-XX.md> <out.html> <NN> <student|author>

- Argument 1: path to the authored module Markdown.
- Argument 2: output HTML path.
- Argument 3: module number NN (for example 01). If omitted, it is inferred from
  the source filename.
- Argument 4: edition, student or author. Default is student.

Sibling inputs the renderer reads directly:

- build/module.css: the full reader design, bound to the frozen Rev 1.2 tokens.
- The per-module media manifest (see Section 9). In v1.3 this is an in-file MAP
  object; the target is an external manifest.

## 3. Determinism guarantees

The output HTML is a pure function of (module source, module.css, media manifest,
edition). Same inputs produce the same bytes. This is achieved by:

- No network at build time and no network at view time. All math is pre-rendered
  to HTML with KaTeX at build time; the page links only self-hosted assets under
  vendor/.
- Pinned toolchain: katex 0.16.9, markdown-it 14.1.0, Node 22. Restore with
  npm ci before a build.
- Markdown configured with html on, linkify off, typographer off, breaks off.
  Typographer off is required by the writing standard: the parser must not invent
  smart quotes or dashes.
- Stable element ids derived by slugging section headings, so anchors and the
  table of contents are reproducible.
- The writing standard is enforced at render time (Section 11), so output
  punctuation does not depend on the editor or platform that produced the source.

## 4. Module source contract

A module is one Markdown file with a front block followed by level-two sections.

Front block (everything before the first line that begins with "## "):

- Title line: a single level-one heading, "# Module N: Title".
- Metadata: bold key lines such as "**Part ...**" and "**Estimated time:** ...".
- Governance note: a blockquote (lines beginning with "> ") holding the authoring
  or governance note.

Body: a sequence of level-two sections, each "## N. Heading" followed by prose.
The curriculum uses a fixed 30-section template. The renderer keys on section
number and on a small set of heading phrases; it does not require every title to
match a fixed string, only the structural ones listed in Section 7.

Authored devices the renderer recognizes and styles:

- Blockquote callouts, classified by their opening text: Core Engineering
  Concept, Industry Perspective, Simulation-first hook, Authoring note, or a
  plain note.
- Tables, wrapped for horizontal scrolling on small screens.
- A fenced ASCII diagram containing the signal to action spine (detected by the
  token PERCEIVE), promoted to a captioned figure.
- Inline math in single dollar signs and display math in double dollar signs.

## 5. Parse model

1. Normalize line endings to LF.
2. Split at the first "\n## " into front and body.
3. From the front, extract the title, the metadata block, and the governance
   blockquote.
4. Split the body into sections on each "## " boundary. For each section,
   normalize the heading through the ASCII pass and strip any trailing
   "(build specification ...)" marker from the heading text.
5. Pull the opening sections out of the normal flow because they feed the
   briefing. Module 1 (course intro): "Why This Course Exists ..." becomes the
   mission narrative source and "By the End of This Course ..." becomes the
   objectives source. Modules 2 through 17: the module's own "N. Module Overview"
   becomes the narrative source (the first such section only; if a course-level
   narrative was already found, the overview stays in the body).

## 6. Mission opening composition

The opening is composed from the module's own front prose. It is not new text.

- The mission narrative is split into paragraphs. Module 1 (course-level
  narrative) arranges the full set of movements: a hero line, then Mission, then
  The engineering challenge, then Why this matters, then The machine. Modules 2
  through 17 (overview-led narrative) take the first plain paragraph as the hook
  and render the remainder as one briefing body, with the module's own devices
  (concept callouts, tables) styled. The exact mapping is recorded in the renderer.
- The objectives list is rendered under the label "Mission objectives".
- Author edition only: a collapsed block holds the module metadata and the
  governance note.
- The chapter body begins after a visible divider.

Current status: frozen (see Change control and the Frozen educational pattern).
The composer selects a path by opening kind. Module
1 uses its course-level narrative and objectives; modules 2 through 17 compose the
briefing from their own Module Overview, with objectives left to render as the
numbered Learning Objectives section. The objectives block appears in the briefing
only when a course-level "By the End of This Course" section is present. Modules
not yet in the media manifest bind no widget or figure, so no cross-module media
is injected.

Standardized briefing (frozen): when a module's overview is authored with the
labelled lead-ins Mission, Previous milestone, Engineering problem, Design
tension, and What this module resolves, the briefing renders those movements in
canonical order with the shared .movement styling; a module not yet authored that
way uses the prose fallback. The composer is not to be redesigned further.

## 7. Section roles and the render map

The renderer assigns a role to each section from its number or heading, then
renders and places it per edition. Standard learning sections (most of 1 through
19, and the closing sections) render as prose with styled callouts, tables,
figures, and pre-rendered math, and appear in both editions.

Structural roles:

| Section pattern            | Role                    | Student        | Author            |
|----------------------------|-------------------------|----------------|-------------------|
| 7. Mathematics ...         | math, media anchor      | widget embed   | figure slot       |
| 20 through 23              | build specifications    | excluded       | included, tagged  |
| 24. Laboratory ...         | lab                     | included       | included          |
| 25. Homework ...           | homework                | included       | included          |
| 26. Quiz ...               | quiz                    | questions only | questions + key   |
| 27. Challenge ...          | challenge               | included       | included          |
| 28. ... / quality summary  | instructor              | excluded       | collapsed block   |
| Failure Cases ...          | failure (styling)       | included       | included          |

The section-7 anchor is where the module's central quantitative result lives, so
it is where the finished interactive is embedded in the student edition and where
the corresponding figure is placed in the author edition.

## 8. Edition rules

Student edition includes: the mission opening, all standard learning sections,
the lab, homework, quiz questions, the challenge, styled callouts, tables,
the authored spine figure, pre-rendered math, and finished embedded media only.

Student edition excludes: sections 20 through 23 (build specifications), the
instructor and quality-summary sections, figure placeholders, widget
specification labels, governance and metadata blocks, and quiz answer keys.

Author edition adds, on top of everything a student sees: the build
specification sections (tagged), figure placeholders at their anchors, the
widget shown at its specification anchor with its production note, the collapsed
metadata and governance block, the collapsed instructor sections, and a
collapsed quiz answer key. Table of contents entries are tagged to mark
instructor and specification sections.

The gate is single-sourced: one predicate decides student exclusions, so the two
editions cannot drift out of agreement.

## 9. Media injection contract

Media are finished assets injected at defined anchors. The renderer does not
generate figures or widgets; it places them.

Figures:

- A figure is either finished or a slot. A slot renders a labeled placeholder
  carrying the figure id, title, and description, and appears in the author
  edition only. A finished figure appears in both editions.
- The authored ASCII spine diagram is a finished, in-source figure and is
  promoted with a caption wherever it appears.
- Figure ids follow F-M<module>-<n>.

Widgets:

- A widget is a finished interactive asset. In the student edition it is embedded
  at its concept anchor (section 7 for module 1) framed as a finished interactive
  with a plain caption. In the author edition it is embedded at its specification
  anchor (section 20) with its id, a built marker, and its production note.
- Widget ids follow W-M<module>-<n>.

Labs, homework, quizzes:

- Lab (section 24), homework (section 25), and quiz (section 26) render inline at
  their section positions in both editions, with edition-specific styling.
- Quiz answer keys are authored inline as bracketed bold markers. The renderer
  extracts them: the student edition shows questions only; the author edition
  appends a collapsed instructor answer key.

Per-module media manifest (implemented):

Media bindings are declared per module in build/media-manifest.json, not
hardcoded. Each module number maps to: label (the course label), anchor7 (the
section-7 concept-anchor binding, a widget and/or a figure the renderer injects
into the reading, or null when no inline-ready asset exists yet), and media (the
module's full media catalogue extracted from its own build specifications: kind,
id, title, and where available an anchor and description, each with status slot
or finished). The renderer loads this file and injects at anchor7; binding a
produced asset is a data edit in the manifest, not a code change. The catalogue
currently holds 280 specified entries (116 figures, 67 widgets, 50 animations,
47 CAD) across the 17 modules; the one inline-ready finished asset is the Module
1 spine widget.

Current status: v1.3 carries an in-file manifest for module 1 only, and falls
back to the module-1 bindings for any other number. Externalizing this manifest
and populating it per module is a required step before the 16-module run.

## 10. Instructor-only exclusion

Instructor and production material is gated out of the student edition by role,
not by manual editing:

- Sections 20 through 23 and the instructor and quality-summary sections are
  dropped entirely from the student build.
- Quiz answer keys are separated from quiz questions at parse time.
- Metadata and governance are emitted only in the author edition, inside a
  collapsed block.

Because these decisions are computed from section role, a student chapter cannot
accidentally leak specification, answer-key, or governance content.

## 11. Writing standard enforcement

The renderer enforces PRODUCTION-STANDARD.md at build time:

- Authored prose and the renderer's own generated chrome are normalized to ASCII
  punctuation. Em dashes become a colon in a label or a comma in prose; en dashes
  become "to" in numeric ranges, a hyphen in compounds, or a comma otherwise;
  ellipsis becomes three periods; curly quotes become ASCII quotes; bullets
  become ASCII hyphen bullets; spaced middots become commas.
- A final pass runs after assembly and is KaTeX-safe: it does not rewrite the
  math layer, which owns its Unicode by design, nor the bare multiplication
  middot, nor math-layer spacing.
- The build reports any residual must-remove punctuation as a leftover count,
  which must be zero.

## 12. Design system binding

The renderer emits pages bound to the frozen Rev 1.2 design system:

- Self-hosted fonts and a pre-rendered KaTeX stylesheet, linked from vendor/.
  No content delivery network is used at build or view time.
- Semantic color tokens only. The single literal color outside the token block
  is the theme-color meta value.
- Browser independence: color-scheme, theme-color, painted html and body, and
  text-size-adjust are all set so the page renders consistently across engines.
- Accessibility: a skip link, a labeled contents navigation, and a scroll-spy
  that highlights the current section.

Deployment requirement: the vendor/ directory (fonts and KaTeX assets) must ship
alongside the generated HTML. A chapter is not self-contained without it.

## 13. Whole-textbook build

The full digital textbook is built by rendering every module in both editions
from the same sources, with the same toolchain, into the output directory:

- For each module NN in 01 through 17: render a student chapter and an author
  chapter.
- Chapters are generated artifacts, not sources, and are not tracked by the asset
  drift guard; they are always reproducible from the module source plus the media
  manifest. The drift guard covers the frozen media assets under vendor/ and the
  standalone widgets, not the chapters.
- The build is deterministic per Section 3, so a clean checkout plus npm ci plus
  the render commands reproduces the whole textbook byte for byte.

## 14. Open items and required generalizations

These are known and must be resolved before the 16-module production run. They
are limitations of the current implementation, not of the contract.

1. Resolved. Widget embedding now inlines a chrome-less worked-example fragment
   (scoped styles under .wx-embed, a container-scoped script, semantic tokens from
   the host). The standalone page single-sources the same fragment through a
   build-time include, so the chapter embeds it inline with no iframe and no
   duplicated derivation.
2. Resolved. The mission-opening composer is generalized: module 1 keeps its
   course-level briefing; modules 2 through 17 compose the briefing from their own
   Module Overview (hook plus styled body), objectives deferred to the numbered
   section. Modules not yet in the media manifest bind no widget or figure, so no
   cross-module media is injected (see item 4).
3. Figures are slots only; none of the specified figures are produced yet. The
   figure-injection contract supports finished figures, but the assets do not
   exist.
4. Resolved. Media bindings are externalized to build/media-manifest.json and
   populated for all 17 modules (label, the section-7 concept binding, and a full
   media catalogue extracted from each module's build specifications). Only Module
   1 has an inline-ready finished asset today; the rest carry null concept
   bindings with their catalogue entries as slots, so binding each produced asset
   becomes a one-line data edit.
5. The section-to-role map assumes the fixed 30-section numbering. Modules that
   deviate from the numbering need the map to be tolerant or manifest-driven.

## 15. Change control

- The pipeline version is recorded in the build header and in each chapter
  footer.
- This directive and PRODUCTION-STANDARD.md are frozen references. Extend them
  deliberately; do not fork the rules inline in code.
- Any new drift-guarded asset is added to the build manifest and covered by the
  verification build. Chapters are excluded from the drift guard by design.

## 16. Frozen educational pattern

The chapter's pedagogical arc is settled and frozen. Every chapter follows the
same beats, so the textbook reads as one authored engineering story:

1. Mission briefing
2. Engineering problem
3. Design tension
4. What this module resolves
5. Theory
6. Mathematics
7. Engineering consequences
8. Requirements
9. Simulation
10. Lab
11. Homework

The opening (beats 1 to 4) is realized by the mission-opening composer as a
five-movement briefing (Mission, Previous milestone, Engineering problem, Design
tension, What this module resolves); beats 5 to 11 are the numbered body sections.

Do not redesign chapters. The frozen system surfaces are: renderer architecture,
chapter layout, mission-opening placement, typography (PRODUCTION-STANDARD.md),
the widget-embedding strategy (an inline, chrome-less worked-example fragment),
and the student / author separation. The mission-opening composer is frozen as
the five-movement briefing with a prose fallback. Effort now moves off chapter
design and onto authoring the remaining modules into this pattern and producing
the figures, animations, and worked examples the pattern calls for.

## 17. Engineering narrative through the mathematics

The final freeze refinement, and the pedagogical bar every module's Theory and
Mathematics sections must clear. Dense mathematics must keep the engineering
narrative visible: each dense subsection reconnects to the machine with a short
interpretation beat answering "what does this equation change about the machine?"
The italic "Use:" note in Mathematics and the closing machine-sentence in each
Theory subsection are that device; a dense block (Jacobians, covariance
propagation, Kalman/EKF gain and update equations, quadrature budgets) does not
end without one. The mathematics serves the engineering story and never becomes
the story. This is what keeps the course a systems-engineering text rather than a
conventional robotics text. When authoring or reviewing a math-heavy section,
the test is simple: every few pages, a sentence answers what the equation changes
about the machine.
