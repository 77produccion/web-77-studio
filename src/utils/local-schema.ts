import {
  AREA_SERVED,
  HUB_PATH,
  cityPath,
  getLocalService,
  type CityPage,
  type Faq,
  type ServiceCityPage,
} from '@/data/local-coverage';
import { BUSINESS_NAME } from '@/utils/nap';

const ORIGIN = 'https://www.77studio.co';

function absolute(path: string): string {
  return new URL(path, `${ORIGIN}/`).href;
}

function faqNode(url: string, faqs: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

function areaForCity(city: CityPage) {
  return [
    { '@type': 'Country', name: 'Colombia' },
    {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: city.department,
        containedInPlace: { '@type': 'Country', name: 'Colombia' },
      },
    },
    ...city.municipalities.map((place) => ({
      '@type': 'City',
      name: place.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: place.department,
        containedInPlace: { '@type': 'Country', name: 'Colombia' },
      },
    })),
  ];
}

export function hubJsonLd(faqs: Faq[]) {
  const url = absolute(HUB_PATH);
  return [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: 'Marketing digital, automatización e IA en el Eje Cafetero',
      serviceType: 'Marketing, automatización, agentes de IA y páginas web',
      description:
        'Cobertura de 77 Studio en Armenia, Pereira, Manizales, los municipios cercanos y el resto de Colombia. La sede física está en Armenia.',
      url,
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: AREA_SERVED,
      availableLanguage: 'es',
    },
    faqNode(url, faqs),
  ];
}

export function cityJsonLd(city: CityPage) {
  const url = absolute(cityPath(city.slug));
  return [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: city.h1,
      serviceType: 'Marketing digital, automatización e inteligencia artificial',
      description: city.description,
      url,
      provider: { '@type': 'Organization', '@id': `${ORIGIN}/#organization`, name: BUSINESS_NAME },
      areaServed: areaForCity(city),
      availableLanguage: 'es',
    },
    faqNode(url, city.faqs),
  ];
}

export function serviceCityJsonLd(city: CityPage, page: ServiceCityPage) {
  const service = getLocalService(page.service);
  const url = absolute(`/eje-cafetero/${city.slug}/${page.service}/`);
  return [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: page.h1,
      serviceType: service?.name ?? page.h1,
      description: page.description,
      url,
      provider: { '@id': `${ORIGIN}/#organization` },
      areaServed: areaForCity(city),
      availableLanguage: 'es',
    },
    faqNode(url, page.faqs),
  ];
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': data,
  }).replace(/</g, '\\u003c');
}
