<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan font-mono">
      <span class="text-tokyo-night-purple">❯</span> Get In Touch
    </h2>

    <!-- Success State -->
    <div v-if="successMessage" class="bg-tokyo-night-green/10 border border-tokyo-night-green/30 rounded p-6 text-center" role="status">
      <LucideCheckCircle class="w-12 h-12 text-tokyo-night-green mx-auto mb-3" />
      <p class="text-tokyo-night-green font-mono font-bold mb-2">Message Sent!</p>
      <p class="text-tokyo-night-muted">{{ successMessage }}</p>
      <button @click="successMessage = null" class="mt-4 text-tokyo-night-cyan font-mono text-sm underline hover:text-tokyo-night-blue transition">
        Send another message
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="submitForm" class="bg-tokyo-night-dark border border-tokyo-night-gray/30 p-6 rounded flex flex-col gap-4 w-full" novalidate>
      <div class="flex flex-col gap-1">
        <label for="name" class="text-tokyo-night-cyan font-mono font-bold">Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          @blur="validateField('name')"
          :aria-invalid="fieldErrors.name ? 'true' : 'false'"
          :aria-describedby="fieldErrors.name ? 'name-error' : undefined"
          required
          autocomplete="name"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          :class="fieldErrors.name ? 'border-red-400' : 'border-tokyo-night-gray'"
          placeholder="Your name"
        >
        <p v-if="fieldErrors.name" id="name-error" class="text-red-400 text-xs font-mono mt-1" role="alert">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <label for="email" class="text-tokyo-night-cyan font-mono font-bold">Email</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          @blur="validateField('email')"
          :aria-invalid="fieldErrors.email ? 'true' : 'false'"
          :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
          required
          autocomplete="email"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          :class="fieldErrors.email ? 'border-red-400' : 'border-tokyo-night-gray'"
          placeholder="you@email.com"
        >
        <p v-if="fieldErrors.email" id="email-error" class="text-red-400 text-xs font-mono mt-1" role="alert">
          {{ fieldErrors.email }}
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <label for="message" class="text-tokyo-night-cyan font-mono font-bold">Message</label>
        <textarea
          id="message"
          v-model="form.message"
          @blur="validateField('message')"
          :aria-invalid="fieldErrors.message ? 'true' : 'false'"
          :aria-describedby="fieldErrors.message ? 'message-error' : undefined"
          required
          rows="4"
          class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"
          :class="fieldErrors.message ? 'border-red-400' : 'border-tokyo-night-gray'"
          placeholder="Type your message..."
        ></textarea>
        <p v-if="fieldErrors.message" id="message-error" class="text-red-400 text-xs font-mono mt-1" role="alert">
          {{ fieldErrors.message }}
        </p>
      </div>

      <!-- Honeypot field - hidden from real users, catches bots -->
      <input
        type="text"
        id="website"
        v-model="form.website"
        tabindex="-1"
        autocomplete="off"
        class="absolute -left-[9999px] -top-[9999px] opacity-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >

      <div v-if="error" class="text-red-400 font-mono text-sm" role="alert">{{ error }}</div>

      <button
        :disabled="loading"
        type="submit"
        class="mt-2 px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <LucideLoader v-if="loading" class="w-4 h-4 animate-spin" />
        {{ loading ? 'Sending...' : 'Send Message' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

usePageTitle('Contact', {
  description: 'Get in touch with me! I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision.'
});

interface ContactForm {
  name: string;
  email: string;
  message: string;
  website?: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const form = reactive<ContactForm>({ name: '', email: '', message: '', website: '' });
const fieldErrors = reactive<FieldErrors>({});
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const toast = useToast();

function validateField(field: keyof FieldErrors): boolean {
  fieldErrors[field] = undefined;

  switch (field) {
    case 'name':
      if (!form.name || form.name.trim().length < 2) {
        fieldErrors.name = 'Name must be at least 2 characters';
      } else if (form.name.length > 100) {
        fieldErrors.name = 'Name must be under 100 characters';
      }
      break;
    case 'email':
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        fieldErrors.email = 'Please enter a valid email address';
      }
      break;
    case 'message':
      if (!form.message || form.message.trim().length < 10) {
        fieldErrors.message = 'Message must be at least 10 characters';
      } else if (form.message.length > 1000) {
        fieldErrors.message = 'Message must be under 1000 characters';
      }
      break;
  }

  return !fieldErrors[field];
}

function validateForm(): boolean {
  fieldErrors.name = undefined;
  fieldErrors.email = undefined;
  fieldErrors.message = undefined;

  const valid = [
    validateField('name'),
    validateField('email'),
    validateField('message'),
  ];

  return valid.every(Boolean);
}

async function submitForm() {
  // Honeypot check — bots often fill hidden "website" fields
  if (form.website) {
    return;
  }

  if (!validateForm()) {
    error.value = 'Please fix the errors above.';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await $fetch<{ status: string; error?: { message: string } }>('/api/contacts', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      },
    });

    if (data?.status === 'success') {
      successMessage.value = 'Thanks for reaching out! I will get back to you soon.';
      form.name = '';
      form.email = '';
      form.message = '';
      toast.success('Message sent successfully!');
    } else {
      const msg = data?.error?.message || 'Failed to send message';
      error.value = msg;
      toast.error(msg);
    }
  } catch {
    const msg = 'Network error. Please try again later.';
    error.value = msg;
    toast.error(msg);
  } finally {
    loading.value = false;
  }
}
</script>
