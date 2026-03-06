import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://nettup.no',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        if (item.url === 'https://nettup.no/blogg/') {
          return { ...item, changefreq: 'weekly', priority: 0.8 };
        }
        if (item.url.startsWith('https://nettup.no/blogg/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  legacy: {
    collections: true,
  },
});
