---
phase: 08-core-service-pages
plan: "03"
subsystem: ui
tags: [astro, json-ld, seo, landingsside, structured-data]

requires:
  - phase: 08-core-service-pages-01
    provides: 4-section pattern (Hero + Inkludert + FAQ + CTA) for service sub-pages
  - phase: 06-infrastructure
    provides: services.ts with landingsside entry, Breadcrumbs.astro, Section, SectionHeader, Button components

provides:
  - /tjenester/landingsside page with Hero, Inkludert, FAQ, CTA sections
  - Service JSON-LD with PriceSpecification (minPrice 8000, no maxPrice)
  - FAQPage JSON-LD with 5 landingsside-specific questions
  - Unique meta title and description for landingsside route

affects: [08-core-service-pages, seo, sitemap]

tech-stack:
  added: []
  patterns:
    - "4-section service sub-page pattern (Hero + Inkludert + FAQ + CTA) applied consistently"
    - "Service JSON-LD in index.astro via Fragment slot=head; FAQPage JSON-LD co-located in FAQ.astro"
    - "maxPrice: 0 → omit from JSON-LD via conditional spread"

key-files:
  created:
    - src/pages/tjenester/landingsside/index.astro
    - src/pages/tjenester/landingsside/_sections/Hero.astro
    - src/pages/tjenester/landingsside/_sections/Inkludert.astro
    - src/pages/tjenester/landingsside/_sections/FAQ.astro
    - src/pages/tjenester/landingsside/_sections/CTA.astro
  modified: []

key-decisions:
  - "FAQPage JSON-LD co-located in FAQ.astro (consistent with 08-01/08-02 pattern)"
  - "Hero uses animate-fade-up (not reveal-on-scroll) for above-fold content"
  - "No maxPrice in Service JSON-LD — landingsside pricing is open-ended (maxPrice: 0)"

patterns-established:
  - "4-section pattern (Hero + Inkludert + FAQ + CTA) now established across all 3 core service pages"

requirements-completed: [PAGES-02]

duration: 2min
completed: 2026-03-05
---

# Phase 8 Plan 03: Landingsside Service Page Summary

**Focused /tjenester/landingsside page with conversion-oriented copy, 8 campaign-specific features, 5 ads-focused FAQ items, and Service + FAQPage JSON-LD — completing all three core service pages**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-05T11:06:01Z
- **Completed:** 2026-03-05T11:07:31Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Hero section with outcome-first headline, price signal (fra 8 000 kr), and CTA to `/kontakt?tjeneste=landingsside`
- Inkludert section with 8 landingsside-specific features: konverteringsfokusert layout, A/B-klar struktur, hurtig lasting, annonsekampanje-integrasjon, lead-capture, responsivt design, HTTPS/SSL, 30 dagers support
- FAQ with 5 ads-focused questions covering Google Ads, A/B testing, CRM/email integration, and conversion tracking — none duplicating /tjenester FAQ
- Service JSON-LD (minPrice: 8000, no maxPrice) and FAQPage JSON-LD in correct locations
- Build passes: 10 pages including /tjenester/landingsside

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero, Inkludert, CTA sections** - `806fd9f` (feat)
2. **Task 2: Create FAQ.astro and index.astro** - `3d8a53a` (feat)

**Plan metadata:** (pending docs commit)

## Files Created/Modified

- `src/pages/tjenester/landingsside/index.astro` — Page root: meta, Service JSON-LD, section composition
- `src/pages/tjenester/landingsside/_sections/Hero.astro` — Outcome headline + price signal + breadcrumbs + CTA
- `src/pages/tjenester/landingsside/_sections/Inkludert.astro` — Checkmark grid with 8 landingsside-specific features
- `src/pages/tjenester/landingsside/_sections/FAQ.astro` — 5 ads-specific FAQ items + inline FAQPage JSON-LD
- `src/pages/tjenester/landingsside/_sections/CTA.astro` — Section CTA linking to /kontakt?tjeneste=landingsside

## Decisions Made

- FAQPage JSON-LD co-located in FAQ.astro (consistent with 08-01/08-02 pattern — structured data near the content it describes)
- Hero uses animate-fade-up not reveal-on-scroll (above-fold content must be visible immediately)
- No maxPrice in JSON-LD — landingsside service is open-ended (maxPrice: 0 → omit via conditional spread)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All three core service pages complete: /tjenester/nettside, /tjenester/nettbutikk, /tjenester/landingsside
- Phase 08 complete — ready for next phase
- Build passes cleanly with 10 pages

---
*Phase: 08-core-service-pages*
*Completed: 2026-03-05*
