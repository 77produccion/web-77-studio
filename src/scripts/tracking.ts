type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
  }
}

const ATTRIBUTION_STORAGE_KEY = '77_tracking_attribution_v1';
const CHAT_LEAD_STORAGE_KEY = '77_generate_lead_chat_v1';
const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'gbraid',
  'wbraid',
  'fbclid',
] as const;

type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
type Attribution = Partial<Record<AttributionKey, string>>;

const serviceByPath: Record<string, string> = {
  '/marketing': 'marketing',
  '/web': 'desarrollo_web',
  '/ia-automatizacion': 'ia_automatizacion',
  '/productos-digitales': 'productos_digitales',
};

function pagePathname(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

const safeValue = (value: string | null | undefined, maxLength = 120) =>
  value?.trim().slice(0, maxLength) || undefined;

function safeAttributionValue(value: string | null): string | undefined {
  const normalized = safeValue(value);
  if (!normalized) return undefined;

  const resemblesEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const resemblesPhone =
    /^[+\d().\s-]+$/.test(normalized) && normalized.replace(/\D/g, '').length >= 7;

  return resemblesEmail || resemblesPhone ? undefined : normalized;
}

function getStoredAttribution(): Attribution {
  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Attribution) : {};
  } catch {
    return {};
  }
}

function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const attribution = getStoredAttribution();

  ATTRIBUTION_KEYS.forEach((key) => {
    const value = safeAttributionValue(params.get(key));
    if (value) attribution[key] = value;
  });

  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // La medición sigue funcionando aunque el navegador bloquee sessionStorage.
  }

  return attribution;
}

const attribution = captureAttribution();

function getPageContext(): DataLayerEntry {
  const pagePath = window.location.pathname || '/';
  const language = document.documentElement.lang === 'en' ? 'en' : 'es';
  const localizedPath = pagePathname(pagePath.replace(/^\/en(?=\/|$)/, '') || '/');
  const serviceName = serviceByPath[localizedPath];

  return {
    page_path: pagePath,
    page_language: language,
    page_type: serviceName
      ? 'service'
      : localizedPath === '/contacto'
        ? 'contact'
        : localizedPath === '/'
          ? 'home'
          : 'content',
    ...(serviceName ? { service_name: serviceName } : {}),
  };
}

function pushEvent(event: string, parameters: DataLayerEntry = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...getPageContext(),
    ...attribution,
    ...parameters,
  });
}

type LeadMethod = 'form' | 'whatsapp' | 'chat';

function pushGenerateLead(parameters: DataLayerEntry & { method: LeadMethod; location?: string }) {
  const location = parameters.location;
  pushEvent('generate_lead', {
    ...parameters,
    // El contenedor GTM reenvía link_location e interaction_variant, no method/location.
    // Se duplican para que el método y el lugar lleguen a GA4 sin un segundo hit.
    ...(location ? { link_location: location } : {}),
    interaction_variant: parameters.method,
  });
}

function getElementLabel(element: Element): string | undefined {
  return safeValue(
    element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      element.textContent,
    80,
  );
}

function getElementLocation(element: Element): string {
  const explicitLocation = element
    .closest<HTMLElement>('[data-track-location]')
    ?.dataset.trackLocation;
  if (explicitLocation) return explicitLocation;

  if (element.closest('#main-header')) return 'header';
  if (element.closest('#mobile-sticky-bar')) return 'mobile_sticky_bar';
  if (element.closest('#aiChatWidget')) return 'ai_chat';
  if (element.closest('footer')) return 'footer';

  const section = element.closest('section[id]');
  return section?.id || 'page_content';
}

function cleanLinkUrl(url: URL): string {
  return `${url.origin}${url.pathname}`;
}

function injectAttributionFields(form: HTMLFormElement) {
  Object.entries(attribution).forEach(([name, value]) => {
    if (!value) return;

    let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  });
}

const leadForms = document.querySelectorAll<HTMLFormElement>('#lead-contact-form');
const startedForms = new WeakSet<HTMLFormElement>();

leadForms.forEach((form) => injectAttributionFields(form));

document.addEventListener(
  'focusin',
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const form = target.closest<HTMLFormElement>('#lead-contact-form');
    if (!form || startedForms.has(form)) return;

    startedForms.add(form);
    pushEvent('form_start', {
      form_id: form.id,
      form_origin: safeValue(
        form.querySelector<HTMLInputElement>('[name="origin_page"]')?.value,
      ),
    });
  },
  { capture: true },
);

let chatLeadRecorded = false;

function hasChatLeadThisSession(): boolean {
  if (chatLeadRecorded) return true;
  try {
    return sessionStorage.getItem(CHAT_LEAD_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markChatLeadThisSession() {
  chatLeadRecorded = true;
  try {
    sessionStorage.setItem(CHAT_LEAD_STORAGE_KEY, '1');
  } catch {
    // Si sessionStorage está bloqueado, la marca en memoria evita repetir el lead en esta página.
  }
}

function chatMessageText(form: HTMLFormElement): string {
  return form.querySelector<HTMLInputElement>('input, textarea')?.value.trim() ?? '';
}

document.addEventListener(
  'submit',
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'chatFooterForm') return;
    if (!chatMessageText(form)) return;

    pushEvent('chat_message_submit');

    if (hasChatLeadThisSession()) return;
    markChatLeadThisSession();
    pushGenerateLead({
      method: 'chat',
      form_id: form.id,
      location: 'ai_chat',
    });
  },
  { capture: true },
);

document.addEventListener(
  'click',
  (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const clickable = target.closest<HTMLElement>('a, button');
    if (!clickable) return;

    const linkLabel = getElementLabel(clickable);
    const linkLocation = getElementLocation(clickable);

    if (clickable.dataset.trackEvent === 'click_whatsapp') {
      trackWhatsAppClick(
        linkLabel,
        linkLocation,
        safeValue(clickable.dataset.trackVariant, 40),
      );
      return;
    }

    if (clickable.id === 'chatTriggerBtn') {
      pushEvent('chat_open', { link_location: linkLocation });
      return;
    }

    const anchor = clickable.closest<HTMLAnchorElement>('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return;

    if (href.startsWith('mailto:')) {
      pushEvent('click_email', { link_location: linkLocation });
      return;
    }

    if (href.startsWith('tel:')) {
      pushEvent('click_phone', { link_location: linkLocation });
      return;
    }

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') {
      trackWhatsAppClick(linkLabel, linkLocation);
      return;
    }

    const localizedDestination = pagePathname(url.pathname.replace(/^\/en(?=\/|$)/, '') || '/');
    if (
      url.origin === window.location.origin &&
      (url.hash === '#contacto' || localizedDestination === '/contacto')
    ) {
      pushEvent('contact_cta_click', {
        link_label: linkLabel,
        link_location: linkLocation,
        link_url: cleanLinkUrl(url),
      });
      return;
    }

    if (url.origin !== window.location.origin) {
      pushEvent('outbound_click', {
        link_label: linkLabel,
        link_location: linkLocation,
        link_domain: url.hostname,
        link_url: cleanLinkUrl(url),
      });
    }
  },
  { capture: true },
);

function trackWhatsAppClick(
  linkLabel: string | undefined,
  linkLocation: string,
  interactionVariant?: string,
) {
  pushEvent('click_whatsapp', {
    link_label: linkLabel,
    link_location: linkLocation,
    ...(interactionVariant ? { interaction_variant: interactionVariant } : {}),
  });
  pushGenerateLead({
    method: 'whatsapp',
    location: linkLocation,
  });
}

const recordedLeadForms = new Set<string>();

function detailString(detail: Record<string, unknown>, key: string): string | undefined {
  return typeof detail[key] === 'string' ? safeValue(detail[key]) : undefined;
}

window.addEventListener('77:lead-success', ((event: CustomEvent) => {
  const detail = event.detail && typeof event.detail === 'object'
    ? (event.detail as Record<string, unknown>)
    : {};

  const formId = detailString(detail, 'form_id') ?? 'lead-contact-form';
  if (recordedLeadForms.has(formId)) return;
  recordedLeadForms.add(formId);

  const formOrigin = detailString(detail, 'form_origin');
  const selectedService = detailString(detail, 'selected_service');
  const location = detailString(detail, 'location') ?? formOrigin;

  pushEvent('form_submit', {
    form_id: formId,
    form_origin: formOrigin,
    selected_service: selectedService,
  });
  pushGenerateLead({
    method: 'form',
    form_id: formId,
    location,
    form_origin: formOrigin,
    selected_service: selectedService,
  });
}) as EventListener);

const normalizedPath = pagePathname(window.location.pathname.replace(/^\/en(?=\/|$)/, '') || '/');
if (serviceByPath[normalizedPath]) {
  pushEvent('view_service', { service_name: serviceByPath[normalizedPath] });
}

const reachedScrollDepths = new Set<number>();
let scrollFramePending = false;

function trackScrollDepth() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return;

  const depth = Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100));
  [25, 50, 75, 90].forEach((threshold) => {
    if (depth >= threshold && !reachedScrollDepths.has(threshold)) {
      reachedScrollDepths.add(threshold);
      pushEvent('scroll_depth', { percent_scrolled: threshold });
    }
  });
}

window.addEventListener(
  'scroll',
  () => {
    if (scrollFramePending) return;
    scrollFramePending = true;
    window.requestAnimationFrame(() => {
      trackScrollDepth();
      scrollFramePending = false;
    });
  },
  { passive: true },
);

export {};
