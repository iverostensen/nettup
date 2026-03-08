// Slug-konvensjon for norske bynavn:
//   æ → ae  |  ø → o  |  å → a  |  mellomrom → bindestrek
// Eksempler: Bærum → baerum, Lillestrøm → lillestrom, Ås → as
// Bruk alltid ASCII-slugs i slug-feltet. Visningsnavn med norske tegn i name-feltet.

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
      'Nettup leverer profesjonelle nettsider til bedrifter i Oslo og nærliggende områder. Vi hjelper lokale bedrifter med å etablere en sterk digital tilstedeværelse som tiltrekker kunder og bygger tillit. Med rask levering og et tydelig fokus på resultater, er vi et naturlig valg for Oslobedrifter som ønsker å vokse på nett.',
    faq: [
      {
        question: 'Holder dere til i Oslo?',
        answer:
          'Vi jobber primært digitalt og hjelper bedrifter over hele landet, inkludert Oslo. Alle møter kan tas på video, og vi er vant til å jobbe effektivt på tvers av geografi.',
      },
      {
        question: 'Hvor lang tid tar det å få en nettside?',
        answer:
          'En standard bedriftsnettside leverer vi typisk innen 2–4 uker fra oppstart. Mer komplekse løsninger kan ta lengre tid, men vi gir deg alltid en klar tidsplan fra dag én.',
      },
    ],
    nearbyAreas: ['baerum'],
    metaTitle: 'Nettside for bedrift i Oslo | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Oslo. Rask levering, moderne design og synlighet i Google. Ta kontakt for en uforpliktende prat.',
  },
  {
    tier: 1,
    slug: 'baerum',
    name: 'Bærum',
    intro:
      'Nettup leverer profesjonelle nettsider til bedrifter i Bærum og nærliggende områder. Vi forstår behovet lokale bedrifter har for å skille seg ut digitalt i et konkurransedyktig marked. Fra Sandvika til Bekkestua hjelper vi Bærum-bedrifter med nettsider som gir resultater.',
    faq: [
      {
        question: 'Holder dere til i Bærum?',
        answer:
          'Vi jobber digitalt og hjelper bedrifter i hele Bærum-regionen. Alle møter kan gjennomføres på video, og vi er vant til å levere gode resultater uten at du trenger å møte oss fysisk.',
      },
      {
        question: 'Hva koster en bedriftsnettside?',
        answer:
          'Prisen varierer etter behov og omfang. En enkel bedriftsnettside starter fra 15 000 kr, mens mer avanserte løsninger med e-handel eller spesialtilpasninger kan koste mer. Bruk vår priskalkulator for et raskt estimat.',
      },
    ],
    nearbyAreas: ['oslo'],
    metaTitle: 'Nettside for bedrift i Bærum | Nettup',
    metaDescription:
      'Nettup lager profesjonelle nettsider for bedrifter i Bærum. Rask levering, moderne design og god synlighet lokalt. Ta kontakt for en gratis prat.',
  },
];
