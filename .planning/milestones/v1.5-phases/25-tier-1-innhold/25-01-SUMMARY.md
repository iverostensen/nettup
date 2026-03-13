---
phase: 25-tier-1-innhold
plan: 01
subsystem: content
tags: [locations, seo, city-pages, norwegian, content]

requires:
  - phase: 24-infrastruktur
    provides: City interface in locations.ts, steder/[location].astro template, ACTIVE_TIER constant

provides:
  - 8 complete Tier 1 city entries in locations.ts with unique, locally specific content
  - nearbyAreas symmetry map applied across all 8 cities
  - 3 FAQ items per city covering lokal tilstedeværelse, prosess, and pris
  - metaTitle and metaDescription for all 8 cities

affects: [25-02-jsonld, 25-03-footer-kontakt, sitemap, static generation]

tech-stack:
  added: []
  patterns:
    - "City entries differentiated via specific neighborhood references (not generic bynavn-swap)"
    - "FAQ format: 3 items per city in fixed order (tilstedeværelse → prosess → pris)"
    - "nearbyAreas uses pre-verified symmetry map — slugs only, no display names"
    - "priskalkulator references as plain text URLs (template + FAQPage JSON-LD compatible)"

key-files:
  created: []
  modified:
    - src/config/locations.ts

key-decisions:
  - "metaDescription capped at 160 chars — varied value props across cities to avoid duplicate meta"
  - "nearbyAreas symmetry map from plan spec applied exactly — no extra relationships added"
  - "FAQ price answers use plain text URL (nettup.no/priskalkulator) — works for both template rendering and FAQPage JSON-LD in plan 25-02"

patterns-established:
  - "Intro copy: 2-3 sentences, must reference specific local neighborhoods or landmarks"
  - "FAQ order: lokal tilstedeværelse → prosess/samarbeid → pris/leveringstid"
  - "All price FAQ: startpris 15 000 kr + priskalkulator plain text URL"

requirements-completed: [CONTENT-01, CONTENT-02, SEO-02]

duration: 5min
completed: 2026-03-08
---

# Phase 25 Plan 01: Tier 1 City Content Summary

**8 lokalt differensierte byer i locations.ts — unike intro-tekster med stedsnavn, 3 FAQ-items per by, symmetrisk nearbyAreas-kart, og full meta-tag dekning**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-08T02:50:00Z
- **Completed:** 2026-03-08T02:55:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Replaced 2 Oslo/Bærum stubs with full, locally specific content
- Added 6 new city entries: Asker, Sandvika, Drammen, Lillestrøm, Ski, Moss
- Each intro references specific neighborhoods (Grünerløkka, Bragernes, Jeløya, etc.) — not generic bynavn-swap
- All 8 cities have 3 FAQ items covering lokal tilstedeværelse, prosess, and pris with 15 000 kr startpris
- nearbyAreas symmetry map applied per plan spec — all slugs verified to resolve to existing entries
- Build passes cleanly: all 8 `/steder/{slug}` pages generated

## Task Commits

1. **Task 1: Write all 8 city entries in locations.ts** - `cbc50f0` (feat)

## Files Created/Modified

- `src/config/locations.ts` - 8 complete Tier 1 city entries replacing 2 stubs (190 additions, 12 deletions)

## Decisions Made

- metaDescription varied value props across cities to avoid duplicate meta content (Bærum: "Fra Lysaker til Sandvika", Sandvika: "Strategisk beliggenhet", Moss: "Fra sentrum til Jeløya", etc.)
- Sandvika entry differentiated from Bærum: focuses on commercial center character (Sandvika Storsenter, E18, business district) rather than the broader municipality
- priskalkulator references as plain-text URLs — compatible with both the Astro template renderer and FAQPage JSON-LD schema (plan 25-02)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 8 city entries complete and build-verified — plan 25-02 (JSON-LD) can proceed immediately
- FAQ plain-text priskalkulator URLs are ready for FAQPage schema in 25-02
- nearbyAreas slugs verified symmetric — 25-03 footer can iterate cities array directly

---
*Phase: 25-tier-1-innhold*
*Completed: 2026-03-08*
