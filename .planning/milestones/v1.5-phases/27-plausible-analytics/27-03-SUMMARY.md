---
phase: 27-plausible-analytics
plan: "03"
subsystem: analytics
tags: [plausible, city-pages, cta-tracking, goals-dashboard]
dependency_graph:
  requires: [27-01]
  provides: [ANAL-03]
  affects: [steder/[location].astro]
tech_stack:
  added: []
  patterns:
    - is:inline script with IIFE for non-island page tracking
    - data-city attribute on anchor for slug propagation
    - window.plausible direct call (not analytics.ts import — incompatible with is:inline)
key_files:
  modified:
    - src/pages/steder/[location].astro
decisions:
  - Used is:inline script with direct window.plausible call instead of importing analytics.ts — ES module imports are incompatible with is:inline scripts
  - Replaced Button component with plain <a> to allow data-city attribute and id attachment for the inline script
  - IIFE wrapper avoids global scope pollution
metrics:
  duration: "~5 min"
  completed: "2026-03-13"
  tasks_completed: 2
  files_modified: 1
---

# Phase 27 Plan 03: City CTA Tracking + Plausible Goals Summary

**One-liner:** Wired City CTA Clicked event on [location].astro via is:inline script and registered all 7 Goals in the Plausible dashboard.

## Tasks Completed

| Task | Name | Files |
|------|------|-------|
| 1 | Replace CTA Button with tracked anchor + is:inline script | steder/[location].astro |
| 2 | Register 7 Goals in Plausible dashboard | plausible.io (manual) |

## What Was Built

### Task 1: City CTA Tracking

Replaced `<Button href="/kontakt">` in the city page CTA section with a plain `<a>` carrying `id="city-cta"` and `data-city={city.slug}`. Added an `is:inline` IIFE at the bottom of the file that attaches a click listener — on click, reads the `data-city` attribute and fires `window.plausible('City CTA Clicked', { props: { city: city } })`.

### Task 2: Plausible Goals

All 7 custom event Goals registered in plausible.io Settings → Goals:
- Contact Form Submit
- B2B Form Submit
- Wizard Estimate Shown
- Wizard CTA Clicked
- Chatbot Opened
- Chatbot Suggestion Clicked
- City CTA Clicked

## Decisions Made

- **Direct window.plausible vs analytics.ts:** `is:inline` scripts cannot import ES modules, so `trackCityCtaClicked()` from analytics.ts cannot be used here. Direct `window.plausible` call is the correct Astro pattern for non-island pages.
- **Plain anchor over Button component:** The Button component renders server-side and cannot receive `data-*` attributes or `id` for the inline script to target.

## Deviations from Plan

None — implemented exactly as specified.

## Self-Check

- [x] `src/pages/steder/[location].astro` has `id="city-cta"` and `data-city={city.slug}` on CTA anchor
- [x] `is:inline` script present with `window.plausible('City CTA Clicked', ...)` call
- [x] All 7 Goals registered in Plausible dashboard
- [x] Build passes

## Self-Check: PASSED
