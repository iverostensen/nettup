import { useReducer } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { springs } from '@/lib/animation';
import { STEP_ORDER } from './wizard/wizard-types';
import { wizardReducer, initialWizardState } from './wizard/wizard-reducer';
import { WizardStepper } from './wizard/WizardStepper';
import { GoalStep } from './wizard/steps/GoalStep';
import { SizeStep } from './wizard/steps/SizeStep';
import { FeaturesStep } from './wizard/steps/FeaturesStep';
import { IntegrationsStep } from './wizard/steps/IntegrationsStep';
import { DesignStep } from './wizard/steps/DesignStep';
import { ResultStep } from './wizard/steps/ResultStep';

function createSlideVariants(prefersReducedMotion: boolean | null): Variants {
  const offset = prefersReducedMotion ? 0 : 40;
  return {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir * offset,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir * -offset,
    }),
  };
}

export default function SmartPrisKalkulator() {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const prefersReducedMotion = useReducedMotion();

  const currentStepIndex = STEP_ORDER.indexOf(state.currentStep);
  const slideVariants = createSlideVariants(prefersReducedMotion);
  const showBack = state.currentStep !== 'goal' && state.currentStep !== 'result';

  function handleStepClick(index: number) {
    dispatch({ type: 'GO_TO_STEP', step: STEP_ORDER[index] });
  }

  function handleBack() {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      dispatch({ type: 'GO_TO_STEP', step: STEP_ORDER[prevIndex] });
    }
  }

  function renderStep() {
    switch (state.currentStep) {
      case 'goal':
        return (
          <GoalStep
            onSelectGoal={(serviceType) =>
              dispatch({ type: 'SELECT_GOAL', serviceType })
            }
          />
        );

      case 'size':
        if (!state.serviceType) return null;
        return (
          <SizeStep
            serviceType={state.serviceType}
            onSelectSize={(sizeId) =>
              dispatch({ type: 'SELECT_SIZE', sizeId })
            }
          />
        );

      case 'features':
        if (!state.serviceType) return null;
        return (
          <FeaturesStep
            serviceType={state.serviceType}
            selectedIds={state.featureIds}
            onToggle={(featureId) =>
              dispatch({ type: 'TOGGLE_FEATURE', featureId })
            }
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
          />
        );

      case 'integrations':
        if (!state.serviceType) return null;
        return (
          <IntegrationsStep
            serviceType={state.serviceType}
            selectedIds={state.integrationIds}
            onToggle={(integrationId) =>
              dispatch({ type: 'TOGGLE_INTEGRATION', integrationId })
            }
            onNext={() => dispatch({ type: 'NEXT_STEP' })}
          />
        );

      case 'design':
        if (!state.serviceType) return null;
        return (
          <DesignStep
            serviceType={state.serviceType}
            onSelectDesign={(designId) =>
              dispatch({ type: 'SELECT_DESIGN', designId })
            }
          />
        );

      case 'result':
        if (!state.serviceType || !state.sizeId || !state.designId) return null;
        return (
          <ResultStep
            state={state}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <WizardStepper
        currentStepIndex={currentStepIndex}
        onStepClick={handleStepClick}
      />

      <div className="mt-6">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="mb-4 flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Tilbake
          </button>
        )}

        <div className="rounded-md border border-white/10 bg-surface-raised p-6 sm:p-8">
          <AnimatePresence mode="wait" custom={state.direction}>
            <motion.div
              key={state.currentStep}
              custom={state.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.gentle}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
