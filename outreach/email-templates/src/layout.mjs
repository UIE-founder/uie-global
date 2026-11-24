// Email layout for UIE outreach.
// Tokens are taken from the live uieglobal.com stylesheets (front.css, glass.css,
// editorial.css, workbench.css) on 24 Nov 2026. See ../README.md, "Design source".
//
// Email-client rules followed here: table layout, 600px column, inline styles on
// every element that matters, no web fonts required (Instrument Sans where the
// client supports it, Arial otherwise), no images required to read or act,
// bulletproof buttons, dark-mode overrides for clients that honour them.

export const T = {
  page: '#fcfdfd',      // front.css page background
  band: '#edf5f8',      // --ice
  paper: '#edf3f5',     // --hero-paper (light)
  ink: '#0c3041',       // --ink: primary text and primary button
  muted: '#416371',     // --muted: secondary text
  tertiary: '#577081',  // tertiary text
  blue: '#0c70ae',      // --blue: label / accent
  link: '#155c80',      // .quiet-link
  line: '#cbdbe3',      // --wb-line
  rule: '#bacbd3',      // --editorial-rule
  darkPaper: '#102b42', // --hero-paper (dark)
  darkInk: '#f4f7fa',   // --hero-ink (dark)
  darkBody: '#d4e4ed',  // --hero-body (dark)
  font: "'Instrument Sans', Arial, Helvetica, sans-serif",
  pane: 14,             // --pane-radius (glass.css)
  control: 8,           // --control-radius (glass.css)
};

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Merge fields ({{first_name}} etc.) pass through untouched: braces are not escaped.

const p = (html, { size = 16, color = T.ink, mb = 16, weight = 400 } = {}) =>
  `<p style="margin:0 0 ${mb}px 0;font-family:${T.font};font-size:${size}px;line-height:1.6;color:${color};font-weight:${weight};">${html}</p>`;

export const blocks = {
  para: (b) => p(b.html),

  label: (b) => p(esc(b.text), { size: 14, color: T.blue, mb: 10, weight: 600 }),

  heading: (b) =>
    `<h2 class="ink" style="margin:0 0 14px 0;font-family:${T.font};font-size:26px;line-height:1.15;letter-spacing:-0.6px;font-weight:500;color:${T.ink};">${esc(b.text)}</h2>`,

  // The site's recurring case structure (Request / Work / Authority / Evidence),
  // rendered as a pane. Rows are [label, text] pairs.
  pane: (b) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pane" style="background:${T.paper};border:1px solid ${T.line};border-radius:${T.pane}px;margin:6px 0 22px 0;">
  <tr><td style="padding:20px 22px 6px 22px;">
    ${b.title ? p(esc(b.title), { size: 13, color: T.blue, mb: 12, weight: 600 }) : ''}
    ${b.rows.map(([k, v], i) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${i ? `border-top:1px solid ${T.line};` : ''}">
      <tr>
        <td valign="top" width="96" class="muted" style="padding:10px 12px 12px 0;font-family:${T.font};font-size:13px;line-height:1.5;color:${T.muted};font-weight:600;">${esc(k)}</td>
        <td valign="top" class="ink" style="padding:10px 0 12px 0;font-family:${T.font};font-size:15px;line-height:1.5;color:${T.ink};">${esc(v)}</td>
      </tr>
    </table>`).join('')}
  </td></tr>
</table>`,

  // Bulletproof primary button (front.css .primary) + optional quiet link beside it.
  cta: (b) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 ${b.secondary ? 6 : 24}px 0;">
  <tr><td class="btn" bgcolor="${T.ink}" style="border-radius:${T.control}px;background:${T.ink};">
    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${b.href}" style="height:46px;v-text-anchor:middle;width:${Math.max(200, b.text.length * 9 + 46)}px;" arcsize="18%" stroke="f" fillcolor="${T.ink}"><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${esc(b.text)}</center></v:roundrect><![endif]-->
    <!--[if !mso]><!--><a href="${b.href}" target="_blank" style="display:inline-block;padding:13px 23px;font-family:${T.font};font-size:16px;line-height:20px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:${T.control}px;">${esc(b.text)}</a><!--<![endif]-->
  </td></tr>
</table>
${b.secondary ? p(`<a href="${b.secondary.href}" target="_blank" class="link" style="color:${T.link};text-decoration:underline;">${esc(b.secondary.text)}</a>`, { size: 15, mb: 24 }) : ''}`,

  link: (b) => p(`<a href="${b.href}" target="_blank" class="link" style="color:${T.link};text-decoration:underline;">${esc(b.text)}</a>${b.after ? ' ' + b.after : ''}`, { size: 15 }),

  list: (b) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;">
  ${b.items.map((it) => `<tr><td valign="top" style="padding:0 10px 8px 0;font-family:${T.font};font-size:16px;line-height:1.6;color:${T.blue};">&#8212;</td><td class="ink" style="padding:0 0 8px 0;font-family:${T.font};font-size:16px;line-height:1.6;color:${T.ink};">${it}</td></tr>`).join('')}
</table>`,

  signoff: () => `
${p('{{sender_name}}<br><span class="muted" style="color:' + T.muted + ';">{{sender_title}}, UIE</span>', { mb: 0 })}`,
};

export function layout({ subject, preheader, body, optout = true, minimal = false }) {
  const html = body.map((b) => blocks[b.type](b)).join('\n');
  return `<!doctype html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${esc(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap');
  body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;}
  a{color:${T.link};}
  @media (max-width:620px){ .wrap{width:100%!important;} .gutter{padding-left:20px!important;padding-right:20px!important;} }
  @media (prefers-color-scheme:dark){
    body,.bg{background:${T.darkPaper}!important;}
    .card{background:#0b2133!important;border-color:#24465c!important;}
    .pane{background:#12324a!important;border-color:#24465c!important;}
    .ink,.ink p,.ink h2{color:${T.darkInk}!important;}
    p,h2,td{color:${T.darkInk}!important;}
    .muted{color:${T.darkBody}!important;}
    .link{color:#bedaff!important;}
    .btn{background:#e8f1f5!important;} .btn a{color:#15364a!important;}
    .bg table{border-color:#24465c!important;}
  }
  [data-ogsc] p,[data-ogsc] h2,[data-ogsc] td{color:${T.darkInk}!important;}
</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${minimal ? T.page : T.band};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background:${minimal ? T.page : T.band};">
  <tr><td align="${minimal ? 'left' : 'center'}" style="padding:${minimal ? '8px 0' : '28px 12px'};">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="wrap${minimal ? '' : ' card'}" style="width:600px;max-width:600px;background:${T.page};${minimal ? '' : `border:1px solid ${T.line};border-radius:${T.pane}px;`}">
${minimal ? '' : `      <tr><td class="gutter" style="padding:26px 40px 0 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${T.line};">
          <tr>
            <td style="padding:0 0 16px 0;font-family:${T.font};font-size:19px;letter-spacing:-0.4px;font-weight:600;color:${T.ink};" class="ink"><a href="{{site_home}}" target="_blank" style="color:inherit;text-decoration:none;">UIE</a></td>
            <td align="right" class="muted" style="padding:0 0 16px 0;font-family:${T.font};font-size:13px;color:${T.muted};">AI infrastructure for service delivery</td>
          </tr>
        </table>
      </td></tr>
`}      <tr><td class="gutter ink" style="padding:28px 40px 12px 40px;">
${html}
      </td></tr>
      <tr><td class="gutter" style="padding:0 40px 28px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${T.line};">
          <tr><td class="muted" style="padding:16px 0 0 0;font-family:${T.font};font-size:12px;line-height:1.6;color:${T.tertiary};">
            UIE Ltd &middot; Registered in England and Wales, company number 17334450 &middot; 66 Paul Street, London, EC2A 4NA, United Kingdom &middot; <a href="{{site_legal}}" target="_blank" class="link" style="color:${T.tertiary};">Corporate information</a>${optout ? `<br>I wrote to you because of your role at {{company}}. If this isn&#8217;t relevant, reply &#8220;no thanks&#8221; and I won&#8217;t write again.` : ''}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
`;
}

// Plain-text rendering of the same body (multipart alternative / plain sends).
export function plain({ body, optout = true }) {
  const strip = (h) => h.replace(/<br\s*\/?>/g, '\n').replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '$2 ($1)')
    .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"').replace(/&middot;/g, '·');
  const out = body.map((b) => {
    switch (b.type) {
      case 'para': return strip(b.html);
      case 'label': return b.text.toUpperCase();
      case 'heading': return b.text;
      case 'pane': return (b.title ? b.title + '\n' : '') + b.rows.map(([k, v]) => `  ${k}: ${v}`).join('\n');
      case 'cta': return `${b.text}: ${b.href}` + (b.secondary ? `\n${b.secondary.text}: ${b.secondary.href}` : '');
      case 'link': return `${b.text}: ${b.href}${b.after ? ' ' + strip(b.after) : ''}`;
      case 'list': return b.items.map((i) => `- ${strip(i)}`).join('\n');
      case 'signoff': return '{{sender_name}}\n{{sender_title}}, UIE';
      default: return '';
    }
  });
  out.push('--\nUIE Ltd · Registered in England and Wales, company number 17334450 · 66 Paul Street, London, EC2A 4NA, United Kingdom');
  if (optout) out.push('I wrote to you because of your role at {{company}}. If this isn’t relevant, reply "no thanks" and I won’t write again.');
  return out.join('\n\n') + '\n';
}
