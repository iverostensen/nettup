---
phase: 34-google-ads-campaign-docs
plan: 02
subsystem: marketing
tags: [google-ads, extensions, sitelinks, callouts, campaign-structure, bidding]

requires:
  - phase: 34-google-ads-campaign-docs
    provides: keywords.md and ad-copy.md from plan 01
  - phase: 31-consent-mode-analytics
    provides: Consent Mode v2 and gtag conversion tracking on /takk page
  - phase: 32-subscription-offer-config
    provides: subscriptionOffer.ts with upsellLinks for sitelink URLs
provides:
  - Ad extensions document (sitelinks, callouts, structured snippets) ready for Google Ads
  - Campaign structure document with settings, bidding phases, budget scenarios, and launch checklist
affects: [google-ads-launch]

tech-stack:
  added: []
  patterns: [character-counted ad assets, phased bidding strategy documentation]

key-files:
  created:
    - .planning/phases/34-google-ads-campaign-docs/extensions.md
    - .planning/phases/34-google-ads-campaign-docs/campaign-structure.md
  modified: []

key-decisions:
  - "Sitelinks map directly to subscriptionOffer.ts upsellLinks plus /prosjekter as portfolio proof"
  - "3-phase bidding strategy: Manual CPC weeks 1-4, Maximize Clicks weeks 5-8, Maximize Conversions week 9+"
  - "100 NOK/day recommended starting budget with 50-150 NOK/day range"

patterns-established:
  - "Character-counted tables for all ad assets ensuring Google Ads compliance"
  - "Norwegian-only campaign documentation matching landing page language"

requirements-completed: [ADS-03, ADS-04]

duration: 2min
completed: 2026-03-20
---

# Phase 34 Plan 02: Ad Extensions and Campaign Structure Summary

**Sitelinks to /tjenester upsell paths, 6 callout extensions matching trust badges, phased bidding strategy from Manual CPC to Maximize Conversions, and 3 budget scenarios (50-150 NOK/day)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T19:40:42Z
- **Completed:** 2026-03-20T19:43:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Ad extensions document with 4 sitelinks (3 upsell + 1 portfolio), 6 callouts, and structured snippets -- all character-verified
- Campaign structure with single campaign/ad group, phased bidding strategy, conversion tracking referencing existing Consent Mode v2
- Complete launch checklist and optimization schedule for campaign management

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ad extensions document** - `328305c` (docs)
2. **Task 2: Create campaign structure document** - `7e41c68` (docs)

## Files Created/Modified

- `.planning/phases/34-google-ads-campaign-docs/extensions.md` - Sitelinks, callouts, structured snippets with character counts
- `.planning/phases/34-google-ads-campaign-docs/campaign-structure.md` - Campaign settings, ad group, bidding phases, conversion tracking, negatives, budget scenarios, launch checklist, optimization schedule

## Decisions Made

None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Campaign setup in Google Ads is documented in campaign-structure.md launch checklist.

## Next Phase Readiness

- All 4 Google Ads campaign deliverables are now complete: keywords.md, ad-copy.md, extensions.md, campaign-structure.md
- Campaign can be configured in Google Ads using these 4 documents
- No further phases depend on this work

## Self-Check: PASSED

All files exist. All commits verified.

---
*Phase: 34-google-ads-campaign-docs*
*Completed: 2026-03-20*
