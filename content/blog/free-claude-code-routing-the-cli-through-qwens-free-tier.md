---
title: "Free Claude Code: Routing the CLI Through Qwen's Free Tier"
created_at: 2026-02-02T15:00:00Z
updated_at: 2026-02-02T19:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I love Claude Code but I'm not paying those API bills. Here's how I frankenstein'd it onto Qwen's free tier and lived to tell the story."
tags: ["ai", "claude-code", "qwen", "open-source", "linux"]
---

I love Claude Code. Like, genuinely love it. The interface, the way it reasons, the way it just *gets* what you're trying to do. But every time I looked at the API pricing, I felt my wallet flinch. Daily development means hundreds of requests. That adds up fast.

Then I found out Qwen AI gives you 2,000 free requests per day.

Two thousand. Per day. For free.

My brain immediately went: "What if I could use Claude Code's interface but route everything through Qwen?" It sounded hacky. It sounded like something that would break in seventeen different ways. I had to try it.

## Finding Buried Treasure: claude-code-router

I was deep in a rabbit hole of GitHub repos and npm packages, searching for ways to make Claude Code talk to other providers. Most of what I found was garbage. Half-baked scripts. Abandoned repos with last commits from months ago. You know the type.

Then I stumbled on [`claude-code-router`](https://www.npmjs.com/package/@musistudio/claude-code-router) by [@musistudio](https://github.com/musistudio). I read the README. I read it again. I thought: "There's no way this actually works."

It did.

**The architecture is stupidly simple, and I mean that as the highest compliment:**

```
Claude Code CLI → claude-code-router :3456 → Qwen API → Responses → Claude Code CLI
```

You point `ANTHROPIC_BASE_URL` at localhost where the router runs, and Claude Code has no idea it's not talking to Anthropic anymore. It just sends requests to the router, the router forwards them to Qwen, and Qwen sends back responses. Claude Code is none the wiser.

I felt like I'd found a cheat code. The kind of thing that makes you wonder why more people aren't doing this.

## The Part Where Everything Got Annoying

So the router worked. Great. But setting it up manually was a pain in the ass. I run Arch on my personal machine, Ubuntu on my work laptop through WSL, and I wanted this to work for other devs too — Debian, Fedora, whatever.

Each distro has its own package manager, its own quirks, its own ways of making your life difficult. What works on Ubuntu absolutely does not just work on Arch. I learned that the hard way. Multiple times.

Here's what I needed to handle for every single distro:

1. Install the right packages (and they're named differently everywhere, because of course they are)
2. Authenticate with Qwen's OAuth system
3. Extract the OAuth token from JSON files
4. Generate a proper router configuration
5. Set up environment variables
6. Deal with platform-specific bullshit

## Building Something That Doesn't Suck

### The Modular Approach

I went with a modular shell script structure. Not because I'm some architecture astronaut, but because having one giant script that tries to handle four different Linux distros is a recipe for losing your mind:

```
qwen-claude-setup/
├── install.sh              # Entry point - detects distro
├── common.sh               # Shared functions used by all distros
├── distros/
│   ├── ubuntu.sh
│   ├── debian.sh
│   ├── arch.sh
│   └── fedora.sh
├── plugins/
│   └── qwen-transformer.js
└── scripts/
    └── uninstall.sh
```

Each distro gets its own file. Common logic stays shared. When Arch does something weird (and it always does something weird), I fix it in one place without breaking Ubuntu.

### The OAuth Dance

Qwen uses OAuth 2.0, which means you can't just slap an API key in a config file and call it a day. The `qwen` CLI handles the auth flow and stores credentials in `~/.qwen/oauth_creds.json`. My script:

1. Checks if credentials exist
2. If not, tells you to run `qwen` → `/auth` → authenticate in your browser
3. Pulls the `access_token` from the JSON file
4. Makes sure it's actually there and not empty (because I've been burned by that before)

**One thing I got right from the start**: `chmod 600` on all credential files. I've seen too many repos where tokens just sit there readable by everyone. Don't be that developer.

### The Environment Variables

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:3456"
export ANTHROPIC_AUTH_TOKEN="dummy-token"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
```

Yeah, that `dummy-token` is real. Claude Code needs *something* there, but since the router handles the actual auth, it doesn't matter what it is. It felt wrong the first time I set it. It works though.

### The Transformer Plugin

Here's where things got interesting. The router supports **transformers** — middleware that can modify requests and responses on the fly. I built a custom Qwen transformer because web search was completely broken when using Claude CLI with Qwen.

The short version: Qwen expects tool names in `snake_case` (`web_search`), but Claude CLI sends them in `PascalCase` (`WebSearch`). The transformer sits in the middle, renaming tools in both directions. I'll tell the full debugging story in my [next post about fixing web search](/blog/qwen-was-having-an-identity-crisis) — it's a good one.

## What I Actually Learned

1. **Heredocs for config generation** — Using bash heredocs to generate config files is way cleaner than string concatenation. I wish I'd known this years ago.
2. **JSON escaping will bite you** — OAuth tokens can contain special characters that will absolutely destroy your config if you don't escape them properly. Ask me how I know.
3. **Platform differences are real** — "It works on my machine" hits different when you're supporting four distros.
4. **Clear progress messages save your sanity** — When I added proper output messages to the install script, the number of "it's broken" reports dropped to almost zero.
5. **Security by default, always** — `chmod 600` on credential files. Every time. No exceptions.

## The Result

By combining claude-code-router with Qwen's generous free tier, I ended up with a free, fully functional AI coding assistant that runs through Claude Code's interface. The entire setup takes less than 5 minutes and works across Arch, Ubuntu, Debian, and Fedora.

Is it a hack? Yeah, kind of. Does it work? Absolutely.

All the code is open source at [github.com/cativo23/qwen-claude-setup](https://github.com/cativo23/qwen-claude-setup). Go break it. Let me know what happens.
