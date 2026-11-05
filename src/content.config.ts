import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('77 Studio'),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    draft: z.boolean().default(false),
    pillar: z.enum([
      'automatizacion-marketing',
      'ia-agentes',
      'ads-captacion',
      'web-conversion',
      'crm-whatsapp',
      'productos-digitales',
      'contenido-ia',
      'noticias-ia',
    ]),
    objective: z.enum(['captar', 'educar', 'informar']),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
