---
phase: 04-conversion-optimization
plan: "01"
subsystem: ui
tags: [astro, cta, conversion, url-params, pre-fill]

# Dependency graph
requires:
  - phase: 03-seo-portfolio
    provides: completed page structure for /om-oss and /prosjekter
provides:
  - Contextual bottom CTA for /om-oss (OmOssCTA.astro)
  - Contextual bottom CTA for /prosjekter (ProsjekterCTA.astro)
  - Pricing package pre-fill via ?pakke= URL param on /kontakt
  - TjenesterCTA tracking via ?kilde=tjenester param
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Page-specific CTA sections that mirror the page's content theme
    - URL param pre-fill pattern for contact form (ContactForm.tsx already supported ?pakke= and ?kilde=)

key-files:
  created:
    - src/pages/om-oss/_sections/OmOssCTA.astro
    - src/pages/prosjekter/_sections/ProsjekterCTA.astro
  modified:
    - src/pages/om-oss/index.astro
    - src/pages/prosjekter/index.astro
    - src/pages/tjenester/_sections/Pakker.astro
    - src/pages/tjenester/_sections/TjenesterCTA.astro

key-decisions:
  - "Template literal href in Pakker.astro uses JSX expression syntax — href={`/kontakt?pakke=${pakke.id}&kilde=tjenester`} — not string interpolation"
  - "ContactForm.tsx already validated and handled ?pakke= param — no form changes needed"
  - "Homepage retains generic CTA.astro — contextual CTAs only for /om-oss and /prosjekter"

patterns-established:
  - "Page-specific CTA: create _sections/[Page]CTA.astro following TjenesterCTA pattern (Section > div.reveal-on-scroll > h2, p, Button)"

requirements-completed: [CONV-01, CONV-02]

# Metrics
duration: 1min
completed: 2026-03-04
---

# Phase 04 Plan 01: Contextual CTAs and Pricing Pre-fill Summary

**Page-specific CTAs on /om-oss and /prosjekter plus URL-param pre-fill wiring all three pricing package buttons to the contact form**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-04T14:24:27Z
- **Completed:** 2026-03-04T14:25:30Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created OmOssCTA.astro with copy referencing Nettup's 2-week delivery approach ("Vil du ha en nettside som gir resultater?")
- Created ProsjekterCTA.astro inviting visitors to become next success story ("Din bedrift kan bli neste suksesshistorie")
- Wired all three pricing package buttons to /kontakt with ?pakke=enkel/standard/premium&kilde=tjenester — contact form shows confirmation badge on arrival
- Added ?kilde=tjenester tracking param to TjenesterCTA bottom button

## Task Commits

Each task was committed atomically:

1. **Task 1: Contextual CTAs for /om-oss and /prosjekter** - `d0bdaff` (feat)
2. **Task 2: Pricing package pre-fill and TjenesterCTA tracking** - `0565474` (feat)

## Files Created/Modified
- `src/pages/om-oss/_sections/OmOssCTA.astro` - Page-specific CTA for /om-oss, references delivery approach
- `src/pages/prosjekter/_sections/ProsjekterCTA.astro` - Page-specific CTA for /prosjekter, references results/case studies
- `src/pages/om-oss/index.astro` - Replaced generic CTA.astro import with OmOssCTA
- `src/pages/prosjekter/index.astro` - Replaced generic CTA.astro import with ProsjekterCTA
- `src/pages/tjenester/_sections/Pakker.astro` - Button hrefs updated to template literals with ?pakke= and ?kilde=
- `src/pages/tjenester/_sections/TjenesterCTA.astro` - Button href updated with ?kilde=tjenester tracking

## Decisions Made
- Template literal JSX expression syntax for Pakker.astro hrefs — `href={...}` not `href="..."` — required for Astro to evaluate the expression
- ContactForm.tsx already supported ?pakke= param validation (enkel/standard/premium) and badge display — zero form changes needed
- Homepage keeps generic CTA.astro — it already has adequate copy after Testimonials, no contextual replacement needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- IDE diagnostics flagged `CTA` as undefined after replacing the import in om-oss/index.astro and prosjekter/index.astro (the JSX usage line still referenced `<CTA />`). Fixed by also replacing the usage line. Not a deviation — just a two-step edit operation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Conversion optimization plan 01 complete; all 6 files verified in production build
- Package pre-fill is end-to-end: tjenester buttons -> URL params -> contact form badge display
- Ready for plan 04-02 (if any) or phase completion
