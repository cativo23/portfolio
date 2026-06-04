import { ref, onScopeDispose } from 'vue'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'error'
  content: string
  /** Distinguishes a generic error bubble from a rate-limit one. */
  variant?: 'error' | 'rate-limit'
}

interface ChatApiResponse {
  data: { answer: string; cached: boolean }
}

const RATE_LIMIT_COOLDOWN = 30

export function useChatAssistant() {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const cooldown = ref(0)

  let timer: ReturnType<typeof setInterval> | null = null

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startCooldown(seconds: number) {
    cooldown.value = seconds
    clearTimer()
    timer = setInterval(() => {
      cooldown.value -= 1
      if (cooldown.value <= 0) clearTimer()
    }, 1000)
  }

  async function send(text: string) {
    const question = text.trim()
    if (question.length < 1 || isLoading.value || cooldown.value > 0) return

    // Replay recent turns for context — the server is stateless. Exclude error
    // bubbles (not real turns) and cap to the last 6 (matches the API limit).
    const history = messages.value
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }))

    messages.value.push({ role: 'user', content: question })
    isLoading.value = true

    try {
      const res = await $fetch<ChatApiResponse>('/api/chat', {
        method: 'POST',
        body: { question, history },
      })
      messages.value.push({ role: 'assistant', content: res.data.answer })
    } catch (err) {
      const status = (err as { statusCode?: number })?.statusCode
      if (status === 429) {
        startCooldown(RATE_LIMIT_COOLDOWN)
        messages.value.push({
          role: 'error',
          variant: 'rate-limit',
          content: 'Too many questions — give it a moment and try again.',
        })
      } else {
        messages.value.push({
          role: 'error',
          variant: 'error',
          content: 'Something went wrong reaching the assistant. Please try again.',
        })
      }
    } finally {
      isLoading.value = false
    }
  }

  onScopeDispose(clearTimer)

  return { messages, isLoading, cooldown, send }
}
