import { uiTranslations, type SupportedLocale } from '@/lib/i18n/ui';
import { AREA_SERVED } from '@/data/local-coverage';
import {
  BUSINESS_NAME,
  FOUNDING_DATE,
  GEO_COORDINATES,
  OPENING_HOURS_SPEC,
  PHONE_E164,
  POSTAL_ADDRESS,
  SAME_AS,
} from '@/utils/nap';

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
  title: "77 Studio en Armenia | Marketing, automatización e IA para el Eje Cafetero",
  description: "Socio de crecimiento en Armenia, Quindío. Marketing digital, automatización, agentes de IA y páginas web para empresas del Eje Cafetero, Colombia y Estados Unidos.",
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
  es: "77 Studio es un socio de crecimiento con sede en Armenia, Quindío. Marketing digital, automatización, agentes de IA y páginas web para el Eje Cafetero, Colombia y Estados Unidos. Opera como 77 Studio SAS y 77 Studio LLC.",
  en: "77 Studio is a growth and technology partner for companies in Colombia, Latin America, and the United States. It operates as 77 Studio SAS and 77 Studio LLC. AI marketing, automation, web development, and digital products.",
};

const SERVICES: Record<string, Record<SupportedLocale, { name: string; serviceType: string; description: string }>> = {
  marketing: {
    es: {
      name: 'Marketing con IA',
      serviceType: 'Marketing digital, Meta Ads y Google Ads',
      description: 'Estrategia, Meta Ads, Google Ads, contenido y automatización para captar clientes en Colombia, Latinoamérica y Estados Unidos.',
    },
    en: {
      name: 'AI marketing',
      serviceType: 'Digital marketing, Meta Ads and Google Ads',
      description: 'Strategy, Meta Ads, Google Ads, creative, and automation to capture qualified demand in Colombia, Latin America, and the United States.',
    },
  },
  web: {
    es: {
      name: 'Desarrollo web',
      serviceType: 'Sitios web y landing pages',
      description: 'Sitios corporativos y landing pages rápidas, con enfoque de conversión y SEO, para empresas en Colombia, Latinoamérica y Estados Unidos.',
    },
    en: {
      name: 'Web development',
      serviceType: 'Websites and landing pages',
      description: 'Fast corporate websites and landing pages built for conversion and SEO, for companies in Colombia, Latin America, and the United States.',
    },
  },
  'ia-automatizacion': {
    es: {
      name: 'IA y automatización',
      serviceType: 'Automatización de procesos y agentes de IA',
      description: 'Automatización de procesos, conexión de herramientas y agentes de IA para empresas en Colombia, Latinoamérica y Estados Unidos.',
    },
    en: {
      name: 'AI and automation',
      serviceType: 'Process automation and AI agents',
      description: 'Workflow automation, tool integrations, and AI agents for companies in Colombia, Latin America, and the United States.',
    },
  },
  'productos-digitales': {
    es: {
      name: 'Productos digitales',
      serviceType: 'Software a medida, SaaS y dashboards',
      description: 'MVPs, plataformas SaaS, portales y dashboards a medida para empresas en Colombia, Latinoamérica y Estados Unidos.',
    },
    en: {
      name: 'Digital products',
      serviceType: 'Custom software, SaaS and dashboards',
      description: 'MVPs, SaaS platforms, portals, and dashboards for companies in Colombia, Latin America, and the United States.',
    },
  },
};

const SECTION_LABELS: Record<SupportedLocale, Record<string, string>> = {
  es: {
    marketing: uiTranslations.es.nav.marketing,
    web: uiTranslations.es.nav.web,
    'ia-automatizacion': uiTranslations.es.nav.ia,
    'productos-digitales': uiTranslations.es.nav.productos,
    nosotros: uiTranslations.es.nav.nosotros,
    contacto: uiTranslations.es.nav.contacto,
    blog: 'Blog',
    'eje-cafetero': 'Eje Cafetero',
  },
  en: {
    marketing: uiTranslations.en.nav.marketing,
    web: uiTranslations.en.nav.web,
    'ia-automatizacion': uiTranslations.en.nav.ia,
    'productos-digitales': uiTranslations.en.nav.productos,
    nosotros: uiTranslations.en.nav.nosotros,
    contacto: uiTranslations.en.nav.contacto,
    blog: 'Blog',
    'eje-cafetero': 'Coffee Axis',
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
  /** Nombre visible de la última miga cuando la URL tiene más de un nivel (artículos). */
  breadcrumbLabel?: string;
  /** Si viene, reemplaza el cálculo automático de migas. */
  breadcrumbTrail?: { name: string; path: string }[];
  /** @id schema de la entidad principal de esta URL. */
  mainEntityId?: string;
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
  breadcrumbLabel,
  breadcrumbTrail,
  mainEntityId,
}: StructuredDataInput) {
  const origin = site.origin;
  const orgId = `${origin}/#organization`;
  const logoId = `${origin}/#logo`;
  const websiteId = `${origin}/#website`;
  const homeUrl = toPublicUrl(site, lang === 'en' ? '/en/' : '/');
  const ogImage = toPublicUrl(site, DEFAULT_SEO.ogImage ?? '/img/openGraph/og-image.png');
  // Cuadrado con fondo negro sólido. /img/77studio.png es el 77 blanco sobre
  // transparente (1920) y en Google se ve como un punto blanco.
  const logoUrl = `${origin}/icon-512.png`;

  const logo = {
    '@type': 'ImageObject',
    '@id': logoId,
    url: logoUrl,
    contentUrl: logoUrl,
    width: 512,
    height: 512,
    caption: '77 Studio',
  };

  const address = POSTAL_ADDRESS;

  // Perfiles del Google Business Profile. No hay LinkedIn ni URL pública del perfil de Google.
  const sameAs = SAME_AS;

  const serviceNodes = Object.entries(SERVICES).map(([slug, copy]) => {
    const url = `${origin}/${slug}/`;
    const localized = copy[lang];
    return {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: localized.name,
      serviceType: localized.serviceType,
      description: localized.description,
      url,
      provider: { '@id': orgId },
      areaServed: AREA_SERVED,
      availableLanguage: ['es', 'en'],
    };
  });

  const organization = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': orgId,
    name: BUSINESS_NAME,
    legalName: '77 Studio SAS',
    alternateName: ['77 Studio LLC'],
    url: `${origin}/`,
    logo: { '@id': logoId },
    image: ogImage,
    description: ORGANIZATION_DESCRIPTION[lang],
    telephone: PHONE_E164,
    address,
    geo: GEO_COORDINATES,
    foundingDate: FOUNDING_DATE,
    openingHoursSpecification: OPENING_HOURS_SPEC,
    areaServed: AREA_SERVED,
    founder: {
      '@type': 'Person',
      name: 'Jordan Cruz',
      alternateName: 'Yordan Leandro Cruz Álvarez',
      jobTitle: 'CEO & Fundador',
    },
    sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: lang === 'en' ? 'Services' : 'Servicios',
      itemListElement: serviceNodes.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@id': service['@id'] },
      })),
    },
  };

  const professionalService = {
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${origin}/#business`,
    name: BUSINESS_NAME,
    image: ogImage,
    logo: { '@id': logoId },
    url: `${origin}/`,
    telephone: PHONE_E164,
    priceRange: '$$',
    address,
    geo: GEO_COORDINATES,
    foundingDate: FOUNDING_DATE,
    openingHoursSpecification: OPENING_HOURS_SPEC,
    description: ORGANIZATION_DESCRIPTION[lang],
    areaServed: AREA_SERVED,
    founder: { '@type': 'Person', name: 'Jordan Cruz' },
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
  const serviceSlug = section && SERVICES[section] ? section : undefined;
  const currentService = serviceSlug ? serviceNodes.find((service) => service.url.endsWith(`/${serviceSlug}/`)) : undefined;

  const explicitCrumbs = !noindex && breadcrumbTrail?.length
    ? breadcrumbTrail.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: toPublicUrl(site, crumb.path),
      }))
    : null;

  const breadcrumbItems = explicitCrumbs
    ?? (!noindex && sectionLabel
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: '77 Studio',
            item: homeUrl,
          },
          ...(segments[0] === 'blog' && segments.length > 1
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Blog',
                  item: toPublicUrl(site, '/blog/'),
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: breadcrumbLabel || title,
                  item: canonical,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: sectionLabel,
                  item: canonical,
                },
              ]),
        ]
      : []);

  const breadcrumb = breadcrumbItems.length
    ? {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: breadcrumbItems,
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
        ...(mainEntityId
          ? { mainEntity: { '@id': mainEntityId } }
          : currentService
            ? { mainEntity: { '@id': currentService['@id'] } }
            : {}),
        ...(breadcrumb ? { breadcrumb: { '@id': breadcrumb['@id'] } } : {}),
      };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, logo, professionalService, website, ...serviceNodes, webPage, breadcrumb].filter(Boolean),
  };
}
