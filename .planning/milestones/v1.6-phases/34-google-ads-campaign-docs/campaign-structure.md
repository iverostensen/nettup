# Campaign Structure: Nettside Abonnement

Enkelt kampanjeoppsett med en kampanje og en annonsegruppe. Maler norske smabedrifter som soker rimelige nettsidelosninger. All trafikk sendes til /nettside-for-bedrift.

## Campaign Settings

| Innstilling | Verdi | Merknader |
|-------------|-------|-----------|
| Kampanjenavn | Nettside Abonnement | |
| Kampanjetype | Search | |
| Nettverk | Kun Google Sok | Fjern hake for Display-nettverk og sokepartnere |
| Stedsmaling | Norge (hele) | Kan innsnevres til regioner senere |
| Sprak | Norsk | |
| Budsjett | 100 NOK/dag | Anbefalt startpunkt; rekkevidde 50-150 NOK/dag |
| Startdato | [Settes ved lansering] | |
| Annonserotasjon | Optimaliser | La Google foretrekke best-ytende annonser |
| Annonseplan | Hele dagen (initialt) | Optimaliser etter 2 uker med data |

## Ad Group

| Innstilling | Verdi |
|-------------|-------|
| Annonsegruppe-navn | Nettside for Bedrift |
| Standardbud | 25 NOK (juster basert pa Keyword Planner CPC-data) |
| Endelig URL | https://nettup.no/nettside-for-bedrift |
| Sokord | Se keywords.md for full liste; primaere sokord bruker eksakt match, sekundaere bruker frase-match |

## Bidding Strategy (Phased Approach)

### Fase 1: Manual CPC (Uke 1-4)

- **Strategi:** Manual CPC med forbedret CPC aktivert
- **Hvorfor:** Ikke nok konverteringsdata for Smart Bidding
- **Mal:** Samle grunnlagsdata, sikt mot 50+ klikk
- **Maks CPC:** Start pa 25 NOK, juster basert pa impressionandel

### Fase 2: Maximize Clicks (Uke 5-8)

- **Strategi:** Maksimer klikk
- **Hvorfor:** Bygg konverteringsvolum for overgangen til konverteringsbasert budgiving
- **Overgangsutloser:** Minst 15-20 konverteringer registrert

### Fase 3: Maximize Conversions (Uke 9+)

- **Strategi:** Maksimer konverteringer
- **Hvorfor:** Nok konverteringsdata for Googles maskinlaering
- **Overgangsutloser:** 30-50 konverteringer i 30-dagers vindu
- **Valgfritt:** Bytt til Target CPA nar stabil CPA er etablert

## Conversion Tracking

| Innstilling | Verdi |
|-------------|-------|
| Konverteringshandling | Konfigurer i Google Ads > Goals > Conversions |
| Konverteringskilde | Website (gtag) |
| Konverteringsside | /nettside-for-bedrift/takk |
| Consent Mode | v2 Advanced allerede implementert (Fase 31) -- atferdsmodellering gjenoppretter ca. 70% av uobserverte konverteringer |
| Plausible Analytics | Fyrer ogsa pa /takk-siden (sekundaer maling) |
| Attribusjonsmodell | Data-driven (Google standard, anbefalt for nye kampanjer) |

## Negative Keywords (Campaign Level)

Se keywords.md for full negativ sokord-liste. Rask oversikt over kampanjeniva-negativer:

| Kategori | Negativer |
|----------|-----------|
| Gratis/Free | gratis, free |
| Plattformer | wordpress, wix, squarespace, webflow |
| Gjor-det-selv | selv, diy, tutorial, kurs, guide, lare |
| Jobb | jobb, stilling, ansatt |
| Maler | mal, template |

**Merk:** Legg til "konkurrent"-termer etter hvert som de dukker opp i soketermsrapporten.

## Budget Recommendations

| Scenario | Daglig budsjett | Manedlig budsjett | Est. klikk/maned | Merknader |
|----------|-----------------|--------------------|--------------------|-----------|
| Konservativ | 50 NOK/dag | ~1 500 NOK/mnd | 30-50 klikk | Sakte datainnsamling, minimal risiko |
| Anbefalt | 100 NOK/dag | ~3 000 NOK/mnd | 60-120 klikk | God balanse mellom data og kostnad |
| Aggressiv | 150 NOK/dag | ~4 500 NOK/mnd | 100-180 klikk | Raskere laering, hoyere kostnad |

**Merk:** Klikkestimater antar 20-40 NOK gjennomsnittlig CPC for norske "nettside"-sokord. Faktisk CPC varierer etter konkurranse og Quality Score.

## Launch Checklist

1. Opprett Google Ads-konto (om ikke eksisterende)
2. Sett opp konverteringshandling som matcher /takk-sidens gtag-event
3. Importer sokord fra keywords.md med angitte match-typer
4. Opprett RSA-annonser fra ad-copy.md (5 varianter)
5. Legg til extensions fra extensions.md (sitelinks, callouts, strukturerte snippets)
6. Sett kampanjeinnstillinger per Campaign Settings-seksjonen
7. Sett initialt budsjett til 100 NOK/dag
8. Aktiver kampanjen
9. Gjennomga soketermsrapporten etter 48 timer
10. Legg til nye negative sokord fra soketermsrapporten ukentlig

## Optimization Schedule

| Frekvens | Handling |
|----------|----------|
| Daglig | Sjekk forbruk, pause ved budsjettoverskridelse |
| Ukentlig (forste maned) | Gjennomga soketermer, legg til negativer, sjekk impressionandel |
| Annenhver uke | Gjennomga annonseytelse, pause underytende varianter |
| Manedlig | Vurder overgang til neste budstrategifase, juster budsjett basert pa ROI |
| Etter 50 konverteringer | Vurder overgang til Maximize Conversions |
