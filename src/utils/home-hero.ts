/** Cerebro del hero en pantallas sm+. En móvil queda oculto para que el H1 sea el LCP. */
export const HOME_HERO_IMAGE = {
  src: '/images/opai-img-300-840.webp',
  srcset:
    '/images/opai-img-300-540.webp 540w, /images/opai-img-300-840.webp 840w, /images/opai-img-300-1280.webp 1280w, /images/opai-img-300.webp 1418w',
  sizes: '(max-width: 639px) 270px, (max-width: 767px) 420px, (max-width: 1023px) 640px, 709px',
  width: 1418,
  height: 1418,
} as const;

