# Design: Reusable Form Components (#29)

## Goal

Create BaseInput and BaseTextarea components with integrated labels and error display, then refactor Contact.vue to use them — eliminating repeated Tailwind class strings.

## Scope

**In scope:** BaseInput, BaseTextarea, refactor Contact.vue.

**Out of scope:** BaseButton (already exists from #35), BaseLabel as standalone (integrated into input/textarea), form validation logic (stays in parent).

## Tech Stack

- Vue 3 Composition API with `<script setup lang="ts">`
- Nuxt 3 auto-imports (`base/Input.vue` → `<BaseInput>`)
- Tailwind CSS with Tokyo Night palette
- v-model support via `modelValue` + `update:modelValue`

## Shared Input Styles

Both components share the same base Tailwind classes from the current Contact.vue:

```
w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded
focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition
```

**Error state:** Border changes to `border-tokyo-night-red` (replacing `border-tokyo-night-gray`).

**Label styles:** `text-tokyo-night-cyan font-mono font-bold` (from current Contact.vue).

## Components

### 1. BaseInput (`src/components/base/Input.vue`)

Text input with integrated label and error message.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | v-model binding |
| `label` | `string` | — | Label text above input |
| `id` | `string` | auto from label | HTML id for input + label `for` |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type |
| `placeholder` | `string` | — | Placeholder text |
| `required` | `boolean` | `false` | HTML required attribute |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `string` | — | Error message displayed below input |
| `minlength` | `number` | — | HTML minlength attribute |
| `maxlength` | `number` | — | HTML maxlength attribute |

**Emits:** `update:modelValue` — for v-model support.

**Auto-generated id:** If `label` is provided but `id` is not, generate id from label: `label.toLowerCase().replace(/\s+/g, '-')`.

**Template structure:**
```html
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
    :class="[baseClasses, error ? 'border-tokyo-night-red' : 'border-tokyo-night-gray']"
  />
  <p v-if="error" class="text-tokyo-night-red font-mono text-sm mt-1">{{ error }}</p>
</div>
```

### 2. BaseTextarea (`src/components/base/Textarea.vue`)

Textarea with integrated label and error message. Same API as BaseInput minus `type`, plus `rows`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | v-model binding |
| `label` | `string` | — | Label text above textarea |
| `id` | `string` | auto from label | HTML id |
| `placeholder` | `string` | — | Placeholder text |
| `required` | `boolean` | `false` | HTML required |
| `disabled` | `boolean` | `false` | Disabled state |
| `error` | `string` | — | Error message below textarea |
| `rows` | `number` | `4` | Textarea rows |
| `minlength` | `number` | — | HTML minlength |
| `maxlength` | `number` | — | HTML maxlength |

**Emits:** `update:modelValue`

**Template structure:** Same as BaseInput but renders `<textarea>` instead of `<input>`.

## Refactoring: Contact.vue

The contact form template reduces from ~20 lines of repeated markup to:

```html
<form @submit.prevent="submitForm" class="bg-tokyo-night-dark p-6 rounded-lg shadow-lg w-full flex flex-col gap-4">
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
  <div v-if="error" class="text-red-400 font-mono">{{ error }}</div>
  <div v-if="success" class="text-green-400 font-mono">Message sent successfully!</div>
  <BaseButton type="submit" :loading="loading" :disabled="loading">
    Send message
  </BaseButton>
</form>
```

Script section stays unchanged — validation logic, form refs, submitForm function all remain in Contact.vue.

## Constraints

- All components use `<script setup lang="ts">` with TypeScript interfaces
- Follow existing Tokyo Night tokens from `tailwind.config.js`
- No new dependencies
- Nuxt auto-import handles registration
- `tokyo-night-red` (`#f7768e`) is already defined in tailwind config as `red`
