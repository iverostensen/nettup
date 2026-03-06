import { pricingConfig, type ServiceType } from '@/config/pricing-config';
import { SelectableCard } from '../cards/SelectableCard';

interface FeaturesStepProps {
  serviceType: ServiceType;
  selectedIds: string[];
  onToggle: (featureId: string) => void;
  onNext: () => void;
}

export function FeaturesStep({
  serviceType,
  selectedIds,
  onToggle,
  onNext,
}: FeaturesStepProps) {
  const features = pricingConfig.services[serviceType].features;

  return (
    <div>
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        Hvilke funksjoner trenger du?
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {features.map((feature) => (
          <SelectableCard
            key={feature.id}
            label={feature.label}
            selected={selectedIds.includes(feature.id)}
            onToggle={() => onToggle(feature.id)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-6 w-full rounded-md bg-brand py-3 text-center font-semibold text-white transition-colors hover:bg-brand-light"
      >
        Neste
      </button>
    </div>
  );
}
