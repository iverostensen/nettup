# Phase 3: SEO & Portfolio - Research

**Researched:** 2026-03-03
**Domain:** SEO structured data (JSON-LD), metadata copywriting, portfolio scaffolding, testimonial UI
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Metadata: Write unique, keyword-focused title + description for each of the 5 pages. Target Norwegian SMB search intent ("nettside bedrift oslo", "webdesign pris"). BaseLayout already accepts title/description props — copywriting work, not infrastructure.
- Structured data priority order: (1) FAQ schema on /tjenester — already implemented, (2) BreadcrumbList site-wide, (3) Service schema per service offering.
- BaseLayout already has Organization + LocalBusiness + Offer schemas — add new schemas per-page.
- Portfolio: hold on new projects. Scaffold the portfolio page so new projects can be added easily without rework. Keep iGive as-is. Do not redesign the existing case study layout.
- Testimonials: add a new section to homepage. Quote + concrete result format ("vi fikk X"). 2 testimonials, paired layout. Placement: right before CTA section. Attribution: full name + title + company. Must support adding a profile photo later without restructuring.

### Claude's Discretion

- Exact copy for all metadata (titles, descriptions, OG tags)
- Specific structured data implementation details
- Testimonial card visual design (spacing, quote styling, layout at mobile/desktop)
- Loading skeleton / animation treatment for testimonial section

### Deferred Ideas (OUT OF SCOPE)

- Portfolio photos / profile images for testimonials — future extension only
- New project case studies — projects not ready yet, scaffold only
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SEO-01 | Every page has unique, optimized metadata — title, description, and OG tags tailored per page | Metadata audit shows existing titles are mostly unique but not fully keyword-optimized for Norwegian SMB intent; BaseLayout already wires OG tags from same props — no infrastructure change needed |
| SEO-02 | Structured data schemas: Service (per offering), FAQ (/tjenester), BreadcrumbList (site-wide) | FAQ schema is ALREADY implemented in FAQ.astro; BreadcrumbList must be added per-page inline; Service schema validates via Schema.org but does NOT produce Google rich results — implement for semantic value only |
| PORT-01 | Portfolio expanded to minimum 2-3 projects (currently 1 — iGive) | Context decision: new projects not ready. Scaffold /prosjekter with a reusable project data array + card grid pattern. iGive becomes first entry in array. New projects slot in without restructuring. |
| PORT-02 | Testimonials prominently placed on homepage with strong visual treatment | New Testimonials.astro section using Section + SectionHeader + Card components. Placed between ProjectTeaser and CTA in index.astro. Quote + result format, 2-column grid at md+, stacked mobile. |
</phase_requirements>

---

## Summary

Phase 3 is a mix of copywriting (metadata), lightweight schema additions (BreadcrumbList, Service), and UI work (testimonials, portfolio scaffold). The infrastructure is almost entirely in place — BaseLayout already handles OG tags from props, FAQ schema is already live in FAQ.astro, and the existing component library (Section, SectionHeader, Card) covers testimonial UI without new dependencies.

The most technically interesting piece is the BreadcrumbList schema, which must be generated per-page with the correct URL and label. The cleanest pattern in Astro is to compute the breadcrumb array from `Astro.url.pathname` in BaseLayout (or pass it as a prop per-page) and emit inline JSON-LD. No new libraries needed.

For the portfolio scaffold: the right move is to extract iGive into a typed data array (`src/config/projects.ts`), then render project cards from that array. New projects are added by appending to the array — zero layout rework. The detailed case study view can remain as-is for iGive; new projects without a case study link to an external URL or show a "coming soon" badge.

**Primary recommendation:** Do the metadata copy in one pass across all 5 pages, add BreadcrumbList to BaseLayout (computed from pathname), add Service schemas to /tjenester per package, and build the Testimonials section as a pure Astro component. Zero new dependencies.

## Standard Stack

### Core (already installed — no additions needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site framework | Already in use; JSON-LD via `<script type="application/ld+json" set:html={JSON.stringify(obj)} />` |
| Tailwind CSS | 4.x | Utility styling | Already in use; testimonial layout uses grid utilities |
| Framer Motion | via React islands | Optional animation for testimonials | Already installed; only use if stagger reveal needed beyond CSS classes |

### Supporting (no new installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `src/config/projects.ts` | NEW FILE | Typed project data array | Central source of truth for /prosjekter and ProjectTeaser |
| `src/config/testimonials.ts` | NEW FILE | Typed testimonial data array | Keeps copy out of component markup |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline JSON-LD per-page | `schema-dts` npm package | schema-dts adds type safety but is unnecessary overhead for a 5-page site with stable schemas |
| Astro component for BreadcrumbList | BaseLayout computed from pathname | Component approach requires prop-drilling on every page; computed approach in BaseLayout is zero-config |

**Installation:** No new packages needed.

## Architecture Patterns

### Recommended Project Structure Changes

```
src/
├── config/
│   ├── projects.ts          # NEW — typed project data array
│   └── testimonials.ts      # NEW — typed testimonial data array
├── pages/
│   ├── index.astro          # ADD Testimonials import between ProjectTeaser and CTA
│   ├── _home/
│   │   └── Testimonials.astro   # NEW — testimonial section
│   ├── prosjekter/
│   │   ├── index.astro          # REFACTOR to render from projects array
│   │   └── _sections/
│   │       └── ProjectShowcase.astro  # REFACTOR iGive to use data object; add grid for multiple projects
│   └── tjenester/
│       └── _sections/
│           └── FAQ.astro        # DONE — FAQ schema already implemented
└── layouts/
    └── BaseLayout.astro     # ADD BreadcrumbList schema computed from pathname
                             # ADD optional serviceSchemas prop slot for /tjenester
```

### Pattern 1: BreadcrumbList Computed from Pathname

**What:** Derive breadcrumb items from `Astro.url.pathname` in BaseLayout. Emit JSON-LD inline in `<head>`. No prop required from page authors.
**When to use:** Site-wide; every page automatically gets correct breadcrumbs.

```astro
---
// In BaseLayout.astro frontmatter — add after canonicalURL
const pageLabels: Record<string, string> = {
  '/': 'Hjem',
  '/tjenester': 'Tjenester',
  '/om-oss': 'Om oss',
  '/prosjekter': 'Prosjekter',
  '/kontakt': 'Kontakt',
};

const pathSegments = Astro.url.pathname.replace(/\/$/, '').split('/').filter(Boolean);
const breadcrumbItems = [
  { position: 1, name: 'Hjem', item: 'https://nettup.no/' },
  ...pathSegments.map((seg, i) => {
    const fullPath = '/' + pathSegments.slice(0, i + 1).join('/');
    return {
      position: i + 2,
      name: pageLabels[fullPath] ?? seg,
      item: `https://nettup.no${fullPath}`,
    };
  }),
];
// Drop the `item` property from the last breadcrumb (current page)
if (breadcrumbItems.length > 1) {
  const last = breadcrumbItems[breadcrumbItems.length - 1];
  delete (last as Partial<typeof last>).item;
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbItems.map(b => ({
    "@type": "ListItem",
    ...b,
  })),
};
---

<!-- In <head>, after existing JSON-LD blocks -->
<script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
```

Source: [Google BreadcrumbList docs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)

### Pattern 2: Service Schema per Package

**What:** Inline JSON-LD in /tjenester page (or in Pakker.astro) for each pricing package. Uses `Service` type from schema.org.
**When to use:** On /tjenester only.
**Important:** Service schema does NOT produce Google rich results — its value is semantic (entity understanding, AI search). Validate with Schema.org validator, not Google Rich Results Test (Service is not in Google's supported types).

```astro
---
// In tjenester/index.astro or Pakker.astro
import { pakker } from '@/config/pricing';

const serviceSchemas = pakker.map(pakke => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `Nettup ${pakke.name}`,
  "description": pakke.description,
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
    "price": pakke.launchPrice.replace(/\s/g, ''),
    "priceCurrency": "NOK"
  }
}));
---

{serviceSchemas.map(schema => (
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
))}
```

Source: [schema.org/Service](https://schema.org/Service)

### Pattern 3: Projects Data Array + Card Grid

**What:** Extract project data to `src/config/projects.ts`. Render project cards from this array. iGive is the first entry (with `caseStudySection: true`). Future projects are added by appending.
**When to use:** /prosjekter page and ProjectTeaser on homepage.

```typescript
// src/config/projects.ts
export interface Project {
  id: string;
  name: string;
  category: string;          // e.g., "B2B"
  type: string;              // e.g., "Gavekort-plattform"
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  url?: string;              // external link if no case study
  caseStudySection?: boolean; // true = render full case study inline
  comingSoon?: boolean;       // true = show "Kommer snart" badge
}

export const projects: Project[] = [
  {
    id: 'igive',
    name: 'iGive',
    category: 'B2B',
    type: 'Gavekort-plattform',
    tagline: 'Profesjonell salgsside for Norges ledende gavekortplattform',
    description: 'En dedikert salgsside som hjelper Norges ledende gavekortplattform med å nå bedriftskunder.',
    image: '/images/salg.igive.no.png',
    imageAlt: 'Skjermbilde av salg.igive.no',
    url: 'https://salg.igive.no',
    caseStudySection: true,
  },
  // Future projects slot in here
];
```

### Pattern 4: Testimonials Section

**What:** New Astro component using Section + Card layout. Data driven from `src/config/testimonials.ts`.
**When to use:** Homepage only, placed between ProjectTeaser and CTA.

```typescript
// src/config/testimonials.ts
export interface Testimonial {
  quote: string;
  result: string;      // concrete outcome, e.g., "Vi fikk 40% flere henvendelser"
  name: string;
  title: string;
  company: string;
  photoUrl?: string;   // optional for future extension
}

export const testimonials: Testimonial[] = [
  {
    quote: "Nettup leverte en nettside vi er stolte av – rask, profesjonell og klar på to uker.",
    result: "Vi fikk tre nye kundehenvendelser samme uke som siden gikk live.",
    name: "Kari Nordmann",
    title: "Daglig leder",
    company: "iGive",
  },
  // Second testimonial here
];
```

```astro
<!-- src/pages/_home/Testimonials.astro -->
---
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import Card from '@/components/ui/Card.astro';
import { testimonials } from '@/config/testimonials';
---

<Section>
  <SectionHeader
    title="Hva kundene sier"
    subtitle="Resultater som taler for seg selv."
  />
  <div class="grid gap-6 md:grid-cols-2">
    {testimonials.map((t, i) => (
      <Card padding="lg" class={`reveal-on-scroll delay-${i + 1}`}>
        <!-- Large decorative quote mark -->
        <div class="mb-4 text-4xl font-bold leading-none text-brand/30" aria-hidden="true">"</div>
        <blockquote>
          <p class="text-lg leading-relaxed text-text">{t.quote}</p>
          {t.result && (
            <p class="mt-3 font-semibold text-brand">{t.result}</p>
          )}
        </blockquote>
        <footer class="mt-6 flex items-center gap-4">
          {t.photoUrl ? (
            <img
              src={t.photoUrl}
              alt={t.name}
              class="h-10 w-10 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <!-- Placeholder avatar slot — swap for real photo without restructuring -->
            <div class="h-10 w-10 flex-shrink-0 rounded-full bg-brand/20 flex items-center justify-center" aria-hidden="true">
              <span class="text-sm font-semibold text-brand">{t.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <cite class="not-italic font-semibold">{t.name}</cite>
            <p class="text-sm text-text-muted">{t.title}, {t.company}</p>
          </div>
        </footer>
      </Card>
    ))}
  </div>
</Section>
```

### Anti-Patterns to Avoid

- **Hardcoding testimonial content in the component:** If copy needs updating, the component changes. Extract to config file.
- **Omitting `item` on final BreadcrumbList entry:** Google docs explicitly say the last item should omit `item` — not omitting it is technically valid but redundant.
- **Running Service schema through Google Rich Results Test and expecting green:** Service is not a Google-supported rich result type. Test FAQ schema there; validate Service schema at schema.org/validator instead.
- **Duplicating the FAQ schema already in FAQ.astro:** FAQ.astro already emits the FAQPage JSON-LD correctly using `is:inline`. Do not add another FAQ schema block in the page-level index.astro — it will create duplicate schemas.
- **Using `set:html` without `is:inline` for scripts that don't need Astro processing:** The existing pattern in FAQ.astro uses `is:inline` with `set:html`. BaseLayout uses `set:html` without `is:inline`. Both are valid but be consistent: use whichever pattern matches the surrounding file.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breadcrumb path parsing | Custom URL parser | `Astro.url.pathname.split('/')` + lookup table | Pathname is already available; 5-page site doesn't need a library |
| Schema type safety | Hand-typed interfaces | schema-dts or trust JSON | schema-dts adds 40KB dev dep for marginal gain on a stable 5-page site |
| Project card grid | Custom grid component | Tailwind `grid gap-6 md:grid-cols-2` | Card component already handles the raised surface style |
| Testimonial slider | Custom carousel | Static 2-card grid | Only 2 testimonials; a slider adds JS weight for zero benefit |

**Key insight:** The entire phase is additive. Nothing needs to be rebuilt. The component library is already capable; this phase is about wiring data and writing copy.

## Common Pitfalls

### Pitfall 1: FAQ Schema Duplication

**What goes wrong:** A second FAQPage JSON-LD block is added at page level while FAQ.astro already emits one. Google sees two FAQPage schemas on the same page and may ignore both or display unpredictably.
**Why it happens:** Developers check CONTEXT.md "FAQ schema on /tjenester" and add it without checking the existing FAQ.astro file.
**How to avoid:** Read FAQ.astro first. The schema is ALREADY there (lines 48-64). The task is to verify it's correct and complete, not to add a new block.
**Warning signs:** Two `<script type="application/ld+json">` blocks with `"@type": "FAQPage"` on the /tjenester page.

### Pitfall 2: Service Schema Tested in Rich Results Test

**What goes wrong:** Service schema is implemented correctly, but the Google Rich Results Test shows "No items detected" — team assumes implementation is broken.
**Why it happens:** Service is a valid Schema.org type but is NOT in Google's supported rich result types. The Rich Results Test only validates Google-eligible types.
**How to avoid:** Validate Service schema at https://validator.schema.org/ (or https://search.google.com/structured-data/testing-tool/). Accept that it won't produce rich results — its value is entity understanding for AI search.
**Warning signs:** Spending time debugging Service schema in Rich Results Test.

### Pitfall 3: BreadcrumbList Item URL Mismatch

**What goes wrong:** BreadcrumbList uses relative URLs (`/tjenester`) instead of absolute URLs (`https://nettup.no/tjenester`). Google requires absolute URLs.
**Why it happens:** Developers copy from examples that use relative paths.
**How to avoid:** Always use `Astro.site` base: `new URL(path, Astro.site).toString()` or hardcode `https://nettup.no`.
**Warning signs:** BreadcrumbList validates on Schema.org but not in Google Search Console.

### Pitfall 4: Testimonial Section Breaks on Photo Addition

**What goes wrong:** Testimonial cards are laid out with an assumption that no photo exists (e.g., text fills left side). Adding a photo later requires restructuring the entire card markup.
**Why it happens:** The avatar slot isn't reserved in the initial build.
**How to avoid:** Always include the conditional avatar slot: `{t.photoUrl ? <img> : <div class="placeholder">}`. The footer row maintains its flex layout regardless.
**Warning signs:** Avatar photo is hardcoded as absent rather than conditionally rendered.

### Pitfall 5: Norwegian Metadata Missing Regional Keywords

**What goes wrong:** Metadata says "webdesign" but Norwegian SMBs search "nettside bedrift oslo", "hjemmeside pris", "webbyrå". Generic titles get outcompeted.
**Why it happens:** Copy is written for how developers think, not how buyers search.
**How to avoid:** Use search-intent language in titles and descriptions. The current homepage title "Nettside for Bedrift | Fra 2 500 kr (Lanseringstilbud) | Nettup" is good — replicate this specificity on every page.
**Warning signs:** Descriptions like "Kontakt Nettup" instead of "Gratis tilbud innen 24 timer | Ta kontakt med Nettup – webbyrå for norske småbedrifter".

## Code Examples

Verified patterns from official sources and existing codebase:

### Existing JSON-LD Pattern (from BaseLayout.astro)

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nettup",
  // ...
})} />
```

Use this exact pattern for all new schemas in BaseLayout and page-level files. Do not use `is:inline` in BaseLayout (it doesn't use it; FAQ.astro does — both work).

### Existing FAQ Schema Pattern (from FAQ.astro — ALREADY IMPLEMENTED)

```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
```

This is live. Do not add another FAQPage schema block. Verify the existing one has all 10 FAQs with correct `@type: FAQPage`.

### BreadcrumbList for /tjenester (from Google docs)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Hjem",
      "item": "https://nettup.no/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tjenester"
    }
  ]
}
```

Note: homepage breadcrumb item has `item` URL; /tjenester (final item) omits `item` per Google specification.

### Metadata Copy Targets (current vs recommended)

| Page | Current Title | Recommended Direction |
|------|--------------|----------------------|
| / (index) | "Nettside for Bedrift | Fra 2 500 kr (Lanseringstilbud) | Nettup" | Keep — already strong |
| /tjenester | "Nettside Priser | Lanseringstilbud fra 2 500 kr | Nettup" | Keep — already keyword-rich |
| /om-oss | "Om Nettup | Webdesign Byrå Norge" | Strengthen: add local signal ("Oslo-området") or differentiator |
| /prosjekter | "Våre Prosjekter | Nettside Portefølje | Nettup" | Add outcome: "Se Resultater" or client segment |
| /kontakt | "Kontakt Oss | Gratis Tilbud | Nettup" | Keep — action-oriented, clear |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQPage rich results (expandable in SERP) | FAQPage restricted to gov/health domains | Aug 2023 (Google announcement) | FAQ schema still valid for entity understanding + featured snippets; just won't show expandable Q&A for most sites |
| Manual JSON-LD per page | Computed from page props / pathname | 2023-2024 Astro patterns | Less copy-paste error; more maintainable |
| Service schema expected to produce rich results | Service schema = semantic signal only | Service never had Google rich results | Still worth implementing for AI search entity understanding |

**Deprecated/outdated:**
- HowTo rich results: Google dropped these for most sites (Aug 2023). Not used here, no action needed.
- Review schema on service pages: Google no longer supports third-party review markup on service/product pages as of late 2023. Do not add Review schema.

## Open Questions

1. **Norwegian hreflang: nb vs no**
   - What we know: Google confirmed `no` is acceptable for Norwegian content (Pierre Far, Google). The site already has `lang="nb"` on the `<html>` element, which is correct ISO 639-1 for Bokmål.
   - What's unclear: Nettup is Norwegian-only with no other language versions. Hreflang tags are only needed for multi-language sites. Since there's no alternate language version, hreflang is not required and should not be added.
   - Recommendation: No hreflang changes needed. The existing `lang="nb"` on `<html>` is correct.

2. **Portfolio placeholder projects**
   - What we know: 1-2 real projects are coming but not ready. The decision is to scaffold only.
   - What's unclear: Should placeholder cards be visible to visitors (with "coming soon" badge) or only exist in code?
   - Recommendation: The planner should decide. Option A: show placeholder cards with a "Kommer snart" badge to signal activity. Option B: only iGive renders; new projects appear when data is added. Either is supportable by the proposed `projects.ts` pattern.

3. **Testimonial content sourcing**
   - What we know: The decision requires real testimonials with concrete results. The format is specified.
   - What's unclear: Do actual client testimonials exist to use? If not, the task cannot be completed — placeholder copy would be dishonest.
   - Recommendation: Flag in the plan that copy must be provided. If real testimonials aren't available, the plan should note this as a blocker for the content task.

## Sources

### Primary (HIGH confidence)

- [Google BreadcrumbList documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — required properties, JSON-LD format, `item` omission on final entry
- [schema.org/Service](https://schema.org/Service) — key properties: name, description, provider, areaServed, offers
- Existing codebase: `BaseLayout.astro`, `FAQ.astro`, `pricing.ts`, `ProjectShowcase.astro` — all inspected directly

### Secondary (MEDIUM confidence)

- [Google on Norwegian hreflang (SE Roundtable)](https://www.seroundtable.com/google-norwegian-hreflang-language-codes-19949.html) — Pierre Far confirmed `no` is acceptable; verified against ISO 639-1 standard
- [Google FAQPage changes Aug 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — FAQ rich results restricted to gov/health
- [Epic Notion: FAQ schema in 2025](https://www.epicnotion.com/blog/faq-schema-in-2025/) — confirms FAQ schema still indexed and used for featured snippets; just not expanded SERP display for most sites

### Tertiary (LOW confidence)

- [Rank Math support thread: Service schema not in Rich Results Test](https://support.rankmath.com/ticket/google-rich-results-test-not-detecting-service-schema/) — confirms Service schema not eligible for Google rich results. Single forum source, consistent with Google's official supported types gallery.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; existing Astro JSON-LD patterns verified in codebase
- Architecture: HIGH — all patterns derived from existing code conventions in repo
- Pitfalls: HIGH (FAQ duplication, BreadcrumbList absolute URLs, Service schema expectations) — verified against official docs; MEDIUM (Norwegian metadata copy effectiveness) — SEO copywriting is inherently domain-specific

**Research date:** 2026-03-03
**Valid until:** 2026-06-03 (60 days — structured data specs are stable; Google policy could change but unlikely in 60 days)
