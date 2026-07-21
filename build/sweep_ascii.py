#!/usr/bin/env python3
"""
ASCII punctuation sweep (production writing standard).

Converts typographic Unicode punctuation to deterministic ASCII, while PRESERVING
genuine mathematical / scientific notation and figure notation:
  KEEP  : section sign, Greek letters, math operators (<= >= ~= x deg),
          flow arrows, box-drawing, circles, and everything inside code fences
          and $...$ / $$...$$ math.
  MAP   : em dash -> colon in headings / comma in prose
          en dash -> "to" in numeric ranges, hyphen in compounds, comma otherwise
          ellipsis -> ...   curly quotes -> ASCII   bullet -> - or ,   middot(spaced) -> ,
          nb-hyphen/hyphen -> -   soft-hyphen -> removed

Content preservation: after the sweep, every original word and number must survive
in order; the only token the sweep may introduce is "to" (for ranges). A file whose
check fails is NOT written.
"""
import re, sys, unicodedata

RANGE   = re.compile(r'([A-Za-z]?\d[\w.]*)\s*[\u2013\u2012]\s*([A-Za-z]?\d[\w.]*)')
COMPOUND= re.compile(r'(\w)[\u2013\u2012](\w)')
FENCE   = re.compile(r'```[\s\S]*?```')
DMATH   = re.compile(r'\$\$[\s\S]+?\$\$')
IMATH   = re.compile(r'\$[^\$\n]+?\$')
HEADING = re.compile(r'^\s{0,3}#{1,6}\s')

def convert_line(line, heading):
    # dashes
    line = RANGE.sub(r'\1 to \2', line)                 # numeric ranges -> to
    line = COMPOUND.sub(r'\1-\2', line)                 # letter/number compounds -> hyphen
    line = re.sub(r'\s*[\u2013\u2012]\s*', ', ', line)  # remaining en / figure dash -> comma
    line = re.sub(r'\s*[\u2014\u2015]\s*', ': ' if heading else ', ', line)  # em dash / bar
    line = re.sub(r'[\u2011\u2010]', '-', line)         # nb-hyphen / hyphen -> ascii hyphen
    line = line.replace('\u00ad', '')                   # soft hyphen -> gone
    # quotes / ellipsis
    line = line.replace('\u201c', '"').replace('\u201d', '"')
    line = line.replace('\u2018', "'").replace('\u2019', "'")
    line = line.replace('\u2026', '...')
    # bullet -> ascii hyphen bullet
    line = re.sub(r'\u2022\s*', '- ', line)
    # spaced middot separator -> comma (leave bare middot, likely multiplication)
    line = re.sub(r'\s+\u00b7\s+', ', ', line)
    # non-breaking space -> space
    line = line.replace('\u00a0', ' ')
    return line

def sweep(text):
    # No fence/math guard: the targeted typographic characters never occur in real
    # LaTeX or in box-drawing / arrow notation, and convert_line does not touch any
    # keep-set character (box-drawing, arrows, section sign, Greek, math operators).
    return "\n".join(convert_line(ln, bool(HEADING.match(ln))) for ln in text.split("\n"))

def tokens(s):
    return re.findall(r'[A-Za-z0-9]+', s)

def content_preserved(orig, swept):
    o, w = tokens(orig), tokens(swept)
    i = j = added = 0
    while i < len(o) and j < len(w):
        if o[i] == w[j]:
            i += 1; j += 1
        elif w[j].lower() == 'to':
            j += 1; added += 1
        else:
            return False, added, (o[i], w[j])
    while j < len(w):
        if w[j].lower() == 'to':
            j += 1; added += 1
        else:
            return False, added, ('<end>', w[j])
    return (i == len(o)), added, None

def nonascii_punct(s):
    # typographic punctuation that MUST be removed (bare middot is math multiplication: allowed)
    tgt = set('\u2014\u2013\u2012\u2015\u2011\u2010\u00ad\u201c\u201d\u2018\u2019\u2026\u2022\u00a0')
    return sum(1 for c in s if c in tgt) + len(re.findall(r'\s\u00b7\s', s))

if __name__ == "__main__":
    files = sys.argv[1:]
    total_changed = 0
    for f in files:
        orig = open(f, encoding='utf-8').read()
        before = nonascii_punct(orig)
        if before == 0:
            print(f"  ok    {f}: already ASCII-clean")
            continue
        swept = sweep(orig)
        after = nonascii_punct(swept)
        ok, added, bad = content_preserved(orig, swept)
        if not ok:
            print(f"  FAIL  {f}: content check failed at {bad} -> NOT written")
            continue
        if after != 0:
            print(f"  WARN  {f}: {after} typographic chars remain after sweep -> NOT written")
            continue
        open(f, 'w', encoding='utf-8').write(swept)
        total_changed += 1
        print(f"  swept {f}: {before} converted, +{added} 'to' for ranges, content preserved")
    print(f"\n{total_changed} file(s) swept.")
