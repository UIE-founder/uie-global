#!/usr/bin/env node
// Renders the email image assets from the Figma source layers in assets/src/.
// Source file: Figma "UIE — Holographic Blue" (AZmpT0rrLBpJt4YTA0DBpv).
//   Hero:      "Masthead and orbital hero" (100:43) — Earth / production projection (123:225),
//              Orbit veil (100:45), light trails (140:426…), Masthead glass / bottom-right cut (110:1655),
//              UIE wordmark glass (104:971), Chamfer / bottom-right (110:1603).
//   Photos:    homepage photo sections (100:112, 100:120, 100:128, 100:146, 100:154), each with its
//              Chamfer / bottom-right. High-resolution copies come from uieglobal.com/assets.
//   Marks:     E / Primary Black (11:258, email signature), UIE / Glyph / endpoint + orchestration.
// Everything is rendered at 2x for retina email clients.
//
//   node compose.cjs   (needs Playwright; writes assets/*.png|jpg)

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'assets', 'src');
const OUT = path.join(__dirname, 'assets');
const uri = (f) => 'file://' + path.join(SRC, f);
const svg = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const SURFACE = '#F4F5F2'; // Figma body surface / chamfer fill

// The site's "uie-polished" outline (computed clip-path on uieglobal.com, 25 Nov 2026):
// rounded corners of radius r, then a straight bottom-right cut of cx × cy whose two joins are
// rounded over j px. E.g. a 144×46 button is
//   M 5 0 H 139 Q 144 0 144 5 V 28.58 Q 144 33.58 140.5 37.08 L 135.08 42.5 Q 131.58 46 126.58 46 H 5 …
// which is r = 5, cx = cy = 12.42, j = 5.
function polished(W, H, { r = 5, cx, cy = cx, j = 5, x0 = 0, y0 = 0, rTL = r, rTR = r, rBL = r } = {}) {
  const len = Math.hypot(cx, cy), ux = -cx / len, uy = cy / len;
  const A = [W, H - cy], B = [W - cx, H];
  const f = (n) => +n.toFixed(2);
  const X = (x) => f(x0 + x), Y = (y) => f(y0 + y);
  return `M ${X(rTL)} ${Y(0)} H ${X(W - rTR)} Q ${X(W)} ${Y(0)} ${X(W)} ${Y(rTR)} V ${Y(A[1] - j)} ` +
    `Q ${X(A[0])} ${Y(A[1])} ${X(A[0] + ux * j)} ${Y(A[1] + uy * j)} L ${X(B[0] - ux * j)} ${Y(B[1] - uy * j)} ` +
    `Q ${X(B[0])} ${Y(B[1])} ${X(B[0] - j)} ${Y(B[1])} H ${X(rBL)} Q ${X(0)} ${Y(H)} ${X(0)} ${Y(H - rBL)} V ${Y(rTL)} Q ${X(0)} ${Y(0)} ${X(rTL)} ${Y(0)} Z`;
}

// Light trails: inset percentages of the 1440×810 Earth frame (from 123:225).
const TRAILS = [
  ['35.71%', '73.78%', '63.57%', '25.91%'], ['35.07%', '67.49%', '64.24%', '29.94%'],
  ['60.85%', '59.69%', '35.76%', '39.13%'], ['47.57%', '40.77%', '50.76%', '57.48%'],
  ['57.06%', '29.5%', '41%', '68.39%'], ['67.67%', '22.96%', '31.74%', '75.32%'],
  ['70.18%', '14.72%', '29.21%', '84.09%'], ['78.81%', '3.13%', '19.52%', '95.89%'],
];

// Hero art: 1440 wide like the Figma frame, taller so live text fits below the masthead in a
// 600 px email. Masthead and chamfer are scaled up ×1.25 for legibility at email width.
function heroHTML({ W = 1440, H = 900, mast = 120 } = {}) {
  const k = H / 748;                      // vertical stretch relative to Figma hero
  const fw = Math.max(W, (H + 40) * 1440 / 810), fh = fw * 810 / 1440;
  const left = (W - fw) / 2 + fw * 0.06;  // keep Europe/Africa in view, like the Figma crop
  const top = -28.52 * k;
  const cut = 34;
  return `<!doctype html><html><body style="margin:0;background:#102b42">
<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#102b42;font:0/0 a">
  <div style="position:absolute;left:${left}px;top:${top}px;width:${fw}px;height:${fh}px">
    <img src="${uri('earth-blue-marble.jpg')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
    ${TRAILS.map(([t, r, b, l], i) => `<img src="${uri(`trail${i + 1}.svg`)}" style="position:absolute;top:${t};right:${r};bottom:${b};left:${l};width:calc(100% - ${l} - ${r});height:calc(100% - ${t} - ${b})">`).join('')}
  </div>
  <div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(5,19,33,.9) 0%, rgba(5,19,33,.84) 55%, rgba(5,19,33,.58) 78%, rgba(5,19,33,.22) 100%)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:${H * 0.35}px;background:linear-gradient(180deg, rgba(16,43,66,0) 0%, rgba(16,43,66,.55) 100%)"></div>
  <svg width="${W}" height="${mast}" viewBox="0 0 ${W} ${mast}" style="position:absolute;left:0;top:0"><path d="${polished(W, mast, { r: 0, rBL: 12, cx: cut, j: 12 })}" fill="${SURFACE}" fill-opacity=".93"/></svg>
  <img src="${uri('wordmark-glass.svg')}" style="position:absolute;left:72px;top:${(mast - 58) / 2}px;width:150px;height:58px">
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0"><path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z ${polished(W, H, { r: 0, cx: 110, j: 16 })}" fill="${SURFACE}"/></svg>
</div></body></html>`;
}

function photoHTML(file, { W = 1040, H = 560, pos = 'center', cx = Math.round(W * 0.23), cy = Math.round(H * 0.30) } = {}) {
  return `<!doctype html><html><body style="margin:0">
<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${SURFACE}">
  <img src="${uri(file)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pos}">
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0"><path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z ${polished(W, H, { r: 10, cx, cy, j: 14 })}" fill="${SURFACE}"/></svg>
</div></body></html>`;
}

// Right-edge strip of a polished shape, cut out of a wide virtual shape so its geometry is
// identical to the site's: the strip is the rightmost w px (buttons) or the bottom-right w×h
// corner (cards). Inside = fill; outside = bg (or transparent over imagery).
function stripHTML({ w, h, boxH, fill, bg, cx, j = 5, r = 5, corner = false }) {
  const BW = 400, BH = corner ? 400 : boxH;
  const vx = BW - w, vy = corner ? BH - h : 0;
  return `<!doctype html><html><body style="margin:0;background:transparent">
<svg width="${w}" height="${h}" viewBox="${vx} ${vy} ${w} ${h}" style="display:block">
  ${bg ? `<rect x="${vx}" y="${vy}" width="${w}" height="${h}" fill="${bg}"/>` : ''}
  <path d="${polished(BW, BH, { r, cx, j })}" fill="${fill}"/>
</svg></body></html>`;
}

const layered = (files, size, inner, bg = 'transparent') => `<!doctype html><html><body style="margin:0;background:${bg}">
<div style="position:relative;width:${size}px;height:${size}px">${files.map((f) => `<img src="${uri(f)}" style="position:absolute;left:${(size - inner) / 2}px;top:${(size - inner) / 2}px;width:${inner}px;height:${inner}px">`).join('')}</div></body></html>`;

const single = (file, w, h, bg = 'transparent') => `<!doctype html><html><body style="margin:0;background:${bg}"><img src="${uri(file)}" style="display:block;width:${w}px;height:${h}px"></body></html>`;

const TMP = path.join(SRC, '_render.html');
async function load(page, html) {
  fs.writeFileSync(TMP, html);
  await page.goto('file://' + TMP, { waitUntil: 'load' });
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  if (broken.length) throw new Error('images failed to load: ' + broken.join(', '));
}

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 1 });

  // Hero: render once at 1440×900, export masthead strip + body (both 1200 wide = 600 @2x).
  await page.setViewportSize({ width: 1440, height: 900 });
  await load(page, heroHTML());
  await page.screenshot({ path: path.join(OUT, '_hero-full.png') });
  await b.close();

  // Resize/crop with Python Pillow for exact 2x email geometry.
  const { execFileSync } = require('child_process');
  execFileSync('python3', ['-I', '-c', `
from PIL import Image
im = Image.open(${JSON.stringify(path.join(OUT, '_hero-full.png'))}).convert('RGB')
im = im.resize((1200, 750), Image.LANCZOS)
im.crop((0, 0, 1200, 100)).save(${JSON.stringify(path.join(OUT, 'hero-masthead.png'))}, optimize=True)
im.crop((0, 100, 1200, 750)).save(${JSON.stringify(path.join(OUT, 'hero-orbit.jpg'))}, quality=80, optimize=True, progressive=True)
`]);
  fs.unlinkSync(path.join(OUT, '_hero-full.png'));
  console.log('wrote hero-masthead.png, hero-orbit.jpg');

  const b2 = await chromium.launch();
  const p2 = await b2.newPage({ deviceScaleFactor: 1 });
  async function shot2(html, out, w, h, opts = {}) {
    await p2.setViewportSize({ width: w, height: h });
    await load(p2, html);
    const jpeg = out.endsWith('.jpg');
    await p2.screenshot({ path: path.join(OUT, out), type: jpeg ? 'jpeg' : 'png', quality: jpeg ? 80 : undefined, omitBackground: !!opts.transparent });
    console.log('wrote', out);
  }
  for (const [name, pos] of [['water', 'center'], ['defence', 'center'], ['people', 'center 35%'], ['data', 'center'], ['goldstone', 'center 40%']]) {
    await shot2(photoHTML(`${name}.webp`, { pos }), `photo-${name}.jpg`, 1040, 560);
  }
  await shot2(single('e-black.svg', 116, 116), 'e-black.png', 116, 116, { transparent: true });
  await shot2(single('e-horizon-arc.svg', 110, 116), 'e-horizon-arc.png', 110, 116, { transparent: true });
  await shot2(single('wordmark-glass.svg', 160, 62), 'wordmark-glass.png', 160, 62, { transparent: true });
  await shot2(layered(['glyph-endpoint-structure.svg', 'glyph-endpoint-accent.svg'], 96, 64), 'glyph-endpoint.png', 96, 96, { transparent: true });
  await shot2(layered(['glyph-orch-structure.svg', 'glyph-orch-accent0.svg', 'glyph-orch-accent1.svg'], 96, 64), 'glyph-orchestration.png', 96, 96, { transparent: true });
  // Buttons: 46 px tall (site .primary/.action), 5 px radius, 12.42 px cut, 5 px joins. Rendered at 2x.
  const BTN = [
    ['btn-ink', '#0c3041', SURFACE],      // .primary / .contact on porcelain
    ['btn-ice', '#e8f1f5', SURFACE],      // .action (light) on porcelain
    ['btn-hero', '#e9f5fb', null],        // hero .primary over imagery (transparent outside)
    ['btn-ink-on-ice', '#0c3041', '#e5f0f7'],   // primary inside an ice card
    ['btn-ice-on-white', '#e8f1f5', '#ffffff'], // light action inside a white card
  ];
  for (const [name, fill, bg] of BTN) {
    await shot2(stripHTML({ w: 40, h: 92, boxH: 92, fill, bg, cx: 24.84, j: 10, r: 10 }), `${name}.png`, 40, 92, { transparent: !bg });
  }
  // Cards: 5 px radius, 22 px cut (site .u-platform / .u-cinema-brief), 5 px joins. Corner tile 32×32 @2x.
  for (const [name, fill] of [['card-ice', '#e5f0f7'], ['card-white', '#ffffff'], ['card-paper', '#f4f3f0']]) {
    await shot2(stripHTML({ w: 64, h: 64, fill, bg: SURFACE, cx: 44, j: 10, r: 10, corner: true }), `${name}.png`, 64, 64);
  }
  await b2.close();
  fs.unlinkSync(TMP);
})();
