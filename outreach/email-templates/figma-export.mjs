#!/usr/bin/env node
// Builds self-contained HTML boards for importing the templates into Figma (html_to_figma):
//   figma/cover.html            cover, send calendar, segment → page → form map, how-to
//   figma/components.html       the email component sheet (shapes, buttons, cards, rows, stages)
//   figma/touch-<n>.html        one board per touch, every segment as its own frame (.email)
// Images are inlined as data URIs because the importer does not fetch external files.
// Run after `node build.mjs`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout, blocks, T, esc } from './src/layout.mjs';
import { SEGMENTS } from './src/segments.mjs';
import { TOUCHES } from './src/sequence.mjs';
import { url } from './src/links.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'figma');
mkdirSync(out, { recursive: true });
const manifest = JSON.parse(readFileSync(join(here, 'dist', 'manifest.json'), 'utf8'));
const CAMPAIGN = manifest.campaign;

const cache = {};
const data = (f) => (cache[f] ||= `data:${f.endsWith('.png') ? 'image/png' : 'image/jpeg'};base64,${readFileSync(join(here, 'assets', f)).toString('base64')}`);

const SAMPLE = {
  first_name: 'Alex', company: 'Northbank', sender_name: 'Christian Mason', sender_title: 'Founder',
  sender_email: 'founder@uieglobal.com',
  personal_line: '[Personal line: one researched sentence on why you are writing to this person now.]',
};
const fill = (s) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => SAMPLE[k] ?? m);

const page = (title, body, extraCss = '') => `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;background:#dfe7eb;font-family:${T.font};color:${T.ink};}
  .board{display:flex;gap:48px;align-items:flex-start;padding:64px;width:max-content;}
  .email{width:640px;flex:none;background:#e9eeef;}
  .meta{padding:18px 20px 14px;background:#ffffff;border-bottom:1px solid ${T.line};font-size:13px;line-height:1.5;color:${T.muted};}
  .meta b{display:block;font-size:17px;color:${T.ink};font-weight:600;margin-bottom:4px;}
  .meta code{font-family:'IBM Plex Mono',Menlo,monospace;font-size:12px;color:${T.link};}
  ${extraCss}
</style></head><body>${body}</body></html>`;

// Email body only (strip <html>/<head>), images inlined.
function emailInner(s, t) {
  const e = t.build(s, CAMPAIGN);
  const L = (p, x = {}) => url(p, { campaign: CAMPAIGN, content: `${t.id.split('-')[0]}-${s.id}-footer`, ...x });
  const links = {
    home: L('/'), dmi: L('/platform/qlaas-dmi/'), services: L('/platform/qlaas-services/'), walkthrough: L('/platform/walkthrough/#case'),
    industries: L('/industries/'), solutions: L('/solutions/'), resources: L('/resources/'), company: L('/company/'),
    pilot: L('/', { pilot: s.pilot }), legal: url('/legal/'),
  };
  e.body.filter((b) => b.type === 'hero').forEach((b) => { b.home = links.home; });
  const html = fill(layout({ ...e, links, asset: data }));
  const body = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  return { e, body: body.replace(/^<body[^>]*>/, '').replace(/<div style="display:none;[^]*?<\/div>/, '') };
}

for (const t of TOUCHES) {
  const n = t.id.split('-')[0];
  const cards = SEGMENTS.map((s) => {
    const { e, body } = emailInner(s, t);
    const m = manifest.emails.find((x) => x.segment === s.id && x.touch === t.id);
    return `<section class="email" data-name="${esc(`${s.name} · ${t.label}`)}">
  <div class="meta"><b>${esc(s.name)}</b>Subject: ${esc(fill(e.subject))}<br>Send: ${m.send_on}${t.thread ? ' · reply in the touch 1 thread' : ''}<br>Landing page: <code>uieglobal.com${esc(s.path)}</code> · Form: <code>?pilot=${esc(s.pilot)}</code><br>File: <code>dist/${esc(m.files.html)}</code></div>
  ${body}
</section>`;
  });
  // Two boards per touch (Figma import captures at most 20 frames per call; 17 fit in one).
  writeFileSync(join(out, `touch-${n}.html`), page(`${t.label}`, `<div class="board">${cards.join('\n')}</div>`));
}

// Cover
const touchRows = TOUCHES.map((t) => {
  const m = manifest.emails.find((x) => x.touch === t.id);
  return `<tr><td>${esc(t.label)}</td><td>${m.send_on}</td><td>${t.thread ? 'Reply to touch 1' : 'New thread'}</td></tr>`;
}).join('');
const segRows = SEGMENTS.map((s) => `<tr><td>${esc(s.name)}</td><td>${s.kind}</td><td><code>uieglobal.com${esc(s.path)}</code></td><td><code>/?pilot=${esc(s.pilot)}</code></td><td><code>dist/${s.id}/</code></td></tr>`).join('');
writeFileSync(join(out, 'cover.html'), page('UIE outreach · cover', `<div class="board" style="display:block;width:1600px;">
<div class="cover">
  <img src="${data('uie-logo.png')}" width="120" height="46" alt="UIE" style="display:block;margin:0 0 56px 0;">
  <p class="eyebrow">UIE · Outreach email templates · campaign ${esc(CAMPAIGN)}</p>
  <h1>Four touches, seventeen segments,<br>one route to a pilot.</h1>
  <p class="lead">Every email lands the prospect on the uieglobal.com page for their industry or function, and every “Discuss a pilot” opens the site’s enquiry form with their area already selected. Built from the UIE — Holographic Blue Figma file and the live site’s geometry.</p>
  <div class="cols">
    <div><h2>Send calendar</h2><table><tr><th>Touch</th><th>Send</th><th>Thread</th></tr>${touchRows}</table>
      <h2 style="margin-top:40px;">How to use</h2>
      <ol><li>Load <code>dist/&lt;segment&gt;/&lt;touch&gt;.html</code> (or <code>.txt</code>) into the sending tool.</li>
      <li>Fill <code>{{first_name}}</code>, <code>{{company}}</code>, <code>{{personal_line}}</code>, <code>{{sender_name}}</code>, <code>{{sender_title}}</code>, <code>{{sender_email}}</code>.</li>
      <li>Send one test to Gmail and Outlook before day one.</li>
      <li>Stop the sequence for anyone who replies or opens the enquiry form.</li></ol>
      <p class="note">Frames in this file are the review copy, filled with sample names. The HTML in the repository is what you send.</p></div>
    <div><h2>Segments → page → form</h2><table><tr><th>Segment</th><th>Kind</th><th>Landing page</th><th>Enquiry form</th><th>Files</th></tr>${segRows}</table></div>
  </div>
</div></div>`, `
  .cover{background:${T.heroInk};color:${T.heroText};padding:80px;}
  .cover .eyebrow{font-size:16px;color:${T.heroBody};margin:0 0 18px;}
  .cover h1{font-size:72px;line-height:1.02;letter-spacing:-3.5px;font-weight:500;margin:0 0 28px;}
  .cover .lead{font-size:21px;line-height:1.5;max-width:900px;color:${T.heroBody};margin:0 0 64px;}
  .cover h2{font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;}
  .cols{display:flex;gap:64px;} .cols>div:first-child{width:520px;flex:none;} .cols>div:last-child{flex:1;}
  table{border-collapse:collapse;width:100%;font-size:14px;} th,td{text-align:left;padding:9px 12px 9px 0;border-bottom:1px solid #2a4a62;vertical-align:top;}
  th{color:${T.heroBody};font-weight:500;} code{font-family:Menlo,monospace;font-size:12.5px;color:#bedaff;}
  ol{padding-left:20px;font-size:16px;line-height:1.6;color:${T.heroBody};} .note{font-size:14px;color:${T.heroBody};margin-top:24px;}
`));

// Component sheet: render each block once with sample data.
const s0 = SEGMENTS[0];
const L0 = (p, x = {}) => url(p, { campaign: CAMPAIGN, content: 'sheet', ...x });
const sample = (b) => `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;background:${T.surface};">${fill(blocks[b.type]({ ...b, imgFn: data, site: L0('/') }, data))}</table>`;
const items = [
  ['Hero · masthead, orbital art, crumbs, polished hero button', { type: 'hero', home: L0('/'), crumbs: [['UIE', L0('/')], ['Industries', L0('/industries/')], [s0.name, L0(s0.path)]], headline: s0.headline, lead: `${s0.summary} ${s0.authority}`.replace(/&/g, '&amp;'), cta: { href: L0(s0.path), text: 'Explore water & utilities' } }],
  ['Linked service rows', { type: 'serviceRows', rows: s0.workflows.map((w, i) => ({ title: w, href: L0(s0.path), open: i === 0, scopeLabel: 'On the page', scope: i === 0 ? 'The request, the work, who keeps authority and the evidence that closes the case.' : undefined })) }],
  ['Photo · asymmetric soft chamfer', { type: 'photo', img: 'photo-water.jpg', alt: 'Dam', href: L0(s0.path) }],
  ['Qlaas cards · polished card, button strip per background', { type: 'qlaasCard', tone: 'dmi', glyph: 'glyph-endpoint.png', label: 'Communications infrastructure', title: 'Qlaas DMI', text: 'Define the actions an agent can request, the records it can access and when its permission expires.', cta: 'Explore DMI', href: L0('/platform/qlaas-dmi/') }],
  ['Refund stages (each links to /platform/walkthrough/#case) + evidence card', { type: 'trace', href: L0('/platform/walkthrough/#case'), stages: ['Receive', 'Verify', 'Authorise', 'Execute', 'Reconcile', 'Complete'], active: 'Reconcile', evidence: { title: 'Provider and ledger agree', text: 'Within policy the case runs through all six stages.' } }],
  ['Pilot brief steps (linked)', { type: 'stages', href: L0('/resources/pilot-brief/'), items: [['Choose a recurring case'], ['Record the baseline'], ['Agree a completion test'], ['Name an owner and a stop condition']] }],
  ['Buttons · ink and ice, with polished right edge', { type: 'cta', href: L0('/', { pilot: s0.pilot }), text: 'Discuss a pilot', secondary: { href: L0(s0.path), text: 'See the workflows' } }],
  ['Signature · Figma 11:257 on a polished paper card', { type: 'signature' }],
];
writeFileSync(join(out, 'components.html'), page('UIE email components', `<div class="board">${items.map(([label, b]) => `<section class="email" style="width:600px;background:${T.surface};"><div class="meta"><b>${esc(label)}</b></div>${sample(b)}</section>`).join('')}</div>`));

console.log('wrote', ['cover.html', 'components.html', ...TOUCHES.map((t) => `touch-${t.id.split('-')[0]}.html`)].join(', '));
