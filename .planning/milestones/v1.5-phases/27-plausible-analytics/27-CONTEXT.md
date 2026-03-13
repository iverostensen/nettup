# Phase 27: Plausible Analytics - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Plausible Analytics to nettup.no: script setup, a thin `analytics.ts` wrapper, and custom event tracking for key conversion actions. Vercel Analytics stays in place for Web Vitals (LCP, CLS, FID). No consent banner needed — Plausible is cookieless and GDPR-compliant by design.

</domain>

<decisions>
## Implementation Decisions

### Event taxonomy
- Title Case event names (Plausible convention): `Contact Form Submit`, `Wizard Estimate Shown`, `Chatbot Opened`, etc.
- Custom props attached per event — not just event name alone
- No sitewide CTA click tracking — conversion events only (lower noise, clearer signal)

### Events to track
| Event | Props |
|-------|-------|
| `Contact Form Submit` | _(none — page URL is sufficient)_ |
| `B2B Form Submit` | _(none — separate from contact form to measure B2B landing page conversion)_ |
| `Wizard Estimate Shown` | `estimate_range` (e.g. `15k-25k`), `goal` (e.g. `nettbutikk`) |
| `Wizard CTA Clicked` | `estimate_range`, `goal` |
| `Chatbot Opened` | _(none)_ |
| `Chatbot Suggestion Clicked` | `suggestion` (the chip text clicked) |
| `City CTA Clicked` | `city` (e.g. `bergen`) |

### City page leads
- A "lead" on `/steder/[location]` = primary CTA click, not just a pageview or form submit
- City prop must be included so Plausible dashboard can filter by city

### B2B landing page
- `nettside-for-bedrift` form submit fires `B2B Form Submit` (separate from `Contact Form Submit`)
- Allows independent conversion measurement for that landing page

### Chatbot tracking
- Track both open and suggestion click
- `Chatbot Suggestion Clicked` includes the `suggestion` prop (chip label) — tells us what users are asking about

### Plausible setup
- Cloud: plausible.io (not self-hosted)
- Script tag in `BaseLayout.astro` only (all pages use it)
- Domain hardcoded as `nettup.no` (no env var needed)

### Claude's Discretion
- Exact script tag attributes (defer, data-domain, etc.)
- `analytics.ts` wrapper API design (function signatures, TypeScript types)
- How to pass `city` prop from `[location].astro` to the tracking call
- Whether to use `plausible()` global or import a package

</decisions>

<specifics>
## Specific Ideas

- From memory: scope is intentionally lean — ~26 lines across 5 files. Don't over-engineer the wrapper.
- Keep Vercel Analytics untouched — it handles Web Vitals, Plausible handles conversions.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` — exists, but analytics.ts should be its own file per original plan
- `src/components/islands/ChatWidget.tsx` — needs `Chatbot Opened` + `Chatbot Suggestion Clicked` events added
- `src/components/islands/SmartPrisKalkulator.tsx` + `wizard/steps/ResultStep.tsx` — wizard estimate + CTA events go here
- `src/pages/kontakt/_sections/ContactForm.tsx` — `Contact Form Submit` event on form success
- `src/pages/nettside-for-bedrift/_sections/FormSection.astro` — `B2B Form Submit` event (check if this is a React island or Astro form)
- `src/pages/steder/[location].astro` — `City CTA Clicked` event with city prop

### Established Patterns
- Vercel Analytics: imported as `@vercel/analytics/astro` component in BaseLayout — Plausible script tag goes in the same `<!-- Analytics -->` block
- Islands are React (`.tsx`) — `plausible()` global callable from client-side JS
- `LandingPageLayout.astro` also imports Vercel Analytics — check if it extends BaseLayout or is standalone before deciding whether Plausible needs adding there too

### Integration Points
- `BaseLayout.astro:192` — Analytics block, add `<script>` tag here
- `ChatWidget.tsx` — intercept open action and suggestion chip onClick
- `ResultStep.tsx` — fire estimate event when result is shown, CTA event on button click
- `[location].astro` — CTA button(s) need onClick handlers or Astro script to fire city event

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 27-plausible-analytics*
*Context gathered: 2026-03-08*
