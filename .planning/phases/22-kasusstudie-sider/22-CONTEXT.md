# Phase 22: Kasusstudie-sider - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Bygg `/prosjekter/igive` og `/prosjekter/blom-company` som komplette, produksjonsklare kasusstudie-sider med GEO-optimalisert norsk bokmål-kopi. Begge sider skal ha alle påkrevde seksjoner og verifiserte Lighthouse-scores. SEO-strukturdata og JSON-LD hører til Phase 23.

</domain>

<decisions>
## Implementation Decisions

### Sidearkitektur
- Én delt `[slug].astro` dynamisk route under `src/pages/prosjekter/` — henter data fra `projects.ts` per slug
- Ingen individuelle filer per prosjekt — `[slug].astro` renderer all data fra project-objektet
- Ingen dedikert hero-seksjon — siden starter direkte med breadcrumbs + åpningssammendrag

### Seksjonrekkefølge
Begge sider følger denne faste rekkefølgen:
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

### Innholdsdybde
- Middels dybde — 2–4 avsnitt per seksjon (utfordring, løsning)
- Nok til å fortelle historien og score på GEO-søk, ikke så langt at leseren mister fokus

### Metrics-blokk
- 4 tall-kort i grid: Performance, Accessibility, Best Practices, SEO
- Store tall (96, 100 etc.) med kort label under
- Kun Lighthouse-scores — ingen lastehastighet eller andre metrikker
- Kort intro-tekst over blokken, f.eks. «Målt med Google PageSpeed Insights»

### Screenshots/bilder
- Hero-bilde (`igive-hero.png` / `blom-hero.png`): full bredde under åpningssammendrag-teksten
- Features-bilde (`igive-features.png` / `blom-features.png`): inline i løsningsseksjonen
- Bilder brukes kontekstuelt, ikke som galleri
- Alle bilder via `astro:assets` `<Image>` med korrekte `alt`-tekster

### Testimonials
- Bygges i denne fasen — ikke utsatt
- Testimonial-data lagres i `projects.ts` (eget `testimonials`-objekt eller inline i project-entry)
- Visuell stil: stor blockquote med navn + tittel + avatar/prosjektbilde under — card-basert med subtil bakgrunn
- Begge prosjekter har ekte kundesitatat klart

### Claude's Discretion
- Eksakt copy-formulering for utfordring og løsning per prosjekt (basert på eksisterende tekst i projects.ts)
- Testimonial-komponentens interne markup og styling detaljer
- CTA-seksjonens formulering og lenketekst
- Tech stack-seksjonens visuelle presentasjon (badges, liste, eller grid)

</decisions>

<specifics>
## Specific Ideas

- GEO-kravet er eksplisitt: åpningssammendraget må stå selvstendig innen 200 ord slik at en AI-assistent kan sitere det uten ekstra kontekst
- Blom Company-siden skal nevne «dual-collection story» (livsstil + golf) i løsningsseksjonen
- Konkrete, verifiserte tall (Lighthouse-scores, spesifikke tech-versjoner) skal vises i distinct metrics-blokk — ikke bare nevnes i tekst

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card.astro`: padding/hover-varianter — brukes til metrics-kort og testimonial-blokk
- `Section.astro`: wrapper for alle seksjoner — følger eksisterende padding/max-width mønster
- `SectionHeader.astro`: seksjonstittler
- `Button.astro`: CTA-knapper
- `Breadcrumbs.astro`: ferdig komponent, brukes øverst på kasusstudie-sidene
- `LinkWithArrow.astro`: lenke til live side

### Established Patterns
- `astro:assets` `<Image>` for alle bilder — allerede i bruk i ProjectGrid
- `reveal-on-scroll` CSS-klasse med `delay-N` for scroll-animasjoner
- `bg-surface-raised` / `border-white/10` for kort-bakgrunner
- `text-brand` / `bg-brand/10` for accent-elementer

### Integration Points
- `src/config/projects.ts`: all prosjektdata hentes herfra — `challenge`, `solution`, `features`, `metrics`, `techStack`, `gallery`, `testimonialId` er allerede definert i interfacet
- `src/layouts/BaseLayout.astro`: `pageLabels`-map har allerede entries for `/prosjekter/igive` og `/prosjekter/blom-company` (lagt til i Phase 21)
- Bilder tilgjengelig: `igive-hero.png`, `igive-features.png`, `blom-hero.png`, `blom-features.png`

</code_context>

<deferred>
## Deferred Ideas

- JSON-LD `CreativeWork` og `BreadcrumbList` structured data — Phase 23
- SEO-validering og sitemap-sjekk — Phase 23

</deferred>

---

*Phase: 22-kasusstudie-sider*
*Context gathered: 2026-03-07*
