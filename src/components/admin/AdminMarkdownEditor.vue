<template>
  <div class="border border-tokyo-night-gray rounded overflow-hidden">
    <!-- Mode toggle bar -->
    <div class="flex items-center justify-between px-3 py-2 bg-tokyo-night-dark border-b border-tokyo-night-gray/30">
      <div class="flex gap-1">
        <button
          type="button"
          v-for="mode in modes"
          :key="mode.value"
          @click="setMode(mode.value)"
          class="px-3 py-1 text-xs font-mono rounded transition-colors"
          :class="activeMode === mode.value
            ? 'bg-tokyo-night-cyan/20 text-tokyo-night-cyan font-medium'
            : 'text-tokyo-night-text/70 hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/30'"
        >
          {{ mode.label }}
        </button>
      </div>
      <span class="text-xs text-tokyo-night-muted font-mono">{{ words }} words</span>
    </div>

    <ClientOnly>
      <!-- Editor: use v-if to recreate on each switch to visual mode -->
      <div v-if="activeMode === 'wysiwyg'" ref="wysiwygRef" class="toast-editor-container" />

      <div v-if="activeMode === 'markdown'" class="bg-tokyo-night-bg">
        <textarea
          ref="markdownRef"
          v-model="markdownContent"
          class="w-full h-[560px] px-4 py-3 bg-tokyo-night-bg text-tokyo-night-text font-mono text-sm resize-none focus:outline-none"
          @input="onMarkdownInput"
          placeholder="Write your post in Markdown..."
        />
      </div>

      <div v-if="activeMode === 'preview'" class="bg-tokyo-night-bg">
        <div class="px-4 py-3 prose prose-invert prose-tokyo max-w-none h-[560px] overflow-auto">
          <MDCRenderer v-if="parsedContent?.body" :body="parsedContent.body" />
          <p v-else class="text-tokyo-night-muted text-sm italic">Nothing to preview...</p>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const modes = [
  { label: 'Visual', value: 'wysiwyg' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Preview', value: 'preview' },
]

const activeMode = ref<'wysiwyg' | 'markdown' | 'preview'>('wysiwyg')
const wysiwygRef = ref<HTMLElement | null>(null)
const editorInstance = ref<any>(null)

// Holds the single source of truth — synced from editor or textarea
const markdownContent = ref(props.modelValue)
const parsedContent = ref<any>(null)

// Track content source for proper sync
const lastSource = ref<'editor' | 'textarea' | 'initial'>('initial')

function getMarkdown(): string {
  if (editorInstance.value && lastSource.value !== 'textarea') {
    return editorInstance.value.getMarkdown()
  }
  return markdownContent.value
}

async function setMode(mode: typeof activeMode.value) {
  // Capture content before switching
  const currentMd = getMarkdown()
  markdownContent.value = currentMd
  emit('update:modelValue', currentMd)

  // Parse preview when entering preview mode
  if (mode === 'preview') {
    parseMarkdownPreview(currentMd)
  }

  // Destroy editor when leaving visual mode
  if (activeMode.value === 'wysiwyg' && editorInstance.value) {
    editorInstance.value.destroy()
    editorInstance.value = null
  }

  activeMode.value = mode

  // Recreate editor when entering visual mode
  if (mode === 'wysiwyg') {
    await nextTick()
    if (wysiwygRef.value && !editorInstance.value) {
      await createEditor(markdownContent.value)
    }
  }
}

function onMarkdownInput() {
  lastSource.value = 'textarea'
  emit('update:modelValue', markdownContent.value)
  parseMarkdownPreview(markdownContent.value)
}

function onEditorChange() {
  lastSource.value = 'editor'
  const md = editorInstance.value?.getMarkdown() || ''
  markdownContent.value = md
  emit('update:modelValue', md)
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => parseMarkdownPreview(md), 300)
}

let previewTimer: ReturnType<typeof setTimeout> | null = null

async function parseMarkdownPreview(md: string) {
  if (!md.trim()) { parsedContent.value = null; return }
  try {
    parsedContent.value = await $fetch('/api/admin/mdc/parse', { method: 'post', body: { content: md } })
  } catch {
    parsedContent.value = null
  }
}

const words = computed(() => {
  const text = getMarkdown()
  return text.trim() ? text.trim().split(/\s+/).length : 0
})

async function createEditor(initialValue: string) {
  const { Editor } = await import('@toast-ui/editor')

  editorInstance.value = new Editor({
    el: wysiwygRef.value!,
    initialValue: initialValue || '# Start writing...',
    initialEditType: 'wysiwyg',
    height: '560px',
    hideModeSwitch: true,
    events: {
      change: onEditorChange,
    },
  })
  lastSource.value = 'editor'
}

// Watch for content updates from parent (e.g. after loading existing post)
watch(() => props.modelValue, async (newVal) => {
  if (!newVal || newVal === markdownContent.value) return
  markdownContent.value = newVal
  // If editor exists, update it (only when visible)
  if (editorInstance.value && activeMode.value === 'wysiwyg') {
    try {
      editorInstance.value.setMarkdown(newVal)
    } catch { /* ignore */ }
  }
  parseMarkdownPreview(newVal)
})

// Dynamic import — @toast-ui/editor accesses `window` at module level
onMounted(async () => {
  await nextTick()
  if (!wysiwygRef.value) return

  try {
    await createEditor(props.modelValue)
    // Parse existing content for preview
    if (props.modelValue?.trim()) {
      parseMarkdownPreview(props.modelValue)
    }
  } catch (err) {
    console.error('[Editor] Failed to load TUI Editor:', err)
  }
})

onUnmounted(() => {
  editorInstance.value?.destroy()
})
</script>
