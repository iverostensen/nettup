import { defineCollection, z } from 'astro:content';

const blogg = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readTime: z.number().int().positive(),
    description: z.string(),
    relatedSlugs: z.array(z.string()).optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { blogg };
