# Phase 16: Page Integration and Swap - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a dedicated `/priskalkulator` page and verify the `/tjenester` embed works — SmartPrisKalkulator is already fully built and already embedded on /tjenester. The old PrisKalkulatorIsland no longer exists. This phase is about page creation, metadata wiring, and verifying no dead code remains.

</domain>

<decisions>
## Implementation Decisions

### Dedicated page structure
- Use BaseLayout (FloatingNav + Footer + ChatWidget) — consistent with all other pages
- Hero section with H1 and 1-2 sentence intro above the calculator
- Estimate-focused framing: "Få et prisestimat" angle — helps users get a rough price without committing
- Reuse existing CTA.astro component below the calculator (same component used on other pages)

### Navigation
- /priskalkulator does NOT appear in FloatingNav — it's a tool, not a top-level section
- Discoverable via /tjenester where the calculator is already embedded
- No cross-link from /tjenester embed to /priskalkulator — ResultStep CTA goes straight to /kontakt

### SEO and metadata
- Page `<title>`: "Finn prisen på din nettside | Nettup"
- Norwegian breadcrumb label: "Prisestimator" (consistent with H1 framing)
- Add `/priskalkulator` to `pageLabels` in BaseLayout.astro
- Page is in sitemap by default (Astro sitemap integration auto-includes all pages)

### Old code cleanup
- Perform a full audit of `src/components/islands/wizard/` — confirm every file is actually imported and used
- If unused/dead files are found, delete them (no archiving, no TODOs)
- The old PrisKalkulatorIsland is already gone — verify with grep that no stale references remain

### Claude's Discretion
- Exact hero intro copy in Norwegian (within the "Få et prisestimat" framing)
- Meta description for /priskalkulator
- Minor spacing and layout adjustments on the dedicated page

</decisions>

<specifics>
## Specific Ideas

- Hero H1 angle: "Få et prisestimat" — users want a number before committing, frame the page as a tool for that
- Page title targets a search query: "Finn prisen på din nettside | Nettup" — more descriptive than just "Prisestimator | Nettup"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `SmartPrisKalkulator.tsx` — fully built, already embedded on /tjenester via `PrisKalkulator.astro`
- `CTA.astro` (`src/components/sections/CTA.astro`) — shared CTA section, reuse below calculator on dedicated page
- `Section.astro` + `SectionHeader.astro` — standard layout primitives used across all pages
- `BaseLayout.astro` — handles FloatingNav, ChatWidget, Footer, breadcrumbs, sitemap

### Established Patterns
- All pages: `BaseLayout` > `<main>` > section imports
- Hero pattern: H1 + subtitle in a Section, then content sections below
- pageLabels in BaseLayout.astro — needs `/priskalkulator: 'Prisestimator'` added for breadcrumbs

### Integration Points
- `src/pages/tjenester/index.astro` — already imports `PrisKalkulator.astro` which wraps SmartPrisKalkulator
- `src/layouts/BaseLayout.astro` line 24 — `pageLabels` record needs /priskalkulator entry
- New file needed: `src/pages/priskalkulator/index.astro` (or `src/pages/priskalkulator.astro`)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 16-page-integration-and-swap*
*Context gathered: 2026-03-06*
