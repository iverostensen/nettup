# Feature Landscape

**Domain:** Web agency subscription landing page + Google Ads conversion optimization
**Milestone:** v1.6 Landingsside & Google Ads (nettup.no/nettside-for-bedrift)
**Researched:** 2026-03-19
**Confidence:** MEDIUM-HIGH (conversion optimization patterns well-documented; Norwegian subscription web agency model is niche with limited direct data)

---

## Existing Infrastructure (Already Built)

These sections exist and work. Features below describe changes/additions to them, not rebuilds from scratch.

| Section | Component | Status |
|---------|-----------|--------|
| LandingPageLayout | No nav, sticky header, phone CTA | Exists |
| Hero | H1 keyword match, trust badges, HeroMicroForm, LandingHeroAnimation | Exists |
| VisualProof | iGive case study screenshot | Exists |
| LogoCloud | Client logos | Exists |
| Testimonial | Single testimonial (placeholder) | Exists |
| WhyUs | 6 differentiators | Exists |
| PricingSummary | 3-tier cards, ScarcityCounter, guarantee banner | Exists |
| FAQ | JSON-LD FAQPage schema | Exists |
| FormSection | Embedded ContactForm with ?pakke= pre-fill | Exists |
| ScarcityCounter | "X av 10 plasser igjen" inline/card variants | Exists |
| launchOffer.ts | total/taken config | Exists |
| pricing.ts | 3 Pakke objects with originalPrice/launchPrice/monthly | Exists |
| gtag consent setup | Google Ads tag with consent mode | Exists |

---

## Table Stakes

Features the subscription landing page MUST have. Missing any of these means the page underperforms against paid traffic or the new subscription model is unclear.

### TS-1: Subscription Pricing Reframe (0 kr oppstart + 399 kr/mnd)

| Aspect | Detail |
|--------|--------|
| Why expected | The entire v1.6 value proposition is "no upfront cost." Current pricing shows 2,500-10,000 kr one-time fees with monthly add-on. Must completely replace this with subscription-first model. |
| Complexity | Medium |
| Dependencies | pricing.ts (rewrite), PricingSummary.astro (rewrite), Hero.astro (update price display) |

**What to build:**

- Rewrite `Pakke` interface: replace `originalPrice`/`launchPrice`/`savings`/`discountPercent` with `setupFee: number` (0), `monthlyFee: number` (399), `minimumMonths: number` (12), `includes: string[]`
- ONE primary subscription offer prominently displayed: 0 kr oppstart + 399 kr/mnd for 5-siders nettside
- Secondary tiers for larger needs (nettbutikk, webapplikasjon) presented as "Trenger du mer?" below the primary card, not as equal-weight alternatives
- Price anchoring: show what a comparable one-time website costs (15,000-25,000 kr) as crossed-out reference price, then reveal the 0 kr + 399 kr/mnd subscription alternative
- "Hva er inkludert"-breakdown beneath price: hosting, SSL, vedlikehold, support, domene-oppsett
- Monthly cost reframe in supporting text: "Under 100 kr i uka" or "Mindre enn en kopp kaffe om dagen"

**Pricing psychology (MEDIUM confidence, multiple sources):**

- Anchor with high one-time price first, then reveal subscription as the smart alternative. Anchoring is the single most effective pricing psychology tactic for subscriptions.
- Von Restorff effect: primary subscription card visually distinct (border-brand, ring, slight scale-up). The option that stands out visually becomes the reference point.
- Goldilocks principle applies IF showing 3 tiers: position the target tier in the center. But for a single-offer landing page, make the ONE offer the hero -- no choice paralysis.
- Show monthly price as the default (not annual equivalent). A/B testing data shows monthly-as-default converts better because there's no "price shock" when switching views.

### TS-2: Headline + Ad Copy Alignment for Quality Score

| Aspect | Detail |
|--------|--------|
| Why expected | Google Ads Quality Score is built on three pillars: expected CTR, ad relevance, and landing page experience. Keyword-to-headline-to-landing-page alignment directly affects all three. Google's 2025 QS update puts even more weight on user experience and message consistency. |
| Complexity | Low |
| Dependencies | Hero.astro, meta title/description, ad copy (external) |

**What to build:**

- H1 must contain target keyword AND the core offer: "Profesjonell nettside for din bedrift" remains the H1, with "0 kr oppstart" as prominent subheadline
- Meta title: "Nettside for Bedrift | 0 kr Oppstart, 399 kr/mnd | Nettup"
- Meta description must mirror what the ad promises: price, delivery time, guarantee -- the three things the user clicked the ad for
- Ad copy and landing page must tell the same story. If the ad says "Klar pa 2 uker" the landing page must say the same, not "1-3 uker"
- Quality Score diagnostic: after launch, monitor the three component scores in Google Ads and iterate on whichever is "Below average"

### TS-3: Form Optimization for Paid Traffic

| Aspect | Detail |
|--------|--------|
| Why expected | Paid traffic converts 2-3x worse than organic. Every field in the form costs conversions. Research shows reducing forms from 11 to 4 fields produces 120% conversion lift. Current ContactForm likely has 4-5 fields. |
| Complexity | Low-Medium |
| Dependencies | ContactForm island, FormSection.astro |

**What to build:**

- Reduce landing page form to 3 visible fields: Navn (name), E-post (email), Telefon (phone)
- Remove from visible form: company name, message textarea, service selector (already implied by landing page context)
- Auto-populate hidden fields: selected package from ?pakke= param, UTM parameters (utm_source, utm_medium, utm_campaign, utm_content) for attribution
- CTA button text must be specific and low-commitment: "Fa gratis nettside-samtale" or "Bestill gratis samtale" -- not generic "Send" or "Kontakt oss"
- Trust reinforcement directly below submit button: "Vi ringer deg innen 24 timer. Ingen forpliktelser."
- Progressive profiling: collect minimum at conversion, gather qualification details in follow-up call

### TS-4: Mobile-First Layout Verification

| Aspect | Detail |
|--------|--------|
| Why expected | 83% of landing page traffic is mobile. Mobile converts at 2.5-2.9% vs desktop 4.8-5.1%. Google Ads mobile traffic skews even higher. |
| Complexity | Low |
| Dependencies | All sections |

**What to build:**

- Verify all touch targets are 48x48dp minimum with 8dp spacing (existing standard, audit and confirm)
- Single-column layout on mobile (already exists, confirm no regressions from pricing rewrite)
- Price and CTA must be visible without scrolling on 375px viewport
- Form inputs must not require horizontal scroll
- Test form submission flow on mobile: keyboard doesn't obscure submit button, auto-scroll after field focus works

### TS-5: Page Speed for Quality Score

| Aspect | Detail |
|--------|--------|
| Why expected | Google's 2025 Quality Score update increased weight on page experience. A 1-second mobile delay causes 20% conversion drop. For paid traffic pages, speed is literally money. |
| Complexity | Low |
| Dependencies | LandingHeroAnimation (React island), HeroMicroForm (React island) |

**What to build:**

- Audit current LCP on /nettside-for-bedrift (two React islands load in hero with `client:load`)
- Consider `client:visible` for below-fold React islands (if any exist below fold)
- Ensure hero image (iGive preview) has explicit width/height to prevent CLS
- Preload critical hero assets (already partially done with getImage optimization)
- Target: LCP < 1.5s, CLS < 0.1 (stricter than site-wide 2s target because paid traffic ROI depends on it)
- Run Lighthouse on mobile emulation before and after changes; document scores

### TS-6: Google Ads Conversion Tracking

| Aspect | Detail |
|--------|--------|
| Why expected | Without conversion tracking, Google Ads Smart Bidding cannot optimize. Every day running ads without conversion data wastes budget. This is not optional -- it's required to run ads effectively. |
| Complexity | Medium |
| Dependencies | Existing gtag consent setup, form submission events |

**What to build:**

- Primary conversion event: Form submission (full form)
- Secondary conversion: Phone number click (tel: link in header and form section)
- Secondary conversion: Email click (mailto: link)
- Enhanced conversions: pass hashed email/phone to Google Ads for better attribution matching
- Conversion linker tag for cross-session attribution
- Mirror all conversion events as Plausible goals for independent verification
- Thank-you state after form submit: clear visual confirmation that submission succeeded (inline, not redirect)

---

## Differentiators

Features that increase conversion rate beyond baseline. Not strictly required, but deliver measurable lift based on research data.

### D-1: Enhanced Scarcity Counter with Visual Progress

| Aspect | Detail |
|--------|--------|
| Value proposition | Current ScarcityCounter is plain text ("3 av 10 plasser igjen"). Research shows scarcity + discount combined = 178% more likely to convert. Visual progress bars make scarcity tangible. |
| Complexity | Low |
| Dependencies | ScarcityCounter.astro, launchOffer.ts |

**What to build:**

- Add visual progress bar showing slots filled (7/10 = 70% filled bar, brand color)
- Optional: pulsing dot or subtle glow on remaining count (respect prefers-reduced-motion)
- Place scarcity counter in TWO locations: below hero price AND below pricing section (currently only in pricing)
- Update copy to be month-specific: "Kun 3 abonnementsplasser igjen i mars" -- adds real temporal urgency
- CRITICAL: Must remain truthful. Update launchOffer.ts when customers sign up. Never manufacture fake scarcity. This is both an ethical and practical requirement -- Norwegian consumers are skeptical and fake urgency destroys trust permanently.

### D-2: Contextual Trust Signals for Cold Ad Traffic

| Aspect | Detail |
|--------|--------|
| Value proposition | Cold traffic from ads bounces in 3-8 seconds without credibility markers. Research data: customer reviews with photos +18-27% lift, money-back guarantees +12-19%, founder credentials +7-12%. |
| Complexity | Medium |
| Dependencies | Hero.astro, Testimonial section |

**What to build:**

- Compact trust bar directly under H1: "Norsk selskap | 30 dagers garanti | 24t responstid" (3 badges, always above fold)
- Replace or remove the 4.9/5 star rating in hero. It currently says "basert pa kundeanmeldelser" but these reviews don't exist anywhere verifiable. Cold traffic from ads is the MOST skeptical audience. An unverifiable rating does more harm than good. Either link to real Google Reviews or remove entirely.
- Add founder photo + name near testimonial section. Research shows founder-visible brands convert 15-28% better than faceless ones. Especially relevant for a small Norwegian agency competing against larger faceless competitors.
- Move guarantee banner earlier in page -- before the pricing section, not after it. Reducing risk perception BEFORE the user sees the price is more effective.
- Norwegian-specific trust: Organisasjonsnummer visible somewhere on the page (B2B buyers verify on Proff.no)

### D-3: Subscription Objection-Handling Sections

| Aspect | Detail |
|--------|--------|
| Value proposition | A subscription model raises specific objections that one-time purchase pricing doesn't: "What if I want to cancel?", "Do I own the website?", "What happens after the minimum period?" Addressing these inline prevents bounce at the critical moment before form submission. |
| Complexity | Medium |
| Dependencies | New section components, placed between PricingSummary and FormSection |

**What to build:**

- "Hva skjer etter 12 maneder?" -- explain minimum contract period, month-to-month after that, cancellation terms, website ownership/transfer options
- "Abonnement vs. Engangskjop" comparison table: show total cost over 1 year, 2 years, 3 years. Make the subscription value obvious (0 kr upfront + ongoing support vs. 15,000 kr upfront + no support after delivery)
- "Hva er inkludert i 399 kr/mnd?" expandable/visible breakdown: hosting, SSL-sertifikat, teknisk vedlikehold, innholdsendringer (X per maned), support, sikkerhetskopier
- Place these BETWEEN pricing section and form section -- this is where objections peak (user has seen the offer but hasn't committed yet)

### D-4: Sticky Mobile CTA Bar

| Aspect | Detail |
|--------|--------|
| Value proposition | Mobile users scroll through long landing pages. A sticky CTA ensures the conversion action is always one tap away. |
| Complexity | Low |
| Dependencies | None (new component) |

**What to build:**

- Fixed bar at bottom of mobile viewport (hidden on desktop)
- Two actions: "Ring oss" (tel: link, left side) + "Bestill samtale" (scroll to #kontakt, right side, brand-colored)
- Appears after scrolling past hero section (not immediately -- avoid covering hero CTA)
- Disappears when form section is in viewport (avoid competing with the actual form)
- Slim: max 56px height, semi-transparent background
- Track interactions as Plausible events

### D-5: UTM Parameter Capture in Form

| Aspect | Detail |
|--------|--------|
| Value proposition | Know which ad group and keyword drove each lead. Without this, ad optimization is campaign-level only, not keyword-level. |
| Complexity | Low |
| Dependencies | ContactForm island, URL params |

**What to build:**

- Read utm_source, utm_medium, utm_campaign, utm_content, utm_term from URL on page load
- Store in hidden form fields submitted with form data
- Also capture gclid (Google click ID) for offline conversion upload
- Plausible event props mirror the UTM values for analytics cross-reference

### D-6: Dynamic Keyword Headline Support

| Aspect | Detail |
|--------|--------|
| Value proposition | When the landing page subtitle adapts to match the specific ad keyword the user clicked, perceived relevance increases and Quality Score improves. |
| Complexity | Low-Medium |
| Dependencies | Hero.astro, URL params from Google Ads ValueTrack |

**What to build:**

- Read `?kw=` URL parameter passed from Google Ads via ValueTrack {keyword}
- Dynamically update the subheadline or supporting text (NOT the H1 -- keep H1 static for SEO)
- Keyword mapping with fallback:
  - Default (no param): "Klar pa 2 uker. 0 kr oppstart."
  - "billig nettside": "Profesjonell nettside til fast manedspris"
  - "nettside pris": "Fra 399 kr/mnd. Ingen oppstartskostnad."
  - "webbyra [city]": "Vi bygger nettsider for bedrifter i [city]"
- Fallback gracefully for unrecognized keywords

---

## Anti-Features

Features to explicitly NOT build. These seem tempting but hurt conversion or waste effort.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Countdown timer with fake deadline | Destroys trust with ad-skeptical cold traffic. Norwegian consumers are especially resistant to pressure tactics. If the deadline isn't real, it's deceptive. | Use real scarcity (limited subscription slots). Month-specific slot count is honest and effective. |
| Exit-intent popup | Aggressive, cheap-feeling for a professional agency. Undermines the premium positioning. | Let pricing quality and trust signals do the work. If users leave, retarget them via Google Ads remarketing. |
| Live chat / chatbot on landing page | Competes with form for attention. Landing pages must have ONE conversion path. The main site chatbot is great for organic visitors -- but paid traffic needs singular focus. | Keep chatbot off /nettside-for-bedrift. LandingPageLayout already excludes it. |
| Three equal-weight pricing tiers | The subscription offer is ONE clear thing: 0 kr + 399 kr/mnd. Three equal cards create choice paralysis with cold traffic who doesn't know you yet. | One hero subscription card. Secondary tiers collapsed below as "Trenger du mer?" text. |
| Testimonial carousel / slider | Carousels have near-zero interaction rates on landing pages. A single powerful testimonial outperforms 5 rotating weak ones. | One testimonial with photo, full name, company name, and a specific result metric. |
| Social media links | Every outbound link is an exit. The landing page removes navigation for this reason. | Zero exit paths except conversion actions (form, phone, email). |
| "Mest populaer" badge on single offer | Marking your only option as "most popular" is transparently manipulative when there's one option. | Use visual emphasis (border, scale, color) instead of a text badge. |
| Complex pricing calculator link | /priskalkulator exists on main site for exploratory visitors. Linking from paid landing page creates exit to page with navigation. | "Trenger du noe skreddersydd? Ring oss pa [number]" -- keeps them in conversion mode. |
| Fake star rating (4.9/5 "basert pa kundeanmeldelser") | Currently in hero. No verifiable source. Cold ad traffic is the most skeptical audience. Unverifiable claims actively hurt conversion. | Remove until real Google Reviews exist, or replace with a single specific client quote. |
| Google Tag Manager | Additional script when gtag.js is already loaded. Adds complexity and another request. | Use gtag.js directly for the 3-4 conversion events needed. |
| Hotjar / session recording at launch | Adds consent requirement (not cookieless), script weight, and complexity. | Evaluate after 2-4 weeks of ad data. Use Plausible + Google Ads reporting first. |
| A/B testing framework | Overkill for one landing page with limited traffic. Requires 1,000+ weekly visitors for statistical validity. | Use Google Ads campaign experiments (URL-based variant splitting) if testing is needed. |

---

## Feature Dependencies

```
TS-1 (Pricing Reframe) --> TS-2 (Headline Alignment)
  New pricing model informs what headline/meta says

TS-1 (Pricing Reframe) --> D-1 (Scarcity Enhancement)
  New subscription offer determines what scarcity counts ("abonnementsplasser")

TS-1 (Pricing Reframe) --> D-3 (Objection Handling)
  Subscription terms drive which objections need answering

TS-3 (Form Optimization) --> D-5 (UTM Capture)
  Form must have hidden fields before UTM values can be stored

TS-3 (Form Optimization) --> TS-6 (Conversion Tracking)
  Form submission events must be defined before tracking can fire

TS-6 (Conversion Tracking) --> D-6 (Dynamic Keywords)
  UTM/keyword tracking feeds into attribution reports

TS-4 (Mobile Layout) -- no blockers, parallel
TS-5 (Page Speed) -- no blockers, parallel
D-2 (Trust Signals) -- no blockers, parallel
D-4 (Sticky Mobile CTA) -- no blockers, parallel
```

---

## MVP Recommendation

**Must ship together (core of v1.6 -- cannot run ads without all of these):**

1. **TS-1: Subscription Pricing Reframe** -- the entire purpose of v1.6; everything else supports this
2. **TS-2: Headline + Ad Copy Alignment** -- required for Google Ads Quality Score; can't run effective ads without it
3. **TS-3: Form Optimization** -- paid traffic demands minimal friction; 3 fields max
4. **TS-5: Page Speed Audit** -- Quality Score gatekeeper; measure before/after
5. **TS-6: Google Ads Conversion Tracking** -- cannot run ads without defined conversions
6. **D-5: UTM Parameter Capture** -- must know which keywords drive leads from day 1

**Ship immediately after (first optimization wave, within first week):**

7. **D-1: Scarcity Counter Enhancement** -- low effort, high conversion lift, builds on existing component
8. **D-2: Trust Signals for Cold Traffic** -- addresses the #1 cold traffic bounce cause
9. **D-3: Objection Handling Sections** -- subscription model specifically needs these
10. **D-4: Sticky Mobile CTA** -- low effort, keeps conversion action visible on scroll

**Defer until data supports it:**

- **D-6 (Dynamic Keyword Insertion):** Optimization play. Run ads for 2-4 weeks first, identify which keywords convert, THEN personalize for top converters.
- **TS-4 (Full mobile audit):** Spot-check during build. Full audit only if mobile bounce rate exceeds 60% after launch.

---

## Google Ads Campaign Structure (Companion Feature)

Not a landing page feature, but the landing page exists to receive this traffic. Campaign structure dictates headline/copy requirements.

### Recommended Campaign Structure

| Campaign | Ad Group | Keywords (Norwegian) | Match Type |
|----------|----------|---------------------|------------|
| Nettside Bedrift | Generell | nettside for bedrift, lage nettside bedrift, ny nettside for firma | Phrase |
| Nettside Bedrift | Pris | nettside pris, billig nettside bedrift, rimelig nettside | Phrase |
| Nettside Bedrift | Byra | webbyra, webdesign byra, nettside byra | Phrase |
| Nettside Bedrift | Abonnement | nettside abonnement, nettside manedlig, nettside leie, nettside fast pris | Phrase |
| Nettside Lokal | Oslo | nettside oslo, webbyra oslo, webdesign oslo | Phrase |
| Nettside Lokal | Drammen | nettside drammen, webbyra drammen, webdesign drammen | Phrase |
| Nettside Lokal | Baerum/Asker | nettside baerum, webbyra asker | Phrase |

### Ad Copy Framework

- Headline 1: Match H1 keyword ("Profesjonell Nettside for Bedrift")
- Headline 2: Price point ("0 kr Oppstart - 399 kr/mnd")
- Headline 3: Trust signal ("30 Dagers Garanti")
- Description 1: Expand on value + delivery time + CTA
- Description 2: Reinforce trust + secondary benefit
- Sitelink extensions: Prosjekter, Om Oss, Priskalkulator, Kontakt
- Callout extensions: "Norsk Selskap", "24t Responstid", "Ingen Binding Etter 12 mnd"

### Negative Keywords

- gratis (free-seekers, zero conversion intent)
- wordpress, wix, squarespace, webflow (DIY builders)
- jobb, stilling, karriere, ansatt (job seekers)
- kurs, laere, utdanning (education seekers)
- mal, template (template seekers)
- wordpress tema, shopify tema (theme shoppers)

### Budget Allocation

Start with "Nettside Bedrift > Generell" and "Nettside Bedrift > Pris" ad groups at 70% of budget. These have highest commercial intent. Scale to local campaigns after 2-4 weeks of conversion data.

---

## Sources

- [Landing Page Best Practices 2026 -- Lovable](https://lovable.dev/guides/landing-page-best-practices-convert) -- form optimization (11->4 fields = 120% lift), CTA framing ("Trial for free" +104%), mobile touch targets (HIGH confidence)
- [Landing Page Conversion Rates by Industry -- First Page Sage](https://firstpagesage.com/seo-blog/landing-page-conversion-rates-by-industry/) -- industry conversion benchmarks (MEDIUM confidence)
- [Google Ads Quality Score -- Google Help](https://support.google.com/google-ads/answer/6167118?hl=en) -- Quality Score components definition (HIGH confidence, authoritative)
- [Quality Score in 2026 -- Optmyzr](https://www.optmyzr.com/blog/google-ads-quality-score/) -- 2025 QS system update details (MEDIUM confidence)
- [5 Ways to Use Quality Score -- Google Help](https://support.google.com/google-ads/answer/6167130?hl=en) -- QS optimization strategies (HIGH confidence, authoritative)
- [Landing Page Statistics 2026 -- Blogging Wizard](https://bloggingwizard.com/landing-page-statistics/) -- form field data, 83% mobile traffic stat (MEDIUM confidence)
- [Subscription Pricing Psychology -- Binary Stream](https://binarystream.com/4-secrets-to-better-subscription-pricing-psychology/) -- Goldilocks, Von Restorff, anchoring, mood as conversion factor (MEDIUM confidence)
- [DTC Landing Page Strategies 2026 -- MHI Growth Engine](https://mhigrowthengine.com/blog/best-landing-page-strategies-dtc-brands-2026/) -- founder presence +15-28%, trust element lift data (MEDIUM confidence)
- [Using Scarcity and Urgency Ethically -- Site123](https://www.site123.com/learn/using-scarcity-and-urgency-on-landing-pages-ethically) -- ethical scarcity guidelines (MEDIUM confidence)
- [Scarcity Effect in Marketing -- Lead Alchemists](https://www.leadalchemists.com/marketing-psychology/scarcity-effect/) -- scarcity + discount = 178% lift (MEDIUM confidence)
- [Subscription Web Design Pricing 2026 -- Rubik](https://www.rubik.design/blog/understanding-web-design-subscription-pricing-in-2026) -- subscription model market trends (LOW confidence, single source)
- [Google Ads Campaign Structure -- Search Atlas](https://searchatlas.com/blog/google-ads-campaign-structure/) -- ad group organization (MEDIUM confidence)
- [How to Write Landing Pages 2026 -- Advait Labs](https://advaitlabs.com/how-to-write-landing-page-that-converts-2026/) -- loss aversion framing, cognitive fluency (MEDIUM confidence)
- [B2B Landing Pages 2025 -- Exposure Ninja](https://exposureninja.com/blog/b2b-landing-pages/) -- B2B form and trust patterns (MEDIUM confidence)
- [Landing Page Conversion Stats -- Genesys Growth](https://genesysgrowth.com/blog/landing-page-conversion-stats-for-marketing-leaders) -- progressive profiling strategy (MEDIUM confidence)

---
*Feature research for: Nettup v1.6 -- Landingsside & Google Ads*
*Researched: 2026-03-19*
