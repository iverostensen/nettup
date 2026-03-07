# Project Research Summary

**Project:** Nettup v1.4 — Portefolje 2.0
**Domain:** Multi-page portfolio / case study system on an existing Astro 5 marketing site
**Researched:** 2026-03-07
**Confidence:** HIGH

## Executive Summary

This milestone transforms the existing single-page `/prosjekter` section into a scalable multi-page portfolio system with two dedicated case study pages: `/prosjekter/igive` and `/prosjekter/blom-company`. The existing stack (Astro 5, Tailwind 4, Framer Motion, Vercel) handles everything; zero new dependencies are required. The architectural pattern is already proven by the tjenester pages — individual `index.astro` files per project rather than a `[slug].astro` template — and applies here with even more justification given the structural differences between a B2B landing page case study (iGive) and a headless Shopify storefront case study (Blom Company).

The recommended approach is config-first: extend `projects.ts` before touching any page files, then build shared `_shared/` components, then assemble the individual case study pages, then update the index. This order eliminates the main class of build failures and ensures no page is built against an unstable data model. GEO optimization — structuring copy for AI citation (ChatGPT, Perplexity, Google AI Overviews) — is the single highest-ROI differentiator at minimal implementation cost: specific metrics, factual writing, structured headings, and `CreativeWork` JSON-LD schema.

The critical risk is the screenshot dependency: Astro's image pipeline fails at build time if a referenced image file is missing. Visual assets for both projects must be captured and committed before case study page files import them. A secondary risk is a cluster of schema issues that are invisible to `npm run build` but silently degrade SEO: BreadcrumbList showing raw slugs instead of human-readable labels, and duplicate Organization entities in JSON-LD. Both are preventable with a specific checklist at page authoring time.

---

## Key Findings

### Recommended Stack

The existing stack requires no additions for v1.4. All patterns needed — `<Fragment slot="head">` for JSON-LD, Astro `<Image>` for screenshot optimization, individual page files without `getStaticPaths`, the `image` prop on BaseLayout for per-page OG images — are already in the codebase and proven. The only extension is the `projects.ts` TypeScript interface.

**Core technologies:**
- **Astro 5 individual page files** — `/prosjekter/igive/index.astro`, `/prosjekter/blom-company/index.astro`; same routing decision as service pages, documented good outcome in PROJECT.md
- **`src/config/projects.ts` (extended)** — single source of truth for all project data; drives index grid cards and case study page metadata; add `slug`, `techStack[]`, `metrics[]`, `gallery[]`, `testimonialCompany`, `metaTitle`, `metaDescription`, `publishedAt`; remove `caseStudySection`
- **`astro:assets` Image** — build-time optimized screenshots; requires static imports at top of `projects.ts`, not dynamic paths
- **Static OG images in `public/images/og/`** — no Satori needed at 2 projects; justified once portfolio exceeds ~10 projects
- **`CreativeWork` JSON-LD** — correct schema.org type for "agency built X for client Y"; paired with `BreadcrumbList`; `creator` must reference `@id` of the existing LocalBusiness entity in BaseLayout, not re-declare an inline Organization node

### Expected Features

**Must have (table stakes):**
- Project hero section — client name, category, tagline, hero screenshot above the fold
- Challenge and solution sections — decision-makers recognize their own problem before trusting the solution
- Tech stack display — labeled badge chips with one rationale sentence per major technology choice
- Outcomes / metrics section — Lighthouse scores and Core Web Vitals (real, verified numbers only; do not publish unverified claims)
- Client testimonial — real Blom testimonial is available from the brief; iGive testimonial is a known gap (placeholder acceptable at launch)
- Live site link — prospects verify the work is real
- Breadcrumb navigation — consistent with service page pattern; drives BreadcrumbList JSON-LD
- Per-project SEO metadata — title pattern: `[Client] — [Project type] | Nettup`; meta description < 155 characters, outcome-first in Norwegian
- Updated `/prosjekter` index with peer card grid linking to dedicated pages via slug

**Should have (differentiators):**
- Lighthouse score card displayed as a visual element — most Norwegian agencies do not publish scores; publishing Blom's 98/100 desktop is a credibility signal that prose cannot match
- GEO-optimized copy — direct-answer intro in first 200 words, specific verifiable facts, named deliverables ("Next.js 15" not "Next.js"), factual peer-developer tone
- Multiple contextual screenshots (3-5 per project) — desktop hero, detail section, mobile viewport
- Technology rationale — one sentence per major tech choice explaining why it was selected
- Internal cross-links from service pages to relevant portfolio pages

**Defer (v2+):**
- Category filtering on index — only relevant at 6+ projects
- Satori dynamic OG image generation — justified at ~10+ projects
- `[slug].astro` dynamic routing — reconsider at ~15 structurally identical projects
- Video walkthroughs — separate production workflow
- Before/after comparisons — only valid for redesign projects (none exist yet)
- FAQ sections with FAQPage JSON-LD — Google deprecated FAQPage rich results for most sites in 2023; do not add FAQPage schema to portfolio pages

### Architecture Approach

The architecture follows a strict separation between the data layer (`projects.ts` config), shared UI components (`_shared/`), and page assembly (`igive/index.astro`, `blom-company/index.astro`). Config holds structured data only; pages own section composition; shared components handle presentational logic. The entire build is static — no React islands, no client-side data fetching on case study pages. This mirrors `src/config/services.ts` → `tjenester/` pages.

**Major components:**
1. **`projects.ts` (extended)** — extended interface; populated iGive and Blom entries; `caseStudySection` flag removed
2. **`_sections/ProjectGrid.astro`** — replaces `ProjectShowcase.astro` on the index; renders all projects as equal peer cards with slug-derived links; `comingSoon` projects show a badge with no link
3. **`_shared/` components** — `CaseStudyHero`, `ChallengeAndSolution`, `TechStack`, `MetricsGrid`, `VisualGallery`, `CaseStudyTestimonial` — built once, reused by all case study pages
4. **`igive/index.astro` and `blom-company/index.astro`** — page assemblies that own section ordering, JSON-LD, and `<title>`; section ordering can differ between projects
5. **BaseLayout integration** — `pageLabels` map updated with new sub-routes; `image` prop passes project-specific OG image path

### Critical Pitfalls

1. **`ProjectShowcase.astro` breaks silently when `caseStudySection` flag is removed** — `projects.find(p => p.caseStudySection === true)` returns `undefined`; the hero section renders nothing; `npm run build` succeeds but the page is visually blank. Prevention: treat config restructuring and index redesign as one atomic task; never add Blom to the old schema without simultaneously replacing the dependent section.

2. **Screenshot assets are hard build-time dependencies** — Astro's `<Image>` fails the build (`ENOENT`) if a referenced file is missing. Prevention: capture and commit all screenshots before writing any image imports; make `gallery?: ImageMetadata[]` optional with placeholder rendering as a fallback.

3. **BreadcrumbList schema shows raw URL slugs as labels** — `BaseLayout.astro` `pageLabels` map has no entry for new sub-routes; the fallback returns `"igive"` and `"blom-company"` instead of `"iGive"` and `"Blom Company"`. This is silent at build time but wrong in rich results. Prevention: add both routes to `pageLabels` before each page goes live; verify via schema validator.

4. **Duplicate Organization entity in structured data** — Case study pages that inline a new Organization node instead of referencing the existing `@id` create two separate Organization entities for the same domain. Prevention: use `"creator": {"@id": "https://nettup.no/#business"}` — never re-declare the Organization fields from BaseLayout. Note: the existing tjenester pages use the weaker inline pattern; do not copy it.

5. **`ProjectTeaser.astro` on homepage is hardcoded** — bypasses `projects.ts` entirely; links to `/prosjekter` not `/prosjekter/igive`. Prevention: update the teaser during Phase 1 config restructuring, not as an afterthought.

---

## Implications for Roadmap

Based on combined research, a 4-phase structure is appropriate. Each phase unlocks the next; no phase should begin before its predecessor is verified.

### Phase 0: Prerequisites
**Rationale:** Visual assets are hard build-time dependencies and unverified metrics cannot appear in copy. Both must be resolved before any page files are created — otherwise the build fails and copy requires a full rewrite cycle.
**Delivers:** Committed screenshots for both projects; verified Lighthouse scores for iGive; Blom Company staging screenshots from `blom-no.vercel.app`
**Addresses:** Pitfall 5 (missing screenshots block build), GEO accuracy (no fake metrics)
**Tasks:** Run PageSpeed Insights on `salg.igive.no` and document scores; capture Blom Company screenshots (hero, product listing, product detail, mobile viewport); commit assets to `src/assets/images/`
**Research flag:** None — operational task, no research questions

### Phase 1: Config and Infrastructure Restructuring
**Rationale:** `projects.ts` is imported by every consumer in this milestone. It must be correct and stable before any component is built against it. The index redesign is bundled here because `ProjectShowcase.astro` breaks silently the moment `caseStudySection` is removed — treating them as separate tasks creates a window where the prosjekter index is visually broken.
**Delivers:** Extended `Project` interface with `slug`, `techStack`, `metrics`, `gallery`, etc.; `caseStudySection` removed; iGive and Blom entries populated; `/prosjekter` index redesigned as a peer card grid; `ProjectTeaser.astro` updated to use `project.slug` and link to the direct case study URL
**Addresses:** Pitfall 1 (ProjectShowcase breaks), Pitfall 2 (ProjectTeaser hardcoded), Pitfall 7 (slug/ID mismatch — use `slug` field as the URL key, not `id`)
**Research flag:** None — direct codebase extension following the `services.ts` pattern

### Phase 2: Individual Case Study Pages
**Rationale:** Build iGive first to validate the `_shared/` component API and JSON-LD patterns with known data before replicating for Blom Company. Schema decisions must be locked before the first page is committed — the `@id` reference pattern cannot be retrofitted without a schema audit of both pages.
**Delivers:** Full `_shared/` component library; `igive/index.astro` complete case study; `blom-company/index.astro` complete case study; `CreativeWork` + `BreadcrumbList` JSON-LD on both pages; `pageLabels` updated in BaseLayout; per-project OG images in `public/images/og/`; GEO-optimized Norwegian copy with specific metrics and factual tone
**Addresses:** Pitfall 3 (BreadcrumbList labels), Pitfall 4 (duplicate Organization entity), Pitfall 6 (meta description < 155 characters)
**Research flag:** None — architecture fully specified; schema patterns confirmed against schema.org and Google documentation

### Phase 3: Cross-Linking and SEO Pass
**Rationale:** Internal links from service pages to portfolio pages cannot be written until the destination pages exist and their canonical URLs are confirmed. This is a deliberate final pass across the whole site, not an afterthought.
**Delivers:** Link from `/tjenester/nettbutikk` to Blom Company case study; link from `/tjenester/nettside` to iGive case study; GEO copy review across both case study pages; sitemap verification confirming new routes appear after first deploy
**Addresses:** Pitfall 8 (no internal cross-links from tjenester pages)
**Research flag:** None — content editing task with clear targets

### Phase Ordering Rationale

- Phase 0 before Phase 1: screenshots and verified metrics are prerequisites for writing content; capturing them up front eliminates rebuild cycles
- Phase 1 before Phase 2: the `projects.ts` types and index redesign must be stable before any component imports from them; the `caseStudySection` silent breakage would corrupt staging reviews if left unresolved
- iGive before Blom within Phase 2: iGive data already exists and is partially written; validates the shared component API with known-good data before applying it to the new Blom entry
- Phase 3 last: cross-links reference final canonical URLs; linking before pages exist risks dead links in production

### Research Flags

No phases require `/gsd:research-phase` during planning. All four research files are HIGH confidence based on direct codebase analysis and authoritative documentation. The architecture is pre-resolved.

Phases with standard patterns:
- **Phase 0:** Screenshot capture is operational
- **Phase 1:** Config extension mirrors the proven `services.ts` pattern
- **Phase 2:** Architecture fully specified; schema patterns validated
- **Phase 3:** Internal linking is content editing

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies — all patterns already in the codebase and confirmed working; direct code inspection |
| Features | HIGH | Table stakes grounded in case study content standards; GEO patterns from peer-reviewed academic source plus 2026 practitioner guides; anti-features identified with clear rationale |
| Architecture | HIGH | Based entirely on direct codebase analysis; mirrors the tjenester pattern with a documented good outcome in PROJECT.md |
| Pitfalls | HIGH | All critical pitfalls derived from reading actual source files — `ProjectShowcase.astro`, `ProjectTeaser.astro`, `BaseLayout.astro`; confirmed behavior, not speculation |

**Overall confidence:** HIGH

### Gaps to Address

- **iGive Lighthouse scores are unverified:** The existing `Results.astro` shows hardcoded "95" but this has not been measured against the current live site. Run PageSpeed Insights on `salg.igive.no` before writing the metrics section. If the score has changed, update both the case study copy and `Results.astro`.

- **Blom Company live domain timing:** All visual assets come from `blom-no.vercel.app` staging. If `blomcompany.com` is not live before the case study publishes, the live site link and `url` field should point to staging with a note, and be updated at launch.

- **iGive testimonial is placeholder:** No real client quote exists for iGive. Launch with a placeholder and treat the real quote as a post-launch update. The Blom testimonial is real and available — use it immediately.

---

## Sources

### Primary (HIGH confidence)
- `src/config/projects.ts` — existing interface and iGive data
- `src/config/services.ts` — reference pattern for config-driven pages
- `src/layouts/BaseLayout.astro` — `pageLabels` map, BreadcrumbList generation, `image` prop behavior
- `src/pages/prosjekter/_sections/ProjectShowcase.astro` — `caseStudySection` discriminator pattern confirmed
- `src/pages/_home/ProjectTeaser.astro` — hardcoded iGive content confirmed, no `projects.ts` usage
- `src/pages/tjenester/nettside/index.astro` — individual file pattern and JSON-LD injection confirmed
- `.planning/PROJECT.md` — milestone scope and routing decision log
- `nettup-case-study-brief.md` — Blom Company data: real testimonial, tech stack, Lighthouse scores, staging URL
- [schema.org/CreativeWork](https://schema.org/CreativeWork) — property definitions
- [Astro Routing Docs](https://docs.astro.build/en/guides/routing/) — individual files vs `[slug].astro` decision criteria
- [Google Structured Data Docs — BreadcrumbList](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — item name must be human-readable
- [Google FAQPage deprecation (Aug 2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — FAQPage rich results deprecated for most sites

### Secondary (MEDIUM confidence)
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) — GEO structural patterns
- [GEO academic paper — Princeton/Georgia Tech/IIT Delhi](https://arxiv.org/pdf/2311.09735) — 30-40% AI visibility improvement with structured content (peer-reviewed)
- [Static OG images in Astro](https://arne.me/blog/static-og-images-in-astro/) — static file vs Satori tradeoffs
- [Webflow: How to write the perfect case study](https://webflow.com/blog/write-the-perfect-case-study) — case study content section standards

### Tertiary (LOW confidence)
- GEO practitioner reports — "300% LLM accuracy with structured data" stat; consistent with academic finding but single-source

---

*Research completed: 2026-03-07*
*Ready for roadmap: yes*
