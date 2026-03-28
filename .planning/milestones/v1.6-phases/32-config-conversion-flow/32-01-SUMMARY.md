---
phase: 32-config-conversion-flow
plan: 01
subsystem: config
tags: [typescript, config, analytics, utm, subscription]

requires:
  - phase: 31-tracking-infrastructure
    provides: Plausible analytics track() helper pattern
provides:
  - subscriptionOffer.ts single source of truth for 0 kr / 399 kr/mnd offer
  - trackB2BLead() analytics function for /takk page
  - UTM capture/retrieval utilities (captureUtmParams, getUtmParams)
affects: [32-02, 33-landing-page-rebuild]

tech-stack:
  added: []
  patterns: [sessionStorage UTM capture, single-offer config pattern]

key-files:
  created:
    - src/config/subscriptionOffer.ts
    - src/lib/utm.ts
  modified:
    - src/lib/analytics.ts
    - src/pages/steder/[location].astro
    - src/pages/nettside-for-bedrift/_sections/PricingSummary.astro

key-decisions:
  - "PricingSummary interim single-card version, Phase 33 will rebuild fully"
  - "pricing.ts kept alive for ContactForm PAKKE_INFO badge until Phase 33"

patterns-established:
  - "Single subscription offer config: one typed export, no tiers"
  - "UTM params stored in sessionStorage as separate keys for Formspree filtering"

requirements-completed: [LP-02, TRACK-05]

duration: 3min
completed: 2026-03-19
---

# Phase 32 Plan 01: Config & Utilities Summary

**subscriptionOffer.ts replaces launchOffer.ts as single source of truth, trackB2BLead and UTM utilities ready for form/redirect work**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-19T14:35:57Z
- **Completed:** 2026-03-19T14:39:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created subscriptionOffer.ts with typed SubscriptionOffer interface (0 kr setup, 399 kr/mnd, features, terms, upsell links, meta)
- Migrated city pages and PricingSummary off launchOffer.ts, deleted the file
- PricingSummary now shows single centered offer card instead of 3-tier grid (removed ScarcityCounter)
- Added trackB2BLead() to analytics.ts and created utm.ts with captureUtmParams/getUtmParams

## Task Commits

Each task was committed atomically:

1. **Task 1: Create subscriptionOffer.ts and migrate importers off launchOffer.ts** - `761f9ee` (feat)
2. **Task 2: Add trackB2BLead to analytics and create UTM capture utility** - `f9f726b` (feat)

## Files Created/Modified
- `src/config/subscriptionOffer.ts` - Single source of truth for subscription offer (price, features, terms, upsell, meta)
- `src/config/launchOffer.ts` - Deleted (replaced by subscriptionOffer.ts)
- `src/lib/utm.ts` - UTM capture to sessionStorage and retrieval for form payloads
- `src/lib/analytics.ts` - Added trackB2BLead() function
- `src/pages/steder/[location].astro` - Removed scarcity/launch offer, shows standard pricing
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` - Replaced 3-tier grid with single offer card

## Decisions Made
- PricingSummary is an interim single-card version; Phase 33 rebuilds it fully
- pricing.ts kept alive for ContactForm PAKKE_INFO badge (deleted in Phase 33)
- UTM params stored as separate sessionStorage keys (not JSON blob) for better Formspree dashboard filtering

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- subscriptionOffer.ts ready for import by Plan 02 form/redirect work
- trackB2BLead() ready for /takk page
- captureUtmParams/getUtmParams ready for form components
- pricing.ts still available for ContactForm until Phase 33

---
*Phase: 32-config-conversion-flow*
*Completed: 2026-03-19*
