import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

type Locale = 'es' | 'en';

// cwd del build, no import.meta.url: Vite reubica el módulo y la ruta relativa deja de apuntar a src/pages.
const pagesRoot = join(process.cwd(), 'src/pages');

const staticRoutes: Record<Locale, Set<string>> = {
  es: new Set(),
  en: new Set(),
};

const dynamicPrefixes: Record<Locale, string[]> = {
  es: [],
  en: [],
};

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(astro|md|mdx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

for (const file of walk(pagesRoot)) {
  let rel = relative(pagesRoot, file).replace(/\\/g, '/').replace(/\.(astro|md|mdx)$/, '');
  if (rel.endsWith('/index')) rel = rel.slice(0, -'/index'.length);
  else if (rel === 'index') rel = '';

  let locale: Locale = 'es';
  if (rel === 'en') {
    locale = 'en';
    rel = '';
  } else if (rel.startsWith('en/')) {
    locale = 'en';
    rel = rel.slice(3);
  }

  if (rel.includes('[')) {
    const prefix = rel
      .split('/')
      .filter((part) => part && !part.includes('['))
      .join('/');
    dynamicPrefixes[locale].push(prefix ? `/${prefix}` : '/');
  } else {
    staticRoutes[locale].add(rel ? `/${rel}` : '/');
  }
}

/** Separa el prefijo /en y deja la ruta sin barra final. `/` se conserva. */
export function splitLocale(pathname: string): { locale: Locale; base: string } {
  let path = pathname.split('?')[0]?.split('#')[0] ?? '/';
  if (!path.startsWith('/')) path = `/${path}`;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  if (path === '/en' || path.startsWith('/en/')) {
    const rest = path.slice(3);
    return { locale: 'en', base: rest === '' ? '/' : rest };
  }

  return { locale: 'es', base: path || '/' };
}

function localeHasRoute(locale: Locale, base: string): boolean {
  if (staticRoutes[locale].has(base)) return true;
  return dynamicPrefixes[locale].some((prefix) => base === prefix || base.startsWith(`${prefix}/`));
}

/** True solo si esa URL la genera una página Astro (estática o dinámica). */
export function routeExists(pathname: string): boolean {
  const { locale, base } = splitLocale(pathname);
  return localeHasRoute(locale, base);
}

function publicPath(locale: Locale, base: string): string {
  if (base === '/404') return locale === 'en' ? '/en/404' : '/404';
  if (base === '/') return locale === 'en' ? '/en/' : '/';
  const localized = locale === 'en' ? `/en${base}` : base;
  return `${localized}/`;
}

/**
 * Alternates que sí existen. El blog, por ejemplo, solo devuelve español:
 * no se fabrica `/en/blog/...`.
 */
export function alternatePathMap(pathname: string): { es?: string; en?: string } {
  const { base } = splitLocale(pathname);
  const result: { es?: string; en?: string } = {};
  if (localeHasRoute('es', base)) result.es = publicPath('es', base);
  if (localeHasRoute('en', base)) result.en = publicPath('en', base);
  return result;
}
