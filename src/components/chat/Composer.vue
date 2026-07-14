<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ loading?: boolean; cooldown?: number }>()
const emit = defineEmits<{ send: [text: string] }>()

const text = ref('')

const blocked = computed(() => !!props.loading || (props.cooldown ?? 0) > 0)
const canSend = computed(
  () => !blocked.value && text.value.trim().length >= 1,
)

const sendLabel = computed(() =>
  (props.cooldown ?? 0) > 0 ? `WAIT ${props.cooldown}s` : 'SEND',
)

function onSend() {
  if (!canSend.value) return
  emit('send', text.value.trim())
  text.value = ''
}
</script>

<template>
  <div class="flex items-end gap-2 border-t border-nw-faint bg-void-warm p-3">
    <textarea
      v-model="text"
      :disabled="blocked"
      rows="2"
      maxlength="500"
      placeholder="Ask about Carlos…"
      aria-label="Ask the assistant a question about Carlos"
      class="w-full resize-none rounded-none border border-nw-primary-dim bg-void-warm px-3 py-2 font-sys text-sm text-nw-text placeholder-nw-text-dim transition focus:border-nw-primary focus:outline-none focus:ring-1 focus:ring-nw-primary disabled:opacity-50"
      @keydown.enter.exact.prevent="onSend"
    />
    <BaseButton
      type="button"
      variant="primary"
      :loading="loading"
      :disabled="!canSend"
      class="min-h-[44px] shrink-0"
      @click="onSend"
    >
      {{ sendLabel }}
    </BaseButton>
  </div>
</template>
