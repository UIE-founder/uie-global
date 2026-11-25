#!/usr/bin/env node
// Build every outreach email: one per segment × touch, as HTML and plain text.
//
//   node compose.cjs                # (re)render image assets from the Figma source layers
//   node build.mjs                  # build dist/ (templates) and dist/preview/ (review gallery)
//
// Options (environment variables):
//   START=2026-11-25    first send date; later touches are counted in business days
//   CAMPAIGN=...        utm_campaign value (default pilot-2026-11)
//   UTM=0               strip utm_* parameters from every link
//   ASSET_BASE=https://uieglobal.com/email/assets   host images somewhere else (see README)
//
// By default images are served from jsDelivr's CDN copy of this repository, pinned to the
// last commit that changed assets/, so a later edit can never change an email already sent.

import { mkdirSync, writeFileSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { layout, plain } from './src/layout.mjs';
import { SEGMENTS } from './src/segments.mjs';
import { TOUCHES } from './src/sequence.mjs';
import { url, PILOT_OPTIONS } from './src/links.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, 'dist');
const CAMPAIGN = process.env.CAMPAIGN || 'pilot-2026-11';
const START = process.env.START || '2026-11-25';

function assetBase() {
  if (process.env.ASSET_BASE) return process.env.ASSET_BASE.replace(/\/$/, '');
  const sha = execFileSync('git', ['log', '-1', '--format=%H', '--', 'assets'], { cwd: here }).toString().trim();
  if (!sha) throw new Error('assets/ is not committed yet: commit and push it, or set ASSET_BASE.');
  const dirty = execFileSync('git', ['status', '--porcelain', '--', 'assets'], { cwd: here }).toString().trim();
  if (dirty) console.warn('WARNING: assets/ has uncommitted changes; the CDN copy will not include them.');
  return `https://cdn.jsdelivr.net/gh/UIE-founder/uie-global@${sha}/outreach/email-templates/assets`;
}
const BASE = assetBase();
const cdn = (f) => `${BASE}/${f}`;
const local = (f) => `../../../assets/${f}`; // dist/preview/<segment>/x.html -> assets/

const SAMPLE = {
  first_name: 'Alex', company: 'Northbank Water', sender_name: 'Christian Mason', sender_title: 'Founder',
  sender_email: 'founder@uieglobal.com',
  personal_line: 'I saw Northbank’s note on the new incident-reporting line for customers, which is why I’m writing.',
};

function businessDay(start, n) {
  const d = new Date(start + 'T09:00:00Z');
  let added = 0;
  while (added < n) { d.setUTCDate(d.getUTCDate() + 1); const w = d.getUTCDay(); if (w !== 0 && w !== 6) added++; }
  return d.toISOString().slice(0, 10);
}
const fill = (s, vars) => s.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

rmSync(dist, { recursive: true, force: true });
const manifest = { campaign: CAMPAIGN, start: START, asset_base: BASE, generated: new Date().toISOString(), emails: [] };
const gallery = [];

for (const s of SEGMENTS) {
  if (!PILOT_OPTIONS.includes(s.pilot)) throw new Error(`${s.id}: pilot "${s.pilot}" not in live dialog`);
  for (const t of TOUCHES) {
    const e = t.build(s, CAMPAIGN);
    const L = (p, x = {}) => url(p, { campaign: CAMPAIGN, content: `${t.id.split('-')[0]}-${s.id}-footer`, ...x });
    const links = {
      home: L('/'), dmi: L('/platform/qlaas-dmi/'), services: L('/platform/qlaas-services/'),
      industries: L('/industries/'), solutions: L('/solutions/'), resources: L('/resources/'),
      company: L('/company/'), pilot: L('/', { pilot: s.pilot }), legal: url('/legal/'),
    };
    e.body.filter((b) => b.type === 'hero').forEach((b) => { b.home = links.home; });

    const html = layout({ ...e, links, asset: cdn });
    const txt = plain(e);
    const dir = join(dist, s.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${t.id}.html`), html);
    writeFileSync(join(dir, `${t.id}.txt`), `Subject: ${e.subject}\n\n` + txt);

    const hrefs = [...new Set([...html.matchAll(/href="(https:[^"]+)"/g)].map((m) => m[1]).filter((h) => !h.includes('fonts.googleapis')))];
    const imgs = [...new Set([...html.matchAll(/(?:src|background)="(https:[^"]+)"/g)].map((m) => m[1]))];
    manifest.emails.push({
      segment: s.id, segment_name: s.name, kind: s.kind, touch: t.id, label: t.label,
      send_on: businessDay(START, t.day), reply_in_thread: !!t.thread,
      subject: e.subject, preheader: e.preheader,
      files: { html: `${s.id}/${t.id}.html`, text: `${s.id}/${t.id}.txt` },
      landing_page: s.path, pilot_option: s.pilot, links: hrefs, images: imgs,
    });

    const pdir = join(dist, 'preview', s.id);
    mkdirSync(pdir, { recursive: true });
    writeFileSync(join(pdir, `${t.id}.html`), fill(layout({ ...e, links, asset: local }), SAMPLE));
    gallery.push({ s, t, e, href: `${s.id}/${t.id}.html` });
  }
}

writeFileSync(join(dist, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Preview gallery (local images, sample merge values).
const kinds = { industry: 'Industries', function: 'Functions', technical: 'Technical' };
const rows = Object.entries(kinds).map(([k, title]) => `
<h2>${title}</h2>
<table><tr><th>Segment</th>${TOUCHES.map((t) => `<th>${t.label}<br><small>${businessDay(START, t.day)}</small></th>`).join('')}</tr>
${SEGMENTS.filter((s) => s.kind === k).map((s) => `<tr><td><b>${s.name}</b><br><small>${s.path}</small></td>${TOUCHES.map((t) => {
  const g = gallery.find((x) => x.s === s && x.t === t);
  return `<td><a href="${g.href}" target="frame">${fill(g.e.subject, SAMPLE)}</a></td>`;
}).join('')}</tr>`).join('')}
</table>`).join('');
writeFileSync(join(dist, 'preview', 'index.html'), `<!doctype html><meta charset="utf-8"><title>UIE outreach preview</title>
<style>body{font:14px/1.5 Inter,Arial,sans-serif;color:#123349;background:#f4f5f2;margin:0;display:grid;grid-template-columns:minmax(0,1fr) 680px;height:100vh}
main{overflow:auto;padding:24px}iframe{width:100%;height:100%;border:0;border-left:1px solid #ccd9df;background:#f4f3f0}
table{border-collapse:collapse;width:100%;margin-bottom:24px}td,th{border-bottom:1px solid #ccd9df;padding:8px;text-align:left;vertical-align:top}th{color:#496578;font-weight:500}
a{color:#0f75b7}small{color:#496578}h1,h2{font-weight:500;letter-spacing:-.03em}h2{color:#0f75b7}</style>
<main><h1>UIE outreach · ${CAMPAIGN}</h1><p>Sample merge values are filled in for review. Send from <code>dist/&lt;segment&gt;/</code>, not from this folder.</p>${rows}</main>
<iframe name="frame" src="${gallery[0].href}"></iframe>`);

console.log(`Built ${manifest.emails.length} emails (${SEGMENTS.length} segments × ${TOUCHES.length} touches) → ${dist}\nImages: ${BASE}`);
