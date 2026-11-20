<template>
  <div class="space-y-16 pb-16">
    <!-- HEADER -->
    <div class="panel">
      <BasePageHead :level="1" idx="00" label="Privacy" kanji="私" title="Your data.">
        Short version: almost nothing. No cookies, no tracking, no third-party
        ad networks, nothing sold. Everything runs on my own box, except the
        fonts: they load from Google Fonts, so Google sees your IP when the page loads.
      </BasePageHead>
      <div class="font-stamp text-nw-text-mute text-[10px] tracking-[0.2em] uppercase mt-4">
        FILE: privacy.md · LAST UPDATED {{ lastUpdated }}
      </div>
    </div>

    <!-- ANALYTICS -->
    <div class="panel">
      <BasePageHead idx="01" label="Analytics · none" kanji="無" title="No analytics." />
      <div class="panel-body">
        <p class="text-sm text-nw-text-dim leading-relaxed">
          There's no analytics on this site. No tracking script runs, and nothing
          counts your visit or follows you around.
        </p>
      </div>
    </div>

    <!-- WHAT YOU SEND ME -->
    <div class="panel">
      <BasePageHead idx="02" label="What you send me" kanji="送" title="What you send." />
      <div class="panel-body space-y-4">
        <div>
          <div class="font-stamp text-nw-text-mute text-[10px] tracking-[0.18em] uppercase mb-1.5">
            Contact form
          </div>
          <p class="text-sm text-nw-text-dim leading-relaxed">
            If you send a message, the name, email, and text you type are stored so
            I can reply. That's it — it's not shared, sold, or added to any list.
            Ask me and I'll delete it.
          </p>
        </div>
        <div>
          <div class="font-stamp text-nw-text-mute text-[10px] tracking-[0.18em] uppercase mb-1.5">
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
      <div class="panel-body">
        <p class="text-sm text-nw-text-dim leading-relaxed">
          Questions about any of this? Reach me at
          <a href="mailto:cativo@cativo.dev" class="text-nw-primary hover:text-nw-primary-hot underline">cativo@cativo.dev</a>.
        </p>
        <p class="text-[10px] font-stamp uppercase tracking-[0.18em] text-nw-text-dim mt-3">
          Not legal boilerplate — just how the stack actually works.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = '2026-10-19'

usePageTitle('Privacy', {
  description:
    'How cativo.dev handles data: no analytics, no tracking, no ad networks, nothing sold. What the contact form and chat assistant collect.',
})
</script>
