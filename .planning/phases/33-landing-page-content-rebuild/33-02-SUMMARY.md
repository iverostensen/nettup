---
phase: 33-landing-page-content-rebuild
plan: 02
subsystem: ui
tags: [astro, landing-page, subscription, json-ld, seo]

requires:
  - phase: 32-config-conversion-flow
    provides: subscriptionOffer.ts config with pricing, features, terms, upsellLinks
provides:
  - Subscription-focused PricingSummary guarantee banner
  - Subscription value prop cards in WhyUs section
  - Subscription FAQ with JSON-LD FAQPage schema
  - UpsellSection linking to /tjenester subpages
affects: [33-landing-page-content-rebuild]

tech-stack:
  added: []
  patterns: [subscription-model-copy, upsell-pattern]

key-files:
  created:
    - src/pages/nettside-for-bedrift/_sections/UpsellSection.astro
  modified:
    - src/pages/nettside-for-bedrift/_sections/PricingSummary.astro
    - src/pages/nettside-for-bedrift/_sections/WhyUs.astro
    - src/pages/nettside-for-bedrift/_sections/FAQ.astro

key-decisions:
  - "Guarantee wording uses first-month risk-free framing instead of refund language"

patterns-established:
  - "Upsell pattern: secondary section linking to /tjenester via subscriptionOffer.upsellLinks"

requirements-completed: [LP-05, LP-07, LP-08]

duration: 2min
completed: 2026-03-20
---

# Phase 33 Plan 02: Mid-Page Sections Rebuild Summary

**Subscription-focused mid-page sections: risk-free guarantee, 6 value prop cards, 6 FAQ questions with JSON-LD, and upsell links to /tjenester**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T18:34:52Z
- **Completed:** 2026-03-20T18:37:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- PricingSummary guarantee banner updated from refund language to subscription-friendly "Risikofri oppstart"
- WhyUs cards rewritten with 6 subscription value props (no tiers, no ownership claims)
- FAQ rewritten with 6 subscription-focused questions addressing objections, JSON-LD FAQPage schema preserved
- New UpsellSection created with links from subscriptionOffer.upsellLinks

## Task Commits

Each task was committed atomically:

1. **Task 1: Update PricingSummary guarantee and create UpsellSection** - `a2f91a8` (feat)
2. **Task 2: Rewrite WhyUs cards and FAQ for subscription model** - `4892817` (feat)

## Files Created/Modified
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` - Updated guarantee banner to subscription wording
- `src/pages/nettside-for-bedrift/_sections/UpsellSection.astro` - New upsell section linking to /tjenester
- `src/pages/nettside-for-bedrift/_sections/WhyUs.astro` - 6 subscription value prop cards, updated process step 3
- `src/pages/nettside-for-bedrift/_sections/FAQ.astro` - 6 subscription FAQ questions with JSON-LD

## Decisions Made
- Guarantee wording uses "Risikofri oppstart" with first-month framing instead of money-back-guarantee language, aligning with subscription model where there is no upfront payment to refund

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All mid-page sections now reinforce the single subscription model
- FormSection and Hero still contain old tier/pricing references (in scope for other plans in phase 33)

---
*Phase: 33-landing-page-content-rebuild*
*Completed: 2026-03-20*
