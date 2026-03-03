---
phase: 01-brand-identity
plan: "04"
subsystem: ui
tags: [tailwind, astro, brand-tokens, typography, animation, css]

# Dependency graph
requires:
  - phase: 01-02
    provides: Brand tokens registered in tailwind.config.ts (duration-fast, duration-normal, rounded-md, delay-1 through delay-5)
  - phase: 01-03
    provides: Space Grotesk font loaded, font-display Tailwind utility available
provides:
  - Button component consuming duration-fast token
  - Card component consuming rounded-md and duration-normal tokens
  - SectionHeader H2 using font-display (Space Grotesk) and font-semibold
  - All scroll stagger delays using Tailwind delay-N utilities (not CSS classes)
  - global.css stripped of reveal-delay-* class definitions
affects:
  - 02-visual-identity
  - any phase working with UI components or scroll animations

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Token-first: all UI component transitions reference brand token classes, not hardcoded Tailwind durations"
    - "Delay tokens replace CSS-layer stagger classes — delay-N is now the project standard for scroll reveal stagger"
    - "SectionHeader H2 = font-display font-semibold (Space Grotesk 600) — lock applied across all section headings"

key-files:
  created: []
  modified:
    - src/components/ui/Button.astro
    - src/components/ui/Card.astro
    - src/components/ui/SectionHeader.astro
    - src/styles/global.css
    - src/pages/_home/Problem.astro
    - src/pages/_home/WhyNettup.astro
    - src/pages/_home/Process.astro
    - src/pages/_home/Solution.astro
    - src/pages/_home/ProjectTeaser.astro
    - src/pages/prosjekter/_sections/ProjectShowcase.astro
    - src/pages/prosjekter/_sections/Results.astro
    - src/pages/om-oss/_sections/Values.astro
    - src/pages/om-oss/_sections/Approach.astro
    - src/pages/kontakt/index.astro
    - src/pages/kontakt/_sections/AlternativeContact.astro
    - src/pages/tjenester/_sections/Pakker.astro
    - src/pages/tjenester/_sections/Inkludert.astro
    - src/pages/tjenester/_sections/Support.astro
    - src/pages/nettside-for-bedrift/_sections/Hero.astro
    - src/pages/nettside-for-bedrift/_sections/PricingSummary.astro
    - src/pages/nettside-for-bedrift/_sections/FAQ.astro
    - src/pages/nettside-for-bedrift/_sections/FormSection.astro
    - src/pages/nettside-for-bedrift/_sections/VisualProof.astro
    - src/pages/nettside-for-bedrift/_sections/Testimonial.astro
    - src/pages/nettside-for-bedrift/_sections/WhyUs.astro
    - src/pages/nettside-for-bedrift/_sections/Results.astro

key-decisions:
  - "reveal-delay-6 was defined in global.css but never used in any component — removed without needing delay.6 token"
  - "kontakt/index.astro had lg:reveal-delay-2 (responsive variant) — migrated to lg:delay-2, confirming Tailwind delay tokens support responsive prefixes"

patterns-established:
  - "delay-N (not reveal-delay-N) is the project standard for scroll reveal stagger delays"
  - "font-display font-semibold on H2 (not font-bold) — semibold = 600 = Space Grotesk H2 weight per CONTEXT.md"

requirements-completed:
  - BRAND-02

# Metrics
duration: 1min
completed: "2026-03-03"
---

# Phase 01 Plan 04: Component Token Migration Summary

**Brand token system fully consumed: Button, Card, SectionHeader migrated to token classes; reveal-delay-* CSS replaced by Tailwind delay-N utilities across 22 files**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-03T15:27:20Z
- **Completed:** 2026-03-03T15:28:47Z
- **Tasks:** 3 (2 auto + 1 checkpoint:human-verify)
- **Files modified:** 26

## Accomplishments

- Button.astro: `duration-200` replaced by `duration-fast` (150ms brand token)
- Card.astro: `rounded-xl` replaced by `rounded-md` (same 0.75rem, token-derived); `duration-300` replaced by `duration-normal` (same 300ms, token-derived)
- SectionHeader H2: added `font-display` (Space Grotesk), changed `font-bold` to `font-semibold` — all section headings now use the locked H2 typography
- 22 component files migrated from `reveal-delay-N` to `delay-N` Tailwind utilities
- global.css stripped of 6 `.reveal-delay-*` class definitions (lines 135-140)
- Build passes: 7 pages in 2.09s, no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Button and Card to brand token classes** - `060aa17` (feat)
2. **Task 2: Migrate SectionHeader H2 and replace reveal-delay-* with delay-* tokens** - `d112de5` (feat)
3. **Task 3: Human visual verification** - approved (checkpoint, no code commit)

## Files Created/Modified

- `src/components/ui/Button.astro` - duration-fast token for transitions
- `src/components/ui/Card.astro` - rounded-md and duration-normal tokens
- `src/components/ui/SectionHeader.astro` - font-display font-semibold H2; delay-1 subtitle
- `src/styles/global.css` - removed 6 .reveal-delay-* class definitions
- 22 page/section files - reveal-delay-N → delay-N throughout

## Decisions Made

- `reveal-delay-6` was defined in global.css but never used — removed without adding delay.6 to brand.ts
- `lg:reveal-delay-2` responsive variant in kontakt/index.astro became `lg:delay-2` — Tailwind delay tokens support responsive prefixes as expected

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All 22 files updated cleanly. Build passed first attempt.

## Human Verification

Checkpoint task 3 (`checkpoint:human-verify`) — **approved**. Human verified:

- Space Grotesk renders correctly on section H2 headings
- Stagger scroll animations still work with delay-N tokens
- Card hover transitions still smooth
- Card radius visually unchanged (rounded-md = same 0.75rem as rounded-xl)

No visual regressions reported.

## Next Phase Readiness

- BRAND-02 complete: token system defined AND consumed by all key UI components
- All section headings now use Space Grotesk semibold consistently
- CSS-layer no longer owns delay values — Tailwind token layer does
- Ready for Phase 2 visual identity work once human verifies no regressions

---
*Phase: 01-brand-identity*
*Completed: 2026-03-03*
