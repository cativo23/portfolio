import { describe, it, expect, vi, beforeEach } from 'vitest'

let fetchMock = vi.fn()
vi.stubGlobal('$fetch', fetchMock)

const { useProjects } = await import('~/composables/useProjects')

describe('useProjects', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  describe('fetchProjects', () => {
    it('returns projects and pagination on success', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Project A', slug: 'project-a', techStack: ['Vue'] },
          { id: 2, name: 'Project B', slug: 'project-b', techStack: ['React'] },
        ],
        meta: { pagination: { page: 1, total_pages: 3, total_items: 10, limit: 5 } },
      }
      fetchMock.mockResolvedValue(mockResponse)

      const { projects, pagination, fetchProjects } = useProjects()
      const result = await fetchProjects()

      expect(projects.value).toHaveLength(2)
      expect(pagination.value).toEqual({ page: 1, total_pages: 3, total_items: 10, limit: 5 })
      expect(result).toBe(mockResponse)
    })

    it('passes query params to the API', async () => {
      fetchMock.mockResolvedValue({ data: [], meta: { pagination: null } })

      const { fetchProjects } = useProjects()
      await fetchProjects({ page: 2, search: 'Vue' })

      expect(fetchMock).toHaveBeenCalledWith('/api/projects', {
        method: 'GET',
        query: { page: 2, search: 'Vue' },
      })
    })

    it('resets projects when response has no data/meta', async () => {
      fetchMock.mockResolvedValue({ unexpected: 'format' })

      const { projects, pagination, fetchProjects } = useProjects()
      await fetchProjects()

      expect(projects.value).toEqual([])
      expect(pagination.value).toBeNull()
    })

    it('sets loading to false after success', async () => {
      fetchMock.mockResolvedValue({ data: [], meta: { pagination: null } })

      const { loading, fetchProjects } = useProjects()
      await fetchProjects()

      expect(loading.value).toBe(false)
    })

    it('sets loading to false and error on failure', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'))

      const { loading, error, fetchProjects } = useProjects()

      await expect(fetchProjects()).rejects.toThrow('Network error')

      expect(loading.value).toBe(false)
      expect(error.value).toBeInstanceOf(Error)
      expect(error.value?.message).toBe('Network error')
    })

    it('sets loading to true during fetch', async () => {
      let resolvePromise: (value: any) => void
      fetchMock.mockImplementation(() => new Promise(resolve => { resolvePromise = resolve }))

      const { loading, fetchProjects } = useProjects()
      fetchProjects()

      expect(loading.value).toBe(true)

      resolvePromise!({ data: [], meta: { pagination: null } })
      await vi.waitFor(() => loading.value === false)
    })
  })

  describe('fetchProject', () => {
    it('returns a single project from wrapped response', async () => {
      const mockProject = { id: 1, name: 'Project A', slug: 'project-a', techStack: ['Vue'] }
      fetchMock.mockResolvedValue({ data: mockProject })

      const { fetchProject } = useProjects()
      const result = await fetchProject('1')

      expect(result).toEqual(mockProject)
    })

    it('returns a project from unwrapped response', async () => {
      const mockProject = { id: 1, name: 'Direct Project' }
      fetchMock.mockResolvedValue(mockProject)

      const { fetchProject } = useProjects()
      const result = await fetchProject('1')

      expect(result).toEqual(mockProject)
    })

    it('sets loading to false after fetch', async () => {
      fetchMock.mockResolvedValue({ data: {} })

      const { loading, fetchProject } = useProjects()
      await fetchProject('1')

      expect(loading.value).toBe(false)
    })

    it('throws and sets error on failure', async () => {
      fetchMock.mockRejectedValue(new Error('Not found'))

      const { loading, error, fetchProject } = useProjects()

      await expect(fetchProject('999')).rejects.toThrow('Not found')

      expect(loading.value).toBe(false)
      expect(error.value).toBeInstanceOf(Error)
    })
  })
})
