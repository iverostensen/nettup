// ---------------------------------------------------------------------------
// Pricing Configuration — Single source of truth for all pricing data
// ---------------------------------------------------------------------------

// --- Type Definitions ---

export type ServiceType = 'nettside' | 'nettbutikk' | 'landingsside';

export interface SizeTier {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
  monthlyPrice: number;
}

export interface AddOn {
  id: string;
  label: string;
  price: number;
  monthlyPrice?: number;
}

export interface DesignLevel {
  id: string;
  label: string;
  price: number;
}

export interface ServicePricing {
  sizes: SizeTier[];
  features: AddOn[];
  integrations: AddOn[];
  designs: DesignLevel[];
}

export interface DiscountConfig {
  percentage: number;
  label: string;
  active: boolean;
}

export interface PricingConfig {
  discount: DiscountConfig;
  services: Record<ServiceType, ServicePricing>;
}

export interface EstimateRequest {
  serviceType: ServiceType;
  sizeId: string;
  featureIds: string[];
  integrationIds: string[];
  designId: string;
}

export interface LineItem {
  category: 'size' | 'feature' | 'integration' | 'design';
  id: string;
  label: string;
  price: number;
}

export interface EstimateResult {
  serviceType: ServiceType;
  lineItems: LineItem[];
  oneTime: { min: number; max: number };
  discounted: { min: number; max: number };
  monthly: number;
  discountPercent: number;
  discountActive: boolean;
}

// --- Config Data ---

export const pricingConfig: PricingConfig = {
  discount: {
    percentage: 0.4,
    label: 'Lanseringstilbud',
    active: true,
  },

  services: {
    // ----- Nettside -----
    nettside: {
      sizes: [
        { id: 'small', label: '1\u20135 sider', minPrice: 8000, maxPrice: 12000, monthlyPrice: 249 },
        { id: 'medium', label: '6\u201315 sider', minPrice: 15000, maxPrice: 25000, monthlyPrice: 349 },
        { id: 'large', label: '16+ sider', minPrice: 28000, maxPrice: 45000, monthlyPrice: 499 },
      ],
      features: [
        { id: 'cms', label: 'CMS (innholdsstyring)', price: 3000, monthlyPrice: 100 },
        { id: 'kontaktskjema', label: 'Kontaktskjema', price: 1000 },
        { id: 'seo', label: 'SEO-optimalisering', price: 2500 },
        { id: 'animasjoner', label: 'Animasjoner og overganger', price: 3500 },
        { id: 'analytics', label: 'Analytics-oppsett', price: 1500 },
        { id: 'blogg', label: 'Blogg', price: 4000 },
        { id: 'flerspraklig', label: 'Flerspraklig', price: 5000 },
        { id: 'booking', label: 'Booking-system', price: 6000, monthlyPrice: 200 },
        { id: 'nyhetsbrev', label: 'Nyhetsbrev-integrasjon', price: 2000, monthlyPrice: 50 },
        { id: 'brukerpanel', label: 'Brukerpanel / innlogging', price: 8000, monthlyPrice: 150 },
      ],
      integrations: [
        { id: 'google-analytics', label: 'Google Analytics', price: 1000 },
        { id: 'crm', label: 'CRM-integrasjon', price: 4000 },
        { id: 'chatbot', label: 'Chatbot / live chat', price: 3000 },
      ],
      designs: [
        { id: 'standard', label: 'Standard', price: 0 },
        { id: 'skreddersydd', label: 'Skreddersydd', price: 5000 },
        { id: 'premium', label: 'Premium', price: 10000 },
      ],
    },

    // ----- Nettbutikk -----
    nettbutikk: {
      sizes: [
        { id: 'small', label: '1\u201350 produkter', minPrice: 15000, maxPrice: 22000, monthlyPrice: 399 },
        { id: 'medium', label: '51\u2013200 produkter', minPrice: 25000, maxPrice: 40000, monthlyPrice: 599 },
        { id: 'large', label: '200+ produkter', minPrice: 42000, maxPrice: 65000, monthlyPrice: 899 },
      ],
      features: [
        { id: 'produktfiltrering', label: 'Produktfiltrering og sok', price: 3500 },
        { id: 'kontaktskjema', label: 'Kontaktskjema', price: 1000 },
        { id: 'seo', label: 'SEO-optimalisering', price: 2500 },
        { id: 'animasjoner', label: 'Animasjoner og overganger', price: 3500 },
        { id: 'analytics', label: 'Analytics-oppsett', price: 1500 },
        { id: 'flerspraklig', label: 'Flerspraklig', price: 6000 },
        { id: 'nyhetsbrev', label: 'Nyhetsbrev-integrasjon', price: 2000, monthlyPrice: 50 },
        { id: 'brukerpanel', label: 'Brukerkonto / innlogging', price: 5000, monthlyPrice: 150 },
        { id: 'rabattkoder', label: 'Rabattkoder og kampanjer', price: 2500 },
        { id: 'produktanmeldelser', label: 'Produktanmeldelser', price: 2000 },
      ],
      integrations: [
        { id: 'vipps', label: 'Vipps', price: 3000 },
        { id: 'klarna', label: 'Klarna', price: 3000 },
        { id: 'regnskap', label: 'Regnskap / ERP', price: 5000 },
        { id: 'frakt', label: 'Frakt-integrasjon', price: 3500 },
        { id: 'lagerstyring', label: 'Lagerstyring', price: 4000 },
      ],
      designs: [
        { id: 'standard', label: 'Standard', price: 0 },
        { id: 'skreddersydd', label: 'Skreddersydd', price: 7000 },
        { id: 'premium', label: 'Premium', price: 15000 },
      ],
    },

    // ----- Landingsside -----
    landingsside: {
      sizes: [
        { id: 'single', label: '1 side', minPrice: 4000, maxPrice: 6000, monthlyPrice: 199 },
        { id: 'multi', label: '2\u20133 sider', minPrice: 7000, maxPrice: 10000, monthlyPrice: 249 },
        { id: 'extended', label: '4+ sider', minPrice: 11000, maxPrice: 16000, monthlyPrice: 299 },
      ],
      features: [
        { id: 'kontaktskjema', label: 'Kontaktskjema', price: 1000 },
        { id: 'seo', label: 'SEO-optimalisering', price: 2000 },
        { id: 'animasjoner', label: 'Animasjoner og overganger', price: 2500 },
        { id: 'analytics', label: 'Analytics-oppsett', price: 1500 },
        { id: 'a-b-testing', label: 'A/B-testing oppsett', price: 3000 },
        { id: 'nyhetsbrev', label: 'Nyhetsbrev-integrasjon', price: 2000, monthlyPrice: 50 },
      ],
      integrations: [
        { id: 'google-analytics', label: 'Google Analytics', price: 1000 },
        { id: 'facebook-pixel', label: 'Facebook Pixel', price: 1000 },
        { id: 'google-ads', label: 'Google Ads-sporing', price: 1500 },
      ],
      designs: [
        { id: 'standard', label: 'Standard', price: 0 },
        { id: 'skreddersydd', label: 'Skreddersydd', price: 3500 },
        { id: 'premium', label: 'Premium', price: 7000 },
      ],
    },
  },
};
