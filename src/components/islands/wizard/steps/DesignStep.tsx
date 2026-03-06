import { pricingConfig, type ServiceType } from '@/config/pricing-config';
import { SelectableCard } from '../cards/SelectableCard';

interface DesignStepProps {
  serviceType: ServiceType;
  selectedDesignId?: string | null;
  onSelectDesign: (designId: string) => void;
}

export function DesignStep({ serviceType, selectedDesignId, onSelectDesign }: DesignStepProps) {
  const designs = pricingConfig.services[serviceType].designs;

  return (
    <div>
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        Hvilket designnivå ønsker du?
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {designs.map((design) => (
          <SelectableCard
            key={design.id}
            label={design.label}
            selected={design.id === selectedDesignId}
            onToggle={() => onSelectDesign(design.id)}
          />
        ))}
      </div>
    </div>
  );
}
