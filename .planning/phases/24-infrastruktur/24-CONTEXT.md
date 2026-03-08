# Phase 24: Infrastruktur - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Lock `locations.ts` TypeScript interface, URL-struktur, route-skeleton (`src/pages/steder/[location].astro`) og tier-gated `getStaticPaths()`. Verifiser at `npm run build` passerer med stub-entries. Ingen ferdig byinnhold — det er Phase 25.

</domain>

<decisions>
## Implementation Decisions

### Sideoppsett
- Seksjoner: Breadcrumbs → Hero (H1 + intro-avsnitt) → FAQ → Nabobyer/intern lenking → CTA
- Breadcrumbs-komponent øverst (`Hjem → Steder → [By]`) — konsistent med prosjektsider, gir BreadcrumbList JSON-LD
- Hero: by-navn som H1 (`Nettside for bedrift i [By]`), fulgt av intro-avsnitt fra `locations.ts`
- FAQ-seksjon med by-spesifikke spørsmål fra `locations.ts`
- Nabobyer-seksjon med intern lenking til andre bysider — støtter lokal SEO og reduserer bounce
- CTA-seksjon, trolig gjenbruk av eksisterende CTA-komponent

### Datamodell
- `industries` er **valgfri** (`industries?: string[]`) — varierer per by, enklere å legge til byer
- Alle andre felter er påkrevd: `tier`, `slug`, `name`, `intro`, `faq`, `nearbyAreas`, `metaTitle`, `metaDescription`
- `faq` typet som `Array<{ question: string; answer: string }>`
- `tier` typet som `1 | 2 | 3` (tall) for enkel range-filtrering
- Hold interfacet minimalt i V1 — ingen V2/V3-felter nå (YAGNI)
- `ACTIVE_TIER = 1` som eksportert konstant øverst i `locations.ts` — enkel å endre til 2 ved V2-start

### Slug-konvensjon
- Norske spesialtegn: `æ→ae`, `ø→o`, `å→a` (standard norsk romanisering)
- Mellomrom i bynavn: bindestrek (`-`)
- Eksempler: `Bærum→baerum`, `Lillestrøm→lillestrom`, `Ås→as`
- URL-mønster: `/steder/[slug]` — eks. `nettup.no/steder/oslo`, `nettup.no/steder/baerum`
- Konvensjonen dokumenteres som kommentar direkte i `locations.ts` (co-located med data)

### Stub-byer (Phase 24 verifikasjon)
- To stub-entries: **Oslo** (enkel slug, ingen spesialtegn) + **Bærum** (tester `æ→ae`-konvertering)
- Stub-innhold: ekte placeholder-tekst — kortfattet men realistisk, viser hvordan ferdig side ser ut visuelt
- Ikke minimalstubs (`faq: []`) — gir visuell feedback på template-design i Phase 24

### Claude's Discretion
- Nøyaktig komponentstruktur i `[location].astro` (seksjonsinndeling internt)
- Gjenbruk av eksisterende `Section`, `SectionHeader`, `Card`-komponenter der det passer
- Visuell design på nabobyer-seksjonen (tags, liste eller kort?)
- Nøyaktig placeholder-tekst for Oslo og Bærum stub-entries

</decisions>

<specifics>
## Specific Ideas

- Tier-gating via eksportert konstant: `export const ACTIVE_TIER = 1` øverst i `locations.ts` — gjør V2-promotering til én linjeendring
- Slug-konvensjon kommentert i filen slik at fremtidige redaktører vet regelen uten å måtte lese docs

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/prosjekter/[slug].astro`: Eksisterende `getStaticPaths()`-mønster med config-import — direkte mal for `[location].astro`
- `src/components/ui/Breadcrumbs.astro`: Eksisterende Breadcrumbs-komponent — gjenbruk direkte
- `src/components/ui/Section.astro`, `SectionHeader.astro`, `Card.astro`: Tilgjengelige for sidelayout
- `src/layouts/BaseLayout.astro`: Brukes for `<title>`, `<meta>`, canonical og JSON-LD via `<Fragment slot="head">`

### Established Patterns
- Config-drevet statisk generering: `projects.ts → [slug].astro`, `services.ts → tjenester/[slug]` — `locations.ts → steder/[location].astro` følger samme mønster
- JSON-LD injiseres via `<Fragment slot="head">` i sidekomponenten (se `tjenester/nettside/index.astro`)
- Canonical-mønster: settes i BaseLayout via `canonicalUrl`-prop (verifiser i BaseLayout)

### Integration Points
- `src/config/locations.ts` — ny fil, eksporterer `City`-interface, `ACTIVE_TIER`-konstant og `cities`-array
- `src/pages/steder/[location].astro` — ny dynamisk rute, ny mappe `/steder/`
- `@astrojs/sitemap` plukker automatisk opp nye ruter — ingen sitemap-konfig nødvendig for Phase 24

</code_context>

<deferred>
## Deferred Ideas

- Ingen scope creep dukket opp i diskusjonen — discussion holdt seg innenfor Phase 24-grensen

</deferred>

---

*Phase: 24-infrastruktur*
*Context gathered: 2026-03-08*
