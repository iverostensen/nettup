# Phase 25: Tier 1 innhold - Context

**Gathered:** 2026-03-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Fylle ut 6–8 Tier 1 city-entries i `locations.ts` med unikt, håndskrevet innhold — intro-tekst, FAQ og nearbyAreas for hver by. Oppdatere footer med "Områder vi dekker"-kolonne og /kontakt med én setning om regional dekning. JSON-LD og per-by metadata er inkludert i kravsettet (SEO-01, SEO-02). Ny funksjonalitet (f.eks. filtrering, søk, kartet) er ikke i scope.

</domain>

<decisions>
## Implementation Decisions

### Byer (8 totalt)
- Oslo, Bærum, Asker, Sandvika, Drammen, Lillestrøm, Ski, Moss
- Sandvika får **egen entry** (`/steder/sandvika`) — folk søker på Sandvika som stedsbegrep
- Oslo og Bærum eksisterer som stubs — **erstatt med ekte innhold** i samme omgang som nye byer

### Copywriting-vinkel
- Differensiering via **lokale nabolag og steder** (ikke generisk byttbare bynavn)
  - Eksempel: Oslo nevner Grünerløkka, Majorstuen, Aker Brygge
  - Bærum nevner Sandvika, Bekkestua, Lysaker
  - Drammen nevner Bragernes, Strømsø
- Lengde: **2–3 setninger** per intro
- Tone: **konsekvent Nettup-tone** gjennom alle byer (profesjonell men tilgjengelig) — variasjon kommer fra stedsnavn, ikke stemme

### FAQ per by
- **2–3 spørsmål per by**
- Dekker tre temaer:
  1. Lokal tilstedeværelse («Holder dere til i X?»)
  2. Prosess og samarbeidsmåte («Hvordan jobber dere med bedrifter i X?»)
  3. Pris og leveringstid
- Prissvar: **nevne startpris (15 000 kr) + link til priskalkulator** — konkret uten å binde
- Hvert spørsmål skal føles genuint lokalt, ikke som bytte av plassholder-navn

### Intern lenking (nearbyAreas)
- Struktur: **geografiske klynger**, symmetriske lenker
  - Vestkorridoren: Oslo ↔ Bærum ↔ Asker ↔ Sandvika
  - Sørkorridoren: Ski ↔ Moss
  - Romerike: Lillestrøm ↔ Oslo
  - Drammen: Drammen ↔ Asker (nærmeste Tier 1-nabo)
- Alltid **symmetrisk** — hvis A peker til B, peker B til A
- nearbyAreas inneholder slugs (ASCII): `baerum`, `lillestrom`, etc.

### Footer — "Områder vi dekker"
- **Ny kolonne** i footer-kolonneraden (ved siden av Tjenester, Selskapet, Kontakt)
- Overskrift: «Områder vi dekker»
- Innhold: lenkede bynavn for alle 8 Tier 1-byer
- Stil: konsistent med eksisterende footer-kolonner (ingen ekstra pynting)
- Bygger på eksisterende footer-struktur i `src/components/layout/Footer.astro`

### Kontaktside
- **Én setning** i eksisterende innhold (ikke ny seksjon)
- Eksempel: «Vi hjelper bedrifter i hele Oslo-regionen — Oslo, Bærum, Asker, Drammen og mer»
- Plassering: naturlig i eksisterende tekstinnhold på /kontakt

### Claude's Discretion
- Eksakt formulering av intro-tekst og FAQ-svar per by (innenfor tone og lengde-rammene)
- Hvilke nabolag som nevnes per by (innen geografisk logikk)
- Eksakt plassering av setningen på /kontakt
- Service JSON-LD implementering (SEO-01) — teknisk detalj for planner

</decisions>

<specifics>
## Specific Ideas

- Sandvika nevnes allerede i Bærum-stubs intro — dette bør videreføres i Bærum-entry og forsterkes i Sandvika sin egen entry
- Priskalkulator-referansen i FAQ-svar bør lenke til `/priskalkulator`

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `City` interface i `src/config/locations.ts`: ferdig definert med alle nødvendige felter (`intro`, `faq[]`, `nearbyAreas[]`, `metaTitle`, `metaDescription`, `industries?`)
- `[location].astro`: renderer automatisk alle City-felter — bare datainnfylling trengs, ingen template-endringer
- `nearbyAreas`-rendering: eksisterende pill-komponent lenker til `/steder/{slug}` — fungerer så lenge slugs er ASCII

### Established Patterns
- Slug-konvensjon dokumentert i toppen av `locations.ts`: `æ → ae`, `ø → o`, `å → a`, mellomrom → bindestrek
- Footer-kolonner: eksisterende struktur i `Footer.astro` — ny kolonne følger samme mønster
- `ACTIVE_TIER = 1` konstant styrer hvilke entries som bygges — endres ikke i denne fasen

### Integration Points
- Footer (`src/components/layout/Footer.astro`): ny "Områder vi dekker"-kolonne legges til
- `/kontakt`-side: én setning om regional dekning
- `locations.ts`: 8 komplette city-entries (2 oppdatert fra stubs + 6 nye)

</code_context>

<deferred>
## Deferred Ideas

- Ingen scope creep oppsto — diskusjonen holdt seg innenfor fase-grensen

</deferred>

---

*Phase: 25-tier-1-innhold*
*Context gathered: 2026-03-08*
