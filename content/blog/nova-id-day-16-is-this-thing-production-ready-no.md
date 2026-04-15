---
title: "Nova ID - Day 16: Is This Thing Production-Ready? (No.)"
created_at: 2026-01-30T09:00:00Z
updated_at: 2026-01-30T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Sixteen days in. The system works. But 'works' and 'production-ready' are very different words, and I'm finally honest about the gap between them."
tags: ["retrospective", "roadmap", "zero-trust", "nova-id"]
---

Sixteen days. That's what it took.

From [Day 1's architecture sketch](/blog/nova-id-day-1-why-traditional-security-is-bullshit), through [infrastructure hell](/blog/nova-id-day-2-3-docker-compose-hell), [the RBAC rabbit hole](/blog/nova-id-day-4-5-when-a-general-gets-a-403), [Vue fighting me at every turn](/blog/nova-id-day-6-8-fighting-vues-reactivity-system), and [seven straight days of bugs](/blog/nova-id-day-9-15-seven-days-of-everything-breaking) — I have a working Zero Trust identity system:

- Identity management (Kratos)
- OAuth2/OIDC provider (Hydra)
- Fine-grained permissions (Keto)
- API gateway (Oathkeeper)
- Modern frontend (Vue 3)
- RBAC with automatic permission resolution
- Professional UI with permission-based features

It works. I can log in. I can manage users. Permissions resolve correctly through subject sets. The gateway authenticates every request. The architecture is sound.

But let me be honest about something.

## What's Missing

This thing is not production-ready. Not even close. And pretending otherwise would be bullshit.

**Critical gaps** — the stuff that would get you fired if you shipped without it: HTTPS/TLS (everything's running over plain HTTP right now), production database (we're on dev configs), production email service (Mailpit is great for dev, terrible for real users), secrets management (credentials are in config files, which... yeah), security headers, monitoring and logging.

**Important gaps** — the stuff that would make your life miserable within a week: There's no backend API layer. The frontend calls Ory services directly through Oathkeeper. It works, but it means business logic lives in Vue components where it has no business being. Rate limiting doesn't exist. Session management could be better. There's no backup strategy. No disaster recovery plan. Performance hasn't been tested under any kind of real load.

**Nice to have** — the stuff you'd want before calling it "complete": MFA, social login, audit logging, user self-service features.

That's a long list. I know.

## The Reality Check

Here's what I keep reminding myself: I built this for local development. It's a learning project. The goal was never to ship it to production tomorrow — it was to understand how Zero Trust identity systems work, end to end, by building one from scratch.

And on that metric? I succeeded. I understand things now that I couldn't have learned from reading docs alone. The CSRF behavior, the subtleties of Keto's permission model, the way CORS cascades through a gateway architecture — this stuff only clicks when you've debugged it yourself at 1am.

**What I did right**: Zero Trust architecture from the start, not bolted on after. Proper service isolation — every service has its own database, its own config, its own failure domain. RBAC with subject sets instead of direct permission grants. Clean separation of concerns across the Ory stack.

**What needs work**: Basically everything in the "what's missing" section above. But the foundation is solid. The architecture decisions are sound. Hardening it for production would be a lot of work, but it wouldn't require rethinking the fundamentals.

## Reflections

### What I Learned

1. **Zero Trust is the right approach** — it's significantly more work upfront. Every request going through a gateway, every service isolated, every permission check explicit. But the security model is so much cleaner than the alternative. Traditional "trust the internal network" architectures are a ticking time bomb, and building Nova ID convinced me of that more than any blog post or conference talk ever could.

2. **Subject sets are a game-changer** — Before Keto, I would've built RBAC with a permissions table and a bunch of JOINs. Subject sets are fundamentally different. Automatic permission resolution, hierarchical roles that just *work*, rank changes that propagate instantly. This is how permissions should be modeled.

3. **CORS is still annoying** — I've been building web apps for years and CORS still finds new ways to waste my time. But after this project, I finally feel like I *understand* it instead of just copy-pasting Stack Overflow answers until the errors go away.

4. **Writing this diary helped me build better** — Sounds cheesy, but it's true. Having to explain what I did and why forced me to actually think about my decisions instead of just vibing through them. Several times I started writing a post and realized "wait, that approach doesn't make sense" before I'd even committed the code.

5. **Every bug is a lesson, even when it doesn't feel like one** — The form field clearing nightmare from Day 6-8. The password reset that didn't reset. The CSRF chaos. In the moment, each one felt like wasted time. Looking back, each one taught me something I'll carry to every future project.

### What I'd Do Differently

1. **Start with a backend API layer** — This is the big one. Having the frontend call Ory services directly through Oathkeeper was expedient, but it put business logic in the wrong place. A thin backend layer between the frontend and Ory services would have been cleaner from the start. I knew this was the right approach. I skipped it to move faster. Classic trade-off, classic regret.

2. **Write tests as I go** — I wrote exactly zero automated tests during these sixteen days. Every time something broke, I tested manually. Click, check, refresh, repeat. It worked for a solo project, but it was slow and error-prone. If I'd had even basic integration tests, the Day 9-15 debugging marathon would have been shorter. Probably significantly shorter.

3. **Better error handling from day one** — Some of my error messages are just the raw Kratos/Keto responses passed to the user. That's lazy. Users don't know what "CSRF token invalid" means. They shouldn't have to. I should have built a proper error translation layer early instead of treating it as a "nice to have."

4. **Think about performance earlier** — I focused purely on functionality. "Make it work, then make it fast." That's the right priority, but I didn't even *measure* performance. I have no idea how this system behaves under load. No benchmarks. No profiling. For a learning project, that's fine. For anything else, it's negligent.

## The Honest Summary

I built a thing. It works. It's not done. There are gaps I'm not proud of and shortcuts I took that I'd take back if I could.

But I understand Zero Trust identity systems now. Not the blog-post-summary version — the real version. The one where CORS breaks at 11pm and your password reset silently does nothing and your own code violates the security model you spent two weeks implementing.

That understanding is worth more than a polished demo that I don't actually understand under the hood. At least, that's what I tell myself.

---

*This was Part 6 of the Nova ID series. The journey isn't over — there's architecture to refactor and Ory integrations to deepen. But for now, I'm going to close my laptop and stare at a wall for a while.*
