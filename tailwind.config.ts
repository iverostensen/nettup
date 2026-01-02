import type { Config } from 'tailwindcss';

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
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
