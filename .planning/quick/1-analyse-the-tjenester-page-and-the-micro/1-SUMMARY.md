---
phase: quick-1
plan: 1
subsystem: tjenester-animations
tags: [animations, framer-motion, scroll-reveal, ux-polish]
dependency_graph:
  requires: []
  provides: [tjenester-stagger-animations, card-hover-polish, faq-stagger]
  affects: [src/pages/tjenester]
tech_stack:
  added: []
  patterns: [framer-motion-whileInView, css-stagger-delay, group-hover-tailwind]
key_files:
  created:
    - src/components/islands/TjenesterOversiktIsland.tsx
  modified:
    - src/styles/global.css
    - src/pages/tjenester/_sections/TjenesterOversikt.astro
    - src/pages/tjenester/_sections/FAQ.astro
    - src/pages/tjenester/_sections/TjenesterCTA.astro
decisions:
  - "Framer Motion whileInView (not CSS IntersectionObserver) for service card stagger — CSS delays don't reliably sequence when .revealed fires simultaneously"
  - "Løpende tjenester h2 rendered inside island between the two grids — avoids prop threading and keeps heading in DOM order"
  - "Icon hover via CSS group-hover (no JS) — Framer Motion only needed for entry animation"
  - "link-underline class reused on Les mer span — existing utility already provides the animated underline behaviour"
metrics:
  duration: 2m 29s
  completed: "2026-03-05"
  tasks_completed: 3
  files_changed: 5
---

# Quick Task 1: Tjenester Page Micro-Animation Polish Summary

**One-liner:** Framer Motion stagger-reveal for service cards with icon micro-animations, exponential ease CSS updates, and cascading FAQ/CTA entrances.

## What Was Done

Replaced the simultaneous CSS reveal on /tjenester service cards with a Framer Motion scroll-triggered stagger grid, refined the global reveal easing curve, added card hover micro-animations, and cascaded FAQ items and the CTA section.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Refine reveal-on-scroll easing and add stagger/glow utilities | ddafa3c | global.css |
| 2 | Create TjenesterOversiktIsland with Framer Motion stagger cards | c0cffa7 | TjenesterOversiktIsland.tsx, TjenesterOversikt.astro |
| 3 | Stagger FAQ items and cascade TjenesterCTA entrance | 9875bc9 | FAQ.astro, TjenesterCTA.astro |

## Key Changes

### global.css
- `reveal-on-scroll` now uses `cubic-bezier(0.16, 1, 0.3, 1)` (exponential ease-out) at 0.65s with 24px travel — elements decelerate smoothly instead of stopping abruptly
- Added `reveal-stagger-1` through `reveal-stagger-7` (0ms to 480ms, 80ms steps) — transition-delay utilities that fire after IntersectionObserver adds `.revealed`
- Added `shimmer-glow` keyframe and `.card-featured-glow` class — 3s pulse for featured cards (nettside, nettbutikk)
- All new utilities reset properly under `prefers-reduced-motion: reduce`

### TjenesterOversiktIsland.tsx (new)
- Framer Motion `whileInView` with `once: true` and `margin: -60px` — triggers when grid enters viewport
- `staggerChildren: 0.08` on container variants — 80ms cascade per card
- Icon wrapped in `group-hover:-translate-y-0.5 group-hover:scale-110` — micro-lift on card hover
- Featured cards (nettside, nettbutikk) get `card-featured-glow` ambient pulse + stronger hover shadow
- `link-underline` class on "Les mer" span — animated underline on card hover
- `useReducedMotion()` collapses all y-travel to 0 and delays to 0

### TjenesterOversikt.astro
- Static card grids removed; delegates to `<TjenesterOversiktIsland client:visible />`
- Service data (group1, group2, featured slugs) passed as props
- "Løpende tjenester" h2 moved inside island between the two grids

### FAQ.astro
- Each FAQ item gets `reveal-stagger-${index + 1}` — 6 items stagger 0ms to 400ms
- Hover left accent bar: `border-l-2 border-transparent hover:border-brand/40` with `transition-colors duration-normal`

### TjenesterCTA.astro
- Split single `reveal-on-scroll` wrapper into three: h2, p (stagger-2), button div (stagger-3)
- h2 → p → button cascade in with 80ms / 160ms delay

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `src/components/islands/TjenesterOversiktIsland.tsx` created
- [x] `src/styles/global.css` updated with cubic-bezier, stagger utilities, shimmer-glow
- [x] `src/pages/tjenester/_sections/TjenesterOversikt.astro` uses island with client:visible
- [x] `src/pages/tjenester/_sections/FAQ.astro` uses reveal-stagger-1 through reveal-stagger-6
- [x] `src/pages/tjenester/_sections/TjenesterCTA.astro` has 3 separate staggered reveal elements
- [x] Build passes: 14 pages built in 1.56s (0 errors)
- [x] Commits: ddafa3c, c0cffa7, 9875bc9

## Self-Check: PASSED
