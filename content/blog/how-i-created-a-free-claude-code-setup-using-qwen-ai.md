---
title: "How I Created a Free Claude Code Setup Using Qwen AI"
created_at: 2026-02-02T15:00:00Z
updated_at: 2026-02-02T19:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "How I routed Claude Code through Qwen's free API using claude-code-router, with multi-distro support and OAuth authentication."
tags: ["ai", "claude-code", "qwen", "open-source", "linux"]
---

I love using Claude Code, but like many developers, I was concerned about API costs piling up during daily development. Then I discovered that Qwen AI offers a generous free tier: 2,000 requests per day. The question was: could I use Claude Code's excellent interface with Qwen's free API?

The answer turned out to be yes — with a clever middleware called **claude-code-router**.

## The Discovery: claude-code-router

While researching ways to route Claude Code to different providers, I stumbled upon [`claude-code-router`](https://www.npmjs.com/package/@musistudio/claude-code-router) by [@musistudio](https://github.com/musistudio). This tool acts as a local proxy that sits between the Claude CLI and any OpenAI-compatible API endpoint.

**The architecture is brilliant in its simplicity:**

```
Claude Code CLI → claude-code-router :3456 → Qwen API → Responses → Claude Code CLI
```

By setting `ANTHROPIC_BASE_URL` to point to localhost (where the router runs), Claude Code unknowingly sends all its requests to the router, which then forwards them to whatever provider you've configured — in this case, Qwen's API.

## The Challenge: Making It Easy

While the router worked, setting it up manually was tedious and error-prone. I needed to support:

- **Arch Linux**: For my personal development environment
- **Ubuntu (WSL)**: For my work laptop
- **Debian and Fedora**: For other developers

### The Setup Requirements

1. Install the right packages for my Linux distribution
2. Authenticate with Qwen's OAuth system
3. Extract the OAuth token from JSON files
4. Generate a proper router configuration
5. Set up environment variables
6. Handle platform-specific quirks

## Building the Solution

### Architecture: Modular Shell Scripts

I created a modular structure that separates concerns:

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

### OAuth Token Management

Qwen uses OAuth 2.0. The `qwen` CLI handles the authentication flow, storing credentials in `~/.qwen/oauth_creds.json`. My script:

1. Checks if credentials exist
2. If not, prompts the user to run `qwen` → `/auth` → authenticate in browser
3. Extracts the `access_token` from the JSON file
4. Validates the token is present and non-empty

**Security note**: The script sets `chmod 600` on credential files to prevent unauthorized access.

### Environment Variables

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:3456"
export ANTHROPIC_AUTH_TOKEN="dummy-token"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC="1"
```

### The Transformer Plugin

The router supports **transformers** — middleware that can modify requests and responses in flight. I created a custom Qwen transformer to solve a critical issue: web search didn't work when using Claude CLI with Qwen.

The problem was that Qwen models expect tools in `snake_case` format (`web_search`), but Claude CLI sends them in `PascalCase` (`WebSearch`). The transformer bridges this gap by renaming tools in both directions.

## Lessons Learned

1. **Heredocs for Configuration** — Using bash heredocs to generate config files is cleaner than string concatenation
2. **JSON Escaping Matters** — OAuth tokens can contain special characters
3. **Platform Differences Are Real** — What works on Ubuntu may not work on Arch
4. **User Experience Is King** — Clear progress messages reduce support burden
5. **Security By Default** — All credential files set to `chmod 600`

## Conclusion

By combining claude-code-router with Qwen's generous free tier, I created a setup that gives developers a free, production-ready AI coding assistant. The entire setup takes less than 5 minutes and works across major Linux distributions.

All the code is open source at [github.com/cativo23/qwen-claude-setup](https://github.com/cativo23/qwen-claude-setup).
