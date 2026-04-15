---
title: "My Server Was a Security Dumpster Fire"
created_at: 2026-03-21T12:46:00Z
updated_at: 2026-03-21T12:46:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I audited my home server and found the Docker socket wide open, default credentials in production, and debug logs screaming into the void. Here's how I fixed all of it without losing sleep."
tags: ["traefik", "docker", "security", "infrastructure", "self-hosting"]
---

I looked at my home server — the one I call my "space server," the one I'd been running for months, the one I was genuinely proud of — and I realized it was a security dumpster fire.

Not in a dramatic, "hackers are in your system right now" way. In the quieter, worse way. The kind where everything works fine, you feel good about yourself, and then one afternoon you actually read the `docker-compose.yml` and your stomach drops. The kind of insecure where you've been lucky, not safe.

Let me walk you through my shame.

## What Was Running

My server was a single box running Docker Compose with a handful of services:
- **Traefik** (v3.6) as the reverse proxy and Let's Encrypt certificate resolver
- **Grafana & Prometheus** for monitoring
- **Dozzle** for container logs
- **Uptime Kuma** for status monitoring
- Several custom portfolio APIs

Sounds reasonable. Professional, even. Let me tell you what was actually happening under the hood.

## The Confession

I audited the existing configuration and found eight things that made me want to go back in time and slap myself. Here they are, in order of increasing embarrassment:

**Traefik's dashboard was just... open.** Port `8080` mapped directly to the host. No auth. No routing rules. Just the full Traefik dashboard, exposed to the internet, like leaving your house keys taped to the front door with a sign that says "come in." Anyone who guessed the port could see my entire routing configuration.

**Prometheus was public too.** Port `9090`, no authentication, broadcasting every metric my server collected to anyone who cared to look. CPU usage, memory, request counts — a reconnaissance goldmine. I might as well have emailed my server specs to strangers.

**Grafana was running with `admin:admin`.** Default credentials. In production. On a public-facing server. I don't even have an excuse for this one. I just... never changed it. The kind of oversight that's so basic it's almost impressive. You know that meme about the password being "password"? That was me, except it was worse because I knew better.

**No HTTP to HTTPS redirect.** Traffic hitting port 80 stayed on port 80. I had Let's Encrypt certificates and wasn't even forcing people to use them. Like buying a deadbolt and leaving it unlocked.

**No security headers.** No HSTS. No X-Frame-Options. No XSS protection. The browser had zero guidance on how to handle my content securely. Every response was basically saying "do whatever you want, I trust you completely," which is a terrible thing to say to the internet.

**Traefik's metrics and ping endpoints were public.** Internal health checks and metrics, exposed on the same entrypoint as my actual services. More attack surface, zero benefit.

**Debug logging in production.** Traefik was set to `DEBUG` log level. On a production server. Every request, every header, every routing decision — all of it being logged in excruciating detail. Performance hit, disk usage, and a potential information leak all wrapped into one bad config line.

And then there was the big one.

**Containers were mounting `/var/run/docker.sock` directly.** If you don't know why this is terrifying, let me explain: the Docker socket is root-equivalent access to the host. Any container with the socket mounted can create new containers, mount the host filesystem, read your secrets, modify other containers — it can do literally anything. If someone compromises Traefik or Dozzle, they don't just own the container. They own the entire server. Every container. Every volume. Every secret. The game is over.

I'd been running like this for months. Months. Everything worked perfectly. The monitoring was great. The dashboards were pretty. And the whole thing was one compromised container away from total loss.

## Fixing It Without Breaking Everything

I pulled the configuration down to my local machine, initialized a Git repo, and decided to fix each problem as an isolated, atomic commit. One fix per commit. If something broke, I'd know exactly which change caused it.

### HTTP to HTTPS Redirection

Updated the Traefik `web` entrypoint to automatically redirect all traffic to HTTPS. This is one line of configuration that should have been there from day one. Every tutorial mentions it. I just... skipped it, somehow. Shit happens.

### Closing the Open Ports

Removed the `8080:8080` port mapping from Traefik and `9090:9090` from Prometheus. Both services are now only accessible via their Traefik subdomains, protected by Let's Encrypt TLS and Basic Authentication. You know, like they should have been from the start.

### Actually Securing Credentials

Replaced the hardcoded `admin:admin` Grafana credentials with environment variables loaded from a `.env` file (added to `.gitignore`). Not rocket science. Not even intermediate science. Just basic "don't put passwords in your compose file" hygiene that I apparently skipped.

### Isolating Internal Endpoints

Created dedicated internal entrypoints for Traefik's metrics and health check. They're no longer reachable from the public internet. The ping endpoint exists so my monitoring can check if Traefik is alive, not so the entire internet can.

### Security Headers

Added a `security-headers` middleware in Traefik's dynamic configuration to enforce HSTS, prevent clickjacking, and enable XSS filtering. The kind of thing that takes five minutes to configure and protects against an embarrassing number of attacks.

### The Crown Jewel: Docker Socket Proxy

This was the real fix. The one that actually mattered. I introduced [Tecnativa's Docker Socket Proxy](https://github.com/Tecnativa/docker-socket-proxy) — a purpose-built firewall for the Docker API. Instead of mounting the raw socket, containers now connect to the proxy via TCP. The proxy only allows read-only access to specific endpoints: containers, networks, services, swarm, tasks. That's it. No creating containers. No mounting volumes. No reading secrets.

Traefik and Dozzle now talk to the proxy instead of the socket. If either one gets compromised, the attacker gets read-only access to container metadata. Not great, but a hell of a lot better than root access to the entire host.

This single change reduced the blast radius from "total server compromise" to "they can see your container names." I should have done it first. I should have done it before anything else was running.

## Deploying Without Losing Everything

Getting these changes onto the production server required some care. I had Let's Encrypt certificates in `acme.json` and Grafana data that I couldn't afford to lose. Here's what I did:

1. **Full backup** of the existing directory on the server — because I'm not a complete idiot, just a partial one
2. **`docker compose down`** across all stacks
3. **Moved `acme.json`** to a safe location outside the project directory — those certificates took time to issue
4. **Transferred the hardened config** via `scp`
5. **Restored `acme.json`** with correct permissions (`600`) — Let's Encrypt certificates with wrong permissions is its own nightmare
6. **Created the `.env`** on the server with production secrets
7. **`docker compose up -d`** and held my breath

### The "Oh Shit" Moment

It was almost clean. Almost. But after fixing a typo in my `.env` and running `scp -r` a second time to push the corrected files, Traefik started serving its default self-signed certificate instead of my Let's Encrypt cert.

I stared at the browser warning for a solid minute before it clicked.

When I ran `scp -r` the second time, it replaced the host directory. But the Traefik container was already running with a bind mount to the *inode* of the original directory. The host directory was new. The container's mount was still pointing at the old inode — which no longer existed in the filesystem namespace. The bind mount was literally mounted to nothing. Traefik couldn't see `acme.json` anymore, so it fell back to its self-signed cert.

The fix was embarrassingly simple: `docker restart traefik`. Forces the container to remount the path using the new inode. Thirty seconds of panic, one command, everything back to normal.

But that's the thing about bind mounts — they bind to inodes, not paths. Replace the directory and the mount goes stale. It's not a bug. It's exactly how Linux mount namespaces work. And it will absolutely blindside you at the worst possible moment if you don't know about it.

## What I Learned

My server is actually secure now. The attack surface is smaller. Traffic is encrypted by default. The Docker daemon is behind a proxy. Everything is version-controlled with a clean Git history. I can look at the configuration without wincing.

But here's the real lesson: I ran an insecure server for months and nothing bad happened. That's not a success story — that's survivorship bias. The absence of a breach is not evidence of security. It's evidence of luck. And luck runs out.

If you're running a home server right now, go look at your `docker-compose.yml`. Check if you're mounting the Docker socket. Check if you have default credentials anywhere. Check if your monitoring ports are exposed. You probably have at least one of these problems. I had all of them.

Fix it before your luck runs out too.

---

*The Docker socket proxy alone is worth the entire migration. If you only do one thing after reading this, do that.*
