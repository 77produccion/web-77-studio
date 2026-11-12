// @ts-check
import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import Beasties from 'beasties';
import rehypeWrapTables from './src/utils/rehype-wrap-tables.mjs';

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walkHtml(dir) {
  /** @type {string[]} */
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walkHtml(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

/** Inline critical CSS and defer the rest so the homepage LCP is not blocked by the full stylesheet. */
function criticalCss() {
  return {
    name: 'critical-css',
    hooks: {
      /** @param {{ dir: URL }} params */
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const clientRoot = existsSync(join(root, 'client', '_astro')) ? join(root, 'client') : root;
        const beasties = new Beasties({
          path: clientRoot,
          publicPath: '/',
          preload: 'swap',
          noscriptFallback: true,
          pruneSource: false,
          mergeStylesheets: true,
          reduceInlineStyles: false,
          // Las fuentes las controla el layout. Beasties no debe precargar Inter ni Plex junto al CSS.
          fonts: false,
          external: true,
        });
        for (const file of await walkHtml(clientRoot)) {
          if (file.endsWith('google038b51b14f2f9c7c.html')) continue;
          const html = await readFile(file, 'utf8');
          const next = await beasties.process(html);
          if (next !== html) await writeFile(file, next);
        }
      },
    },
  };
}
import { routeExists } from './src/utils/public-routes.ts';

/**
 * Excluye del sitemap rutas que no deben indexarse (API, 404 y archivos técnicos).
 * @param {string} page
 */
function isIndexableSitemapPage(page) {
  const { pathname } = new URL(page);
  if (pathname === '/api' || pathname.startsWith('/api/')) return false;
  if (/\.(txt|xml)$/i.test(pathname)) return false;
  if (pathname.endsWith('/google038b51b14f2f9c7c.html')) return false;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return normalized !== '/404' && normalized !== '/en/404';
}

// https://astro.build/config
export default defineConfig({
  // El apex 77studio.co responde 308 hacia www. Canonical, hreflang, OG y sitemap usan el destino.
  site: 'https://www.77studio.co',
  // El adapter fija build.format "directory". Vercel (trailingSlash: true) responde 308
  // hacia la barra final. Los archivos (txt, xml, assets) no entran en esa redirección.
  trailingSlash: 'always',
  integrations: [
    criticalCss(),
    mdx({
      rehypePlugins: [rehypeWrapTables],
    }),
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
        const existing = (item.links ?? []).filter((link) => {
          try {
            return routeExists(new URL(link.url).pathname);
          } catch {
            return false;
          }
        });
        const withoutDefault = existing.filter((link) => link.lang !== 'x-default');
        const spanish = withoutDefault.find((link) => link.lang === 'es');
        const preferred = spanish ?? withoutDefault[0];
        if (preferred && withoutDefault.length > 1) {
          item.links = [...withoutDefault, { lang: 'x-default', url: preferred.url }];
        } else {
          delete item.links;
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
