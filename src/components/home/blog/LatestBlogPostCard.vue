<template>
  <BaseCard>
    <h4 class="text-xl font-bold mb-2 text-tokyo-night-highlight">{{ post.title }}</h4>
    <p class="mb-4">{{ post.excerpt }}</p>
    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-tokyo-night-yellow">{{ post.date }}</span>
        <BaseButton v-if="post.path" variant="ghost" size="sm" :to="post.path">
          Read More
          <LucideArrowRight class="w-4 h-4 ml-2" />
        </BaseButton>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts" setup>
import type { BlogPost } from '~/types/blog'

interface Props {
  post: BlogPost
}

defineProps<Props>()
defineOptions({
  name: 'LatestBlogPostCard'
})
</script>
