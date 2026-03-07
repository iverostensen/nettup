---
phase: 22-kasusstudie-sider
plan: "02"
subsystem: ui
tags: [astro, dynamic-routes, case-study, ssr, images]

requires:
  - phase: 22-01
    provides: projects.ts with full case study content (challenge, solution, features, featuresImage, summary, testimonial, metrics)

provides:
  - Dynamic [slug].astro route rendering all project case study pages
  - /prosjekter/igive — 10-section iGive case study page
  - /prosjekter/blom-company — 10-section Blom Company case study page

affects:
  - prosjekter index (links now resolved to real slug pages)
  - SEO/sitemap (two new URLs added to sitemap)

tech-stack:
  added: []
  patterns:
    - "getStaticPaths maps projects array to slug + props — single source of truth in projects.ts"
    - "astro:assets Image with width=1600 quality=85 for all case study images"
    - "reveal-on-scroll + reveal-stagger-N for scroll animations (no mixing with delay-N)"
    - "Breadcrumbs rendered with explicit items array (not auto-reading from pageLabels)"
    - "Inline anchor tag for external links needing target=_blank (LinkWithArrow lacks rel/target support)"

key-files:
  created:
    - src/pages/prosjekter/[slug].astro
  modified:
    - src/config/projects.ts
    - src/config/testimonials.ts

key-decisions:
  - "Breadcrumbs requires explicit items prop — plan assumed auto-reading from pageLabels but component API requires explicit items"
  - "LinkWithArrow does not support target/rel props — used inline anchor for CTA live site link to preserve target=_blank"
  - "Tech stack pills centered (justify-center) after visual review — left-aligned felt unbalanced under centered SectionHeader"
  - "Blom Company URL updated to https://blomcompany.com (live domain confirmed during verification)"
  - "Blom Company testimonials.ts entry removed — homepage shows only iGive (confirmed decision after visual review)"

patterns-established:
  - "Case study sections: breadcrumbs > summary > hero > utfordring > løsning > tech > features > metrics > testimonial > CTA"
  - "Metrics grid: 2-col mobile, 4-col desktop, large text-5xl numbers in text-brand"

requirements-completed: [SIDE-01, SIDE-02, SIDE-03]

duration: 10min
completed: 2026-03-07
---

# Phase 22 Plan 02: Kasusstudie-sider Summary

**Dynamic [slug].astro route rendering 10-section case study pages for iGive and Blom Company from projects.ts data**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-07T23:47:09Z
- **Completed:** 2026-03-07T23:57:46Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created `src/pages/prosjekter/[slug].astro` with `getStaticPaths` generating both case study pages
- All 10 sections implemented in locked order: breadcrumbs, summary (GEO-citable), hero image, utfordring, løsning + featuresImage, tech stack pills, leveranser checklist, metrics grid, testimonial card, CTA
- Both `/prosjekter/igive` and `/prosjekter/blom-company` build and render correctly; build passes in 3.26s
- Human verification passed — visual fixes applied (centered tech pills, live Blom Company URL, updated testimonial quote)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build [slug].astro dynamic route with all 10 sections** - `8741af3` (feat)
2. **Task 2: Human verify + apply visual review fixes** - `7b672bb` (fix)

## Files Created/Modified
- `src/pages/prosjekter/[slug].astro` — Dynamic route, 207 lines, all 10 case study sections
- `src/config/projects.ts` — Blom Company URL updated to blomcompany.com; testimonial quote and name updated to Patrick
- `src/config/testimonials.ts` — Blom Company entry removed; only iGive remains for homepage testimonials section

## Decisions Made
- `Breadcrumbs` component requires explicit `items` prop array — plan assumed auto-reading from `pageLabels` but the actual component API requires items to be passed explicitly. Items constructed inline: `[{ label: 'Hjem', href: '/' }, { label: 'Prosjekter', href: '/prosjekter' }, { label: project.name }]`
- `LinkWithArrow` does not accept `target` or `rel` props. Used an inline `<a>` tag styled identically to `LinkWithArrow` for the CTA external link to preserve `target="_blank" rel="noopener noreferrer"` behavior.
- Tech stack pills got `justify-center` added during visual review — without it the left-aligned pills looked unbalanced under the centered `SectionHeader`.
- Blom Company live domain confirmed as `https://blomcompany.com` (was staging `blom-no.vercel.app`) — updated in `projects.ts`.
- Blom Company entry removed from `testimonials.ts` — homepage Testimonials section only needs iGive at this point.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Breadcrumbs items passed explicitly instead of auto-reading**
- **Found during:** Task 1 (Build [slug].astro)
- **Issue:** Plan said "BaseLayout already has pageLabels entries — Breadcrumbs reads from those automatically" but the actual Breadcrumbs component API requires an explicit `items` prop
- **Fix:** Constructed items array inline with Hjem, Prosjekter, and project.name entries
- **Files modified:** src/pages/prosjekter/[slug].astro
- **Verification:** Breadcrumbs render correctly for both slugs in build output
- **Committed in:** 8741af3 (Task 1 commit)

**2. [Rule 1 - Bug] LinkWithArrow used inline anchor for external CTA link**
- **Found during:** Task 1 (Build [slug].astro)
- **Issue:** Plan used `<LinkWithArrow href={project.url} target="_blank" rel="noopener noreferrer">` but the component's Props interface only accepts `href` and `class` — extra attributes would be silently dropped
- **Fix:** Used an inline `<a>` tag styled identically to LinkWithArrow (same classes) with `target` and `rel` attributes
- **Files modified:** src/pages/prosjekter/[slug].astro
- **Verification:** External link opens in new tab; build passes with no TypeScript errors
- **Committed in:** 8741af3 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - component API mismatch between plan and actual implementation)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
None beyond the component API mismatches documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both case study pages are live-ready at `/prosjekter/igive` and `/prosjekter/blom-company`
- `/prosjekter` index links correctly to both case study pages
- Phase 22 (kasusstudie-sider) is complete — both plans executed
- Remaining concern: iGive testimonial uses a placeholder quote — real quote requires client outreach (carried forward)

---
*Phase: 22-kasusstudie-sider*
*Completed: 2026-03-07*
