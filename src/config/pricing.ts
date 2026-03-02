export interface Pakke {
  id: 'enkel' | 'standard' | 'premium';
  name: string;
  description: string;
  originalPrice: string;
  launchPrice: string;
  savings: string;
  discountPercent: string;
  monthly: string;
  support: string;
  features: string[];
  popular: boolean;
}

export const pakker: Pakke[] = [
  {
    id: 'enkel',
    name: 'Enkel',
    description: 'For deg som trenger en enkel, profesjonell tilstedeværelse på nett.',
    originalPrice: '7 000',
    launchPrice: '2 500',
    savings: '4 500',
    discountPercent: '64',
    monthly: '350',
    support: '30 min utvikling/mnd',
    features: ['Inntil 5 sider', 'Responsivt design', 'Kontaktskjema', 'Grunnleggende SEO'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'For bedrifter som vil ha litt mer - animasjoner, flere sider, og SEO-fokus.',
    originalPrice: '15 000',
    launchPrice: '4 500',
    savings: '10 500',
    discountPercent: '70',
    monthly: '500',
    support: '1 time utvikling/mnd',
    features: [
      'Inntil 10 sider',
      'Alt i Enkel-pakken',
      'Animasjoner og overganger',
      'Google Analytics-oppsett',
      'Utvidet SEO-optimalisering',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For de som vil skille seg ut med skreddersydd design og avanserte funksjoner.',
    originalPrice: '25 000',
    launchPrice: '10 000',
    savings: '15 000',
    discountPercent: '60',
    monthly: '750',
    support: '2 timer utvikling/mnd',
    features: [
      'Ubegrenset antall sider',
      'Alt i Standard-pakken',
      'Skreddersydd design',
      'Avanserte funksjoner',
      'Prioritert support',
    ],
    popular: false,
  },
];
