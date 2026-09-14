// src/utils/whatsapp.ts

export type SupportedLocale = 'es' | 'en';

export const WHATSAPP_CONFIG = {
  defaultPhone: '573148490955',
  messages: {
    es: {
      home: "Hola 77 Studio 👋 Vi su página web y quisiera conversar sobre un proyecto para mi empresa.",
      marketing: "Hola 77 Studio 👋 Vi sus servicios de marketing y quisiera conocer cómo pueden ayudar a mi empresa con estrategia, Meta Ads y Google Ads.",
      web: "Hola 77 Studio 👋 Estoy interesado en desarrollar o mejorar la página web de mi empresa.",
      ia: "Hola 77 Studio 👋 Quiero explorar oportunidades para implementar IA o automatización en mi empresa.",
      productos: "Hola 77 Studio 👋 Tengo una idea para una herramienta o producto digital y quisiera conversar con ustedes.",
      nosotros: "Hola 77 Studio 👋 Vi su historia y equipo y quisiera conversar sobre un proyecto.",
      contacto: "Hola 77 Studio 👋 Quiero conversar con ustedes sobre un proyecto para mi empresa.",
      notFound: "Hola 77 Studio 👋 Llegué a una página no encontrada (Error 404) y quisiera consultar sobre sus servicios para mi empresa.",
    },
    en: {
      home: "Hello 77 Studio 👋 I saw your website and would like to discuss a project for my business.",
      marketing: "Hello 77 Studio 👋 I saw your marketing services and would like to see how you can help my company with strategy, Meta Ads, and Google Ads.",
      web: "Hello 77 Studio 👋 I am interested in building or revamping my company's website.",
      ia: "Hello 77 Studio 👋 I want to explore opportunities to implement AI or automation in my company.",
      productos: "Hello 77 Studio 👋 I have an idea for a digital product or tool and would love to talk.",
      nosotros: "Hello 77 Studio 👋 I saw your story and team and would love to chat about a project.",
      contacto: "Hello 77 Studio 👋 I'd like to get in touch regarding a project for my business.",
      notFound: "Hello 77 Studio 👋 I landed on a page not found (404 Error) and would like to inquire about your services for my business.",
    }
  } as const
};

export type WhatsAppContext = keyof typeof WHATSAPP_CONFIG.messages.es;

/**
 * Obtiene el número limpio de WhatsApp
 */
export function getWhatsAppPhone(phone?: string): string {
  const raw = phone || import.meta.env.PUBLIC_WHATSAPP_NUMBER || WHATSAPP_CONFIG.defaultPhone;
  return raw.replace(/\D/g, '');
}

/**
 * Reemplaza variables dinámicas al estilo Joinchat: {SITE}, {TITLE}, {URL}
 */
export function formatWhatsAppMessage(
  template: string,
  variables: { site?: string; title?: string; url?: string } = {}
): string {
  const site = variables.site || '77 Studio';
  const title = variables.title || (typeof document !== 'undefined' ? document.title : '');
  const url = variables.url || (typeof window !== 'undefined' ? window.location.href : '');

  return template
    .replace(/{SITE}/gi, site)
    .replace(/{TITLE}/gi, title)
    .replace(/{URL}/gi, url);
}

/**
 * Genera la URL de WhatsApp con mensaje prellenado contextual respetando el idioma
 */
export function getWhatsAppUrl(
  contextOrCustomMessage: WhatsAppContext | string = 'home',
  phone: string = import.meta.env.PUBLIC_WHATSAPP_NUMBER || WHATSAPP_CONFIG.defaultPhone,
  lang: SupportedLocale = 'es'
): string {
  const cleanPhone = getWhatsAppPhone(phone);
  const langMessages = WHATSAPP_CONFIG.messages[lang] || WHATSAPP_CONFIG.messages.es;
  
  const rawMessage = contextOrCustomMessage in langMessages
    ? langMessages[contextOrCustomMessage as WhatsAppContext]
    : contextOrCustomMessage;

  const message = formatWhatsAppMessage(rawMessage);

  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

