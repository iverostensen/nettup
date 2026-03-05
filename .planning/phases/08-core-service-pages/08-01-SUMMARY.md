---
phase: 08-core-service-pages
plan: 01
subsystem: ui
tags: [astro, seo, json-ld, service-pages, nettside]

# Dependency graph
requires:
  - phase: 07-tjenesteoversikt
    provides: services.ts config with Service interface and nettside slug
  - phase: 06-infrastructure
    provides: Breadcrumbs.astro, Section.astro, SectionHeader.astro, Button.astro UI primitives
provides:
  - /tjenester/nettside service page with Hero, Inkludert, FAQ, CTA sections
  - Service JSON-LD with PriceSpecification (minPrice: 15000, no maxPrice)
  - FAQPage JSON-LD with 5 nettside-specific questions
  - Page template pattern for remaining service sub-pages (nettbutikk, landingsside, webapp, seo, ai, vedlikehold)
affects: [08-core-service-pages, 09-remaining-service-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Service sub-page pattern: index.astro pulls service from services.ts, injects Service JSON-LD via Fragment slot="head", composes 4 sections (Hero, Inkludert, FAQ, CTA)
    - Hero above-fold: animate-fade-up classes with animation-delay (NOT reveal-on-scroll which stays invisible until scroll)
    - FAQ JSON-LD: inline in FAQ.astro (not index.astro) via <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
    - Service JSON-LD maxPrice handling: spread only when service.maxPrice > 0

key-files:
  created:
    - src/pages/tjenester/nettside/index.astro
    - src/pages/tjenester/nettside/_sections/Hero.astro
    - src/pages/tjenester/nettside/_sections/Inkludert.astro
    - src/pages/tjenester/nettside/_sections/FAQ.astro
    - src/pages/tjenester/nettside/_sections/CTA.astro
  modified: []

key-decisions:
  - "FAQPage JSON-LD stays in FAQ.astro (not index.astro) — keeps structured data co-located with the content it describes"
  - "Hero uses animate-fade-up (not reveal-on-scroll) for above-fold content — reveal-on-scroll is invisible until scroll trigger"
  - "Service JSON-LD injected via Fragment slot='head' in index.astro — mirrors /tjenester pattern"
  - "4-section page structure (Hero + Inkludert + FAQ + CTA) is the template for all service sub-pages"

patterns-established:
  - "Service sub-page: index.astro wires meta + Service JSON-LD + 4 sections"
  - "Inkludert section: checkmark grid with delay-${(index % 3) + 1} for staggered reveal"
  - "CTA pre-fills contact form: href=/kontakt?tjeneste={slug}"

requirements-completed: [PAGES-01, CONTENT-01, CONTENT-02, CONTENT-03, SEO-02, CTA-01]

# Metrics
duration: 2min
completed: 2026-03-05
---

# Phase 8 Plan 1: /tjenester/nettside Service Page Summary

**Complete /tjenester/nettside page with Service JSON-LD, FAQPage JSON-LD, outcome headline hero, 8-feature inkludert grid, and 5 nettside-specific FAQ answers**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T10:58:42Z
- **Completed:** 2026-03-05T11:00:18Z
- **Tasks:** 2
- **Files modified:** 5 created

## Accomplishments

- Built /tjenester/nettside as a fully buildable Astro page (build passes, 8 pages in 1.49s)
- Hero leads with outcome headline and price signal above the fold, CTA pre-fills /kontakt?tjeneste=nettside
- Service JSON-LD with PriceSpecification (minPrice 15000 kr, no maxPrice for open-ended pricing) in page head
- FAQPage JSON-LD with 5 nettside-specific questions co-located in FAQ.astro
- Established 4-section template pattern (Hero + Inkludert + FAQ + CTA) for all remaining service sub-pages

## Task Commits

1. **Task 1: Hero, Inkludert, CTA sections** - `a0e3a0b` (feat)
2. **Task 2: FAQ and index.astro** - `b166638` (feat)

## Files Created/Modified

- `src/pages/tjenester/nettside/index.astro` - Page root: meta, Service JSON-LD, section composition
- `src/pages/tjenester/nettside/_sections/Hero.astro` - Outcome headline + price signal + breadcrumbs + CTA
- `src/pages/tjenester/nettside/_sections/Inkludert.astro` - Checkmark grid, 8 nettside-specific features
- `src/pages/tjenester/nettside/_sections/FAQ.astro` - 5 service-specific Q&As + inline FAQPage JSON-LD
- `src/pages/tjenester/nettside/_sections/CTA.astro` - Section CTA linking to /kontakt?tjeneste=nettside

## Decisions Made

- FAQPage JSON-LD co-located in FAQ.astro (not index.astro) — structured data near the content it describes
- Hero uses `animate-fade-up` for above-fold content (not `reveal-on-scroll` which requires scroll trigger)
- Service JSON-LD injected via `Fragment slot="head"` matching the established /tjenester pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /tjenester/nettside is complete and live at build
- 4-section template pattern established for 08-02 (nettbutikk) and 08-03 (landingsside)
- No blockers

---
*Phase: 08-core-service-pages*
*Completed: 2026-03-05*
