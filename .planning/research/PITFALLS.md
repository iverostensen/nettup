# Domain Pitfalls

**Domain:** Subscription landing page + Google Ads for Norwegian web agency
**Project:** Nettup.no v1.6 Landingsside & Google Ads
**Researched:** 2026-03-19
**Confidence:** HIGH (codebase-verified issues + official Google docs + Norwegian law references)

---

## Critical Pitfalls

Mistakes that cause wasted ad spend, legal risk, or conversion collapse.

### Pitfall 1: Consent Mode v2 Not Implemented - Google Ads Conversion Tracking Breaks

**What goes wrong:** The current `LandingPageLayout.astro` (lines 186-241) implements basic consent mode: gtag only loads after cookie consent is granted via `localStorage`. Since July 2025, Google requires Consent Mode v2 for EEA traffic. Without advanced consent mode, Google disables remarketing, conversion tracking modeling, and demographic reporting. With only ~31% of users accepting cookies on average, the current implementation loses ~70% of conversion data.

**Why it happens:** The current consent implementation pre-dates Consent Mode v2 enforcement. It gates gtag loading entirely behind `localStorage.getItem('nettup_ads_consent') === 'granted'`, which is "basic" consent mode. Google needs "advanced" consent mode where gtag loads immediately with default consent states set to `denied`, then updates to `granted` after user consent. This enables cookieless pings and conversion modeling for non-consenting users.

**Consequences:**
- Smart Bidding (Target CPA, Maximize Conversions) operates with incomplete data, leading to overbidding or underbidding
- Remarketing audiences cannot be built for the majority of visitors
- The reported conversion count in Google Ads will be ~30% of actual conversions (vs Plausible's complete count)
- Campaign ROAS reporting is unreliable, making budget decisions guesswork
- Google may have already disabled advertising features for the account if Consent Mode v2 was not detected

**Prevention:**
1. Replace the current gtag loading pattern with advanced Consent Mode v2:
   ```js
   // Load gtag immediately (before consent)
   gtag('consent', 'default', {
     ad_storage: 'denied',
     ad_user_data: 'denied',
     ad_personalization: 'denied',
     analytics_storage: 'denied'
   });
   // On consent granted:
   gtag('consent', 'update', {
     ad_storage: 'granted',
     ad_user_data: 'granted',
     ad_personalization: 'granted'
   });
   ```
2. Add the two v2 parameters (`ad_user_data`, `ad_personalization`) that the current implementation lacks
3. Keep Plausible as-is (cookieless, completely unaffected by consent mode)
4. Verify with Google Ads diagnostics that consent mode is detected after deploy

**Detection:** Google Ads > Tools > Diagnostics for consent mode warnings. Compare Plausible "B2B Form Submit" goal count vs Google Ads reported conversions weekly.

**Phase:** Must be the first implementation task, before any ad spend begins.

**Confidence:** HIGH - Google's own documentation confirms EEA enforcement since July 2025. Current code clearly uses basic mode.

---

### Pitfall 2: Subscription Messaging Triggers "Paying Forever" Objection

**What goes wrong:** Switching from the current one-time pricing ("Fra 2 500 kr" with "Lanseringstilbud" badge) to subscription ("0 kr oppstart + 399 kr/mnd") without reframing the value proposition causes prospects to mentally calculate total cost (399 x 12 = 4 788 kr/year) and compare unfavorably against the current one-time Enkel package (2 500 kr). The subscription is actually more expensive after ~6 months.

**Why it happens:** The current `pricing.ts` shows one-time prices (2 500 / 4 500 / 10 000 kr) with monthly fees (350 / 500 / 750 kr/mnd) positioned as ongoing hosting/support. The new subscription model fundamentally changes the value exchange: the website itself is "free" but you pay indefinitely. For a static website that feels "finished" after delivery, customers ask "why am I still paying?"

**Consequences:**
- Conversion rate drops despite the lower entry barrier (0 kr vs 2 500 kr)
- Prospects who calculate annual cost feel deceived ("this costs more than the old price")
- High early churn (months 3-6) when the "new website" feeling wears off and the monthly charge feels like a tax
- Negative word-of-mouth from customers who feel locked into ongoing payments for a static product

**Prevention:**
1. Frame the subscription around ongoing services, not the website: "Hosting + SSL + support + monthly updates + SEO-overvaking inkludert"
2. Show what the monthly fee replaces: "Uten oss: 1 200 kr/ar hosting + 500 kr/ar SSL + 800 kr/time for endringer = dyrere og mer jobb"
3. Never show total annual cost on the page - let the low monthly number anchor
4. Include a clear exit clause prominently: "Ingen bindingstid" (the current hero already has this, keep it)
5. Position one-time packages as alternatives: "Foretrekker du a eie? Se vare engangspakker" - link to `/tjenester/nettside`
6. Define what happens when a customer cancels: do they keep the site? Lose it? This must be answered on the page

**Detection:** A/B test subscription vs one-time messaging. Track form abandonment rates in Plausible. Monitor which pricing model users select via custom properties.

**Phase:** Landing page content/messaging phase - must be nailed before ads launch.

**Confidence:** MEDIUM - subscription fatigue research supports this, but specific impact depends on Norwegian SMB audience response.

---

### Pitfall 3: ScarcityCounter Uses Fabricated Numbers - Legal Risk Under Markedsforingsloven

**What goes wrong:** The `launchOffer.ts` config uses hardcoded values (`total: 10, taken: 7`) manually updated at build time. The `ScarcityCounter.astro` renders "3 av 10 plasser igjen" as static HTML. This is functionally a fake scarcity counter. Under Norway's markedsforingsloven (section 6-7), stating a limited number of available slots when the limitation is not genuinely tracked constitutes misleading marketing. Forbrukertilsynet (the Norwegian Consumer Authority) actively enforces this, particularly around limited-time/limited-quantity claims.

**Why it happens:** The counter was built as a conversion optimization tool with good intent. But the numbers are static build-time values that only change when someone manually edits `launchOffer.ts` and redeploys. When the subscription model launches, "3 plasser igjen" will display identically for every visitor for weeks or months.

**Consequences:**
- Legal risk under markedsforingsloven for misleading commercial practices
- Google Ads policy violation risk (misleading claims can trigger ad disapproval and account suspension)
- Trust destruction with returning visitors who notice the number never changes
- Reputational damage - a web agency caught using fake scarcity signals incompetence to potential clients

**Prevention:**
1. Make scarcity real: track actual signups in a database or CMS and update the counter dynamically (requires a serverless endpoint)
2. Switch to time-based scarcity that is truthful and verifiable: "Tilbudet gjelder til 30. april 2026" with a real deadline
3. Remove scarcity entirely and rely on the value proposition - "0 kr oppstart" is already compelling without fake urgency
4. If keeping the "first 10 customers" offer, implement honest tracking and remove the counter when slots genuinely fill
5. Never use countdown timers that reset on page refresh

**Detection:** Visit the landing page as a returning visitor 2+ weeks after launch. If the number hasn't changed, it's fake.

**Phase:** Must be resolved during landing page rebuild, before any ad traffic is sent.

**Confidence:** HIGH - DLA Piper Norway explicitly documents that stating limited availability that isn't real violates markedsforingsloven. The current implementation is verifiably static.

---

### Pitfall 4: Organic /tjenester/nettside Cannibalized by Paid /nettside-for-bedrift

**What goes wrong:** Both pages target "nettside for bedrift" as primary keyword. The organic page title: `Nettside for bedrift | Profesjonell og rask | Nettup`. The paid landing page title: `Nettside for Bedrift | Fra 2 500 kr (Spar 64%) | Nettup`. Google sees two pages competing for the same query, diluting organic ranking signals while simultaneously paying for clicks that might come free from organic.

**Why it happens:** The landing page was designed for paid traffic but is indexed by Google (no `noindex` directive set). Both pages are optimized for essentially the same keyword. The `LandingPageLayout` has a `noIndex` prop available but it's set to `false` by default and not used on the current page.

**Consequences:**
- Organic ranking for "nettside for bedrift" weakens as Google splits authority between two URLs
- Paying for ad clicks on a keyword where organic might already rank (wasted spend)
- Confusing user experience when both pages appear in search results with different pricing
- After subscription model launch, organic page shows one-time prices while paid page shows subscription prices - contradictory signals

**Prevention:**
1. Set `noIndex={true}` on the `/nettside-for-bedrift` landing page so it only receives paid traffic:
   ```astro
   <LandingPageLayout noIndex={true} title="..." />
   ```
2. Differentiate keyword intent if keeping both indexed: `/tjenester/nettside` for informational ("what does a business website include"), `/nettside-for-bedrift` for transactional ("buy now")
3. In Google Ads, add negative keywords matching queries where `/tjenester/nettside` already ranks well (check Search Console first)
4. Monitor Search Console > Performance > Pages for both URLs appearing on the same query
5. Consider: does `/nettside-for-bedrift` need organic traffic at all? If it's purely an ads destination, noindex is the clean answer

**Detection:** Google Search Console > Performance > Pages. Filter for "nettside for bedrift" query and check if both URLs appear.

**Phase:** Must be decided before launching ads. The noindex prop already exists - this is a one-line change.

**Confidence:** HIGH - the current titles are nearly identical for the same keyword. Cannibalization is near-certain without intervention.

---

## Moderate Pitfalls

### Pitfall 5: Form Friction Kills Paid Traffic Conversions

**What goes wrong:** The main `ContactForm` at the bottom of the landing page has 3 visible fields (navn, epost, telefon) + 1 optional textarea (melding) + hidden pakke/tjeneste/kilde fields. For organic traffic that has browsed the site and built trust, this is acceptable. For paid traffic arriving from an ad with zero prior relationship, each visible field reduces conversion rate by an estimated 5-10%.

**Why it happens:** The same `ContactForm` component is shared between `/kontakt` (organic) and `/nettside-for-bedrift` (paid). Organic visitors have self-selected and invested time browsing. Paid visitors clicked an ad 10 seconds ago and haven't built trust.

**Prevention:**
1. The `HeroMicroForm` (email-only, one field) already exists in the hero and fires Google Ads conversion events - this is the right primary CTA for paid traffic
2. Keep the full `ContactForm` as a secondary option at the bottom for visitors who want to provide more detail
3. Track micro-form vs full-form conversions separately (already done: `HeroMicroForm` fires a separate Formspree submission with `kilde: 'hero-form'`)
4. Consider a two-step flow: micro-form captures email (fires conversion), then redirects to a "thank you" page that asks for optional details
5. The current `HeroMicroForm` submit button says "Fa gratis tilbud" which is good - low commitment language

**Detection:** Compare hero micro-form submissions vs full ContactForm submissions in Formspree. If micro-form converts 3x+ higher on paid traffic (filter by `kilde` parameter), the full form is adding unnecessary friction.

**Phase:** Landing page rebuild. Ensure micro-form remains the primary CTA above the fold.

---

### Pitfall 6: Mobile Performance Tanks Quality Score

**What goes wrong:** The landing page loads React (58.47 kB gzipped), Framer Motion, `LandingHeroAnimation` (`client:load`), `HeroMicroForm` (`client:load`), and `ContactForm` (`client:load`). On mobile 3G connections, this JavaScript payload delays Time to Interactive. Google Ads now weighs landing page experience more heavily in Quality Score (2025 update), and mobile speed is the primary ranking factor.

**Why it happens:** All three React islands use `client:load` (immediate hydration), but `LandingHeroAnimation` is `hidden lg:block` (invisible on mobile) and `ContactForm` is at the very bottom of the page. Both hydrate JavaScript that mobile users don't immediately need.

**Prevention:**
1. Change `LandingHeroAnimation` from `client:load` to `client:visible` (or `client:media="(min-width: 1024px)"` since it's desktop-only)
2. Change `ContactForm` from `client:load` to `client:visible` (it's below the fold)
3. Keep `HeroMicroForm` as `client:load` (it's above the fold and needs immediate interactivity)
4. Consider making `HeroMicroForm` a plain HTML form with minimal JS enhancement instead of a full React island
5. Run Lighthouse mobile audit targeting LCP < 2s and TBT < 200ms

**Detection:** Google Ads > Keywords > Quality Score column. "Landing page experience" rated "Below average" = performance problem. Core Web Vitals in Vercel Analytics.

**Phase:** Performance optimization during landing page rebuild, before ad spend.

---

### Pitfall 7: Dual Analytics Conversion Numbers Diverge - Confusion About True ROAS

**What goes wrong:** Form submit fires both `trackB2BFormSubmit()` (Plausible, cookieless, always fires) and `gtag('event', 'conversion', ...)` (Google Ads, only fires when `window.gtagLoaded` is true). Plausible will always report higher conversion counts than Google Ads. With current basic consent mode, the gap could be 70%+. This creates confusion about actual conversion rates and makes ROAS calculations unreliable.

**Prevention:**
1. Accept and document the divergence: "Plausible = ground truth for total conversions, Google Ads = consented-only conversions"
2. Implement Consent Mode v2 advanced (Pitfall 1) so Google can model missing conversions via cookieless pings
3. Use Plausible as source of truth for conversion rate optimization
4. Use Google Ads conversion data for bid optimization only (Smart Bidding needs its own first-party data)
5. Add UTM parameters to all ad URLs (`?kilde=gads&kampanje=nettside`) and track the `kilde` parameter as a Plausible custom property to see paid traffic conversions regardless of cookie consent

**Detection:** Compare weekly: Plausible "B2B Form Submit" goal count vs Google Ads reported conversions. If Google shows <30% of Plausible's count, Consent Mode v2 advanced is essential.

**Phase:** Analytics setup phase, alongside Consent Mode v2 implementation.

---

### Pitfall 8: Price Inconsistency Between Landing Page and Organic Pages

**What goes wrong:** The site has multiple pricing touchpoints: `/priskalkulator` (calculation engine using `pricing-config.ts`), `/tjenester/nettside` (Service schema shows `minPrice: 8000`), `/nettside-for-bedrift` (shows packages from `pricing.ts` starting at 2 500 kr), and the AI chatbot (may quote prices from training context). Introducing "0 kr + 399 kr/mnd" on the landing page while organic pages still show "fra 8 000 kr" one-time creates a trust-destroying contradiction.

**Why it happens:** Multiple config files (`pricing.ts`, `pricing-config.ts`, `services.ts`, `launchOffer.ts`) each control pricing in different contexts. The subscription model adds yet another pricing dimension without a unified strategy.

**Prevention:**
1. Strategic decision first: is subscription landing-page-exclusive or site-wide?
2. If landing-page-exclusive: use `noIndex` (Pitfall 4) to prevent Google from showing both pricing models in search
3. If site-wide: update `pricing.ts`, `services.ts` (Service schema minPrice), and `pricing-config.ts` simultaneously
4. Update the chatbot's context in `chatbot.ts` to reflect the new pricing model
5. Add a "pricing-model" flag to the config system so all components know which model to display

**Detection:** User test: show someone the ad, then the landing page, then ask them to find pricing on `/tjenester/nettside`. If they report different prices, the inconsistency exists.

**Phase:** Architecture/planning phase - this is a strategic decision that must be made before any code changes.

---

## Minor Pitfalls

### Pitfall 9: Star Rating and Testimonials Are Fabricated Social Proof

**What goes wrong:** The hero shows "4.9 / 5 basert pa kundeanmeldelser" with 5 star SVGs but there's no link to actual reviews. The Testimonial section uses placeholder quotes (PROJECT.md known gap). Sending paid traffic to a page with three layers of unverifiable trust signals (fake scarcity + fabricated rating + placeholder testimonials) risks both ad disapproval and customer distrust.

**Prevention:**
1. Get real Google Business Profile reviews before running ads (even 3-5 genuine reviews)
2. Link the star rating to the actual review source: "Se anmeldelser pa Google"
3. Replace placeholder testimonials with real client quotes (from iGive or Blom Company)
4. Or remove unverifiable claims entirely - honest messaging with zero social proof converts better than obviously fake proof

**Phase:** Pre-launch requirement. Real social proof before any ad spend.

---

### Pitfall 10: Missing Enhanced Conversions Loses Attribution Quality

**What goes wrong:** The current gtag conversion tracking sends the event but no user-provided data. Enhanced Conversions sends hashed first-party data (email) to Google, significantly improving conversion modeling accuracy - especially important with Consent Mode v2 where modeling fills the gap.

**Prevention:**
1. Before firing the conversion event, set user data:
   ```js
   gtag('set', 'user_data', { email: formData.epost });
   gtag('event', 'conversion', { send_to: 'AW-xxx/yyy' });
   ```
2. Both `ContactForm` and `HeroMicroForm` already have the email in component state - just pass it to gtag
3. This requires enabling Enhanced Conversions in the Google Ads conversion action settings

**Phase:** Conversion tracking setup, alongside Consent Mode v2.

---

### Pitfall 11: Ad Copy Promises Don't Match Landing Page Above the Fold

**What goes wrong:** Ad copy promises a price, timeline, and guarantee. If the landing page hero changes from the current one-time pricing to subscription pricing, existing ad copy becomes misleading. The hero must immediately confirm whatever the ad promised within 3 seconds of landing.

**Prevention:**
1. Write ad copy last, after landing page content is finalized
2. Use the `kilde` URL parameter to potentially adjust hero messaging based on ad variant
3. Current hero already shows price + "Klar pa 1-3 uker" + "30 dagers garanti" - verify these match the updated subscription offer
4. Test: read the ad, click to the page, and verify every ad claim is visible above the fold without scrolling

**Phase:** Ad copy creation phase - after landing page is finalized.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Consent Mode v2 | Breaking existing Plausible analytics or cookie banner UX | Test that Plausible fires independently; verify banner still works for users who haven't consented |
| Subscription pricing model | "Paying forever" objection + price inconsistency across site | Frame around ongoing value; decide site-wide vs landing-page-only before coding |
| Landing page rebuild | Mobile performance regression; losing current conversion flow | Lighthouse CI gate; A/B test new vs old if possible |
| Scarcity/urgency elements | Legal risk under markedsforingsloven; ad disapproval | Only use verifiable claims; remove fake counters |
| Google Ads campaign setup | Cannibalization with organic pages; consent mode gaps | noindex decision + negative keywords; verify Consent Mode v2 detected |
| Form optimization | Two forms create confusion about which is primary CTA | HeroMicroForm = primary for paid; ContactForm = secondary for detailed inquiries |
| Social proof | Fabricated reviews and testimonials erode trust on paid traffic | Real reviews on GBP before ad spend; replace placeholder testimonials |
| Conversion tracking | Enhanced Conversions not capturing email; divergent Plausible vs gtag numbers | Pass email to gtag before conversion event; document expected divergence |
| Ad copy | Promise/page mismatch after pricing model change | Write ads last; verify every claim visible above fold |

---

## Integration-Specific Gotchas (Existing Stack)

| Integration Point | What Can Break | Prevention |
|-------------------|----------------|------------|
| Plausible + gtag consent | Consent Mode v2 changes could accidentally block Plausible script | Plausible uses separate CDN script (`pa-zcQI8BXyP16x3Uxv8veVj.js`); never gate it behind consent logic |
| `ContactForm` dual tracking | `trackB2BFormSubmit()` and `gtag conversion` fire on different conditions | Accept divergence; use Plausible as ground truth |
| `HeroMicroForm` + `ContactForm` | Both submit to same Formspree endpoint; duplicate leads possible | Different `kilde` values distinguish them; Formspree deduplication by email within 5 min window |
| `pricing.ts` + `launchOffer.ts` | Subscription model requires new config structure; old configs still referenced by priskalkulator and chatbot | Audit all import sites before changing pricing configs |
| `LandingPageLayout` cookie banner | Banner uses `localStorage` which persists across sessions; returning visitors from organic who declined won't see banner on paid landing page | This is actually correct behavior (respecting prior choice) but means paid traffic from previous organic visitors won't have gtag loaded |
| `pakkeSelected` CustomEvent | Current pricing cards dispatch events that ContactForm listens to; subscription model may remove package selection | Update or remove the event dispatch when changing pricing structure |

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Consent Mode v2 missing | LOW | Code change in LandingPageLayout; redeploy; verify in Google Ads diagnostics |
| Subscription messaging fails | MEDIUM | A/B test; may need to revert to one-time pricing and redesign messaging |
| Fake scarcity legal issue | LOW-MEDIUM | Remove counter; update ads; if Forbrukertilsynet contacted, respond promptly |
| Organic cannibalization | LOW | Add `noIndex={true}` to landing page; one-line change + redeploy |
| Poor Quality Score from mobile perf | MEDIUM | Change hydration strategies; may need to convert React islands to plain HTML |
| Price inconsistency across site | HIGH | Requires coordinated update of 4+ config files + chatbot context |
| Fabricated social proof | LOW | Remove claims; replace with real data or nothing |

---

## Sources

- [Google Consent Mode v2 overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) - HIGH confidence
- [Google Consent Mode v2 EEA enforcement](https://support.google.com/tagmanager/answer/13695607?hl=en) - HIGH confidence
- [Consent Mode v2 common mistakes (Bounteous)](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) - MEDIUM confidence
- [Google Ads Quality Score (official)](https://support.google.com/google-ads/answer/6167118?hl=en) - HIGH confidence
- [Google Ads landing page experience update](https://www.servicescalers.com/post/google-ads-landing-page-quality-score-update) - MEDIUM confidence
- [Markedsforingsloven Black Week guidance (DLA Piper Norway)](https://norway.dlapiper.com/no/nyhet/markedsforingsloven-gjelder-ogsa-under-black-week-praktiske-tips-til-markedsforere) - HIGH confidence
- [Norwegian marketing law (Lovdata)](https://lovdata.no/dokument/NLE/lov/2009-01-09-2) - HIGH confidence
- [Fake scarcity dark patterns](https://www.deceptive.design/types/fake-scarcity) - MEDIUM confidence
- [Subscription fatigue 2025](https://www.influencers-time.com/tackling-subscription-fatigue-in-2025-new-pricing-models/) - MEDIUM confidence
- [Keyword cannibalization paid vs organic (SEJ)](https://www.searchenginejournal.com/avoiding-keyword-cannibalization-between-paid-organic-search-campaigns/495755/) - HIGH confidence
- [Conversion tracking guide 2026](https://groas.ai/post/google-ads-conversion-tracking-setup-2026-the-complete-guide-ga4-enhanced-conversions-consent-mode) - MEDIUM confidence
- [Enhanced Conversions setup (Google)](https://developers.google.com/tag-platform/security/guides/consent) - HIGH confidence
- [Landing pages for Google Ads best practices](https://infrontmarketing.ca/blog/website-design-development/landing-pages-for-google-ads-best-practices-that-separate-winners-from-wasted-ad-spend/) - MEDIUM confidence

---
*Pitfalls research for: Subscription landing page + Google Ads for Nettup.no (v1.6)*
*Researched: 2026-03-19*
