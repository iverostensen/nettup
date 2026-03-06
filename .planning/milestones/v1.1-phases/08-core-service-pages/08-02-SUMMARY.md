---
phase: 08-core-service-pages
plan: 02
subsystem: ui
tags: [astro, shopify, json-ld, faq, service-page, nettbutikk]

# Dependency graph
requires:
  - phase: 08-core-service-pages
    provides: 4-section pattern (Hero + Inkludert + FAQ + CTA) established in 08-01
  - phase: 06-infrastructure
    provides: services.ts nettbutikk entry, Breadcrumbs.astro, Button.astro, Section.astro, SectionHeader.astro

provides:
  - /tjenester/nettbutikk complete service page with Hero, Inkludert, FAQ, CTA sections
  - Shopify fee disclosure (CONTENT-04 requirement)
  - 3-step "Slik fungerer det" process sequence in Inkludert
  - Service JSON-LD with PriceSpecification (minPrice: 25000, maxPrice omitted)
  - FAQPage JSON-LD with 5 nettbutikk-specific questions

affects: [08-03-nettside-for-bedrift, sitemap]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shopify fee disclosure: visible footnote below features grid, class='mt-6 text-sm text-text-muted', asterisk prefix"
    - "3-step process sequence: h3 + ol inside Inkludert section, numbered circle badges with bg-brand text-surface"
    - "maxPrice omitted from JSON-LD when value is 0 (open-ended pricing)"

key-files:
  created:
    - src/pages/tjenester/nettbutikk/index.astro
    - src/pages/tjenester/nettbutikk/_sections/Hero.astro
    - src/pages/tjenester/nettbutikk/_sections/Inkludert.astro
    - src/pages/tjenester/nettbutikk/_sections/FAQ.astro
    - src/pages/tjenester/nettbutikk/_sections/CTA.astro
  modified: []

key-decisions:
  - "Shopify fee disclosure placed as visible footnote below features grid — not in footer fine print, not headlined"
  - "3-step process sequence embedded in Inkludert.astro (not a separate component) — simpler, no overhead"
  - "FAQPage JSON-LD co-located in FAQ.astro — consistent with 08-01 nettside pattern"

patterns-established:
  - "Nettbutikk-specific: Shopify fee disclosure pattern with asterisk prefix below grid"
  - "Process sequence pattern: numbered ol with bg-brand circle badges inside Inkludert"

requirements-completed: [PAGES-03, CONTENT-04]

# Metrics
duration: 3min
completed: 2026-03-05
---

# Phase 8 Plan 02: Nettbutikk Service Page Summary

**Shopify nettbutikk service page with 8-feature checkmark grid, 3-step process sequence, mandatory fee disclosure, and 5-question FAQ — all with Service + FAQPage JSON-LD**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-05T11:02:11Z
- **Completed:** 2026-03-05T11:05:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Built complete /tjenester/nettbutikk with Hero, Inkludert, FAQ, CTA sections
- Implemented Shopify fee disclosure (CONTENT-04 locked requirement): "Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify."
- Added 3-step "Slik fungerer det" process sequence to justify nettbutikk's higher price point
- Service JSON-LD with PriceSpecification (minPrice: 25000, maxPrice omitted for open-ended pricing)
- FAQPage JSON-LD with 5 nettbutikk-specific questions covering Shopify licensing, Vipps, product upload, admin panel

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero, Inkludert, CTA sections** - `803814a` (feat)
2. **Task 2: Create FAQ.astro and index.astro** - `3e10d27` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/pages/tjenester/nettbutikk/index.astro` - Page root with Service JSON-LD, unique meta title, section composition
- `src/pages/tjenester/nettbutikk/_sections/Hero.astro` - Outcome headline, price signal (fra 25 000 kr), breadcrumbs, CTA
- `src/pages/tjenester/nettbutikk/_sections/Inkludert.astro` - 8-feature checkmark grid, 3-step process, Shopify fee note
- `src/pages/tjenester/nettbutikk/_sections/FAQ.astro` - 5 nettbutikk-specific questions + FAQPage JSON-LD
- `src/pages/tjenester/nettbutikk/_sections/CTA.astro` - Section CTA linking to /kontakt?tjeneste=nettbutikk

## Decisions Made

- Shopify fee disclosure placed as visible footnote below features grid, not hidden in footer fine print and not headlined — balances transparency with non-alarmism
- 3-step process sequence embedded directly in Inkludert.astro using h3 + ol — no separate component needed for 3 steps
- FAQPage JSON-LD co-located in FAQ.astro, consistent with 08-01 pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- /tjenester/nettbutikk complete and buildable
- 4-section pattern (Hero + Inkludert + FAQ + CTA) confirmed stable across two service pages
- Ready for 08-03 (remaining service pages) — same pattern applies
- Build passes cleanly: 9 pages in 1.41s

---
*Phase: 08-core-service-pages*
*Completed: 2026-03-05*
