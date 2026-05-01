<template>
  <nav v-if="pagination && pagination.total_pages > 1" class="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
    <!-- Previous Button -->
    <BaseButton
      variant="ghost"
      @click="goToPage(pagination.page - 1)"
      :disabled="pagination.page === 1"
      aria-label="Previous page"
    >
      <LucideChevronLeft class="w-5 h-5" />
    </BaseButton>

    <!-- Page Numbers -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== '...' && page === pagination.page"
        class="px-4 py-2 rounded-lg bg-void-raised text-black font-bold min-w-[2.5rem]"
        :aria-label="`Go to page ${page}`"
        aria-current="page"
      >
        {{ page }}
      </button>
      <BaseButton
        v-else-if="page !== '...'"
        variant="ghost"
        @click="goToPage(page as number)"
        :aria-label="`Go to page ${page}`"
      >
        {{ page }}
      </BaseButton>
      <span v-else class="px-2 text-nw-text">...</span>
    </template>

    <!-- Next Button -->
    <BaseButton
      variant="ghost"
      @click="goToPage(pagination.page + 1)"
      :disabled="pagination.page === pagination.total_pages"
      aria-label="Next page"
    >
      <LucideChevronRight class="w-5 h-5" />
    </BaseButton>

    <!-- Page Info -->
    <div class="ml-4 text-meta">
      <span class="sr-only">Showing</span>
      {{ ((pagination.page - 1) * pagination.limit) + 1 }}-{{ Math.min(pagination.page * pagination.limit, pagination.total_items) }} of {{ pagination.total_items }}
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaginationMeta } from '~/types/pagination'

interface Props {
  pagination: PaginationMeta | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'page-change': [page: number] }>()

const visiblePages = computed(() => {
  if (!props.pagination) return []

  const current = props.pagination.page
  const total = props.pagination.total_pages
  const pages: (number | string)[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (current <= 3) {
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= (props.pagination?.total_pages ?? 1)) {
    emit('page-change', page)
  }
}
</script>
