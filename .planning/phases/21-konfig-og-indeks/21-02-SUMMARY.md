---
phase: 21-konfig-og-indeks
plan: 02
subsystem: ui
tags: [astro, projects, grid, card, portfolio]

# Dependency graph
requires:
  - phase: 21-01-konfig-og-indeks
    provides: projects.ts config with iGive and Blom Company entries, slug-based routing setup
provides:
  - ProjectGrid.astro section rendering all projects as equal peer cards in a 2-column grid
  - Updated prosjekter index page (Hero → ProjectGrid → ProsjekterCTA)
  - Removed obsolete ProjectShowcase.astro and Results.astro
affects: [phase-22-case-study-pages, prosjekter-index]

# Tech tracking
tech-stack:
  added: []
  patterns: [data-driven section from config array, aspect-video 16:9 image containers, group-hover card animation]

key-files:
  created:
    - src/pages/prosjekter/_sections/ProjectGrid.astro
  modified:
    - src/pages/prosjekter/index.astro
  deleted:
    - src/pages/prosjekter/_sections/ProjectShowcase.astro
    - src/pages/prosjekter/_sections/Results.astro

key-decisions:
  - "Cards render as <a> elements via Card as='a' with group class for hover effects on children"
  - "reveal-on-scroll applied per card with delay-1 and delay-2 for staggered animation"

patterns-established:
  - "ProjectGrid pattern: map over projects array from config, render Card per entry with slug-based href"
  - "Card hover group: add class='group block' to Card, use group-hover: on child elements"

requirements-completed: [INFR-02, INFR-03]

# Metrics
duration: 15min
completed: 2026-03-07
---

# Phase 21 Plan 02: ProjectGrid section replacing iGive-only showcase with scalable 2-column card grid

**2-column project card grid from projects.ts config, replacing hardcoded iGive-only ProjectShowcase with scalable peer card layout linking to slug-based case study URLs**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-07T22:00:00Z
- **Completed:** 2026-03-07T22:15:00Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 3 (1 created, 1 updated, 2 deleted)

## Accomplishments

- Created `ProjectGrid.astro` rendering iGive and Blom Company as equal peer cards in a responsive 2-column grid
- Each card shows 16:9 cover image, category badge, project type, name, tagline, and clickable "Se prosjektet →" link to `/prosjekter/[slug]`
- Deleted `ProjectShowcase.astro` and `Results.astro` — prosjekter index now only imports Hero, ProjectGrid, ProsjekterCTA
- Human verified: cards render correctly with scroll-reveal animations and correct slug-based links

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ProjectGrid.astro section** - `4b4e78d` (feat)
2. **Task 2: Update index.astro and delete obsolete section files** - `69d5138` (feat)
3. **Task 3: Verify project card grid renders correctly** - human-approved, no commit needed

## Files Created/Modified

- `src/pages/prosjekter/_sections/ProjectGrid.astro` - New 2-column grid section, data-driven from projects.ts
- `src/pages/prosjekter/index.astro` - Updated to Hero → ProjectGrid → ProsjekterCTA only
- `src/pages/prosjekter/_sections/ProjectShowcase.astro` - Deleted (was iGive-only hardcoded showcase)
- `src/pages/prosjekter/_sections/Results.astro` - Deleted (was iGive-only hardcoded metrics)

## Decisions Made

- Used `class="group block"` on Card component to enable `group-hover:` CSS classes on children (image scale + text color)
- Staggered reveal-on-scroll with delay-1/delay-2 per card index for smooth sequential appearance
- SEO description updated to be generic (two projects) rather than iGive-specific

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `/prosjekter` index is now a scalable multi-project grid — adding future projects requires only a new entry in `projects.ts`
- Phase 22 can now build individual case study pages at `/prosjekter/igive` and `/prosjekter/blom-company` — card links target those URLs already
- Cards currently lead to 404 pages — Phase 22 resolves this

---
*Phase: 21-konfig-og-indeks*
*Completed: 2026-03-07*
