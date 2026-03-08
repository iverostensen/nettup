/// <reference types="astro/client" />

interface PlausibleOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  interactive?: boolean;
}

interface Window {
  plausible?: (eventName: string, options?: PlausibleOptions) => void;
}
