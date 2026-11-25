// The four-touch outreach sequence. Each touch takes a segment and returns
// { subject, preheader, body, thread }, where body is a list of layout blocks (src/layout.mjs).
//
// Copy rules: headlines, workflow names and quoted lines come from the live page each email
// links to (src/segments.mjs). No customers, results or savings are claimed.
//
// Merge fields left for the sending tool: {{first_name}}, {{company}}, {{personal_line}},
// {{sender_name}}, {{sender_title}}, {{sender_email}}.

import { url } from './links.mjs';
import { PHOTOS } from './segments.mjs';

const amp = (s) => s.replace(/&/g, '&amp;');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const HOME_LEAD = 'UIE connects AI agents to the systems your teams already use. You decide what each agent can do, which decisions need approval and how to check the result.';
const STAGES = ['Receive', 'Verify', 'Authorise', 'Execute', 'Reconcile', 'Complete'];

const signoff = { type: 'signature' };

export const TOUCHES = [
  {
    id: '1-intro',
    day: 0,
    label: 'Touch 1 · Introduction',
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t1-${s.id}`, ...extra });
      const pilot = L('/', { pilot: s.pilot });
      const photo = PHOTOS[s.photo];

      if (s.kind === 'industry') return {
        subject: `${cap(s.topic)} at {{company}}`,
        preheader: `${s.workflows.join(' · ')}: where a ${s.name.toLowerCase()} pilot could start.`,
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Industries', L('/industries/')], [s.name, L(s.path)]], headline: s.headline, lead: amp(`${s.summary} ${s.authority}`), cta: { href: L(s.path), text: `Explore ${s.name.toLowerCase()}` } },
          { type: 'letter', paras: ['Hi {{first_name}},', '{{personal_line}}', `At UIE we implement Qlaas, which connects AI agents to the systems your teams already use. You decide what each agent can do, which decisions need approval and how to check the result. For ${amp(s.name.toLowerCase())} teams, these are the three workflows we would look at first:`] },
          { type: 'serviceRows', rows: s.workflows.map((w, i) => (i === 0 ? { title: w, href: L(s.path), open: true, scopeLabel: 'On the page', scope: 'The request, the work, who keeps authority and the evidence that closes the case.' } : { title: w, href: L(s.path) })) },
          { type: 'photo', ...photo, href: L(s.path) },
          { type: 'close', paras: ['The page also has a calculator for putting a value on the time at your own case volumes.', 'Would it be worth 20 minutes to pick one recurring case at {{company}} and see whether it fits?'] },
          { type: 'cta', href: pilot, text: 'Discuss a pilot', secondary: { href: L(s.path), text: `See the ${s.name.toLowerCase()} workflows` } },
          signoff,
        ],
      };

      if (s.kind === 'function') return {
        subject: `${cap(s.topic)} at {{company}}`,
        preheader: s.work,
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Solutions', L('/solutions/')], [s.name, L(s.path)]], headline: s.headline, lead: amp(s.work), cta: { href: L(s.path), text: 'See the workflow' } },
          { type: 'letter', paras: ['Hi {{first_name}},', '{{personal_line}}', `At UIE we implement Qlaas, which connects AI agents to the systems your teams already use. Here is one workflow we would pilot with ${amp(s.name.toLowerCase())} teams, and where the line sits between what is delegated and what stays with you:`] },
          { type: 'serviceRows', rows: [
            { title: s.name, href: L(s.path), open: true, scopeLabel: 'Delegated work', scope: s.work },
            { title: 'Stays with you', href: L(s.path), scopeLabel: 'Authority boundary', scope: s.boundary },
            { title: 'When it goes off-script', href: L(s.path), scopeLabel: 'Illustrative exception', scope: s.exception },
          ] },
          { type: 'photo', ...photo, href: L(s.path) },
          { type: 'close', paras: ['The page shows how that exception is handled and which records prove the case is complete.', 'Is this something your team handles enough of to be worth a 20-minute conversation?'] },
          { type: 'cta', href: pilot, text: 'Discuss a pilot', secondary: { href: L(s.path), text: `See the ${s.name.toLowerCase()} workflow` } },
          signoff,
        ],
      };

      // technical (Qlaas DMI)
      return {
        subject: 'Agent access to {{company}}’s systems',
        preheader: 'A structured endpoint beside your existing systems, with explicit authority and checkable results.',
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Platform', L('/platform/')], ['Qlaas DMI', L(s.path)]], headline: s.headline, lead: 'A structured endpoint beside your existing systems. Give authorised agents a direct route to information, actions and the evidence of what happened.', cta: { href: L(s.path), text: 'Explore Qlaas DMI' } },
          { type: 'letter', paras: ['Hi {{first_name}},', '{{personal_line}}', 'If {{company}} is starting to connect agents to internal systems, the two Qlaas layers below are how we do it: one defines what an agent may touch, the other coordinates the work and checks the result.'] },
          { type: 'qlaasCard', tone: 'dmi', glyph: 'glyph-endpoint.png', label: 'Communications infrastructure', title: 'Qlaas DMI', text: 'Define the actions an agent can request, the records it can access and when its permission expires.', cta: 'Explore DMI', href: L('/platform/qlaas-dmi/') },
          { type: 'qlaasCard', tone: 'services', glyph: 'glyph-orchestration.png', label: 'Service as software', title: 'Qlaas Services', text: 'Route requests between people and systems. Track approvals and match the result to the original case.', cta: 'Explore Services', href: L('/platform/qlaas-services/') },
          { type: 'close', paras: [`The DMI page links the live MCP endpoint, the communications OpenAPI description and the discovery document, if you want to <a href="${L('/platform/qlaas-dmi/#agent-access')}" target="_blank" style="color:#155c80;">look under the bonnet</a> first.`, 'Would a short technical call be useful?'] },
          { type: 'cta', href: pilot, text: 'Discuss a pilot' },
          signoff,
        ],
      };
    },
  },

  {
    id: '2-walkthrough',
    day: 3,
    label: 'Touch 2 · Walkthrough',
    thread: true,
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t2-${s.id}`, ...extra });
      return {
        subject: 'Re: (keep the Touch 1 subject)',
        preheader: 'Follow a refund through an illustrative service, including its approval boundary.',
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Platform', L('/platform/')], ['Walkthrough', L('/platform/walkthrough/')]], headline: 'Inside a Qlaas service.', lead: 'Follow a refund through an illustrative service, including its approval boundary and the evidence needed to close the case.', cta: { href: L('/platform/walkthrough/#case'), text: 'Open the refund case' } },
          { type: 'letter', paras: ['Hi {{first_name}},', 'A quicker way to see how this works than another email: the interactive walkthrough follows one refund from request to receipt.'] },
          { type: 'trace', href: L('/platform/walkthrough/#case'), stages: STAGES, active: 'Reconcile', evidence: { title: 'Provider and ledger agree', text: 'Within policy the case runs through all six stages. Above the delegated limit it stops and waits for human authorisation.' } },
          { type: 'close', paras: [`It takes a couple of minutes, and the same pattern applies to ${s.kind === 'technical' ? 'any action you expose through DMI' : `${s.topic} at {{company}}`}.`] },
          { type: 'cta', href: L('/platform/walkthrough/#case'), text: 'Open the walkthrough', secondary: { href: L('/', { pilot: s.pilot }), text: 'Discuss a pilot' } },
          signoff,
        ],
      };
    },
  },

  {
    id: '3-pilot-brief',
    day: 6,
    label: 'Touch 3 · Pilot brief',
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t3-${s.id}`, ...extra });
      return {
        subject: 'A pilot brief your operator can test',
        preheader: 'One recurring case, a baseline, a completion test and a named owner.',
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Resources', L('/resources/')], ['Pilot brief', L('/resources/pilot-brief/')]], headline: 'Write a brief that your operator can test.', lead: 'Use one recurring case to describe the outcome, the responsible person and the records a pilot can use.', cta: { href: L('/resources/pilot-brief/'), text: 'Read the guide' } },
          { type: 'letter', paras: ['Hi {{first_name}},', 'If an AI pilot is on the agenda at {{company}}, the hard part is usually agreeing what “done” means before anything is built. Our guide breaks it into four steps:'] },
          { type: 'stages', href: L('/resources/pilot-brief/'), items: [['Choose a recurring case'], ['Record the baseline'], ['Agree a completion test'], ['Name an owner and a stop condition']] },
          { type: 'close', paras: [`The companion guide, <a href="${L('/resources/authority-boundaries/')}" target="_blank" style="color:#155c80;">Write down what an agent may do</a>, covers the authority boundary. If you have a ${s.kind === 'technical' ? 'candidate action' : s.topic.replace(/s$/, '') + ' case'} in mind, send it over and I’ll sketch what a brief for it would look like.`] },
          { type: 'cta', href: L('/resources/pilot-brief/'), text: 'Read the pilot brief guide', secondary: { href: L('/', { pilot: s.pilot }), text: 'Discuss a pilot' } },
          signoff,
        ],
      };
    },
  },

  {
    id: '4-close',
    day: 11,
    label: 'Touch 4 · Close the file',
    thread: true,
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t4-${s.id}`, ...extra });
      const pilot = L('/', { pilot: s.pilot });
      return {
        subject: 'Re: (keep the Touch 1 subject)',
        preheader: 'Last note from me.',
        body: [
          { type: 'hero', crumbs: [['UIE', L('/')], ['Discuss a pilot', pilot]], headline: 'Bring one case to the table', lead: 'Choose a recurring request. Bring an example, the systems it passes through and the record that shows it is complete.', cta: { href: pilot, text: 'Discuss a pilot' } },
          { type: 'letter', paras: ['Hi {{first_name}},', 'I haven’t heard back, so I’ll assume the timing isn’t right and close this on my side.', `If that changes, the quickest route is the pilot enquiry on our site. It opens with ${amp(s.name)} already selected.`, 'Or just reply with the name of whoever owns this at {{company}}, and I’ll write to them instead.'] },
          signoff,
        ],
      };
    },
  },
];
