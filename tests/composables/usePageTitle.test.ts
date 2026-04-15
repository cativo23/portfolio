import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockURL = new URL('https://cativo.dev/about')
vi.stubGlobal('useRequestURL', () => mockURL)
vi.stubGlobal('useRoute', () => ({ fullPath: '/about' }))

const mockConfig = {
  public: {
    baseTitle: 'Carlos Cativo',
    defaultOgImage: '/default-og.png',
    defaultOgUrl: 'https://cativo.dev',
  },
}
vi.stubGlobal('useRuntimeConfig', () => mockConfig)

const mockSeoMeta = vi.fn()
vi.stubGlobal('useSeoMeta', mockSeoMeta)

const { usePageTitle } = await import('~/composables/usePageTitle')

describe('usePageTitle', () => {
  beforeEach(() => {
    mockSeoMeta.mockClear()
  })

  it('sets SEO meta with default options', () => {
    usePageTitle('About')

    expect(mockSeoMeta).toHaveBeenCalledWith({
      title: 'Carlos Cativo - About',
      description: 'Learn more about Carlos Cativo on the About page.',
      ogTitle: 'Carlos Cativo - About',
      ogDescription: 'Learn more about Carlos Cativo on the About page.',
      ogImage: '/default-og.png',
      ogUrl: 'https://cativo.dev',
      twitterTitle: 'Carlos Cativo - About',
      twitterDescription: 'Learn more about Carlos Cativo on the About page.',
      twitterImage: '/default-og.png',
      twitterCard: 'summary',
    })
  })

  it('uses custom description when provided', () => {
    usePageTitle('Projects', { description: 'View my portfolio' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'View my portfolio',
        ogDescription: 'View my portfolio',
        twitterDescription: 'View my portfolio',
      })
    )
  })

  it('uses custom ogTitle when provided', () => {
    usePageTitle('Projects', { ogTitle: 'Custom OG Title' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ ogTitle: 'Custom OG Title' })
    )
  })

  it('uses custom ogImage and ogUrl when provided', () => {
    usePageTitle('Projects', { ogImage: '/custom.png', ogUrl: 'https://cativo.dev/projects' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        ogImage: '/custom.png',
        ogUrl: 'https://cativo.dev/projects',
        twitterImage: '/custom.png',
      })
    )
  })

  it('uses custom twitterCard when provided', () => {
    usePageTitle('Blog', { twitterCard: 'summary_large_image' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ twitterCard: 'summary_large_image' })
    )
  })

  it('uses custom twitterTitle when provided', () => {
    usePageTitle('Blog', { twitterTitle: 'Twitter-specific title' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ twitterTitle: 'Twitter-specific title' })
    )
  })

  it('uses custom twitterDescription when provided', () => {
    usePageTitle('Blog', { twitterDescription: 'Twitter-specific desc' })

    expect(mockSeoMeta).toHaveBeenCalledWith(
      expect.objectContaining({ twitterDescription: 'Twitter-specific desc' })
    )
  })
})
