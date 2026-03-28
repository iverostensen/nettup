# Phase 32: Config & Conversion Flow - Research

**Researched:** 2026-03-19
**Domain:** Config migration, form redirect, conversion tracking, UTM capture
**Confidence:** HIGH

## Summary

This phase replaces two legacy config files (`launchOffer.ts` and `pricing.ts`) with a single `subscriptionOffer.ts`, builds a dedicated thank-you page at `/nettside-for-bedrift/takk` that fires both gtag and Plausible conversion events, changes form submission behavior from inline success to redirect, and captures UTM parameters from Google Ads URLs.

The codebase already has all the infrastructure needed: Consent Mode v2 with `window.gtagLoaded`/`window.gtag` globals, Plausible analytics wrapper in `src/lib/analytics.ts`, `LandingPageLayout.astro` with gtag and Plausible pre-loaded, Formspree integration via `fetch()` in React components, and sessionStorage patterns for cross-page state. No new dependencies are required.

**Primary recommendation:** This is purely a wiring phase. Use existing patterns (config export, analytics wrapper, LandingPageLayout, sessionStorage) and focus on clean migration of importers to avoid breaking city pages or the /kontakt form.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- `subscriptionOffer.ts` shape: price (monthlyPrice, setupPrice), features[], terms (binding, cancellation), upsellLinks[] to /tjenester, and meta (SEO title, description)
- Single export, no tiers, no package array
- Delete both `launchOffer.ts` and `pricing.ts` after migration
- Thank-you page at `/nettside-for-bedrift/takk` shows confirmation + next steps using `LandingPageLayout`
- Both gtag conversion event AND Plausible 'B2B Lead' event fire on /takk page load
- gtag conversion uses existing conversion ID/label pattern: `AW-17409050017/EvwaCNm05eFbEKGLpO1A`
- After successful Formspree POST (wait for 200), redirect to /takk -- no optimistic redirect
- Remove inline gtag conversion events from HeroMicroForm + ContactForm (b2b context). Events fire on /takk only.
- UTM capture: store `utm_source`, `utm_medium`, `utm_campaign` in sessionStorage on page load
- Standard 3 UTM params only. Include UTM data in Formspree payload.

### Claude's Discretion
- Whether to keep `pricing.ts` alive for ContactForm or inline the data
- Scarcity counter: keep (real, manual) or remove entirely
- Direct /takk visit event gating approach
- HeroMicroForm redirect vs inline success
- UTM field format in Formspree payload (separate fields vs JSON)
- UTM forwarding to /takk URL
- Exact Norwegian copy on thank-you page
- `steder/[location].astro` import of `remainingSlots` from launchOffer.ts needs migration

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LP-02 | `subscriptionOffer.ts` replaces `launchOffer.ts` + `pricing.ts` as single source of truth | Config pattern from existing `src/config/` files; importer audit completed below |
| TRACK-02 | Dedicated `/nettside-for-bedrift/takk` fires gtag + Plausible on page load | LandingPageLayout provides gtag/Plausible infrastructure; event firing patterns documented |
| TRACK-03 | Form submission redirects to `/takk` instead of inline success (b2b context) | Formspree fetch-then-redirect pattern documented; both form components audited |
| TRACK-05 | UTM parameters captured from URL and stored in form submission | sessionStorage pattern established in codebase; implementation approach documented |
</phase_requirements>

## Standard Stack

No new dependencies. Everything needed is already in the project.

### Core (Already Installed)
| Library | Purpose | Role in This Phase |
|---------|---------|-------------------|
| Astro 5 | Static site framework | New /takk page, config file |
| React | Islands architecture | Form redirect logic in HeroMicroForm + ContactForm |
| Formspree | Form backend | Existing integration, add UTM fields to payload |

### No New Dependencies Needed
This phase is pure wiring: config file, new Astro page, form behavior changes, UTM capture. All tools are already available.

## Architecture Patterns

### Config File Pattern (Established)
All config files in `src/config/` follow the same pattern: typed exports, no side effects, imported by both Astro and React components.

```typescript
// src/config/subscriptionOffer.ts -- follows existing pattern from services.ts, brand.ts
export interface SubscriptionOffer {
  price: {
    setupPrice: number;      // 0 (kr)
    monthlyPrice: number;    // 399 (kr)
  };
  features: string[];
  terms: {
    binding: string;         // e.g. "Ingen bindingstid"
    cancellation: string;    // e.g. "Nettsiden tas ned ved oppsigelse"
  };
  upsellLinks: Array<{
    label: string;
    href: string;
  }>;
  meta: {
    title: string;
    description: string;
  };
}

export const subscriptionOffer: SubscriptionOffer = {
  // ... values
};
```

### Analytics Event Pattern (Established)
`src/lib/analytics.ts` uses a `track()` helper with SSR guard and optional chaining:

```typescript
// Add to existing analytics.ts
export function trackB2BLead(): void {
  track('B2B Lead');
}
```

### Gtag Conversion Pattern (Established in HeroMicroForm)
```typescript
if (window.gtagLoaded && window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
  });
}
```

### Form Redirect Pattern (New, But Standard)
Current forms use `setStatus('success')` to show inline confirmation. The redirect pattern replaces this:

```typescript
// In handleSubmit, after response.ok:
if (response.ok) {
  // Redirect instead of inline success
  window.location.href = '/nettside-for-bedrift/takk';
  return;
}
```

No need for `window.location.replace()` -- standard `href` assignment is correct here because the user should be able to navigate back.

### UTM Capture Pattern
sessionStorage is already used in this codebase (FloatingNav animation state, ChatWidget history). UTM capture follows the same pattern:

```typescript
// On page load (in a useEffect or inline script):
const params = new URLSearchParams(window.location.search);
const utmFields = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
utmFields.forEach(key => {
  const value = params.get(key);
  if (value) sessionStorage.setItem(key, value);
});
```

```typescript
// In form submission, read from sessionStorage:
const utmSource = sessionStorage.getItem('utm_source') || '';
const utmMedium = sessionStorage.getItem('utm_medium') || '';
const utmCampaign = sessionStorage.getItem('utm_campaign') || '';
```

### Thank-You Page Structure
```
src/pages/nettside-for-bedrift/takk.astro    # New file
```
Uses `LandingPageLayout` (already has gtag + Plausible loaded). Fires events via `is:inline` script.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conversion tracking | Custom pixel/beacon | gtag + Plausible (already loaded in LandingPageLayout) | Infrastructure from Phase 31 handles consent, loading, defaults |
| UTM persistence | Cookie-based or custom storage | sessionStorage | Already used in codebase, survives same-tab navigation, auto-clears |
| Form backend | Custom API endpoint | Formspree (already configured) | Just add UTM fields to existing JSON payload |
| Analytics wrapper | Direct `window.plausible()` calls | `src/lib/analytics.ts` helper | SSR guard, consistent pattern, single import |

## Common Pitfalls

### Pitfall 1: Optimistic Redirect Before Formspree Confirms
**What goes wrong:** Redirecting to /takk before the fetch response arrives means data could be lost if the request fails.
**How to avoid:** Always `await` the Formspree fetch and check `response.ok` before redirecting. The CONTEXT.md explicitly requires this.
**Warning signs:** `window.location.href` appearing before `await fetch()` resolves.

### Pitfall 2: Breaking ContactForm on /kontakt When Changing B2B Behavior
**What goes wrong:** ContactForm is used in TWO contexts: `context="contact"` on /kontakt and `context="b2b"` on the landing page. Changes to redirect/event behavior must be gated by context.
**How to avoid:** All redirect and event-removal logic must check `context === 'b2b'` before executing. The /kontakt form should continue working exactly as before (inline success, Plausible tracking via `trackContactFormSubmit`).
**Warning signs:** Missing `if (context === 'b2b')` guard around redirect code.

### Pitfall 3: PricingSummary.astro Breaking During Migration
**What goes wrong:** PricingSummary imports both `launchOffer` and `pakker` from the old configs. If those files are deleted before Phase 33 rebuilds PricingSummary, the build breaks.
**How to avoid:** Two options: (a) update PricingSummary imports to use `subscriptionOffer` with compatible data, or (b) leave temporary re-exports in the old file locations. Option (a) is cleaner since PricingSummary is being rebuilt in Phase 33 anyway -- a minimal interim version that imports from `subscriptionOffer` works.
**Warning signs:** Build errors referencing deleted config files.

### Pitfall 4: steder/[location].astro remainingSlots Import
**What goes wrong:** City pages import `remainingSlots` from `launchOffer.ts`. Deleting that file breaks city pages.
**How to avoid:** Either export a `remainingSlots` equivalent from `subscriptionOffer.ts`, or inline the value directly in the city page template. Since the subscription model is different (no "X spots remaining" for city pages), the cleanest approach is to remove the scarcity reference entirely from city pages or replace with a static message.
**Warning signs:** Build failure on `steder/[location].astro`.

### Pitfall 5: UTM Parameters Lost on Internal Navigation
**What goes wrong:** If a user lands with UTMs, navigates to another page, and comes back, URL params are gone.
**How to avoid:** Capture UTMs into sessionStorage immediately on landing page load. Read from sessionStorage at form submission time, not from URL. sessionStorage persists across same-tab navigations.

### Pitfall 6: Duplicate Conversion Events
**What goes wrong:** If inline gtag events are not removed from form components AND the /takk page also fires events, each conversion gets counted twice.
**How to avoid:** Remove ALL inline gtag `conversion` event calls from HeroMicroForm and ContactForm (b2b context). Events fire exclusively on /takk page.
**Warning signs:** `window.gtag('event', 'conversion'` appearing in form component code after this phase.

## Code Examples

### 1. Thank-You Page with Conversion Events

```astro
---
// src/pages/nettside-for-bedrift/takk.astro
import LandingPageLayout from '@/layouts/LandingPageLayout.astro';
---

<LandingPageLayout
  title="Takk for henvendelsen | Nettup"
  description="Vi har mottatt din henvendelse og kontakter deg innen 24 timer."
>
  <main class="py-16 md:py-24">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-2xl text-center">
        <!-- Confirmation -->
        <div class="mb-8">
          <!-- success icon -->
          <h1 class="text-3xl font-bold md:text-4xl">Takk for henvendelsen!</h1>
          <p class="mt-4 text-lg text-text-muted">Vi kontakter deg innen 24 timer.</p>
        </div>

        <!-- Next steps -->
        <div class="rounded-2xl border border-white/10 bg-surface-raised p-8 text-left">
          <h2 class="text-xl font-semibold mb-6">Hva skjer na?</h2>
          <!-- 1. Vi ringer  2. Oppstartsm0te  3. Nettside klar -->
        </div>
      </div>
    </div>
  </main>
</LandingPageLayout>

<!-- Fire conversion events on page load -->
<script is:inline>
  // Gtag conversion (respects Consent Mode v2 -- fires regardless, Google handles consent state)
  if (window.gtagLoaded && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
    });
  }

  // Plausible 'B2B Lead' event
  if (window.plausible) {
    window.plausible('B2B Lead');
  }
</script>
```

### 2. Form Redirect After Successful Submission (ContactForm)

```typescript
// In ContactForm.tsx handleSubmit, after response.ok:
if (response.ok) {
  if (context === 'b2b') {
    // Redirect to thank-you page -- events fire there
    window.location.href = '/nettside-for-bedrift/takk';
    return;
  }
  // Non-b2b: keep existing inline success behavior
  setStatus('success');
  trackContactFormSubmit();
}
```

### 3. UTM Capture in sessionStorage

```typescript
// In a useEffect or inline script on the landing page:
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
    const value = params.get(key);
    if (value) sessionStorage.setItem(key, value);
  });
}, []);

// In form submission payload:
body: JSON.stringify({
  // ... existing fields
  utm_source: sessionStorage.getItem('utm_source') || '',
  utm_medium: sessionStorage.getItem('utm_medium') || '',
  utm_campaign: sessionStorage.getItem('utm_campaign') || '',
}),
```

## Importer Audit (Critical for Migration)

Files that import from `launchOffer.ts` or `pricing.ts` and need migration:

| File | Imports | Migration Strategy |
|------|---------|-------------------|
| `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` | `launchOffer`, `pakker` | Update to import from `subscriptionOffer.ts`. This component is rebuilt in Phase 33, so a minimal interim version is fine. |
| `src/pages/steder/[location].astro` | `remainingSlots` from `launchOffer` | Remove scarcity reference or replace with static content. Subscription model has no "slots". |
| `src/pages/kontakt/_sections/ContactForm.tsx` | `pakker` from `pricing.ts` | Used for `PAKKE_INFO` badge display. Options: (a) inline the 3-pakke data directly in ContactForm, (b) keep `pricing.ts` until Phase 33 simplifies the form. Option (b) is safest since Phase 33 removes the pakke dropdown entirely. |
| `src/pages/nettside-for-bedrift/_sections/FormSection.astro` | Uses `pakkeNames` local constant | No direct config import, but references pakke concepts. Phase 33 rewrites this. |
| `src/components/ui/ScarcityCounter.astro` | Takes `total`/`taken` props (no direct import) | Only used by PricingSummary. Will be unused after PricingSummary update. |

## Discretion Recommendations

Based on code analysis, these are the recommended approaches for Claude's discretion items:

### Keep `pricing.ts` for ContactForm: YES, keep it
**Reason:** ContactForm uses `pakker` to build `PAKKE_INFO` for the package badge on /kontakt. Phase 33 (LP-03) explicitly removes the pakke dropdown. Deleting `pricing.ts` now would require either inlining data or changing ContactForm twice. Keep it, delete in Phase 33.

### Scarcity counter: REMOVE entirely
**Reason:** LP-04 says "remove fake social proof". The `launchOffer.ts` counter (7/10 taken) is static and manually updated. The subscription model does not have a "limited spots" concept. Remove ScarcityCounter usage from PricingSummary. The component file itself can stay (no harm), but it should not be rendered.

### Direct /takk event gating: ALWAYS fire, no gating
**Reason:** Low-traffic page, pragmatic approach. Session flags add complexity. If someone bookmarks /takk and revisits, the extra event is negligible noise. Google Ads deduplicates conversions by click ID anyway.

### HeroMicroForm: REDIRECT to /takk (consistency)
**Reason:** Both forms on the landing page should have the same behavior. Inconsistency (one redirects, one shows inline) would be confusing. HeroMicroForm already collects email; after redirect, the /takk page confirms receipt.

### UTM field format: SEPARATE Formspree fields
**Reason:** Separate fields (`utm_source`, `utm_medium`, `utm_campaign`) allow filtering in Formspree dashboard without parsing JSON. This is the standard approach.

### UTM forwarding to /takk URL: NOT NEEDED
**Reason:** Plausible tracks the original landing page URL with UTMs. The /takk page fires a custom event (`B2B Lead`), not a pageview-with-attribution. Gtag conversion attribution uses the Google click ID, not UTM params on the thank-you page. No benefit to forwarding.

### steder/[location].astro migration: Replace with static pricing text
**Reason:** City pages should reference `/tjenester/nettside` pricing (existing `nettside.priceRange`), not subscription offer pricing. Remove the `remainingSlots` / `hasOffer` conditional entirely. Use the standard `nettside.priceRange` always.

## Open Questions

1. **PricingSummary interim content**
   - What we know: Phase 33 rebuilds PricingSummary as a single offer card. Phase 32 deletes `launchOffer.ts`.
   - What's unclear: How much effort to put into an interim PricingSummary that reads from `subscriptionOffer.ts`.
   - Recommendation: Minimal -- replace the 3-tier grid with a single card showing the subscription offer. It will be replaced again in Phase 33 but the page must not break.

2. **Plausible goal setup**
   - What we know: `trackB2BLead()` will fire `'B2B Lead'` via `window.plausible()`.
   - What's unclear: Whether the 'B2B Lead' goal needs to be created in Plausible dashboard first.
   - Recommendation: Plausible auto-discovers custom events on first fire. No dashboard setup required before deployment, but document that the goal should be pinned in Plausible dashboard after first conversion.

## Sources

### Primary (HIGH confidence)
- `src/config/launchOffer.ts` -- current config being replaced (read directly)
- `src/config/pricing.ts` -- current config being replaced (read directly)
- `src/components/islands/HeroMicroForm.tsx` -- current form with inline gtag (read directly)
- `src/pages/kontakt/_sections/ContactForm.tsx` -- current form with inline gtag + Plausible (read directly)
- `src/layouts/LandingPageLayout.astro` -- layout with gtag Consent Mode v2 + Plausible (read directly)
- `src/lib/analytics.ts` -- Plausible wrapper pattern (read directly)
- `src/pages/steder/[location].astro` -- remainingSlots importer (read directly)
- `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro` -- dual config importer (read directly)
- `.planning/phases/32-config-conversion-flow/32-CONTEXT.md` -- locked decisions (read directly)

### Secondary (MEDIUM confidence)
- Formspree fetch API behavior (standard REST, verified by existing codebase usage)
- sessionStorage persistence behavior (standard Web API)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all patterns exist in codebase
- Architecture: HIGH -- follows established config/analytics/layout patterns
- Pitfalls: HIGH -- identified through direct code audit of all importers and integration points

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable; no external dependencies changing)
