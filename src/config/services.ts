export interface Service {
  slug: string;
  name: string;
  tagline: string;
  priceRange: string;
  launchPriceRange: string;     // Discounted price, e.g. 'fra 4 800 kr'
  minPrice: number;
  maxPrice: number;
  ctaParam: string;
  description: string;
  monthlyPrice?: number;        // Monthly maintenance/service price in NOK
  monthlyPriceLabel?: string;   // Display string, e.g. 'fra 2 500 kr/mnd'
  related?: string[];           // Slugs of related services for cross-linking
  featured?: boolean;           // Show with brand border/glow on overview
}

/** 40% launch discount on one-time project fees (monthly fees unchanged) */
export const LAUNCH_DISCOUNT = 0.4;

export const services: Service[] = [
  {
    slug: 'nettside',
    name: 'Nettside',
    tagline: 'En nettside som faktisk konverterer besøkende',
    priceRange: 'fra 8 000 kr',
    launchPriceRange: 'fra 4 800 kr',
    minPrice: 8000,
    maxPrice: 0,
    ctaParam: 'nettside',
    description: 'Vi bygger en skreddersydd nettside fra grunnen av — ingen maler, ingen WordPress. Garantert 95+ på Google Lighthouse ved levering.',
    monthlyPrice: 350,
    monthlyPriceLabel: 'fra 350 kr/mnd',
    related: ['nettbutikk', 'landingsside'],
    featured: true,
  },
  {
    slug: 'nettbutikk',
    name: 'Nettbutikk',
    tagline: 'Selg produktene dine på nett — uten kompromisser',
    priceRange: 'fra 15 000 kr',
    launchPriceRange: 'fra 9 000 kr',
    minPrice: 15000,
    maxPrice: 0,
    ctaParam: 'nettbutikk',
    description: 'Vi setter opp en komplett nettbutikk som gjør det enkelt for kundene dine å finne, velge og kjøpe produktene dine.',
    monthlyPrice: 500,
    monthlyPriceLabel: 'fra 500 kr/mnd',
    related: ['nettside', 'landingsside'],
  },
  {
    slug: 'landingsside',
    name: 'Landingsside',
    tagline: 'Én side som overbeviser og konverterer',
    priceRange: 'fra 4 000 kr',
    launchPriceRange: 'fra 2 400 kr',
    minPrice: 4000,
    maxPrice: 0,
    ctaParam: 'landingsside',
    description: 'En fokusert landingsside bygget for å konvertere trafikk fra annonser eller kampanjer til faktiske kunder.',
    monthlyPrice: 250,
    monthlyPriceLabel: 'fra 250 kr/mnd',
    related: ['nettside', 'nettbutikk'],
  },
];
