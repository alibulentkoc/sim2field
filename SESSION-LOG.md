# SIM2FIELD Session Log

Session date: 2026-07-21. Baseline before this session: commit `b0a853c`
("SIM2FIELD working set recovered from chat sandbox"). All work below is pushed
to `origin/main`. 24 commits through the creation of this log (`9b5e989`); later
maintenance edits to this file are not counted.

## Overview

The book began this session figure-complete as shipped but NOT reproducible from
source: 12 figures shipped in the module HTML yet had no `media-manifest.json`
binding, so any re-render would silently drop them. The session reconciled those
bindings, added a guard to enforce the invariant, fixed a class of SVG typos and a
duplicate figure, wrote a generator for the previously-ungenerated figure index,
bound 10 interactive demos (including two offline 3D sims), and verified the demos
render in a real browser.

Standing rules honored throughout: one deliverable per turn; no engineering content
changes to module text; ASCII-only authored punctuation; figures depict only what
the section text supports (each reconciliation was fidelity-checked); every change
verified byte-confined before commit; guards green after each change.

## Environment notes

- Node is not on PATH here; the Adobe-bundled Node v24.13.0
  (`C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe`) runs the
  pipeline. `verify-build.js` spawns a bare `node`, so its directory must be on PATH
  for the drift guard.
- The scripts (`render-module.js`, `prerender.js`, `verify-*.js`) use `__dirname` and
  `OUT_DIR` (default: parent of `build/`), which already point at this local folder.
  No hardcoded paths needed adapting.

## Workstream 1: figure-binding reconciliation (12 figures)

Discovered that the committed `figure-index.html` and the shipped module HTML were
ahead of the manifest: 12 real figures were injected in the HTML but absent from
`inlineFigures`. Reconciled each by restoring its binding, then verifying a fresh
render reproduced the committed HTML byte-for-byte (for single-orphan modules) or
differed only by the intended figure block.

- `830f2ea` F-M3-6 ripeness cue to modality
- `6c6739e` F-M3-7 calibration frames
- `42f1a96` F-M4-7 development vs runtime AI boundary
- `217acc9` F-M5-5 placement error budget (master)
- `14020aa` F-M6-6 thermal throttling
- `ee2a18a` F-M7-6 domain randomization and reality gap
- `4e6ae28` F-M10-6 lateral navigation budget
- `240e4cf` F-M11-7 safety reaction time vs time-to-harm
- `9e1ac0c` F-M12-6 endurance/coverage vs temperature
- `43c1900` F-M14-5 adversarial envelope coverage
- `caff8f3` F-M15-6 responsible-deployment considerations
- `e07cf98` F-M17-4 composed budgets vs limits (campaign complete)

New guard: `5939bf6` added `verify-figures.js` (third guard, wired into
`npm run verify`/`test`): every `fig-real` figure in a shipped edition must have a
resolving `inlineFigures`/`anchor7` binding whose SVG exists. It was red (flagging the
outstanding orphans) until the campaign burned it down to zero.

## Workstream 2: integrity fixes

- `814a927` Fixed a systematic SVG typo across 23 files: 144 invalid `font-weight`
  values that were mangled `text-anchor` attributes (`font-weight="anc=middle"` ->
  `text-anchor="middle"`; redundant `font-weight="end"` dropped). Propagated by
  re-rendering the 12 affected modules from source and byte-patching `figure-index.html`
  (no generator existed for it at that point).
- `0e45b73` Re-rendered module 01 to drop a duplicate F-M1-5 (it had been injected via
  both `anchor7.figure` and a stale `inlineFigures` entry). `verify-figures.js` checks
  binding existence, not duplication, so this was invisible to the guard.
- `afd0107` Relocated F-M4-7 from Section 6 to Section 17 to match its caption and its
  topical home (AI Integration).

## Workstream 3: figure-index generator

- `1b33273` Wrote `generate-figure-index.js` (the old environment's generator was lost).
  It rebuilds `figure-index.html` deterministically from `media-manifest.json` (titles,
  sections) and the `F-*.svg` files (verbatim bodies, numeric order per module), with
  the static chrome and 17 module display-titles as constants. Regenerating repaired the
  stale index: the diff vs the old committed file was exactly the 12 reconciled cards
  (proper title + Section span) plus F-M1-5's title normalized to the manifest value.
  Idempotent (re-running leaves the tree clean).

## Workstream 4: interactive demos

An `inlineDemos` binding parallel to `inlineFigures`, injected by `render-module.js`
as a sandboxed iframe (`demoEmbed`), identical in student and author editions, offline.

- `e84e42f` Bound 8 existing self-contained worked-examples (M4, M5, M6, M7, M8, M9 at
  Section 7; M13 at Section 6). Added `verify-demos.js` (fourth guard): every embedded
  demo must have a resolving `inlineDemos` binding whose file exists.
- `fc1179e` Unified M1's demo (previously an inline `anchor7.widget`) to the same iframe
  mechanism.
- `90e596c` Documented the binding guards and the demo browser verification in
  `build/BUILD.md`.
- `0237378` Vendored three.js 0.160.0 under `vendor/three/0.160.0/` (core + OrbitControls,
  RoomEnvironment, lil-gui) and bound the two 3D sims (harvesting-robot-sim -> M10,
  Amiga -> M17).
- `42711cf` Captured 960x600 thumbnails of both sims and extended the generator to append
  an "Interactive 3D demos" section of linked thumbnail cards.

Browser verification (headless Chrome over local http): the worked-example demos render
fully under `sandbox="allow-scripts"`, including the interactive widget. Two findings for
the 3D sims:

1. Importmap addresses must start with `./` - a bare `vendor/...` is rejected as an
   invalid address, so `'three'` failed to resolve.
2. The sims fetch module subresources, which are CORS-blocked in the opaque origin of
   `allow-scripts` alone; they need `sandbox="allow-scripts allow-same-origin"`. Made
   the sandbox per-binding; the inline-JS demos keep the default `allow-scripts`.

Both sims verified rendering the 3D scene plus lil-gui controls, loading three.js only
from `vendor/` (no CDN, no 404s), standalone and inside the sandboxed iframe.

## Workstream 5: repo hygiene

- `eb40e83` Added `.gitignore` for `.claude/` and OS/editor junk. Note:
  `build/node_modules` stays tracked on purpose (vendored, exact-pinned KaTeX for the
  drift guard and offline builds).

## Final state

Four guards, all green (`npm run verify` chains them):

- `verify-build.js` (drift): 13/13 KaTeX assets byte-match a fresh render.
- `verify-typography.js`: 159 files scanned, no forbidden authored Unicode.
- `verify-figures.js`: 216 shipped real figures all resolve to a binding.
- `verify-demos.js`: 20 embedded demos (10 modules x 2 editions) all resolve to a
  binding whose file exists.

Reproducibility: all 17 modules x 2 editions render byte-identical from source, and
`generate-figure-index.js` reproduces `figure-index.html` byte-for-byte.

Open items (flagged, not acted on): the 8 capture-preferred figure slots (F-M2-1,
F-M2-7, F-M4-6, F-M10-1, F-M13-1, F-M13-6, F-M16-6, F-M17-1) remain spec placeholders
by design (they need real photo, CAD, or measured data and are not fabricated).
