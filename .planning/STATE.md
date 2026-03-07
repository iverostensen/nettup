---
gsd_state_version: 1.0
milestone: v1.4
milestone_name: milestone
status: unknown
last_updated: "2026-03-07T21:00:00.000Z"
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 10
  completed_plans: 9
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-07 after v1.4 milestone start)

**Core value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt -- og at kvaliteten beviser det.
**Current focus:** v1.4 Portefølje 2.0 — Phase 20 ready to plan

## Current Position

Phase: 20 of 23 (Innholdsforutsetninger)
Plan: 02 complete, 03 next
Status: In progress
Last activity: 2026-03-07 — Completed 20-02 (Lighthouse scores recorded)

Progress: [█░░░░░░░░░] 9%

## Performance Metrics

**Velocity:**
- Total plans completed: 5 (v1.3)
- Average duration: ~7 min
- Total execution time: ~35 min

**By Phase (v1.3):**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 17. Blog Infrastructure | 2/2 | 10 min | 5 min |
| 18. Pipeline Scripts | 2/2 | 5 min | 2.5 min |
| 19. GitHub Actions | 1/1 | 15 min | 15 min |
| Phase 20 P01 | 1 | 1 tasks | 1 files |

## Accumulated Context

### Decisions

Key decisions from v1.4 research to carry into planning:

- [v1.4 research]: Screenshots must be committed BEFORE any Astro `<Image>` imports on case study pages — hard build-time dependency (ENOENT on missing files)
- [v1.4 research]: `caseStudySection` flag removal must be atomic with `ProjectShowcase.astro` removal — silent blank page otherwise
- [v1.4 research]: Use `"creator": {"@id": "https://nettup.no/#business"}` in CreativeWork JSON-LD — never re-declare Organization fields inline
- [v1.4 research]: `ProjectTeaser.astro` on homepage is hardcoded — must update to use `project.slug` in Phase 21
- [v1.4 research]: BreadcrumbList shows raw slugs if `pageLabels` not updated — fix in Phase 21 before pages go live
- [v1.4 research]: iGive Lighthouse scores in existing `Results.astro` are hardcoded "95" — must remeasure against live `salg.igive.no` before writing metrics section
- [Phase 20]: Filenames locked before capture: igive-hero.png, igive-features.png, blom-hero.png, blom-features.png (1600x900)
- [Phase 20]: Lighthouse scores left as pending dashes — measured after screenshots, never fabricated
- [Phase 20-02]: iGive (salg.igive.no) measured 96/96/100/100 (Perf/A11y/BP/SEO) on 2026-03-07
- [Phase 20-02]: Blom Company (blomcompany.com) measured 99/96/100/100 — blomcompany.com DNS resolved, no fallback needed

### Pending Todos

- Replace placeholder testimonials in `src/config/testimonials.ts` before launch traffic (carried from v1.0)
- Verify Shopify platform fee figure before publishing on nettbutikk page (research flag)
- Verify Nettup's Shopify Partner status before writing nettbutikk credibility copy (research flag)
- iGive: real testimonial quote requires client outreach — launch with placeholder, update post-launch

### Blockers/Concerns

- Blom Company staging URL (`blom-no.vercel.app`) is the source for screenshots — if live domain goes up before publish, update `url` field in projects.ts and live site link

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | Analyse and implement refined microanimations and hover effects on /tjenester | 2026-03-05 | 9875bc9 | [1-analyse-the-tjenester-page-and-the-micro](.planning/quick/1-analyse-the-tjenester-page-and-the-micro/) |
| 2 | Add PrisKalkulator island to tjenester page | 2026-03-05 | ff8dd70 | [2-add-priskalkulator-island-to-tjenester-p](.planning/quick/2-add-priskalkulator-island-to-tjenester-p/) |
| 3 | Enhance price calculator with narrowing questions | 2026-03-05 | 5a13402 | [3-enhance-price-calculator-with-narrowing-](.planning/quick/3-enhance-price-calculator-with-narrowing-/) |
| 4 | Update /tjenester/[slug] pages: remove RelaterteTjenester, fix support text, add 9th feature | 2026-03-06 | f5ca5ab | [4-update-tjenester-slug-pages-remove-relat](.planning/quick/4-update-tjenester-slug-pages-remove-relat/) |
| 5 | Iterate on price calculator UI/UX: animated check icons, hover depth, press states, connector transitions | 2026-03-06 | 2e21e48 | [5-iterate-on-price-calculator-ui-ux-layout](.planning/quick/5-iterate-on-price-calculator-ui-ux-layout/) |

## Session Continuity

Last session: 2026-03-07
Stopped at: Completed 20-02-PLAN.md — Lighthouse scores recorded in VISUAL-CONTENT-PLAN.md
Resume file: None
