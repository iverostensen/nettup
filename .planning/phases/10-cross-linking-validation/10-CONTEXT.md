# Phase 10: Cross-linking & Validation - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete the service catalog by (1) adding cross-links between service pages so each page references at least 2 related services, and (2) validating that all 7 Service and FAQPage JSON-LD schemas pass Google Rich Results Test with no errors. Sitemap coverage is already provided by @astrojs/sitemap — verify it includes all 7 sub-pages.

Creating new service pages, adding new schema types, or redesigning existing page layouts are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Cross-link placement
- Dedicated "Relaterte tjenester" section placed between FAQ and CTA on each service page
- Keeps cross-links visible without cluttering existing content or diluting the primary CTA

### Related services curation
- Manual curation: add a `related: string[]` (slugs) field to each service object in `services.ts`
- Gives full editorial control over which pairings make sense
- Suggested pairings:
  - nettside → [seo, vedlikehold]
  - nettbutikk → [nettside, vedlikehold]
  - webapp → [ai, nettside]
  - ai → [webapp, seo]
  - seo → [nettside, landingsside]
  - landingsside → [seo, nettside]
  - vedlikehold → [nettside, nettbutikk]

### Cross-link visual design
- Small cards showing service name + tagline + price range
- Reuse existing Card component (consistent with the site, no new component needed)
- 2–3 cards in a horizontal row, responsive (stack on mobile)

### Schema validation
- Manual validation using Google Rich Results Test as per success criteria
- No automated script needed — phase success criteria are verified manually
- Schema code for all 7 pages already exists; validation confirms correctness, not creation

### Claude's Discretion
- Exact card styling within the Card component's existing variants
- Whether "Relaterte tjenester" section gets its own Astro component or is inlined
- Ordering of related service cards (match roadmap order or editorial choice)

</decisions>

<specifics>
## Specific Ideas

- No specific references or examples discussed — open to standard approaches
- The 7 services are: nettside, nettbutikk, webapp, ai, seo, landingsside, vedlikehold

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Card.astro`: Can render service cards with name, tagline, priceRange. Available variants include shadow/rounded.
- `src/components/ui/LinkWithArrow.astro`: Alternative if card approach is too heavy
- `src/config/services.ts`: Already has all 7 services with slug, name, tagline, priceRange. Add `related: string[]` field here.
- `src/components/ui/Section.astro` + `SectionHeader.astro`: Standard section wrapper — use for "Relaterte tjenester" section

### Established Patterns
- Service pages follow identical structure: Hero → Inkludert → FAQ → CTA
- New section inserted as a `_sections/` Astro file and imported in `index.astro`
- JSON-LD schemas are already in place on all 7 pages (Service + FAQPage); no schema creation needed, just validation

### Integration Points
- `services.ts` is the single source of truth — add `related` field here, consume it in the new section
- The new "Relaterte tjenester" section needs to be added to all 7 `index.astro` files
- Sitemap: `@astrojs/sitemap` is configured with `site: 'https://nettup.no'` — all static pages auto-included

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 10-cross-linking-validation*
*Context gathered: 2026-03-05*
