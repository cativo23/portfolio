<template>
  <section class="mb-16" id="contact">
    <BaseSectionHeading title="Contact me :)" animated :level="3" />
    <div>
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
        <div v-if="error" class="text-tokyo-night-red font-mono">{{ error }}</div>

        <BaseButton type="submit" :loading="loading" :disabled="loading">
          Send message
        </BaseButton>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const toast = useToast();
const form = ref({ name: '', email: '', message: '', subject: '' });
const loading = ref(false);
const error = ref<string | null>(null);

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

  try {
    const data = await $fetch<{ status: string; error?: { message: string } }>('/api/contacts', {
      method: 'POST',
      body: { name: form.value.name, email: form.value.email, message: form.value.message, subject: form.value.subject || undefined },
    });

    if (data && typeof data === 'object' && 'status' in data && data.status === 'success') {
      toast.success('Message sent successfully!')
      form.value = { name: '', email: '', message: '', subject: '' };
    } else {
      const msg = data.error?.message || 'Failed to send message';
      toast.error(msg)
    }
  } catch (err) {
    toast.error('Network error. Please try again.')
  } finally {
    loading.value = false;
  }
}


</script>

<style></style>