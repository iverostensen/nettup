---
phase: 02-animation-interaction
plan: "01"
subsystem: ui
tags: [framer-motion, animation, typescript, react]

# Dependency graph
requires: []
provides:
  - Centralized Framer Motion variant presets and timing constants in src/lib/animation.ts
  - duration, delay, springs, fadeUp, fadeIn, springPop, slideLeft, slideRight, staggerContainer, heroContainer exports
  - RotatingText and FloatingNav migrated to use animation.ts timing tokens

affects:
  - 02-animation-interaction (all subsequent plans depend on animation.ts as single source of truth)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Import animation.ts duration/delay/springs instead of hardcoding transition values in TSX
    - hidden/visible Variants pattern for initial/animate on motion.* elements
    - staggerContainer and heroContainer for parent-level orchestration

key-files:
  created:
    - src/lib/animation.ts
  modified:
    - src/components/islands/RotatingText.tsx
    - src/components/islands/FloatingNav.tsx

key-decisions:
  - "duration.normal (0.3s) used in RotatingText instead of original 0.4 — closest brand token, easeOut easing preserved"
  - "duration.fast (0.15s) used in FloatingNav instead of original 0.2 — closest brand token for snappy nav animation"
  - "Pre-existing TypeScript errors in DeviceMockup.tsx and ui/index.ts are out of scope and not fixed"

patterns-established:
  - "Pattern: All Framer Motion timing imported from @/lib/animation — never hardcode numeric duration/delay in TSX"
  - "Pattern: Variant presets use hidden/visible keys for consistent initial/animate interface"
  - "Pattern: Spring presets in springs.* for interactive elements (snappy, gentle, pop)"

requirements-completed: [ANIM-01]

# Metrics
duration: 1min
completed: 2026-03-03
---

# Phase 02 Plan 01: Animation Preset Library Summary

**Framer Motion timing constants and variant presets centralized in src/lib/animation.ts with RotatingText and FloatingNav migrated off hardcoded values**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-03T19:21:41Z
- **Completed:** 2026-03-03T19:23:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created src/lib/animation.ts with full export surface: duration, delay, springs, fadeUp, fadeIn, springPop, slideLeft, slideRight, staggerContainer, heroContainer
- All timing values in seconds (Framer Motion format), derived from brand.ts ms values
- Migrated RotatingText.tsx from hardcoded 0.4 to duration.normal (0.3)
- Migrated FloatingNav.tsx from hardcoded 0.2 to duration.fast (0.15)
- Build passes cleanly, no new TypeScript errors introduced

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/lib/animation.ts preset library** - `d3b0d3d` (feat)
2. **Task 2: Migrate RotatingText and FloatingNav to animation.ts** - `9713368` (feat)

## Files Created/Modified

- `src/lib/animation.ts` - Centralized Framer Motion variant presets and timing constants (new file)
- `src/components/islands/RotatingText.tsx` - Import duration from animation.ts, replace hardcoded 0.4
- `src/components/islands/FloatingNav.tsx` - Import duration from animation.ts, replace hardcoded 0.2

## Decisions Made

- duration.normal (0.3s) chosen for RotatingText over the original 0.4 — nearest brand token, easeOut easing preserved unchanged
- duration.fast (0.15s) chosen for FloatingNav over the original 0.2 — nearest brand token for a snappy nav entry
- Pre-existing TypeScript errors in DeviceMockup.tsx and ui/index.ts are out-of-scope pre-existing issues, not introduced by this plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript errors in DeviceMockup.tsx (Variants type mismatch) and ui/index.ts (missing Astro module declarations) exist in the codebase but are unrelated to this plan. They did not block the build (`npm run build` passes). Logged to deferred-items.

## Next Phase Readiness

- animation.ts is the single source of truth for all Framer Motion timing and variant presets
- All Phase 2 animation work (hero animations, scroll reveals, hover states) should import from @/lib/animation
- Ready for 02-02 (hero animation) and subsequent plans

---
*Phase: 02-animation-interaction*
*Completed: 2026-03-03*
