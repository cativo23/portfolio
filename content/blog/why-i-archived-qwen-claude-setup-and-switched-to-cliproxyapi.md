---
title: "Why I Archived qwen-claude-setup and Switched to CLIProxyAPI Dashboard"
created_at: 2026-03-05T00:30:00Z
updated_at: 2026-03-05T00:30:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Why I moved from custom shell scripts to a Docker-based multi-provider AI proxy dashboard with real-time quota tracking."
tags: ["ai", "docker", "infrastructure", "tooling", "open-source"]
---

If you've been following this blog, you know the journey. I built [qwen-claude-setup](https://github.com/cativo23/qwen-claude-setup) — a collection of shell scripts to route Claude Code through Qwen's free API using `claude-code-router`. It worked. It solved a real problem. But it had limitations:

- **Single provider**: It only supported Qwen. If Qwen's free tier hit its daily cap, you were done for the day.
- **Manual everything**: Refreshing tokens, restarting the router, editing config files by hand.
- **Fragile glue**: Shell scripts wrapping npm packages wrapping a JavaScript transformer — a lot of moving parts for what's essentially "proxy AI requests."

I kept thinking: *what if I could just switch between models on the fly?*

## The Discovery: CLIProxyAPI + Dashboard

Enter [CLIProxyAPI Dashboard](https://github.com/itsmylife44/cliproxyapi-dashboard).

The concept is similar in spirit — wrap CLI-based AI tools into OpenAI-compatible APIs — but the execution is on another level. CLIProxyAPIPlus is the core proxy that handles OAuth for multiple providers, and the Dashboard gives you a full web UI to manage everything.

**The key difference?** It's not just Qwen. It supports **Claude, Gemini, Codex, GitHub Copilot, Antigravity, Kimi, Qwen, and more** — all from a single interface.

## My Setup

I'm running it locally with Docker. The setup was absurdly simple:

```bash
git clone https://github.com/itsmylife44/cliproxyapi-dashboard.git
cd cliproxyapi-dashboard
./setup-local.sh
```

Open `http://localhost:3000`, create an admin account, and you're in the dashboard.

### How I Use It

The beauty is **model switching based on need**:

- **Daily coding tasks** → Qwen (free tier, 1,000 req/day)
- **Qwen quota exhausted** → Switch to Antigravity or Copilot
- **Complex architecture work** → Pick whichever model handles it best
- **Quick completions** → Copilot, since it's already paid for

No restarting services. No editing config files. Just pick the model from the dashboard or hit a different endpoint.

## What Makes It Better

| | qwen-claude-setup | CLIProxyAPI Dashboard |
|---|---|---|
| **Providers** | Qwen only | Qwen, Copilot, Antigravity, Claude, Gemini, and more |
| **Config** | JSON files + shell scripts | Web UI |
| **Token refresh** | CLI commands | One click in browser |
| **Quota visibility** | Manual script | Real-time dashboard |
| **Installation** | Distribution-specific scripts | `docker compose up` |
| **Model switching** | Edit config, restart router | Switch from the dashboard |

## Lessons Learned

1. **Don't reinvent the wheel** — I spent weeks building shell scripts, transformer plugins, and distro-specific installers. A Docker-based solution with a web UI would have been the right answer from day one.
2. **Multi-provider matters** — Betting on a single free tier is fragile. Having fallbacks means I never hit a wall mid-session.
3. **UIs beat config files** — I'm a terminal person. I *like* config files. But managing OAuth tokens across multiple providers through a dashboard is just objectively better.
4. **Know when to archive** — It's tempting to keep maintaining your own thing. But if someone else built a better solution, use it and move on. That's what open source is for.

There's no reason to maintain custom shell scripts when a well-built tool already exists. The old repo is archived — the code stays up for reference and anyone curious about the journey.
