<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Carlos Cativo — CV',
  meta: [
    {
      name: 'description',
      content:
        'Carlos Cativo — Senior Backend Engineer & Tech Lead. 9 years building production backend systems, payment platforms, and AI-powered services.',
    },
    { name: 'robots', content: 'index, follow' },
  ],
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: 'cv-body' },
})

const print = () => {
  if (typeof window !== 'undefined') window.print()
}
</script>

<template>
  <div class="cv-page">
    <div class="toolbar no-print">
      <button type="button" class="btn" @click="print">Print to PDF</button>
      <span class="dl">
        Or download:
        <a href="/resume.pdf" download>resume.pdf</a>
      </span>
    </div>

    <main class="cv">
      <header class="head">
        <h1>Carlos Cativo</h1>
        <p class="role">Senior Backend Engineer · Tech Lead</p>
        <p class="contact">
          <a href="mailto:cativo@cativo.dev">cativo@cativo.dev</a>
          <span class="sep">·</span>
          <a href="mailto:cativo23.kt@gmail.com">cativo23.kt@gmail.com</a>
          <span class="sep">·</span>
          <span>El Salvador (UTC-6) · EN/ES</span>
          <span class="sep">·</span>
          <a href="https://cativo.dev" target="_blank" rel="noopener">cativo.dev</a>
          <span class="sep">·</span>
          <a href="https://github.com/cativo23" target="_blank" rel="noopener">github.com/cativo23</a>
          <span class="sep">·</span>
          <a href="https://www.linkedin.com/in/cativo23" target="_blank" rel="noopener">linkedin.com/in/cativo23</a>
        </p>
      </header>

      <section>
        <h2>Summary</h2>
        <p class="summary">
          Tech Lead with 9 years building production backend systems — payment processing, e-invoicing,
          subscription platforms, and conversational AI. Strongest in Laravel/PHP and TypeScript/NestJS,
          comfortable across the stack and the infrastructure underneath. Open to senior backend, tech lead,
          and staff roles, remote-first, with sponsorship for relocation.
        </p>
      </section>

      <section>
        <h2>Experience</h2>

        <article class="job">
          <div class="job-head">
            <h3>Tech Lead / Full-Stack Engineer — Blue Medical</h3>
            <span class="when">Apr 2022 — Present · Guatemala (Remote)</span>
          </div>
          <ul>
            <li>
              Lead developer across payment, e-invoicing, subscription, and AI voice platforms — owned design,
              delivery, and on-call from greenfield to production.
            </li>
            <li>
              Built a Laravel payment microservice with a Strategy-pattern gateway abstraction over
              heterogeneous protocols (ISO 8583, SOAP/XML, REST). VGS card vault for PCI-friendly tokenization;
              network tokenization on top of the vault. Per-commerce / per-card-token routing, Horizon queues
              per gateway, Livewire ops dashboard. Led an OWASP-grade audit and ongoing security hardening.
            </li>
            <li>
              Shipped Guatemala FEL e-invoicing service through an authorized provider with multi-establishment support, async
              processing on Horizon/Redis, SAP integration for results and credit notes, and a Livewire ops
              dashboard with response-time analytics.
            </li>
            <li>
              Built BlueMeds, a medication subscription platform: lifecycle, delivery scheduling, insurance
              authorization, referral codes, Meilisearch catalog search, and 10+ third-party integrations
              across ERP, CRM, messaging, AI calling, and healthcare middleware.
            </li>
            <li>
              Primary author of sofIA, a multi-agent voice system on ElevenLabs ConvAI + n8n for healthcare
              scheduling, currently in production. State-machine workflow with deterministic validation,
              retry, and recovery layers around tool calls. FastAPI control plane + Nuxt dashboard + Typer CLI.
            </li>
          </ul>
          <p class="stack"><em>Laravel, PHP, NestJS, FastAPI, Python, Livewire, Nuxt, Angular/Ionic, PostgreSQL, MySQL, Redis/Horizon, Meilisearch, AWS, Docker, Bitbucket Pipelines, Sentry, ElevenLabs ConvAI.</em></p>
        </article>

        <article class="job">
          <div class="job-head">
            <h3>Backend Developer — OrangeSoftCo (Publimovil Regional)</h3>
            <span class="when">Sep 2020 — Apr 2022 · El Salvador</span>
          </div>
          <ul>
            <li>
              Re-architected the Y.O.D.A. monolith into microservices with Redis Streams for inter-service
              communication, improving end-to-end performance ~30%.
            </li>
            <li>
              Tightened GitLab CI/CD pipelines and Docker/K8s deploys on DigitalOcean, cutting build time ~20%.
            </li>
          </ul>
          <p class="stack"><em>Laravel, FastAPI, Python, MySQL, Redis Streams, Docker, Kubernetes, GitLab CI/CD.</em></p>
        </article>

        <article class="job">
          <div class="job-head">
            <h3>Senior Developer — Mussol</h3>
            <span class="when">Apr 2017 — Sep 2020 · El Salvador</span>
          </div>
          <ul>
            <li>
              Built an internal dashboard administering 100+ travel websites; set up AWS-based CI/CD that
              improved deploy time and reliability. Also shipped C#/Unity mobile games (TripXpertz).
            </li>
          </ul>
          <p class="stack"><em>Laravel, MySQL, AWS, C#/Unity.</em></p>
        </article>
      </section>

      <section>
        <h2>Selected Projects</h2>
        <ul class="projects">
          <li>
            <strong>VittBot</strong> <span class="proj-tag">personal · in development</span> — Multi-agent BTC/USDT
            trading bot on Binance: indicator pipeline feeds three Claude agents (Analyst, Trader, Validator)
            backed by a deterministic risk manager (10 hard-coded rules, never delegated to AI).
            <em>NestJS, TypeScript, Anthropic SDK, CCXT, Prisma + PostgreSQL.</em>
          </li>
          <li>
            <strong>nova-id</strong> <span class="proj-tag">personal · in development</span> — Zero Trust IAM
            stack using the Ory suite (Kratos, Hydra, Keto, Oathkeeper) with a NestJS admin API and Vue console.
            <em>Ory Stack, NestJS, Vue, Docker.</em>
          </li>
          <li>
            <strong>Clarify</strong> <span class="proj-tag">personal · in development</span> — AI legal-contract
            auditor (v1.0.0-alpha). PDF analysis, pay-per-analysis credits via Stripe webhooks, async processing
            on BullMQ.
            <em>Nuxt, Supabase (Postgres + RLS), OpenAI, Stripe, BullMQ + Redis.</em>
          </li>
          <li>
            <strong>cativo.dev infrastructure</strong> — Self-hosted production stack: 16 containers across
            6 stacks (apps, blog, mail, monitoring, proxy, databases) on my own infrastructure.
            <em>Docker Compose, Linux, UFW, TLS, DNS.</em>
          </li>
        </ul>
      </section>

      <section>
        <h2>Open Source · npm</h2>
        <ul class="projects">
          <li>
            <strong>lumira</strong> <span class="proj-tag">~1.9K dl/mo</span> — Claude Code workflow tooling
            (status line, hooks, helpers). <em>TypeScript, npm.</em>
          </li>
          <li>
            <strong>claude-style</strong> <span class="proj-tag">~850 dl/mo</span> — Style and formatting
            primitives for Claude Code agents. <em>TypeScript, npm.</em>
          </li>
          <li>
            <strong>nightwire</strong> <span class="proj-tag">~200 dl/mo</span> — Agent orchestration utilities
            for multi-step Claude workflows. <em>TypeScript, npm.</em>
          </li>
        </ul>
      </section>

      <section>
        <h2>Skills</h2>
        <dl class="skills">
          <dt>Languages</dt>
          <dd>TypeScript, JavaScript, PHP, Python, Bash, SQL</dd>
          <dt>Backend</dt>
          <dd>NestJS, Laravel 10/11, FastAPI</dd>
          <dt>Frontend</dt>
          <dd>Nuxt/Vue, Angular, Ionic, Tailwind</dd>
          <dt>Data</dt>
          <dd>PostgreSQL (Prisma, SQLAlchemy, Eloquent), MySQL, Redis, Meilisearch, Supabase</dd>
          <dt>AI / Integrations</dt>
          <dd>Anthropic Claude API, OpenAI, ElevenLabs ConvAI, multi-agent design, n8n, Stripe, Odoo, SAP, WhatsApp/Botmaker, Bland AI</dd>
          <dt>Payments / Tax</dt>
          <dd>Multi-gateway integration over heterogeneous protocols (ISO 8583, SOAP/XML, REST), VGS card vault, network tokenization, FEL e-invoicing (Guatemala), SAP</dd>
          <dt>Infra / DevOps</dt>
          <dd>Docker, Traefik, Nginx, AWS (S3/ECR/EC2), Cloudflare, GitHub Actions, Bitbucket Pipelines, Prometheus, Sentry</dd>
          <dt>Testing</dt>
          <dd>Pest/PHPUnit, Vitest, Jest, BATS, TDD</dd>
        </dl>
      </section>

      <section>
        <h2>Education</h2>
        <p>
          <strong>Universidad de El Salvador</strong> — B.Sc. Computer Systems Engineering, 2023. Specialization in Cloud Infrastructure.
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* ---------- On-screen ---------- */
.cv-page {
  min-height: 100vh;
  background: #f4f4f2;
  color: #111;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  padding: 32px 16px 64px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.toolbar {
  max-width: 800px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn {
  background: #111;
  color: #fff;
  border: none;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover { background: #333; }

.dl {
  font-size: 13px;
  color: #555;
}
.dl a {
  color: #111;
  text-decoration: underline;
}

.cv {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 48px 56px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 6px 24px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

/* ---------- Typography ---------- */
.head {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 14px;
  margin-bottom: 18px;
}
h1 {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.01em;
}
.role {
  font-size: 14px;
  color: #444;
  margin: 2px 0 8px;
  font-weight: 500;
}
.contact {
  font-size: 12px;
  color: #555;
  margin: 0;
  line-height: 1.5;
}
.contact a { color: #111; text-decoration: none; }
.contact a:hover { text-decoration: underline; }
.sep { color: #bbb; margin: 0 6px; }

section { margin-top: 16px; }

h2 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #111;
  margin: 0 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #111;
}

h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #111;
}

.summary {
  margin: 0;
  font-size: 14px;
  color: #222;
}

.job { margin-bottom: 14px; }
.job:last-child { margin-bottom: 0; }

.job-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}
.when {
  font-size: 12px;
  color: #555;
  white-space: nowrap;
}

ul {
  margin: 4px 0 6px;
  padding-left: 18px;
}
li {
  margin-bottom: 3px;
  font-size: 13.5px;
  color: #222;
}

.stack {
  margin: 4px 0 0;
  font-size: 12px;
  color: #555;
}
.stack em { font-style: italic; }

.projects li {
  margin-bottom: 6px;
}
.projects strong { color: #111; }
.projects em {
  color: #555;
  font-size: 12px;
  display: inline;
}
.proj-tag {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 500;
  color: #666;
  background: #eee;
  border-radius: 3px;
  padding: 1px 6px;
  margin: 0 4px;
  letter-spacing: 0.02em;
  vertical-align: 1px;
}

.skills {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 4px 14px;
  margin: 0;
  font-size: 13px;
}
.skills dt {
  font-weight: 600;
  color: #111;
}
.skills dd {
  margin: 0;
  color: #333;
}

a { color: #111; }

/* ---------- Print ---------- */
@media print {
  @page {
    size: Letter;
    margin: 0.55in;
  }

  html, body {
    background: #fff !important;
    color: #000 !important;
  }

  .cv-page {
    background: #fff;
    padding: 0;
    font-size: 10pt;
    line-height: 1.35;
  }

  .no-print { display: none !important; }

  .cv {
    max-width: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
  }

  .head {
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  h1 { font-size: 20pt; }
  .role { font-size: 10.5pt; margin: 1pt 0 4pt; }
  .contact { font-size: 8.5pt; }

  section { margin-top: 9pt; page-break-inside: avoid; }
  h2 {
    font-size: 9pt;
    margin: 0 0 4pt;
    padding-bottom: 2pt;
  }
  h3 { font-size: 10.5pt; }
  .summary { font-size: 10pt; }

  .job { margin-bottom: 8pt; page-break-inside: avoid; }
  .job-head { margin-bottom: 2pt; }
  .when { font-size: 9pt; }

  ul { margin: 2pt 0 3pt; padding-left: 14pt; }
  li { font-size: 9.5pt; margin-bottom: 1.5pt; }

  .stack { font-size: 8.5pt; margin-top: 2pt; }

  .projects li { margin-bottom: 3pt; font-size: 9.5pt; }
  .projects em { font-size: 8.5pt; }
  .proj-tag { font-size: 8pt; padding: 0 4pt; background: #eee !important; }

  .skills {
    grid-template-columns: 110px 1fr;
    gap: 2pt 10pt;
    font-size: 9pt;
  }

  a { color: #000 !important; text-decoration: none !important; }
}
</style>

<style>
/* Unscoped — overrides global bg-void on body when CV page is active.
   Scoped styles cannot reach html/body. */
body.cv-body {
  background: #f4f4f2 !important;
  color: #111 !important;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif !important;
}

@media print {
  html, body, body.cv-body {
    background: #fff !important;
    color: #000 !important;
  }
}
</style>
