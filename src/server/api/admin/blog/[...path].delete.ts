import { unlink } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const pathParts = getRouterParam(event, 'path')
  const pathParam = Array.isArray(pathParts) ? pathParts.join('/') : pathParts
  const basePath = resolve(process.cwd(), 'content/blog')

  let filePath: string
  if (pathParam?.startsWith('drafts/')) {
    const slug = pathParam.replace('drafts/', '')
    filePath = resolve(basePath, 'drafts', `${slug}.md`)
  } else {
    filePath = resolve(basePath, `${pathParam}.md`)
  }

  // Prevent path traversal — resolved path must stay under basePath
  if (!filePath.startsWith(basePath + '/') && filePath !== basePath) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  try {
    await unlink(filePath)
    return { deleted: pathParam }
  } catch {
    throw createError({ statusCode: 404, message: 'Blog post not found' })
  }
})
