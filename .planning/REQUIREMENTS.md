# Requirements: Nettup v1.5 Lokale SEO-sider

**Defined:** 2026-03-08
**Core Value:** En potensiell kunde som lander pa siden skal umiddelbart forsta at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: URL slug pattern is decided and documented before any page is built
- [x] **INFRA-02**: `locations.ts` exposes a TypeScript interface with `tier`, city data, `intro`, `faq`, `nearbyAreas`, and `industries` fields — designed to scale from V1 (8 cities) through V2 (50) to V3 (300+) without structural changes
- [x] **INFRA-03**: Dynamic `[location].astro` route generates one static page per `locations.ts` entry via `getStaticPaths()`
- [x] **INFRA-04**: Every city page has a canonical self-referencing URL tag and no conflicting `noindex`

### Content & Copy

- [x] **CONTENT-01**: 6–8 Tier 1 city entries exist with genuinely differentiated intro copy (not city-name-swapped boilerplate — ≥60% unique per page)
- [x] **CONTENT-02**: Every city page has a city-specific FAQ section (e.g., "Holder dere til i Drammen?")

### Schema & Metadata

- [ ] **SEO-01**: Each city page emits a `Service` JSON-LD block with `areaServed` referencing the global `LocalBusiness @id` — no duplicate `LocalBusiness` declarations
- [x] **SEO-02**: Each city page has a unique `<title>`, `<meta description>`, and `og:title`

### Linking & Verification

- [ ] **LINK-01**: Footer has an "Omrader vi dekker" section listing all Tier 1 cities — ships in the same deploy as city pages (no orphan pages)
- [ ] **LINK-02**: `/kontakt` page mentions Oslo-region and nearby areas coverage
- [ ] **LINK-03**: All city pages appear in `sitemap-index.xml` after first deploy (verified manually)
- [ ] **LINK-04**: V2 promotion criteria documented as measurable thresholds before V2 work begins (e.g. all V1 pages indexed in Search Console + ≥3 pages with organic impressions)

## v2 Requirements

*To be defined once V1 is live and indexing signals are confirmed.*

### Expansion

- **EXPAND-01**: 30–50 additional Norwegian towns with AI-assisted copy, reviewed before publish
- **EXPAND-02**: AI generation pipeline for city copy (similar pattern to blog pipeline)
- **EXPAND-03**: Human review gate before any AI-generated city page goes live

### Regional coverage

- **REGION-01**: Bergen, Stavanger, Trondheim, Kristiansand, Tromso city pages
- **REGION-02**: Industry-angle pages (e.g., "nettside for maritime bedrifter i Alesund")

## v3 Requirements

*Deferred. Requires V2 indexing proof and defined content quality process.*

- Full Norway coverage (300+ municipalities) with structured data pipeline
- `/steder` index page listing cities by region

## Out of Scope

| Feature | Reason |
|---------|--------|
| Per-city address in schema | Nettup has no physical presence in each city — service-area `areaServed` is the correct pattern |
| `/steder` index page | Not needed in V1; V2+ if coverage grows beyond 8 cities |
| City-specific pricing | All pricing is transparent and service-based, not location-based |
| hreflang tags | Single-language site — irrelevant |
| Auto-publish V2 pages | V2 requires human review gate; never auto-publish city pages |
| V3 (full Norway) in this milestone | Must validate V1 indexing signals before scaling to 300+ pages |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 24 | Complete |
| INFRA-02 | Phase 24 | Complete |
| INFRA-03 | Phase 24 | Complete |
| INFRA-04 | Phase 24 | Complete |
| CONTENT-01 | Phase 25 | Complete |
| CONTENT-02 | Phase 25 | Complete |
| SEO-01 | Phase 25 | Pending |
| SEO-02 | Phase 25 | Complete |
| LINK-01 | Phase 25 | Pending |
| LINK-02 | Phase 25 | Pending |
| LINK-03 | Phase 26 | Pending |
| LINK-04 | Phase 26 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-08*
*Last updated: 2026-03-08 after roadmap creation*
