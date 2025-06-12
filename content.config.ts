import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            source: 'blog/**',
            type: 'page',
            schema: z.object({
                title: z.string(),
                description: z.string().optional(),
                created_at: z.coerce.date().optional(),
                image: z.string().optional(),
                author: z.string(),
                tags: z.array(z.string()).optional(),
            })
        }),
    }
})
