---
phase: 06-infrastructure
plan: 02
subsystem: ui
tags: [react, navigation, floating-nav, mobile-menu, active-state]

# Dependency graph
requires:
  - phase: 06-01
    provides: services.ts config with slug/name fields used for dynamic label lookup
provides:
  - FloatingNav with startsWith active state and dynamic Tjenester label from services.ts
  - MobileMenu with matching startsWith active state
affects:
  - 06-03 (service sub-pages will use the corrected nav highlighting)
  - Any future nav changes must preserve startsWith pattern for /tjenester/*

# Tech tracking
tech-stack:
  added: []
  patterns:
    - startsWith active state for parent nav items with sub-pages
    - Dynamic nav label derived from URL slug + config lookup

key-files:
  created: []
  modified:
    - src/components/islands/FloatingNav.tsx
    - src/components/islands/MobileMenu.tsx

key-decisions:
  - "Dynamic label computed inline in FloatingNav (not stored in state) — re-derives on each render from currentPath + services array, no sync issues"
  - "displayNavItems passed to MobileMenu rather than having MobileMenu import services separately — single source of label logic"
  - "isNavItemActive helper function isolates the startsWith logic for readability"

patterns-established:
  - "Parent nav items with sub-pages use startsWith for active check, others use exact match"
  - "Dynamic nav labels are computed from the services config and passed down as props"

requirements-completed:
  - INFRA-02

# Metrics
duration: 5min
completed: 2026-03-04
---

# Phase 6 Plan 02: Nav Active State and Dynamic Label Summary

**FloatingNav and MobileMenu updated with startsWith active state and dynamic Tjenester label derived from services.ts slug lookup**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-04T17:20:00Z
- **Completed:** 2026-03-04T17:24:35Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- FloatingNav imports services and computes dynamic label when on /tjenester/[slug] (e.g. "Nettside" on /tjenester/nettside)
- Desktop nav and MobileMenu both highlight the Tjenester item on all /tjenester/* sub-pages
- isNavItemActive helper uses startsWith for /tjenester, exact match for all other items
- MobileMenu receives displayNavItems (with dynamic label) via prop — no duplicate logic

## Task Commits

Each task was committed atomically:

1. **Task 1: Dynamic label and startsWith active state in FloatingNav** - `31eafd8` (feat)
2. **Task 2: startsWith active state in MobileMenu** - `9d8fa63` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/islands/FloatingNav.tsx` - Added services import, tjenesterLabel computation, displayNavItems, isNavItemActive helper; updated desktop nav and MobileMenu prop
- `src/components/islands/MobileMenu.tsx` - Added isItemActive helper using startsWith for /tjenester; updated aria-current and className

## Decisions Made

- Dynamic label is computed inline (not useState) — derives from currentPath + services array on each render, keeping it simple and in sync automatically
- Single label computation in FloatingNav passed down to MobileMenu via displayNavItems prop — avoids duplicating the lookup logic in MobileMenu

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in `DeviceMockup.tsx` and `src/components/ui/index.ts` (unrelated to this plan's changes). Logged but not fixed per scope boundary rules. Full build passes cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Nav is now ready for service sub-pages — visiting /tjenester/nettside will correctly highlight "Nettside" in the nav once that page ships
- 06-03 (service sub-page scaffolding) can proceed immediately
- No blockers

---
*Phase: 06-infrastructure*
*Completed: 2026-03-04*
