# SIM2FIELD

A private 17-module digital textbook on a drive-over watermelon harvesting robot.

## Pipeline

`build/render-module.js` builds student and author HTML editions from each
`MODULE-XX.md` (the module is the single source of truth). Figures are theme-aware
SVGs (`F-*.svg`) using the frozen Rev 1.2 CSS token set, bound in
`build/media-manifest.json`. Interactive demos are bound the same way (`inlineDemos`)
and embedded as sandboxed iframes. `build/generate-figure-index.js` regenerates
`figure-index.html` from the manifest.

Four guards must pass after every change (`npm run verify` from `build/` chains them):

- `verify-build.js` - KaTeX drift guard: generated HTML byte-matches a fresh render.
- `verify-typography.js` - ASCII authoring standard (no forbidden authored Unicode).
- `verify-figures.js` - every shipped figure has a resolving manifest binding.
- `verify-demos.js` - every embedded demo has a resolving binding whose file exists.

## Documents

- [CAPTURE-LIST.md](CAPTURE-LIST.md) - shopping list for the 8 capture-preferred figure
  slots (real photo / CAD export / measured field data) that are deliberately not
  fabricated. Per slot: id, title, anchoring section(s), what the image must show,
  required asset type, and placeholder status.
- `figure-inventory.html` - all 116 figure slots classified (108 built, 8 capture-preferred).
- `figure-index.html` - gallery of the 108 built figures plus the interactive 3D demos.
- `build/BUILD.md` - build pipeline, the four guards, and the demo/iframe mechanism.
- `SESSION-LOG.md` - log of the 2026-07-21 working session.
- `CURRICULUM-INDEX.md`, `PRODUCTION-STANDARD.md`, `MODULE-RENDERING-DIRECTIVE.md` -
  curriculum and production references.
