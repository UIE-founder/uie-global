// UIE outreach email system.
//
// Visual source: the Figma file "UIE — Holographic Blue" (AZmpT0rrLBpJt4YTA0DBpv), checked
// against the computed styles of the live uieglobal.com on 25 Nov 2026 (where they differ, the
// live site wins: Instrument Sans, ink #0c3041, porcelain #f4f5f2, 5 px "uie-polished" shapes).
//
// Shapes. The site cuts every control, card and image with a bottom-right chamfer whose joins are
// rounded (computed clip-path, e.g. a 144×46 button: r 5, cut 12.42, joins 5). Email clients do
// not support clip-path, so each shape is a live HTML cell plus a small image of its right edge or
// corner, rendered from the same path by compose.cjs. With images blocked the cell keeps its fill
// colour, so the control degrades to a plain rounded button that still works.
//
// Function. Nothing here is decorative-only: every row, stage, card, photo, crumb and button is a
// real link (to the page, the exact anchor, or the enquiry form with the right option selected).
// Expand/collapse and tabs cannot work across email clients, so rows show an arrow, not +/−.
//
// Client rules: 600 px tables, inline styles on every element that matters, role="presentation",
// alt text on every image, no clip-path/flex/grid/position, bulletproof hero background (VML for
// Outlook), light colour scheme declared.

export const T = {
  // live site tokens (front.css, glass.css, interaction.css, aerospace.css)
  ink: '#0c3041',           // --ink: text and primary buttons
  muted: '#416371',         // --muted
  link: '#155c80',          // .quiet-link
  accent: '#0c70ae',        // --blue: labels
  surface: '#f4f5f2',       // --uie-porcelain: page body
  page: '#e9eeef',          // outside the 600 px column
  line: '#cbdbe3',          // --wb-line
  heroInk: '#102b42',       // --uie-ink: hero surface
  heroText: '#f4f7fa',      // --hero-ink (dark)
  heroBody: '#d4e4ed',      // --hero-body (dark)
  heroBtn: '#e9f5fb', heroBtnText: '#13364b',   // hero .primary
  ice: '#e8f1f5', iceText: '#15364a',           // .action
  cardIce: '#e5f0f7',       // .u-platform
  tab: '#e6eef2', tabOn: '#ffffff', tabOnText: '#174c80', // [role=tab], selected
  // identity (Figma 11:156)
  black: '#0a0a0a', rhodium: '#c7ccd1', paper: '#f4f3f0', horizonBlue: '#0f75b7',
  font: "'Instrument Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
};

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const P = (html, { size = 16, color = T.ink, mb = 16, weight = 400, lh = 1.6, ls = 0, extra = '' } = {}) =>
  `<p style="margin:0 0 ${mb}px 0;font-family:${T.font};font-size:${size}px;line-height:${lh};color:${color};font-weight:${weight};${ls ? `letter-spacing:${ls}px;` : ''}${extra}">${html}</p>`;

const A = (href, html, { color = T.link, underline = true, weight = 'inherit', extra = '' } = {}) =>
  `<a href="${href}" target="_blank" style="color:${color};font-weight:${weight};text-decoration:${underline ? 'underline' : 'none'};${extra}">${html}</a>`;

// Polished button (site .primary / .action / hero .primary): live text cell + right-edge strip.
// 46 px tall: 13 + 20 + 13. Both cells link to the same place.
function button({ href, text, variant = 'ink', on = '' }, img) {
  const v = {
    ink: { fill: T.ink, fg: '#ffffff', strip: 'btn-ink.png' },
    ice: { fill: T.ice, fg: T.iceText, strip: 'btn-ice.png' },
    hero: { fill: T.heroBtn, fg: T.heroBtnText, strip: 'btn-hero.png', transparent: true },
  }[variant];
  if (on) v.strip = v.strip.replace('.png', `-on-${on}.png`);
  const stripBg = v.transparent ? '' : ` bgcolor="${v.fill}"`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;mso-table-lspace:0;mso-table-rspace:0;"><tr>
<td bgcolor="${v.fill}" style="background:${v.fill};border-radius:5px 0 0 5px;padding:0;"><a href="${href}" target="_blank" style="display:block;padding:13px 4px 13px 20px;font-family:${T.font};font-size:15px;line-height:20px;font-weight:600;color:${v.fg};text-decoration:none;white-space:nowrap;mso-line-height-rule:exactly;">${esc(text).replace(/ /g, '&nbsp;')}&nbsp;&nbsp;</a></td>
<td${stripBg} width="20" valign="top" style="width:20px;padding:0;font-size:0;line-height:0;"><a href="${href}" target="_blank" style="text-decoration:none;"><img src="${img(v.strip)}" width="20" height="46" alt="" style="display:block;width:20px;height:46px;border:0;"></a></td>
</tr></table>`;
}

// Polished card (site .u-platform / .u-cinema-brief): content cell + bottom-right corner tile.
function card(inner, img, { fill = T.cardIce, tile = 'card-ice.png', pad = '24px 26px 0 26px' } = {}) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${fill}" style="background:${fill};border-collapse:separate;border-radius:5px 5px 0 5px;">
<tr><td colspan="2" style="padding:${pad};">${inner}</td></tr>
<tr><td height="32" style="height:32px;font-size:0;line-height:0;border-radius:0 0 0 5px;">&nbsp;</td><td width="32" valign="bottom" style="width:32px;font-size:0;line-height:0;"><img src="${img(tile)}" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0;"></td></tr>
</table>`;
}

const row = (inner, { pad = '0 40px 24px 40px', bg = T.surface } = {}) =>
  `<tr><td class="px" bgcolor="${bg}" style="background:${bg};padding:${pad};">${inner}</td></tr>`;

export const blocks = {
  // Masthead + hero (Figma 100:43; site .front-hero). The masthead strip and the art are images;
  // crumbs, headline, lead and button are live HTML over the art, on a solid fallback colour.
  hero: (b, img) => `
<tr><td bgcolor="${T.surface}" style="padding:0;font-size:0;line-height:0;"><a href="${b.home}" target="_blank"><img src="${img('hero-masthead.png')}" width="600" height="50" alt="UIE" style="display:block;width:100%;max-width:600px;height:auto;border:0;font-family:${T.font};font-size:20px;font-weight:600;color:${T.ink};"></a></td></tr>
<tr><td background="${img('hero-orbit.jpg')}" bgcolor="${T.heroInk}" valign="top" style="background:${T.heroInk} url('${img('hero-orbit.jpg')}') right bottom / cover no-repeat;">
<!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:325px;"><v:fill type="frame" src="${img('hero-orbit.jpg')}" color="${T.heroInk}"/><v:textbox inset="0,0,0,0"><![endif]-->
<div class="px" style="padding:38px 40px 58px 40px;">
  ${P(b.crumbs.map(([t, u]) => u ? A(u, esc(t), { color: T.heroText, underline: false }) : `<span style="color:${T.heroText};">${esc(t)}</span>`).join(`<span style="color:${T.heroBody};">&nbsp;&nbsp;/&nbsp;&nbsp;</span>`), { size: 14, color: T.heroText, mb: 18, lh: 1.4 })}
  <h1 style="margin:0 0 16px 0;max-width:430px;font-family:${T.font};font-size:36px;line-height:1.04;letter-spacing:-1.7px;font-weight:500;color:${T.heroText};">${esc(b.headline)}</h1>
  ${P(b.lead, { size: 16, color: T.heroText, mb: 26, lh: 1.55, extra: 'max-width:410px;' })}
  ${button({ href: b.cta.href, text: b.cta.text, variant: 'hero' }, img)}
</div>
<!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
</td></tr>`,

  letter: (b) => row(b.paras.map((h) => P(h)).join(''), { pad: '34px 40px 10px 40px' }),

  close: (b) => row(b.paras.map((h) => P(h)).join(''), { pad: '4px 40px 8px 40px' }),

  // Linked service rows (Figma Service row 39:41 / 39:46, site .wb-list). Each row is a link.
  serviceRows: (b) => row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${b.rows.map((r) => `<tr><td style="border-top:1px solid ${T.line};padding:${r.scope ? '16px 0 18px' : '15px 0'};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="font-family:${T.font};font-size:20px;line-height:1.25;letter-spacing:-0.5px;font-weight:500;">${A(r.href, esc(r.title), { color: r.open ? T.accent : T.ink, underline: false })}</td>
    <td width="28" align="right" valign="top" style="font-family:${T.font};font-size:20px;line-height:1.25;">${A(r.href, '&#8594;', { color: r.open ? T.accent : T.muted, underline: false })}</td>
  </tr></table>
  ${r.scope ? `${P(esc(r.scopeLabel || 'Workflow scope'), { size: 13, color: T.accent, mb: 4, weight: 600, lh: 1.3, extra: 'margin-top:10px;' })}${P(esc(r.scope), { size: 16, color: T.muted, mb: 0, lh: 1.5 })}` : ''}
</td></tr>`).join('')}
<tr><td style="border-top:1px solid ${T.line};font-size:0;line-height:0;height:1px;">&nbsp;</td></tr>
</table>`),

  // Photo with the site's asymmetric soft chamfer (baked into the image), linked to the page.
  photo: (b, img) => row(`<a href="${b.href}" target="_blank" style="text-decoration:none;"><img src="${img(b.img)}" width="520" height="280" alt="${esc(b.alt)}" style="display:block;width:100%;max-width:520px;height:auto;border:0;font-family:${T.font};font-size:14px;color:${T.muted};"></a>
${b.credit ? P(esc(b.credit), { size: 12, color: T.muted, mb: 0, lh: 1.4, extra: 'margin-top:8px;' }) : ''}`, { pad: '6px 40px 24px 40px' }),

  // Qlaas platform cards (Figma 100:87; site .u-platform): polished card, glyph, linked title, button.
  qlaasCard: (b, img) => row(card(`
  <a href="${b.href}" target="_blank" style="text-decoration:none;"><img src="${img(b.glyph)}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;margin:0 0 8px -8px;"></a>
  ${P(esc(b.label), { size: 14, color: T.muted, mb: 6, lh: 1.3 })}
  <p style="margin:0 0 10px 0;font-family:${T.font};font-size:30px;line-height:1.05;letter-spacing:-1.3px;font-weight:500;">${A(b.href, esc(b.title), { color: T.ink, underline: false })}</p>
  ${P(esc(b.text), { size: 16, mb: 20, lh: 1.5 })}
  ${button({ href: b.href, text: b.cta, variant: b.tone === 'dmi' ? 'ink' : 'ice', on: b.tone === 'dmi' ? 'ice' : 'white' }, img)}`, img, b.tone === 'dmi' ? {} : { fill: '#ffffff', tile: 'card-white.png' }), { pad: '4px 40px 18px 40px' }),

  // Refund case stages (Figma Trace stage 39:52/39:55; site [role=tab]). Every stage links to the
  // live walkthrough's refund case (#case), where the stages are interactive.
  trace: (b) => row(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;">
${[b.stages.slice(0, 3), b.stages.slice(3)].map((r, ri) => `<tr>${r.map((s, ci) => {
    const on = s === b.active;
    return `<td width="33%" style="padding:${ri ? '4px' : '0'} ${ci < 2 ? '4px' : '0'} 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${on ? T.tabOn : T.tab}" style="background:${on ? T.tabOn : T.tab};border-radius:5px;${on ? `border:1px solid ${T.line};` : ''}"><tr><td style="padding:14px 14px;font-family:${T.font};font-size:15px;line-height:1.2;">${A(b.href, `<span style="color:${on ? T.accent : T.muted};font-size:12px;">0${b.stages.indexOf(s) + 1}</span><br>${esc(s)}`, { color: on ? T.tabOnText : T.ink, underline: false, weight: on ? 650 : 400, extra: 'display:block;' })}</td></tr></table></td>`;
  }).join('')}</tr>`).join('')}
</table>
${b.evidence ? `<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>${card(`${P('Evidence', { size: 13, color: T.accent, mb: 6, weight: 600 })}${P(esc(b.evidence.title), { size: 19, mb: 6, weight: 500, lh: 1.3, ls: -0.3 })}${P(esc(b.evidence.text), { size: 15, color: T.muted, mb: 0, lh: 1.5 })}`, b.imgFn, { fill: '#ffffff', tile: 'card-white.png', pad: '18px 22px 0 22px' })}` : ''}`),

  // Pilot brief steps (Figma 40:121 stage lines; site .pilot steps), each linked to the guide.
  stages: (b) => row(b.items.map(([title, text], i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${i ? T.line : T.ink};padding:14px 0 16px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="40" valign="top" style="font-family:${T.font};font-size:14px;line-height:1.7;font-weight:600;color:${T.accent};">0${i + 1}</td>
    <td valign="top" style="font-family:${T.font};font-size:19px;line-height:1.35;letter-spacing:-0.3px;font-weight:500;">${A(b.href, esc(title), { color: T.ink, underline: false })}${text ? P(esc(text), { size: 15, color: T.muted, mb: 0, lh: 1.45, extra: 'margin-top:4px;letter-spacing:0;font-weight:400;' }) : ''}</td>
    <td width="28" align="right" valign="top" style="font-family:${T.font};font-size:19px;line-height:1.35;">${A(b.href, '&#8594;', { color: T.muted, underline: false })}</td>
  </tr></table>
</td></tr></table>`).join(''), { pad: '0 40px 18px 40px' }),

  cta: (b, img) => row(`${button({ href: b.href, text: b.text, variant: b.variant || 'ink' }, img)}
${b.secondary ? P(A(b.secondary.href, `${esc(b.secondary.text)}&nbsp;&#8594;`, { underline: false }), { size: 15, mb: 0, lh: 1.4, extra: 'margin-top:16px;' }) : ''}`, { pad: '6px 40px 28px 40px' }),

  // Email signature (Figma 11:257) as a polished paper card. Email and site are links.
  signature: (b, img) => row(`<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:auto;"><tr><td>${card(`<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td valign="middle" style="padding:0 16px 0 0;"><a href="${b.site}" target="_blank"><img src="${img('e-black.png')}" width="52" height="52" alt="UIE" style="display:block;width:52px;height:52px;border:0;"></a></td>
  <td valign="middle" style="padding:0 0 0 16px;border-left:1px solid ${T.rhodium};">
    ${P('{{sender_name}}', { size: 19, color: T.black, mb: 4, lh: 1.25 })}
    ${P('{{sender_title}}, UIE Ltd', { size: 14, color: T.black, mb: 8, lh: 1.3 })}
    ${P(`${A('mailto:{{sender_email}}', '{{sender_email}}', { color: T.black, underline: false })}<br>${A(b.site, 'uieglobal.com', { color: T.link, underline: false })}`, { size: 14, mb: 0, lh: 1.5 })}
  </td></tr></table>`, img, { fill: T.paper, tile: 'card-paper.png', pad: '20px 22px 0 20px' })}</td></tr></table>`, { pad: '8px 40px 32px 40px' }),
};

// Footer (Figma 100:162; site .footer): wordmark, link directory, legal identification, opt-out.
function footer(L, img) {
  const col = (h, items) => `<div class="stack" style="display:inline-block;width:100%;max-width:172px;vertical-align:top;padding:0 0 14px 0;">
  ${P(h, { size: 14, mb: 8, weight: 600, lh: 1.3 })}
  ${items.map(([t, u]) => P(A(u, t, { color: T.muted, underline: false }), { size: 14, mb: 6, lh: 1.4 })).join('')}
</div>`;
  const ghost = (cols) => `<!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="173" valign="top"><![endif]-->${cols.join('<!--[if mso]></td><td width="173" valign="top"><![endif]-->')}<!--[if mso]></td></tr></table><![endif]-->`;
  return `<tr><td class="px" bgcolor="${T.surface}" style="background:${T.surface};padding:0 40px;"><div style="border-top:1px solid ${T.line};font-size:0;line-height:0;height:1px;">&nbsp;</div></td></tr>
<tr><td class="px" bgcolor="${T.surface}" style="background:${T.surface};padding:24px 40px 6px 40px;">
  <a href="${L.home}" target="_blank"><img src="${img('wordmark-glass.png')}" width="80" height="31" alt="UIE" style="display:block;width:80px;height:31px;border:0;margin:0 0 20px 0;font-family:${T.font};font-size:18px;font-weight:600;color:${T.ink};"></a>
  <div style="font-size:0;line-height:0;">${ghost([
    col('Platform', [['Qlaas DMI', L.dmi], ['Qlaas Services', L.services], ['Walkthrough', L.walkthrough]]),
    col('Explore', [['Industries', L.industries], ['Solutions', L.solutions], ['Resources', L.resources]]),
    col('Company', [['About UIE', L.company], ['Discuss a pilot', L.pilot], ['enquiries@uieglobal.com', 'mailto:enquiries@uieglobal.com']]),
  ])}</div>
</td></tr>
<tr><td class="px" bgcolor="${T.surface}" style="background:${T.surface};padding:4px 40px 36px 40px;">
  ${P(`UIE Ltd &middot; Registered in England and Wales, company number 17334450 &middot; 66 Paul Street, London, EC2A 4NA, United Kingdom &middot; ${A(L.legal, 'Corporate information', { color: T.muted })}`, { size: 12, color: T.muted, mb: 8, lh: 1.6 })}
  ${P('I wrote to you because of your role at {{company}}. If this isn&#8217;t relevant, reply &#8220;no thanks&#8221; and I won&#8217;t write again.', { size: 12, color: T.muted, mb: 0, lh: 1.6 })}
</td></tr>`;
}

export function layout({ subject, preheader, body, links, asset }) {
  const html = body.map((b) => blocks[b.type]({ ...b, imgFn: asset, site: links.home }, asset)).join('\n');
  return `<!doctype html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><style>td,p,a,h1{font-family:Arial,sans-serif!important;}</style><![endif]-->
<!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><!--<![endif]-->
<style>
  :root{color-scheme:light;supported-color-schemes:light;}
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  img{-ms-interpolation-mode:bicubic;}
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;}
  @media (max-width:620px){
    .wrap{width:100%!important;}
    .px{padding-left:22px!important;padding-right:22px!important;}
    h1{font-size:31px!important;}
    .stack{display:block!important;max-width:100%!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${T.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${T.page}" style="background:${T.page};">
  <tr><td align="center" style="padding:24px 10px;">
    <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td><![endif]-->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="wrap" bgcolor="${T.surface}" style="width:100%;max-width:600px;margin:0 auto;background:${T.surface};">
${html}
${footer(links, asset)}
    </table>
    <!--[if mso]></td></tr></table><![endif]-->
  </td></tr>
</table>
</body>
</html>
`;
}

// Plain-text alternative (every link written out in full).
export function plain({ body }) {
  const strip = (h) => String(h).replace(/<br\s*\/?>/g, '\n').replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '$2 ($1)')
    .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"').replace(/&#8594;/g, '→').replace(/&nbsp;/g, ' ');
  const out = [];
  for (const b of body) {
    switch (b.type) {
      case 'hero': out.push(`${b.crumbs.map(([t]) => t).join(' / ')}\n${b.headline}\n${strip(b.lead)}\n${b.cta.text}: ${b.cta.href}`); break;
      case 'letter': case 'close': out.push(...b.paras.map(strip)); break;
      case 'serviceRows': out.push(b.rows.map((r) => `- ${r.title}${r.scope ? `: ${r.scope}` : ''} (${r.href})`).join('\n')); break;
      case 'photo': out.push(`${b.alt}: ${b.href}`); break;
      case 'qlaasCard': out.push(`${b.title}: ${b.text}\n${b.cta}: ${b.href}`); break;
      case 'trace': out.push(b.stages.join(' → ') + `\n${b.href}` + (b.evidence ? `\nEvidence: ${b.evidence.title}. ${b.evidence.text}` : '')); break;
      case 'stages': out.push(b.items.map(([t, x], i) => `0${i + 1} ${t}${x ? `: ${x}` : ''}`).join('\n') + `\n${b.href}`); break;
      case 'cta': out.push(`${b.text}: ${b.href}` + (b.secondary ? `\n${b.secondary.text}: ${b.secondary.href}` : '')); break;
      case 'signature': out.push('{{sender_name}}\n{{sender_title}}, UIE Ltd\n{{sender_email}}\nhttps://uieglobal.com'); break;
    }
  }
  out.push('--\nUIE Ltd · Registered in England and Wales, company number 17334450 · 66 Paul Street, London, EC2A 4NA, United Kingdom');
  out.push('I wrote to you because of your role at {{company}}. If this isn’t relevant, reply "no thanks" and I won’t write again.');
  return out.join('\n\n') + '\n';
}
