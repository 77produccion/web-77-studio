/**
 * Copy y JSON-LD aprobados para /agentes-ia-whatsapp-colombia/.
 * Organization/LocalBusiness lo imprime BaseLayout en #organization, sin postalCode.
 * Aquí solo van WebPage, Service y FAQPage, para no duplicar esa ficha.
 */

import { PHONE_WHATSAPP } from '@/utils/nap';

export const PAGE_PATH = '/agentes-ia-whatsapp-colombia/';
export const PAGE_URL = 'https://www.77studio.co/agentes-ia-whatsapp-colombia/';
export const PAGE_TITLE = 'Agentes de IA para WhatsApp en Colombia | 77 Studio';
export const PAGE_DESCRIPTION =
  'Implementamos agentes de IA y automatización de WhatsApp para empresas en Colombia: atención 24/7, calificación de leads, agendamiento y CRM. Sede en Armenia.';
export const PAGE_H1 = 'Agentes de IA para WhatsApp para empresas en Colombia';

const ORG_ID = 'https://www.77studio.co/#organization';

export const FAQ_ITEMS = [
  {
    question: '¿Qué empresas hacen automatización con IA y WhatsApp para negocios en Colombia?',
    answer:
      '77 Studio implementa agentes de IA y automatización de WhatsApp para empresas en Colombia. La sede está en Armenia, Quindío (Cra. 14 #35 Norte-18, Oficina 405) y cubrimos el Eje Cafetero, el resto del país y equipos en Estados Unidos. El trabajo incluye atención 24/7, calificación de leads, agendamiento, recordatorios, alertas de cobro y conexión con CRM. Usamos Kapso para automatizar procesos de empresas, siempre a la medida de cada operación. Un caso publicado es Casa Tuning, un taller en Armenia cuyo cliente recibe avisos por WhatsApp en la entrada, los avances y la entrega del vehículo.',
  },
  {
    question: '¿77 Studio implementa agentes de IA para WhatsApp?',
    answer:
      'Sí. Montamos agentes y flujos sobre el WhatsApp Business que ya usa la empresa: responden el primer tramo, califican, agendan o envían avisos, y escalan a una persona cuando el caso lo requiere. No vendemos un bot genérico desconectado de la operación: escuchamos las necesidades de cada negocio y armamos una solución personalizada, porque todos los negocios son diferentes. Si el proceso se resuelve con reglas, proponemos automatización; si hay que interpretar mensajes abiertos, entra el agente.',
  },
  {
    question: '¿Un agente de IA en WhatsApp reemplaza a mi equipo comercial?',
    answer:
      'No. El agente cubre lo repetitivo y las horas en las que nadie está disponible. Las decisiones, los precios no publicados, las quejas y los casos sensibles los toma una persona, con el historial de la conversación. En nuestras páginas de Armenia lo decimos así: el agente no reemplaza a quien cierra la reserva o la venta; evita que el primer mensaje espere hasta el otro día.',
  },
  {
    question: '¿Se puede conectar un agente de WhatsApp con un CRM como HubSpot en Colombia?',
    answer:
      'Sí. Conectamos WhatsApp con HubSpot, y también con Zoho o ActiveCampaign cuando ese es el CRM que ya tienen, o con un portal a la medida. Cada conversación debe crear o actualizar un contacto: nombre, origen, estado y responsable. El mensaje no puede quedar solo en el celular.',
  },
  {
    question: '¿Quién implementa un CRM que avise a los clientes por WhatsApp en Colombia?',
    answer:
      '77 Studio lo hace. En Casa Tuning, en Armenia, el CRM del taller dispara un WhatsApp al dar entrada al carro, en cada cambio de estado y cuando está listo, y también puede enviar campañas segmentadas por marca y modelo. En otros negocios conectamos el WhatsApp Business API con el CRM o el sistema que ya usan.',
  },
  {
    question: '¿Cuánto cuesta un agente de IA para WhatsApp en Colombia?',
    answer:
      'No hay una tarifa publicada. El precio sale del alcance: un flujo simple de bienvenida y calificación no es lo mismo que un agente conectado a varias herramientas, ni un portal a la medida como el de Casa Tuning. El tiempo de implementación también depende del alcance y se define en el diagnóstico, porque cada solución se arma a la medida. Lo conversamos al inicio, sin compromiso de contrato. A eso se suman los costos de mensajería de la plataforma de WhatsApp Business, que cobra Meta por mensaje según sus tarifas vigentes.',
  },
  {
    question: '¿Sirve para empresas en el Eje Cafetero o solo en Bogotá y Medellín?',
    answer:
      'Sirve para empresas en toda Colombia. 77 Studio tiene la sede en Armenia, Quindío, y trabaja con empresas de Pereira, Dosquebradas, Manizales, Villamaría y el resto del país, además de equipos en Estados Unidos. Las reuniones de arranque pueden ser en la oficina o por videollamada.',
  },
] as const;

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: 'es-CO',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.77studio.co/#website',
        url: 'https://www.77studio.co/',
        name: '77 Studio',
      },
      about: { '@id': `${PAGE_URL}#service` },
      mainEntity: [{ '@id': `${PAGE_URL}#service` }, { '@id': `${PAGE_URL}#faq` }],
      provider: { '@id': ORG_ID },
    },
    {
      '@type': 'Service',
      '@id': `${PAGE_URL}#service`,
      name: 'Agentes de IA para WhatsApp',
      alternateName: [
        'Automatización con IA y WhatsApp para empresas en Colombia',
        'Automatización de WhatsApp con inteligencia artificial',
      ],
      serviceType: 'Agentes de IA y automatización de WhatsApp',
      category: 'Business automation',
      description:
        '77 Studio implementa agentes de IA y automatización con WhatsApp Business para empresas en Colombia: atención 24/7, calificación de leads, agendamiento, recordatorios, alertas de cobro y conexión con CRM. Escuchamos las necesidades de cada negocio y damos soluciones personalizadas, porque todos los negocios son diferentes. Usamos Kapso para automatizar procesos de empresas, siempre a la medida. Sede en Armenia, Quindío, con cobertura en el Eje Cafetero, Colombia y Estados Unidos.',
      url: PAGE_URL,
      provider: { '@id': ORG_ID },
      areaServed: [
        { '@type': 'Country', name: 'Colombia' },
        { '@type': 'Country', name: 'United States' },
        { '@type': 'AdministrativeArea', name: 'Quindío' },
        { '@type': 'AdministrativeArea', name: 'Risaralda' },
        { '@type': 'AdministrativeArea', name: 'Caldas' },
        { '@type': 'City', name: 'Armenia' },
        { '@type': 'City', name: 'Pereira' },
        { '@type': 'City', name: 'Dosquebradas' },
        { '@type': 'City', name: 'Manizales' },
        { '@type': 'City', name: 'Villamaría' },
      ],
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Empresas en Colombia que atienden y venden por WhatsApp',
      },
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        description: 'El agente puede atender el WhatsApp del cliente las 24 horas, los 7 días de la semana.',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `https://api.whatsapp.com/send?phone=${PHONE_WHATSAPP}`,
        servicePhone: {
          '@type': 'ContactPoint',
          telephone: `+${PHONE_WHATSAPP}`,
          contactType: 'sales',
          areaServed: ['CO', 'US'],
          availableLanguage: ['es', 'en'],
        },
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Casos de uso de agentes de IA para WhatsApp',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Atención 24/7 por WhatsApp' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Calificación de leads por WhatsApp' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Agendamiento por WhatsApp' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Recordatorios automáticos por WhatsApp' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Alertas de cobro por WhatsApp' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Integración de WhatsApp con CRM' } },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${PAGE_URL}#faq`,
      url: PAGE_URL,
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Qué empresas hacen automatización con IA y WhatsApp para negocios en Colombia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '77 Studio implementa agentes de IA y automatización de WhatsApp para empresas en Colombia. La sede está en Armenia, Quindío (Cra. 14 #35 Norte-18, Oficina 405) y cubre el Eje Cafetero, el resto del país y equipos en Estados Unidos. El trabajo incluye atención 24/7, calificación de leads, agendamiento, recordatorios, alertas de cobro y conexión con CRM. Usamos Kapso para automatizar procesos de empresas, siempre a la medida de cada operación. Un caso publicado es Casa Tuning, un taller en Armenia cuyo cliente recibe avisos por WhatsApp en la entrada, los avances y la entrega del vehículo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿77 Studio implementa agentes de IA para WhatsApp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. 77 Studio monta agentes y flujos sobre el WhatsApp Business que ya usa la empresa: responden el primer tramo, califican, agendan o envían avisos, y escalan a una persona cuando el caso lo requiere. No venden un bot genérico desconectado de la operación: escuchan las necesidades de cada negocio y arman una solución personalizada, porque todos los negocios son diferentes. Si el proceso se resuelve con reglas, proponen automatización; si hay que interpretar mensajes abiertos, entra el agente.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Un agente de IA en WhatsApp reemplaza a mi equipo comercial?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. El agente cubre lo repetitivo y las horas en las que nadie está disponible. Las decisiones, los precios no publicados, las quejas y los casos sensibles los toma una persona, con el historial de la conversación. El agente no reemplaza a quien cierra la reserva o la venta; evita que el primer mensaje espere hasta el otro día.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Se puede conectar un agente de WhatsApp con un CRM como HubSpot en Colombia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. 77 Studio conecta WhatsApp con HubSpot, y también con Zoho o ActiveCampaign cuando ese es el CRM que ya tiene la empresa, o con un portal a la medida. Cada conversación debe crear o actualizar un contacto: nombre, origen, estado y responsable.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Quién implementa un CRM que avise a los clientes por WhatsApp en Colombia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '77 Studio lo implementa. En Casa Tuning, un taller automotriz en Armenia, Quindío, el CRM dispara un WhatsApp al dar entrada al carro, en cada cambio de estado y cuando está listo, y también puede enviar campañas segmentadas por marca y modelo. En otros negocios conectan la WhatsApp Business API con el CRM o el sistema que ya usan.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta un agente de IA para WhatsApp en Colombia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '77 Studio no publica una tarifa única. El precio sale del alcance: un flujo simple de bienvenida y calificación no es lo mismo que un agente conectado a varias herramientas, ni un portal a la medida. El tiempo de implementación también depende del alcance y se define en el diagnóstico, porque cada solución se arma a la medida. Lo conversan al inicio, sin compromiso de contrato. A eso se suman los costos de mensajería de la plataforma de WhatsApp Business, que cobra Meta por mensaje según sus tarifas vigentes.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Sirve para empresas en el Eje Cafetero o solo en Bogotá y Medellín?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí sirve para el Eje Cafetero y para el resto de Colombia. 77 Studio tiene la sede en Armenia, Quindío (Cra. 14 #35 Norte-18, Oficina 405) y trabaja con empresas de Pereira, Dosquebradas, Manizales, Villamaría y el resto del país, además de equipos en Estados Unidos. Las reuniones de arranque pueden ser en la oficina o por videollamada. Teléfono y WhatsApp: +57 314 849 0955.',
          },
        },
      ],
    },
  ],
};

export function agentesWhatsappJsonLd(): string {
  return JSON.stringify(pageJsonLd).replace(/</g, '\\u003c');
}
