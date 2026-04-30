export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.apiToken) {
    headers['x-api-key'] = config.apiToken;
  }

  try {
    const data = await $fetch(`${config.apiBaseUrl}${config.apiBasePath}/profile`, {
      method: 'GET',
      headers,
    });

    return data;
  } catch (err) {
    console.error('[profile] API unreachable, serving fallback:', err)
    
    return {
      status: 'success',
      data: {
        name: 'Carlos Cativo',
        title: 'Tech Lead / Full-Stack Engineer',
        yearsOfExperience: 9,
        location: 'El Salvador',
        summary: [
          "I've spent the last 9 years building production systems in El Salvador — a market where fintech infrastructure is genuinely hard. No nice SDKs. I've implemented Visa ISO 8583 over SOAP by hand, built Guatemala's FEL electronic invoicing system from scratch, and designed payment microservices that handle real billing across multiple healthcare clinics daily.",
          "My primary stack is Laravel, NestJS, FastAPI, and Vue/Nuxt, running on Docker, deployed to AWS. I've been building on top of these long enough to know when the framework is the wrong choice — and to have the production incidents to back that up.",
          "The last two years I've gone deep into AI-powered systems: marIA, a voice agent handling automated patient scheduling in Spanish via ElevenLabs ConvAI; VittBot, a multi-agent crypto trading bot with three independent Claude agents plus a deterministic risk manager; Clarify, an AI legal contract auditor with Stripe billing. I don't just call AI APIs — I design the validation layers, retry logic, and safeguards that make them production-safe.",
          "I also run my own production infrastructure at cativo.dev — Traefik, Prometheus, Uptime Kuma, self-hosted mail, monitoring stack. Not because it's cheaper, but because it's the only way to actually understand what you're deploying to."
        ],
        experience: [
          {
            role: 'Tech Lead / Full-Stack Engineer',
            company: 'Blue Medical Guatemala',
            period: 'Apr 2022 → Present · 3+ yrs',
            location: 'Guatemala (Remote)',
            description: "Leading development across multiple healthcare systems simultaneously. Code reviews, requirement refinement, technical guidance for the team, and hands-on delivery of the hardest parts.",
            highlights: [
              "marIA — AI voice agent for automated patient scheduling via ElevenLabs ConvAI + n8n. Resolved bugs affecting 42% of conversations (STT misfires, language leakage, infinite retry loops). Designed the full management platform: FastAPI API + Nuxt dashboard + Typer CLI.",
              "Payment Service — Built from scratch. Visa ISO 8583, BAC SOAP/XML, card tokenization, reversals, webhook handling. Led 6-agent parallel security audit (OWASP: hardcoded secrets, Sanctum token expiration, CORS, PHP EOL).",
              "Invoice Service — Built from scratch. Guatemala FEL tax system via Megaprint, Strategy Pattern for provider swaps, SAP integration, async pipeline via Redis/Horizon, QR code generation, multi-establishment support.",
              "BlueMeds Platform — Core developer on medication subscription platform. 10+ integrations: Odoo ERP, WhatsApp/Botmaker, FreshDesk, Bland AI, VivoLife, payment APIs.",
              "BlueMeds Admin Panel — Angular/Ionic admin panel for the pharmaceutical platform."
            ],
            tags: ['Laravel', 'NestJS', 'Python', 'Angular', 'Vue/Nuxt', 'ISO 8583', 'FEL', 'ElevenLabs', 'n8n', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Bitbucket Pipelines']
          },
          {
            role: 'Backend Developer',
            company: 'OrangeSoftCo (Publimovil Regional)',
            period: 'Sep 2020 – Apr 2022 · 1.5 yrs',
            location: 'San Marcos, El Salvador',
            description: "Rebuilt the Y.O.D.A. platform as a microservices architecture, improving application performance by 30%. Improved CI/CD pipelines in GitLab, cutting build time by 20%. Implemented inter-service communication via Redis Streams.",
            tags: ['Laravel', 'FastAPI', 'Python', 'MySQL', 'Redis Streams', 'Docker', 'Kubernetes', 'GitLab CI/CD', 'DigitalOcean']
          },
          {
            role: 'Senior Developer',
            company: 'Mussol (TripXpertz)',
            period: 'Apr 2017 – Sep 2020 · 3.5 yrs',
            location: 'El Salvador',
            description: "Built an internal dashboard managing 100+ travel websites, streamlining administration workflows. Set up CI/CD on AWS to improve deployment time and reliability. Developed mobile games in C#/Unity.",
            tags: ['Laravel', 'MySQL', 'AWS', 'C# / Unity']
          },
          {
            role: 'B.Sc. Computer Systems Engineering',
            company: 'Universidad de El Salvador',
            period: '2014 – 2021',
            location: 'Education',
            description: "Specialization in Cloud Infrastructure.",
            tags: []
          }
        ],
        skills: [
          { name: 'Backend', skills: [{ name: 'Laravel' }, { name: 'NestJS' }, { name: 'FastAPI / TypeScript' }, { name: 'PHP' }, { name: 'Python / REST' }, { name: 'GraphQL' }, { name: 'SOAP/XML' }]},
          { name: 'Frontend', skills: [{ name: 'Vue/Nuxt' }, { name: 'Angular' }, { name: 'Ionic / TailwindCSS' }, { name: 'TypeScript / full-stack when needed' }]},
          { name: 'Data', skills: [{ name: 'PostgreSQL' }, { name: 'MySQL / Redis' }, { name: 'Meilisearch' }, { name: 'Supabase / Prisma' }, { name: 'TypeORM' }, { name: 'SQLAlchemy' }]},
          { name: 'Infra & DevOps', skills: [{ name: 'Docker' }, { name: 'AWS (S3, ECR, EC2) / Traefik' }, { name: 'Nginx' }, { name: 'Cloudflare / GitHub Actions' }, { name: 'Bitbucket Pipelines' }]},
          { name: 'Specialty', skills: [{ name: 'Multi-agent LLM systems / ISO 8583' }, { name: 'FEL invoicing' }, { name: 'SAP / ElevenLabs ConvAI' }, { name: 'Ory IAM' }]},
          { name: 'AI / Integrations', skills: [{ name: 'Claude API' }, { name: 'OpenAI' }, { name: 'ElevenLabs / n8n' }, { name: 'Stripe' }, { name: 'Odoo ERP / Botmaker' }, { name: 'FreshDesk' }, { name: 'Bland AI' }]},
        ],
        outsideCode: [
          {
            title: 'Three rescued dogs',
            icon: '🐕',
            description: 'Nova, Vitto, and Kovu. They name the projects. They have strong opinions about standups.'
          },
          {
            title: 'Civic Type R FK8',
            icon: '🚗',
            description: 'Rallye Red. I\'ll track it someday. The rev counter has opinions about my schedule.'
          },
          {
            title: 'Keyboards & IEMs',
            icon: '⌨️',
            description: 'Truthear ZERO:RED currently in rotation. The collection is larger than I\'ll admit in writing.'
          }
        ],
        github: 'https://github.com/cativo23',
        linkedin: 'https://linkedin.com/in/carlos-cativo',
        website: 'https://cativo.dev',
      },
    };
  }
});
