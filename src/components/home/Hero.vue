<template>
  <section class="text-center py-5">
    <div class="hero-content flex-col lg:flex-row items-center justify-center">
      <div class="flex justify-center items-center w-full mb-4 lg:mb-0">
        <img src="/img/akira.jpeg" class="max-w-36 rounded-full shadow-2xl" alt="Foto de perfil" />
      </div>
      <h2 class="text-3xl font-bold mb-4">
        <DecryptedText text="Backend Developer & Tech Enthusiast" animateOn="view"
          class="text-tokyo-night-cyan font-bold break-keep" encryptedClassName="text-opacity-60"
          :speed="30" :maxIterations="20" :sequential="true" revealDirection="center" />
      </h2>
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