# Phase 29: Gap Closure — FAQPage Schema + Phase 27 Verification - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Close three specific gaps identified during milestone audit:
1. Add missing FAQPage JSON-LD to city pages (`src/pages/steder/[location].astro`)
2. Remove dead code: delete `FloatingNav.tsx` (React island, never imported) and remove `trackCityCtaClicked` export from `src/lib/analytics.ts`
3. Produce `27-VERIFICATION.md` by running gsd-verifier against Phase 27 (Plausible Analytics) implementation

New capabilities and additional cleanup belong in other phases.

</domain>

<decisions>
## Implementation Decisions

### FAQPage JSON-LD Placement
- Separate `<script type="application/ld+json">` block in `<Fragment slot="head">` alongside the existing Service schema block — same pattern as `src/pages/blogg/[slug].astro`
- Do NOT merge into the existing Service schema (no @graph)
- Guard with a conditional: only emit the FAQPage block if `city.faq` exists and has items (defensive — future cities may not have FAQ data)
- Use `city.faq` array already present in city config to build the schema

### Dead Code Removal
- Delete `src/components/islands/FloatingNav.tsx` directly — confirmed zero imports anywhere (only `FloatingNav.astro` is in use via BaseLayout)
- Remove the `trackCityCtaClicked` export entirely from `src/lib/analytics.ts` — it is exported but never imported or called anywhere

### Phase 27 Verification Scope
- Implementation presence verification only (not live network testing)
- gsd-verifier should check: Plausible script in BaseLayout, analytics.ts events correctly defined, city CTA tracking (inline script with `window.plausible`) present in `[location].astro`
- Verify against requirements ANAL-01, ANAL-02, ANAL-03

### Claude's Discretion
- Exact FAQPage schema JSON-LD structure (follow established pattern from `src/pages/tjenester/_sections/FAQ.astro`)
- How to format the VERIFICATION.md report

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/blogg/[slug].astro`: FAQPage JSON-LD pattern — separate script block in `<Fragment slot="head">` with conditional guard
- `src/pages/tjenester/_sections/FAQ.astro`: FAQPage schema structure to reference for JSON-LD format
- `src/config/locations.ts`: `city.faq` array typed as `Array<{ question: string; answer: string }>` — already populated for all active cities

### Established Patterns
- FAQPage JSON-LD: `@type: FAQPage`, `mainEntity` array of `Question` with `acceptedAnswer`
- Inline JSON-LD: `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`
- Dead code removal: no refactoring, just delete/remove

### Integration Points
- `[location].astro` `<Fragment slot="head">`: where new FAQPage script block goes (alongside existing Service schema)
- `src/lib/analytics.ts` line 40: `trackCityCtaClicked` export to remove
- `src/components/islands/FloatingNav.tsx`: file to delete (not `FloatingNav.astro` in same directory — that one is live)

</code_context>

<specifics>
## Specific Ideas

- The `.tsx` FloatingNav is a 189-line dead React island — `FloatingNav.astro` is the live component used in BaseLayout. Do not confuse them.
- Phase 27 has 3 SUMMARY files (27-01, 27-02, 27-03) confirming completion, but no VERIFICATION.md was produced

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 29-gap-closure*
*Context gathered: 2026-03-13*
