---
title: "Killing My Own Project: Why I Archived qwen-claude-setup"
created_at: 2026-03-05T00:30:00Z
updated_at: 2026-03-05T00:30:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I built it, nursed it, refactored it twice, and then killed it. Here's why archiving your own project is sometimes the best thing you can do."
tags: ["ai", "docker", "infrastructure", "tooling", "open-source"]
---

If you've been following this series, you've watched the whole arc. I [built qwen-claude-setup from scratch](/blog/free-claude-code-routing-the-cli-through-qwens-free-tier) to route Claude Code through Qwen's free API. I [debugged an absurd casing bug and an AI identity crisis](/blog/qwen-was-having-an-identity-crisis) to get web search working. I [survived Qwen cutting their free tier in half](/blog/they-nerfed-the-free-tier) and refactored the whole thing into a proper CLI tool.

And then I archived it.

I killed my own project. The one I'd spent weeks on. The one I'd written three blog posts about. The one other developers were actually using.

It was the right call. Let me tell you why.

## The Limitations I Couldn't Ignore Anymore

Look, [qwen-claude-setup](https://github.com/cativo23/qwen-claude-setup) worked. It solved a real problem. But the more I used it, the more its cracks showed:

- **Single provider**: It only supported Qwen. When Qwen's daily cap hit (remember, it's only 1,000 now), I was done for the day. Just... done. Sitting there with a half-finished feature and no AI to help.
- **Manual everything**: Refreshing tokens, restarting the router, editing config files by hand. Even with the CLI refactor, there was still too much friction.
- **Fragile glue**: Shell scripts wrapping npm packages wrapping a JavaScript transformer — a Rube Goldberg machine of moving parts for what's essentially "proxy AI requests from A to B."

I kept having this thought: *what if I could just switch between models on the fly?* What if, when Qwen ran out, I could just... pick a different one? Without restarting anything, without editing any files, without breaking my flow?

That thought wouldn't leave me alone.

## Finding the Thing That Already Existed

Enter [CLIProxyAPI Dashboard](https://github.com/itsmylife44/cliproxyapi-dashboard).

The concept is similar — wrap CLI-based AI tools into OpenAI-compatible APIs. But the execution? On another level entirely. CLIProxyAPIPlus handles the core proxy with OAuth for multiple providers, and the Dashboard gives you a full web UI to manage everything.

**The key difference that made me rethink everything?** It's not just Qwen. It supports **Claude, Gemini, Codex, GitHub Copilot, Antigravity, Kimi, Qwen, and more** — all from a single interface.

I stared at the feature list for a solid five minutes. Then I looked at my shell scripts. Then back at the feature list. The feeling was something like finding out the elaborate bridge you hand-built already has a highway running next to it.

## My Setup Now

I'm running it locally with Docker. The setup was almost insultingly simple:

```bash
git clone https://github.com/itsmylife44/cliproxyapi-dashboard.git
cd cliproxyapi-dashboard
./setup-local.sh
```

Open `http://localhost:3000`, create an admin account, and you're in. That's it. No distro detection. No OAuth token extraction scripts. No transformer plugins. Just three commands and a browser.

I spent weeks building multi-distro support. This thing just uses Docker. I'm not going to lie — that stung a little.

### How I Actually Use It

The beauty is **model switching based on what I need**:

- **Daily coding tasks** → Qwen (free tier, 1,000 req/day)
- **Qwen quota exhausted** → Switch to Antigravity or Copilot
- **Complex architecture work** → Pick whichever model handles it best
- **Quick completions** → Copilot, since it's already paid for through work

No restarting services. No editing config files. No running `qwen-claude refresh`. Just pick the model from the dashboard or hit a different endpoint. The workflow I was fantasizing about? Someone already built it.

## The Comparison (Be Honest With Yourself)

| | qwen-claude-setup | CLIProxyAPI Dashboard |
|---|---|---|
| **Providers** | Qwen only | Qwen, Copilot, Antigravity, Claude, Gemini, and more |
| **Config** | JSON files + shell scripts | Web UI |
| **Token refresh** | CLI commands | One click in browser |
| **Quota visibility** | Manual script | Real-time dashboard |
| **Installation** | Distribution-specific scripts | `docker compose up` |
| **Model switching** | Edit config, restart router | Switch from the dashboard |

Every single row, the other tool wins. I'm not going to sugarcoat it. Looking at this table was a humbling experience.

## The Hard-Won Lessons

### 1. Don't reinvent the wheel

I spent weeks building shell scripts, transformer plugins, distro-specific installers, a CLI tool, bug fixes on top of bug fixes. A Docker-based solution with a web UI would have been the right answer from day one. But I didn't look hard enough before building. I was so excited about *making* something that I didn't stop to check if someone had already made it better.

This isn't a failure. I learned a ton. But next time, I'm spending an extra hour searching before I spend a week building.

### 2. Multi-provider is not optional

Betting your workflow on a single free tier is fragile as shit. I learned this when Qwen cut their quota, and I learned it again every time I hit the daily cap mid-session. Having fallbacks means I never hit a wall anymore. The AI might change models, but the work doesn't stop.

### 3. UIs beat config files (and I hate admitting it)

I'm a terminal person. I *like* config files. I like typing commands and feeling like a hacker. But managing OAuth tokens across multiple providers through a dashboard is just objectively better. It's faster. It's less error-prone. It's more maintainable. My terminal-purist ego took a hit on this one.

### 4. Know when to archive

This is the hardest one. It's tempting to keep maintaining your own thing. You built it. You understand it. You've written blog posts about it, for god's sake. But if someone else built a better solution, the smart move is to use it and move on. That's what open source is for — not every project needs to live forever.

Archiving qwen-claude-setup wasn't giving up. It was growing up.

## The End of the Line

There's no reason to maintain custom shell scripts when a well-built tool already exists. The old repo is archived — the code stays up for anyone curious about the journey, and honestly, as a record of what I learned along the way.

Four blog posts. Weeks of work. Shell scripts, transformers, CLI refactors, quota battles. And the final lesson is the simplest one: sometimes the best code you write is the code that teaches you enough to know when to stop writing it.

---

*This is the final post in the Qwen/Claude Code series. The journey started with [building the setup](/blog/free-claude-code-routing-the-cli-through-qwens-free-tier), continued through [debugging web search](/blog/qwen-was-having-an-identity-crisis) and [surviving quota changes](/blog/they-nerfed-the-free-tier), and ends here. Thanks for following along.*
