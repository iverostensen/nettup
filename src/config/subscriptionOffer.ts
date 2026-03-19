export interface SubscriptionOffer {
  price: {
    setupPrice: number;
    monthlyPrice: number;
  };
  features: string[];
  terms: {
    binding: string;
    cancellation: string;
  };
  upsellLinks: Array<{
    label: string;
    href: string;
  }>;
  meta: {
    title: string;
    description: string;
  };
}

export const subscriptionOffer: SubscriptionOffer = {
  price: {
    setupPrice: 0,
    monthlyPrice: 399,
  },
  features: [
    'Inntil 5 sider',
    'Responsivt design',
    'Kontaktskjema',
    'Grunnleggende SEO',
    'SSL og hosting inkludert',
    'Support og vedlikehold',
  ],
  terms: {
    binding: 'Ingen bindingstid',
    cancellation: 'Nettsiden tas ned ved oppsigelse',
  },
  upsellLinks: [
    { label: 'Skreddersydd nettside', href: '/tjenester/nettside' },
    { label: 'Nettbutikk', href: '/tjenester/nettbutikk' },
    { label: 'Landingsside', href: '/tjenester/landingsside' },
  ],
  meta: {
    title: 'Nettside for Bedrift | 0 kr Oppstart, 399 kr/mnd | Nettup',
    description:
      'Profesjonell nettside for din bedrift. 0 kr oppstart, kun 399 kr/mnd. Inntil 5 sider, responsivt design, SEO og support inkludert. Ingen bindingstid.',
  },
};
