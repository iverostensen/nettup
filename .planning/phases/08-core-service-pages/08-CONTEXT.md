# Phase 8: Core Service Pages - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Build three dedicated service sub-pages: /tjenester/nettside, /tjenester/nettbutikk, and /tjenester/landingsside. Each page must have outcome-focused content, price signal above the fold, a "Hva er inkludert" section, a service-specific FAQ, and a pre-filled contact CTA. Creating the other 4 service pages is Phase 9.

</domain>

<decisions>
## Implementation Decisions

### Page structure & section order
- Claude's discretion, grounded in company context and existing site structure
- Recommended order: Hero (outcome headline + price signal) → Hva er inkludert (service-specific items) → FAQ (service-specific) → CTA
- Breadcrumbs already built into BaseLayout — use as-is
- CTA button links to `/kontakt?tjeneste=[slug]` (infrastructure from Phase 6)

### Content depth per service
- One shared layout/template, different content per service
- "Hva er inkludert" must be tailored per service with logically relevant items:
  - Nettside: responsivt design, kontaktskjema, grunnleggende SEO, HTTPS, hosting, etc.
  - Nettbutikk: produktkatalog, handlekurv/checkout, betalingsløsning, lagerstyring, etc.
  - Landingsside: fokusert konverteringslayout, A/B-klar struktur, hurtig lasting, etc.
- A common base (responsivt design, HTTPS, grunnleggende SEO, 30-dagers support) can appear on all, but each page should also have 3–4 service-specific items
- FAQ questions must be service-specific, not the generic ones on /tjenester

### Nettbutikk Shopify handling
- Claude's discretion, grounded in company context
- Recommended: inline note within the inkludert or pricing section — visible but not alarming
- Wording: "Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify"
- Should not feel like a hidden fee — set expectations clearly, but don't make it the headline

### Visual templating
- One shared Astro layout/component structure for all 3 pages
- Different content per service (text, inkludert items, FAQ questions)
- No service-specific visual variation — consistent look across all service sub-pages

### Claude's Discretion
- Exact section layout and spacing within each section
- Shopify fee placement (pricing block vs inkludert list footnote)
- Number of FAQ items per page (3–6 is reasonable)
- Whether to include a short process/how-it-works step list (appropriate for nettbutikk given complexity)

</decisions>

<specifics>
## Specific Ideas

- No specific references given — open to standard conversion-page patterns
- Nettbutikk may benefit from a brief "Slik fungerer det" step sequence given its higher complexity and price point

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/config/services.ts`: All 3 services already defined with slug, name, tagline, priceRange, minPrice, ctaParam, description — use as data source for each page
- `src/components/ui/Card.astro`: hover variant with `hover:border-brand/30`, reusable for inkludert items
- `src/components/ui/Section.astro` + `SectionHeader.astro`: standard section wrapper — use throughout
- `src/pages/tjenester/_sections/FAQ.astro`: existing FAQ pattern (`divide-y divide-white/10`, inline FAQPage JSON-LD) — adapt per-page
- `src/pages/tjenester/_sections/Inkludert.astro`: checkmark grid pattern — adapt with service-specific items
- `src/components/sections/CTA.astro`: shared CTA section — use or adapt with pre-filled slug
- `src/components/ui/Breadcrumbs.astro`: already built

### Established Patterns
- Sections use `reveal-on-scroll` + `delay-N` for scroll animations
- Dark theme: `bg-surface` / `bg-surface-raised`, `text-text-muted`, `text-brand`
- All pages live in `src/pages/[route]/index.astro` with sections in `_sections/`
- JSON-LD schemas injected via `<Fragment slot="head">` in BaseLayout

### Integration Points
- Each sub-page: `src/pages/tjenester/[slug]/index.astro` — new directories to create
- CTA pre-fill: already wired in Phase 6 via `/kontakt?tjeneste=[slug]`
- Breadcrumbs: already wired in Phase 6 via BaseLayout `pageLabels`
- Sitemap: auto-generated via `@astrojs/sitemap` — no manual work needed

</code_context>

<deferred>
## Deferred Ideas

- Cross-links between related service pages — Phase 10
- Service JSON-LD and FAQPage JSON-LD validation — Phase 10

</deferred>

---

*Phase: 08-core-service-pages*
*Context gathered: 2026-03-05*
