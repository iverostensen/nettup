# Phase 26: SEO og intern lenking - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Fullføre JSON-LD-dekning (LocalBusiness areaServed + per-by LocalBusiness), sitemap-prioriteringer for /steder/*, CI-verifisering av sitemap-dekning, og dokumentere V2-promoteringskriterier. Footer og per-by metadata er allerede implementert fra Phase 25.

</domain>

<decisions>
## Implementation Decisions

### LocalBusiness JSON-LD
- Oppdater `areaServed`-arrayen i BaseLayout.astro til å inkludere alle aktive tier-1 byer dynamisk
- Importer `cities` og `ACTIVE_TIER` fra `locations.ts` — filtrer på tier, slik at nye byer automatisk inkluderes uten manuell oppdatering
- I tillegg: legg til en per-by `LocalBusiness`-blokk på hver byside (`[location].astro`) med byspesifikk kontekst
- Eksisterende `Service` + `FAQPage` JSON-LD per byside beholdes

### Sitemap-prioritet
- `/steder/` oversiktsside: `priority: 0.9`, `changefreq: 'monthly'`
- `/steder/*` individuelle bysider: `priority: 0.8`, `changefreq: 'monthly'`
- Legg til regler i `astro.config.mjs` sitemap `serialize()`-funksjonen

### V2-promoteringskriterier
- Primærkriterium: ≥10 organiske inntrykk i Google Search Console per måned for bysiden
- Vurderes individuelt per by — Oslo kan promoteres til tier 2 uavhengig av andre byer
- Dokumenteres som JSDoc-kommentar direkte i `locations.ts` over `ACTIVE_TIER`-konstanten

### Sitemap-verifisering (LINK-03)
- CI-test: eget step i eksisterende GitHub Actions workflow (ikke ny fil)
- Etter `npm run build`: grep distmappen for sitemap og sjekk at alle `/steder/*`-URLer er til stede
- Testen feiler bygget hvis en aktiv byside mangler fra sitemap

</decisions>

<specifics>
## Specific Ideas

- LocalBusiness dynamisk import: `cities.filter(c => c.tier <= ACTIVE_TIER).map(c => ({ "@type": "City", "name": c.name }))` — konsistent med `getStaticPaths()` logikken i `[location].astro`
- CI-steg: `grep -c "steder/" dist/sitemap*.xml` eller sjekk mot antall forventede URLer fra `ACTIVE_TIER`-filtrering

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `cities` + `ACTIVE_TIER` fra `src/config/locations.ts`: brukes allerede i `[location].astro` og `Footer.astro` — samme mønster for BaseLayout
- `Service` + `FAQPage` JSON-LD i `[location].astro` (linje 28-48): mal for ny per-by LocalBusiness-blokk
- Eksisterende sitemap `serialize()` i `astro.config.mjs`: legg til `/steder/`-regler etter blogg-reglene

### Established Patterns
- JSON-LD legges inn via `<script is:inline slot="head" type="application/ld+json">` i `.astro`-filer
- `BaseLayout.astro` har allerede `LocalBusiness` med hardkodet `areaServed: ["Oslo", "Oslo-området", "Norway"]` — erstatt med dynamisk array
- `getStaticPaths()` filtrerer på `city.tier <= ACTIVE_TIER` — bruk samme logikk i BaseLayout import

### Integration Points
- `src/layouts/BaseLayout.astro`: oppdater `LocalBusiness.areaServed`
- `src/pages/steder/[location].astro`: legg til per-by LocalBusiness-blokk
- `astro.config.mjs`: legg til sitemap-regler for /steder/
- `.github/workflows/` (eksisterende CI): legg til sitemap-grep-steg

</code_context>

<deferred>
## Deferred Ideas

Ingen — diskusjonen holdt seg innenfor phase-scope.

</deferred>

---

*Phase: 26-seo-og-intern-lenking*
*Context gathered: 2026-03-08*
