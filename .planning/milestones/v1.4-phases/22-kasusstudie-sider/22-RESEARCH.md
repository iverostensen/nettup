# Phase 22: Kasusstudie-sider - Research

**Researched:** 2026-03-07
**Domain:** Astro static page authoring, GEO-optimized content, case study page patterns
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Sidearkitektur**
- Én delt `[slug].astro` dynamisk route under `src/pages/prosjekter/` — henter data fra `projects.ts` per slug
- Ingen individuelle filer per prosjekt — `[slug].astro` renderer all data fra project-objektet
- Ingen dedikert hero-seksjon — siden starter direkte med breadcrumbs + åpningssammendrag

**Seksjonrekkefølge** (begge sider følger denne faste rekkefølgen):
1. Breadcrumbs (Hjem / Prosjekter / [Prosjektnavn])
2. Opening summary (prosjektnavn, tagline, åpningstekst — innen 200 ord, GEO-siterbar)
3. Hero-bilde (full bredde under summary-teksten)
4. Utfordring
5. Løsning (med features-bilde inline)
6. Tech stack
7. Features (liste over leveranser)
8. Metrics-blokk (Lighthouse-scores)
9. Testimonial
10. CTA (lenke til live side + kontaktoppfordring)

**Innholdsdybde**
- Middels dybde — 2–4 avsnitt per seksjon (utfordring, løsning)
- Nok til å fortelle historien og score på GEO-søk, ikke så langt at leseren mister fokus

**Metrics-blokk**
- 4 tall-kort i grid: Performance, Accessibility, Best Practices, SEO
- Store tall (96, 100 etc.) med kort label under
- Kun Lighthouse-scores — ingen lastehastighet eller andre metrikker
- Kort intro-tekst over blokken, f.eks. «Målt med Google PageSpeed Insights»

**Screenshots/bilder**
- Hero-bilde (`igive-hero.png` / `blom-hero.png`): full bredde under åpningssammendrag-teksten
- Features-bilde (`igive-features.png` / `blom-features.png`): inline i løsningsseksjonen
- Bilder brukes kontekstuelt, ikke som galleri
- Alle bilder via `astro:assets` `<Image>` med korrekte `alt`-tekster

**Testimonials**
- Bygges i denne fasen — ikke utsatt
- Testimonial-data lagres i `projects.ts` (eget `testimonials`-objekt eller inline i project-entry)
- Visuell stil: stor blockquote med navn + tittel + avatar/prosjektbilde under — card-basert med subtil bakgrunn
- Begge prosjekter har ekte kundesitat klart

### Claude's Discretion
- Eksakt copy-formulering for utfordring og løsning per prosjekt (basert på eksisterende tekst i projects.ts)
- Testimonial-komponentens interne markup og styling detaljer
- CTA-seksjonens formulering og lenketekst
- Tech stack-seksjonens visuelle presentasjon (badges, liste, eller grid)

### Deferred Ideas (OUT OF SCOPE)
- JSON-LD `CreativeWork` og `BreadcrumbList` structured data — Phase 23
- SEO-validering og sitemap-sjekk — Phase 23
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIDE-01 | `/prosjekter/igive` exists as a dedicated page with all table-stakes sections: opening summary paragraph, challenge, solution, tech stack, features delivered, metrics block, testimonial, live site link | `[slug].astro` dynamic route + `projects.ts` data model; all fields already defined in Project interface |
| SIDE-02 | `/prosjekter/blom-company` exists as a dedicated page with all table-stakes sections: opening summary paragraph, challenge, solution, tech stack (Next.js 15 / Shopify / Sanity / Tailwind 4 / Vercel), dual-collection story, Lighthouse scores, testimonial, live site link | Same route — Blom Company data needs `challenge`, `solution`, `features` fields populated in `projects.ts` |
| SIDE-03 | Both pages have GEO-optimized copy — standalone summary paragraph visible within opening 200 words, concrete verifiable numbers (scores, load times, specific tech versions) as a distinct visual metrics block | `metrics` field already populated with verified Lighthouse scores; opening summary must be self-contained and ≤200 words |
</phase_requirements>

## Summary

Phase 22 is primarily a content authoring and Astro component-building phase, not a library research phase. The full stack is already in place (Astro 5, Tailwind 4, `astro:assets`). The deliverable is: (1) a `[slug].astro` dynamic route, (2) inline section components rendered from `projects.ts` data, (3) Norwegian copy for both case studies meeting GEO requirements.

The data model in `src/config/projects.ts` already has all required fields (`challenge`, `solution`, `features`, `metrics`, `techStack`, `gallery`, `testimonialId`). iGive is largely populated. Blom Company is missing `challenge`, `solution`, and `features` — these must be written and added in this phase. The `testimonials.ts` file has the iGive testimonial; a Blom Company testimonial entry must be added.

All four images (`igive-hero.png`, `igive-features.png`, `blom-hero.png`, `blom-features.png`) are confirmed present in `src/assets/images/`. Lighthouse scores are verified and stored: iGive 96/96/100/100, Blom Company 99/96/100/100.

**Primary recommendation:** Build one `[slug].astro` dynamic route that renders all 10 sections from `projects.ts` data. Write content directly into `projects.ts` as data fields (no separate content files needed at this scale). Keep every section component as a local snippet inside `[slug].astro` or in `src/pages/prosjekter/_sections/` — follow the established `_sections/` pattern.

## Standard Stack

### Core (no new dependencies needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (already installed) | Static page rendering, dynamic routes | Project stack |
| `astro:assets` `<Image>` | built-in | Optimized image serving | Already used in ProjectGrid |
| Tailwind CSS | 4.x (already installed) | Styling | Project stack |

### Existing UI Components (reuse, don't rebuild)

| Component | Location | Used For |
|-----------|----------|----------|
| `Breadcrumbs.astro` | `src/components/ui/` | Top of page navigation trail |
| `Section.astro` | `src/components/ui/` | Section wrapper with consistent padding |
| `SectionHeader.astro` | `src/components/ui/` | Section titles (h2 + optional subtitle) |
| `Card.astro` | `src/components/ui/` | Metrics cards, testimonial card |
| `Button.astro` | `src/components/ui/` | CTA button |
| `LinkWithArrow.astro` | `src/components/ui/` | Live site link |

**Installation:** None required — all dependencies already present.

## Architecture Patterns

### Recommended Project Structure

```
src/pages/prosjekter/
├── index.astro              # Existing — project grid (unchanged)
├── _sections/
│   ├── Hero.astro           # Existing — prosjekter index hero (unchanged)
│   ├── ProjectGrid.astro    # Existing (unchanged)
│   └── ProsjekterCTA.astro  # Existing (unchanged)
└── [slug].astro             # NEW — dynamic case study route

src/config/
├── projects.ts              # MODIFY — add Blom Company content fields
└── testimonials.ts          # MODIFY — add Blom Company testimonial entry
```

### Pattern 1: Astro Dynamic Route

**What:** Single `[slug].astro` file using `getStaticPaths()` to enumerate both projects at build time.

**When to use:** When all pages share the same data shape and render logic.

```astro
---
// src/pages/prosjekter/[slug].astro
import { getStaticPaths } from 'astro' // not imported — built-in export

import { projects } from '@/config/projects';
import { testimonials } from '@/config/testimonials';
import BaseLayout from '@/layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Breadcrumbs from '@/components/ui/Breadcrumbs.astro';
import LinkWithArrow from '@/components/ui/LinkWithArrow.astro';

export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const testimonial = project.testimonialId
  ? testimonials.find((t) => t.company.toLowerCase().replace(/\s+/g, '-') === project.testimonialId)
  : null;
---

<BaseLayout title={project.metaTitle} description={project.metaDescription}>
  <main>
    <!-- 1. Breadcrumbs -->
    <!-- 2. Opening summary -->
    <!-- 3. Hero image -->
    <!-- 4. Utfordring -->
    <!-- 5. Løsning + features-bilde -->
    <!-- 6. Tech stack -->
    <!-- 7. Features list -->
    <!-- 8. Metrics block -->
    <!-- 9. Testimonial -->
    <!-- 10. CTA -->
  </main>
</BaseLayout>
```

### Pattern 2: Metrics Grid (4-card layout)

**What:** 4 equal-width cards in a CSS grid, each showing a large number + label.

```astro
<!-- Metrics block — rendered from project.metrics -->
<Section background="raised">
  <p class="reveal-on-scroll text-center text-sm text-text-muted mb-8">
    Målt med Google PageSpeed Insights
  </p>
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    {[
      { label: 'Performance', value: project.metrics?.performance },
      { label: 'Accessibility', value: project.metrics?.accessibility },
      { label: 'Best Practices', value: project.metrics?.bestPractices },
      { label: 'SEO', value: project.metrics?.seo },
    ].map((m, i) => (
      <Card padding="lg" class={`reveal-on-scroll reveal-stagger-${i + 1} text-center`}>
        <span class="block text-5xl font-bold text-brand">{m.value}</span>
        <span class="mt-2 block text-sm text-text-muted">{m.label}</span>
      </Card>
    ))}
  </div>
</Section>
```

### Pattern 3: Testimonial Card

**What:** Blockquote with quote text, result, name, title, company. Card-based with `bg-surface-raised`.

```astro
{testimonial && (
  <Section>
    <Card padding="lg" class="reveal-on-scroll mx-auto max-w-3xl">
      <blockquote class="text-xl italic text-text leading-relaxed">
        "{testimonial.quote}"
      </blockquote>
      <p class="mt-4 text-text-muted">{testimonial.result}</p>
      <footer class="mt-6 flex items-center gap-3">
        <div>
          <p class="font-semibold">{testimonial.name}</p>
          <p class="text-sm text-text-muted">{testimonial.title}, {testimonial.company}</p>
        </div>
      </footer>
    </Card>
  </Section>
)}
```

### Pattern 4: Hero Image (full width, below summary)

```astro
<div class="reveal-on-scroll mx-auto max-w-6xl px-4 pb-16 md:px-8">
  <div class="overflow-hidden rounded-2xl border border-white/10">
    <Image
      src={project.image}
      alt={project.imageAlt}
      width={1600}
      quality={85}
      class="w-full object-cover"
    />
  </div>
</div>
```

### Pattern 5: GEO Opening Summary

**What:** A self-contained paragraph that identifies: who the client is, what Nettup built, the key result. Must stand alone within 200 words so an AI assistant can cite it without additional context.

**Structure:**
```
[Client name] er [brief client description]. Nettup bygget [what was built]. [Key outcome in concrete terms]. [One sentence on tech used].
```

**Example (iGive):**
```
iGive er Norges ledende gavekortplattform for bedrifter, med løsninger for digitale kort, QR-kort og fysiske plastkort.
Nettup bygget en dedikert salgsside — salg.igive.no — som hjelper iGive med å nå bedriftskunder direkte.
Siden lastes inn på under ett sekund og scorer 96/100 på Google PageSpeed (Performance og Accessibility), med 100/100 på Best Practices og SEO.
Bygget med Astro og Tailwind CSS og driftet på Vercel.
```

### Anti-Patterns to Avoid

- **Using `delay-N` Tailwind classes in isolation for stagger:** The project uses BOTH `delay-N` (Tailwind's built-in `transition-delay` utility) and `reveal-stagger-N` (custom CSS in global.css). Use `reveal-stagger-N` for scroll-reveal stagger; use `delay-N` only on elements that aren't scroll-reveal targets. Do not mix them on the same element.
- **Building dynamic `[slug].astro` with SSR:** This is a static site. `getStaticPaths()` is required — Astro will error without it on static output.
- **Importing images from gallery without verifying they exist:** All four images are confirmed present. Do not add `gallery` field imports unless images exist.
- **Fabricating Lighthouse scores:** Scores are verified and stored — use only the values in `projects.ts`.
- **Dynamic [slug].astro` WITHOUT `export function getStaticPaths()`:** Astro static build requires this export; missing it causes a build error.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom `<img>` with manual srcset | `astro:assets` `<Image>` | Built-in, already used across project |
| Breadcrumb trail | Custom nav markup | `Breadcrumbs.astro` | Already exists, handles aria and styling |
| Section wrapper | Custom div with padding classes | `Section.astro` | Ensures consistent max-width, padding, background variants |
| Card container | Inline border/bg classes | `Card.astro` | Handles hover, padding variants, consistent styling |
| CTA button | `<a>` with manual classes | `Button.astro` | Handles variants, sizes, correct hover/active states |

**Key insight:** This phase is content authoring + template wiring, not component building. Almost every visual element needed already exists as a UI component.

## Common Pitfalls

### Pitfall 1: Missing `getStaticPaths` in dynamic route

**What goes wrong:** Astro build fails with "Missing `getStaticPaths` export" error.
**Why it happens:** Dynamic `[slug].astro` pages require `getStaticPaths()` for static output mode.
**How to avoid:** Always export `getStaticPaths()` that maps `projects` array to `{ params: { slug }, props: { project } }` tuples.
**Warning signs:** Build error mentioning the slug route.

### Pitfall 2: Blom Company missing content fields

**What goes wrong:** Blom Company case study page renders empty sections or throws on undefined fields.
**Why it happens:** `projects.ts` has `challenge`, `solution`, `features` defined in the interface but Blom Company entry has no values for these yet (only iGive has them populated).
**How to avoid:** Populate ALL content fields for both projects in `projects.ts` before wiring the template.
**Warning signs:** `project.challenge` is `undefined` — sections render nothing.

### Pitfall 3: Missing Blom Company testimonial

**What goes wrong:** Testimonial section silently skips for Blom Company, or throws on `find()` returning undefined.
**Why it happens:** `testimonials.ts` only has one entry (iGive). Blom Company has no entry.
**How to avoid:** Add Blom Company testimonial to `testimonials.ts` AND set `testimonialId` on the blom-company project entry. Guard testimonial render with null check (`{testimonial && ...}`).
**Warning signs:** Testimonial section absent on Blom Company page.

### Pitfall 4: `astro:assets` Image import at runtime vs. build time

**What goes wrong:** Build fails with `ENOENT` if an image is referenced before being committed.
**Why it happens:** `astro:assets` resolves image metadata at build time — the file must exist on disk.
**How to avoid:** All four images are confirmed present (`igive-hero.png`, `igive-features.png`, `blom-hero.png`, `blom-features.png`). Import them at the top of `projects.ts` — already done for hero images. Add feature image imports to `projects.ts` as `gallery` or a dedicated `featuresImage` field.
**Warning signs:** Build error about missing file in `src/assets/images/`.

### Pitfall 5: Features image not typed in Project interface

**What goes wrong:** TypeScript error when trying to put `igive-features.png` on project object.
**Why it happens:** The current `Project` interface has `gallery?: { src: ImageMetadata; alt: string }[]` but no dedicated single `featuresImage` field. The `photoUrl?: string` field exists but is a string, not `ImageMetadata`.
**How to avoid:** Either (a) add `featuresImage?: { src: ImageMetadata; alt: string }` to the interface, or (b) use the first `gallery` entry as the features image. Option (a) is cleaner given the fixed single-image usage in the template.
**Warning signs:** TypeScript strict mode error on `project.featuresImage`.

### Pitfall 6: Testimonial lookup by `testimonialId`

**What goes wrong:** `testimonials.find()` returns `undefined` because the ID format doesn't match.
**Why it happens:** `testimonialId` field exists in the Project interface but no lookup convention is documented. Current iGive entry has no `testimonialId` set — it's `undefined`.
**How to avoid:** Decide on a simple lookup: store the testimonial inline on the project object OR use `testimonialId` as a string that matches `testimonial.company.toLowerCase()`. Inline storage (add `testimonial?: Testimonial` directly on Project) is simpler and avoids join logic.
**Warning signs:** Testimonial section renders nothing for iGive despite data existing.

## Code Examples

### Dynamic route skeleton

```astro
---
// src/pages/prosjekter/[slug].astro
import type { ImageMetadata } from 'astro';
import { projects, type Project } from '@/config/projects';
import BaseLayout from '@/layouts/BaseLayout.astro';
import { Image } from 'astro:assets';
import Section from '@/components/ui/Section.astro';
import SectionHeader from '@/components/ui/SectionHeader.astro';
import Card from '@/components/ui/Card.astro';
import Button from '@/components/ui/Button.astro';
import Breadcrumbs from '@/components/ui/Breadcrumbs.astro';
import LinkWithArrow from '@/components/ui/LinkWithArrow.astro';

export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

interface Props {
  project: Project;
}

const { project } = Astro.props;
---

<BaseLayout title={project.metaTitle} description={project.metaDescription}>
  <main>
    <!-- Sections follow the locked order from CONTEXT.md -->
  </main>
</BaseLayout>
```

### Adding `featuresImage` to Project interface

```typescript
// src/config/projects.ts — interface addition
export interface Project {
  // ... existing fields ...
  featuresImage?: { src: ImageMetadata; alt: string };
}

// Import at top of file
import iGiveFeaturesImage from '@/assets/images/igive-features.png';
import blomFeaturesImage from '@/assets/images/blom-features.png';

// On iGive project entry:
featuresImage: { src: iGiveFeaturesImage, alt: 'Skjermbilde av iGive-plattformens funksjoner' },

// On Blom Company project entry:
featuresImage: { src: blomFeaturesImage, alt: 'Skjermbilde av Blom Company nettbutikk' },
```

### Testimonial lookup — recommended inline approach

```typescript
// src/config/projects.ts — add Testimonial import and inline field
import type { Testimonial } from '@/config/testimonials';

export interface Project {
  // ... existing fields ...
  testimonial?: Testimonial;
}
```

Then in `[slug].astro`:
```astro
{project.testimonial && (
  <Section>
    <Card padding="lg" class="reveal-on-scroll mx-auto max-w-3xl">
      <blockquote class="text-xl italic leading-relaxed">
        "{project.testimonial.quote}"
      </blockquote>
      <p class="mt-4 text-text-muted">{project.testimonial.result}</p>
      <footer class="mt-6">
        <p class="font-semibold">{project.testimonial.name}</p>
        <p class="text-sm text-text-muted">
          {project.testimonial.title}, {project.testimonial.company}
        </p>
      </footer>
    </Card>
  </Section>
)}
```

### Tech stack badges (Claude's discretion — recommended badge style)

```astro
<div class="flex flex-wrap gap-3">
  {project.techStack.map((tech) => (
    <span class="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
      {tech}
    </span>
  ))}
</div>
```

### Features list

```astro
<ul class="mt-6 grid gap-3 sm:grid-cols-2">
  {project.features?.map((feature, i) => (
    <li class={`reveal-on-scroll reveal-stagger-${(i % 4) + 1} flex items-start gap-3`}>
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-brand" ...checkmark icon... />
      <span>{feature}</span>
    </li>
  ))}
</ul>
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Individual page files per project | Single `[slug].astro` dynamic route | Scales to additional projects without new files |
| Hardcoded scores in `Results.astro` | Verified scores stored in `projects.ts` data | Single source of truth, easy to update |
| `delay-N` for all stagger | `reveal-stagger-N` for scroll-reveal stagger | `reveal-stagger-N` classes are defined in global.css; `delay-N` is a Tailwind `transition-delay` utility — use each for its intended purpose |

**Current data state:**
- iGive: all content fields populated (`challenge`, `solution`, `features`, `metrics`)
- Blom Company: only `metrics` and `techStack` are populated — `challenge`, `solution`, `features`, `testimonial` must be written and added

## Open Questions

1. **Testimonial storage: inline on project or via `testimonialId` lookup?**
   - What we know: `testimonials.ts` has iGive entry; iGive project entry has no `testimonialId` set; Blom Company has no testimonial entry
   - What's unclear: Whether the planner should add `testimonial` field inline on Project, or set `testimonialId` and do a lookup
   - Recommendation: Inline approach — add `testimonial?: Testimonial` directly on Project interface. Avoids join logic and keeps data co-located with project. Eliminates the `testimonials.ts` indirection entirely for case study pages (homepage `Testimonials.astro` uses the array directly and can stay unchanged).

2. **Blom Company testimonial copy**
   - What we know: "Begge prosjekter har ekte kundesitat klart" (from CONTEXT.md)
   - What's unclear: The actual quote text is not in any file — it must come from the user/client
   - Recommendation: Planner should note this as a content dependency. If not provided, use a realistic placeholder that can be swapped. Do not block build on this.

3. **Dual-collection story for Blom Company**
   - What we know: SIDE-02 requires mentioning "dual-collection story" (livsstil + golf) in the solution section
   - What's unclear: Exact wording — this is Claude's discretion per CONTEXT.md
   - Recommendation: Write solution copy that explicitly names both collections and their distinction (lifestyle casual + golf performance wear).

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `src/config/projects.ts` — interface verified, data state confirmed
- Direct code inspection of `src/config/testimonials.ts` — one iGive entry confirmed
- Direct code inspection of `src/components/ui/` — all referenced components verified
- Direct code inspection of `src/styles/global.css` — `reveal-on-scroll`, `reveal-stagger-N` patterns confirmed
- Direct glob of `src/assets/images/` — all four required images confirmed present
- Direct code inspection of `src/layouts/BaseLayout.astro` — `pageLabels` confirmed for both slugs
- `.planning/STATE.md` — Lighthouse scores confirmed (iGive: 96/96/100/100; Blom: 99/96/100/100)

### Secondary (MEDIUM confidence)
- CONTEXT.md — user decisions, locked architecture, section order

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; no new dependencies
- Architecture: HIGH — dynamic route pattern is standard Astro; all components verified in codebase
- Pitfalls: HIGH — identified from direct code inspection (missing fields, ID lookup ambiguity)
- Content (Blom Company copy): LOW — actual copy must be authored; only structure is researched

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (stable stack, no fast-moving dependencies)
