---
phase: 09-specialist-service-pages
plan: "02"
subsystem: ui
tags: [astro, tailwind, json-ld, seo, webapp]

# Dependency graph
requires:
  - phase: 09-specialist-service-pages
    provides: services.ts extended with monthlyPrice/monthlyPriceLabel (09-01)
provides:
  - /tjenester/webapp page with 5 sections (Hero, Prosess, Inkludert, FAQ, CTA)
  - Service JSON-LD with PriceSpecification (minPrice: 40000) in index.astro
  - FAQPage JSON-LD co-located in FAQ.astro
  - Prosess section pattern with 4 numbered steps (unique to webapp)
affects:
  - 09-03 (seo service page — will follow Hero + Inkludert + FAQ + CTA pattern without Prosess)
  - 09-04 (ai service page — same 4-section pattern)
  - 09-05 (vedlikehold service page — same 4-section pattern)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Prosess section: <ol> with numbered brand-circle badges for multi-step process visualization"
    - "5-section webapp layout: Hero → Prosess → Inkludert → FAQ → CTA (unique vs 4-section template)"
    - "Both price signals in Hero: one-time (fra 40 000 kr) + monthly (+ fra 2 500 kr/mnd vedlikehold)"

key-files:
  created:
    - src/pages/tjenester/webapp/index.astro
    - src/pages/tjenester/webapp/_sections/Hero.astro
    - src/pages/tjenester/webapp/_sections/Prosess.astro
    - src/pages/tjenester/webapp/_sections/Inkludert.astro
    - src/pages/tjenester/webapp/_sections/FAQ.astro
    - src/pages/tjenester/webapp/_sections/CTA.astro
  modified: []

key-decisions:
  - "Webapp is the only specialist service page with a Prosess section — 5 sections vs 4 for other specialists"
  - "Both price signals (one-time + monthly) in Hero as separate lines — not in FAQ or footnote"
  - "Hero h1 ROI-focused: 'Spar timer hver uke' — no API/React/CI/CD jargon in h1 or first paragraph"

patterns-established:
  - "Prosess section: numbered <ol> with <span class='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-surface'>"
  - "monthlyPriceLabel displayed in Hero as separate paragraph with text-text-muted styling"

requirements-completed:
  - PAGES-04

# Metrics
duration: 5min
completed: "2026-03-05"
---

# Phase 9 Plan 02: Webapp Service Page Summary

**Complete /tjenester/webapp page with 5-section layout including unique Prosess section — ROI-focused Hero with dual price signals, 4-step development process, 8-item deliverables grid, 5-question FAQ with code ownership, and Service + FAQPage JSON-LD**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-05T13:15:44Z
- **Completed:** 2026-03-05T13:17:45Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Built complete /tjenester/webapp page with 6 new files across 2 commits
- Hero leads with ROI outcome ("Spar timer hver uke") — no technical jargon in h1 or first paragraph
- Both price signals visible in Hero: fra 40 000 kr (one-time) + fra 2 500 kr/mnd (maintenance)
- Prosess.astro with exactly 4 steps: Kartlegging, Prototyp, Bygging, Lansering — unique to webapp
- FAQ includes 5 webapp-specific questions including "Hvem eier koden" ownership question
- Service JSON-LD (minPrice: 40000) in index.astro; FAQPage JSON-LD co-located in FAQ.astro
- Build passes cleanly: 11 pages including /tjenester/webapp

## Task Commits

Each task was committed atomically:

1. **Task 1: Hero, Prosess, Inkludert, CTA sections** - `3ffb464` (feat)
2. **Task 2: FAQ.astro and index.astro** - `1a3b312` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `src/pages/tjenester/webapp/index.astro` - Page root: meta, Service JSON-LD, 5-section composition
- `src/pages/tjenester/webapp/_sections/Hero.astro` - ROI-focused h1, both price signals, CTA to /kontakt?tjeneste=webapp
- `src/pages/tjenester/webapp/_sections/Prosess.astro` - 4-step numbered process: Kartlegging → Prototyp → Bygging → Lansering
- `src/pages/tjenester/webapp/_sections/Inkludert.astro` - 8-feature checkmark grid with substantive descriptions
- `src/pages/tjenester/webapp/_sections/FAQ.astro` - 5 webapp-specific questions + inline FAQPage JSON-LD
- `src/pages/tjenester/webapp/_sections/CTA.astro` - Section CTA linking to /kontakt?tjeneste=webapp

## Decisions Made
- Webapp gets an additional Prosess section (5 sections total) — the only specialist page with this section
- Monthly price shown in Hero alongside one-time price (not hidden in FAQ) — maximizes price transparency above fold
- Hero h1 uses outcome language ("Spar timer hver uke") with no technical jargon per plan requirements

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /tjenester/webapp complete and buildable — ready to proceed to 09-03 (SEO service page)
- Prosess section pattern established if needed for future pages
- 5-section pattern (with Prosess) documented; other specialist pages use 4-section (no Prosess)

---
*Phase: 09-specialist-service-pages*
*Completed: 2026-03-05*
