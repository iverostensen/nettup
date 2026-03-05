---
phase: quick-2
plan: "01"
subsystem: tjenester
tags: [react, framer-motion, wizard, conversion, tjenester]
dependency_graph:
  requires: [services.ts, animation.ts, TjenesterOversikt.astro]
  provides: [PrisKalkulatorIsland, PrisKalkulator section]
  affects: [tjenester/index.astro]
tech_stack:
  added: []
  patterns: [AnimatePresence-step-wizard, client:visible-island, direction-aware-slide]
key_files:
  created:
    - src/components/islands/PrisKalkulatorIsland.tsx
    - src/pages/tjenester/_sections/PrisKalkulator.astro
  modified:
    - src/pages/tjenester/index.astro
decisions:
  - "Direction-aware slide uses custom variant function (not separate enter/exit variants) for clean AnimatePresence integration"
  - "prefers-reduced-motion replaces x movement with fadeIn — no extra imports needed, fadeIn already in animation.ts"
  - "Result screen uses flex-col on mobile, flex-row on sm+ for CTA + reset button layout without overflow"
metrics:
  duration: "1 min 8 sec"
  completed_date: "2026-03-05"
  tasks_completed: 2
  files_changed: 3
---

# Quick Task 2: PrisKalkulator Island Summary

**One-liner:** 4-question branching wizard with Framer Motion slide transitions recommends one of three services and links to /kontakt with ?tjeneste= pre-filled.

## What Was Built

A multi-step price calculator wizard (PrisKalkulatorIsland) added to /tjenester between TjenesterOversikt and FAQ. Visitors answer 4 yes/no questions that branch to a recommended service (nettbutikk, nettside, or landingsside), then see the service name, tagline, price range, monthly hosting label, and a CTA button linking directly to /kontakt with the service pre-filled via `?tjeneste=` query param.

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build PrisKalkulatorIsland React component | c652aea | src/components/islands/PrisKalkulatorIsland.tsx |
| 2 | Create section wrapper and wire into tjenester page | ff8dd70 | src/pages/tjenester/_sections/PrisKalkulator.astro, src/pages/tjenester/index.astro |

## Decisions Made

1. **Direction-aware slide via custom variant function** — `variants` accepts a `custom` prop (direction: 1 | -1) for `enter` and `exit` separately, keeping animation logic in one object rather than swapping variant sets.
2. **prefers-reduced-motion uses fadeIn (not fadeUp)** — x-axis removal is the key accommodation; fadeIn from animation.ts suffices without adding a new variant.
3. **Mobile CTA layout** — `flex-col` on base, `sm:flex-row` on wider screens ensures "Kom i gang" and "Ta meg tilbake" don't overflow at 375px.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- FOUND: src/components/islands/PrisKalkulatorIsland.tsx
- FOUND: src/pages/tjenester/_sections/PrisKalkulator.astro
- FOUND: commit c652aea (Task 1)
- FOUND: commit ff8dd70 (Task 2)
- Build: clean (10 pages, 1.57s)
