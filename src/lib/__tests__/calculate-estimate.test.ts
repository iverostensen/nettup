import { describe, it, expect } from 'vitest';
import { calculateEstimate } from '@/lib/calculate-estimate';
import { pricingConfig } from '@/config/pricing-config';
import type { EstimateRequest } from '@/config/pricing-config';

describe('calculateEstimate', () => {
  const nettsideConfig = pricingConfig.services.nettside;
  const nettbutikkConfig = pricingConfig.services.nettbutikk;
  const landingssideConfig = pricingConfig.services.landingsside;

  // --- Base estimate (no add-ons) ---

  it('returns oneTime min/max from size tier for base nettside with standard design', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'small')!;
    expect(result.oneTime.min).toBe(size.minPrice);
    expect(result.oneTime.max).toBe(size.maxPrice);
  });

  // --- Adding features ---

  it('adds a single feature price to both min and max', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: ['cms'],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'small')!;
    const feature = nettsideConfig.features.find((f) => f.id === 'cms')!;
    expect(result.oneTime.min).toBe(size.minPrice + feature.price);
    expect(result.oneTime.max).toBe(size.maxPrice + feature.price);
  });

  it('sums multiple feature prices additively', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'medium',
      featureIds: ['cms', 'seo', 'blogg'],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'medium')!;
    const featureSum = [3000, 2500, 4000].reduce((a, b) => a + b, 0);
    expect(result.oneTime.min).toBe(size.minPrice + featureSum);
    expect(result.oneTime.max).toBe(size.maxPrice + featureSum);
  });

  // --- Adding integrations ---

  it('adds integration prices same as features', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: ['google-analytics', 'crm'],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'small')!;
    const integrationSum = 1000 + 4000;
    expect(result.oneTime.min).toBe(size.minPrice + integrationSum);
    expect(result.oneTime.max).toBe(size.maxPrice + integrationSum);
  });

  // --- Design level ---

  it('adds Skreddersydd design price to min and max', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'skreddersydd',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'small')!;
    const design = nettsideConfig.designs.find((d) => d.id === 'skreddersydd')!;
    expect(result.oneTime.min).toBe(size.minPrice + design.price);
    expect(result.oneTime.max).toBe(size.maxPrice + design.price);
  });

  // --- Discount ---

  it('applies 40% discount to total oneTime price using Math.round', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: ['cms'],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = nettsideConfig.sizes.find((s) => s.id === 'small')!;
    const feature = nettsideConfig.features.find((f) => f.id === 'cms')!;
    const totalMin = size.minPrice + feature.price;
    const totalMax = size.maxPrice + feature.price;

    expect(result.discounted.min).toBe(Math.round(totalMin * 0.6));
    expect(result.discounted.max).toBe(Math.round(totalMax * 0.6));
  });

  it('returns correct discountPercent and discountActive fields', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    expect(result.discountPercent).toBe(40);
    expect(result.discountActive).toBe(true);
  });

  // --- Monthly ---

  it('returns monthly as service monthlyPrice unchanged', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    expect(result.monthly).toBe(nettsideConfig.monthlyPrice);
  });

  // --- Line items ---

  it('includes size line item always and design only if price > 0', () => {
    const requestStandard: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    };
    const resultStandard = calculateEstimate(requestStandard);

    // Size always present
    expect(resultStandard.lineItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'size', id: 'small' }),
      ])
    );
    // Standard design (price=0) should NOT be in line items
    expect(resultStandard.lineItems.find((li) => li.category === 'design')).toBeUndefined();

    const requestPremium: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: ['cms'],
      integrationIds: ['google-analytics'],
      designId: 'premium',
    };
    const resultPremium = calculateEstimate(requestPremium);

    // Premium design (price > 0) should be in line items
    expect(resultPremium.lineItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'design', id: 'premium', price: 10000 }),
      ])
    );
    // Should also have feature and integration line items
    expect(resultPremium.lineItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'feature', id: 'cms' }),
        expect.objectContaining({ category: 'integration', id: 'google-analytics' }),
      ])
    );
    // Total line items: size + design + 1 feature + 1 integration = 4
    expect(resultPremium.lineItems).toHaveLength(4);
  });

  // --- Error cases ---

  it('throws descriptive error for unknown sizeId', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'gigantic',
      featureIds: [],
      integrationIds: [],
      designId: 'standard',
    };
    expect(() => calculateEstimate(request)).toThrow(/gigantic/);
  });

  it('throws descriptive error for unknown featureId', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: ['teleporter'],
      integrationIds: [],
      designId: 'standard',
    };
    expect(() => calculateEstimate(request)).toThrow(/teleporter/);
  });

  it('throws descriptive error for unknown designId', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: [],
      designId: 'ultra-mega',
    };
    expect(() => calculateEstimate(request)).toThrow(/ultra-mega/);
  });

  it('throws descriptive error for unknown integrationId', () => {
    const request: EstimateRequest = {
      serviceType: 'nettside',
      sizeId: 'small',
      featureIds: [],
      integrationIds: ['quantum-link'],
      designId: 'standard',
    };
    expect(() => calculateEstimate(request)).toThrow(/quantum-link/);
  });

  // --- Other service types ---

  it('works for nettbutikk service type', () => {
    const request: EstimateRequest = {
      serviceType: 'nettbutikk',
      sizeId: 'medium',
      featureIds: ['produktfiltrering'],
      integrationIds: ['vipps'],
      designId: 'skreddersydd',
    };
    const result = calculateEstimate(request);

    const size = nettbutikkConfig.sizes.find((s) => s.id === 'medium')!;
    const feature = nettbutikkConfig.features.find((f) => f.id === 'produktfiltrering')!;
    const integration = nettbutikkConfig.integrations.find((i) => i.id === 'vipps')!;
    const design = nettbutikkConfig.designs.find((d) => d.id === 'skreddersydd')!;
    const addOnSum = feature.price + integration.price + design.price;

    expect(result.serviceType).toBe('nettbutikk');
    expect(result.oneTime.min).toBe(size.minPrice + addOnSum);
    expect(result.oneTime.max).toBe(size.maxPrice + addOnSum);
    expect(result.monthly).toBe(nettbutikkConfig.monthlyPrice);
  });

  it('works for landingsside service type', () => {
    const request: EstimateRequest = {
      serviceType: 'landingsside',
      sizeId: 'single',
      featureIds: ['kontaktskjema'],
      integrationIds: [],
      designId: 'standard',
    };
    const result = calculateEstimate(request);

    const size = landingssideConfig.sizes.find((s) => s.id === 'single')!;
    const feature = landingssideConfig.features.find((f) => f.id === 'kontaktskjema')!;

    expect(result.serviceType).toBe('landingsside');
    expect(result.oneTime.min).toBe(size.minPrice + feature.price);
    expect(result.oneTime.max).toBe(size.maxPrice + feature.price);
    expect(result.monthly).toBe(landingssideConfig.monthlyPrice);
  });
});
