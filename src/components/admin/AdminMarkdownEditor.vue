<template>
  <div class="border border-tokyo-night-gray rounded overflow-hidden">
    <!-- Mode toggle bar -->
    <div class="flex items-center justify-between px-3 py-2 bg-tokyo-night-dark border-b border-tokyo-night-gray/30">
      <div class="flex gap-1">
        <button
          v-for="mode in modes"
          :key="mode.value"
          @click="setMode(mode.value)"
          class="px-3 py-1 text-xs font-mono rounded transition-colors"
          :class="activeMode === mode.value
            ? 'bg-tokyo-night-cyan/20 text-tokyo-night-cyan font-medium'
            : 'text-tokyo-night-muted hover:text-tokyo-night-text hover:bg-tokyo-night-highlight/30'"
        >
          {{ mode.label }}
        </button>
      </div>
      <span class="text-xs text-tokyo-night-muted font-mono">{{ words }} words</span>
    </div>

    <!-- TUI Editor container -->
    <div v-show="activeMode === 'wysiwyg'" ref="wysiwygRef" class="toast-editor-container" />

    <!-- Markdown raw mode -->
    <div v-show="activeMode === 'markdown'" class="bg-tokyo-night-bg">
      <textarea
        ref="markdownRef"
        v-model="markdownContent"
        class="w-full h-[560px] px-4 py-3 bg-tokyo-night-bg text-tokyo-night-text font-mono text-sm resize-none focus:outline-none"
        @input="onMarkdownInput"
        placeholder="Write your post in Markdown..."
      />
    </div>

    <!-- Markdown preview -->
    <div v-show="activeMode === 'preview'" class="bg-tokyo-night-bg">
      <div class="px-4 py-3 prose prose-invert prose-tokyo max-w-none h-[560px] overflow-auto">
        <MDCRenderer v-if="parsedContent?.body" :body="parsedContent.body" />
        <p v-else class="text-tokyo-night-muted text-sm italic">Nothing to preview...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@toast-ui/editor/dist/toastui-editor.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import Editor from '@toast-ui/editor'
import Prism from 'prismjs'

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
const markdownRef = ref<HTMLTextAreaElement | null>(null)
const editorInstance = ref<Editor | null>(null)

// Raw markdown content (synced from editor)
const markdownContent = ref(props.modelValue)
const parsedContent = ref<any>(null)

let syncing = false

function setMode(mode: typeof activeMode.value) {
  // Save current editor state before switching
  if (editorInstance.value && mode !== 'wysiwyg') {
    markdownContent.value = editorInstance.value.getMarkdown()
  }

  // When entering WYSIWYG mode, update the editor with latest markdown
  if (mode === 'wysiwyg' && editorInstance.value) {
    editorInstance.value.setMarkdown(markdownContent.value)
  }

  activeMode.value = mode
}

function onMarkdownInput() {
  emit('update:modelValue', markdownContent.value)
  // Parse preview in background
  parseMarkdownPreview(markdownContent.value)
}

function onEditorChange() {
  if (syncing) return
  syncing = true
  const md = editorInstance.value?.getMarkdown() || ''
  markdownContent.value = md
  emit('update:modelValue', md)
  parseMarkdownPreview(md)
  syncing = false
}

async function parseMarkdownPreview(md: string) {
  if (!md.trim()) {
    parsedContent.value = null
    return
  }
  try {
    parsedContent.value = await $fetch('/api/admin/mdc/parse', { method: 'post', body: { content: md } })
  } catch {
    parsedContent.value = null
  }
}

const words = computed(() => {
  const text = activeMode.value === 'wysiwyg'
    ? editorInstance.value?.getMarkdown() || ''
    : markdownContent.value
  return text.trim() ? text.trim().split(/\s+/).length : 0
})

// Init editor on mount
onMounted(() => {
  if (!wysiwygRef.value) return

  editorInstance.value = new Editor({
    el: wysiwygRef.value,
    initialValue: props.modelValue || '# Start writing...',
    initialEditType: 'wysiwyg',
    height: '560px',
    plugins: [[codeSyntaxHighlight, { highlighter: (code: string, lang: string) => Prism.highlight(code, Prism.languages[lang] || Prism.languages.markup, lang) }]],
    hideModeSwitch: true, // We handle mode switching ourselves
    events: {
      change: onEditorChange,
    },
  })
})

// Cleanup
onUnmounted(() => {
  editorInstance.value?.destroy()
})
</script>

<style>
/* Toast UI Editor — Tokyo Night theme overrides */
.toast-editor-container .toastui-editor-defaultUI {
  font-family: 'Source Code Pro', ui-monospace, monospace;
  border: none;
  border-radius: 0;
}

.toast-editor-container .toastui-editor-defaultUI-toolbar {
  background-color: #16161e;
  border-bottom: 1px solid #292e42;
}

.toast-editor-container .toastui-editor-toolbar-group button {
  color: #565f89;
}

.toast-editor-container .toastui-editor-toolbar-group button:hover {
  background-color: #292e42;
  color: #a9b1d6;
}

.toast-editor-container .toastui-editor-toolbar-group button.active {
  background-color: #1a1b26;
  color: #7dcfff;
}

.toast-editor-container .toastui-editor-mode-switch .tab-item {
  background-color: #16161e;
  color: #565f89;
  border-color: #292e42;
}

.toast-editor-container .toastui-editor-mode-switch .tab-item.active {
  background-color: #1a1b26;
  color: #7dcfff;
  border-color: #292e42;
}

/* Editor area */
.toast-editor-container .toastui-editor-ww-container,
.toast-editor-container .toastui-editor-md-container {
  background-color: #1a1b26;
}

.toast-editor-container .toastui-editor-ww-container .ProseMirror,
.toast-editor-container .toastui-editor-md-editor {
  background-color: #1a1b26;
  color: #a9b1d6;
}

.toast-editor-container .toastui-editor-contents,
.toast-editor-container .ProseMirror {
  font-family: 'Source Code Pro', ui-monospace, monospace;
  color: #a9b1d6;
}

/* Markdown textarea inside TUI */
.toast-editor-container .toastui-editor-md-editor textarea {
  background-color: #1a1b26 !important;
  color: #a9b1d6 !important;
  font-family: 'Source Code Pro', ui-monospace, monospace;
}

/* Toolbar dropdown */
.toast-editor-container .toastui-editor-popup {
  background-color: #1a1b26;
  border: 1px solid #292e42;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.toast-editor-container .toastui-editor-popup-body label {
  color: #a9b1d6;
}

.toast-editor-container .toastui-editor-popup-body input {
  background-color: #16161e;
  border: 1px solid #292e42;
  color: #a9b1d6;
  border-radius: 4px;
}

.toast-editor-container .toastui-editor-popup-body button {
  background-color: #7dcfff;
  color: #1a1b26;
  border-radius: 4px;
}

/* Table popup */
.toast-editor-container .toastui-editor-popup-table {
  background-color: #1a1b26;
  border: 1px solid #292e42;
}

.toast-editor-container .toastui-editor-popup-table button {
  background-color: #292e42;
  border-color: #1a1b26;
}

/* Headings */
.toast-editor-container .toastui-editor-contents h1,
.toast-editor-container .ProseMirror h1 {
  color: #7aa2f7;
}
.toast-editor-container .toastui-editor-contents h2,
.toast-editor-container .ProseMirror h2 {
  color: #7aa2f7;
}
.toast-editor-container .toastui-editor-contents h3,
.toast-editor-container .ProseMirror h3 {
  color: #7aa2f7;
}

/* Links */
.toast-editor-container .toastui-editor-contents a,
.toast-editor-container .ProseMirror a {
  color: #7dcfff;
}

/* Code blocks */
.toast-editor-container .toastui-editor-contents pre,
.toast-editor-container .ProseMirror pre {
  background-color: #16161e;
  border: 1px solid #292e42;
  border-radius: 6px;
}

.toast-editor-container .toastui-editor-contents code,
.toast-editor-container .ProseMirror code {
  background-color: #16161e;
  color: #9ece6a;
}

/* Blockquotes */
.toast-editor-container .toastui-editor-contents blockquote,
.toast-editor-container .ProseMirror blockquote {
  border-left: 3px solid #f7768e;
  color: #a9b1d6;
}

/* Tables */
.toast-editor-container .toastui-editor-contents table th,
.toast-editor-container .ProseMirror table th {
  background-color: #16161e;
  color: #7aa2f7;
  border-color: #292e42;
}

.toast-editor-container .toastui-editor-contents table td,
.toast-editor-container .ProseMirror table td {
  border-color: #292e42;
  color: #a9b1d6;
}

/* Scrollbar */
.toast-editor-container .ProseMirror::-webkit-scrollbar,
.toast-editor-container .toastui-editor-md-editor textarea::-webkit-scrollbar {
  width: 6px;
}

.toast-editor-container .ProseMirror::-webkit-scrollbar-track,
.toast-editor-container .toastui-editor-md-editor textarea::-webkit-scrollbar-track {
  background: #1a1b26;
}

.toast-editor-container .ProseMirror::-webkit-scrollbar-thumb,
.toast-editor-container .toastui-editor-md-editor textarea::-webkit-scrollbar-thumb {
  background: #292e42;
  border-radius: 3px;
}
</style>
