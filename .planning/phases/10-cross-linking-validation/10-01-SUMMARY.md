---
phase: 10-cross-linking-validation
plan: "01"
subsystem: ui
tags: [astro, services, cross-linking, components]

requires:
  - phase: 09-specialist-service-pages
    provides: All 7 service sub-pages (nettside, nettbutikk, landingsside, webapp, seo, ai, vedlikehold) with Hero/Inkludert/FAQ/CTA pattern
provides:
  - RelaterteTjenester.astro shared section component resolving slugs from services.ts
  - related field on all 7 Service objects with locked cross-link pairings
  - "Relaterte tjenester" section wired between FAQ and CTA on all 7 service pages
affects: [10-cross-linking-validation]

tech-stack:
  added: []
  patterns:
    - "Cross-link data co-located in services.ts as related?: string[] on Service interface"
    - "Shared section component resolves slugs to full service objects with filter(Boolean) guard"
    - "service.related ?? [] pattern for safe optional field usage in page templates"

key-files:
  created:
    - src/components/sections/RelaterteTjenester.astro
  modified:
    - src/config/services.ts
    - src/pages/tjenester/nettside/index.astro
    - src/pages/tjenester/nettbutikk/index.astro
    - src/pages/tjenester/landingsside/index.astro
    - src/pages/tjenester/webapp/index.astro
    - src/pages/tjenester/seo/index.astro
    - src/pages/tjenester/ai/index.astro
    - src/pages/tjenester/vedlikehold/index.astro

key-decisions:
  - "related?: string[] is optional on Service interface to safely support future services without pairings"
  - "Cross-link pairings stored in services.ts (single source of truth) not hardcoded in each page"
  - "RelaterteTjenester guards render with relatedServices.length > 0 check"
  - "Card used as <a> element (href prop) — no nested anchors, all inner content is h3/p only"

patterns-established:
  - "Shared section component pattern: accepts slugs, resolves to full objects, renders with guard"

requirements-completed: [SEO-01, SEO-03]

duration: 3min
completed: 2026-03-05
---

# Phase 10 Plan 01: Cross-links — services.ts extension + RelaterteTjenester component + wiring Summary

**"Relaterte tjenester" cross-link section added to all 7 service pages via shared component driven by locked slug pairings in services.ts**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-05T13:51:55Z
- **Completed:** 2026-03-05T13:54:47Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Extended `Service` interface with `related?: string[]` and populated all 7 service objects with exactly 2 locked cross-link slugs each
- Created `RelaterteTjenester.astro` shared component that resolves slugs from `services.ts`, guards empty state, and renders Card-as-anchor elements without nested anchors
- Wired the component between FAQ and CTA on all 7 service pages; build passes cleanly at 14 pages in 1.58s

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend services.ts with related field and pairings** - `bab80eb` (feat)
2. **Task 2: Create shared RelaterteTjenester.astro component** - `3335953` (feat)
3. **Task 3: Wire RelaterteTjenester into all 7 service index.astro files** - `0b076ed` (feat)

## Files Created/Modified

- `src/config/services.ts` - Added `related?: string[]` to Service interface; all 7 service objects populated with 2-slug pairings
- `src/components/sections/RelaterteTjenester.astro` - New shared section: resolves slugs, guards render, renders Cards
- `src/pages/tjenester/nettside/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/nettbutikk/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/landingsside/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/webapp/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/seo/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/ai/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA
- `src/pages/tjenester/vedlikehold/index.astro` - Import + `<RelaterteTjenester>` between FAQ and CTA

## Decisions Made

- `related?: string[]` is optional on the Service interface so future services can be added without pairings without breaking the component
- Cross-link pairings stored in `services.ts` as the single source of truth rather than hardcoded per page
- Component guard (`relatedServices.length > 0`) ensures no empty section renders if slugs fail to resolve

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Cross-link section live on all 7 service pages; ready for 10-02 (validation/audit pass)
- No blockers

---
*Phase: 10-cross-linking-validation*
*Completed: 2026-03-05*
