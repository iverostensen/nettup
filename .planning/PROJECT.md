# Nettup.no

## What This Is

Nettup er et norsk webyrå som bygger profesjonelle nettsider for lokale småbedrifter. Nettsiden er yråets eget utstillingsvindu — selve produktet vi selger skal gjenspeiles i kvaliteten på denne siden. Besøkende skal ha lyst til å ta kontakt etter å ha sett hva vi kan.

## Core Value

En potensiell kunde som lander på siden skal umiddelbart forstå at Nettup leverer moderne nettsider raskt — og at kvaliteten beviser det.

## Requirements

### Validated

- ✓ 5 sider bygget og fungerende (/, /tjenester, /om-oss, /prosjekter, /kontakt) — existing
- ✓ Kontaktskjema fungerer via Formspree — existing
- ✓ Mobilresponsivt design — existing
- ✓ Grunnleggende tilgjengelighet (focus states, reduced motion, semantic HTML) — existing
- ✓ Sitemap, robots.txt, JSON-LD schema — existing
- ✓ OG-bilde konfigurert — existing

### Active

- [ ] Definert og konsistent merkevareidentitet (visuelle verdier, personlighet, tone)
- [ ] Visuell profil som skiller seg ut — ikke generisk, ikke template-aktig
- [ ] Animasjoner som demonstrerer teknisk kompetanse og er presise og formålstjenlige
- [ ] SEO-optimalisering for norske småbedrifter (on-page, lokal SEO, metadata)
- [ ] UX/UI-forbedringer som øker konvertering mot kontaktskjema
- [ ] Tydelig verdiforslag på landingssiden: "rask levering + moderne teknologi"

### Out of Scope

- Blogg/innholdsmarkedsføring — for mye vedlikehold, ikke kjerneprodukt
- E-handel eller booking — ikke relevant for en presentasjonsside
- Flerspråklig støtte — norsk er primærmarked, engelsk ikke nødvendig nå

## Context

- **Stack:** Astro 5 + Tailwind 4 + React islands + Framer Motion
- **Tier 3 (Expressive):** Animasjoner og React er tillatt — dette er showpiece
- **Målgruppe:** Norske lokale småbedrifter som trenger nettside, ikke teknisk innsikt
- **Posisjonering:** Rask levering + genuint moderne teknologi (ikke templates, ikke treg byråprosess)
- **Konverteringsmål:** Besøkende → kontaktskjema
- **Merkevaren er udefinert** — visuell identitet og personlighet må etableres, deretter implementeres konsistent

## Constraints

- **Språk:** Norsk (bokmål) — all innhold på norsk
- **Performance:** LCP < 2s tross animasjoner
- **Accessibility:** `prefers-reduced-motion` må respekteres
- **Stack:** Ingen nye avhengigheter uten god grunn

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Merkevareidentitet defineres før visuell implementering | Alt annet (farger, animasjoner, copy) følger av brand | — Pending |
| Animasjoner: balanse mellom show-off og presisjon | Demonstrerer kompetanse uten å virke overdrevet | — Pending |

---
*Last updated: 2026-03-03 after initialization*
