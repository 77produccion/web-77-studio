import type { APIRoute } from 'astro';

const SITE_FALLBACK = 'https://www.77studio.co';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(SITE_FALLBACK)).origin;
  const sitemap = new URL('sitemap-index.xml', `${origin}/`).href;
  const body = `User-agent: *
Allow: /

# Rutas que no deben rastrearse ni indexarse
Disallow: /api/
Disallow: /404
Disallow: /en/404

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
