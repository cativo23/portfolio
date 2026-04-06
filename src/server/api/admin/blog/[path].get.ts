import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const pathParam = getRouterParam(event, 'path')
  const basePath = resolve(process.cwd(), 'content/blog')

  let filePath: string
  if (pathParam?.startsWith('drafts/')) {
    const slug = pathParam.replace('drafts/', '')
    filePath = resolve(basePath, 'drafts', `${slug}.md`)
  } else {
    filePath = resolve(basePath, `${pathParam}.md`)
  }

  try {
    const content = await readFile(filePath, 'utf-8')
    return { content }
  } catch {
    throw createError({ statusCode: 404, message: 'Blog post not found' })
  }
})
