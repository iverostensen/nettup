# Phase 24: Infrastruktur - Research

**Researched:** 2026-03-08
**Domain:** Astro static-path generation, TypeScript config files, local SEO URL infrastructure
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sideoppsett**
- Seksjoner: Breadcrumbs → Hero (H1 + intro-avsnitt) → FAQ → Nabobyer/intern lenking → CTA
- Breadcrumbs-komponent øverst (`Hjem → Steder → [By]`) — konsistent med prosjektsider, gir BreadcrumbList JSON-LD
- Hero: by-navn som H1 (`Nettside for bedrift i [By]`), fulgt av intro-avsnitt fra `locations.ts`
- FAQ-seksjon med by-spesifikke spørsmål fra `locations.ts`
- Nabobyer-seksjon med intern lenking til andre bysider — støtter lokal SEO og reduserer bounce
- CTA-seksjon, trolig gjenbruk av eksisterende CTA-komponent

**Datamodell**
- `industries` er valgfri (`industries?: string[]`) — varierer per by
- Alle andre felter er påkrevd: `tier`, `slug`, `name`, `intro`, `faq`, `nearbyAreas`, `metaTitle`, `metaDescription`
- `faq` typet som `Array<{ question: string; answer: string }>`
- `tier` typet som `1 | 2 | 3` (tall) for enkel range-filtrering
- Hold interfacet minimalt i V1 — ingen V2/V3-felter nå (YAGNI)
- `ACTIVE_TIER = 1` som eksportert konstant øverst i `locations.ts` — enkel å endre til 2 ved V2-start

**Slug-konvensjon**
- Norske spesialtegn: `æ→ae`, `ø→o`, `å→a` (standard norsk romanisering)
- Mellomrom i bynavn: bindestrek (`-`)
- Eksempler: `Bærum→baerum`, `Lillestrøm→lillestrom`, `Ås→as`
- URL-mønster: `/steder/[slug]` — eks. `nettup.no/steder/oslo`, `nettup.no/steder/baerum`
- Konvensjonen dokumenteres som kommentar direkte i `locations.ts`

**Stub-byer (Phase 24 verifikasjon)**
- To stub-entries: **Oslo** (enkel slug) + **Bærum** (tester `æ→ae`-konvertering)
- Stub-innhold: kortfattet men realistisk placeholder-tekst, viser visuell template-design
- Ikke minimalstubs (`faq: []`) — trenger visuell feedback i Phase 24

### Claude's Discretion
- Nøyaktig komponentstruktur i `[location].astro` (seksjonsinndeling internt)
- Gjenbruk av eksisterende `Section`, `SectionHeader`, `Card`-komponenter der det passer
- Visuell design på nabobyer-seksjonen (tags, liste eller kort?)
- Nøyaktig placeholder-tekst for Oslo og Bærum stub-entries

### Deferred Ideas (OUT OF SCOPE)
- Ingen scope creep dukket opp i diskusjonen — Phase 24 er avgrenset til infrastruktur og stub-entries
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | URL slug pattern decided and documented before any page is built | Slug convention `æ→ae`, `ø→o`, `å→a` documented as comment in `locations.ts`; Bærum stub exercises `æ→ae` path |
| INFRA-02 | `locations.ts` exposes TypeScript interface with `tier`, city data, `intro`, `faq`, `nearbyAreas`, `industries` — designed to scale V1→V3 without structural changes | Minimal interface with optional `industries?` and mandatory fields; `ACTIVE_TIER` constant drives tier-gating in `getStaticPaths()` |
| INFRA-03 | Dynamic `[location].astro` route generates one static page per `locations.ts` entry via `getStaticPaths()` | Direct pattern match from `prosjekter/[slug].astro` — identical import/map/return shape |
| INFRA-04 | Every city page has a canonical self-referencing URL tag and no conflicting `noindex` | `BaseLayout` already computes `canonicalURL = new URL(Astro.url.pathname, Astro.site)` — no extra work needed; pass `title` and `description` props only |
</phase_requirements>

## Summary

Phase 24 establishes the TypeScript infrastructure and Astro routing skeleton for local SEO city pages. The project already has an identical pattern — `src/config/projects.ts` → `src/pages/prosjekter/[slug].astro` — that this phase mirrors exactly. The new `locations.ts` config file and `steder/[location].astro` dynamic route follow the same config-driven static generation approach used throughout the codebase.

The canonical URL requirement (INFRA-04) is already satisfied by `BaseLayout.astro`, which computes `canonicalURL` from `Astro.url.pathname` automatically. No custom canonical logic is needed. The `LocalBusiness` JSON-LD entity is already declared in `BaseLayout` with `@id: "https://nettup.no/#business"` — city pages should emit a `Service` JSON-LD referencing that `@id` (not a new `LocalBusiness`), but this JSON-LD work is scoped to Phase 25.

The only new infrastructure in Phase 24 is `locations.ts` (interface + constant + two stub entries) and `steder/[location].astro` (route skeleton with full section layout). The build must pass with these two stub entries.

**Primary recommendation:** Mirror `projects.ts` → `[slug].astro` exactly. Use existing `Section`, `SectionHeader`, `Card`, `Breadcrumbs`, and `Button` components. Inject nothing into `<slot name="head">` in Phase 24 — JSON-LD is Phase 25 work.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro static routing | 5.x (project) | `getStaticPaths()` generates one page per city entry | Already in use; zero added dependencies |
| TypeScript | strict (project) | `City` interface enforces required fields at build time | Catches missing fields before deploy |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `Section.astro` | project | Consistent vertical spacing + optional background | Every major content section |
| `SectionHeader.astro` | project | Consistent heading hierarchy | FAQ and Nabobyer headings |
| `Card.astro` | project | Styled container with padding prop | Nabobyer tags or FAQ items if card treatment chosen |
| `Breadcrumbs.astro` | project | Navigation + `aria-label` + `aria-current` | Top of every city page |
| `Button.astro` | project | CTA button with variant prop | CTA section |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Reusing `Breadcrumbs.astro` | Inline breadcrumb HTML | Never — component already exists and handles accessibility correctly |
| `Section` component | Raw `<div>` with manual padding | Don't — breaks visual consistency with rest of site |

**Installation:** No new dependencies. Everything is already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── config/
│   └── locations.ts          → City interface, ACTIVE_TIER, cities[] array
└── pages/
    └── steder/
        └── [location].astro  → Dynamic route, getStaticPaths(), full page layout
```

### Pattern 1: Config-Driven Static Path Generation

**What:** Export typed data array from config, map to `getStaticPaths()` return in the dynamic route.

**When to use:** Every collection of pages where content is defined in TypeScript (projects, services, cities).

**Example (from `src/pages/prosjekter/[slug].astro` — confirmed in codebase):**
```typescript
// Source: src/pages/prosjekter/[slug].astro (lines 11-16)
export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}
```

City equivalent:
```typescript
// src/pages/steder/[location].astro
import { cities, ACTIVE_TIER, type City } from '@/config/locations';

export function getStaticPaths() {
  return cities
    .filter((city) => city.tier <= ACTIVE_TIER)
    .map((city) => ({
      params: { location: city.slug },
      props: { city },
    }));
}

interface Props {
  city: City;
}

const { city } = Astro.props;
```

### Pattern 2: Typed Config File with Exported Constant

**What:** Export interface, array, and a controlling constant from a single config file.

**When to use:** When a collection needs a runtime-switchable filter (tier promotion from 1→2→3).

**Example for `src/config/locations.ts`:**
```typescript
// Slug convention:
//   æ → ae  |  ø → o  |  å → a  |  space → hyphen
// Examples: Bærum → baerum, Lillestrøm → lillestrom, Ås → as

export const ACTIVE_TIER = 1;

export interface City {
  tier: 1 | 2 | 3;
  slug: string;          // ASCII-only, see convention above
  name: string;          // Display name with Norwegian characters
  intro: string;         // Opening paragraph for Hero section
  faq: Array<{ question: string; answer: string }>;
  nearbyAreas: string[]; // Slugs or names — used for internal linking
  metaTitle: string;
  metaDescription: string;
  industries?: string[]; // Optional — omit for cities without industry focus
}

export const cities: City[] = [
  {
    tier: 1,
    slug: 'oslo',
    name: 'Oslo',
    intro: '...',
    faq: [{ question: '...', answer: '...' }],
    nearbyAreas: ['baerum', 'asker'],
    metaTitle: 'Nettside for bedrift i Oslo | Nettup',
    metaDescription: '...',
  },
  {
    tier: 1,
    slug: 'baerum',
    name: 'Bærum',
    intro: '...',
    faq: [{ question: '...', answer: '...' }],
    nearbyAreas: ['oslo', 'asker'],
    metaTitle: 'Nettside for bedrift i Bærum | Nettup',
    metaDescription: '...',
  },
];
```

### Pattern 3: BaseLayout Canonical (already works)

**What:** `BaseLayout.astro` computes `canonicalURL = new URL(Astro.url.pathname, Astro.site)` on every page automatically.

**When to use:** Always — no additional canonical tag logic needed in city pages.

**Confirmed behavior (src/layouts/BaseLayout.astro line 22):**
```typescript
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// Renders: <link rel="canonical" href={canonicalURL} />
```

City pages get their canonical for free by using `<BaseLayout title={city.metaTitle} description={city.metaDescription}>`.

### Pattern 4: Breadcrumb Items for City Pages

**What:** Pass `items` array to the existing `Breadcrumbs.astro` component. Last item has no `href` (current page).

**Confirmed interface (src/components/ui/Breadcrumbs.astro):**
```typescript
<Breadcrumbs
  items={[
    { label: 'Hjem', href: '/' },
    { label: 'Steder', href: '/steder' },
    { label: city.name },  // No href — current page
  ]}
/>
```

Note: `/steder` index page is out of scope for V1. The breadcrumb link to `/steder` will 404 until Phase 26 or later. Acceptable for Phase 24 — index page is deferred.

### Pattern 5: Service JSON-LD via `<slot name="head">`

**What:** Inject page-specific structured data into `<head>` without touching `BaseLayout`.

**Confirmed pattern (src/pages/tjenester/nettside/index.astro lines 42-44):**
```typescript
<Fragment slot="head">
  <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
</Fragment>
```

For city pages, the Service JSON-LD referencing `"provider": {"@id": "https://nettup.no/#business"}` goes here. **This is Phase 25 work** — Phase 24 does NOT add JSON-LD in `<slot name="head">`.

### Page Section Layout

Confirmed section order (from CONTEXT.md locked decisions):

```
1. Breadcrumbs      → <div class="container pt-8"> (matches prosjekter pattern)
2. Hero             → <Section> — H1 + intro paragraph from city.intro
3. FAQ              → <Section background="raised"> — map city.faq array
4. Nabobyer         → <Section> — internal links to nearby cities
5. CTA              → <Section> — reuse existing CTA pattern (contact link)
```

### Anti-Patterns to Avoid
- **Empty FAQ array in stubs:** Stubs must have at least 1-2 FAQ entries for visual template feedback in Phase 24.
- **Duplicate `LocalBusiness` schema:** Never add a new `LocalBusiness` block on city pages — one exists in `BaseLayout`. City JSON-LD uses `Service` type (Phase 25 concern).
- **noindex meta on city pages:** Do not add `<meta name="robots" content="noindex">` anywhere on these pages. `BaseLayout` adds none by default.
- **Hardcoded `/steder` breadcrumb with `href`:** The `/steder` index doesn't exist yet. Either omit `href` on the middle breadcrumb, or accept the 404 as a known V1 gap. Recommended: keep `href="/steder"` anyway — it will be built in a later phase.
- **`getStaticPaths()` without tier filter:** Always filter `city.tier <= ACTIVE_TIER` so that raising `ACTIVE_TIER` to 2 automatically publishes tier-2 cities.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Canonical URL generation | Custom URL concatenation logic | `BaseLayout`'s built-in `new URL(Astro.url.pathname, Astro.site)` | Already correct and consistent across all pages |
| Breadcrumb rendering | Custom `<nav>` HTML | `Breadcrumbs.astro` component | Handles `aria-label`, `aria-current`, separator rendering |
| Section spacing/background | Custom wrapper divs | `Section.astro` with `background` prop | Maintains visual consistency |
| Tier filtering logic | Complex filter expressions | Single `city.tier <= ACTIVE_TIER` filter in `getStaticPaths()` | One-line promotion when V2 starts |
| Slug sanitization at runtime | String replace functions | Document convention, apply at data-entry time | Slugs are static data — sanitize when writing `locations.ts`, not at runtime |

**Key insight:** This phase is infrastructure assembly, not feature invention. Every building block already exists; the task is wiring them together in the established pattern.

## Common Pitfalls

### Pitfall 1: `Astro.site` undefined at build time
**What goes wrong:** Canonical URL renders as `undefined/steder/oslo` in HTML.
**Why it happens:** `Astro.site` is only set when `site` is configured in `astro.config.mjs`. If omitted, `new URL(Astro.url.pathname, Astro.site)` throws or produces garbage.
**How to avoid:** Verify `site: 'https://nettup.no'` exists in `astro.config.mjs` before running build. (It likely already exists given other pages work.)
**Warning signs:** Build warnings about `Astro.site` being undefined; canonical tag contains `undefined`.

### Pitfall 2: Missing TypeScript strict-mode fields
**What goes wrong:** Build passes locally but TypeScript strict mode catches missing required fields in `cities` array.
**Why it happens:** Optional fields (`industries?`) must be explicitly marked; all other fields are required by the interface.
**How to avoid:** Define the `City` interface before writing any city data. TypeScript will surface missing fields immediately.
**Warning signs:** `TS2741: Property 'X' is missing in type` errors during build.

### Pitfall 3: `nearbyAreas` linking to non-existent slugs
**What goes wrong:** Nabobyer links point to `/steder/asker` which doesn't exist in Phase 24.
**Why it happens:** Stub entries reference real future cities.
**How to avoid:** For Phase 24, either (a) only reference slugs that exist in `cities[]`, or (b) accept the 404s as known gaps and document them. Given only Oslo and Bærum exist, their `nearbyAreas` should reference each other (`['baerum']` for Oslo, `['oslo']` for Bærum).
**Warning signs:** Dead links in nabobyer section visible in browser.

### Pitfall 4: `@astrojs/sitemap` hybrid mode regression
**What goes wrong:** Sitemap doesn't include `/steder/*` routes after first deploy.
**Why it happens:** Known issue #7015 in hybrid rendering mode (documented in STATE.md).
**How to avoid:** Verify sitemap output includes city routes after build. This is a Phase 26 verification task, not Phase 24 — but be aware it's a known risk.
**Warning signs:** `/sitemap-index.xml` exists but city URLs absent from it.

### Pitfall 5: Breadcrumb middle item with dead `href`
**What goes wrong:** "Steder" breadcrumb link leads to 404.
**Why it happens:** `/steder` index page is out of scope until V2/V3.
**How to avoid:** Keep `href="/steder"` in the breadcrumb — the link will resolve once the index page is built. For Phase 24, the 404 is acceptable since the stub pages are not yet public.
**Warning signs:** None during build — only visible when browsing the page.

## Code Examples

Verified patterns from project source:

### `getStaticPaths()` — confirmed pattern from `prosjekter/[slug].astro`
```typescript
// Source: src/pages/prosjekter/[slug].astro lines 11-16
export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}
```

### `BaseLayout` with `title` and `description` props
```astro
<!-- Source: src/layouts/BaseLayout.astro — interface Props lines 14-16 -->
<BaseLayout title={city.metaTitle} description={city.metaDescription}>
  <main>
    <!-- sections -->
  </main>
</BaseLayout>
```

### Breadcrumbs usage — confirmed component interface
```astro
<!-- Source: src/components/ui/Breadcrumbs.astro -->
<Breadcrumbs
  items={[
    { label: 'Hjem', href: '/' },
    { label: 'Steder', href: '/steder' },
    { label: city.name },
  ]}
/>
```

### Section with background variant
```astro
<!-- Source: src/pages/prosjekter/[slug].astro lines 79, 99, etc. -->
<Section>               <!-- default background -->
<Section background="raised">   <!-- bg-surface-raised -->
```

### reveal-on-scroll pattern
```astro
<!-- Source: src/pages/prosjekter/[slug].astro — consistent class pattern -->
<h1 class="reveal-on-scroll reveal-stagger-1 text-4xl font-bold md:text-5xl">
  Nettside for bedrift i {city.name}
</h1>
<p class="reveal-on-scroll reveal-stagger-2 mt-4 text-text-muted">
  {city.intro}
</p>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual HTML sitemap | `@astrojs/sitemap` auto-generation | v1.0 | New routes appear automatically — no manual sitemap edit needed |
| Page-specific canonical logic | `BaseLayout` computes canonical from `Astro.url.pathname` | Established in project | Zero canonical work in city pages |
| Separate JSON-LD per `LocalBusiness` | Single `LocalBusiness` in `BaseLayout`, `Service` on sub-pages references `@id` | v1.5 research decision | Prevents Knowledge Graph entity dilution |

**Deprecated/outdated:**
- Hardcoded `pageLabels` map in `BaseLayout` for breadcrumb JSON-LD: city pages (`/steder/*`) are NOT in the `pageLabels` map. The BreadcrumbList JSON-LD emitted by `BaseLayout` will fall back to the raw segment name (`steder`, `oslo`). This is acceptable for Phase 24 — the user-facing `Breadcrumbs.astro` component correctly uses `city.name`. Phase 25 can update `pageLabels` if needed.

## Open Questions

1. **`/steder` index page breadcrumb href**
   - What we know: The index page is out of scope for V1 (REQUIREMENTS.md Out of Scope section).
   - What's unclear: Whether to include `href="/steder"` knowing it 404s, or omit the href on the middle breadcrumb.
   - Recommendation: Include `href="/steder"` — it's the semantically correct breadcrumb and will resolve when the index is built. The 404 is invisible during Phase 24 (stub pages are not public).

2. **`pageLabels` map in `BaseLayout` for JSON-LD BreadcrumbList**
   - What we know: `BaseLayout` has a hardcoded `pageLabels` map used to generate BreadcrumbList JSON-LD. `/steder/oslo` is not in that map — the JSON-LD breadcrumb will show `oslo` as the city name instead of `Oslo`.
   - What's unclear: Whether this matters for Phase 24 (it's a Phase 25 SEO concern).
   - Recommendation: Accept as Phase 25 work. Phase 24 is infrastructure only.

## Sources

### Primary (HIGH confidence)
- `src/pages/prosjekter/[slug].astro` — confirmed `getStaticPaths()` pattern, Breadcrumbs usage, Section/SectionHeader/Card patterns
- `src/layouts/BaseLayout.astro` — confirmed canonical URL computation, `<slot name="head">` injection point, existing `LocalBusiness` JSON-LD with `@id`
- `src/config/projects.ts` — confirmed TypeScript interface pattern (required vs optional fields, `metaTitle`/`metaDescription` naming)
- `src/components/ui/Breadcrumbs.astro` — confirmed component interface (`items`, optional `href`)
- `src/pages/tjenester/nettside/index.astro` — confirmed `Service` JSON-LD pattern via `<Fragment slot="head">`
- `.planning/phases/24-infrastruktur/24-CONTEXT.md` — locked decisions for interface shape, section order, slug convention
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-04 scope
- `.planning/STATE.md` — sitemap regression warning (issue #7015)

### Secondary (MEDIUM confidence)
- `.planning/config.json` — confirmed `nyquist_validation` is not configured; Validation Architecture section skipped

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; all libraries are already in the project
- Architecture: HIGH — direct pattern match from existing `prosjekter/[slug].astro` implementation
- Pitfalls: HIGH for TypeScript/canonical (verified in source); MEDIUM for sitemap regression (documented in STATE.md, unverified in current build)

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (stable Astro static routing patterns)
