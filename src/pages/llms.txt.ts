import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '@/utils/llms-content';

export const GET: APIRoute = () =>
  new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
