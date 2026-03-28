---
phase: 36-meta-pixel-full-site-event-tracking
plan: 02
subsystem: tracking
tags: [meta-pixel, fbq, viewcontent, lead, utm, retargeting, facebook-ads]

requires:
  - phase: 36-01
    provides: "Unified consent IIFE with gtag + fbq in both layouts, consent banner"
provides:
  - "ViewContent events on 5 high-value pages for retargeting segmentation"
  - "Lead conversion event on /takk for Meta Pixel attribution"
  - "5-param UTM capture (source, medium, campaign, content, term) for Facebook attribution"
affects: [37-privacy-compliance]

tech-stack:
  added: []
  patterns: [per-page-consent-gated-fbq, data-astro-rerun-for-view-transitions, tdd-utm-expansion]

key-files:
  created:
    - src/lib/__tests__/utm.test.ts
  modified:
    - src/pages/nettside-for-bedrift/index.astro
    - src/pages/nettside-for-bedrift/takk.astro
    - src/pages/priskalkulator/index.astro
    - src/pages/tjenester/nettside/index.astro
    - src/pages/tjenester/nettbutikk/index.astro
    - src/pages/tjenester/landingsside/index.astro
    - src/lib/utm.ts

key-decisions:
  - "All fbq events dual-gated on localStorage consent + window.fbq existence"
  - "BaseLayout pages use data-astro-rerun for correct view transition re-execution"
  - "UTM expansion is a one-line change -- existing iteration pattern handles new keys automatically"

requirements-completed: [TRACK-04, TRACK-05, TRACK-06]

duration: 3min
completed: 2026-03-28
---

# Phase 36 Plan 02: Per-Page Events and UTM Expansion Summary

**ViewContent events on 5 retargeting pages, Lead conversion on /takk, and 5-param UTM capture for full Facebook attribution**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-28T17:25:26Z
- **Completed:** 2026-03-28T17:29:01Z
- **Tasks:** 2
- **Files modified:** 7
- **Files created:** 1

## Accomplishments

- ViewContent events fire on 5 pages with content_name values for retargeting segmentation: 'B2B Landingsside', 'Priskalkulator', 'Nettside', 'Nettbutikk', 'Landingsside'
- Lead conversion event fires on /nettside-for-bedrift/takk alongside existing gtag and Plausible events (triple tracking)
- All 6 tracking scripts are consent-gated via localStorage nettup_ads_consent check AND window.fbq existence check
- UTM capture expanded from 3 to 5 params (added utm_content, utm_term) -- form components auto-include via getUtmParams spread
- 4 new Vitest tests covering 5-param capture and retrieval (TDD: RED then GREEN)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add ViewContent and Lead events to page files** - `3a2a422` (feat)
2. **Task 2: TDD RED - Add failing UTM tests** - `1e5361d` (test)
3. **Task 2: TDD GREEN - Expand UTM_KEYS to 5 params** - `1aa33cc` (feat)

## Files Created/Modified

- `src/pages/nettside-for-bedrift/index.astro` - ViewContent event with content_name 'B2B Landingsside'
- `src/pages/nettside-for-bedrift/takk.astro` - Lead event added alongside existing gtag + Plausible events
- `src/pages/priskalkulator/index.astro` - ViewContent event with data-astro-rerun
- `src/pages/tjenester/nettside/index.astro` - ViewContent event with data-astro-rerun
- `src/pages/tjenester/nettbutikk/index.astro` - ViewContent event with data-astro-rerun
- `src/pages/tjenester/landingsside/index.astro` - ViewContent event with data-astro-rerun
- `src/lib/utm.ts` - UTM_KEYS expanded from 3 to 5 entries
- `src/lib/__tests__/utm.test.ts` - 4 tests for 5-param UTM capture and retrieval

## Decisions Made

None beyond plan -- followed plan as specified.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed UTM test mock setup for node environment**
- **Found during:** Task 2 (TDD RED phase)
- **Issue:** Plan's test code used direct `store` object with `vi.stubGlobal('sessionStorage', ...)` but needed `window` stub for SSR guard check, and `window.location` had to be set on the actual window object (not via separate `vi.stubGlobal('location', ...)`)
- **Fix:** Used mutable `mockWindow` object with `location` property set per test, and Map-backed sessionStorage mock
- **Files modified:** `src/lib/__tests__/utm.test.ts`
- **Commit:** `1e5361d`

## Known Stubs

None -- no stubs or placeholder data introduced.

## Self-Check: PASSED

- FOUND: src/pages/nettside-for-bedrift/index.astro
- FOUND: src/pages/nettside-for-bedrift/takk.astro
- FOUND: src/pages/priskalkulator/index.astro
- FOUND: src/pages/tjenester/nettside/index.astro
- FOUND: src/pages/tjenester/nettbutikk/index.astro
- FOUND: src/pages/tjenester/landingsside/index.astro
- FOUND: src/lib/utm.ts
- FOUND: src/lib/__tests__/utm.test.ts
- FOUND: 3a2a422 (Task 1 commit)
- FOUND: 1e5361d (Task 2 test commit)
- FOUND: 1aa33cc (Task 2 impl commit)

---
*Phase: 36-meta-pixel-full-site-event-tracking*
*Completed: 2026-03-28*
