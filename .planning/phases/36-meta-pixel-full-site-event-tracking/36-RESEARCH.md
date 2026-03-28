# Phase 36: Meta Pixel & Full-Site Event Tracking - Research

**Researched:** 2026-03-28
**Domain:** Meta Pixel SDK, consent management, Astro inline scripts, Facebook event tracking
**Confidence:** HIGH

## Summary

This phase adds Meta Pixel tracking to the entire nettup.no site with consent-aware loading, conversion events on key pages, and expanded UTM attribution. The existing codebase already has a well-structured consent IIFE in LandingPageLayout.astro that handles Google Ads Consent Mode v2 -- extending it with `fbq('consent', 'revoke/grant')` is a straightforward parallel addition.

The primary technical challenge is that BaseLayout.astro uses `<ClientRouter />` (Astro view transitions), which changes how inline scripts execute during client-side navigation. The Meta Pixel base code must load exactly once (not re-execute on every navigation), while per-page ViewContent events need `data-astro-rerun` to fire on each page visit via client-side navigation.

**Primary recommendation:** Extend the existing consent IIFE pattern to handle both gtag and fbq in a unified script, inject the pixel ID from `PUBLIC_META_PIXEL_ID` env var via `define:vars`, and use `data-astro-rerun` on per-page tracking scripts for correct view transition behavior.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Meta Pixel base code goes in BaseLayout.astro only -- site-wide coverage from a single location
- **D-02:** LandingPageLayout stays independent (own `<html>`/`<head>`) but imports the same shared consent+pixel script. No inheritance refactor.
- **D-03:** Consent banner moves to BaseLayout so it appears on ALL pages (legally required since pixel fires site-wide)
- **D-04:** Pixel ID read from `PUBLIC_META_PIXEL_ID` env var -- supports Phase 37 kill switch and per-environment config
- **D-05:** ViewContent events use service slug as content_name: 'Priskalkulator', 'Nettside', 'Nettbutikk', 'Landingsside' -- clean segments in Ads Manager
- **D-06:** Stick to success criteria pages only (4 ViewContent + 1 landing page ViewContent + 1 Lead on /takk). No additional pages.
- **D-07:** Events placed as inline `<script is:inline>` blocks per page, consent-gated. Same pattern as existing /takk conversion tracking.
- **D-08:** Single unified IIFE handles both gtag and fbq consent together. `fbq('consent','revoke')` before `fbq('init')`, then accept triggers both `gtag('consent','update')` and `fbq('consent','grant')` in one click using existing `nettup_ads_consent` localStorage key.
- **D-09:** Consent banner button parity (TRACK-03) fixed in this phase -- both accept and decline get equal solid styling.
- **D-10:** Expand UTM_KEYS in utm.ts from 3 to 5 params (add utm_content + utm_term)
- **D-11:** All 5 UTM params sent as hidden fields in Formspree submissions for full attribution in dashboard
- **D-12:** sessionStorage is sufficient for cross-page persistence (same-tab navigation). No URL forwarding to /takk needed.

### Claude's Discretion
- Exact script ordering within the unified consent IIFE (gtag first vs fbq first)
- Consent banner copy wording adjustments if needed for Meta Pixel mention
- Whether to extract the consent script into a shared .astro partial or keep it inline in both layouts

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TRACK-01 | Meta Pixel base code loads with `fbq('consent','revoke')` before `fbq('init')` | Meta GDPR docs confirm: revoke -> init -> PageView is the correct order. Pixel loads but withholds data transmission until grant. |
| TRACK-02 | Consent banner accept/decline triggers `fbq('consent','grant')` alongside existing `gtag('consent','update')` | Both APIs support runtime consent toggling. Unified IIFE pattern extends naturally. |
| TRACK-03 | Consent banner buttons have equal visual prominence (solid styling for both) | Current decline button uses ghost style (`border border-white/10`), accept uses solid (`bg-brand`). Fix: both solid. |
| TRACK-04 | `fbq('track','ViewContent')` fires on /nettside-for-bedrift page load (consent-gated) | Standard event with `content_name` parameter. Consent-gated via localStorage check before firing. |
| TRACK-05 | `fbq('track','Lead')` fires on /nettside-for-bedrift/takk alongside existing gtag conversion | Extends existing dual-event pattern (gtag + Plausible) with third fbq call. |
| TRACK-06 | UTM capture expanded to 5 params (add utm_content + utm_term) | Simple array expansion in utm.ts UTM_KEYS constant. Forms already spread `getUtmParams()` result. |
| TRACK-07 | Meta Pixel loaded via BaseLayout.astro for site-wide retargeting | (Not defined in REQUIREMENTS.md -- implied by success criterion 6 and D-01. Treat as: pixel in BaseLayout, consent banner in BaseLayout.) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Meta Pixel SDK (fbevents.js) | 2.0 | Facebook/Instagram ad tracking | Only official SDK for Meta ad attribution and retargeting |
| Astro | 5.x (existing) | SSG framework | Already in use -- inline scripts and `define:vars` for pixel ID injection |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| No new dependencies | -- | -- | All tracking is via inline scripts loading the Meta CDN SDK |

**No npm packages needed.** Meta Pixel is loaded from `connect.facebook.net/en_US/fbevents.js` via inline script, identical to how gtag.js is loaded from `googletagmanager.com`.

## Architecture Patterns

### Consent + Pixel Loading Architecture

```
BaseLayout.astro <head>
├── Plausible (cookieless, always loads, no consent needed)
├── Unified consent IIFE:
│   ├── 1. gtag consent defaults (denied)
│   ├── 2. fbq('consent','revoke')          ← NEW
│   ├── 3. Check localStorage for prior consent
│   ├── 4. If granted: gtag update + fbq('consent','grant')
│   ├── 5. Load gtag.js (async)
│   ├── 6. Load fbevents.js (async)         ← NEW
│   ├── 7. fbq('init', PIXEL_ID)            ← NEW
│   ├── 8. fbq('track','PageView')          ← NEW
│   └── 9. gtag('config', GTAG_ID)
└── Consent banner HTML (moved from LandingPageLayout)

LandingPageLayout.astro <head>
├── Plausible (same as BaseLayout)
└── Same unified consent IIFE (duplicated or extracted to partial)

Per-page inline scripts:
├── /nettside-for-bedrift/index.astro → fbq('track','ViewContent',{content_name:'B2B Landingsside'})
├── /nettside-for-bedrift/takk.astro  → fbq('track','Lead') + existing gtag + Plausible
├── /priskalkulator/index.astro       → fbq('track','ViewContent',{content_name:'Priskalkulator'})
├── /tjenester/nettside/index.astro   → fbq('track','ViewContent',{content_name:'Nettside'})
├── /tjenester/nettbutikk/index.astro → fbq('track','ViewContent',{content_name:'Nettbutikk'})
└── /tjenester/landingsside/index.astro → fbq('track','ViewContent',{content_name:'Landingsside'})
```

### Pattern 1: Meta Pixel Base Code with Consent
**What:** The official Meta Pixel SDK loaded with consent revoked by default
**When to use:** In both layout files, once each
**Example:**
```javascript
// Source: https://developers.facebook.com/docs/meta-pixel/implementation/gdpr
// Order is CRITICAL: revoke -> init -> PageView
fbq('consent', 'revoke');
fbq('init', PIXEL_ID);
fbq('track', 'PageView');
```

### Pattern 2: Unified Consent IIFE (extending existing)
**What:** Single IIFE that manages both gtag and fbq consent state
**When to use:** In the layout `<head>`, before any tracking scripts
**Example:**
```javascript
// Source: Existing LandingPageLayout.astro pattern, extended
(function() {
  var GTAG_ID = 'AW-17409050017';
  var PIXEL_ID = /* injected from env */;
  var CONSENT_KEY = 'nettup_ads_consent';

  // --- gtag setup (existing) ---
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
  });

  // --- fbq setup (NEW) ---
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

  fbq('consent', 'revoke');

  // Check stored consent before init
  var stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    gtag('consent', 'update', { /* all granted */ });
    fbq('consent', 'grant');
  }

  // Load gtag.js
  var gs = document.createElement('script');
  gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
  gs.async = true;
  document.head.appendChild(gs);

  // Initialize both
  gtag('js', new Date());
  gtag('config', GTAG_ID);
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  window.gtagLoaded = true;

  // Banner visibility
  if (stored === null) {
    document.getElementById('cookie-banner')?.classList.remove('hidden');
  }

  // Accept handler
  document.getElementById('cookie-accept')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    gtag('consent', 'update', { /* all granted */ });
    fbq('consent', 'grant');
    hideBanner();
  });

  // Decline handler
  document.getElementById('cookie-decline')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    hideBanner();
  });

  function hideBanner() { /* existing animation logic */ }
})();
```

### Pattern 3: Per-Page ViewContent Event (consent-gated)
**What:** Inline script on specific pages that fires fbq events only if consent was granted
**When to use:** On each retargeting target page
**Example:**
```html
<!-- In an Astro page using BaseLayout (has view transitions) -->
<script is:inline data-astro-rerun>
  if (localStorage.getItem('nettup_ads_consent') === 'granted' && window.fbq) {
    fbq('track', 'ViewContent', { content_name: 'Nettside' });
  }
</script>
```

### Pattern 4: Env Var Injection via define:vars
**What:** Passing `PUBLIC_META_PIXEL_ID` from Astro frontmatter into inline script
**When to use:** In layout files where the consent IIFE needs the pixel ID
**Example:**
```astro
---
const pixelId = import.meta.env.PUBLIC_META_PIXEL_ID || '';
---
<script is:inline define:vars={{ pixelId }}>
  // pixelId is now available as a local variable
  if (pixelId) {
    fbq('init', pixelId);
  }
</script>
```

**Alternative (simpler, matches existing gtag pattern):** Since the existing gtag ID is hardcoded in the IIFE, an equally valid approach is to use `define:vars` to inject just the pixel ID into the IIFE scope, or use a `<script>` tag with `set:html` for the entire IIFE string. The `define:vars` approach is cleanest.

### Anti-Patterns to Avoid
- **Loading pixel without consent revoke first:** Norwegian Datatilsynet actively enforces. `fbq('consent','revoke')` MUST come before `fbq('init')`.
- **Using `import.meta.env` inside `is:inline` scripts:** Astro does NOT process env vars in inline scripts. Use `define:vars` or template expressions in frontmatter.
- **Relying on script re-execution with ClientRouter:** BaseLayout uses `<ClientRouter />` which deduplicates identical inline scripts. Per-page event scripts MUST use `data-astro-rerun` attribute to fire on every client-side navigation visit.
- **Firing events without checking fbq exists:** The pixel SDK loads async. Always guard with `window.fbq` check.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Consent management | Custom consent state machine | Extend existing IIFE pattern with localStorage | Already battle-tested in v1.6, single key controls both gtag and fbq |
| Meta Pixel loading | Custom fetch/eval | Official fbevents.js loader snippet | The minified loader is Meta's standard; modifying it breaks updates |
| UTM capture | Manual URL parsing per page | Extend existing utm.ts module | Centralized, typed, already integrated into form components |

**Key insight:** This phase is an extension of existing patterns, not new architecture. Every piece has a working analog in the codebase already.

## Common Pitfalls

### Pitfall 1: Consent Revoke Order
**What goes wrong:** Pixel fires data to Facebook before user consents, violating GDPR/Norwegian E-Com Act
**Why it happens:** `fbq('init')` called before `fbq('consent','revoke')`, or fbevents.js loaded before revoke call
**How to avoid:** The fbq loader snippet creates a queue. Call `fbq('consent','revoke')` immediately after the loader runs, BEFORE `fbq('init')`. The queue ensures order is preserved.
**Warning signs:** Events appearing in Meta Events Manager from users who never accepted the consent banner

### Pitfall 2: View Transitions Script Deduplication
**What goes wrong:** Per-page ViewContent events don't fire when navigating between pages using client-side navigation (Astro view transitions)
**Why it happens:** `<ClientRouter />` deduplicates inline scripts that have identical content. Even different pages with similar tracking scripts may not re-execute.
**How to avoid:** Add `data-astro-rerun` attribute to all per-page tracking scripts. This forces re-execution after every view transition.
**Warning signs:** ViewContent events fire on initial page load but not when navigating between pages without a full page reload

### Pitfall 3: Pixel ID Not Available in is:inline Scripts
**What goes wrong:** `import.meta.env.PUBLIC_META_PIXEL_ID` evaluates to undefined or literal string in the browser
**Why it happens:** Astro does not process `import.meta.env` replacements inside `is:inline` script tags
**How to avoid:** Read the env var in the Astro frontmatter and pass it via `define:vars={{ pixelId }}` or construct the script string with template expressions and use `set:html`
**Warning signs:** `fbq('init', undefined)` or `fbq('init', 'import.meta.env.PUBLIC_META_PIXEL_ID')` in browser console

### Pitfall 4: Consent Banner on BaseLayout with View Transitions
**What goes wrong:** Consent banner re-appears after accepting when navigating to another page, or banner click handlers don't bind after navigation
**Why it happens:** View transitions swap the page DOM but may re-render the banner HTML. Event listeners attached in the IIFE may not survive the swap.
**How to avoid:** The consent IIFE should check `localStorage` before showing the banner (already does this). The banner should be removed from DOM on accept/decline (existing `hideBanner()` removes it). For view transitions, the IIFE runs once on initial load; subsequent navigations don't re-execute it (which is correct -- the banner is already gone). Use `transition:persist` on the banner div if needed, or rely on the localStorage check.
**Warning signs:** Banner flashes on navigation, or accept button stops working after page transition

### Pitfall 5: Double PageView Events
**What goes wrong:** `fbq('track','PageView')` fires twice on client-side navigation
**Why it happens:** The base code IIFE fires PageView on load, and if the script runs again after navigation, it fires again
**How to avoid:** The IIFE in BaseLayout should NOT have `data-astro-rerun`. It should execute once on initial page load only. Meta Pixel does not natively integrate with SPAs -- for a static site with view transitions, the single PageView on initial load is acceptable. (If full SPA-style PageView tracking per navigation is desired later, that's a v2 concern.)
**Warning signs:** Events Manager shows 2x PageView count vs actual page loads

### Pitfall 6: LandingPageLayout Already Has Its Own HTML
**What goes wrong:** Trying to share the consent IIFE by having LandingPageLayout extend BaseLayout
**Why it happens:** LandingPageLayout has its own complete `<html>`, `<head>`, `<body>` -- it's not a slot-based child of BaseLayout
**How to avoid:** Per D-02, keep both layouts independent. Duplicate the consent IIFE in both (or extract to a shared `.astro` partial component that both layouts include). The IIFE is ~60 lines, duplication is acceptable if a partial feels over-engineered.
**Warning signs:** Broken HTML structure, missing head elements

## Code Examples

### Existing Code: Consent IIFE (LandingPageLayout.astro:186-259)
The current pattern handles gtag only. Key structure:
1. Define dataLayer and gtag function
2. Set consent defaults to denied
3. Check localStorage for stored consent
4. Load gtag.js async
5. Initialize gtag config
6. Show/hide banner based on stored consent
7. Accept/decline click handlers update consent + localStorage

### Existing Code: Dual Event Firing (takk.astro:69-81)
```javascript
// Current pattern: gtag conversion + Plausible
if (window.gtagLoaded && window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
  });
}
if (window.plausible) {
  window.plausible('B2B Lead');
}
// NEW: Add fbq Lead event here
```

### Existing Code: UTM Capture (utm.ts)
```typescript
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
// Expand to:
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
```

### New: Consent Banner Button Parity (TRACK-03)
```html
<!-- Current decline button (ghost style): -->
<button class="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-text-muted ...">Avslå</button>

<!-- Fix: equal solid styling for both buttons -->
<button class="rounded-full bg-slate-700 px-4 py-2 text-sm font-medium text-text ...">Avslå</button>
<button class="rounded-full bg-brand px-4 py-2 text-sm font-medium text-surface ...">Godta</button>
```

### fbq Standard Event Reference
```javascript
// Source: https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/
// ViewContent -- use on service pages for retargeting segmentation
fbq('track', 'ViewContent', {
  content_name: 'Nettside',  // or 'Nettbutikk', 'Landingsside', 'Priskalkulator'
});

// Lead -- use on /takk page for conversion tracking
fbq('track', 'Lead');
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Load pixel unconditionally | Consent Mode: revoke before init | 2023 (GDPR enforcement wave) | Mandatory for EU/EEA sites |
| Separate consent for each ad platform | Unified consent key for all platforms | Current best practice | One click grants/denies all ad tracking |
| `noscript` pixel fallback image | Optional (most users have JS) | Always available but less critical | Include for completeness but not essential |

**Deprecated/outdated:**
- Facebook Pixel (old name): Now called "Meta Pixel" -- same SDK, same API, rebranded
- Custom Audiences pixel: Merged into Meta Pixel years ago
- `window.fbq` without the loader snippet: The minified IIFE loader must be used

## Open Questions

1. **Meta Pixel ID availability**
   - What we know: D-04 requires `PUBLIC_META_PIXEL_ID` env var. STATE.md notes "Meta Pixel ID needed from Meta Business Account before Phase 36 implementation."
   - What's unclear: Whether the pixel ID has been created yet in Meta Business Manager.
   - Recommendation: Implementation can proceed with the env var pattern. The pixel ID is a simple numeric string set in Vercel dashboard. Code works without it (no-op when empty).

2. **TRACK-07 not defined in REQUIREMENTS.md**
   - What we know: The roadmap references TRACK-07 in Phase 36's requirements list, but REQUIREMENTS.md only defines TRACK-01 through TRACK-06.
   - What's unclear: Whether this was an oversight or intentional.
   - Recommendation: Treat success criterion 6 ("Meta Pixel loaded via BaseLayout.astro for site-wide retargeting") as the implicit TRACK-07. This is covered by D-01.

3. **Shared partial vs duplicated IIFE**
   - What we know: Both BaseLayout and LandingPageLayout need the same consent+pixel IIFE. D-02 says LandingPageLayout stays independent.
   - What's unclear: Whether extracting to a shared `.astro` partial is worth the indirection.
   - Recommendation: Extract to a shared partial (e.g., `src/components/layout/ConsentPixel.astro`). The IIFE is ~70 lines with both gtag and fbq. Duplicating it means maintaining two copies. A partial is a single source of truth with no runtime cost (Astro components are zero-JS).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (already configured) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements - Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TRACK-01 | Pixel loads with consent revoke before init | manual | Visual: check Meta Pixel Helper browser extension | N/A |
| TRACK-02 | Accept triggers both gtag update + fbq grant | manual | Visual: check Events Manager + localStorage | N/A |
| TRACK-03 | Banner buttons have equal visual prominence | manual | Visual inspection | N/A |
| TRACK-04 | ViewContent fires on /nettside-for-bedrift | manual | Meta Pixel Helper extension on page load | N/A |
| TRACK-05 | Lead fires on /takk alongside gtag | manual | Navigate to /takk, check Pixel Helper | N/A |
| TRACK-06 | UTM capture includes 5 params | unit | `npx vitest run` | Wave 0 |
| TRACK-07 | Pixel in BaseLayout (site-wide) | manual | Visit any BaseLayout page, check Pixel Helper | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (verifies no Astro build errors)
- **Per wave merge:** `npm run build && npx vitest run`
- **Phase gate:** Build clean + manual verification with Meta Pixel Helper extension

### Wave 0 Gaps
- [ ] `src/lib/__tests__/utm.test.ts` -- covers TRACK-06 (UTM expansion from 3 to 5 params)
- No other automated tests applicable -- pixel tracking is browser-runtime behavior verified via Meta Pixel Helper extension and Events Manager

## Project Constraints (from CLAUDE.md)

- **Norwegian content:** All user-facing text (consent banner copy) must be in Norwegian (bokmal)
- **No attribution comments:** Never include "Co-Authored-By", "Generated with Claude", or similar
- **TypeScript strict mode:** utm.ts changes must maintain strict typing
- **Mobile-first:** Consent banner must work on 375px screens (already does)
- **Performance:** LCP < 2s -- pixel loads async, should not impact
- **Conventional commits:** Use `feat(tracking):`, `feat(consent):` prefixes

## Sources

### Primary (HIGH confidence)
- [Meta Pixel GDPR docs](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- consent revoke/grant API, order of operations
- [Meta Pixel Get Started](https://developers.facebook.com/docs/meta-pixel/get-started/) -- official base code snippet, fbevents.js loader
- [Meta Pixel Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/) -- ViewContent, Lead event parameters
- [Meta Pixel Standard Events](https://www.facebook.com/business/help/402791146561655) -- content_name parameter reference
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/) -- script re-execution behavior, data-astro-rerun
- [Astro Template Directives](https://docs.astro.build/en/reference/directives-reference/) -- define:vars, is:inline behavior

### Secondary (MEDIUM confidence)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/) -- PUBLIC_ prefix, inline script limitation
- [Astro Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/) -- script processing in Astro

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Meta Pixel SDK is the only option for Meta ad tracking; no library choices to make
- Architecture: HIGH -- extending well-understood existing patterns (consent IIFE, inline scripts, UTM module)
- Pitfalls: HIGH -- view transitions script behavior and consent order are verified against official Astro and Meta docs

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (Meta Pixel API is stable; Astro 5 view transitions API is stable)
