# Phase 4: Conversion Optimization - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Every page guides visitors toward the contact form through contextually relevant CTAs, service pre-fill from /tjenester, and a solid mobile experience. Scope: CONV-01 (contextual CTAs), CONV-02 (service pre-fill), CONV-03 (mobile UX review).

</domain>

<decisions>
## Implementation Decisions

### Contextual CTA copy
- Each page's CTA copy should emerge from what the visitor just read — not artificially different, but naturally relevant
- Claude should derive the copy from the page's content and intent (e.g., /prosjekter CTA follows a portfolio showcase, /om-oss CTA follows a values/approach section)
- Same structural layout as existing `CTA.astro` is fine — only headline and subtext need to be contextual
- Generic fallback: shared `CTA.astro` remains for pages without a natural context

### Service pre-fill flow
- Claude's Discretion: navigate to `/kontakt?pakke=X` when user clicks a pricing package button
- The form already reads `?pakke=` URL params and shows a confirmation badge — just needs wiring in Pakker.astro
- Valid pakke values: `enkel`, `standard`, `premium` (already handled in ContactForm.tsx)
- The `kilde` param can also be set for tracking (e.g., `?pakke=standard&kilde=tjenester`)

### Inline vs. bottom CTAs
- Claude's Discretion: one well-placed bottom CTA per page is sufficient
- Adding inline CTAs mid-page would be noisy given the site's content density
- CONV-01 is satisfied by making the existing bottom CTAs contextually relevant — not by adding more CTAs

### Mobile UX audit
- Simple review and fix — not a deep overhaul
- The mobile layout is broadly fine; no broken elements
- Audit criteria: 44px tap targets, no horizontal scroll, no layout overflow at 375px, forms usable with thumb
- Fix any issues found; skip if none exist

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CTA.astro` (src/components/sections/CTA.astro): Shared generic CTA, used on all pages. Can create page-specific CTA sections or pass props
- `ContactForm.tsx`: Already reads `?pakke=` URL param on mount and shows a confirmation badge — pre-fill is functionally complete
- `Pakker.astro`: Package cards with "Kom i gang" buttons currently linking to `/kontakt` without params — just need `?pakke=X` appended
- `Button.astro`: Accepts `href`, reusable for CTA buttons

### Established Patterns
- Page-specific sections live in `src/pages/{page}/_sections/` — contextual CTAs should follow this pattern if they differ significantly from the shared `CTA.astro`
- Shared sections live in `src/components/sections/` — `CTA.astro` is here
- `reveal-on-scroll` class used for scroll animations throughout

### Integration Points
- `Pakker.astro` → buttons need `href="/kontakt?pakke={pakke.id}"` (pakke.id values: enkel, standard, premium)
- Each page's `index.astro` imports `CTA` — contextual CTAs would either replace or extend this import
- `TjenesterCTA.astro` already exists as a page-specific CTA on /tjenester — same pattern for other pages if needed

</code_context>

<specifics>
## Specific Ideas

- CTA copy should feel like a natural continuation of the page — if /prosjekter shows results and client wins, the CTA should invite the visitor to become the next success story; if /om-oss explains the team's approach, the CTA should connect that to starting a project
- The pre-fill wiring is minimal: one-line href change per package button in Pakker.astro
- Mobile audit is a verification pass, not a redesign

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-conversion-optimization*
*Context gathered: 2026-03-04*
