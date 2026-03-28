# Google Ads Oppsettguide: Nettside Abonnement

**Kampanje:** Nettside Abonnement (399 kr/mnd)
**Landingsside:** https://nettup.no/nettside-for-bedrift
**Dato:** 2026-03-20

> Denne guiden tar deg gjennom hele prosessen fra Google Ads-konto til en aktiv sokeannonsekampanje. Alle kampanjeverdier (sokord, annonsetekster, assets, budsjett) er dokumentert i Phase 34-filene og refereres direkte herfra.

---

## Forutsetninger

For du starter trenger du:

- **Google-konto** (Gmail eller Google Workspace)
- **Betalingsmetode** (kredittkort eller faktura)
- **Tilgang til nettup.no** (for a verifisere konverteringssporingen med Tag Assistant)
- **Phase 34-dokumenter tilgjengelige:**
  - [keywords.md](../34-google-ads-campaign-docs/keywords.md) (sokord og negativer)
  - [ad-copy.md](../34-google-ads-campaign-docs/ad-copy.md) (overskrifter, beskrivelser, RSA-varianter)
  - [extensions.md](../34-google-ads-campaign-docs/extensions.md) (sitelinks, callouts, strukturerte snippets)
  - [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) (innstillinger, budsjett, budstrategi)

**Har du allerede en Google Ads-konto?** Hopp til Steg 2. Du kan opprette en ny kampanje fra en eksisterende konto uten a opprette ny konto.

---

## Steg 1: Opprett Google Ads-konto

1. Ga til [ads.google.com](https://ads.google.com)
2. Klikk "Start naa" eller "Logg inn"
3. Google vil forsoke a sette opp en Smart-kampanje. **Hopp over dette:**
   - Klikk "Bytt til ekspertmodus" (lenke nederst pa siden)
   - Dette gir deg full kontroll over kampanjeinnstillinger
4. Velg "Opprett en konto uten en kampanje"
5. Bekreft bedriftsinformasjon (tidssone: Oslo, valuta: NOK)
6. Sett opp fakturering under "Verktoy og innstillinger" > "Fakturering og betaling"

> **Tips:** Ikke la Google sette opp en Smart-kampanje for deg. Ekspertmodus gir deg kontroll over nettverk, stedsmaling og budstrategi som er kritiske for kampanjeytelsen.

---

## Steg 2: Sett opp konverteringshandling

Konverteringssporing ma vaere pa plass for kampanjen kan motta data om skjemainnsendinger.

1. Ga til **Mal** > **Konverteringer** > **Sammendrag**
2. Klikk **"+ Ny konverteringshandling"**
3. Velg **"Nettsted"** som kilde
4. Fyll inn folgende:

| Felt | Verdi |
|------|-------|
| Konverteringsnavn | Kontaktskjema B2B |
| Kategori | Lead / Kontakt |
| Verdi | Ikke angi verdi (eller bruk standardverdi) |
| Telling | Hver konvertering |
| Attribusjonsmodell | Datadrevet (standard) |

5. Velg **"Bruk en tag (gtag.js)"** som oppsettmetode
6. Nar Google viser konverteringskoden, bekreft at konverterings-IDen matcher:
   - **Konverterings-ID:** `AW-17409050017`
   - **Konverteringslabel:** `EvwaCNm05eFbEKGLpO1A`

**Viktig:** Du trenger IKKE legge til ny kode pa nettsiden. Konverteringskoden er allerede implementert pa `/nettside-for-bedrift/takk`:

```javascript
window.gtag('event', 'conversion', {
  send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A',
});
```

Du oppretter kun den matchende konverteringshandlingen i Google Ads slik at systemet vet hva det skal lytte etter.

7. Klikk **"Ferdig"** og bekreft at konverteringshandlingen vises som "Aktiv" i oversikten

---

## Steg 3: Opprett kampanje

1. Ga til **Kampanjer** > **"+ Ny kampanje"**
2. Velg mal: **"Potensielle salg"** (Leads)
3. Velg kampanjetype: **"Sok"** (Search)
4. Fyll inn kampanjeinnstillinger:

| Innstilling | Verdi | Handling |
|-------------|-------|----------|
| Kampanjenavn | Nettside Abonnement | Skriv inn navnet |
| Nettverk | Kun Google Sok | **Fjern hake for "Display-nettverk"** og **"Sokepartnere"** |
| Stedsmaling | Norge | Velg "Norge" under steder |
| Stedsalternativ | Tilstedevaerelse | Endre til **"Kun personer som befinner seg i eller jevnlig besokende i omradene dine"** |
| Sprak | Norsk | Velg "Norsk" |
| Annonseplan | Hele dagen | Behold standard (optimaliser etter 2 uker med data) |
| Annonserotasjon | Optimaliser | Velg "Optimaliser: Foretrekk annonser med best ytelse" |

Se [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) for fullstendig oversikt over alle innstillinger.

> **ADVARSEL: Display-nettverk og Sokepartnere.** Google aktiverer disse som standard. Fjern begge hakene. Display-nettverk bruker budsjettet pa bannere med lav kvalitet, og sokepartnere gir sjelden relevante klikk for lokale tjenester.

> **ADVARSEL: Stedsalternativ.** Google bruker som standard "Tilstedevaerelse eller interesse". Dette betyr at annonsen vises for folk som soker OM Norge, ikke bare folk som er I Norge. Endre alltid til "Kun tilstedevaerelse". Tidligere kampanjer viste at dette er kritisk for a unnga irrelevant trafikk.

---

## Steg 4: Annonsegruppe og sokord

### Opprett annonsegruppe

1. Annonsegruppe-navn: **Nettside for Bedrift**
2. Standardbud: **25 NOK**
3. Endelig URL: **https://nettup.no/nettside-for-bedrift**

### Legg inn sokord

Importer sokordene fra [keywords.md](../34-google-ads-campaign-docs/keywords.md):

1. Ga til annonsegruppen "Nettside for Bedrift"
2. Klikk **"Sokord"** i venstremenyen
3. Klikk **"+ Sokord"**
4. Legg inn primaere sokord med **eksakt match** (med hakeparenteser):
   ```
   [nettside for bedrift]
   [nettside abonnement]
   ```
5. Legg inn sekundaere sokord med **frasematch** (med anforselsestegn):
   ```
   "nettside bedrift pris"
   "billig nettside"
   "profesjonell nettside"
   "nettside pris"
   "lage nettside bedrift"
   "hjemmeside bedrift"
   "firmanettside"
   "nettside smabedrift"
   ```
6. Legg inn long-tail-sokord med **frasematch**:
   ```
   "rimelig nettside for bedrift"
   "nettside uten oppstartskostnad"
   "nettside manedspris"
   "enkel nettside bedrift"
   ```

Se [keywords.md](../34-google-ads-campaign-docs/keywords.md) for fullstendig oversikt med volumestimater og CPC.

### Legg inn negative sokord FOR lansering

> **VIKTIG:** Legg inn negative sokord na, ikke etter lansering. Uten negativer kan budsjettet brennes pa irrelevante sok de forste 48 timene.

1. Ga til **Sokord** > **Negative sokord**
2. Klikk **"+ Negative sokord"**
3. Velg kampanjeniva (gjelder alle annonsegrupper)
4. Legg inn alle 16 negative sokord fra [keywords.md](../34-google-ads-campaign-docs/keywords.md):
   ```
   gratis
   free
   wordpress
   wix
   squarespace
   webflow
   selv
   diy
   tutorial
   kurs
   guide
   lare
   jobb
   stilling
   ansatt
   mal
   template
   ```

---

## Steg 5: Opprett annonser (RSA)

Opprett Responsive Search Ads (RSA) fra [ad-copy.md](../34-google-ads-campaign-docs/ad-copy.md).

### Grunnoppsett

- **Endelig URL:** https://nettup.no/nettside-for-bedrift
- **Visningssti 1:** nettside
- **Visningssti 2:** bedrift

### Overskrifter (15 stykker)

Legg inn alle 15 overskriftene fra [ad-copy.md](../34-google-ads-campaign-docs/ad-copy.md). De to viktigste ma pinnes:

| Overskrift | Pinning |
|------------|---------|
| Nettside for Din Bedrift | **Pin til Posisjon 1** |
| 0 kr Oppstart, 399 kr/mnd | **Pin til Posisjon 2** |
| Alle andre (13 stk) | Roterer fritt |

**Hvorfor pinne?** Posisjon 1 sikrer tjenesterelevans i alle visninger. Posisjon 2 sikrer at prisen alltid er synlig. Google optimaliserer resten automatisk.

### Beskrivelser (4 stykker)

Legg inn alle 4 beskrivelsene fra [ad-copy.md](../34-google-ads-campaign-docs/ad-copy.md). Ingen beskrivelser pinnes.

### Opprett 5 RSA-varianter

Opprett alle 5 variantene beskrevet i [ad-copy.md](../34-google-ads-campaign-docs/ad-copy.md):

| Variant | Fokus | Tredje overskrift |
|---------|-------|-------------------|
| A | Prisfokusert | Fra 399 kr i Maneden |
| B | Tillitsfokusert | Ingen Bindingstid |
| C | Funksjonsfokusert | Inntil 5 Sider Inkludert |
| D | Hastighetsfokusert | Klar pa 1-3 Uker |
| E | Verdisammenligning | Rimelig Nettside Losning |

Alle varianter deler pinning av H1 (Posisjon 1) og H2 (Posisjon 2).

**Annonsestyrke-mal:** Sikt mot "God" eller "Utmerket". Hvis styrken er "Darlig", sjekk at du har lagt inn nok unike overskrifter og beskrivelser.

---

## Steg 6: Legg til assets (tidligere "utvidelser")

Google Ads bruker na begrepet "Assets" i stedet for "Annonse-utvidelser". Importer fra [extensions.md](../34-google-ads-campaign-docs/extensions.md).

### Sitelinks (4 stykker)

Ga til **Annonser og assets** > **Assets** > **"+ Asset"** > **Sitelink**

| Sitelink-tekst | URL | Beskrivelse 1 | Beskrivelse 2 |
|----------------|-----|---------------|---------------|
| Skreddersydd Nettside | /tjenester/nettside | Trenger du mer enn 5 sider? | Vi bygger etter dine behov |
| Nettbutikk | /tjenester/nettbutikk | Selg produkter pa nett | Shopify og WooCommerce |
| Landingsside | /tjenester/landingsside | Konverter besokende | Optimalisert for salg |
| Se Vare Prosjekter | /prosjekter | Ekte kundeprosjekter | Se hva vi har levert |

**Merk:** Bruk fullstendige URLer nar du legger inn i Google Ads (f.eks. https://nettup.no/tjenester/nettside).

Sitelinks er oppsalgsstier for besokende som trenger mer enn abonnementstilbudet. De er ikke alternative kampanjemal.

### Callouts (7 stykker)

Ga til **Assets** > **"+ Asset"** > **Callout**

Legg inn folgende callouts:

1. 0 kr Oppstart
2. Ingen Bindingstid
3. 30 Dagers Garanti
4. 24t Respons
5. Klar pa 1-3 Uker
6. SSL og Hosting Inkl.
7. Support Inkludert

### Strukturerte snippets (1 stykk)

Ga til **Assets** > **"+ Asset"** > **Strukturert snippet**

| Header | Verdier |
|--------|---------|
| Tjenester | Bedriftsnettside, Responsivt Design, SEO-optimalisering, Kontaktskjema, SSL-sertifikat |

Se [extensions.md](../34-google-ads-campaign-docs/extensions.md) for tegnantall og fullstendige detaljer.

---

## Steg 7: Budsjett og budstrategi

### Daglig budsjett

Sett daglig budsjett til **100 NOK/dag** (anbefalt startpunkt).

| Scenario | Daglig | Manedlig | Est. klikk/mnd |
|----------|--------|----------|----------------|
| Konservativ | 50 NOK | ~1 500 NOK | 30-50 |
| **Anbefalt** | **100 NOK** | **~3 000 NOK** | **60-120** |
| Aggressiv | 150 NOK | ~4 500 NOK | 100-180 |

### Budstrategi

Velg **Manual CPC** med forbedret CPC aktivert for uke 1-4.

- Standardbud: **25 NOK**
- Maks CPC: Start pa 25 NOK, juster basert pa impressionandel

**Ikke velg "Maksimer konverteringer" eller "Maksimer klikk" i oppstartsfasen.** Uten konverteringsdata gir disse strategiene Google for mye frihet til a bruke budsjettet ineffektivt.

Se [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) for den komplette 3-fase overgangen mellom budstrategier, og appendiksen nederst i denne guiden.

---

## Steg 8: Gjennomgang og lansering

For du aktiverer kampanjen, ga gjennom denne sjekklisten:

### Sjekkliste for lansering

- [ ] **Konverteringshandling** er opprettet og viser status "Aktiv"
- [ ] **Konverterings-ID** matcher: `AW-17409050017`
- [ ] **Konverteringslabel** matcher: `EvwaCNm05eFbEKGLpO1A`
- [ ] **Stedsmaling** er satt til "Kun tilstedevaerelse" (IKKE "Tilstedevaerelse eller interesse")
- [ ] **Display-nettverk** er deaktivert (hake fjernet)
- [ ] **Sokepartnere** er deaktivert (hake fjernet)
- [ ] **Negative sokord** er lagt inn (alle 16 fra keywords.md)
- [ ] **5 RSA-varianter** er opprettet
- [ ] **H1 pinnet til Posisjon 1**, H2 pinnet til Posisjon 2
- [ ] **Assets** er lagt til: 4 sitelinks, 7 callouts, 1 strukturert snippet
- [ ] **Budsjett** er satt til 100 NOK/dag
- [ ] **Budstrategi** er satt til Manual CPC (25 NOK standardbud)
- [ ] **Endelig URL** er korrekt: https://nettup.no/nettside-for-bedrift

Nar alle punkter er bekreftet: klikk **"Publiser kampanje"**.

Se [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) for den fullstendige lanseringssjekklisten.

---

## Steg 9: Verifiseringssjekkliste etter lansering

Gjor disse verifiseringene umiddelbart etter at kampanjen er aktivert:

### 1. Verifiser konverteringssporingen med Google Tag Assistant

1. Installer [Google Tag Assistant](https://tagassistant.google.com/) (Chrome-utvidelse)
2. Besok https://nettup.no/nettside-for-bedrift/takk
3. Bekreft at folgende fyrer:
   - Google Ads konverteringstag med `send_to: 'AW-17409050017/EvwaCNm05eFbEKGLpO1A'`
   - Consent Mode vises som "Advanced" i Tag Assistant

> **Hvis konverteringstagen ikke fyrer:** Sjekk at `gtagLoaded`-variabelen er satt i nettleseren. Apne DevTools (F12) > Console > skriv `window.gtagLoaded` og bekreft at den er `true`.

### 2. Test skjemainnsending

1. Ga til https://nettup.no/nettside-for-bedrift
2. Fyll ut kontaktskjemaet med testdata
3. Bekreft at du blir omdirigert til /nettside-for-bedrift/takk
4. Sjekk Google Ads etter 24 timer: konverteringen skal vises under **Mal** > **Konverteringer**

### 3. Sjekk Consent Mode

1. I Tag Assistant, se etter "Consent Mode: Advanced"
2. Bekreft at gtag-skripted laster med `denied`-standarder og oppdaterer til `granted` etter samtykke
3. Consent Mode v2 gjenoppretter ca. 70% av uobserverte konverteringer gjennom atferdsmodellering

### 4. Sjekk soketermsrapporten

Etter 24-48 timer:
1. Ga til **Sokord** > **Soketermer**
2. Se etter irrelevante soketermer
3. Legg til nye negative sokord hvis nodvendig

---

## Steg 10: Forste ukes overvaking

### Daglige sjekker

| Metrikk | Mal | Handling ved avvik |
|---------|-----|--------------------|
| Forbruk | Rundt 100 NOK/dag | Juster budsjett hvis forbruket er langt under eller over |
| Klikk | 3-6 per dag (ved 100 NOK/dag) | Under 2 klikk/dag: sjekk budniva og sokord |
| Visninger | 50-200 per dag | Under 20: sjekk sokord og stedsmaling |
| CTR | Over 3% | Under 2%: forbedre annonsetekst eller sjekk sokeordrelevans |
| CPC | Under 40 NOK | Over 40 NOK: juster bud ned eller legg til mer spesifikke sokord |
| Konverteringer | Minst 1 i forste uke | 0 etter 7 dager: sjekk konverteringssporing og landingsside |

### Ukentlige handlinger (forste maned)

1. **Gjennomga soketermsrapporten** og legg til nye negative sokord for irrelevante sokefraser
2. **Sjekk impressionandel** (Impression Share). Under 50%: vurder a oke bud eller budsjett
3. **Se pa annonseytelse** for hver RSA-variant. Etter 100+ visninger per variant, vurder a pause varianter med lavest CTR
4. **Kontroller Quality Score** for hvert sokord. Under 5: forbedre relevans mellom sokord, annonsetekst og landingsside

### Optimeringsplan videre

Se [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) for den fullstendige optimaliseringsplanen:

| Frekvens | Handling |
|----------|----------|
| Daglig | Sjekk forbruk, pause ved budsjettoverskridelse |
| Ukentlig (forste maned) | Gjennomga soketermer, legg til negativer, sjekk impressionandel |
| Annenhver uke | Gjennomga annonseytelse, pause underytende varianter |
| Manedlig | Vurder overgang til neste budstrategifase, juster budsjett basert pa ROI |

---

## Appendiks: Budstrategioverganger

Kampanjen bruker en 3-fase budstrategi. Ikke bytt strategi for tidlig; vent til du har nok data.

### Fase 1: Manual CPC (Uke 1-4)

- **Strategi:** Manual CPC med forbedret CPC aktivert
- **Standardbud:** 25 NOK
- **Mal:** Samle grunnlagsdata, sikt mot 50+ klikk
- **Nar bytte:** Nar du har minst 15-20 konverteringer registrert

### Fase 2: Maksimer klikk (Uke 5-8)

- **Strategi:** Maksimer klikk med maks CPC-tak
- **Mal:** Bygge konverteringsvolum
- **Slik endrer du:** Ga til kampanjeinnstillinger > Budstrategi > Endre til "Maksimer klikk"
- **Sett maks CPC-tak:** Bruk gjennomsnittlig CPC fra Fase 1 + 20% som tak
- **Nar bytte:** Nar du har 30-50 konverteringer i et 30-dagers vindu

### Fase 3: Maksimer konverteringer (Uke 9+)

- **Strategi:** Maksimer konverteringer
- **Mal:** La Google optimalisere bud basert pa konverteringsdata
- **Slik endrer du:** Ga til kampanjeinnstillinger > Budstrategi > Endre til "Maksimer konverteringer"
- **Valgfritt:** Nar stabil CPA er etablert, vurder Target CPA for enda mer kontroll

**Viktig:** Hver overgang krever minst 2 ukers stabile data. Ikke bytt strategi midt i en testperiode.

Se [campaign-structure.md](../34-google-ads-campaign-docs/campaign-structure.md) for fullstendige detaljer om hver fase.
