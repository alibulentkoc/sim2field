#!/usr/bin/env node
/* SIM2FIELD authored-typography guard.
   Rejects forbidden AUTHORED Unicode in source and shipped files, while ALLOWING the
   Unicode that legitimately comes from the rendering engine or is genuine notation:

     Allowed
       - KaTeX-rendered mathematics: Unicode inside <span class="katex"> ... </span>
       - TeX math source in Markdown: $...$, $$...$$, \(...\), \[...\]
       - HTML entities (&middot; &lt; &gt; ...): they are ASCII bytes in the file
       - Non-forbidden science/diagram symbols: Greek, math operators (<= >= x div etc.),
         box-drawing, the section sign, degree sign, status/legend glyphs (o . v > etc.),
         vertical arrows and footnote-return arrows, diacritics

     Forbidden (authored punctuation + horizontal flow arrows)
       U+2014 EM DASH        U+2013 EN DASH        U+2012 FIGURE DASH   U+2015 HORIZONTAL BAR
       U+2018/2019 SINGLE Q  U+201C/201D DOUBLE Q  U+2026 ELLIPSIS      U+2212 MINUS SIGN
       U+00AD SOFT HYPHEN    U+2011 NB HYPHEN
       U+2190 <-  U+2192 ->  U+2194 <->  U+21D0 <=  U+21D2 =>  U+21D4 <=>

   The rule: authored punctuation and horizontal flow arrows are ASCII in the SOURCE;
   only the rendering engine emits Unicode math. This keeps the ASCII authoring standard
   from ever becoming a manual review item again.

   Scans, under OUT_DIR (default parent of build/): every *.md, every build/*-src.html,
   and every shipped *.html. Prints file:line:col with codepoint + name and exits
   non-zero on any violation.

   Usage:  node verify-typography.js        (OUT_DIR=/path to check out-of-tree outputs)
*/
"use strict";
const fs = require("fs");
const path = require("path");

const BUILD_DIR = __dirname;
const OUT_DIR = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.resolve(BUILD_DIR, "..");

const FORBIDDEN = {
  0x2014: "EM DASH", 0x2013: "EN DASH", 0x2012: "FIGURE DASH", 0x2015: "HORIZONTAL BAR",
  0x2018: "LEFT SINGLE QUOTE", 0x2019: "RIGHT SINGLE QUOTE",
  0x201c: "LEFT DOUBLE QUOTE", 0x201d: "RIGHT DOUBLE QUOTE",
  0x2026: "HORIZONTAL ELLIPSIS", 0x2212: "MINUS SIGN",
  0x00ad: "SOFT HYPHEN", 0x2011: "NON-BREAKING HYPHEN",
  0x2190: "LEFTWARDS ARROW", 0x2192: "RIGHTWARDS ARROW", 0x2194: "LEFT RIGHT ARROW",
  0x21d0: "LEFTWARDS DOUBLE ARROW", 0x21d2: "RIGHTWARDS DOUBLE ARROW", 0x21d4: "LEFT RIGHT DOUBLE ARROW"
};

// Replace every non-newline char in a matched region with a placeholder that is never
// forbidden, so downstream line/column positions stay exact.
const blank = (s) => s.replace(/[^\n]/g, "\x01");

// Mask TeX math regions in Markdown. Display first, then inline. The inline opener
// requires a non-space, non-digit, non-$ next char so currency ($35k) is NOT read as math.
function maskMarkdownMath(src) {
  let s = src;
  s = s.replace(/\$\$[\s\S]*?\$\$/g, blank);
  s = s.replace(/\\\[[\s\S]*?\\\]/g, blank);
  s = s.replace(/\\\([\s\S]*?\\\)/g, blank);
  s = s.replace(/(?<![\\$])\$(?=[^\s\d$])[^\$\n]*?\$/g, blank);
  return s;
}

// Mask KaTeX output subtrees in HTML by a span-depth scan (position-preserving).
function maskKatex(html) {
  const arr = html.split("");
  const re = /<span\b[^>]*>|<\/span>/g;
  let m, depth = 0, entry = null;
  while ((m = re.exec(html))) {
    const tag = m[0];
    if (tag[1] !== "/") {
      depth++;
      if (entry === null && /class="[^"]*\bkatex\b/.test(tag)) entry = { depth, start: m.index };
    } else {
      if (entry !== null && depth === entry.depth) {
        const end = m.index + tag.length;
        for (let i = entry.start; i < end; i++) { if (arr[i] !== "\n") arr[i] = "\x01"; }
        entry = null;
      }
      depth--;
    }
  }
  return arr.join("");
}

function scan(file) {
  const raw = fs.readFileSync(file, "utf8");
  const masked = file.endsWith(".md") ? maskMarkdownMath(raw)
              : file.endsWith(".html") ? maskKatex(raw)
              : raw;
  const hits = [];
  const lines = masked.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const cp = line.codePointAt(j);
      if (FORBIDDEN[cp]) hits.push({ line: i + 1, col: j + 1, cp, name: FORBIDDEN[cp] });
    }
  }
  return hits;
}

function listFiles() {
  const inDir = (dir, pred) => fs.readdirSync(dir).filter(pred).sort().map((f) => path.join(dir, f));
  const md  = inDir(OUT_DIR, (f) => f.endsWith(".md"));
  const src = inDir(BUILD_DIR, (f) => f.endsWith("-src.html"));
  const html = inDir(OUT_DIR, (f) => f.endsWith(".html"));
  return [...md, ...src, ...html];
}

const files = listFiles();
let violations = 0, filesWith = 0;
const report = [];
for (const f of files) {
  const hits = scan(f);
  if (hits.length) {
    filesWith++; violations += hits.length;
    const rel = path.relative(OUT_DIR, f);
    const shown = hits.slice(0, 8).map(
      (h) => `      ${rel}:${h.line}:${h.col}  U+${h.cp.toString(16).toUpperCase().padStart(4, "0")} ${h.name}`
    );
    report.push(shown.join("\n") + (hits.length > 8 ? `\n      ... and ${hits.length - 8} more in this file` : ""));
  }
}

console.log(`typography guard: scanned ${files.length} files (md + -src.html + shipped html)`);
if (violations) {
  console.error(`\nFAIL - ${violations} forbidden authored Unicode character(s) in ${filesWith} file(s):`);
  for (const r of report) console.error(r);
  console.error(`\nAllowed: KaTeX output, TeX math in Markdown ($...$), HTML entities, and non-forbidden`);
  console.error(`science/diagram symbols (Greek, <= >= x, box-drawing, section sign, glyphs).`);
  console.error(`Fix in the SOURCE: arrows -> "->", "<-", "<->", "=>"; minus -> "-"; quotes -> ASCII;`);
  console.error(`dashes -> ", : ; . ( ) - to"; ellipsis -> "...". Then re-run the build.`);
  process.exit(1);
}
console.log("PASS - no forbidden authored Unicode outside math/KaTeX regions.");
