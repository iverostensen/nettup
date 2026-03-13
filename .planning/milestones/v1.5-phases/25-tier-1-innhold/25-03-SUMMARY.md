---
phase: 25-tier-1-innhold
plan: "03"
subsystem: layout + contact
tags: [footer, kontakt, internal-links, seo, city-pages]
dependency_graph:
  requires: [25-01]
  provides: [LINK-01, LINK-02]
  affects: [src/components/layout/Footer.astro, src/pages/kontakt/index.astro]
tech_stack:
  added: []
  patterns: [dynamic-import-from-config, astro-filter]
key_files:
  modified:
    - src/components/layout/Footer.astro
    - src/pages/kontakt/index.astro
decisions:
  - "lg:grid-cols-4 (not md:grid-cols-4) — prevents 4 columns being too narrow at 768px tablet"
  - "Logo cell uses md:col-span-2 lg:col-span-1 so it spans full-width on tablet but single col on desktop"
  - "Regional sentence uses delay-3 slot; email alternative bumped to delay-4 to preserve animation stagger"
metrics:
  duration: "52s"
  completed_date: "2026-03-08"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 25 Plan 03: Footer city links and /kontakt regional coverage

**One-liner:** Footer "Områder vi dekker" column sourced dynamically from locations.ts + /kontakt regional sentence — both shipped in same build as city pages to prevent orphaned page signals.

## What Was Built

### Task 1 — Footer "Områder vi dekker" column (cf4b75f)

Added a 4th column to the site footer listing all 8 Tier 1 city pages. The column is sourced entirely from `locations.ts` via `cities.filter(c => c.tier <= ACTIVE_TIER)` — no hard-coded city names. When Tier 2 is activated, the footer expands automatically.

Grid updated from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4` so the layout stays clean at 768px tablet (2-col) and expands to 4-col at 1024px+.

### Task 2 — Regional coverage sentence on /kontakt (25dc609)

Inserted a paragraph naming all 8 Tier 1 cities in the left panel of the contact page, between the trust indicators and the email alternative. Satisfies LINK-02 (internal contextual link from a high-authority page to city coverage).

## Deviations from Plan

None — plan executed exactly as written.

## Verification

- `npm run build` passes cleanly (both tasks verified)
- Footer HTML contains "Områder vi dekker" heading and 8 city anchor links (`/steder/{slug}`)
- Footer grid uses `lg:grid-cols-4`
- City list is dynamic (filter from locations.ts)
- /kontakt HTML contains "Vi hjelper bedrifter i hele Oslo-regionen" with all 8 cities named

## Requirements Satisfied

- LINK-01: Footer "Områder vi dekker" column with links to all 8 Tier 1 city pages
- LINK-02: /kontakt page mentions Oslo-regionen and all 8 covered cities

## Self-Check: PASSED
