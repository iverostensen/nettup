---
phase: quick-3
plan: "01"
subsystem: tjenester/priskalkulator
tags: [react, framer-motion, wizard, pricing]
dependency_graph:
  requires: []
  provides: [PrisKalkulatorIsland-v2]
  affects: [tjenester-page]
tech_stack:
  added: []
  patterns: [two-phase-wizard, narrowing-questions, state-machine]
key_files:
  created: []
  modified:
    - src/components/islands/PrisKalkulatorIsland.tsx
decisions:
  - "State held in single State object (phase+selectedService+narrowStep+priceEstimate) instead of multiple useState calls — cleaner transitions"
  - "narrowingQuestions keyed by ServiceSlug Record — type-safe, co-located with component, no config file needed"
  - "animKey computed from phase+narrowStep — AnimatePresence gets unique key per screen including multiple narrowing steps"
metrics:
  duration: "5 min"
  completed: "2026-03-05"
  tasks: 1
  files: 1
---

# Quick Task 3: Enhance Price Calculator with Narrowing Questions Summary

Two-phase wizard replacing binary yes/no tree: service picker then per-service narrowing questions producing a specific price estimate.

## What Was Built

Rewrote `PrisKalkulatorIsland.tsx` from scratch. The old component had a 4-step yes/no decision tree that ended with the service's generic `priceRange`. The new component has three phases:

**Phase A — Service picker:** Three clickable buttons (nettside, nettbutikk, landingsside) each showing service name and tagline. No yes/no. Clicking immediately advances to Phase B.

**Phase B — Narrowing question:** One targeted question per service with 2-3 options. Each option shows a label and the specific `priceEstimate` for that scope. The question and options are defined in a `narrowingQuestions` Record typed by ServiceSlug.

**Phase C — Result:** Shows service name, tagline, the specific `priceEstimate` chosen in Phase B (not the generic `priceRange`), monthly hosting note from `services.ts monthlyPriceLabel`, CTA to `/kontakt?tjeneste={ctaParam}`, and "Start på nytt" button that resets to Phase A.

## Narrowing Questions

| Service | Question | Options |
|---------|----------|---------|
| nettside | Hvor mange sider trenger du? | 1-5 sider → fra 15 000 kr, 6-15 sider → fra 22 000 kr, 16+ sider → fra 35 000 kr |
| nettbutikk | Hvor mange produkter skal du selge? | Under 50 → fra 25 000 kr, 50-500 → fra 40 000 kr, 500+ → fra 60 000 kr |
| landingsside | Trenger du integrasjoner? | Nei → fra 8 000 kr, Ja → fra 12 000 kr |

## Animations

Kept `slideVariants` with `direction` (always 1 forward, -1 on reset). `AnimatePresence mode="wait"` keyed by a computed `animKey` that is unique per phase and narrow step. `useReducedMotion` guard unchanged.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `src/components/islands/PrisKalkulatorIsland.tsx` exists with new implementation
- [x] `npm run build` exits 0 (10 pages built in 1.73s)
- [x] `npm run lint` exits 0 (0 errors)
- [x] No `any` types introduced (all types explicit: ServiceSlug, Phase, State, NarrowingQuestion, NarrowingOption)
- [x] Commit 5a13402 exists

## Self-Check: PASSED
