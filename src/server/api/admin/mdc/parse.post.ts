import { parseMarkdown } from '@nuxtjs/mdc/runtime'

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event)
  if (!content) return null
  return parseMarkdown(content, {})
})
