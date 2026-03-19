# Project Research Summary

**Project:** Nettup.no v1.6 Landingsside & Google Ads
**Domain:** Subscription landing page rebuild + Google Ads conversion optimization
**Researched:** 2026-03-19
**Confidence:** HIGH

## Executive Summary

V1.6 is a focused rebuild of `/nettside-for-bedrift` to support a new subscription pricing model (0 kr oppstart + 399 kr/mnd) and launch Google Ads campaigns. The existing stack (Astro 5, Tailwind 4, React islands, Vercel, Formspree, Plausible + gtag) is fully capable — zero new dependencies are needed. All work is configuration, content replacement, and targeted code changes to a single page and its supporting files. The key structural changes are: replacing the dual `launchOffer.ts` + `pricing.ts` configs with a single `subscriptionOffer.ts`, and replacing React-state form success callbacks with a redirect to a dedicated `/nettside-for-bedrift/takk` page where conversion events fire reliably on page load.

The recommended build order is: config foundation first, then conversion tracking infrastructure, then content rebuild, then cleanup and QA. This allows conversion tracking to be verified against the existing (old) page before committing to the full rebuild — reducing launch risk. The single most impactful technical task is upgrading from the current basic consent mode to Google Ads Consent Mode v2. The current implementation gates gtag entirely behind localStorage consent, which means Smart Bidding receives only ~30% of actual conversion data. This must be fixed before any ad spend begins.

The primary launch blockers are not technical. Three issues require resolution before traffic is sent: (1) Consent Mode v2 must be implemented for legally compliant and effective ads tracking; (2) the scarcity counter must stop using hardcoded static values — Norway's markedsforingsloven makes fake scarcity a legal risk; and (3) a strategic decision must be made about whether `/nettside-for-bedrift` is noindexed (preventing organic cannibalization with `/tjenester/nettside`). Additionally, real client testimonials and Google Business Profile reviews should replace placeholder social proof before cold paid traffic lands on the page.

---

## Key Findings

### Recommended Stack

Zero new npm packages are needed for v1.6. All capabilities are implemented as configuration and code patterns on top of the existing stack. The existing `LandingPageLayout.astro` already has the gtag loader, consent banner, `noIndex` prop, and `reveal-on-scroll` animations. The only new files required are `src/lib/ads-tracking.ts` (conversion event helpers), `src/types/gtag.d.ts` (Window type augmentation), `src/config/subscriptionOffer.ts` (replaces two old config files), and `src/pages/nettside-for-bedrift/takk.astro` (conversion confirmation page).

**Core technologies:**
- Astro 5 (static, `output: 'static'`): all landing page sections — no change, production-ready
- React islands (selective hydration): `HeroMicroForm` (client:load, above fold), `ContactForm` (client:visible, below fold), `LandingHeroAnimation` (client:media desktop-only) — hydration strategy directly affects Quality Score
- Google Ads gtag (`AW-17409050017`): already loaded in `LandingPageLayout`, requires Consent Mode v2 upgrade
- Plausible Analytics: cookieless, always fires regardless of consent, used as conversion ground truth
- Formspree (`xnjnzybj`): no integration change; form redirect behavior changes from inline state to `/takk`
- Vercel static hosting: `output: 'static'` constraint rules out Astro runtime middleware for A/B; URL-based variant splitting is the correct approach

### Expected Features

**Must have (launch blocked without all of these):**
- Subscription pricing reframe (0 kr oppstart + 399 kr/mnd) — the entire v1.6 value proposition
- Headline + ad copy alignment — Quality Score requires keyword/H1/page message match; ad copy must be written last, after page is final
- Form optimization (3 visible fields max: navn, epost, telefon) — paid traffic demands minimal friction
- Page speed audit (LCP target < 1.5s on mobile) — Quality Score is a paid conversion gatekeeper
- Google Ads conversion tracking (form submit + phone click) — Smart Bidding cannot optimize without defined conversions
- UTM parameter capture (hidden form fields + gclid) — keyword-level attribution from day one

**Should have (first optimization wave, within first week of launch):**
- Enhanced scarcity counter with visual progress bar — low effort, builds on existing component; must be legally compliant
- Contextual trust signals for cold traffic — compact trust bar under H1; real reviews linked or remove unverifiable star rating
- Subscription objection-handling sections — "Hva skjer etter 12 maneder?", cancellation terms, ownership clarity, cost comparison table
- Sticky mobile CTA bar (fixed bottom bar, mobile-only, appears after scrolling past hero)

**Defer until data supports it:**
- Dynamic keyword headline insertion (`?kw=` param) — run ads 2-4 weeks first, identify top converters, then personalize
- A/B testing infrastructure — URL-based variant splitting via Google Ads Experiments is sufficient; no edge middleware needed

**Anti-features (explicitly excluded):**
- Countdown timer with fake deadline — deceptive, destroys trust with cold traffic
- Exit-intent popup — undermines premium agency positioning
- Three equal-weight pricing tiers — choice paralysis on cold traffic; one hero card, upsells collapsed below
- Fake star rating "4.9/5 basert pa kundeanmeldelser" — no verifiable source; must remove or link to real Google reviews
- Google Tag Manager — unnecessary script weight for 2-3 conversion events gtag handles directly
- Hotjar or session recording at launch — adds consent requirement; evaluate after 2-4 weeks of data

### Architecture Approach

The architecture is a targeted modification of the existing landing page and config layer. No new routes, no new frameworks. The single most architecturally significant change is the form redirect pattern: both `HeroMicroForm.tsx` and `ContactForm.tsx` should redirect to `/nettside-for-bedrift/takk` after a successful Formspree POST, rather than updating React state to show an inline success message. Google's official documentation recommends page-load conversion triggers as the most reliable method. The current React callback approach is fragile — if the user navigates away or React re-renders during the async POST, the conversion event is lost.

**Major components:**
1. `subscriptionOffer.ts` — replaces `launchOffer.ts` + `pricing.ts`; single source of truth for offer, scarcity count, and upsell services
2. `takk.astro` — conversion confirmation page; fires gtag conversion on page load via `is:inline` script; `noIndex={true}`
3. `HeroMicroForm.tsx` + `ContactForm.tsx` — modified to redirect to `/takk` after success; removes gtag call from React callback
4. `LandingPageLayout.astro` — Consent Mode v2 upgrade (load gtag immediately with defaults denied; update on consent granted)
5. `src/config/ads/` — version-controlled ad copy (`ad-copy.ts`), keyword lists (`keywords.ts`), campaign hierarchy doc (`campaign-structure.md`)
6. `analytics.ts` — additive new tracking functions: `trackLandingFormSubmit()`, `trackLandingPhoneClick()`, `trackLandingScrollDepth()`

**Build order (from ARCHITECTURE.md):**
Config foundation → thank-you page + conversion flow → content rebuild → config cleanup → ad campaign docs → QA

### Critical Pitfalls

1. **Consent Mode v2 not implemented** — Current implementation gates gtag behind localStorage consent ("basic" mode). Google requires "advanced" mode for EEA since July 2025. Without it: Smart Bidding operates on ~30% of conversions, remarketing audiences can't build, ROAS reporting is unreliable. Fix: load gtag immediately with all consent states `denied`; update to `granted` on consent. Add `ad_user_data` and `ad_personalization` params that current implementation lacks. Must be done before any ad spend.

2. **Subscription messaging triggers "paying forever" objection** — Annual cost (399 x 12 = 4,788 kr) compares unfavorably to old one-time Enkel package (2,500 kr) if the messaging frames the subscription as "a website that you rent." Fix: frame around ongoing services (hosting, SSL, vedlikehold, support, updates). Never show total annual cost on page. Include clear cancellation and ownership terms. Show what the monthly fee replaces (hosting + SSL + support billed separately would cost more).

3. **Fake scarcity counter violates markedsforingsloven** — The `launchOffer.ts` config uses hardcoded `taken: 7` that only changes when someone manually edits and redeploys. Under Norway's markedsforingsloven section 6-7, a limited-availability claim that isn't genuinely tracked is misleading marketing. Forbrukertilsynet actively enforces this. Google Ads policy also flags misleading claims. Fix: real tracking via database, switch to verifiable time-based offer, or remove scarcity entirely. Static fake numbers are not an option.

4. **Organic cannibalization with `/tjenester/nettside`** — Both pages currently compete for "nettside for bedrift." The landing page is indexed. Fix: set `noIndex={true}` on the landing page — the prop already exists in `LandingPageLayout`. One-line change, must be decided before ads launch.

5. **Fabricated social proof on paid-traffic landing page** — Hero shows "4.9/5 basert pa kundeanmeldelser" with no verifiable source. Testimonials are placeholders. Cold ad traffic is the most skeptical audience. Fix: get 3-5 real Google Business Profile reviews before running ads; link the star rating; replace placeholder testimonials with real client quotes from iGive or Blom Company.

---

## Implications for Roadmap

### Phase 1: Pre-Launch Infrastructure (hard prerequisite)

**Rationale:** Consent Mode v2 and the noindex decision must precede all other work. These are fast changes (hours) but have legal and campaign-effectiveness consequences if skipped. Consent Mode v2 in particular must be deployed before any ad spend begins — there is no way to retroactively recover conversion data lost to basic mode.

**Delivers:** Legally compliant consent setup; Google Ads account capable of full conversion modeling; clear paid/organic traffic separation for the landing page URL

**Addresses:** Pitfall 1 (Consent Mode v2), Pitfall 4 (organic cannibalization), TS-6 (conversion tracking prerequisite)

**Avoids:** Wasting ad budget on a campaign Google Ads cannot optimize; legal exposure for EEA consent violations

**Research needed:** None. Consent Mode v2 is fully documented by Google with official code samples.

---

### Phase 2: Config Foundation + Conversion Flow

**Rationale:** Everything in Phase 3 depends on the data model. `subscriptionOffer.ts` must exist before sections can reference it. The thank-you page and form redirect pattern should be built and tested before the content rebuild begins — this allows conversion tracking to be verified against the existing (old) page, so QA is not blocked by content work.

**Delivers:** New subscription offer data model; `/nettside-for-bedrift/takk` page with reliable page-load conversion pixel; both forms redirect to `/takk` after success; `ads-tracking.ts` helper functions

**Addresses:** TS-6 (conversion tracking), Architecture Patterns 1 + 2, Pitfall 7 (analytics divergence documented)

**Avoids:** Anti-Pattern 2 (conversion events in React state handlers); broken imports during development

**Research needed:** None. Standard Astro + Formspree + gtag patterns; Google recommends the thank-you page pattern in official docs.

---

### Phase 3: Landing Page Content Rebuild

**Rationale:** The bulk of the work. Has no external dependencies once Phase 2 is complete. Subscription messaging, trust signals, and objection-handling sections must ship together — a partially rewritten page with mixed old/new pricing signals is worse than either version.

**Delivers:** Fully rebuilt landing page: subscription-first single-offer pricing, objection-handling sections, 3-field form, legally compliant scarcity (visual progress bar tied to real or time-based data), trust signals for cold traffic, sticky mobile CTA bar

**Addresses:** TS-1 (pricing reframe), TS-2 (headline alignment), TS-3 (form optimization), D-1 (scarcity enhancement), D-2 (trust signals), D-3 (objection handling), D-4 (sticky mobile CTA), Pitfall 2 (subscription messaging), Pitfall 3 (fake scarcity), Pitfall 5 (form friction), Pitfall 9 (fabricated social proof)

**Avoids:** Anti-Pattern 1 (three equal pricing tiers on subscription page); price inconsistency signals

**Business decisions needed before this phase starts:** (1) Cancellation and website ownership terms — must appear on the page, cannot be deferred to implementation. (2) Real testimonials — are iGive or Blom Company quotes available? (3) Scarcity approach — real tracking, time-based deadline, or remove entirely?

---

### Phase 4: Cleanup, Analytics Wiring, and QA

**Rationale:** Config cleanup (deleting old pricing configs) belongs after content rebuild to avoid broken imports during development. Analytics additions are additive and safe. QA gates verify the full funnel before ad spend: Lighthouse, Tag Assistant, mobile check, consent flow verification, and content/ad message match check.

**Delivers:** Clean codebase (no legacy `launchOffer.ts` or `pricing.ts`); full analytics event coverage (UTM capture, scroll depth, phone clicks); Lighthouse scores documented; ad campaign documentation in `src/config/ads/`; `ContactForm.tsx` cleaned of old `PAKKE_INFO` import

**Addresses:** TS-4 (mobile layout), TS-5 (page speed), D-5 (UTM capture), Pitfall 6 (mobile performance Quality Score), Pitfall 8 (price inconsistency — verify chatbot context in `chatbot.ts`), Pitfall 10 (Enhanced Conversions), Pitfall 11 (ad copy/page match)

**Avoids:** Shipping with broken import references to deleted config files; launching ads without verified conversion tracking

**Research needed:** None. Cleanup and QA are mechanical. Lighthouse and Google Ads Tag Assistant are the verification tools.

---

### Phase 5: Post-Launch Optimization (deferred — not in v1.6 launch scope)

**Rationale:** Optimization requires baseline data. Do not build variants before seeing what the original converts at.

**Delivers (when data supports it):** A/B variant page (`/nettside-for-bedrift/v2/`, `noIndex: true`); dynamic keyword headline insertion (`?kw=` param); scroll depth tracking; potential Hotjar evaluation after 2-4 weeks

**Prerequisite:** 2-4 weeks of ad data with verified conversion tracking.

---

### Phase Ordering Rationale

- Consent Mode v2 is first because running ads without it wastes budget and risks account issues — it cannot be added retroactively
- Config before content because every rebuilt section imports from `subscriptionOffer.ts`
- Thank-you page before content rebuild so conversion tracking can be verified independently of content quality
- Content as a single phase because mixing old and new pricing on the same page during incremental rebuild creates a confusing intermediate state
- Cleanup after content to avoid import errors during development
- QA last but must include both technical checks (Lighthouse, Tag Assistant) and content checks (every ad claim visible above fold without scrolling)

### Research Flags

No phases require `/gsd:research-phase` — research is complete and confidence is high across all areas.

Business decisions that must precede Phase 3 (not research gaps, but organizational decisions):
- Subscription cancellation policy and website ownership terms
- Availability of real client testimonials
- Scarcity counter approach (real tracking / time-based / remove)
- Subscription model scope: landing-page-only or site-wide pricing change

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies; all capabilities verified in existing codebase and Google official docs |
| Features | MEDIUM-HIGH | Conversion optimization patterns well-documented; Norwegian subscription web agency model is niche with limited direct benchmarks for conversion rate expectations |
| Architecture | HIGH | Based on direct codebase analysis; thank-you page pattern is Google-recommended; build order has clear dependency rationale |
| Pitfalls | HIGH | Legal issues verified against Lovdata + DLA Piper Norway; consent mode issues from Google's own enforcement docs; codebase issues directly identified in existing files |

**Overall confidence:** HIGH

### Gaps to Address

- **Subscription cancellation + ownership terms:** Business decision, not a research gap. What happens when a customer cancels? Do they keep the website? This must be answered before copy is written.
- **Real social proof availability:** Are real Google Business Profile reviews available? Are real testimonials from iGive or Blom Company ready to use? Without these, the trust signals section defaults to "remove fabricated claims" rather than "replace with real ones."
- **Scarcity counter approach:** Three options exist (real tracking, time-based deadline, remove). Any is legally compliant; the current static-value approach is not. Business must choose.
- **Subscription model scope:** Is 399 kr/mnd landing-page-exclusive or a site-wide pricing change? If site-wide, `services.ts`, `pricing-config.ts`, and `chatbot.ts` all need updates. If landing-page-only, `noIndex` resolves the inconsistency. Must be decided before Phase 3.
- **Formspree capacity:** Free tier allows 50 submissions/month. Paid Google Ads traffic could exceed this. Evaluate Formspree paid ($10/month) before launch.

---

## Sources

### Primary (HIGH confidence)
- Codebase: `LandingPageLayout.astro`, `HeroMicroForm.tsx`, `ContactForm.tsx`, `pricing.ts`, `launchOffer.ts`, `ScarcityCounter.astro`, `analytics.ts` — direct source of current implementation patterns
- [Google Consent Mode v2 overview](https://developers.google.com/tag-platform/security/concepts/consent-mode) — EEA enforcement requirements
- [Google Consent Mode v2 EEA enforcement](https://support.google.com/tagmanager/answer/13695607?hl=en) — July 2025 enforcement confirmation
- [Google Ads conversion tracking with gtag](https://support.google.com/google-ads/answer/7548399) — event snippet format
- [Enhanced conversions for web using Google tag](https://support.google.com/google-ads/answer/13258081) — user_data setup
- [Set up conversions with a URL - Google Ads Help](https://support.google.com/google-ads/answer/12676738?hl=en) — thank-you page conversion pattern (Google-recommended)
- [Google Ads Quality Score (official)](https://support.google.com/google-ads/answer/6167118?hl=en) — QS component definitions
- [Markedsforingsloven (Lovdata)](https://lovdata.no/dokument/NLE/lov/2009-01-09-2) — Norwegian marketing law
- [DLA Piper Norway: markedsforingsloven guidance](https://norway.dlapiper.com/no/nyhet/markedsforingsloven-gjelder-ogsa-under-black-week-praktiske-tips-til-markedsforere) — fake scarcity legal risk explicitly documented

### Secondary (MEDIUM confidence)
- [Landing Page Best Practices 2026 -- Lovable](https://lovable.dev/guides/landing-page-best-practices-convert) — form field reduction lift data (11 to 4 fields = 120% lift)
- [Landing Page Statistics 2026 -- Blogging Wizard](https://bloggingwizard.com/landing-page-statistics/) — 83% mobile traffic share, form field conversion data
- [Keyword cannibalization paid vs organic (SEJ)](https://www.searchenginejournal.com/avoiding-keyword-cannibalization-between-paid-organic-search-campaigns/495755/) — cannibalization mechanics
- [Subscription Pricing Psychology -- Binary Stream](https://binarystream.com/4-secrets-to-better-subscription-pricing-psychology/) — anchoring, von Restorff, Goldilocks principles
- [DTC Landing Page Strategies 2026 -- MHI Growth Engine](https://mhigrowthengine.com/blog/best-landing-page-strategies-dtc-brands-2026/) — founder presence +15-28% lift data
- [Scarcity Effect in Marketing -- Lead Alchemists](https://www.leadalchemists.com/marketing-psychology/scarcity-effect/) — scarcity + discount = 178% conversion lift
- [Consent Mode v2 common mistakes (Bounteous)](https://www.bounteous.com/insights/2025/07/30/top-7-google-consent-mode-mistakes-and-how-fix-them-2025/) — implementation pitfalls
- [Google Ads landing page experience update (ServiceScalers)](https://www.servicescalers.com/post/google-ads-landing-page-quality-score-update) — 2025 Quality Score weighting changes
- [Google Ads Experiments (Karooya)](https://www.karooya.com/blog/google-ads-experiments-a-b-test-bidding-creatives-campaign-changes-effectively/) — A/B testing via campaigns

### Tertiary (LOW confidence)
- [Subscription Web Design Pricing 2026 -- Rubik](https://www.rubik.design/blog/understanding-web-design-subscription-pricing-in-2026) — subscription model market trends (single source, treat as directional only)

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*
