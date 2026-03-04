---
phase: 03-seo-portfolio
plan: "02"
subsystem: seo
tags: [json-ld, schema.org, service-schema, structured-data, astro]

# Dependency graph
requires:
  - phase: 03-seo-portfolio-01
    provides: BreadcrumbList schema and slot name="head" pattern established in BaseLayout
provides:
  - Three Service JSON-LD schemas on /tjenester (Enkel, Standard, Premium) with provider, areaServed, and NOK pricing
  - BaseLayout <slot name="head" /> enabling per-page head injection from any Astro page
affects: [future SEO plans that need per-page head slot injection]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-page head slot injection via Fragment slot="head" in BaseLayout, Service JSON-LD computed from existing pricing config array]

key-files:
  created: []
  modified:
    - src/layouts/BaseLayout.astro
    - src/pages/tjenester/index.astro

key-decisions:
  - "BaseLayout head slot added just before </head> after Analytics/ClientRouter — clean injection point for per-page schemas"
  - "Service schemas computed from pakker array at build time — no duplicate data, single source of truth from pricing.ts"
  - "launchPrice spaces stripped with .replace(/\\s/g, '') to produce numeric string (2500, 4500, 10000) for offers.price field"
  - "FAQ.astro FAQPage schema not duplicated — it uses is:inline and was already present before this plan"

patterns-established:
  - "Per-page head injection: use Fragment slot='head' in page, <slot name='head' /> in BaseLayout"
  - "Schema data sourced from config arrays: import and map at build time rather than duplicating data"

requirements-completed: [SEO-02]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 03 Plan 02: Service JSON-LD Schemas Summary

**Three Service JSON-LD schemas injected into /tjenester at build time, computed from pricing.ts pakker array, with numeric NOK prices and FAQPage schema preserved (not duplicated)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-04T13:31:14Z
- **Completed:** 2026-03-04T13:31:38Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Added `<slot name="head" />` to BaseLayout.astro enabling any Astro page to inject into `<head>`
- Computed 3 Service schemas from `pakker` array in tjenester/index.astro frontmatter
- Injected schemas via `<Fragment slot="head">` — correctly placed in `<head>` of built HTML
- Verified: 3x `"@type":"Service"`, 1x `"@type":"FAQPage"`, prices 2500/4500/10000 (no spaces), names "Nettup Enkel/Standard/Premium", areaServed Norway

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Service schemas to /tjenester via slot** - `115dc4d` (feat)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Added `<slot name="head" />` just before `</head>` for per-page head injection
- `src/pages/tjenester/index.astro` - Imported pakker, computed serviceSchemas, injected via Fragment slot="head"

## Decisions Made
- BaseLayout slot placed after Analytics/ClientRouter to keep schemas at end of head — clean separation from global schemas
- Price strings stripped of spaces via `.replace(/\s/g, '')` so `offers.price` is a numeric string ("2500" not "2 500")
- FAQPage schema in FAQ.astro left untouched — it uses `is:inline` and renders correctly as-is

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- BaseLayout head slot is now available for any future per-page schema injection (e.g., Article schema for blog, Product schema for e-commerce)
- All 3 Service schemas validated in built HTML output
- Ready for next SEO plan (03-03)

---
*Phase: 03-seo-portfolio*
*Completed: 2026-03-04*
