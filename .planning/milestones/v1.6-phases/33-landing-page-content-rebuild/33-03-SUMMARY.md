---
phase: 33-landing-page-content-rebuild
plan: 03
subsystem: ui
tags: [astro, react, landing-page, form, subscription]

requires:
  - phase: 33-landing-page-content-rebuild (plans 01, 02)
    provides: Hero, VisualProof, PricingSummary, WhyUs, FAQ, UpsellSection, subscriptionOffer.ts
provides:
  - Simplified 3-field b2b form (FormSection with scarcity text)
  - Conditional ContactForm rendering based on context prop
  - Complete index.astro with correct section order and subscription meta
  - Zero stale references to old tiers/pricing
affects: [google-ads-campaign, landing-page-testing]

tech-stack:
  added: []
  patterns: [context-based conditional rendering in shared React form component]

key-files:
  created: []
  modified:
    - src/pages/nettside-for-bedrift/_sections/FormSection.astro
    - src/pages/kontakt/_sections/ContactForm.tsx
    - src/pages/nettside-for-bedrift/index.astro

key-decisions:
  - "ContactForm uses context prop to conditionally hide fields rather than creating a separate b2b form component"
  - "pricing.ts import kept in ContactForm for /kontakt page backward compatibility"

patterns-established:
  - "Context-based form rendering: context='b2b' shows minimal fields, context='contact' shows full form"

requirements-completed: [LP-03, LP-04, LP-06]

duration: 2min
completed: 2026-03-20
---

# Phase 33 Plan 03: Wiring and Form Simplification Summary

**Landing page fully wired: 3-field b2b form with scarcity text, correct 8-section order, subscription meta from subscriptionOffer.ts, zero stale tier references**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T18:39:16Z
- **Completed:** 2026-03-20T18:42:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- FormSection simplified with static heading, scarcity text, no dynamic pakke script
- ContactForm conditionally hides pakke badge, service badge, hidden inputs, and melding textarea for b2b context while preserving full form for /kontakt
- index.astro rewritten with subscription meta, UpsellSection added, LogoCloud removed, correct section order
- Stale reference audit passed with zero hits

## Task Commits

Each task was committed atomically:

1. **Task 1: Simplify FormSection and reduce ContactForm fields for b2b** - `d6bd423` (feat)
2. **Task 2: Wire index.astro with correct imports, section order, and meta tags** - `3edb3dd` (feat)

## Files Created/Modified
- `src/pages/nettside-for-bedrift/_sections/FormSection.astro` - Static heading, scarcity text, removed pakke script
- `src/pages/kontakt/_sections/ContactForm.tsx` - Conditional field rendering for b2b vs contact context
- `src/pages/nettside-for-bedrift/index.astro` - Correct section order, subscription meta, UpsellSection added

## Decisions Made
- Used context prop conditional rendering instead of creating a separate b2b form component (keeps single source of truth)
- Kept pricing.ts import in ContactForm for backward compatibility with /kontakt page

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Landing page rebuild complete across all 3 plans
- Ready for Google Ads campaign documentation (Phase 34)
- All sections wired, subscription messaging consistent, form simplified for conversion

---
*Phase: 33-landing-page-content-rebuild*
*Completed: 2026-03-20*
