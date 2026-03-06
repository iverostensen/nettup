import type { WizardState, WizardAction } from './wizard-types';
import { STEP_ORDER } from './wizard-types';

export const initialWizardState: WizardState = {
  currentStep: 'goal',
  serviceType: null,
  sizeId: null,
  featureIds: [],
  integrationIds: [],
  designId: null,
  direction: 1,
};

function nextStep(state: WizardState): WizardState {
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);
  const next = STEP_ORDER[currentIndex + 1];
  if (!next) return state;
  return { ...state, currentStep: next, direction: 1 };
}

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case 'SELECT_GOAL':
      return nextStep({
        ...initialWizardState,
        serviceType: action.serviceType,
        direction: 1,
      });

    case 'SELECT_SIZE':
      return nextStep({
        ...state,
        sizeId: action.sizeId,
      });

    case 'TOGGLE_FEATURE': {
      const has = state.featureIds.includes(action.featureId);
      return {
        ...state,
        featureIds: has
          ? state.featureIds.filter((id) => id !== action.featureId)
          : [...state.featureIds, action.featureId],
      };
    }

    case 'TOGGLE_INTEGRATION': {
      const has = state.integrationIds.includes(action.integrationId);
      return {
        ...state,
        integrationIds: has
          ? state.integrationIds.filter((id) => id !== action.integrationId)
          : [...state.integrationIds, action.integrationId],
      };
    }

    case 'SELECT_DESIGN':
      return nextStep({
        ...state,
        designId: action.designId,
      });

    case 'NEXT_STEP':
      return nextStep(state);

    case 'GO_TO_STEP': {
      const targetIndex = STEP_ORDER.indexOf(action.step);
      const currentIndex = STEP_ORDER.indexOf(state.currentStep);
      if (targetIndex >= currentIndex) return state;
      return {
        ...state,
        currentStep: action.step,
        direction: targetIndex < currentIndex ? -1 : 1,
      };
    }

    case 'RESET':
      return { ...initialWizardState, direction: -1 };

    default:
      return state;
  }
}
