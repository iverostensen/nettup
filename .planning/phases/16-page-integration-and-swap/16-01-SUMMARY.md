---
phase: 16-page-integration-and-swap
plan: 01
subsystem: ui
tags: [astro, react, priskalkulator, breadcrumbs, json-ld]

requires:
  - phase: 15-result-display
    provides: SmartPrisKalkulator with ResultStep — the component being embedded on the new page

provides:
  - Standalone /priskalkulator page (hero + SmartPrisKalkulator + CTA)
  - BaseLayout pageLabels entry for /priskalkulator enabling breadcrumb JSON-LD
  - Verified wizard directory has zero dead code

affects: [sitemap, seo, breadcrumbs]

tech-stack:
  added: []
  patterns:
    - "Inline page structure (hero in Section + client island + CTA) for tool/calculator pages"

key-files:
  created:
    - src/pages/priskalkulator/index.astro
  modified:
    - src/layouts/BaseLayout.astro

key-decisions:
  - "/priskalkulator not added to FloatingNav — tool page, not a top-level section (per prior decision)"
  - "Hero and calculator on same page without SectionHeader — page hero already sets context"

patterns-established:
  - "Tool pages use inline structure: hero Section + island Section + shared CTA, no separate _sections/ directory"

requirements-completed: [PAGE-01, PAGE-02, PAGE-03]

duration: 2min
completed: 2026-03-06
---

# Phase 16 Plan 01: Page Integration and Swap Summary

**Dedicated /priskalkulator page with SmartPrisKalkulator standalone, breadcrumb JSON-LD wired via pageLabels, and wizard directory confirmed free of dead code**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-06T14:30:38Z
- **Completed:** 2026-03-06T14:32:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created `src/pages/priskalkulator/index.astro` — standalone page with Norwegian hero, SmartPrisKalkulator (`client:visible`), and shared CTA section
- Added `'/priskalkulator': 'Prisestimator'` to BaseLayout `pageLabels` record — breadcrumb JSON-LD now resolves "Prisestimator" for the path
- Audited all 8 files under `src/components/islands/wizard/` — every file is actively imported, zero dead code
- Confirmed zero `PrisKalkulatorIsland` references remain in `src/`
- `/tjenester` embed via `PrisKalkulator.astro` is unchanged and still renders `SmartPrisKalkulator client:visible`
- Build passes cleanly (6 pages now including /priskalkulator, sitemap auto-updated)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create /priskalkulator page and add pageLabels entry** - `33b53ea` (feat)
2. **Task 2: Audit wizard directory** - no commit (audit only — no files changed or deleted)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/pages/priskalkulator/index.astro` — Standalone calculator page: BaseLayout with title/description, hero Section, SmartPrisKalkulator island, CTA
- `src/layouts/BaseLayout.astro` — pageLabels extended with `/priskalkulator: 'Prisestimator'`

## Decisions Made

- No FloatingNav entry for /priskalkulator — per existing decision it is a tool page, not a top-level nav section
- No separate `_sections/` directory for the calculator page — page is simple enough for inline structure

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 16 plan 01 complete — v1.2 milestone (Smart Priskalkulator) is now fully delivered
- /priskalkulator is publicly accessible as a standalone page
- /tjenester continues to embed the calculator identically
- No dead code remaining in the wizard directory

---
*Phase: 16-page-integration-and-swap*
*Completed: 2026-03-06*
