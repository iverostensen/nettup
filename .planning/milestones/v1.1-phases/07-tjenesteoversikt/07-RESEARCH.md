# Phase 7: Tjenesteoversikt - Research

**Researched:** 2026-03-04
**Domain:** Astro component authoring — service catalog grid, grouped layout, FAQ rewrite
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Grid og gruppering**
- Gruppert layout med kategoriheader over hver gruppe — ikke flat grid
- **Gruppe 1: "Nettsteder & Applikasjoner"** — Nettside, Nettbutikk, Landingsside, Webapp (4 kort)
- **Gruppe 2: "Løpende tjenester"** — SEO, AI-løsning, Vedlikehold (3 kort)
- Desktop: 4 kolonner for gruppe 1, 3 kolonner for gruppe 2
- Mobil: én kolonne

**Kortinnhold**
- Heroicons-ikon per tjeneste (linjestil, én unik ikon per tjeneste)
- Tjenestenavn
- Tagline (én setning — outcome-fokusert)
- Description fra services.ts (1-2 setninger)
- Prisintervall fra services.ts
- "Les mer"-knapp → `/tjenester/[slug]`
- Hele kortet er klikkbart (Card.astro med `href`) OG dedikert "Les mer"-knapp inne i kortet

**Fremhevede kort**
- Nettside og Nettbutikk markeres som hoved-tjenester med visuell fremheving
- Brand-farget kant (border-brand) — samme mønster som gjeldende "mest populær"-badge i Pakker.astro

**Gjenstående seksjoner**
- **Fjernes**: Pakker, Inkludert, Support (alle knyttet til utdatert pakkesystem)
- **Beholdes**: TjenesterCTA i bunnen
- **Omskrives**: FAQ — ny innhold tilpasset tjenestekatalog (ikke pakker), f.eks. "Hva om jeg trenger flere tjenester?" og "Hva er inkludert i alle oppdrag?"

### Claude's Discretion
- Hvilken spesifikk Heroicons-ikon tildeles hvilken tjeneste
- Nøyaktig visuell behandling av fremhevede kort (badge vs kant vs begge)
- FAQ-spørsmål og -svar (ny innhold, men tone og stil følger eksisterende FAQ)
- Innholdsrekkefølge innen grupper

### Deferred Ideas (OUT OF SCOPE)
- Ingen — diskusjonen holdt seg innenfor fasegrensen
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| OVERVIEW-01 | `/tjenester` redesignet som tjenestekatalog med 7 servicekort | services.ts already has all 7 services; new TjenesterOversikt.astro section renders two grouped grids |
| OVERVIEW-02 | Hvert kort viser: tjenestenavn, én setnings outcome, prisintervall og lenke til underside | Card.astro supports `href` for clickable card; services.ts has `tagline`, `priceRange`, `slug` fields |
| OVERVIEW-03 | Gammelt 3-nivå-prisavsnitt (Enkel/Standard/Premium) fjernet fra oversiktsside | Remove Pakker, Inkludert, Support imports/calls from index.astro; keep FAQ + TjenesterCTA |
</phase_requirements>

---

## Summary

Phase 7 is a focused refactor of `src/pages/tjenester/index.astro` and its `_sections/` directory. The foundation is already in place: all seven service objects live in `src/config/services.ts` (from Phase 6), the `Card.astro` component already supports `href` for a fully-clickable card, `SectionHeader.astro` handles group headers, and `Button.astro` has the secondary variant needed for "Les mer". No new dependencies are required.

The work splits into three tasks: (1) create a new `TjenesterOversikt.astro` section with two groups of service cards, (2) rewrite `FAQ.astro` with catalog-appropriate content, and (3) update `index.astro` to remove old sections (Pakker, Inkludert, Support) and wire in the new ones. The JSON-LD in `index.astro` must also be updated to reflect the new service data from `services.ts` instead of the old `pakker` array.

The main design challenge is implementing the "highlighted card" treatment for Nettside and Nettbutikk. The pattern from `Pakker.astro` (`border-brand ring-1 ring-brand`) is the locked reference. Cards also need to handle double-click semantics cleanly — whole card is an `<a>`, inner "Les mer" button is also an `<a>`, so the inner button must use `tabindex="-1"` and `aria-hidden="true"` on it, or more simply, the card `<a>` wraps everything and the "Les mer" link is a visual element only (redundant link pattern).

**Primary recommendation:** Build TjenesterOversikt.astro as a self-contained Astro section that maps over two hardcoded arrays of service slugs, pulls data from `services.ts`, and renders two responsive CSS grids with `Card.astro as="a"`.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Page and section authoring | Project stack — all sections are Astro |
| Tailwind CSS | 4.x | Layout, spacing, responsive grid | Project design system |
| services.ts | — | Data source for all 7 service cards | Already built in Phase 6 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Card.astro | project | Clickable card container | All 7 service cards |
| SectionHeader.astro | project | Group category titles | "Nettsteder & Applikasjoner" and "Løpende tjenester" headings |
| Button.astro | project | "Les mer" CTA inside card | Secondary variant |
| Section.astro | project | Consistent section padding + container | Wraps each section |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static slug arrays | Dynamic group field on Service type | Adding a group field to services.ts works but adds coupling; static arrays in TjenesterOversikt.astro keep the section self-contained and match how user described the grouping |
| Card with inner Button `<a>` | Outer card as `<div>`, inner button as sole CTA | Outer card as `<a>` makes entire card clickable per locked decision; inner "Les mer" needs redundant-link treatment |

**Installation:**
No new packages needed.

---

## Architecture Patterns

### Recommended File Changes

```
src/pages/tjenester/
├── index.astro                   # REWRITE: remove Pakker/Inkludert/Support imports, add TjenesterOversikt
└── _sections/
    ├── TjenesterOversikt.astro   # CREATE: grouped service card grid (new section)
    ├── FAQ.astro                 # REWRITE: catalog-appropriate FAQ content
    ├── TjenesterCTA.astro        # KEEP AS-IS (minor text update: "pakke" → "tjeneste")
    ├── Pakker.astro              # REMOVE from imports (file can stay, just unused)
    ├── Inkludert.astro           # REMOVE from imports
    └── Support.astro             # REMOVE from imports
```

### Pattern 1: Grouped Service Card Grid

**What:** TjenesterOversikt.astro maps over two static slug arrays, looks up service data from `services.ts`, and renders them in two separate CSS grid blocks each preceded by a group heading.

**When to use:** When multiple visual groupings of the same data type need different column counts.

**Example:**
```astro
---
// Source: project pattern (Pakker.astro + services.ts)
import { services } from '@/config/services';
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Section from '@/components/ui/Section.astro';

const group1Slugs = ['nettside', 'nettbutikk', 'landingsside', 'webapp'];
const group2Slugs = ['seo', 'ai', 'vedlikehold'];

const group1 = group1Slugs.map(slug => services.find(s => s.slug === slug)!);
const group2 = group2Slugs.map(slug => services.find(s => s.slug === slug)!);

const featured = new Set(['nettside', 'nettbutikk']);
---

<Section>
  <!-- Group 1 heading + 4-col grid -->
  <h2 class="reveal-on-scroll mb-6 font-display text-xl font-semibold text-text-muted">
    Nettsteder &amp; Applikasjoner
  </h2>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {group1.map((service, i) => (
      <Card
        as="a"
        href={`/tjenester/${service.slug}`}
        hover
        padding="lg"
        class={`reveal-on-scroll delay-${i + 1} flex flex-col ${featured.has(service.slug) ? 'border-brand ring-1 ring-brand' : ''}`}
      >
        <!-- icon, name, tagline, description, price, button -->
      </Card>
    ))}
  </div>

  <!-- Group 2 heading + 3-col grid -->
  <h2 class="reveal-on-scroll mb-6 mt-16 font-display text-xl font-semibold text-text-muted">
    Løpende tjenester
  </h2>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {group2.map((service, i) => (
      <Card as="a" href={`/tjenester/${service.slug}`} hover padding="lg"
        class={`reveal-on-scroll delay-${i + 1} flex flex-col`}>
        <!-- icon, name, tagline, description, price, button -->
      </Card>
    ))}
  </div>
</Section>
```

### Pattern 2: Heroicons Inline SVG

**What:** Inline SVG from Heroicons (outline style), 24x24, `stroke-width="2"`, `stroke="currentColor"`. Already used throughout the project in Pakker.astro and Inkludert.astro.

**When to use:** Every service card needs one unique icon.

**Example:**
```astro
<!-- Source: Pakker.astro (checkmark icon pattern) -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  class="h-8 w-8 text-brand"
  aria-hidden="true"
>
  <path stroke-linecap="round" stroke-linejoin="round" d="M..." />
</svg>
```

Claude's discretion: which Heroicons path per service. Suggested assignments:
- Nettside: `GlobeAltIcon` (globe-alt)
- Nettbutikk: `ShoppingCartIcon` (shopping-cart)
- Landingsside: `FunnelIcon` (funnel) or `MegaphoneIcon`
- Webapp: `CodeBracketSquareIcon` (code-bracket-square)
- SEO: `MagnifyingGlassChartIcon` or `ChartBarIcon`
- AI-løsning: `CpuChipIcon` (cpu-chip)
- Vedlikehold: `WrenchScrewdriverIcon` (wrench-screwdriver)

### Pattern 3: Featured Card Highlight

**What:** Same visual treatment as `pakke.popular` in Pakker.astro — `border-brand ring-1 ring-brand` on the outer Card element.

**When to use:** Nettside and Nettbutikk only.

**Example:**
```astro
<!-- Source: Pakker.astro lines 19-20 -->
class={`... ${featured.has(service.slug) ? 'border-brand ring-1 ring-brand' : 'border-white/10'}`}
```

Note: Card.astro base classes include `border border-white/10`. To override the border color for featured cards, pass the highlight class directly. The `border-brand` class overrides the inherited `border-white/10`.

### Pattern 4: Redundant Link (Accessible Double-Click)

**What:** When a card is an `<a>` and also contains a `<Button href>`, the inner button is a redundant link for visual purposes. Screen readers should not announce it twice.

**How to handle:**
```astro
<!-- Outer card is the real link; inner "Les mer" is visual only -->
<Card as="a" href={`/tjenester/${service.slug}`} hover padding="lg">
  <!-- content -->
  <div class="mt-auto pt-4">
    <span
      class="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-text transition-all duration-fast hover:border-white/40 hover:bg-white/5"
      aria-hidden="true"
      tabindex="-1"
    >
      Les mer
    </span>
  </div>
</Card>
```
Use a `<span>` styled like Button secondary (not a real `<a>`) inside the outer `<a>`. This avoids nested interactive elements (invalid HTML). Add `aria-label` on the outer card for screen reader clarity.

### Pattern 5: index.astro Rewrite

**What:** The current `index.astro` imports `pakker` from pricing, and mounts Pakker, Inkludert, Support. All three must be removed. JSON-LD must be regenerated from `services.ts`.

**Example:**
```astro
---
// NEW index.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import { services } from '@/config/services';
import TjenesterOversikt from './_sections/TjenesterOversikt.astro';
import FAQ from './_sections/FAQ.astro';
import TjenesterCTA from './_sections/TjenesterCTA.astro';

const serviceSchemas = services.map(service => ({
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
      "maxPrice": service.maxPrice || undefined,
      "priceCurrency": "NOK"
    }
  }
}));
---

<BaseLayout
  title="Tjenester | Nettside, Nettbutikk, SEO og mer | Nettup"
  description="Se alle tjenestene vi tilbyr: nettside, nettbutikk, landingsside, webapp, SEO, AI-løsninger og vedlikehold."
>
  <Fragment slot="head">
    {serviceSchemas.map(schema => (
      <script type="application/ld+json" set:html={JSON.stringify(schema)} />
    ))}
  </Fragment>
  <main>
    <TjenesterOversikt />
    <FAQ />
    <TjenesterCTA />
  </main>
</BaseLayout>
```

### Pattern 6: FAQ Rewrite

**What:** Replace package-centric FAQ with catalog-appropriate questions. Reuse same Astro component structure (array of `{question, answer}` objects, FAQPage JSON-LD). Keep FAQPage schema.

**New FAQ content (Claude's discretion to finalize):**
```typescript
const faqs = [
  {
    question: 'Hva er inkludert i alle oppdrag?',
    answer: 'Alle oppdrag inkluderer teknisk setup, responsivt design, grunnleggende SEO og 30 dagers support etter levering.',
  },
  {
    question: 'Hva om jeg trenger flere tjenester?',
    answer: 'Mange kunder kombinerer for eksempel nettside + SEO eller nettbutikk + vedlikehold. Ta kontakt så setter vi opp et opplegg som passer din situasjon.',
  },
  {
    question: 'Hvor lang tid tar et oppdrag?',
    answer: 'En nettside er typisk klar på 1–3 uker. Nettbutikk og webapper tar lenger tid avhengig av kompleksitet. Vi avklarer tidsplan tidlig i prosessen.',
  },
  {
    question: 'Trenger jeg å levere innhold selv?',
    answer: 'Ja, du leverer tekst og bilder. Vi hjelper med struktur og gir råd underveis.',
  },
  {
    question: 'Hva koster det å gjøre endringer etter lansering?',
    answer: 'Småjusteringer avtales direkte. For løpende vedlikehold og oppdateringer har vi en egen vedlikeholdstjeneste fra 1 500 kr/mnd.',
  },
  {
    question: 'Eier jeg det som lages?',
    answer: 'Ja, du eier all kode og innhold. Ingen binding — du kan flytte løsningen når du vil.',
  },
];
```

### Anti-Patterns to Avoid

- **Nested `<a>` inside `<a>`:** Invalid HTML. Use `<span>` styled as button for the inner "Les mer" element.
- **Hardcoding service data in TjenesterOversikt.astro:** All content (name, tagline, priceRange, description, slug) must come from `services.ts`. Only the grouping (slug lists) is hardcoded.
- **Using `pakker` or `launchOffer` imports:** These belong to the old system. Phase 7 removes all references from `index.astro`.
- **Flat grid (no groups):** Locked decision is grouped layout. Do not flatten into a single 7-column grid.
- **delay-N beyond delay-5:** brand.ts only defines delays 1–5. With 4 items in group 1, using `delay-${i+1}` is safe (max delay-4). Fine.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Clickable card | Custom div with onClick JS | Card.astro with `as="a"` + `href` | Already supports semantic link, hover effects, and keyboard nav |
| Group headings | New GroupHeader component | SectionHeader.astro with `centered={false}` or plain `<h2>` | Existing primitive covers it; for sub-group labels a simple `<h2>` inline is fine |
| Scroll reveal stagger | Custom IntersectionObserver per section | `reveal-on-scroll delay-N` CSS classes | BaseLayout already runs the global observer; just add the classes |
| Icon rendering | React icon library | Inline SVG Heroicons | Project pattern; no JS, no bundle cost |
| Service data | Inline objects in section file | Import from `@/config/services.ts` | Single source of truth, already built |

**Key insight:** Everything needed for this phase exists in the project. The implementation is pure composition of existing primitives with new content.

---

## Common Pitfalls

### Pitfall 1: Nested Interactive Elements (nested `<a>`)

**What goes wrong:** Card rendered as `<a href>` with a `<Button href>` inside creates nested anchor elements. Browsers interpret the markup inconsistently, and HTML validators fail.

**Why it happens:** The locked decision says "whole card is clickable AND has a dedicated Les mer button." The naive implementation uses `<Button href>` inside `<Card as="a">`.

**How to avoid:** Render the inner "Les mer" as a `<span>` with Button secondary styling, `aria-hidden="true"`, `tabindex="-1"`. Add `aria-label="Les mer om [tjenestenavn]"` on the outer `<a>` for screen readers.

**Warning signs:** HTML validator errors, browser warnings about nested anchors.

### Pitfall 2: Forgetting to Update TjenesterCTA Copy

**What goes wrong:** TjenesterCTA.astro currently says "Usikker på hvilken pakke?" — this must change to "tjeneste" since the page no longer sells packages.

**Why it happens:** It's an easy file to overlook since it's kept (not removed).

**How to avoid:** TjenesterCTA.astro is a small file (18 lines). Update heading and button text as part of the index.astro rewrite task.

### Pitfall 3: Stale JSON-LD in index.astro

**What goes wrong:** The current JSON-LD in index.astro uses `pakke.launchPrice` and the old offer schema. If not updated, the page publishes outdated pricing data to search engines.

**Why it happens:** JSON-LD lives in index.astro frontmatter, easy to miss when refactoring sections.

**How to avoid:** Replace JSON-LD generation to use `services.ts` with `PriceSpecification` pattern (already established by CONFIG-02 from Phase 6). The `maxPrice: 0` convention (open-ended) means `maxPrice` should be omitted from JSON-LD rather than included as 0.

### Pitfall 4: Card.astro Border Override

**What goes wrong:** Card.astro base classes include `border border-white/10`. Adding `border-brand` as an additional class in some Tailwind 4 configurations may not override the base border color depending on specificity and class order.

**Why it happens:** Tailwind 4 uses a different specificity model — last class in the HTML wins within the same property, but the order depends on the generated CSS order, not DOM order.

**How to avoid:** Test the featured card rendering immediately. If `border-brand` doesn't override, add `!border-brand` (Tailwind important modifier) or restructure the conditional to pass the complete border class.

### Pitfall 5: Group 1 Desktop Grid — sm:grid-cols-2 Intermediate Step

**What goes wrong:** `lg:grid-cols-4` with no intermediate breakpoint causes 4 cards to stack in one column on tablet, which looks broken.

**Why it happens:** Going from `grid-cols-1` straight to `lg:grid-cols-4` skips `md`.

**How to avoid:** Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for group 1, and `grid-cols-1 sm:grid-cols-3` for group 2 (3 cols fits nicely at sm). Matches mobile-first requirement.

---

## Code Examples

Verified patterns from project source:

### Card with href (clickable card)
```astro
<!-- Source: Card.astro — the `as` prop resolves to <a> when href present -->
<Card
  as="a"
  href="/tjenester/nettside"
  hover
  padding="lg"
  class="reveal-on-scroll delay-1 flex flex-col border-brand ring-1 ring-brand"
>
  <!-- content -->
</Card>
```

### Reveal-on-scroll stagger in a grid
```astro
<!-- Source: Pakker.astro line 18, Inkludert.astro line 41 -->
{items.map((item, index) => (
  <div class={`reveal-on-scroll delay-${index + 1}`}>
    <!-- item content -->
  </div>
))}
```
Note: delay classes go up to delay-5 (defined in brand.ts). For group 1 (4 items), max is delay-4 — safe.

### Heroicons inline SVG (outline)
```astro
<!-- Source: Pakker.astro, Inkludert.astro — established pattern -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  class="h-8 w-8 text-brand"
  aria-hidden="true"
>
  <path stroke-linecap="round" stroke-linejoin="round" d="[heroicons path data]" />
</svg>
```

### Popular/featured border pattern
```astro
<!-- Source: Pakker.astro line 19 -->
class={`... ${pakke.popular ? 'border-brand ring-1 ring-brand' : 'border-white/10'}`}
```

### FAQPage JSON-LD (keep from existing FAQ.astro)
```astro
<!-- Source: FAQ.astro lines 49-60 — keep this pattern -->
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
  }))
};
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| `pakker` from `pricing.ts` as data source | `services` from `services.ts` | 7 distinct services vs 3 generic tiers |
| Flat package pricing (Enkel/Standard/Premium) | Per-service pricing with `priceRange` string | More honest, outcome-specific pricing |
| Single `<Offer>` JSON-LD per package | `PriceSpecification` with `minPrice`/`maxPrice` | CONFIG-02 already established this pattern |
| Package-centric FAQ | Catalog-centric FAQ | Answers match what visitors actually ask |

**Deprecated/outdated after this phase:**
- `Pakker.astro`: no longer imported by any page (file stays but unused)
- `Inkludert.astro`: removed from tjenester page
- `Support.astro`: removed from tjenester page
- `pricing.ts` import in `tjenester/index.astro`: replaced by `services.ts`
- `launchOffer` import in `tjenester/index.astro`: removed entirely

---

## Open Questions

1. **TjenesterCTA copy update scope**
   - What we know: TjenesterCTA.astro says "Usikker på hvilken pakke?" — must change
   - What's unclear: Whether to fully rewrite copy or just swap "pakke" → "tjeneste"
   - Recommendation: Claude's discretion — rewrite heading to "Usikker på hvilken tjeneste?" and body to match. Small change, do it as part of task 3 (index.astro rewrite).

2. **maxPrice: 0 in JSON-LD**
   - What we know: services.ts uses `maxPrice: 0` to indicate open-ended pricing (decided in Phase 6)
   - What's unclear: Schema.org technically wants a number for maxPrice; 0 is misleading
   - Recommendation: Omit `maxPrice` from JSON-LD when value is 0. Emit only `minPrice`. The existing `maxPrice || undefined` pattern in Pattern 5 example handles this.

---

## Sources

### Primary (HIGH confidence)
- `/Users/iverostensen/nettup/src/config/services.ts` — all 7 service objects, field names
- `/Users/iverostensen/nettup/src/components/ui/Card.astro` — `as`, `href`, `hover`, `padding` props confirmed
- `/Users/iverostensen/nettup/src/components/ui/Button.astro` — variant options confirmed
- `/Users/iverostensen/nettup/src/components/ui/SectionHeader.astro` — `centered` prop confirmed
- `/Users/iverostensen/nettup/src/pages/tjenester/_sections/Pakker.astro` — featured card pattern
- `/Users/iverostensen/nettup/src/pages/tjenester/_sections/FAQ.astro` — existing FAQ structure
- `/Users/iverostensen/nettup/src/styles/global.css` — `reveal-on-scroll`, delay classes, `prefers-reduced-motion`
- `/Users/iverostensen/nettup/tailwind.config.ts` — delay-1 through delay-5 confirmed
- `/Users/iverostensen/nettup/src/config/brand.ts` — delay values 100ms–500ms

### Secondary (MEDIUM confidence)
- Heroicons outline path data: based on training knowledge of Heroicons v2 naming conventions; verify paths from https://heroicons.com before committing icon SVG paths

### Tertiary (LOW confidence)
- Tailwind 4 class specificity behavior for border color overrides: needs runtime verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all components inspected from source
- Architecture: HIGH — patterns extracted directly from existing project files
- Pitfalls: HIGH for nested anchors and JSON-LD (verified issues), MEDIUM for Tailwind 4 border specificity (needs runtime check)

**Research date:** 2026-03-04
**Valid until:** 2026-04-03 (stable project — Astro/Tailwind versions unlikely to change within 30 days)
