import type { ServiceType } from '@/config/pricing-config';
import { GoalCard } from '../cards/GoalCard';

interface GoalStepProps {
  onSelectGoal: (serviceType: ServiceType) => void;
}

const goals: { serviceType: ServiceType; label: string; subLabel: string }[] = [
  {
    serviceType: 'nettside',
    label: 'Få flere kunder til bedriften',
    subLabel: 'Profesjonell nettside som konverterer besøkende',
  },
  {
    serviceType: 'nettbutikk',
    label: 'Selge produkter på nett',
    subLabel: 'Komplett nettbutikk med betaling og lagerstyring',
  },
  {
    serviceType: 'landingsside',
    label: 'Markedsføre en kampanje eller tilbud',
    subLabel: 'En fokusert landingsside som overbeviser',
  },
];

export function GoalStep({ onSelectGoal }: GoalStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        Hva er målet ditt?
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        Svar på noen spørsmål og få et prisestimat &ndash; tar under ett minutt.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal.serviceType}
            label={goal.label}
            subLabel={goal.subLabel}
            onClick={() => onSelectGoal(goal.serviceType)}
          />
        ))}
      </div>
    </div>
  );
}
