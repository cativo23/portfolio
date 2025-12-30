import { ref } from 'vue'

export function useProjects() {
    const config = useRuntimeConfig()
    const base = config.public?.apiBaseUrl
    // prefer private token on server-side; fall back to a public token if intentionally exposed
    const defaultToken = config.public?.apiToken

    const projects = ref<any[]>([])
    const loading = ref(false)
    const error = ref<any | null>(null)

    async function fetchProjects(params: Record<string, any> = {}, token?: string) {
        loading.value = true
        error.value = null
        try {
            const headers: Record<string, string> = {}
            const authToken = token ?? defaultToken
            if (authToken) headers.Authorization = `ApiKey ${authToken}`

            const res: any = await $fetch(`${base}/projects`, {
                method: 'GET',
                headers,
                query: params,
            })

            // API shape: { status: 'success', data: [ ... ], meta: { ... } }
            projects.value = res?.data ?? res
            return res
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchProject(id: string | number, token?: string) {
        loading.value = true
        error.value = null
        try {
            const headers: Record<string, string> = {}
            const authToken = token ?? defaultToken
            if (authToken) headers.Authorization = `ApiKey ${authToken}`

            const res: any = await $fetch(`${base}/projects/${id}`, {
                method: 'GET',
                headers,
            })

            // API shape: { status: 'success', data: { ... } }
            return res?.data ?? res
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        projects,
        loading,
        error,
        fetchProjects,
        fetchProject,
    }
}
