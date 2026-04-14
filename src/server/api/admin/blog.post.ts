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

  // Check for slug collisions
  const targetDir = status === 'draft' ? draftsDir : blogDir
  const targetPath = path.join(targetDir, filename)
  try {
    await fs.stat(targetPath)
    throw createError({ statusCode: 409, statusMessage: `A blog post with the title "${title}" already exists` })
  } catch (err: any) {
    if (err.statusCode === 409) throw err
    // File doesn't exist — proceed
  }

  // If editing an existing post, delete the old file
  if (existingPath) {
    const oldPath = existingPath.startsWith('/blog/drafts/')
      ? path.join(draftsDir, existingPath.replace('/blog/drafts/', '') + '.md')
      : path.join(blogDir, existingPath.replace('/blog/', '') + '.md')

    const resolvedOld = path.resolve(oldPath)
    if (!resolvedOld.startsWith(path.resolve(draftsDir) + '/') && !resolvedOld.startsWith(path.resolve(blogDir) + '/')) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    try {
      await fs.unlink(oldPath)
    } catch { /* file might not exist */ }
  }

  // Fix #3: Use the `yaml` npm package for proper frontmatter serialization
  // This handles all YAML special characters (#, &, *, [, ], {, }, @, etc.) correctly
  const yaml = await import('yaml').then(m => m.default || m)
  const frontmatter = `---\n${yaml.stringify({
    title,
    created_at: new Date().toISOString(),
    author: 'Carlos Cativo',
    description: description || '',
    tags: tags || [],
  }).replace(/^---\s*/m, '')}---\n`

  const fileContent = frontmatter + content

  await fs.writeFile(targetPath, fileContent, 'utf-8')

  return {
    status: 'success',
    data: {
      path: status === 'draft' ? `/blog/drafts/${filename.replace('.md', '')}` : `/blog/${filename.replace('.md', '')}`,
      status,
    },
  }
})
