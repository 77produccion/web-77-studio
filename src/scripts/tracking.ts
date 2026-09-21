type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: DataLayerEntry[];
  }
}

const ATTRIBUTION_STORAGE_KEY = '77_tracking_attribution_v1';
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
  const localizedPath = pagePath.replace(/^\/en(?=\/|$)/, '') || '/';
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

document.addEventListener(
  'submit',
  (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === 'chatFooterForm') {
      pushEvent('chat_message_submit');
      return;
    }

    if (form.id !== 'lead-contact-form') return;

    pushEvent('form_submit', {
      form_id: form.id,
      form_origin: safeValue(
        form.querySelector<HTMLInputElement>('[name="origin_page"]')?.value,
      ),
      selected_service: safeValue(
        form.querySelector<HTMLSelectElement>('[name="service"]')?.value,
      ),
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
      pushEvent('click_whatsapp', {
        link_label: linkLabel,
        link_location: linkLocation,
        interaction_variant: safeValue(clickable.dataset.trackVariant, 40),
      });
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
      pushEvent('click_whatsapp', {
        link_label: linkLabel,
        link_location: linkLocation,
      });
      return;
    }

    const localizedDestination = url.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
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

window.addEventListener('77:lead-success', ((event: CustomEvent) => {
  const detail = event.detail && typeof event.detail === 'object'
    ? (event.detail as Record<string, unknown>)
    : {};

  pushEvent('generate_lead', {
    form_id: typeof detail.form_id === 'string' ? safeValue(detail.form_id) : undefined,
    form_origin:
      typeof detail.form_origin === 'string' ? safeValue(detail.form_origin) : undefined,
    selected_service:
      typeof detail.selected_service === 'string'
        ? safeValue(detail.selected_service)
        : undefined,
  });
}) as EventListener);

const normalizedPath = window.location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';
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
