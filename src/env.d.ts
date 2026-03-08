/// <reference types="astro/client" />

interface PlausibleOptions {
  props?: Record<string, string | number | boolean>;
  callback?: () => void;
  interactive?: boolean;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleOptions) => void;
  }
}
