import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from "astro/zod";

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

const libs = defineCollection({
    loader: file("./src/content/libs.json"),
    schema: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        url: z.url(),
    })
});

export const collections = { news, releases, libs };
