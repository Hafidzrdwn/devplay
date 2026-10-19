import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categoryIds } from '@/data/categories';

export const crewIds = [
  'dev',
  'pixel',
  'mutex',
  'query',
  'cache',
  'ping',
  'bug',
  'sec',
  'ops',
  'intern',
] as const;

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    conceptId: z.number().int().min(1).max(51),
    category: z.enum(categoryIds),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    readingMinutes: z.number().int().positive(),
    tldr: z.string().max(180),
    keywords: z.array(z.string()).default([]),
    visualization: z.enum(['2d', '3d']),
    speaker: z.enum(crewIds).optional(),
  }),
});

export const collections = { docs };
