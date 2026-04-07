<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/admin/blog" class="text-tokyo-night-blue hover:text-tokyo-night-cyan">
        <LucideArrowLeft class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-tokyo-night-text">{{ isNew ? 'New Blog Post' : 'Edit Blog Post' }}</h1>
    </div>

    <div v-if="loading" class="text-center py-12 text-tokyo-night-muted font-mono">
      Loading post...
    </div>

    <form v-else @submit.prevent="savePost" class="space-y-6 max-w-6xl">
      <!-- Metadata row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="title" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Title</label>
          <input id="title" v-model="form.title" type="text" required class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono" placeholder="Post title">
        </div>
        <div>
          <label for="description" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Description</label>
          <input id="description" v-model="form.description" type="text" required class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono" placeholder="Short description for SEO">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="tags" class="block text-sm text-tokyo-night-cyan font-mono mb-1">Tags (comma-separated)</label>
          <input id="tags" v-model="form.tags" type="text" class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono" placeholder="backend, career, learning">
        </div>
        <div class="flex items-end gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="draft" v-model="form.status" class="accent-tokyo-night-yellow">
            <span class="text-sm text-tokyo-night-muted">Draft</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" value="published" v-model="form.status" class="accent-tokyo-night-green">
            <span class="text-sm text-tokyo-night-muted">Publish</span>
          </label>
        </div>
      </div>

      <!-- Markdown editor with live preview -->
      <div>
        <label class="block text-sm text-tokyo-night-cyan font-mono mb-1">Content (Markdown)</label>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-tokyo-night-gray rounded overflow-hidden h-[600px]">
          <!-- Editor -->
          <div class="flex flex-col min-h-0">
            <div class="px-3 py-1.5 bg-tokyo-night-dark border-b border-tokyo-night-gray/30 text-xs text-tokyo-night-muted font-mono flex items-center justify-between shrink-0">
              <span>Editor</span>
              <div class="flex gap-2">
                <button type="button" @click="insertMd('**', '**')" class="hover:text-tokyo-night-text transition" title="Bold"><LucideBold class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('*', '*')" class="hover:text-tokyo-night-text transition" title="Italic"><LucideItalic class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('\n## ', '\n')" class="hover:text-tokyo-night-text transition" title="Heading"><LucideHeading class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('\n- ', '\n')" class="hover:text-tokyo-night-text transition" title="List"><LucideList class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('`', '`')" class="hover:text-tokyo-night-text transition" title="Code"><LucideCode class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('\n```\n', '\n```\n')" class="hover:text-tokyo-night-text transition" title="Code block"><LucideFileCode class="w-3.5 h-3.5" /></button>
                <button type="button" @click="insertMd('[', '](url)')" class="hover:text-tokyo-night-text transition" title="Link"><LucideLink class="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <textarea
              id="content"
              ref="editorRef"
              v-model="form.content"
              class="flex-1 w-full px-4 py-3 bg-tokyo-night-bg text-tokyo-night-text font-mono text-sm resize-none focus:outline-none min-h-0"
              placeholder="Write your post in Markdown..."
              @keydown.tab.prevent="insertTab"
            ></textarea>
          </div>
          <!-- Preview -->
          <div class="flex flex-col border-l border-tokyo-night-gray min-h-0">
            <div class="px-3 py-1.5 bg-tokyo-night-dark border-b border-tokyo-night-gray/30 text-xs text-tokyo-night-muted font-mono shrink-0">
              Preview
            </div>
            <div class="flex-1 overflow-auto min-h-0 px-4 py-3 prose prose-invert prose-tokyo max-w-none">
              <MDCRenderer v-if="parsedContent" :body="parsedContent.body" />
              <p v-else class="text-tokyo-night-muted text-sm italic">Nothing to preview yet...</p>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="text-red-400 text-sm font-mono" role="alert">{{ error }}</p>
      <p v-if="success" class="text-tokyo-night-green text-sm font-mono">{{ success }}</p>

      <div class="flex gap-3">
        <button type="submit" :disabled="saving" class="px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 flex items-center gap-2">
          <LucideLoader v-if="saving" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <NuxtLink to="/admin/blog" class="px-6 py-2 text-tokyo-night-muted font-mono hover:text-tokyo-night-text transition">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const isNew = computed(() => route.path === '/admin/blog/new')

// Decode URL-safe path: index.vue replaces / with -- to avoid nested routes
// We need to convert back for the API call
function decodePath(raw: string): string {
  return raw.replace(/--/g, '/')
}

const postSlug = computed(() => {
  if (isNew.value) return ''
  const raw = Array.isArray(route.params.path)
    ? route.params.path.join('/')
    : String(route.params.path)
  // Decode -- back to /, strip leading slashes
  let decoded = decodePath(raw).replace(/^\/+/, '')

  // Check if it's a draft path: contains /drafts/
  const isDraft = decoded.includes('/drafts/')
  if (isDraft) {
    // Keep drafts/ prefix so API knows to look in drafts folder
    decoded = 'drafts/' + decoded.split('/drafts/').pop()!
  } else {
    // Published: strip blog/ prefix
    decoded = decoded.replace(/^blog\//, '')
  }
  return decoded
})

const form = reactive({
  title: '',
  description: '',
  tags: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
  existingPath: '',
})

const parsedContent = ref<any>(null)

watch(() => form.content, async (val) => {
  if (!val) { parsedContent.value = null; return }
  try {
    parsedContent.value = await $fetch('/api/admin/mdc/parse', { method: 'post', body: { content: val } })
  } catch {
    parsedContent.value = null
  }
}, { immediate: true })

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const editorRef = ref<HTMLTextAreaElement | null>(null)

// Load existing post raw content
onMounted(async () => {
  if (isNew.value) {
    loading.value = false
    return
  }

  try {
    const res = await $fetch<{ content: string }>(`/api/admin/blog/${postSlug.value}`)
    const raw = res.content

    // Parse frontmatter
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (match) {
      const frontmatter = match[1] || ''
      form.content = match[2] || ''

      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)
      const descMatch = frontmatter.match(/description:\s*["']?([^"'\n]+)["']?/)
      const tagsMatch = frontmatter.match(/tags:\s*\[([^\]]*)\]/)
      const rawPath = Array.isArray(route.params.path)
        ? route.params.path.join('/')
        : String(route.params.path)
      const isDraftPath = decodePath(rawPath).includes('/drafts/')

      form.title = titleMatch?.[1]?.trim() || ''
      form.description = descMatch?.[1]?.trim() || ''
      form.tags = tagsMatch?.[1]?.replace(/["']/g, '').trim() || ''
      form.status = isDraftPath ? 'draft' : 'published'
      // postSlug already includes 'drafts/' for drafts
      form.existingPath = '/blog/' + postSlug.value
    }
  } catch {
    error.value = 'Failed to load post'
  } finally {
    loading.value = false
  }
})

function insertTab() {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  form.content = form.content.substring(0, start) + '  ' + form.content.substring(end)
  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 2
  })
}

function insertMd(before: string, after: string) {
  const el = editorRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = form.content.substring(start, end)
  const replacement = before + (selected || 'text') + after
  form.content = form.content.substring(0, start) + replacement + form.content.substring(end)
  nextTick(() => {
    el.focus()
    el.selectionStart = start + before.length
    el.selectionEnd = start + before.length + (selected || 'text').length
  })
}

async function savePost() {
  saving.value = true
  error.value = null
  success.value = null

  try {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    await $fetch('/api/admin/blog', {
      method: 'post' as any,
      body: {
        title: form.title,
        description: form.description,
        tags,
        content: form.content,
        status: form.status,
        existingPath: isNew.value ? undefined : form.existingPath,
      },
    })

    success.value = form.status === 'draft' ? 'Draft saved!' : 'Post published!'
    setTimeout(() => navigateTo('/admin/blog'), 1500)
  } catch (e: any) {
    error.value = e?.statusMessage || e?.data?.error || 'Failed to save post'
  } finally {
    saving.value = false
  }
}
</script>
