import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://cativo.dev'
  const siteName = 'Carlos Cativo'

  // Fetch blog posts from content
  let posts: Array<{ path?: string; title?: string; description?: string; created_at?: string }> = []
  try {
    const storage = useStorage('content:source:blog')
    const keys = await storage.getKeys()
    const items = await Promise.all(
      keys.map(async (key) => {
        const raw = await storage.getItem(key)
        if (raw && typeof raw === 'object') {
          const post = raw as Record<string, unknown>
          return {
            path: `/blog/${key.replace(/\.md$/, '')}`,
            title: post.title as string || '',
            description: post.description as string || '',
            created_at: post.created_at as string || '',
          }
        }
        return null
      })
    )
    posts = items.filter(Boolean) as typeof posts
    posts.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  } catch {
    // If content is unavailable, return empty feed
  }

  const items = posts.map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${post.path}</link>
      <guid>${siteUrl}${post.path}</guid>
      <description><![CDATA[${post.description}]]></description>
      ${post.created_at ? `<pubDate>${new Date(post.created_at).toUTCString()}</pubDate>` : ''}
    </item>`).join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Backend development insights, technology trends, and personal experiences.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return feed
})
