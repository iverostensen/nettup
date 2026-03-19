# Phase 32: Config & Conversion Flow - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Create `subscriptionOffer.ts` as single source of truth for the one subscription offer (0 kr oppstart + 399 kr/mnd), build a dedicated `/nettside-for-bedrift/takk` thank-you page that fires conversion events, redirect form submissions to that page, and capture UTM parameters from Google Ads URLs. No content rewriting, no layout changes, no ad campaign work.

</domain>

<decisions>
## Implementation Decisions

### subscriptionOffer.ts shape
- Full config: price (monthlyPrice, setupPrice), features[], terms (binding, cancellation), upsellLinks[] to /tjenester, and meta (SEO title, description for the landing page)
- Single export, no tiers, no package array
- Delete both `launchOffer.ts` and `pricing.ts` after migration
- Note: `pricing.ts` is imported by `ContactForm.tsx` for the pakke dropdown on /kontakt. Claude determines the cleanest boundary: likely keep `pricing.ts` until Phase 33 simplifies the form, or inline the dropdown data in ContactForm if the coupling is minimal

### Scarcity handling
- Claude's discretion based on LP-04 ("remove fake social proof", "honest approach" directive)
- If kept, must be real and manually updated (not a fake countdown)

### Thank-you page content
- `/nettside-for-bedrift/takk` shows confirmation + next steps:
  1. Heading: "Takk for henvendelsen" or similar
  2. "Vi kontakter deg innen 24 timer"
  3. "Hva skjer na?" process explanation (Vi ringer → Oppstartsm0te → Nettside klar)
- Uses `LandingPageLayout` (keeps gtag loaded, no main nav = no exit paths before events fire)

### Conversion events on /takk
- Both gtag conversion event AND Plausible event fire on page load
- New Plausible goal name: **'B2B Lead'** (distinct from other contact form events for Google Ads ROI analysis)
- gtag conversion event uses existing conversion ID/label pattern from HeroMicroForm

### Direct /takk visits
- Claude's discretion on whether to gate events (session flag) or always fire. Low-traffic page, pragmatic approach preferred.

### Form redirect behavior
- After successful Formspree POST (wait for 200 response), redirect to `/nettside-for-bedrift/takk`
- No optimistic redirect: data must be confirmed saved before leaving the page
- Remove inline gtag conversion events from form components (HeroMicroForm + ContactForm in b2b context). Events fire on /takk page only (single source of truth).
- Claude decides whether HeroMicroForm also redirects to /takk or keeps inline success (both are acceptable; consistency is the tiebreaker)

### UTM capture
- Capture on page load: store `utm_source`, `utm_medium`, `utm_campaign` in sessionStorage immediately
- Standard 3 params only (source, medium, campaign). Extended params (term, content) not needed for single-campaign setup.
- Include UTM data in Formspree form submission payload
- Claude decides: separate Formspree fields vs JSON blob (separate fields is likely better for dashboard filtering)
- Claude decides: whether to forward UTM params to /takk URL for Plausible/gtag attribution

### Claude's Discretion
- Whether to keep `pricing.ts` alive for ContactForm or inline the data
- Scarcity counter: keep (real, manual) or remove entirely
- Direct /takk visit event gating approach
- HeroMicroForm redirect vs inline success
- UTM field format in Formspree payload (separate fields vs JSON)
- UTM forwarding to /takk URL
- Exact Norwegian copy on thank-you page
- `steder/[location].astro` import of `remainingSlots` from launchOffer.ts needs migration

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Config files (being replaced)
- `src/config/launchOffer.ts` -- Current scarcity counter (total/taken). Being deleted.
- `src/config/pricing.ts` -- Current 3-tier Pakke[] array. Being deleted (check ContactForm dependency first).

### Forms (conversion flow changes)
- `src/components/islands/HeroMicroForm.tsx` -- Email-only hero form. Currently fires gtag conversion inline. Needs redirect + remove inline event.
- `src/pages/kontakt/_sections/ContactForm.tsx` -- Full contact form. Imports pricing.ts for pakke dropdown. Used on landing page with `context="b2b"`. Needs redirect when context=b2b + remove inline event.
- `src/pages/nettside-for-bedrift/_sections/FormSection.astro` -- Wraps ContactForm with b2b context. Has pakke-based dynamic heading.

### Landing page layout
- `src/layouts/LandingPageLayout.astro` -- Has gtag + consent banner. /takk page will use this layout.
- `src/pages/nettside-for-bedrift/index.astro` -- Landing page structure (hero, sections, form).

### Analytics
- `src/lib/analytics.ts` -- Plausible wrapper. New 'B2B Lead' goal needs a tracker function here.

### Existing importers of old configs
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` -- Imports both launchOffer and pricing. Being rebuilt in Phase 33.
- `src/pages/steder/[location].astro` -- Imports remainingSlots from launchOffer.ts. Needs migration.
- `src/pages/kontakt/_sections/ContactForm.tsx` -- Imports pakker from pricing.ts for dropdown.

### Phase 31 context
- `.planning/phases/31-tracking-infrastructure/31-CONTEXT.md` -- Consent Mode v2 decisions, gtag loading pattern, window.gtagLoaded interface.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LandingPageLayout.astro`: Already has gtag + consent banner. /takk page gets tracking for free by using this layout.
- `src/lib/analytics.ts`: Plausible wrapper with SSR guard + optional chain pattern. Add `trackB2BLead()` following existing pattern.
- `window.gtagLoaded && window.gtag`: Global gtag access pattern established in Phase 31. Use same pattern on /takk page.

### Established Patterns
- Config files in `src/config/` as single source of truth (services.ts, projects.ts, pricing-config.ts, brand.ts)
- `is:inline` scripts for third-party tracking integration
- sessionStorage for cross-page state (used by chatbot for navigation persistence)
- Formspree POST with JSON body from React components

### Integration Points
- HeroMicroForm.tsx and ContactForm.tsx: Remove inline gtag calls, add redirect logic after Formspree success
- PricingSummary.astro: Currently imports from both old configs. Will be rebuilt in Phase 33, but needs to not break during Phase 32.
- `steder/[location].astro`: Imports `remainingSlots`. Needs alternative after launchOffer.ts deletion.
- New `/nettside-for-bedrift/takk` page: New Astro page using LandingPageLayout.

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches for config structure and conversion flow.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 32-config-conversion-flow*
*Context gathered: 2026-03-19*
