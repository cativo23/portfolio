<template>
  <section class="mb-16" id="contact">
    <BaseSectionHeading title="Contact me :)" animated :level="3" />
    <div>
      <form @submit.prevent="submitForm" class="bg-tokyo-night-dark p-6 rounded-lg shadow-lg w-full flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="name" class="text-tokyo-night-cyan font-mono font-bold">Name</label>
          <input v-model="form.name" type="text" id="name" placeholder="Write your name" required minlength="2" maxlength="100"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="email" class="text-tokyo-night-cyan font-mono font-bold">Email</label>
          <input v-model="form.email" type="email" id="email" placeholder="email@example.com" required
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="message" class="text-tokyo-night-cyan font-mono font-bold">Message</label>
          <textarea v-model="form.message" id="message" rows="4" placeholder="Write your message here" required minlength="10" maxlength="1000"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"></textarea>
        </div>
        <div v-if="error" class="text-red-400 font-mono">{{ error }}</div>
        <div v-if="success" class="text-green-400 font-mono">Message sent successfully!</div>

        <BaseButton type="submit" :loading="loading" :disabled="loading">
          Send message
        </BaseButton>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const form = ref({ name: '', email: '', message: '', subject: '' });
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

async function submitForm() {
  if (!validateForm()) return;
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const data = await $fetch<{ status: string; error?: { message: string } }>('/api/contacts', {
      method: 'POST',
      body: { name: form.value.name, email: form.value.email, message: form.value.message, subject: form.value.subject || undefined },
    });

    if (data && typeof data === 'object' && 'status' in data && data.status === 'success') {
      success.value = true;
      form.value = { name: '', email: '', message: '', subject: '' };
    } else {
      const msg = data.error?.message || 'Failed to send message';
      error.value = msg;
    }
  } catch (err) {
    error.value = 'Network error. Please try again.';
  } finally {
    loading.value = false;
  }
}


</script>

<style></style>