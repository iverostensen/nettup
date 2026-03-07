# Requirements: Nettup v1.4 Portefølje 2.0

**Defined:** 2026-03-07
**Core Value:** En potensiell kunde som lander på siden skal umiddelbart forstå at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## v1 Requirements

### Infrastruktur

- [ ] **INFR-01**: `projects.ts` interface extended with `slug`, `techStack[]`, `metrics{}`, `gallery[]`, `testimonialId`, `metaTitle`, `metaDescription`, `publishedAt`; `caseStudySection` flag removed and all consumers updated atomically
- [ ] **INFR-02**: `/prosjekter` index redesigned as project card grid — each card shows cover image, category, name, tagline, and links to `/prosjekter/[slug]`
- [ ] **INFR-03**: `ProjectShowcase.astro` and `Results.astro` removed from prosjekter index, replaced by project grid section
- [ ] **INFR-04**: `BaseLayout` `pageLabels` updated with explicit entries for `/prosjekter/igive` and `/prosjekter/blom-company` so BreadcrumbList structured data renders correctly

### Innhold

- [x] **INNHOLD-01**: Visual content plan document exists at `.planning/VISUAL-CONTENT-PLAN.md` listing all required screenshots per project (filename, section, dimensions, crop guide)
- [x] **INNHOLD-02**: iGive Lighthouse/PageSpeed scores measured against `salg.igive.no` production URL and recorded (Performance, Accessibility, Best Practices, SEO, plus Core Web Vitals where available)
- [ ] **INNHOLD-03**: Blom Company screenshots captured from `blom-no.vercel.app` staging and committed to `src/assets/images/` per the visual content plan

### Sider

- [ ] **SIDE-01**: `/prosjekter/igive` exists as a dedicated page with all table-stakes sections: opening summary paragraph, challenge, solution, tech stack, features delivered, metrics block, testimonial, live site link
- [ ] **SIDE-02**: `/prosjekter/blom-company` exists as a dedicated page with all table-stakes sections: opening summary paragraph, challenge, solution, tech stack (Next.js 15 / Shopify / Sanity / Tailwind 4 / Vercel), dual-collection story, Lighthouse scores, testimonial, live site link
- [ ] **SIDE-03**: Both pages have GEO-optimized copy — standalone summary paragraph visible within opening 200 words, concrete verifiable numbers (scores, load times, specific tech versions) as a distinct visual metrics block

### SEO

- [ ] **SEO-01**: Both case study pages emit `CreativeWork` JSON-LD with `creator: { @type: Organization, name: Nettup }` and `about: { @type: WebSite, url: [client URL] }`
- [ ] **SEO-02**: Both case study pages emit `BreadcrumbList` JSON-LD consistent with the pattern on tjenester and blogg pages
- [ ] **SEO-03**: Both case study pages have unique `<title>` tags (50–60 chars) and meta descriptions (150–160 chars) following the `seoTitle` pattern
- [ ] **SEO-04**: Both pages appear in the auto-generated sitemap via `@astrojs/sitemap` (verified after `npm run build`)

## v2 Requirements

### Utvidelser

- **EXT-01**: Cross-links from relevant service pages to case studies (e.g. `/tjenester/nettbutikk` → Blom Company) — deferred, no service page refactor in v1.4
- **EXT-02**: Per-project OG images (static or generated) — deferred, global OG image fallback sufficient for v1.4
- **EXT-03**: Prosjekt #3 og fremover — arkitektur er klar, innhold mangler

## Out of Scope

| Feature | Reason |
|---------|--------|
| FAQPage JSON-LD on case study pages | Google deprecated FAQPage rich results for most sites Aug 2023 — adds no value, may confuse structured data audit |
| Dynamic `[slug].astro` routing | 2–5 projects don't justify the overhead; individual files match tjenester pattern and allow structural differentiation per project |
| Satori / dynamic OG image generation | Adds ~8 MB devDependencies for a problem that doesn't exist at current scale |
| iGive testimonial replacement | Placeholder testimonial is a known gap; real quote requires client outreach, out of scope for this milestone |
| Cross-links from service pages | Excluded from v1.4 scope; no structural change to tjenester pages in this milestone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INNHOLD-01 | Phase 20 | Complete |
| INNHOLD-02 | Phase 20 | Complete |
| INNHOLD-03 | Phase 20 | Pending |
| INFR-01 | Phase 21 | Pending |
| INFR-02 | Phase 21 | Pending |
| INFR-03 | Phase 21 | Pending |
| INFR-04 | Phase 21 | Pending |
| SIDE-01 | Phase 22 | Pending |
| SIDE-02 | Phase 22 | Pending |
| SIDE-03 | Phase 22 | Pending |
| SEO-01 | Phase 23 | Pending |
| SEO-02 | Phase 23 | Pending |
| SEO-03 | Phase 23 | Pending |
| SEO-04 | Phase 23 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after roadmap creation*
