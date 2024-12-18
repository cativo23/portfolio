<template>
  <main class="prose prose-lg mx-auto py-2 px-2 sm:p-6 lg:p-8 max-w-full sm:max-w-3xl lg:max-w-full text-justify">
    <NuxtLink to="/blog" class="btn flex items-center mb-4 text-tokyo-night-highlight hover:text-tokyo-night-secondary">
      <LucideArrowLeft class="w-4 h-4 ml-2"/>Back to Blog
    </NuxtLink>
    <h1 v-if="data" class="text-3xl text-secondary">{{ data.title }}</h1>
    <ContentDoc v-if="data" :value="data" class="prose-tokyo"/>
  </main>
</template>

<script lang="ts" setup>

const route = useRoute();

const slug = route.params.slug as string;

const { data } = await useAsyncData(`blog-post-${slug}`, async () => {
  return await queryContent(`/blog/${slug}`).findOne();
});

usePageTitle(data.value?.title ?? 'Default Title', {
  description: data.value?.description,
  ogImage: data.value?.image,
});

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Blog post not found",
  });
}

</script>

<style scoped>
</style>