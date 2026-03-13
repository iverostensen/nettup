# Phase 25: Tier 1 innhold - Research

**Researched:** 2026-03-08
**Domain:** Content authoring + JSON-LD schema + footer/kontakt UI edits
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Byer (8 totalt):** Oslo, Bærum, Asker, Sandvika, Drammen, Lillestrøm, Ski, Moss

- Sandvika får egen entry (`/steder/sandvika`)
- Oslo og Bærum eksisterer som stubs — erstatt med ekte innhold i samme omgang som nye byer

**Copywriting-vinkel:**
- Differensiering via lokale nabolag og steder (ikke generisk byttbare bynavn)
  - Oslo nevner Grünerløkka, Majorstuen, Aker Brygge
  - Bærum nevner Sandvika, Bekkestua, Lysaker
  - Drammen nevner Bragernes, Strømsø
- Lengde: 2–3 setninger per intro
- Tone: konsekvent Nettup-tone (profesjonell men tilgjengelig) — variasjon fra stedsnavn, ikke stemme

**FAQ per by:**
- 2–3 spørsmål per by
- Tre temaer: lokal tilstedeværelse, prosess/samarbeid, pris/leveringstid
- Prissvar: nevne startpris (15 000 kr) + link til `/priskalkulator`

**Intern lenking (nearbyAreas) — geografiske klynger, symmetriske lenker:**
- Vestkorridoren: Oslo ↔ Bærum ↔ Asker ↔ Sandvika
- Sørkorridoren: Ski ↔ Moss
- Romerike: Lillestrøm ↔ Oslo
- Drammen: Drammen ↔ Asker
- Alltid symmetrisk — hvis A peker til B, peker B til A
- nearbyAreas inneholder slugs (ASCII): `baerum`, `lillestrom`, etc.

**Footer:**
- Ny kolonne «Områder vi dekker» i footer-kolonneraden
- Innhold: lenkede bynavn for alle 8 Tier 1-byer
- Stil: konsistent med eksisterende footer-kolonner

**Kontaktside:**
- Én setning i eksisterende innhold (ikke ny seksjon)
- Eks: «Vi hjelper bedrifter i hele Oslo-regionen — Oslo, Bærum, Asker, Drammen og mer»

### Claude's Discretion

- Eksakt formulering av intro-tekst og FAQ-svar per by (innenfor tone og lengde-rammene)
- Hvilke nabolag som nevnes per by (innen geografisk logikk)
- Eksakt plassering av setningen på /kontakt
- Service JSON-LD implementering (SEO-01) — teknisk detalj for planner

### Deferred Ideas (OUT OF SCOPE)

Ingen scope creep oppsto — diskusjonen holdt seg innenfor fase-grensen.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONTENT-01 | 6–8 Tier 1 city entries with genuinely differentiated intro copy (≥60% unique per page) | Content authoring for all 8 cities with locally-specific neighborhood references |
| CONTENT-02 | Every city page has a city-specific FAQ section | 2–3 FAQs per city covering local presence, process, and pricing |
| SEO-01 | Each city page emits a `Service` JSON-LD block with `areaServed` referencing the global `LocalBusiness @id` | `[location].astro` head slot + schema pattern from BaseLayout |
| SEO-02 | Each city page has a unique `<title>`, `<meta description>`, and `og:title` | Already handled via `city.metaTitle` / `city.metaDescription` props in BaseLayout — just needs populated fields |
| LINK-01 | Footer has "Områder vi dekker" section listing all Tier 1 cities | New column in `Footer.astro`, same CSS pattern as existing columns |
| LINK-02 | `/kontakt` page mentions Oslo-region and nearby areas coverage | One sentence insertion into existing left-panel copy in `kontakt/index.astro` |
</phase_requirements>

## Summary

Phase 25 is almost entirely a content authoring + schema wiring phase. The infrastructure from Phase 24 is complete: `City` interface, `locations.ts`, and `[location].astro` are all in place and working. The template automatically renders intro, FAQ, nearbyAreas, and CTA — no template changes are required.

The two technical pieces are: (1) injecting a `Service` JSON-LD block per city page via the BaseLayout `<slot name="head" />` in `[location].astro`, and (2) adding a new "Områder vi dekker" column to `Footer.astro`. Both are low-complexity edits with well-understood patterns already in the codebase. The footer currently has a 2-column content grid (`grid-cols-2 md:grid-cols-3`) — adding a fourth column requires changing to `md:grid-cols-4` or adjusting responsive classes.

The dominant task is writing 8 × (intro + 2–3 FAQs + metaTitle + metaDescription) entries in `locations.ts`, plus defining the nearbyAreas cluster map. Correctness of the symmetry constraint (if A → B then B → A) must be validated before commit.

**Primary recommendation:** Do all 8 city entries in a single task on `locations.ts`, verify nearbyAreas symmetry programmatically or visually, then handle footer, kontakt, and JSON-LD as three small follow-up tasks.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro 5 | installed | Static page generation, head slots, `.astro` templates | Already in use |
| TypeScript | strict | `City` interface, `locations.ts` | Project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema.org `Service` type | — | Per-city JSON-LD | Required by SEO-01 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline JSON-LD in `[location].astro` head slot | Global schema in BaseLayout | Per-city schema must be per-page — inline is correct; global would require passing city data up to BaseLayout |

**Installation:** No new packages needed.

## Architecture Patterns

### Recommended Project Structure
No new files or directories required. All changes are in-place edits:

```
src/
├── config/locations.ts          ← 8 city entries (primary work)
├── pages/steder/[location].astro ← Add Service JSON-LD in head slot
├── components/layout/Footer.astro ← Add "Områder vi dekker" column
└── pages/kontakt/index.astro    ← Insert one regional-coverage sentence
```

### Pattern 1: Service JSON-LD per city page

`[location].astro` already passes through a `<slot name="head" />` via BaseLayout. Inject a city-specific `Service` block there:

```astro
<!-- In [location].astro, inside <BaseLayout> -->
<script
  slot="head"
  type="application/ld+json"
  set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Nettside for bedrift i ${city.name}`,
    "provider": {
      "@id": "https://nettup.no/#business"
    },
    "areaServed": {
      "@type": "City",
      "name": city.name
    },
    "url": `https://nettup.no/steder/${city.slug}`
  })}
/>
```

**Key rule (from STATE.md):** Use `"provider": {"@id": "https://nettup.no/#business"}` — never a second `LocalBusiness` block. This references the canonical entity declared in BaseLayout.

### Pattern 2: Footer new column

Current footer grid: `grid grid-cols-2 gap-8 md:grid-cols-3`. Adding a 4th column requires adjusting the responsive breakpoints. The logo/tagline cell spans `col-span-2 md:col-span-1` on mobile. Three content columns currently fit in `md:grid-cols-3`. Adding one more column → `lg:grid-cols-4` (keeping `md:grid-cols-2` to avoid crowding on tablet).

New column structure follows the identical pattern as existing "Sider" and "Kontakt" columns:

```astro
<div>
  <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
    Områder vi dekker
  </h3>
  <nav class="flex flex-col">
    {tier1Cities.map((city) => (
      <a
        href={`/steder/${city.slug}`}
        class="link-underline flex min-h-11 w-fit items-center text-sm text-text-muted transition-colors duration-200 hover:text-brand"
      >
        {city.name}
      </a>
    ))}
  </nav>
</div>
```

Footer should import `cities` and `ACTIVE_TIER` from `@/config/locations` and filter to tier 1 — this makes the footer automatically correct when cities are added later.

### Pattern 3: nearbyAreas symmetry map

The 8 cities and their cluster assignments (from CONTEXT.md):

| City slug | nearbyAreas |
|-----------|-------------|
| `oslo` | `baerum`, `lillestrom` |
| `baerum` | `oslo`, `asker`, `sandvika` |
| `asker` | `baerum`, `sandvika`, `drammen` |
| `sandvika` | `baerum`, `asker`, `oslo` |
| `drammen` | `asker` |
| `lillestrom` | `oslo` |
| `ski` | `moss` |
| `moss` | `ski` |

Symmetry check: Oslo lists baerum → Bærum lists oslo ✓. Oslo lists lillestrom → Lillestrøm lists oslo ✓. Bærum lists sandvika → Sandvika lists baerum ✓. Asker lists sandvika → Sandvika lists asker ✓. Asker lists drammen → Drammen lists asker ✓. Ski lists moss → Moss lists ski ✓. All symmetric.

Note: Sandvika is geographically inside Bærum municipality, but gets its own city entry per the locked decision. Bærum's intro mentions Sandvika as a local area (consistent with the existing stub), and Sandvika's entry can reference its Bærum municipal context.

### Pattern 4: /kontakt sentence placement

The kontakt left-panel has a `<p>` block with trust indicators. The regional coverage sentence fits after the three trust-indicator `<div>`s and before the email alternative block:

```astro
<p class="reveal-on-scroll delay-3 mt-6 text-sm text-text-muted">
  Vi hjelper bedrifter i hele Oslo-regionen — Oslo, Bærum, Asker, Sandvika, Drammen, Lillestrøm, Ski og Moss.
</p>
```

Or it can be placed in the existing `reveal-on-scroll delay-3` email-alternative block as a preceding sentence. Either placement is valid — planner decides.

### Pattern 5: metaTitle and metaDescription format

Existing stubs establish the pattern:
- `metaTitle`: `"Nettside for bedrift i {By} | Nettup"` (38–44 chars — well within 60)
- `metaDescription`: 140–160 chars, mentions Nettup + city + key value prop

SEO-02 is satisfied automatically once every city entry has unique `metaTitle` and `metaDescription` — BaseLayout already passes these as `title` and `description` props which set `<title>`, `<meta name="description">`, and `og:title`/`og:description`.

### Anti-Patterns to Avoid

- **Second LocalBusiness block per city page:** Never add a new `LocalBusiness` schema on city pages — use `Service` with `provider: {"@id": ".../#business"}` only.
- **Non-symmetric nearbyAreas:** If Oslo points to Bærum, Bærum must point to Oslo. Missing reciprocal links are an SEO coherence issue and break the pill UI on the other city's page.
- **City-name swap boilerplate:** CONTENT-01 requires ≥60% unique copy. Simply replacing "Oslo" with "Drammen" in the same template text fails this requirement.
- **Hard-coding city list in Footer:** Import from `locations.ts` filtered by tier, don't duplicate the list. This prevents future sync issues when Tier 2 cities are added.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-city schema injection | Custom schema component | `<script slot="head" type="application/ld+json" set:html={...} />` in `[location].astro` | Astro's head slot is the correct mechanism; already works in BaseLayout |
| City list in footer | Hard-coded `<a>` tags | `cities.filter(c => c.tier <= ACTIVE_TIER)` from `locations.ts` | Single source of truth already exists |

**Key insight:** All infrastructure exists. The work is content authoring and two small template edits.

## Common Pitfalls

### Pitfall 1: FAQ schema missing (SEO-01 adjacent)

**What goes wrong:** The `[location].astro` template renders `<details>/<summary>` FAQ elements visually, but doesn't emit `FAQPage` JSON-LD. This isn't required by SEO-01 (which only asks for `Service` schema), but the seo-geo-audit skill flags missing FAQ schema as a WARN. Consider adding `FAQPage` JSON-LD alongside the `Service` block.

**How to avoid:** Add a second JSON-LD block in the head slot:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```
Built dynamically from `city.faq`. This is in Claude's Discretion (planner can include or defer).

**Warning signs:** seo-geo-audit WARN on FAQ schema if omitted.

### Pitfall 2: Footer grid breaks on tablet

**What goes wrong:** The current footer uses `md:grid-cols-3`. Adding a 4th column and using `md:grid-cols-4` causes the logo+tagline cell and three content columns to render too narrow on 768px viewports.

**How to avoid:** Use `lg:grid-cols-4` (1024px+) for the 4-column layout. At `md` (768px), keep `md:grid-cols-2`. The logo cell with `col-span-2 md:col-span-1` needs review — on `lg:grid-cols-4` it should become `lg:col-span-1`.

**Warning signs:** Test at 768px. Columns should not be under ~150px wide.

### Pitfall 3: Slug typos breaking nearbyAreas pills

**What goes wrong:** A typo in a nearbyAreas slug (e.g., `lilestrom` instead of `lillestrom`) causes `cities.find(c => c.slug === area)` to return `undefined`, falling back to the raw slug as the pill label.

**How to avoid:** Cross-check every nearbyAreas slug against the `slug` fields in the final city entries before committing. The slug convention is documented at the top of `locations.ts`.

**Warning signs:** Pill displays raw ASCII slug instead of the Norwegian display name.

### Pitfall 4: Sandvika intro duplicating Bærum content

**What goes wrong:** Since Sandvika is geographically part of Bærum, the intros risk becoming too similar. Bærum's existing stub already mentions Sandvika.

**How to avoid:** Bærum's intro focuses on the municipality broadly (Bekkestua, Lysaker, Fornebu in addition to Sandvika). Sandvika's intro focuses on Sandvika as a commercial center — Sandvika Storsenter, proximity to E18, business district character. Keep the geographic fact (it's part of Bærum) but differentiate the framing.

## Code Examples

### City entry shape (complete example for a new city)

```typescript
// Source: src/config/locations.ts (existing interface)
{
  tier: 1,
  slug: 'drammen',
  name: 'Drammen',
  intro:
    'Nettup leverer profesjonelle nettsider til bedrifter i Drammen. Fra Bragernes torg til Strømsø hjelper vi lokale bedrifter med å bygge en digital profil som skaper tillit og tiltrekker kunder. Vi leverer raskt og uten unødvendig byråkrati.',
  faq: [
    {
      question: 'Holder dere til i Drammen?',
      answer:
        'Vi jobber digitalt og hjelper bedrifter i hele Drammen-regionen. Møter tas på video, og vi er vant til å levere gode resultater uten at du trenger å møte oss fysisk.',
    },
    {
      question: 'Hvordan samarbeider dere med bedrifter i Drammen?',
      answer:
        'Vi starter med en kortsamtale der vi kartlegger dine behov og mål. Deretter leverer vi et konkret tilbud innen 24 timer. Alt arbeid skjer digitalt, med deg som aktiv godkjenner underveis.',
    },
    {
      question: 'Hva koster en nettside for bedrifter i Drammen?',
      answer:
        'En bedriftsnettside starter fra 15 000 kr. Prisen avhenger av funksjonalitet og omfang. Bruk vår <a href="/priskalkulator">priskalkulator</a> for et raskt estimat tilpasset dine behov.',
    },
  ],
  nearbyAreas: ['asker'],
  metaTitle: 'Nettside for bedrift i Drammen | Nettup',
  metaDescription:
    'Nettup lager profesjonelle nettsider for bedrifter i Drammen. Rask levering, moderne design og synlighet lokalt. Ta kontakt for en gratis prat.',
},
```

### Service JSON-LD injection in [location].astro

```astro
<BaseLayout title={city.metaTitle} description={city.metaDescription}>
  <script
    slot="head"
    type="application/ld+json"
    set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": `Nettside for bedrift i ${city.name}`,
      "provider": { "@id": "https://nettup.no/#business" },
      "areaServed": { "@type": "City", "name": city.name },
      "url": `https://nettup.no/steder/${city.slug}`
    })}
  />
  <!-- optional FAQPage block -->
  <script
    slot="head"
    type="application/ld+json"
    set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": city.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": { "@type": "Answer", "text": item.answer }
      }))
    })}
  />
  <main>
    <!-- existing template unchanged -->
  </main>
</BaseLayout>
```

Note: FAQ answers that contain HTML links (`<a href=...>`) should be stripped of HTML tags in the `FAQPage` JSON-LD `text` field — plain text only for schema.

### Footer column addition

```astro
---
// Add to Footer.astro frontmatter:
import { cities, ACTIVE_TIER } from '@/config/locations';
const tier1Cities = cities.filter((c) => c.tier <= ACTIVE_TIER);
---

<!-- Change outer grid from md:grid-cols-3 to lg:grid-cols-4 -->
<div class="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4">
  <!-- existing logo cell: col-span-2 md:col-span-1 lg:col-span-1 -->
  <!-- existing Sider column unchanged -->
  <!-- existing Kontakt column unchanged -->
  <!-- NEW: Områder vi dekker -->
  <div>
    <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted">
      Områder vi dekker
    </h3>
    <nav class="flex flex-col">
      {tier1Cities.map((city) => (
        <a
          href={`/steder/${city.slug}`}
          class="link-underline flex min-h-11 w-fit items-center text-sm text-text-muted transition-colors duration-200 hover:text-brand"
        >
          {city.name}
        </a>
      ))}
    </nav>
  </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate `LocalBusiness` per city page | Single `LocalBusiness @id` + `Service` with `provider` reference | Standard practice 2023+ | Avoids Knowledge Graph entity dilution |
| Hard-coded schema in each page | Dynamic schema from city data | Always correct in Astro | Single source of truth |

**Deprecated/outdated:**
- Duplicate `LocalBusiness` blocks per city: Dilutes the Knowledge Graph entity. Google may merge or suppress competing declarations. Use `Service + provider @id` pattern only.

## Open Questions

1. **FAQPage JSON-LD: include or defer to Phase 26?**
   - What we know: SEO-01 only requires `Service` schema. FAQPage is a bonus for GEO extractability.
   - What's unclear: Whether the planner should include FAQPage as part of Phase 25's SEO-01 implementation or leave it as a follow-up.
   - Recommendation: Include it — it's 5 lines of additional JSON-LD using data already available, and it satisfies the seo-geo-audit skill's criteria. Zero added risk.

2. **`<a>` tags in FAQ answers for priskalkulator link**
   - What we know: The City interface stores `answer` as `string`. The priskalkulator link (`<a href="/priskalkulator">`) will render as visible HTML in `<details>/<summary>` — which is correct for the page. However, the JSON-LD FAQPage schema's `acceptedAnswer.text` must be plain text.
   - Recommendation: Store answers as plain text in `locations.ts`. Render the priskalkulator reference as a separate sentence or use `set:html` in the template for the anchor. Planner should decide on the data model — simplest is plain text with the URL spelled out: "Bruk priskalkulator på nettup.no/priskalkulator for et estimat."

## Sources

### Primary (HIGH confidence)
- `/Users/iverostensen/nettup/src/config/locations.ts` — City interface, existing stubs, slug convention
- `/Users/iverostensen/nettup/src/pages/steder/[location].astro` — Template structure, head slot availability, nearbyAreas rendering
- `/Users/iverostensen/nettup/src/components/layout/Footer.astro` — Current grid structure, column CSS patterns
- `/Users/iverostensen/nettup/src/layouts/BaseLayout.astro` — `@id` of LocalBusiness, head slot mechanism, existing schema blocks
- `/Users/iverostensen/nettup/src/pages/kontakt/index.astro` — Left-panel structure, insertion point for regional sentence
- `.planning/phases/25-tier-1-innhold/25-CONTEXT.md` — All locked decisions
- `.planning/REQUIREMENTS.md` — Phase requirement definitions
- `.planning/STATE.md` — Key architectural decisions (JSON-LD pattern, symmetry rule)

### Secondary (MEDIUM confidence)
- schema.org Service type pattern with `provider @id` — standard practice confirmed by STATE.md research notes

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies, everything already in place
- Architecture: HIGH — patterns verified directly in source files
- Pitfalls: HIGH — identified from direct code reading (footer grid, slug matching, JSON-LD rules)

**Research date:** 2026-03-08
**Valid until:** 2026-06-08 (stable codebase, no external API dependencies)
