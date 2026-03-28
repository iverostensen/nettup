# A/B Testplan: Facebook-kampanje

**Dokument:** CAMP-06
**Fase:** 39 -- Campaign Strategy Documentation
**Dato:** 2026-03-28
**Status:** Klar for implementering

---

## 1. Testmatrise (per D-15)

**2x2 matrise:** 2 hooks x 2 malgrupper

| | Business Page admins (Kald Lag 1, smal) | Bred SMB (Kald Lag 1, bred) |
|-|------------------------------------------|------------------------------|
| **Prisanker-hook** | Celle A1 | Celle A2 |
| **Hastighets-hook** | Celle B1 | Celle B2 |

**Hook-definisjoner:**
- Prisanker-hook: "Andre byraer tar 15 000-50 000 kr. Vi gjor det for 399 kr/mnd." (Variant 1 fra ad-copy.md)
- Hastighets-hook: "Ferdig pa dager, ikke maneder. 399 kr/mnd." (Variant 2 fra ad-copy.md)

**Malgruppe-definisjoner:**
- Business Page admins (smal): Kun "Admins of business Pages" + alder 25-55 + Norge
- Bred SMB: Full kald-lag targeting (alle interesser/atferd/stillingstitler fra audience-targeting.md)

---

## 2. Teststrategi: Sekvensiell (per Pitfall 6)

Med 5 000 kr/mnd budsjett (per D-16) er samtidig testing for tynt. Kjor sekvensielt:

**Uke 1-2: Test hooks (A1 vs B1)**
- Malgruppe: Business Page admins (hold konstant)
- Variabel: Prisanker vs Hastighet
- Budsjett per celle: 1 250 kr/uke (2 500 kr totalt over 2 uker)
- Forventet: ~294 klikk per celle (ved 8.50 NOK CPC)
- Minimum for evaluering: 50 klikk per celle
- Vinner: Hook med lavest CPL (eller hoyest CTR hvis for fa leads)

**Uke 3-4: Test malgrupper (vinnende hook pa A vs B)**
- Hook: Vinneren fra uke 1-2
- Variabel: Business Page admins vs Bred SMB
- Budsjett per celle: 1 250 kr/uke (2 500 kr totalt over 2 uker)
- Vinner: Malgruppe med lavest CPL

**Etter uke 4:** Kjor vinnende kombinasjon som hoved-annonse. Alloker 70% budsjett til vinner, 30% til testing av nye kreativer.

---

## 3. Drep-kriterier (Kill Criteria per D-17)

| Metrikk | Terskel | Handling |
|---------|---------|---------|
| CPL (kostnad per lead) | > 950 NOK | Stopp annonsesettet. Evaluer kreativ og malgruppe. |
| Frekvens | > 3.0 | Pause annonsesettet. Malgruppen er mettet. Utvid eller bytt kreativ. |
| CTR (klikkrate) | < 0.5% | Stopp annonsesettet. Kreativet engasjerer ikke. Test ny hook/visuell. |
| CPM (kostnad per 1000 visninger) | > 200 NOK | Flagg for overvaking. Kan indikere for smal malgruppe. |
| Relevansskaar | < 5/10 | Kreativ-malgruppe mismatch. Test annen kombinasjon. |

**Evalueringsintervall:** Sjekk metrikker i Ads Manager hver mandag og torsdag. Ikke gjor endringer for et annonsesett har fatt minimum 50 klikk (ca 425 NOK).

**Minimumsdata for beslutning:**
- 50 klikk per annonsesett for CTR-evaluering
- 5 leads per annonsesett for CPL-evaluering (eller 2 uker, det som kommer forst)

---

## 4. Skaleringsregler (per D-18)

**Vinnere (CPL < 950 NOK og CTR > 0.5%):**
- Ok budsjett med 20% hvert 3. dag (per D-18)
- Eksempel: 1 250 kr > 1 500 kr > 1 800 kr > 2 160 kr
- Maksimal okning per uke: 50% (for a unnga at Facebooks algoritme reoptimaliserer)
- Stopp okning hvis CPL stiger over 800 NOK

**Tapere (CPL > 950 NOK eller CTR < 0.5% etter 50 klikk):**
- Pause annonsesettet
- Analyser: Er det hooken, kreativet, eller malgruppen?
- Test ny variant med kun EN endring om gangen

**Vinnere som mettar (frekvens > 2.5):**
- Bytt kreativ (ny video/bilde) men behold hook og malgruppe
- Alternativt: Utvid malgruppe (legg til flere stillingstitler eller interesser)

---

## 5. Dashbord-oppsett

Opprett en tilpasset rapport i Ads Manager med disse kolonnene:

| Kolonne | Hvorfor |
|---------|---------|
| Kampanjenavn | Identifisering |
| Resultater (Leads) | Hovedmal |
| Kostnad per resultat (CPL) | Primaer KPI |
| Klikkfrekvens (CTR) | Kreativ-kvalitet |
| Frekvens | Metning |
| CPM | Kostnadseffektivitet |
| Rekkevidde | Malgruppestorrelse |
| Visninger | Eksponeringsvolum |

Lagre som "Nettup - Kampanjerapport" for rask tilgang.

---

## 6. Manedlig budsjettfordeling (5 000 kr/mnd per D-16)

| Uke | Aktivitet | Budsjett |
|-----|-----------|----------|
| 1 | Hook-test (A1 vs B1) | 1 250 kr |
| 2 | Hook-test fortsetter | 1 250 kr |
| 3 | Malgruppe-test (vinner-hook) | 1 250 kr |
| 4 | Skalering av vinner | 1 250 kr |
| **Totalt** | | **5 000 kr** |

Maned 2+: 70% til vinnende kombinasjon (3 500 kr), 30% til testing av nye kreativer (1 500 kr).

---

## 7. Budsjettmatematikk og forventede resultater

Basert pa norske markedsbenchmarks (fra 39-RESEARCH.md):

| Metrikk | Estimat | Grunnlag |
|---------|---------|---------|
| CPC | ~8.50 NOK | Norsk Facebook-gjennomsnitt |
| Klikk per maned (5 000 kr) | ~588 | 5 000 / 8.50 |
| Leadskjema CVR | ~7.7% | Meta Instant Forms benchmark |
| Leads per maned (best case) | ~45 | 588 x 7.7% |
| Leads per maned (realistisk CPL 500 NOK) | ~10 | 5 000 / 500 |
| Klienter for lonnsomhet | 1/maned | LTV av abonnementsmodell |

**Konklusjon:** Kampanjen er lonnsam ved 1 ny klient per maned pa 399 kr/mnd-abonnementet, gitt at kundene beholder abonnementet i 6+ maneder.
