<template>
  <section class="mb-16" id="contact">
    <BaseSectionHeading title="Contact me :)" animated :level="3" />
    <div>
      <form @submit.prevent="submitForm" class="bg-void-warm p-6 rounded-lg shadow-lg w-full flex flex-col gap-4">
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

        <BaseButton type="submit" :loading="loading" :disabled="loading">
          Send message
        </BaseButton>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useContactForm } from '~/composables/useContactForm';

const { form, loading, error, submitForm } = useContactForm();
</script>

<style></style>