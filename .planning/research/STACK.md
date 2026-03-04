# Stack Research

**Domain:** Astro 5 static site — 7 dedicated service sub-pages
**Milestone:** v1.1 Tjenesteutvidelse
**Researched:** 2026-03-04
**Confidence:** HIGH (based on codebase analysis + Astro 5 training data)

> Scope is narrow: this milestone adds 7 pages and a restructured /tjenester overview to an existing, working Astro 5 site. The existing stack handles everything. No new dependencies are needed.

---

## Current Stack (Unchanged)

| Technology | Installed Version | Role |
|------------|------------------|------|
| Astro | ^5.0.0 | Static site framework, routing |
| React + @astrojs/react | ^19.2.3 / ^4.4.2 | Interactive islands |
| Tailwind CSS | ^4.0.0 | Styling |
| Framer Motion | ^12.23.26 | Animations |
| @astrojs/sitemap | ^3.6.0 | Auto-generates sitemap (picks up new pages automatically) |
| clsx + tailwind-merge | ^2.1.1 / ^3.4.0 | Class utilities |
| @vercel/analytics | ^1.6.1 | Analytics |

---

## Routing Decision: Individual Files vs [slug].astro

**Recommendation: Individual files (`/tjenester/nettside/index.astro`, etc.)**

### Why not `[slug].astro` with `getStaticPaths()`

Dynamic routing is designed for content where all pages share the same template — blog posts, product listings, etc. Service sub-pages for a web agency are NOT uniform content: each service has a distinct value proposition, distinct FAQ items, distinct process steps, distinct pricing narrative, and (eventually) distinct case studies. Forcing them into one template produces lowest-common-denominator pages that serve SEO poorly and read as generic.

Concrete problems with `[slug].astro`:

1. **All content lives in one config file.** A 7-service data object in `src/config/services.ts` becomes a maintenance liability. Each service would need fields for hero, process steps, FAQ, differentiators, pricing narrative, CTA copy — the object grows unwieldy and still can't express structural page differences.
2. **Layout variations are awkward.** Nettbutikk (Shopify) may want a "Shopify partner" trust badge section that Vedlikehold doesn't need. Webapp may need a tech stack section. AI may need a disclaimer section. Conditional rendering in a shared template is messier than separate section files.
3. **TypeScript type safety is harder.** Each service page can have its own typed props when structured as individual files.
4. **The sitemap already works.** `@astrojs/sitemap` crawls all `.astro` pages automatically — no `getStaticPaths()` configuration needed for individual files.

### When `[slug].astro` IS appropriate

If you later add a blog, changelog, or any content type where 10+ pages truly share the same structure. Not applicable here.

### File Structure to Use

```
src/pages/tjenester/
├── index.astro                 ← Redesigned tjenestekatalog (7 service cards)
├── nettside/
│   ├── index.astro
│   └── _sections/
│       ├── Hero.astro
│       ├── HvaSomInngaar.astro
│       ├── Prosess.astro
│       ├── Priser.astro
│       ├── FAQ.astro
│       └── CTA.astro
├── nettbutikk/
│   ├── index.astro
│   └── _sections/
│       └── [same section pattern]
├── webapp/
│   └── ...
├── seo/
│   └── ...
├── ai/
│   └── ...
├── landingsside/
│   └── ...
└── vedlikehold/
    └── ...
```

This mirrors the existing pattern already used in `/nettside-for-bedrift/`, `/prosjekter/`, and `/kontakt/`. Consistent with the codebase.

---

## Service JSON-LD Schema Structure

The existing `BaseLayout.astro` already renders `BreadcrumbList` automatically from `Astro.url.pathname`. The `pageLabels` map will need entries added for the sub-page labels — this is the only BaseLayout change needed for breadcrumbs.

### Service Schema Per Page

Each sub-page renders its own `Service` schema in the `<slot name="head">`. Pattern already established in the current `/tjenester/index.astro` (generates one Service schema per pricing package). V1.1 moves to one dedicated Service schema per page — more specific, better for rich results.

```typescript
// Schema structure for each service page
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Nettside for bedrift",          // Service name (Norwegian)
  "description": "Vi designer og bygger...", // 1-2 sentences, customer-outcome focused
  "url": "https://nettup.no/tjenester/nettside",
  "provider": {
    "@type": "Organization",
    "name": "Nettup",
    "url": "https://nettup.no"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Norway"
  },
  "serviceType": "Webdesign",              // Matches Google's service type taxonomy
  "offers": {
    "@type": "Offer",
    "price": "7000",                       // Low end of range (fra-pris)
    "priceCurrency": "NOK",
    "description": "Fra 7 000 kr. Prisen varierer med scope.",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Nettup"
    }
  }
};
```

**Key decisions in this schema:**

- Use `"price"` as the fra-pris (low end). Google interprets this as the minimum price. Pair with a `"description"` on the Offer that explains it's a range.
- `"serviceType"` should use plain-language strings matching your service category. Google does not enforce a controlled vocabulary here — use Norwegian terms or English where standard.
- Do NOT duplicate the Organization or LocalBusiness schema (already in BaseLayout for every page). The Service schema on sub-pages supplements the global schema, not replaces it.

### FAQPage Schema Per Service

Each service page will have service-specific FAQs. Reuse the same pattern already used in `/tjenester/_sections/FAQ.astro` — generate `FAQPage` JSON-LD inline in the `_sections/FAQ.astro` component for that service.

```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};
```

This pattern is already in the codebase. Copy it to each service's `FAQ.astro`.

---

## BreadcrumbList: Required BaseLayout Update

The existing `pageLabels` map in `BaseLayout.astro` only covers top-level routes:

```typescript
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/om-oss': 'Om oss',
  '/prosjekter': 'Prosjekter',
  '/kontakt': 'Kontakt',
};
```

Sub-pages like `/tjenester/nettside` will fall back to the raw slug (`nettside`) in the breadcrumb because the path is not in the map. Add the 7 service paths:

```typescript
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/tjenester/nettside': 'Nettside',
  '/tjenester/nettbutikk': 'Nettbutikk',
  '/tjenester/webapp': 'Webapplikasjon',
  '/tjenester/seo': 'SEO',
  '/tjenester/ai': 'AI-integrering',
  '/tjenester/landingsside': 'Landingsside',
  '/tjenester/vedlikehold': 'Vedlikehold',
  '/om-oss': 'Om oss',
  '/prosjekter': 'Prosjekter',
  '/kontakt': 'Kontakt',
};
```

This is the only BaseLayout change required. Breadcrumbs for `/tjenester/nettside` will automatically render as: Hjem > Tjenester > Nettside — correct Google format.

---

## CTA Pre-fill: ContactForm Update Required

The current ContactForm reads `?pakke=` and validates against `['enkel', 'standard', 'premium', 'usikker']`. The PROJECT.md spec for v1.1 uses `?tjeneste=` with service slug values. The ContactForm needs a new URL param branch:

```typescript
// ContactForm.tsx — add alongside existing ?pakke= handling
const tjeneste = params.get('tjeneste');
const validTjenester = ['nettside', 'nettbutikk', 'webapp', 'seo', 'ai', 'landingsside', 'vedlikehold'];
if (tjeneste && validTjenester.includes(tjeneste)) {
  setFormData(prev => ({ ...prev, tjeneste: tjeneste }));
}
```

The FormData interface and the Formspree form will need a `tjeneste` field added (separate from `pakke`). This is a small, contained change. The existing `?pakke=` flow from `/tjenester/` overview remains unchanged.

---

## FAQ Accordion: No New Library Needed

The existing FAQ pattern in `/tjenester/_sections/FAQ.astro` uses a static expand-all layout (all answers visible). This is intentional — it means all FAQ text is present in the HTML for search engines without JavaScript.

For v1.1, the same static pattern is the correct choice. Reasons:
- FAQPage schema requires answers to be in the DOM (not hidden behind JS toggle)
- The FAQ section is shorter per-service than the global FAQ (fewer questions, more specific)
- Accordion interaction adds complexity for marginal UX gain on focused service pages

If an interactive accordion is desired for user experience on long FAQ lists, implement it with native HTML `<details>` / `<summary>` elements. These are natively accessible, work without JavaScript, and require zero dependencies. The existing `.reveal-on-scroll` class still applies.

```html
<details class="reveal-on-scroll border-b border-white/10 py-6">
  <summary class="cursor-pointer font-semibold list-none">
    {faq.question}
  </summary>
  <p class="mt-3 text-text-muted">{faq.answer}</p>
</details>
```

Do NOT use: `@headlessui/react` Disclosure, Radix UI Accordion, or any React accordion library. Adding a React island for a pure-content accordion violates the "Astro sections first" rule and inflates the client bundle unnecessarily.

---

## Comparison Tables: Pure Astro HTML

Service pages may include feature/pricing comparison tables. These are static content — render them as plain HTML in `.astro` files. No library needed.

Pattern to use:

```astro
---
const rows = [
  { feature: 'Antall sider', enkel: 'Inntil 5', standard: 'Inntil 10', premium: 'Ubegrenset' },
  // ...
];
---

<div class="overflow-x-auto">
  <table class="w-full text-left">
    <thead>
      <tr class="border-b border-white/10">
        <th class="py-4 pr-6 font-semibold">Funksjon</th>
        <th class="py-4 px-4 font-semibold text-brand">Enkel</th>
        <!-- ... -->
      </tr>
    </thead>
    <tbody class="divide-y divide-white/10">
      {rows.map(row => (
        <tr>
          <td class="py-4 pr-6 text-text-muted">{row.feature}</td>
          <td class="py-4 px-4">{row.enkel}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Sitemap: No Changes Needed

`@astrojs/sitemap` is configured in `astro.config.mjs` with `integrations: [sitemap()]`. It automatically discovers all `.astro` pages at build time. Adding 7 new pages under `/tjenester/` requires zero sitemap configuration changes — they are included automatically.

**Verify:** The sitemap currently generates `https://nettup.no/nettside-for-bedrift` (the ads landing page). Confirm it is excluded if it should not be indexed in the service catalog. May need `exclude: ['/nettside-for-bedrift']` in `defineConfig` if that page is ads-only.

---

## Alternatives Considered

| Decision | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Routing | Individual files | `[slug].astro` + `getStaticPaths()` | Services have structurally different sections. Shared template enforces lowest common denominator. |
| FAQ interaction | `<details>/<summary>` or static | React accordion library | Adds JS island for static content. FAQ schema requires answers in DOM. |
| Service config | Content inline per page | Central `services.ts` data object | Central config forces uniform structure. Each service needs unique section composition. |
| JSON-LD | Manual per page in `<slot name="head">` | `astro-seo` library | Already have working pattern. Adding a library for static meta tags adds unnecessary abstraction. |
| Comparison tables | Plain HTML in `.astro` | React table library | Static data. Zero interactivity needed. Tables render at build time. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `[slug].astro` + `getStaticPaths()` | Forces uniform structure across services that have distinct content needs | Individual `index.astro` per service |
| Headless UI / Radix accordion | React island for static content, inflates bundle | Native `<details>/<summary>` |
| `schema-dts` npm package | TypeScript types for Schema.org — schema is written once, type overhead not worth it | Inline JSON-LD objects with comments |
| `react-table` / `@tanstack/table` | Data grid for static price tables | Plain HTML `<table>` in `.astro` |
| New animation libraries | Framer Motion already handles all animation needs | Existing Framer Motion |

---

## Installation

**No new packages required.**

The existing stack covers all requirements for v1.1:
- Routing: Astro file-based routing (built-in)
- Styling: Tailwind CSS (existing)
- Animations: Framer Motion (existing)
- FAQ: Native HTML or static Astro (no library)
- Tables: HTML (no library)
- Sitemap: @astrojs/sitemap (existing, automatic)
- JSON-LD: Inline script tags (established pattern)

```bash
# Nothing to install. Run existing commands:
npm run dev
npm run build
```

---

## Version Compatibility

All existing packages are compatible with the proposed patterns. No version conflicts introduced.

| Concern | Status |
|---------|--------|
| Astro file-based routing for nested dirs | Works in Astro 5 (stable, unchanged from v4) |
| `<slot name="head">` in BaseLayout | Working in current codebase |
| JSON-LD `set:html` in Astro | Working in current codebase (see existing FAQ.astro, tjenester/index.astro) |
| `<details>/<summary>` + Tailwind | No conflicts — native HTML, style with Tailwind classes normally |

---

## Sources

- Codebase analysis: `src/pages/tjenester/`, `src/layouts/BaseLayout.astro`, `src/pages/kontakt/_sections/ContactForm.tsx`, `src/pages/tjenester/_sections/FAQ.astro`, `package.json`
- Schema.org Service type specification — training data, HIGH confidence (schema.org spec is stable)
- Astro 5 routing documentation — training data, HIGH confidence (file-based routing is core, unchanged)
- Pattern consistency: matches `/nettside-for-bedrift/` and `/kontakt/` page structure already in codebase

---
*Stack research for: v1.1 Tjenesteutvidelse — 7 service sub-pages in Astro 5*
*Researched: 2026-03-04*
