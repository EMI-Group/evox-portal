import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const articleSchema = z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    summary: z.string().optional(),
});

const news = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
    schema: articleSchema,
});

const releases = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/releases" }),
    schema: articleSchema,
});

const tutorials = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/tutorials" }),
    schema: z.object({
        title: z.string(),
        order: z.number(),
    }),
});

const docs = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
    schema: z.object({
        title: z.string(),
        order: z.number(),
        section: z.string(),
    }),
});

const libs = defineCollection({
    loader: file("./src/content/libs.json"),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        url: z.string().url(),
    })
});

export const collections = { news, releases, tutorials, docs, libs };
