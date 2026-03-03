// src/lib/animation.ts
// Centralized Framer Motion variant presets and timing constants.
// All timing values in seconds (Framer Motion) — derived from brand.ts ms values.
// Components must import from here instead of hardcoding transition values.

import type { Variants, Transition } from 'framer-motion';

// Timing constants — seconds (not ms strings from brand.ts)
export const duration = {
  fast: 0.15,   // brand.ts: 150ms
  normal: 0.3,  // brand.ts: 300ms
  slow: 0.5,    // brand.ts: 500ms
} as const;

export const delay = {
  1: 0.1,
  2: 0.2,
  3: 0.3,
  4: 0.4,
  5: 0.5,
} as const;

// Spring physics presets — "snappy and confident" energy
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  gentle: { type: 'spring', stiffness: 200, damping: 28 } satisfies Transition,
  pop:    { type: 'spring', stiffness: 500, damping: 25 } satisfies Transition,
} as const;

// Variant presets — hidden/visible pattern for use with initial="hidden" animate="visible"
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

export const springPop: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

// Stagger orchestrators — place on parent motion.* element
// Children must also be motion.* elements with variants prop set

// For scroll-triggered grid/card sections (80ms stagger per locked decision)
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// For hero orchestration — faster stagger for snappy entry
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};
