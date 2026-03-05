export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  monthlyPrice?: number;        // Monthly maintenance/service price in NOK
  monthlyPriceLabel?: string;   // Display string, e.g. 'fra 2 500 kr/mnd'
}

export const services: Service[] = [
  {
    slug: 'nettside',
    name: 'Nettside',
    tagline: 'En nettside som faktisk konverterer besøkende',
    priceRange: 'fra 15 000 kr',
    minPrice: 15000,
    maxPrice: 0,
    ctaParam: 'nettside',
    description: 'Vi bygger en skreddersydd nettside som presenterer bedriften din profesjonelt og gjør det enkelt for besøkende å ta kontakt.',
  },
  {
    slug: 'nettbutikk',
    name: 'Nettbutikk',
    tagline: 'Selg produktene dine på nett — uten kompromisser',
    priceRange: 'fra 25 000 kr',
    minPrice: 25000,
    maxPrice: 0,
    ctaParam: 'nettbutikk',
    description: 'Vi setter opp en komplett nettbutikk som gjør det enkelt for kundene dine å finne, velge og kjøpe produktene dine.',
  },
  {
    slug: 'landingsside',
    name: 'Landingsside',
    tagline: 'Én side som overbeviser og konverterer',
    priceRange: 'fra 8 000 kr',
    minPrice: 8000,
    maxPrice: 0,
    ctaParam: 'landingsside',
    description: 'En fokusert landingsside bygget for å konvertere trafikk fra annonser eller kampanjer til faktiske kunder.',
  },
  {
    slug: 'webapp',
    name: 'Webapp',
    tagline: 'Skreddersydd nettapplikasjon for din bedrift',
    priceRange: 'fra 40 000 kr',
    minPrice: 40000,
    maxPrice: 0,
    ctaParam: 'webapp',
    description: 'Vi utvikler webapplikasjoner som løser konkrete problemer i virksomheten din og gir teamet ditt bedre verktøy.',
    monthlyPrice: 2500,
    monthlyPriceLabel: 'fra 2 500 kr/mnd',
  },
  {
    slug: 'seo',
    name: 'SEO',
    tagline: 'Bli funnet av de som leter etter deg',
    priceRange: 'fra 3 000 kr/mnd',
    minPrice: 3000,
    maxPrice: 0,
    ctaParam: 'seo',
    description: 'Vi optimaliserer nettsiden din for søkemotorer slik at potensielle kunder finner deg når de søker etter det du tilbyr.',
    monthlyPrice: 3000,
    monthlyPriceLabel: 'fra 3 000 kr/mnd',
  },
  {
    slug: 'ai',
    name: 'AI-løsning',
    tagline: 'Automatiser det som stjeler tid i hverdagen',
    priceRange: 'fra 20 000 kr',
    minPrice: 20000,
    maxPrice: 0,
    ctaParam: 'ai',
    description: 'Vi integrerer AI-løsninger i din arbeidsflyt som reduserer manuelt arbeid og lar teamet fokusere på det som faktisk skaper verdi.',
    monthlyPrice: 1000,
    monthlyPriceLabel: 'fra 1 000 kr/mnd',
  },
  {
    slug: 'vedlikehold',
    name: 'Vedlikehold',
    tagline: 'Hold nettsiden oppdatert og sikker',
    priceRange: 'fra 1 500 kr/mnd',
    minPrice: 1500,
    maxPrice: 0,
    ctaParam: 'vedlikehold',
    description: 'Vi tar ansvar for løpende oppdateringer, sikkerhet og tekniske forbedringer så du kan fokusere på å drive bedriften.',
    monthlyPrice: 1500,
    monthlyPriceLabel: 'fra 1 500 kr/mnd',
  },
];
