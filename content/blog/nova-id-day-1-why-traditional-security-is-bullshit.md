---
title: "Nova ID - Day 1: Why Traditional Security Is Bullshit"
created_at: 2026-01-15T09:00:00Z
updated_at: 2026-01-15T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I decided to build a Zero Trust identity system from scratch using the Ory Stack. Here's the Day 1 brain dump — the architecture, the excitement, and the list of things that already scare me."
tags: ["zero-trust", "ory", "identity", "architecture", "nova-id"]
---

I'm building an identity system. Not a toy login page. Not a "just slap JWT on it" hack. A real, honest-to-god **Zero Trust** identity system. And I'm documenting every single day of it because I want to remember what it actually feels like when the excitement of "I have an idea" meets the reality of "oh shit, I have to build this now."

## Why Am I Doing This?

Because I've seen too many systems where once you're past the front door, you can walk into any room you want. You authenticate once, and then the entire network just... trusts you. That's not security. That's a locked front door with all the windows wide open.

Zero Trust flips that on its head. Never trust, always verify. Every request. Every time. No exceptions. It sounds paranoid, and honestly? It is. But after seeing what happens when systems don't do this, paranoid feels about right.

## What I'm Actually Building

Nova ID — a complete identity and access management system using the Ory Stack. The goal is something production-ready. Not a tutorial project. Not a proof of concept that lives in a README and never gets deployed. Something that actually demonstrates how to do identity management without cutting corners.

## Choosing the Stack

I'm going with the **Ory Stack**:
- **Kratos** for identity management
- **Hydra** for OAuth2/OIDC
- **Keto** for permissions
- **Oathkeeper** as the gateway

Why Ory? It's open source, it's composable, it's used in production by companies that actually give a shit about security. I looked at Keycloak (too monolithic), rolling my own (too stupid), and a bunch of SaaS options (too expensive for a learning project). Ory hit the sweet spot — powerful enough to be real, modular enough that I can understand each piece.

## The Pattern: Identity-Aware Proxy

The core idea is beautifully simple:

```
User → Oathkeeper (authenticates) → Backend Service (gets identity via headers)
```

Backend services never authenticate directly. They just trust the headers that Oathkeeper injects. The gateway is the bouncer. Everything behind it just reads the guest list the bouncer hands over. This means every service stays dumb and focused — no auth logic scattered across your codebase like confetti.

## What's Already Keeping Me Up at Night

Here's my honest worry list, Day 1:

1. **Path stripping** — Oathkeeper needs to route requests to different services. How the hell do I strip path prefixes cleanly? Do I need a whole separate proxy layer?
2. **CORS** — It's 2026 and CORS is still a pain in the ass. With a gateway architecture, who handles CORS? The gateway? The services? Both? Neither? I already know this is going to waste hours of my life.
3. **Email delivery** — Kratos sends verification emails. In a Docker Compose setup. With no real SMTP server. This has "3 hours of debugging" written all over it.
4. **Permissions** — How do I design an RBAC system that doesn't become a maintenance nightmare? I have ideas. They might be terrible.

That's the whole point though, right? I don't know the answers yet. If I did, there'd be nothing to write about. I'll figure it out as I go, and I'll tell you about every wrong turn along the way.

Day 1 is done. Architecture is planned. Worries are documented. Tomorrow I start setting up infrastructure and finding out how many of these worries are justified.

Spoiler: probably all of them.

---

*This is the first post in the Nova ID series — a Zero Trust identity system built in public. Next up: [Day 2-3](/blog/nova-id-day-2-3-docker-compose-hell), where Docker Compose immediately humbles me.*
