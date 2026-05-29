<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@/composables/useChatAssistant'

const props = defineProps<{ message: ChatMessage }>()

const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')
const isRateLimit = computed(() => props.message.variant === 'rate-limit')
const isError = computed(
  () => props.message.role === 'error' && !isRateLimit.value,
)

const label = computed(() => {
  if (isUser.value) return 'OPERATOR'
  if (isAssistant.value) return 'AI DEBRIEF'
  if (isRateLimit.value) return 'RATE LIMIT'
  return 'ERROR'
})

const bubbleClass = computed(() => {
  if (isUser.value)
    return 'ml-8 bg-void-raised border border-nw-line text-nw-text'
  if (isAssistant.value)
    return 'mr-8 bg-void-panel border border-nw-ai-mute text-nw-text-dim shadow-[0_0_8px_rgba(178,102,224,0.12)]'
  if (isRateLimit.value)
    return 'bg-nw-yellow/10 border border-nw-yellow text-nw-yellow'
  return 'bg-nw-red-fill border border-nw-red text-nw-red'
})

const labelClass = computed(() => {
  if (isUser.value) return 'text-nw-primary'
  if (isAssistant.value) return 'text-nw-ai'
  if (isRateLimit.value) return 'text-nw-yellow'
  return 'text-nw-red'
})
</script>

<template>
  <div :class="['flex', isUser ? 'justify-end' : 'justify-start']">
    <div :class="['max-w-[85%] rounded-nw-sm px-3 py-2', bubbleClass]">
      <span
        :class="[
          'block font-stamp uppercase tracking-[0.14em] text-[9px] mb-1',
          labelClass,
        ]"
      >
        <template v-if="isError || isRateLimit">{{ isRateLimit ? '⚠' : '✕' }} </template>{{ label }}
      </span>
      <p class="font-sys text-sm whitespace-pre-wrap break-words">
        {{ message.content }}
      </p>
    </div>
  </div>
</template>
