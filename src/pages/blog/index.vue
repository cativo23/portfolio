<template>
  <div>
    <BaseSectionHeading title="Blog Posts" />
    <div class="space-y-8">
      <BaseCard v-for="post in posts" :key="post.path">
        <h3 class="mb-2 text-2xl font-bold font-mono text-tokyo-night-text">{{ post.title }}</h3>
        <p class="mb-4 font-mono text-tokyo-night-muted">{{ post.description }}</p>
        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-tokyo-night-purple font-mono text-sm">{{ formatDate(post.created_at) }}</span>
            <BaseButton variant="ghost" :to="post.path ?? '/404'" size="sm" class="font-mono">
              ❯ Read More
              <LucideArrowRight class="w-4 h-4 ml-2" />
            </BaseButton>
          </div>
        </template>
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
usePageTitle('Blog', {
  description: 'Explore my latest blog posts on backend development, technology trends, and personal insights.'
});

const { data: posts } = await useAsyncData('blog-index', () => {
  return queryCollection('blog')
    .order('created_at', 'DESC')
    .all()
})

function formatDate(dateString?: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>