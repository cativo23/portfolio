---
title: "Nova ID - Day 18: Full Ory Stack Integration - Zero Trust API"
created_at: 2026-02-01T09:00:00Z
updated_at: 2026-02-01T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 18 of Nova ID — Replaced dummy API with a NestJS API that actively consumes Ory services through Oathkeeper only, proving Zero Trust actually works."
tags: ["nestjs", "zero-trust", "ory", "api", "nova-id"]
---

Today we replaced the dummy Python API with a **production-ready NestJS API** that **actively consumes** Ory services (Kratos, Keto, Hydra) through **Oathkeeper only** (Zero Trust). The API is on an **external network** and **cannot directly access** Ory services.

## Architecture (Zero Trust)

```
External Network: Frontends + API (cannot access Ory services directly)
                        ↓
                Oathkeeper (gateway, both networks)
                        ↓
Ory Stack Network (Private): Kratos, Keto, Hydra, PostgreSQL
```

**Key**: API CANNOT directly reach Kratos, Keto, or Hydra.

## Ory Service Integration

### Kratos Integration
- API verifies user exists and is active via **Oathkeeper → Kratos**
- Retrieves full identity from Kratos Admin API via **Oathkeeper**
- API physically cannot reach Kratos directly (different network)

### Keto Integration
- API checks rank membership via **Oathkeeper → Keto**
- Verifies rank hierarchy via **Oathkeeper**
- Real-time permission queries via **Oathkeeper**

### Hydra Integration
- API introspects OAuth2 access tokens via **Oathkeeper → Hydra**
- Validates token expiration via **Oathkeeper**
- Supports client credentials grant (API keys)

## Authentication Methods

### Session-Based (Web Frontends)
1. User logs in → Kratos creates session
2. Frontend makes request → Oathkeeper validates session
3. Oathkeeper injects headers → API receives request
4. API verifies user in Kratos via Oathkeeper
5. API checks permissions in Keto via Oathkeeper

### OAuth2 Token-Based (Third-Party Apps)
1. Third-party app gets token → Hydra issues token
2. App makes request with Bearer token
3. API introspects token in Hydra via Oathkeeper
4. API verifies user in Kratos via Oathkeeper
5. API checks permissions in Keto via Oathkeeper

## Zero Trust Verification

To verify Zero Trust is working:

```bash
# Test Direct Access (Should Fail)
docker exec nova-id-api-1 ping kratos
# Should fail - different networks

# Test Through Oathkeeper (Should Work)
docker exec nova-id-api-1 wget -O- http://oathkeeper:4455/health/alive
# Should work - same network
```

## Conclusion

Every request verifies users in Kratos via Oathkeeper (cannot reach directly), checks permissions in Keto via Oathkeeper (cannot reach directly), and supports OAuth2 tokens via Hydra via Oathkeeper (cannot reach directly).

**This proves Zero Trust works** — API is on external network and cannot directly access Ory services.
