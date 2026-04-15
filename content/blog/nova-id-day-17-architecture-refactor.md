---
title: "Nova ID - Day 17: Architecture Refactor - Three Frontends, Zero Trust"
created_at: 2026-01-31T09:00:00Z
updated_at: 2026-01-31T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 17 of Nova ID — Refactoring from a single monolithic frontend to three separate frontend applications matching the ideal Zero Trust pattern."
tags: ["architecture", "zero-trust", "refactoring", "vue", "nova-id"]
---

Today we refactored the architecture to match the ideal Zero Trust pattern with **three separate frontend applications** instead of a single monolithic frontend.

## What Changed

### Before: Single Frontend
- One Vue.js application handling all functionality
- Mixed concerns: authentication, admin, and business logic in one app
- All routes accessible from a single entry point

### After: Three Separate Frontends

**Frontend #1: Self-Service UI** (Port 5173) — Authentication flows: login, registration, password recovery, profile settings, OAuth consent.

**Frontend #2: Admin Dashboard** (Port 5174) — User management, permission management, dashboard with session information, permission-based access control.

**Frontend #3: Test Application** (Port 5175) — Main business application with API integration.

## Oathkeeper Routing

Oathkeeper now routes requests based on path prefixes:

- `/auth/*` → `frontend-auth:5173` (Self-Service UI)
- `/admin/*` → `frontend-admin:5174` (Admin Dashboard)
- `/app/*` → `frontend-app:5175` (Test Application)
- `/api/*` → `api:8080` (Test API)

All routes go through Oathkeeper, which authenticates, authorizes, injects user context headers, and routes to the appropriate backend service.

## Benefits

1. **Separation of Concerns** — Authentication UI separate from admin functions, business logic isolated from management tools
2. **Security** — Admin dashboard requires authentication + permissions, each frontend has minimal surface area
3. **Scalability** — Can deploy frontends independently, different scaling requirements per frontend
4. **Development** — Teams can work on different frontends independently
5. **Zero Trust Compliance** — All traffic flows through Oathkeeper, no direct access to backend services

## Lessons Learned

1. **Architecture First** — Having a clear architecture diagram helped guide the refactor
2. **Incremental Changes** — Breaking it into three separate tasks made it manageable
3. **Shared Code** — Copying composables to each frontend works, but consider a shared package in the future
4. **Routing** — Oathkeeper path-based routing is clean and works well
5. **Port Management** — Using different ports for each frontend avoids conflicts
