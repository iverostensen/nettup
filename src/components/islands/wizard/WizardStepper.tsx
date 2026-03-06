import clsx from 'clsx';
import { STEP_ORDER, STEP_LABELS } from './wizard-types';

interface WizardStepperProps {
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export function WizardStepper({
  currentStepIndex,
  onStepClick,
}: WizardStepperProps) {
  return (
    <nav aria-label="Wizard-fremgang" className="flex items-center justify-center gap-0">
      {STEP_ORDER.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isFuture = index > currentStepIndex;
        const label = STEP_LABELS[step];

        return (
          <div key={step} className="flex items-center">
            {index > 0 && (
              <div
                className={clsx(
                  'h-0.5 w-4 sm:w-6 md:w-8',
                  isCompleted || isCurrent ? 'bg-brand/40' : 'bg-white/10',
                )}
              />
            )}

            <button
              type="button"
              onClick={() => isCompleted && onStepClick(index)}
              disabled={!isCompleted}
              className={clsx(
                'flex flex-col items-center gap-1',
                isCompleted && 'cursor-pointer',
                isFuture && 'cursor-default',
              )}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span
                className={clsx(
                  'flex items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  'h-7 w-7 md:h-8 md:w-8',
                  isCurrent && 'bg-brand text-white',
                  isCompleted &&
                    'bg-brand/20 text-brand hover:bg-brand/30',
                  isFuture && 'bg-white/5 text-text-muted',
                )}
              >
                {index + 1}
              </span>
              <span
                className={clsx(
                  'hidden text-xs md:inline',
                  isCurrent ? 'text-text' : 'text-text-muted',
                )}
              >
                {label}
              </span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
