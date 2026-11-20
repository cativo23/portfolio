<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const statusCode = computed(() => Number(props.error.statusCode) || 500)
const isNotFound = computed(() => statusCode.value === 404)

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
    <div class="pb-12" role="alert">
      <BasePageHead
        :level="1"
        :idx="`ERR-${statusCode}`"
        :label="isNotFound ? 'Channel lost' : 'Mission abort'"
        :kanji="isNotFound ? '絶' : '断'"
        :title="`${headline}.`"
      >
        {{ detail }}
      </BasePageHead>
      <BaseButton variant="ghost" class="mt-8" @click="returnToBase">
        <LucideArrowLeft class="w-4 h-4 mr-2" />
        Return to base
      </BaseButton>
    </div>
  </NuxtLayout>
</template>
