# Phase 41: Lead Magnet & Mid-Funnel Asset - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build `/sjekkliste` — an email-gated checklist page ("10 ting nettsiden din trenger i 2026") that captures mid-funnel prospects not ready to buy. Two-field form (navn, e-post) submitted to a dedicated Formspree endpoint. Plausible LeadMagnetDownload + consent-gated Meta Pixel Lead event fire on successful submission.

This phase covers: the page itself, the gate/reveal mechanism, the form, analytics events, and a footer link entry point.

</domain>

<decisions>
## Implementation Decisions

### Page Layout
- **D-01:** Teaser + gate pattern — show items 1–3 visible, items 4–10 blurred with lock icon overlay. User sees content exists before committing their email.
- **D-02:** Blurred rows with lock icon — CSS blur filter on items 4–10, lock icon overlaid. Standard SaaS gating pattern. Framer Motion can animate the reveal.

### Form Gate Behavior
- **D-03:** Inline reveal — after form submission to Formspree, blur is removed and remaining items animate in on the same page. No redirect. Conversion events fire via client-side JS immediately after Formspree confirms success.
- **D-04:** No confirmation email — Formspree captures the submission to inbox only. No email automation needed in this phase.

### Post-Submit State
- **D-05:** Full checklist unlocks + CTA card below — after reveal, a CTA card renders: "Vil du at vi fikser dette for deg?" linking to `/kontakt?tjeneste=nettside`. Warm conversion moment, natural next step.

### Analytics Events
- **D-06:** On successful submit: fire `trackLeadMagnetDownload()` (new Plausible wrapper function in `analytics.ts`) + consent-gated `fbq('track', 'Lead', { content_name: 'Sjekkliste 2026' })`.
- **D-07:** Follow existing consent gate pattern: `if (localStorage.getItem('nettup_ads_consent') === 'granted' && window.fbq)` before firing fbq.

### Entry Points
- **D-08:** Footer link only — add `/sjekkliste` to footer under a "Ressurser" column or similar. Passive, persistent, no per-page changes needed.

### Implementation Approach
- **D-09:** React island (`SjekklisterIsland.tsx` or similar) to handle form state, blur toggle, and reveal animation. Astro page wrapper at `/sjekkliste/index.astro`.
- **D-10:** Dedicated Formspree form endpoint (separate from `xnjnzybj` contact form) — configure in config or inline as a new constant.

### Claude's Discretion
- Exact 10 checklist items (content of the "10 ting nettsiden din trenger i 2026" list)
- Animation specifics for the reveal (fadeIn, stagger, duration)
- Exact footer column placement for the /sjekkliste link
- CSS blur intensity for locked items
- Page hero headline and subheading copy

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/ROADMAP.md` §Phase 41 — Success criteria SC-1 (page + form + Formspree) and SC-2 (Plausible + Meta Pixel events)

### Analytics Patterns
- `src/lib/analytics.ts` — Existing Plausible wrapper; add `trackLeadMagnetDownload()` following the same guard pattern
- `src/pages/nettside-for-bedrift/takk.astro` — How consent-gated fbq Lead events are fired (pattern to replicate, inline JS)

### Form Pattern
- `src/pages/kontakt/_sections/ContactForm.tsx` — Formspree submission pattern (fetch to `https://formspree.io/f/{ID}`, status states, error handling)
- `src/components/islands/HeroMicroForm.tsx` — Simpler 2-field form pattern closer to what /sjekkliste needs

### Entry Point
- `src/components/layout/Footer.astro` (or wherever footer lives) — Where to add /sjekkliste link

### No external specs
All requirements are captured in ROADMAP.md and analytics/form patterns are in the codebase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card`, `Section`, `SectionHeader` components in `src/components/ui/` — use for page structure
- `src/lib/analytics.ts` — extend with `trackLeadMagnetDownload()`
- Framer Motion already installed — use `AnimatePresence` + `motion.div` for blur-to-reveal animation
- `HeroMicroForm.tsx` — closest existing form pattern (2 fields, Formspree, simple state machine)

### Established Patterns
- React island in `/src/components/islands/` for interactive state (form + reveal)
- Astro page at `/src/pages/[route]/index.astro` wrapping the island
- `pt-32 md:pt-40` first section padding to clear fixed nav
- Consent-gate pattern: `localStorage.getItem('nettup_ads_consent') === 'granted'` check before fbq calls
- Separate Formspree IDs per form (don't reuse `xnjnzybj`)

### Integration Points
- `src/lib/analytics.ts` — new `trackLeadMagnetDownload()` function
- Footer component — add `/sjekkliste` link
- `src/pages/sjekkliste/index.astro` — new page
- `src/components/islands/` — new React island for gate/reveal

</code_context>

<specifics>
## Specific Ideas

- The teaser+gate pattern (3 visible, 7 blurred) mirrors common lead magnet UX — no need to reinvent
- CTA after reveal links to `/kontakt?tjeneste=nettside` (pre-fills the service field, consistent with existing CTA patterns)
- Footer entry point only for now — other promotion points (chatbot chip, city pages, blog) are deferred

</specifics>

<deferred>
## Deferred Ideas

- Chatbot suggestion chip for /sjekkliste — would reach active visitors but requires ChatWidget config change
- City page mid-page CTA block ("Sjekk om nettsiden din er klar for 2026") — high-intent but out of scope
- Blog article CTA at bottom of relevant posts — SEO traffic entry point, deferred
- Confirmation email via Formspree — low value for now, can add later without code changes

</deferred>

---

*Phase: 41-lead-magnet-mid-funnel-asset*
*Context gathered: 2026-03-28*
