<template>
  <!-- PERSONNEL DOSSIER -->
  <div class="panel">
      <div class="nw-section-head" data-idx="00">
        <span>Personnel dossier · ID-SV-001</span>
        <span class="kanji" aria-hidden="true">人</span>
      </div>
      <div class="panel-body grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 lg:gap-10 p-6 lg:p-8">
        <!-- Identity block -->
        <div class="order-2 lg:order-1">
          <div class="font-stamp text-nw-text-mute text-[10px] tracking-[0.2em] uppercase mb-2">
            SENIOR BACKEND · TECH LEAD · 9 YRS IN PRODUCTION
          </div>

          <h1 class="nw-display" style="font-size: var(--text-title-xl);">
            Backends that don't<br>embarrass you<br>in <span class="text-nw-primary">production.</span>
          </h1>

          <div class="font-mincho mincho-accent text-nw-text-mute mt-2">
            本番環境で恥をかかないバックエンド
          </div>

          <p class="lede mt-5">
            Senior backend engineer, 9 years on payments, integrations, and self-hosted infra. Currently Tech Lead at <span class="text-nw-text">Blue Medical Guatemala</span>. Remote-first, open to relocation w/ sponsorship.
          </p>

          <div class="mt-5 flex items-center gap-2 text-meta">
            <span class="led blink" data-state="ok" aria-hidden="true"></span>
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
          <div class="nw-reticle">
            <div class="nw-reticle-meta"><span>00 // CATIVO-01</span><span>■</span></div>
            <NuxtImg
              src="/img/akira.jpeg"
              alt="Carlos Cativo digital avatar"
              width="180"
              height="180"
              loading="eager"
              class="w-[180px] h-[180px] object-cover"
              style="border-radius: 0;"
              quality="80"
            />
            <div class="mt-3">
              <div class="kv-row"><span class="kv-label">Operator</span><span class="kv-value">CATIVO-01</span></div>
              <div class="kv-row"><span class="kv-label">Clearance</span><span class="kv-value">TECH-LEAD</span></div>
              <div class="kv-row"><span class="kv-label">Unit</span><span class="kv-value">BLUE-MEDICAL-GT</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
</template>

<script setup lang="ts">
</script>
