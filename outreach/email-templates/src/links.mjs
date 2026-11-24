// Every link in every template is built here, so routing stays in one place.
//
// Routing facts (verified on the live deployment, 24 Nov 2026):
// - The only enquiry form is the dialog on the home page. `/?pilot=<option>` opens it with
//   that option preselected (site.js). Hashes and ?service= do nothing.
// - The value must match an option's text exactly; anything else falls back to
//   "General enquiry". PILOT_OPTIONS below is the full list from the live <select>.
// - Options starting with "Qlaas" route the email draft to qlaas@uieglobal.com; all others
//   to enquiries@uieglobal.com (assets/ursa-routing.js).

export const ORIGIN = 'https://uieglobal.com';

export const PILOT_OPTIONS = [
  'General enquiry', 'Qlaas platform', 'Qlaas DMI', 'Qlaas Services',
  'Customer operations', 'Sales operations', 'Finance administration', 'Procurement',
  'Tender administration', 'Government services', 'Institutional administration',
  'Defence logistics administration', 'Industries', 'Commercial operations',
  'Infrastructure operators', 'Water & utilities', 'Energy & renewables',
  'Data & telecommunications', 'Defence & mission support', 'Transport & logistics',
  'Manufacturing & industrial', 'Commercial & hospitality', 'Public institutions',
  'UIE Systems', 'UIE Trade', 'UIExchange', 'UIE Academy', 'UIE Visuals',
];

// UTM tagging. The site currently runs no third-party analytics (its legal page says so),
// so these are inert today; they let any future analytics or server logs attribute visits
// without changing the emails. Set UTM=0 when building to strip them.
const UTM = process.env.UTM !== '0';

export function url(path, { campaign, content, pilot } = {}) {
  if (pilot && !PILOT_OPTIONS.includes(pilot)) {
    throw new Error(`"${pilot}" is not an option in the live enquiry dialog; it would fall back to General enquiry.`);
  }
  const u = new URL(path, ORIGIN);
  if (pilot) u.searchParams.set('pilot', pilot);
  if (UTM && campaign) {
    u.searchParams.set('utm_source', 'outreach');
    u.searchParams.set('utm_medium', 'email');
    u.searchParams.set('utm_campaign', campaign);
    if (content) u.searchParams.set('utm_content', content);
  }
  // URLSearchParams encodes spaces as '+'. site.js reads with URLSearchParams, which decodes
  // '+' correctly, but %20 is safer across mail-client link rewriters.
  return u.toString().replace(/\+/g, '%20');
}

// Direct email fallback for prospects who prefer not to click through (same inbox the
// dialog would draft to).
export function mailto(pilot) {
  const qlaas = /^Qlaas\b/i.test(pilot);
  const to = qlaas ? 'qlaas@uieglobal.com' : 'enquiries@uieglobal.com';
  const subject = `Pilot enquiry: ${pilot}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}`;
}
