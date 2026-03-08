---
phase: quick-7
plan: 7
subsystem: pages
tags: [404, error-page, ux]
dependency_graph:
  requires: [src/layouts/BaseLayout.astro]
  provides: [src/pages/404.astro]
  affects: []
tech_stack:
  added: []
  patterns: [astro-page, base-layout-wrap]
key_files:
  created:
    - src/pages/404.astro
  modified: []
decisions:
  - Static Astro page (no Framer Motion) — error page doesn't need animations
  - BaseLayout handles FloatingNav and Footer; no manual import needed
  - Secondary link to /kontakt as plain text link (not a button) to maintain visual hierarchy
metrics:
  duration: "~3 min"
  completed: "2026-03-08"
---

# Quick Task 7: Add Custom 404 Page — Summary

**One-liner:** Branded dark-theme 404 page in Norwegian with homepage CTA and /kontakt secondary link, served automatically by Astro for all unmatched routes.

## What Was Built

`src/pages/404.astro` — a custom error page that Astro serves for every unmatched route. The page wraps `BaseLayout` so FloatingNav and Footer render correctly. Content is centered vertically in a `min-h-[60vh]` container, featuring a large `text-9xl` "404" in `text-brand`, the heading "Denne siden finnes ikke", a muted subtext, and two action links: a primary brand button to `/` and a secondary text link to `/kontakt`.

## Tasks

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Create 404.astro | d6e0008 | src/pages/404.astro |

## Verification

- `npm run build` exits 0
- `@astrojs/sitemap` automatically excludes 404 routes — no manual exclusion needed
- Page title prop: "404 – Side ikke funnet | Nettup"

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- src/pages/404.astro: FOUND
- Commit d6e0008: present in git log
