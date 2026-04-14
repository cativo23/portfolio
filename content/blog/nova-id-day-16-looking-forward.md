---
title: "Nova ID - Day 16: Looking Forward"
created_at: 2026-01-30T09:00:00Z
updated_at: 2026-01-30T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 16 of Nova ID — Production readiness assessment, roadmap, reflections on what we built and what's missing."
tags: ["retrospective", "roadmap", "zero-trust", "nova-id"]
---

We have a working Zero Trust identity system:

- Identity management (Kratos)
- OAuth2/OIDC provider (Hydra)
- Fine-grained permissions (Keto)
- API gateway (Oathkeeper)
- Modern frontend (Vue 3)
- RBAC with automatic permission resolution
- Professional UI with permission-based features

This is solid. It works. But is it production-ready?

## What's Missing

**Critical**: HTTPS/TLS, production database, production email service, secrets management, security headers, monitoring and logging.

**Important**: Backend API layer (frontend calls Ory services directly), rate limiting, session management improvements, backup and disaster recovery, performance optimization.

**Nice to Have**: MFA, social login, audit logging, user self-service features.

## The Reality Check

We built this for local development. It's not production-ready yet. But the architecture is solid. The foundation is there.

**What We Did Right**: Zero Trust architecture from the start, proper service isolation, RBAC with subject sets, clean separation of concerns.

**What Needs Work**: Security hardening, performance optimization, production deployment, feature completeness.

## Reflections

### What I Learned

1. **Zero Trust is the right approach** — It's more work upfront, but it's more secure
2. **Subject sets are powerful** — Automatic permission resolution is a game-changer
3. **CORS is still annoying** — But manageable if you understand it
4. **Documentation matters** — Writing this diary helped me understand what we built
5. **Problems are opportunities** — Every bug taught us something

### What I'd Do Differently

1. **Start with backend API layer** — Frontend calling Ory services directly works, but a backend layer would be cleaner
2. **More testing earlier** — We should have written tests as we went
3. **Better error handling** — Some error messages could be clearer
4. **Performance from the start** — We focused on functionality, but performance matters too
