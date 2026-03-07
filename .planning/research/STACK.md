# Stack Research

**Domain:** Portfolio/case study pages — Astro 5 marketing site (v1.4 Portefølje 2.0)
**Researched:** 2026-03-07
**Confidence:** HIGH

## Scope

This file covers ONLY stack decisions for the v1.4 dedicated case study pages milestone. The existing
validated stack (Astro 5, Tailwind 4, React, Framer Motion, Vercel hybrid, TypeScript, @anthropic-ai/sdk,
@astrojs/sitemap) is NOT re-researched here. Existing patterns (JSON-LD in `<Fragment slot="head">`,
`services.ts` config, `getStaticPaths` for blog, `image` prop on BaseLayout) apply directly.

**Bottom line: zero new packages required.**

---

## Recommended Stack

### Core Technologies (existing — no changes)

| Technology | Version | Purpose | Why Confirmed |
|------------|---------|---------|---------------|
| Astro 5 static pages | ^5.0.0 | Individual `.astro` page files per project | No dynamic data source — two known projects with structurally different content. Same reasoning as service pages. |
| `src/config/projects.ts` | — | Extended project config as single source of truth | Already exists. Needs new fields (`slug`, `ogImage`, `metrics`, `techStack`, `dateDelivered`). Same pattern as `services.ts`. |
| `astro:assets` Image | built-in | Optimized screenshots per project page | Already used in ProjectShowcase.astro. Continue pattern. |
| BaseLayout `image` prop | — | Per-project OG image via static file in `public/` | BaseLayout already accepts `image?: string`. No changes to layout needed. |

### No New Dependencies

All functionality for v1.4 is achievable with existing tooling:

| What's Needed | How | Why Not a New Package |
|---------------|-----|----------------------|
| Dynamic OG images (Satori) | Static images in `public/images/og/` | 2 projects → 2 static files. Satori adds `satori` + `sharp` (~8MB) for a problem that doesn't exist at this scale. Add when portfolio reaches 10+ projects. |
| JSON-LD schema | Inline in page frontmatter, `<Fragment slot="head">` | Identical to blogg/[slug].astro and service pages. Already proven. |
| Breadcrumbs | `Breadcrumbs.astro` component, already exists | Used by blog pages — same component, new items array. |
| Project routing | Individual files (`/prosjekter/igive/index.astro`) | Same decision as service pages — each project has structurally different sections. |

---

## Routing Decision: Individual Files vs `[slug].astro`

**Use individual files (`/prosjekter/igive/index.astro`, `/prosjekter/blom-company/index.astro`).**

Rationale — consistent with the existing tjenester decision (documented in PROJECT.md Key Decisions):

> "Individual index.astro per service (not [slug].astro) — Services need structurally different sections"

The same logic applies to projects. iGive is a B2B landing page; Blom Company is a headless Shopify
storefront. Their case studies will have different visual sections, different metrics to highlight,
and different screenshot layouts. A `[slug].astro` template would force a uniform structure that
flattens that differentiation.

Use `[slug].astro` only when:
- Content is uniform (all pages have identical sections, only copy differs)
- Volume exceeds ~5 projects (at which point repetition outweighs structural flexibility)
- Data comes from an external source (CMS, API) that drives `getStaticPaths()`

Neither condition is met for v1.4.

**File structure:**
```
src/pages/prosjekter/
├── index.astro               ← redesigned grid, links to dedicated pages
├── igive/
│   ├── index.astro           ← full case study
│   └── _sections/
│       ├── Hero.astro
│       ├── Challenge.astro
│       ├── Solution.astro
│       ├── Results.astro
│       └── TechStack.astro
└── blom-company/
    ├── index.astro
    └── _sections/
        ├── Hero.astro
        ├── Challenge.astro
        ├── Solution.astro
        ├── Results.astro
        └── TechStack.astro
```

**BaseLayout breadcrumb auto-generation** will handle `/prosjekter/igive` correctly only if the
`pageLabels` record in `BaseLayout.astro` is updated with readable names for each project path:

```typescript
'/prosjekter/igive': 'iGive',
'/prosjekter/blom-company': 'Blom Company',
```

Alternatively, each project page can emit its own `BreadcrumbList` JSON-LD via `Fragment slot="head"`,
overriding the auto-generated one — the same pattern used by `blogg/[slug].astro`.

---

## JSON-LD Schema Decision: Which Types to Use

### Primary type: `CreativeWork`

Use `CreativeWork` as the root `@type` for each project page case study.

**Why CreativeWork over alternatives:**

| Type | What It Describes | Verdict for a Web Agency Portfolio |
|------|------------------|-----------------------------------|
| `CreativeWork` | The generic creative output — websites, designs, applications | **Use this.** Most accurate for "we built X for client Y." Covers all project types. |
| `WebSite` | A specific website entity (the site itself, not a description of building it) | Wrong layer. `WebSite` describes salg.igive.no, not Nettup's case study about building it. |
| `SoftwareApplication` | A software application with install-specific properties (OS, applicationCategory) | Too narrow. iGive's salg page is not a downloadable app. Valid for a web app case study if it emphasizes the software itself. |
| `WebApplication` | Subtype of SoftwareApplication, browser-based software | Only appropriate if the deliverable is a web app with explicit app-like functionality (user accounts, CRUD). Not a marketing site or Shopify store. |
| `Article` | Editorial/written content | Wrong — the case study page is not an article. Use Article/BlogPosting only for the blogg. |

**Recommended JSON-LD shape for a project page:**

```typescript
const caseStudySchema = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'iGive Salgsside',
  description: 'Dedikert salgsside for Norges ledende gavekortplattform. Bygget av Nettup.',
  url: 'https://salg.igive.no',
  dateCreated: '2024-01-15',         // ISO date, when the project was delivered
  creator: {
    '@type': 'Organization',
    name: 'Nettup',
    url: 'https://nettup.no',
  },
  client: {                          // Non-standard but AI-parseable — include it
    '@type': 'Organization',
    name: 'iGive AS',
    url: 'https://igive.no',
  },
  about: {
    '@type': 'WebSite',
    name: 'salg.igive.no',
    url: 'https://salg.igive.no',
  },
  thumbnailUrl: 'https://nettup.no/images/projects/igive-thumbnail.jpg',
  inLanguage: 'nb',
  keywords: 'gavekort, B2B, Astro, norsk nettside',
};
```

Note: `client` is not an official schema.org property, but it is a widely-used extension in agency
portfolios and LLMs will read it. Do not worry about validation warnings on this field — Google
ignores unknown properties rather than penalizing them (HIGH confidence, official Google documentation).

### Secondary schemas to co-emit on the same page

| Schema | Why | Co-locate with |
|--------|-----|----------------|
| `BreadcrumbList` | Already auto-generated by BaseLayout. Override only if the auto slug-splitting produces wrong names. | `Fragment slot="head"` on the project index.astro |
| `Organization` (Nettup) | Already emitted globally by BaseLayout — no duplication needed. | Already handled |
| `Review` (optional) | If a real client testimonial with a star rating is added — connects the case study to a review entity. Defer until testimonials are real. | — |

### What NOT to add

Do not add `ItemList` schema to `/prosjekter/index.astro` for the grid of project cards. Google's
ItemList rich result only benefits recipe/product/event lists. For a portfolio grid, it adds markup
overhead with no confirmed rich result benefit.

---

## OG Image Decision: Static Files vs Generated

**Use static pre-made OG images per project. No Satori, no build-time endpoint.**

**Decision matrix:**

| Approach | Packages Needed | Build Time | Maintenance | Right for v1.4? |
|----------|----------------|------------|-------------|-----------------|
| Static PNG in `public/images/og/` | None | 0s | Add one file per project | Yes |
| Satori endpoint with `prerender: true` | `satori` + `sharp` | +5-15s | Template code shared | No — overkill at 2 projects |
| Vercel Edge OG (runtime) | `@vercel/og` | 0s | Server function per req | No — unnecessary server cost |

For 2 projects, the cost of Satori infrastructure (two new packages, ~8MB, build-time SVG rendering,
font loading) is not justified. A manually crafted `og-igive.jpg` and `og-blom-company.jpg` placed in
`public/images/og/` and referenced via the existing `image` prop on BaseLayout is the correct approach.

**OG image spec (to brief designer/creator):**
- Size: 1200×630px
- Format: JPEG at ~80% quality (target < 100KB each)
- Content: project screenshot + project name + Nettup logo

**Passing per-project OG image:**

```astro
<BaseLayout
  title="iGive Case Study | Nettup"
  description="..."
  image="/images/og/og-igive.jpg"
>
```

BaseLayout already renders `<meta property="og:image" content={new URL(image, Astro.site)} />` — no
layout changes needed.

Revisit Satori when: portfolio exceeds 8-10 projects and manual OG creation becomes a maintenance burden.

---

## GEO-Optimized Content Structure for Portfolio Pages

GEO (Generative Engine Optimization) is the practice of structuring content so LLMs (ChatGPT,
Perplexity, Google AI Overviews) can extract, cite, and surface it in generated answers.

Research from 2025-2026 shows that content with clear verifiable data points earns 30-40% more
visibility in LLM-generated answers than qualitative content alone (source: GEO industry reports).

### What markup and content patterns LLMs index best

**Schema markup that helps AI parsing:**
- `CreativeWork` with `name`, `description`, `dateCreated`, `url`, `creator` — gives LLMs the
  "who built what for whom and when" frame they need to cite an agency
- `keywords` property — direct signal for topical relevance
- `thumbnailUrl` — image reference makes the entity more concrete

**Content structure on the page itself (independent of schema):**
- Lead with a one-paragraph summary that is independently meaningful — LLMs extract passages,
  not full pages. A 60-100 word summary paragraph that answers "what did Nettup build, for whom,
  and with what outcome?" is citable without surrounding context.
- Include concrete metrics as a distinct visual element (numbers: load time, conversion rate,
  Lighthouse score) — AI systems strongly prefer verifiable data points over prose assertions
- Use `<h2>` / `<h3>` headings that name the concept without pronoun references ("Utfordringen"
  is good — "Hva vi løste" needs context; "Teknisk løsning" is self-contained)
- Client name, industry, and location in plain text — LLMs build entity graphs; explicit
  "iGive AS, gavekort, Oslo" is more citable than "vår kunde"

**What does NOT help:**
- FAQ schema on project pages — FAQ is for question-answer content. Case studies are not Q&A.
  Only add if you add a literal FAQ section to the page.
- HowTo schema — reserved for step-by-step instructional content.
- Excessive keyword density — LLMs penalize keyword stuffing the same way modern NLP does.

---

## Projects Config Extension

The existing `projects.ts` Project interface needs new fields to support dedicated pages.
No package changes — pure TypeScript additions.

**Fields to add:**

```typescript
export interface Project {
  // Existing fields
  id: string;
  name: string;
  category: string;
  type: string;
  tagline: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  url?: string;
  caseStudySection?: boolean;  // DEPRECATE — replaced by slug
  comingSoon?: boolean;
  challenge?: string;
  solution?: string;
  features?: string[];

  // New fields for v1.4
  slug?: string;               // e.g. 'igive', 'blom-company' — enables /prosjekter/[slug]
  ogImage?: string;            // e.g. '/images/og/og-igive.jpg' — for BaseLayout image prop
  dateDelivered?: string;      // ISO date string — for CreativeWork.dateCreated
  techStack?: string[];        // e.g. ['Astro', 'Tailwind', 'Vercel'] — displayed + schema keywords
  metrics?: Array<{            // Quantitative results — citable by LLMs
    label: string;             // e.g. 'Lastetid'
    value: string;             // e.g. '< 1 sekund'
  }>;
  clientOrg?: string;          // e.g. 'iGive AS' — for CreativeWork client field
}
```

The `/prosjekter/index.astro` grid can use `slug` to generate card hrefs:
`href={project.slug ? `/prosjekter/${project.slug}` : undefined}`.

---

## Installation

```bash
# No new packages required for v1.4.
# All functionality uses existing stack.
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Individual page files per project | `[slug].astro` with getStaticPaths | When projects share identical section structure OR volume exceeds ~5-8 projects |
| Static OG images in `public/` | Satori build-time generation | When portfolio exceeds ~10 projects and manual image creation becomes maintenance burden |
| `CreativeWork` schema | `WebApplication` / `SoftwareApplication` | Only if the deliverable is explicitly a browser-based application with user accounts and app-like functionality |
| `client` as schema extension property | `funder` or `sponsor` (schema.org properties) | `funder`/`sponsor` have specific financial connotations — `client` is semantically clearer and LLMs parse non-standard properties |
| Extend `projects.ts` interface | Astro Content Collection for projects | Content Collections add `src/content/` + frontmatter overhead. Projects data is already TypeScript-config-driven. Only move to Content Collections if project descriptions become long-form Markdown. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `satori` + `sharp` for OG images | Adds ~8MB of devDependencies, ~10s build time, for a problem that doesn't exist at 2 projects | Static JPEG files in `public/images/og/` |
| `WebSite` as root schema type for the case study page | `WebSite` describes the client's website itself, not the agency's work on it | `CreativeWork` with an `about: { '@type': 'WebSite' }` property pointing to the client URL |
| `ItemList` on `/prosjekter/index.astro` | No confirmed rich result for portfolio grids; adds markup noise | Plain HTML grid — Google indexes it fine without ItemList |
| FAQPage schema on case study pages | FAQPage requires actual question-answer content structure. Adding it without a FAQ section triggers validation warnings and provides no benefit. | Add FAQPage only if a FAQ section is added to the page |
| `@astrojs/mdx` for case study body content | Case study content is component-based (Hero, Results, TechStack sections) not long-form prose | Astro component sections with props from `projects.ts` |

---

## Version Compatibility

All existing versions confirmed compatible. No new packages, no compatibility surface to check.

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Astro ^5.0.0 | Individual page files, static output, Fragment slot="head" | All patterns used here are Astro 5 native. No breaking changes vs current usage. |
| @astrojs/sitemap ^3.6.0 | New `/prosjekter/igive` and `/prosjekter/blom-company` routes | Auto-included in sitemap — no config changes needed. |
| @astrojs/vercel ^9.0.4 | Static page output | New project pages are static — no serverless needed. Hybrid output config unchanged. |

---

## Sources

- [Astro Routing Docs](https://docs.astro.build/en/guides/routing/) — individual files vs `[slug].astro` decision criteria (HIGH confidence — official docs)
- [schema.org/CreativeWork](https://schema.org/CreativeWork) — type definition, properties list (HIGH confidence — authoritative)
- [schema.org/WebSite](https://schema.org/WebSite) — confirms WebSite describes the site entity, not work on it (HIGH confidence — authoritative)
- [Google: Unknown properties in JSON-LD](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) — Google ignores unknown properties, no penalty (HIGH confidence — official docs)
- [GEO content structure research](https://totheweb.com/blog/beyond-seo-your-geo-checklist-mastering-content-creation-for-ai-search-engines/) — data-driven content 30-40% more citable (MEDIUM confidence — single source, consistent with broader GEO research)
- [GEO 2026 full guide](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142) — structured data as translator between content and AI search engines (MEDIUM confidence — Search Engine Land)
- [Structured data for SEO and GEO 2026](https://www.digidop.com/blog/structured-data-secret-weapon-seo) — schema.org types for AI discoverability (MEDIUM confidence)
- [Static OG images in Astro](https://arne.me/blog/static-og-images-in-astro/) — static file approach vs Satori tradeoffs (MEDIUM confidence)
- Project `src/config/projects.ts` — existing interface confirmed, extension plan based on current shape (HIGH confidence — direct code read)
- Project `src/layouts/BaseLayout.astro` — `image` prop exists, OG meta already handled (HIGH confidence — direct code read)
- Project `src/pages/blogg/[slug].astro` — JSON-LD pattern via `Fragment slot="head"` confirmed working (HIGH confidence — direct code read)
- Project `src/pages/tjenester/nettside/index.astro` — Service JSON-LD co-located pattern confirmed (HIGH confidence — direct code read)

---

*Stack research for: Nettup v1.4 Portefølje 2.0 — dedicated case study pages*
*Researched: 2026-03-07*
