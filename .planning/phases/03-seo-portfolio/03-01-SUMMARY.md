---
phase: 03-seo-portfolio
plan: "01"
subsystem: seo
tags: [seo, structured-data, breadcrumbs, metadata, json-ld]
dependency_graph:
  requires: []
  provides: [breadcrumb-schema, strengthened-metadata]
  affects: [src/layouts/BaseLayout.astro, src/pages/om-oss/index.astro, src/pages/prosjekter/index.astro]
tech_stack:
  added: []
  patterns: [BreadcrumbList JSON-LD computed from Astro.url.pathname, OG tags via BaseLayout props]
key_files:
  created: []
  modified:
    - src/layouts/BaseLayout.astro
    - src/pages/om-oss/index.astro
    - src/pages/prosjekter/index.astro
decisions:
  - BreadcrumbList computed at build time from Astro.url.pathname — no per-page config required
  - Last breadcrumb item omits item property per Google specification
  - pageLabels lookup table handles Norwegian display names for all 5 routes
metrics:
  duration: 1 min
  completed: "2026-03-04"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 3
---

# Phase 03 Plan 01: SEO Metadata & BreadcrumbList Schema Summary

**One-liner:** BreadcrumbList JSON-LD auto-computed from URL pathname in BaseLayout, plus local/outcome-signal metadata on om-oss and prosjekter.

## What Was Built

### Task 1 — BreadcrumbList JSON-LD in BaseLayout (commit: d512e93)

Added site-wide BreadcrumbList structured data to `src/layouts/BaseLayout.astro`. The schema is computed at build time from `Astro.url.pathname` with no per-page configuration needed:

- `pageLabels` lookup table maps `/tjenester`, `/om-oss`, `/prosjekter`, `/kontakt` to Norwegian display names
- Homepage produces a single-item breadcrumb `["Hjem"]` with its `item` URL retained
- Interior pages produce `["Hjem", "PageName"]` where the last entry has no `item` property (per Google spec)
- All URLs are absolute (`https://nettup.no/...`)
- Pattern matches existing JSON-LD blocks (same `set:html={JSON.stringify(...)}` approach, no `is:inline`)

### Task 2 — Metadata strengthening for om-oss and prosjekter (commit: cd0fb82)

Updated two pages that had weak metadata:

**om-oss** — Adds local search signal:
- Before: `"Om Nettup | Webdesign Byrå Norge"`
- After: `"Om Nettup | Webbyrå i Oslo-området | Moderne nettsider"`
- Description now includes delivery time (to uker) and fixed price signal

**prosjekter** — Adds outcome signal:
- Before: `"Våre Prosjekter | Nettside Portefølje | Nettup"`
- After: `"Prosjekter | Se Resultater fra Norske Bedrifter | Nettup"`
- Description references iGive case study as concrete evidence

Homepage, tjenester, and kontakt were already strong — untouched.

## Verification

All success criteria confirmed in built output:

| Criterion | Result |
|-----------|--------|
| All 5 pages have unique titles | PASS |
| om-oss title includes "Oslo-området" | PASS |
| prosjekter title includes "Se Resultater" | PASS |
| BreadcrumbList JSON-LD on every page | PASS |
| Breadcrumb URLs absolute (https://nettup.no/) | PASS |
| Final breadcrumb item has no `item` on interior pages | PASS |
| Build passes with 0 errors | PASS — 7 pages built in 1.52s |

## Deviations from Plan

None — plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | d512e93 | feat(03-01): add BreadcrumbList JSON-LD schema to BaseLayout |
| 2 | cd0fb82 | feat(03-01): strengthen om-oss and prosjekter metadata |

## Self-Check: PASSED

All modified files exist. Commits d512e93 and cd0fb82 confirmed in git log.
