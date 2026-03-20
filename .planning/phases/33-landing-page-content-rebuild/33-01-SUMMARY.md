---
phase: 33-landing-page-content-rebuild
plan: 01
subsystem: ui
tags: [astro, landing-page, pricing, subscription, conversion]

requires:
  - phase: 32-config-conversion-flow
    provides: subscriptionOffer.ts config with pricing data
provides:
  - Price-anchored hero with subscription pricing from subscriptionOffer.ts
  - Updated trust badges (30 dagers garanti, Ingen bindingstid)
  - Micro-testimonial from iGive below hero form
  - Website preview section without Lighthouse metrics
  - Subscription-aligned HeroMicroForm CTA
affects: [33-02, 33-03, ad-campaign-docs]

tech-stack:
  added: []
  patterns: [price-anchoring-against-competitors, subscription-cta-language]

key-files:
  created: []
  modified:
    - src/pages/nettside-for-bedrift/_sections/Hero.astro
    - src/pages/nettside-for-bedrift/_sections/VisualProof.astro
    - src/components/islands/HeroMicroForm.tsx

key-decisions:
  - "Price anchoring uses '15 000+ kr' as competitor reference point"
  - "Micro-testimonial is shortened iGive quote, not full testimonial"

patterns-established:
  - "Subscription CTA language: 'Kom i gang' instead of 'Fa gratis tilbud'"
  - "Trust badges reflect subscription terms, not service SLAs"

requirements-completed: [LP-01, LP-04, LP-06]

duration: 2min
completed: 2026-03-20
---

# Phase 33 Plan 01: Above-fold Content Rebuild Summary

**Price-anchored hero with subscription pricing (0 kr / 399 kr/mnd), honest trust badges, iGive micro-testimonial, and visual website preview without Lighthouse metrics**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T18:34:46Z
- **Completed:** 2026-03-20T18:36:38Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Hero rewritten with price anchoring (15 000+ kr crossed out vs 0 kr oppstart + 399 kr/mnd from subscriptionOffer.ts)
- Fake 4.9-star rating removed, replaced with real iGive micro-testimonial
- Trust badges updated to match subscription model (Ingen bindingstid instead of 24t responstid)
- VisualProof stripped of Lighthouse metrics overlay, keeps website screenshot
- HeroMicroForm CTA aligned with subscription language

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite Hero.astro with price anchoring, updated badges, and micro-testimonial** - `ee36443` (feat)
2. **Task 2: Replace VisualProof Lighthouse metrics with website preview and update HeroMicroForm button** - `495d414` (feat)

## Files Created/Modified
- `src/pages/nettside-for-bedrift/_sections/Hero.astro` - Price-anchored hero with subscription pricing, updated trust badges, micro-testimonial
- `src/pages/nettside-for-bedrift/_sections/VisualProof.astro` - Website preview without Lighthouse metrics overlay
- `src/components/islands/HeroMicroForm.tsx` - Subscription-aligned button text and helper text

## Decisions Made
- Price anchoring uses "Andre tar 15 000+ kr" as competitor reference, not a specific Nettup old price
- Micro-testimonial is a shortened version of the full iGive quote from Testimonial.astro
- VisualProof keeps screenshot and logo badge but removes all numeric performance metrics

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Above-fold content complete with subscription messaging
- Ready for remaining landing page sections (pricing details, features, FAQ, contact form)
- All content uses subscriptionOffer.ts as single source of truth

## Self-Check: PASSED

All 3 files exist, both commits verified, all 10 content assertions passed.

---
*Phase: 33-landing-page-content-rebuild*
*Completed: 2026-03-20*
