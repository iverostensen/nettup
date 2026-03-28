# Architecture Patterns

**Domain:** Meta Pixel + Ad Creative Integration for Existing Astro 5 Landing Page
**Researched:** 2026-03-28
**Confidence:** HIGH (based on direct codebase analysis + Meta official GDPR docs + existing consent infrastructure)

## Recommended Architecture

### Overview

Meta Pixel integrates into the existing LandingPageLayout.astro alongside the current Google Ads Consent Mode v2 infrastructure. The consent banner extends to control both `gtag` and `fbq`. Ad creative templates live in `.planning/` as reference-only assets (not source code). UTM expansion is a backward-compatible additive change to `src/lib/utm.ts`.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `LandingPageLayout.astro` | Loads fbq script + gtag script, manages unified consent banner | Cookie banner, consent state in localStorage |
| `src/lib/utm.ts` | Captures all 5 UTM params from URL to sessionStorage | HeroMicroForm, ContactForm (via getUtmParams) |
| `src/lib/meta-pixel.ts` | Type-safe fbq wrapper with SSR guard | takk.astro, landing page index.astro |
| `src/pages/nettside-for-bedrift/takk.astro` | Fires gtag conversion + fbq Lead + Plausible B2B Lead | LandingPageLayout (inherits pixel + consent) |
| `src/pages/nettside-for-bedrift/index.astro` | Fires fbq ViewContent on page load | LandingPageLayout (inherits pixel + consent) |
| `src/pages/personvern/index.astro` | Discloses Meta Pixel in privacy policy | N/A (static content) |
| `.planning/ads/` | Ad creative templates + copy + strategy docs | N/A (reference only, not built) |

### Data Flow

```
User clicks Facebook Ad
  --> /nettside-for-bedrift/?utm_source=facebook&utm_medium=cpc&utm_campaign=...&utm_content=...&utm_term=...
  --> LandingPageLayout loads:
      1. Plausible (always, cookieless)
      2. fbq script (always loads, consent revoked by default)
      3. gtag script (always loads, consent denied by default)
      4. Cookie banner shown if no stored choice
  --> utm.ts captures all 5 params to sessionStorage
  --> fbq('track', 'ViewContent') fires (consent-gated by fbq revoke/grant)
  --> User fills form --> redirected to /takk
  --> takk.astro fires:
      - fbq('track', 'Lead')
      - gtag('event', 'conversion', {...})
      - plausible('B2B Lead')
```

## Integration Details

### Q1: Where does fbq() go relative to existing gtag in LandingPageLayout?

**Answer:** In the same inline script block (lines 186-259 of LandingPageLayout.astro), inside the existing IIFE. Both share the same consent key (`nettup_ads_consent`) and the same banner UI.

The existing consent script follows this order:
1. Define dataLayer + gtag function
2. Set gtag consent defaults to denied
3. Check localStorage for stored consent
4. Load gtag.js script
5. Initialize gtag
6. Show/hide cookie banner
7. Handle accept/decline clicks

Meta Pixel inserts into this same IIFE. The new order becomes:

```
1.  Define dataLayer + gtag function
2.  Set gtag consent defaults to denied
3.  Define fbq function (inline bootstrap)
4.  fbq('consent', 'revoke')          <-- CRITICAL: before init
5.  Load fbevents.js async
6.  fbq('init', 'PIXEL_ID')
7.  fbq('track', 'PageView')
8.  Check localStorage for stored consent
9.  If granted: gtag consent update + fbq('consent', 'grant')
10. Load gtag.js script
11. Initialize gtag
12. Show/hide cookie banner
13. Accept handler: localStorage + gtag update + fbq('consent', 'grant')
14. Decline handler: localStorage (defaults already denied/revoked)
```

**Key constraint:** `fbq('consent', 'revoke')` MUST be called before `fbq('init')`. This is the Meta Pixel equivalent of Google's denied-by-default pattern. When revoked, fbq queues events but does not send cookies or data to Meta until `fbq('consent', 'grant')` is called.

**Confidence: HIGH** -- Verified against Meta's official GDPR documentation at developers.facebook.com/docs/meta-pixel/implementation/gdpr.

### Q2: How should the consent banner extend to control both gtag and fbq?

**Answer:** The existing banner already controls gtag. It needs only two additions:

1. **Accept handler** (line 232-239): add `fbq('consent', 'grant')` after the existing `gtag('consent', 'update', ...)`.
2. **Stored-consent-granted check** (line 205-211): add `fbq('consent', 'grant')` after the existing `gtag('consent', 'update', ...)`.

The decline handler needs no change because `fbq('consent', 'revoke')` is the default state set at script load. The same `nettup_ads_consent` localStorage key controls both platforms.

The banner text currently says "Vi bruker informasjonskapsler for a male annonseeffekt." This remains accurate -- Meta Pixel is another ad measurement tool. The text is generic enough to cover both Google and Meta without naming either.

**No new UI components needed.** The existing cookie banner handles everything.

### Q3: Should ad creative templates live in src/templates/ads/ or .planning/?

**Answer: `.planning/ads/`** -- reference-only, not source code.

Rationale:
- Ad creatives are static image files designed in Figma/Canva, not generated by the Astro build
- They are uploaded directly to Meta Ads Manager, not served by the website
- Putting them in `src/` adds build artifacts and clutters the source tree with binaries
- The custom OG image for /nettside-for-bedrift IS source code (served by the site) and goes in `public/images/`

Proposed structure:
```
.planning/ads/
  creatives/
    feed-1080x1080-variant-a.png     (or Figma link references)
    feed-1080x1080-variant-b.png
    story-1080x1920-variant-a.png
    story-1080x1920-variant-b.png
  copy/
    FACEBOOK-AD-COPY.md              (all hook/body/CTA variants)
    LEAD-FORM-SPEC.md                (exact fields, thank-you screen)
  strategy/
    MULTI-CHANNEL-STRATEGY.md        (Facebook > Google long-tail > TikTok)
    AUDIENCE-TARGETING.md            (demographics, interests, lookalikes)
    AB-TESTING-PLAN.md               (kill criteria, scaling rules)
```

**Exception:** The custom OG image for `/nettside-for-bedrift` belongs in `public/images/og-nettside-for-bedrift.jpg` because it is served by the website when the landing page URL is shared on social media. This is the ONLY ad-adjacent asset that goes in source.

### Q4: How does UTM expansion affect existing sessionStorage capture?

**Answer:** Backward-compatible additive change. Expand the `UTM_KEYS` tuple from 3 to 5 entries.

Current `src/lib/utm.ts`:
```typescript
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
```

New:
```typescript
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
```

This is the **only change needed**. Both `captureUtmParams()` and `getUtmParams()` iterate over `UTM_KEYS`, so adding entries automatically captures and retrieves the new params. Existing form submissions (HeroMicroForm, ContactForm) already use `...getUtmParams()` spread syntax, so new fields flow through to Formspree payloads without any form code changes.

**No breaking change.** If `utm_content` or `utm_term` are absent from the URL, they are simply not stored or sent. The `if (value)` guard in `captureUtmParams()` and the same guard in `getUtmParams()` handle this gracefully.

**Why these two params matter for Facebook:** `utm_content` identifies which ad creative (e.g., "feed-variant-a" vs "story-variant-b") drove the visit. `utm_term` identifies the audience segment. Together they enable Formspree-side attribution of which creative and audience produce leads.

### Q5: New files vs modifications to existing?

#### New Files

| File | Purpose | Type |
|------|---------|------|
| `src/lib/meta-pixel.ts` | Type-safe fbq wrapper (SSR guard, typed events) | TypeScript module |
| `public/images/og-nettside-for-bedrift.jpg` | Custom OG image for landing page with price offer (1200x630) | Static asset |
| `.planning/ads/copy/FACEBOOK-AD-COPY.md` | All ad copy variants (hook/body/CTA) | Documentation |
| `.planning/ads/copy/LEAD-FORM-SPEC.md` | Facebook lead form specification | Documentation |
| `.planning/ads/strategy/MULTI-CHANNEL-STRATEGY.md` | Channel phasing strategy | Documentation |
| `.planning/ads/strategy/AUDIENCE-TARGETING.md` | Audience definitions + targeting specs | Documentation |
| `.planning/ads/strategy/AB-TESTING-PLAN.md` | Test plan with kill criteria and scaling rules | Documentation |
| `.planning/ads/creatives/` (directory) | Ad image templates (4x feed 1080x1080 + 2x story 1080x1920) | Image assets |

#### Modified Files

| File | Change | Scope |
|------|--------|-------|
| `src/layouts/LandingPageLayout.astro` | Add fbq bootstrap + consent integration into existing inline script | ~30 lines added to existing IIFE |
| `src/lib/utm.ts` | Add `'utm_content'` and `'utm_term'` to UTM_KEYS tuple | 1 line change |
| `src/pages/nettside-for-bedrift/takk.astro` | Add `fbq('track', 'Lead')` to existing conversion script | ~5 lines added |
| `src/pages/nettside-for-bedrift/index.astro` | Add ViewContent event inline script + custom OG image prop | ~8 lines added |
| `src/pages/personvern/index.astro` | Add Meta Pixel / Facebook disclosure section (Norwegian) | ~40 lines of content |

#### Unchanged Files (verification)

| File | Why Unchanged |
|------|---------------|
| `src/layouts/BaseLayout.astro` | Meta Pixel only runs on landing pages, not the main site |
| `src/lib/analytics.ts` | Plausible wrapper stays separate; Meta events are a different tracking system |
| `src/components/islands/HeroMicroForm.tsx` | Already calls `captureUtmParams()` and `getUtmParams()` -- UTM expansion flows through automatically |
| `src/pages/kontakt/_sections/ContactForm.tsx` | Same -- spread `...getUtmParams()` picks up new params |
| `src/config/brand.ts` | Design tokens used for ad creatives are referenced in .planning/ design specs, not code |
| `src/config/subscriptionOffer.ts` | Offer data unchanged |

### Q6: Build order considering existing consent infrastructure

Dependencies flow top-down. The consent banner in LandingPageLayout is the foundation everything else depends on.

#### Recommended Build Order

```
Step 1: UTM Expansion (src/lib/utm.ts)
  |  No dependencies. Safe additive change.
  |  Immediately available to all forms via existing getUtmParams() spread.
  v
Step 2: Meta Pixel in LandingPageLayout (consent integration)
  |  Depends on: understanding existing consent IIFE structure
  |  Changes: add fbq bootstrap, revoke default, grant in consent handlers
  |  Test: verify PageView fires on landing page, consent banner controls both
  v
Step 3: meta-pixel.ts wrapper
  |  Depends on: fbq being available globally (from Step 2)
  |  Provides: type-safe trackMetaViewContent() + trackMetaLead() functions
  v
Step 4: ViewContent event on landing page index.astro
  |  Depends on: Step 2 (pixel loaded) + Step 3 (wrapper available)
  |  Changes: add inline script calling fbq('track', 'ViewContent', {...})
  v
Step 5: Lead event on /takk
  |  Depends on: Step 2 + Step 3
  |  Changes: add fbq('track', 'Lead', {...}) to existing conversion script block
  v
Step 6: Privacy page update
  |  Depends on: Steps 2-5 (must document what was actually implemented)
  |  Changes: add Meta Pixel / Facebook disclosure to personvern/index.astro
  v
Step 7: Custom OG image
  |  Independent of pixel work, but needed before ads launch
  |  Creates: public/images/og-nettside-for-bedrift.jpg (1200x630)
  |  Changes: image prop in /nettside-for-bedrift/index.astro
  v
Step 8: Ad creative templates + copy + strategy docs
  |  Independent of all code changes
  |  Can run in parallel with Steps 1-7
  |  All output goes to .planning/ads/
```

**Steps 1-6 are sequential** (each depends on the previous). **Steps 7-8 are independent** and can be parallelized with any earlier step.

## Patterns to Follow

### Pattern 1: Consent-Gated Pixel Loading (Meta + Google Unified)

**What:** Load both tracking scripts always, but use their native consent APIs to gate cookie/data behavior. Single localStorage key controls both.

**When:** Any page that runs paid ad tracking (currently only LandingPageLayout pages).

**Why:** Matches the existing Google Ads Consent Mode v2 "advanced" pattern already in production. Google recovers ~70% of conversion data through modeled conversions even when consent is denied. Meta Pixel in revoked mode similarly queues events without setting cookies, providing some attribution signal. Loading both unconditionally (but consent-gated) maximizes data recovery while staying GDPR-compliant.

**Example (core structure of unified IIFE):**
```javascript
(function() {
  var PIXEL_ID = 'YOUR_META_PIXEL_ID';
  var GTAG_ID = 'AW-17409050017';
  var CONSENT_KEY = 'nettup_ads_consent';

  // -- gtag setup (existing, unchanged) --
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
  });

  // -- fbq setup (NEW) --
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
    n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('consent', 'revoke');   // MUST be before init
  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // -- Shared consent state (existing logic, extended) --
  var stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted',
    });
    fbq('consent', 'grant');  // NEW: one line added
  }

  // -- Load gtag.js (existing, unchanged) --
  var script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GTAG_ID;
  script.async = true;
  document.head.appendChild(script);
  gtag('js', new Date());
  gtag('config', GTAG_ID);
  window.gtagLoaded = true;

  // -- Banner show/hide (existing) --
  if (stored === null) {
    document.getElementById('cookie-banner')?.classList.remove('hidden');
  }

  // -- Accept handler (extended) --
  document.getElementById('cookie-accept')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    gtag('consent', 'update', { /* all granted */ });
    fbq('consent', 'grant');  // NEW: one line added
    hideBanner();
  });

  // -- Decline handler (unchanged - defaults handle both) --
  document.getElementById('cookie-decline')?.addEventListener('click', function() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    hideBanner();
  });

  function hideBanner() { /* existing animation logic */ }
})();
```

### Pattern 2: Type-Safe Pixel Wrapper

**What:** Thin wrapper module for fbq calls with SSR guard and TypeScript types. Mirrors the existing `analytics.ts` pattern for Plausible.

**When:** Any component or page script that needs to fire Meta Pixel events.

**Why:** Consistency with existing codebase patterns. `analytics.ts` wraps `window.plausible`, `meta-pixel.ts` wraps `window.fbq`. Same SSR guard pattern, same optional-chain safety.

**Example:**
```typescript
// src/lib/meta-pixel.ts

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fbqTrack(event: string, params?: Record<string, string | number>): void {
  if (typeof window === 'undefined') return;
  window.fbq?.('track', event, params);
}

export function trackMetaViewContent(contentName: string): void {
  fbqTrack('ViewContent', {
    content_name: contentName,
    content_category: 'Nettside Abonnement',
    currency: 'NOK',
    value: 399,
  });
}

export function trackMetaLead(): void {
  fbqTrack('Lead', {
    content_name: 'B2B Nettside Abonnement',
    currency: 'NOK',
    value: 399,
  });
}
```

**Note:** The `value: 399` represents the monthly subscription price. This enables Meta's ROAS optimization to calculate return on ad spend.

### Pattern 3: Inline Script for Conversion Events (Existing Pattern)

**What:** Use `<script is:inline>` in Astro pages for page-load conversion events. Do not import ES modules.

**When:** Firing events on page load (takk.astro, ViewContent on landing page).

**Why:** The existing takk.astro already uses this exact pattern for gtag + Plausible. It works. Inline scripts run synchronously after HTML parse, guaranteeing the pixel globals are available. ES module imports are not compatible with Astro's `is:inline` directive.

**ViewContent on landing page index.astro:**
```html
<!-- At bottom, before closing LandingPageLayout tag -->
<script is:inline>
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: 'Nettside for Bedrift - Landingsside',
      content_category: 'Nettside Abonnement',
      currency: 'NOK',
      value: 399
    });
  }
</script>
```

**Lead on takk.astro (extending existing script):**
```html
<script is:inline>
  // Existing: gtag conversion
  if (window.gtagLoaded && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
    });
  }

  // NEW: Meta Pixel Lead event
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: 'B2B Nettside Abonnement',
      currency: 'NOK',
      value: 399
    });
  }

  // Existing: Plausible
  if (window.plausible) {
    window.plausible('B2B Lead');
  }
</script>
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Separate Consent Banners for Google and Meta

**What:** Showing two different consent prompts or managing two consent keys.

**Why bad:** Confuses users, creates legal ambiguity about what was consented to, doubles UI complexity for zero benefit. Users do not care which specific ad platform is tracking them -- they care whether tracking is on or off.

**Instead:** Single `nettup_ads_consent` key. One banner. Both platforms respect the same choice.

### Anti-Pattern 2: Loading fbevents.js Only After Consent

**What:** Not loading the Meta Pixel script until user accepts cookies.

**Why bad:** Loses all anonymous attribution data from non-consenting users. Google's advanced consent mode loads gtag always and recovers ~70% of conversions via modeled data. Meta Pixel with `fbq('consent', 'revoke')` follows the same principle -- the script loads but does not set cookies or send identifiable data until granted.

**Instead:** Always load the script. Use `fbq('consent', 'revoke')` as the default. This is the GDPR-compliant pattern per Meta's official documentation.

### Anti-Pattern 3: Putting Ad Creatives in src/

**What:** Creating `src/templates/ads/` or `src/components/ads/` for static ad image files.

**Why bad:** Ad images are uploaded to Meta Ads Manager, not served by the Astro site. Putting them in `src/` adds to build time, pollutes git history with binary diffs, and creates false impression they are programmatically used.

**Instead:** `.planning/ads/creatives/` for reference copies. Design in Figma/Canva, export final files, store reference copies alongside strategy docs.

### Anti-Pattern 4: Using analytics.ts for Meta Events

**What:** Adding fbq calls to the existing Plausible `analytics.ts` wrapper.

**Why bad:** Mixes two unrelated tracking systems with different characteristics. Plausible is cookieless and always-on. Meta Pixel is consent-gated. Different globals (`window.plausible` vs `window.fbq`), different event naming conventions, different data models.

**Instead:** Separate `meta-pixel.ts` module. Clean separation of concerns. Each wrapper handles its own global.

### Anti-Pattern 5: Adding Meta Pixel to BaseLayout

**What:** Installing the pixel on all pages via BaseLayout.astro.

**Why bad:** Only paid ad traffic arrives at `/nettside-for-bedrift`. Organic visitors to the main site should not be pixeled. BaseLayout has no consent banner (Plausible is cookieless and does not need one). Adding pixel to BaseLayout would require adding a consent banner to every page, degrading UX for organic visitors who currently see zero cookie banners.

**Instead:** Pixel only in LandingPageLayout.astro. If retargeting scope expands later (e.g., pixel on `/tjenester/nettside`), that requires its own architecture decision with consent banner implications.

## Key Architecture Decisions

### Meta Pixel Only on Landing Pages

The Meta Pixel should NOT be added to BaseLayout.astro for the reasons above. The LandingPageLayout already has the consent infrastructure. This keeps the main site clean and cookie-banner-free.

If retargeting needs expand in the future, the correct approach would be a shared consent component that can be conditionally included in BaseLayout for specific routes, not blanket pixel installation.

### noscript Fallback Not Needed

Meta's documentation includes a `<noscript><img>` fallback tag. This is unnecessary for Nettup:
1. The landing page requires JavaScript (React islands: HeroMicroForm, LandingHeroAnimation) -- users without JS cannot convert
2. The noscript img tag sends data to Meta without consent, conflicting with GDPR
3. Plausible already handles basic analytics without JavaScript

### Value Parameter in Meta Events

Both ViewContent and Lead events include `value: 399` and `currency: 'NOK'`. This enables Meta's ROAS (Return on Ad Spend) optimization. The 399 represents the monthly subscription price being advertised.

### fbq Window Global Declaration

The `meta-pixel.ts` wrapper declares `window.fbq` on the global Window interface. This parallels the existing pattern in `HeroMicroForm.tsx` and `ContactForm.tsx` which declare `window.gtag` and `window.gtagLoaded`. Having both declarations in their respective wrapper modules keeps TypeScript happy without polluting a shared globals file.

## Sources

- [Meta Pixel GDPR Implementation](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- HIGH confidence, official docs, verified consent revoke/grant pattern
- [Meta Pixel Get Started](https://developers.facebook.com/docs/meta-pixel/get-started/) -- HIGH confidence, official docs, verified base code structure
- [Meta Pixel Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/) -- HIGH confidence, official docs, ViewContent and Lead event parameters
- [Meta Pixel Standard Events Reference](https://developers.facebook.com/docs/meta-pixel/reference) -- HIGH confidence, official docs
- [Meta Consent Mode Explained 2025](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025) -- MEDIUM confidence, third-party analysis confirming revoke/grant pattern
- [Facebook Ad Sizes Guide 2026](https://www.get-ryze.ai/blog/facebook-ad-sizes-guide) -- MEDIUM confidence, spec guide for 1080x1080 and 1080x1920 dimensions
- Existing codebase: `LandingPageLayout.astro` (lines 186-259), `utm.ts`, `analytics.ts`, `HeroMicroForm.tsx`, `ContactForm.tsx`, `takk.astro`, `personvern/index.astro` -- HIGH confidence, primary source analysis

---
*Architecture research for: nettup.no v1.7 - Meta Pixel + Ad Creative Integration*
*Researched: 2026-03-28*
