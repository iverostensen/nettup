---
phase: 03-seo-portfolio
plan: "03"
subsystem: ui
tags: [astro, typescript, config, portfolio, projects]

# Dependency graph
requires:
  - phase: 03-seo-portfolio
    provides: /prosjekter page with hardcoded iGive case study markup
provides:
  - Typed Project interface and projects config array in src/config/projects.ts
  - Data-driven ProjectShowcase.astro rendering iGive case study from array
  - Scaffold for adding new projects by appending to projects array only
affects: [future portfolio additions, prosjekter page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Config-driven rendering: project data in src/config/*.ts, consumed by Astro sections
    - Case study vs. card rendering split on caseStudySection boolean flag

key-files:
  created:
    - src/config/projects.ts
  modified:
    - src/pages/prosjekter/_sections/ProjectShowcase.astro

key-decisions:
  - "caseStudySection boolean on Project interface determines full case study vs. card rendering — first project with flag=true gets the full layout"
  - "comingSoon badge rendered instead of external link when comingSoon=true — no dead links for future projects"
  - "Fixed typo 'Besok siden' -> 'Besøk siden' during refactor as quality improvement"

patterns-established:
  - "Config pattern: src/config/projects.ts holds typed data; Astro section imports and renders — same pattern as pricing.ts and launchOffer.ts"

requirements-completed: [PORT-01]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 03 Plan 03: Projects Config Scaffold Summary

**Typed Project interface and data-driven ProjectShowcase.astro — new projects added by appending to config array only**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-04T12:36:56Z
- **Completed:** 2026-03-04T12:38:16Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `src/config/projects.ts` with typed `Project` interface and iGive as first entry, following the existing config file pattern (`pricing.ts`, `launchOffer.ts`)
- Refactored `ProjectShowcase.astro` to import from config — zero hardcoded project text remains in the component
- iGive case study renders identically (same markup structure, same reveal-on-scroll classes, same challenge/solution/features content)
- Added card grid rendering for future non-case-study projects, hidden when none exist

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/config/projects.ts** - `e9ada78` (feat)
2. **Task 2: Refactor ProjectShowcase.astro to render from projects array** - `e32ca60` (refactor)

## Files Created/Modified
- `src/config/projects.ts` - Project interface + iGive entry with all case study data
- `src/pages/prosjekter/_sections/ProjectShowcase.astro` - Refactored to render from projects config

## Decisions Made
- `caseStudySection` boolean flag determines which rendering path each project takes: the first project with `caseStudySection === true` gets the full challenge/solution/features layout; all others render as cards
- `comingSoon` badge shown instead of external link when `comingSoon: true` — prevents dead links
- Fixed typographical error "Besok siden" -> "Besøk siden" as an in-scope quality improvement during the refactor

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Portfolio scaffold is in place: adding a new project requires only appending to `src/config/projects.ts`
- Future projects with `comingSoon: true` will render a card with a "Kommer snart" badge automatically
- Full case study layout is available for any project by setting `caseStudySection: true`

---
*Phase: 03-seo-portfolio*
*Completed: 2026-03-04*

## Self-Check: PASSED

- src/config/projects.ts: FOUND
- src/pages/prosjekter/_sections/ProjectShowcase.astro: FOUND
- .planning/phases/03-seo-portfolio/03-03-SUMMARY.md: FOUND
- Commit e9ada78: FOUND
- Commit e32ca60: FOUND
