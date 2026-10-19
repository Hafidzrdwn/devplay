import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';

export default defineConfig({
  site: 'https://devplay.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx(), pagefind()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'tap',
  },
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    '/': '/id/',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@radix-ui/react-dialog', 'cmdk'],
      esbuildOptions: {
        sourcemap: 'inline',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (
              normalizedId.includes('node_modules/three') ||
              normalizedId.includes('node_modules/@react-three')
            ) {
              return 'three-vendor';
            }
          },
        },
      },
    },
  },
});
