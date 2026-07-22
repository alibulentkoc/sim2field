
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

## Figure- and demo-binding guards (manifest <-> shipped HTML)

Two guards close the drift class where a figure or demo ships in a module edition but
has no `media-manifest.json` binding, so a re-render would silently drop it (the drift
guard above only covers the KaTeX assets, not the module HTML). Both run in
`npm run verify` / `test` alongside the drift and typography guards.

- `verify-figures.js` - every real figure (`<figure class="figure fig-real">`) in a
  shipped module edition must have a resolving `inlineFigures` (or `anchor7`) binding
  whose `F-*.svg` exists.
- `verify-demos.js` - every embedded demo (`<div class="widget-embed demo"> ... <iframe>`)
  must have a resolving `inlineDemos` binding whose file exists.

### Interactive demos (`inlineDemos`)

A demo is an existing self-contained worked-example HTML embedded by section through an
`inlineDemos` binding, rendered as a sandboxed iframe by `render-module.js` (`demoEmbed`):

    <iframe src="<file>" sandbox="allow-scripts" loading="lazy" ...>

- Identical in the student and author editions (no mode branching); anchored by the
  demo's top-level `section`, exactly like `inlineFigures`.
- Offline: relative `src`, no CDN. three.js is vendored under `vendor/three/0.160.0/`
  (core + OrbitControls / RoomEnvironment / lil-gui addons); the two 3D sims
  (`harvesting-robot-sim.html`, `watermelon-harvester-amiga.html`) import it through a
  local importmap - importmap addresses must start with `./` (a bare `vendor/...` is
  rejected as an invalid address).
- Sandbox per binding: a demo that fetches module subresources (the 3D sims) needs
  `"sandbox": "allow-scripts allow-same-origin"` in its `inlineDemos` entry, because
  `allow-scripts` alone runs the iframe in an opaque origin that CORS-blocks same-server
  module fetches. Inline-JS demos (the worked-examples) keep the default `allow-scripts`.

### Browser verification (the sandbox flag is sufficient)

Verified in a real browser that the demos render, including interactivity, under the
shipped `sandbox="allow-scripts"`:

- Served the repo over local http and drove headless Chrome. The sandboxed iframe renders
  the full worked-example - derivation, pre-rendered KaTeX, and the JS-driven interactive
  widget (SVG + live sliders).
- A controlled comparison (no sandbox vs `allow-scripts` vs `allow-scripts allow-same-origin`)
  produced byte-identical captures, so the sandbox flags do not block the demo JS;
  `allow-scripts` alone is sufficient and no `allow-same-origin` is needed.
- Reproduce: `python -m http.server 8137` from the repo root, then
  `chrome --headless=new --screenshot=out.png --window-size=1240,2600 --virtual-time-budget=10000 http://127.0.0.1:8137/module-08.html`.
  Use `--headless=new` for correct out-of-process-iframe compositing; the old `--headless`
  clips tall iframes (a capture artifact, not a rendering failure).

## Publishing the public student site (build/publish-student.js)

`build/publish-student.js` builds the public student site into `dist-public/` and pushes it
to the student book repo (`github.com/alibulentkoc/sim2field-book`, branch `main`).
`dist-public/` is gitignored in this private repo and carries its own `.git` pointing at the
book remote.

What it emits (the student site only): the 17 student module editions, `index.html`,
`figure-index.html`, `figure-inventory.html`, the 8 worked-example demos and 2 offline 3D
sims those pages reference (plus the 2 sim thumbnails), and the `vendor/` tree (fonts,
KaTeX, three.js). Figures are inline SVG in the pages, so no `F-*.svg` files are referenced
or copied.

Excluded absolutely: author editions, solutions, homework check scripts, module markdown,
`SESSION-LOG.md`, `CAPTURE-LIST.md`, the guards and build scripts, the curriculum register,
and `instruments.html`.

Publish-time transforms (applied to the exported copies only, never to the private source):
the landing page's author-edition links, its `instruments.html` link, and its `build/`
footer note are removed; each module's curriculum-register link is unwrapped to plain text
and the `source: MODULE-NN.md` provenance is dropped from the top bar and footer.

Leak + link check (runs before any push; a failure aborts with nothing published):
- no emitted file may contain an author/solution content marker (`<body class="ed-author"`,
  `<details class="answers`, `Author / production edition`, `Homework solutions (instructor)`);
- no emitted page's `href`/`src` may target an excluded/unpublished file (author edition,
  `.md`, solutions, `SESSION-LOG`, `CAPTURE-LIST`, `instruments.html`, `build/`, `-src.html`,
  `checks/`) - checked on link values, so module prose that merely mentions such a path is
  not a false positive;
- every remaining local link must resolve to an emitted file (self-contained; nav resolves).

Run:

    node publish-student.js            # build, leak-check, and push to the book repo main
    node publish-student.js --no-push  # build and leak-check only (dry run, no publish)

The book repo must already exist and be pushable with the ambient git credentials; the
script force-pushes `dist-public/` to its `main`.
