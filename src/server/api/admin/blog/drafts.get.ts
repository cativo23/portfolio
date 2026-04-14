import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async () => {
  const draftsDir = path.join(process.cwd(), 'content', 'blog', 'drafts')

  try {
    const files = await fs.readdir(draftsDir)
    const posts: Array<Record<string, unknown>> = []

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const content = await fs.readFile(path.join(draftsDir, file), 'utf-8')
      const post = parseFrontmatter(content, file)
      post._draft = true
      posts.push(post)
    }

    return posts
  } catch {
    // Drafts directory doesn't exist yet
    return []
  }
})

function parseFrontmatter(content: string, filename: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    return {
      title: filename.replace('.md', ''),
      description: '',
      created_at: '',
      path: `/blog/drafts/${filename.replace('.md', '')}`,
    }
  }

  const frontmatter = match[1] || ''
  const title = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)?.[1] || filename.replace('.md', '')
  const description = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/)?.[1] || ''
  const created_at = frontmatter.match(/created_at:\s*(\S+)/)?.[1] || ''

  return {
    title,
    description,
    created_at,
    path: `/blog/drafts/${filename.replace('.md', '')}`,
  }
}
