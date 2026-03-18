# Form Components Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create BaseInput and BaseTextarea form components with integrated labels and error display, then refactor Contact.vue to use them.

**Architecture:** Two new components in `src/components/base/` following the same pattern as existing base components (Button, Card, Badge). Both support v-model via `modelValue` + `update:modelValue`. Contact.vue is refactored to replace inline form markup with the new components.

**Tech Stack:** Vue 3 Composition API, Nuxt 3 auto-imports, Tailwind CSS, TypeScript

**Important constraint:** No Node/yarn on host. All commands run inside Docker. Build verification: `docker compose build && docker compose up -d`, then `curl http://localhost:3001`.

**Spec:** `docs/superpowers/specs/2026-03-18-form-components-design.md`

---

## Chunk 1: Create Components and Refactor

### Task 1: Create BaseInput

**Files:**
- Create: `src/components/base/Input.vue`

- [ ] **Step 1: Create the BaseInput component**

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  minlength?: number
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = computed(() => {
  if (props.id) return props.id
  if (props.label) return props.label.toLowerCase().replace(/\s+/g, '-')
  return undefined
})

const inputClasses = computed(() => [
  'w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded font-mono placeholder-tokyo-night-muted transition',
  'focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan border',
  props.error ? 'border-tokyo-night-red' : 'border-tokyo-night-gray',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="text-tokyo-night-cyan font-mono font-bold">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :minlength="minlength"
      :maxlength="maxlength"
      :class="inputClasses"
    />
    <p v-if="error" class="text-tokyo-night-red font-mono text-sm mt-1">{{ error }}</p>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Input.vue
git commit -m "feat(ui): add BaseInput component with label and error support"
```

---

### Task 2: Create BaseTextarea

**Files:**
- Create: `src/components/base/Textarea.vue`

- [ ] **Step 1: Create the BaseTextarea component**

```vue
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/base/Textarea.vue
git commit -m "feat(ui): add BaseTextarea component with label and error support"
```

---

### Task 3: Refactor Contact.vue

**Files:**
- Modify: `src/components/home/Contact.vue`

- [ ] **Step 1: Replace form field markup with BaseInput and BaseTextarea**

Replace the template's form content (the three `<div class="flex flex-col gap-1">` blocks containing label+input/textarea, lines 6-20) with:

```vue
<BaseInput
  v-model="form.name"
  label="Name"
  placeholder="Write your name"
  required
  :minlength="2"
  :maxlength="100"
/>
<BaseInput
  v-model="form.email"
  label="Email"
  type="email"
  placeholder="email@example.com"
  required
/>
<BaseTextarea
  v-model="form.message"
  label="Message"
  placeholder="Write your message here"
  required
  :rows="4"
  :minlength="10"
  :maxlength="1000"
/>
```

Keep the error/success divs and BaseButton submit unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/components/home/Contact.vue
git commit -m "refactor(ui): use BaseInput and BaseTextarea in Contact form"
```

---

### Task 4: Verify build

- [ ] **Step 1: Build and test dev image**

```bash
docker compose build
docker compose up -d
sleep 20
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Expected: 200
docker compose down
```

- [ ] **Step 2: Close issue**

```bash
gh issue close 29
```
