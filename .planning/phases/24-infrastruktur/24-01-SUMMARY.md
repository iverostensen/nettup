---
phase: 24-infrastruktur
plan: 01
subsystem: infra
tags: [astro, typescript, local-seo, static-routing, city-pages]

# Dependency graph
requires: []
provides:
  - "City TypeScript interface with tier, slug, name, intro, faq, nearbyAreas, metaTitle, metaDescription, industries?"
  - "ACTIVE_TIER constant for tier-gated routing (value: 1)"
  - "cities[] array with Oslo and Bærum stub entries"
  - "Dynamic /steder/[location].astro route with full section layout"
  - "Static pages: /steder/oslo and /steder/baerum"
affects: [25-byinnhold, 26-seo-lenker]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "City config follows projects.ts pattern: interface + exported array"
    - "Tier-gated routing: getStaticPaths() filters on city.tier <= ACTIVE_TIER"
    - "ASCII-only slugs for Norwegian city names (æ→ae, ø→o, å→a)"

key-files:
  created:
    - src/config/locations.ts
    - src/pages/steder/[location].astro
  modified: []

key-decisions:
  - "ACTIVE_TIER = 1 as exportable constant — tier-promotion requires changing only one line"
  - "details/summary HTML for FAQ — no animated accordion, keeps Phase 24 simple"
  - "nearbyAreas as slug array — display name resolved via cities.find() at render time"

patterns-established:
  - "Slug convention: æ→ae, ø→o, å→a, space→dash — documented as comment in locations.ts"
  - "Tier-filter pattern: cities.filter(city => city.tier <= ACTIVE_TIER) in getStaticPaths()"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03, INFRA-04]

# Metrics
duration: 8min
completed: 2026-03-08
---

# Phase 24 Plan 01: Infrastruktur — Bysideskelett Summary

**TypeScript City interface, ACTIVE_TIER constant, and dynamic /steder/[location].astro route generating static city pages for Oslo and Bærum**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-08T02:27:43Z
- **Completed:** 2026-03-08T02:35:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- `src/config/locations.ts` with full City interface, ACTIVE_TIER = 1, and two stub entries (Oslo, Bærum)
- `src/pages/steder/[location].astro` with tier-filtered getStaticPaths(), Breadcrumbs, Hero, FAQ, Nabobyer, and CTA sections
- Build passes cleanly — `/steder/oslo/index.html` and `/steder/baerum/index.html` generated
- Canonical URLs set automatically via BaseLayout; zero noindex tags on city pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Opprett locations.ts med City-interface og to stub-entries** - `da3cacf` (feat)
2. **Task 2: Opprett steder/[location].astro med getStaticPaths() og komplett sidelayout** - `f54cc0d` (feat)

## Files Created/Modified
- `src/config/locations.ts` — City interface, ACTIVE_TIER constant, cities[] array with Oslo and Bærum
- `src/pages/steder/[location].astro` — Dynamic route with tier-filtered getStaticPaths and five content sections

## Decisions Made
- Used `details`/`summary` HTML elements for FAQ — no animated accordion in Phase 24 (keeps scope minimal, Phase 25 can enhance)
- `nearbyAreas` stores slugs (not display names); display name resolved via `cities.find()` at render time — avoids data duplication
- `ACTIVE_TIER` exported as constant so Phase 25 tier promotion is a one-line change

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in `DeviceMockup.tsx` (Framer Motion Variants type) and `src/components/ui/index.ts` (Astro module resolution) were present before this plan and are out of scope. No errors in the files created here.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Infrastructure complete; Phase 25 can import `cities`, `ACTIVE_TIER`, and `City` from `@/config/locations`
- To promote more cities to active: add entry to `cities[]` with `tier: 1`
- To activate a tier: increment `ACTIVE_TIER` constant
- Phase 26 can add JSON-LD `Service` schema via `<Fragment slot="head">` on the existing page template

---
*Phase: 24-infrastruktur*
*Completed: 2026-03-08*
