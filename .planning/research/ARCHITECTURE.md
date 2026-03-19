# Architecture Patterns

**Domain:** Landing page rebuild + Google Ads integration for web agency
**Researched:** 2026-03-19
**Confidence:** HIGH (based on direct codebase analysis + Google Ads official docs)

## Recommended Architecture

The v1.6 rebuild modifies the existing `/nettside-for-bedrift` page and its supporting config files. No new frameworks or dependencies needed. The key architectural changes are:

1. Replace the 3-tier launch offer model with a subscription-first pricing model
2. Add a thank-you page for reliable conversion tracking
3. Redirect forms to thank-you page instead of inline success state
4. Store ad campaign documentation as config files in the repo

### Component Map: What Changes vs What Stays

| Component | Status | Action |
|-----------|--------|--------|
| `LandingPageLayout.astro` | MODIFY | Update default description meta |
| `src/config/subscriptionOffer.ts` | NEW | Replaces `launchOffer.ts` + `pricing.ts` for landing page |
| `src/config/launchOffer.ts` | DELETE | Replaced by `subscriptionOffer.ts` |
| `src/config/pricing.ts` | DELETE | Replaced by `subscriptionOffer.ts` |
| `src/pages/nettside-for-bedrift/takk.astro` | NEW | Thank-you page with conversion pixel |
| `src/config/ads/keywords.ts` | NEW | Keyword lists for campaign setup |
| `src/config/ads/ad-copy.ts` | NEW | Ad headlines and descriptions |
| `src/config/ads/campaign-structure.md` | NEW | Campaign hierarchy reference |
| `_sections/Hero.astro` | REWRITE | New headline, subscription pricing |
| `_sections/PricingSummary.astro` | REWRITE | Single subscription offer + upsell cards |
| `_sections/FormSection.astro` | MODIFY | Remove package selection logic |
| `_sections/FAQ.astro` | REWRITE | Subscription-related questions |
| `_sections/WhyUs.astro` | MODIFY | Update value props for subscription |
| `_sections/VisualProof.astro` | KEEP | Lighthouse scores still relevant |
| `_sections/LogoCloud.astro` | KEEP | Trust signals unchanged |
| `_sections/Testimonial.astro` | KEEP | Same structure |
| `_sections/Results.astro` | KEEP or DELETE | Evaluate if still needed |
| `HeroMicroForm.tsx` | MODIFY | Add redirect to `/takk`, remove `pakke` param |
| `ContactForm.tsx` | MODIFY | Add redirect to `/takk` for b2b context, remove `PAKKE_INFO` |
| `ScarcityCounter.astro` | MODIFY | Import from `subscriptionOffer.ts` |
| `analytics.ts` | ADD FUNCTION | Add `trackSubscriptionFormSubmit()` |
| `src/config/pricing-config.ts` | NO CHANGE | Used by `/priskalkulator`, unrelated to landing page |

## Data Flow

### Current Flow (v1.5)

```
User → /nettside-for-bedrift
  → Picks 1 of 3 packages (Enkel/Standard/Premium)
  → ?pakke=standard added to URL
  → Scrolls to #kontakt, form heading updates
  → Submits form → Formspree POST
  → Inline React success state ("Takk! Vi kontakter deg snart")
  → gtag conversion fires in React handleSubmit (if consent given)
```

### New Flow (v1.6)

```
User clicks Google Ad → /nettside-for-bedrift
  → Cookie consent banner shown (existing)
  → User sees single subscription offer (0 kr oppstart, 399 kr/mnd)
  → Fills hero micro-form (email) or full form (#kontakt)
  → Formspree POST → success
  → window.location.href = '/nettside-for-bedrift/takk'
  → Thank-you page loads with LandingPageLayout
  → Inline script fires gtag conversion + Plausible event
  → User sees confirmation + next steps
```

**Key change:** Form success redirects to `/takk` instead of showing inline React state. This makes conversion tracking a page-load event (reliable) instead of a JS callback event (fragile).

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `subscriptionOffer.ts` | Single source of truth for offer details (price, spots, terms, upsells) | Hero, PricingSummary, ScarcityCounter, FormSection, ad-copy.ts |
| `LandingPageLayout.astro` | Layout shell, gtag loading, consent banner | All sections via slot, takk.astro |
| `HeroMicroForm.tsx` | Quick email capture + redirect to /takk | Formspree API, window.location |
| `ContactForm.tsx` | Full form + redirect to /takk (when context="b2b") | Formspree API, window.location |
| `takk.astro` | Conversion confirmation page, fires tracking events | gtag (conversion), Plausible |
| `src/config/ads/` | Campaign documentation (not runtime code) | Human reference only |

## Patterns to Follow

### Pattern 1: Unified Subscription Offer Config

**What:** Single config file replacing both `launchOffer.ts` and `pricing.ts`.
**Why:** The current architecture has two config files (`launchOffer.ts` for scarcity counter, `pricing.ts` for 3-tier packages) feeding the same landing page. The new subscription model is a single offer, so one config file is cleaner.

```typescript
// src/config/subscriptionOffer.ts

export interface SubscriptionOffer {
  /** Monthly price in NOK */
  monthlyPrice: number;
  /** Setup fee in NOK (0 for the launch campaign) */
  setupFee: number;
  /** What's included in the subscription */
  includes: string[];
  /** Binding period in months (0 = no binding) */
  bindingMonths: number;
  /** Minimum commitment in months */
  minimumMonths: number;
}

export interface ScarcityConfig {
  /** Total spots available at this price */
  total: number;
  /** Spots already taken — update manually when customers sign up */
  taken: number;
}

export interface UpsellService {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  ctaUrl: string;
}

export const subscriptionOffer: SubscriptionOffer = {
  monthlyPrice: 399,
  setupFee: 0,
  includes: [
    'Inntil 5 sider',
    'Responsivt design',
    'Kontaktskjema',
    'Grunnleggende SEO',
    'SSL og hosting',
    'Support via e-post',
  ],
  bindingMonths: 0,
  minimumMonths: 12,
};

export const scarcity: ScarcityConfig = {
  total: 10,
  taken: 0, // Update when customers sign up
};

export const remainingSpots = scarcity.total - scarcity.taken;

export const upsellServices: UpsellService[] = [
  {
    id: 'nettbutikk',
    name: 'Nettbutikk',
    description: 'Selg produkter online med Shopify',
    startingPrice: 'Fra 15 000 kr',
    ctaUrl: '/tjenester/nettbutikk',
  },
  {
    id: 'webapp',
    name: 'Webapplikasjon',
    description: 'Skreddersydd digital losning',
    startingPrice: 'Fra 25 000 kr',
    ctaUrl: '/tjenester/webapplikasjon',
  },
];
```

**Rationale:**
- `subscriptionOffer` replaces both `launchOffer` and `pakker` (one offer, not three tiers)
- `scarcity` is separate because it changes independently (manual update when signing customers)
- `upsellServices` shows bigger services as secondary options, not competing tiers
- `remainingSpots` is a derived constant (same pattern as current `remainingSlots`)

### Pattern 2: Thank-You Page for Conversion Tracking

**What:** Dedicated `/nettside-for-bedrift/takk` page that fires the Google Ads conversion pixel on page load.
**Why:** The current implementation fires `gtag('event', 'conversion')` inside `HeroMicroForm.tsx`'s React `handleSubmit` callback. This is fragile:

1. If the user navigates away before the gtag call completes, the conversion is lost
2. If React re-renders during the async form submission, state gets lost
3. The `window.gtagLoaded` check adds coupling between form UI and tracking infrastructure

Google's official documentation recommends page-load conversion tracking as the most reliable method. A thank-you page URL can also be set as a conversion action directly in Google Ads UI (URL-based conversion), eliminating the need for custom JS triggers entirely.

**Implementation:**

```astro
---
// src/pages/nettside-for-bedrift/takk.astro
import LandingPageLayout from '@/layouts/LandingPageLayout.astro';
---

<LandingPageLayout
  title="Takk for din henvendelse | Nettup"
  description="Vi har mottatt din henvendelse og kontakter deg innen 24 timer."
  noIndex={true}
>
  <main class="flex min-h-[60vh] items-center justify-center">
    <div class="container mx-auto px-4 text-center">
      <!-- Confirmation content -->
      <h1 class="text-3xl font-bold md:text-4xl">Takk for din henvendelse!</h1>
      <p class="mt-4 text-lg text-text-muted">
        Vi har mottatt din melding og kontakter deg innen 24 timer.
      </p>
      <!-- Next steps, social proof, etc. -->
    </div>
  </main>
</LandingPageLayout>

<!-- Conversion tracking (fires on page load) -->
<script is:inline>
  // Google Ads conversion (only if consent was given on landing page)
  if (window.gtagLoaded && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17409050017/CONVERSION_LABEL_HERE',
    });
  }
  // Plausible (always fires, cookieless)
  window.plausible?.('B2B Form Submit');
</script>
```

**Form redirect pattern (in both HeroMicroForm.tsx and ContactForm.tsx):**

```typescript
// After successful Formspree POST:
if (response.ok) {
  window.location.href = '/nettside-for-bedrift/takk';
  return; // Don't set React state — we're navigating away
}
```

**Important:** `noIndex: true` prevents the thank-you page from being indexed. `LandingPageLayout` already supports this prop.

**Confidence:** HIGH. Google's official docs recommend page-load triggers. The existing `LandingPageLayout` already has all the gtag infrastructure needed.

### Pattern 3: Static Scarcity Counter (No Change to Approach)

**What:** Keep the scarcity counter as a static build-time value, same pattern as current `launchOffer.ts`.
**Why static, not dynamic:**

1. 10 spots total changes maybe once per month
2. Vercel rebuild takes ~1 second, deploys in seconds
3. No database, API endpoint, or real-time updates needed
4. Prevents gaming (bots triggering fake urgency)
5. Zero JS cost for the counter

**Update workflow:**
1. Sign a customer
2. Update `taken` in `subscriptionOffer.ts`
3. Commit and push, Vercel auto-deploys
4. Counter updates site-wide within minutes

**Confidence:** HIGH. This is the existing pattern and it works.

### Pattern 4: A/B Testing via Google Ads Experiments (Not Client-Side)

**What:** If A/B testing is needed, use Google Ads Experiments to split traffic at the campaign level between different landing page URLs.
**When:** NOT for v1.6 launch. Only after 2-4 weeks of data if the page underperforms.

**Implementation (when needed):**
1. Create variant at `/nettside-for-bedrift/v2/index.astro` (uses same `_sections/` components)
2. Set `noIndex: true` on variant
3. In Google Ads, create Experiment splitting traffic 50/50 between URLs
4. Both variants share the same `/takk` page so conversions track identically
5. After statistical significance (3-4 weeks minimum), keep winner, delete loser

**Why not client-side A/B testing:**
- No new dependencies (no Optimizely, VWO, Google Optimize replacement)
- Astro static rendering means no layout shift from A/B script loading
- Google Ads Experiments is free and built into the platform
- Cleaner analytics: each URL variant has its own Plausible page views

**Confidence:** HIGH. Google Ads Experiments is the standard approach.

### Pattern 5: Ad Campaign Documentation as Config Files

**What:** Store ad copy, keywords, and campaign structure in `src/config/ads/`.
**Why:** Version history, PR review for ad copy changes, and co-location prevents drift between ad messaging and landing page content.

**Structure:**

```
src/config/ads/
  keywords.ts              # Keyword lists with match types
  ad-copy.ts               # Ad headlines and descriptions
  campaign-structure.md    # Campaign/ad group hierarchy doc
```

```typescript
// src/config/ads/keywords.ts
export interface Keyword {
  term: string;
  matchType: 'exact' | 'phrase' | 'broad';
  maxCpc?: number;
  adGroup: string;
}

export const keywords: Keyword[] = [
  { term: 'nettside for bedrift', matchType: 'exact', adGroup: 'nettside-bedrift' },
  { term: 'profesjonell nettside', matchType: 'phrase', adGroup: 'nettside-bedrift' },
  { term: 'billig nettside bedrift', matchType: 'phrase', adGroup: 'pris-fokus' },
  // ...
];
```

```typescript
// src/config/ads/ad-copy.ts
export interface AdVariant {
  id: string;
  headlines: string[];       // Max 30 chars each, up to 15
  descriptions: string[];    // Max 90 chars each, up to 4
  finalUrl: string;
}

export const adVariants: AdVariant[] = [
  {
    id: 'subscription-primary',
    headlines: [
      'Nettside for Bedrift',           // 20 chars
      '0 kr Oppstart',                   // 14 chars
      'Kun 399 kr/mnd',                 // 14 chars
      'Klar på 1-3 Uker',              // 17 chars
      '30 Dagers Garanti',              // 18 chars
    ],
    descriptions: [
      'Profesjonell nettside for din bedrift. 0 kr oppstart, kun 399 kr/mnd. Responsivt design, SEO og support.',
      'Kun 10 plasser til denne prisen. Moderne nettside med alt inkludert. Kontakt oss for et uforpliktende tilbud.',
    ],
    finalUrl: 'https://nettup.no/nettside-for-bedrift',
  },
];
```

**Confidence:** MEDIUM. This is an opinionated pattern. Managing only in Google Ads UI also works, but co-location prevents ad/landing page message mismatch.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Keeping 3-Tier Pricing on a Subscription Landing Page

**What:** Showing Enkel/Standard/Premium tiers alongside the subscription offer.
**Why bad:** Decision paralysis. The Google Ads visitor saw "0 kr oppstart, 399 kr/mnd" in the ad. Give them exactly that. Multiple tiers create friction and confusion about which price was advertised.
**Instead:** Single prominent subscription offer. Upsell services (nettbutikk, webapp) shown as secondary cards below for visitors who need more.

### Anti-Pattern 2: Firing Conversion Events in React State Handlers

**What:** The current `HeroMicroForm.tsx` fires `gtag('event', 'conversion')` inside the `handleSubmit` success callback (line 63-66).
**Why bad:** If the user navigates away, closes the tab, or React re-renders before the gtag call completes, the conversion is lost. Also creates coupling between form UI and tracking infrastructure.
**Instead:** Redirect to `/takk` page, fire conversion on page load.

### Anti-Pattern 3: Dynamic Scarcity Counter via API

**What:** Building a serverless API endpoint to track remaining spots in real-time.
**Why bad:** Over-engineering for 10 spots. Adds database dependency, API latency, and race condition risk.
**Instead:** Static config value, updated via git commit. Vercel rebuilds in seconds.

### Anti-Pattern 4: Using Google Tag Manager for a Single Tag

**What:** Adding GTM container just to manage one gtag snippet.
**Why bad:** Extra script load, extra network request, zero benefit when you only have one tracking tag.
**Instead:** Direct gtag inline script (already implemented in `LandingPageLayout.astro`).

### Anti-Pattern 5: Separate Landing Pages per Keyword

**What:** Creating `/nettside-for-bedrift`, `/billig-nettside`, `/nettside-oslo` as separate pages.
**Why bad:** Content duplication, maintenance burden. City pages already exist at `/steder/oslo`.
**Instead:** One landing page with UTM parameters (`?kilde=google-ads&kampanje=nettside-bedrift`). Ad headline matches landing page H1.

## Integration Points with Existing Systems

### Formspree (No Change)

Existing integration (`xnjnzybj`) stays. Both `HeroMicroForm.tsx` and `ContactForm.tsx` POST to Formspree. The only change: redirect to `/takk` after success instead of inline confirmation.

### Plausible Analytics (Minor Addition)

Add `trackSubscriptionFormSubmit()` to `analytics.ts` or reuse existing `trackB2BFormSubmit()`. The thank-you page fires this via inline script (same pattern as city page tracking with `is:inline` IIFE).

### Google Ads gtag (Relocated, Not Changed)

The consent/loading infrastructure in `LandingPageLayout.astro` stays unchanged. The `GTAG_ID` (`AW-17409050017`) and consent flow (`nettup_ads_consent` localStorage key) are already correct. Only the conversion event firing location moves from React component to thank-you page.

### pricing-config.ts (No Change)

The additive pricing calculator at `/priskalkulator` uses `pricing-config.ts`. This is completely separate from the landing page subscription offer. Different audiences: calculator for custom quotes, subscription for fixed package.

### ContactForm.tsx Import Cleanup

`ContactForm.tsx` currently imports from `@/config/pricing` (the old `pakker` array) for `PAKKE_INFO`. This import needs to be removed or replaced. The `pakke` form field can be hardcoded to "Abonnement 399 kr/mnd" or removed entirely since there's only one offer.

## Suggested Build Order

Dependencies flow top-down. Each phase can be built and tested independently.

```
Phase 1: Config Foundation (no visual changes yet)
  1. Create src/config/subscriptionOffer.ts
  2. Verify types compile

Phase 2: Thank-You Page + Conversion Flow (can test with existing page)
  3. Create src/pages/nettside-for-bedrift/takk.astro
  4. Modify HeroMicroForm.tsx — redirect to /takk after success
  5. Modify ContactForm.tsx — redirect to /takk when context="b2b"
  6. Remove gtag conversion firing from HeroMicroForm.tsx
  7. Add/verify tracking in analytics.ts
  8. Test: form submit → redirect → conversion pixel fires

Phase 3: Landing Page Content Rebuild (bulk of work)
  9. Rewrite Hero.astro — new headline, subscription price, remove old crossed-out price
  10. Rewrite PricingSummary.astro — single offer card + upsell cards
  11. Update ScarcityCounter.astro — import from subscriptionOffer.ts
  12. Update FormSection.astro — remove package selection logic, simplify heading
  13. Rewrite FAQ.astro — subscription-focused questions
  14. Update WhyUs.astro — subscription value props
  15. Update index.astro title/description
  16. Update LandingPageLayout.astro default description

Phase 4: Cleanup
  17. Delete src/config/launchOffer.ts
  18. Delete src/config/pricing.ts
  19. Verify no other imports reference deleted files
  20. Update any chatbot config that references old pricing

Phase 5: Ad Campaign Documentation
  21. Create src/config/ads/keywords.ts
  22. Create src/config/ads/ad-copy.ts
  23. Create src/config/ads/campaign-structure.md
  24. Verify ad headlines match landing page H1

Phase 6: QA + Launch
  25. Lighthouse audit (LCP < 2s)
  26. Mobile responsive check (375px)
  27. Form submission end-to-end test
  28. Conversion tracking verification (Google Ads Tag Assistant)
  29. Cookie consent flow verification
  30. Plausible event verification
```

**Build order rationale:**
- Config first because everything depends on the data model
- Thank-you page before content rebuild because the conversion flow can be tested with the existing landing page (old content, new tracking)
- Content rebuild is the bulk of work but has no external dependencies
- Cleanup after content rebuild to avoid broken imports during development
- Ad campaign docs last because they reference final landing page content
- QA spans everything and should include both technical (Lighthouse, tracking) and content (ad/page message match) verification

## Scalability Considerations

| Concern | Now (10 customers) | At 50 customers | At 200+ customers |
|---------|--------------------|-----------------|--------------------|
| Scarcity counter | Static config, manual update | Same | Remove scarcity or raise cap |
| Form submissions | Formspree free tier (50/mo) | Formspree paid ($10/mo) | Consider serverless endpoint |
| Conversion tracking | Direct gtag on thank-you page | Same | Consider GTM if adding more pixels |
| A/B testing | Not needed | Google Ads Experiments | Same |
| Ad campaigns | Single campaign | Multiple campaigns/ad groups | Consider agency tooling |

## Sources

- [Set up conversions with a URL - Google Ads Help](https://support.google.com/google-ads/answer/12676738?hl=en) - HIGH confidence (official docs)
- [Google Ads Conversion Tracking Guide 2026](https://growthmindedmarketing.com/blog/google-ads-conversion-tracking/) - MEDIUM confidence
- [Google Ads Experiments 2025](https://www.karooya.com/blog/google-ads-experiments-a-b-test-bidding-creatives-campaign-changes-effectively/) - MEDIUM confidence
- [Enhanced Conversions Guide 2026](https://www.leverdigital.co.uk/guides/the-complete-guide-to-enhanced-conversions-in-google-ads) - MEDIUM confidence
- Existing codebase: `LandingPageLayout.astro`, `HeroMicroForm.tsx`, `ContactForm.tsx`, `pricing.ts`, `launchOffer.ts`, `ScarcityCounter.astro`, `analytics.ts` - HIGH confidence (primary sources)

---
*Architecture research for: nettup.no v1.6 - Landing page rebuild + Google Ads*
*Researched: 2026-03-19*
