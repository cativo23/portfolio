import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { title, description, tags, content, status, existingPath } = body as {
    title: string
    description: string
    tags: string[]
    content: string
    status: 'draft' | 'published'
    existingPath?: string
  }

  if (!title || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
  }

  // Generate filename
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const filename = `${slug}.md`

  const blogDir = path.join(process.cwd(), 'content', 'blog')
  const draftsDir = path.join(blogDir, 'drafts')

  // Ensure directories exist
  await fs.mkdir(blogDir, { recursive: true })
  await fs.mkdir(draftsDir, { recursive: true })

  // Build frontmatter
  const frontmatter = `---
title: "${title}"
created_at: ${new Date().toISOString()}
author: "Carlos Cativo"
description: "${description}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
---
`

  const fileContent = frontmatter + content

  // If editing an existing post, delete the old file
  if (existingPath) {
    const oldPath = existingPath.startsWith('/blog/drafts/')
      ? path.join(draftsDir, existingPath.replace('/blog/drafts/', '') + '.md')
      : path.join(blogDir, existingPath.replace('/blog/', '') + '.md')

    try {
      await fs.unlink(oldPath)
    } catch { /* file might not exist */ }
  }

  // Write to appropriate directory
  const targetDir = status === 'draft' ? draftsDir : blogDir
  const targetPath = path.join(targetDir, filename)

  await fs.writeFile(targetPath, fileContent, 'utf-8')

  return {
    status: 'success',
    data: {
      path: status === 'draft' ? `/blog/drafts/${filename.replace('.md', '')}` : `/blog/${filename.replace('.md', '')}`,
      status,
    },
  }
})
