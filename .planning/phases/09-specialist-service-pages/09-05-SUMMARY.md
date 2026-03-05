---
phase: 09-specialist-service-pages
plan: 05
subsystem: ui
tags: [astro, service-page, seo, json-ld, vedlikehold]

# Dependency graph
requires:
  - phase: 09-01
    provides: vedlikehold service object in services.ts with monthlyPrice/monthlyPriceLabel
provides:
  - /tjenester/vedlikehold service page with reassurance Hero, Inkludert, FAQ, CTA sections
  - FAQPage JSON-LD in FAQ.astro, Service JSON-LD (minPrice: 1500) in index.astro
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [4-section service page pattern (Hero + Inkludert + FAQ + CTA), FAQPage JSON-LD co-located in FAQ.astro, Service JSON-LD in index.astro Fragment slot='head']

key-files:
  created:
    - src/pages/tjenester/vedlikehold/index.astro
    - src/pages/tjenester/vedlikehold/_sections/Hero.astro
    - src/pages/tjenester/vedlikehold/_sections/Inkludert.astro
    - src/pages/tjenester/vedlikehold/_sections/FAQ.astro
    - src/pages/tjenester/vedlikehold/_sections/CTA.astro
  modified: []

key-decisions:
  - "Vedlikehold page uses monthly price (fra 1 500 kr/mnd) as sole price signal — no one-time project price"
  - "Inkludert section framed as 'hva din avtale dekker' not an upsell — tone is reassurance"
  - "CTA text is 'Start med en gratis gjennomgang' (not 'Fa et gratis tilbud') — consistent with ongoing service framing"
  - "FAQPage JSON-LD co-located in FAQ.astro (consistent with 08-01/08-02/08-03/09-02/09-03/09-04 pattern)"

patterns-established:
  - "Vedlikehold page: monthly-only price signal, reassurance tone, no upsell language"

requirements-completed: [PAGES-07]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 9 Plan 05: Vedlikehold Service Page Summary

**Reassurance-focused /tjenester/vedlikehold page with 7-item monthly coverage grid, 5-question FAQ with FAQPage JSON-LD, and Service JSON-LD (minPrice: 1500)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T12:26:19Z
- **Completed:** 2026-03-05T12:27:56Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Built /tjenester/vedlikehold page following established 4-section pattern (Hero, Inkludert, FAQ, CTA)
- Hero uses animate-fade-up with "vi tar ansvar" reassurance framing and "fra 1 500 kr/mnd" as the sole price signal
- Inkludert covers 7 items in the monthly maintenance agreement with checkmark grid layout
- FAQ has 5 questions covering coverage, new features/pages, response time, cancellation, and consequences of no maintenance
- FAQPage JSON-LD co-located in FAQ.astro, Service JSON-LD with minPrice: 1500 in index.astro
- Build passes cleanly with 0 errors, 14 pages total

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero, Inkludert, and CTA sections** - `8be0f14` (feat)
2. **Task 2: Create FAQ.astro and index.astro** - `f6530ab` (feat)

## Files Created/Modified
- `src/pages/tjenester/vedlikehold/index.astro` - Page root with Service JSON-LD and 4-section composition
- `src/pages/tjenester/vedlikehold/_sections/Hero.astro` - Reassurance headline + monthly price + CTA
- `src/pages/tjenester/vedlikehold/_sections/Inkludert.astro` - 7 monthly coverage items with checkmark grid
- `src/pages/tjenester/vedlikehold/_sections/FAQ.astro` - 5 FAQs + inline FAQPage JSON-LD
- `src/pages/tjenester/vedlikehold/_sections/CTA.astro` - Section CTA linking to /kontakt?tjeneste=vedlikehold

## Decisions Made
- Monthly price (fra 1 500 kr/mnd) is the sole price signal — no one-time project price shown
- Inkludert section framed as "hva din avtale dekker" — explicitly not an upsell for new features
- CTA text "Start med en gratis gjennomgang" maintained consistently in both Hero and CTA sections
- Page does not mention pricing tiers, upgrades, or add-on packages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 9 is now complete — all 5 specialist service pages built
- Phase 10 can proceed: adds monthlyPrice/monthlyPriceLabel to nettside, nettbutikk, landingsside services

---
*Phase: 09-specialist-service-pages*
*Completed: 2026-03-05*
