// src/lib/i18n/utils.ts
import { uiTranslations, type SupportedLocale, DEFAULT_LOCALE, LOCALES } from './ui';

/**
 * Detecta el idioma actual a partir de la URL
 */
export function getLangFromUrl(url: URL | string): SupportedLocale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && LOCALES.includes(segments[0] as SupportedLocale)) {
    return segments[0] as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Las páginas viven con barra final. Un archivo (último segmento con punto) se deja igual.
 */
function withDirectorySlash(value: string): string {
  const hashAt = value.indexOf('#');
  const hash = hashAt >= 0 ? value.slice(hashAt) : '';
  const beforeHash = hashAt >= 0 ? value.slice(0, hashAt) : value;
  const queryAt = beforeHash.indexOf('?');
  const query = queryAt >= 0 ? beforeHash.slice(queryAt) : '';
  const pathname = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;

  if (!pathname || pathname === '/') return `/${query}${hash}`;

  const segment = pathname.split('/').filter(Boolean).pop() ?? '';
  if (segment.includes('.')) return `${pathname}${query}${hash}`;

  const slashed = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${slashed}${query}${hash}`;
}

/**
 * Genera la ruta equivalente en el idioma destino preservando la página actual.
 * Ej:
 *  - currentUrl: '/marketing/', targetLang: 'en' => '/en/marketing/'
 *  - currentUrl: '/en/marketing/', targetLang: 'es' => '/marketing/'
 *  - currentUrl: '/', targetLang: 'en' => '/en/'
 *  - currentUrl: '/en/', targetLang: 'es' => '/'
 */
export function getAlternateLocaleUrl(url: URL | string, targetLang: SupportedLocale): string {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const search = typeof url === 'string' ? '' : url.search;
  const hash = typeof url === 'string' ? '' : url.hash;

  const currentLang = getLangFromUrl(url);

  let basePath = pathname;
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    basePath = pathname.replace(/^\/en\/?/, '') || '/';
    if (!basePath.startsWith('/')) basePath = `/${basePath}`;
  }

  if (currentLang === targetLang) {
    return withDirectorySlash(`${pathname}${search}${hash}`);
  }

  if (targetLang === 'en') {
    const localized = basePath === '/' ? '/en/' : `/en${basePath}`;
    return withDirectorySlash(`${localized}${search}${hash}`);
  }

  return withDirectorySlash(`${basePath}${search}${hash}`);
}

/**
 * Genera un enlace prefijado con el idioma activo, con barra final en páginas.
 */
export function getLocalizedPath(path: string, lang: SupportedLocale = DEFAULT_LOCALE): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') {
    const localized = cleanPath === '/' ? '/en/' : `/en${cleanPath}`;
    return withDirectorySlash(localized);
  }
  return withDirectorySlash(cleanPath);
}

/**
 * Hook tipado para obtener traducciones de UI
 */
export function useTranslations(lang: SupportedLocale = DEFAULT_LOCALE) {
  return uiTranslations[lang] || uiTranslations[DEFAULT_LOCALE];
}
