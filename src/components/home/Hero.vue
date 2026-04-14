<template>
  <section class="py-8 lg:py-12">
    <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-4xl mx-auto">
      <!-- Profile Image -->
      <div class="shrink-0 mx-auto lg:mx-0">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-tokyo-night-blue/20 blur-xl" />
          <NuxtImg
            src="/img/akira.jpeg"
            alt="Carlos Cativo profile photo"
            width="144"
            height="144"
            loading="lazy"
            class="relative w-36 h-36 rounded-full border-2 border-tokyo-night-blue object-cover"
            quality="80"
          />
        </div>
      </div>

      <!-- Text Content -->
      <div class="text-center lg:text-left flex-1">
        <h2 class="text-2xl lg:text-3xl font-bold mb-4 font-mono">
          <span class="text-tokyo-night-purple">❯</span>
          <DecryptedText
            text="Tech Lead & Full-Stack Engineer"
            animateOn="view"
            class="text-tokyo-night-cyan font-bold break-keep"
            encryptedClassName="text-opacity-60"
            :speed="30"
            :maxIterations="20"
            :sequential="true"
            revealDirection="center"
          />
        </h2>
        <p class="text-lg lg:text-xl mb-4 font-mono text-tokyo-night-muted">
          9 years building healthcare platforms, payment systems, and AI-powered products
        </p>
        <p class="text-sm mb-8 text-tokyo-night-dark3">
          NestJS &middot; Laravel &middot; Python &middot; Docker &middot; AWS &middot; AI/ML
        </p>
        <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
          <BaseButton to="/projects" class="font-mono">
            ❯ View Projects
          </BaseButton>
          <BaseButton to="/contact" variant="ghost" class="font-mono">
            ❯ Get In Touch
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
</script>
