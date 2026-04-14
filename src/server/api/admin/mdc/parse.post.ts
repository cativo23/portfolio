import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default defineEventHandler(async (event) => {
  // Fix #6: Body size limit to prevent memory exhaustion
  const rawBody = await readBody(event)
  if (typeof rawBody !== 'object' || rawBody === null) return null
  const { content } = rawBody as { content?: string }
  if (!content || typeof content !== 'string' || content.length > 65536) return null
  return parseMarkdown(content, {})
})
