<template>
  <section class="py-16" id="contact">
    <h3 class="text-2xl font-bold mb-6 text-tokyo-night-cyan">Contact Me :)</h3>
    <div class="flex justify-center space-y-6">
      <form class="card w-full bg-base-100 shadow-xl p-8">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Tu nombre</span>
          </label>
          <input type="text" placeholder="Escribe tu nombre" class="input input-bordered" />
        </div>
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Tu correo electrónico</span>
          </label>
          <input type="email" placeholder="correo@ejemplo.com" class="input input-bordered" />
        </div>
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Tu mensaje</span>
          </label>
          <textarea class="textarea textarea-bordered" placeholder="Escribe tu mensaje aquí"></textarea>
        </div>
        <div class="form-control mt-6">
          <button class="btn btn-primary">Enviar mensaje</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style></style>