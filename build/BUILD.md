
## Drift guard (source <-> generated HTML)

The math source of truth is the TeX in each `build/<asset>-src.html`. The shipped
`<asset>.html` at the repo root is a **generated artifact** (pre-rendered KaTeX, no
runtime KaTeX). To keep the two from diverging:

- `build-manifest.json` maps every source to its generated output (one entry per asset).
- `verify-build.js` re-renders each source through `prerender.js` (exact-pinned KaTeX)
  and byte-compares against the committed output. It fails, naming the file and byte
  offset, if any output differs from a fresh render of its source, if a source is not
  ASCII, or if either file is missing.
- Run locally: `npm run verify` (from `build/`). Add `OUT_DIR=/path` to check outputs
  that live elsewhere than the parent dir.
- CI: `.github/workflows/verify-build.yml` runs `npm ci` + `npm run verify` on every
  push/PR that touches `build/**` or a root `*.html`, so a hand-edited or stale output
  cannot merge.

Rule: never hand-edit a shipped `.html`. Edit the `-src.html`, run `npm run build`
(or `node prerender.js <asset>-src.html ../<asset>.html`), and commit the regenerated
output. When a new asset is migrated, add its `src -> out` line to `build-manifest.json`.

## Authored-typography guard (ASCII source policy)

`verify-typography.js` enforces the ASCII authoring standard automatically, so it
never becomes a manual review item. It rejects **forbidden authored Unicode**:
em / en / figure dash, horizontal bar, curly quotes, ellipsis, the typographic
minus (U+2212), soft and non-breaking hyphen, and the horizontal flow arrows
(`->` `<-` `<->` `=>`). It **allows** the Unicode that is genuine rendering output
or notation: KaTeX math (inside `<span class="katex">`), TeX math in Markdown
(`$...$`, `$$...$$`, `\(...\)`, `\[...\]`), HTML entities (ASCII bytes in the file),
and non-forbidden science / diagram symbols (Greek, `<= >= x`, box-drawing, the
section sign, degree sign, status glyphs, vertical and footnote-return arrows,
diacritics).

- Scans every `*.md`, every `build/*-src.html`, and every shipped `*.html` under
  `OUT_DIR` (default: parent of `build/`). Math and KaTeX regions are masked
  position-preserving, so it reports exact `file:line:col` with codepoint + name.
- Run locally: `npm run verify` (drift guard, then typography guard) from `build/`.
  Or individually: `npm run verify:typography`. Add `OUT_DIR=/path` to check
  out-of-tree outputs.
- CI runs `npm run verify` on every push / PR touching `build/**`, a root `*.html`,
  or a root `*.md`, so a forbidden authored character cannot merge.

Fix in the SOURCE, never the shipped file: arrows -> `->` `<-` `<->` `=>`, minus
-> `-`, quotes -> ASCII, dashes -> context-appropriate ASCII, ellipsis -> `...`.
