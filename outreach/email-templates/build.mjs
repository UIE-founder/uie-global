#!/usr/bin/env node
// Build every outreach email: one per segment × touch, as HTML and plain text.
//
//   node build.mjs                  # templates with merge fields, into dist/
//   START=2026-11-25 node build.mjs # sets the send calendar (business days)
//   UTM=0 node build.mjs            # strip utm_* parameters from every link
//
// Output:
//   dist/<segment>/<touch>.html|.txt     templates, merge fields intact
//   dist/manifest.json                   subject, preheader, send date, links per email
//   dist/preview/index.html              gallery with sample merge values, for review only

import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { layout, plain } from './src/layout.mjs';
import { SEGMENTS } from './src/segments.mjs';
import { TOUCHES } from './src/sequence.mjs';
import { url, PILOT_OPTIONS } from './src/links.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, 'dist');
const CAMPAIGN = process.env.CAMPAIGN || 'pilot-2026-11';
const START = process.env.START || '2026-11-25';

const SAMPLE = {
  first_name: 'Alex', company: 'Northbank Water', sender_name: 'Christian', sender_title: 'Founder',
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
const manifest = { campaign: CAMPAIGN, start: START, generated: new Date().toISOString(), emails: [] };
const gallery = [];

for (const s of SEGMENTS) {
  if (!PILOT_OPTIONS.includes(s.pilot)) throw new Error(`${s.id}: pilot "${s.pilot}" not in live dialog`);
  for (const t of TOUCHES) {
    const e = t.build(s, CAMPAIGN);
    const site = {
      site_home: url('/', { campaign: CAMPAIGN, content: `${t.id.split('-')[0]}-${s.id}-logo` }),
      site_legal: url('/legal/'),
    };
    const html = fill(layout({ ...e, minimal: t.thread }), site);
    const txt = fill(plain(e), site);
    const dir = join(dist, s.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${t.id}.html`), html);
    writeFileSync(join(dir, `${t.id}.txt`), `Subject: ${e.subject}\n\n` + txt);

    const links = [...new Set([...html.matchAll(/href="(https:[^"]+)"/g)].map((m) => m[1]))];
    manifest.emails.push({
      segment: s.id, segment_name: s.name, kind: s.kind, touch: t.id, label: t.label,
      send_on: businessDay(START, t.day), reply_in_thread: !!t.thread,
      subject: e.subject, preheader: e.preheader,
      files: { html: `${s.id}/${t.id}.html`, text: `${s.id}/${t.id}.txt` },
      landing_page: s.path, pilot_option: s.pilot, links,
    });

    const pdir = join(dist, 'preview', s.id);
    mkdirSync(pdir, { recursive: true });
    writeFileSync(join(pdir, `${t.id}.html`), fill(html, SAMPLE));
    gallery.push({ s, t, e, href: `${s.id}/${t.id}.html`, date: businessDay(START, t.day) });
  }
}

writeFileSync(join(dist, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Review gallery
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
<style>body{font:14px/1.5 'Instrument Sans',Arial,sans-serif;color:#0c3041;background:#fcfdfd;margin:0;display:grid;grid-template-columns:minmax(0,1fr) 680px;height:100vh}
main{overflow:auto;padding:24px}iframe{width:100%;height:100%;border:0;border-left:1px solid #cbdbe3;background:#edf5f8}
table{border-collapse:collapse;width:100%;margin-bottom:24px}td,th{border-bottom:1px solid #cbdbe3;padding:8px;text-align:left;vertical-align:top}th{color:#416371;font-weight:600}
a{color:#155c80}small{color:#577081}h1{font-weight:500;letter-spacing:-.03em}h2{font-weight:500;color:#0c70ae}</style>
<main><h1>UIE outreach · ${CAMPAIGN}</h1><p>Sample merge values are filled in for review. Send from <code>dist/&lt;segment&gt;/</code>, not from this folder.</p>${rows}</main>
<iframe name="frame" src="${gallery[0].href}"></iframe>`);

console.log(`Built ${manifest.emails.length} emails (${SEGMENTS.length} segments × ${TOUCHES.length} touches) → ${dist}`);
