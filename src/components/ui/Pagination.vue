<template>
  <nav v-if="pagination && pagination.total_pages > 1" class="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      @click="goToPage(pagination.page - 1)"
      :disabled="pagination.page === 1"
      :class="[
        'px-4 py-2 rounded-lg transition-colors duration-200',
        pagination.page === 1
          ? 'bg-tokyo-night-dark text-tokyo-night-text opacity-50 cursor-not-allowed'
          : 'bg-tokyo-night-dark text-tokyo-night-highlight hover:bg-tokyo-night-purple hover:text-white'
      ]"
      aria-label="Previous page"
    >
      <LucideChevronLeft class="w-5 h-5" />
    </button>

    <!-- Page Numbers -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== '...'"
        @click="goToPage(page as number)"
        :class="[
          'px-4 py-2 rounded-lg transition-colors duration-200 min-w-[2.5rem]',
          page === pagination.page
            ? 'bg-tokyo-night-highlight text-black font-bold'
            : 'bg-tokyo-night-dark text-tokyo-night-text hover:bg-tokyo-night-purple hover:text-white'
        ]"
        :aria-label="`Go to page ${page}`"
        :aria-current="page === pagination.page ? 'page' : undefined"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-tokyo-night-text">...</span>
    </template>

    <!-- Next Button -->
    <button
      @click="goToPage(pagination.page + 1)"
      :disabled="pagination.page === pagination.total_pages"
      :class="[
        'px-4 py-2 rounded-lg transition-colors duration-200',
        pagination.page === pagination.total_pages
          ? 'bg-tokyo-night-dark text-tokyo-night-text opacity-50 cursor-not-allowed'
          : 'bg-tokyo-night-dark text-tokyo-night-highlight hover:bg-tokyo-night-purple hover:text-white'
      ]"
      aria-label="Next page"
    >
      <LucideChevronRight class="w-5 h-5" />
    </button>

    <!-- Page Info -->
    <div class="ml-4 text-sm text-tokyo-night-text">
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
  onPageChange: (page: number) => void
}

const props = defineProps<Props>()

const visiblePages = computed(() => {
  if (!props.pagination) return []
  
  const current = props.pagination.page
  const total = props.pagination.total_pages
  const pages: (number | string)[] = []
  
  // Always show first page
  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show first page
    pages.push(1)
    
    if (current <= 3) {
      // Near the start: 1, 2, 3, 4, ..., last
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // Near the end: 1, ..., last-3, last-2, last-1, last
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // In the middle: 1, ..., current-1, current, current+1, ..., last
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
    props.onPageChange(page)
  }
}
</script>
