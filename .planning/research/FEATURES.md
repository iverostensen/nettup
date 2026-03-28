# Feature Landscape

**Domain:** Multi-channel ad campaign infrastructure (Meta Pixel, ad creatives, ad copy, lead forms, retargeting, audience targeting, A/B testing, multi-channel strategy)
**Milestone:** v1.7 Multi-Channel Ad Campaign (nettup.no)
**Researched:** 2026-03-28
**Confidence:** HIGH (Meta Pixel integration patterns well-documented; Norwegian market benchmarks verified; consent patterns verified against Norwegian E-Com Act + Datatilsynet enforcement)

---

## Existing Infrastructure (Already Built in v1.6)

These capabilities exist and work. v1.7 features build on top of them.

| Capability | Component | Status |
|-----------|-----------|--------|
| Google Ads Consent Mode v2 (advanced) | LandingPageLayout.astro consent IIFE | Production |
| Cookie consent banner | LandingPageLayout.astro DOM + localStorage | Production |
| GTM-free gtag with denied defaults | Inline script, always loads | Production |
| Plausible Analytics (cookieless) | BaseLayout + LandingPageLayout, 7 Goals | Production |
| UTM capture (3 params: source, medium, campaign) | src/lib/utm.ts, sessionStorage | Production |
| Conversion tracking (gtag + Plausible) | /takk page, dual events fire on load | Production |
| Subscription landing page | /nettside-for-bedrift (single-offer, 0 kr + 399 kr/mnd) | Production |
| B2B micro-form + redirect to /takk | HeroMicroForm.tsx (email-only) + ContactForm.tsx | Production |
| Privacy policy (Google Ads disclosed) | /personvern | Production |
| Formspree with honeypot | xnjnzybj, hidden _gotcha field | Production |
| subscriptionOffer.ts SSOT | Price, features, terms, meta | Production |
| `nettup_ads_consent` localStorage key | Consent state persisted across sessions | Production |
| noindex on landing page | No SEO cannibalization with /tjenester/nettside | Production |

---

## Table Stakes

Features v1.7 MUST have. Missing any means the Facebook campaign cannot launch or runs without proper tracking.

### TS-1: Meta Pixel Integration with Consent-Aware Loading

| Aspect | Detail |
|--------|--------|
| Why expected | Cannot run Facebook/Instagram ad campaigns without a pixel. No pixel = no conversion tracking, no retargeting audiences, no lookalike audience seeding. Facebook Ads Manager requires pixel data to optimize delivery. |
| Complexity | Medium |
| Dependencies | LandingPageLayout.astro (existing consent IIFE), env.d.ts |

**What to build:**

- Load fbevents.js CDN script in LandingPageLayout.astro, inside the existing consent IIFE
- Call `fbq('consent', 'revoke')` BEFORE `fbq('init')` -- this is the Meta GDPR pattern (equivalent to Google's denied defaults)
- Call `fbq('init', 'PIXEL_ID')` and `fbq('track', 'PageView')` after revoke
- On stored consent = granted: call `fbq('consent', 'grant')` alongside existing gtag consent update
- On accept button click: add `fbq('consent', 'grant')` to existing handler
- On decline: no change needed (revoked state is the default)
- Add `window.fbq` type to env.d.ts Window interface
- Add `dns-prefetch` and `preconnect` hints for `connect.facebook.net` in `<head>`
- Do NOT add `<noscript><img>` fallback (sends data without consent)
- Do NOT add pixel to BaseLayout -- only LandingPageLayout pages need it

**Why pixel-only (no CAPI):** Multiple sources confirm client-side pixel is sufficient for campaigns under ~1000 EUR/month. Meta Conversions API requires server-side infrastructure, access token management, and event deduplication. Document CAPI as v2.0 upgrade path.

### TS-2: ViewContent + Lead Standard Events

| Aspect | Detail |
|--------|--------|
| Why expected | PageView alone is too broad for useful retargeting. ViewContent on the landing page + Lead on /takk enables the critical audience split: "visited but didn't convert" vs "converted." These are Meta's standard events, recognized by Ads Manager for Custom Audience creation and optimization event selection. Never use custom events to replace standard events -- Meta's global data for standard events improves optimization. |
| Complexity | Low |
| Dependencies | TS-1 (pixel must be loaded) |

**What to build:**

- `fbq('track', 'ViewContent', { content_name: 'Nettside Abonnement', content_category: 'Landing Page', value: 399, currency: 'NOK' })` on /nettside-for-bedrift page load
- `fbq('track', 'Lead', { content_name: 'Nettside Abonnement', value: 399, currency: 'NOK' })` on /nettside-for-bedrift/takk page load (alongside existing gtag conversion + Plausible event)
- Both fire as inline scripts (`<script is:inline>`), matching existing conversion event pattern on /takk
- `value: 399` enables Meta's ROAS optimization
- Optional: add `FormStart` custom event in HeroMicroForm.tsx on first email field focus for high-intent retargeting (one-time fire per session using a flag)

### TS-3: UTM Expansion (5 Standard Parameters)

| Aspect | Detail |
|--------|--------|
| Why expected | Facebook Ads use dynamic URL parameters ({{ad.name}}, {{adset.name}}) that map to utm_content and utm_term. Current implementation only captures 3 params. Without utm_content and utm_term, Formspree submissions cannot attribute which specific ad creative and audience segment drove each lead. |
| Complexity | Negligible |
| Dependencies | None (independent of pixel work) |

**What to build:**

- Add `'utm_content'` and `'utm_term'` to the UTM_KEYS array in src/lib/utm.ts
- That is the entire code change. captureUtmParams() and getUtmParams() are already generic over the array. HeroMicroForm and ContactForm already spread getUtmParams() into submissions
- Document the Facebook URL template: `?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}`

### TS-4: Privacy Policy Update (Meta Pixel Disclosure)

| Aspect | Detail |
|--------|--------|
| Why expected | GDPR requires informing data subjects about all processors before data collection begins. Current privacy policy discloses Google but not Meta. Launching Meta Pixel without updating the policy is a compliance violation. Datatilsynet specifically cited incomplete privacy disclosures in their 2025 enforcement wave, issuing 2.92B EUR in GDPR fines across Europe for improper pixel implementations. |
| Complexity | Low |
| Dependencies | TS-1 (must document what is implemented) |

**What to build:**

- Add section 2.4 "Meta Pixel (landingssider)" to personvern/index.astro, mirroring existing section 2.3 for Google
- Add "Meta (Facebook/Instagram)" entry to section 4 "Hvem deler vi data med" with processor details and DPF legal basis
- Add Meta cookies (_fbp, _fbc) to section 5 under Landingssider subsection
- Add "Male annonseeffekt (Meta Ads)" row to section 3 legal basis table with "Samtykke (GDPR art. 6(1)(a))"
- Update lastUpdated date

### TS-5: Consent Banner Button Parity

| Aspect | Detail |
|--------|--------|
| Why expected | Norway's E-Com Act (January 2025) requires accept and reject buttons with equal visual prominence. Current banner has "Avsla" as outline/ghost button and "Godta" as solid brand button. Datatilsynet explicitly cited "manipulative consent practices" and "nudging" in their 2025 enforcement actions. Adding a second tracking pixel to a non-compliant banner doubles the legal risk surface. |
| Complexity | Low |
| Dependencies | None (independent, but should ship alongside TS-1) |

**What to build:**

- Restyle both consent banner buttons to have equal visual weight
- Both solid buttons: "Avsla" with same padding, font-weight, and border-radius as "Godta" but neutral color (e.g., bg-white/10 vs bg-brand)
- Do NOT use ghost/outline for decline and solid for accept
- CSS-only change to existing button classes in LandingPageLayout.astro

### TS-6: Ad Creative Image Templates

| Aspect | Detail |
|--------|--------|
| Why expected | Cannot run Facebook/Instagram ads without visual creatives. Need minimum 4 feed (1080x1080, 1:1) + 2 story (1080x1920, 9:16) images for A/B testing. Plus 1 custom OG image (1200x630) for landing page social preview. Creatives must match brand exactly (colors, fonts, tone) for landing page consistency. |
| Complexity | Medium-High |
| Dependencies | satori + @resvg/resvg-js (new dev dependencies), brand.ts, @fontsource fonts |

**What to build:**

- Build script at src/scripts/ads/generate-creatives.ts run via `tsx`
- 4 feed templates (1080x1080 PNG):
  - Price-focused: "0 kr oppstart" hero text, brand gradient background
  - Problem-agitation: "Er nettsiden din fra 2015?" problem framing
  - Benefit-focused: "Ferdig pa 14 dager" outcome promise
  - Objection-handling: "Ingen bindingstid" reassurance
- 2 story templates (1080x1920 PNG):
  - Price CTA: full-screen price with swipe-up prompt (safe zone: avoid top 14% and bottom 20% for Meta UI elements)
  - Before/after concept: old vs modern website comparison
- 1 custom OG image (1200x630 PNG) for /nettside-for-bedrift with price offer
- All use Inter + Space Grotesk from @fontsource, brand colors from brand.ts
- Output to public/images/ads/ (OG image) and .planning/ads/creatives/ (for Meta Ads Manager upload)
- PNG format for text-heavy creatives (superior quality vs JPG). Max 30MB per Meta specs
- Price (0 kr + 399 kr/mnd) must be readable at mobile feed size (~320px rendered width)

**Format specs (verified from Meta Ads Guide 2026):**

| Format | Dimensions | Aspect Ratio | Placements |
|--------|-----------|-------------|------------|
| Feed square | 1080x1080 | 1:1 | Feed, Marketplace, Right Column, Messenger |
| Story/Reel | 1080x1920 | 9:16 | Stories, Reels, Audience Network interstitials |
| OG image | 1200x630 | ~1.91:1 | Link preview in Feed ads |

### TS-7: Ad Copy Document

| Aspect | Detail |
|--------|--------|
| Why expected | Ad copy is the #1 determinant of CTR. Must have all hook/body/CTA variants documented before campaign setup. Norwegian bokmal, matching brand tone ("Professional but approachable"). |
| Complexity | Low (documentation, not code) |
| Dependencies | subscriptionOffer.ts (prices must match SSOT) |

**What to build:**

- .planning/ads/copy/FACEBOOK-AD-COPY.md with:
  - 4+ primary text variants using PAS framework (Problem-Agitate-Solve). Each tests a different pain point
  - 4+ headline variants (under 40 characters for full mobile visibility)
  - 2-3 description variants (supporting text below headline)
  - CTA button recommendation: "Kom i gang" for website conversion, "Send inn" for lead forms
  - Hook-first structure: first line must contain price hook (0 kr) or pain point. Never start with "Vi tilbyr..."
  - UTM template per variant: `utm_source=facebook&utm_medium=paid_social&utm_campaign=[name]&utm_content=[creative_id]&utm_term=[audience]`
  - Audience-specific copy: cold (problem-aware), warm (offer-specific), hot (recovery "Du var nesten der")
  - All copy in Norwegian bokmal. No English buzzwords. No em dashes. No excessive emoji

**Copy framework rules:**

| Rule | Rationale |
|------|-----------|
| Facebook truncates at ~125 chars on mobile | Keep primary text to 2-3 short sentences |
| Headlines under 40 chars | Full visibility without truncation |
| No competitor names | Norwegian business culture values understatement; use "vanlig webbyra" (generic) |
| No clickbait | "Du vil ikke tro..." undermines professional positioning |
| Price anchoring allowed | "Andre tar 15 000+ kr" against generic industry, not named competitors |

---

## Differentiators

Features that improve campaign performance or operational efficiency. Not blockers for launch, but deliver measurable lift.

### D-1: Lead Form Specification (Facebook Instant Forms)

| Aspect | Detail |
|--------|--------|
| Value proposition | Facebook Instant Forms generate 2.4x more leads than website conversion campaigns and cost 20% less per lead (Meta published data). For a low-consideration 399 kr/mnd offer, the reduced friction of pre-filled in-platform forms is a strong match. Running both paths (instant form + website conversion) simultaneously provides the best data. |
| Complexity | Low (specification document, not code) |
| Dependencies | TS-4 (privacy policy URL needed for form) |

**What to build:**

- .planning/ads/copy/LEAD-FORM-SPEC.md with:
  - Form type: **Higher Intent** (adds review/confirmation step, filtering impulse clickers)
  - Fields: Navn (name, pre-filled), E-post (email, pre-filled), Telefon (phone, pre-filled)
  - Qualifying question: "Har bedriften din nettside i dag?" (Yes/No) -- filters non-buyers, increases lead quality 20-30% at ~15% volume cost
  - Context card (intro screen): offer summary (0 kr + 399 kr/mnd, 3 bullet benefits) before fields
  - Thank-you screen: "Takk! Vi ringer deg innen 24 timer." + "Visit Website" button to /tjenester
  - Privacy policy link: /personvern (after TS-4 update)
  - Maximum 4 fields total (name + email + phone + 1 qualifier). Each additional field reduces conversion ~10%
  - Do NOT make company name required (Facebook can't pre-fill it; manual entry doubles abandonment)
  - Do NOT use "More volume" form type (pre-submits, junk leads). Always "Higher intent"
  - Dual-path recommendation: 60/40 budget split favoring instant forms, adjust based on close rates after 2 weeks

**Lead form notification:** Facebook Lead Center provides free real-time email notifications. No Zapier/webhook automation needed at <5 leads/day volume.

### D-2: Audience Targeting Definitions

| Aspect | Detail |
|--------|--------|
| Value proposition | Targeting is the second most important factor (after creative) in Facebook ad performance. Documenting audience specs prevents trial-and-error waste in Ads Manager. Critical caveat: Meta retired many detailed targeting options Jan 15, 2026 and removed exclusion targeting March 2025. |
| Complexity | Low (documentation, not code) |
| Dependencies | None |

**What to build:**

- .planning/ads/strategy/AUDIENCE-TARGETING.md with:

**Cold audiences (60% of launch budget):**

| Targeting Layer | Specification | Notes |
|----------------|---------------|-------|
| Geography | Oslo + Viken (matching 8 city pages), expandable to rest of Norway | Primary market first |
| Age | 25-55 | Business decision-maker range; let Meta optimize within |
| Language | Norwegian | Both ad language and audience language |
| Interest layer 1 | "Entreprenorskap" OR "Smabedrift" OR "Daglig leder" | Business ownership signals |
| Interest layer 2 | Squarespace OR Wix OR WordPress (competitor users) | Signals website need |
| Behavior | Facebook Page Admins (verify availability post-Jan 2026) | Strong business ownership signal |
| Advantage+ audience | Run as parallel test against manual targeting | Meta's AI often outperforms manual at scale |

**Warm audiences (30% of launch budget, activate after 7+ days of pixel data):**

| Audience | Definition | Activation Threshold |
|----------|-----------|---------------------|
| ViewContent visitors | /nettside-for-bedrift visitors last 30 days who didn't convert | 100+ visitors |
| FormStart abandoners | Started form but didn't submit (requires FormStart custom event) | 50+ events |

**Hot audiences (10%, activate after sufficient conversions):**

| Audience | Definition | Activation Threshold |
|----------|-----------|---------------------|
| Lookalike 1% from converters | Users similar to Lead event converters | 50+ conversions |
| Lookalike 2-5% | Broader expansion of converter lookalike | After 1% is profitable |

**Anti-patterns for targeting:**
- Do NOT stack 10+ interests (post-2026, broad audiences >500k perform better)
- Do NOT rely on job titles only (Norwegian profiles rarely list accurate titles)
- Do NOT attempt audience exclusions (removed by Meta March 2025)
- Do NOT target below age 25 (very few Norwegian SMB owners)
- Do NOT target internationally (Norwegian-only offer)

### D-3: A/B Testing Framework Document

| Aspect | Detail |
|--------|--------|
| Value proposition | Without explicit kill criteria and scaling rules, ad optimization is gut-feel. At small budgets (50-200 NOK/day), data noise is high and requires disciplined decision rules. |
| Complexity | Low (documentation, not code) |
| Dependencies | D-4 (strategy context) |

**What to build:**

- .planning/ads/strategy/AB-TESTING-PLAN.md with:

**Campaign structure:**
- Separate testing campaigns from scaling campaigns (never mix)
- Testing: discover winners at controlled budget
- Scaling: amplify proven winners only

**Minimum data thresholds:**
- 2000+ impressions per creative before any decision
- 50-100 NOK spend per variant minimum
- 3-day observation window (no early kills, daily variance is 3-5x at small budgets)

**Kill criteria (three-strike system):**
- Strike 1: CPA > target (150 NOK) by 20% for 3 consecutive days
- Strike 2: CPM up 25%+ from start without CPA recovery
- Strike 3: Frequency > 4.0 in any 7-day window
- 2 strikes = 50% budget reduction and monitor
- 3 strikes = kill creative, archive as "Fatigued"

**Testing sequence (one variable at a time):**
- Week 1-2: Test 4 value prop angles (same format, same audience)
- Week 3-4: Test format (static vs carousel) with winning message
- Week 5-6: Test audience segments with winning creative+format

**Scaling rules for winners:**
- Graduate to scaling: CPA below 150 NOK after 100+ NOK spend
- Budget increase: 20% every 3 days (never >20%, resets learning phase)
- Never 2x budget overnight

**Phase-gated budget escalation:**
- Phase 1 (Day 1-7): 50 NOK/day testing, total ~350 NOK
- Phase 2 (Day 8-21): 100 NOK/day with 2-3 winning creatives
- Phase 3 (Day 22+): 200+ NOK/day scaling winners only

**Creative fatigue monitoring:**
- Half-life ~21 days
- When CTR drops 20% from peak AND frequency > 3.0, rotate creative
- Always have 2-3 tested reserve creatives ready
- Refresh cycle: new batch every 2-3 weeks

### D-4: Multi-Channel Strategy Document

| Aspect | Detail |
|--------|--------|
| Value proposition | Prevents "split budget too thin" mistake. Documents phased approach with trigger criteria. Key insight: under ~3000 NOK/month per channel, you cannot reach statistical significance. |
| Complexity | Low (documentation, not code) |
| Dependencies | None |

**What to build:**

- .planning/ads/strategy/MULTI-CHANNEL-STRATEGY.md with:

**Channel priority and rationale:**

| Channel | Role | Budget Share | Rationale |
|---------|------|-------------|-----------|
| Facebook/Instagram | Primary (70-80%) | Start at 100% | Norway CPM 33% below global ($13.42 vs $20.10). CPC ~8.50 NOK. Discovery-driven purchase, visual format matches subscription offer |
| Google Ads (long-tail) | Secondary (15-25%) | Add in Month 2 | Already documented in v1.6. Captures high-intent "need website now" searches. Saturated market (50+ agencies, 25-40 NOK CPC) so long-tail only |
| TikTok | Experimental (5-10%) | Phase 3 only | Norwegian B2B audience unproven. Requires video creative. Defer until Facebook+Google prove profitable |

**Budget thresholds:**
- Under 3000 NOK/month total: 100% Facebook. Single-channel focus
- 3000-5000 NOK/month: 80/20 Facebook/Google
- Above 5000 NOK/month: 70/20/10 with experimental channel

**Phased rollout:**
- Month 1: Facebook only (learn, optimize, find winning creative)
- Month 2: Add Google long-tail (only after Facebook CPA stabilizes)
- Month 3: Evaluate TikTok (only if Facebook audience saturated)

**Seasonal adjustments for Norway:**
- Higher CPM periods: Easter, May 17 (Syttende Mai), Black Friday, Christmas
- Lower CPM periods: January, late August
- Plan budget increases during cheap periods, maintain minimum during expensive periods

**Channels to explicitly NOT use:**
- LinkedIn: 80-120 NOK CPC in Norway (10-14x Facebook). Only viable for 50,000+ NOK contracts
- Display/banner: Low intent, dramatically higher CPL
- Programmatic: Requires DSP, 10,000+ NOK/month minimums

### D-5: Meta Pixel Kill Switch (Config Flag)

| Aspect | Detail |
|--------|--------|
| Value proposition | If the EU-US Data Privacy Framework is invalidated (Schrems III risk), Meta Pixel becomes immediately illegal. A config flag allows disabling with a one-line change. |
| Complexity | Low |
| Dependencies | TS-1 |

**What to build:**

- Add `META_PIXEL_ENABLED: boolean` to src/config/tracking.ts
- Wrap fbq loader in LandingPageLayout with conditional check
- When disabled: no fbevents.js loads, no fbq calls, consent banner stays generic
- When enabled: full pixel functionality

### D-6: Unified Tracking Config (Single Source of Truth)

| Aspect | Detail |
|--------|--------|
| Value proposition | Pixel IDs, conversion labels, and settings are currently scattered across LandingPageLayout.astro (gtag ID inline), takk.astro (conversion label inline), and proposed pixel integration. A single tracking.ts prevents ID mismatches. |
| Complexity | Low |
| Dependencies | None |

**What to build:**

- src/config/tracking.ts with all tracking IDs:
  ```typescript
  export const tracking = {
    google: { id: 'AW-17409050017', conversionLabel: 'EvwaCNm05eFbEKGLpO1A' },
    meta: { pixelId: 'YOUR_PIXEL_ID', enabled: true },
    plausible: { domain: 'nettup.no' },
    consent: { storageKey: 'nettup_ads_consent' },
  } as const;
  ```
- Import in LandingPageLayout.astro and takk.astro instead of hardcoded strings
- Note: inline scripts cannot import ES modules. Values need injection as `data-*` attributes or inline `<script>` variable definitions

### D-7: Custom OG Image for Landing Page

| Aspect | Detail |
|--------|--------|
| Value proposition | Current landing page uses generic og-image.jpg. When shared or previewed in Facebook ad link previews, an offer-specific OG image (showing "0 kr oppstart, 399 kr/mnd") dramatically improves click-through from link preview |
| Complexity | Low |
| Dependencies | Can be part of TS-6 creative generation script |

**What to build:**

- 1200x630 PNG with subscription offer prominently displayed
- Update LandingPageLayout.astro og:image meta tag for /nettside-for-bedrift
- Brand colors and fonts matching other creatives

---

## Anti-Features

Features to explicitly NOT build for v1.7.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Meta Pixel on all pages (BaseLayout) | Only paid ad traffic arrives at /nettside-for-bedrift. Adding pixel to all pages forces consent banner on every page, degrading UX for organic visitors who currently see zero cookie banners (Plausible is cookieless). | Pixel only in LandingPageLayout. Expand scope only if retargeting strategy explicitly needs broader site coverage. |
| Conversions API (CAPI) server-side | Adds server endpoint, access token management, event deduplication. Multiple sources confirm pixel-only is sufficient for campaigns under ~1000 EUR/month. | Evaluate after 4 weeks of campaign data. Add CAPI when ad spend exceeds this or match rates drop below 60%. |
| GTM (Google Tag Manager) | Overkill for 2 tracking tags. Adds container load (80-120KB), management layer. Direct script tags are simpler, faster, and already established. | Continue with direct gtag + fbq script tags. Evaluate GTM only at 5+ tracking scripts. |
| Advanced matching (PII hashing) | Sends hashed email/phone to Meta for better match rates. Additional GDPR compliance burden for marginal improvement at small scale. | Standard pixel matching at launch. Revisit when match rates need improvement. |
| Video ad creatives | Video delivers 47% higher engagement and 34% higher conversion rate BUT requires production resources disproportionate to v1.7 scope. | Start with static. Document video as the #1 scaling lever for v2.0 if static creatives prove profitable. |
| Dynamic Creative Optimization (DCO) from day 1 | DCO lets Meta mix elements but obscures which combination won. Bad for learning. | Manual creative testing first. Switch to DCO only after identifying 3+ validated winning elements. |
| Automated Ads Manager rules | At 50-200 NOK/day, automated rules overreact to daily variance. One bad day triggers premature budget cuts. | Manual daily review for first 30 days. |
| Automated lead scoring | Requires CRM integration, scoring model, calibration. Premature at 0 leads/day. | Manual qualification via phone call. Track lead quality in a spreadsheet. |
| Cross-channel event deduplication | Google and Meta attribution models are opaque and incompatible. | Use Formspree submission count as source of truth. Accept platform totals will exceed actual leads. |
| Facebook/Instagram Login SDK | Social login is irrelevant for B2B lead generation landing page. | Continue with email-based form submission. |
| Pixel events on chatbot | Chatbot excluded from LandingPageLayout. Adding pixel events would require pixel on BaseLayout. | Chatbot interactions tracked via Plausible only. |
| TikTok ads at launch | Norwegian B2B audience unproven. Requires video creative. | Document as Phase 3 experimental channel if Facebook+Google prove profitable. |
| LinkedIn ads | 80-120 NOK CPC in Norway. Only viable for 50,000+ NOK contracts. | Explicitly ruled out for 399 kr/mnd offer. |
| More than 6 initial creatives | Dilutes budget. Need ~2000 impressions per creative. At 50 NOK/day, 6 creatives need ~24 days for statistical confidence. | Launch with 4 feed + 2 story = 6 total. Add variants only after initial data. |
| Placeholder testimonial creatives | Testimonials still placeholder per PROJECT.md. Fake quotes in paid ads are deceptive and may violate markedsforingsloven. | Defer testimonial ads until real quotes exist. Use benefit-driven copy. |

---

## Feature Dependencies

```
TS-1 (Meta Pixel) --> TS-2 (Retargeting Events)
  Pixel must be loaded before events can fire

TS-1 (Meta Pixel) --> TS-4 (Privacy Policy)
  Must document what is implemented

TS-1 (Meta Pixel) --> D-5 (Kill Switch)
  Can't disable what doesn't exist yet

TS-5 (Consent Parity) -- should ship WITH TS-1 (same layout file edit)

TS-3 (UTM Expansion) -- independent, no blockers, one-line code change

TS-6 (Ad Creatives) -- independent of pixel work, can run in parallel
  |
  +-- TS-7 (Ad Copy) provides text content for creative overlays

D-1 (Lead Form Spec) -- depends on TS-4 (privacy policy URL)

D-2 (Audience Targeting) -- independent, pure documentation

D-3 (A/B Testing) -- depends on D-4 (strategy context)

D-4 (Multi-Channel Strategy) -- independent, pure documentation
```

**Critical path:** Meta Pixel + consent (TS-1) must ship first. All tracking, retargeting, and campaign optimization depends on the pixel collecting data. Ad copy, creatives, and all documentation can be prepared in parallel.

---

## MVP Recommendation

**Must ship together (cannot run Facebook ads without all of these):**

1. **TS-1: Meta Pixel + Consent** -- foundation for all Facebook campaign data
2. **TS-2: ViewContent + Lead Events** -- conversion optimization and retargeting audiences
3. **TS-3: UTM Expansion** -- per-creative attribution in Formspree
4. **TS-4: Privacy Policy Update** -- legal blocker, must deploy before pixel goes live
5. **TS-5: Consent Banner Parity** -- legal compliance, fix before adding second pixel

**Should ship before ads launch:**

6. **TS-6: Ad Creative Templates** -- need images to run ads
7. **TS-7: Ad Copy Document** -- need copy to set up campaigns
8. **D-2: Audience Targeting** -- need audience definitions for Ads Manager setup
9. **D-1: Lead Form Spec** -- defines the instant form conversion path

**Ship alongside or shortly after launch:**

10. **D-3: A/B Testing Framework** -- testing and scaling rules for optimization phase
11. **D-4: Multi-Channel Strategy** -- phased channel rollout and budget allocation
12. **D-5: Kill Switch** -- safety net, low effort
13. **D-7: Custom OG Image** -- improved link preview appearance

**Defer until data supports it:**

- **D-6: Unified Tracking Config** -- code hygiene, not campaign effectiveness. Evaluate at third tracking platform
- Meta Conversions API -- when ad spend > 1000 EUR/month
- Video creatives -- when static proves profitable
- City-specific ad sets -- when CPL varies >50% across regions
- CRM webhooks for lead forms -- when volume > 5 leads/day
- Cross-channel retargeting -- when both Facebook and Google are active

---

## Norwegian Market Benchmarks (Reference)

| Metric | Norway | Global | Confidence | Source |
|--------|--------|--------|------------|--------|
| Facebook CPM | $13.42 | $20.10 | HIGH | SuperAds 2025 |
| Facebook CTR | 1.56% | 1.81% | HIGH | SuperAds 2025 |
| Facebook CPC | ~8.50 NOK | ~12 NOK (est.) | MEDIUM | PROJECT.md + AdAmigo 2026 |
| B2B Facebook CVR | ~10.63% | ~10.63% | MEDIUM | SaaS Hero 2026 |
| Global Lead Form CPL | $28-42 (300-450 NOK) | Same | MEDIUM | LeadSync 2026 |
| Instant Form vs Website leads | 2.4x more volume | Same | HIGH | Meta published data |
| Instant Form vs Website CPL | 20% lower | Same | HIGH | Meta published data |
| Creative fatigue half-life | ~21 days | Same | MEDIUM | AdRow 2026 |
| Video vs static engagement | +47% for video | Same | MEDIUM | Multiple 2025-2026 |
| Min test impressions | 2000/creative | Same | HIGH | Meta + multiple sources |

**CPL target rationale:** 150 NOK target is aggressive vs global avg (300-450 NOK) but justified by: (1) low-friction subscription offer (0 kr oppstart, no commitment), (2) Norway's 33% below-average CPM, (3) instant form pre-fill reducing abandonment. If 150 NOK proves unrealistic, 200 NOK is still viable given 399 kr/mnd x 12 months = 4,788 NOK subscriber LTV.

**Seasonal note:** CPM/CPC rises during Easter, May 17, Black Friday, Christmas. January and August are typically the cheapest months for Norwegian Facebook ads.

---

## Sources

- [Meta Business Help Center: Standard Events Best Practices](https://www.facebook.com/business/help/2254103654917599) -- HIGH confidence
- [Meta Business Help Center: Standard Event Specifications](https://www.facebook.com/business/help/402791146561655) -- HIGH confidence
- [Meta Business Help Center: A/B Testing](https://www.facebook.com/business/help/1738164643098669) -- HIGH confidence
- [Meta Business Help Center: Website Custom Audiences](https://www.facebook.com/business/help/666509013483225) -- HIGH confidence
- [Meta Developers: Meta Pixel Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/) -- HIGH confidence
- [Meta Developers: Custom Audiences from Pixel](https://developers.facebook.com/docs/meta-pixel/implementation/custom-audiences) -- HIGH confidence
- [Meta Pixel GDPR Implementation (official)](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- HIGH confidence
- [Datatilsynet: Tracking Pixel Enforcement 2025](https://www.datatilsynet.no/en/news/news-2025/unlawful-sharing-of-personal-information-through-tracking-pixels-on-six-websites/) -- HIGH confidence
- [Norwegian E-Com Act Compliance (Cookie Information)](https://cookieinformation.com/resources/blog/norwegian-e-com-act-compliance-checklist/) -- HIGH confidence
- [satori GitHub (Vercel)](https://github.com/vercel/satori) -- HIGH confidence
- [Aimers: Facebook Ads Best Practices for 2026 (B2B)](https://aimers.io/blog/facebook-ads-best-practices) -- MEDIUM confidence
- [Aimers: Facebook Retargeting Ads for B2B SaaS 2026](https://aimers.io/blog/facebook-retargeting-ads-what-works-best-for-b2b-saas) -- MEDIUM confidence
- [Cropink: B2B Facebook Ads Guide 2026](https://cropink.com/b2b-facebook-ads) -- MEDIUM confidence
- [WordStream: Facebook Ad Targeting 2026](https://www.wordstream.com/blog/facebook-ad-targeting) -- MEDIUM confidence
- [SuperAds: Facebook CTR Benchmarks Norway 2025](https://www.superads.ai/facebook-ads-costs/ctr-click-through-rate/norway) -- HIGH confidence
- [SuperAds: Facebook CPM Benchmarks Norway 2025](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/norway) -- HIGH confidence
- [LeadSync: Facebook Lead Ads CPL Benchmarks 2026](https://leadsync.me/blog/facebook-lead-ads-cost-per-lead/) -- MEDIUM confidence
- [LeadSync: Instant Forms vs Website Forms](https://leadsync.me/blog/facebook-instant-forms-vs-website-forms/) -- MEDIUM confidence
- [AdRow: Creative Testing Framework for Meta Ads 2026](https://adrow.ai/en/blog/creative-testing-framework-meta-ads/) -- MEDIUM confidence
- [Buffer: Facebook Ad Specs 2026](https://buffer.com/resources/facebook-ad-specs-image-sizes/) -- MEDIUM confidence
- [Shopify: Facebook Ad Sizes 2026](https://www.shopify.com/blog/facebook-ad-sizes) -- MEDIUM confidence
- [Jon Loomer: Standard Events, Custom Events, Custom Conversions](https://www.jonloomer.com/standard-events-custom-events-and-custom-conversions/) -- MEDIUM confidence
- [Jon Loomer: Testing Quality Leads from Instant Forms vs Website](https://www.jonloomer.com/testing-quality-leads/) -- MEDIUM confidence
- [SecurePrivacy: Meta Consent Mode Explained 2025](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025) -- MEDIUM confidence
- [Stackmatix: Facebook vs Google Ads Cost 2026](https://www.stackmatix.com/blog/facebook-ads-vs-google-ads-cost) -- MEDIUM confidence
- [Zopply: Digital Marketing Budget Allocation for SMEs](https://zopply.com/digital-marketing/digital-marketing-budget-allocation/) -- MEDIUM confidence
- [TheEEDigital: 2026 Facebook Ads Benchmarks](https://www.theedigital.com/blog/facebook-ads-benchmarks) -- MEDIUM confidence
- [AdAmigo: Meta CPC/CPM Benchmarks by Country 2026](https://www.adamigo.ai/blog/meta-ads-cpm-cpc-benchmarks-by-country-2026) -- MEDIUM confidence
- [SaaS Hero: B2B SaaS Facebook Conversion Benchmarks 2026](https://www.saashero.net/strategy/b2b-saas-facebook-conversion-benchmarks/) -- MEDIUM confidence
- [AdNabu: Conversions API vs Meta Pixel 2026](https://blog.adnabu.com/facebook-pixel/facebook-conversions-api-vs-pixel/) -- MEDIUM confidence
- Existing codebase: LandingPageLayout.astro, utm.ts, takk.astro, HeroMicroForm.tsx, personvern/index.astro -- HIGH confidence

---
*Feature research for: Nettup v1.7 -- Multi-Channel Ad Campaign*
*Researched: 2026-03-28*
