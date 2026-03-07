---
phase: 21-konfig-og-indeks
plan: 01
subsystem: ui
tags: [astro, typescript, projects, data-layer, seo]

requires:
  - phase: 20-innholdsforutsetninger
    provides: igive-hero.png and blom-hero.png screenshots committed to assets

provides:
  - Extended Project interface with slug, techStack, metrics, gallery, metaTitle, metaDescription, publishedAt
  - Both project entries (iGive + Blom Company) with Lighthouse metrics
  - pageLabels for /prosjekter/igive and /prosjekter/blom-company in BaseLayout
  - ProjectTeaser linking directly to /prosjekter/igive case study

affects:
  - phase-21-02 (ProjectGrid uses projects array and slug field)
  - phase-22 (case study pages use Project interface and all fields)

tech-stack:
  added: []
  patterns:
    - "Project interface as stable data contract — all fields defined here, consumed by grid + case study pages"
    - "pageLabels Record in BaseLayout provides human-readable breadcrumb labels for any route"

key-files:
  created: []
  modified:
    - src/config/projects.ts
    - src/layouts/BaseLayout.astro
    - src/pages/_home/ProjectTeaser.astro

key-decisions:
  - "comingSoon field retained in interface — harmless and may be useful for future projects"
  - "Blom Company url set to blom-no.vercel.app (staging) — update to live domain when available"
  - "challenge/solution/features fields kept on iGive entry — Phase 22 will use them for case study content"

patterns-established:
  - "Project data contract: all new projects need slug, techStack, publishedAt, metaTitle, metaDescription, metrics"

requirements-completed: [INFR-01, INFR-04]

duration: 3min
completed: 2026-03-07
---

# Phase 21 Plan 01: Konfig og Indeks Summary

**Extended Project interface with 6 new fields, Blom Company entry with measured Lighthouse scores, and BreadcrumbList wiring for both case study routes**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-07T21:57:26Z
- **Completed:** 2026-03-07T22:00:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Extended `Project` interface with `slug`, `techStack`, `publishedAt`, `metaTitle`, `metaDescription`, `metrics`, `gallery`, `testimonialId` — removes `caseStudySection` flag
- Added Blom Company as second project entry with measured Lighthouse scores (99/96/100/100)
- Added pageLabels for `/prosjekter/igive` and `/prosjekter/blom-company` so BreadcrumbList renders human-readable names
- Updated ProjectTeaser on homepage to link directly to `/prosjekter/igive` case study page

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend projects.ts interface and add Blom Company entry** - `2f36f85` (feat)
2. **Task 2: Add pageLabels entries + update ProjectTeaser link** - `0d73da6` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/config/projects.ts` - Extended interface, updated iGive entry, new Blom Company entry
- `src/layouts/BaseLayout.astro` - Added two pageLabels entries for case study routes
- `src/pages/_home/ProjectTeaser.astro` - Updated href from /prosjekter to /prosjekter/igive

## Decisions Made
- Retained `comingSoon` field as it's harmless and may be useful for future projects
- Set Blom Company url to `blom-no.vercel.app` (staging) with a note to update when live domain is ready
- Kept `challenge`, `solution`, `features` on iGive entry — Phase 22 will use them

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `projects` array and `Project` interface are the stable data contract Plan 21-02 (ProjectGrid) builds against
- Both project entries have all required fields for case study pages in Phase 22
- BreadcrumbList will render correctly for both case study routes once pages exist

---
*Phase: 21-konfig-og-indeks*
*Completed: 2026-03-07*
