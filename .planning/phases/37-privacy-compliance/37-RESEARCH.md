# Phase 37: Privacy & Compliance - Research

**Researched:** 2026-03-28
**Domain:** Privacy policy content updates + env documentation
**Confidence:** HIGH

## Summary

Phase 37 is a content-only phase: update the existing `/personvern` page to disclose Meta Pixel usage and document the kill switch in `.env.example`. No code changes, no new components, no new dependencies. Phase 36 already implemented the pixel and kill switch mechanism.

The personvern page (`src/pages/personvern/index.astro`) is a well-structured 373-line Astro file with 10 numbered sections. Five sections need Meta Pixel additions (sections 2, 3, 4, 5, 6) following the exact patterns already established by the Google Ads entries. The `.env.example` file exists but only has `ANTHROPIC_API_KEY` -- it needs a `PUBLIC_META_PIXEL_ID` entry.

**Primary recommendation:** Mirror the Google Ads patterns in each section exactly, substituting Meta-specific details. This is pattern replication, not creative work.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Add Meta Pixel as section 2.4 ("Meta Pixel (alle sider)") alongside existing 2.3 Google Ads section
- D-02: Section 2.4 must disclose: data processor (Meta/Facebook), purpose (ad measurement and retargeting), scope (alle sider), consent mechanism (same nettup_ads_consent localStorage key as Google)
- D-03: Add Meta (Facebook) as data processor entry in section 4 alongside Formspree, Plausible, Vercel, and Google
- D-04: Update section 3 table with "Male annonseeffekt (Meta Pixel)" row -- same legal basis as Google Ads
- D-05: Update section 5 to mention Meta Pixel cookies may be set site-wide when consent is granted
- D-06: Update section 6 table with Meta Pixel cookies row
- D-07: Update lastUpdated date to 2026-03-28
- D-08: PRIV-02 satisfied by documenting PUBLIC_META_PIXEL_ID in .env.example with comment that empty = disabled
- D-09: No separate PIXEL_ENABLED boolean flag -- the ID itself is the kill switch
- D-10: No privacy page mention of the kill switch -- ops concern, not user-facing

### Claude's Discretion
- Exact Norwegian wording for Meta Pixel section (follow tone/structure of existing Google Ads 2.3 section)
- Whether to mention Meta's data retention period (Meta sets cookies up to 90 days)
- Order of accept/decline behavior boxes within section 2.4 (follow 2.3 pattern)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PRIV-01 | /personvern page updated with Meta Pixel disclosure (data processor, purpose, consent mechanism) | Sections 2.4, 3, 4, 5, 6 all need Meta Pixel additions. Existing patterns in personvern/index.astro provide exact HTML structure to replicate. |
| PRIV-02 | Meta Pixel can be disabled via environment variable or config flag without code changes (kill switch) | Already implemented in BaseLayout.astro via `const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID \|\| ''` with `if (pixelId)` guard. Only documentation in .env.example remains. |
</phase_requirements>

## Architecture Patterns

### File Structure (no changes)
```
src/pages/personvern/index.astro   # Only content file to edit
.env.example                        # Add PUBLIC_META_PIXEL_ID entry
```

### Pattern: Privacy Section Card (from existing code)
**What:** Each numbered section uses identical card styling.
**Structure:**
```html
<section class="rounded-xl border border-white/5 bg-surface-raised p-6">
  <h2 class="mb-4 text-xl font-semibold text-text">X. Title</h2>
  <!-- content -->
</section>
```

### Pattern: Sub-section with Accept/Decline Boxes (section 2.3 -- replicate for 2.4)
```html
<h3 class="mb-3 mt-6 text-lg font-medium text-text">2.4 Meta Pixel (alle sider)</h3>
<p class="mb-3 text-text-muted">...</p>
<div class="mt-4 space-y-4">
  <div class="rounded-lg bg-surface p-4">
    <h4 class="font-medium text-text">Hvis du godtar</h4>
    <p class="text-sm text-text-muted">...</p>
  </div>
  <div class="rounded-lg bg-surface p-4">
    <h4 class="font-medium text-text">Hvis du avslår</h4>
    <p class="text-sm text-text-muted">...</p>
  </div>
</div>
```

### Pattern: Data Processor Entry (section 4)
```html
<div class="rounded-lg bg-surface p-4">
  <h4 class="font-medium text-text">Meta (Facebook)</h4>
  <p class="text-sm text-text-muted">Description of what Meta processes...</p>
  <p class="mt-1 text-xs text-text-muted">Lokasjon: USA (dekket av EU-US Data Privacy Framework)</p>
</div>
```

### Pattern: Table Row (sections 3 and 6)
```html
<tr class="border-b border-white/5">
  <td class="py-3">Male annonseeffekt (Meta Pixel)</td>
  <td class="py-3">Samtykke (GDPR art. 6(1)(a))</td>
</tr>
```

### Anti-Patterns to Avoid
- **Changing section numbering:** Sections 7-10 must NOT be renumbered. Meta Pixel additions go within existing sections 2-6.
- **Duplicating the consent key disclosure:** The `nettup_ads_consent` localStorage key is already mentioned in section 2.3. Section 2.4 should reference it as shared, not duplicate the explanation.

## Don't Hand-Roll

Not applicable -- this phase is pure content editing with no code logic.

## Common Pitfalls

### Pitfall 1: Forgetting to Update All Five Sections
**What goes wrong:** Adding section 2.4 but forgetting to update sections 3, 4, 5, or 6.
**Why it happens:** The privacy page has a scattered structure where one feature touches many sections.
**How to avoid:** Checklist approach -- verify D-01 through D-07 are all addressed.
**Warning signs:** Grep for "Meta" in the final file -- should appear in sections 2, 3, 4, 5, and 6.

### Pitfall 2: Inconsistent Scope Language
**What goes wrong:** Section 2.3 says "(kun landingssider)" but 2.4 must say "(alle sider)" since Meta Pixel loads in BaseLayout, not just LandingPageLayout.
**Why it happens:** Copy-paste from Google Ads section without adjusting scope.
**How to avoid:** CONTEXT.md explicitly flags this distinction. The pixel fires site-wide via BaseLayout.
**Warning signs:** Any mention of "landingssider" in the Meta Pixel section.

### Pitfall 3: .env.example Overwrite
**What goes wrong:** Overwriting the existing ANTHROPIC_API_KEY entry when adding PUBLIC_META_PIXEL_ID.
**How to avoid:** Append to the file, don't replace it. The file currently has one line.

## Code Examples

### Section 2.4 Key Content Points (Norwegian)
Based on existing 2.3 pattern and CONTEXT.md decisions:
- Title: "2.4 Meta Pixel (alle sider)"
- Intro: Meta Pixel used on all pages to measure ad effectiveness, loaded via BaseLayout
- Accept box: Meta can store cookies for conversion tracking and retargeting
- Decline box: No cookies stored, no personal data collected
- Consent reference: Same `nettup_ads_consent` localStorage key as Google Ads

### .env.example Addition
```bash
# Meta Pixel ID -- leave empty to disable Meta Pixel entirely (kill switch)
PUBLIC_META_PIXEL_ID=
```

## Kill Switch Verification (PRIV-02)

The kill switch is already implemented in code. Evidence from BaseLayout.astro:

```javascript
const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID || '';
// ...
if (pixelId) {
  // fbq setup only runs when pixelId is truthy
}
```

PRIV-02 requires only that this is **documented** so operators know how to use it. The `.env.example` comment satisfies this requirement.

## Meta Pixel Cookie Details

For sections 5 and 6, the planner needs these facts:
- **Cookie names:** `_fbp` (first-party, set by pixel), `_fbc` (click ID from ad click)
- **Retention:** Up to 90 days (same as Google Ads row already in section 6)
- **Scope:** Site-wide (all pages), unlike Google which is landing-page only
- **Consent-gated:** Cookies only set when `nettup_ads_consent` grants consent

**Confidence:** HIGH -- this is standard Meta Pixel behavior documented in Meta's developer docs.

## Open Questions

None. All decisions are locked in CONTEXT.md, the existing code is verified, and the patterns are clear from the current personvern page.

## Sources

### Primary (HIGH confidence)
- `src/pages/personvern/index.astro` -- read in full, all patterns extracted
- `src/layouts/BaseLayout.astro` -- kill switch implementation verified
- `.planning/phases/37-privacy-compliance/37-CONTEXT.md` -- all 10 decisions locked
- `.env.example` -- current state verified (1 line, ANTHROPIC_API_KEY only)

## Metadata

**Confidence breakdown:**
- Content patterns: HIGH -- extracted directly from existing personvern page
- Kill switch: HIGH -- verified in BaseLayout.astro code
- Meta Pixel cookie details: HIGH -- standard well-documented behavior
- Norwegian wording: HIGH -- following established patterns in existing sections

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- no moving parts)
