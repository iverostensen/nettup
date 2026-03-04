# Phase 7: Tjenesteoversikt - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign `/tjenester` fra gammel 3-pakkeside (Enkel/Standard/Premium) til en tjenestekatalog med 7 servicekort. Hver kort lenker til sin underside. Sider under `/tjenester/*` er egne faser.

</domain>

<decisions>
## Implementation Decisions

### Grid og gruppering
- Gruppert layout med kategoriheader over hver gruppe — ikke flat grid
- **Gruppe 1: "Nettsteder & Applikasjoner"** — Nettside, Nettbutikk, Landingsside, Webapp (4 kort)
- **Gruppe 2: "Løpende tjenester"** — SEO, AI-løsning, Vedlikehold (3 kort)
- Desktop: 4 kolonner for gruppe 1, 3 kolonner for gruppe 2
- Mobil: én kolonne

### Kortinnhold
- Heroicons-ikon per tjeneste (linjestil, én unik ikon per tjeneste)
- Tjenestenavn
- Tagline (én setning — outcome-fokusert)
- Description fra services.ts (1-2 setninger)
- Prisintervall fra services.ts
- "Les mer"-knapp → `/tjenester/[slug]`
- Hele kortet er klikkbart (Card.astro med `href`) OG dedikert "Les mer"-knapp inne i kortet

### Fremhevede kort
- Nettside og Nettbutikk markeres som hoved-tjenester med visuell fremheving
- Brand-farget kant (border-brand) — samme mønster som gjeldende "mest populær"-badge i Pakker.astro

### Gjenstående seksjoner
- **Fjernes**: Pakker, Inkludert, Support (alle knyttet til utdatert pakkesystem)
- **Beholdes**: TjenesterCTA i bunnen
- **Omskrives**: FAQ — ny innhold tilpasset tjenestekatalog (ikke pakker), f.eks. "Hva om jeg trenger flere tjenester?" og "Hva er inkludert i alle oppdrag?"

### Claude's Discretion
- Hvilken spesifikk Heroicons-ikon tildeles hvilken tjeneste
- Nøyaktig visuell behandling av fremhevede kort (badge vs kant vs begge)
- FAQ-spørsmål og -svar (ny innhold, men tone og stil følger eksisterende FAQ)
- Innholdsrekkefølge innen grupper

</decisions>

<specifics>
## Specific Ideas

- Tjenestene har en naturlig inndeling brukeren selv beskrev: "main services and additional" — dette blir gruppe-strukturen
- "Les mer" er bevisst lavterskel CTA — ikke "Kom i gang" (det er for direkte konvertering, passer bedre på undersider)
- Mønster for fremheving av Nettside/Nettbutikk: hent inspirasjon fra gjeldende `pakke.popular` i Pakker.astro

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card.astro` — `as`, `href`, `hover`, `padding` props. Hover-effekter er innebygd (border-brand/30, -translate-y-1). Bruk `as="a"` + `href` for klikkbart kort
- `SectionHeader.astro` — til gruppeheadere (tittel + undertekst)
- `Button.astro` — primary/secondary varianter. "Les mer" = secondary
- `services.ts` — alle 7 tjenester ferdig definert med slug, name, tagline, priceRange, description, ctaParam
- `Pakker.astro` — sjekk `pakke.popular` mønsteret for å se hvordan fremheving er gjort

### Established Patterns
- Reveal-on-scroll via `reveal-on-scroll delay-N` klasser på kortene
- Container/section-mønster: `<section>` → `<div class="container">`
- Ikoner: inline SVG fra Heroicons (24x24, stroke-width="2", stroke="currentColor")

### Integration Points
- `src/pages/tjenester/index.astro` — erstatt Pakker-importen, fjern Inkludert og Support, behold TjenesterCTA
- `src/config/services.ts` — datakilde for alle 7 kort (ferdig fra fase 6)
- Undersider `/tjenester/[slug]` — eksisterer ikke ennå (fase 8-9), men slug-strukturen er klar
- Fjern avhengighet til `@/config/pricing` og `@/config/launchOffer` fra index.astro

</code_context>

<deferred>
## Deferred Ideas

- Ingen — diskusjonen holdt seg innenfor fasegrensen

</deferred>

---

*Phase: 07-tjenesteoversikt*
*Context gathered: 2026-03-04*
