# Stack Research: v1.6 Landing Page & Google Ads

**Domain:** Conversion-optimized landing page rebuild, Google Ads tracking, subscription pricing
**Researched:** 2026-03-19
**Confidence:** HIGH

## Scope

This file covers ONLY what is NEW or CHANGED for the v1.6 milestone. The following are validated and NOT re-researched: Astro 5, Tailwind 4, React islands, Framer Motion, Vercel hosting (`output: 'static'`), Formspree forms, Plausible Analytics, LandingPageLayout (no nav, phone CTA, cookie consent banner), Google Ads gtag (`AW-17409050017`) already loaded with consent.

**Bottom line: zero new npm packages required. All new capabilities are configuration and code patterns using the existing stack.**

---

## What Already Exists (No Changes Needed)

| Capability | How It Works | Status |
|------------|--------------|--------|
| LandingPageLayout | No nav, sticky logo+phone, cookie consent, gtag loader | Production-ready |
| Google Ads gtag | `AW-17409050017`, consent-gated loading via localStorage | Working |
| Cookie consent banner | Accept/decline, persists in `nettup_ads_consent` | Working |
| Plausible Analytics | Cookieless, `analytics.ts` wrapper with 7 typed events | Working |
| `reveal-on-scroll` animations | IntersectionObserver in LandingPageLayout | Working |
| Formspree forms | `xnjnzybj`, honeypot spam protection | Working |
| `noIndex` prop on LandingPageLayout | For A/B test variant pages | Ready to use |

---

## New Capabilities Required

### 1. Google Ads Conversion Tracking (Enhanced)

**What exists:** Basic gtag config fires on page load. No conversion events fire on form submit.

**What's needed:** Fire `gtag('event', 'conversion', {...})` when the landing page form is submitted and when the phone CTA is clicked. Also set up Enhanced Conversions to send hashed user data for better attribution.

**Implementation pattern (no new dependencies):**

```typescript
// src/lib/ads-tracking.ts

/** Fire Google Ads conversion event. Only works if gtag loaded (consent granted). */
export function trackAdsConversion(conversionLabel: string, value?: number): void {
  if (typeof window === 'undefined' || !window.gtagLoaded) return;
  window.gtag?.('event', 'conversion', {
    send_to: `AW-17409050017/${conversionLabel}`,
    value: value ?? 0,
    currency: 'NOK',
  });
}

/** Enhanced conversions: send hashed user data alongside conversion. */
export function trackAdsFormConversion(
  conversionLabel: string,
  userData: { email?: string; phone?: string },
  value?: number
): void {
  if (typeof window === 'undefined' || !window.gtagLoaded) return;

  // Set user_data for enhanced conversions (gtag hashes automatically)
  window.gtag?.('set', 'user_data', {
    email: userData.email,
    phone_number: userData.phone, // Must be E.164 format: +4741327136
  });

  window.gtag?.('event', 'conversion', {
    send_to: `AW-17409050017/${conversionLabel}`,
    value: value ?? 0,
    currency: 'NOK',
  });
}

/** Track phone CTA clicks as conversion. */
export function trackAdsPhoneClick(conversionLabel: string): void {
  if (typeof window === 'undefined' || !window.gtagLoaded) return;
  window.gtag?.('event', 'conversion', {
    send_to: `AW-17409050017/${conversionLabel}`,
  });
}
```

**Setup steps in Google Ads:**
1. Create conversion action "Skjema sendt" (category: Submit Lead Form) -- get conversion label
2. Create conversion action "Telefon klikk" (category: Phone Call) -- get conversion label
3. Enable Enhanced Conversions on the "Skjema sendt" conversion action in Google Ads settings
4. Use Tag Assistant to verify events fire correctly

**TypeScript types needed (add to existing `env.d.ts` or a new `src/types/gtag.d.ts`):**

```typescript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtagLoaded?: boolean;
  }
}
```

**Confidence:** HIGH -- gtag conversion snippet pattern is well-documented by Google. Enhanced Conversions with `gtag('set', 'user_data', ...)` is the recommended approach per Google's official docs. The `window.gtagLoaded` flag already exists in LandingPageLayout.

**Sources:**
- [Google Ads conversion tracking with gtag](https://support.google.com/google-ads/answer/7548399)
- [Enhanced conversions setup with Google tag](https://support.google.com/google-ads/answer/13258081)
- [Google conversion measurement docs](https://developers.google.com/tag-platform/devguides/conversions)

---

### 2. Subscription Pricing UI (No New Dependencies)

**Context:** New offer is 0 kr oppstart + 399 kr/mnd for 5-siders nettside (first 10 customers). This is NOT a SaaS pricing page with toggles -- it's a single subscription offer on a conversion landing page.

**Recommended approach: Astro section component, not React island.**

Subscription pricing on a landing page does not need client-side interactivity. It needs:
- Clear monthly price with struck-through comparison
- "What's included" checklist
- Scarcity signal (X of 10 plasser igjen)
- Single CTA button scrolling to form

**Pattern:**

```astro
<!-- _sections/SubscriptionPricing.astro -->
<section class="py-20 bg-surface">
  <div class="container mx-auto px-4 max-w-3xl text-center">
    <h2>Alt inkludert. Ingen overraskelser.</h2>
    <div class="bg-surface-raised rounded-2xl p-8 border border-white/10">
      <div class="text-5xl font-bold text-brand">399 kr/mnd</div>
      <div class="text-text-muted">0 kr oppstart</div>
      <!-- Checklist items -->
      <!-- Scarcity badge: "7 av 10 plasser igjen" -->
      <!-- CTA: scroll to form -->
    </div>
  </div>
</section>
```

**Why NOT a pricing toggle (monthly/annual):** This is a single offer, not a tier comparison. Adding toggle complexity reduces clarity and hurts conversion on a focused landing page. The subscription model should feel simple and risk-free.

**Scarcity counter approach:** Hard-code the number in a config constant (e.g. `launchOffer.ts` or inline). Do NOT build a real-time counter -- that requires a database and adds complexity for no conversion benefit. Update the number manually as customers sign up.

**Confidence:** HIGH -- subscription pricing presentation is pure HTML/CSS. No technical risk.

---

### 3. A/B Testing Variant Pages

**The constraint:** Project uses `output: 'static'` with Vercel adapter. Astro middleware runs only at build time for static pages. This means Astro-level middleware cannot do runtime A/B routing.

**Two viable approaches, ranked:**

#### Approach A: Vercel Edge Middleware (RECOMMENDED)

Vercel Edge Middleware runs at the edge BEFORE the static cache. It can rewrite requests to serve different pre-built static pages without SSR. This is the same pattern Vercel uses for their own A/B testing.

**How it works:**
1. Build two static pages: `/nettside-for-bedrift/index.html` and `/nettside-for-bedrift/b/index.html`
2. Create `middleware.ts` at project root (Vercel convention, NOT `src/middleware.ts`)
3. Middleware reads a cookie; if no cookie, assigns variant randomly and sets cookie
4. Middleware rewrites request to the appropriate variant page
5. User always sees `/nettside-for-bedrift` in browser URL bar

**Implementation:**

```typescript
// middleware.ts (project root -- Vercel Edge Middleware)
import { NextResponse } from 'next/server'; // Vercel middleware uses this API

export const config = {
  matcher: '/nettside-for-bedrift',
};

export default function middleware(request: Request) {
  const cookie = request.headers.get('cookie') ?? '';
  const variantMatch = cookie.match(/nettup_ab=([ab])/);

  let variant = variantMatch?.[1];
  if (!variant) {
    variant = Math.random() < 0.5 ? 'a' : 'b';
  }

  const url = new URL(request.url);
  if (variant === 'b') {
    url.pathname = '/nettside-for-bedrift/b';
  }

  const response = NextResponse.rewrite(url);
  if (!variantMatch) {
    response.cookies.set('nettup_ab', variant, { maxAge: 60 * 60 * 24 * 30 });
  }
  return response;
}
```

**IMPORTANT CAVEAT:** Vercel Edge Middleware for non-Next.js frameworks has limited official documentation. The `@astrojs/vercel` adapter supports `edgeMiddleware: true` in config, which creates an edge function from Astro's `src/middleware.ts`. However, Astro middleware on static pages has documented limitations (runs at build time only for prerendered pages).

**Confidence:** MEDIUM -- Vercel Edge Middleware rewrites are well-documented for Next.js. For Astro with `output: 'static'`, this specific pattern needs validation during implementation. The community reports it works but there are edge cases with cookies.

#### Approach B: URL-Based Variants with UTM Parameters (SIMPLER, RECOMMENDED FOR V1)

Skip middleware entirely. Create two separate landing page URLs:
- `/nettside-for-bedrift` (variant A -- control)
- `/nettside-for-bedrift-b` (variant B -- new design)

Use Google Ads to split traffic by creating two ad groups pointing to different URLs. Track conversions per page in both Google Ads and Plausible.

**Advantages:**
- Zero infrastructure complexity
- Works perfectly with `output: 'static'`
- Google Ads natively supports traffic splitting across ad groups
- Plausible shows per-page conversion rates
- `noIndex` on variant B prevents SEO duplication

**Disadvantages:**
- Not true A/B testing (Google Ads splits may not be perfectly 50/50)
- Organic traffic doesn't get split

**Implementation:**
1. Create `/nettside-for-bedrift-b/index.astro` using LandingPageLayout with `noIndex={true}`
2. Create separate Google Ads ad group pointing to variant B URL
3. Compare conversion rates in Google Ads dashboard

**Confidence:** HIGH -- no technical risk, uses only existing capabilities.

**Recommendation:** Start with Approach B (URL-based) for the initial A/B test. It ships in hours, not days. If you need true 50/50 splitting for organic traffic later, implement Approach A.

---

### 4. Conversion-Optimized Section Patterns (No New Dependencies)

All conversion optimization elements are pure Astro components with Tailwind styling. No new libraries needed.

| Pattern | Implementation | Notes |
|---------|---------------|-------|
| Social proof (logos) | LogoCloud.astro already exists | Expand with more logos if available |
| Urgency/scarcity | Static badge: "X av 10 plasser igjen" | Hard-coded in config, update manually |
| Trust signals | Checkmark lists, guarantee badges | Pure Tailwind/SVG |
| Sticky CTA | `position: sticky` footer bar on mobile | Pure CSS, no JS needed |
| Countdown timer | NOT recommended | Fake urgency damages trust |
| Exit-intent popup | NOT recommended | Aggressive, hurts brand perception |
| Form prefill from UTM | Read `URLSearchParams` in form component | Minimal inline JS |
| Phone number tracking | `trackAdsPhoneClick()` on tel: link click | See section 1 above |

**Sticky mobile CTA pattern (pure CSS):**

```astro
<!-- Sticky bottom CTA bar, visible on mobile only -->
<div class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-surface/95 backdrop-blur-md p-4 md:hidden">
  <a href="#kontakt" class="block w-full rounded-full bg-brand py-3 text-center font-semibold text-surface">
    Kom i gang - 0 kr oppstart
  </a>
</div>
```

**Confidence:** HIGH -- all pure HTML/CSS/minimal JS patterns.

---

## Plausible Analytics Additions

Extend `src/lib/analytics.ts` with new tracking functions for the landing page:

```typescript
export function trackLandingFormSubmit(variant?: string): void {
  track('Landing Form Submit', variant ? { variant } : undefined);
}

export function trackLandingPhoneClick(variant?: string): void {
  track('Landing Phone Click', variant ? { variant } : undefined);
}

export function trackLandingScrollDepth(depth: string): void {
  track('Landing Scroll Depth', { depth });
}
```

These fire alongside (not instead of) Google Ads conversion events. Plausible gives you analytics without consent; Google Ads conversions require consent.

---

## No New Dependencies

| Considered | Decision | Reason |
|------------|----------|--------|
| Google Tag Manager (GTM) | Rejected | gtag.js is already loaded; GTM adds another script, container overhead, and complexity for 2 conversion events |
| Optimizely / LaunchDarkly | Rejected | Overkill for a single A/B test on one landing page; URL-based splitting is sufficient |
| `@vercel/edge-config` | Deferred | Only needed if implementing Approach A for A/B testing; URL-based approach avoids this |
| Hotjar / Microsoft Clarity | Deferred | Heatmaps are valuable but add another consent requirement; evaluate after first ad campaign data |
| `react-countdown` | Rejected | Countdown timers create fake urgency; the scarcity message (X of 10 remaining) is sufficient |
| Form library (react-hook-form, etc.) | Rejected | Existing Formspree pattern with native validation works; no complex form logic needed |

---

## Integration Points with Existing Stack

| Existing File | Change for v1.6 | Impact |
|---------------|-----------------|--------|
| `src/lib/ads-tracking.ts` | New file | None on existing code |
| `src/lib/analytics.ts` | Add 3 new tracking functions | Additive only |
| `src/types/gtag.d.ts` | New file (Window type augmentation) | Additive only |
| `src/pages/nettside-for-bedrift/index.astro` | Full rebuild of sections | Replaces existing content |
| `src/pages/nettside-for-bedrift/_sections/*` | Rebuild/add sections | Replaces existing sections |
| `src/layouts/LandingPageLayout.astro` | No changes needed | Stable |
| `src/config/launchOffer.ts` | Update pricing to subscription model | May need new fields |
| `astro.config.mjs` | No changes needed | Stable |

---

## Google Ads Setup Requirements (Outside Codebase)

These are Google Ads dashboard configurations, not code changes:

| Action | Where | Notes |
|--------|-------|-------|
| Create "Skjema sendt" conversion action | Google Ads > Goals > Conversions | Category: Submit Lead Form, value: set per lead value |
| Create "Telefon klikk" conversion action | Google Ads > Goals > Conversions | Category: Phone Call |
| Enable Enhanced Conversions | On "Skjema sendt" conversion action | Settings > Enhanced Conversions > Google tag |
| Get conversion labels | From each conversion action's tag setup | Paste into `ads-tracking.ts` constants |
| Verify with Tag Assistant | [tagassistant.google.com](https://tagassistant.google.com) | Test both events fire on form submit and phone click |

---

## Installation

```bash
# No new packages required.
# All capabilities exist in the current stack.
```

---

## Sources

- [Google Ads conversion tracking with gtag](https://support.google.com/google-ads/answer/7548399) -- event snippet format (HIGH confidence)
- [Enhanced conversions for web using Google tag](https://support.google.com/google-ads/answer/13258081) -- user_data setup (HIGH confidence)
- [Google conversion measurement developer docs](https://developers.google.com/tag-platform/devguides/conversions) -- send_to pattern (HIGH confidence)
- [Vercel Edge Middleware for A/B testing](https://vercel.com/blog/vercel-edge-middleware-dynamic-at-the-speed-of-static) -- rewrite static pages pattern (MEDIUM confidence for Astro specifically)
- [Astro middleware docs](https://docs.astro.build/en/guides/middleware/) -- context.rewrite() API (HIGH confidence)
- [Vercel Edge Config](https://vercel.com/docs/edge-config) -- feature flags and A/B test config (MEDIUM confidence)
- Codebase `src/layouts/LandingPageLayout.astro` -- existing gtag loader, consent flow, `window.gtagLoaded` flag (HIGH confidence)
- Codebase `src/lib/analytics.ts` -- existing Plausible wrapper pattern (HIGH confidence)
- Codebase `astro.config.mjs` -- `output: 'static'` constraint (HIGH confidence)

---

*Stack research for: Nettup v1.6 Landing Page & Google Ads*
*Researched: 2026-03-19*
