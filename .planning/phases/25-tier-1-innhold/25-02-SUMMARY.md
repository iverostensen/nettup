---
phase: 25-tier-1-innhold
plan: 02
subsystem: seo
tags: [json-ld, schema-org, astro, structured-data, local-seo]

requires:
  - phase: 25-01
    provides: city data with faq array (plain-text answers) in locations.ts

provides:
  - Service JSON-LD with provider @id reference on every city page
  - FAQPage JSON-LD built from city.faq on every city page
  - No LocalBusiness duplication — canonical entity lives in BaseLayout only

affects: [phase-26-sitemap, any future city schema additions]

tech-stack:
  added: []
  patterns:
    - "City page schema: Service + FAQPage via slot='head' is:inline — never LocalBusiness on subpages"
    - "Provider reference pattern: { '@id': 'https://nettup.no/#business' } to canonical entity"

key-files:
  created: []
  modified:
    - src/pages/steder/[location].astro

key-decisions:
  - "is:inline required on slot='head' script tags in Astro to prevent bundling/deduplication of dynamic JSON-LD"
  - "provider @id pattern avoids Knowledge Graph entity dilution — only one LocalBusiness in the graph"

patterns-established:
  - "Subpage schema: reference canonical entity via @id, never redeclare LocalBusiness"
  - "FAQPage mainEntity built directly from city.faq — plain-text answers are JSON-LD safe"

requirements-completed: [SEO-01]

duration: 5min
completed: 2026-03-08
---

# Phase 25 Plan 02: JSON-LD Schemas Summary

**Service + FAQPage JSON-LD injected into every city page via Astro head slot, referencing canonical nettup.no/#business entity**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-08T03:07:00Z
- **Completed:** 2026-03-08T03:12:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Service schema with `areaServed` city reference and `provider @id` on all 8 Tier 1 city pages
- FAQPage schema with `mainEntity` array populated dynamically from `city.faq`
- Build passes cleanly — confirmed in oslo/index.html output

## Task Commits

1. **Task 1: Add Service and FAQPage JSON-LD to [location].astro** - `f8b8cc7` (feat)

**Plan metadata:** (docs commit — pending)

## Files Created/Modified

- `src/pages/steder/[location].astro` — Two `<script is:inline slot="head" type="application/ld+json">` blocks added before `<main>`

## Decisions Made

- `is:inline` attribute required alongside `slot="head"` — without it, Astro may bundle or deduplicate the dynamic script content
- `provider: { "@id": "https://nettup.no/#business" }` references the Organization schema declared in BaseLayout — zero LocalBusiness duplication on city pages

## Deviations from Plan

None — plan executed exactly as written. JSON-LD blocks were already present in the file; verified correctness and committed.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three Phase 25 plans complete (city content, JSON-LD, footer links)
- City pages are indexable with correct structured data
- Phase 26 (sitemap verification post-deploy) can proceed after first production deploy

---
*Phase: 25-tier-1-innhold*
*Completed: 2026-03-08*
