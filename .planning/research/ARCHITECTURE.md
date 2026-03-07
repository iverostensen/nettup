# Architecture Research

**Domain:** Multi-page portfolio system integrated into existing Astro 5 marketing site
**Researched:** 2026-03-07
**Confidence:** HIGH (based on direct codebase analysis — no external sources needed)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        src/config/ (data layer)                      │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────────────┐    │
│  │  projects.ts │  │ testimonials.ts│  │      services.ts      │    │
│  │  (extended)  │  │  (unchanged)   │  │      (unchanged)      │    │
│  └──────┬───────┘  └───────┬────────┘  └───────────────────────┘    │
└─────────┼──────────────────┼──────────────────────────────────────── ┘
          │                  │
┌─────────▼──────────────────▼──────────────────────────────────────── ┐
│                        src/pages/prosjekter/                          │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐    │
│  │  index.astro │  │ igive/index.astro│  │blom-company/         │    │
│  │  (redesigned)│  │  (case study)    │  │index.astro (new)     │    │
│  └──────┬───────┘  └────────┬─────────┘  └──────────┬───────────┘    │
│         │                   │                        │               │
│  _sections/             _shared/ (reused by both case study pages)  │
│  Hero.astro             CaseStudyHero.astro                         │
│  ProjectGrid.astro      ChallengeAndSolution.astro                  │
│  ProsjekterCTA.astro    TechStack.astro                             │
│                         MetricsGrid.astro                           │
│                         VisualGallery.astro                         │
│                         CaseStudyTestimonial.astro                  │
└─────────────────────────────────────────────────────────────────────┘
          │
┌─────────▼──────────────────────────────────────────────────────────┐
│                     src/components/ (shared UI)                     │
│  ui/Card.astro, ui/Section.astro — unchanged                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Lives In |
|-----------|----------------|----------|
| `projects.ts` | Single source of truth for all project metadata — drives both index grid and case study pages | `src/config/` |
| `index.astro` (prosjekter) | Redesigned: imports ProjectGrid, renders all projects as cards with links | `src/pages/prosjekter/` |
| `ProjectGrid.astro` | Replaces ProjectShowcase — renders all `projects[]` as card grid, each linking to `/prosjekter/[slug]` | `src/pages/prosjekter/_sections/` |
| `igive/index.astro` | Full iGive case study page — assembles page-specific sections, owns JSON-LD, owns `<title>` | `src/pages/prosjekter/igive/` |
| `CaseStudyHero.astro` | Title, category badge, tagline, live URL link — reusable across all case study pages | `src/pages/prosjekter/_shared/` |
| `TechStack.astro` | Renders `techStack[]` array as badge grid — reusable | `src/pages/prosjekter/_shared/` |
| `MetricsGrid.astro` | Renders `metrics[]` as stat cards (Lighthouse, perf numbers) — reusable | `src/pages/prosjekter/_shared/` |
| `VisualGallery.astro` | 1–N screenshots using Astro `<Image>` — reusable | `src/pages/prosjekter/_shared/` |
| `ChallengeAndSolution.astro` | Two-column challenge/solution card grid — reusable | `src/pages/prosjekter/_shared/` |
| `CaseStudyTestimonial.astro` | Pull quote block with photo, name, title — reusable | `src/pages/prosjekter/_shared/` |
| `blom-company/index.astro` | Full Blom Company case study page — different section ordering than iGive is fine | `src/pages/prosjekter/blom-company/` |

## Recommended Project Structure

```
src/
├── config/
│   └── projects.ts               # MODIFIED: extended data model (see below)
│
└── pages/
    └── prosjekter/
        ├── index.astro            # MODIFIED: redesigned as grid index
        ├── _sections/             # Index page sections only
        │   ├── Hero.astro         # UNCHANGED
        │   ├── ProjectGrid.astro  # NEW: replaces ProjectShowcase.astro
        │   └── ProsjekterCTA.astro # UNCHANGED
        │
        ├── _shared/               # NEW: shared case study components
        │   ├── CaseStudyHero.astro
        │   ├── ChallengeAndSolution.astro
        │   ├── TechStack.astro
        │   ├── MetricsGrid.astro
        │   ├── VisualGallery.astro
        │   └── CaseStudyTestimonial.astro
        │
        ├── igive/
        │   └── index.astro        # NEW: full iGive case study page
        │
        └── blom-company/
            └── index.astro        # NEW: full Blom Company case study page
```

### Structure Rationale

- **`_shared/` inside `prosjekter/`:** Keeps case study components co-located with the feature, not polluting the global `src/components/ui/`. These components are only meaningful in a project/case study context. Follows the same co-location pattern as `_sections/` directories already in the codebase.
- **Individual `igive/index.astro` vs `[slug].astro`:** See routing decision section below.
- **`_sections/` stays for index page only:** Preserves the existing pattern. Hero, new ProjectGrid, ProsjekterCTA.
- **No `Results.astro` on index:** That section's data belongs on individual case study pages. Remove from index during the redesign; fold any aggregate stats into the index Hero if needed.

## Routing Decision: Individual Files vs `[slug].astro`

**Recommendation: Individual files (`igive/index.astro`, `blom-company/index.astro`)**

This matches the established pattern from the service pages (`tjenester/nettside/index.astro`, `tjenester/nettbutikk/index.astro`). The project documented this decision in PROJECT.md as a confirmed good outcome:

> "Individual index.astro per service (not [slug].astro) — Services need structurally different sections" — outcome: Good

The same rationale applies to case studies with even more force:

| Factor | Individual files | `[slug].astro` |
|--------|------------------|----------------|
| Section ordering per project | Freely different per page | Constrained to one template |
| Blom (Shopify) may need unique sections | Yes, easy to add | Requires conditional rendering |
| iGive-specific content | Directly in file | Embedded in config or conditionals |
| Adding project N | Copy a page, fill sections | No new file needed |
| TypeScript safety | Config validates shared fields; page content typed locally | Config must model all possible sections for all projects |
| Build complexity | Simple; one static file per project | Needs `getStaticPaths()` |
| Incremental rework risk | Low — pages are isolated | Medium — template change affects all projects |

**Verdict:** Use individual files. At 2–5 projects there is no scale benefit from dynamic routing that outweighs the flexibility cost. If the portfolio ever exceeds ~15 structurally identical projects, reconsider.

## `projects.ts` Data Model

**Recommended extended interface:**

```typescript
import type { ImageMetadata } from 'astro';

export interface ProjectMetric {
  label: string;        // e.g. "Lighthouse ytelse"
  value: string;        // e.g. "98/100"
  description?: string; // e.g. "Målt desember 2024"
}

export interface Project {
  // --- Index grid fields (required for all projects) ---
  id: string;                  // keep for backward compat
  slug: string;                // URL segment: "igive", "blom-company"
  name: string;
  category: string;            // e.g. "B2B", "Nettbutikk"
  type: string;                // e.g. "Gavekort-plattform", "Shopify"
  tagline: string;             // Short — shown on index card
  description: string;         // 1-2 sentences — shown on index card
  coverImage: ImageMetadata;   // renamed from image (hero + card image)
  coverImageAlt: string;       // renamed from imageAlt
  url?: string;                // live site link

  // --- Case study page fields ---
  techStack?: string[];        // e.g. ["Astro", "Tailwind", "Shopify Headless"]
  challenge?: string;          // paragraph text
  solution?: string;           // paragraph text
  deliverables?: string[];     // renamed from features (more accurate)
  metrics?: ProjectMetric[];   // Lighthouse scores, perf numbers, outcomes
  gallery?: ImageMetadata[];   // additional screenshots beyond coverImage
  testimonialCompany?: string; // joins testimonials.ts by company field

  // --- SEO / structured data fields ---
  metaTitle?: string;          // <title> override for case study page
  metaDescription?: string;    // meta description for case study page
  publishedAt?: string;        // ISO date string for CreativeWork schema

  // --- Index behavior ---
  comingSoon?: boolean;
}
```

**Key decisions in this model:**

- `slug` is new and explicit. `id` was used for internal lookups; `slug` is the URL path segment. They can differ (e.g., `id: 'blomco'`, `slug: 'blom-company'`).
- `coverImage` replaces `image` — a one-line rename. Prevents ambiguity when `gallery` is also `ImageMetadata[]`.
- `testimonialCompany` formalizes the join that `ProjectShowcase.astro` already does informally (`testimonials.find(t => t.company === 'iGive')`).
- `caseStudySection: boolean` is removed — all projects with a slug get a dedicated page. The index card links to the page regardless.
- `metrics` is `{ label, value, description? }[]` rather than hardcoded Lighthouse fields — accommodates different metric types per project (perf scores, load time, client-reported revenue outcomes).
- `deliverables` replaces `features` — the current `features` array contains delivered work items, not product features. Renaming improves clarity.
- `gallery[]` image imports must be static imports at the top of `projects.ts`. Astro's image pipeline requires static imports; dynamic `import()` in config is not supported.

## Shared Components

### Build as shared (`_shared/`) — used by 2+ case study pages

| Component | Props | Notes |
|-----------|-------|-------|
| `CaseStudyHero.astro` | `name`, `category`, `type`, `tagline`, `url?` | Replaces the current inline header in ProjectShowcase |
| `ChallengeAndSolution.astro` | `challenge: string`, `solution: string` | Direct lift from ProjectShowcase challenge/solution grid |
| `TechStack.astro` | `techStack: string[]` | New — renders badge grid |
| `MetricsGrid.astro` | `metrics: ProjectMetric[]` | New — stat cards with label/value/description |
| `VisualGallery.astro` | `images: ImageMetadata[]`, `alts: string[]` | New — 1-N screenshots, lazy loaded via Astro `<Image>` |
| `CaseStudyTestimonial.astro` | `testimonial: Testimonial` | Lifted from ProjectShowcase quote block |

### Keep page-specific

Anything only one project needs, or content that is prose rather than structured data, stays inline in the case study page or in a project-specific `_sections/` subfolder.

Examples:
- Blom Company may need a "Dual collections architecture" explanation — page-specific
- iGive may want a "How it works" step section — page-specific
- JSON-LD structured data — always in the page's `index.astro`, not in a shared component (same pattern as service pages: `FAQPage` JSON-LD is co-located in `FAQ.astro`)

## Index Page Redesign

**Current:** `ProjectShowcase.astro` hardcodes the single `caseStudySection: true` project as a featured layout, then renders additional projects as cards.

**New:** `ProjectGrid.astro` renders all `projects[]` as equal cards, each linking to `/prosjekter/[project.slug]`.

**What ProjectGrid needs from `projects.ts` (per card):**

```typescript
{ slug, name, category, type, tagline, description, coverImage, coverImageAlt, comingSoon? }
```

**What changes on the index page (`index.astro`):**

- Import `ProjectGrid.astro` instead of `ProjectShowcase.astro`
- Remove `Results.astro` import (metrics belong on case study pages)
- `Hero.astro` and `ProsjekterCTA.astro` stay unchanged
- `<title>` and `description` props may need copy update for GEO-optimized phrasing

**Card design:** Cover image, category badge, project name, tagline, "Se case study" link with arrow. `comingSoon` cards show a "Kommer snart" badge and no link.

## Data Flow

### Index Page Flow

```
projects.ts (all projects)
    ↓
prosjekter/index.astro
    ↓
ProjectGrid.astro — renders one card per project
    ↓ (each card)
href="/prosjekter/[slug]"
```

### Case Study Page Flow

```
projects.ts (.find(p => p.slug === 'igive'))    testimonials.ts (.find(t => t.company === project.testimonialCompany))
    ↓                                                ↓
igive/index.astro ───────────────────────────────────┘
    ↓ (passes typed props)
CaseStudyHero, TechStack, MetricsGrid, VisualGallery,
ChallengeAndSolution, CaseStudyTestimonial
    ↓
Static HTML (Astro build-time render)
```

### No Runtime State

All data is static — `projects.ts` is imported at build time. No client-side data fetching. No React islands needed for case study pages. Scroll reveal animations use the existing CSS `reveal-on-scroll` pattern (no Framer Motion required on these pages).

## Build Order

Each step unlocks the next. Do not skip ahead.

### Step 1: Extend `projects.ts`

Do this first. Everything else imports types and data from it.

- Add `slug` field, rename `image` to `coverImage` / `imageAlt` to `coverImageAlt`
- Add `techStack`, `metrics`, `gallery`, `testimonialCompany`, `metaTitle`, `metaDescription`, `publishedAt`
- Remove `caseStudySection` flag
- Populate iGive entry fully
- Add Blom Company entry (can be partial data at first)

**Dependency:** Nothing imports this yet. Safe to do in isolation.

### Step 2: Build `_shared/` components

Build while no pages use them yet — easier to develop and test in isolation.

Order within Step 2:
1. `CaseStudyHero.astro` — simplest, no data complexity
2. `ChallengeAndSolution.astro` — lift directly from ProjectShowcase
3. `CaseStudyTestimonial.astro` — lift directly from ProjectShowcase
4. `TechStack.astro` — new, simple badge grid
5. `MetricsGrid.astro` — new, stat cards
6. `VisualGallery.astro` — handle 1-N images with Astro `<Image>`

**Dependency:** Needs Step 1 for type imports.

### Step 3: Build `igive/index.astro`

First case study page. Validates component API before building the second page.

- Wire up all `_shared/` components
- Add `CreativeWork` JSON-LD schema in `<Fragment slot="head">`
- Add `BreadcrumbList` JSON-LD
- Verify Astro image pipeline works with `gallery[]`

**Dependency:** Needs Steps 1 and 2.

### Step 4: Redesign `prosjekter/index.astro`

Now that `igive/` exists, update the index to link to it.

- Create `ProjectGrid.astro` in `_sections/`
- Replace `ProjectShowcase` import with `ProjectGrid` in `index.astro`
- Remove `Results.astro` import and usage
- Delete `ProjectShowcase.astro`
- Decide where Results stats go (Hero strip or dropped)

**Dependency:** Needs Step 1 (for grid data). Can be done in parallel with Step 3 if you stub the igive link.

### Step 5: Build `blom-company/index.astro`

Pattern validated by iGive — building the second page is mechanical.

- Add Blom Company assets to `src/assets/images/`
- Populate Blom entry in `projects.ts` fully
- Assemble page using `_shared/` components
- Add any Blom-specific sections inline or in `blom-company/_sections/`

**Dependency:** Needs Steps 2 and 3 (pattern validated).

### Step 6: SEO and GEO copy pass

Final pass across both case study pages and the index.

- Verify `metaTitle` and `metaDescription` in projects.ts for both projects
- Confirm `CreativeWork` and `BreadcrumbList` JSON-LD on both pages
- Update prosjekter index `<title>` / `description` if needed for GEO
- Review copy for GEO-readiness (structured, citable, factual)

**Dependency:** Needs Steps 3 and 5.

## Files: New vs Modified vs Deleted

| File | Action | Notes |
|------|--------|-------|
| `src/config/projects.ts` | MODIFIED | Extend interface, populate iGive, add Blom |
| `src/pages/prosjekter/index.astro` | MODIFIED | Swap ProjectShowcase for ProjectGrid, remove Results |
| `src/pages/prosjekter/_sections/ProjectShowcase.astro` | DELETED | Replaced by ProjectGrid |
| `src/pages/prosjekter/_sections/Results.astro` | DELETED (content moved) | Metrics belong on case study pages |
| `src/pages/prosjekter/_sections/ProjectGrid.astro` | NEW | Card grid, all projects, linked by slug |
| `src/pages/prosjekter/_shared/CaseStudyHero.astro` | NEW | Shared header |
| `src/pages/prosjekter/_shared/ChallengeAndSolution.astro` | NEW | Lifted from ProjectShowcase |
| `src/pages/prosjekter/_shared/TechStack.astro` | NEW | Badge grid |
| `src/pages/prosjekter/_shared/MetricsGrid.astro` | NEW | Stat cards |
| `src/pages/prosjekter/_shared/VisualGallery.astro` | NEW | Screenshot grid |
| `src/pages/prosjekter/_shared/CaseStudyTestimonial.astro` | NEW | Pull quote block |
| `src/pages/prosjekter/igive/index.astro` | NEW | Full iGive case study page |
| `src/pages/prosjekter/blom-company/index.astro` | NEW | Full Blom Company case study page |

## Anti-Patterns

### Anti-Pattern 1: Putting all case study content in `projects.ts`

**What people do:** Try to make `projects.ts` drive section ordering and content using conditional flags or union types for each section variant.

**Why it's wrong:** Config files are for data. Section composition is layout. Mixing them makes both worse — config becomes a layout DSL, pages lose flexibility to order and customize sections.

**Do this instead:** `projects.ts` holds structured data (strings, arrays, image imports). Pages own section composition. `blom-company/index.astro` can reorder sections freely without touching config.

### Anti-Pattern 2: Using `[slug].astro` with `getStaticPaths()`

**What people do:** Create a single dynamic route to avoid repeating the page setup across two files.

**Why it's wrong:** With 2 projects of different visual structures (iGive is a B2B landing page case study; Blom Company is a Shopify headless case study), a shared template accumulates `if project.type === 'shopify'` conditional rendering. The template grows brittle over time. This is the exact pattern the services pages avoided — with a documented good outcome in PROJECT.md.

**Do this instead:** Individual `index.astro` per project. Copy the structure from iGive for Blom, adjust section order, add Blom-specific sections. The duplication is ~10 lines of imports and BaseLayout wiring.

### Anti-Pattern 3: Dynamic image imports in `projects.ts`

**What people do:** Store image paths as strings in config and attempt `import()` at runtime or in a helper function.

**Why it's wrong:** Astro's `<Image>` component requires static imports at build time for image optimization (width/height extraction, format conversion, responsive srcsets). Dynamic imports bypass the pipeline.

**Do this instead:** Import images statically at the top of `projects.ts` and reference them in the object. This is already how `iGiveImage` is imported today. For `gallery[]`, import each screenshot at the top of the file.

### Anti-Pattern 4: Deleting `Results.astro` without moving its content

**What people do:** Remove `Results.astro` from the index page (correct action) without deciding where the aggregate metrics go.

**Why it's wrong:** Those aggregate stats (load time, project count, etc.) are trust signals. Dropping them entirely loses conversion value.

**Do this instead:** Decide before deleting — either move them to the index `Hero.astro` as a stat strip, or distribute per-project metrics to individual `MetricsGrid` sections on case study pages.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `projects.ts` → `prosjekter/index.astro` | Direct TypeScript import | All projects for grid rendering |
| `projects.ts` → `igive/index.astro` | Import + `.find(p => p.slug === 'igive')` | Typed via `Project` interface |
| `projects.ts` → `blom-company/index.astro` | Import + `.find(p => p.slug === 'blom-company')` | Typed via `Project` interface |
| `testimonials.ts` → case study pages | Import + `.find(t => t.company === project.testimonialCompany)` | Indirect string-key join |
| `_shared/` components → case study pages | Astro component props | Types derived from `Project` interface fields |
| Case study pages → `BaseLayout.astro` | `title`, `description` props + `head` slot for JSON-LD | Same pattern as all other pages in the codebase |

### JSON-LD Schema for Case Study Pages

Each case study page adds both `CreativeWork` and `BreadcrumbList` in the `<Fragment slot="head">` — the same injection pattern used by service pages.

```typescript
// In igive/index.astro frontmatter
const projectSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": project.name,
  "description": project.description,
  "creator": { "@type": "Organization", "name": "Nettup", "url": "https://nettup.no" },
  "url": project.url,
  "datePublished": project.publishedAt,
  "keywords": project.techStack?.join(", "),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Hjem", "item": "https://nettup.no" },
    { "@type": "ListItem", "position": 2, "name": "Prosjekter", "item": "https://nettup.no/prosjekter" },
    { "@type": "ListItem", "position": 3, "name": project.name, "item": `https://nettup.no/prosjekter/${project.slug}` },
  ],
};
```

## Sources

- Direct codebase analysis: `src/config/projects.ts` — current interface and iGive data
- Direct codebase analysis: `src/config/services.ts` — reference pattern for config-driven pages
- Direct codebase analysis: `src/config/testimonials.ts` — join key pattern
- Direct codebase analysis: `src/pages/prosjekter/index.astro` and `_sections/ProjectShowcase.astro`
- Direct codebase analysis: `src/pages/tjenester/nettside/index.astro` — individual file pattern
- Project decision log: `.planning/PROJECT.md` — "Individual index.astro per service" decision and outcome

---
*Architecture research for: nettup.no v1.4 — Portefølje 2.0 multi-page portfolio system*
*Researched: 2026-03-07*
