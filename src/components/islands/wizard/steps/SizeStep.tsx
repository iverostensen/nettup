import { pricingConfig, type ServiceType } from '@/config/pricing-config';
import { SelectableCard } from '../cards/SelectableCard';

interface SizeStepProps {
  serviceType: ServiceType;
  onSelectSize: (sizeId: string) => void;
}

const headings: Record<ServiceType, string> = {
  nettside: 'Hvor stor er nettsiden?',
  nettbutikk: 'Hvor mange produkter?',
  landingsside: 'Hvor stor er landingssiden?',
};

function formatPriceRange(min: number, max: number): string {
  return `${min.toLocaleString('nb-NO')} \u2013 ${max.toLocaleString('nb-NO')} kr`;
}

export function SizeStep({ serviceType, onSelectSize }: SizeStepProps) {
  const sizes = pricingConfig.services[serviceType].sizes;

  return (
    <div>
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        {headings[serviceType]}
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {sizes.map((size) => (
          <SelectableCard
            key={size.id}
            label={size.label}
            price={formatPriceRange(size.minPrice, size.maxPrice)}
            selected={false}
            onToggle={() => onSelectSize(size.id)}
          />
        ))}
      </div>
    </div>
  );
}
