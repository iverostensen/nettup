# Phase 29: Gap Closure — FAQPage Schema + Phase 27 Verification - Research

**Researched:** 2026-03-13
**Domain:** JSON-LD schema injection (Astro), dead code removal, verification reporting
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **FAQPage JSON-LD placement:** Separate `<script type="application/ld+json">` block in `<Fragment slot="head">` alongside the existing Service schema block — same pattern as `src/pages/blogg/[slug].astro`. Do NOT merge into the existing Service schema (no @graph). Guard with a conditional: only emit the FAQPage block if `city.faq` exists and has items.
- **Dead code removal:** Delete `src/components/islands/FloatingNav.tsx` directly (zero imports confirmed). Remove `trackCityCtaClicked` export entirely from `src/lib/analytics.ts` — exported but never imported anywhere.
- **Phase 27 verification scope:** Implementation presence verification only (not live network testing). Check: Plausible script in BaseLayout, analytics.ts events correctly defined, city CTA tracking (`window.plausible`) present in `[location].astro`. Verify against ANAL-01, ANAL-02, ANAL-03.

### Claude's Discretion

- Exact FAQPage schema JSON-LD structure (follow established pattern from `src/pages/tjenester/_sections/FAQ.astro`)
- How to format the VERIFICATION.md report

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-03 | Each city page emits a `FAQPage` JSON-LD block built from `city.faq` — enables FAQ rich results in Google Search | FAQPage schema pattern confirmed from `blogg/[slug].astro`; `city.faq` array typed and populated for all Tier 1 cities in `locations.ts` |
| ANAL-01 | Plausible Analytics CDN script present in `BaseLayout.astro` and `LandingPageLayout.astro` with queuing stub — cookieless, GDPR-compliant | Script confirmed present in both layouts at lines 184/104 respectively, with full queuing stub |
| ANAL-02 | Conversion events wired in React islands: contact form submit, B2B form submit, chatbot opened, chatbot suggestion clicked, wizard estimate shown, wizard CTA clicked | 27-02 SUMMARY confirms all 6 events wired in ContactForm, ChatWidget, ResultStep — code verified via file reads |
| ANAL-03 | City CTA click fires `City CTA Clicked` Plausible event with `city` prop — all 7 Goals registered in Plausible dashboard | 27-03 SUMMARY confirms inline IIFE in `[location].astro` fires `window.plausible('City CTA Clicked', { props: { city } })`; 7 Goals registered in Plausible dashboard |
</phase_requirements>

## Summary

Phase 29 closes three specific gaps identified by the milestone audit. All three tasks are purely corrective — no new architecture, no new dependencies.

**Task 1 (FAQPage JSON-LD):** The audit found zero matches for `FAQPage`/`mainEntity` in `src/pages/steder/[location].astro` despite Phase 25 documentation claiming it was implemented. The source of truth pattern exists in `blogg/[slug].astro`: build the schema object in frontmatter with a null-guard, then emit a conditional `<script type="application/ld+json">` in `<Fragment slot="head">`. The `city.faq` array is typed as `Array<{ question: string; answer: string }>` in `locations.ts` and is already populated for all Tier 1 cities — no data changes needed.

**Task 2 (Dead code removal):** Two items of dead code: (a) `src/components/islands/FloatingNav.tsx` — a 189-line React island that was superseded by the Astro-based `FloatingNav.astro` in Phase 28; confirmed zero imports in any file. (b) `trackCityCtaClicked` export in `analytics.ts` — intentionally not imported because `is:inline` scripts cannot import ES modules; city CTA tracking uses a direct `window.plausible` call instead.

**Task 3 (Phase 27 VERIFICATION.md):** Phase 27 has three executed plans with SUMMARY files (27-01, 27-02, 27-03) but no VERIFICATION.md was ever produced. The verification must check ANAL-01, ANAL-02, and ANAL-03 against the current code state. All code has been confirmed present in this research session.

**Primary recommendation:** Implement FAQPage JSON-LD, remove the two dead code items, and produce 27-VERIFICATION.md — in a single plan (29-01-PLAN.md) as the tasks are small and non-conflicting.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro JSON-LD pattern | Astro 5 | Inject structured data via `<script type="application/ld+json" set:html={...}>` | Established in project — used in BaseLayout, blogg/[slug].astro, and [location].astro already |

### Supporting

No additional libraries needed. This phase uses existing project infrastructure only.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Separate FAQPage script block | `@graph` array combining Service + FAQPage | `@graph` is more complex, harder to read, not the established project pattern — rejected per CONTEXT.md |

**Installation:** None required.

## Architecture Patterns

### Pattern 1: FAQPage JSON-LD in Astro frontmatter + conditional head emission

**What:** Build the schema object in Astro frontmatter with a null-guard. Emit via `{faqSchema && <script ...>}` in `<Fragment slot="head">`.
**When to use:** When structured data is conditional on page data existing. Exactly matches the blog article pattern.

**Reference pattern from `src/pages/blogg/[slug].astro` (lines 68-90):**
```typescript
// FAQPage JSON-LD — only emit if article has faq frontmatter
const faqSchema =
  article.data.faq && article.data.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.data.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

// In <Fragment slot="head">:
{faqSchema && <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />}
```

**Adaptation for `[location].astro`:** Replace `article.data.faq` with `city.faq`. The guard `city.faq && city.faq.length > 0` is appropriate — all current Tier 1 cities have 3 FAQ items each, but future cities may not.

**Note on `is:inline`:** The existing Service JSON-LD block in `[location].astro` uses `<script is:inline type="application/ld+json" set:html={...} />`. The blog pattern uses `<script type="application/ld+json" set:html={...} />` (no `is:inline`). Either form works — both emit inline JSON-LD. For consistency within the file, match the existing Service schema pattern (with `is:inline`). The functional difference is minimal for a static JSON-LD block.

### Pattern 2: Dead code removal

**What:** Simple file deletion and export removal — no refactoring.

**FloatingNav.tsx deletion:**
- File: `src/components/islands/FloatingNav.tsx` (189 lines, React island)
- Zero imports confirmed: grep for `FloatingNav` in `src/` found 6 files, none import from `islands/FloatingNav.tsx` — all references are to `layout/FloatingNav.astro`, `global.css` (animation), and `LaunchOfferBanner.astro`
- Safe to `rm` directly

**trackCityCtaClicked removal:**
- File: `src/lib/analytics.ts` line 40-42
- Export confirmed never imported: grep for `trackCityCtaClicked` in `src/` returns only `analytics.ts` itself
- Reason it exists: Plan 27-01 created it optimistically, but Plan 27-03 determined `is:inline` scripts cannot import ES modules — so the city page uses a direct `window.plausible` call instead
- Remove the exported function; the `track()` private helper and other exports remain unchanged

### Anti-Patterns to Avoid

- **Merging FAQPage into Service schema with @graph:** Not the project pattern, adds complexity, rejected in CONTEXT.md.
- **Removing `is:inline` from the existing Service JSON-LD block:** Out of scope — don't touch what isn't broken.
- **Deleting `FloatingNav.astro`:** That is the LIVE component used in BaseLayout. Only delete the `.tsx` file.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FAQPage schema structure | Custom schema shape | Established `@type: FAQPage` + `mainEntity` array pattern | Already validated in blogg/[slug].astro; matches schema.org spec |

**Key insight:** All three tasks in this phase are mechanical applications of existing patterns. No design decisions needed.

## Common Pitfalls

### Pitfall 1: Deleting the wrong FloatingNav
**What goes wrong:** There are two FloatingNav components. Deleting `FloatingNav.astro` (in `src/components/layout/`) would break the entire site navigation.
**Why it happens:** Both files share the same base name.
**How to avoid:** Delete only `src/components/islands/FloatingNav.tsx`. Verify the Astro file still exists after.
**Warning signs:** Build fails with import error in `BaseLayout.astro`.

### Pitfall 2: Removing more from analytics.ts than intended
**What goes wrong:** Accidentally removing the private `track()` helper or other exported functions while removing `trackCityCtaClicked`.
**Why it happens:** Editing adjacent lines carelessly.
**How to avoid:** Remove only lines 40-42 (the `trackCityCtaClicked` function). Verify the other 6 exported functions remain.

### Pitfall 3: Emitting FAQPage without the null-guard
**What goes wrong:** If `city.faq` is empty or undefined for a future city, the FAQPage block emits an invalid schema with an empty `mainEntity` array.
**Why it happens:** Skipping the defensive guard because all current cities have FAQ data.
**How to avoid:** Always wrap with `city.faq && city.faq.length > 0` conditional.

### Pitfall 4: Phase 27 VERIFICATION.md scope creep
**What goes wrong:** Attempting live network tests (actual Plausible event reception) in a code-only verification.
**Why it happens:** ANAL-03 mentions "all 7 Goals registered in Plausible dashboard" — that's a one-time manual step already done in Phase 27, not re-testable in code.
**How to avoid:** CONTEXT.md locks scope to "implementation presence verification only." Verify code is present and correctly structured; note manual dashboard step as already-completed.

## Code Examples

### FAQPage schema object for city pages
```typescript
// In [location].astro frontmatter (after existing Service schema setup):
const faqSchema =
  city.faq && city.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: city.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;
```

```astro
<!-- In <Fragment slot="head"> after the existing Service schema block: -->
{faqSchema && (
  <script
    is:inline
    type="application/ld+json"
    set:html={JSON.stringify(faqSchema)}
  />
)}
```

### analytics.ts after removing trackCityCtaClicked
Lines 40-42 to delete:
```typescript
export function trackCityCtaClicked(city: string): void {
  track('City CTA Clicked', { city });
}
```
Everything else in `analytics.ts` stays unchanged.

## State of the Art

No external library changes. This phase uses stable, established project patterns only.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQPage claimed in Phase 25 docs (never actually committed) | Implement FAQPage JSON-LD in Phase 29 | Phase 29 | SEO-03 satisfied; city pages eligible for FAQ rich results |
| FloatingNav.tsx React island | FloatingNav.astro (Phase 28 rewrite) | Phase 28 | TSX file is now dead code |
| trackCityCtaClicked in analytics.ts | Direct window.plausible call in is:inline IIFE | Phase 27-03 | Export is dead code; inline approach is intentional |

## Open Questions

1. **Which `is:inline` form for FAQPage block?**
   - What we know: Existing Service schema uses `<script is:inline type="application/ld+json" set:html={...} />`. Blog pattern uses `<script type="application/ld+json" set:html={...} />` (no `is:inline`).
   - What's unclear: Is there a functional difference in this context?
   - Recommendation: Use `is:inline` to match the existing Service schema block in the same file — consistency within the file is higher value than cross-file consistency.

2. **Phase 27 VERIFICATION.md format**
   - What we know: Other phase VERIFICATIONs exist (Phase 24, 25, 26, 28) — planner should read one to match the format.
   - What's unclear: Exact template expected by gsd-verifier output conventions.
   - Recommendation: Follow Phase 26 VERIFICATION.md format as it's the most recent complete example.

## Validation Architecture

`workflow.nyquist_validation` is not present in `.planning/config.json` — this section is skipped.

## Sources

### Primary (HIGH confidence)

- Direct file read: `src/pages/steder/[location].astro` — confirmed Service JSON-LD present, FAQPage absent, `city.faq` used in template, `trackCityCtaClicked` NOT imported
- Direct file read: `src/pages/blogg/[slug].astro` — FAQPage pattern confirmed (lines 68-90), conditional emission pattern confirmed
- Direct file read: `src/lib/analytics.ts` — `trackCityCtaClicked` export at lines 40-42, never imported elsewhere
- Direct file read: `src/config/locations.ts` — `City` interface confirms `faq: Array<{ question: string; answer: string }>`, ACTIVE_TIER cities all have 3 FAQ items
- Direct file read: `src/layouts/BaseLayout.astro` — Plausible CDN script confirmed present (line 184) with queuing stub (lines 187-188)
- Direct file read: `src/layouts/LandingPageLayout.astro` — Plausible CDN script confirmed present (line 104) with queuing stub (lines 107-108)
- Grep: `FloatingNav` in `src/` — `FloatingNav.tsx` has zero imports; only `FloatingNav.astro` is imported in BaseLayout
- Grep: `trackCityCtaClicked` in `src/` — only appears in `analytics.ts` (definition only, never imported)
- Direct file read: `.planning/v1.5-MILESTONE-AUDIT.md` — gap analysis and tech debt register confirm all three tasks
- Direct file reads: `27-01-SUMMARY.md`, `27-02-SUMMARY.md`, `27-03-SUMMARY.md` — Phase 27 implementation details confirmed

### Secondary (MEDIUM confidence)

- `.planning/phases/29-gap-closure/29-CONTEXT.md` — user decisions (locked, verified against code)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, established patterns confirmed from actual source files
- Architecture: HIGH — patterns read directly from existing codebase files
- Pitfalls: HIGH — derived from confirmed code state (two FloatingNavs confirmed, dead export confirmed)

**Research date:** 2026-03-13
**Valid until:** Stable — patterns are project-internal, no external library dependencies
