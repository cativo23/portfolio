<template>
  <article class="bg-tokyo-night-dark p-6 rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer">
    <h4 class="text-xl font-bold mb-2 text-tokyo-night-highlight">{{ post.title }}</h4>
    <p class="mb-4">{{ post.excerpt }}</p>
    <div class="flex justify-between items-center">
      <span class="text-tokyo-night-yellow">{{ post.date }}</span>
      <button class="flex items-center text-tokyo-night-green hover:text-tokyo-night-cyan transition-colors duration-200">
        Read More
        <LucideArrowRight class="w-4 h-4 ml-2" />
      </button>
    </div>
  </article>
</template>

<script lang="ts" setup>

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

</script>

<style></style>