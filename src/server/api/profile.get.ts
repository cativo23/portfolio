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
    // Fallback for when API doesn't have /profile endpoint yet
    // Once the API is updated, this fallback will no longer be needed
    return {
      status: 'success',
      data: {
        name: 'Carlos Cativo',
        title: 'Tech Lead / Full-Stack Engineer',
        yearsOfExperience: 9,
        location: 'San Salvador, El Salvador',
        summary:
          'Remote Tech Lead and Full-Stack Software Engineer with 9 years of experience building healthcare platforms, payment systems, and AI-powered products. Currently leading development at Blue Medical, I specialize in NestJS, Laravel, Python, and AI integration.',
        experience: [
          {
            company: 'Blue Medical Guatemala',
            role: 'Tech Lead / Full-Stack Engineer',
            period: 'Apr 2022 - Present',
            location: 'Guatemala (Remote)',
          },
          {
            company: 'OrangeSoftCo (Publimovil Regional)',
            role: 'Back End Developer',
            period: 'Sep 2020 - Apr 2022',
            location: 'San Marcos, El Salvador',
          },
          {
            company: 'Mussol',
            role: 'Senior Developer',
            period: 'Apr 2017 - Sep 2020',
            location: 'El Salvador',
          },
        ],
        skills: [
          { name: 'Languages', skills: [
            { name: 'TypeScript', level: 'advanced' },
            { name: 'PHP', level: 'advanced' },
            { name: 'SQL', level: 'advanced' },
            { name: 'Python', level: 'intermediate' },
            { name: 'JavaScript', level: 'advanced' },
            { name: 'Bash', level: 'intermediate' },
          ]},
          { name: 'Backend', skills: [
            { name: 'NestJS', level: 'advanced' },
            { name: 'Laravel', level: 'advanced' },
            { name: 'FastAPI', level: 'intermediate' },
          ]},
          { name: 'Frontend', skills: [
            { name: 'Vue / Nuxt', level: 'advanced' },
            { name: 'TailwindCSS', level: 'advanced' },
            { name: 'Angular', level: 'intermediate' },
          ]},
          { name: 'Databases', skills: [
            { name: 'PostgreSQL', level: 'advanced' },
            { name: 'MySQL', level: 'advanced' },
            { name: 'Redis', level: 'intermediate' },
            { name: 'Meilisearch', level: 'intermediate' },
          ]},
          { name: 'AI / ML', skills: [
            { name: 'Anthropic Claude API', level: 'advanced' },
            { name: 'ElevenLabs ConvAI', level: 'advanced' },
            { name: 'OpenAI API', level: 'intermediate' },
            { name: 'n8n', level: 'intermediate' },
          ]},
          { name: 'Infrastructure', skills: [
            { name: 'Docker', level: 'advanced' },
            { name: 'GitHub Actions', level: 'advanced' },
            { name: 'AWS (S3, ECR, EC2)', level: 'intermediate' },
            { name: 'Traefik', level: 'intermediate' },
          ]},
        ],
        differentiators: [
          'AI + Backend Hybrid — Not just calling APIs — designing multi-agent systems with validation, retry logic, and deterministic safeguards.',
          'Payment & Invoicing — Domain expertise in ISO 8583, SOAP integrations, tokenization, electronic invoicing (FEL), SAP.',
          'Healthcare Domain — Medication subscription platforms, patient scheduling, insurance authorization, ERP integration.',
          'Full Product Ownership — Built entire microservices from scratch — payment service, invoice service — not just feature work.',
          'Infrastructure & Self-Hosting — Runs production infrastructure on own domain — Traefik, Prometheus, mail server, monitoring.',
          'Security-Conscious — Conducts security audits, identifies OWASP vulnerabilities, implements proper auth patterns.',
        ],
        github: 'https://github.com/cativo23',
        linkedin: 'https://linkedin.com/in/cativo23',
        website: 'https://cativo.dev',
      },
    };
  }
});
