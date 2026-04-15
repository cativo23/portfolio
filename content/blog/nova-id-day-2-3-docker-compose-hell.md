---
title: "Nova ID - Day 2-3: Docker Compose Hell"
created_at: 2026-01-16T09:00:00Z
updated_at: 2026-01-17T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Two days of wrestling Docker Compose, debugging phantom emails, decoding CORS nonsense, and discovering that Oathkeeper can actually do the thing I was about to build from scratch."
tags: ["docker", "ory", "infrastructure", "nova-id", "debugging"]
---

After the [planning high of Day 1](/blog/nova-id-day-1-why-traditional-security-is-bullshit), reality hit. Hard. I sat down to "just set up Docker Compose" and what followed was two days of the kind of debugging that makes you question your career choices.

## Docker Compose Hell

### Service Communication

First decision: services talk to each other via Docker hostnames (`http://kratos:4433`), not localhost. This isn't just preference — it enforces Zero Trust at the network level. If you can't hit Kratos directly from your browser, you *have* to go through Oathkeeper. The gateway is the only thing exposed to the host. Everything else is locked inside the Docker network.

This sounds clean on paper. In practice, it means every misconfigured URL gives you a connection refused error with zero helpful context. Fun.

### Database Initialization

Three separate databases:
- `kratos` for identity
- `hydra` for OAuth
- `keto` for permissions

Why separate? Isolation. If Kratos shits the bed, Keto and Hydra keep running. Plus you can scale them independently later. It's a little more setup upfront, but the kind of decision that future-you thanks past-you for.

### The Courier Worker Problem

This one drove me insane. I had email delivery configured. SMTP pointed at Mailpit. Everything looked correct. I trigger a registration, expecting a verification email to show up in Mailpit.

Nothing. No email. No error. No log entry. Just... silence.

I spent an embarrassing amount of time checking SMTP settings, restarting containers, staring at config files like they'd confess if I looked hard enough. Turns out, Kratos has a **separate courier worker process** for sending emails. If you don't tell it to watch the courier queue, it just... doesn't send anything. Silently. No warning. Nothing.

The fix is one flag:

```yaml
command: serve -c /etc/config/kratos/kratos.config.yaml --dev --watch-courier
```

One. Flag. Hours of my life. `--watch-courier`. I want those hours back.

### The STARTTLS Problem

Right after fixing the courier, emails still weren't going through. Now I was getting STARTTLS errors. Mailpit — which is a dev tool for catching emails locally — doesn't support STARTTLS. Because why would it? It's a development tool running on your laptop.

```yaml
courier:
  smtp:
    connection_uri: smtp://mailpit:1025/?disable_starttls=true
```

Two email problems. Two completely different causes. Neither of them obvious from the error messages. This is infrastructure work in a nutshell.

### The CORS Problem

Remember how I said CORS was going to waste hours of my life? I was right.

Here's the thing about Zero Trust architecture: only the gateway should handle CORS. Backend services shouldn't send CORS headers because they shouldn't be accessible from the browser directly. But Keto ships with CORS configuration built in. So when a request goes through Oathkeeper (which handles CORS) and then hits Keto (which *also* sends CORS headers), the browser gets confused by duplicate headers and everything breaks.

The solution is stupidly simple once you understand the problem: rip out the entire `cors:` section from Keto's config. If the section doesn't exist, Keto won't send CORS headers, and the gateway handles it all. Took me way too long to figure out that the fix was *removing* configuration, not adding more of it.

### The Path Stripping Discovery

This was my biggest worry from [Day 1](/blog/nova-id-day-1-why-traditional-security-is-bullshit). Oathkeeper needs to route `/kratos-public/self-service/login/api` to Kratos, but Kratos expects `/self-service/login/api`. I was mentally preparing to build a custom proxy layer to strip path prefixes.

Then I actually read the Oathkeeper docs. Like, *really* read them.

Oathkeeper supports `strip_path` natively. Right there in the access rules. No proxy layer needed. No middleware. No custom code. Just:

```yaml
- id: "keto-read"
  upstream:
    strip_path: "/keto/read"
    url: "http://keto:4466"
```

I almost built an entire service to solve a problem that a config option already handles. Always — *always* — check if the tool already does what you need before building a workaround. I swear this lesson will save you more time than any design pattern ever will.

## What Two Days of Infrastructure Taught Me

1. **Read the docs before building workarounds.** Oathkeeper's `strip_path` was right there the whole time. I just assumed it couldn't do what I needed.
2. **CORS is still a pain in the ass, even in 2026.** The trick in Zero Trust is knowing that *only* your gateway should handle it.
3. **Email configuration has more moving parts than it should.** A missing `--watch-courier` flag cost me hours, and STARTTLS compatibility isn't something you think about until it bites you.
4. **Silent failures are the worst kind of failures.** Kratos not sending emails without any error or log is the kind of thing that makes you distrust every "it's working" message from every system forever.

Two days in. Infrastructure is up. Emails work. CORS is tamed. And I have a healthy new distrust for silent defaults.

---

*This is part 2 of the Nova ID series. Next up: [Day 4-5](/blog/nova-id-day-4-5-when-a-general-gets-a-403), where I build a military rank system and discover that a General can't actually do anything.*
