<template>
  <div>
    <h2 class="text-3xl font-bold mb-8 text-tokyo-night-cyan">Contact Me</h2>
    <form @submit.prevent="submitForm" class="bg-tokyo-night-dark p-6 rounded-lg">
      <div class="mb-4">
        <label for="name" class="block text-sm font-bold mb-2">Name</label>
        <input type="text" id="name" v-model="form.name" required
               class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan">
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-bold mb-2">Email</label>
        <input type="email" id="email" v-model="form.email" required
               class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan">
      </div>
      <div class="mb-4">
        <label for="message" class="block text-sm font-bold mb-2">Message</label>
        <textarea id="message" v-model="form.message" required rows="4"
                  class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan"></textarea>
      </div>
      <button type="submit" 
              class="btn btn-primary">
        Send Message
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

usePageTitle('Contact');

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitForm = () => {
  // Here you would typically send the form data to a server
  console.log('Form submitted:', form.value)
  // Reset the form after submission
  form.value = { name: '', email: '', message: '' }
  alert('Thank you for your message! I will get back to you soon.')
}
</script>