---
title: "Nova ID - Day 17: Tearing the Frontend Apart"
created_at: 2026-01-31T09:00:00Z
updated_at: 2026-01-31T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I looked at my single monolithic frontend and realized it was a security liability disguised as convenience. So I tore it apart into three separate apps. Here's why and how."
tags: ["architecture", "zero-trust", "refactoring", "vue", "nova-id"]
---

Remember [yesterday's retrospective](/blog/nova-id-day-16-is-this-thing-production-ready-no)? Where I looked at what we'd built and tried to figure out what was missing? Yeah. One thing kept gnawing at me. The frontend.

One Vue.js application doing everything. Authentication flows, admin dashboard, business logic. All stuffed into a single app like a suitcase you sat on to close.

And I kept thinking about it. This thing handles login, registration, password recovery, user management, permission dashboards, AND the actual business application. All from one entry point. All sharing the same attack surface.

That's not Zero Trust. That's "trust this one giant app to handle everything correctly." I'd spent 16 days building a system where every backend request gets verified, every API call goes through Oathkeeper, every permission gets checked -- and then I'm serving it all from a single frontend that has access to everything? Fuck that.

## The "Aha" Moment

I went back and looked at the frontend I'd built during [Day 6-8](/blog/nova-id-day-6-8-fighting-vues-reactivity-system). It was good work. Solid Vue 3, clean composables, nice Tailwind styling. But it was designed as one app because that's how I started -- get it working first, worry about architecture later.

Well, "later" just showed up.

The moment it clicked was when I drew out the ideal architecture on paper. If Oathkeeper is the gateway, and every request goes through it, then why shouldn't the frontends be separated by concern? An admin dashboard shouldn't even *exist* in the same application as the login page. A user recovering their password shouldn't be loading code for permission management they'll never touch.

Separation of concerns. Not as a buzzword. As a security boundary.

## Three Apps. Three Purposes.

So I ripped it apart. One monolithic frontend became three:

**Frontend #1: Self-Service UI** (Port 5173) -- This is the authentication frontend. Login, registration, password recovery, profile settings, OAuth consent. That's it. If you're not authenticated yet, this is the only app you interact with.

**Frontend #2: Admin Dashboard** (Port 5174) -- User management, permission management, session dashboard. You don't get here without being authenticated AND having the right permissions. The app itself is a separate deployment -- there's no route in the auth UI that even points to it.

**Frontend #3: Test Application** (Port 5175) -- The main business application with API integration. This is where the actual product lives. Separate from auth, separate from admin.

Three apps. Three ports. Three separate concerns. Each one with the minimum surface area it needs to do its job.

## Oathkeeper Ties It All Together

Here's the beautiful part. Oathkeeper now routes based on path prefixes, and every single request -- whether it's going to the auth UI or the admin dashboard or the business app -- goes through the same gateway:

- `/auth/*` → `frontend-auth:5173` (Self-Service UI)
- `/admin/*` → `frontend-admin:5174` (Admin Dashboard)
- `/app/*` → `frontend-app:5175` (Test Application)
- `/api/*` → `api:8080` (Test API)

All routes go through Oathkeeper. It authenticates, authorizes, injects user context headers, and routes to the correct service. There's no sneaking around. No direct access. Want to hit the admin dashboard? Oathkeeper checks if you're allowed first.

This is what Zero Trust is supposed to look like. Not just on the backend. Everywhere.

## Why This Matters (Beyond "It's Cleaner")

Look, I could sell this as "separation of concerns" and leave it at that. But it's more than code organization.

Security gets real when each frontend has minimal surface area. The auth UI doesn't have admin code. The admin dashboard doesn't have business logic. If someone finds a vulnerability in one, they don't automatically get access to everything else. That matters.

Scalability stops being theoretical. The admin dashboard gets ten users. The business app gets ten thousand. Now I can scale them independently instead of scaling the entire monolith because one part is under load. Different requirements, different deployments.

Development becomes actually parallel. I could hand the auth UI to one developer and the admin dashboard to another, and they'd never step on each other's toes. No merge conflicts over shared route files. No "I broke the admin page by changing the login flow."

And the whole thing stays Zero Trust compliant. Every request, from every frontend, flows through Oathkeeper. No exceptions. No shortcuts.

## What I Learned

**Architecture first, always.** I should have drawn the diagram before I started coding in Day 6. But that's the thing about building something real -- you don't always know the right architecture until you've built the wrong one first. The [Day 16 retrospective](/blog/nova-id-day-16-is-this-thing-production-ready-no) forced me to step back and look at the big picture, and that's when the refactor became obvious.

**Incremental is the only sane way.** I didn't rewrite everything in one shot. I broke it into three separate tasks: extract the auth UI, extract the admin dashboard, extract the business app. Each one was a contained piece of work. Each one could be tested independently.

**Shared code is a trap (for now).** I copied the composables into each frontend. Yes, that means duplication. Yes, that means if I fix a bug in one, I need to fix it in three places. But right now, getting the architecture right matters more than DRY perfection. A shared package is a future problem for future me.

**Path-based routing through Oathkeeper is clean as hell.** Seriously. It just works. Each path prefix maps to a service, and Oathkeeper handles the rest. No complex nginx configs, no routing gymnastics. Just clean, declarative routing through the security gateway.

Tomorrow I'm building the real API -- a NestJS backend that actually consumes the Ory stack through Oathkeeper. That's the final piece. The thing that proves this whole architecture actually works end to end.

---

*This is part of my [Nova ID series](/blog/nova-id-day-1-why-traditional-security-is-bullshit) -- building a Zero Trust identity system from scratch. Got questions about the architecture? Hit me up.*
