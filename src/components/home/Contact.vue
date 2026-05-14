<template>
  <div class="panel" id="contact">
    <div class="panel-header">
      <span>OPEN CHANNEL · DIRECT LINE</span>
    </div>
    <div class="panel-body p-6 lg:p-8">
      <p class="text-nw-text-dim leading-relaxed mb-6">
        No intake forms. No synergy decks. Just a conversation about what you're building.
      </p>
      <form @submit.prevent="submitForm" class="max-w-xl flex flex-col gap-4">
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
        <div v-if="error" class="text-nw-red font-sys">{{ error }}</div>

        <BaseButton type="submit" :loading="loading" :disabled="loading" variant="primary">
          Send message
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContactForm } from '~/composables/useContactForm';

const { form, loading, error, submitForm } = useContactForm();
</script>
