# Project Research Summary

**Project:** Nettup v1.5 — Lokale SEO-sider (city landing pages)
**Domain:** Local SEO landing pages — service-area web agency, Norwegian market
**Researched:** 2026-03-08
**Confidence:** HIGH

## Executive Summary

Nettup v1.5 adds city-targeted landing pages to the existing Astro 5 marketing site. The approach is config-driven static generation: a single `src/pages/steder/[location].astro` dynamic route driven by a `src/config/locations.ts` data file, mirroring the established `[slug].astro` + `projects.ts` pattern already in production. Zero new dependencies are required. The architecture supports V1 (6–8 hand-crafted cities), V2 (30–50 AI-assisted), and V3 (300+ programmatic) without structural changes — expansion is a data-only operation at every stage.

The central constraint is Google's doorway page policy, which is actively enforced (March 2024 and August 2025 core updates). City pages that share more than ~40% of their body content — or that are orphaned from site navigation — are treated as spam and quietly deindexed. Every V1 page must pass the intent test: it must contain genuinely differentiated content that references real local context (industry clusters, geography, nearby areas), not merely city-name substitution into boilerplate. This is not optional and is the dominant design constraint for every phase of the milestone.

The recommended execution is strictly phased: build the infrastructure foundation first (data model + route template + JSON-LD architecture), then write hand-crafted content for 6–8 Tier 1 cities, then ship with mandatory internal linking simultaneously. V2 and V3 expansion must wait for V1 indexing confirmation in Google Search Console. Publishing thin pages prematurely can suppress the entire site's ranking, including existing service pages and the blog. The technical architecture is simple and low-risk; the content and SEO discipline is where this project succeeds or fails.

---

## Key Findings

### Recommended Stack

The existing stack handles everything. No new packages are required. The `src/config/locations.ts` pattern mirrors `src/config/projects.ts` exactly. The `getStaticPaths()` pattern mirrors `src/pages/prosjekter/[slug].astro`. City-scoped JSON-LD is injected via the `<slot name="head" />` mechanism already used by blog articles. The sitemap integration auto-discovers all static routes including city pages. BaseLayout's `Props` interface does not need to change.

**Core technologies (all existing):**
- **Astro 5 `getStaticPaths()`** — static generation of all city pages at build time; synchronous, no I/O; ~127 pages/sec throughput handles 300 cities in under 3s
- **`src/config/locations.ts`** — typed `City` interface as single source of truth for all city data, SEO metadata, schema, and internal links
- **`<Fragment slot="head">`** — city-scoped JSON-LD injection without modifying BaseLayout; established by `blogg/[slug].astro`
- **`@astrojs/sitemap`** — auto-includes all `/steder/*` static routes; no config changes needed for V1
- **TypeScript strict mode** — enforces required fields on all `City` entries at build time; catches missing content before deploy

### Expected Features

**Must have (table stakes):**
- Unique city intro paragraph (200+ words with local industry and geography reference) — doorway page prevention; the 60% unique content threshold starts here
- City-specific `<title>` and `<meta description>` — primary on-page local ranking signals
- `ProfessionalService` JSON-LD with `areaServed` per city — machine-readable geo-targeting (use `ProfessionalService` subtype, not generic `LocalBusiness`)
- `FAQPage` JSON-LD from city-specific FAQ questions — rich result eligibility and AI citability
- `BreadcrumbList` JSON-LD — site hierarchy signal; existing pattern from service pages
- Footer "Områder vi dekker" section with Tier 1 city links — orphan page prevention (must ship with city pages, not after)
- Internal links from `/kontakt` and `/om-oss` — second and third link equity sources
- Self-referencing canonical URL per city — prevents duplicate content consolidation
- City-specific FAQ (3–4 questions, minimum 2 genuinely local) — passes doorway intent test
- Nearby areas on-page and in schema `areaServed` — longtail geographic relevance
- Industry mention per city (1–2 sentences, dominant local sector) — signals genuine local knowledge

**Should have (competitive advantage):**
- Chatbot city context injection — intelligent local responses via existing page-context infrastructure
- Blog lokal-seo cluster articles linking to city pages — editorial internal link equity
- Real testimonials per city — highest-trust local signal; field reserved in data model, not displayed until real quotes exist

**Defer (v2+):**
- 30–50 Tier 2 AI-assisted city pages — separate milestone; requires V1 indexing confirmation
- `serviceArea` with `GeoCircle` coordinates — marginal gain, not needed for named cities
- Per-service city pages (`/steder/oslo/nettbutikk`) — high complexity, only if Tier 1 converts
- Regional hub pages (`/oslofjord`) — only valuable at V3 scale; a standalone `/steder` index with no content is itself a doorway pattern

### Architecture Approach

The architecture is a hub-and-spoke data model. `locations.ts` is the hub — it drives `getStaticPaths()`, supplies all per-page SEO metadata, provides data to all section components, and feeds the footer's dynamic city link section. The route template `steder/[location].astro` is the page skeleton, composing six section components that each receive the full `City` object as a prop. JSON-LD is assembled in the route template and injected via `<Fragment slot="head">`. BaseLayout remains unmodified. The URL structure `/steder/[slug]` (using the Norwegian word "steder") avoids collision with existing static pages entirely.

**Major components:**
1. **`src/config/locations.ts`** — city data model; single source of truth; V1/V2/V3 expansion is adding entries, not changing the interface
2. **`src/pages/steder/[location].astro`** — dynamic route; owns page composition and all JSON-LD blocks
3. **`src/pages/steder/_sections/`** — six section components: `CityHero`, `CityServices`, `CityFAQ`, `CityTestimonials`, `CityCTA`, `NearbyAreas`
4. **`src/components/layout/Footer.astro` (modified)** — Tier 1 city links via `locations.ts` import filtered by `tier === 1`
5. **`src/pages/kontakt/index.astro` (modified)** — static coverage paragraph with 4–5 key city links

### Critical Pitfalls

1. **Doorway page pattern** — Swapping only the city name while keeping identical copy triggers Google's spam detection. Text diff between any two city pages must show >60% unique content. The intro paragraph and FAQ are the non-negotiable differentiation points. Enforce at authoring time; cannot be fixed post-penalty without rewriting every affected page.

2. **Premature V2/V3 scaling causing site-level thin content penalty** — Google's helpful content system evaluates sites holistically. Thin V3 pages can drag down existing service pages and blog rankings. Gate V2 on V1 indexing confirmation in Search Console. Build the `tier` filter into `getStaticPaths()` from day one and never deploy beyond the current tier.

3. **Canonical misconfiguration** — If `[location].astro` does not explicitly pass `canonical` to BaseLayout, it may default incorrectly. Each city page must self-reference: `canonical="https://nettup.no/steder/[slug]"`. Never combine `noindex` and canonical on the same page. Verify in post-build HTML check before first deploy.

4. **Schema entity duplication from multiple LocalBusiness blocks** — Two `LocalBusiness` blocks with different `@id` values create two separate business entities in Google's Knowledge Graph. City pages should either use a `Service` type referencing the root entity via `"provider": {"@id": "https://nettup.no/#business"}`, or inject a city-scoped `LocalBusiness` that shares the same `@id` as the global one with a narrowed `areaServed`. The root `BaseLayout` schema's `areaServed` should also be derived from `locations.ts` at build time.

5. **Sitemap enumeration failure in Vercel hybrid mode** — `@astrojs/sitemap` has a known regression in hybrid mode (GitHub issue #7015). Nettup uses Vercel hybrid for `/api/chat`. Verify sitemap coverage immediately after first deploy. Have a custom `src/pages/sitemap-locations.xml.ts` endpoint ready as a fallback.

---

## Implications for Roadmap

Based on combined research, three sequential phases are the correct structure. Each phase has a hard dependency on the previous one. Reordering creates rework or SEO risk.

### Phase 1: Infrastructure Foundation

**Rationale:** Everything depends on `locations.ts` being correctly typed and `[location].astro` routing correctly. The TypeScript interface, URL structure, JSON-LD schema architecture, and canonical URL pattern must all be locked before content is written. Getting these wrong causes rework across all section components and all city entries.

**Delivers:** `locations.ts` with V1/V2/V3-ready `City` interface and 1–2 stub entries to validate the build; `[location].astro` dynamic route skeleton verified building and routing correctly; all 6 section components scaffolded; JSON-LD schema architecture resolved (`Service` + `@id` reference vs city-scoped `LocalBusiness`); canonical URL pattern confirmed in rendered HTML; `tier` filter gate in `getStaticPaths()`.

**Addresses:** Canonical misconfiguration (Pitfall 3), schema entity duplication (Pitfall 4), anti-pattern of root-level dynamic route collision, `areaServed` in root BaseLayout derived from `locations.ts`.

**Avoids:** Structural rework forced by late interface changes; canonical errors propagating to all city pages; schema architecture debt.

**Research flag:** Standard patterns — no phase research needed. Config-driven `getStaticPaths()` is a direct mirror of the production `prosjekter/[slug].astro` pattern.

---

### Phase 2: V1 Content and City Pages

**Rationale:** Content is the hardest and highest-risk part of this milestone. The doorway page test depends entirely on content quality, not code quality. Content must be written after the template is confirmed working (Phase 1) so each city can be previewed while being authored. Internal linking must ship simultaneously with city pages in the same deploy — orphaned pages at launch is a meaningful penalty risk.

**Delivers:** 6–8 fully authored Tier 1 city pages (Oslo, Drammen, Asker, Bærum, Lillestrøm, Sandvika, Ski, Moss) with hand-crafted intro paragraphs, city-specific FAQ (3–4 questions, 2+ genuinely local), industry mentions, and nearby area lists; complete JSON-LD for each page; Footer "Områder vi dekker" section; `/kontakt` coverage paragraph; all V1 pages linked from at least 2 existing pages.

**Addresses:** Unique intro per city (doorway test), city-specific FAQ, `ProfessionalService` JSON-LD with `areaServed`, footer internal linking, contact page linking, `BreadcrumbList`, per-city `<title>` and `<meta description>`, nearby areas on-page text.

**Avoids:** Doorway page pattern (Pitfall 1), thin content (Pitfall 2), orphaned pages, city name keyword stuffing (city name should appear 3–5 times naturally, not 15+ times).

**Research flag:** Content quality — no technical research needed, but each city intro requires individual authoring effort. Do not batch-generate V1 intros.

---

### Phase 3: Verification and V1 Monitoring Gate

**Rationale:** Before any V2 work begins, V1 pages must be verified technically and monitored for indexing signals. This phase is a mandatory pause, not optional cleanup. Skipping it and proceeding directly to V2 is the documented path to site-level suppression.

**Delivers:** Post-deploy sitemap verification (entry count vs `locations.ts` active count); Google Rich Results Test validation for all V1 pages (zero errors, not just zero warnings); Search Console sitemap submission; "Looks Done But Isn't" checklist completed; V2 promotion criteria defined with concrete metrics (V1 pages must show "Indexed" status, not just "Discovered", before V2 starts); Vercel hybrid sitemap fallback confirmed working or custom endpoint deployed.

**Addresses:** Sitemap coverage gaps in hybrid mode (Pitfall 5), premature V3 scaling prevention (Pitfall 6), schema validation, canonical verification across all 8 cities.

**Research flag:** None — mechanical verification against documented checklists.

---

### Phase Ordering Rationale

- Phase 1 must precede Phase 2 because the `City` interface drives all section component prop types. Writing section components before the interface is final causes TypeScript rework across every component.
- Phase 2 internal linking (footer + contact page) must ship with city pages in the same deploy. Orphaned pages at any point in their index lifecycle are treated as doorway pages.
- Phase 3 is a mandatory pause before any V2 content. V2 expansion must be gated on V1 indexing confirmation — this is a documented risk (Pitfall 2) with real-world precedent in confirmed site penalties.
- V2 (30–50 cities, AI-assisted) is explicitly out of scope for v1.5 and must be a separate milestone with its own research into the AI generation pipeline and human review workflow.

### Research Flags

Phases needing deeper research during planning:
- **None for v1.5.** All three phases use patterns proven in the existing codebase. The only domain requiring ongoing judgment is content quality per city — that is an authoring task, not a research task.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Config + dynamic route is a direct mirror of `projects.ts` + `prosjekter/[slug].astro`.
- **Phase 2:** Section component patterns follow the established `_sections/` co-location convention.
- **Phase 3:** Verification is checklist-driven.

**Future milestone flag:** Before starting V2 (30–50 cities), research the AI content generation pipeline. The two-call Claude generation pattern (intro generation + FAQ generation as separate calls, with city data seed objects) needs architecture work. Human review gate workflow needs definition. Do not start V2 without that research.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All patterns verified in existing production codebase via direct code inspection. |
| Features | HIGH | Table stakes confirmed from Google spam policies (official), schema.org (authoritative), and Norwegian competitor analysis (direct observation). The 60% unique content threshold is industry consensus — MEDIUM on exact number, HIGH on the principle. |
| Architecture | HIGH | Based on direct codebase analysis. `/steder/[slug]` URL structure avoids documented root-level dynamic route pitfall. All patterns exist in the repo. |
| Pitfalls | HIGH | Critical pitfalls sourced from Google official spam policies and canonical docs. Schema entity duplication (Pitfall 4) is MEDIUM confidence on Google's exact handling of two `LocalBusiness` blocks; the `Service` + `@id` referencing approach is the safer mitigation. |

**Overall confidence:** HIGH

### Gaps to Address

- **Schema architecture decision: two `LocalBusiness` blocks vs. `Service` + `@id` reference.** ARCHITECTURE.md recommends injecting a full city-scoped `LocalBusiness` via the head slot. PITFALLS.md recommends using a `Service` type referencing the root entity instead, to avoid Knowledge Graph entity dilution. These have different trade-offs. Resolve in Phase 1 before building the JSON-LD template — pick one and apply consistently to all cities. Recommendation: use `Service` + `@id` reference; it is the more conservative and technically correct pattern for a service-area business.

- **Vercel hybrid mode + sitemap enumeration.** Whether `@astrojs/sitemap` correctly enumerates `/steder/*` routes under Vercel's hybrid adapter cannot be confirmed without a test deploy. Plan to verify in Phase 3 immediately after first deploy. Have the custom sitemap endpoint (`src/pages/sitemap-locations.xml.ts`) ready as a pre-built fallback before launch.

- **`areaServed` in root BaseLayout `LocalBusiness` schema.** Currently hardcoded. As cities are added to `locations.ts`, this goes stale. Derive it from `locations.ts` at build time (filtered to active tiers) in Phase 1. This is a minor change but prevents a silent schema drift problem at V2 scale.

- **Google Business Profile gap.** City pages without a verified GBP listing rank below competitors who have one. GBP is the strongest single local SEO signal and is independent of website structured data. Prioritize GBP verification for Nettup's primary service area before scaling to V2 — the website alone cannot fully compensate for missing GBP citations.

- **URL slugs for Norwegian city names.** ASCII-only slugs are required (`lillestrom`, `baerum`, not `lillestrøm`, `bærum`). Display names in `locations.ts` use the correct Norwegian characters. URL slugs must not. Establish and enforce this convention in Phase 1.

---

## Sources

### Primary (HIGH confidence)
- `src/pages/prosjekter/[slug].astro` + `src/config/projects.ts` — config-driven dynamic route pattern in production
- `src/pages/blogg/[slug].astro` — head slot JSON-LD injection pattern in production
- `src/layouts/BaseLayout.astro` — existing LocalBusiness schema, head slot, breadcrumb generation
- `astro.config.mjs` — sitemap serialization, static/hybrid output configuration
- [Astro Routing Reference](https://docs.astro.build/en/reference/routing-reference/) — `getStaticPaths()` return format, props alongside params
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-inclusion of dynamic routes, serialize callback
- [Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies) — doorway abuse definition and criteria
- [Google Search Central Blog March 2024](https://developers.google.com/search/blog/2024/03/core-update-spam-policies) — updated spam enforcement
- [Google Canonicalization Docs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — canonical vs noindex guidance
- [schema.org/LocalBusiness](https://schema.org/LocalBusiness) — areaServed property specification
- [schema.org/ProfessionalService](https://schema.org/ProfessionalService) — correct subtype for a web agency

### Secondary (MEDIUM confidence)
- [RicketyRoo: Location Page Spam](https://ricketyroo.com/blog/location-page-spam/) — doorway page patterns and detection (2026)
- [Sterling Sky: Service Area Pages](https://www.sterlingsky.ca/how-to-create-unique-and-helpful-service-area-pages-for-local-businesses/) — uniqueness requirements and thin content patterns
- [RankMath: areaServed Cities](https://rankmath.com/kb/add-multiple-areaserved-cities-to-localbusiness-schema/) — City type with Wikipedia @id format
- [AuthorityNW: Service-Area Schema](https://authoritynw.com/blog/service-area-businesses-gmb-schema-setup/) — areaServed vs serviceArea distinction
- [Search Engine Journal: Hub and Spoke Internal Links](https://www.searchenginejournal.com/hub-spoke-internal-links/442005/) — internal link strategy for city pages
- [Journey Agency: Webbyrå Oslo](https://journeyagency.com/tjenester/nettside-og-brukeropplevelse/webbyra-oslo/) — Norwegian competitor local page analysis
- [Astro sitemap regression GitHub #7015](https://github.com/withastro/astro/issues/7015) — hybrid mode sitemap gap

### Tertiary (LOW confidence — single source or inference)
- Tailride.so case study — 22,000 AI pages penalty; principle is sound, extrapolation to Nettup's scale is inferential
- Astro build throughput ~127 pages/sec — single source; sufficient for planning estimates at V1/V2 scale

---
*Research completed: 2026-03-08*
*Ready for roadmap: yes*
