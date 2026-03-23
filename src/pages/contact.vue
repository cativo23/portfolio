<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">Contact Me</h2>
    <form @submit.prevent="submitForm" class="bg-tokyo-night-dark p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name" class="text-tokyo-night-cyan font-mono font-bold">Name</label>
        <input type="text" id="name" v-model="form.name" required aria-required="true"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="Your name">
      </div>
      <div class="flex flex-col gap-1">
        <label for="email" class="text-tokyo-night-cyan font-mono font-bold">Email</label>
        <input type="email" id="email" v-model="form.email" required aria-required="true"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="you@email.com">
      </div>
      <div class="flex flex-col gap-1">
        <label for="message" class="text-tokyo-night-cyan font-mono font-bold">Message</label>
        <textarea id="message" v-model="form.message" required aria-required="true" rows="4"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="Type your message..."></textarea>
      </div>
      <div v-if="error" class="text-red-400 font-mono">{{ error }}</div>

      <button :disabled="loading" type="submit"
        class="mt-2 px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50">
        {{ loading ? 'Sending...' : 'Send Message' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useContactForm } from '~/composables/useContactForm';

usePageTitle('Contact', {
  description: 'Get in touch with me! I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.'
});

const { form, loading, error, submitForm, resetForm } = useContactForm();
</script>