# Technology Stack

**Project:** Nettup v1.7 Multi-Channel Ad Campaign
**Researched:** 2026-03-28
**Scope:** NEW capabilities only (Meta Pixel, ad creative generation, consent coexistence, retargeting events, UTM expansion)

## Existing Stack (validated, not re-researched)

Astro 5 + Tailwind 4 + React 19 islands + Framer Motion + Vercel (hybrid) + Plausible Analytics + Google Ads Consent Mode v2 (advanced) + Formspree + sessionStorage UTM (3 params).

---

## New Stack Additions

### 1. Meta Pixel (fbevents.js)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Meta Pixel SDK (fbevents.js) | 2.0 (CDN) | Facebook/Instagram conversion tracking + retargeting audiences | No npm package -- Meta Pixel is a CDN-loaded script snippet (connect.facebook.net/en_US/fbevents.js). Same deployment pattern as existing gtag. Zero new dependencies. |

**Integration pattern:** Inline `<script is:inline>` in `LandingPageLayout.astro`, mirroring the existing gtag block. The fbevents.js loader is a self-contained IIFE that creates the global `fbq()` function, identical in concept to how `gtag()` is bootstrapped via dataLayer.

**Base code:**
```javascript
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
```

**Consent-aware initialization (CRITICAL ORDER):**
```javascript
fbq('consent', 'revoke');           // 1. Deny by default (GDPR)
fbq('init', 'YOUR_PIXEL_ID');      // 2. Initialize pixel
fbq('track', 'PageView');          // 3. Track page view (queued until consent)
// On user consent: fbq('consent', 'grant');  // 4. Releases queued events
```

**Key behavior:** When `fbq('consent', 'revoke')` is called before `init`, the pixel loads and queues events locally but does NOT transmit to Meta servers. Calling `fbq('consent', 'grant')` releases the queue. This is architecturally identical to Google's Consent Mode v2 denied-defaults pattern already in the codebase.

**Confidence:** HIGH -- verified against Meta's official GDPR developer documentation (developers.facebook.com/docs/meta-pixel/implementation/gdpr).

### 2. UTM Expansion

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependency | N/A | Expand `utm.ts` to capture `utm_content` + `utm_term` | Facebook Ads uses dynamic URL parameters (`{{ad.name}}`, `{{adset.name}}`) that map to utm_content and utm_term. Current implementation only captures 3 params; Facebook attribution needs 5. |

**Change scope:** Add `'utm_content'` and `'utm_term'` to the existing `UTM_KEYS` array in `src/lib/utm.ts`. That is the entire change -- the `captureUtmParams()` and `getUtmParams()` functions are already generic over the array.

**Facebook URL template:**
```
?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

**Confidence:** HIGH -- trivial change to existing working code.

### 3. Ad Creative Image Generation (Build-Time)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| satori | ^0.18.3 | JSX-to-SVG rendering for ad templates | Vercel-maintained, supports flexbox + absolute positioning, custom fonts (Inter, Space Grotesk already in project). Renders brand-consistent ad images from TypeScript templates. |
| @resvg/resvg-js | ^2.6.2 | SVG-to-PNG conversion | High-performance Rust-based renderer. Required because Facebook/Instagram require PNG/JPG (not SVG). Used only at build time. |

**Why satori + resvg-js instead of manual Figma/Canva recreation:**
1. **Reproducible** -- templates are code, can be iterated and version-controlled
2. **Brand-consistent** -- imports from `brand.ts` and uses actual project fonts
3. **Batch generation** -- one `npm run generate:ads` produces all 6 creatives
4. **OG image** -- same pipeline generates the custom `/nettside-for-bedrift` OG image
5. **No external tooling** -- does not require Figma, Canva, or Adobe accounts

**What satori supports that matters for ad creatives:**
- Flexbox layout (display: flex)
- position: absolute (for overlaying text on backgrounds)
- Custom fonts (loaded from .woff files, already available via @fontsource/inter and @fontsource/space-grotesk)
- Gradients, border-radius, opacity, box-shadow
- Colors (hex, rgb, hsl -- maps directly to brand tokens)

**What satori does NOT support (not needed for ad creatives):**
- CSS Grid (use flexbox instead)
- z-index (paint order follows DOM order -- fine for layered ad layouts)
- calc() expressions
- Interactive properties (irrelevant for static images)

**Output specifications:**
| Format | Dimensions | Use Case |
|--------|-----------|----------|
| PNG 1080x1080 | Feed ads (Facebook + Instagram) | 4 variations |
| PNG 1080x1920 | Story/Reel ads (9:16) | 2 variations |
| PNG 1200x630 | Custom OG image for /nettside-for-bedrift | 1 image |

**Vite configuration note:** resvg-js is a native Node addon (Rust via napi-rs). Vite's SSR bundler cannot process native addons, so it must be marked as `ssr.external` if used within Astro's build pipeline. However, since ad generation runs as a standalone script via `tsx`, this is not needed.

**Recommended approach:** Standalone build script at `src/scripts/ads/generate-creatives.ts` run via `tsx`, not through Astro's build pipeline. This avoids Vite/SSR complications entirely and keeps the ad generation independent of the site build. The project already has `tsx` as a devDependency (v4.21.0).

**Confidence:** HIGH for satori (well-documented, actively maintained by Vercel, used across Astro ecosystem for OG images). HIGH for resvg-js (standalone script avoids Vite integration issues).

### 4. Consent-Aware Dual-Pixel Loading

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependency | N/A | Unified consent banner controls both gtag and fbq | Extends existing consent IIFE in LandingPageLayout.astro to also call fbq('consent', 'grant'/'revoke'). Single consent key in localStorage controls both pixels. |

**Architecture decision: One consent banner, one localStorage key, two pixels.**

The existing consent implementation uses `nettup_ads_consent` in localStorage. Meta Pixel consent maps to the same user choice:

```javascript
// Existing consent accept handler (LandingPageLayout.astro line ~232-239)
// EXTEND to also call fbq:
document.getElementById('cookie-accept')?.addEventListener('click', function() {
  localStorage.setItem(CONSENT_KEY, 'granted');
  // Google (existing)
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted',
  });
  // Meta (NEW)
  if (window.fbq) fbq('consent', 'grant');
  hideBanner();
});
```

**Why NOT separate consent for Google vs Meta:**
- Norwegian users see one banner, make one choice. Splitting creates friction and confusion.
- Both pixels serve the same purpose (ad measurement). The GDPR legal basis is identical (consent, art. 6(1)(a)).
- The consent banner text already says "Vi bruker informasjonskapsler for a male annonseeffekt" -- this covers both vendors.
- Privacy policy section 2.3 needs a new subsection (2.4) for Meta Pixel disclosure, mirroring the Google Ads section.

**Key coexistence behaviors:**

| Consent State | gtag behavior | fbq behavior |
|--------------|--------------|-------------|
| No choice yet (banner shown) | Loads, denied defaults, modeled conversions | Loads, revoked, events queued locally |
| Granted | Full tracking, cookies set | Full tracking, cookies set, queue released |
| Denied | Cookieless pings, modeled conversions | No data transmission to Meta |

**Important difference:** Google Consent Mode v2 "advanced" sends anonymized pings even when denied (for modeled conversions). Meta Pixel in revoked state sends NOTHING. This is a fundamental difference -- Meta is more privacy-restrictive in denied state. This means Meta will have lower attributed conversion numbers than Google when consent rates are low. This is expected and correct behavior.

**Confidence:** HIGH -- Meta's fbq consent API is documented and tested. The pattern directly extends the existing consent IIFE without structural changes.

### 5. Retargeting Event Infrastructure

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependency | N/A | Fire fbq standard events for retargeting audiences | Uses existing fbq() global function. Standard events (ViewContent, Lead) are recognized by Meta Ads Manager for Custom Audience creation. |

**Events to implement:**

| Event | Where | Parameters | Retargeting Use |
|-------|-------|-----------|----------------|
| `ViewContent` | `/nettside-for-bedrift` page load | `{ content_name: 'Nettside Abonnement', content_category: 'Landing Page', value: 399, currency: 'NOK' }` | "Viewed pricing but didn't convert" audience |
| `Lead` | `/nettside-for-bedrift/takk` page load | `{ content_name: 'Nettside Abonnement', value: 399, currency: 'NOK' }` | Conversion tracking + lookalike seed audience |

**Implementation location:**
- `ViewContent`: Inline `<script is:inline>` on `/nettside-for-bedrift/index.astro`, fires after fbq init
- `Lead`: Added to existing conversion script on `/nettside-for-bedrift/takk.astro` alongside gtag conversion and Plausible event

**Custom Audience definitions (built in Meta Ads Manager, not code):**
1. **Warm retarget:** People who fired `ViewContent` but NOT `Lead` in last 30 days
2. **Lookalike seed:** People who fired `Lead` in last 180 days
3. **Broad retarget:** All pixel-tracked visitors in last 14 days (PageView)

**Confidence:** HIGH -- standard Meta Pixel events with well-documented parameters.

### 6. Window Type Extensions

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| No new dependency | N/A | Add fbq to Window interface in env.d.ts | TypeScript type safety for inline scripts using fbq(). Mirrors existing Window.plausible pattern. |

**Addition to `src/env.d.ts`:**
```typescript
interface Window {
  plausible?: (eventName: string, options?: PlausibleOptions) => void;
  fbq?: (...args: unknown[]) => void;
  _fbq?: (...args: unknown[]) => void;
}
```

Note: `is:inline` scripts bypass TypeScript checking. The type extension is for any future React island that might call fbq directly.

**Confidence:** HIGH -- follows existing pattern.

---

## What NOT to Add

| Rejected Technology | Why Not |
|-------------------|---------|
| `react-facebook-pixel` npm package | Wrapper around fbq() that adds unnecessary abstraction. The raw fbq() API is 3 function calls. A wrapper adds bundle size, version coupling, and React lifecycle complexity for zero benefit. |
| Google Tag Manager (GTM) | Overkill for 2 pixels. Direct script tags are simpler, faster (no GTM container load), and already the established pattern. GTM adds a management layer with no payoff at this scale. |
| `@vercel/og` | Vercel's OG image package uses satori internally but is designed for Next.js Edge Runtime. Using satori + resvg-js directly gives full control and works in standalone Node scripts. |
| `sharp` (for PNG conversion) | resvg-js handles SVG-to-PNG natively and is faster (Rust-based). Sharp would be a redundant 25MB+ dependency. |
| `html2canvas` / `puppeteer` (for ad image export) | Headless browser approach is 100x slower than satori and requires Chrome/Chromium runtime. Satori renders in-process via WASM/native. Puppeteer is already a devDependency but should NOT be used for this. |
| Additional font files for satori | @fontsource/inter and @fontsource/space-grotesk already include .woff format files in node_modules. No separate font download needed. |
| Meta Conversions API (CAPI / server-side) | Server-side Meta event deduplication and adblocker bypass. Requires server endpoint, access token management, and event_id deduplication. Out of scope for v1.7 -- evaluate after first campaign if pixel-only attribution is insufficient. |
| Meta Business SDK (npm) | Node.js SDK for Conversions API. Not needed for client-side pixel events. |
| Third-party CMP (Cookiebot, OneTrust, CookieYes) | 2 pixels do not justify a CMP subscription (starting at ~$10/mo). The existing custom consent banner is clean, GDPR-compliant, and well-understood. CMP becomes worthwhile at 5+ tracking scripts or if a stricter interpretation of ePrivacy Directive is needed. |
| `satori-html` npm package | Converts HTML template strings to satori VNodes. Unnecessary because satori natively accepts JSX, and the project already has React/JSX support. Using JSX directly gives type safety and IDE support. |

---

## Installation

```bash
# New dev dependencies for ad creative generation script
npm install -D satori @resvg/resvg-js
```

That is the ONLY `npm install` needed. Meta Pixel is CDN-loaded (zero npm packages). UTM expansion, consent integration, and retargeting events are all code changes to existing files.

**Total new npm dependencies: 2 (dev only)**
- `satori` ~2.5MB (includes WASM layout engine)
- `@resvg/resvg-js` ~8MB (native Rust addon, platform-specific binary)

Neither dependency ships to the browser or increases the client bundle. Both are used exclusively in the standalone ad generation script.

---

## Integration Points with Existing Code

### Files to modify (not create)

| File | Change | Risk |
|------|--------|------|
| `src/layouts/LandingPageLayout.astro` | Add fbq loader + consent integration in existing IIFE | LOW -- additive to existing consent block, same pattern as gtag |
| `src/lib/utm.ts` | Add `'utm_content'` and `'utm_term'` to UTM_KEYS array | NEGLIGIBLE -- 1-line change, functions are generic |
| `src/env.d.ts` | Add fbq to Window interface | NEGLIGIBLE -- type-only change |
| `src/pages/nettside-for-bedrift/index.astro` | Add ViewContent event inline script | LOW -- new script block, no structural change |
| `src/pages/nettside-for-bedrift/takk.astro` | Add fbq Lead event alongside existing gtag + plausible | LOW -- additive to existing conversion script |
| `src/pages/personvern/index.astro` | Add section 2.4 for Meta Pixel disclosure + update section 4 data sharing | LOW -- content addition |
| `package.json` | Add `"generate:ads"` script | NEGLIGIBLE |

### Files to create

| File | Purpose |
|------|---------|
| `src/scripts/ads/generate-creatives.ts` | Orchestrator script: loads fonts, renders templates, writes PNGs |
| `src/scripts/ads/templates/feed-price.tsx` | 1080x1080 price-focused feed ad template |
| `src/scripts/ads/templates/feed-social-proof.tsx` | 1080x1080 testimonial/social proof feed ad template |
| `src/scripts/ads/templates/feed-problem.tsx` | 1080x1080 problem-agitation feed ad template |
| `src/scripts/ads/templates/feed-benefit.tsx` | 1080x1080 benefit-focused feed ad template |
| `src/scripts/ads/templates/story-price.tsx` | 1080x1920 price-focused story/reel template |
| `src/scripts/ads/templates/story-cta.tsx` | 1080x1920 CTA-focused story/reel template |
| `src/scripts/ads/templates/og-landing.tsx` | 1200x630 custom OG image for /nettside-for-bedrift |
| `public/images/ads/` | Output directory for generated PNG files |

### package.json script addition

```json
{
  "scripts": {
    "generate:ads": "tsx src/scripts/ads/generate-creatives.ts"
  }
}
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Meta Pixel loading | Direct `<script is:inline>` in layout | GTM container | GTM adds complexity, latency, and a management layer for just 2 tags. Direct scripts are faster and match existing gtag pattern. |
| Ad image generation | satori + resvg-js (code-based) | Manual Figma/Canva design | Code templates are version-controlled, batch-generated, and guaranteed brand-consistent. Manual design requires designer tooling and cannot be iterated in PRs. |
| Ad image generation | satori + resvg-js (code-based) | Puppeteer screenshot | 100x slower, requires headless Chrome, non-deterministic rendering. Already a devDependency but wrong tool for this job. |
| SVG-to-PNG conversion | @resvg/resvg-js | sharp | resvg-js is purpose-built for SVG input, faster (Rust), and smaller. Sharp is a general image processing library -- overkill. |
| Consent management | Extend existing custom IIFE | Third-party CMP | 2 pixels do not justify CMP subscription/complexity. Custom banner is clean and compliant. |
| Font loading for satori | Read .woff from @fontsource in node_modules | Download fonts separately | @fontsource packages already include .woff format files. No duplication. |
| Pixel event tracking | Client-side fbq() only | Conversions API (server-side) | CAPI adds server endpoint, access tokens, and deduplication logic. Evaluate after v1.7 campaign data shows whether client-side-only attribution is sufficient. |

---

## Sources

- [Meta Pixel GDPR implementation (official)](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- HIGH confidence
- [Meta Pixel Get Started (official)](https://developers.facebook.com/docs/meta-pixel/get-started/) -- HIGH confidence
- [Meta Pixel conversion tracking (official)](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/) -- HIGH confidence
- [Meta Pixel standard event specs (official)](https://www.facebook.com/business/help/402791146561655) -- HIGH confidence
- [satori GitHub repository (Vercel)](https://github.com/vercel/satori) -- HIGH confidence, v0.18.3
- [@resvg/resvg-js npm](https://www.npmjs.com/package/@resvg/resvg-js) -- HIGH confidence, v2.6.2
- [Facebook UTM parameter guide (Attributer)](https://attributer.io/blog/add-utm-parameters-facebook-ads) -- MEDIUM confidence
- [Meta Consent Mode explained (SecurePrivacy)](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025) -- MEDIUM confidence
- [Facebook ad image specs 2026 (Buffer)](https://buffer.com/resources/facebook-ad-specs-image-sizes/) -- MEDIUM confidence
- [Astro + satori OG image generation (mfyz.com)](https://mfyz.com/generate-beautiful-og-images-astro-satori/) -- MEDIUM confidence
- [Facebook/Meta Pixel Consent Mode (MeasureMinds)](https://measuremindsgroup.com/facebook-meta-pixel-consent-mode) -- MEDIUM confidence
