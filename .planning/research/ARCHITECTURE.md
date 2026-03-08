# Architecture Research

**Domain:** Local SEO landing pages integrated into existing Astro 5 SSG marketing site
**Researched:** 2026-03-08
**Confidence:** HIGH (based on direct codebase analysis — no external sources needed for integration questions)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     src/config/ (data layer)                         │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────────────┐  │
│  │ locations.ts │  │  services.ts   │  │  testimonials.ts         │  │
│  │  (NEW)       │  │  (unchanged)   │  │  (unchanged)             │  │
│  └──────┬───────┘  └───────┬────────┘  └──────────────────────────┘  │
└─────────┼──────────────────┼───────────────────────────────────────── ┘
          │                  │
┌─────────▼──────────────────▼───────────────────────────────────────── ┐
│                     src/pages/steder/                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  [location].astro (NEW dynamic route)                            │   │
│  │  getStaticPaths() → locations.map(l => ({ params: { location:   │   │
│  │    l.slug }, props: { city: l } }))                              │   │
│  └──────────────────────┬───────────────────────────────────────────┘   │
│                         │ imports and composes                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                   _sections/                                     │    │
│  │  CityHero.astro   CityServices.astro   CityFAQ.astro            │    │
│  │  CityTestimonials.astro  CityCTA.astro  NearbyAreas.astro        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────── ┘
          │
┌─────────▼────────────────────────────────────────────────────────────┐
│         BaseLayout.astro (MODIFIED — accepts city?: CityMeta)         │
│         Footer.astro    (MODIFIED — dynamic city links)               │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Lives In |
|-----------|----------------|----------|
| `locations.ts` | Single source of truth for all city data — drives `getStaticPaths()`, SEO metadata, JSON-LD, internal linking | `src/config/` |
| `[location].astro` | Dynamic route — resolves city from config, composes sections, owns JSON-LD, delegates title/description to BaseLayout | `src/pages/steder/` |
| `CityHero.astro` | City-specific H1, intro paragraph, primary CTA — receives `city: City` prop | `src/pages/steder/_sections/` |
| `CityServices.astro` | Which services are relevant for this city (drawn from services.ts) — static or city-specific list | `src/pages/steder/_sections/` |
| `CityFAQ.astro` | City-specific FAQ items (from `city.faq[]`) rendered with FAQPage JSON-LD | `src/pages/steder/_sections/` |
| `CityTestimonials.astro` | Shared testimonials component — same content across cities in V1 | `src/pages/steder/_sections/` |
| `CityCTA.astro` | Contact CTA section with city name interpolated | `src/pages/steder/_sections/` |
| `NearbyAreas.astro` | Internal link list to nearby city pages (from `city.nearbyAreas[]`) | `src/pages/steder/_sections/` |
| `BaseLayout.astro` | Modified: accepts optional `city?: CityMeta` prop to emit city-scoped LocalBusiness JSON-LD via head slot | `src/layouts/` |
| `Footer.astro` | Modified: imports `locations.ts`, renders dynamic "Vi dekker" link section capped at Tier 1 | `src/components/layout/` |

## Recommended Project Structure

```
src/
├── config/
│   └── locations.ts               # NEW: city data model (see interface below)
│
├── layouts/
│   └── BaseLayout.astro           # MODIFIED: add city?: CityMeta prop
│
├── components/
│   └── layout/
│       └── Footer.astro           # MODIFIED: add dynamic city coverage links
│
└── pages/
    └── steder/                    # NEW: city landing pages folder
        ├── [location].astro       # NEW: dynamic route
        └── _sections/
            ├── CityHero.astro     # NEW
            ├── CityServices.astro # NEW
            ├── CityFAQ.astro      # NEW
            ├── CityTestimonials.astro # NEW
            ├── CityCTA.astro      # NEW
            └── NearbyAreas.astro  # NEW
```

### Structure Rationale

- **`src/pages/steder/[location].astro`:** Route segment is `steder` ("places" in Norwegian), giving clean URLs `/steder/oslo`, `/steder/drammen`. Avoids collision with any existing route. Does not use `/[location].astro` at root level — root-level dynamic routes conflict with the static pages (`/om-oss`, `/kontakt`) in Astro unless filtered explicitly; `steder/` avoids that entirely.
- **`_sections/` inside `steder/`:** Follows the co-location convention established by every other page in the codebase. City section components are meaningful only in a city context — they do not belong in `src/components/ui/`.
- **`locations.ts` in `src/config/`:** Consistent with the `services.ts` / `projects.ts` / `testimonials.ts` pattern. All data lives in `config/`.

## Architectural Patterns

### Pattern 1: Config-Driven `getStaticPaths()`

**What:** `[location].astro` calls `getStaticPaths()` which maps over `locations` array and returns `{ params: { location: city.slug }, props: { city } }`. The page receives the full `City` object as a typed prop. No data fetching, no runtime.

**When to use:** Any time the number of pages is determined by a config file. Already used by `blogg/[slug].astro` via Astro content collections. Same pattern, different data source.

**Trade-offs:** Requires full build to add a new city. At 300 cities build time stays under 30 seconds for pure SSG — acceptable. Runtime cannot be used to dynamically add pages without a deploy.

**Example:**
```typescript
// src/pages/steder/[location].astro
export async function getStaticPaths() {
  return locations.map((city) => ({
    params: { location: city.slug },
    props: { city },
  }));
}

interface Props {
  city: City;
}

const { city } = Astro.props;
```

### Pattern 2: Head Slot Injection for City-Scoped JSON-LD

**What:** The city page does NOT modify BaseLayout. Instead it passes city-scoped `LocalBusiness` JSON-LD via the existing `<slot name="head" />` that BaseLayout already exposes. BaseLayout emits its own global `LocalBusiness` (areaServed: Norway) every page. The city page injects an additional, more specific `LocalBusiness` block scoped to that city.

**When to use:** Any time a page needs structured data that overrides or supplements BaseLayout's defaults without modifying BaseLayout itself.

**Trade-offs:** Two `LocalBusiness` blocks on city pages. Google handles multiple JSON-LD blocks on a single page correctly — the more specific block (city-scoped) will be picked up for local search alongside the country-level block. This is the correct SEO approach: do not remove the country-level block.

**Why not modify BaseLayout to accept a `city` prop instead:** BaseLayout already receives `title`, `description`, `image` — adding a `city?: CityMeta` prop is a valid option, but it means BaseLayout must know about the City interface. The head slot injection keeps BaseLayout ignorant of the locations domain. Given that blog articles already inject their own `BreadcrumbList` via `<Fragment slot="head">` overriding BaseLayout's auto-generated one, this pattern is established and consistent.

**Recommendation: use the head slot pattern.** It keeps BaseLayout's interface stable. The city page owns its own JSON-LD.

**Example:**
```typescript
// In [location].astro frontmatter
const cityLocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `https://nettup.no/steder/${city.slug}#business`,
  "name": "Nettup",
  "description": `Webdesign og webutvikling i ${city.name}. Moderne, raske nettsider for lokale bedrifter.`,
  "url": `https://nettup.no/steder/${city.slug}`,
  "telephone": "+47 413 27 136",
  "email": "post@nettup.no",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": city.name,
    "addressRegion": city.county,
    "addressCountry": "NO"
  },
  "areaServed": {
    "@type": "City",
    "name": city.name
  },
  "sameAs": ["https://nettup.no/#business"],
};
```

```astro
<BaseLayout title={city.seoTitle} description={city.seoDescription}>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(cityLocalBusinessSchema)} />
    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
    {city.faq.length > 0 && (
      <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
    )}
  </Fragment>
  ...
</BaseLayout>
```

### Pattern 3: Tier-Based Footer Linking

**What:** `Footer.astro` imports `locations` from `locations.ts` and filters to `tier === 1` to render a "Vi dekker" section with ~8 city links. At V2 (30+ cities), filter still applies — only Tier 1 cities appear in the footer. The footer never lists 300 cities.

**When to use:** Internal linking at a scale that doesn't bloat the footer. Footer links also help Google discover city pages via crawl.

**Trade-offs:** Tier 1 cities get footer link equity. Tier 2/3 cities rely on sitemap and internal links from nearby city pages (`NearbyAreas.astro`).

**Example:**
```typescript
// Footer.astro
import { locations } from '@/config/locations';
const tier1Cities = locations.filter((c) => c.tier === 1);
```

```astro
<div>
  <h3>Vi dekker blant annet</h3>
  <ul>
    {tier1Cities.map((city) => (
      <li>
        <a href={`/steder/${city.slug}`}>{city.name}</a>
      </li>
    ))}
  </ul>
</div>
```

## `locations.ts` Data Model

The interface must support V1 (hand-crafted), V2 (AI-assisted), and V3 (full coverage) without structural changes. The key principle: all V1 fields remain required; V2/V3 fields use `?` optional and are populated progressively.

```typescript
// src/config/locations.ts

export type CityTier = 1 | 2 | 3;

export interface CityFAQItem {
  question: string;
  answer: string;
}

export interface City {
  // --- Required for all tiers ---
  slug: string;             // URL segment: "oslo", "drammen", "barum"
  name: string;             // Display name: "Oslo", "Drammen", "Bærum"
  county: string;           // For address schema: "Oslo", "Viken", "Akershus"
  tier: CityTier;           // 1 = Tier 1 (hand-crafted), 2 = AI-assisted, 3 = programmatic
  region: string;           // Human grouping label: "Oslofjord-regionen"

  // --- SEO metadata (required for all tiers — V2/V3 may be AI-generated) ---
  seoTitle: string;         // <title>: "Nettside for bedrifter i Oslo | Nettup"
  seoDescription: string;   // meta description: ≤160 chars, city-specific

  // --- Page content ---
  intro: string;            // 2-3 sentences, hand-written for Tier 1, AI for Tier 2/3
  faq: CityFAQItem[];       // 3-5 items for Tier 1; can be [] for Tier 3 initially

  // --- Internal linking ---
  nearbyAreas: string[];    // Slugs of nearby city pages: ["drammen", "asker"]

  // --- V2/V3 extension fields (optional in V1) ---
  industries?: string[];    // Regional industries: ["bygg", "handel", "helse"] — drives V2 copy variation
  population?: number;      // Used by V3 for programmatic relevance scoring
}

export const locations: City[] = [
  {
    slug: 'oslo',
    name: 'Oslo',
    county: 'Oslo',
    tier: 1,
    region: 'Oslofjord-regionen',
    seoTitle: 'Nettside for bedrifter i Oslo | Nettup',
    seoDescription: 'Nettup lager moderne, raske nettsider for bedrifter i Oslo. Profesjonelt webdesign fra 4 800 kr. Svar innen 24 timer.',
    intro: '...',
    faq: [],
    nearbyAreas: ['drammen', 'asker', 'barum', 'lillestrøm'],
  },
  // ... other Tier 1 cities
];
```

**V1/V2/V3 expansion strategy:**

- **V1 (6–8 Tier 1 cities):** All fields populated by hand. `industries` optional, skip.
- **V2 (30–50 cities, AI-assisted):** Script reads `locations.ts`, calls Claude API with city + `industries[]` context to generate `intro` and `faq[]`. Writes back to file. `tier: 2`.
- **V3 (full Norway):** Programmatic. `intro` and `faq` templated from `industries[]` + `population`. `tier: 3`. No structural change to interface or route.

**What does NOT go in `locations.ts`:**

- Section composition or ordering — that belongs in `[location].astro`
- Service prices — those come from `services.ts` imported in the page
- Testimonials — drawn from `testimonials.ts` directly (same testimonials across all cities in V1)

## `[location].astro` Section Composition

The page imports section components and passes the `city` prop. Section ordering for V1:

1. `CityHero` — `city.name`, `city.intro`, primary CTA to `/kontakt`
2. `CityServices` — static services list (from `services.ts`) with city name in copy
3. `CityTestimonials` — shared testimonials (city-agnostic in V1)
4. `CityFAQ` — `city.faq[]` items + FAQPage JSON-LD
5. `NearbyAreas` — links to `city.nearbyAreas[]` slugs
6. `CityCTA` — contact CTA with city name interpolated

**Every section receives `city: City` as a prop** even if it only uses `city.name`. This avoids prop drilling complexity and makes future V2 customization straightforward — any section can read any city field without changing the parent page's prop passing.

## BaseLayout SEO Props — Exact Change

BaseLayout's current `Props` interface:
```typescript
interface Props {
  title: string;
  description?: string;
  image?: string;
}
```

**Recommended: no change to this interface.** City pages pass `city.seoTitle` as `title` and `city.seoDescription` as `description`. The canonical URL is derived from `Astro.url.pathname` which is already correct for `/steder/oslo`.

The city-scoped `LocalBusiness` JSON-LD goes through `<slot name="head" />`, not through BaseLayout props. BaseLayout's global `LocalBusiness` block (areaServed: Country Norway) stays in place — it serves non-city pages correctly.

**The only addition to consider:** `pageLabels` inside BaseLayout currently hardcodes labels for breadcrumb generation. City pages at `/steder/oslo` will fall back to `seg` (the raw slug, e.g. "oslo") for the third breadcrumb item, which is acceptable. If you want "Oslo" (display name) instead of "oslo" (slug) in the breadcrumb, the cleanest approach is to inject a custom `BreadcrumbList` via the head slot (overriding BaseLayout's auto-generated one) — the same approach blog articles already use.

## Footer Linking at Scale

**V1:** Filter `locations.filter(c => c.tier === 1)` — renders 6–8 links. Add a "Se alle byer" link to a future `/steder` index page (that page can be built in V2).

**V2 (30+ cities):** Footer still shows only Tier 1. No change to Footer component. Tier 2 cities are discovered via sitemap and `NearbyAreas` cross-links.

**V3 (300 cities):** Same. Footer cap stays at Tier 1. A `/steder` index page grouped by region becomes the discovery path for Tier 2/3 cities.

**Contact page:** Add a paragraph mentioning coverage area with links to 4–5 key cities. Hard-code this for V1 — it is a content paragraph, not a dynamic list. Do not iterate over `locations` on the contact page. The maintenance cost of updating it as cities are added is low.

## Data Flow

### Build-Time Flow

```
locations.ts (City[] array)
    ↓
steder/[location].astro — getStaticPaths()
    ↓ generates one static page per city slug
/steder/oslo, /steder/drammen, /steder/asker ...
    ↓ each page
BaseLayout(title=city.seoTitle, description=city.seoDescription)
    + <Fragment slot="head"> — city LocalBusiness + BreadcrumbList + FAQPage JSON-LD
    + CityHero(city)
    + CityServices(city)
    + CityTestimonials
    + CityFAQ(city)
    + NearbyAreas(city)
    + CityCTA(city)
```

### Sitemap Flow

`@astrojs/sitemap` auto-discovers all pages including `/steder/*` because Astro writes them as static HTML. No sitemap config change needed — the integration crawls `output: 'static'` pages automatically. City pages inherit the default priority. If you want to customize, add a `steder/` case to the `serialize()` function in `astro.config.mjs`.

### Internal Link Graph

```
Footer (Tier 1 cities)  →  /steder/oslo, /steder/drammen, ...
/steder/oslo NearbyAreas →  /steder/drammen, /steder/asker, /steder/barum
/steder/drammen NearbyAreas →  /steder/oslo, /steder/sandvika, ...
/kontakt (static paragraph) →  /steder/oslo, /steder/drammen (4–5 key cities)
```

This graph ensures Google can reach all Tier 1 cities from the footer, and can crawl from city to city via NearbyAreas. Tier 2/3 cities are reachable via NearbyAreas from Tier 1 cities they adjoin.

## Build Order

Each step has explicit dependencies. Do not reorder.

### Step 1: Define `locations.ts` with V1 interface

Define the `City` interface and `CityTier` type first. Populate 1–2 city entries (Oslo + one other) to validate the model before writing sections.

**Why first:** Everything else depends on the `City` type. Getting the interface right before building sections avoids rework.

**Dependency:** Nothing. Standalone.

### Step 2: Build `[location].astro` skeleton with `getStaticPaths()`

Write the dynamic route with only a placeholder `<h1>{city.name}</h1>`. Verify the build generates the correct pages and canonical URLs. Fix any routing issues at this step before section complexity is added.

**Why second:** Confirms the route works before investing in sections.

**Dependency:** Needs Step 1 for the `City` type.

### Step 3: Build city sections

Build in this order (each is independent once the `City` type is available):

1. `CityHero.astro` — renders `city.name` and `city.intro`
2. `CityFAQ.astro` — renders `city.faq[]` and FAQPage JSON-LD
3. `NearbyAreas.astro` — renders `city.nearbyAreas[]` as links to `/steder/[slug]`
4. `CityServices.astro` — static services list, city name in heading
5. `CityTestimonials.astro` — lifted from existing Testimonials section pattern
6. `CityCTA.astro` — contact CTA with city name

**Why this order:** Hero and FAQ are the highest SEO priority sections. NearbyAreas is simple and validates the cross-link model early. Services and testimonials are secondary.

**Dependency:** Needs Steps 1 and 2.

### Step 4: Add JSON-LD to `[location].astro`

Add city-scoped `LocalBusiness`, city-specific `BreadcrumbList`, and FAQPage schemas in `<Fragment slot="head">`. Verify with Google Rich Results Test on the built output.

**Why fourth:** JSON-LD depends on the `city` data being available, and it is easier to verify once the page content is rendering correctly.

**Dependency:** Needs Steps 1 and 2.

### Step 5: Populate all 6–8 Tier 1 cities in `locations.ts`

Write hand-crafted `intro` and `faq[]` for each city. This is a content task, not a code task — do it after the template is confirmed working.

**Dependency:** Needs Steps 2, 3, and 4 so you can preview each city page.

### Step 6: Footer + contact page internal linking

Modify `Footer.astro` to render Tier 1 city links. Add static coverage paragraph to `/kontakt/index.astro`.

**Why last:** Internal linking is mechanical and depends on the city pages existing (Step 5) so links can be spot-checked.

**Dependency:** Needs Step 5.

## Files: New vs Modified

| File | Action | Notes |
|------|--------|-------|
| `src/config/locations.ts` | NEW | City data model and V1 city entries |
| `src/pages/steder/[location].astro` | NEW | Dynamic route with getStaticPaths() |
| `src/pages/steder/_sections/CityHero.astro` | NEW | City-specific hero |
| `src/pages/steder/_sections/CityServices.astro` | NEW | Services with city context |
| `src/pages/steder/_sections/CityFAQ.astro` | NEW | FAQ with JSON-LD |
| `src/pages/steder/_sections/CityTestimonials.astro` | NEW | Testimonials (shared content) |
| `src/pages/steder/_sections/CityCTA.astro` | NEW | Contact CTA |
| `src/pages/steder/_sections/NearbyAreas.astro` | NEW | Cross-city internal links |
| `src/layouts/BaseLayout.astro` | NOT MODIFIED | Props interface unchanged; city JSON-LD injected via head slot |
| `src/components/layout/Footer.astro` | MODIFIED | Add "Vi dekker" section with Tier 1 city links |
| `src/pages/kontakt/index.astro` | MODIFIED | Add static coverage paragraph with 4–5 city links |
| `astro.config.mjs` | NOT MODIFIED | Sitemap auto-discovers /steder/* without config changes |

## Anti-Patterns

### Anti-Pattern 1: Root-Level Dynamic Route `src/pages/[location].astro`

**What people do:** Place the dynamic route at `src/pages/[location].astro` instead of `src/pages/steder/[location].astro`.

**Why it's wrong:** Astro processes root-level dynamic routes after static routes, but any future static page (`/priser`, `/garantier`) would need to be explicitly excluded from the dynamic route's `getStaticPaths()` return value. This creates a fragile coupling — forgetting to exclude a slug could silently override a static page. The `steder/` namespace gives city pages a clean, isolated URL segment with zero collision risk.

**Do this instead:** `src/pages/steder/[location].astro`. URLs `/steder/oslo` are also SEO-friendly — city name is in the slug, the segment "steder" is readable Norwegian.

### Anti-Pattern 2: Storing Copy in `locations.ts` Config

**What people do:** Put full page copy (hero body text, service descriptions, testimonial text) as long strings in the config file.

**Why it's wrong:** Long prose in TypeScript config is hard to edit, does not support multiline formatting, and conflates data with content. The `intro` field is the correct scope limit for config — 2–3 sentences. Anything longer belongs in the section component as a prop or as static copy inside the component.

**Do this instead:** Keep `locations.ts` fields short and structured. The `intro` prop is passed to `CityHero` which renders it as a `<p>`. The FAQ items are 1-2 sentence pairs — fine for config. Full service descriptions come from `services.ts`. Testimonials come from `testimonials.ts`.

### Anti-Pattern 3: Per-City Individual Static Files

**What people do:** Create `src/pages/steder/oslo/index.astro`, `src/pages/steder/drammen/index.astro` etc. — one file per city.

**Why it's wrong:** This was the right call for services (structurally different per page) and case studies (bespoke content). City landing pages are structurally identical — same sections, same composition, only data differs. At 8 cities it is annoying. At 50 it is unmaintainable. At 300 it is not a real option.

**Do this instead:** `[location].astro` with `getStaticPaths()`. The uniformity of city pages is precisely the use case dynamic routes exist for. Structural differences (a city needing an extra section) are handled by conditional rendering on a per-section prop: `{city.industries && city.industries.length > 0 && <CityIndustries city={city} />}`.

### Anti-Pattern 4: Modifying BaseLayout's Global `LocalBusiness` Block

**What people do:** Change the `areaServed` in BaseLayout's `LocalBusiness` to match the current city on city pages.

**Why it's wrong:** BaseLayout's `LocalBusiness` block is emitted on every page — including `/`, `/tjenester`, `/kontakt`. Changing it dynamically would require passing city context through every page, most of which are not city pages. It also replaces the country-level block (areaServed: Norway) which is correct for non-city pages.

**Do this instead:** Keep BaseLayout's block untouched. City pages add a second, city-scoped `LocalBusiness` block via `<Fragment slot="head">`. Google handles multiple JSON-LD blocks correctly. The city-specific block uses a different `@id` (`/steder/oslo#business`) from the global one (`/nettup.no/#business`).

### Anti-Pattern 5: Putting All Cities in the Footer

**What people do:** Render `locations.map(...)` in the footer as the city pages grow.

**Why it's wrong:** A footer with 300 city links is a spam signal, not a trust signal. It will harm UX and may trigger Google soft penalties for thin/doorway page patterns.

**Do this instead:** Filter `tier === 1` in the footer (8 cities max). Build a `/steder` index page grouped by region for V2. Let the sitemap and NearbyAreas cross-links handle discovery of Tier 2/3 cities.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `locations.ts` → `[location].astro` | Direct TypeScript import in `getStaticPaths()` | Typed `City[]` |
| `[location].astro` → section components | Astro component props `city: City` | All sections receive the full city object |
| `[location].astro` → `BaseLayout.astro` | `title`, `description` props + `head` slot | Interface unchanged; city JSON-LD via slot |
| `locations.ts` → `Footer.astro` | Direct TypeScript import, filter `tier === 1` | Only Tier 1 cities in footer |
| `services.ts` → `CityServices.astro` | Direct import | Static services list with city name in copy |
| `testimonials.ts` → `CityTestimonials.astro` | Direct import | Same testimonials across all cities in V1 |
| `city.nearbyAreas[]` → `NearbyAreas.astro` | String slugs → `/steder/[slug]` links | No lookup needed; slugs are the URL |

### JSON-LD Schema Architecture for City Pages

Each city page emits three JSON-LD blocks (all injected via `<Fragment slot="head">`):

1. **City-scoped `LocalBusiness`** — `areaServed: { "@type": "City", "name": city.name }`, `@id` is city-specific. This is the primary local SEO signal.
2. **City-specific `BreadcrumbList`** — overrides BaseLayout's auto-generated breadcrumb. Items: Hjem → Steder → [City Name].
3. **`FAQPage`** — conditional on `city.faq.length > 0`. Emitted directly; same pattern as service FAQ pages.

BaseLayout continues to emit `Organization`, global `LocalBusiness` (areaServed: Norway), `Offer`, and auto-breadcrumb for all pages. City pages layer on top without touching those.

## Sources

- Direct codebase analysis: `src/layouts/BaseLayout.astro` — existing JSON-LD structure and head slot
- Direct codebase analysis: `src/config/services.ts`, `projects.ts` — established config interface patterns
- Direct codebase analysis: `src/pages/blogg/[slug].astro` — getStaticPaths() pattern in this codebase
- Direct codebase analysis: `src/components/layout/Footer.astro` — current structure and extension point
- Direct codebase analysis: `astro.config.mjs` — sitemap serialization, `output: 'static'`
- Project decision log: `.planning/PROJECT.md` — individual files vs [slug].astro trade-off analysis

---
*Architecture research for: nettup.no v1.5 — Local SEO landing pages*
*Researched: 2026-03-08*
