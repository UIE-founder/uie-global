# UIE outreach email templates

A four-touch outreach sequence for **uieglobal.com**, with variants for 17 prospect segments: 68 emails in total, each as HTML and plain text. Every link lands the prospect on the live page for their segment. Every "Discuss a pilot" link opens the site's enquiry form with their area already selected.

Every email is built from the Figma file **UIE — Holographic Blue**: the Horizon Arc wordmark, the orbital Earth hero, the homepage photography with its chamfered corner, the interface components and the designed email signature. See "Design source" below.

**Figma review file:** [UIE — Outreach email templates](https://www.figma.com/design/4s8GnNiLXZhUIitRlRtWXO). It has a cover with the send calendar and segment → page → form map, the component sheet, and one page per touch with all 17 segments (sample names filled in). Regenerate the import boards with `node figma-export.mjs`.

```bash
node compose.cjs                  # re-render image assets from the Figma layers (needs Playwright)
node build.mjs                    # rebuild dist/
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
- `dist/manifest.json` lists every email's subject, preheader, send date and links. All 749 links were checked against the live sitemap. The largest email is 17.6 KB of HTML, well under Gmail's 102 KB clipping limit.

## Merge fields

| Field | Notes |
|---|---|
| `{{first_name}}`, `{{company}}` | Required |
| `{{personal_line}}` | **One researched sentence on why you are writing to this person now.** Delete the line rather than send a generic one; replies depend on it. |
| `{{sender_name}}`, `{{sender_title}}`, `{{sender_email}}` | Fill the Figma email signature, for example "Christian Mason", "Founder", "founder@uieglobal.com" |

These use `{{double_brace}}` syntax, which Resend, Instantly, Lemlist, Apollo and most mail-merge tools accept. In Gmail, paste the `.txt` version and replace the fields by hand.

## Sending well

- Every touch is fully branded. Touches 2 and 4 are meant as replies in the touch 1 thread, so keep the touch 1 subject. If deliverability is a concern on a new domain, send the plain-text (`.txt`) version for the first week; it carries the same links.
- Send from a named person's mailbox, not `enquiries@`. Keep volume to roughly 30–50 new prospects per mailbox per day while the domain warms up.
- Check SPF, DKIM and DMARC for the sending domain before day one. The legal page says UIE mail runs on IONOS, with Resend for configured routes.
- Add a `List-Unsubscribe` header in the sending tool. The footer already identifies UIE Ltd, gives the company number and registered office, and offers a one-word opt-out. That is intended to meet UK PECR and GDPR expectations for B2B outreach, but it is not legal advice. Honour opt-outs immediately.

## Content rules

- Every quoted line and workflow name is copied from the page the email links to (`src/segments.mjs`), so the email never promises what the site does not show.
- Nothing claims customers, results or savings. The site's calculator figures are labelled as planning examples, so the emails point to the calculator rather than quoting numbers.
- Follow the site's tone: sentence case, en-GB spelling, "UIE" and "Qlaas" spelled as on the site.

## Design source

Two sources, reconciled. The Figma file **UIE — Holographic Blue** (`AZmpT0rrLBpJt4YTA0DBpv`) supplies the identity, imagery and components. The **live uieglobal.com** supplies the final geometry, type and colour, read from its computed styles on 25 Nov 2026. Where the two differ, the live site wins.

**Shapes (the site's `uie-polished` outline).** Every control, card and image on the site has 5 px corners and a chamfered bottom-right corner whose two joins are rounded:

| Element | Site geometry | In the email |
|---|---|---|
| Buttons (46 px) | r 5, cut 12.4, joins 5 | Live text cell plus a 20 × 46 right-edge image (`btn-*.png`) |
| Cards and panels | r 5, cut 22, joins 5 | Live content plus a 32 × 32 corner tile (`card-*.png`) |
| Photos | Asymmetric cut, 23% × 30%, 6 px soft joins | Built into `photo-*.jpg` |
| Hero | Cut 7.6vw (46 px at 600), soft joins | Built into `hero-orbit.jpg` |
| Masthead | Glass bar with a soft bottom-right cut | Built into `hero-masthead.png` |

Email clients strip CSS `clip-path`, so `compose.cjs` renders each edge or corner image from the same path generator (`polished()`) that reproduces the site's computed clip-path. Each strip comes in a variant for the background it sits on, so the cut always shows the right colour.

**Type and colour (live site).** Instrument Sans with a Helvetica/Arial fallback. Ink `#0c3041`, muted `#416371`, link `#155c80`, accent `#0c70ae`, porcelain `#f4f5f2`, hero `#102b42` / `#f4f7fa`, hero button `#e9f5fb` / `#13364b`, action `#e8f1f5` / `#15364a`.

**From Figma.** Horizon Arc master logo (21:24), orbital Earth hero (Blue Marble, orbit veil, city light trails), Service rows (39:41 / 39:46), Trace stages (39:52 / 39:55), Qlaas product cards and glyphs (100:87), implementation stage lines (40:121), the email signature (11:257) and the footer directory (100:162).

## Everything is a working link

Nothing in an email only looks interactive:

| Element | Goes to |
|---|---|
| Breadcrumbs (`UIE / Industries / Water & utilities`) | Each level's page |
| Workflow rows (with →) | The segment's page |
| Refund stages 01–06 | `/platform/walkthrough/#case`, where the stages are interactive |
| Pilot brief steps | `/resources/pilot-brief/` |
| Qlaas cards (icon, title, button) | `/platform/qlaas-dmi/` or `/platform/qlaas-services/` |
| Photos | The segment's page |
| "Discuss a pilot" | `/?pilot=<segment>`: opens the site's enquiry form with the segment selected, drafting to the right inbox |
| Signature | Mail link to the sender, and uieglobal.com |
| Footer | Platform / Explore / Company directory, enquiries@uieglobal.com, Corporate information |

Expand/collapse rows and tabs can't work across email clients, so rows show an arrow (→) instead of +/−. The `?pilot=` deep link was re-tested in a real browser on 25 Nov 2026: it opens the dialog with the right option selected, and Qlaas options draft to qlaas@. All 45 unique destinations return HTTP 200.

## How it behaves in each client

| Client | Result |
|---|---|
| Apple Mail (macOS, iOS) | Full design, Instrument Sans, background hero, rounded and chamfered shapes |
| Gmail (web and app) | Full design. The web font is not loaded (Helvetica/Arial fallback). The layout is fluid, so it fits phones even where Gmail strips `<style>`. |
| Outlook for Windows | VML hero background. Left corners are square (Outlook ignores `border-radius`); chamfers still render because they are images. Only the button text is clickable. |
| New Outlook / Windows Mail | No CSS hero image: the hero shows its solid `#102b42` with live text |
| Yahoo, Samsung, Thunderbird | Full layout; partial CSS degrades as above |
| Images blocked | All text, links and buttons stay readable and clickable. Buttons on light backgrounds keep their colour. The hero keeps its dark fill. Every image has alt text. |

Checked with caniemail data (`doiuse-email`) and by rendering four modes: full, `<style>` stripped, Outlook-like and images blocked. Before day one, send yourself a test in the client your prospects use most.

### Image hosting

Images are served from jsDelivr's CDN copy of this public repository, pinned to the commit that last changed `assets/`. An email that has already gone out therefore never changes. Two options:

- **Keep jsDelivr.** Nothing to do. The repository must stay public, or the images break.
- **Host on uieglobal.com** (recommended later). Copy `assets/*.png|jpg` to the site, for example `/email/assets/`, then build with `ASSET_BASE=https://uieglobal.com/email/assets node build.mjs`.

Every image has alt text. The hero keeps a solid `#102b42` background behind live text, so the email still reads with images blocked.

## Files

```
compose.cjs          renders assets/*.png|jpg from the Figma layers in assets/src/
build.mjs            renders everything into dist/
src/layout.mjs       email components (each mapped to its Figma node) and tokens
src/sequence.mjs     the four touches (copy lives here)
src/segments.mjs     17 segments with copy quoted from their landing pages
src/links.mjs        URL builder, live dialog options, UTM rules
dist/<segment>/      templates to load into the sending tool (.html + .txt)
dist/manifest.json   subjects, preheaders, send dates, links
dist/preview/        review gallery with sample values (do not send these)
figma-export.mjs     builds self-contained boards (figma/, not committed) for the Figma review file
```
