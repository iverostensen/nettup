---
phase: 02-animation-interaction
plan: "02"
subsystem: ui
tags: [react, framer-motion, animation, hero, astro-island]

# Dependency graph
requires:
  - phase: 02-animation-interaction/02-01
    provides: animation.ts preset library (heroContainer, fadeUp, springPop, fadeIn, springs)
provides:
  - HeroIsland.tsx: React island with orchestrated Framer Motion spring animation sequence
  - Hero.astro: Thin Astro shell rendering HeroIsland client:load
affects:
  - homepage visual impression and perceived performance
  - any future hero redesign or A/B tests

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Astro island as thin shell delegating all logic to React component
    - heroContainer variant stagger orchestrates children via variants prop (not explicit delays)
    - useReducedMotion guard: static fallback renders content without motion.* wrappers
    - Stats card sub-items use explicit delay per index instead of stagger (simpler for small lists)

key-files:
  created:
    - src/components/islands/HeroIsland.tsx
  modified:
    - src/pages/_home/Hero.astro

key-decisions:
  - "Stats card row items use explicit per-index delay (0.45 + i*0.07) rather than a nested stagger container — simpler for 4 items"
  - "Reduced motion path renders plain HTML without motion.* wrappers — content visible immediately with no transition overhead"
  - "Right-side stats card uses aria-hidden since it is decorative — screen readers get h1 and p content instead"

patterns-established:
  - "Hero island pattern: section + grain-overlay on root element, bg-surface applied in TSX since no Astro wrapper"
  - "Two-column hero: motion.div with heroContainer on left, standalone motion.div with springPop + explicit delay on right"

requirements-completed: [ANIM-02]

# Metrics
duration: 2min
completed: 2026-03-03
---

# Phase 02 Plan 02: Hero Animation Island Summary

**HeroIsland.tsx React island with orchestrated Framer Motion spring sequence, two-column desktop layout, and floating stats card replacing CSS-animated Hero.astro**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-03T19:25:07Z
- **Completed:** 2026-03-03T19:26:36Z
- **Tasks:** 3 (including human verification checkpoint — approved)
- **Files modified:** 2

## Accomplishments

- Created HeroIsland.tsx with heroContainer stagger orchestration — left column children reveal with 60ms stagger using fadeUp + spring physics
- Stats card (lastetid, Lighthouse, levering, fastpris) animates with springPop at delay 0.35s, row items stagger from 0.45s
- Replaced 98-line Hero.astro (video, DeviceMockup, CSS animations) with 5-line thin shell rendering HeroIsland client:load
- useReducedMotion guard renders all content statically — no animation overhead for accessibility users
- RotatingText preserved and rendered inline in h1
- Build passes in 2.03s, HeroIsland.js bundle: 7.24 kB (1.80 kB gzipped)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create HeroIsland.tsx** - `029c638` (feat)
2. **Task 2: Replace Hero.astro** - `b74de6b` (feat)
3. **Task 3: Human verification checkpoint** - Approved by user

## Files Created/Modified

- `/Users/iverostensen/nettup/src/components/islands/HeroIsland.tsx` - New React island: orchestrated spring animation, two-column layout, stats card, useReducedMotion guard
- `/Users/iverostensen/nettup/src/pages/_home/Hero.astro` - Replaced with thin 5-line shell importing and rendering HeroIsland

## Decisions Made

- Stats card row items use explicit per-index delay (`0.45 + i * 0.07`) rather than a nested stagger container — simpler for 4 items, avoids extra motion.div parent
- Reduced motion path renders plain HTML without motion.* wrappers — content visible immediately with no transition overhead
- Right-side stats card uses `aria-hidden` since it is decorative — screen readers get h1 and p text content instead
- The `cn` utility was imported in plan but ultimately not needed — component uses direct className strings without conditional merging

## Deviations from Plan

None - plan executed exactly as written. The `cn` import mentioned in the plan spec was omitted since no conditional class merging was needed (cleaner without it).

## Issues Encountered

None. Pre-existing TypeScript errors in `DeviceMockup.tsx` and `src/components/ui/index.ts` were unrelated to this plan's changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- HeroIsland visually verified and approved — spring animation sequence confirmed working in browser
- Two-column desktop layout and mobile single-column layout verified
- Scroll-reveal section animations (02-03) can follow the same stagger pattern established here

---
*Phase: 02-animation-interaction*
*Completed: 2026-03-03*
