# UIE outreach email templates

A four-touch outreach sequence for **uieglobal.com**, with variants for 17 prospect segments: 68 emails in total, each as HTML and plain text. Every link lands the prospect on the live page for their segment. Every "Discuss a pilot" link opens the site's enquiry form with their area already selected.

```bash
node build.mjs                    # rebuild dist/ (no dependencies)
open dist/preview/index.html      # review gallery with sample names filled in
```

## Send calendar (campaign `pilot-2026-11`)

Day counts are business days (`START=2026-11-25`).

| Touch | Send | Thread | Purpose | Main link |
|---|---|---|---|---|
| 1 · Introduction | **Wed 25 Nov** | New | Segment workflows, ask for 20 minutes | Segment page + `/?pilot=<segment>` |
| 2 · Walkthrough | Mon 30 Nov | Reply to touch 1 | Show, don't tell: the refund case | `/platform/walkthrough/` |
| 3 · Pilot brief | Thu 3 Dec | New thread | Give something useful | `/resources/pilot-brief/`, `/resources/authority-boundaries/` |
| 4 · Close the file | Thu 10 Dec | Reply to touch 1 | Polite close, ask for a referral | `/?pilot=<segment>` |

Stop the sequence for a prospect as soon as they reply or click "Discuss a pilot".

## Segments and where they land

| Segment (`dist/<id>/`) | Landing page | Form preselect (`?pilot=`) |
|---|---|---|
| `water` | /industries/water-utilities/ | Water & utilities |
| `energy` | /industries/energy/ | Energy & renewables |
| `transport` | /industries/transport-logistics/ | Transport & logistics |
| `hospitality` | /industries/commercial-hospitality/ | Commercial & hospitality |
| `telecoms` | /industries/data-telecommunications/ | Data & telecommunications |
| `manufacturing` | /industries/manufacturing/ | Manufacturing & industrial |
| `public` | /industries/public-institutions/ | Public institutions |
| `defence` | /industries/defence/ | Defence & mission support |
| `customer-ops` | /solutions/customer-operations/ | Customer operations |
| `procurement` | /solutions/procurement/ | Procurement |
| `finance` | /solutions/finance-administration/ | Finance administration |
| `gov` | /solutions/government-services/ | Government services |
| `defence-logistics` | /solutions/defence-logistics-administration/ | Defence logistics administration |
| `tender` | /solutions/tender-administration/ | Tender administration |
| `sales-ops` | /solutions/sales-operations/ | Sales operations |
| `institutional` | /solutions/institutional-administration/ | Institutional administration |
| `dmi` (engineering / platform owners) | /platform/qlaas-dmi/ | Qlaas DMI → drafts to qlaas@uieglobal.com |

Choose an **industry** segment when you know the prospect's sector. Choose a **function** segment when you know their job (for example a head of accounts payable in any sector).

## How the links work (checked against the live site, 24 Nov 2026)

- The site has **no form endpoint or booking link**. Its only enquiry route is the "Discuss a pilot" dialog on the home page. The dialog drafts an email to `enquiries@uieglobal.com`, or to `qlaas@uieglobal.com` for Qlaas options.
- `https://uieglobal.com/?pilot=<option>` opens that dialog with the option preselected (`site.js`). `#enquiry`, `#contact` and `?service=` do nothing.
- The value must match a dialog option exactly. `src/links.mjs` holds the live option list, and the build fails if a segment uses anything else.
- Links carry `utm_source=outreach&utm_medium=email&utm_campaign=pilot-2026-11&utm_content=<touch>-<segment>`. The site runs no analytics today, so these only matter if analytics are added later. `UTM=0 node build.mjs` removes them.
- `dist/manifest.json` lists every email's subject, preheader, send date and links. All 221 links were checked against the live sitemap.

## Merge fields

| Field | Notes |
|---|---|
| `{{first_name}}`, `{{company}}` | Required |
| `{{personal_line}}` | **One researched sentence on why you are writing to this person now.** Delete the line rather than send a generic one; replies depend on it. |
| `{{sender_name}}`, `{{sender_title}}` | For example "Christian", "Founder" |

These use `{{double_brace}}` syntax, which Resend, Instantly, Lemlist, Apollo and most mail-merge tools accept. In Gmail, paste the `.txt` version and replace the fields by hand.

## Sending well

- **Touch 1 is the only branded email.** Touches 2 and 4 are in-thread replies and render without the card, so they read like a person following up. Plain text (`.txt`) is a good choice for touch 1 too, if deliverability is a concern on a new domain.
- Send from a named person's mailbox, not `enquiries@`. Keep volume to roughly 30–50 new prospects per mailbox per day while the domain warms up.
- Check SPF, DKIM and DMARC for the sending domain before day one. The legal page says UIE mail runs on IONOS, with Resend for configured routes.
- Add a `List-Unsubscribe` header in the sending tool. The footer already identifies UIE Ltd, gives the company number and registered office, and offers a one-word opt-out. That is intended to meet UK PECR and GDPR expectations for B2B outreach, but it is not legal advice. Honour opt-outs immediately.

## Content rules

- Every quoted line and workflow name is copied from the page the email links to (`src/segments.mjs`), so the email never promises what the site does not show.
- Nothing claims customers, results or savings. The site's calculator figures are labelled as planning examples, so the emails point to the calculator rather than quoting numbers.
- Follow the site's tone: sentence case, en-GB spelling, "UIE" and "Qlaas" spelled as on the site.

## Design source

The colours, type and radii are taken from the production stylesheets (`front.css`, `glass.css`, `editorial.css`, `workbench.css`; values in `src/layout.mjs`):

- Ink `#0c3041`, muted text `#416371`, accent blue `#0c70ae`, link `#155c80`, lines `#cbdbe3`, page `#fcfdfd`, ice `#edf5f8`.
- Instrument Sans with an Arial fallback.
- Pane radius 14 px, control radius 8 px.
- The primary button and the Request / Authority / Evidence pane follow the site's own components.

Dark mode uses the site's dark hero tokens (`#102b42` / `#f4f7fa` / `#d4e4ed`). Outlook gets VML buttons.

**Figma:** the Figma file for the UIE Global website components could not be located from this session. No UIE library is published to the Figma team, and the Figma files referenced in the repositories belong to Qlaas. Once the file link is known, compare `src/layout.mjs` tokens against it and update them in one place.

## Files

```
build.mjs            renders everything into dist/
src/layout.mjs       email shell, components and design tokens
src/sequence.mjs     the four touches (copy lives here)
src/segments.mjs     17 segments with copy quoted from their landing pages
src/links.mjs        URL builder, live dialog options, UTM rules
dist/<segment>/      templates to load into the sending tool (.html + .txt)
dist/manifest.json   subjects, preheaders, send dates, links
dist/preview/        review gallery with sample values (do not send these)
```
