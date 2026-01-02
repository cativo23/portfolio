import { ref, type Ref } from 'vue'
import type { Project } from '~/types/project'
import type { PaginationMeta, ApiResponse } from '~/types/pagination'

interface UseProjectsReturn {
    projects: Ref<Project[]>
    pagination: Ref<PaginationMeta | null>
    loading: Ref<boolean>
    error: Ref<Error | null>
    fetchProjects: (params?: Record<string, unknown>, token?: string) => Promise<unknown>
    fetchProject: (id: string | number, token?: string) => Promise<unknown>
}

export function useProjects(): UseProjectsReturn {
    const config = useRuntimeConfig()
    const base = config.public?.apiBaseUrl
    // prefer private token on server-side; fall back to a public token if intentionally exposed
    const defaultToken = config.public?.apiToken

    const projects = ref<Project[]>([])
    const pagination = ref<PaginationMeta | null>(null)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    async function fetchProjects(params: Record<string, unknown> = {}, token?: string): Promise<unknown> {
        loading.value = true
        error.value = null
        try {
            const headers: Record<string, string> = {}
            const authToken = token ?? defaultToken
            if (authToken) headers.Authorization = `ApiKey ${authToken}`

            const res = await $fetch<ApiResponse<Project>>(`${base}/projects`, {
                method: 'GET',
                headers,
                query: params,
            })

            // Handle API response: { status: "success", data: [...], meta: { pagination: {...} } }
            if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
                projects.value = res.data
                if (res.meta?.pagination) {
                    pagination.value = res.meta.pagination
                } else {
                    pagination.value = null
                }
            } else {
                projects.value = []
                pagination.value = null
            }
            return res
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err))
            error.value = errorObj
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchProject(id: string | number, token?: string): Promise<unknown> {
        loading.value = true
        error.value = null
        try {
            const headers: Record<string, string> = {}
            const authToken = token ?? defaultToken
            if (authToken) headers.Authorization = `ApiKey ${authToken}`

            const res = await $fetch<{ status?: string; data?: Project; meta?: unknown } | Project>(`${base}/projects/${id}`, {
                method: 'GET',
                headers,
            })

            // API shape: { status: 'success', data: { ... } }
            return (res && typeof res === 'object' && 'data' in res) ? res.data : res
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err))
            error.value = errorObj
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        projects,
        pagination,
        loading,
        error,
        fetchProjects,
        fetchProject,
    }
}
