# Phase 31: Tracking Infrastructure - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade the existing Google Ads tracking on `/nettside-for-bedrift` to Consent Mode v2 (advanced mode) and add noindex to prevent SEO cannibalization. Scope is limited to tracking infrastructure -- no content changes, no new pages, no conversion flow changes (those are Phase 32+).

</domain>

<decisions>
## Implementation Decisions

### Consent banner UX
- Single accept/decline toggle covering all four consent types (ad_storage, analytics_storage, ad_user_data, ad_personalization) -- no granular toggles
- Minimal banner text: short explanation of cookie usage + inline link to /personvern
- Keep current position and animation: fixed bottom bar, fades out on accept/decline
- Button labels stay as "Godta" / "Avslå"

### Consent scope
- gtag + consent banner stays on LandingPageLayout only -- no site-wide rollout
- noIndex defaults to true in LandingPageLayout (all ad landing pages should be noindexed by default)
- Consent persists via localStorage (current approach) -- carries across visits

### Consent Mode v2 implementation
- gtag loads immediately on page load with all consent states set to `denied`
- On user accept: update all four consent types to `granted`
- On user decline: consent stays `denied`, gtag still loaded (enables anonymous pings / conversion modeling)
- `ad_user_data` and `ad_personalization` parameters must be present in consent config

### Privacy page updates
- Update /personvern to reflect Consent Mode v2 in user-friendly Norwegian (no technical jargon)
- Explain what data is collected and what accepting/declining means in plain language
- Mention Plausible Analytics separately: cookieless, no consent needed -- contrast with Google's cookie-based tracking
- Update technical references (localStorage key, consent types)

### Claude's Discretion
- Exact banner text wording (within the "minimal + /personvern link" constraint)
- Privacy page section structure and paragraph flow
- gtag consent initialization code structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing tracking code
- `src/layouts/LandingPageLayout.astro` -- Current gtag loading, consent banner, and noIndex prop (lines 159-242)
- `src/lib/analytics.ts` -- Plausible wrapper (keep untouched, Plausible doesn't need consent)
- `src/components/islands/HeroMicroForm.tsx` -- Uses window.gtagLoaded for conversion events (must remain compatible)
- `src/pages/kontakt/_sections/ContactForm.tsx` -- Also uses window.gtagLoaded (must remain compatible)

### Privacy
- `src/pages/personvern/index.astro` -- Current privacy page referencing nettup_ads_consent

### Landing page
- `src/pages/nettside-for-bedrift/index.astro` -- Landing page that needs noindex (via LandingPageLayout default change)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LandingPageLayout.astro`: Already has consent banner HTML, gtag loading script, and noIndex prop -- upgrade in-place
- `src/lib/analytics.ts`: Plausible wrapper with SSR guard pattern -- can reference pattern for gtag helpers if needed
- `window.gtagLoaded` / `window.gtag`: Global flags used by HeroMicroForm and ContactForm for conversion events -- must maintain this interface

### Established Patterns
- Inline `<script is:inline>` for third-party tracking (Plausible, gtag) -- keep this pattern
- localStorage for consent persistence (`nettup_ads_consent` key)
- `window.plausible` / `window.gtag` global access pattern

### Integration Points
- HeroMicroForm.tsx and ContactForm.tsx check `window.gtagLoaded && window.gtag` before firing conversion events -- Consent Mode v2 changes must keep this working
- BaseLayout.astro has Plausible but no gtag -- stays unchanged
- /personvern page references consent key name -- update if key name changes

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches for Consent Mode v2 implementation.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 31-tracking-infrastructure*
*Context gathered: 2026-03-19*
