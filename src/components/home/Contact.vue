<template>
  <section class="mb-16" id="contact">
    <h3 class="text-2xl font-bold mb-6">
      <DecryptedText text="Contact me :)" animateOn="view" class="text-tokyo-night-cyan font-bold"
        encryptedClassName="text-opacity-60" :speed="40" :maxIterations="10" :sequential="true"
        revealDirection="start" /></h3>
    <div>
      <form class="bg-tokyo-night-dark p-6 rounded-lg shadow-lg w-full flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="name" class="text-tokyo-night-cyan font-mono font-bold">Tu nombre</label>
          <input type="text" id="name" placeholder="Escribe tu nombre"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="email" class="text-tokyo-night-cyan font-mono font-bold">Tu correo electrónico</label>
          <input type="email" id="email" placeholder="correo@ejemplo.com"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition" />
        </div>
        <div class="flex flex-col gap-1">
          <label for="message" class="text-tokyo-night-cyan font-mono font-bold">Tu mensaje</label>
          <textarea id="message" rows="4" placeholder="Escribe tu mensaje aquí"
            class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text border border-tokyo-night-gray rounded focus:outline-none focus:ring-2 focus:ring-tokyo-night-cyan font-mono placeholder-tokyo-night-muted transition"></textarea>
        </div>
        <button type="submit"
          class="mt-2 px-6 py-2 bg-tokyo-night-highlight text-tokyo-night-dark font-mono font-bold rounded shadow hover:bg-tokyo-night-cyan transition">
          Enviar mensaje
        </button>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style></style>