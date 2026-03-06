# Phase 9: Specialist Service Pages - Research

**Researched:** 2026-03-05
**Domain:** Astro static page authoring, Norwegian conversion copy, services.ts schema extension
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- All 4 pages follow the same base pattern as Phase 8: `index.astro` + `_sections/` folder with Hero, Inkludert, FAQ, CTA
- Webapp gets an **additional Prosess section** inserted between Hero and Inkludert — no other pages get this
- Webapp Prosess section: new `Prosess.astro` component in webapp's `_sections/`, 4 steps: Kartlegging → Prototyp → Bygging → Lansering
- Webapp Hero must mention ROI or tidsbesparelse concretely (e.g., "spar X timer per uke" or "lønn seg på 6 måneder")
- Webapp Inkludert: lists deliverables (what's included), same pattern as nettside-siden
- Webapp target audience: both SMB and medium-sized businesses — broad framing
- AI GDPR content: integrated into the **main FAQ section** (not a separate section)
- AI GDPR FAQ answer: "Vi velger GDPR-vennlige verktøy og hjelper med databehandleravtale (DPA) — kunden gjør sine egne vurderinger"
- AI use cases: chatbot/kundestøtte-automatisering, dokumentbehandling og oppsummering, integrasjoner mellom systemer via AI
- AI USP vs. no-code: skreddersydd løsning — ingen caps, ingen begrensninger i scale, håndterer kompleks logikk
- SEO USP: konkurransedyktig pris + rask + **moderne SEO OG GEO** (Generative Engine Optimization)
- SEO GEO: nevnes eksplisitt som differensiator, nevn LLM-er (ChatGPT, Perplexity) ved navn
- SEO Inkludert: hva som leveres **hver måned** (månedlige leveranser, ikke utfall over tid)
- SEO CTA: "Start med en gratis gjennomgang"
- Vedlikehold positioning: obligatorisk for alle Nettup-prosjekter — forklarer hva alle Nettup-kunder får
- Vedlikehold audience: potensielle kunder som vil forstå løpende kostnad
- Vedlikehold CTA: "Start med en gratis gjennomgang"
- Vedlikehold: ikke eksplisitt upsell-side — gir trygghet om løpende drift
- **Månedlig pris**: alle 4 sider viser månedlig vedlikeholdsavgift eksplisitt — not hidden in FAQ
  - webapp: fra 2 500 kr/mnd
  - seo: fra 3 000 kr/mnd (allerede i services.ts som `priceRange` — dette er månedlig tjenestepris)
  - ai: fra 1 000 kr/mnd
  - vedlikehold: fra 1 500 kr/mnd (allerede i services.ts som `priceRange`)
- `services.ts` must be extended with `monthlyPrice: number` and `monthlyPriceLabel: string` fields on Service interface
- Hero.astro for each page: vis månedlig pris under enhetspris (same `text-brand` style)
- CTA variants:
  - Webapp + AI: "Få et gratis tilbud" (one-time project)
  - SEO + vedlikehold: "Start med en gratis gjennomgang" (ongoing services)
- All CTAs pre-fill `?tjeneste=` param (existing infrastructure from Phase 6)

### Claude's Discretion

- Exact wording of the ROI argument in webapp Hero
- Number and order of Inkludert items per page
- Exact FAQ content beyond the defined GDPR questions
- Spacing, typography, and animation delays (follow Phase 8 pattern)

### Deferred Ideas (OUT OF SCOPE)

- Phase 8 pages (nettside, nettbutikk, landingsside) are also missing monthly price — deferred to Phase 10 or separate mini-task
- Monthly prices for nettside, nettbutikk, landingsside not defined — to be clarified in a future phase

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGES-04 | `/tjenester/webapp` — dedikert tjenesteside | Directory structure: `src/pages/tjenester/webapp/index.astro` + `_sections/` with Hero, Prosess (unique to webapp), Inkludert, FAQ, CTA |
| PAGES-05 | `/tjenester/seo` — dedikert tjenesteside | Standard Hero → Inkludert → FAQ → CTA; Inkludert lists monthly deliverables; GEO differentiator in copy |
| PAGES-06 | `/tjenester/ai` — dedikert tjenesteside | Standard Hero → Inkludert → FAQ → CTA; GDPR/personvern FAQ item integrated into main FAQ section |
| PAGES-07 | `/tjenester/vedlikehold` — dedikert tjenesteside | Standard Hero → Inkludert → FAQ → CTA; positioned as "what your ongoing cost covers", not upsell |

</phase_requirements>

## Summary

Phase 9 is structurally identical to Phase 8 — all technical patterns are already established and verified in the codebase. The primary work is creating four new directory trees under `src/pages/tjenester/`, writing service-specific Norwegian content, and composing the required sections per page. The only new technical work is: (1) extending `services.ts` with `monthlyPrice` and `monthlyPriceLabel` fields, and (2) adding a new `Prosess.astro` section component in the webapp directory (4-step numbered list pattern, reusing the established step sequence pattern from nettbutikk's Inkludert.astro).

All infrastructure is already in place: BaseLayout `pageLabels` already maps all four new slugs (`/tjenester/webapp`, `/tjenester/seo`, `/tjenester/ai`, `/tjenester/vedlikehold`) to their Norwegian labels. The `?tjeneste=` pre-fill is wired. Sitemap auto-generates. All UI primitives (Section, SectionHeader, Button, Breadcrumbs) are battle-tested from Phase 8.

The primary judgment calls are content-level: the webapp ROI argument (outcome-first with concrete time/money savings), the SEO GEO differentiator narrative (position LLM-based search as a real channel Norwegian businesses need to care about), the AI GDPR FAQ framing (honest without being alarming), and the vedlikehold "reassurance, not sales" tone.

**Primary recommendation:** Mirror Phase 8 execution exactly. One new data change (services.ts), one new section component type (Prosess.astro for webapp), four sets of content files. Plan as 5 tasks split across 2 waves: services.ts update first (dependency for monthlyPrice display), then four pages in parallel.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (project) | Static page generation | Project baseline |
| Tailwind 4 | 4.x (project) | Utility CSS | Project baseline |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| services.ts | — | Data source for slug, name, priceRange, minPrice, monthlyPrice (new) | Import in each page's index.astro for Service JSON-LD and Hero price display |
| Section.astro | — | Section wrapper with background/padding variants | Every section |
| SectionHeader.astro | — | h2 + optional subtitle with reveal-on-scroll | Every section header |
| Button.astro | — | CTA button with href | CTA section |
| Breadcrumbs.astro | — | Breadcrumb nav | Hero sections |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure

```
src/pages/tjenester/
├── webapp/
│   ├── index.astro                 (new — meta, Service JSON-LD, section composition)
│   └── _sections/
│       ├── Hero.astro              (new — outcome headline + price signal + breadcrumbs)
│       ├── Prosess.astro           (new — 4-step process: Kartlegging → Prototyp → Bygging → Lansering)
│       ├── Inkludert.astro         (new — deliverables checkmark grid)
│       ├── FAQ.astro               (new — service-specific Q&A + FAQPage JSON-LD)
│       └── CTA.astro               (new — "Få et gratis tilbud" → /kontakt?tjeneste=webapp)
├── seo/
│   ├── index.astro
│   └── _sections/
│       ├── Hero.astro              (new — outcome headline + monthly price signal)
│       ├── Inkludert.astro         (new — monthly deliverables list, not outcomes over time)
│       ├── FAQ.astro               (new — GEO explanation + service-specific Q&A)
│       └── CTA.astro               (new — "Start med en gratis gjennomgang")
├── ai/
│   ├── index.astro
│   └── _sections/
│       ├── Hero.astro              (new — automation outcome headline)
│       ├── Inkludert.astro         (new — 3 use case categories + deliverables)
│       ├── FAQ.astro               (new — GDPR question integrated + service-specific Q&A)
│       └── CTA.astro               (new — "Få et gratis tilbud")
└── vedlikehold/
    ├── index.astro
    └── _sections/
        ├── Hero.astro              (new — "vi tar ansvar" reassurance framing)
        ├── Inkludert.astro         (new — what every Nettup customer's monthly fee covers)
        ├── FAQ.astro               (new — what's included, response times, upgrade Q&A)
        └── CTA.astro               (new — "Start med en gratis gjennomgang")
```

### Pattern 1: services.ts Extension (PREREQUISITE)

The `monthlyPrice` and `monthlyPriceLabel` fields must be added to the Service interface before any page can display the monthly price.

```typescript
// Source: src/config/services.ts (current interface)
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  // NEW fields:
  monthlyPrice?: number;       // e.g. 2500
  monthlyPriceLabel?: string;  // e.g. 'fra 2 500 kr/mnd'
}
```

The four Phase 9 services need these values:
- `webapp`: `monthlyPrice: 2500`, `monthlyPriceLabel: 'fra 2 500 kr/mnd'`
- `seo`: NOTE — `seo` already has `priceRange: 'fra 3 000 kr/mnd'` (this IS the monthly service price). `monthlyPrice: 3000`, `monthlyPriceLabel: 'fra 3 000 kr/mnd'`
- `ai`: `monthlyPrice: 1000`, `monthlyPriceLabel: 'fra 1 000 kr/mnd'`
- `vedlikehold`: NOTE — `vedlikehold` already has `priceRange: 'fra 1 500 kr/mnd'` (this IS the monthly price). `monthlyPrice: 1500`, `monthlyPriceLabel: 'fra 1 500 kr/mnd'`

Phase 8 services (nettside, nettbutikk, landingsside) get `monthlyPrice` fields added as undefined (deferred to Phase 10).

### Pattern 2: Hero with Monthly Price Signal

The Phase 8 Hero pattern shows only the one-time price. Phase 9 Heroes must show both the one-time project price (for webapp/ai) OR the monthly price for ongoing services (seo/vedlikehold), plus the monthly maintenance fee where applicable.

For webapp (one-time project + monthly maintenance):
```astro
---
import Breadcrumbs from '@/components/ui/Breadcrumbs.astro';
import Button from '@/components/ui/Button.astro';
---

<section class="bg-surface py-24 pt-32 md:py-32 md:pt-40">
  <div class="container mx-auto max-w-4xl px-4">
    <Breadcrumbs items={[
      { label: 'Hjem', href: '/' },
      { label: 'Tjenester', href: '/tjenester' },
      { label: 'Webapp' },
    ]} />
    <h1 class="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
      [Outcome headline with ROI — e.g., "Spar 10 timer per uke med en webapp som gjør jobben for deg"]
    </h1>
    <p class="animate-fade-up mt-6 text-lg text-text-muted md:text-xl" style="animation-delay: 100ms">
      [Supporting description]
    </p>
    <p class="animate-fade-up mt-4 text-xl font-semibold text-brand" style="animation-delay: 150ms">
      fra 40 000 kr
    </p>
    <p class="animate-fade-up mt-2 text-base text-text-muted" style="animation-delay: 175ms">
      + fra 2 500 kr/mnd vedlikehold
    </p>
    <div class="animate-fade-up mt-8" style="animation-delay: 200ms">
      <Button href="/kontakt?tjeneste=webapp" size="lg">Få et gratis tilbud</Button>
    </div>
  </div>
</section>
```

For seo/vedlikehold (monthly-only services), the `priceRange` from services.ts already is the monthly price. Show it as the primary price signal (no "+" notation needed).

### Pattern 3: Prosess Section (webapp only)

The webapp page is the only page with an additional `Prosess.astro` section. This mirrors the numbered step list pattern already used in nettbutikk's `Inkludert.astro` — use the same HTML structure with `bg-brand` circle number badges.

```astro
---
// src/pages/tjenester/webapp/_sections/Prosess.astro
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';

const steps = [
  {
    number: 1,
    title: 'Kartlegging',
    description: 'Vi går gjennom behovene dine i detalj — hvilke prosesser skal automatiseres, hvem bruker appen, og hva er suksess?',
  },
  {
    number: 2,
    title: 'Prototyp',
    description: 'Du ser og godkjenner et klikkbart utkast før én linje kode skrives. Ingen overraskelser ved levering.',
  },
  {
    number: 3,
    title: 'Bygging',
    description: 'Vi bygger løsningen i iterasjoner og holder deg oppdatert underveis. Du kan justere kursen.',
  },
  {
    number: 4,
    title: 'Lansering',
    description: 'Vi setter applikasjonen i produksjon, opplærer brukerne og er tilgjengelige for spørsmål etter lansering.',
  },
];
---

<Section>
  <SectionHeader title="Slik fungerer det" subtitle="Fire trinn fra idé til ferdig løsning." />
  <div class="mx-auto max-w-3xl">
    <ol class="space-y-6">
      {steps.map((step) => (
        <li class="reveal-on-scroll flex items-start gap-4">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-surface">
            {step.number}
          </span>
          <div>
            <p class="font-semibold">{step.title}</p>
            <p class="mt-1 text-text-muted">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
</Section>
```

### Pattern 4: index.astro with monthlyPrice in Service JSON-LD

For pages where a monthly price exists, the Service JSON-LD `priceSpecification` can be enhanced. However, since `@type: PriceSpecification` does not natively distinguish between one-time and monthly, the safest approach is to keep the existing Service JSON-LD pattern unchanged (using `minPrice` from services.ts) and display the monthly price visually in the Hero. This is consistent with Phase 8.

```astro
---
// Pattern unchanged from Phase 8 — no JSON-LD modification needed
import BaseLayout from '@/layouts/BaseLayout.astro';
import { services } from '@/config/services';
import Hero from './_sections/Hero.astro';
import Prosess from './_sections/Prosess.astro';
import Inkludert from './_sections/Inkludert.astro';
import FAQ from './_sections/FAQ.astro';
import CTA from './_sections/CTA.astro';

const service = services.find(s => s.slug === 'webapp')!;

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
  title="Webapp for bedrift | Skreddersydd nettapplikasjon | Nettup"
  description="Vi utvikler webapplikasjoner som løser konkrete problemer i virksomheten din. Fra 40 000 kr. Kartlegging, prototyp, bygging og lansering."
>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
  </Fragment>
  <main>
    <Hero />
    <Prosess />
    <Inkludert />
    <FAQ />
    <CTA />
  </main>
</BaseLayout>
```

### Anti-Patterns to Avoid

- **Putting GDPR in a separate section on AI page:** CONTEXT.md locks this as FAQ-integrated. Do not add a `GDPR.astro` or `Personvern.astro` section component.
- **Using "Få et gratis tilbud" for SEO or vedlikehold CTAs:** These are ongoing services; the locked CTA text is "Start med en gratis gjennomgang".
- **Omitting monthlyPrice display:** The monthly fee must be visible in the Hero, not buried in FAQ. CONTEXT.md: "Månedlig pris må vises tydelig på alle sider — ikke skjult i FAQ".
- **reveal-on-scroll on hero h1:** Same pitfall as Phase 8 — hero content uses `animate-fade-up`, not `reveal-on-scroll`.
- **Feature-first copy:** Especially dangerous for webapp and AI where technical terms are tempting. H1s must be outcome-focused.
- **Generic FAQ questions duplicating /tjenester FAQ:** All FAQ questions must be service-specific.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section layout | Custom div wrappers | Section.astro | Handles raised/default, container, padding consistently |
| Section headers | Custom h2 + subtitle | SectionHeader.astro | Has built-in reveal-on-scroll + delay-1 on subtitle |
| Step sequence | Custom numbered list | Numbered `<ol>` with `bg-brand` circle spans | Already proven in nettbutikk Inkludert.astro |
| Checkmark icon | New SVG | Copy exact path `d="m4.5 12.75 6 6 9-13.5"` | Already in every Inkludert.astro in codebase |
| Breadcrumbs | Custom nav | Breadcrumbs.astro | Already built; pass items array |
| Sitemap entry | Manual | @astrojs/sitemap (configured) | Auto-generates on build |
| FAQ accordion | JS collapsible | Static Q&A list | Consistent with all Phase 8 pages |
| tjeneste pre-fill | Custom form wiring | `/kontakt?tjeneste=[slug]` | Already handled in ContactForm.tsx |

**Key insight:** Phase 9 is 85% content authoring, 10% copy-paste pattern application, 5% new structure (services.ts extension + Prosess.astro). The primary risk is thin content or feature-first copy, not technical implementation.

## Common Pitfalls

### Pitfall 1: AI page GDPR framing too alarming or too dismissive
**What goes wrong:** Either "Vi kan ikke garantere GDPR-compliance" (alarming) or ignoring GDPR entirely (trust issue).
**Why it happens:** GDPR is genuinely complex; easy to overcorrect.
**How to avoid:** Use the locked framing: "Vi velger GDPR-vennlige verktøy og hjelper med databehandleravtale (DPA) — kunden gjør sine egne vurderinger." Reassuring, honest, positions Nettup as helpful partner, not guarantor.
**Warning signs:** Answer contains "kan ikke garantere" or the GDPR question is absent from FAQ.

### Pitfall 2: SEO page ignores GEO — the core differentiator
**What goes wrong:** The page reads like any other SEO agency (keywords, backlinks, technical SEO) and GEO is mentioned as an afterthought.
**Why it happens:** Familiar SEO content is easier to write than explaining a newer concept.
**How to avoid:** GEO (Generative Engine Optimization) should appear in the Hero or Inkludert section with a clear explanation. Name-drop ChatGPT and Perplexity explicitly — these are the specifics that make it concrete for a business owner.
**Warning signs:** "GEO" or "ChatGPT" or "Perplexity" not found in page copy.

### Pitfall 3: Vedlikehold page reads as upsell
**What goes wrong:** "Oppgrader til Pro-pakke!" framing. The page becomes a sales pitch for add-ons instead of a reassurance document.
**Why it happens:** Natural tendency to upsell on the cheapest plan page.
**How to avoid:** Focus on "hva som dekkes av din månedlige avtale" — what the customer already gets. The CTA is "Start med en gratis gjennomgang", not "Oppgrader".
**Warning signs:** Mentions pricing tiers, upgrades, or add-ons prominently.

### Pitfall 4: Webapp copy is too technical
**What goes wrong:** Hero mentions "API-integrasjoner", "CI/CD-pipeline", "React" — loses the business owner audience.
**Why it happens:** Webapp is genuinely technical; easy to slip into developer-speak.
**How to avoid:** Primary copy must use business outcomes. Technical capabilities belong in FAQ answers if a prospect explicitly asks. The locked hero direction is ROI/tidsbesparelse (e.g., "spar X timer per uke").
**Warning signs:** H1 or first paragraph contains "API", "database", "React", "deploy", "CI/CD".

### Pitfall 5: Monthly price missing or hidden
**What goes wrong:** Monthly fee mentioned only once in FAQ ("ja, vedlikehold koster ekstra"), not in Hero.
**Why it happens:** Reluctance to highlight ongoing costs above the fold.
**How to avoid:** Monthly fee shows in Hero below the one-time price (for webapp/ai) or as the primary price signal (for seo/vedlikehold). CONTEXT.md explicitly states "ikke skjult i FAQ".
**Warning signs:** Monthly price not present in Hero.astro.

### Pitfall 6: Thin content below 500 words
**What goes wrong:** Short inkludert descriptions + brief FAQ answers = under 500 words total.
**Why it happens:** Bullet-point thinking; efficiency over substance.
**How to avoid:** FAQ answers should be 2–4 sentences each. Inkludert items need explanatory descriptions, not just labels. Hero subtitle adds body.
**Warning signs:** FAQ answers under 20 words; inkludert descriptions are single phrases.

## Code Examples

### services.ts Interface Extension

```typescript
// Source: src/config/services.ts (current + new fields)
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  monthlyPrice?: number;       // Monthly maintenance/service price in NOK
  monthlyPriceLabel?: string;  // Display string, e.g. 'fra 2 500 kr/mnd'
}
```

### Prosess Section Numbered Step Pattern

```astro
// Source: based on nettbutikk Inkludert.astro step sequence (verified in codebase)
<li class="reveal-on-scroll flex items-start gap-4">
  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-surface">
    {step.number}
  </span>
  <div>
    <p class="font-semibold">{step.title}</p>
    <p class="mt-1 text-text-muted">{step.description}</p>
  </div>
</li>
```

### Hero Monthly Price Display (below one-time price)

```astro
// New pattern for Phase 9 — webapp/ai showing both prices
<p class="animate-fade-up mt-4 text-xl font-semibold text-brand" style="animation-delay: 150ms">
  fra 40 000 kr
</p>
<p class="animate-fade-up mt-2 text-base text-text-muted" style="animation-delay: 175ms">
  + fra 2 500 kr/mnd vedlikehold
</p>
```

### CTA Variant for Ongoing Services (SEO + Vedlikehold)

```astro
// CTA button text differs from Phase 8 — "Start med en gratis gjennomgang"
<Button href="/kontakt?tjeneste=seo" size="lg">Start med en gratis gjennomgang</Button>
```

### Service JSON-LD (unchanged from Phase 8 pattern)

```astro
// Source: src/pages/tjenester/nettside/index.astro (Phase 8 — verified)
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
// Inject: <Fragment slot="head"><script type="application/ld+json" set:html={JSON.stringify(serviceSchema)} /></Fragment>
```

### FAQPage JSON-LD (co-located in FAQ.astro)

```astro
// Source: src/pages/tjenester/nettside/_sections/FAQ.astro (Phase 8 — verified)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
};
// ...
<script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

## Content Guide

### Webapp

**Hero angle:** ROI / tidsbesparelse — "spar X timer per uke" or "lønn seg på 6 måneder"

**Inkludert items (deliverables):**
- Behovsanalyse og prototyp
- Skreddersydd løsning (ingen mal-begrensninger)
- Brukertesting før lansering
- Responsivt design
- Sikker innlogging (valgfritt)
- Integrasjoner med eksisterende systemer
- Hosting og driftsoppsett
- 30 dagers support etter lansering

**FAQ topics:**
- Hva er forskjellen mellom en webapp og en vanlig nettside?
- Kan webappen kobles til systemene vi allerede bruker?
- Hva skjer om vi trenger nye funksjoner etter lansering?
- Hvem eier koden når prosjektet er ferdig?
- Hvor lang tid tar det å utvikle en webapp?

**Prosess steps:** Kartlegging → Prototyp → Bygging → Lansering (exact names locked)

### SEO

**Hero angle:** Bli funnet av de som leter — both Google AND LLMs (ChatGPT, Perplexity)

**Inkludert items (monthly deliverables — not outcomes over time):**
- Månedlig søkeordsanalyse
- Teknisk SEO-gjennomgang
- Innholdsoptimalisering (eksisterende sider)
- GEO-optimalisering for LLM-er
- Lenkebygging (norske nettsteder)
- Månedlig rapport med rangeringsutvikling
- Rådgivning og strategijusteringer

**FAQ topics:**
- Hva er GEO, og hvorfor er det viktig?
- Hvor lang tid tar det å se resultater?
- Inkluderer dere innholdsproduksjon?
- Hva skjer med SEO-arbeidet om vi sier opp avtalen?
- Jobber dere med bedrifter i alle bransjer?

### AI

**Hero angle:** Automatiser det som stjeler tid — med skreddersydde AI-løsninger

**Inkludert items:**
- Behovskartlegging og AI-analyse
- Valg av GDPR-vennlige AI-verktøy
- Integrasjon i eksisterende arbeidsflyt
- Testing og kvalitetssikring
- Dokumentasjon og opplæring
- Løpende justeringer

**FAQ topics:**
- Er AI-løsningen GDPR-compliant? (MUST be present — locked GDPR framing)
- Hva kan AI faktisk automatisere i vår bedrift?
- Hva er forskjellen mellom Nettup og Zapier/Make?
- Kan AI-løsningen kobles til systemene vi allerede bruker?
- Hva skjer om AI-modellen endrer seg eller slutter å fungere?

### Vedlikehold

**Hero angle:** Nettsiden din er i gode hender — vi tar ansvar for alt det tekniske

**Inkludert items (what the monthly fee covers):**
- Oppdateringer av rammeverk og pakker
- Sikkerhetsovervåking og patching
- Månedlig sikkerhetssjekk
- Teknisk support (e-post, respons innen 24 timer)
- Ytelsesovervåking
- Domene- og sertifikathåndtering
- Backup-rutiner

**FAQ topics:**
- Hva dekker vedlikeholdsavtalen?
- Inkluderer vedlikehold nye sider eller funksjoner?
- Hva er responstiden om noe går galt?
- Kan jeg si opp vedlikeholdsavtalen?
- Hva skjer med nettsiden uten vedlikehold?

## Execution Plan Recommendation

The planner should structure Phase 9 as **5 plans** across **2 waves**:

**Wave 1 (prerequisite):**
- Plan 09-01: Extend `services.ts` with `monthlyPrice` and `monthlyPriceLabel` for all 4 services

**Wave 2 (parallel — all independent of each other):**
- Plan 09-02: Build `/tjenester/webapp` (5 files: Hero, Prosess, Inkludert, FAQ, CTA + index.astro)
- Plan 09-03: Build `/tjenester/seo` (4 files: Hero, Inkludert, FAQ, CTA + index.astro)
- Plan 09-04: Build `/tjenester/ai` (4 files: Hero, Inkludert, FAQ, CTA + index.astro)
- Plan 09-05: Build `/tjenester/vedlikehold` (4 files: Hero, Inkludert, FAQ, CTA + index.astro)

Webapp has 5 section files (not 4) due to the Prosess section.

## Open Questions

1. **Monthly price display for seo and vedlikehold**
   - What we know: `seo` and `vedlikehold` already have `priceRange: 'fra X kr/mnd'` as their primary price. The `monthlyPrice` and `monthlyPriceLabel` fields are still needed for consistency and to allow Hero.astro to display monthly price separately from a one-time project price.
   - What's unclear: For seo/vedlikehold, should the Hero show the monthly price as the PRIMARY price signal (no "+" notation), or should it show a one-time price + monthly fee notation?
   - Recommendation: For seo and vedlikehold, the `priceRange` IS the monthly price. Display it as the primary (and only) price signal in Hero — no "+" notation. The `monthlyPrice` field enables future monthly price display logic if needed.

2. **`monthlyPrice` for SEO in services.ts**
   - What we know: `seo` already has `priceRange: 'fra 3 000 kr/mnd'` and `minPrice: 3000`. Setting `monthlyPrice: 3000` is redundant but consistent.
   - Recommendation: Add `monthlyPrice: 3000`, `monthlyPriceLabel: 'fra 3 000 kr/mnd'` for seo — consistency is worth the minor redundancy.

## Sources

### Primary (HIGH confidence)
- Codebase direct inspection — `src/config/services.ts`, `src/pages/tjenester/nettside/`, `src/pages/tjenester/nettbutikk/`, `src/pages/tjenester/landingsside/`, `src/layouts/BaseLayout.astro`, all section components
- `.planning/phases/09-specialist-service-pages/09-CONTEXT.md` — locked decisions and code context
- `.planning/phases/08-core-service-pages/08-RESEARCH.md` — established patterns from Phase 8
- `.planning/REQUIREMENTS.md` — requirement definitions
- `.planning/STATE.md` — accumulated decisions

### Secondary (MEDIUM confidence)
- `.planning/phases/08-core-service-pages/08-01-PLAN.md` — Phase 8 plan structure for planner guidance

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools already in codebase, confirmed by direct inspection
- Architecture: HIGH — mirrors Phase 8 patterns exactly; only new element is Prosess.astro (simple numbered list)
- Pitfalls: HIGH — identified from CONTEXT.md locked decisions and Phase 8 lessons
- Content guide: MEDIUM — editorial recommendations; GEO/AI use case descriptions are directional, not prescriptive

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable stack; content is evergreen)
