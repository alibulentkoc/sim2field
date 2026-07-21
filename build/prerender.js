#!/usr/bin/env node
/* SIM2FIELD KaTeX pre-render pass.
   Renders every  \[...\] (display) and \(...\) (inline) in an HTML file to
   static KaTeX HTML at BUILD time, plus any label map in
   <script id="ktx-data" type="application/json">{ "key": "latex", ... }</script>.
   The delivered file then needs no runtime KaTeX: deterministic, self-contained,
   and readable with JavaScript disabled. KaTeX version is pinned in package.json. */
const fs = require('fs');
const katex = require('katex');

const [,, infile, outfile] = process.argv;
if (!infile || !outfile) { console.error('usage: prerender.js <in> <out>'); process.exit(1); }
let html = fs.readFileSync(infile, 'utf8');

// 0) build-time includes: <!--#include "relpath"--> inlines another source file
//    verbatim, resolved relative to infile's directory, BEFORE the math pass so any
//    TeX inside the included fragment is rendered too. This lets one interactive live
//    in a single source that both a standalone page and a chapter embed pull from.
//    No include directive present -> no-op, so every existing asset is unaffected.
const path = require('path');
let nInc = 0;
html = html.replace(/<!--\s*#include\s+"([^"]+)"\s*-->/g, (_, rel) => {
  nInc++;
  return fs.readFileSync(path.join(path.dirname(infile), rel), 'utf8');
});

function render(tex, display) {
  return katex.renderToString(tex, { displayMode: display, throwOnError: true, strict: 'ignore', trust: true });
}

// 1) display math  \[ ... \]  (non-greedy, across newlines)
let nDisp = 0;
html = html.replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => { nDisp++; return render(tex.trim(), true); });

// 2) inline math  \( ... \)
let nInline = 0;
html = html.replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => { nInline++; return render(tex.trim(), false); });

// 3) label map for JS-built interactive elements
let nLabels = 0;
html = html.replace(
  /(<script id="ktx-data" type="application\/json">)([\s\S]*?)(<\/script>)/,
  (_, open, body, close) => {
    const map = JSON.parse(body);
    const out = {};
    for (const k of Object.keys(map)) { out[k] = render(map[k], false); nLabels++; }
    return open + JSON.stringify(out) + close;
  }
);

// 4) tokenize KaTeX-emitted colors: \textcolor{#hex} renders to style="color:#hex".
//    Map those hexes to semantic tokens so NO component carries a raw hex.
//    Scoped to `color:#hex` so it never touches the :root token definitions.
const HEX_TO_TOKEN = {
  '#e0a03b':'var(--warn)', '#9bcf3b':'var(--accent)', '#86ba35':'var(--accent-dim)',
  '#f0556a':'var(--danger)', '#f697a4':'var(--danger-text)', '#b93b4c':'var(--danger-dim)',
  '#6fb0d9':'var(--info)', '#b98bd9':'var(--accent-2)'
};
let nColors = 0;
html = html.replace(/color:\s*(#[0-9a-fA-F]{6})/g, (m, hex) => {
  const tok = HEX_TO_TOKEN[hex.toLowerCase()];
  if (tok) { nColors++; return 'color:' + tok; }
  return m;
});
// KaTeX also stamps the color into its hidden MathML layer as mathcolor="#hex".
// That layer is visually hidden (accessibility only; color is not used there),
// so strip the raw-hex attribute rather than leave a literal in a component.
let nMathColor = 0;
html = html.replace(/\s*mathcolor="#[0-9a-fA-F]{6}"/g, () => { nMathColor++; return ''; });

fs.writeFileSync(outfile, html);
console.error(`prerendered ${infile}: ${nInc} includes, ${nDisp} display, ${nInline} inline, ${nLabels} labels, ${nColors} colors->tokens, ${nMathColor} mathcolor stripped -> ${outfile}`);
