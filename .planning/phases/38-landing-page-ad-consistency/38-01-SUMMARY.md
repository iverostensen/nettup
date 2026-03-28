---
phase: 38-landing-page-ad-consistency
plan: 01
subsystem: landing-page
tags: [pricing, consent, gdpr, landing-page]
dependency_graph:
  requires: [subscriptionOffer.ts, LandingPageLayout.astro]
  provides: [competitor-price-anchor, equal-prominence-consent-buttons]
  affects: [/nettside-for-bedrift]
tech_stack:
  added: []
  patterns: [price-anchoring, gdpr-equal-prominence]
key_files:
  created: []
  modified:
    - src/pages/nettside-for-bedrift/_sections/PricingSummary.astro
    - src/layouts/LandingPageLayout.astro
decisions:
  - "Muted text-sm for price anchor -- understated factual context, not aggressive marketing"
  - "Decline button changed from ghost/border to solid bg-slate-600 for true equal prominence"
metrics:
  duration: 1min
  completed: 2026-03-28
---

# Phase 38 Plan 01: Landing Page Ad Consistency Summary

Competitor price anchor (15 000-50 000 kr) added above subscription card, consent banner buttons made equal-prominence with solid styling on both.

## What Was Done

### Task 1: Competitor price anchor in PricingSummary (080c2db)
Added a muted text line "Andre byraer tar 15 000-50 000 kr for en nettside" above the subscription offer card. Uses `text-sm text-text-muted` for understated factual framing. Positioned inside the existing section header block, after the subtitle, before the price card.

### Task 2: Equal-prominence consent buttons (5370654)
Changed the decline button from ghost styling (`border border-white/10 text-text-muted`) to solid styling (`bg-slate-600 text-surface hover:bg-slate-500`). Both accept and decline buttons now have solid backgrounds with white text, eliminating the dark pattern where accept was visually dominant.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Consent button classes differed from plan interface**
- **Found during:** Task 2
- **Issue:** Plan referenced `bg-slate-700` as existing class, but actual file had `border border-white/10 text-text-muted` (ghost button)
- **Fix:** Applied the plan's intended outcome (solid bg-slate-600) to the actual existing classes
- **Files modified:** src/layouts/LandingPageLayout.astro
- **Commit:** 5370654

## Verification

- `npm run build` passes cleanly
- `grep "Andre byraer tar"` confirms price anchor present
- `grep "bg-slate-600"` confirms solid decline button styling

## Known Stubs

None.
