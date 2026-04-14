---
title: "Nova ID - Day 2-3: Setting Up the Infrastructure"
created_at: 2026-01-16T09:00:00Z
updated_at: 2026-01-17T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 2-3 of Nova ID — Docker Compose setup, database initialization, SMTP configuration, CORS headaches, and the first real challenges with Ory Stack."
tags: ["docker", "ory", "infrastructure", "nova-id", "debugging"]
---

Started with Docker Compose. Should be simple, right? Wrong.

## Docker Compose Hell

### Service Communication

I wanted services to communicate via Docker hostnames (`http://kratos:4433`), not localhost. This enforces Zero Trust — services can't be accessed directly from the host.

**Solution**: Oathkeeper routes to internal Docker hostnames. The gateway is the only thing exposed to the host. Everything else is internal.

### Database Initialization

Three separate databases:
- `kratos` for identity
- `hydra` for OAuth
- `keto` for permissions

**Why separate?** Isolation. If one service has issues, it doesn't affect the others. Plus, we can scale them independently.

### The Courier Worker Problem

Emails weren't sending. No errors, but no activity either.

**Discovery**: Kratos has a separate courier worker process. You need to run it with `--watch-courier` flag!

```yaml
command: serve -c /etc/config/kratos/kratos.config.yaml --dev --watch-courier
```

### The STARTTLS Problem

Mailpit doesn't support STARTTLS. The fix:

```yaml
courier:
  smtp:
    connection_uri: smtp://mailpit:1025/?disable_starttls=true
```

### The CORS Problem

Keto has CORS configuration. But in Zero Trust, only the gateway should handle CORS. Backend services shouldn't send CORS headers.

**Solution**: Remove the entire `cors:` section from the config. If the section doesn't exist, Keto won't send CORS headers.

### The Path Stripping Discovery

I was worried about path stripping. Oathkeeper needs to route `/kratos-public/self-service/login/api` to Kratos, but Kratos expects `/self-service/login/api`.

**Discovery**: Oathkeeper DOES support `strip_path` in access rules! No proxy services needed.

```yaml
- id: "keto-read"
  upstream:
    strip_path: "/keto/read"
    url: "http://keto:4466"
```

## What I Learned

1. Always check if a feature exists before building a workaround
2. CORS is still a pain, even in 2026
3. Email configuration is more complex than it should be
4. Docker Compose dependency management is clunky but works
