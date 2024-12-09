<template>
  <section class="text-center py-5">
    <div class="hero-content flex-col lg:flex-row">
      <img src="/img/akira.jpeg" class="max-w-36 rounded-full shadow-2xl" alt="Foto de perfil" />
      <h2 class="text-4xl font-bold mb-4">Backend Developer & Tech Enthusiast</h2>
      <p class="text-xl mb-8">Crafting robust server-side solutions and sharing knowledge</p>
      <NuxtLink :to="`/projects`"
        class="btn bg-tokyo-night-red text-tokyo-night-dark px-6 py-2 rounded hover:bg-tokyo-night-cyan transition-colors duration-200 hover:cursor-pointer">
        View Projects
      </NuxtLink>
    </div>
  </section>
</template>

<script lang="ts" setup>
</script>

<style></style>