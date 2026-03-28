# Phase 41: Lead Magnet & Mid-Funnel Asset - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 41-lead-magnet-mid-funnel-asset
**Areas discussed:** Page layout & checklist presentation, Form gate behavior, Post-submit flow, Traffic entry points

---

## Page Layout & Checklist Presentation

### Checklist presentation style

| Option | Description | Selected |
|--------|-------------|----------|
| Teaser + gate | Show 3–4 items, blur/lock the rest. Communicates value before asking for email. | ✓ |
| Fully hidden | Hero only, form first, reveal after submit. Low conversion risk. | |
| Full checklist visible | All 10 items shown, form is optional PDF CTA. No hard gate. | |

**User's choice:** Teaser + gate (recommended)

---

### Visual treatment for locked items

| Option | Description | Selected |
|--------|-------------|----------|
| Blurred rows + lock icon | CSS blur on items 4–10 with lock icon overlay. Standard SaaS pattern. | ✓ |
| Replaced by CTA block | After item 3, a card replaces remaining items. Cleaner but loses psychological nudge. | |
| Numbered placeholders | Items 4–10 as empty numbered rows with lock icon. Shows quantity without content. | |

**User's choice:** Blurred rows + lock icon (recommended)

---

## Form Gate Behavior

### Post-submit action

| Option | Description | Selected |
|--------|-------------|----------|
| Inline reveal | Form disappears, blurred items animate in on same page. No redirect. Events fire via JS. | ✓ |
| Redirect to /sjekkliste/takk | Formspree redirects to thank-you page. Matches b2b flow. | |
| Email delivery only | Confirmation message shown, checklist delivered via email. Requires automation (out of scope). | |

**User's choice:** Inline reveal (recommended)

---

### Confirmation email

| Option | Description | Selected |
|--------|-------------|----------|
| No — capture to Formspree inbox only | Simple. No email automation needed. | ✓ |
| Yes — Formspree reply-to confirmation | Sends plain-text confirmation email. Minimal setup. | |

**User's choice:** No email — just capture to Formspree inbox (recommended)

---

## Post-Submit Flow

### Post-reveal CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Checklist + CTA to /kontakt | Full checklist unlocks + CTA: "Vil du at vi fikser dette?" → /kontakt?tjeneste=nettside | ✓ |
| Checklist + link to /priskalkulator | CTA to pricing wizard. Price-curious leads, slightly lower intent. | |
| Checklist only — no CTA | No conversion nudge. Wastes a warm moment. | |

**User's choice:** Checklist + CTA to /kontakt (recommended)

---

## Traffic Entry Points

### Promotion locations (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| Footer link | Add to footer. Passive but persistent across all pages. | ✓ |
| Chatbot suggestion chip | 'Gratis sjekkliste' chip in ChatWidget. | |
| City pages (/steder/*) | Mid-page CTA block on city pages. | |
| Blog articles | CTA at bottom of relevant articles. | |

**User's choice:** Footer link only

---

## Claude's Discretion

- Exact 10 checklist items
- Reveal animation specifics
- Footer column placement
- CSS blur intensity
- Page hero headline and subheading

## Deferred Ideas

- Chatbot suggestion chip — future phase
- City page CTA blocks — future phase
- Blog article CTAs — future phase
- Confirmation email via Formspree — can add later without code changes
