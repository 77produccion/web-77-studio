import type { APIRoute } from 'astro';

const SITE_FALLBACK = 'https://www.77studio.co';

const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(SITE_FALLBACK)).origin;
  const sitemap = new URL('sitemap-index.xml', `${origin}/`).href;
  const rules = `Allow: /
Disallow: /api/
Disallow: /404
Disallow: /en/404`;

  const aiGroups = AI_AGENTS.map((agent) => `User-agent: ${agent}\n${rules}`).join('\n\n');

  const body = `${aiGroups}

User-agent: *
${rules}

# Resumen para modelos de lenguaje: ${origin}/llms.txt
Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
