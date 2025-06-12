<template>
  <main class="prose prose-lg mx-auto py-2 px-2 sm:p-6 lg:p-8 max-w-full sm:max-w-3xl lg:max-w-full text-justify">
    <NuxtLink to="/blog" class="btn flex items-center mb-4 text-tokyo-night-highlight hover:text-tokyo-night-secondary">
      <LucideArrowLeft class="w-4 h-4 ml-2" />Back to Blog
    </NuxtLink>
    <h1 v-if="blogPost" class="text-3xl font-bold text-tokyo-night-highlight font-mono">{{ blogPost.title }}</h1>
    <ContentRenderer v-if="blogPost" :value="blogPost" class="prose-tokyo" />
  </main>
</template>

<script lang="ts" setup>

const route = useRoute()
const pageId = computed(() => 'blog-' + route.path)
const { data: blogPost } = await useAsyncData(pageId, () => {
  return queryCollection('blog')
    .path(route.path)
    .first()
})

console.log('Blog Post:', blogPost.value);


usePageTitle(blogPost.value?.title ?? 'Default Title', {
  description: blogPost.value?.description,
  ogImage: blogPost.value?.image,
});

if (!blogPost.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Blog post not found",
  });
}

</script>

<style scoped></style>