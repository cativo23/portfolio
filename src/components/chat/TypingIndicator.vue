<script setup lang="ts">
const delays = ['0ms', '200ms', '400ms']
</script>

<template>
  <div class="flex justify-start">
    <div
      class="mr-8 flex items-center gap-2 rounded-nw-sm border border-nw-ai-mute bg-void-panel px-3 py-2"
    >
      <span
        v-for="(delay, i) in delays"
        :key="i"
        class="h-1.5 w-1.5 rounded-full bg-nw-ai animate-pulse motion-reduce:animate-none"
        :style="{ animationDelay: delay }"
      />
      <span
        class="font-stamp uppercase tracking-[0.14em] text-[9px] text-nw-text-dim"
      >
        Processing…
      </span>
    </div>
  </div>
</template>
