# Phase 8: Core Service Pages - Research

**Researched:** 2026-03-05
**Domain:** Astro static page authoring, conversion page structure, Norwegian copy
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Page structure order: Hero (outcome headline + price signal) → Hva er inkludert → FAQ → CTA
- Breadcrumbs already built into BaseLayout — use as-is
- CTA button links to `/kontakt?tjeneste=[slug]` (infrastructure already in place from Phase 6)
- One shared layout/template approach, different content per service
- "Hva er inkludert" must be tailored per service with service-specific items
- Common base (responsivt design, HTTPS, grunnleggende SEO, 30-dagers support) can appear on all, but each page also needs 3–4 service-specific items
- FAQ questions must be service-specific — not the generic ones on /tjenester
- Nettbutikk Shopify fee wording: "Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify"
- Shopify fee: inline note within the inkludert or pricing section — visible but not alarming
- No service-specific visual variation — consistent look across all service sub-pages

### Claude's Discretion

- Exact section layout and spacing within each section
- Shopify fee placement (pricing block vs inkludert list footnote)
- Number of FAQ items per page (3–6 is reasonable)
- Whether to include a short process/how-it-works step list (appropriate for nettbutikk given complexity)

### Deferred Ideas (OUT OF SCOPE)

- Cross-links between related service pages — Phase 10
- Service JSON-LD and FAQPage JSON-LD validation — Phase 10

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGES-01 | `/tjenester/nettside` — dedikert tjenesteside | Directory structure: `src/pages/tjenester/nettside/index.astro` + `_sections/` |
| PAGES-02 | `/tjenester/landingsside` — dedikert tjenesteside | Directory structure: `src/pages/tjenester/landingsside/index.astro` + `_sections/` |
| PAGES-03 | `/tjenester/nettbutikk` — dedikert tjenesteside (Shopify) | Same structure + Shopify fee note in inkludert section |
| CONTENT-01 | Hver side har struktur: hero → inkludert → FAQ → CTA-seksjon | Section order locked; each implemented as separate Astro section components |
| CONTENT-02 | All copy bruker outcome-first språk | Hero h1 pattern: benefit/outcome first, not feature list |
| CONTENT-03 | Hver side har minimum 500 ord med substansielt innhold | 3–4 inkludert items with real descriptions + 3–6 FAQ Q&A + hero copy = easily 500+ words |
| CONTENT-04 | Nettbutikk-siden adresserer Shopify-plattformavgifter transparent | Inline note in inkludert section: "Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify" |
| SEO-02 | Hver underside har unik meta-tittel og beskrivelse | Pass `title` + `description` props to BaseLayout per page |
| CTA-01 | Hver tjenesteside CTA lenker til `/kontakt?tjeneste=[slug]` | Already wired in Phase 6; just use correct slug in Button href |

</phase_requirements>

## Summary

Phase 8 is primarily a content and structure problem, not a technical one. All the infrastructure was built in Phases 6–7: the `?tjeneste=` pre-fill works, breadcrumbs auto-generate from pageLabels (already contains all 7 slugs), the sitemap auto-generates, and all UI primitives exist. The primary work is creating three new directory trees under `src/pages/tjenester/`, writing service-specific Norwegian content, and composing the four required sections per page.

The decision to use individual `index.astro` per service (not a dynamic `[slug].astro`) was locked in at v1.1 start — this is correct because the pages need structurally different sections (nettbutikk has a Shopify note, potentially a "how it works" step sequence). Each page gets its own `_sections/` directory with Hero, Inkludert, FAQ, and CTA components that hold service-specific content. The shared Section/SectionHeader/Card/Button UI primitives handle all layout and styling concerns.

The only non-trivial judgment call is Norwegian copy that is outcome-first (not feature/technology lists), and the Shopify fee placement for nettbutikk. Both are covered by the locked decisions in CONTEXT.md.

**Primary recommendation:** Build a Hero, Inkludert, FAQ, and CTA section per service. Reuse existing patterns directly — no new components needed at the page structure level. Invest time in outcome-focused copy.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (project) | Static page generation | Project baseline |
| Tailwind 4 | 4.x (project) | Utility CSS | Project baseline |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| services.ts | — | Data source for slug, name, priceRange, minPrice | Import in each page's index.astro for JSON-LD |
| Section.astro | — | Section wrapper with background/padding variants | Every section |
| SectionHeader.astro | — | h2 + optional subtitle with reveal-on-scroll | Every section header |
| Card.astro | — | Feature cards in inkludert grid | Inkludert section items |
| Button.astro | — | CTA button with href | CTA section |
| Breadcrumbs.astro | — | Breadcrumb nav (already wired in BaseLayout) | No action needed — auto-renders |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Individual index.astro per service | Dynamic [slug].astro | Dynamic route can't support structurally different sections per service — locked decision |
| Inline content objects | services.ts data | services.ts only has overview-level data (name, tagline, priceRange); page-specific inkludert items and FAQ questions must live in the section files themselves |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure

```
src/pages/tjenester/
├── index.astro                    (existing — service catalog overview)
├── _sections/                     (existing — FAQ, TjenesterOversikt, TjenesterCTA, etc.)
├── nettside/
│   ├── index.astro                (new — imports sections, sets meta title/description, JSON-LD)
│   └── _sections/
│       ├── Hero.astro             (new — outcome headline + price signal + breadcrumbs)
│       ├── Inkludert.astro        (new — service-specific checkmark grid)
│       ├── FAQ.astro              (new — service-specific Q&A + FAQPage JSON-LD inline)
│       └── CTA.astro              (new — /kontakt?tjeneste=nettside button)
├── nettbutikk/
│   ├── index.astro
│   └── _sections/
│       ├── Hero.astro
│       ├── Inkludert.astro        (+ Shopify fee note)
│       ├── HvordanFungerer.astro  (optional — step sequence for nettbutikk complexity)
│       ├── FAQ.astro
│       └── CTA.astro
└── landingsside/
    ├── index.astro
    └── _sections/
        ├── Hero.astro
        ├── Inkludert.astro
        ├── FAQ.astro
        └── CTA.astro
```

### Pattern 1: Page index.astro

Each `index.astro` sets meta, injects Service JSON-LD via `<Fragment slot="head">`, and composes sections. Mirrors existing `/tjenester/index.astro` exactly.

```astro
---
// Source: src/pages/tjenester/index.astro (existing)
import BaseLayout from '@/layouts/BaseLayout.astro';
import Hero from './_sections/Hero.astro';
import Inkludert from './_sections/Inkludert.astro';
import FAQ from './_sections/FAQ.astro';
import CTA from './_sections/CTA.astro';
import { services } from '@/config/services';

const service = services.find(s => s.slug === 'nettside')!;
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Nettup ${service.name}`,
  "description": service.description,
  "provider": { "@type": "Organization", "name": "Nettup", "url": "https://nettup.no" },
  "areaServed": { "@type": "Country", "name": "Norway" },
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": service.minPrice,
      ...(service.maxPrice > 0 ? { "maxPrice": service.maxPrice } : {}),
      "priceCurrency": "NOK"
    }
  }
};
---

<BaseLayout
  title="Nettside for bedrift | Profesjonell og rask | Nettup"
  description="Vi leverer skreddersydde nettsider fra 15 000 kr. Responsivt design, rask lasting og grunnleggende SEO inkludert. Klar på 1–3 uker."
>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
  </Fragment>
  <main>
    <Hero />
    <Inkludert />
    <FAQ />
    <CTA />
  </main>
</BaseLayout>
```

### Pattern 2: Hero section with price signal

Hero sections on service sub-pages are lighter than homepage hero — no animation island needed. Use `animate-fade-up` CSS class directly (same as om-oss Hero), or simpler: just `reveal-on-scroll`. Include breadcrumbs above the h1.

```astro
---
// Pattern: service hero with price signal above the fold
import Breadcrumbs from '@/components/ui/Breadcrumbs.astro';
---

<section class="bg-surface py-24 pt-32 md:py-32 md:pt-40">
  <div class="container mx-auto max-w-4xl px-4">
    <Breadcrumbs items={[
      { label: 'Hjem', href: '/' },
      { label: 'Tjenester', href: '/tjenester' },
      { label: 'Nettside' }
    ]} />
    <h1 class="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
      En nettside som jobber for deg — ikke bare ser bra ut
    </h1>
    <p class="animate-fade-up mt-6 text-lg text-text-muted md:text-xl" style="animation-delay: 100ms">
      Vi leverer skreddersydde nettsider som presenterer bedriften din profesjonelt og gjør det enkelt for besøkende å ta kontakt.
    </p>
    <p class="animate-fade-up mt-4 text-xl font-semibold text-brand" style="animation-delay: 150ms">
      fra 15 000 kr
    </p>
    <div class="animate-fade-up mt-8" style="animation-delay: 200ms">
      <Button href="/kontakt?tjeneste=nettside" size="lg">Få et tilbud</Button>
    </div>
  </div>
</section>
```

### Pattern 3: Inkludert section (checkmark grid)

Mirrors `src/pages/tjenester/_sections/Inkludert.astro` — copy the structure, replace the hardcoded `features` array with service-specific items. For nettbutikk, add a footnote below the grid for the Shopify fee.

```astro
---
// Based on: src/pages/tjenester/_sections/Inkludert.astro
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';

const features = [
  { title: 'Responsivt design', description: 'Ser bra ut på mobil, tablet og desktop.' },
  { title: 'Kontaktskjema', description: 'Enkelt for kunder å ta kontakt med deg.' },
  { title: 'Grunnleggende SEO', description: 'Optimalisert for søkemotorer fra dag én.' },
  { title: 'HTTPS/SSL', description: 'Sikker tilkobling inkludert.' },
  { title: 'Hosting', description: 'Rask og sikker hosting på våre servere.' },
  { title: '30 dagers support', description: 'Vi er tilgjengelige etter levering.' },
];
---

<Section background="raised">
  <SectionHeader title="Hva er inkludert" subtitle="Alt du trenger fra dag én." />
  <div class="mx-auto max-w-4xl">
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {features.map((feature, index) => (
        <div class={`reveal-on-scroll delay-${(index % 3) + 1}`}>
          <div class="flex items-start gap-3">
            <svg ...checkmark... class="h-5 w-5 shrink-0 text-brand" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            <div>
              <h3 class="font-semibold">{feature.title}</h3>
              <p class="mt-1 text-sm text-text-muted">{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <!-- Nettbutikk only: Shopify note below the grid -->
    <!-- <p class="mt-6 text-sm text-text-muted">* Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify.</p> -->
  </div>
</Section>
```

### Pattern 4: FAQ section with inline FAQPage JSON-LD

Mirrors `src/pages/tjenester/_sections/FAQ.astro` exactly. The inline `<script is:inline type="application/ld+json">` pattern is already established. Each service page gets its own FAQPage JSON-LD with service-specific questions.

```astro
---
// Based on: src/pages/tjenester/_sections/FAQ.astro
const faqs = [
  { question: 'Hva er prosessen for å lage en nettside?', answer: '...' },
  // 3–5 more service-specific questions
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
};
---

<script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />

<Section>
  <SectionHeader title="Vanlige spørsmål" />
  <div class="mx-auto max-w-3xl">
    <div class="divide-y divide-white/10">
      {faqs.map((faq) => (
        <div class="reveal-on-scroll py-6 first:pt-0 last:pb-0">
          <h3 class="font-semibold">{faq.question}</h3>
          <p class="mt-2 text-text-muted">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
</Section>
```

### Pattern 5: Service CTA with pre-filled slug

The shared `CTA.astro` (`src/components/sections/CTA.astro`) uses a generic `/kontakt` href. For service pages, create a local CTA section (or pass a prop) that uses `/kontakt?tjeneste=[slug]`. A local `_sections/CTA.astro` per service is simpler than modifying the shared component.

```astro
---
// Local CTA for /tjenester/nettside
import Section from '@/components/ui/Section.astro';
import Button from '@/components/ui/Button.astro';
---

<Section background="raised">
  <div class="reveal-on-scroll mx-auto max-w-2xl text-center">
    <h2 class="text-3xl font-bold md:text-4xl">
      Klar for en nettside som faktisk konverterer?
    </h2>
    <p class="mt-4 text-lg text-text-muted">
      Ta kontakt for en uforpliktende prat. Vi svarer innen 24 timer.
    </p>
    <div class="mt-8">
      <Button href="/kontakt?tjeneste=nettside" size="lg">Få et gratis tilbud</Button>
    </div>
  </div>
</Section>
```

### Anti-Patterns to Avoid

- **Using shared CTA.astro without slug:** The shared `src/components/sections/CTA.astro` hardcodes `/kontakt` with no tjeneste param. Create local CTA sections per service — don't patch the shared component.
- **Content from services.ts for section content:** `services.ts` only has `tagline` and `description` (overview-level). Inkludert items and FAQ questions must be authored directly in section files. Do not try to drive them from the config.
- **Putting JSON-LD for FAQPage inside index.astro:** The FAQ section file already owns its FAQPage JSON-LD via inline script (see existing FAQ.astro pattern). Keep it colocated in the FAQ section file.
- **Skipping animate-fade-up on above-fold hero content:** Hero content (h1, subtitle, price) should use `animate-fade-up` (CSS animation that runs on load). Below-fold sections use `reveal-on-scroll`. Do not use `reveal-on-scroll` on the hero h1 — it will flash invisible.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section layout and padding | Custom section divs | Section.astro with `background`, `padding` props | Already handles raised/default, rounded corners, container sizing |
| Section headers | Custom h2 + subtitle | SectionHeader.astro | Already has `reveal-on-scroll` + `delay-1` on subtitle |
| Checkmark icon | Inline SVG copy-paste | Copy exact path from existing Inkludert.astro | `d="m4.5 12.75 6 6 9-13.5"` — already in codebase |
| FAQ accordion/expand | JS-driven collapsible | Static Q&A list (existing pattern) | Not required; static is simpler and loads faster |
| Sitemap entry | Manual sitemap.xml | @astrojs/sitemap (already configured) | Auto-generates on build — no action needed |
| Breadcrumb trail | Custom nav | Breadcrumbs.astro | Already built; pass items array |
| tjeneste pre-fill | Custom form wiring | `/kontakt?tjeneste=[slug]` URL param | Already handled in ContactForm.tsx |

**Key insight:** This phase is 90% content authoring. Every technical pattern already exists in the codebase. The risk is in writing thin content (< 500 words) or generic/feature-first copy, not in technical implementation.

## Common Pitfalls

### Pitfall 1: Thin content / word count under 500
**What goes wrong:** A hero + 6 checkmarks + 3 FAQs may fall under 500 words if descriptions are terse.
**Why it happens:** Bullet-point thinking; each item gets a single line.
**How to avoid:** Write full sentences in FAQ answers (2–4 sentences each). Make inkludert descriptions explanatory, not just labels. Add context in the hero subtitle.
**Warning signs:** FAQ answers under 20 words each; inkludert descriptions are single phrases.

### Pitfall 2: Generic/feature-first copy violating CONTENT-02
**What goes wrong:** "Responsivt design og HTTPS inkludert" as a headline. This is feature language, not outcome language.
**Why it happens:** Easier to list features than articulate outcomes.
**How to avoid:** Hero h1 pattern = "[outcome for the customer]", not "[feature we deliver]". Example: "En nettside som jobber for deg" vs "Profesjonell nettside med responsivt design".
**Warning signs:** H1 starts with "Vi leverer" or "Profesjonell [noun]".

### Pitfall 3: FAQ overlap with /tjenester FAQ
**What goes wrong:** Copying generic FAQs from `src/pages/tjenester/_sections/FAQ.astro` (questions like "Hva er inkludert i alle oppdrag?" — already on overview page).
**Why it happens:** Easiest to reuse existing content.
**How to avoid:** Service FAQs must be service-specific. For nettside: "Kan jeg oppdatere innholdet selv?", "Hva om jeg allerede har et domene?", "Inkluderer dere bilder og tekst?". These should NOT appear verbatim on /tjenester.
**Warning signs:** Question text matches any of the 6 existing FAQ items on /tjenester.

### Pitfall 4: Using reveal-on-scroll on hero h1
**What goes wrong:** Hero h1 starts invisible and stays invisible until user scrolls (observer fires on scroll, not on load — though BaseLayout uses `astro:page-load`).
**Why it happens:** Applying the same class pattern from section items to hero content.
**How to avoid:** Hero content (h1, first paragraph, price signal, CTA button) use `animate-fade-up` CSS class with `animation-delay`. Only below-fold content uses `reveal-on-scroll`.
**Warning signs:** Hero h1 has class `reveal-on-scroll`.

### Pitfall 5: Shopify fee buried or alarming
**What goes wrong:** Either hidden in footer-level fine print (deceptive) or headlined as "VIKTIG: Shopify faktureres separat" (alarming).
**Why it happens:** Overcorrecting in one direction.
**How to avoid:** Place as a small note below or after the inkludert grid. Wording locked: "Shopify lisens (fra 299 kr/mnd) faktureres separat av Shopify." Render as `text-sm text-text-muted`.

## Code Examples

### Verified patterns from existing codebase

#### Service JSON-LD with PriceSpecification (maxPrice: 0 handling)
```astro
// Source: src/pages/tjenester/index.astro
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Nettup ${service.name}`,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "Nettup",
    "url": "https://nettup.no"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Norway"
  },
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": service.minPrice,
      ...(service.maxPrice > 0 ? { "maxPrice": service.maxPrice } : {}),
      "priceCurrency": "NOK"
    }
  }
};
```

#### Inline FAQPage JSON-LD
```astro
// Source: src/pages/tjenester/_sections/FAQ.astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

#### Section with raised background
```astro
// Source: src/pages/tjenester/_sections/Inkludert.astro
<Section background="raised">
  <SectionHeader title="Hva er inkludert" subtitle="..." />
  ...
</Section>
```

#### reveal-on-scroll with delay stagger
```astro
// Source: src/pages/tjenester/_sections/Inkludert.astro
<div class={`reveal-on-scroll delay-${(index % 3) + 1}`}>
```
Tailwind delay-1, delay-2, delay-3 are built-in (delay-100ms, delay-200ms, delay-300ms).

#### animate-fade-up for above-fold content
```html
// Source: src/pages/om-oss/_sections/Hero.astro
<h1 class="font-display animate-fade-up text-4xl font-bold ...">...</h1>
<p class="animate-fade-up mt-6 ..." style="animation-delay: 100ms">...</p>
```
`animate-fade-up` is a CSS animation defined in global.css — runs on load, no JS required.

## Content Guide

### Nettside — suggested inkludert items
Common base (all services): Responsivt design, HTTPS/SSL, Grunnleggende SEO, 30 dagers support
Nettside-specific: Kontaktskjema, Hosting, Skreddersydd design, CMS (valgfritt)

### Nettbutikk — suggested inkludert items
Common base + Shopify note
Nettbutikk-specific: Produktkatalog, Handlekurv og checkout, Betalingsløsning (Vipps/kort), Lagerstyring, Ordrehåndtering

### Landingsside — suggested inkludert items
Common base
Landingsside-specific: Konverteringsfokusert layout, A/B-klar struktur, Hurtig lasting (under 1s), Integrasjon med annonsekampanje, Enkelt kontaktskjema eller lead-capture

### FAQ topic buckets per service

**Nettside:**
- Kan jeg oppdatere innholdet selv etter levering?
- Inkluderer dere tekst og bilder?
- Hva om jeg allerede har et domene og hosting?
- Hva skjer etter 30 dagers support?
- Kan jeg legge til sider eller funksjoner senere?

**Nettbutikk:**
- Hva er Shopify, og hvorfor bruker dere det?
- Hva koster Shopify-lisensen?
- Kan jeg ha Vipps og kortbetaling?
- Hjelper dere med å legge inn produkter?
- Kan jeg koble nettbutikken til mitt lagersystem?

**Landingsside:**
- Hva skiller en landingsside fra en vanlig nettside?
- Kan jeg bruke den til Google Ads-kampanjer?
- Kan jeg teste ulike versjoner (A/B-testing)?
- Inkluderer dere integrasjon med e-postlister eller CRM?
- Kan jeg spore konverteringer?

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Generic `[slug].astro` dynamic route | Individual `index.astro` per service | Structurally different sections per service; locked at v1.1 start |
| `?pakke=` query param | `?tjeneste=` query param | Phase 6 complete; ContactForm.tsx already handles this |
| Single combined Inkludert for all services | Per-service Inkludert with tailored items | Phase 8 requirement; each page gets its own section file |

## Open Questions

1. **Nettbutikk "Slik fungerer det" step sequence**
   - What we know: CONTEXT.md marks this as Claude's discretion; nettbutikk has higher price and complexity
   - What's unclear: Whether a 3-step process sequence adds enough value to justify an extra section
   - Recommendation: Include it for nettbutikk (priced at 25 000 kr+, buyers need more justification). Keep it simple — 3 steps: "Vi setter opp butikken → Legger inn produkter og betaling → Tester og leverer". Implement as a simple numbered list within or below the inkludert section, not as a separate section component.

2. **Shopify fee figure accuracy**
   - What we know: STATE.md has a pending todo: "Verify Shopify platform fee figure before publishing on nettbutikk page"
   - What's unclear: Whether 299 kr/mnd is still the current Shopify Basic plan price in NOK
   - Recommendation: Use "fra 299 kr/mnd" as a lower-bound qualifier. The word "fra" protects against outdated figures. Content owner should verify before deploy.

## Sources

### Primary (HIGH confidence)
- Codebase read — `src/config/services.ts`, `src/pages/tjenester/index.astro`, `src/pages/tjenester/_sections/*.astro`, `src/components/ui/*.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` — direct inspection of all referenced patterns
- `.planning/phases/08-core-service-pages/08-CONTEXT.md` — locked decisions and code context
- `.planning/REQUIREMENTS.md` — requirement definitions

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — accumulated decisions from previous phases

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools already in codebase, confirmed by direct inspection
- Architecture: HIGH — mirrors existing established patterns, no new patterns required
- Pitfalls: HIGH — identified from direct analysis of existing code and content requirements
- Content guide: MEDIUM — service items are editorial recommendations, not technical facts; Shopify fee figure needs verification

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable stack; content is evergreen)
