/**
 * Plausible Analytics wrapper.
 * Guards against SSR (window undefined) and adblocker blocking (plausible undefined).
 * All event names use Title Case per Plausible convention.
 */

function track(eventName: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.plausible?.(eventName, props ? { props } : undefined);
}

function buildEstimateRange(min: number, max: number): string {
  return `${Math.round(min / 1000)}k-${Math.round(max / 1000)}k`;
}

export function trackContactFormSubmit(): void {
  track('Contact Form Submit');
}

export function trackB2BFormSubmit(): void {
  track('B2B Form Submit');
}

export function trackWizardEstimateShown(min: number, max: number, goal: string): void {
  track('Wizard Estimate Shown', { estimate_range: buildEstimateRange(min, max), goal });
}

export function trackWizardCtaClicked(min: number, max: number, goal: string): void {
  track('Wizard CTA Clicked', { estimate_range: buildEstimateRange(min, max), goal });
}

export function trackChatbotOpened(): void {
  track('Chatbot Opened');
}

export function trackChatbotSuggestionClicked(suggestion: string): void {
  track('Chatbot Suggestion Clicked', { suggestion });
}

export function trackB2BLead(): void {
  track('B2B Lead');
}
