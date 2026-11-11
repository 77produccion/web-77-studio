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

const answerBlock = z.object({
  heading: z.string(),
  answer: z.string(),
  detail: z.string().optional(),
  points: z.array(z.string()).default([]),
});

const casos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/casos' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    client: z.string(),
    legalName: z.string().optional(),
    clientSummary: z.string().optional(),
    location: z.string(),
    industry: z.string(),
    excerpt: z.string(),
    lead: z.string(),
    instagram: z.string().url().optional(),
    instagramHandle: z.string().optional(),
    services: z.array(z.string()).default([]),
    distributor: z.string().optional(),
    relationship: z.string().optional(),
    problem: answerBlock.optional(),
    solution: answerBlock.optional(),
    modules: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .default([]),
    flow: z
      .object({
        heading: z.string(),
        answer: z.string(),
        steps: z.array(z.object({ label: z.string(), text: z.string() })),
      })
      .optional(),
    whatsapp: answerBlock.optional(),
    results: answerBlock.optional(),
    timeline: z
      .array(z.object({ when: z.string(), iso: z.string(), text: z.string() }))
      .default([]),
    stack: z.array(z.string()).default([]),
    roles: z.array(z.string()).default([]),
    testimonial: z
      .object({
        quote: z.string(),
        attribution: z.string(),
      })
      .optional(),
    ogImage: z.string().optional(),
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          width: z.number(),
          height: z.number(),
          alt: z.string(),
          caption: z.string(),
        })
      )
      .default([]),
    keywords: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, casos };
