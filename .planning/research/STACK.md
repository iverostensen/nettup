# Stack Research

**Domain:** Local SEO landing pages — Astro 5 dynamic routes, config-driven location data
**Researched:** 2026-03-08
**Confidence:** HIGH

## Scope

This file covers ONLY what is NEW or CHANGED for the v1.5 Local SEO landing pages milestone. The existing validated stack (Astro 5, Tailwind 4, React islands, Framer Motion, `@astrojs/sitemap`, Vercel adapter, TypeScript strict, `src/config/` data pattern) is NOT re-researched here.

**Bottom line: zero new packages required.**

---

## What Already Exists (No Changes Needed)

| Capability | How It Works in Codebase | Status |
|------------|--------------------------|--------|
| Dynamic routes with `getStaticPaths()` | `src/pages/prosjekter/[slug].astro` — config array → `params + props` | Production-proven |
| Config-driven data model | `src/config/projects.ts` — typed interface + exported array | Exact pattern to replicate |
| Sitemap auto-inclusion of dynamic routes | `@astrojs/sitemap` crawls all prerendered routes in static mode | Confirmed in Astro docs |
| LocalBusiness JSON-LD | BaseLayout already emits `LocalBusiness` with `areaServed` array | Extend per-page, do not replace |
| Per-page JSON-LD injection | `<slot name="head" />` in BaseLayout — used by `blogg/[slug].astro` | Established pattern |
| Canonical URL | `new URL(Astro.url.pathname, Astro.site)` computed automatically in BaseLayout | Automatic |
| BreadcrumbList | Auto-generated from `pageLabels` map in BaseLayout | Needs city label entries |
| Per-page `<title>` and `<meta description>` | BaseLayout `title` and `description` props | Standard |

---

## New Capabilities Required

### 1. `src/config/locations.ts` — Location Data Model

**Pattern:** Mirror `src/config/projects.ts` exactly. Export typed `Location` interface and a `locations` array. `getStaticPaths()` in `[location].astro` imports and maps the array.

**V1/V2/V3-ready interface design:**

```typescript
export interface Location {
  // Routing
  slug: string;                    // URL segment: 'oslo' → /oslo
  city: string;                    // Display name: 'Oslo'
  region: string;                  // 'Oslo' | 'Viken' | 'Akershus' — for schema/copy

  // SEO metadata (unique per page — required for all tiers)
  metaTitle: string;               // <60 chars, e.g. "Nettside for bedrifter i Oslo | Nettup"
  metaDescription: string;         // <160 chars, localized pitch

  // Page copy (hand-written V1, AI-assisted V2+)
  intro: string;                   // 2–3 sentences, genuinely unique per city
  whyCity?: string;                // Optional: why Nettup suits THIS city specifically
  nearbyAreas?: string[];          // Internal linking: ['Asker', 'Bærum', 'Lillestrøm']
  regionalIndustries?: string[];   // Localized social proof hooks: ['restaurant', 'rørlegger']

  // FAQ (optional — V1 can omit, V2+ expands)
  faq?: { question: string; answer: string }[];

  // Schema.org
  schemaCity: string;              // Canonical name for areaServed City.name
  schemaWikipediaId: string;       // Wikipedia URL for @id — see table below

  // Expansion control
  tier: 1 | 2 | 3;                // 1=hand-crafted, 2=AI-assisted, 3=stub
}
```

**Why this shape:**
- `slug` separate from `city` lets the URL be `/oslo` while city name is `'Oslo'` — no runtime mapping
- `schemaWikipediaId` enables proper `@id` on schema.org City objects; field name is explicit so whoever writes V2 entries knows what to put
- `tier` makes V2/V3 expansion a data change only — no structural or template change
- All optional fields (`faq`, `whyCity`, `nearbyAreas`, `regionalIndustries`) mean V1 entries stay minimal; V3 stubs need only required fields
- TypeScript strict mode ensures all V1 required fields are present at build time

**Confidence:** HIGH — directly mirrors the `projects.ts` pattern validated in production

---

### 2. Dynamic Route — `src/pages/[location].astro`

**Pattern:** Identical to `src/pages/prosjekter/[slug].astro`.

```typescript
export function getStaticPaths() {
  return locations.map((loc) => ({
    params: { location: loc.slug },
    props: { location: loc },
  }));
}

interface Props {
  location: Location;
}

const { location } = Astro.props;
```

**Key decisions:**
- Pass full `Location` object via `props`, not just `params` — avoids re-importing config inside the component body; consistent with `[slug].astro` pattern
- `params.location` is a string (slug is `string`) — Astro requires params to be strings
- No `async` on `getStaticPaths()` — data is a local TS array with no I/O, fastest possible

**Build-time behaviour:** Astro executes `getStaticPaths()` once at build start, then renders each returned path in parallel. For 300 cities, the function call itself is synchronous and near-instant; rendering 300 static pages takes roughly 2–3 seconds at Astro's ~127 pages/sec throughput.

**Confidence:** HIGH — production-proven pattern, verified against Astro routing reference docs

---

### 3. LocalBusiness JSON-LD with `areaServed` per Page

**Approach:** The BaseLayout already emits a global `LocalBusiness` with broad `areaServed` (Oslo, Oslo-området, Norway). For city pages, inject an additional page-scoped `LocalBusiness` block via `<slot name="head" />`. Do NOT modify BaseLayout's global schema — the global one remains correct for all non-city pages.

**Correct `areaServed` format — schema.org `City` type with Wikipedia `@id`:**

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://nettup.no/#business",
  "name": "Nettup",
  "url": "https://nettup.no",
  "areaServed": {
    "@type": "City",
    "name": "Oslo",
    "@id": "https://en.wikipedia.org/wiki/Oslo"
  }
}
```

**Wikipedia `@id` values for V1 cities:**

| City | `schemaWikipediaId` value |
|------|--------------------------|
| Oslo | `https://en.wikipedia.org/wiki/Oslo` |
| Drammen | `https://en.wikipedia.org/wiki/Drammen` |
| Asker | `https://en.wikipedia.org/wiki/Asker` |
| Bærum | `https://en.wikipedia.org/wiki/B%C3%A6rum` |
| Lillestrøm | `https://en.wikipedia.org/wiki/Lillstr%C3%B8m` |
| Sandvika | `https://en.wikipedia.org/wiki/Sandvika` |
| Ski | `https://en.wikipedia.org/wiki/Ski,_Norway` |
| Moss | `https://en.wikipedia.org/wiki/Moss,_Norway` |

**Why Wikipedia `@id`:** Schema.org recommends using a URL as the `@id` for named place entities. Wikipedia is the most widely recognized knowledge base reference for Norwegian city names. The `@id` helps Google connect the schema City entity to its Knowledge Graph entry for that municipality.

**Simpler valid alternative:** Omit `@id` and use `{ "@type": "City", "name": "Oslo" }` — this is what BaseLayout already uses for the global schema and it validates. Add `@id` on city pages for the Knowledge Graph alignment benefit.

**Confidence:** MEDIUM — `@type: City` with Wikipedia `@id` confirmed from schema.org spec and RankMath documentation. Google's exact handling of Norwegian city entities not independently verified; pattern is consistent with documented best practices.

---

### 4. Sitemap — No Code Changes Required

The existing `@astrojs/sitemap` in `astro.config.mjs` automatically discovers and includes all pages generated by `getStaticPaths()` when `output: 'static'` is set. City pages at `/oslo`, `/drammen` etc. will appear in the sitemap after the route file is added — no config changes needed.

**Optional: extend `serialize` to set priority for city pages.** The existing callback already handles blog pages. Adding city pages follows the same pattern:

```javascript
sitemap({
  serialize(item) {
    if (item.url.startsWith('https://nettup.no/blogg/')) {
      return { ...item, changefreq: 'monthly', priority: 0.7 };
    }
    // City landing pages
    if (/^https:\/\/nettup\.no\/[a-z-]+\/$/.test(item.url) &&
        !['tjenester', 'om-oss', 'prosjekter', 'kontakt', 'blogg', 'priskalkulator', 'personvern'].includes(
          item.url.replace('https://nettup.no/', '').replace('/', '')
        )) {
      return { ...item, changefreq: 'monthly', priority: 0.8 };
    }
    return item;
  },
}),
```

Note: Google ignores `priority` and `changefreq`. The serialization is for other crawlers and is optional for V1.

**Confidence:** HIGH — verified against Astro sitemap integration official docs. Static mode is already configured.

---

### 5. BaseLayout `pageLabels` Map — Minor Update

The `pageLabels` map in `BaseLayout.astro` drives auto-breadcrumb generation. City pages will fall through to the raw slug (e.g. `'oslo'`) if not present in the map, which produces an acceptable breadcrumb.

For better breadcrumb display names (`"Nettside i Oslo"` instead of `"oslo"`), add entries. For V1 (8 cities) this is acceptable as manual entries. For V3 (300+), generate the map programmatically from the `locations` array — BaseLayout's frontmatter can import from `locations.ts` directly.

```typescript
// In BaseLayout.astro — V3-safe approach:
import { locations } from '@/config/locations';
const cityPageLabels = Object.fromEntries(
  locations.map((loc) => [`/${loc.slug}`, `Nettside i ${loc.city}`])
);
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  // ... existing entries
  ...cityPageLabels,
};
```

This change is purely additive — no risk to existing breadcrumbs.

---

## No New Dependencies

| Considered | Decision | Reason |
|------------|----------|--------|
| External CMS (Contentful, Sanity) for city data | Rejected | `src/config/locations.ts` matches existing patterns, TypeScript type safety, zero new deps, data doesn't change frequently enough to need a CMS |
| `astro-seo` package | Rejected | BaseLayout already handles all meta tags; adding a package creates duplication |
| Separate sitemap plugin | Rejected | Existing `@astrojs/sitemap` handles dynamic routes natively in static mode |
| Separate `LocalBusiness` schema Astro component | Deferred | Inline in `[location].astro` for V1; extract to a component only if schema diverges across multiple templates |
| Zod validation for `locations.ts` | Rejected for V1 | TypeScript strict mode catches required field omissions at build time; Zod adds runtime overhead for a static config |

---

## Scalability: V1 to V3 with Zero Structural Changes

| Stage | Cities | Data Approach | Build Impact |
|-------|--------|---------------|--------------|
| V1 | 6–8 | Hand-written entries, `tier: 1` | ~1s additional |
| V2 | 30–50 | AI-assisted copy appended to same array, `tier: 2` | ~1–2s additional |
| V3 | 300+ | Script-generated stubs, `tier: 3`, `intro` as minimal placeholder | ~2–3s additional |

**Key insight:** `getStaticPaths()` returns the array synchronously from a local TypeScript module — no filesystem I/O, no network. At 300 entries Astro renders ~300 static HTML files in 2–3 seconds. The build will still complete in well under 30 seconds total.

If V3 introduces performance concerns (unlikely with Astro SSG), the mitigation is to filter by `tier` in `getStaticPaths()` and deploy Tier 3 stubs as a separate build — not an architectural change needed now.

---

## Integration Points with Existing Stack

| Existing File | Change for v1.5 | Impact |
|---------------|-----------------|--------|
| `src/config/locations.ts` | New file | None on existing pages |
| `src/pages/[location].astro` | New file | None on existing routes |
| `astro.config.mjs` | Optional `serialize` extension | Non-breaking additive |
| `src/layouts/BaseLayout.astro` | Optional `pageLabels` extension | Non-breaking additive |
| `src/components/layout/Footer.astro` | Add city links section | Additive — no current functionality changes |
| `src/pages/kontakt/index.astro` | Add coverage area mention | Content change only |

---

## Installation

```bash
# No new packages required.
# All capabilities exist in the current stack.
```

---

## Sources

- [Astro Routing Reference](https://docs.astro.build/en/reference/routing-reference/) — `getStaticPaths()` return format, `props` alongside `params` (HIGH confidence — official docs)
- [Astro Sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — auto-inclusion of dynamic routes, `serialize` callback, static mode requirement (HIGH confidence — official docs)
- [RankMath: Multiple areaServed Cities](https://rankmath.com/kb/add-multiple-areaserved-cities-to-localbusiness-schema/) — `@type: City` with Wikipedia `@id` format (MEDIUM confidence — SEO tool documentation)
- [schema.org/LocalBusiness](https://schema.org/LocalBusiness) — `areaServed` property spec (HIGH confidence — authoritative)
- [Astro build performance](https://www.bitdoze.com/astro-ssg-build-optimization/) — ~127 pages/sec throughput reference (MEDIUM confidence — single source)
- Codebase `src/pages/prosjekter/[slug].astro` + `src/config/projects.ts` — config-driven `getStaticPaths()` pattern validated in production (HIGH confidence — direct code read)
- Codebase `src/pages/blogg/[slug].astro` — per-page JSON-LD via `<slot name="head" />` confirmed working (HIGH confidence — direct code read)
- Codebase `src/layouts/BaseLayout.astro` — existing `LocalBusiness` schema, `pageLabels` map, `<slot name="head" />` (HIGH confidence — direct code read)
- Codebase `astro.config.mjs` — existing `serialize` callback, `output: 'static'` confirmed (HIGH confidence — direct code read)

---

*Stack research for: Nettup v1.5 Local SEO landing pages*
*Researched: 2026-03-08*
