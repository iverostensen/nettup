# Malgrupper og Leadskjema-spesifikasjon

**Dokument:** CAMP-04 + CAMP-05
**Fase:** 39 -- Campaign Strategy Documentation
**Dato:** 2026-03-28
**Status:** Klar for implementering i Meta Ads Manager

---

## 1. Malgrupper (Audience Targeting)

### Lag 1: Kald trafikk (Cold)

**Ads Manager-plassering:** Lagre som "Nettup - Kald SMB" i Saved Audiences.

| Parameter | Verdi |
|-----------|-------|
| Lokasjon | Norge |
| Alder | 25-55 |
| Kjonn | Alle |
| Sprak | Norsk (bokmal) |

**Interesser og atferd (velg ALLE -- OR-logikk innenfor gruppen):**
- Atferd: "Admins of business Pages" (under Business & Industry)
- Atferd: "Admins of new active businesses (6-24 months)" (under Digital Activities > Small business owners)
- Stillingstitler (under Work > Job Title): daglig leder, CEO, grunder, founder, eier, owner, grunlegger, co-founder, bedriftseier, business owner, managing director, administrerende direktor
  (Inkluder bade norske OG engelske varianter -- Facebook stillingstitler er fritekst, ikke standardisert.)

**Estimert rekkevidde:** ~50 000-150 000 (verifiser i Ads Manager for eksakt tall. Norge har ~300 000 SMBer, ~75% Facebook-penetrasjon.)

**Ekskluderinger:**
- Ekskluder eksisterende kunder (legg til manuelt som Custom Audience)
- Ekskluder ansatte i webbyraer (interesse: "Web development" + "Web design" som ekskludering)

---

### Lag 2: Varm trafikk (Warm)

**Ads Manager-plassering:** Opprett som Custom Audiences, lagre som "Nettup - Varm".

| Audience Type | Kilde | Vindu |
|---------------|-------|-------|
| Videoseere | Alle som har sett 50%+ av en video | Siste 30 dager |
| Nettstedsbesokende | Alle som har besekt nettup.no (Meta Pixel) | Siste 30 dager |
| Sideengasjement | Alle som har engasjert seg med Facebook/Instagram-siden | Siste 90 dager |

**Opprett i Ads Manager:**
1. Ga til Audiences > Create Audience > Custom Audience
2. Video: velg "People who watched at least 50% of your video" > siste 30 dager
3. Website: velg "All website visitors" > siste 30 dager (krever Meta Pixel fra Phase 36)
4. Page engagement: velg "Everyone who engaged with your Page" > siste 90 dager

---

### Lag 3: Het trafikk (Hot)

**Ads Manager-plassering:** Opprett som Custom Audiences, lagre som "Nettup - Het".

| Audience Type | Kilde | Vindu |
|---------------|-------|-------|
| Hoy-intensjons-besokende | Besokende pa /priskalkulator, /kontakt, /tjenester/* (URL contains) | Siste 14 dager |
| Skjema-avbrytere | Besokende pa /kontakt som IKKE besekte /takk (ekskluder) | Siste 14 dager |
| Leadskjema-apnere | Apnet leadskjema i Facebook uten a sende inn | Siste 30 dager |

**Opprett i Ads Manager:**
1. Website Custom Audience: URL contains "priskalkulator" OR "kontakt" OR "tjenester" > siste 14 dager
2. For skjema-avbrytere: URL contains "kontakt" > EKSKLUDER URL contains "takk"
3. Lead Form: velg "People who opened but didn't submit your lead form" > siste 30 dager

---

## 2. Leadskjema-spesifikasjon (Lead Form Spec)

### Skjemaoppsett i Ads Manager

**Navn pa skjema:** "Nettup - Gratis tilbud"

**Intro-kort (Context Card) -- ANBEFALT for kvalitet:**
- Overskrift: "Fa et uforpliktende tilbud"
- Brodtekst: "Fyll ut 4 korte felt. Vi tar kontakt innen 5 minutter i arbeidstiden."
- Knapp: "Start"

**Skjemafelt (per D-12, 4 felt):**

| Felt | Type | Pre-fill | Paakrevd |
|------|------|----------|----------|
| Navn | Fornavn + Etternavn | Ja, fra Facebook-profil (per D-13) | Ja |
| E-post | E-postadresse | Ja, fra Facebook-profil (per D-13) | Ja |
| Telefon | Telefonnummer | Ja, fra Facebook-profil (per D-13) | Ja |
| Hva trenger du? | Egendefinert sporsmaal > Flervalg (dropdown) | Nei (kan ikke pre-fylles) | Ja |

**Dropdown-alternativer for "Hva trenger du?" (per D-12):**
1. Nettside
2. Nettbutikk
3. Landingsside
4. Vet ikke enna

**Personvernlenke (paakrevd):** nettup.no/personvern

**Takk-skjerm (per D-14):**
- Overskrift: "Takk!"
- Beskrivelse: "Vi tar kontakt innen 5 minutter i arbeidstiden."
- CTA-knapp: "Besok nettsiden" > lenke til nettup.no/nettside-for-bedrift
- Nedlastingslenke: Ingen (ikke relevant)

### Integrasjon

- Leads leveres til: Facebook-sidens innboks + e-postvarsling (standard)
- Vurder Zapier/Make-integrasjon for CRM-eksport etter 4 uker med data
- Formspree er IKKE koblet til Facebook Lead Forms (separate systemer)

---

## 3. Kampanjestruktur i Ads Manager

### Lag-til-kampanje-mapping

| Malgruppe-lag | Kampanje-malsetning | Anbefalt annonseformat | Budsjett (av 5 000 kr/mnd) |
|---------------|---------------------|------------------------|---------------------------|
| Lag 1 (Kald) | Lead Generation | Video + Lead Form | 3 500 kr (70%) |
| Lag 2 (Varm) | Lead Generation | Karusell + Lead Form | 1 000 kr (20%) |
| Lag 3 (Het) | Conversions / Lead Gen | Statisk bilde + Lead Form | 500 kr (10%) |

### Notat om malgruppestorrelse

- Lag 1 er bred nok for Facebooks algoritme (minimum ~1 000 daglige aktive brukere anbefalt)
- Lag 2 og 3 kan vaere for smale de forste 2-4 ukene. Kombiner dem til en "retargeting"-kampanje hvis samlet storrelse er under 1 000 personer.
- Verifiser faktisk storrelse i Ads Manager > Audiences-oversikten for lansering.
