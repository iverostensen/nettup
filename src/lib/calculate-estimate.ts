import {
  pricingConfig,
  type EstimateRequest,
  type EstimateResult,
  type LineItem,
} from '@/config/pricing-config';

export function calculateEstimate(request: EstimateRequest): EstimateResult {
  const { serviceType, sizeId, featureIds, integrationIds, designId } = request;
  const service = pricingConfig.services[serviceType];
  const { discount } = pricingConfig;

  // 1. Validate and look up size tier
  const size = service.sizes.find((s) => s.id === sizeId);
  if (!size) {
    throw new Error(
      `Unknown sizeId "${sizeId}" for service "${serviceType}". Valid: ${service.sizes.map((s) => s.id).join(', ')}`
    );
  }

  const lineItems: LineItem[] = [
    { category: 'size', id: size.id, label: size.label, price: size.minPrice },
  ];

  let addOnTotal = 0;

  // 2. Validate and sum features
  for (const featureId of featureIds) {
    const feature = service.features.find((f) => f.id === featureId);
    if (!feature) {
      throw new Error(
        `Unknown featureId "${featureId}" for service "${serviceType}". Valid: ${service.features.map((f) => f.id).join(', ')}`
      );
    }
    lineItems.push({ category: 'feature', id: feature.id, label: feature.label, price: feature.price });
    addOnTotal += feature.price;
  }

  // 3. Validate and sum integrations
  for (const integrationId of integrationIds) {
    const integration = service.integrations.find((i) => i.id === integrationId);
    if (!integration) {
      throw new Error(
        `Unknown integrationId "${integrationId}" for service "${serviceType}". Valid: ${service.integrations.map((i) => i.id).join(', ')}`
      );
    }
    lineItems.push({ category: 'integration', id: integration.id, label: integration.label, price: integration.price });
    addOnTotal += integration.price;
  }

  // 4. Validate and handle design level
  const design = service.designs.find((d) => d.id === designId);
  if (!design) {
    throw new Error(
      `Unknown designId "${designId}" for service "${serviceType}". Valid: ${service.designs.map((d) => d.id).join(', ')}`
    );
  }
  if (design.price > 0) {
    lineItems.push({ category: 'design', id: design.id, label: design.label, price: design.price });
    addOnTotal += design.price;
  }

  // 5. Calculate one-time range
  const oneTime = {
    min: size.minPrice + addOnTotal,
    max: size.maxPrice + addOnTotal,
  };

  // 6. Apply discount
  const discountActive = discount.active;
  const discountPercent = discount.percentage * 100;
  const discounted = discountActive
    ? {
        min: Math.round(oneTime.min * (1 - discount.percentage)),
        max: Math.round(oneTime.max * (1 - discount.percentage)),
      }
    : { ...oneTime };

  return {
    serviceType,
    lineItems,
    oneTime,
    discounted,
    monthly: service.monthlyPrice,
    discountPercent,
    discountActive,
  };
}
