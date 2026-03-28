# Phase 37: Privacy & Compliance - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Update /personvern with a Meta Pixel disclosure section, and document the kill switch via .env.example. No new tracking code — Phase 36 already implemented the pixel and kill switch mechanism.

</domain>

<decisions>
## Implementation Decisions

### Privacy Page Structure
- **D-01:** Add Meta Pixel as a new **section 2.4** ("Meta Pixel (alle sider)") alongside the existing 2.3 Google Ads section. Mirrors the established numbered-section pattern.
- **D-02:** Section 2.4 must disclose: data processor (Meta/Facebook), purpose (ad measurement and retargeting), scope (alle sider — loaded via BaseLayout, not just landing pages), and consent mechanism (same `nettup_ads_consent` localStorage key as Google).
- **D-03:** Add Meta (Facebook) as a data processor entry in **section 4** ("Hvem deler vi data med") alongside Formspree, Plausible, Vercel, and Google.
- **D-04:** Update **section 3** (Formål og rettslig grunnlag) table to include a "Måle annonseeffekt (Meta Pixel)" row — same legal basis as Google Ads (Samtykke, GDPR art. 6(1)(a)).
- **D-05:** Update **section 5** (Informasjonskapsler) to mention that Meta Pixel cookies may be set site-wide (not just landing pages) when consent is granted.
- **D-06:** Update **section 6** (Lagringstid) table with a Meta Pixel cookies row.
- **D-07:** Update `lastUpdated` date to today (2026-03-28).

### Kill Switch Documentation
- **D-08:** PRIV-02 is satisfied by documenting `PUBLIC_META_PIXEL_ID` in `.env.example` with a clear comment that leaving it empty disables the pixel entirely. No code changes needed — the `if (pixelId)` guard in both layouts already implements this.
- **D-09:** No separate `PIXEL_ENABLED` boolean flag — the ID itself serves as the kill switch. Keep it simple.
- **D-10:** No privacy page mention of the kill switch — it's an ops concern, not a user-facing disclosure.

### Claude's Discretion
- Exact Norwegian wording for the Meta Pixel section (follow the tone/structure of the existing Google Ads 2.3 section)
- Whether to mention Meta's data retention period (Meta sets cookies up to 90 days — same as Google Ads row)
- Order of accept/decline behavior boxes within section 2.4 (follow 2.3 pattern)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Files to Modify
- `src/pages/personvern/index.astro` — Target file. Read in full before editing. Sections 2, 3, 4, 5, 6 all need Meta Pixel additions.

### Kill Switch Implementation (read-only reference)
- `src/layouts/BaseLayout.astro` — Contains `const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID || '';` and `if (pixelId)` guard. Kill switch already works.
- `src/layouts/LandingPageLayout.astro` — Same pattern as BaseLayout.

### Requirements
- `.planning/REQUIREMENTS.md` §PRIV-01, PRIV-02 — Exact acceptance criteria for this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `/personvern/index.astro` — Well-structured page with numbered `<section>` blocks inside a `.prose.prose-invert` wrapper. Each section uses `rounded-xl border border-white/5 bg-surface-raised p-6` card style.
- Existing Google Ads section (2.3) uses accept/decline behavior boxes with `rounded-lg bg-surface p-4` — reuse this exact pattern for Meta Pixel.

### Established Patterns
- Section structure: `<h2>` for numbered headers, `<h3>` for sub-headers, `<h4>` for behavior box titles
- Data processor entries in section 4: `<h4 class="font-medium text-text">` name + `<p class="text-sm text-text-muted">` description + `<p class="mt-1 text-xs text-text-muted">` location
- Table rows in sections 3 and 6: `<tr class="border-b border-white/5">` with `<td class="py-3">`

### Integration Points
- `.env.example` does not exist yet — create it at repo root with `PUBLIC_META_PIXEL_ID=` entry and comment

</code_context>

<specifics>
## Specific Ideas

- Meta Pixel fires site-wide (BaseLayout), unlike Google Ads which is landing-page only — the disclosure must be clear about this distinction. Section 2.3 says "(kun landingssider)" — section 2.4 should say "(alle sider)."
- The consent mechanism is shared: `nettup_ads_consent` localStorage key controls both Google and Meta consent. The privacy page should reflect this.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 37-privacy-compliance*
*Context gathered: 2026-03-28*
