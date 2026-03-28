---
phase: 36-meta-pixel-full-site-event-tracking
plan: 01
subsystem: tracking
tags: [meta-pixel, fbq, consent, gdpr, gtag, facebook-ads]

requires:
  - phase: 35
    provides: "Consent Mode v2 IIFE in LandingPageLayout, nettup_ads_consent localStorage key"
provides:
  - "Unified consent IIFE with gtag + fbq in both layouts"
  - "Site-wide consent banner in BaseLayout with transition:persist"
  - "Meta Pixel base code with consent-revoke-before-init pattern"
  - "PUBLIC_META_PIXEL_ID env var injection via define:vars"
affects: [36-02, 37-privacy-compliance]

tech-stack:
  added: [meta-pixel-sdk]
  patterns: [unified-consent-iife, fbq-revoke-before-init, define-vars-env-injection]

key-files:
  created: []
  modified:
    - src/layouts/BaseLayout.astro
    - src/layouts/LandingPageLayout.astro

key-decisions:
  - "Consent IIFE duplicated in both layouts (not extracted) per plan D-02 -- layouts are independent"
  - "Pixel ID from PUBLIC_META_PIXEL_ID env var with empty-string fallback as no-op guard"
  - "Banner uses transition:persist in BaseLayout for view transition survival"

patterns-established:
  - "fbq('consent','revoke') MUST appear before fbq('init') -- Norwegian E-Com Act requirement"
  - "if (pixelId) guard makes pixel a no-op when env var is empty"
  - "Single localStorage key nettup_ads_consent controls both gtag and fbq consent"

requirements-completed: [TRACK-01, TRACK-02, TRACK-03, TRACK-07]

duration: 2min
completed: 2026-03-28
---

# Phase 36 Plan 01: Meta Pixel Consent Infrastructure Summary

**Consent-aware Meta Pixel loading in both layouts with unified gtag+fbq IIFE and site-wide consent banner with equal-prominence buttons**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T17:20:42Z
- **Completed:** 2026-03-28T17:22:30Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Meta Pixel base code loads on all pages with fbq('consent','revoke') before fbq('init') for GDPR compliance
- Consent banner moved to BaseLayout for site-wide coverage with transition:persist for view transition survival
- Both accept and decline buttons use solid styling (bg-brand and bg-slate-700) for equal visual prominence
- Pixel ID injected from PUBLIC_META_PIXEL_ID env var -- no-op when empty (dev-safe, supports kill switch)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add unified consent IIFE and consent banner to BaseLayout.astro** - `ec57027` (feat)
2. **Task 2: Update LandingPageLayout consent IIFE with fbq and fix button parity** - `9e521aa` (feat)

## Files Created/Modified
- `src/layouts/BaseLayout.astro` - Added unified consent IIFE (gtag+fbq), consent banner HTML, pixelId frontmatter var
- `src/layouts/LandingPageLayout.astro` - Extended existing consent IIFE with fbq calls, fixed decline button to solid style

## Decisions Made
None - followed plan as specified.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

Meta Pixel requires a Pixel ID from Meta Business Suite before tracking activates:
- Set `PUBLIC_META_PIXEL_ID` environment variable (numeric string from Meta Business Suite -> Events Manager -> Data Sources -> Pixel -> Settings)
- Without this env var, pixel code is a no-op (site functions normally)

## Known Stubs
None - no stubs or placeholder data introduced.

## Next Phase Readiness
- Consent infrastructure ready for Plan 02 (ViewContent + Lead conversion events)
- Phase 37 can document what the pixel does based on this implementation
- PUBLIC_META_PIXEL_ID env var must be set in Vercel before pixel goes live

## Self-Check: PASSED

- FOUND: src/layouts/BaseLayout.astro
- FOUND: src/layouts/LandingPageLayout.astro
- FOUND: 36-01-SUMMARY.md
- FOUND: ec57027 (Task 1 commit)
- FOUND: 9e521aa (Task 2 commit)

---
*Phase: 36-meta-pixel-full-site-event-tracking*
*Completed: 2026-03-28*
