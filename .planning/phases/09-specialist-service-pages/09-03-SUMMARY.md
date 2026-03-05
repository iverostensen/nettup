---
phase: 09-specialist-service-pages
plan: 03
subsystem: ui
tags: [astro, seo, geo, json-ld, structured-data]

# Dependency graph
requires:
  - phase: 09-01
    provides: services.ts with seo service object (minPrice: 3000, monthlyPrice: 3000)
provides:
  - /tjenester/seo page with Hero, Inkludert, FAQ, CTA sections
  - FAQPage JSON-LD co-located in FAQ.astro
  - Service JSON-LD with PriceSpecification in index.astro
  - GEO differentiator prominently positioned in Hero and Inkludert
affects: [09-04, 09-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "4-section pattern (Hero + Inkludert + FAQ + CTA) for monthly service pages"
    - "FAQPage JSON-LD co-located in FAQ.astro (not index.astro)"
    - "Hero uses animate-fade-up for above-fold elements"
    - "Inkludert section communicates monthly deliverables, not vague outcome promises"

key-files:
  created:
    - src/pages/tjenester/seo/index.astro
    - src/pages/tjenester/seo/_sections/Hero.astro
    - src/pages/tjenester/seo/_sections/Inkludert.astro
    - src/pages/tjenester/seo/_sections/FAQ.astro
    - src/pages/tjenester/seo/_sections/CTA.astro
  modified: []

key-decisions:
  - "GEO (Generative Engine Optimization) positioned as key differentiator with ChatGPT and Perplexity named explicitly in Hero"
  - "Monthly price (fra 3 000 kr/mnd) is the sole price signal — no one-time price"
  - "CTA text is 'Start med en gratis gjennomgang' (ongoing service framing, not 'Få et gratis tilbud')"
  - "FAQPage JSON-LD co-located in FAQ.astro, consistent with 08-01/08-02/08-03 pattern"

patterns-established:
  - "SEO service page: Hero introduces GEO differentiator above fold; Inkludert lists concrete monthly deliverables"

requirements-completed: [PAGES-05]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 9 Plan 3: SEO Service Page Summary

**Complete /tjenester/seo page with GEO differentiation (ChatGPT/Perplexity named), monthly deliverables grid, FAQPage JSON-LD, and Service JSON-LD at minPrice 3000 NOK**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T12:19:33Z
- **Completed:** 2026-03-05T12:21:09Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Built /tjenester/seo page with 4-section structure (Hero, Inkludert, FAQ, CTA)
- Hero introduces GEO (Generative Engine Optimization) with ChatGPT and Perplexity named; monthly price as primary signal
- Inkludert section lists 7 concrete monthly deliverables, not vague outcome promises
- FAQ includes substantive GEO question with explanation; FAQPage JSON-LD co-located in FAQ.astro
- Service JSON-LD with PriceSpecification (minPrice: 3000) in index.astro; build passes cleanly (12 pages)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero, Inkludert, and CTA sections** - `6380cc5` (feat)
2. **Task 2: Create FAQ and index.astro** - `70ae01a` (feat)

**Plan metadata:** (docs: complete plan — pending)

## Files Created/Modified

- `src/pages/tjenester/seo/index.astro` - Page root with meta, Service JSON-LD, 4-section composition
- `src/pages/tjenester/seo/_sections/Hero.astro` - Outcome headline with GEO intro, monthly price, CTA
- `src/pages/tjenester/seo/_sections/Inkludert.astro` - 7-item monthly deliverables grid
- `src/pages/tjenester/seo/_sections/FAQ.astro` - 5 FAQs including GEO question; FAQPage JSON-LD
- `src/pages/tjenester/seo/_sections/CTA.astro` - Section CTA linking to /kontakt?tjeneste=seo

## Decisions Made

- GEO named explicitly in Hero alongside ChatGPT and Perplexity — key differentiator few Norwegian agencies offer
- Monthly price is the only price signal (no one-time project price shown)
- Inkludert framing: "Hva du får hver måned" with concrete deliverables, not outcome promises
- FAQPage JSON-LD co-located in FAQ.astro, consistent with established pattern from Phase 8

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /tjenester/seo page complete and building cleanly
- Pattern established: monthly service pages use the same 4-section structure with GEO/AI differentiation where relevant
- Ready for 09-04 and 09-05 (remaining specialist service pages)

---
*Phase: 09-specialist-service-pages*
*Completed: 2026-03-05*
