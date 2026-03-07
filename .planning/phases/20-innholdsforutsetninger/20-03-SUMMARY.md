---
phase: 20-innholdsforutsetninger
plan: 03
subsystem: ui
tags: [astro, images, screenshots, assets, portfolio]

# Dependency graph
requires:
  - phase: 20-innholdsforutsetninger
    provides: Visual content plan with locked filenames and Lighthouse scores
provides:
  - igive-hero.png (1600x900 screenshot of salg.igive.no)
  - igive-features.png (features/benefits section screenshot)
  - blom-hero.png (1600x900 screenshot of blomcompany.com)
  - blom-features.png (product/collection section screenshot)
  - All four import sites updated to igive-hero.png
  - salg.igive.no.png removed
  - npm run build passing with all images
affects:
  - phase-21 (imports these PNGs via Astro Image component for case study pages)
  - phase-22 (same dependency)
  - phase-23 (same dependency)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro Image optimization: PNG inputs auto-converted to webp at build time (multiple size variants)"

key-files:
  created:
    - src/assets/images/igive-hero.png
    - src/assets/images/igive-features.png
    - src/assets/images/blom-hero.png
    - src/assets/images/blom-features.png
  modified:
    - src/config/projects.ts
    - src/pages/_home/ProjectTeaser.astro
    - src/pages/nettside-for-bedrift/_sections/VisualProof.astro
    - src/pages/nettside-for-bedrift/_sections/Hero.astro
    - .planning/VISUAL-CONTENT-PLAN.md

key-decisions:
  - "salg.igive.no.png renamed to igive-hero.png for clean kebab-case — four import sites updated atomically (including one missed by plan: Hero.astro)"
  - "blomcompany.com DNS resolved — no fallback URL needed, VISUAL-CONTENT-PLAN.md unchanged"
  - "igive-hero.png had double extension (igive-hero.png.png) when saved — fixed before committing"

patterns-established:
  - "All screenshot imports must use @/assets/images/ path alias — Astro ENOENT at build time if file missing"

requirements-completed: [INNHOLD-03]

# Metrics
duration: 10min
completed: 2026-03-07
---

# Phase 20 Plan 03: Screenshots and Import Paths Summary

**Four project screenshots committed to src/assets/images/ with all four import sites updated to igive-hero.png, salg.igive.no.png removed, and npm run build passing cleanly**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-07T21:50:00Z
- **Completed:** 2026-03-07T21:57:00Z
- **Tasks:** 3 (1 human-action gate + 2 auto)
- **Files modified:** 9

## Accomplishments

- Four PNG screenshots captured and committed: igive-hero.png, igive-features.png, blom-hero.png, blom-features.png
- salg.igive.no.png removed, all four import sites updated to igive-hero.png
- VISUAL-CONTENT-PLAN.md marked [x] for all four screenshot entries
- npm run build passes cleanly — Astro generates 4 optimized webp variants of igive-hero.png

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture screenshots** - Human action gate (no commit — human delivered files)
2. **Task 2 + 3: Update imports and validate build** - `6df3da0` (feat)

## Files Created/Modified

- `src/assets/images/igive-hero.png` - iGive hero screenshot (1600x900, 2.7MB)
- `src/assets/images/igive-features.png` - iGive features section screenshot (803KB)
- `src/assets/images/blom-hero.png` - Blom Company hero screenshot (5.9MB)
- `src/assets/images/blom-features.png` - Blom Company product section screenshot (3.5MB)
- `src/config/projects.ts` - Import updated to igive-hero.png
- `src/pages/_home/ProjectTeaser.astro` - Import updated to igive-hero.png
- `src/pages/nettside-for-bedrift/_sections/VisualProof.astro` - Import updated to igive-hero.png
- `src/pages/nettside-for-bedrift/_sections/Hero.astro` - Import updated (Rule 1 auto-fix)
- `.planning/VISUAL-CONTENT-PLAN.md` - All four screenshot entries marked [x]

## Decisions Made

- blomcompany.com DNS resolved — no fallback to blom-no.vercel.app needed
- igive-hero.png had double extension when saved by user (`igive-hero.png.png`) — fixed by rename before staging

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed fourth import site not listed in plan**
- **Found during:** Task 2 (grep verification after updating three known sites)
- **Issue:** `src/pages/nettside-for-bedrift/_sections/Hero.astro` also imported `salg.igive.no.png` — plan only listed three sites, this one was missed
- **Fix:** Updated import to `igive-hero.png`, same as other three
- **Files modified:** src/pages/nettside-for-bedrift/_sections/Hero.astro
- **Verification:** `grep -r "salg\.igive\.no\.png" src/ | wc -l` returned 0
- **Committed in:** 6df3da0 (Task 2 commit)

**2. [Rule 3 - Blocking] Fixed double-extension filename**
- **Found during:** Task 1 verification (ls -lh src/assets/images/)
- **Issue:** igive-hero.png was saved as `igive-hero.png.png` (Finder doubled the extension)
- **Fix:** `mv igive-hero.png.png igive-hero.png` before staging
- **Files modified:** src/assets/images/igive-hero.png
- **Verification:** ls confirmed correct filename, build processed it successfully
- **Committed in:** 6df3da0 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for build correctness. No scope creep.

## Issues Encountered

- Double file extension on igive-hero.png — fixed before commit (see deviation 2 above)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four PNG files committed and build-verified — phase 21 can safely add `<Image>` imports for case study pages
- blom-hero.png and blom-features.png are large (5.9MB, 3.5MB) — Astro's build-time optimization handles this (outputs webp), but original PNGs in git will grow repo size
- Phase 21 dependency satisfied: INNHOLD-03 complete

---
*Phase: 20-innholdsforutsetninger*
*Completed: 2026-03-07*
