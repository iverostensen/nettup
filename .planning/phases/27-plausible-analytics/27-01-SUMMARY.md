---
phase: 27-plausible-analytics
plan: 01
subsystem: infra
tags: [plausible, analytics, typescript, astro]

requires: []
provides:
  - "Plausible CDN script in BaseLayout.astro and LandingPageLayout.astro"
  - "src/lib/analytics.ts with 7 typed tracker functions"
  - "src/env.d.ts with window.plausible optional type declaration"
affects:
  - "All downstream plans importing from analytics.ts (contact form, chatbot, wizard, city pages)"

tech-stack:
  added: ["Plausible Analytics (CDN, cookieless)"]
  patterns:
    - "analytics.ts single-source wrapper — all plausible() calls go through named tracker functions"
    - "SSR guard pattern: typeof window === 'undefined' check in every tracker"
    - "Optional chain guard: window.plausible?.() handles adblocker blocking without throwing"

key-files:
  created:
    - src/env.d.ts
    - src/lib/analytics.ts
  modified:
    - src/layouts/BaseLayout.astro
    - src/layouts/LandingPageLayout.astro

key-decisions:
  - "env.d.ts uses direct interface Window {} (global script, not module) — no declare global{} wrapper needed since file has no imports/exports"
  - "No transition:persist on Plausible script tag — Plausible handles SPA routing natively via history.pushState"
  - "buildEstimateRange() lives in analytics.ts — wizard callsites pass raw numbers, formatting is centralized"

patterns-established:
  - "analytics.ts is the single import point — never call window.plausible() directly from components"
  - "Tracker function names follow 'track' + PascalCase noun phrase pattern"

requirements-completed: [ANAL-01]

duration: 2min
completed: 2026-03-08
---

# Phase 27 Plan 01: Plausible Analytics Foundation Summary

**Plausible CDN script added to both layouts + typed analytics.ts wrapper with 7 tracker functions for contact, B2B, wizard, chatbot, and city CTA events**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-08T15:00:00Z
- **Completed:** 2026-03-08T15:02:00Z
- **Tasks:** 3
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments

- Created `src/env.d.ts` with `PlausibleOptions` interface and optional `window.plausible` Window augmentation
- Created `src/lib/analytics.ts` with 7 exported tracker functions, all SSR-safe and adblocker-safe
- Added `<script defer data-domain="nettup.no" src="https://plausible.io/js/script.js">` to both BaseLayout.astro and LandingPageLayout.astro

## Task Commits

1. **Task 1: Create src/env.d.ts** - `d28e0a4` (chore)
2. **Task 2: Create src/lib/analytics.ts + fix env.d.ts** - `241be44` (feat)
3. **Task 3: Add Plausible script to both layouts** - `a16cb04` (feat)

## Files Created/Modified

- `src/env.d.ts` - PlausibleOptions interface + Window.plausible optional type declaration
- `src/lib/analytics.ts` - 7 typed tracker functions with SSR + adblocker guards
- `src/layouts/BaseLayout.astro` - Plausible CDN script tag (between Analytics and ClientRouter)
- `src/layouts/LandingPageLayout.astro` - Plausible CDN script tag (after Analytics, before /head)

## Decisions Made

- `env.d.ts` drops the `declare global {}` wrapper — since the file has no imports/exports, TypeScript treats it as a global script already; the wrapper pattern is only needed inside module files
- No `transition:persist` on the script tag — Plausible's script includes native SPA support via history.pushState interception
- `buildEstimateRange()` is a private helper in analytics.ts, not exported — wizard components pass raw min/max numbers and formatting is centralized at the tracker layer

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed env.d.ts Window augmentation not applying**
- **Found during:** Task 2 (analytics.ts TypeScript verification)
- **Issue:** Plan specified `declare global { interface Window { ... } }` but tsc reported `Property 'plausible' does not exist on type 'Window'`. The `declare global {}` wrapper is only valid inside module-context files (files with imports/exports). `env.d.ts` is a global script with no imports, so the wrapper prevented augmentation.
- **Fix:** Removed `declare global {}` wrapper — wrote `interface Window {}` directly at the top level
- **Files modified:** `src/env.d.ts`
- **Verification:** `npx tsc --noEmit` no longer reports analytics.ts error
- **Committed in:** `241be44` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug in env.d.ts global augmentation pattern)
**Impact on plan:** Essential fix — without it, `window.plausible?.()` would have TypeScript errors in analytics.ts. No scope creep.

## Issues Encountered

- Astro emits a hint (code 4000) on `<script>` tags with attributes: "treated as is:inline". This is expected behavior for external CDN scripts — not an error, no action needed.

## User Setup Required

Plausible dashboard requires manual configuration before events are tracked:

1. Add site `nettup.no` at plausible.io/sites
2. No environment variables needed — domain is hardcoded as `data-domain="nettup.no"`
3. Custom event tracking requires Plausible's "Goals" feature to be configured per event name

## Next Phase Readiness

- analytics.ts is ready to import from any component in plans 27-02 through 27-05
- Script tag is live in both layouts — pageview tracking starts immediately on deploy
- Downstream plans: import named tracker functions from `@/lib/analytics`

---
*Phase: 27-plausible-analytics*
*Completed: 2026-03-08*
