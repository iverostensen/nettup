---
phase: 06-infrastructure
plan: 01
subsystem: infra
tags: [typescript, config, services]

# Dependency graph
requires: []
provides:
  - "Service interface with all required fields (slug, name, tagline, priceRange, minPrice, maxPrice, ctaParam, description)"
  - "services array with all 7 Nettup service offerings"
  - "Single source of truth for service metadata across all downstream components"
affects:
  - 06-infrastructure (plans 02, 03)
  - 07-service-pages
  - 08-tjenester-overview
  - 09-contact-form

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Config file pattern: interface export + named array export (same as pricing.ts)"

key-files:
  created:
    - src/config/services.ts
  modified: []

key-decisions:
  - "maxPrice: 0 used for all services (open-ended pricing, no upper bound)"
  - "ctaParam mirrors slug — simplest possible coupling for ?tjeneste= query param"
  - "Norwegian outcome-focused descriptions, not feature lists"

patterns-established:
  - "Service config pattern: TypeScript interface + named export array, following pricing.ts"

requirements-completed: [CONFIG-01, CONFIG-02]

# Metrics
duration: 1min
completed: 2026-03-04
---

# Phase 6 Plan 01: Services Config Summary

**TypeScript Service interface + 7-service array exported from src/config/services.ts as single source of truth for all downstream components**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-04T17:20:41Z
- **Completed:** 2026-03-04T17:21:29Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Created src/config/services.ts with exported Service interface and services array
- All 7 services defined: nettside, nettbutikk, landingsside, webapp, seo, ai, vedlikehold
- Norwegian taglines (under 10 words) and outcome-focused one-sentence descriptions
- Follows exact pattern of existing src/config/pricing.ts for consistency

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/config/services.ts** - `4931c1b` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/config/services.ts` - Service interface + all 7 service definitions with Norwegian copy

## Decisions Made

- `maxPrice: 0` for all services — all are open-ended (no advertised ceiling), consistent with business model
- `ctaParam` mirrors `slug` — simplest mapping for `?tjeneste=[ctaParam]` CTA links
- Descriptions focus on customer outcome, not technical features, per project tone guidelines

## Deviations from Plan

None — plan executed exactly as written.

Pre-existing TypeScript errors noted in DeviceMockup.tsx and ui/index.ts — these are out of scope (not caused by this task's changes). No errors in services.ts itself.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- services.ts is ready for import by FloatingNav, ContactForm, and all Phase 7+ service page components
- The `services.find(s => s.slug === ...)` and `services.map(...)` patterns are available immediately
- No blockers for Phase 6 plans 02 and 03

---
*Phase: 06-infrastructure*
*Completed: 2026-03-04*
