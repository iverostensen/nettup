# Phase 36: Meta Pixel & Full-Site Event Tracking - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Consent-aware Meta Pixel integration across the full site with conversion events (ViewContent, Lead) on key pages, retargeting event infrastructure for audience segmentation, and expanded UTM attribution for Facebook ad parameters. This phase delivers the pixel infrastructure that Phases 37-41 depend on.

</domain>

<decisions>
## Implementation Decisions

### Pixel Loading Strategy
- **D-01:** Meta Pixel base code goes in BaseLayout.astro only -- site-wide coverage from a single location
- **D-02:** LandingPageLayout stays independent (own `<html>`/`<head>`) but imports the same shared consent+pixel script. No inheritance refactor.
- **D-03:** Consent banner moves to BaseLayout so it appears on ALL pages (legally required since pixel fires site-wide)
- **D-04:** Pixel ID read from `PUBLIC_META_PIXEL_ID` env var -- supports Phase 37 kill switch and per-environment config

### Retargeting Events
- **D-05:** ViewContent events use service slug as content_name: 'Priskalkulator', 'Nettside', 'Nettbutikk', 'Landingsside' -- clean segments in Ads Manager
- **D-06:** Stick to success criteria pages only (4 ViewContent + 1 landing page ViewContent + 1 Lead on /takk). No additional pages -- expand based on data later.
- **D-07:** Events placed as inline `<script is:inline>` blocks per page, consent-gated. Same pattern as existing /takk conversion tracking.

### Consent Integration
- **D-08:** Single unified IIFE handles both gtag and fbq consent together. `fbq('consent','revoke')` before `fbq('init')`, then accept triggers both `gtag('consent','update')` and `fbq('consent','grant')` in one click using the existing `nettup_ads_consent` localStorage key.
- **D-09:** Consent banner button parity (TRACK-03) fixed in this phase -- both accept and decline get equal solid styling. We're touching the banner anyway.

### UTM Expansion
- **D-10:** Expand UTM_KEYS in utm.ts from 3 to 5 params (add utm_content + utm_term)
- **D-11:** All 5 UTM params sent as hidden fields in Formspree submissions for full attribution in dashboard
- **D-12:** sessionStorage is sufficient for cross-page persistence (same-tab navigation). No URL forwarding to /takk needed.

### Claude's Discretion
- Exact script ordering within the unified consent IIFE (gtag first vs fbq first)
- Consent banner copy wording adjustments if needed for Meta Pixel mention
- Whether to extract the consent script into a shared .astro partial or keep it inline in both layouts

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Consent & Tracking Infrastructure
- `src/layouts/BaseLayout.astro` -- Target for pixel + consent banner integration (currently has Plausible only)
- `src/layouts/LandingPageLayout.astro` -- Existing consent IIFE + gtag Consent Mode v2 pattern to replicate/share
- `src/pages/nettside-for-bedrift/takk.astro` -- Existing dual-event pattern (gtag conversion + Plausible) to extend with fbq Lead event

### Analytics & UTM
- `src/lib/analytics.ts` -- Plausible wrapper pattern (typed functions, SSR guard, optional chain)
- `src/lib/utm.ts` -- Current 3-param UTM capture to expand to 5 params

### Retargeting Target Pages
- `src/pages/priskalkulator/index.astro` -- ViewContent: 'Priskalkulator'
- `src/pages/tjenester/nettside/index.astro` -- ViewContent: 'Nettside'
- `src/pages/tjenester/nettbutikk/index.astro` -- ViewContent: 'Nettbutikk'
- `src/pages/tjenester/landingsside/index.astro` -- ViewContent: 'Landingsside'
- `src/pages/nettside-for-bedrift/index.astro` -- ViewContent: landing page

### Requirements
- `.planning/REQUIREMENTS.md` -- TRACK-01 through TRACK-06 define acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Consent IIFE pattern** (LandingPageLayout.astro:186-259): Complete gtag Consent Mode v2 advanced implementation. This is the template to extend with fbq calls.
- **Plausible analytics wrapper** (analytics.ts): Typed event functions with SSR guard and optional chain. Pattern reference, not directly reusable for fbq.
- **UTM capture module** (utm.ts): `captureUtmParams()` + `getUtmParams()` -- extend UTM_KEYS array and it works.
- **Dual event firing** (takk.astro:69-81): Pattern for firing gtag + Plausible on page load. Extend with fbq.

### Established Patterns
- **Inline scripts for tracking**: `is:inline` scripts in Astro pages for page-specific events (no ES module imports)
- **Consent state via localStorage**: `nettup_ads_consent` key with 'granted'/'denied' values
- **Script loading order**: Consent defaults set BEFORE loading external scripts (critical for Consent Mode v2)
- **Plausible always loads**: Plausible is cookieless/consent-free; only gtag (and now fbq) are consent-gated

### Integration Points
- **BaseLayout.astro `<head>`**: Where Meta Pixel script + consent banner HTML need to be added
- **LandingPageLayout.astro consent IIFE**: Must be updated to also call `fbq('consent','grant/revoke')` alongside gtag
- **Form components** (HeroMicroForm.tsx, ContactForm.tsx): Import `getUtmParams()` for hidden field submission -- already do this for 3 params
- **Vercel env vars**: `PUBLIC_META_PIXEL_ID` needs to be set in Vercel dashboard

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches following the Meta Pixel SDK documentation and existing consent patterns.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 36-meta-pixel-full-site-event-tracking*
*Context gathered: 2026-03-28*
