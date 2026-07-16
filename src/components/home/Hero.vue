<template>
  <!-- PERSONNEL DOSSIER -->
  <div class="panel">
      <div class="panel-header">
        <span>PERSONNEL DOSSIER · ID-SV-001</span>
        <span class="tag">人事ファイル</span>
      </div>
      <div class="panel-body grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-8 lg:gap-10 p-6 lg:p-8">
        <!-- Identity block -->
        <div class="order-2 lg:order-1">
          <div class="font-stamp text-nw-cyan text-[10px] tracking-[0.2em] uppercase mb-2">
            SENIOR BACKEND · TECH LEAD · 9 YRS IN PRODUCTION
          </div>

          <h1 class="compressed-title title-xl text-nw-text leading-[1] mt-1">
            Backends that don't<br>embarrass you<br>in <span class="text-nw-primary">production.</span>
          </h1>

          <div class="font-mincho mincho-accent text-nw-primary-dim mt-2">
            本番環境で恥をかかないバックエンド
          </div>

          <p class="lede mt-5">
            Senior backend engineer, 9 years on payments, integrations, and self-hosted infra. Currently Tech Lead at <span class="text-nw-text">Blue Medical Guatemala</span>. Remote-first, open to relocation w/ sponsorship.
          </p>

          <div class="mt-5 flex items-center gap-2 text-meta">
            <span class="led green blink" aria-hidden="true"></span>
            <span class="font-stamp uppercase tracking-wider text-nw-green">
              OPEN TO SENIOR BACKEND / TECH LEAD / STAFF ROLES
            </span>
          </div>

          <div class="mt-6 flex flex-wrap gap-3 items-center">
            <a class="btn" href="/resume.pdf" download="cativo-cv.pdf">
              ↓ DOWNLOAD CV (PDF)
            </a>
            <NuxtLink class="btn-ghost" to="/cv">
              VIEW CV →
            </NuxtLink>
            <NuxtLink class="btn-ghost" to="/projects">
              CASE FILES →
            </NuxtLink>
          </div>

          <div class="mt-4 flex flex-wrap gap-4 text-[13px] font-stamp uppercase tracking-wider text-nw-text-dim">
            <a href="mailto:cativo@cativo.dev" class="hover:text-nw-primary transition-colors">
              cativo@cativo.dev
            </a>
            <span class="text-nw-text-faint">·</span>
            <a href="https://linkedin.com/in/carlos-cativo" target="_blank" rel="noopener noreferrer" class="hover:text-nw-primary transition-colors">
              LinkedIn →
            </a>
            <span class="text-nw-text-faint">·</span>
            <a href="https://github.com/cativo23" target="_blank" rel="noopener noreferrer" class="hover:text-nw-primary transition-colors">
              GitHub →
            </a>
            <span class="text-nw-text-faint">·</span>
            <a href="https://blog.cativo.dev" target="_blank" rel="noopener noreferrer" class="hover:text-nw-primary transition-colors">
              Writing →
            </a>
          </div>
        </div>

        <!-- Avatar + ID metadata -->
        <aside class="order-1 lg:order-2 mx-auto lg:mx-0">
          <div class="relative">
            <div class="absolute inset-0 bg-nw-primary/10 blur-2xl" aria-hidden="true" />
            <NuxtImg
              src="/img/akira.jpeg"
              alt="Carlos Cativo digital avatar"
              width="180"
              height="180"
              loading="eager"
              class="relative w-[180px] h-[180px] object-cover border border-nw-primary-dim shadow-[0_0_28px_rgba(102,153,255,0.18),0_0_56px_rgba(102,153,255,0.07)]"
              style="border-radius: 0;"
              quality="80"
            />
          </div>
          <dl class="mt-3 font-stamp uppercase tracking-wider text-[9px] text-nw-text-dim space-y-0.5">
            <div class="flex justify-between gap-2"><dt class="text-nw-primary">OPERATOR</dt><dd class="text-nw-text">CATIVO-01</dd></div>
            <div class="flex justify-between gap-2"><dt class="text-nw-primary">CLEARANCE</dt><dd class="text-nw-text">TECH-LEAD</dd></div>
            <div class="flex justify-between gap-2"><dt class="text-nw-primary">UNIT</dt><dd class="text-nw-text">BLUE-MEDICAL-GT</dd></div>
          </dl>
        </aside>
      </div>
    </div>
</template>

<script setup lang="ts">
</script>
