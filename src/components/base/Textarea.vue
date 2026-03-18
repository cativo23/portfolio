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

const textareaClasses = computed(() => [
  'w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded font-mono placeholder-tokyo-night-muted transition',
  'focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan border',
  props.error ? 'border-tokyo-night-red' : 'border-tokyo-night-gray',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="textareaId" class="text-tokyo-night-cyan font-mono font-bold">
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
    />
    <p v-if="error" class="text-tokyo-night-red font-mono text-sm mt-1">{{ error }}</p>
  </div>
</template>
