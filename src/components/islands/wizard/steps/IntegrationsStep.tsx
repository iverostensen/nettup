import { pricingConfig, type ServiceType } from '@/config/pricing-config';
import { SelectableCard } from '../cards/SelectableCard';

interface IntegrationsStepProps {
  serviceType: ServiceType;
  selectedIds: string[];
  onToggle: (integrationId: string) => void;
  onNext: () => void;
}

function formatAddonPrice(price: number): string {
  return `+ ${price.toLocaleString('nb-NO')} kr`;
}

export function IntegrationsStep({
  serviceType,
  selectedIds,
  onToggle,
  onNext,
}: IntegrationsStepProps) {
  const integrations = pricingConfig.services[serviceType].integrations;

  return (
    <div>
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        Trenger du integrasjoner?
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {integrations.map((integration) => (
          <SelectableCard
            key={integration.id}
            label={integration.label}
            price={formatAddonPrice(integration.price)}
            selected={selectedIds.includes(integration.id)}
            onToggle={() => onToggle(integration.id)}
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
