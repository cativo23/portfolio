<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChatAssistant } from '@/composables/useChatAssistant'
import { useFocusTrap } from '@/composables/useFocusTrap'

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

const { messages, isLoading, cooldown, send } = useChatAssistant()

useFocusTrap(panelRef, isOpen, () => (isOpen.value = false))

function toggle() {
  isOpen.value = !isOpen.value
}

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

watch([() => messages.value.length, isLoading], scrollToBottom)
watch(isOpen, (open) => open && scrollToBottom())
</script>

<template>
  <div>
    <!-- Launcher -->
    <button
      type="button"
      :aria-label="isOpen ? 'Close assistant' : 'Ask the AI assistant about Carlos'"
      :aria-expanded="isOpen"
      aria-controls="chat-panel"
      class="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-nw-primary"
      :class="
        isOpen
          ? 'border-nw-ai-mute bg-void-panel text-nw-text-dim'
          : 'border-nw-ai bg-nw-ai text-void hover:bg-nw-ai/90 hover:shadow-[0_0_16px_rgba(178,102,224,0.5)]'
      "
      @click="toggle"
    >
      <LucideX v-if="isOpen" class="h-5 w-5" />
      <LucideMessageSquare v-else class="h-5 w-5" />
    </button>

    <!-- Panel -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isOpen"
        id="chat-panel"
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        aria-label="AI assistant — ask about Carlos"
        class="fixed inset-0 z-40 flex flex-col border-nw-ai-mute bg-void-warm sm:inset-auto sm:bottom-20 sm:right-4 sm:h-[560px] sm:max-h-[80vh] sm:w-[360px] sm:rounded-nw-sm sm:border"
      >
        <!-- Header -->
        <header
          class="flex items-center justify-between border-b border-nw-ai-mute px-3 py-2"
        >
          <span
            class="flex items-center gap-2 font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-ai"
          >
            <span class="led blue blink" />
            AI DEBRIEF
          </span>
          <button
            type="button"
            aria-label="Close assistant"
            class="text-nw-text-dim transition-colors hover:text-nw-text focus:outline-none focus-visible:ring-2 focus-visible:ring-nw-primary"
            @click="isOpen = false"
          >
            <LucideX class="h-4 w-4" />
          </button>
        </header>

        <!-- Messages -->
        <div
          ref="listRef"
          class="flex-1 space-y-3 overflow-y-auto bg-void p-3"
        >
          <div
            v-if="messages.length === 0"
            class="flex h-full flex-col items-center justify-center gap-2 text-center"
          >
            <span class="led blue blink" />
            <p
              class="font-stamp uppercase tracking-[0.14em] text-[10px] text-nw-text-dim"
            >
              Ask anything about Carlos
            </p>
            <p class="font-sys text-xs text-nw-text-dim/70">
              Experience · projects · stack · availability
            </p>
          </div>

          <ChatMessage
            v-for="(msg, i) in messages"
            :key="i"
            :message="msg"
          />
          <ChatTypingIndicator v-if="isLoading" />
        </div>

        <!-- Composer -->
        <ChatComposer
          :loading="isLoading"
          :cooldown="cooldown"
          @send="send"
        />
      </div>
    </Transition>
  </div>
</template>
