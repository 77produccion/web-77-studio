// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

/**
 * Excluye del sitemap rutas que no deben indexarse (API, 404 y archivos técnicos).
 * @param {string} page
 */
function isIndexableSitemapPage(page) {
  const { pathname } = new URL(page);
  if (pathname === '/api' || pathname.startsWith('/api/')) return false;
  if (/\.(txt|xml)$/i.test(pathname)) return false;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized !== '/404' && normalized !== '/en/404';
}

// https://astro.build/config
export default defineConfig({
  // El apex 77studio.co responde 308 hacia www. Canonical, hreflang, OG y sitemap usan el destino.
  site: 'https://www.77studio.co',
  integrations: [
    mdx(),
    sitemap({
      filter: isIndexableSitemapPage,
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
      namespaces: {
        news: false,
        xhtml: true,
        image: false,
        video: false,
      },
      serialize(item) {
        const links = item.links ?? [];
        const spanish = links.find((link) => link.lang === 'es');
        if (spanish && !links.some((link) => link.lang === 'x-default')) {
          item.links = [...links, { lang: 'x-default', url: spanish.url }];
        }
        return item;
      },
    }),
  ],
  output: 'static',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())]
  }
});
