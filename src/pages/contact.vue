<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">Contact Me</h2>
    <form @submit.prevent="submitForm" class="bg-tokyo-night-dark p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-1">
        <label for="name" class="text-tokyo-night-cyan font-mono font-bold">Name</label>
        <input type="text" id="name" v-model="form.name" required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="Your name">
      </div>
      <div class="flex flex-col gap-1">
        <label for="email" class="text-tokyo-night-cyan font-mono font-bold">Email</label>
        <input type="email" id="email" v-model="form.email" required
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="you@email.com">
      </div>
      <div class="flex flex-col gap-1">
        <label for="message" class="text-tokyo-night-cyan font-mono font-bold">Message</label>
        <textarea id="message" v-model="form.message" required rows="4"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          placeholder="Type your message..."></textarea>
      </div>
      <div v-if="error" class="text-red-400 font-mono">{{ error }}</div>
      <div v-if="success" class="text-green-400 font-mono">Message sent successfully!</div>

      <button :disabled="loading" type="submit"
        class="mt-2 px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50">
        {{ loading ? 'Sending...' : 'Send Message' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRuntimeConfig } from '#app';

usePageTitle('Contact', {
  description: 'Get in touch with me! I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.'
});

const config = useRuntimeConfig();
const apiBase = config.public.apiBaseUrl || 'http://localhost:3001';

const form = ref({ name: '', email: '', message: '' });
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

function validateForm() {
  error.value = null;
  const errors: string[] = [];
  if (!form.value.name || form.value.name.length < 2 || form.value.name.length > 100) {
    errors.push('Name must be between 2 and 100 characters');
  }
  if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.push('Please enter a valid email');
  }
  if (!form.value.message || form.value.message.length < 10 || form.value.message.length > 1000) {
    errors.push('Message must be between 10 and 1000 characters');
  }
  if (errors.length) {
    error.value = errors.join('. ');
    return false;
  }
  return true;
}

const submitForm = async () => {
  if (!validateForm()) return;
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const res = await fetch(`${apiBase}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.value.name, email: form.value.email, message: form.value.message }),
    });

    const data = await res.json();

    if (res.ok && data.status === 'success') {
      success.value = true;
      form.value = { name: '', email: '', message: '' };
    } else {
      error.value = data?.error?.message || 'Failed to send message';
    }
  } catch (err) {
    error.value = 'Network error. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>