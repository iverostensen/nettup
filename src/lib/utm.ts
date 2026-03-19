const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

/**
 * Capture UTM params from current URL into sessionStorage.
 * Call once on landing page load.
 */
export function captureUtmParams(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      sessionStorage.setItem(key, value);
    }
  }
}

/**
 * Retrieve stored UTM params for form submission payload.
 * Returns separate fields for Formspree dashboard filtering.
 */
export function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const result: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = sessionStorage.getItem(key);
    if (value) {
      result[key] = value;
    }
  }
  return result;
}
