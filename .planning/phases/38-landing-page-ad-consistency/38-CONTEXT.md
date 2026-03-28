# Phase 38: Landing Page Ad Consistency - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Three targeted improvements to /nettside-for-bedrift to match what Facebook ads promise:

1. **LP-01** — Competitor price anchor in PricingSummary.astro
2. **LP-02** — Consent banner equal-prominence buttons (no dark patterns)
3. **LP-03** — Custom OG image (1200x630) for social sharing, static file

No new pages, no new tracking, no layout changes beyond these three items.

</domain>

<decisions>
## Implementation Decisions

### LP-01: Competitor Price Anchor
- **D-01:** Place a single muted line **above the price card** in `PricingSummary.astro` — before the card renders, so it frames the offer before the user sees the price.
- **D-02:** Style: `text-text-muted` (small, understated) — factual tone, no badge or pill. Lets the price card speak.
- **D-03:** Text: "Andre byråer tar 15 000–50 000 kr for en nettside" (or close to this wording — exact phrasing is Claude's discretion as long as it matches the existing page tone).

### LP-02: Consent Banner Button Parity
- **D-04:** Both buttons become **solid, same size, different colors**: `Avslå` gets `bg-slate-600` (currently `bg-slate-700` — too close to ghost), `Godta` keeps `bg-brand`. Same visual weight, different hues. Standard GDPR-compliant equal-prominence pattern.
- **D-05:** No other changes to the consent banner — text, position, and JS logic stay as-is.

### LP-03: Custom OG Image
- **D-06:** Generate **manually** (Figma, Canva, or similar) and commit as a static file to `/public/images/og-nettside-for-bedrift.jpg`. No build pipeline, no satori dependency.
- **D-07:** Visual spec: dark background (`#020617`), Nettup logo top-left (cyan), large price text centered (`0 kr oppstart | 399 kr/mnd` in white/cyan), 1200×630px. Clean and brand-consistent.
- **D-08:** Wire the custom OG image into `/nettside-for-bedrift/index.astro` by passing it as the `image` prop to `LandingPageLayout` — the prop is already wired (`og:image` meta tag in layout).

### Claude's Discretion
- Exact Norwegian wording of the competitor anchor line (must stay factual, not inflammatory)
- Precise `bg-slate-600` vs `bg-slate-500` for Avslå — whichever reads as solidly equal to `bg-brand` without being too close to the accept button
- Whether to add a `text-center` wrapper or inline the anchor line in the existing section header block

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to Modify
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` — LP-01 target. Add competitor anchor above the card. Read in full before editing.
- `src/layouts/LandingPageLayout.astro` — LP-02 target. Lines ~170–183 contain the consent banner buttons. Only button classes change.
- `src/pages/nettside-for-bedrift/index.astro` — LP-03 target. Pass custom OG image path as `image` prop to LandingPageLayout.

### Reference (read-only)
- `src/config/subscriptionOffer.ts` — Single source of truth for the 399 kr/mnd offer. Use its values, don't hardcode.

### Requirements
- `.planning/REQUIREMENTS.md` §LP-01, LP-02, LP-03 — Exact acceptance criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LandingPageLayout.astro` already accepts an `image` prop (default: `/images/og-image.jpg`). LP-03 just needs a custom file + a prop override on the page.
- Consent banner JS logic (lines ~190–270) does not need touching — only button classes change.

### Established Patterns
- `text-text-muted` is the established pattern for secondary/contextual copy throughout the site.
- Solid button style: `rounded-full bg-{color} px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-{color}-light` — follow this for both buttons.

### Integration Points
- LP-01 inserts a line in `PricingSummary.astro` — standalone, no component imports needed.
- LP-02 is a two-class change in `LandingPageLayout.astro`.
- LP-03: new static file in `/public/images/` + one prop addition in `nettside-for-bedrift/index.astro`.

</code_context>

<specifics>
## Specific Ideas

- The competitor anchor text should reference "Andre byråer" (not "konkurrenter" or "markedet") — keeps the framing personal and credible.
- The OG image must be legible at small sizes (Facebook link preview thumbnail ~600×315 effective area) — keep text large.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 38-landing-page-ad-consistency*
*Context gathered: 2026-03-28*
