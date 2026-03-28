# Domain Pitfalls

**Domain:** Meta Pixel integration + multi-channel ad infrastructure on consent-managed Astro site
**Project:** Nettup.no v1.7 Multi-Channel Ad Campaign
**Researched:** 2026-03-28
**Confidence:** HIGH (codebase-verified consent implementation + Datatilsynet enforcement cases + Meta official docs + Norwegian E-Com Act requirements)

---

## Critical Pitfalls

Mistakes that cause legal liability, wasted ad spend, or require rewrites.

### Pitfall 1: Meta Pixel Fires Before Consent -- Datatilsynet Is Actively Enforcing This

**What goes wrong:** The Meta Pixel (`fbevents.js`) loads and fires `PageView` before the user interacts with the consent banner. The `_fbp` first-party cookie is set immediately, transmitting a unique user identifier to Meta's servers in the US. This is a GDPR violation under Norway's updated E-Com Act (effective January 2025).

**Why it happens:** By default, the Meta Pixel fires on page load. If you add the standard Meta Pixel snippet to `LandingPageLayout.astro` without wrapping it in the consent flow, it fires alongside the existing gtag. The existing gtag implementation (lines 197-202) correctly sets denied defaults before loading. Developers often assume the same `nettup_ads_consent` localStorage check covers Meta too, but it does not -- Meta has its own separate consent API (`fbq('consent', 'revoke'/'grant')`) that must be called independently.

**Consequences:**
- Datatilsynet fined Norwegian sites NOK 250,000 in 2025 specifically for Meta/Snap pixel violations (tracking without consent on 6 inspected sites)
- The DPA explicitly stated future violations will face "much harsher consequences" than the 2025 round
- Sweden fined pharmacy chains EUR 15 million for identical Facebook Pixel violations
- The website owner (Nettup), not Meta, bears legal responsibility
- A single user complaint to Datatilsynet triggers an inspection

**Prevention:**
1. Call `fbq('consent', 'revoke')` BEFORE `fbq('init', 'PIXEL_ID')` -- this is the critical ordering
2. Only call `fbq('consent', 'grant')` after the same `cookie-accept` button that updates gtag consent
3. Wire the existing `cookie-decline` handler to keep Meta in revoked state (it defaults to revoked, so no action needed on decline)
4. Verify with DevTools Network tab: filter for `facebook.com` or `fbevents.js` -- zero requests should appear before consent interaction
5. Test the `_fbp` cookie: it must not exist until after the user clicks "Godta"

**Detection:** Open the landing page in incognito. Before touching the consent banner, check Application > Cookies for `_fbp` and Network tab for `facebook.com` requests. Any presence = violation.

**Phase:** Must be implemented in the same task as Meta Pixel integration. Never ship the pixel without consent gating.

---

### Pitfall 2: EU-US Data Transfer Legal Basis for Meta Is Fragile (Schrems III Risk)

**What goes wrong:** The existing privacy policy lists Google, Vercel, and Formspree as US-based processors covered by the EU-US Data Privacy Framework (DPF). Adding Meta to this list relies on the same DPF adequacy decision. But Meta's data transfers are under active legal challenge, and the DPF itself faces a potential "Schrems III" invalidation.

**Why it happens:** NOYB (Max Schrems' organization) has signaled a broader CJEU challenge to the DPF. The Trump administration paralyzed the Privacy and Civil Liberties Oversight Board (PCLOB), a key safeguard underpinning the DPF adequacy decision. Meta's own lobbyist is advocating against Executive Order 14.086, the very order that makes the DPF possible. A CJEU ruling in late 2025 or 2026 could invalidate the DPF, forcing all US transfers back to SCCs with additional safeguards.

**Consequences:**
- If the DPF is invalidated, Meta Pixel becomes illegal for EU/Norwegian sites overnight (as happened with Privacy Shield in Schrems II)
- The privacy policy's "dekket av EU-US Data Privacy Framework" claim for Meta becomes false
- Datatilsynet has historically been aggressive on Meta data transfers (sought to expand fines, raised possibility of an EU ban)
- Retroactive enforcement risk: using Meta Pixel during a period when transfers were questionable

**Prevention:**
1. Add Meta to the privacy policy with DPF as legal basis, but add a hedge clause: "Vi overvaker rettsutviklingen for internasjonale dataoverforinger og vil justere var praksis ved endringer"
2. Implement Meta Pixel in a way that can be disabled with a single config flag (e.g., `META_PIXEL_ENABLED` in a config file)
3. Consider Meta Conversions API (CAPI) as a server-side supplement -- this routes through Vercel (already a listed processor) and gives you more control over what data leaves your infrastructure
4. Document the DPF reliance in the privacy policy with specific reference to Meta's DPF certification
5. Monitor NOYB and EDPB news quarterly

**Detection:** Subscribe to NOYB newsletter and EDPB decisions RSS. If DPF is invalidated, disable Meta Pixel immediately via the config flag.

**Phase:** Privacy policy update should be part of Meta Pixel implementation. The kill-switch config should be part of the pixel's architecture from day one.

---

### Pitfall 3: Consent Banner Does Not Meet Norway's E-Com Act Equal Prominence Requirements

**What goes wrong:** The current consent banner (LandingPageLayout.astro lines 159-183) has "Avslå" as a ghost/outline button and "Godta" as a solid brand-colored button. Under Norway's E-Com Act (January 2025), accept and reject options must be presented with "equal visual weight." The current design nudges users toward acceptance.

**Why it happens:** The v1.6 banner was designed before the E-Com Act enforcement began. The Datatilsynet tracking pixel inspection explicitly cited "manipulative consent practices" and "nudging" as violations. Color-coded buttons making privacy-protective options less prominent was specifically called out.

**Consequences:**
- Consent obtained through an unequal banner may be deemed invalid, making all pixel data collected with that consent unlawful
- Datatilsynet specifically cited unequal button presentation in their 2025 enforcement actions
- Invalid consent = all conversion tracking data is legally compromised
- The Norwegian E-Com Act also requires consent records to be stored for 5 years and be retrievable

**Prevention:**
1. Make both buttons visually identical: either both solid or both outline. The safest approach is two solid buttons with the same styling
2. Do not pre-select any consent category
3. Add a link to the privacy policy from the banner (already present -- good)
4. Consider adding consent record logging (localStorage timestamp + choice) for the 5-year retention requirement
5. Ensure the site functions fully when cookies are declined (the landing page already works without Google tracking -- verify it works without Meta too)

**Detection:** Screenshot the banner and compare button prominence. Ask: "Would Datatilsynet say these have equal visual weight?" If unsure, make them identical.

**Phase:** Must be fixed when adding Meta Pixel consent. This is a blocker -- adding a second pixel to an already-questionable consent banner doubles the legal risk.

---

### Pitfall 4: Meta Pixel and gtag Both Fire Conversion Events on /takk -- Double Attribution

**What goes wrong:** The `/takk` page (lines 69-81) fires `gtag('event', 'conversion', ...)` and `plausible('B2B Lead')` on page load. Adding Meta Pixel's `fbq('track', 'Lead')` creates a third conversion event. If both Meta and Google attribute the same lead to their campaigns, ROAS reporting is inflated, and budget allocation decisions are based on overcounted conversions.

**Why it happens:** Google Ads and Meta Ads both claim credit for conversions that occur within their attribution windows. A user who clicked a Facebook ad, then later clicked a Google ad, then converted, will show as one conversion in each platform's dashboard. With a small budget (the project context mentions limited budget), even a few double-attributed conversions heavily skew ROAS calculations.

**Consequences:**
- Both platforms report the same lead as "their" conversion
- Total conversions reported across platforms exceeds actual leads received
- Budget reallocation decisions are based on inflated numbers
- At small budgets (50-100 NOK/day per channel), even 2-3 double-attributed leads per week make the data meaningless

**Prevention:**
1. Use Formspree submission count as the single source of truth for total leads
2. Use Plausible "B2B Lead" event count as the secondary truth (fires regardless of consent)
3. Accept that Meta and Google will each claim some overlapping conversions -- this is inherent to multi-channel
4. Build a simple attribution tracking document: weekly Formspree count vs Google reported vs Meta reported vs Plausible reported
5. Add `utm_source` to form submissions (already done) to manually track which channel actually drove each lead
6. Do NOT try to deduplicate at the pixel level -- it creates more problems than it solves

**Detection:** Weekly: compare Formspree dashboard lead count with Google Ads + Meta Ads reported conversions. If combined platform conversions exceed Formspree count by >30%, double attribution is significant.

**Phase:** Conversion tracking implementation. The attribution tracking document should be created during the multi-channel strategy docs task.

---

## Moderate Pitfalls

### Pitfall 5: UTM Parameter Chaos Between Google and Facebook Campaigns

**What goes wrong:** The current `utm.ts` only captures `utm_source`, `utm_medium`, and `utm_campaign`. Facebook ads require `utm_content` and `utm_term` for creative-level attribution. Google Ads uses auto-tagging (gclid) which conflicts with manual UTMs if not configured correctly. Inconsistent casing ("Facebook" vs "facebook") splits attribution data in analytics.

**Why it happens:** The v1.6 UTM implementation was designed for a single-channel (Google Ads) setup. Facebook has different UTM conventions. Meta also appends `fbclid` automatically to all ad URLs, which clutters Plausible page reports with unique URL parameters.

**Prevention:**
1. Expand `utm.ts` to capture `utm_content` and `utm_term` (5 standard UTM params)
2. Establish a strict naming convention and document it:
   - Google Ads: `utm_source=google&utm_medium=cpc&utm_campaign={campaign_name}`
   - Facebook Ads: `utm_source=facebook&utm_medium=paid-social&utm_campaign={campaign_name}&utm_content={ad_name}&utm_term={adset_name}`
3. All values lowercase, hyphens not underscores for multi-word values
4. Leave Google Ads auto-tagging (gclid) enabled -- it provides richer data to Google than UTMs
5. Add `fbclid` to Plausible's excluded query parameters if available, or accept the URL clutter
6. Store all 5 UTM params in sessionStorage and include in Formspree submissions

**Detection:** After first week of Facebook ads, check Plausible for `utm_source` values. If you see both "facebook" and "Facebook" or missing source data, fix the templates.

**Phase:** UTM expansion should be implemented before Facebook ads launch. It is a code change (`utm.ts` + form components).

---

### Pitfall 6: fbevents.js Script Loading Creates Performance Regression

**What goes wrong:** Adding `fbevents.js` (~60KB uncompressed) alongside the existing `gtag.js` (~90KB) to the landing page increases total blocking script weight. On mobile connections in Norway (where median LTE speed is good but varies), this can push LCP beyond the 2-second target, especially if both scripts load synchronously.

**Why it happens:** Both tracking scripts make network requests to external domains (`connect.facebook.net` and `googletagmanager.com`). DNS resolution + TLS handshake + download for two separate third-party domains adds 200-600ms on slower connections. The current gtag loads async (line 216-219 in LandingPageLayout), but a naive Meta Pixel implementation often uses a synchronous inline script.

**Prevention:**
1. Load `fbevents.js` with `async` attribute, same as gtag
2. Add `dns-prefetch` and `preconnect` hints for `connect.facebook.net` in the `<head>`
3. Place the Meta Pixel initialization after gtag in the document (gtag is more critical for existing campaigns)
4. Measure LCP before and after with Lighthouse
5. Consider deferring Meta Pixel load slightly: load gtag immediately, load fbevents.js after `DOMContentLoaded` or with a 100ms timeout

**Detection:** Run Lighthouse on the landing page before and after adding Meta Pixel. LCP regression of >200ms is a warning sign. Check that the project's <2s LCP target is maintained.

**Phase:** Implementation phase. Performance testing must be part of the verification step.

---

### Pitfall 7: Facebook Instant Forms Generate Low-Quality Leads for B2B Services

**What goes wrong:** Meta's Instant Forms auto-fill user email and phone from their Facebook profile. For a B2B web agency service, this produces leads with personal Gmail/Hotmail addresses from people who reflexively tapped through the form. The "contact within 24 hours" promise in the conversion flow means staff time is wasted calling unqualified prospects.

**Why it happens:** Instant Forms optimize for volume by reducing friction. Facebook's algorithm learns to find users who submit forms, not users who become customers. B2B services (especially premium ones at 399 kr/mnd recurring) need deliberate prospects, not impulse clickers. The auto-fill behavior means users can submit without typing a single character.

**Prevention:**
1. Use "Higher Intent" form type in Meta Ads Manager -- this adds a review/confirmation step before submission
2. Disable auto-fill for the email field if the option is available (Meta rolled this out in 2025)
3. Add a qualifying question: "Har bedriften din en nettside i dag?" (Yes/No) -- filters curiosity clickers
4. Add a short-answer question: "Hva heter bedriften?" -- manual input requirement filters low-intent
5. For the v1.7 spec, consider recommending website conversion campaigns (driving to /nettside-for-bedrift) over instant forms for the initial phase, since the landing page already exists and converts
6. If using instant forms: respond within 5 minutes. Studies show leads contacted within 5 minutes convert at 8x the rate of those contacted later

**Detection:** Track instant form lead-to-customer conversion rate separately from website form conversion rate. If instant form conversion rate is <5% after 20 leads, switch to website-only campaign.

**Phase:** Lead form specification task. This is a strategy decision, not a code change, but it directly impacts ROI.

---

### Pitfall 8: Budget Spread Too Thin Across Channels -- Neither Gets Enough Data

**What goes wrong:** With a small initial budget split between Facebook and Google Ads, neither platform accumulates enough conversion data to exit the learning phase. Meta needs ~50 optimization events per week per ad set. Google's Smart Bidding needs similar data density. Splitting 100 NOK/day across two platforms gives each ~50 NOK/day, which at Norwegian CPC rates (~8.50 NOK for Facebook) yields only ~6 clicks/day per platform.

**Why it happens:** First-time multi-channel advertisers assume that running two channels from day one provides diversification. In practice, it provides two half-funded channels that both perform poorly. The project context already identified Google Ads as "demoted to phase-2 channel with long-tail keywords only" due to saturated competition (50+ agencies, 25-40 NOK CPC). But the temptation to "test both" persists.

**Prevention:**
1. Launch Facebook/Instagram first as the primary channel (lower CPC, visual format suits the brand)
2. Allocate 100% of initial budget to Facebook for the first 2-4 weeks
3. Only add Google Ads (long-tail only) after Facebook campaigns have exited learning phase and established baseline metrics
4. Set a minimum daily budget per ad set of at least 50 NOK (ideally 100 NOK) for Facebook
5. Run only 1-2 ad sets maximum at launch -- more ad sets = thinner data per set
6. Document explicit "add Google Ads" trigger criteria: e.g., "Facebook CPA stabilized for 7 consecutive days"

**Detection:** Check Meta Ads Manager for "Learning Limited" status on ad sets. If any ad set shows this after one week, it needs more budget or the audience is too narrow.

**Phase:** Multi-channel strategy document. This is the most important strategic decision in v1.7.

---

### Pitfall 9: B2B Ad Creative Uses Wrong Format, Wrong Tone, or Wrong Hook

**What goes wrong:** B2B Facebook ads that look like corporate slideshows or use generic stock imagery get scrolled past. Ads that lead with features ("Astro 5 + Tailwind") instead of outcomes ("Ferdig nettside på 14 dager") fail to stop the scroll. Using 16:9 landscape format when 80%+ of Facebook users are on mobile (9:16 or 1:1 needed) wastes the creative.

**Why it happens:** Web developers think in technical terms. The target audience (Norwegian small business owners, "teknisk ukyndige beslutningstakere" per PROJECT.md) thinks in business outcomes. B2B advertisers also often run too few creatives and hit creative fatigue within days, or rotate so frequently that no creative builds recognition.

**Prevention:**
1. Lead with outcomes, not features: "Profesjonell nettside fra 399 kr/mnd" not "Vi bygger med Astro og React"
2. Use 1080x1080 (feed) and 1080x1920 (stories/reels) as primary formats -- the v1.7 spec already includes these
3. Include the price in the creative itself (not just the ad copy) -- "0 kr oppstart" is a strong pattern interrupt
4. Use before/after or problem/solution framing: "Gammel nettside som skremmer bort kunder" vs "Moderne nettside som konverterer"
5. Plan 4+ creative variants from day one for testing, but test sequentially (not all at once with tiny budget)
6. Refresh creatives every 2-3 weeks to combat frequency fatigue
7. Avoid: stock photos of handshakes, laptop mockups with generic screens, or English text in Norwegian market ads

**Detection:** Monitor frequency metric in Meta Ads. When frequency exceeds 3.0, creative fatigue is setting in. CTR dropping while frequency rises confirms it.

**Phase:** Ad creative templates task. The spec already calls for 4x static + 2x story templates, which is correct.

---

## Minor Pitfalls

### Pitfall 10: Meta Pixel Events Misconfigured -- ViewContent Fires on Every Page

**What goes wrong:** Standard Meta Pixel implementation includes `fbq('track', 'PageView')` on every page. If `fbq('track', 'ViewContent')` is also added to the landing page, and the pixel accidentally loads on non-landing pages via `BaseLayout.astro` instead of only `LandingPageLayout.astro`, every page view on the entire site fires a ViewContent event, polluting the custom audience data.

**Prevention:**
1. Keep Meta Pixel ONLY in `LandingPageLayout.astro`, never in `BaseLayout.astro`
2. Use `PageView` (standard) on the landing page and `Lead` on `/takk`
3. Add `ViewContent` only if you are building retargeting audiences based on landing page visits specifically
4. Verify event firing with Meta Pixel Helper browser extension
5. If retargeting is expanded to the main site later, add the pixel to BaseLayout at that point with its own consent check

**Phase:** Implementation. Verify with Meta Pixel Helper after deploy.

---

### Pitfall 11: Consent State Not Synchronized Between gtag and fbq

**What goes wrong:** The user grants consent, gtag updates to granted, but fbq remains in revoked state (or vice versa). This happens when the consent handler calls `gtag('consent', 'update', ...)` but forgets to call `fbq('consent', 'grant')` in the same handler, or when the stored consent is checked on page load for gtag but not for Meta.

**Prevention:**
1. Create a single `handleConsentUpdate(granted: boolean)` function that updates BOTH:
   ```js
   function handleConsentUpdate(granted) {
     if (granted) {
       gtag('consent', 'update', { ad_storage: 'granted', ... });
       if (typeof fbq !== 'undefined') fbq('consent', 'grant');
     }
   }
   ```
2. On page load, check `localStorage.getItem(CONSENT_KEY)` once and apply to BOTH systems
3. The `cookie-accept` and `cookie-decline` handlers in LandingPageLayout must both call this unified function
4. Test in DevTools: after clicking "Godta", verify both `_fbp` cookie appears AND Google cookies appear

**Phase:** Implementation. This is the most likely source of bugs when adding Meta Pixel to the existing consent code.

---

### Pitfall 12: Privacy Policy Not Updated Before Pixel Goes Live

**What goes wrong:** The Meta Pixel starts collecting data, but the privacy policy at `/personvern` does not mention Meta/Facebook as a data processor. Under GDPR, the data subject must be informed about all processors before data collection begins. The current privacy policy (section 4) lists Formspree, Plausible, Vercel, and Google -- but not Meta.

**Prevention:**
1. Add a "Meta (Facebook/Instagram)" entry to section 4 ("Hvem deler vi data med") BEFORE the pixel goes live
2. Add Meta cookies (`_fbp`, `_fbc`) to section 5 ("Informasjonskapsler") under the Landingssider subsection
3. Add "Male annonseeffekt (Meta Ads)" to the legal basis table in section 3 with "Samtykke (GDPR art. 6(1)(a))"
4. Update section 2 to mention Meta tracking alongside Google
5. Update the consent banner text to mention both Google and Meta (or use generic "annonseplattformer")
6. Update `lastUpdated` date

**Phase:** Privacy policy update is a prerequisite for shipping Meta Pixel to production. Block the pixel deploy on this.

---

### Pitfall 13: Meta's Learning Phase Reset by Premature Optimization

**What goes wrong:** During the first 1-2 weeks of Facebook campaigns, the advertiser panics at high CPA and makes changes: adjusting budget, changing targeting, swapping creative, editing bid strategy. Each significant change resets Meta's learning phase, requiring another ~50 optimization events to stabilize. With small budgets, this can mean permanent "Learning Limited" status.

**Prevention:**
1. Document a "hands-off period" in the strategy doc: no changes for 7 days after launch (except pausing clearly broken ads with 0 impressions)
2. Set clear kill criteria BEFORE launch: "Pause an ad set if CPA exceeds X NOK after 7 days and 500+ NOK spend"
3. Budget edits, targeting changes, creative swaps, and bid adjustments ALL reset learning
4. If an ad set enters "Learning Limited", either increase budget or consolidate ad sets -- do not make multiple small changes

**Phase:** A/B testing plan and strategy documentation. This is operational guidance, not code.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Meta Pixel integration | Pixel fires before consent (Pitfall 1) | `fbq('consent', 'revoke')` before `fbq('init')`, unified consent handler |
| Meta Pixel integration | Consent banner fails equal prominence test (Pitfall 3) | Redesign buttons before adding second pixel |
| Conversion tracking | Double attribution inflates ROAS (Pitfall 4) | Use Formspree count as source of truth, track weekly |
| UTM expansion | Casing inconsistency splits data (Pitfall 5) | Enforce lowercase, document naming convention |
| Privacy policy update | Policy not updated before pixel goes live (Pitfall 12) | Block pixel deploy on policy update |
| Ad creative | Wrong format/tone for B2B Norwegian market (Pitfall 9) | Outcome-first copy, 1:1 and 9:16 formats, price in creative |
| Lead form spec | Instant forms generate junk leads (Pitfall 7) | Higher Intent type, qualifying questions, consider website-first |
| Multi-channel strategy | Budget split too thin (Pitfall 8) | Facebook-first, Google Ads phase 2, minimum 50 NOK/day/ad set |
| Strategy docs | Premature optimization resets learning (Pitfall 13) | 7-day hands-off rule, pre-set kill criteria |
| Performance | Two tracking scripts degrade LCP (Pitfall 6) | Async loading, preconnect hints, Lighthouse before/after |

---

## Norwegian Legal Context Summary

The following legal requirements are specific to this project's jurisdiction and directly affect implementation:

| Requirement | Source | Implication |
|-------------|--------|-------------|
| Explicit opt-in consent before any tracking cookies | Norway E-Com Act (Jan 2025) | Meta Pixel must use `fbq('consent', 'revoke')` by default |
| Equal visual weight for accept/reject buttons | E-Com Act + Datatilsynet enforcement | Current banner buttons must be restyled |
| No pre-ticked consent boxes | E-Com Act | Not currently an issue (banner uses buttons, not checkboxes) |
| Cookie walls prohibited | E-Com Act | Landing page must work fully without consent -- already true |
| Consent records stored 5 years | E-Com Act | Consider logging consent timestamp to localStorage or server |
| Datatilsynet actively inspecting tracking pixels | 2025 enforcement wave (6 sites sanctioned) | Meta Pixel implementation will be scrutinized if reported |
| EU-US Data Privacy Framework covers Meta (for now) | DPF adequacy decision (July 2023) | Legal basis exists but is under NOYB challenge -- build kill switch |
| Website owner bears GDPR responsibility, not Meta | GDPR + Swedish/Norwegian enforcement precedent | Nettup is liable for any pixel violations, not Meta |

---

## Sources

- [Datatilsynet: Unlawful sharing via tracking pixels on six websites (2025)](https://www.datatilsynet.no/en/news/news-2025/unlawful-sharing-of-personal-information-through-tracking-pixels-on-six-websites/) -- HIGH confidence
- [Norwegian DPA sanctions 6 websites for Meta/Snapchat pixel violations](https://cookieinformation.com/blog/norway-tracking-pixel-violation-sanctions/) -- HIGH confidence
- [Norwegian E-Com Act compliance checklist](https://cookieinformation.com/resources/blog/norwegian-e-com-act-compliance-checklist/) -- HIGH confidence
- [Meta Pixel GDPR implementation docs](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr) -- HIGH confidence
- [NOYB: EU-US data transfers -- time to prepare for more trouble](https://noyb.eu/en/eu-us-data-transfers-time-prepare-more-trouble-come) -- MEDIUM confidence (future-looking)
- [EU General Court upholds DPF (first challenge dismissed)](https://iapp.org/news/a/european-general-court-dismisses-latombe-challenge-upholds-eu-us-data-privacy-framework) -- HIGH confidence
- [Meta Consent Mode explained (SecurePrivacy)](https://secureprivacy.ai/blog/meta-consent-mode-explained-2025) -- MEDIUM confidence
- [Facebook Lead Ads: Instant Forms vs Website Conversions](https://leadsync.me/blog/facebook-instant-forms-vs-website-forms/) -- MEDIUM confidence
- [Facebook Ads for B2B: Smart Budget Strategies 2025](https://jjscit.com/facebook-ad-budget-strategy-b2b-2025/) -- MEDIUM confidence
- [UTM Parameters for Facebook Ads: Complete Guide 2025](https://admanage.ai/blog/utm-parameters-for-facebook-ads) -- MEDIUM confidence
- [Common Meta Ads mistakes for B2B](https://www.factors.ai/guides/meta-ads-101-b2b-saas-facebook-ads-guide/common-meta-ads-facebook-ads-mistakes) -- MEDIUM confidence
- [Norway Facebook Ads CPM benchmarks 2025](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/norway) -- MEDIUM confidence
- [GA4 doesn't read fbclid (UTMGuard)](https://www.utmguard.com/blog/why-ga4-doesnt-read-fbclid) -- MEDIUM confidence
