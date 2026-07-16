<template>
  <div class="panel" id="contact">
    <!-- Terminal-prompt silhouette: no panel-header chrome — the shell
         prompt IS the header, so this section reads differently from the
         stacked panels above it while staying inside the Nightwire voice. -->
    <div class="panel-body p-6 lg:p-8">
      <div class="font-sys text-sm mb-4 flex items-center gap-1.5 flex-wrap">
        <span class="text-nw-green">cativo@cativo.dev</span><span class="text-nw-text-dim">:~$</span>
        <span class="text-nw-text">open-channel</span>
        <span class="caret" aria-hidden="true">_</span>
      </div>
      <p class="text-nw-text-dim leading-relaxed mb-6 max-w-xl">
        <span class="text-nw-text-mute select-none"># </span>No intake forms. No synergy decks. Just a conversation about what you're building.
      </p>
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
        <BaseTextarea
          v-model="form.message"
          label="Message"
          placeholder="Write your message here"
          required
          :rows="4"
          :minlength="10"
          :maxlength="1000"
        />
        <div v-if="error" class="text-nw-red font-sys">{{ error }}</div>

        <BaseButton type="submit" :loading="loading" :disabled="loading" variant="primary" class="self-start">
          Open the channel →
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContactForm } from '~/composables/useContactForm';

const { form, loading, error, submitForm } = useContactForm();
</script>
