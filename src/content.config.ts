import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const blogs = defineCollection({
    // 使用 glob loader 加载文件系统中的 markdown
    loader: glob({ pattern: "**/*.md", base: "./src/content/blogs" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        summary: z.string().optional(),
    })
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

export const collections = { blogs, libs };