# Phase 17: Astro Blog Infrastructure - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete blog reading experience: content collection schema, article listing page at `/blogg`, individual article pages at `/blogg/[slug]`, and all supporting components. Content generation pipeline (Phase 18) and automation (Phase 19) are out of scope. Phase is verified with 3 manually-written seed articles and `astro build`.

</domain>

<decisions>
## Implementation Decisions

### Article listing layout
- 2-column responsive grid on `/blogg`, single column on mobile
- Each ArticleCard shows: title, category, date, read time — no excerpt
- SectionHeader above the grid (consistent with Prosjekter, Om oss pages)
- Empty state: simple "Artikler kommer snart" text message — no redirect

### Article page reading UX
- Narrow reading column (~65-70ch), centered on the page
- No reading progress bar
- Article header: breadcrumb nav (reuse Breadcrumbs.astro), then H1, date, read time
- Simple CTA to `/kontakt` at the bottom of each article ("Trenger du en nettside?")
- "Les også" related articles section below the CTA

### Content schema fields
- **Required:** `title` (conversational H1), `seoTitle` (keyword-first `<title>`), `category` (free string), `date`, `readTime`, `description` (meta description / og:description)
- **Optional:** `relatedSlugs` (array of slugs — filter undefined entries per roadmap note)
- Category is a free string, no enum enforcement
- No tags, author, or featured flag

### Seed articles
- 3 seed articles covering core webdev topics for Norwegian SMBs
- Suggested topics: "Hva koster en nettside?", "SEO for småbedrifter", "Nettbutikk vs nettside — hva trenger bedriften din?"
- Placeholder content — 200-400 words each, enough to verify layout and structured data
- Seed articles should cross-reference each other via `relatedSlugs` to test the "Les også" section

### Claude's Discretion
- Exact spacing and typography for the reading column
- Markdown prose styling (h2, h3, blockquote, code, lists)
- ArticleCard hover animation (existing Card hover pattern is fine)
- Exact wording for the CTA and empty state

</decisions>

<specifics>
## Specific Ideas

- `relatedSlugs` must filter `undefined` entries to prevent build failures (noted in roadmap)
- Run `astro sync` immediately after creating `src/content/config.ts` to generate `.astro/types.d.ts` before writing page components (noted in roadmap)
- `seoTitle` goes in `<title>` tag; conversational `title` goes in `<h1>` — these are always two distinct fields

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Card.astro` — use with `as="a"` and `hover={true}` for ArticleCard links
- `src/components/ui/Breadcrumbs.astro` — use on article pages for breadcrumb nav
- `src/components/ui/SectionHeader.astro` — use for `/blogg` listing page header
- `src/components/sections/CTA.astro` — potentially reuse for article-bottom CTA (or create a leaner inline version)
- `src/layouts/BaseLayout.astro` — inject Article JSON-LD, FAQPage JSON-LD via `<slot name="head" />`

### Established Patterns
- JSON-LD: already handled via `<slot name="head" />` in BaseLayout — article pages follow the same pattern
- Page sections: each page has an `_sections/` folder under `src/pages/` — follow the same structure for `/blogg`
- Scroll reveal: use `reveal-on-scroll` CSS class for section animations (Level 1, IntersectionObserver)

### Integration Points
- `src/components/layout/Footer.astro` — add "Blogg" to the `navLinks` array (href: `/blogg`)
- `src/layouts/BaseLayout.astro` — add `/blogg` and `/blogg/[slug]` entries to `pageLabels` for breadcrumb JSON-LD
- `src/content/config.ts` — new file (legacy Content Collections path, intentional for v1.3)
- `src/content/blogg/` — directory for `.md` article files

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-astro-blog-infrastructure*
*Context gathered: 2026-03-06*
