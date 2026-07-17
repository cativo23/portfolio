<template>
  <div class="space-y-2 pb-16">
    <!-- HEADER -->
    <div class="panel">
      <div class="panel-header">
        <span>PRIVACY</span>
      </div>
      <div class="panel-body p-6 lg:p-8">
        <div class="font-stamp text-nw-cyan text-[10px] tracking-[0.2em] uppercase mb-2">
          FILE: privacy.md · LAST UPDATED {{ lastUpdated }}
        </div>
        <h1 class="compressed-title title-lg text-nw-text leading-[1.05] mb-3">
          What this site does <span class="text-nw-primary">with your data.</span>
        </h1>
        <p class="text-meta">
          Short version: almost nothing. No cookies, no tracking, no third-party
          ad networks, nothing sold. Everything here is self-hosted on my own box.
        </p>
      </div>
    </div>

    <!-- ANALYTICS -->
    <div class="panel">
      <div class="panel-header">
        <span>ANALYTICS · UMAMI</span>
      </div>
      <div class="panel-body p-6 lg:p-8 space-y-3">
        <p class="text-sm text-nw-text-dim leading-relaxed">
          Page visits are counted with <span class="text-nw-text">Umami</span> — a
          privacy-first, <span class="text-nw-primary">cookieless</span> analytics tool
          I run on my own server. It sets <span class="text-nw-text">no cookies</span>,
          stores nothing on your device, and never tracks you across other sites.
        </p>
        <div class="grid sm:grid-cols-2 gap-x-8 gap-y-2 pt-1">
          <div>
            <div class="m-label">Collected (aggregate only)</div>
            <ul class="text-sm text-nw-text-dim font-mono space-y-1 mt-2">
              <li>· page URL &amp; referrer</li>
              <li>· browser, OS, device type</li>
              <li>· country (from IP, not stored)</li>
            </ul>
          </div>
          <div>
            <div class="m-label">Never collected</div>
            <ul class="text-sm text-nw-text-dim font-mono space-y-1 mt-2">
              <li>· cookies / local storage</li>
              <li>· names, emails, personal data</li>
              <li>· cross-site or ad tracking</li>
            </ul>
          </div>
        </div>
        <p class="text-xs text-nw-text-mute leading-relaxed pt-1">
          Visitors are counted with a daily-rotating one-way hash — your raw IP is
          used to compute it and then discarded, never saved. Because there are no
          cookies, there's nothing to consent to and nothing to clear.
        </p>
      </div>
    </div>

    <!-- WHAT YOU SEND ME -->
    <div class="panel">
      <div class="panel-header">
        <span>WHAT YOU SEND ME</span>
      </div>
      <div class="panel-body p-6 lg:p-8 space-y-4">
        <div>
          <div class="font-stamp text-nw-green text-[10px] tracking-[0.18em] uppercase mb-1.5">
            Contact form
          </div>
          <p class="text-sm text-nw-text-dim leading-relaxed">
            If you send a message, the name, email, and text you type are stored so
            I can reply. That's it — it's not shared, sold, or added to any list.
            Ask me and I'll delete it.
          </p>
        </div>
        <div>
          <div class="font-stamp text-nw-green text-[10px] tracking-[0.18em] uppercase mb-1.5">
            The chat assistant
          </div>
          <p class="text-sm text-nw-text-dim leading-relaxed">
            Questions you type into the chat are sent to my server and to a
            third-party language-model provider (<span class="text-nw-text">Groq</span>)
            to generate the answer. It's grounded on my public CV and isn't used to
            identify you — but treat it like any public chat box and don't paste
            anything sensitive.
          </p>
        </div>
      </div>
    </div>

    <!-- FOOTER NOTE -->
    <div class="panel">
      <div class="panel-body p-6 lg:p-8">
        <p class="text-sm text-nw-text-dim leading-relaxed">
          Questions about any of this? Reach me at
          <a href="mailto:cativo@cativo.dev" class="text-nw-primary hover:text-nw-primary-hot underline">cativo@cativo.dev</a>.
        </p>
        <p class="text-[10px] font-stamp uppercase tracking-[0.18em] text-nw-text-faint mt-3">
          Not legal boilerplate — just how the stack actually works.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = '2026-07-16'

usePageTitle('Privacy', {
  description:
    'How cativo.dev handles data: cookieless self-hosted analytics (Umami), no tracking, no ad networks, nothing sold. What the contact form and chat assistant collect.',
})
</script>
