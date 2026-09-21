// src/utils/analytics.ts
/**
 * Eventos DOM compatibles con Joinchat para controlar la apertura del widget.
 * La medición hacia GTM se centraliza en src/scripts/tracking.ts.
 */

export interface WhatsAppEventPayload {
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

/**
 * Despacha el flujo de eventos de WhatsApp siguiendo la arquitectura Joinchat
 * @returns boolean `true` si la acción no fue cancelada por un listener, `false` si fue cancelada con preventDefault()
 */
export function dispatchWhatsAppClick(payload: WhatsAppEventPayload): boolean {
  if (typeof window === 'undefined') return true;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isMobileStr: 'yes' | 'no' = isMobile ? 'yes' : 'no';
  const pageLocation = window.location.pathname;
  const pageTitle = document.title || '';

  // 1. Despachar evento DOM cancelable: joinchat:open
  const openEvent = new CustomEvent('joinchat:open', {
    bubbles: true,
    cancelable: true,
    detail: {
      chat_channel: 'whatsapp',
      chat_id: 'business_primary',
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
    event_label: 'whatsapp_floating',
    event_action: 'open_whatsapp',
    chat_channel: 'whatsapp',
    chat_id: 'business_primary',
    is_mobile: isMobileStr,
    page_location: pageLocation,
    page_title: pageTitle,
  };

  const analyticsEvent = new CustomEvent('joinchat:event', {
    bubbles: true,
    cancelable: true,
    detail: analyticsDetail
  });

  document.dispatchEvent(analyticsEvent);

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
