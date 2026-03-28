---
phase: 41-lead-magnet-mid-funnel-asset
plan: 01
subsystem: ui
tags: [react, framer-motion, formspree, plausible, meta-pixel, lead-magnet]

requires:
  - phase: 36-meta-pixel-full-site-event-tracking
    provides: Meta Pixel consent gate pattern (nettup_ads_consent localStorage)
  - phase: 37-privacy-compliance
    provides: Privacy policy covering lead data collection
provides:
  - /sjekkliste page with email-gated 10-item checklist
  - trackLeadMagnetDownload Plausible event
  - SjekklisteIsland React island with blur-to-reveal animation
affects: [41-02, footer-links, sitemap]

tech-stack:
  added: []
  patterns: [blur-gate-reveal, email-gated-content]

key-files:
  created:
    - src/components/islands/SjekklisteIsland.tsx
    - src/pages/sjekkliste/index.astro
  modified:
    - src/lib/analytics.ts

key-decisions:
  - "Dedicated Formspree ID placeholder (not reusing contact form ID)"
  - "Framer Motion blur + stagger reveal with useReducedMotion guard"

patterns-established:
  - "Email-gated content: blur(8px) + overlay form, reveal on successful POST"

requirements-completed: [LEAD-01, LEAD-02]

duration: 2min
completed: 2026-03-28
---

# Phase 41 Plan 01: Lead Magnet Sjekkliste Page Summary

**Email-gated /sjekkliste page with 10-item checklist, blur-to-reveal animation, Formspree form, and dual Plausible + Meta Pixel conversion tracking**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T22:14:50Z
- **Completed:** 2026-03-28T22:17:01Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- trackLeadMagnetDownload added to analytics.ts as 8th named export
- SjekklisteIsland React island with 4-state form (idle/submitting/error/unlocked), blur gate, staggered Framer Motion reveal, and reduced motion support
- /sjekkliste Astro page with SEO meta, proper heading hierarchy, and client:visible hydration

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend analytics.ts with trackLeadMagnetDownload** - `f787261` (feat)
2. **Task 2: Create SjekklisteIsland.tsx and sjekkliste/index.astro** - `72e4c20` (feat)

## Files Created/Modified
- `src/lib/analytics.ts` - Added trackLeadMagnetDownload export
- `src/components/islands/SjekklisteIsland.tsx` - React island with form gate, blur reveal, analytics events
- `src/pages/sjekkliste/index.astro` - Astro page wrapper with BaseLayout and SEO meta

## Decisions Made
- Used dedicated SJEKKLISTE_FORMSPREE_ID placeholder constant (user must create new Formspree form)
- Framer Motion useReducedMotion hook for accessible animation fallback

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| src/components/islands/SjekklisteIsland.tsx | 14 | `SJEKKLISTE_FORMSPREE_ID = 'REPLACE_WITH_NEW_FORMSPREE_ID'` | User must create a new Formspree form and replace this value (per D-10 in plan) |

## User Setup Required

User must create a new Formspree form for the sjekkliste and replace `REPLACE_WITH_NEW_FORMSPREE_ID` in `src/components/islands/SjekklisteIsland.tsx` with the actual form ID.

## Next Phase Readiness
- /sjekkliste page builds and is ready for visual testing once Formspree ID is configured
- Plan 02 can proceed to add footer link, sitemap entry, and any remaining integration

## Self-Check: PASSED

All 3 files verified on disk. Both commit hashes (f787261, 72e4c20) found in git log.

---
*Phase: 41-lead-magnet-mid-funnel-asset*
*Completed: 2026-03-28*
