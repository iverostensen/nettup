---
phase: 31-tracking-infrastructure
plan: 01
subsystem: infra
tags: [gtag, consent-mode-v2, gdpr, google-ads, plausible, noindex, sitemap]

# Dependency graph
requires: []
provides:
  - Consent Mode v2 advanced implementation in LandingPageLayout
  - window.gtag and window.gtagLoaded globals always available
  - noIndex defaults to true for all landing pages
  - Sitemap excludes noindexed pages
  - Privacy page explains consent behavior in plain Norwegian
affects: [32-landing-page-rebuild, 33-conversion-setup, 34-ad-campaign-docs]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Consent Mode v2 advanced: gtag always loads with denied defaults, updates on consent"
    - "var instead of const/let in is:inline scripts for compatibility"

key-files:
  created: []
  modified:
    - src/layouts/LandingPageLayout.astro
    - src/pages/personvern/index.astro
    - astro.config.mjs

key-decisions:
  - "Used var instead of const/let in inline scripts for broader browser compatibility"
  - "Plausible Analytics replaces Vercel Analytics references throughout privacy page"

patterns-established:
  - "Consent Mode v2 script order: define gtag -> set defaults -> check stored -> load script -> init -> banner"
  - "Sitemap filter excludes noindexed pages via page URL string matching"

requirements-completed: [TRACK-01, TRACK-04]

# Metrics
duration: 3min
completed: 2026-03-19
---

# Phase 31 Plan 01: Consent Mode v2 + noIndex Summary

**Google Ads Consent Mode v2 advanced implementation with denied defaults, 4 consent params, returning visitor restore, and noIndex default for landing pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-19T13:25:02Z
- **Completed:** 2026-03-19T13:28:12Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Upgraded gtag from consent-gated loading to Consent Mode v2 advanced mode (always loads with denied defaults)
- All 4 v2 consent params present: ad_storage, ad_user_data, ad_personalization, analytics_storage
- Returning visitors with stored granted consent get immediate consent update on page load
- noIndex defaults to true in LandingPageLayout, sitemap excludes /nettside-for-bedrift
- Privacy page rewritten to explain Consent Mode v2 two-mode behavior and Plausible Analytics

## Task Commits

Each task was committed atomically:

1. **Task 1: Consent Mode v2 upgrade + noIndex default change** - `98f9ee2` (feat)
2. **Task 2: Update privacy page for Consent Mode v2** - `3bb953f` (feat)

## Files Created/Modified
- `src/layouts/LandingPageLayout.astro` - Consent Mode v2 script, banner text with /personvern link, noIndex=true default
- `src/pages/personvern/index.astro` - Plausible Analytics references, Consent Mode v2 explanation, updated data sharing cards
- `astro.config.mjs` - Sitemap filter excluding /nettside-for-bedrift

## Decisions Made
- Used var instead of const/let in is:inline scripts for broader compatibility (as specified in plan)
- Replaced all Vercel Analytics references with Plausible Analytics on privacy page (aligns with analytics decision in MEMORY.md)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Consent Mode v2 infrastructure ready for conversion tracking setup in Phase 33
- window.gtag and window.gtagLoaded always available for React island conversion events
- Landing page noindexed and excluded from sitemap, ready for content rebuild in Phase 32

---
*Phase: 31-tracking-infrastructure*
*Completed: 2026-03-19*
