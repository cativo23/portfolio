import { ref, type Ref } from 'vue'
import type { Project } from '~/types/project'
import type { PaginationMeta, ApiResponse } from '~/types/pagination'

interface UseProjectsReturn {
    projects: Ref<Project[]>
    pagination: Ref<PaginationMeta | null>
    loading: Ref<boolean>
    error: Ref<Error | null>
    fetchProjects: (params?: Record<string, unknown>) => Promise<ApiResponse<Project> | undefined>
    fetchProject: (id: string | number) => Promise<Project | undefined>
}

export function useProjects(): UseProjectsReturn {
    const projects = ref<Project[]>([])
    const pagination = ref<PaginationMeta | null>(null)
    const loading = ref(false)
    const error = ref<Error | null>(null)

    async function fetchProjects(params: Record<string, unknown> = {}): Promise<ApiResponse<Project> | undefined> {
        loading.value = true
        error.value = null
        try {
            const res = await $fetch<ApiResponse<Project>>('/api/projects', {
                method: 'GET',
                query: params,
            })

            if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
                projects.value = res.data
                pagination.value = res.meta?.pagination ?? null
            } else {
                projects.value = []
                pagination.value = null
            }
            return res
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err))
            error.value = errorObj
            // Re-throw so useAsyncData callers see the error state.
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchProject(id: string | number): Promise<Project | undefined> {
        loading.value = true
        error.value = null
        try {
            const res = await $fetch<{ status?: string; data?: Project; meta?: unknown } | Project>(`/api/projects/${encodeURIComponent(String(id))}`, {
                method: 'GET',
            })

            return (res && typeof res === 'object' && 'data' in res) ? res.data : res as Project
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error(String(err))
            error.value = errorObj
            // Re-throw so useAsyncData callers see the error state.
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
