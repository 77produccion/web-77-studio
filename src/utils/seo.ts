import { uiTranslations, type SupportedLocale } from '@/lib/i18n/ui';

export interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  noindex?: boolean;
}

export const SITE_ORIGIN = 'https://www.77studio.co';

export const DEFAULT_SEO: SEOMetadata = {
  title: "77 Studio | Digital Studio + Creative Partner + AI Company",
  description: "Un solo equipo para hacer que tu empresa se vea mejor, venda mejor y funcione mejor. Marketing, Web, IA + Automatización y Productos Digitales (Colombia + USA).",
  canonical: `${SITE_ORIGIN}/`,
  ogImage: `${SITE_ORIGIN}/img/openGraph/og-image.png`,
  ogType: "website",
  keywords: [
    "77 Studio",
    "Digital Studio",
    "Creative Partner",
    "Marketing Digital Colombia USA",
    "Desarrollo Web Astro",
    "Automatización de Procesos",
    "Inteligencia Artificial para Empresas",
    "SaaS y Productos Digitales"
  ]
};

const ORGANIZATION_DESCRIPTION: Record<SupportedLocale, string> = {
  es: "Digital Studio + Creative Partner + Technology & AI Company en Colombia y Estados Unidos.",
  en: "Digital Studio + Creative Partner + Technology & AI Company in Colombia and the United States.",
};

const SECTION_LABELS: Record<SupportedLocale, Record<string, string>> = {
  es: {
    marketing: uiTranslations.es.nav.marketing,
    web: uiTranslations.es.nav.web,
    'ia-automatizacion': uiTranslations.es.nav.ia,
    'productos-digitales': uiTranslations.es.nav.productos,
    nosotros: uiTranslations.es.nav.nosotros,
    contacto: uiTranslations.es.nav.contacto,
  },
  en: {
    marketing: uiTranslations.en.nav.marketing,
    web: uiTranslations.en.nav.web,
    'ia-automatizacion': uiTranslations.en.nav.ia,
    'productos-digitales': uiTranslations.en.nav.productos,
    nosotros: uiTranslations.en.nav.nosotros,
    contacto: uiTranslations.en.nav.contacto,
  },
};

/** Resuelve una ruta o URL absoluta contra el origen canónico (www). */
export function toPublicUrl(site: URL, value: string): string {
  const origin = site.origin;
  if (/^https?:\/\//i.test(value)) {
    const parsed = new URL(value);
    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, origin).href;
  }
  return new URL(value, `${origin}/`).href;
}

/**
 * Las rutas de directorio de Astro se publican con barra final.
 * `src/pages/404.astro` es la excepción: Astro la emite como `/404.html`.
 */
export function directoryPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  if (pathname === '/404' || pathname === '/404/' || pathname === '/404.html') return '/404';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

interface StructuredDataInput {
  site: URL;
  canonical: string;
  pathname: string;
  lang: SupportedLocale;
  title: string;
  description: string;
  noindex?: boolean;
}

/**
 * JSON-LD de la página. Conserva ProfessionalService y añade logo,
 * Organization, WebSite y, en páginas interiores, BreadcrumbList.
 */
export function buildStructuredData({
  site,
  canonical,
  pathname,
  lang,
  title,
  description,
  noindex = false,
}: StructuredDataInput) {
  const origin = site.origin;
  const orgId = `${origin}/#organization`;
  const logoId = `${origin}/#logo`;
  const websiteId = `${origin}/#website`;
  const homeUrl = toPublicUrl(site, lang === 'en' ? '/en/' : '/');
  const ogImage = toPublicUrl(site, DEFAULT_SEO.ogImage ?? '/img/openGraph/og-image.png');
  const logoUrl = `${origin}/img/77studio.png`;

  const logo = {
    '@type': 'ImageObject',
    '@id': logoId,
    url: logoUrl,
    contentUrl: logoUrl,
    width: 1920,
    height: 1920,
    caption: '77 Studio',
  };

  const address = [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Armenia',
      addressCountry: 'CO',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressCountry: 'US',
    },
  ];

  const sameAs = [
    'https://www.instagram.com/77studio',
    'https://www.linkedin.com/company/77studio',
  ];

  const organization = {
    '@type': 'Organization',
    '@id': orgId,
    name: '77 Studio',
    url: `${origin}/`,
    logo: { '@id': logoId },
    image: ogImage,
    telephone: '+573148490955',
    address,
    sameAs,
  };

  const professionalService = {
    '@type': 'ProfessionalService',
    '@id': `${origin}/#business`,
    name: '77 Studio',
    image: ogImage,
    logo: { '@id': logoId },
    url: `${origin}/`,
    telephone: '+573148490955',
    priceRange: '$$',
    address,
    description: ORGANIZATION_DESCRIPTION[lang],
    sameAs,
    parentOrganization: { '@id': orgId },
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${origin}/`,
    name: '77 Studio',
    description: ORGANIZATION_DESCRIPTION[lang],
    inLanguage: ['es-CO', 'en-US'],
    publisher: { '@id': orgId },
  };

  const segments = pathname.split('/').filter((segment) => segment && segment !== 'en');
  const section = segments[0];
  const sectionLabel = section ? SECTION_LABELS[lang][section] : undefined;
  const breadcrumb = !noindex && sectionLabel
    ? {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '77 Studio',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: sectionLabel,
            item: canonical,
          },
        ],
      }
    : null;

  const webPage = noindex
    ? null
    : {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: lang === 'en' ? 'en-US' : 'es-CO',
        isPartOf: { '@id': websiteId },
        about: { '@id': orgId },
        publisher: { '@id': orgId },
        ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
      };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, logo, professionalService, website, webPage, breadcrumb].filter(Boolean),
  };
}
