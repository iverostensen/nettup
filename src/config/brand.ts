// src/config/brand.ts
// Single source of truth for all design tokens.
// Components reference Tailwind classes derived from these tokens, not this file directly.

export const brand = {
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  fontWeight: {
    h1: '700',
    h2: '600',
  },
  radius: {
    sm: '0.375rem',   // 6px — badges, tags
    md: '0.75rem',    // 12px — cards, inputs (matches Tailwind rounded-xl = 0.75rem)
    lg: '1.5rem',     // 24px — larger containers
    full: '9999px',   // buttons
  },
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'ease-out',
    snappy: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    gentle: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  delay: {
    1: '100ms',
    2: '200ms',
    3: '300ms',
    4: '400ms',
    5: '500ms',
  },
} as const;

export type Brand = typeof brand;
