---
title: "Migrating and Securing My Space Server Infrastructure"
created_at: 2026-03-21T12:46:00Z
updated_at: 2026-03-21T12:46:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "A step-by-step account of auditing and hardening my self-hosted Docker server with Traefik, Docker Socket Proxy, and zero-downtime deployment."
tags: ["traefik", "docker", "security", "infrastructure", "self-hosting"]
---

Recently, I decided to take a hard look at my personal home server infrastructure (which I call my "space server"). It's a single server running a mix of Docker containers, orchestrated by Traefik as a reverse proxy.

While it was functional, I realized there were several security gaps and best practices I had overlooked during the initial setup. This post details the step-by-step process I took to replicate the infrastructure locally, apply atomic security fixes, and safely deploy the hardened version back to production with zero data loss.

## The Starting Point

My server was running several services via Docker Compose:
- **Traefik** (v3.6) as the reverse proxy and Let's Encrypt certificate resolver
- **Grafana & Prometheus** for monitoring
- **Dozzle** for container logs
- **Uptime Kuma** for status monitoring
- Several custom portfolio APIs

### Identifying the Weaknesses

Before making any changes, I audited the existing configuration. Here's what I found:

1. **Exposed Dashboard Port**: Traefik's port `8080` was mapped directly to the host, bypassing secure routing rules
2. **Exposed Metrics**: Prometheus port `9090` was publicly exposed without authentication
3. **Hardcoded Credentials**: Grafana was running with default `admin:admin` credentials
4. **No HTTP to HTTPS Redirect**: Traffic hitting port `80` was not automatically redirected to `443`
5. **Direct Docker Socket Mounts**: Containers mounting `/var/run/docker.sock` directly — root-equivalent access to the host
6. **Public Traefik Metrics & Ping**: Internal endpoints exposed on the public entrypoint
7. **Missing Security Headers**: No HSTS, X-Frame-Options, or XSS protection
8. **Noisy Logs**: Traefik was set to `DEBUG` log level in production

## The Plan: Atomic Changes

To fix this safely, I pulled the configuration down to my local machine and initialized a Git repository. I then applied each fix as an isolated, atomic commit.

### 1. HTTP to HTTPS Redirection

Updated the Traefik `web` entrypoint to automatically redirect all traffic to HTTPS.

### 2. Closing Exposed Ports

Removed the `8080:8080` port mapping from Traefik and `9090:9090` from Prometheus. Both services are now only accessible via their Traefik subdomains, protected by Let's Encrypt TLS and Basic Authentication.

### 3. Securing Credentials with .env

Replaced hardcoded Grafana credentials with environment variables loaded from a `.env` file (added to `.gitignore`).

### 4. Isolating Internal Endpoints

Created dedicated internal entrypoints for Traefik's metrics and health check (ping) — no longer public.

### 5. Implementing Security Headers

Added a `security-headers` middleware in Traefik's dynamic configuration to enforce HSTS, prevent clickjacking, and enable XSS filtering.

### 6. The Crown Jewel: Docker Socket Proxy

Mounting the Docker socket directly is dangerous. To fix this, I introduced [Tecnativa's Docker Socket Proxy](https://github.com/Tecnativa/docker-socket-proxy).

It acts as a firewall for the Docker API. I configured it to only allow read-only access to specific endpoints (containers, networks, services, swarm, tasks). Then updated Traefik and Dozzle to connect to the proxy via TCP instead of mounting the socket.

## The Deployment Strategy

Deploying these changes to production required care to avoid downtime or losing Let's Encrypt certificates and Grafana data.

1. **Full Backup** — Created a complete backup of the existing directory on the server
2. **Spin Down** — Ran `docker compose down` for all stacks
3. **Preserve State** — Moved `acme.json` to a safe location outside the project directory
4. **Replace Code** — Transferred the new, hardened configuration via `scp`
5. **Restore State** — Moved `acme.json` back with correct permissions (`600`)
6. **Secret Injection** — Created the `.env` file on the server with production secrets
7. **Spin Up** — Ran `docker compose up -d` across all stacks

### A Small Hiccup with Docker Bind Mounts

During the deployment, I ran into an interesting edge case. After fixing a typo in my `.env` and transferring updated files via `scp`, Traefik was serving its default self-signed certificate instead of my Let's Encrypt cert.

**The Root Cause**: When I ran `scp -r` the second time, it overwrote the host directory. However, the Traefik container was already running and had a bind mount to the *inode* of the original directory. When the host directory was replaced, the container's mount became detached.

**The Fix**: A simple `docker restart traefik` forced the container to remount the path using the new inode.

## Conclusion

With these changes, my space server is now significantly more secure. The attack surface is reduced, traffic is encrypted by default, the Docker daemon is protected by a proxy, and the infrastructure is now version-controlled with a clean Git history.
