/** Imagen LCP de la portada. El preload usa el mismo srcset para no bajar 1418px en móvil. */
export const HOME_HERO_IMAGE = {
  src: '/images/opai-img-300-840.webp',
  srcset:
    '/images/opai-img-300-540.webp 540w, /images/opai-img-300-840.webp 840w, /images/opai-img-300-1280.webp 1280w, /images/opai-img-300.webp 1418w',
  sizes: '(max-width: 639px) 270px, (max-width: 767px) 420px, (max-width: 1023px) 640px, 709px',
  width: 1418,
  height: 1418,
} as const;

/**
 * En el laboratorio móvil el elemento LCP es la marca de agua del hero (750px),
 * no el cerebro. Se descubre primero. El cerebro sigue con srcset y prioridad alta.
 */
export const homeHeroPreload = {
  href: '/img/logo-variaciones/negro2.webp',
  type: 'image/webp',
};
