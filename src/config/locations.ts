// Slug-konvensjon for norske bynavn:
//   æ → ae  |  ø → o  |  å → a  |  mellomrom → bindestrek
// Eksempler: Bærum → baerum, Lillestrøm → lillestrom, Ås → as
// Bruk alltid ASCII-slugs i slug-feltet. Visningsnavn med norske tegn i name-feltet.

/**
 * V2-promoteringskriterier:
 * En by promoteres fra tier 1 til tier 2 når:
 * - Bysiden har ≥10 organiske inntrykk per måned i Google Search Console
 * - Vurderes individuelt — Oslo kan promoteres uavhengig av andre byer
 *
 * Øk ACTIVE_TIER til 2 for å aktivere tier-2-byer.
 */
export const ACTIVE_TIER = 1;

export interface City {
  tier: 1 | 2 | 3;
  slug: string;
  name: string;
  intro: string;
  faq: Array<{ question: string; answer: string }>;
  nearbyAreas: string[];
  metaTitle: string;
  metaDescription: string;
  industries?: string[];
}

export const cities: City[] = [
  {
    tier: 1,
    slug: 'oslo',
    name: 'Oslo',
    intro:
      'Fra Grünerløkka til Majorstuen og Aker Brygge — Oslo er en by med bedrifter som konkurrerer om oppmerksomheten til kresne kunder. Nettup hjelper Oslobedrifter med nettsider som skiller seg ut i søk og gjør besøkende til kunder. Vi jobber digitalt og leverer raskt, uten at du trenger å bruke tid på møter og lange prosesser.',
    faq: [
      {
        question: 'Holder dere til i Oslo?',
        answer:
          'Vi jobber primært digitalt og hjelper bedrifter over hele Oslo og nærliggende områder. Alle møter gjennomføres på video, noe som gjør samarbeidet like effektivt uansett hvor i byen du holder til.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Oslo?',
        answer:
          'Vi starter alltid med en kort samtale for å forstå hva du trenger. Innen 24 timer får du et konkret tilbud med pris og tidsplan. Deretter jobber vi digitalt gjennom hele prosessen — du får løpende oppdateringer og mulighet til å gi tilbakemeldinger underveis.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Oslo?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Prisen avhenger av omfang og funksjonalitet. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat tilpasset dine behov.',
      },
    ],
    nearbyAreas: ['baerum', 'sandvika', 'lillestrom'],
    metaTitle: 'Nettside for bedrift i Oslo | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Oslo. Moderne design, rask levering og god synlighet i Google. Få tilbud innen 24 timer.',
  },
  {
    tier: 1,
    slug: 'baerum',
    name: 'Bærum',
    intro:
      'Bærum er en av landets mest næringstette kommuner, med et mangfold av bedrifter fra Lysaker og Fornebu i øst til Bekkestua og Sandvika i vest. Nettup hjelper Bærum-bedrifter med å etablere en profesjonell digital tilstedeværelse som bygger tillit og tiltrekker nye kunder. Vi kjenner konkurransen i vestkorridoren og vet hva som skal til for å skille seg ut.',
    faq: [
      {
        question: 'Holder dere til i Bærum?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i hele Bærum-kommunen — fra Lysaker og Fornebu til Sandvika og Bekkestua. Alle møter kan gjennomføres på video, og vi leverer gode resultater uten at du trenger å møte oss fysisk.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Bærum?',
        answer:
          'Vi starter med en kort prat om dine behov og mål. Innen 24 timer sender vi et konkret tilbud. Selve arbeidet foregår digitalt med tydelig kommunikasjon hele veien — fra skisse til ferdig nettside klar for lansering.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Bærum?',
        answer:
          'Prisen varierer etter behov og omfang. En standard bedriftsnettside starter fra 15 000 kr. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat tilpasset din bedrift.',
      },
    ],
    nearbyAreas: ['oslo', 'asker', 'sandvika'],
    metaTitle: 'Nettside for bedrift i Bærum | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Bærum. Fra Lysaker til Sandvika — vi hjelper deg med moderne design og synlighet i Google.',
  },
  {
    tier: 1,
    slug: 'asker',
    name: 'Asker',
    intro:
      'Asker sentrum har de siste årene blitt et stadig mer attraktivt sted for etablerte bedrifter og gründere langs vestkorridoren. Fra det levende handelssenteret i Asker sentrum til de roligere næringsområdene mot Heggedal og Dikemark finnes det bedrifter som trenger nettsider som er like gjennomtenkte som de selv er. Nettup leverer profesjonelle nettsider som hjelper Asker-bedrifter med å nå kundene sine på nett.',
    faq: [
      {
        question: 'Holder dere til i Asker?',
        answer:
          'Vi jobber digitalt og bistår bedrifter i Asker og hele vestkorridoren. Møter skjer på video og samarbeidet fungerer smidig uavhengig av geografi — du sparer tid og vi leverer effektivt.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Asker?',
        answer:
          'Vi begynner med en kort og uformell prat om hva du trenger. Innen 24 timer får du et konkret tilbud med pris og leveringstid. Resten foregår digitalt med jevnlige oppdateringer frem til lansering.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Asker?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Pris og leveringstid avhenger av hva du trenger. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['baerum', 'sandvika', 'drammen'],
    metaTitle: 'Nettside for bedrift i Asker | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Asker. Rask levering og moderne design for bedrifter langs vestkorridoren. Få tilbud innen 24 timer.',
  },
  {
    tier: 1,
    slug: 'sandvika',
    name: 'Sandvika',
    intro:
      'Sandvika er Bærums kommersielle hjerte — med Sandvika Storsenter, tett E18-tilknytning og et voksende næringsmiljø som tiltrekker både handelsbedrifter og tjenesteytere. Beliggenheten gjør Sandvika til et naturlig knutepunkt for bedrifter som vil nå kunder langs hele vestkorridoren. Nettup hjelper Sandvika-bedrifter med nettsider som reflekterer den profesjonelle og sentrale posisjonen de allerede har.',
    faq: [
      {
        question: 'Holder dere til i Sandvika?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i Sandvika og omegn. Alle møter kan gjennomføres på video, og samarbeidet er like effektivt enten du sitter i Sandvika sentrum eller utenfor bygrensen.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Sandvika?',
        answer:
          'Vi starter med en kort samtale om dine mål og behov. Innen 24 timer får du et konkret tilbud. Deretter gjennomfører vi hele prosessen digitalt med tydelig kommunikasjon frem til lansering.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Sandvika?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Endelig pris avhenger av omfang og funksjonalitet. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['baerum', 'asker', 'oslo'],
    metaTitle: 'Nettside for bedrift i Sandvika | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Sandvika. Strategisk beliggenhet, moderne nettside — vi hjelper deg med å nå kundene dine på nett.',
  },
  {
    tier: 1,
    slug: 'drammen',
    name: 'Drammen',
    intro:
      'Drammen har gjennomgått en imponerende byutvikling de siste årene, og Bragernes og Strømsø summer av nye restauranter, butikker og tjenestevirksomheter. Det betyr økt konkurranse — og et stadig større behov for nettsider som faktisk synes i søk og konverterer besøkende til kunder. Nettup hjelper Drammen-bedrifter med å etablere en digital tilstedeværelse som holder tritt med byens vekst.',
    faq: [
      {
        question: 'Holder dere til i Drammen?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i Drammen og Drammensregionen. Alle møter gjennomføres på video, og vi er vant til å levere gode resultater uten fysiske møter.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Drammen?',
        answer:
          'Vi starter med en kortfattet samtale om hva du trenger og hva du vil oppnå. Innen 24 timer får du et konkret tilbud. Selve prosessen skjer digitalt med jevnlig kontakt og løpende tilbakemeldinger.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Drammen?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Pris og leveringstid tilpasses ditt behov. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['asker'],
    metaTitle: 'Nettside for bedrift i Drammen | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Drammen. Med byen i vekst er god synlighet på nett viktigere enn noensinne. Få tilbud innen 24 timer.',
  },
  {
    tier: 1,
    slug: 'lillestrom',
    name: 'Lillestrøm',
    intro:
      'Lillestrøm er Romerikes handelssenter og huser et bredt spekter av bedrifter — fra konsulenter nær Kjeller og Ahus til handels- og servicebedrifter i Lillestrøm sentrum. Med sin sentrale posisjon i Romerike-regionen er Lillestrøm et naturlig knutepunkt som fortjener en digital tilstedeværelse som matcher ambisjonen. Nettup hjelper Lillestrøm-bedrifter med nettsider som gir synlighet og resultater.',
    faq: [
      {
        question: 'Holder dere til i Lillestrøm?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i Lillestrøm og hele Romerike-regionen. Alle møter skjer på video, og vi er vant til effektivt samarbeid på tvers av geografi.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Lillestrøm?',
        answer:
          'Vi starter med en uformell prat om dine behov. Innen 24 timer mottar du et konkret tilbud med pris og tidsplan. Deretter jobber vi digitalt gjennom hele prosjektet frem til lansering.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Lillestrøm?',
        answer:
          'En standard bedriftsnettside starter fra 15 000 kr. Endelig pris tilpasses omfang og funksjonalitet. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['oslo'],
    metaTitle: 'Nettside for bedrift i Lillestrøm | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Lillestrøm. Vi hjelper Romerike-bedrifter med synlighet på nett og moderne design. Ta kontakt i dag.',
  },
  {
    tier: 1,
    slug: 'ski',
    name: 'Ski',
    intro:
      'Ski er et knutepunkt i Follo-regionen med et aktivt næringsliv sentrert rundt Ski sentrum og de nye byutviklingsprosjektene som har gitt kommunen et løft de siste årene. Bedrifter i Ski konkurrerer om lokale kunder, men har også muligheten til å nå et regionalt publikum langs Østfoldbanen. Nettup hjelper Ski-bedrifter med nettsider som er bygget for å synes og selge.',
    faq: [
      {
        question: 'Holder dere til i Ski?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i Ski og Follo-regionen. Alle møter gjennomføres på video, noe som gjør samarbeidet effektivt uansett hvor du er lokalisert.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Ski?',
        answer:
          'Vi starter alltid med en kort samtale for å forstå hva du trenger. Innen 24 timer sender vi et konkret tilbud med pris og leveringstid. Resten av prosessen foregår digitalt med løpende oppdateringer.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Ski?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Pris og leveringstid avhenger av hva du trenger. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['moss'],
    metaTitle: 'Nettside for bedrift i Ski | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Ski og Follo-regionen. Moderne design og synlighet i Google — vi leverer raskt og til fast pris.',
  },
  {
    tier: 1,
    slug: 'moss',
    name: 'Moss',
    intro:
      'Moss er en by med særpreg — fra det levende Moss sentrum til idyllen på Jeløya og den historiske Refsnes-halvøyen. Næringslivet i Moss spenner fra industri og logistikk til handel og tjenester, og det er mange bedrifter som er klare for å ta et steg opp digitalt. Nettup hjelper Moss-bedrifter med profesjonelle nettsider som formidler det unike og tiltrekker de riktige kundene.',
    faq: [
      {
        question: 'Holder dere til i Moss?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i Moss og Østfold-regionen. Alle møter gjennomføres på video, og vi leverer gode resultater uten behov for fysiske møter.',
      },
      {
        question: 'Hvordan samarbeider dere med bedrifter i Moss?',
        answer:
          'Vi starter med en kort og uforpliktende prat om hva du trenger. Innen 24 timer får du et konkret tilbud. Deretter jobber vi digitalt med jevnlig kommunikasjon frem til nettsiden er klar for lansering.',
      },
      {
        question: 'Hva koster en nettside for bedrifter i Moss?',
        answer:
          'En profesjonell bedriftsnettside starter fra 15 000 kr. Pris og omfang avpasses dine behov. Bruk vår priskalkulator på nettup.no/priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['ski'],
    metaTitle: 'Nettside for bedrift i Moss | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Moss. Fra sentrum til Jeløya — vi hjelper østfold-bedrifter med synlighet på nett og rask levering.',
  },
];
