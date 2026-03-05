---
phase: 07-tjenesteoversikt
plan: 02
subsystem: ui
tags: [astro, tjenester, json-ld, structured-data, services]

# Dependency graph
requires:
  - phase: 07-01
    provides: TjenesterOversikt.astro grouped service cards + FAQ.astro catalog rewrite
  - phase: 06-infrastructure
    provides: services.ts with 7 Service entries, minPrice/maxPrice fields
provides:
  - Live /tjenester page showing 7-service catalog (TjenesterOversikt + FAQ + TjenesterCTA)
  - JSON-LD with 7 Service schemas using PriceSpecification (no upper maxPrice when 0)
  - TjenesterCTA.astro updated to use "tjeneste" language (not "pakke")
affects:
  - 07-03 (individual tjeneste pages link back to /tjenester)
  - Any future CTA copy audits

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Conditional spread in JSON-LD: ...(service.maxPrice > 0 ? { maxPrice } : {}) omits field for open-ended prices"
    - "Fragment slot='head' for injecting per-page ld+json scripts into BaseLayout"

key-files:
  created: []
  modified:
    - src/pages/tjenester/index.astro
    - src/pages/tjenester/_sections/TjenesterCTA.astro

key-decisions:
  - "JSON-LD uses PriceSpecification with minPrice only when maxPrice === 0 (open-ended) — conditional spread pattern"
  - "Old Pakker/Inkludert/Support sections fully removed from /tjenester — no migration path needed"

patterns-established:
  - "PriceSpecification pattern: minPrice always present, maxPrice conditionally spread when > 0"

requirements-completed: [OVERVIEW-01, OVERVIEW-03]

# Metrics
duration: 5min
completed: 2026-03-05
---

# Phase 7 Plan 02: Tjenesteoversikt Wiring Summary

**Rewired /tjenester to show 7-service catalog via TjenesterOversikt.astro, with PriceSpecification JSON-LD from services.ts and "tjeneste" copy in TjenesterCTA — all legacy package-tier sections removed**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-05T08:25:00Z
- **Completed:** 2026-03-05T08:30:00Z
- **Tasks:** 3 (2 code + 1 human-verify checkpoint)
- **Files modified:** 2

## Accomplishments

- Fully replaced old Pakker/Inkludert/Support section structure in tjenester/index.astro with TjenesterOversikt + FAQ + TjenesterCTA
- Updated JSON-LD from old offer-based schema to 7 Service schemas with PriceSpecification (open-ended prices correctly omit maxPrice)
- Fixed TjenesterCTA heading from "Usikker på hvilken pakke?" to "Usikker på hvilken tjeneste?"
- Human verified page renders correctly: 2 groups, 7 cards, updated CTA and FAQ, no package-tier content

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite tjenester/index.astro** - `b2d58b6` (feat)
2. **Task 2: Update TjenesterCTA.astro** - `68ae6f5` (fix)
3. **Task 3: Checkpoint human-verify** - no code commit (approved by user)

## Files Created/Modified

- `src/pages/tjenester/index.astro` - Fully rewritten: imports TjenesterOversikt/FAQ/TjenesterCTA, generates 7 PriceSpecification JSON-LD schemas from services.ts
- `src/pages/tjenester/_sections/TjenesterCTA.astro` - Heading updated from "pakke" to "tjeneste"

## Decisions Made

- Conditional spread `...(service.maxPrice > 0 ? { maxPrice: service.maxPrice } : {})` used in JSON-LD to omit maxPrice for open-ended services (all 7 services have maxPrice: 0)
- No migration or redirect needed for removed Pakker/Inkludert/Support sections — they were internal components only

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /tjenester live with 7-service catalog — ready for Phase 8/9 individual tjeneste pages
- Each service card links to /tjenester/[slug] (expected 404 until individual pages are built)
- JSON-LD structured data in place for all 7 services

---
*Phase: 07-tjenesteoversikt*
*Completed: 2026-03-05*
