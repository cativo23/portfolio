<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const statusCode = computed(() => Number(props.error.statusCode) || 500)
const isNotFound = computed(() => statusCode.value === 404)

const headerLabel = computed(() => isNotFound.value ? 'CHANNEL LOST · ERR-404' : `MISSION ABORT · ERR-${statusCode.value}`)
const stamp = computed(() => isNotFound.value ? '通信途絶' : '任務中断')

const headline = computed(() => isNotFound.value ? 'Case file not found' : 'Unexpected failure')
const detail = computed(() => {
  if (isNotFound.value) return "The path you requested doesn't exist or has been moved."
  return props.error.statusMessage || props.error.message || 'Something failed on our side. The signal will recover.'
})

function returnToBase() {
  clearError({ redirect: '/' })
}

useSeoMeta({
  title: `ERR-${statusCode.value}`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <div class="space-y-0.5 pb-12">
      <div class="panel">
        <div class="panel-header">
          <span>{{ headerLabel }}</span>
          <span class="tag">{{ stamp }}</span>
        </div>
        <div class="panel-body p-12 text-center" role="alert">
          <h1
            class="compressed-title text-nw-text leading-[1] mb-4"
            style="font-size: clamp(48px, 9vw, 96px);"
          >
            [ERR-{{ statusCode }}]
          </h1>
          <p class="font-stamp uppercase tracking-wider text-xs text-nw-red mb-4">
            {{ headline }}
          </p>
          <p class="text-nw-text-dim leading-relaxed max-w-md mx-auto mb-8">
            {{ detail }}
          </p>
          <BaseButton variant="ghost" @click="returnToBase">
            <LucideArrowLeft class="w-4 h-4 mr-2" />
            Return to base
          </BaseButton>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
