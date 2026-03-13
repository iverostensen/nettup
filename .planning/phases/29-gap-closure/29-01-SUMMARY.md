---
phase: 29-gap-closure
plan: "01"
subsystem: seo
tags: [json-ld, schema-org, analytics, plausible, dead-code-removal, faqpage]

requires:
  - phase: 27-plausible-analytics
    provides: City CTA tracking + analytics wiring this verifies
  - phase: 28-floatingnav-rewrite
    provides: FloatingNav.astro that replaced FloatingNav.tsx
provides:
  - FAQPage JSON-LD on all active city pages (SEO-03)
  - Trimmed analytics.ts with 6 tracker functions (dead trackCityCtaClicked removed)
  - Phase 27 verification report confirming ANAL-01/02/03
affects: [30-gap-closure-2]

tech-stack:
  added: []
  patterns:
    - Conditional FAQPage JSON-LD in Fragment slot head with null-guard on city.faq
    - is:inline script pattern for JSON-LD (consistent with existing Service JSON-LD in same file)

key-files:
  created:
    - .planning/phases/27-plausible-analytics/27-VERIFICATION.md
  modified:
    - src/pages/steder/[location].astro
    - src/lib/analytics.ts
  deleted:
    - src/components/islands/FloatingNav.tsx

key-decisions:
  - "FAQPage JSON-LD uses city.faq && city.faq.length > 0 guard — only emitted when FAQ items exist"
  - "trackCityCtaClicked removed from analytics.ts — city CTA tracking uses is:inline IIFE in [location].astro (ES module imports incompatible with is:inline scripts, established in Phase 27-03)"
  - "FloatingNav.tsx deleted — FloatingNav.astro is the live component since Phase 28 rewrite"

patterns-established:
  - "Conditional JSON-LD: compute schema variable in frontmatter with null-guard, emit with {schema && <script ...>} in head slot"

requirements-completed: [SEO-03, ANAL-01, ANAL-02, ANAL-03]

duration: ~5min
completed: 2026-03-13
---

# Phase 29 Plan 01: Gap Closure Summary

**FAQPage JSON-LD added to city pages (SEO-03), dead code removed (FloatingNav.tsx + trackCityCtaClicked), and Phase 27 Plausible Analytics implementation verified (ANAL-01/02/03)**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-13T17:07:10Z
- **Completed:** 2026-03-13T17:10:00Z
- **Tasks:** 3
- **Files modified:** 3 (+ 1 deleted + 1 created)

## Accomplishments

- Added FAQPage JSON-LD schema with null-guard to all active city pages, satisfying SEO-03 for FAQ rich results
- Deleted FloatingNav.tsx React island (replaced by FloatingNav.astro in Phase 28) and removed dead trackCityCtaClicked export from analytics.ts
- Produced 27-VERIFICATION.md documenting 8/8 must-haves verified across ANAL-01, ANAL-02, and ANAL-03

## Task Commits

1. **Task 1: Add FAQPage JSON-LD to [location].astro** - `15de64f` (feat)
2. **Task 2: Remove dead code — FloatingNav.tsx + trackCityCtaClicked** - `bbb982e` (chore)
3. **Task 3: Produce 27-VERIFICATION.md** - `9b576a1` (docs)

## Files Created/Modified

- `src/pages/steder/[location].astro` - Added faqSchema variable (lines 35–47) and conditional FAQPage script block in Fragment slot head
- `src/lib/analytics.ts` - Removed trackCityCtaClicked (lines 40–42); 6 tracker functions remain
- `src/components/islands/FloatingNav.tsx` - Deleted (dead code since Phase 28 FloatingNav rewrite)
- `.planning/phases/27-plausible-analytics/27-VERIFICATION.md` - Created; 8/8 must-haves verified; ANAL-01/02/03 all SATISFIED

## Decisions Made

- FAQPage JSON-LD guard uses `city.faq && city.faq.length > 0` — the `City` interface always has the `faq` field, but the guard defends against empty arrays (some cities could have none).
- trackCityCtaClicked was legitimately dead — the inline IIFE in [location].astro calls `window.plausible` directly (ES module imports cannot be used in `is:inline` scripts, as established in Phase 27-03). The export in analytics.ts was never imported.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- SEO-03, ANAL-01, ANAL-02, ANAL-03 all satisfied — Phase 29 gap closure objectives met
- Phase 30 (if planned) can proceed without dependency on these gaps

## Self-Check: PASSED

- [x] `src/pages/steder/[location].astro` — FOUND, contains FAQPage JSON-LD
- [x] `src/lib/analytics.ts` — FOUND, trackCityCtaClicked REMOVED, 6 exports remain
- [x] `src/components/islands/FloatingNav.tsx` — DELETED (confirmed)
- [x] `.planning/phases/27-plausible-analytics/27-VERIFICATION.md` — FOUND, ANAL-01/02/03 verified
- [x] Commits: 15de64f, bbb982e, 9b576a1 — all present in git log
- [x] `npm run build` — Complete! (exits 0)

---
*Phase: 29-gap-closure*
*Completed: 2026-03-13*
