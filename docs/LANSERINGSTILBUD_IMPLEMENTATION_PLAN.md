# Lanseringstilbud Implementation Plan

> Comprehensive guide for implementing the "Launch Offer" pricing strategy across nettup.no

**Last updated:** January 2025
**Status:** Planning
**Estimated files to update:** 15+

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Psychology & Research Foundation](#psychology--research-foundation)
3. [Pricing Strategy](#pricing-strategy)
4. [Framing & Messaging](#framing--messaging)
5. [Visual Design Guidelines](#visual-design-guidelines)
6. [File-by-File Implementation](#file-by-file-implementation)
7. [New Components Needed](#new-components-needed)
8. [Copy Bank (Norwegian)](#copy-bank-norwegian)
9. [A/B Testing Plan](#ab-testing-plan)
10. [Ethics & Compliance](#ethics--compliance)
11. [Launch Checklist](#launch-checklist)
12. [Rollback Strategy](#rollback-strategy)

---

## Executive Summary

### The Strategy

Transform pricing from "7,000 kr" to a **limited launch offer** that:

1. **Lowers barrier to entry** → More customers
2. **Maintains monthly recurring revenue** → Long-term value
3. **Creates authentic urgency** → Higher conversion
4. **Builds portfolio** → Social proof for future pricing

### New Pricing Structure

| Tier | Original | Launch Price | Discount | Monthly (unchanged) |
|------|----------|--------------|----------|---------------------|
| Enkel | 7 000 kr | **2 500 kr** | 64% off | 350 kr/mnd |
| Standard | 15 000 kr | **4 500 kr** | 70% off | 500 kr/mnd |
| Premium | 25 000 kr | **10 000 kr** | 60% off | 750 kr/mnd |

### Scarcity Mechanism

**Quantity-based** (not time-based): "Kun 10 plasser til lanseringspris"

This is honest, trackable, and avoids fake countdown timers.

---

## Psychology & Research Foundation

### Why This Works: Evidence-Based Principles

#### 1. Price Anchoring Effect

> "The first price people see strongly influences what they think something should cost, even if that first price isn't relevant."
> — Tversky & Kahneman

**Application:** Show the original price (7,000 kr) crossed out, with the new price (2,500 kr) beside it. The brain anchors on 7,000 kr and perceives 2,500 kr as exceptional value.

**Research:** [Shopify reports](https://www.shopify.com/enterprise/blog/44331971-6-scientific-principles-of-persuasion-all-smart-ecommerce-founders-know) that strikethrough pricing reframes the purchase from "I'm spending 2,500 kr" to "I'm gaining 4,500 kr worth of value."

#### 2. Loss Aversion (FOMO)

> "People fear losing a deal more than they enjoy saving money."

**Statistics:**
- 68% of millennials make purchases within 24 hours when influenced by FOMO
- 60% of people say FOMO influences their purchase decisions
- Limited-time offers can increase conversions by 35%+

**Source:** [Marketing Course on Scarcity](https://marketingcourse.org/the-power-of-scarcity-and-urgency-behavioral-economics-in-marketing/)

#### 3. Commitment & Consistency (Tripwire Effect)

> "When someone makes even a small purchase, they justify their decision and are much more likely to buy again."

**Data:** Businesses see a **60–70% repeat purchase rate** from tripwire customers vs. 5–20% for new customers.

**Application:** The low upfront cost is our tripwire. Once they're a customer, the monthly fee becomes the recurring revenue stream.

**Source:** [Rebelgrowth Tripwire Guide](https://rebelgrowth.com/blog/tripwire-offers-the-ultimate-guide-to-rapid-customer-acquisition-2024-edition)

#### 4. Three-Tier Pricing Structure

> "Research from the University of California found that conversion rates are highest when customers are presented with three pricing tiers."

**Our structure:**
- **Enkel (Low):** Entry point, penetration pricing
- **Standard (Mid):** Best value, most conversions expected
- **Premium (High):** Anchor that makes Standard look attractive

**Source:** [Clootrack Pricing Strategies](https://www.clootrack.com/blogs/11-proven-psychological-pricing-strategies-examples-2024)

#### 5. Countdown Timer Effectiveness

**A/B Test Results:**
- One test showed **300% conversion increase** (3.5% → 10%)
- Another showed **226% increase** in form completions
- Average improvement range: **5-30%** depending on implementation

**Critical finding:** Timers work best with believable reasons. "Just slapping a countdown timer onto an existing page with no explanation will not work."

**Source:** [Capital & Growth CRO Analysis](https://capitalandgrowth.org/answers/2981186/Do-countdown-timers-increase-sales)

#### 6. Visual Psychology

> "When the original price is larger in font size than the reduced price, shoppers perceive the discount to be larger."

**Application:** Make "7 000 kr" visually prominent (then cross it out), make "2 500 kr" smaller but highlighted with brand color.

**Source:** [Conversion.com Pricing Psychology](https://conversion.com/blog/using-pricing-psychology/)

---

## Pricing Strategy

### Why These Specific Numbers

| Tier | New Price | Reasoning |
|------|-----------|-----------|
| **2 500 kr** | Psychologically under "3k threshold", feels like a small investment |
| **4 500 kr** | Middle ground, "less than 5k", best value positioning |
| **10 000 kr** | Round number for premium, still 60% off anchor |

### Monthly Pricing (Unchanged)

The monthly fee is where the real business model lives:

| Tier | Monthly | Annual Revenue | Break-even vs. one-time |
|------|---------|----------------|-------------------------|
| Enkel | 350 kr | 4 200 kr/år | Month 8 |
| Standard | 500 kr | 6 000 kr/år | Month 8 |
| Premium | 750 kr | 9 000 kr/år | Month 14 |

**Strategy:** Low upfront = high acquisition. Monthly = lifetime value.

### Scarcity Mechanism: "10 Plasser"

**Why quantity-based (not time-based):**

1. **Honest** — You actually want ~10 reference projects
2. **Trackable** — Can update "7 plasser igjen" genuinely
3. **No fake urgency** — Countdown timers that reset look scammy
4. **Evergreen** — When you hit 10, you can say "Tilbudet er utsolgt" credibly

**Counter display options:**
- "Kun 10 plasser til lanseringspris"
- "7 av 10 plasser tatt" (progress bar)
- "3 plasser igjen til lanseringspris!"

---

## Framing & Messaging

### Primary Narrative

```
"Vi bygger porteføljen"

Nettup er nystartet, og vi ønsker flere referanseprosjekter å vise frem.
Derfor tilbyr vi inntil 70% rabatt på oppstartskostnad for våre første
10 kunder.

Du får en førsteklasses nettside til en brøkdel av prisen – vi får et
prosjekt vi kan være stolte av. Vinn-vinn.
```

### Why This Framing Works

1. **Transparency** — Admits you're new (builds trust)
2. **Reciprocity** — "You help us, we help you"
3. **Quality signal** — "We want projects we can be proud of"
4. **Scarcity** — Limited to 10 customers
5. **Value proposition** — Explicitly states "førsteklasses nettside"

### Alternative Framings (A/B Test Candidates)

**Option A: "Startrabatt" (Simple)**
```
Startrabatt: Spar opptil 70%
Som nyetablert byrå tilbyr vi startrabatt på oppstartskostnad.
Tilbudet gjelder våre første 10 kunder.
```

**Option B: "Beta-kunde" (Engagement)**
```
Bli beta-kunde
Få 70% rabatt. Til gjengjeld ønsker vi en ærlig anmeldelse
etter 3 måneder. Kun 10 plasser.
```

**Option C: "Grunnlegger-tilbud" (Exclusive)**
```
Grunnlegger-tilbud
De første 10 kundene våre får eksklusive grunnlegger-priser
som aldri kommer tilbake. Lås inn din plass nå.
```

---

## Visual Design Guidelines

### Pricing Card Design

```
┌─────────────────────────────────────┐
│  ⭐ LANSERINGSTILBUD                │  ← Badge (brand color)
├─────────────────────────────────────┤
│  Standard                           │
│  For bedrifter som vil ha litt mer  │
│                                     │
│  ~~15 000 kr~~  ← Strikethrough, larger, muted
│  4 500 kr       ← Bold, brand color
│  Spar 10 500 kr ← Small, green/success color
│                                     │
│  + 500 kr/mnd   ← Unchanged, subtle │
│                                     │
│  ✓ Feature 1                        │
│  ✓ Feature 2                        │
│  ✓ Feature 3                        │
│                                     │
│  [    Velg Standard    ]            │ ← CTA button
│                                     │
└─────────────────────────────────────┘
```

### Visual Hierarchy Principles

1. **Badge first** — "LANSERINGSTILBUD" catches eye
2. **Original price** — Larger font, strikethrough, muted color
3. **New price** — Smaller but bold, brand color (cyan)
4. **Savings callout** — "Spar X kr" in green/success color
5. **Monthly** — Deemphasized, appears as continuation

### Color Usage

| Element | Color | Class |
|---------|-------|-------|
| Badge background | Brand cyan | `bg-brand` |
| Original price | Muted, strikethrough | `text-text-muted line-through` |
| New price | Brand cyan | `text-brand font-bold` |
| Savings text | Green/success | `text-green-400` |
| Monthly text | Muted | `text-text-muted` |

### Progress Indicator (Optional)

```
Lanseringstilbud: 7 av 10 plasser tatt

[███████░░░] 70%

Kun 3 plasser igjen!
```

### Mobile Considerations

- Badge should wrap gracefully
- Strikethrough price + new price on same line if possible
- Progress bar should be full-width on mobile
- CTA button always visible without scrolling

---

## File-by-File Implementation

### Priority 1: User-Facing Pricing (Critical)

#### 1. `src/pages/tjenester/_sections/Pakker.astro`

**Current:**
```javascript
{
  name: 'Enkel',
  price: '7 000',
  monthly: '350',
  // ...
}
```

**New:**
```javascript
{
  name: 'Enkel',
  originalPrice: '7 000',
  launchPrice: '2 500',
  savings: '4 500',
  discountPercent: '64',
  monthly: '350',
  // ...
}
```

**Visual changes:**
- Add "LANSERINGSTILBUD" badge to all cards
- Show strikethrough original price
- Highlight launch price
- Add "Spar X kr" text
- Keep monthly unchanged

---

#### 2. `src/pages/nettside-for-bedrift/_sections/PricingSummary.astro`

Same data structure changes as Pakker.astro.

**Additional:**
- Update guarantee banner text if needed
- Add scarcity counter ("X plasser igjen")

---

#### 3. `src/pages/kontakt/_sections/ContactForm.tsx`

**Current (lines 26-30):**
```typescript
const PAKKE_INFO = {
  enkel: { name: 'Enkel', price: '7 000 kr', monthly: '350 kr/mnd' },
  standard: { name: 'Standard', price: '15 000 kr', monthly: '500 kr/mnd' },
  premium: { name: 'Premium', price: 'fra 25 000 kr', monthly: '750 kr/mnd' },
};
```

**New:**
```typescript
const PAKKE_INFO = {
  enkel: {
    name: 'Enkel',
    originalPrice: '7 000 kr',
    launchPrice: '2 500 kr',
    monthly: '350 kr/mnd'
  },
  standard: {
    name: 'Standard',
    originalPrice: '15 000 kr',
    launchPrice: '4 500 kr',
    monthly: '500 kr/mnd'
  },
  premium: {
    name: 'Premium',
    originalPrice: 'fra 25 000 kr',
    launchPrice: '10 000 kr',
    monthly: '750 kr/mnd'
  },
};
```

**Badge display update:**
```tsx
<p className="mt-1 text-sm text-text-muted">
  <span className="line-through">{selectedPakke.originalPrice}</span>
  {' '}
  <span className="font-semibold text-brand">{selectedPakke.launchPrice}</span>
  {' '}+ {selectedPakke.monthly}
</p>
```

---

#### 4. `src/pages/nettside-for-bedrift/_sections/Hero.astro`

**Current (line 42):**
```html
Fra <span class="font-semibold text-text">7 000 kr</span> – Klar på 1-3 uker
```

**New:**
```html
<span class="line-through text-text-muted">7 000 kr</span>
<span class="font-semibold text-brand">Fra 2 500 kr</span>
<span class="text-sm text-green-400">(Lanseringstilbud)</span>
– Klar på 1-3 uker
```

---

#### 5. `src/pages/nettside-for-bedrift/_sections/WhyUs.astro`

**Current (line 32):**
```javascript
highlight: 'Fra 7 000 kr',
```

**New:**
```javascript
highlight: 'Fra 2 500 kr',
highlightBadge: 'Lanseringstilbud',
```

---

### Priority 2: FAQ Updates

#### 6. `src/pages/nettside-for-bedrift/_sections/FAQ.astro`

**Current (lines 14-15):**
```javascript
answer: 'Våre pakker starter fra 7 000 kr for en enkel nettside...'
```

**New:**
```javascript
answer: 'Vi kjører lanseringstilbud! Enkel-pakken koster kun 2 500 kr (ordinært 7 000 kr). Standard koster 4 500 kr (ordinært 15 000 kr). Premium starter fra 10 000 kr (ordinært 25 000 kr). Tilbudet gjelder våre første 10 kunder.',
```

**Add new FAQ item:**
```javascript
{
  question: 'Hvor lenge varer lanseringstilbudet?',
  answer: 'Tilbudet gjelder til vi har fått 10 kunder. Vi oppdaterer siden fortløpende med hvor mange plasser som er igjen. Når tilbudet er utsolgt, går vi tilbake til ordinære priser.',
},
```

---

### Priority 3: SEO Meta Tags

#### 7. `src/pages/index.astro`

**Current (lines 17-18):**
```javascript
title="Nettside for Bedrift | Fra 7 000 kr | Nettup"
description="Moderne, raske nettsider for norske bedrifter. Fra 7 000 kr, klar på 1-3 uker."
```

**New:**
```javascript
title="Nettside for Bedrift | Fra 2 500 kr (Lanseringstilbud) | Nettup"
description="Moderne, raske nettsider for norske bedrifter. Lanseringstilbud: Fra 2 500 kr (ordinært 7 000 kr). Klar på 1-3 uker."
```

---

#### 8. `src/pages/nettside-for-bedrift/index.astro`

**Current (lines 29-30):**
```javascript
title="Nettside for Bedrift | Fra 7 000 kr | Nettup"
description="Profesjonell nettside for din bedrift. Moderne, rask og SEO-optimalisert. Fra 7 000 kr, klar på 1-3 uker."
```

**New:**
```javascript
title="Nettside for Bedrift | Fra 2 500 kr (Spar 64%) | Nettup"
description="Profesjonell nettside for din bedrift. Lanseringstilbud: Fra 2 500 kr (ordinært 7 000 kr). Kun 10 plasser."
```

---

#### 9. `src/pages/tjenester/index.astro`

**Current (lines 13-14):**
```javascript
title="Nettside Priser | Pakker fra 7 000 kr | Nettup"
description="Se våre pakker og priser. Enkel fra 7 000 kr, Standard fra 15 000 kr, Premium fra 25 000 kr."
```

**New:**
```javascript
title="Nettside Priser | Lanseringstilbud fra 2 500 kr | Nettup"
description="Lanseringstilbud: Enkel 2 500 kr (spar 4 500 kr), Standard 4 500 kr (spar 10 500 kr), Premium 10 000 kr (spar 15 000 kr). Kun 10 plasser!"
```

---

#### 10. `src/layouts/LandingPageLayout.astro`

**Current (line 25):**
```javascript
description = 'Profesjonell nettside for din bedrift. Fra 7 000 kr.'
```

**New:**
```javascript
description = 'Profesjonell nettside for din bedrift. Lanseringstilbud: Fra 2 500 kr (ordinært 7 000 kr).'
```

---

### Priority 4: Structured Data (JSON-LD)

#### 11. `src/layouts/BaseLayout.astro`

**Current (line 74):**
```javascript
"description": "Webdesign og webutvikling i Oslo-området. Moderne, raske nettsider fra 7 000 kr.",
```

**New:**
```javascript
"description": "Webdesign og webutvikling i Oslo-området. Lanseringstilbud: Nettsider fra 2 500 kr (ordinært 7 000 kr).",
```

**Current (line 93):**
```javascript
"priceRange": "7000-25000 NOK",
```

**New:**
```javascript
"priceRange": "2500-10000 NOK",
```

**Add Offer schema:**
```javascript
{
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "Lanseringstilbud - Nettside for Bedrift",
  "description": "Profesjonell nettside til lanseringspris",
  "price": "2500",
  "priceCurrency": "NOK",
  "availability": "https://schema.org/LimitedAvailability",
  "inventoryLevel": {
    "@type": "QuantitativeValue",
    "value": 10
  },
  "priceValidUntil": "2025-12-31",
  "seller": {
    "@type": "Organization",
    "name": "Nettup"
  }
}
```

---

### Priority 5: Google Ads

#### 12. `docs/google_ads_nettup_leads_search.md`

Update all ad copy references:
- "Fra 7 000 kr" → "Fra 2 500 kr (Lanseringstilbud)"
- Add sitelink for "Lanseringstilbud"
- Update headline variations

---

## New Components Needed

### 1. `LaunchOfferBanner.astro`

A dismissible banner for the top of pages:

```astro
---
interface Props {
  remainingSlots?: number;
}

const { remainingSlots = 10 } = Astro.props;
---

<div
  id="launch-banner"
  class="bg-gradient-to-r from-brand/20 to-brand/10 border-b border-brand/20"
>
  <div class="container mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-surface">
          {remainingSlots}
        </span>
        <p class="text-sm">
          <strong class="text-brand">Lanseringstilbud:</strong>
          {' '}Kun {remainingSlots} plasser igjen til opptil 70% rabatt
          <a href="/tjenester#pakker" class="ml-2 text-brand underline hover:text-brand-light">
            Se priser →
          </a>
        </p>
      </div>
      <button
        type="button"
        onclick="this.parentElement.parentElement.parentElement.remove()"
        class="text-text-muted hover:text-text"
        aria-label="Lukk"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</div>
```

---

### 2. `ScarcityCounter.astro`

Reusable progress indicator:

```astro
---
interface Props {
  total?: number;
  taken?: number;
  variant?: 'inline' | 'card';
}

const { total = 10, taken = 0, variant = 'inline' } = Astro.props;
const remaining = total - taken;
const percentage = (taken / total) * 100;
---

{variant === 'inline' ? (
  <div class="flex items-center gap-3 text-sm">
    <div class="h-2 w-24 overflow-hidden rounded-full bg-white/10">
      <div
        class="h-full bg-brand transition-all duration-500"
        style={`width: ${percentage}%`}
      />
    </div>
    <span class="text-text-muted">
      <strong class="text-brand">{remaining}</strong> av {total} plasser igjen
    </span>
  </div>
) : (
  <div class="rounded-xl border border-brand/20 bg-brand/5 p-4">
    <p class="text-sm font-medium text-text">Lanseringstilbud</p>
    <div class="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        class="h-full bg-brand transition-all duration-500"
        style={`width: ${percentage}%`}
      />
    </div>
    <p class="mt-2 text-xs text-text-muted">
      {taken} av {total} plasser tatt – <strong class="text-brand">{remaining} igjen</strong>
    </p>
  </div>
)}
```

---

### 3. `PriceDisplay.astro`

Reusable price display with strikethrough:

```astro
---
interface Props {
  originalPrice: string;
  launchPrice: string;
  savings?: string;
  monthly?: string;
  size?: 'sm' | 'md' | 'lg';
}

const { originalPrice, launchPrice, savings, monthly, size = 'md' } = Astro.props;

const sizeClasses = {
  sm: { original: 'text-sm', launch: 'text-xl', savings: 'text-xs' },
  md: { original: 'text-lg', launch: 'text-3xl', savings: 'text-sm' },
  lg: { original: 'text-xl', launch: 'text-4xl', savings: 'text-base' },
};
---

<div class="space-y-1">
  <div class="flex items-baseline gap-2">
    <span class={`${sizeClasses[size].original} text-text-muted line-through`}>
      {originalPrice} kr
    </span>
  </div>
  <div class="flex items-baseline gap-2">
    <span class={`${sizeClasses[size].launch} font-bold text-brand`}>
      {launchPrice}
    </span>
    <span class="text-text-muted">kr</span>
  </div>
  {savings && (
    <p class={`${sizeClasses[size].savings} text-green-400`}>
      Spar {savings} kr
    </p>
  )}
  {monthly && (
    <p class="mt-2 text-sm text-text-muted">
      + {monthly} kr/mnd
    </p>
  )}
</div>
```

---

## Copy Bank (Norwegian)

### Headlines

```
# Primary
Lanseringstilbud – vi bygger porteføljen

# Alternatives
Startrabatt: Spar opptil 70%
Bli en av våre første 10 kunder
Grunnlegger-priser – kun 10 plasser
Lanseringskampanje: Nettside fra 2 500 kr
```

### Subheadlines

```
Vi er nystartet og vil ha flere referanseprosjekter.
Du får kvalitet – vi får en kunde vi kan være stolte av.
Førsteklasses nettside til en brøkdel av prisen.
Tilbudet gjelder til vi har 10 fornøyde kunder.
```

### CTAs

```
# Primary
Sikre din plass
Kom i gang nå
Velg pakke

# Secondary
Se alle pakker
Les mer om tilbudet
Kontakt oss for spørsmål
```

### Urgency Text

```
# Counter variants
Kun X plasser igjen
X av 10 plasser tatt
Snart fullt – X plasser igjen

# Soft urgency (no fake pressure)
Tilbudet varer til vi har 10 kunder
Vi oppdaterer fortløpende
Først til mølla-prinsippet gjelder
```

### Trust Builders

```
Samme kvalitet – lavere pris
Full fornøyd-garanti gjelder fortsatt
Ingen binding, ingen skjulte kostnader
Du eier nettsiden din – alltid
```

### FAQ Copy

```
Q: Hvorfor er det så billig?
A: Vi er nystartet og vil bygge porteføljen. De første 10 kundene får eksklusive priser i bytte mot at vi kan bruke prosjektet som referanse.

Q: Er kvaliteten dårligere?
A: Absolutt ikke. Vi bruker like mye tid og omtanke på hvert prosjekt. Faktisk er vi ekstra motiverte – vi vil at disse prosjektene skal imponere.

Q: Hvor lenge varer tilbudet?
A: Til vi har 10 kunder. Vi oppdaterer siden med hvor mange plasser som er igjen. Når det er fullt, går vi tilbake til ordinære priser.

Q: Hva skjer med månedsprisen?
A: Den er uendret. Rabatten gjelder kun oppstartskostnaden.
```

---

## A/B Testing Plan

### Phase 1: Validate Core Messaging (Week 1-2)

**Test:** "Lanseringstilbud" vs "Startrabatt" vs "Beta-kunde"

| Variant | Headline | Hypothesis |
|---------|----------|------------|
| A (Control) | "Lanseringstilbud – vi bygger porteføljen" | Baseline |
| B | "Startrabatt: Spar opptil 70%" | Simpler, more direct |
| C | "Bli beta-kunde – få 70% rabatt" | Reciprocity angle |

**Metric:** Form submissions on landing page

---

### Phase 2: Scarcity Display (Week 3-4)

**Test:** Progress bar placement and style

| Variant | Scarcity Display | Location |
|---------|------------------|----------|
| A | None (just text "10 plasser") | Hero only |
| B | Progress bar | Below pricing cards |
| C | Top banner + progress bar | Sitewide |

**Metric:** Time on pricing page, scroll depth, conversions

---

### Phase 3: Price Display (Week 5-6)

**Test:** Strikethrough styling

| Variant | Display Style |
|---------|---------------|
| A | `~~7 000 kr~~ 2 500 kr` (inline) |
| B | Original above, new below (stacked) |
| C | "Spar 4 500 kr" prominent, prices secondary |

**Metric:** Click-through from pricing card to form

---

### Tools

- **Vercel Analytics** (already installed) for traffic
- **Formspree** submissions as conversion metric
- Manual A/B via URL parameters (?variant=b)

---

## Ethics & Compliance

### Our Commitments

#### 1. Honest Scarcity

✅ **DO:**
- Actually limit to 10 customers at launch price
- Update counter genuinely when slots are filled
- Remove offer when all slots are taken

❌ **DON'T:**
- Reset counter artificially
- Create fake urgency with countdown timers
- Say "almost sold out" when it's not

#### 2. Real Price Anchors

✅ **DO:**
- Use prices we actually intend to charge later
- Keep "ordinær pris" consistent across all materials
- Be prepared to charge full price after 10 customers

❌ **DON'T:**
- Inflate "original" prices just to show a bigger discount
- Keep the "lanseringstilbud" running indefinitely

#### 3. Transparent Reasoning

✅ **DO:**
- Explain WHY we're offering the discount (building portfolio)
- State the reciprocal benefit (we get reference projects)
- Be clear about what customers "pay" (being a reference)

❌ **DON'T:**
- Hide the business motivation
- Make it seem purely altruistic

### Legal Considerations (Norway)

**Markedsføringsloven** requires:
- Accurate price comparisons
- "Før-pris" must be the actual previous price
- Time-limited offers must have real end dates

**Our approach is compliant because:**
- 7,000 kr etc. are our intended regular prices
- Offer ends when 10 customers are acquired (real limit)
- We're a new business, so no previous pricing history issues

### Sources on Ethics

- [Chris Koehl: Ethical Scarcity Strategies](https://chriskoehl.com/ethical-scarcity-and-urgency/)
- [Mailchimp: The Scarcity Principle](https://mailchimp.com/resources/scarcity-principle/)
- [Voucherify: EU Omnibus Directive](https://www.voucherify.io/blog/strikethrough-pricing-why-a-single-line-still-drives-conversions)

---

## Launch Checklist

### Pre-Launch (1-2 days before)

- [ ] All pricing files updated with new structure
- [ ] New components created and tested
- [ ] FAQ updated with launch offer questions
- [ ] Meta tags and structured data updated
- [ ] Google Ads copy updated
- [ ] Mobile responsiveness verified
- [ ] Build passes (`npm run build`)
- [ ] Preview tested (`npm run preview`)
- [ ] Lighthouse score maintained (LCP < 2s)

### Launch Day

- [ ] Deploy to production
- [ ] Verify all pages render correctly
- [ ] Test form submission flow
- [ ] Check Google Search Console for errors
- [ ] Monitor Vercel Analytics
- [ ] Social media announcement (optional)

### Post-Launch Monitoring

- [ ] Daily: Form submissions
- [ ] Daily: Update scarcity counter if needed
- [ ] Weekly: Review analytics, plan A/B tests
- [ ] When 7 slots taken: Add "Kun 3 plasser igjen!" messaging
- [ ] When 10 slots taken: Switch to "Tilbudet er utsolgt" state

### When Offer Ends

- [ ] Revert to "ordinær pris" across all files
- [ ] Update meta tags to remove launch offer language
- [ ] Add testimonial/case study CTAs in place of scarcity counter
- [ ] Consider "notify me for future offers" capture

---

## Rollback Strategy

### If Conversion Drops

1. Check analytics for specific drop-off points
2. A/B test removing scarcity elements
3. Simplify messaging (may be too complex)
4. Revert to original pricing display as last resort

### If Customers Perceive as Scammy

1. Remove countdown timers/progress bars
2. Keep just the price reduction without urgency
3. Emphasize quality guarantee more
4. Add more social proof/testimonials

### Full Rollback Files

If complete rollback needed, these files contain launch offer code:

```
src/pages/tjenester/_sections/Pakker.astro
src/pages/nettside-for-bedrift/_sections/PricingSummary.astro
src/pages/nettside-for-bedrift/_sections/Hero.astro
src/pages/nettside-for-bedrift/_sections/FAQ.astro
src/pages/kontakt/_sections/ContactForm.tsx
src/pages/index.astro
src/pages/nettside-for-bedrift/index.astro
src/pages/tjenester/index.astro
src/layouts/BaseLayout.astro
src/layouts/LandingPageLayout.astro
```

---

## Summary

This implementation plan provides a psychologically-grounded, ethically-sound approach to launching a limited offer that:

1. **Increases conversion** through anchoring, scarcity, and FOMO
2. **Maintains trust** through honest, quantity-based limits
3. **Supports business goals** by acquiring customers while building portfolio
4. **Is reversible** with clear rollback paths

The key differentiator from typical "fake urgency" tactics is the genuine reasoning: you actually ARE building a portfolio, and the limit of 10 customers is real and trackable.

---

## Research Sources

### Pricing Psychology
- [Shopify: Price Anchoring](https://www.shopify.com/enterprise/blog/44331971-6-scientific-principles-of-persuasion-all-smart-ecommerce-founders-know)
- [Conversion.com: Pricing Psychology](https://conversion.com/blog/using-pricing-psychology/)
- [Clootrack: Psychological Pricing Strategies](https://www.clootrack.com/blogs/11-proven-psychological-pricing-strategies-examples-2024)
- [Voucherify: Strikethrough Pricing](https://www.voucherify.io/blog/strikethrough-pricing-why-a-single-line-still-drives-conversions)

### Scarcity & Urgency
- [Marketing Course: Behavioral Economics](https://marketingcourse.org/the-power-of-scarcity-and-urgency-behavioral-economics-in-marketing/)
- [CXL: Creating Urgency](https://cxl.com/blog/creating-urgency/)
- [Chris Koehl: Ethical Scarcity](https://chriskoehl.com/ethical-scarcity-and-urgency/)
- [Capital & Growth: Countdown Timer A/B Tests](https://capitalandgrowth.org/answers/2981186/Do-countdown-timers-increase-sales)

### Conversion Optimization
- [Rebelgrowth: Tripwire Offers](https://rebelgrowth.com/blog/tripwire-offers-the-ultimate-guide-to-rapid-customer-acquisition-2024-edition)
- [UserPilot: Pricing Page Best Practices](https://userpilot.com/blog/pricing-page-best-practices/)
- [HubSpot: Pricing Page Guide](https://blog.hubspot.com/marketing/best-practices-pricing-page)
