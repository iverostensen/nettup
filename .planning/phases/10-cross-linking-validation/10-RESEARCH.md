# Phase 10: Cross-linking & Validation - Research

**Researched:** 2026-03-05
**Domain:** Astro component authoring, JSON-LD schema, @astrojs/sitemap
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Cross-link placement:** Dedicated "Relaterte tjenester" section placed between FAQ and CTA on each service page
- **Related services curation:** Manual curation — add `related: string[]` (slugs) to each service object in `services.ts`
  - nettside → [seo, vedlikehold]
  - nettbutikk → [nettside, vedlikehold]
  - webapp → [ai, nettside]
  - ai → [webapp, seo]
  - seo → [nettside, landingsside]
  - landingsside → [seo, nettside]
  - vedlikehold → [nettside, nettbutikk]
- **Cross-link visual design:** Small cards showing service name + tagline + price range; reuse existing `Card` component; 2–3 cards in a horizontal row, responsive (stack on mobile)
- **Schema validation:** Manual validation using Google Rich Results Test — no automated script; schemas already exist on all 7 pages, just validate

### Claude's Discretion

- Exact card styling within the Card component's existing variants
- Whether "Relaterte tjenester" section gets its own Astro component or is inlined
- Ordering of related service cards (match roadmap order or editorial choice)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Hver underside har `@type: Service` JSON-LD med `PriceSpecification` | Service schema is already authored in all 7 `index.astro` files using the exact pattern below. Validation confirms correctness, no code changes expected. |
| SEO-03 | FAQPage JSON-LD-schema på hver underside | FAQPage schema is already authored in all 7 `FAQ.astro` files using the `is:inline` script pattern. Validation confirms correctness, no code changes expected. |
</phase_requirements>

---

## Summary

Phase 10 is primarily a **wiring + verification** phase. The heavy lifting (building 7 service pages with Service and FAQPage JSON-LD schemas) was done in Phases 8 and 9. This phase adds one new feature (cross-links between service pages via a "Relaterte tjenester" section) and then manually validates the existing JSON-LD schemas pass Google Rich Results Test with no errors.

The cross-link feature requires: (1) extending the `Service` interface in `services.ts` with a `related: string[]` field, (2) populating the 7 pairings, (3) creating a `RelatertaineTjenester` component (or inline section) that reads the related slugs from `services.ts` and renders `Card` components, and (4) inserting that section into all 7 `index.astro` files between `<FAQ />` and `<CTA />`.

Sitemap validation is already satisfied: `@astrojs/sitemap` is configured with `site: 'https://nettup.no'` and `output: 'static'`, which automatically includes all static routes. No code changes needed — just build and confirm the generated sitemap lists all 7 sub-pages.

**Primary recommendation:** Add `related: string[]` to `services.ts`, build one shared `RelatertaineTjenester.astro` component, insert it into all 7 `index.astro` files, run the build, then validate schemas manually via Google Rich Results Test.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (already installed) | Static page rendering, component authoring | Project framework |
| @astrojs/sitemap | current (already installed) | Auto-generates sitemap.xml for all static routes | Already configured |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Card.astro | project UI | Renders the cross-link cards | Already used for TjenesterOversikt cards — same component, same pattern |
| Section.astro | project UI | Section wrapper with padding / background variants | All existing sections use this |
| SectionHeader.astro | project UI | H2 heading + optional subtitle | All existing sections use this |
| services.ts | project config | Single source of truth for all service data | Will be extended with `related` field |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shared RelatertaineTjenester.astro | Inline JSX in each index.astro | Inline means 7× duplicated markup; shared component is clearly better |
| Card.astro with `as="a"` + `hover` | LinkWithArrow.astro | Card gives richer visual (name + tagline + price); LinkWithArrow is text-only; decision is locked to Card |

**Installation:** None — no new dependencies needed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── config/
│   └── services.ts                  # Add `related: string[]` field + populate pairings
├── pages/tjenester/
│   ├── nettside/_sections/
│   │   └── RelatertaineTjenester.astro  # NEW — OR use shared component
│   ├── nettbutikk/_sections/           # Same pattern × 7
│   └── ...
└── components/sections/
    └── RelatertaineTjenester.astro     # ALTERNATIVE: one shared component imported by all 7
```

The decision between page-local `_sections/RelatertaineTjenester.astro` vs a shared `src/components/sections/RelatertaineTjenester.astro` is Claude's discretion. **Recommended: shared component** — the section has identical structure across all 7 pages (it just reads `related` from props). One file to maintain vs seven.

### Pattern 1: Extending services.ts with `related` field

```typescript
// src/config/services.ts
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  monthlyPrice?: number;
  monthlyPriceLabel?: string;
  related?: string[];  // ADD: slugs of related services
}

export const services: Service[] = [
  {
    slug: 'nettside',
    // ...existing fields...
    related: ['seo', 'vedlikehold'],
  },
  // ...etc
];
```

### Pattern 2: Shared RelatertaineTjenester.astro component

The component receives the current service's `related` slugs, looks up full service objects, and renders cards.

```astro
---
// src/components/sections/RelatertaineTjenester.astro
import { services } from '@/config/services';
import Card from '@/components/ui/Card.astro';
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';

interface Props {
  related: string[];
}

const { related } = Astro.props;
const relatedServices = related
  .map(slug => services.find(s => s.slug === slug))
  .filter(Boolean);
---

<Section>
  <SectionHeader title="Relaterte tjenester" centered={true} />
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {relatedServices.map((service) => (
      <Card as="a" href={`/tjenester/${service!.slug}`} hover padding="lg" class="flex flex-col">
        <h3 class="mb-1 font-semibold">{service!.name}</h3>
        <p class="mb-3 text-sm text-brand">{service!.tagline}</p>
        <p class="mt-auto text-sm font-semibold text-text">{service!.priceRange}</p>
      </Card>
    ))}
  </div>
</Section>
```

### Pattern 3: Inserting the section in index.astro

All 7 `index.astro` files follow this pattern after the change:

```astro
---
import RelatertaineTjenester from '@/components/sections/RelatertaineTjenester.astro';
// ...existing imports

const service = services.find(s => s.slug === 'nettside')!;
---

<main>
  <Hero />
  <Inkludert />
  <FAQ />
  <RelatertaineTjenester related={service.related ?? []} />
  <CTA />
</main>
```

Note: webapp has a `<Prosess />` section between Inkludert and FAQ — the new section still goes between FAQ and CTA, consistent with the decision.

### Pattern 4: Existing Service JSON-LD (already in place, no changes needed)

```astro
// In each index.astro — already authored
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Nettup ${service.name}`,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "Nettup",
    "url": "https://nettup.no"
  },
  "areaServed": { "@type": "Country", "name": "Norway" },
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": service.minPrice,
      ...(service.maxPrice > 0 ? { "maxPrice": service.maxPrice } : {}),
      "priceCurrency": "NOK"
    }
  }
};
// Rendered via: <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
```

### Pattern 5: Existing FAQPage JSON-LD (already in place, no changes needed)

```astro
// In each FAQ.astro — already authored
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
};
// Rendered via: <script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

Note the difference: Service schema uses `<script type="application/ld+json">` (in `<head>` via Fragment slot), while FAQPage schema uses `<script is:inline type="application/ld+json">` (inline in FAQ.astro body). Both are valid placements for JSON-LD — Google processes structured data from both `<head>` and `<body>`.

### Anti-Patterns to Avoid

- **Hardcoding related service data in the component:** The `related` slugs must come from `services.ts`, not be hardcoded in each section file — otherwise it becomes a maintenance problem.
- **Using `as="div"` on Card for navigation links:** The card links to other service pages, so `as="a"` with `href` is required for correct semantics and accessibility.
- **Nesting `<a>` inside `<a>`:** Card with `href` renders as `<a>`. Do not put a `<a>` child inside it (same pattern used in TjenesterOversikt with `<span>` for the "Les mer" label).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Related service cards | Custom card markup per-page | `Card.astro` with `hover` prop | Already used in TjenesterOversikt; consistent visual language; handles hover/transition/border variants |
| Section wrapper | Raw `<section>` with manual padding | `Section.astro` | Consistent spacing, bg variants, container centering |
| Sitemap generation | Manual sitemap.xml | `@astrojs/sitemap` (already configured) | Auto-discovers all static routes; zero maintenance |

**Key insight:** The project already has all the building blocks. This phase is assembly + validation, not new infrastructure.

---

## Common Pitfalls

### Pitfall 1: FAQPage schema rendered twice on the same page

**What goes wrong:** Some Astro patterns cause a component to be rendered in both `<head>` and `<body>`, resulting in duplicate `<script type="application/ld+json">` tags. Google's Rich Results Test flags duplicate schemas as an error.

**Why it happens:** FAQ.astro uses `is:inline` which renders in place (body). index.astro uses a `Fragment slot="head"` for the Service schema. These are separate slots — no duplication risk in the current pattern.

**How to avoid:** Keep the pattern as-is. FAQPage schema stays in FAQ.astro body via `is:inline`. Service schema stays in index.astro head via Fragment slot. Do not move FAQPage schema to the head slot.

**Warning signs:** Running the Rich Results Test shows two FAQPage schemas for a single URL.

### Pitfall 2: RelatertaineTjenester shown with 0 cards if `related` is undefined

**What goes wrong:** If a service object in `services.ts` is missing the `related` field (e.g., during incremental rollout), the component renders an empty section with a heading but no cards.

**Why it happens:** `related` is typed as optional (`related?: string[]`). The component code must handle `undefined`.

**How to avoid:** Pass `service.related ?? []` from index.astro (not `service.related` directly). Optionally hide the section entirely if the array is empty.

### Pitfall 3: Sitemap not including sub-pages after build

**What goes wrong:** The sitemap is only generated during `npm run build`, not `npm run dev`. Checking sitemap coverage requires running the production build first.

**Why it happens:** `@astrojs/sitemap` writes `sitemap-index.xml` and `sitemap-0.xml` to the `dist/` folder only at build time.

**How to avoid:** Run `npm run build`, then inspect `dist/sitemap-0.xml` to verify all 7 `/tjenester/[slug]` URLs are present before marking sitemap validation as complete.

### Pitfall 4: Google Rich Results Test cache

**What goes wrong:** Testing a live URL may return cached results if the page was recently deployed. Testing with "Fetch as Google" (URL inspect) vs pasting HTML directly shows different freshness.

**Why it happens:** Google has a crawl cache.

**How to avoid:** Use the "Test live URL" feature pointing to the dev server (via tunnel like ngrok) or the production URL after deploy, OR use the "Test code" / paste HTML approach directly in Google Rich Results Test to validate the raw output immediately.

---

## Code Examples

Verified patterns from inspection of existing codebase:

### Existing Service schema (verified, index.astro of all 7 pages)

```astro
<Fragment slot="head">
  <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
</Fragment>
```

### Existing FAQPage schema (verified, FAQ.astro of all 7 pages)

```astro
<!-- FAQPage schema for rich snippets -->
<script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

### Card component API (verified, Card.astro)

```astro
<Card
  as="a"
  href="/tjenester/seo"
  hover
  padding="lg"
  class="flex flex-col"
>
  <h3 class="mb-1 font-semibold">SEO</h3>
  <p class="mb-3 text-sm text-brand">Bli funnet av de som leter etter deg</p>
  <p class="mt-auto text-sm font-semibold text-text">fra 3 000 kr/mnd</p>
</Card>
```

Card with `href` prop automatically renders as `<a>` element. The `hover` prop enables the `hover:-translate-y-1 hover:shadow-xl` transition.

### Sitemap verification (after build)

```bash
npm run build
cat dist/sitemap-0.xml | grep tjenester
# Should list: /tjenester/nettside, /tjenester/nettbutikk, /tjenester/webapp,
#              /tjenester/seo, /tjenester/ai, /tjenester/landingsside, /tjenester/vedlikehold
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline `related` in each component | `related` field in `services.ts` single source of truth | This phase | Change in one place, all 7 pages update automatically |
| Manual sitemap.xml | @astrojs/sitemap auto-generation | Phase 8 setup | Zero maintenance; all static routes always included |

---

## Open Questions

1. **Should the "Relaterte tjenester" section be hidden when `related` is empty?**
   - What we know: `related` will be populated for all 7 services in this phase.
   - What's unclear: Future-proofing if a new service is added without `related`.
   - Recommendation: Add `{relatedServices.length > 0 && ...}` guard in the component for defensive rendering.

2. **Google Rich Results Test: live URL vs HTML paste**
   - What we know: Google Rich Results Test accepts both a URL and raw HTML.
   - What's unclear: Whether the test will work against `localhost:4321` (it typically doesn't).
   - Recommendation: Either deploy to a staging/preview URL first, or paste the rendered HTML directly into the "Code snippet" tab of the Rich Results Test.

---

## Sources

### Primary (HIGH confidence)

- Direct inspection of `/Users/iverostensen/nettup/src/pages/tjenester/*/index.astro` — Service JSON-LD pattern confirmed on all 7 pages
- Direct inspection of `/Users/iverostensen/nettup/src/pages/tjenester/*/_sections/FAQ.astro` — FAQPage JSON-LD pattern confirmed
- Direct inspection of `/Users/iverostensen/nettup/src/config/services.ts` — Service interface and all 7 service objects
- Direct inspection of `/Users/iverostensen/nettup/astro.config.mjs` — `@astrojs/sitemap` with `site: 'https://nettup.no'` confirmed
- Direct inspection of `/Users/iverostensen/nettup/src/components/ui/Card.astro` — Card API and hover behavior confirmed
- Direct inspection of `/Users/iverostensen/nettup/src/pages/tjenester/_sections/TjenesterOversikt.astro` — Card usage pattern for service links confirmed

### Secondary (MEDIUM confidence)

- Google Structured Data documentation (well-known): JSON-LD in both `<head>` and `<body>` is valid; Google processes both placements.
- @astrojs/sitemap documentation: all static routes auto-included when `output: 'static'` and `site` is set.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already present in project, verified by inspection
- Architecture: HIGH — cross-link pattern is a minor extension of existing TjenesterOversikt pattern
- Pitfalls: HIGH — based on direct codebase inspection confirming current schema placement patterns

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable project, no fast-moving dependencies)
