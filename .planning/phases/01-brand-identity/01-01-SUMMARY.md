---
phase: 01-brand-identity
plan: 01
subsystem: brand
tags: [brand, tone-of-voice, copy, norwegian, documentation]

# Dependency graph
requires: []
provides:
  - "Written brand document defining Nettup's mission, audience, tone of voice, and visual values"
  - "Contrast table (10 rows) constraining copy choices for Phase 3 SEO and metadata work"
  - "Three tone of voice rules each with on-brand and off-brand Norwegian examples"
  - "Copy principles with concrete examples in Norwegian (bokmål)"
affects:
  - phase-02 (visual implementation — visual values section provides design direction)
  - phase-03 (SEO and copy audit — tone of voice and contrast table constrain all metadata/headings)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Brand document pattern: mission + audience + tone rules + contrast table + visual values + copy principles"

key-files:
  created:
    - .planning/BRAND.md
  modified: []

key-decisions:
  - "Mission framed around concrete opposites (speed/honesty/modern vs. slow/opaque/outdated) rather than abstract values"
  - "Tone rules written in imperative form with paired Norwegian on/off-brand examples — makes them actionable rather than descriptive"
  - "Contrast table leads with pricing and delivery language — these are the highest-leverage copy decisions for conversion"
  - "Visual values reference Framer.com and Resend.com by name as style anchors for Phase 2"

patterns-established:
  - "On/off-brand examples in Norwegian: every tone rule has both a correct and incorrect sentence"
  - "Concrete over abstract: numbers and timeframes preferred over adjectives throughout"

requirements-completed:
  - BRAND-01

# Metrics
duration: 2min
completed: 2026-03-03
---

# Phase 1 Plan 01: Nettup Brand Document Summary

**Brand personality document written in Norwegian with mission statement, three tone-of-voice rules with paired on/off-brand examples, 10-row contrast table, and concrete copy principles constraining Phase 3 metadata work.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-03T15:15:34Z
- **Completed:** 2026-03-03T15:17:13Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Mission statement written in Nettup's own voice — frames "revolusjonerer webbyråbransjen" through concrete opposites (2-week delivery vs. months, fixed price vs. "call for quote")
- Tone of voice section with three imperative rules and paired Norwegian on/off-brand examples — any writer can apply these immediately
- Contrast table with 10 rows covering the highest-stakes copy areas: pricing, delivery, positioning, and sales language
- Visual values section referencing Framer.com and Resend.com by name, giving Phase 2 a concrete style anchor

## Task Commits

Each task was committed atomically:

1. **Task 1: Write .planning/BRAND.md** - `4a138fe` (feat)

## Files Created/Modified

- `.planning/BRAND.md` - Brand source of truth: mission, audience, tone rules, contrast table, visual values, copy principles (93 lines)

## Decisions Made

- **Mission framing:** Articulated the mission as a contrast to industry norms rather than self-describing adjectives. "Vi revolusjonerer" is backed immediately by concrete differences: 2-week delivery, fixed pricing, modern tech. This approach mirrors the copy principles the document itself defines.

- **Tone rule format:** Used imperative headline + on/off-brand pair (Norwegian) rather than descriptive prose. More actionable for writers and future Claude instances evaluating copy.

- **Contrast table scope:** Led with pricing and delivery language, which are highest-leverage for conversion. Includes 10 rows — 2 more than the required 8 minimum — to cover edge cases like sales language ("representant vil ta kontakt" vs. "vi svarer samme dag").

- **Visual values approach:** Three feelings/impressions with named references (Framer, Resend) and brief explanations rather than abstract adjectives. Gives Phase 2 specific anchors.

- **Document voice:** The document is written in Nettup's brand voice (direct, concrete, Norwegian) rather than brand-consultant prose — it demonstrates what it describes.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- BRAND.md is the source of truth for all Phase 3 copy decisions — tone rules and contrast table are the primary constraint mechanism
- Phase 2 visual implementation can use the visual values section (Framer/Resend style anchors, gradient and CTA glow guidance) as design direction
- The document is written in Norwegian (bokmål) and demonstrates the brand voice throughout — ready for use

## Self-Check: PASSED

- FOUND: .planning/BRAND.md
- FOUND: .planning/phases/01-brand-identity/01-01-SUMMARY.md
- FOUND: commit 4a138fe

---
*Phase: 01-brand-identity*
*Completed: 2026-03-03*
