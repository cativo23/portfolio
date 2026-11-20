<script setup lang="ts">
interface Props {
  /** Index shown as "01 // LABEL". */
  idx: string
  label: string
  /** Kanji in the right slot of the section head. */
  kanji: string
  /** The big serif headline (.nw-display). */
  title: string
  level?: 1 | 2
}

withDefaults(defineProps<Props>(), { level: 2 })
</script>

<template>
  <header>
    <div class="nw-section-head" :data-idx="idx">
      <span>{{ label }}</span>
      <span class="kanji" aria-hidden="true">{{ kanji }}</span>
    </div>
    <component :is="'h' + level" class="nw-display">{{ title }}</component>
    <p v-if="$slots.default" class="nw-lede"><slot /></p>
  </header>
</template>
