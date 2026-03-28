---
phase: 34-google-ads-campaign-docs
plan: 01
subsystem: marketing
tags: [google-ads, rsa, keywords, norwegian-seo, campaign-docs]

requires:
  - phase: 33-landing-page-content-rebuild
    provides: Final landing page content for message match
provides:
  - Keyword research with primary/secondary/long-tail groupings and negative keywords
  - 15 RSA headlines and 4 descriptions with character counts
  - 5 RSA ad copy variants with pinning strategy
affects: [34-02-extensions-campaign-structure]

tech-stack:
  added: []
  patterns: [message-match-verification, rsa-pinning-strategy]

key-files:
  created:
    - .planning/phases/34-google-ads-campaign-docs/keywords.md
    - .planning/phases/34-google-ads-campaign-docs/ad-copy.md
  modified: []

key-decisions:
  - "Exact match for primary high-intent keywords, phrase match for secondary/long-tail"
  - "Pin H1 (service) to Position 1 and H2 (price) to Position 2 across all variants"
  - "No broad match in initial campaign to control spend during learning phase"

patterns-established:
  - "Message match: all ad phrases verified against landing page elements"
  - "Character counting: Norwegian chars count as 1, all headlines/descriptions verified"

requirements-completed: [ADS-01, ADS-02]

duration: 3min
completed: 2026-03-20
---

# Phase 34 Plan 01: Keywords & Ad Copy Summary

**Norwegian keyword research (14 keywords + 17 negatives) and 5 RSA ad copy variants with pinned price headlines for 399 kr/mnd subscription campaign**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-20T19:40:39Z
- **Completed:** 2026-03-20T19:43:39Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Keyword research document with primary, secondary, and long-tail Norwegian keywords organized by commercial intent
- 17 negative keywords covering gratis-seekers, DIY platforms, self-builders, job seekers, and template seekers
- 15 character-counted RSA headlines and 4 descriptions, all within Google Ads limits
- 5 RSA variants (price, trust, feature, speed, value-comparison) with consistent pinning strategy
- Message match verification checklist mapping all ad phrases to landing page elements

## Task Commits

Each task was committed atomically:

1. **Task 1: Create keyword research document** - `42e0bd2` (docs)
2. **Task 2: Create ad copy variants document** - `c8048e3` (docs)

## Files Created/Modified

- `.planning/phases/34-google-ads-campaign-docs/keywords.md` - Keyword research with groupings, match types, volume/CPC estimates, and negative keywords
- `.planning/phases/34-google-ads-campaign-docs/ad-copy.md` - 15 RSA headlines, 4 descriptions, 5 variant combinations, pinning strategy, message match verification

## Decisions Made

- Exact match for primary keywords (cost control), phrase match for broader reach
- Pin headline #1 to Position 1 and #2 to Position 2 in all variants (ensures service + price always visible)
- No broad match during initial learning phase to avoid budget waste
- Volume/CPC columns use estimate ranges with note to verify via Keyword Planner

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- keywords.md ready for Google Keyword Planner volume verification
- ad-copy.md ready to copy-paste into Google Ads RSA creation
- Next plan (34-02) can build extensions and campaign structure referencing these keywords and ad copy

---
*Phase: 34-google-ads-campaign-docs*
*Completed: 2026-03-20*
