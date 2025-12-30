<template>
  <div>
    <h2 class="mb-8 text-3xl font-bold text-tokyo-night-cyan">Blog Posts</h2>
    <div class="space-y-8">
      <article v-for="post in posts" :key="post.path" 
               class="p-6 transition-shadow duration-200 rounded-lg bg-tokyo-night-dark hover:shadow-lg">
        <h3 class="mb-2 text-2xl font-bold">{{ post.title }}</h3>
        <p class="mb-4">{{ post.description }}</p>
        <div class="flex justify-between items-cente">
          <span class="text-tokyo-night-purple">{{ formatDate(post.created_at) }}</span>
          <NuxtLink :to="post.path ?? '/404'" class="flex items-center transition-colors duration-200 text-tokyo-night-green hover:text-tokyo-night-cyan">
            Read More
            <LucideArrowRight class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
usePageTitle('Blog', {
  description: 'Explore my latest blog posts on backend development, technology trends, and personal insights.'
});

const { data: posts } = await useAsyncData(() => {
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