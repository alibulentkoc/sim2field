#!/usr/bin/env node
/* ============================================================================
   Module Rendering Pipeline v1.3  (ONE SOURCE, TWO RENDERERS)
     MODULE-XX.md  ->  Student Renderer  ->  Digital Textbook Chapter (mission-led)
     MODULE-XX.md  ->  Author  Renderer  ->  Author / Build-spec edition
   The module is the single source of truth. Nothing is re-authored.
   Writing standard (frozen, see PRODUCTION-STANDARD.md): ASCII punctuation only
   unless a math or science symbol requires Unicode. Typographic punctuation is
   normalized at render time (dashes, curly quotes, ellipsis, bullets, spaced
   middot); ranges become "N to M"; a final KaTeX-safe pass enforces it.
   Contract (frozen, see MODULE-RENDERING-DIRECTIVE.md): section-to-role map,
   media injection points, edition rules, determinism guarantees.
   Usage: node render-module.js <MODULE-XX.md> <out.html> <NN> <student|author>
   ==========================================================================*/
"use strict";
const fs = require("fs");
const path = require("path");
const katex = require("katex");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt({ html: true, linkify: false, typographer: false, breaks: false });

const SRC = process.argv[2], OUT = process.argv[3];
const NN = process.argv[4] || (SRC.match(/MODULE-(\d+)/) || [,"01"])[1];
const MODE = (process.argv[5] || "student").toLowerCase();
const STUDENT = MODE === "student";

/* ---------- per-module media manifest (external; MODULE-RENDERING-DIRECTIVE.md 9) ----------
   media-manifest.json binds each module number to its label, a concept-anchor binding
   (anchor7: the section-7 widget/figure injected into the reading), and a full media
   catalogue extracted from the module's own build specifications. Binding a produced
   asset is a data edit here, not a code change. */
const MANIFEST = JSON.parse(fs.readFileSync(__dirname + "/media-manifest.json", "utf8"));
const CFG = MANIFEST[NN] || {};
const A7 = CFG.anchor7 || {};   // { widget, figure } - null until an inline-ready asset exists

/* ---------- ASCII punctuation normalization (production writing standard) ---------- */
function deEmDash(s, heading){                       // name kept; now full ASCII normalizer
  return String(s)
    .replace(/&mdash;|&#8212;|&#x2014;/gi,"\u2014")
    .replace(/&ndash;|&#8211;|&#x2013;/gi,"\u2013")
    .replace(/&hellip;|&#8230;/gi,"\u2026")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/([A-Za-z]?\d[\w.]*)\s*[\u2013\u2012]\s*([A-Za-z]?\d[\w.]*)/g,"$1 to $2") // numeric range -> to
    .replace(/(\w)[\u2013\u2012](\w)/g,"$1-$2")   // letter/number compound -> hyphen
    .replace(/\s*[\u2013\u2012]\s*/g,", ")        // remaining en / figure dash -> comma
    .replace(/\s*[\u2014\u2015]\s*/g, heading?": ":", ") // em dash / bar -> colon (label) or comma
    .replace(/[\u2011\u2010]/g,"-").replace(/\u00ad/g,"")
    .replace(/[\u201c\u201d]/g,'"').replace(/[\u2018\u2019]/g,"'")
    .replace(/\u2026/g,"...")
    .replace(/\u2022\s*/g,"- ")
    .replace(/\s+\u00b7\s+/g,", ");                // spaced middot separator -> comma (bare middot = math, kept)
}

/* ---------- math (build-time KaTeX; fenced code + em dash safe) ---------- */
function mathify(src){ const D=[],I=[],F=[];
  src=src.replace(/```[\s\S]*?```/g,m=>{F.push(m);return `\uE000F${F.length-1}\uE000`;});
  src=deEmDash(src,false);                              // body prose only (fences protected above)
  src=src.replace(/\$\$([\s\S]+?)\$\$/g,(_,x)=>{D.push(katex.renderToString(x.trim(),{displayMode:true,throwOnError:false,strict:"ignore",trust:true}));return `%%DISP${D.length-1}%%`;});
  src=src.replace(/\$([^\$\n]+?)\$/g,(_,x)=>{I.push(katex.renderToString(x.trim(),{displayMode:false,throwOnError:false,strict:"ignore",trust:true}));return `%%INL${I.length-1}%%`;});
  src=src.replace(/\uE000F(\d+)\uE000/g,(_,i)=>F[+i]); return {src,D,I}; }
function remath(h,D,I){ h=h.replace(/<p>%%DISP(\d+)%%<\/p>/g,(_,i)=>`<div class="eqwrap">${D[+i]}</div>`);
  h=h.replace(/%%DISP(\d+)%%/g,(_,i)=>`<div class="eqwrap">${D[+i]}</div>`);
  h=h.replace(/%%INL(\d+)%%/g,(_,i)=>I[+i]); return h; }
function R(mkd){ const {src,D,I}=mathify(mkd||""); return remath(md.render(src),D,I); }
function Rin(mkd){ return R(mkd).replace(/^<p>|<\/p>\s*$/g,""); }
function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

/* ---------- style the module's own devices ---------- */
function styleBlocks(html){
  html=html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g,(f,inner)=>{
    let c="callout note";
    if(/Core Engineering Concept/i.test(inner))c="callout cec";
    else if(/Industry Perspective/i.test(inner))c="callout industry";
    else if(/Simulation-first hook/i.test(inner))c="callout hook";
    else if(/Authoring note/i.test(inner))c="callout gov";
    return `<blockquote class="${c}">${inner}</blockquote>`; });
  html=html.replace(/<table>/g,'<div class="twrap"><table>').replace(/<\/table>/g,"</table></div>");
  html=html.replace(/<pre><code>([\s\S]*?PERCEIVE[\s\S]*?)<\/code><\/pre>/,
    (m,code)=>`<figure class="figure diagram"><pre class="ascii"><code>${code}</code></pre>`+
      `<figcaption>The signal-to-action spine: the functional backbone, rendered from the module text.</figcaption></figure>`);
  return html;
}
function figSlot(f){ return `<figure class="figure slot"><div class="slotbox"><span class="slit">figure, specified but not yet produced</span>`+
  `<span class="fid">${f.id}</span><b>${f.title}</b><span class="desc">${f.desc}</span></div></figure>`; }
function readFragment(w){
  try { return fs.readFileSync(path.join(path.dirname(OUT), w.fragment), "utf8").trim(); }
  catch (e) { return ""; }
}
// A figure with a `fragment` path renders as a real inline figure; otherwise the spec slot.
function figureEmbed(f){
  const body = f.fragment ? readFragment(f) : "";
  if (!body) return figSlot(f);
  return `<figure class="figure fig-real"><div class="figbody">${body}</div>`+
    `<figcaption><span class="fid">${f.id}</span>${f.title}. ${f.desc||""}</figcaption></figure>`;
}
function widgetEmbed(w,student){
  const frag = w.fragment ? readFragment(w) : "";
  const head = student
    ? `<div class="we-head"><span class="wid live">interactive</span><b>${w.pgTitle}</b><a class="we-open" href="${w.file}" target="_blank" rel="noopener">open full page</a></div>`
    : `<div class="we-head"><span class="wid">${w.id} / built</span><b>Interactive worked example: ${w.title}</b><a class="we-open" href="${w.file}" target="_blank" rel="noopener">open full page</a></div>`;
  const cap = student
    ? `<p class="we-cap">Drag the dominant SWING stage and toggle a second arm, and watch the cycle time, rover speed, and throughput respond against the 6.0 s budget.</p>`
    : `<p class="we-cap">Embedded at the module's Section 20 anchor. ${w.authorNote}</p>`;
  const inner = frag || `<div class="we-cap" style="padding:1.1rem"><a href="${w.file}" target="_blank" rel="noopener">Open the interactive worked example.</a></div>`;
  return `<div class="widget-embed">${head}${inner}${cap}</div>`;
}
// A demo with a `file` renders as a sandboxed, self-contained iframe (offline, no CDN).
// Identical output in student and author editions (no mode branching).
function demoEmbed(d){
  const px = Math.max(320, parseInt(d.height,10) || 640);
  const head = `<div class="we-head"><span class="wid live">interactive</span><b>${d.title}</b><a class="we-open" href="${d.file}" target="_blank" rel="noopener">open full page</a></div>`;
  const frame = `<iframe class="demo-frame" src="${d.file}" title="${d.title}" loading="lazy" sandbox="allow-scripts" style="display:block;width:100%;height:${px}px;border:0;background:var(--surface-3)"></iframe>`;
  return `<div class="widget-embed demo">${head}${frame}</div>`;
}

/* ---------- parse module ---------- */
const raw = fs.readFileSync(SRC,"utf8").replace(/\r\n/g,"\n");
const firstH2 = raw.indexOf("\n## ");
const front = raw.slice(0,firstH2).trim();
const parts = raw.slice(firstH2).split(/\n(?=## )/).map(s=>s.trim()).filter(Boolean);

let title="",metaMd="",govNote="";
{ const bq=front.indexOf("\n> ");
  const head = bq>=0?front.slice(0,bq):front;
  govNote = bq>=0?front.slice(bq).replace(/^> ?/gm,"").trim():"";
  title = (head.match(/^#\s+(.+)/)||[,"Module"])[1].trim();
  metaMd = head.replace(/^#\s+.+\n?/,"").replace(/^---$/gm,"").trim(); }

const secList=[]; let missionA=null, mission="", openingKind=null;
for(const part of parts){
  const m = part.match(/^##\s+(.+?)\n([\s\S]*)$/)||part.match(/^##\s+(.+?)$/);
  const heading=deEmDash((m[1]||"").trim().replace(/\s*\*\(build specification[^)]*\)\*/i,""), true);
  const bodyMd=(m[2]||"").replace(/^---\s*$/gm,"").trim();
  if(/^Why This Course Exists/i.test(heading)){ missionA=bodyMd; openingKind="course"; continue; }
  if(/^By the End of This Course/i.test(heading)){ mission=bodyMd; continue; }
  if(missionA===null && /^(\d+\.\s+)?Module Overview\b/i.test(heading)){ missionA=bodyMd; openingKind="module"; continue; }
  secList.push({heading,bodyMd});
}

/* ---------- mission opening (from the module's own front prose) ---------- */
function buildOpening(){
  const paras = (missionA||"").split(/\n\n+/).map(s=>s.trim()).filter(Boolean);
  const part=(metaMd.match(/\*\*Part\s+([IVX]+[^*]+)\*\*/)||[])[1];
  const time=(metaMd.match(/\*\*Estimated time:\*\*\s*([^\n]+)/)||[])[1];
  const slim=deEmDash([part&&("Part "+part.trim()), time&&time.trim()].filter(Boolean).join("  /  "), true);

  let movements="", hero="";
  if(openingKind==="course" && paras.length>=8){
    // Module 1: course-level briefing with named movements from its 8-paragraph framing.
    const M=[["Mission",[paras[1]]],
             ["The engineering challenge",[paras[2],paras[4]]],
             ["Why this matters",[paras[3]]],
             ["The machine",[paras[5],paras[6],paras[7]]]];
    movements=M.map(([label,ps])=>`<section class="movement"><div class="mv-label">${label}</div><div class="mv-body">${ps.map(p=>R(p)).join("")}</div></section>`).join("");
    hero=paras[0];
  } else if(paras.length){
    // Modules 2-17. Standardized five-movement briefing when the overview is authored
    // with labelled lead-ins (**Mission.** ... **Previous milestone.** ... etc.);
    // otherwise the overview-led prose fallback. Both paths use the same .movement
    // styling, so the frozen chapter layout is unchanged either way.
    const LABELS=["Mission","Previous milestone","Engineering problem","Design tension","What this module resolves"];
    const isLabel=p=>/^\*\*[^.*]+?\.?\*\*/.test(p);
    const found={};
    for(const p of paras){
      const m=p.match(/^\*\*([^.*]+?)\.?\*\*\s*([\s\S]+)$/);
      if(m){ const key=LABELS.find(L=>L.toLowerCase()===m[1].trim().toLowerCase()); if(key) found[key]=m[2].trim(); }
    }
    if(LABELS.every(L=>found[L])){
      // Every chapter opens with the same rhythm, rendered in canonical order.
      const extra=paras.filter(p=>!isLabel(p));   // e.g. a trailing concept callout
      movements=LABELS.map(L=>`<section class="movement"><div class="mv-label">${L}</div><div class="mv-body">${R(found[L])}</div></section>`).join("")
        +(extra.length?`<section class="movement"><div class="mv-body">${styleBlocks(R(extra.join("\n\n")))}</div></section>`:"");
      hero="";
    } else {
      // Fallback: overview-led prose. First plain paragraph is the hook; the rest is
      // one briefing body with the module's own devices (concept callouts, tables) styled.
      const heroable = paras.length>1 && !/^[>\-*|#\d]/.test(paras[0]);
      hero = heroable ? paras[0] : "";
      const rest = (heroable ? paras.slice(1) : paras).join("\n\n");
      movements = rest.trim() ? `<section class="movement"><div class="mv-body">${styleBlocks(R(rest))}</div></section>` : "";
    }
  }

  const objectives = mission ? `<section class="movement objectives"><div class="mv-label">Mission objectives, by the end of this course</div><div class="mv-body">${R(mission)}</div></section>` : "";
  const authorMeta = (!STUDENT) ? `<details class="instructor-wrap cover-gov"><summary>Module metadata and authoring note (author / production)</summary><div class="cover-meta">${R(metaMd)}</div>${govNote?R(govNote):""}</details>` : "";
  const subtitle = deEmDash(title,true).replace(/^Module\s+\d+:\s*/,"");

  return `<header class="mission">
    <div class="mission-hero">
      <div class="eyebrow">${STUDENT?"":"Author edition / "}Module ${NN.replace(/^0/,"")} / Mission briefing</div>
      ${hero?`<p class="hook">${Rin(hero)}</p>`:""}
      <h1>${esc(subtitle)}</h1>
      ${slim?`<div class="slim">${slim}</div>`:""}
    </div>
    ${movements}
    ${objectives}
    ${authorMeta}
    <div class="chapter-start"><span>The chapter</span></div>
  </header>`;
}

/* ---------- body sections (mode-aware) ---------- */
const SKIP_STUDENT = h => /^2[0-3]\./.test(h) || /^28\./.test(h) || /Concise quality summary/i.test(h);

const rendered=[];
for(const s of secList){
  const h=s.heading;
  if(STUDENT && SKIP_STUDENT(h)) continue;
  const num=(h.match(/^(\d+)\./)||[])[1]||"";
  const isInstr=/^28\./.test(h)||/Concise quality summary/i.test(h);
  const isSpec=/^2[0-3]\./.test(h);
  const id="sec-"+slug(h).slice(0,40);
  let bodyMd=s.bodyMd, quizKeys=null;
  if(/^26\.\s*Quiz/i.test(h)){ quizKeys=[]; bodyMd=bodyMd.replace(/\*\*\[([\s\S]*?)\]\*\*/g,(_,k)=>{quizKeys.push(k.trim());return "";}); }

  let html=styleBlocks(R(bodyMd));

  if(/^7\./.test(h)||/^Mathematics/i.test(h)){
    let insert = "";
    if (STUDENT) {
      if (A7.widget) insert += widgetEmbed(A7.widget,true);
      if (A7.figure && A7.figure.fragment) insert += figureEmbed(A7.figure);
    } else if (A7.figure) {
      insert += figureEmbed(A7.figure);
    }
    if(insert) html=html.replace("</table></div>", () => "</table></div>"+insert);
  }
  // general inline figures: any manifest figure with a fragment, anchored to its top-level section
  {
    const secNum=(h.match(/^(\d+)\./)||[])[1];
    (CFG.inlineFigures||[]).forEach(fg=>{
      if(fg.fragment && fg.section===secNum) html+=figureEmbed(fg);
    });
    // inline demos: any manifest demo with a file, anchored to its top-level section (both editions)
    (CFG.inlineDemos||[]).forEach(d=>{
      if(d.file && d.section===secNum) html+=demoEmbed(d);
    });
  }
  if(!STUDENT && /^20\./.test(h) && A7.widget) html+=widgetEmbed(A7.widget,false);
  if(!STUDENT && quizKeys){
    html+=`<details class="answers"><summary>Answer key (instructor)</summary><ol class="keylist">${
      quizKeys.map((k,i)=>`<li><span class="qn">${i+1}.</span> ${Rin(k)}</li>`).join("")}</ol></details>`;
  }

  rendered.push({h,num,id,html,isInstr,isSpec,
    isLab:/^24\./.test(h),isHw:/^25\./.test(h),isQuiz:/^26\./.test(h),isCh:/^27\./.test(h),isFail:/Failure Cases/i.test(h)});
}

/* ---------- assemble ---------- */
const toc = rendered.map(s=>{
  const tag = (!STUDENT&&s.isInstr)?'<span class="tt instr">instructor</span>':(!STUDENT&&s.isSpec)?'<span class="tt spec">spec</span>':"";
  const label = s.num?`<span class="tn">${s.num}</span>${s.h.replace(/^\d+\.\s*/,"")}`:s.h;
  return `<li><a href="#${s.id}">${label}${tag}</a></li>`;
}).join("");

const body = rendered.map(s=>{
  const cls=["section",s.isInstr?"instructor":"",s.isSpec?"spec":"",s.isLab?"lab":"",s.isHw?"hw":"",s.isQuiz?"quiz":"",s.isCh?"challenge":"",s.isFail?"failure":""].filter(Boolean).join(" ");
  const hd=s.num?`<h2 id="${s.id}"><span class="secnum">${s.num}</span><span class="sectitle">${s.h.replace(/^\d+\.\s*/,"")}</span></h2>`:`<h2 id="${s.id}" class="unnum">${s.h}</h2>`;
  if(s.isInstr) return `<section class="${cls}"><details class="instructor-wrap"><summary>${s.h} (instructor / author material, not part of the student reading)</summary>${s.html}</details></section>`;
  return `<section class="${cls}">${hd}${s.html}</section>`;
}).join("\n");

const CSS = fs.readFileSync(__dirname + "/module.css","utf8");
const editionTag = STUDENT ? "Student edition" : "Author / production edition";

let HTML = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark"><meta name="theme-color" content="#0e120d">
<title>${esc(deEmDash(title,true))} (SIM2FIELD${STUDENT?"":", author"})</title>
<link rel="stylesheet" href="vendor/fonts/fonts.css">
<link rel="stylesheet" href="vendor/katex/katex.min.css">
<style>${CSS}</style></head>
<body class="${STUDENT?"ed-student":"ed-author"}">
<a class="skip" href="#main">Skip to chapter</a>
<div class="topbar"><span class="mk">SIM2FIELD</span>
  <span class="cx">Digital textbook / ${editionTag}</span>
  <span class="src">source: MODULE-${NN}.md</span></div>
<div class="book">
  <nav class="rail" aria-label="Chapter contents"><h2>Chapter contents</h2><ul class="toc">${toc}</ul></nav>
  <main class="main" id="main"><div class="inner">
    ${buildOpening()}
    ${body}
    <footer>Rendered from <b>MODULE-${NN}.md</b> by Module Rendering Pipeline v1.3. ${editionTag}. The module is the single source of truth.<br>
    ${STUDENT?"Finished media only; production specifications and author notes live in the author edition.":"Includes production specifications, figure placeholders, governance and instructor notes, and the answer key."}<br>
    SIM2FIELD / Autonomous Watermelon Harvesting Robotics</footer>
  </div></main>
</div>
<script>
(function(){var links=[].slice.call(document.querySelectorAll('.toc a'));var map={};
 links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
 if(!('IntersectionObserver' in window))return;
 var io=new IntersectionObserver(function(es){es.forEach(function(e){var id=e.target.id;
   if(e.isIntersecting&&map[id]){links.forEach(function(l){l.classList.remove('active');});map[id].classList.add('active');map[id].scrollIntoView({block:'nearest'});}});},
   {rootMargin:'-12% 0px -78% 0px'});
 document.querySelectorAll('.section h2[id]').forEach(function(h){io.observe(h);});})();
</script>
</body></html>`;

/* ---------- final formatting pass: KaTeX-safe ASCII enforcement ---------- */
HTML = HTML
  .replace(/&mdash;|&#8212;|&#x2014;/gi,"\u2014").replace(/&ndash;|&#8211;|&#x2013;/gi,"\u2013")
  .replace(/([A-Za-z]?\d[\w.]*)\s*[\u2013\u2012]\s*([A-Za-z]?\d[\w.]*)/g,"$1 to $2")
  .replace(/(\w)[\u2013\u2012](\w)/g,"$1-$2")
  .replace(/\s*[\u2013\u2012]\s*/g,", ").replace(/\s*[\u2014\u2015]\s*/g,", ")
  .replace(/[\u201c\u201d]/g,'"').replace(/[\u2018\u2019]/g,"'")
  .replace(/\u2022\s*/g,"- ").replace(/\s+\u00b7\s+/g,", ");
const MUST=/[\u2014\u2013\u2012\u2015\u2011\u2010\u00ad\u201c\u201d\u2018\u2019\u2022]/g;
const leftover=(HTML.match(MUST)||[]).length + (HTML.match(/\s\u00b7\s/g)||[]).length;
fs.writeFileSync(OUT,HTML);
console.log(`[${MODE}] MODULE-${NN}.md -> ${OUT}  (${rendered.length} body sections, ${(HTML.length/1024).toFixed(0)} KB, U+2014 remaining: ${leftover})`);
