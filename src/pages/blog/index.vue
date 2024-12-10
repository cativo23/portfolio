<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">Blog Posts</h2>
    <div class="space-y-8">
      <article v-for="post in blogs" :key="post._path" 
               class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
        <h3 class="text-2xl font-bold mb-2">{{ post.title }}</h3>
        <p class="mb-4">{{ post.description }}</p>
        <div class="flex justify-between items-cente">
          <span class="text-tokyo-night-purple">{{ post.created_at }}</span>
          <router-link :to="post._path ?? '/404'" class="flex items-center text-tokyo-night-green hover:text-tokyo-night-cyan transition-colors duration-200">
            Read More
            <LucideArrowRight class="w-4 h-4 ml-2" />
          </router-link>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>

const { data: blogs } = await useAsyncData('blogs', () => queryContent('/').find())
</script>