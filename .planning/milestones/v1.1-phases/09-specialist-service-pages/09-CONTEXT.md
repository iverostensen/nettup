# Phase 9: Specialist Service Pages - Context

**Gathered:** 2026-03-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Build four specialist service pages: `/tjenester/webapp`, `/tjenester/seo`, `/tjenester/ai`, and `/tjenester/vedlikehold`. Each page follows the Phase 8 pattern (Hero → [Prosess for webapp] → Inkludert → FAQ → CTA) with outcome-first, non-technical Norwegian content and 500+ words. Cross-linking and schema validation are Phase 10.

</domain>

<decisions>
## Implementation Decisions

### Page structure
- All 4 pages: same base pattern as Phase 8 (index.astro + _sections/ folder with Hero, Inkludert, FAQ, CTA)
- Webapp gets an **additional Prosess section** inserted between Hero and Inkludert — no other pages get this
- All other pages: standard Hero → Inkludert → FAQ → CTA

### Webapp: prosess-seksjon
- Dedicated process section with 4 steps: **Kartlegging → Prototyp → Bygging → Lansering**
- New section component: `Prosess.astro` in webapp's _sections/
- Placed between Hero and Inkludert
- Steps use plain Norwegian, no technical jargon in primary copy
- Hero text should mention ROI or tidsbesparelse concretely (e.g., "spar X timer per uke" or "lønn seg på 6 måneder")
- Inkludert section: lists **deliverables** (what's included), same pattern as nettside-siden
- Target audience: both SMB and medium-sized businesses — broad framing

### AI-siden: GDPR-innhold
- GDPR content integrated into the **main FAQ section** (not a separate section)
- Key question to answer: "Er AI-løsningen GDPR-compliant?"
- Nettup's position: Vi velger GDPR-vennlige verktøy og hjelper med databehandleravtale (DPA) — kunden gjør sine egne vurderinger
- AI use cases to highlight: chatbot/kundestøtte-automatisering, dokumentbehandling og oppsummering, integrasjoner mellom systemer via AI
- USP vs. no-code (Zapier/Make): vi bygger skreddersydd — ingen caps, ingen begrensninger i scale, håndterer kompleks logikk

### SEO-siden: differensiering og innhold
- USP: konkurransedyktig pris + rask + **moderne SEO OG GEO** (Generative Engine Optimization — SEO for LLM-er som ChatGPT og Perplexity)
- GEO skal nevnes eksplisitt som differensiator — få norske byråer tilbyr dette
- Inkludert-seksjonen: **hva som leveres hver måned** (månedlige leveranser, ikke utfall over tid)
- CTA-knapp: **"Start med en gratis gjennomgang"** (ikke "Få et gratis tilbud")

### Vedlikehold-siden: posisjonering
- Vedlikehold er **obligatorisk** for alle Nettup-prosjekter — ikke valgfritt
- Siden forklarer hva alle Nettup-kunder får i sin månedlige avtale
- Målgruppe: potensielle kunder som vil forstå hva den løpende kostnaden dekker
- CTA-knapp: **"Start med en gratis gjennomgang"**
- Ikke eksplisitt upsell-side — men siden gir naturlig trygghet om at nettsted tas hånd om

### Månedlig prising — kritisk ny funksjonalitet
- **Alle 4 sider skal vise månedlig vedlikeholdsavgift eksplisitt**
- Månedlig kostnad skalerer med kompleksitet (landingsside < nettside < webapp)
- `services.ts` må utvides med `monthlyPrice`-felt for alle tjenester
- Månedlige priser for Phase 9-sidene:
  - webapp: fra 2 500 kr/mnd
  - seo: fra 3 000 kr/mnd (allerede i services.ts som hovedpris — dette er månedlig tjenestepris)
  - ai: fra 1 000 kr/mnd
  - vedlikehold: fra 1 500 kr/mnd (allerede i services.ts)
- Planer for Phase 9 må inkludere oppdatering av services.ts med `monthlyPrice`-felt

### CTA-varianter
- Webapp + AI: **"Få et gratis tilbud"** (engangsprosjekt)
- SEO + vedlikehold: **"Start med en gratis gjennomgang"** (løpende tjenester)
- Alle CTAs pre-fyller `?tjeneste=` param (eksisterende infrastruktur fra Phase 6)

### Claude's Discretion
- Eksakt formulering av ROI-argumentet i webapp Hero
- Antall og rekkefølge av Inkludert-punkter per side
- Nøyaktig FAQ-innhold utover de definerte GDPR-spørsmålene
- Spacing, typography og animasjonsdelay (følger Phase 8-mønsteret)

</decisions>

<specifics>
## Specific Ideas

- Webapp: "Kartlegging → Prototyp → Bygging → Lansering" er de eksakte stegnavnene
- SEO: GEO (Generative Engine Optimization) er en eksplisitt USP — nevn LLM-er (ChatGPT, Perplexity) ved navn
- AI: Chatbot, dokumentbehandling og systemintegrasjoner er de tre primære use cases
- Vedlikehold: siden er ikke en salgs-side for ny funksjonalitet, men en trygghetside for løpende drift
- Månedlig pris må vises tydelig på alle sider — ikke skjult i FAQ

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Section.astro` — wrapper for alle seksjoner (background="raised" eller default)
- `src/components/ui/SectionHeader.astro` — tittel + undertittel per seksjon
- `src/components/ui/Breadcrumbs.astro` — brukes i Hero på alle tjeneste-undersider
- `src/components/ui/Button.astro` — CTA-knapper med href og size props
- `src/config/services.ts` — Service interface + services array; trenger nytt `monthlyPrice`-felt

### Established Patterns
- Page structure: `src/pages/tjenester/{slug}/index.astro` + `_sections/{Hero,Inkludert,FAQ,CTA}.astro`
- Hero: Breadcrumbs + h1 + p (description) + p (price, text-brand) + Button → `/kontakt?tjeneste={slug}`
- Inkludert: grid med checkmark-ikon + h3 + p per punkt (sm:grid-cols-2 md:grid-cols-3)
- FAQ: divide-y liste med h3 + p per spørsmål; FAQPage JSON-LD schema i FAQ.astro
- Service JSON-LD schema i index.astro (Service type med provider, areaServed, offers/priceSpecification)
- Animations: `animate-fade-up` klasser + `reveal-on-scroll delay-N` på grid-items
- `services.find(s => s.slug === '{slug}')!` for å hente service-data i index.astro

### Integration Points
- `services.ts`: legg til `monthlyPrice: number` og `monthlyPriceLabel: string` på Service interface
- Hero.astro: vis månedlig pris under enhetspris (samme `text-brand` stil)
- Alle 4 index.astro-filer: importer fra `@/config/services`, bygg Service + FAQPage JSON-LD

</code_context>

<deferred>
## Deferred Ideas

- Phase 8-sidene (nettside, nettbutikk, landingsside) mangler også månedlig pris — bør legges til, men er Phase 10 scope (eller eget mini-task)
- Månedlige priser for nettside, nettbutikk, landingsside er ikke definert — avklar og legg til i services.ts i en fremtidig fase

</deferred>

---

*Phase: 09-specialist-service-pages*
*Context gathered: 2026-03-05*
