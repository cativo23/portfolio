/**
 * Fetch latest blog posts from blog.cativo.dev RSS.
 * Cached server-side via Nitro cachedFunction so we don't hammer the blog.
 */

interface BlogPost {
  title: string
  url: string
  pubDate: string
  description: string
}

const BLOG_RSS = 'https://blog.cativo.dev/rss/'

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function pickFirst(s: string, tag: string): string {
  const match = s.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
  return match?.[1] ? decodeEntities(stripCdata(match[1])).trim() : ''
}

async function fetchLatest(): Promise<BlogPost[]> {
  const xml = await $fetch<string>(BLOG_RSS, {
    timeout: 8000,
    responseType: 'text',
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  })

  const items = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g) ?? []

  return items.slice(0, 3).map((raw) => {
    const title = pickFirst(raw, 'title')
    const url = pickFirst(raw, 'link')
    const pubDate = pickFirst(raw, 'pubDate')
    const rawDesc = pickFirst(raw, 'description')
    const description = stripHtml(rawDesc).slice(0, 200)
    return { title, url, pubDate, description }
  })
}

export default defineCachedEventHandler(
  async () => {
    try {
      const posts = await fetchLatest()
      return { status: 'success', data: posts }
    } catch (error) {
      return {
        status: 'error',
        data: [] as BlogPost[],
        message: error instanceof Error ? error.message : 'Failed to fetch blog feed',
      }
    }
  },
  { maxAge: 60 * 30 } // 30 minutes
)
