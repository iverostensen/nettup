# Roadmap: Nettup.no

## Milestones

- ✅ **v1.0 Launch** — Phases 1–4 (shipped 2026-03-04)
- 🚧 **v1.1 Tjenesteutvidelse** — Phases 6–11 (in progress)

## Phases

<details>
<summary>✅ v1.0 Launch (Phases 1–4) — SHIPPED 2026-03-04</summary>

- [x] Phase 1: Brand Identity (4/4 plans) — completed 2026-03-03
- [x] Phase 2: Animation & Interaction (3/3 plans) — completed 2026-03-03
- [x] Phase 2.1: Hero animation rework — delivery story (2/2 plans) — completed 2026-03-03 (INSERTED)
- [x] Phase 3: SEO & Portfolio (4/4 plans) — completed 2026-03-04
- [x] Phase 4: Conversion Optimization (2/2 plans) — completed 2026-03-04

See archive: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 Tjenesteutvidelse (In Progress)

**Milestone Goal:** Utvide /tjenester til fullverdig tjenestekatalog med dedikerte undersider per tjenestetype, prisintervaller og kundefokusert innhold.

- [x] **Phase 6: Infrastructure** - Infrastruktur og delt config på plass før første underside shipper (completed 2026-03-04)
- [x] **Phase 7: Tjenesteoversikt** - /tjenester redesignet som 7-tjeneste katalog (completed 2026-03-05)
- [x] **Phase 8: Core Service Pages** - De 3 kjernetjenestesidene ferdigstilt (completed 2026-03-05)
- [x] **Phase 9: Specialist Service Pages** - De 4 spesialistsidene ferdigstilt (completed 2026-03-05)
- [x] **Phase 10: Cross-linking & Validation** - Komplett, interkoblet tjenestekatalogg validert
- [x] **Phase 11: Enhanced Price Calculator** - Mål-først priskalkulator med flerstegsvurdering (completed 2026-03-05)

## Phase Details

### Phase 6: Infrastructure
**Goal**: All shared infrastructure is correct before any service sub-page ships
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, CONFIG-01, CONFIG-02, CTA-02
**Success Criteria** (what must be TRUE):
  1. Clicking a service page CTA (e.g. `/kontakt?tjeneste=nettside`) shows the correct service name badge in the contact form
  2. ContactForm submits with `tjeneste` field populated in Formspree data
  3. The /tjenester nav item is highlighted when visiting any `/tjenester/*` sub-page on both desktop and mobile
  4. Breadcrumbs on `/tjenester/nettside` read "Hjem / Tjenester / Nettside" (not raw slug)
  5. `src/config/services.ts` exists with complete metadata for all 7 services (slug, name, tagline, priceRange, ctaParam)
**Plans**: 3 plans

Plans:
- [ ] 06-01-PLAN.md — Create src/config/services.ts with all 7 service objects
- [ ] 06-02-PLAN.md — Update FloatingNav and MobileMenu with startsWith active state and dynamic label
- [ ] 06-03-PLAN.md — Extend ContactForm with ?tjeneste= support, create Breadcrumbs.astro, update BaseLayout pageLabels

### Phase 7: Tjenesteoversikt
**Goal**: /tjenester is a coherent service catalog that helps visitors identify which service fits them
**Depends on**: Phase 6
**Requirements**: OVERVIEW-01, OVERVIEW-02, OVERVIEW-03
**Success Criteria** (what must be TRUE):
  1. /tjenester shows 7 distinct service cards, each linking to its sub-page
  2. Each card displays: service name, one-sentence outcome, price range, and a link to the dedicated page
  3. The old Enkel/Standard/Premium pricing tier section is gone
**Plans**: 2 plans

Plans:
- [ ] 07-01-PLAN.md — Create TjenesterOversikt.astro (grouped service card grid) and rewrite FAQ.astro
- [ ] 07-02-PLAN.md — Rewrite index.astro (remove old sections, wire new ones, update JSON-LD) and update TjenesterCTA copy

### Phase 8: Core Service Pages
**Goal**: The three highest-traffic service pages are live with complete, conversion-ready content
**Depends on**: Phase 7
**Requirements**: PAGES-01, PAGES-02, PAGES-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, SEO-02, CTA-01
**Success Criteria** (what must be TRUE):
  1. /tjenester/nettside, /tjenester/nettbutikk, and /tjenester/landingsside each exist and load
  2. Each page leads with an outcome-focused headline and price signal above the fold
  3. Each page has a "Hva er inkludert" section and a service-specific FAQ section
  4. Nettbutikk page explicitly states Shopify platform fee with "faktureres separat" language
  5. Each page's CTA button links to `/kontakt?tjeneste=[slug]` and the form correctly pre-fills
  6. Each page has a unique meta title and meta description
**Plans**: TBD

### Phase 9: Specialist Service Pages
**Goal**: The four specialist service pages are live with outcome-first, non-technical content
**Depends on**: Phase 8
**Requirements**: PAGES-04, PAGES-05, PAGES-06, PAGES-07
**Success Criteria** (what must be TRUE):
  1. /tjenester/webapp, /tjenester/seo, /tjenester/ai, and /tjenester/vedlikehold each exist and load
  2. The webapp page describes the 4-step process in plain Norwegian without technical jargon in primary copy
  3. The AI page includes a GDPR/personvern FAQ section
  4. Each page meets the same content and conversion standards established in Phase 8 (500+ words, outcome-first, CTA with pre-fill, unique meta)
**Plans**: TBD

### Phase 10: Cross-linking & Validation
**Goal**: The complete service catalog is interlinked, schema-valid, and every user journey is verified end to end
**Depends on**: Phase 9
**Requirements**: SEO-01, SEO-03
**Success Criteria** (what must be TRUE):
  1. Google Rich Results Test passes for all 7 sub-pages with no errors on Service JSON-LD schema
  2. Google Rich Results Test passes for all 7 sub-pages with no errors on FAQPage JSON-LD schema
  3. All 7 sub-pages appear in the generated sitemap
  4. Each sub-page has at least 2 cross-links to related service pages
**Plans**: TBD

### Phase 11: Enhanced Price Calculator
**Goal**: PrisKalkulator rewritten as goal-first multi-step wizard that routes visitors to the right service and gives a tighter price estimate through 2 narrowing questions per service
**Depends on**: Phase 10
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05
**Success Criteria** (what must be TRUE):
  1. Wizard starts with "Hva er malet ditt?" goal question with 3 options (not a service picker)
  2. After goal selection, a "Vi anbefaler" recommendation step shows the matched service before narrowing
  3. Each service path has 2 narrowing questions with step counter
  4. Result screen includes "hva er inkludert" bullet points and "Les mer" link to service page
  5. All animations transition smoothly between 4 phases with reduced-motion support
**Plans**: 1 plan

Plans:
- [ ] 11-01-PLAN.md — Rewrite PrisKalkulatorIsland with goal-first 4-phase wizard

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Brand Identity | v1.0 | 4/4 | Complete | 2026-03-03 |
| 2. Animation & Interaction | v1.0 | 3/3 | Complete | 2026-03-03 |
| 2.1. Hero animation rework | v1.0 | 2/2 | Complete | 2026-03-03 |
| 3. SEO & Portfolio | v1.0 | 4/4 | Complete | 2026-03-04 |
| 4. Conversion Optimization | v1.0 | 2/2 | Complete | 2026-03-04 |
| 6. Infrastructure | 3/3 | Complete   | 2026-03-04 | - |
| 7. Tjenesteoversikt | 2/2 | Complete   | 2026-03-05 | - |
| 8. Core Service Pages | 3/3 | Complete   | 2026-03-05 | - |
| 9. Specialist Service Pages | 5/5 | Complete   | 2026-03-05 | - |
| 10. Cross-linking & Validation | 2/2 | Complete    | 2026-03-05 | - |
| 11. Enhanced Price Calculator | 1/1 | Complete    | 2026-03-05 | - |
