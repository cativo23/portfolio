---
title: "Nova ID - Day 1: Starting the Zero Trust Journey"
created_at: 2026-01-15T09:00:00Z
updated_at: 2026-01-15T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 1 of building Nova ID — a Zero Trust identity system using the Ory Stack. Architecture decisions, why Zero Trust, and initial planning."
tags: ["zero-trust", "ory", "identity", "architecture", "nova-id"]
---

We're building an identity system. Not just any identity system — a **Zero Trust** identity system. Why? Because traditional security models are broken.

## What We're Building

Nova ID — a complete identity and access management system using the Ory Stack. The goal is to have something production-ready that demonstrates how to do identity management right.

## Why Zero Trust?

I've seen too many systems where once you're inside the network, you have access to everything. That's a security nightmare. Zero Trust says "never trust, always verify" — and that's exactly what we need.

The idea is simple: every request goes through a gateway (Oathkeeper), gets authenticated, and then gets routed to the right service with identity headers. No service-to-service trust. Everything is verified.

## Choosing the Stack

We're going with the **Ory Stack**:
- **Kratos** for identity management
- **Hydra** for OAuth2/OIDC
- **Keto** for permissions
- **Oathkeeper** as the gateway

Why Ory? It's open source, well-documented, and used in production by real companies. Plus, it's composable — we can use what we need.

## The Pattern: Identity-Aware Proxy

```
User → Oathkeeper (authenticates) → Backend Service (gets identity via headers)
```

Backend services never authenticate directly. They just trust the headers that Oathkeeper injects.

## What I'm Worried About

1. **Path stripping** — How do we handle routing through Oathkeeper?
2. **CORS** — This is always a pain
3. **Email delivery** — Need to test this somehow
4. **Permissions** — How do we design a good RBAC system?

But hey, that's why we're building this — to figure it out.
