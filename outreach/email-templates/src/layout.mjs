// UIE outreach email system, built from the Figma file "UIE — Holographic Blue"
// (AZmpT0rrLBpJt4YTA0DBpv). Every component below names the Figma node it is drawn from.
//
// Email-client rules: 600 px table layout, inline styles, bulletproof buttons (VML for Outlook),
// background hero with a solid fallback colour so live text stays readable when images are off,
// Inter with an Arial fallback, light colour scheme declared so clients do not invert the art.

export const T = {
  // Homepage "Masthead and orbital hero" (100:43)
  heroSurface: '#102b42',   // --surface
  heroContent: '#ecf7ff',   // --content
  heroMuted: '#b9cfde',
  // Homepage body surfaces (100:87 Qlaas products)
  surface: '#f4f5f2',       // --surface
  content: '#123349',       // --content
  muted: '#496578',         // --muted
  dmiCard: '#dceef8',       // Qlaas DMI card
  glassEdge: '#8ea3bf',     // Integrated glass edge rgba(50,89,145,.47) on surface
  // Components / Web interface (39:32)
  ink: '#081a28',           // Action / Pilot / dark
  porcelain: '#e9eef1',     // Trace stage / Rest, Service row (on surface)
  separator: '#ccd9df',     // Service row separator
  rowTitle: '#142f40',
  rowStroke: '#54768c',
  scopeLabel: '#2b678a',
  scopeText: '#395467',
  // Identity (11:156 Colour & typography)
  horizonBlue: '#0f75b7',
  black: '#0a0a0a',
  rhodium: '#c7ccd1',
  paper: '#f4f3f0',         // Institutional White
  font: "Inter, 'Helvetica Neue', Arial, sans-serif",
};

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const txt = (html, { size = 16, color = T.content, mb = 16, weight = 400, lh = 1.6, ls = 0 } = {}) =>
  `<p style="margin:0 0 ${mb}px 0;font-family:${T.font};font-size:${size}px;line-height:${lh};color:${color};font-weight:${weight};${ls ? `letter-spacing:${ls}px;` : ''}">${html}</p>`;

// Buttons ----------------------------------------------------------------------------------
// variant 'light'   = hero "Discuss a pilot" (100:48): #ecf7ff fill, glass edge, surface text
// variant 'dark'    = "Action / Pilot / dark" (39:37)
// variant 'outline' = "Explore DMI" glass-edge link button (100:97)
function button({ href, text, variant = 'dark' }) {
  const v = {
    light: { bg: T.heroContent, fg: T.heroSurface, border: T.glassEdge },
    dark: { bg: T.ink, fg: '#ffffff', border: T.ink },
    outline: { bg: 'transparent', fg: T.content, border: T.glassEdge },
  }[variant];
  const w = Math.max(160, Math.round(text.length * 8.6 + 40));
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td style="border-radius:8px;background:${v.bg};border:1px solid ${v.border};">
<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:50px;v-text-anchor:middle;width:${w}px;" arcsize="16%" strokecolor="${v.border}" fill="${variant === 'outline' ? 'f' : 't'}" fillcolor="${v.bg === 'transparent' ? '#ffffff' : v.bg}"><center style="color:${v.fg};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${esc(text)}</center></v:roundrect><![endif]-->
<!--[if !mso]><!--><a href="${href}" target="_blank" style="display:inline-block;padding:15px 18px;font-family:${T.font};font-size:15px;line-height:18px;font-weight:500;color:${v.fg};text-decoration:none;border-radius:8px;">${esc(text)}</a><!--<![endif]-->
</td></tr></table>`;
}

const section = (inner, { bg = T.surface, pad = '0 40px 28px 40px' } = {}) =>
  `<tr><td class="px" style="background:${bg};padding:${pad};">${inner}</td></tr>`;

// Blocks -----------------------------------------------------------------------------------
export const blocks = {
  // Masthead glass + orbital hero (100:43). Masthead strip and hero art rendered from Figma layers.
  hero: (b, A) => `
<tr><td style="background:${T.heroSurface};padding:0;line-height:0;font-size:0;"><a href="${b.home}" target="_blank"><img src="${A('hero-masthead.png')}" width="600" height="50" alt="UIE" style="display:block;width:100%;max-width:600px;height:auto;border:0;background:${T.surface};color:${T.content};font-family:${T.font};font-size:18px;font-weight:600;"></a></td></tr>
<tr><td background="${A('hero-orbit.jpg')}" bgcolor="${T.heroSurface}" valign="top" class="hero" style="background:${T.heroSurface} url('${A('hero-orbit.jpg')}') center top / cover no-repeat;">
<!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:325px;"><v:fill type="frame" src="${A('hero-orbit.jpg')}" color="${T.heroSurface}"/><v:textbox inset="0,0,0,0"><![endif]-->
<div class="px" style="padding:44px 40px 52px 40px;">
  ${txt(esc(b.eyebrow), { size: 14, color: '#e4eff6', mb: 14, weight: 500, ls: 0.35, lh: 1.3 })}
  <h1 style="margin:0 0 16px 0;max-width:420px;font-family:${T.font};font-size:34px;line-height:1.05;letter-spacing:-1.3px;font-weight:500;color:${T.heroContent};">${esc(b.headline)}</h1>
  ${txt(b.lead, { size: 16, color: T.heroContent, mb: 26, lh: 1.5 }).replace('<p style="', '<p style="max-width:400px;')}
  ${button({ href: b.cta.href, text: b.cta.text, variant: 'light' })}
</div>
<!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
</td></tr>`,

  letter: (b) => section(b.paras.map((h) => txt(h)).join(''), { pad: '36px 40px 12px 40px' }),

  label: (b) => section(txt(esc(b.text), { size: 14, color: T.muted, mb: 0, weight: 500 }), { pad: '12px 40px 8px 40px' }),

  heading: (b) => section(`<h2 style="margin:0;font-family:${T.font};font-size:28px;line-height:1.1;letter-spacing:-1.1px;font-weight:500;color:${T.content};">${esc(b.text)}</h2>`, { pad: '0 40px 18px 40px' }),

  // Service row / Expanded (39:46) followed by Service row / Rest (39:41).
  serviceRows: (b) => section(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${b.rows.map((r, i) => `<tr><td style="border-top:1px solid ${T.separator};padding:${r.scope ? '16px 0 18px' : '16px 0'};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="font-family:${T.font};font-size:20px;line-height:1.2;letter-spacing:-0.4px;font-weight:500;color:${r.open ? T.horizonBlue : T.rowTitle};">${esc(r.title)}</td>
    <td width="20" align="right" style="font-family:${T.font};font-size:20px;line-height:1;color:${T.rowStroke};">${r.scope ? '&#8722;' : '+'}</td>
  </tr></table>
  ${r.scope ? `<p style="margin:12px 0 4px 0;font-family:${T.font};font-size:13px;font-weight:600;color:${T.scopeLabel};">${esc(r.scopeLabel || 'Workflow scope')}</p><p style="margin:0;font-family:${T.font};font-size:16px;line-height:1.45;color:${T.scopeText};">${esc(r.scope)}</p>` : ''}
</td></tr>`).join('')}
<tr><td style="border-top:1px solid ${T.separator};font-size:0;line-height:0;">&nbsp;</td></tr>
</table>`, { pad: '0 40px 24px 40px' }),

  // Photo section with Chamfer / bottom-right (100:112 Field operations pattern).
  photo: (b, A) => section(`<a href="${b.href}" target="_blank"><img src="${A(b.img)}" width="520" height="280" alt="${esc(b.alt)}" style="display:block;width:100%;max-width:520px;height:auto;border:0;"></a>
${b.credit ? txt(esc(b.credit), { size: 12, color: T.muted, mb: 0, lh: 1.4 }).replace('margin:0 0 0 0', 'margin:8px 0 0 0') : ''}`, { pad: '8px 40px 22px 40px' }),

  // Qlaas products (100:87): DMI card on #dceef8 with glyph, label, title, text, glass-edge button.
  qlaasCard: (b, A) => section(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${b.tone === 'dmi' ? T.dmiCard : '#ffffff'};border-radius:12px;${b.tone === 'dmi' ? '' : `border:1px solid ${T.separator};`}">
<tr><td style="padding:22px 24px 24px 24px;">
  <img src="${A(b.glyph)}" width="48" height="48" alt="" style="display:block;width:48px;height:48px;border:0;margin:0 0 10px -8px;">
  ${txt(esc(b.label), { size: 14, color: T.muted, mb: 6, lh: 1.3 })}
  <p style="margin:0 0 12px 0;font-family:${T.font};font-size:30px;line-height:1.05;letter-spacing:-1.2px;font-weight:500;color:${T.content};">${esc(b.title)}</p>
  ${txt(esc(b.text), { size: 16, mb: 18, lh: 1.45 })}
  ${button({ href: b.href, text: b.cta, variant: 'outline' })}
</td></tr></table>`, { pad: '4px 40px 22px 40px' }),

  // Trace stage / Active (39:52) and Trace stage / Rest (39:55), as the mobile 3×2 selector (41:103…).
  trace: (b) => section(`<table role="presentation" width="100%" cellpadding="0" cellspacing="4" border="0" style="border-collapse:separate;margin:0 -4px;">
${[b.stages.slice(0, 3), b.stages.slice(3)].map((row) => `<tr>${row.map((s) => {
    const on = s === b.active;
    return `<td width="33%" style="background:${on ? '#ffffff' : T.porcelain};border-radius:3px;padding:15px 14px;font-family:${T.font};font-size:16px;line-height:1.2;font-weight:${on ? 600 : 400};color:${on ? T.horizonBlue : '#425f70'};${on ? `box-shadow:inset 0 -2px 0 ${T.horizonBlue};` : ''}">${esc(s)}</td>`;
  }).join('')}</tr>`).join('')}
</table>
${b.evidence ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;background:#ffffff;border-radius:8px;border:1px solid ${T.separator};"><tr><td style="padding:16px 18px;">
  ${txt('EVIDENCE', { size: 12, color: T.muted, mb: 6, weight: 500, ls: 1 })}
  ${txt(esc(b.evidence.title), { size: 18, mb: 4, weight: 500, lh: 1.3 })}
  ${txt(esc(b.evidence.text), { size: 15, color: T.scopeText, mb: 0, lh: 1.45 })}
</td></tr></table>` : ''}`, { pad: '0 40px 24px 40px' }),

  // Implementation stage lines (40:121): rule, title, text.
  stages: (b) => section(b.items.map(([title, text], i) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${T.content};padding:14px 0 18px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="40" valign="top" style="font-family:${T.font};font-size:14px;line-height:1.6;font-weight:500;color:${T.horizonBlue};">0${i + 1}</td>
    <td valign="top">${txt(esc(title), { size: 19, mb: text ? 4 : 0, weight: 500, lh: 1.3, ls: -0.3 })}${text ? txt(esc(text), { size: 15, color: T.muted, mb: 0, lh: 1.45 }) : ''}</td>
  </tr></table>
</td></tr></table>`).join(''), { pad: '0 40px 18px 40px' }),

  cta: (b) => section(`${button({ href: b.href, text: b.text, variant: b.variant || 'dark' })}
${b.secondary ? `<p style="margin:14px 0 0 0;font-family:${T.font};font-size:15px;line-height:1.4;"><a href="${b.secondary.href}" target="_blank" style="color:${T.horizonBlue};text-decoration:underline;">${esc(b.secondary.text)}</a></p>` : ''}`, { pad: '6px 40px 28px 40px' }),

  close: (b) => section(b.paras.map((h) => txt(h)).join(''), { pad: '4px 40px 8px 40px' }),

  // Email signature (11:257): E / Primary Black, Rhodium separator, name / title / email on Institutional White.
  signature: (b, A) => `<tr><td class="px" style="background:${T.surface};padding:8px 40px 32px 40px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:${T.paper};border-radius:4px;"><tr>
  <td valign="middle" style="padding:20px 18px 20px 16px;"><img src="${A('e-black.png')}" width="58" height="58" alt="UIE" style="display:block;width:58px;height:58px;border:0;"></td>
  <td valign="middle" style="padding:18px 0;"><div style="width:1px;height:96px;background:${T.rhodium};font-size:0;line-height:0;">&nbsp;</div></td>
  <td valign="middle" style="padding:18px 28px 18px 17px;">
    <p style="margin:0 0 6px 0;font-family:${T.font};font-size:20px;line-height:1.2;color:${T.black};">{{sender_name}}</p>
    <p style="margin:0 0 10px 0;font-family:${T.font};font-size:15px;line-height:1.3;color:${T.black};">{{sender_title}}, UIE Ltd</p>
    <p style="margin:0;font-family:${T.font};font-size:15px;line-height:1.3;"><a href="mailto:{{sender_email}}" style="color:${T.black};text-decoration:none;">{{sender_email}}</a></p>
  </td>
</tr></table>
</td></tr>`,
};

// Footer (100:162): wordmark, link directory, UIE Ltd, plus legal identification and opt-out.
function footer(links, A) {
  const col = (h, items) => `<td class="stack" valign="top" width="33%" style="padding:0 12px 16px 0;">
  <p style="margin:0 0 8px 0;font-family:${T.font};font-size:14px;font-weight:500;color:${T.content};">${h}</p>
  ${items.map(([t, u]) => `<p style="margin:0 0 6px 0;font-family:${T.font};font-size:14px;line-height:1.4;"><a href="${u}" target="_blank" style="color:${T.muted};text-decoration:none;">${t}</a></p>`).join('')}
</td>`;
  return `<tr><td class="px" style="background:${T.surface};padding:0 40px;"><div style="border-top:1px solid ${T.separator};font-size:0;line-height:0;">&nbsp;</div></td></tr>
<tr><td class="px" style="background:${T.surface};padding:24px 40px 8px 40px;">
  <a href="${links.home}" target="_blank"><img src="${A('wordmark-glass.png')}" width="80" height="31" alt="UIE" style="display:block;width:80px;height:31px;border:0;margin:0 0 20px 0;"></a>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    ${col('Platform', [['Qlaas DMI', links.dmi], ['Qlaas Services', links.services]])}
    ${col('Explore', [['Industries', links.industries], ['Solutions', links.solutions], ['Resources', links.resources]])}
    ${col('Company', [['About UIE', links.company], ['Discuss a pilot', links.pilot]])}
  </tr></table>
</td></tr>
<tr><td class="px" style="background:${T.surface};padding:4px 40px 36px 40px;">
  <p style="margin:0 0 8px 0;font-family:${T.font};font-size:12px;line-height:1.6;color:${T.muted};">UIE Ltd &middot; Registered in England and Wales, company number 17334450 &middot; 66 Paul Street, London, EC2A 4NA, United Kingdom &middot; <a href="${links.legal}" target="_blank" style="color:${T.muted};">Corporate information</a></p>
  <p style="margin:0;font-family:${T.font};font-size:12px;line-height:1.6;color:${T.muted};">I wrote to you because of your role at {{company}}. If this isn&#8217;t relevant, reply &#8220;no thanks&#8221; and I won&#8217;t write again.</p>
</td></tr>`;
}

export function layout({ subject, preheader, body, links, asset }) {
  const html = body.map((b) => blocks[b.type](b, asset)).join('\n');
  return `<!doctype html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><style>td,p,a,h1,h2{font-family:Arial,sans-serif!important;}</style><![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{color-scheme:light;supported-color-schemes:light;}
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;background:${T.paper};}
  a{color:${T.horizonBlue};}
  @media (max-width:620px){
    .wrap{width:100%!important;}
    .px{padding-left:22px!important;padding-right:22px!important;}
    .hero h1{font-size:30px!important;}
    .stack{display:block!important;width:100%!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${T.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${T.paper};">
  <tr><td align="center" style="padding:24px 10px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap" style="width:600px;max-width:600px;background:${T.surface};">
${html}
${footer(links, asset)}
    </table>
  </td></tr>
</table>
</body>
</html>
`;
}

// Plain-text alternative.
export function plain({ body }) {
  const strip = (h) => String(h).replace(/<br\s*\/?>/g, '\n').replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '$2 ($1)')
    .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"');
  const out = [];
  for (const b of body) {
    switch (b.type) {
      case 'hero': out.push(`${b.eyebrow.toUpperCase()}\n${b.headline}\n${strip(b.lead)}\n${b.cta.text}: ${b.cta.href}`); break;
      case 'letter': case 'close': out.push(...b.paras.map(strip)); break;
      case 'label': out.push(b.text.toUpperCase()); break;
      case 'heading': out.push(b.text); break;
      case 'serviceRows': out.push(b.rows.map((r) => `- ${r.title}${r.scope ? `: ${r.scope}` : ''}`).join('\n')); break;
      case 'photo': out.push(`${b.alt}: ${b.href}`); break;
      case 'qlaasCard': out.push(`${b.title} — ${b.text}\n${b.cta}: ${b.href}`); break;
      case 'trace': out.push(b.stages.join(' → ') + (b.evidence ? `\nEvidence: ${b.evidence.title}. ${b.evidence.text}` : '')); break;
      case 'stages': out.push(b.items.map(([t, x], i) => `0${i + 1} ${t}${x ? ` — ${x}` : ''}`).join('\n')); break;
      case 'cta': out.push(`${b.text}: ${b.href}` + (b.secondary ? `\n${b.secondary.text}: ${b.secondary.href}` : '')); break;
      case 'signature': out.push('{{sender_name}}\n{{sender_title}}, UIE Ltd\n{{sender_email}}'); break;
    }
  }
  out.push('--\nUIE Ltd · Registered in England and Wales, company number 17334450 · 66 Paul Street, London, EC2A 4NA, United Kingdom');
  out.push('I wrote to you because of your role at {{company}}. If this isn’t relevant, reply "no thanks" and I won’t write again.');
  return out.join('\n\n') + '\n';
}
