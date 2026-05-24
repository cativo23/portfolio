<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  id?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  rows?: number
  minlength?: number
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 4,
  required: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const textareaId = computed(() => {
  if (props.id) return props.id
  if (props.label) return props.label.toLowerCase().replace(/\s+/g, '-')
  return undefined
})

const errorId = computed(() => props.error && textareaId.value ? `${textareaId.value}-error` : undefined)

const textareaClasses = computed(() => [
  'w-full px-3 py-2 bg-void-warm text-nw-text rounded-none font-sys placeholder-nw-text-dim transition',
  'focus:outline-none focus:ring-1 focus:ring-nw-primary focus:border-nw-primary border',
  props.error ? 'border-nw-red' : 'border-nw-primary-dim',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="textareaId" class="text-nw-primary font-stamp uppercase tracking-[0.16em] text-[9px]">
      {{ label }}
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :minlength="minlength"
      :maxlength="maxlength"
      :class="textareaClasses"
      :aria-required="required || undefined"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="errorId"
    />
    <p v-if="error" :id="errorId" class="text-nw-red font-sys text-sm mt-1">{{ error }}</p>
  </div>
</template>
