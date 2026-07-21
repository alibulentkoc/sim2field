# Production Standard: Writing and Punctuation

Status: FROZEN. This is a standing rule for the SIM2FIELD curriculum and every
generated artifact. Do not re-open typography decisions; extend this document
only if a genuinely new character class appears.

Latest amendment: the section sign, box-drawing characters, status and legend
glyphs, and vertical and footnote-return arrows are now authored in ASCII
(previously kept as notation). The section sign becomes the word "Section".
Only rendered mathematics (KaTeX and math expressions) may still use Unicode;
authored prose, navigation, UI, and diagrams are ASCII. Enforced automatically
by verify-typography.js. Prior amendment: horizontal flow arrows and the
typographic minus are authored in ASCII.

## Rule

Use ASCII punctuation only, unless a mathematical or scientific symbol explicitly
requires Unicode. This gives deterministic output across editors, Git diffs,
browsers, and generators.

This applies everywhere: headings, titles, body text, lists, captions, tables,
code comments, figure labels, equations, navigation, HTML, Markdown, and every
generated document, email, or report.

## Conversion policy (deterministic)

Typographic punctuation is normalized as follows:

- Em dash: colon in a heading or short label, comma in prose. Never used to
  replace other punctuation.
- En dash and figure dash: "to" in numeric ranges, a plain hyphen in
  letter or number compounds, a comma otherwise.
- Ranges in prose use the word "to", not a hyphen. Examples: "5 to 10 kg",
  "4 to 5 contact hours", "Modules 8 to 10", "Pages 12 to 18".
- Ellipsis: three ASCII periods, "...".
- Curly or smart quotes: ASCII straight quotes, " and '.
- Bullet: ASCII hyphen bullet, "- ".
- Spaced middot separator: comma. A bare middot that denotes multiplication is a
  mathematical symbol and is kept (see KEEP set).
- Non-breaking hyphen and Unicode hyphen: plain ASCII hyphen. Soft hyphen:
  removed. Non-breaking space: normal space (except inside rendered math, where
  the math renderer owns its spacing).
- Horizontal flow arrows: authored in ASCII. Rightwards "->", leftwards "<-",
  bidirectional "<->", implies "=>". Unicode arrows are permitted only when the
  math renderer (KaTeX) emits them, and that output is never rewritten.
- Typographic minus (U+2212): plain ASCII hyphen-minus "-". A minus inside
  rendered math is owned by the math renderer.
- Section sign (U+00A7): the word "Section". Example: "Section 6.5", not the
  glyph before the number.
- Box-drawing characters: ASCII art. Horizontal to "-", vertical to "|", every
  corner and junction to "+". One-for-one so figure alignment is preserved.
- Pointers and status/legend glyphs: filled and open circle to "X" and "o",
  down and right and left pointers to "v" and ">" and "<", star to "*", check to
  "[x]", cross to "[ ]", half circle to "[~]". Diamond section markers are
  dropped (the heading text already names the concept).
- Vertical and footnote-return arrows: down arrow to "v" in stacked diagrams;
  an increase or decrease arrow in prose is rewritten as a word ("raises");
  the footnote-return marker is dropped.
- Angle-bracket placeholders in prose (for example an ID scheme like
  SR-<class>-<nn>): ASCII angle brackets, escaped in Markdown as "\<" and "\>".
  Genuine angle brackets inside rendered math are unaffected.

Available ASCII substitutes, chosen by context: comma, colon, semicolon, period,
parentheses, the word "to", the word "through", or a plain ASCII hyphen only
when grammatically correct.

## KEEP set: Unicode permitted as notation

The following are genuine mathematical or scientific notation and are kept as
Unicode wherever they appear as rendered mathematics or an inline math
expression. Everything else, including anything in authored prose, navigation,
UI, or diagrams, is ASCII (see Conversion policy).

- Math operators and relations, for example <= >= ~= != x (times) / (divide)
  +- (plus or minus), superscripts and subscripts, element-of, intersection,
  proportional-to, infinity, the norm bars, and the bare multiplication middot.
  The typographic minus sign (U+2212) is not authored: use ASCII "-"; the math
  renderer owns the minus glyph inside equations.
- Greek letters used as variables, for example sigma, gamma, mu, delta, chi, pi.
- The degree sign in temperatures and angles.
- Angle brackets only inside a genuine math expression (inner product,
  expectation). As a prose placeholder in an ID scheme they are ASCII "\<" "\>".
- Diacritics that are part of a word are letters, not punctuation, and are kept.

Not kept (authored in ASCII, see Conversion policy): the section sign,
box-drawing characters, status and legend glyphs, pointers, vertical and
footnote-return arrows, and horizontal flow arrows.

The rendered math layer (KaTeX, pre-rendered at build time) emits Unicode by
design; that output is never rewritten by the punctuation pass.

## Enforcement

- Source sweep: sweep_ascii.py normalizes typographic punctuation in every
  generated Markdown document. It protects nothing structurally because the
  targeted characters never occur in real LaTeX or in box-drawing notation, and
  it proves content preservation before writing each file: every original word
  and number must survive in order, and the only token it may introduce is "to".
- Render enforcement: the module rendering pipeline applies the same
  normalization to all authored prose and to its own generated chrome, then runs
  a final KaTeX-safe pass so every rendered chapter is ASCII-punctuation clean.
- Scope of the source sweep: this is a punctuation-only normalization. No
  wording, number, equation, or requirement is changed. Backups of the
  pre-sweep source are retained so the normalization is reversible.
- Automated guard: verify-typography.js rejects the forbidden authored set (em,
  en, and figure dash, horizontal bar, curly quotes, ellipsis, typographic
  minus, soft and non-breaking hyphen, and horizontal arrows) across every
  Markdown source, every -src.html, and every shipped HTML file, while exempting
  TeX math ($...$, $$...$$, \(...\), \[...\]) and KaTeX output spans. It runs in
  "npm run verify" alongside the drift guard, and in CI on every push or pull
  request that touches build/**, *.html, or *.md, so a forbidden authored
  character cannot merge.

## Applied baseline (record)

- All 27 generated Markdown documents swept to zero typographic punctuation,
  content preserved against backups.
- Both Module 1 editions (student and author) regenerated and verified clean.
- Frozen, drift-guarded HTML assets (worked examples, homework, index) already
  carry zero em and en dashes. Their remaining non-ASCII is math-layer spacing
  plus two ellipses, which will be corrected through the asset build path rather
  than by editing built files directly, so the drift guard stays intact.
- Authored horizontal arrows and typographic minus normalized to ASCII across
  all Markdown sources: 840 instances (-> <- <-> => and the minus sign). Content
  preserved (word and number sequence identical); pre-conversion backups
  retained. Module 1 both editions regenerated and verified clean.
- Vertical arrows (up, down) and footnote-return arrows are left as-is pending a
  decision, since they have no clean single-character ASCII equivalent.
- Automated typography guard added and passing across 61 files (Markdown,
  sources, and shipped HTML).
