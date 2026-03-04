# Architecture Research

**Domain:** Service sub-pages integration into existing Astro 5 marketing site
**Researched:** 2026-03-04
**Confidence:** HIGH (based on direct codebase analysis of all relevant files; no inference required)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Config Layer                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ pricing.ts  │  │ services.ts  │  │    brand.ts      │   │
│  │ (existing)  │  │   (NEW)      │  │   (existing)     │   │
│  └──────┬──────┘  └──────┬───────┘  └──────────────────┘   │
│         │                │                                   │
├─────────┴────────────────┴───────────────────────────────── ┤
│                     Page Layer                               │
│  ┌────────────────┐    ┌────────────────────────────────┐   │
│  │ tjenester/     │    │ tjenester/[slug].astro         │   │
│  │ index.astro    │    │ (NEW — getStaticPaths)         │   │
│  │ (modify)       │    │                                │   │
│  └────────────────┘    └────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                  Section Components                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ tjenester/_sections/ (existing, to be restructured)  │   │
│  │ tjenester/[slug]/_sections/ (NOT needed — see below) │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                   UI Primitives (unchanged)                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────────┐  │
│  │ Button   │  │   Card   │  │ Section │  │SectionHeader│  │
│  └──────────┘  └──────────┘  └─────────┘  └────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `src/config/services.ts` | All service data (slug, name, description, price range, features, FAQ, JSON-LD) | TypeScript array of `Service` objects |
| `src/pages/tjenester/index.astro` | Overview page — links to each sub-page via service cards | Modified to import from `services.ts` |
| `src/pages/tjenester/[slug].astro` | Single template renders all 7 service pages | `getStaticPaths()` reads `services.ts` |
| `src/layouts/BaseLayout.astro` | SEO, analytics, breadcrumbs, scroll reveal | Unchanged — consumes `<slot name="head">` for per-page schemas |

## Recommended Project Structure

```
src/
├── config/
│   ├── services.ts         # NEW — canonical data source for all 7 services
│   ├── pricing.ts          # KEEP unchanged (or deprecate once overview is rewritten)
│   ├── brand.ts            # Unchanged
│   ├── testimonials.ts     # Unchanged
│   └── projects.ts         # Unchanged
│
├── pages/
│   └── tjenester/
│       ├── index.astro          # MODIFY — rewire to use services.ts, add service cards
│       ├── [slug].astro         # NEW — dynamic template for all 7 sub-pages
│       └── _sections/
│           ├── Pakker.astro     # MAY ARCHIVE (pricing tier approach being replaced)
│           ├── TjenesteCatalog.astro   # NEW — overview page service card grid
│           ├── Inkludert.astro  # KEEP or archive
│           ├── Support.astro    # KEEP or archive
│           ├── FAQ.astro        # KEEP for overview page
│           └── TjenesterCTA.astro     # KEEP or update copy
│
└── components/
    └── ui/                 # Unchanged — Button, Card, Section, SectionHeader
```

### Structure Rationale

- **`src/config/services.ts` (new):** Single source of truth for all 7 services. Every piece of data that appears on both the overview page AND the sub-pages lives here — slug, name, shortDescription, fullDescription, priceRange, deliveryTime, features, faqs, etc. No duplication between files.
- **`[slug].astro` single template:** 7 service pages, 1 template. Data drives content, not separate files. Adding an 8th service in the future means adding one object to `services.ts` — nothing else.
- **No `_sections/` subdirectory per service:** Service sub-pages have identical structure (hero, what-you-get, price range, FAQ, CTA). A single `[slug].astro` template handles all of them. Section directories are for page-specific layouts that genuinely differ (like `_home/` with Problem, Solution, WhyNettup, etc.).

## Architectural Patterns

### Pattern 1: Dynamic Route with getStaticPaths

**What:** Single `[slug].astro` file generates all 7 service pages at build time by reading `services.ts`.
**When to use:** When multiple pages share identical structure and differ only in data. Exactly this case.
**Trade-offs:** Pro: one file to maintain, data-driven, consistent across all 7 pages. Con: cannot easily give one service page a radically different layout. For this milestone, identical layout per sub-page is the correct call.

**Example:**
```typescript
// src/pages/tjenester/[slug].astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { services } from '@/config/services';
import type { Service } from '@/config/services';

export function getStaticPaths() {
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
}

interface Props { service: Service; }
const { service } = Astro.props;

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.jsonLd.name,
  "description": service.jsonLd.description,
  "provider": { "@type": "Organization", "name": "Nettup", "url": "https://nettup.no" },
  "areaServed": { "@type": "Country", "name": "Norway" },
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": service.priceRange.min,
      "maxPrice": service.priceRange.max,
      "priceCurrency": "NOK"
    }
  }
};
---
<BaseLayout title={service.meta.title} description={service.meta.description}>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
  </Fragment>
  <main>
    <!-- inline sections using service.* data -->
  </main>
</BaseLayout>
```

### Pattern 2: Config-Driven Service Data Shape

**What:** `services.ts` exports a typed `Service` interface that carries everything a service page and the overview card need.
**When to use:** Always. The interface is the contract between data and template.
**Trade-offs:** Pro: TypeScript catches missing fields at build time; adding fields to one service forces you to add them everywhere. Con: slightly more upfront design of the interface.

**Example:**
```typescript
// src/config/services.ts
export interface PriceRange {
  min: number;
  max: number;
  note: string;  // "Avhengig av omfang" etc.
}

export interface Service {
  slug: string;                     // 'nettside', 'landingsside', 'nettbutikk', etc.
  name: string;                     // "Nettside"
  tagline: string;                  // Short card description for overview page
  description: string;             // Full paragraph for sub-page hero
  icon: string;                    // SVG path or emoji for card icon
  priceRange: PriceRange;
  deliveryTime: string;            // "2–3 uker"
  features: string[];              // What's included (bullet list)
  outcomes: string[];              // What the customer gets (benefit language)
  faqs: Array<{ question: string; answer: string }>;
  ctaLabel: string;                // "Bestill nettside"
  ctaHref: string;                 // "/kontakt?tjeneste=nettside&kilde=tjenesteside"
  meta: {
    title: string;                 // <title> tag
    description: string;           // meta description
  };
  jsonLd: {
    name: string;                  // Schema.org Service name
    description: string;           // Schema.org description (different from meta)
  };
}

export const services: Service[] = [
  {
    slug: 'nettside',
    name: 'Nettside',
    // ...
  },
  // 6 more services
];
```

### Pattern 3: Per-Page JSON-LD via head Slot

**What:** Service JSON-LD is injected via `<Fragment slot="head">` in the page file, not via a BaseLayout prop. BaseLayout already supports this pattern — `tjenester/index.astro` already uses it.
**When to use:** Any page-specific schema. Do not add schema support to BaseLayout props — that would force BaseLayout to know about every possible schema type.
**Trade-offs:** Pro: BaseLayout stays generic; pages own their own schemas. Con: none — this is already the established pattern in this codebase.

**Evidence:** `src/pages/tjenester/index.astro` lines 12-31 and 38-42 show this exact pattern working in production.

## Data Flow

### Build-Time Flow for Service Sub-Pages

```
src/config/services.ts
    |
    | (getStaticPaths reads services array)
    v
src/pages/tjenester/[slug].astro
    |
    +-- Generates 7 static HTML files at build time:
    |     /tjenester/nettside/index.html
    |     /tjenester/landingsside/index.html
    |     /tjenester/nettbutikk/index.html
    |     /tjenester/webapp/index.html
    |     /tjenester/seo/index.html
    |     /tjenester/ai/index.html
    |     /tjenester/vedlikehold/index.html
    |
    +-- Each page injects service-specific Service JSON-LD via <slot name="head">
    |
    +-- BaseLayout handles: BreadcrumbList (auto, via Astro.url.pathname),
          Organization schema, LocalBusiness schema, OG tags, title, description
```

### BreadcrumbList Handling

BaseLayout already auto-generates BreadcrumbList from `Astro.url.pathname`. For `/tjenester/nettside` this will produce:

```
Hjem > Tjenester > [current page label]
```

The `pageLabels` map in BaseLayout only covers top-level routes. For service slugs, the fallback `name: pageLabels[fullPath] ?? seg` will use the raw slug (e.g., "nettside"). This is acceptable for breadcrumbs. If display names need to differ from slugs, extend `pageLabels` with service sub-paths.

**Recommended extension to BaseLayout.astro:**
```typescript
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/tjenester/nettside': 'Nettside',
  '/tjenester/landingsside': 'Landingsside',
  '/tjenester/nettbutikk': 'Nettbutikk',
  '/tjenester/webapp': 'Webapplikasjon',
  '/tjenester/seo': 'SEO',
  '/tjenester/ai': 'AI-integrasjoner',
  '/tjenester/vedlikehold': 'Vedlikehold',
  // ... existing labels
};
```

### CTA Pre-Fill Flow

```
Service sub-page CTA button
  href="/kontakt?tjeneste=nettside&kilde=tjenesteside"
    |
    v
/kontakt page
  ContactForm reads URL params
  Pre-fills "Hvilken tjeneste?" field with decoded service name
```

The existing `?pakke=` pre-fill pattern (used in `Pakker.astro`) proves this works. Switch param name from `pakke` to `tjeneste` to reflect the new model. If ContactForm reads `pakke`, verify before assuming `tjeneste` works — may need a one-line update to ContactForm.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 7 services (v1.1) | Single `[slug].astro` template — zero overhead |
| 15+ services | Still fine — `getStaticPaths` handles any array size |
| Service-specific layouts | Add `layoutVariant` field to Service interface; switch in template |
| Content-heavy sub-pages | Consider Astro Content Collections (`.md` frontmatter) — but overkill for 7 pages with Norwegian copy managed by developer |

### Scaling Priorities

1. **First concern:** Content maintenance — keeping 7 service descriptions accurate. Solved by centralizing all text in `services.ts`. Changes require one file edit.
2. **Second concern:** SEO differentiation — each page must have unique title, description, and content to avoid thin-content penalties. The `Service` interface enforces this by requiring `meta.title` and `meta.description` per service.

## Anti-Patterns

### Anti-Pattern 1: Individual Page Files Per Service

**What people do:** Create `tjenester/nettside/index.astro`, `tjenester/landingsside/index.astro`, etc. as 7 separate files.
**Why it's wrong:** Identical structure copied 7 times. A layout change requires editing 7 files. A section rename means 7 find-replace operations. Common in Astro projects where developers don't recognize the dynamic routing use case.
**Do this instead:** `tjenester/[slug].astro` with `getStaticPaths()`. One template, 7 outputs, identical build output.

### Anti-Pattern 2: Service Data Scattered Across Page Files

**What people do:** Hard-code service name, price, features inside each page's frontmatter or inline in the template.
**Why it's wrong:** Overview page cards and sub-pages then have separate copies of the same data. Price changes require editing in two places. Name inconsistencies between overview and sub-page create UX confusion.
**Do this instead:** `services.ts` is the only place service data lives. Both overview page and `[slug].astro` import from it.

### Anti-Pattern 3: Adding serviceSchema Prop to BaseLayout

**What people do:** Add `serviceSchema?: object` prop to BaseLayout, then conditionally render it.
**Why it's wrong:** BaseLayout becomes aware of every schema type. As more page types are added (FAQ schema, HowTo schema), BaseLayout grows into a monolith that every page must configure.
**Do this instead:** Page files inject schemas via `<Fragment slot="head">` — already the established pattern in this codebase. BaseLayout stays generic. This is confirmed by how `tjenester/index.astro` handles it today.

### Anti-Pattern 4: Extending pricing.ts for Service Sub-Pages

**What people do:** Add service sub-page data (slug, description, outcomes, FAQs) to the existing `pricing.ts` because it already has service-like data.
**Why it's wrong:** `pricing.ts` models the 3-tier pricing model (Enkel/Standard/Premium). The new service model is fundamentally different — 7 distinct services with price ranges, not 3 generic tiers. Merging them creates a confusing interface and makes it impossible to cleanly deprecate the old model.
**Do this instead:** Create `services.ts` as a clean new file. Keep `pricing.ts` unchanged until the overview page is confirmed not to need it.

### Anti-Pattern 5: _sections/ Subdirectory Per Service

**What people do:** Create `tjenester/nettside/_sections/Hero.astro`, `tjenester/nettside/_sections/FAQ.astro`, etc. following the top-level page pattern.
**Why it's wrong:** If 7 services each get `_sections/` directories, that's 7+ directories with nearly identical files. The `_sections/` pattern is for pages with **unique section compositions** (like `/prosjekter` with its showcase + results sections). Service sub-pages share the same section composition — only the data differs.
**Do this instead:** Inline section content in `[slug].astro` driven by `service.*` data props. For shared section components used by sub-pages, put them in `tjenester/_sections/` (shared within the tjenester route group).

## Integration Points

### Files to Create

| File | Type | Why |
|------|------|-----|
| `src/config/services.ts` | New | Canonical data for all 7 services |
| `src/pages/tjenester/[slug].astro` | New | Dynamic template for sub-pages |

### Files to Modify

| File | Change | Why |
|------|--------|-----|
| `src/pages/tjenester/index.astro` | Rewrite to service catalog | Replace pricing tier model with 7 service cards linking to sub-pages |
| `src/pages/tjenester/_sections/Pakker.astro` | Archive or replace | Pricing tiers being replaced by service catalog |
| `src/layouts/BaseLayout.astro` | Add service slug labels to `pageLabels` | Correct breadcrumb display names for sub-pages |
| `src/components/islands/ContactForm.tsx` | Check `?pakke=` vs `?tjeneste=` param | Ensure pre-fill works with new query param name |

### Files Unchanged

| File | Reason |
|------|--------|
| `src/components/ui/*` | All primitives (Button, Card, Section, SectionHeader) usable as-is |
| `src/layouts/BaseLayout.astro` (core) | JSON-LD slot pattern already works; only `pageLabels` needs extending |
| `src/config/pricing.ts` | May eventually be deprecated but don't touch during v1.1 |
| `src/config/brand.ts`, `testimonials.ts`, `projects.ts` | Unrelated |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `services.ts` -> `[slug].astro` | Direct import via `getStaticPaths` | Type-safe via `Service` interface |
| `services.ts` -> `tjenester/index.astro` | Direct import | Same data, different rendering (cards vs full page) |
| `[slug].astro` -> `BaseLayout` | Props: title, description + slot: head (JSON-LD) | Established pattern, no changes needed to BaseLayout |
| Service sub-page CTA -> ContactForm | URL query param `?tjeneste=[slug]` | Verify ContactForm reads this param correctly |

## Build Order

Dependencies must be respected. The correct sequence:

```
Step 1: Design Service interface in services.ts (no code yet, just the type)
  |
  +-- Clarifies exactly what data each service page needs
  +-- Makes content writing systematic (fill in all 7 services)
  +-- Unblocks both Step 2 and Step 3 in parallel

Step 2: Populate services.ts with all 7 service objects
  |
  +-- Write Norwegian copy for all 7 services
  +-- Define price ranges, features, outcomes, FAQs per service
  +-- MUST complete before any page work

Step 3: Create [slug].astro template (depends on Step 2 data shape)
  |
  +-- Wire getStaticPaths to services array
  +-- Build page sections inline using service.* props
  +-- Inject Service JSON-LD via head slot
  +-- Verify 7 routes build correctly (npm run build)

Step 4: Rewrite tjenester/index.astro overview (depends on Step 2)
  |
  +-- Import services array
  +-- Render service catalog cards with links to /tjenester/[slug]
  +-- Can run in parallel with Step 3 once services.ts is populated

Step 5: Update BaseLayout.astro pageLabels (depends on knowing final slugs)
  |
  +-- Add service sub-path labels for breadcrumbs
  +-- One-time, low-risk change

Step 6: Verify ContactForm pre-fill (depends on Step 3 CTA hrefs)
  |
  +-- Test ?tjeneste= param is read and applied
  +-- Adjust param name in ContactForm if needed
```

**Critical path:** `services.ts` data → `[slug].astro` template → test 7 routes build → then overview page.

The overview page restructure can start as soon as `services.ts` exists (Step 2), making Steps 3 and 4 parallelizable.

## Sources

- Direct codebase analysis: `src/pages/tjenester/index.astro` (existing JSON-LD slot pattern)
- Direct codebase analysis: `src/layouts/BaseLayout.astro` (breadcrumb auto-generation, slot="head" support)
- Direct codebase analysis: `src/config/pricing.ts`, `src/config/projects.ts` (established config file patterns)
- Direct codebase analysis: `src/pages/tjenester/_sections/` (current section structure)
- Astro 5 static output mode confirmed: `astro.config.mjs` (`output: 'static'`)
- `getStaticPaths` is the standard Astro mechanism for dynamic routes in static output mode (HIGH confidence — core Astro API, stable across Astro 2-5)

---
*Architecture research for: v1.1 Tjenesteutvidelse — Service sub-pages integration*
*Researched: 2026-03-04*
