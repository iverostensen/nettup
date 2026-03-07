# Roadmap: v1.4 Portefølje 2.0

## Overview

This milestone transforms `/prosjekter` from a single-page showcase into a scalable multi-page portfolio system. Two dedicated case study pages (`/prosjekter/igive` and `/prosjekter/blom-company`) replace the existing inline layout. The work proceeds in strict dependency order: visual assets and verified metrics must exist before any page imports them, the config layer must be stable before components are built against it, and SEO structured data is validated only after both pages are live.

## Phases

- [x] **Phase 20: Innholdsforutsetninger** - Capture screenshots, measure Lighthouse scores, produce visual content plan — unblocks all visual content downstream (completed 2026-03-07)
- [ ] **Phase 21: Konfig og indeks** - Extend `projects.ts` interface, redesign `/prosjekter` index as card grid, update `ProjectTeaser` — stable data layer for case study pages
- [ ] **Phase 22: Kasusstudie-sider** - Build `/prosjekter/igive` and `/prosjekter/blom-company` with shared components and GEO-optimized copy
- [ ] **Phase 23: SEO/GEO-pass** - Emit `CreativeWork` + `BreadcrumbList` JSON-LD, verify sitemap coverage, validate all structured data

## Phase Details

### Phase 20: Innholdsforutsetninger
**Goal**: All visual assets and verified performance data exist on disk before any page file imports them
**Depends on**: Nothing (first phase)
**Requirements**: INNHOLD-01, INNHOLD-02, INNHOLD-03
**Success Criteria** (what must be TRUE):
  1. `.planning/VISUAL-CONTENT-PLAN.md` exists listing every required screenshot with filename, section, dimensions, and crop guide for both projects
  2. iGive Lighthouse/PageSpeed scores for `salg.igive.no` are recorded (Performance, Accessibility, Best Practices, SEO) — numbers are real and current, not from the existing hardcoded `Results.astro`
  3. Blom Company screenshots are captured from `blom-no.vercel.app` and committed to `src/assets/images/` following the visual content plan filenames
  4. `npm run build` passes with the committed screenshot files present (no `ENOENT` errors)
**Plans**: 3 plans

Plans:
- [ ] 20-01-PLAN.md — Create VISUAL-CONTENT-PLAN.md (screenshot specs + Lighthouse score table)
- [ ] 20-02-PLAN.md — Measure PageSpeed scores for both projects, record in plan doc
- [ ] 20-03-PLAN.md — Capture screenshots, rename igive image, update imports, validate build

### Phase 21: Konfig og indeks
**Goal**: `projects.ts` interface is extended and all consumers updated atomically; `/prosjekter` renders as a peer card grid linking to slug-based URLs
**Depends on**: Phase 20
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):
  1. `projects.ts` `Project` interface includes `slug`, `techStack[]`, `metrics{}`, `gallery[]`, `testimonialId`, `metaTitle`, `metaDescription`, `publishedAt`; `caseStudySection` flag is absent
  2. `/prosjekter` index page shows both iGive and Blom Company as equal peer cards — each card displays cover image, category, name, tagline, and links to `/prosjekter/[slug]`
  3. `ProjectShowcase.astro` and `Results.astro` are removed from the prosjekter index with no visual regressions on the index page
  4. `BaseLayout` `pageLabels` map contains entries for `/prosjekter/igive` and `/prosjekter/blom-company` (human-readable labels, not raw slugs)
  5. `ProjectTeaser.astro` on the homepage links to `/prosjekter/igive` (not `/prosjekter`)
**Plans**: TBD

### Phase 22: Kasusstudie-sider
**Goal**: Both case study pages exist as complete, production-quality pages with GEO-optimized Norwegian copy
**Depends on**: Phase 20, Phase 21
**Requirements**: SIDE-01, SIDE-02, SIDE-03
**Success Criteria** (what must be TRUE):
  1. `/prosjekter/igive` renders with all required sections: opening summary, challenge, solution, tech stack, features delivered, metrics block (real verified Lighthouse scores), testimonial, live site link
  2. `/prosjekter/blom-company` renders with all required sections: opening summary, challenge, solution, tech stack (Next.js 15 / Shopify / Sanity / Tailwind 4 / Vercel), dual-collection story, Lighthouse scores, testimonial, live site link
  3. Both pages open with a standalone summary paragraph within the first 200 words that a reader (or AI assistant) can cite without additional context
  4. Concrete verifiable numbers (Lighthouse scores, load times, specific tech versions) appear in a distinct visual metrics block on each page
  5. `npm run build` passes with all screenshots imported via `astro:assets` `<Image>`
**Plans**: TBD

### Phase 23: SEO/GEO-pass
**Goal**: Both case study pages have correct structured data, unique SEO metadata, and appear in the sitemap
**Depends on**: Phase 22
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Both pages emit `CreativeWork` JSON-LD with `creator: { "@id": "https://nettup.no/#business" }` and `about: { "@type": "WebSite", url: [client URL] }` — no inline re-declaration of Organization fields
  2. Both pages emit `BreadcrumbList` JSON-LD with human-readable item names (not raw slugs), consistent with the pattern on tjenester and blogg pages
  3. Both pages have `<title>` tags 50–60 characters and meta descriptions 150–160 characters following the `seoTitle` pattern in Norwegian
  4. After `npm run build`, the generated sitemap includes `/prosjekter/igive` and `/prosjekter/blom-company`
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 20. Innholdsforutsetninger | 3/3 | Complete    | 2026-03-07 | - |
| 21. Konfig og indeks | v1.4 | 0/TBD | Not started | - |
| 22. Kasusstudie-sider | v1.4 | 0/TBD | Not started | - |
| 23. SEO/GEO-pass | v1.4 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-03-07*
*Milestone: v1.4 Portefølje 2.0*
*Coverage: 14/14 requirements mapped*
