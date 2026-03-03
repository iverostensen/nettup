import type { Config } from 'tailwindcss';
import { brand } from './src/config/brand';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Nettup brand palette
        brand: {
          DEFAULT: '#06b6d4', // cyan-500 - accent
          light: '#22d3ee',   // cyan-400 - hover
          dark: '#0891b2',    // cyan-600 - active
        },
        surface: {
          DEFAULT: '#020617', // slate-950 - main bg
          raised: '#0F172A',  // slate-900 - cards, sections
        },
        text: {
          DEFAULT: '#F8FAFC', // slate-50 - primary text
          muted: '#94A3B8',   // slate-400 - better contrast than 500
        },
      },
      fontFamily: {
        display: [brand.fonts.display],   // → font-display class (Space Grotesk)
        sans: [brand.fonts.body],         // → font-sans (unchanged, Inter)
      },
      borderRadius: {
        sm: brand.radius.sm,
        md: brand.radius.md,
        lg: brand.radius.lg,
        full: brand.radius.full,
      },
      transitionDuration: {
        fast: brand.duration.fast,
        normal: brand.duration.normal,
        slow: brand.duration.slow,
      },
      transitionTimingFunction: {
        snappy: brand.easing.snappy,
        gentle: brand.easing.gentle,
      },
      transitionDelay: {
        1: brand.delay[1],
        2: brand.delay[2],
        3: brand.delay[3],
        4: brand.delay[4],
        5: brand.delay[5],
      },
    },
  },
  plugins: [],
} satisfies Config;
