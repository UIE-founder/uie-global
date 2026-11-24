// The four-touch outreach sequence. Each touch is a function of a segment and returns
// { subject, preheader, body, thread } where body is a list of layout blocks.
//
// Merge fields left for the sending tool: {{first_name}}, {{company}}, {{personal_line}},
// {{sender_name}}, {{sender_title}}. See ../README.md.

import { url } from './links.mjs';

const HOME_LEAD = 'At UIE we implement Qlaas, which connects AI agents to the systems your teams already use. You decide what each agent can do, which decisions need approval and how to check the result.';

const opener = { type: 'para', html: 'Hi {{first_name}},' };
const personal = { type: 'para', html: '{{personal_line}}' };
const reply = (q) => ({ type: 'para', html: q });

export const TOUCHES = [
  {
    id: '1-intro',
    day: 0,
    label: 'Touch 1 · Introduction',
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t1-${s.id}`, ...extra });
      const pilot = { href: L('/', { pilot: s.pilot }), text: 'Discuss a pilot' };

      if (s.kind === 'industry') return {
        subject: `${cap(s.topic)} at {{company}}`,
        preheader: `${s.workflows.join(', ')}: where a ${s.name.toLowerCase()} pilot could start.`,
        body: [
          opener, personal,
          { type: 'para', html: HOME_LEAD },
          { type: 'para', html: `For ${amp(s.name.toLowerCase())} teams, these are the three workflows we would look at first:` },
          { type: 'pane', title: `${s.name}: where a pilot could start`, rows: s.workflows.map((w, i) => [`0${i + 1}`, w]) },
          { type: 'para', html: `Our ${amp(s.name.toLowerCase())} page puts it like this: “${s.summary} ${s.authority}” For each workflow it sets out the request, the work, who keeps authority and the evidence that closes the case. There is also a calculator for putting a value on the time at your own case volumes.` },
          { type: 'cta', href: L(s.path), text: `See the ${s.name.toLowerCase()} workflows`, secondary: pilot },
          reply('Would it be worth 20 minutes to pick one recurring case at {{company}} and see whether it fits?'),
          { type: 'signoff' },
        ],
      };

      if (s.kind === 'function') return {
        subject: `${cap(s.topic)} at {{company}}`,
        preheader: `${s.work}`,
        body: [
          opener, personal,
          { type: 'para', html: HOME_LEAD },
          { type: 'para', html: `One workflow we would pilot with ${amp(s.name.toLowerCase())} teams:` },
          { type: 'pane', title: s.name, rows: [['Delegated', s.work], ['Stays with you', s.boundary], ['Exception', s.exception]] },
          { type: 'para', html: 'The page shows how that exception is handled and which records prove the case is complete.' },
          { type: 'cta', href: L(s.path), text: `See the ${s.name.toLowerCase()} workflow`, secondary: pilot },
          reply('Is this something your team handles enough of to be worth a 20-minute conversation?'),
          { type: 'signoff' },
        ],
      };

      // technical
      return {
        subject: 'Agent access to {{company}}’s systems',
        preheader: 'A structured endpoint beside your existing systems, with explicit authority and checkable results.',
        body: [
          opener, personal,
          { type: 'para', html: 'Qlaas DMI is a structured endpoint beside your existing systems. It gives authorised agents a direct route to information, actions and the evidence of what happened.' },
          { type: 'pane', title: 'How an action is exposed', rows: s.steps.map((w, i) => [`0${i + 1}`, w]) },
          { type: 'para', html: 'You define the actions an agent can request, the records it can access and when its permission expires. The page links the live MCP endpoint, the communications OpenAPI description and the discovery document.' },
          { type: 'cta', href: L(s.path), text: 'Explore Qlaas DMI', secondary: pilot },
          reply('If you are already connecting agents to internal systems, would a short technical call be useful?'),
          { type: 'signoff' },
        ],
      };
    },
  },

  {
    id: '2-walkthrough',
    day: 3,
    label: 'Touch 2 · Walkthrough (reply in thread)',
    thread: true,
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t2-${s.id}`, ...extra });
      return {
        subject: 'Re: (keep the Touch 1 subject)',
        preheader: 'Follow a refund through an illustrative service, including its approval boundary.',
        body: [
          opener,
          { type: 'para', html: 'A quicker way to see how this works than another email: the interactive walkthrough follows a refund through an illustrative Qlaas service.' },
          { type: 'pane', title: 'The refund case', rows: [
            ['Within policy', 'Receive · Verify · Authorise · Execute · Reconcile · Complete'],
            ['Exception', 'Delegated limit exceeded, so the case waits for human authorisation'],
            ['Closes when', 'Provider and ledger agree, and the customer is notified'],
          ] },
          { type: 'para', html: `It takes a couple of minutes, and the same pattern applies to ${s.kind === 'technical' ? 'any action you expose through DMI' : `${s.topic} at {{company}}`}.` },
          { type: 'cta', href: L('/platform/walkthrough/'), text: 'Open the walkthrough', secondary: { href: L('/', { pilot: s.pilot }), text: 'Discuss a pilot' } },
          { type: 'signoff' },
        ],
      };
    },
  },

  {
    id: '3-pilot-brief',
    day: 6,
    label: 'Touch 3 · Pilot brief (new thread)',
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t3-${s.id}`, ...extra });
      return {
        subject: 'A pilot brief your operator can test',
        preheader: 'One recurring case, a baseline, a completion test and a named owner.',
        body: [
          opener,
          { type: 'para', html: 'If an AI pilot is on the agenda at {{company}}, the hard part is usually agreeing what “done” means before anything is built. We wrote a short guide for that.' },
          { type: 'pane', title: 'Write a brief that your operator can test', rows: [
            ['01', 'Choose a recurring case'],
            ['02', 'Record the baseline'],
            ['03', 'Agree a completion test'],
            ['04', 'Name an owner and a stop condition'],
          ] },
          { type: 'cta', href: L('/resources/pilot-brief/'), text: 'Read the pilot brief guide' },
          { type: 'link', href: L('/resources/authority-boundaries/'), text: 'Write down what an agent may do', after: '— the companion guide on authority boundaries.' },
          reply(`If you have a ${s.kind === 'technical' ? 'candidate action' : s.topic.replace(/s$/, '') + ' case'} in mind, send it over and I’ll sketch what a brief for it would look like.`),
          { type: 'signoff' },
        ],
      };
    },
  },

  {
    id: '4-close',
    day: 11,
    label: 'Touch 4 · Close the file (reply in thread)',
    thread: true,
    build(s, c) {
      const L = (path, extra = {}) => url(path, { campaign: c, content: `t4-${s.id}`, ...extra });
      return {
        subject: 'Re: (keep the Touch 1 subject)',
        preheader: 'Last note from me.',
        body: [
          opener,
          { type: 'para', html: 'I haven’t heard back, so I’ll assume the timing isn’t right and close this on my side.' },
          { type: 'para', html: `If that changes, the quickest route is the pilot enquiry on our site. It opens with ${amp(s.name)} already selected.` },
          { type: 'cta', href: L('/', { pilot: s.pilot }), text: 'Discuss a pilot' },
          reply('Or just reply with the name of whoever owns this at {{company}}, and I’ll write to them instead.'),
          { type: 'signoff' },
        ],
      };
    },
  },
];

function amp(s) { return s.replace(/&/g, '&amp;'); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
