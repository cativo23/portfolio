---
title: "Nova ID - Day 18: Proving Zero Trust Actually Works"
created_at: 2026-02-01T09:00:00Z
updated_at: 2026-02-01T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "The final day. I replaced the dummy API with a NestJS backend that can ONLY reach Ory services through Oathkeeper. Network isolation, real integration, and the moment I proved Zero Trust actually works."
tags: ["nestjs", "zero-trust", "ory", "api", "nova-id"]
---

This is it. Day 18. The last day of Nova ID.

Yesterday I [tore the monolithic frontend into three separate apps](/blog/nova-id-day-17-tearing-the-frontend-apart). That was the architectural foundation. Today is the payoff -- building a real API that proves the entire Zero Trust architecture actually works. Not a dummy endpoint that returns fake data. A production-ready NestJS API that talks to Kratos, Keto, and Hydra. And here's the kicker: it can *only* reach them through Oathkeeper.

Let me say that again because it matters. The API physically cannot talk to the Ory services directly. Different Docker networks. Total isolation. The only path is through the gateway.

Eighteen days of work, and this is the moment where it either holds together or falls apart.

## The Architecture That Makes It All Work

```
External Network: Frontends + API (cannot access Ory services directly)
                        ↓
                Oathkeeper (gateway, both networks)
                        ↓
Ory Stack Network (Private): Kratos, Keto, Hydra, PostgreSQL
```

**Key**: API CANNOT directly reach Kratos, Keto, or Hydra.

Look at that diagram. Really look at it. The API lives on the external network with the frontends. Kratos, Keto, Hydra, and PostgreSQL live on a private network. Oathkeeper sits on *both* networks -- it's the bridge, the bouncer, the only way through.

This isn't "trust the API to call the right endpoints." This is "the API literally has no choice." It goes through Oathkeeper or it goes nowhere. That's Zero Trust. Not as a policy document. As a network reality.

## Plugging Into Every Ory Service

### Kratos -- "Who Are You?"

The API verifies users exist and are active, and it retrieves full identity data from the Kratos Admin API. All through Oathkeeper. The API can't sneak a direct request to Kratos even if I wanted it to -- the network won't allow it.

This is the identity backbone. Every request that hits the API starts here: is this a real user? Are they active? What's their identity data? Oathkeeper validates the session and forwards the request with user context headers injected. The API picks it up and runs with it.

### Keto -- "What Can You Do?"

Permission checks. Rank membership. Hierarchy verification. All real-time, all through Oathkeeper.

Remember all those [permission struggles from Day 9-15](/blog/nova-id-day-9-15-seven-days-of-everything-breaking)? All that debugging, all those CORS nightmares and permission check failures? It all led here. The API queries Keto for fine-grained permissions, and it does it through the same gateway that handles everything else. Consistent. Verified. No backdoors.

### Hydra -- "Prove It"

OAuth2 token introspection. The API can validate access tokens, check expiration, and support client credentials grants for API keys. All through Oathkeeper, all on the external network.

This is what makes Nova ID more than a login system. Third-party apps can get OAuth2 tokens from Hydra and use them to hit the API. The API introspects those tokens through Oathkeeper to verify they're legit. It's the full OAuth2 flow, running through Zero Trust infrastructure.

## Two Authentication Paths, One Security Model

### Session-Based (Web Frontends)

1. User logs in → Kratos creates session
2. Frontend makes request → Oathkeeper validates session
3. Oathkeeper injects headers → API receives request
4. API verifies user in Kratos via Oathkeeper
5. API checks permissions in Keto via Oathkeeper

This is the flow for the three frontends I built [yesterday](/blog/nova-id-day-17-tearing-the-frontend-apart). Every step goes through Oathkeeper. The session gets validated, the headers get injected, the API verifies everything again on its end. Belt and suspenders. Trust nothing.

### OAuth2 Token-Based (Third-Party Apps)

1. Third-party app gets token → Hydra issues token
2. App makes request with Bearer token
3. API introspects token in Hydra via Oathkeeper
4. API verifies user in Kratos via Oathkeeper
5. API checks permissions in Keto via Oathkeeper

Same security model, different entry point. Whether you're a user clicking a button in the browser or a service making an API call with a Bearer token, you go through the same gauntlet. No shortcuts.

## The Moment of Truth: Does Zero Trust Actually Work?

This is my favorite part. After all the wiring, all the configuration, all the "please just work" moments -- I needed to prove that the network isolation was real. Not just "I configured it right." Actually, provably real.

```bash
# Test Direct Access (Should Fail)
docker exec nova-id-api-1 ping kratos
# Should fail - different networks

# Test Through Oathkeeper (Should Work)
docker exec nova-id-api-1 wget -O- http://oathkeeper:4455/health/alive
# Should work - same network
```

I ran the ping. It failed. The API container tried to reach Kratos and got *nothing*. No connection. No timeout waiting for a response. Just... nothing there. Different networks. The API doesn't even know Kratos exists at the network level.

Then I ran the wget through Oathkeeper. It worked. Clean response. The API can reach Oathkeeper, Oathkeeper can reach Kratos, but the API cannot skip the middleman.

I stared at my terminal for a solid ten seconds. Ping fails. Wget works. That's it. That's the whole thesis of this project in two commands. Zero Trust isn't a buzzword on a slide deck. It's a `ping` that gets no response and a `wget` that goes through the right door.

It actually fucking works.

## The End of the Road

Eighteen days. That's what it took to build a Zero Trust identity system from scratch.

I started on [Day 1](/blog/nova-id-day-1-why-traditional-security-is-bullshit) with an idea and a healthy amount of fear. I didn't know if the Ory stack would play nice together. I didn't know if Zero Trust was actually achievable with open-source tools or if it was just a concept that enterprise companies sold for six figures. I didn't know if I'd get stuck on Day 3 and abandon the whole thing.

I didn't get stuck on Day 3. I got stuck on [Day 9 through 15](/blog/nova-id-day-9-15-seven-days-of-everything-breaking) instead -- a solid week of email delivery nightmares, CSRF hell, CORS conflicts, and permission bugs that made me question my career choices. But I pushed through. Every problem had a solution, even when it took hours to find it.

And now here I am. Every request to the API verifies users in Kratos through Oathkeeper -- because it can't reach Kratos directly. Every permission check goes through Keto via Oathkeeper -- because it can't reach Keto directly. Every OAuth2 token gets introspected through Hydra via Oathkeeper -- because it can't reach Hydra directly. The network enforces what the architecture promises. Not through configuration files that someone might misconfigure. Through actual, physical network isolation.

This is what I wanted to build. Not a toy. Not a tutorial project. A real identity system where "Zero Trust" means something. Where the API doesn't just *choose* to go through the gateway -- it *has* to.

I learned more in these 18 days than I did in months of reading documentation. About Ory, about Docker networking, about OAuth2, about the difference between "I understand the concept" and "I can make it work." About the fact that the hard part of building systems isn't the code -- it's the debugging at 11pm when nothing makes sense and you're one misconfigured YAML file away from throwing your laptop out the window.

If you've been following along since Day 1 -- thank you. This was a hell of a ride. And if you're thinking about building something similar, do it. It's harder than it looks, it takes longer than you think, and it's worth every frustrating minute.

---

*This is the final post in my [Nova ID series](/blog/nova-id-day-1-why-traditional-security-is-bullshit) -- 18 days building a Zero Trust identity system from scratch with the Ory stack. The whole series starts [here](/blog/nova-id-day-1-why-traditional-security-is-bullshit). Got questions? Hit me up.*
