import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default defineEventHandler(async (event) => {
  // Fix #6: Body size limit to prevent memory exhaustion
  const rawBody = await readBody(event)
  if (typeof rawBody !== 'object' || rawBody === null) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }
  const { content } = rawBody as { content?: string }
  if (!content || typeof content !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }
  if (content.length > 65536) {
    throw createError({ statusCode: 413, statusMessage: 'Content exceeds 64KB limit' })
  }
  return parseMarkdown(content, {})
})
