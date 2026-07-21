#!/usr/bin/env node
/* SIM2FIELD figure-index generator.
   Regenerates figure-index.html from media-manifest.json + the F-*.svg files.
   Each built figure (one F-*.svg per built slot) becomes a card, grouped by module
   in numeric figure order; card title = manifest inlineFigures/anchor7 title
   (HTML-escaped), section label = "Section <n>" (anchor7 figures render at Section 7),
   body = the verbatim SVG file. Static chrome (head/footer) and the per-module display
   titles are constants below. Run: node generate-figure-index.js  (writes ../figure-index.html)
*/
"use strict";
const fs = require("fs"), path = require("path");
const BUILD = __dirname, ROOT = path.resolve(BUILD, "..");
const HEAD = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><meta name=\"color-scheme\" content=\"dark\"><title>SIM2FIELD figure index (108 figures)</title><style>\n:root{--bg:#0e120d;--surface:#161c14;--surface-2:#0b0e0a;--surface-3:#12160f;--border:#2b3527;--border-strong:#3a4633;--text-primary:#eef2e6;--text-secondary:#c8cfbe;--text-muted:#adb4a2;--text-on-accent:#0e120d;--accent:#9bcf3b;--accent-strong:#6f9a2c;--info:#6fb0d9;--warn:#e0a03b;--warn-text:#eed9b4;--danger:#f0556a;--danger-text:#f697a4;--accent-2:#b98bd9}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text-primary);font-family:'IBM Plex Mono',ui-monospace,monospace;padding:2rem 2.2rem 4rem}\nheader h1{font-family:'Space Grotesk',system-ui,sans-serif;font-size:1.5rem;margin:0 0 .2rem}header p{color:var(--text-muted);font-size:.82rem;margin:.1rem 0 1.6rem;max-width:78ch;line-height:1.5}\nh2{font-family:'Space Grotesk',system-ui,sans-serif;font-size:1.02rem;font-weight:600;border-bottom:1px solid var(--border);padding-bottom:.4rem;margin:2.2rem 0 1rem;display:flex;align-items:baseline;gap:.6rem}\n.mnum{color:var(--accent);font-weight:700}.cnt{margin-left:auto;font-size:.64rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:1rem}\n.card{border:1px solid var(--border);border-radius:11px;overflow:hidden;background:var(--surface);display:flex;flex-direction:column}\nfigcaption{padding:.55rem .7rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}\n.fid{font-size:.6rem;font-weight:700;color:var(--accent);border:1px solid var(--accent-strong);border-radius:5px;padding:.05rem .35rem}\n.sec{font-size:.58rem;color:var(--text-muted);border:1px solid var(--border-strong);border-radius:5px;padding:.05rem .35rem}\n.ttl{font-size:.72rem;color:var(--text-secondary);flex:1 1 100%;line-height:1.3}\n.body{padding:.7rem .8rem;background:var(--surface-3);overflow-x:auto}.body svg{display:block;width:100%;height:auto;min-width:340px}\nfooter{margin-top:2.5rem;color:var(--text-muted);font-size:.72rem;border-top:1px solid var(--border);padding-top:1rem;line-height:1.5;max-width:82ch}\n</style></head><body><header><h1>SIM2FIELD Figure Index</h1>\n<p>All 108 theme-aware diagrammatic figures across the seventeen modules, grouped by chapter, each a build-time SVG bound to the module render pipeline and verified by the drift and typography guards. This is the complete buildable set; the remaining eight slots are capture-preferred (real photo, CAD, or field data) and are not fabricated.</p></header>\n";
const FOOTER = "\n<footer>Review sheet, not a shipped chapter. Figures are faithful to the module text; qualitative axes and illustrative values are labeled on each figure and were never invented. Capture-preferred slots (F-M2-1, F-M2-7, F-M4-6, F-M10-1, F-M13-1, F-M13-6, F-M16-6, F-M17-1) await real imagery or measured data.</footer></body></html>";
const MODT = {
 "01": "Systems Engineering",
 "02": "Watermelon Field / Physical Interaction",
 "03": "Sensing Modalities / Sensor Physics",
 "04": "Vision, Deep Learning, Detection",
 "05": "3-D Localization, Fusion, Estimation",
 "06": "Edge Computing, Optimization, Deployment",
 "07": "Decision-Making, Grasp Policy",
 "08": "Manipulator Kinematics, Singularities",
 "09": "Actuation, Fluid Power, Grasp Force",
 "10": "Mobility, Navigation, Field Operation",
 "11": "ROS 2, Real-Time Software",
 "12": "Power, Embedded, Electrical",
 "13": "System Integration, Digital Twin",
 "14": "Verification, Validation, Reliability",
 "15": "Safety, Ethics, Responsible Deployment",
 "16": "Manufacturing, Cost, Sustainability",
 "17": "Capstone: Integrated Design"
};

const mani = JSON.parse(fs.readFileSync(path.join(BUILD, "media-manifest.json"), "utf8"));
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;");

// fid -> {title, section} from inlineFigures + anchor7.figure (anchor7 renders at Section 7)
const meta = {};
for (const NN of Object.keys(mani)) {
  const c = mani[NN]; if (!c || typeof c !== "object") continue;
  for (const fg of (c.inlineFigures || [])) meta[fg.id] = { title: fg.title, section: fg.section };
  const f = c.anchor7 && c.anchor7.figure;
  if (f && f.id) meta[f.id] = { title: f.title, section: "7" };
}

// one card per built figure = one F-*.svg file, grouped by module, numeric order
const svgs = fs.readdirSync(ROOT).filter(f => /^F-M\d+-\d+.*\.svg$/.test(f));
const byMod = {};
for (const fn of svgs) {
  const m = fn.match(/^F-M(\d+)-(\d+)/);
  (byMod[m[1]] = byMod[m[1]] || []).push({ num: +m[2], fid: "F-M" + m[1] + "-" + m[2], file: fn });
}

const missing = [];
let body = "";
for (let i = 1; i <= 17; i++) {
  const NN = String(i).padStart(2, "0");
  const figs = (byMod[String(i)] || []).sort((a, b) => a.num - b.num);
  const cards = figs.map(p => {
    const md = meta[p.fid];
    if (!md) { missing.push(p.fid); return ""; }
    const svg = fs.readFileSync(path.join(ROOT, p.file), "utf8");
    return `<figure class="card"><figcaption><span class="fid">${p.fid}</span>`
         + `<span class="sec">Section ${md.section}</span>`
         + `<span class="ttl">${esc(md.title)}</span></figcaption>`
         + `<div class="body">${svg}</div></figure>`;
  }).join("");
  body += `<section><h2><span class="mnum">Module ${NN}</span> ${MODT[NN]} `
        + `<span class="cnt">${figs.length} figures</span></h2><div class="grid">${cards}</div></section>`;
}

if (missing.length) { console.error("FAIL - figures with no manifest binding:", missing.join(", ")); process.exit(1); }
fs.writeFileSync(path.join(ROOT, "figure-index.html"), HEAD + body + FOOTER);
console.log(`wrote figure-index.html (${svgs.length} figure cards across 17 modules)`);
