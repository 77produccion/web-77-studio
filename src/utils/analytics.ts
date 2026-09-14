// src/utils/analytics.ts
/**
 * Módulo de Analítica y Eventos Personalizados compatible con Joinchat, GTM, GA4 y Meta Pixel
 */

export interface WhatsAppEventPayload {
  link: string;
  phone: string;
  message: string;
  trigger: 'button' | 'bubble' | 'trigger' | string;
}

export interface JoinChatAnalyticsDetail {
  event_category: string;
  event_label: string;
  event_action: string;
  chat_channel: string;
  chat_id: string;
  is_mobile: 'yes' | 'no';
  page_location: string;
  page_title: string;
}

// Declaraciones globales seguras de trackers
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Despacha el flujo de eventos de WhatsApp siguiendo la arquitectura Joinchat
 * @returns boolean `true` si la acción no fue cancelada por un listener, `false` si fue cancelada con preventDefault()
 */
export function dispatchWhatsAppClick(payload: WhatsAppEventPayload): boolean {
  if (typeof window === 'undefined') return true;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isMobileStr: 'yes' | 'no' = isMobile ? 'yes' : 'no';
  const pageLocation = window.location.href;
  const pageTitle = document.title || '';

  // 1. Despachar evento DOM cancelable: joinchat:open
  const openEvent = new CustomEvent('joinchat:open', {
    bubbles: true,
    cancelable: true,
    detail: {
      link: payload.link,
      chat_channel: 'whatsapp',
      chat_id: payload.phone,
      chat_message: payload.message,
      trigger: payload.trigger,
    }
  });

  const canContinue = document.dispatchEvent(openEvent);
  if (!canContinue) {
    console.info('[77 Studio Tracking] joinchat:open fue prevenido por un listener.');
    return false;
  }

  // 2. Despachar evento DOM cancelable de analítica: joinchat:event
  const analyticsDetail: JoinChatAnalyticsDetail = {
    event_category: 'JoinChat',
    event_label: payload.link,
    event_action: `whatsapp: ${payload.phone}`,
    chat_channel: 'whatsapp',
    chat_id: payload.phone,
    is_mobile: isMobileStr,
    page_location: pageLocation,
    page_title: pageTitle,
  };

  const analyticsEvent = new CustomEvent('joinchat:event', {
    bubbles: true,
    cancelable: true,
    detail: analyticsDetail
  });

  const sendAnalytics = document.dispatchEvent(analyticsEvent);

  if (sendAnalytics) {
    // 3. Google Tag Manager (dataLayer)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'JoinChat',
      ...analyticsDetail
    });

    // Evento de conversión estándar GA4 para generación de leads
    window.dataLayer.push({
      event: 'generate_lead',
      lead_source: 'whatsapp_floating',
      channel: 'whatsapp',
      phone: payload.phone,
      page_location: pageLocation,
      page_title: pageTitle
    });

    // 4. Google Analytics 4 directo (gtag) si está presente
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'JoinChat', {
        event_category: 'JoinChat',
        event_action: `whatsapp: ${payload.phone}`,
        event_label: payload.link,
        channel: 'whatsapp'
      });

      window.gtag('event', 'generate_lead', {
        method: 'whatsapp',
        lead_source: 'whatsapp_floating'
      });
    }

    // 5. Meta Pixel (fbq) si está presente
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', 'JoinChat', {
        channel: 'whatsapp',
        phone: payload.phone,
        page: pageLocation
      });

      window.fbq('track', 'Contact', {
        content_category: 'WhatsApp',
        content_name: 'WhatsApp Floating Lead'
      });
    }

    console.info('[77 Studio Tracking] Eventos de WhatsApp despachados exitosamente:', analyticsDetail);
  }

  return true;
}

/**
 * Notifica apertura/cierre de la burbuja o tooltip de WhatsApp
 */
export function dispatchWhatsAppTooltipState(isOpen: boolean, trigger = 'auto'): void {
  if (typeof document === 'undefined') return;

  const eventName = isOpen ? 'joinchat:show' : 'joinchat:hide';
  document.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    detail: { trigger }
  }));
}
