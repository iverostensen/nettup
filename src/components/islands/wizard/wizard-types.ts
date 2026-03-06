import type { ServiceType } from '@/config/pricing-config';

export type WizardStep =
  | 'goal'
  | 'size'
  | 'features'
  | 'integrations'
  | 'design'
  | 'result';

export const STEP_ORDER: WizardStep[] = [
  'goal',
  'size',
  'features',
  'integrations',
  'design',
  'result',
];

export const STEP_LABELS: Record<WizardStep, string> = {
  goal: 'Mal',
  size: 'Storrelse',
  features: 'Funksjoner',
  integrations: 'Integrasjoner',
  design: 'Design',
  result: 'Resultat',
};

export interface WizardState {
  currentStep: WizardStep;
  serviceType: ServiceType | null;
  sizeId: string | null;
  featureIds: string[];
  integrationIds: string[];
  designId: string | null;
  direction: 1 | -1;
}

export type WizardAction =
  | { type: 'SELECT_GOAL'; serviceType: ServiceType }
  | { type: 'SELECT_SIZE'; sizeId: string }
  | { type: 'TOGGLE_FEATURE'; featureId: string }
  | { type: 'TOGGLE_INTEGRATION'; integrationId: string }
  | { type: 'SELECT_DESIGN'; designId: string }
  | { type: 'NEXT_STEP' }
  | { type: 'GO_TO_STEP'; step: WizardStep }
  | { type: 'RESET' };
