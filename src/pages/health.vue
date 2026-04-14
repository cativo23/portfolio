<template>
  <div class="max-w-4xl mx-auto">
    <BaseSectionHeading title="System Health" />

    <!-- Health Type Tabs -->
    <div class="flex gap-2 mb-6 overflow-x-auto" role="tablist" aria-label="Health check view options">
      <BaseButton
        v-for="tab in healthTabs"
        :key="tab.id"
        :variant="selectedTab === tab.id ? 'primary' : 'ghost'"
        :size="'sm'"
        role="tab"
        :aria-pressed="selectedTab === tab.id"
        :aria-selected="selectedTab === tab.id"
        @click="selectTab(tab.id as 'basic' | 'detailed')"
      >
        {{ tab.label }}
      </BaseButton>
    </div>

    <BaseCard>
      <AsyncState :loading="loading" :error="error || (health === null ? 'No data' : undefined)" loading-text="Loading health status..." error-text="Unable to load health status">
        <template #error="{ error }">
          <p class="text-tokyo-night-red mb-4 font-mono">Unable to load health status</p>
          <p class="text-tokyo-night-muted text-sm font-mono">{{ error }}</p>
        </template>
        <div v-if="health" class="space-y-6" aria-live="polite">
        <!-- Summary -->
        <div class="text-center">
          <span class="flex items-center px-3 py-1 rounded-full border bg-tokyo-night-surface shadow-sm font-mono text-sm" :class="Object.values(health.components).every(c => c.status === 'up') ? 'text-tokyo-night-green' : 'text-tokyo-night-red'">
            <StatusIndicator :status="summaryStatusIndicator" :text="overallStatus" pulse size="lg" />
          </span>
          <p v-if="health.status" class="text-tokyo-night-muted mt-2 capitalize">
            Status: {{ health.status }}
          </p>
        </div>

        <!-- Components List -->
        <div class="space-y-3">
          <div
            v-for="(component, name) in health.components"
            :key="name"
            class="p-4 rounded bg-tokyo-night-bg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-tokyo-night-text font-mono capitalize">{{ formatServiceName(name) }}</span>
              </div>
              <div class="flex items-center gap-4">
                <StatusIndicator :status="component.status === 'up' ? 'success' : 'error'" :text="component.status === 'up' ? 'Operational' : 'Down'" size="md" />
                <span v-if="component.latency !== undefined" class="text-tokyo-night-muted text-xs font-mono">
                  {{ component.latency }}ms
                </span>
                <span v-if="component.usagePercent !== undefined" class="text-tokyo-night-muted text-xs font-mono">
                  {{ component.usagePercent.toFixed(1) }}%
                </span>
              </div>
            </div>
            <p v-if="component.message" class="text-tokyo-night-muted text-xs mt-1">
              {{ component.message }}
            </p>
          </div>
        </div>

        <!-- Meta Info -->
        <div class="pt-4 border-t border-tokyo-night-gray grid grid-cols-2 gap-4 text-sm">
          <MetaInfoPair v-if="health.version" label="Version" :value="health.version" horizontal />
          <MetaInfoPair v-if="health.environment" label="Environment" :value="health.environment" horizontal />
          <MetaInfoPair v-if="health.uptime" label="Uptime" :value="`${health.uptime}s`" horizontal />
          <MetaInfoPair v-if="requestId" label="Request ID" :value="requestId" horizontal />
        </div>

        <!-- Refresh Button -->
        <div class="flex justify-center mt-4">
          <BaseButton variant="ghost" @click="loadHealth(true)" :disabled="refreshing || loading" class="font-mono">
            <span class="flex items-center gap-2">
              <span :class="{ 'animate-spin': refreshing }">
                <LucideRefreshCw class="w-4 h-4" />
              </span>
              Refresh
            </span>
          </BaseButton>
        </div>
        </div>
      </AsyncState>
    </BaseCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import StatusIndicator from '~/components/ui/StatusIndicator.vue'
import MetaInfoPair from '~/components/ui/MetaInfoPair.vue'
import AsyncState from '~/components/base/AsyncState.vue'

usePageTitle('Health Check', {
  description: 'System health status and monitoring for the portfolio API.',
})

interface HealthComponent {
  status: string
  latency?: number
  used?: number
  total?: number
  usagePercent?: number
  message?: string
}

interface HealthInfo {
  status: string
  components: Record<string, HealthComponent>
  version?: string
  environment?: string
  timestamp?: string
  uptime?: number
  process?: {
    pid: number
    nodeVersion: string
    platform: string
    cpuUsage: { user: number; system: number }
    memoryUsage: { rss: number; heapTotal: number; heapUsed: number; external: number }
  }
}

const healthTabs = [
  { id: 'basic', label: 'Basic' },
  { id: 'detailed', label: 'Detailed' },
]

const selectedTab = ref<'basic' | 'detailed'>('basic')
const health = ref<HealthInfo | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const error = ref<string | null>(null)
const requestId = ref<string | null>(null)

const overallStatus = computed(() => {
  if (!health.value) return 'Unknown'
  const allUp = Object.values(health.value.components).every(c => c.status === 'up')
  return allUp ? 'All Systems Operational' : 'Some Services Down'
})

const summaryStatusIndicator = computed(() => {
  if (overallStatus.value === 'All Systems Operational') return 'success'
  if (overallStatus.value === 'Some Services Down') return 'error'
  return 'unknown'
})

function selectTab(tabId: 'basic' | 'detailed') {
  selectedTab.value = tabId
  loadHealth()
}

function formatServiceName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Fix #4: useAsyncData replaces manual SSR/client branching for automatic deduplication
const { data: healthData, pending, error: fetchError, refresh } = await useAsyncData(
  () => `health-${selectedTab.value}`,
  async () => {
    const endpoint = selectedTab.value === 'basic' ? '/api/health' : `/api/health/${selectedTab.value}`
    const response = await $fetch<{ status: string; data: HealthInfo; request_id?: string }>(endpoint)
    if (response.status !== 'success') throw new Error('Failed to load health status')
    requestId.value = response.request_id || null
    return response.data
  },
)

// Sync to refs for template compatibility
watch(healthData, (v) => { health.value = v ?? null }, { immediate: true })
watch(pending, (v) => { loading.value = v }, { immediate: true })
watch(fetchError, (v) => { error.value = v?.message ?? null }, { immediate: true })

async function loadHealth(isRefresh = false) {
  if (isRefresh) refreshing.value = true
  await refresh()
  refreshing.value = false
}
</script>

<style scoped>
</style>
