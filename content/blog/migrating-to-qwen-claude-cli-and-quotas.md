---
title: "Migrating to qwen-claude CLI & Navigating Qwen Quota Changes"
created_at: 2026-02-08T16:18:00Z
updated_at: 2026-02-08T16:18:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "How we refactored setup scripts into a professional CLI tool and dealt with Qwen's free tier quota reduction."
tags: ["cli", "qwen", "ai", "open-source", "quotas"]
---

We completely refactored the setup scripts into a professional CLI tool: `qwen-claude`.

## Why a CLI?

Managing multiple scripts (`install.sh`, `refresh.sh`, distro-specific scripts) was becoming cumbersome. The new `qwen-claude` tool unifies everything into a single command:

```bash
qwen-claude install   # Setup everything
qwen-claude refresh   # Update OAuth tokens & restart services
qwen-claude help      # Show usage
```

## The Qwen Quota "Nerf"

Recently, it seems Qwen has reduced the free tier limit significantly. Users (including myself) have started seeing `insufficient_quota` errors much faster than before.

> **Update:** The free quota has been officially reduced from 2,000 to **1,000 requests per day**.

### Symptoms

If you are using `portal.qwen.ai` (Bearer Token) and suddenly see this:

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Free allocated quota exceeded.",
    "type": "invalid_request_error"
  }
}
```

It means you've hit the daily cap.

### Alternatives

1. **Alibaba Model Studio (Free Tier)** — Generous free tier for new users (valid for 60-90 days)
2. **Paid API Key** — The paid API via `dashscope-intl.aliyuncs.com` is more stable with higher rate limits

## CLI Feature: Auto-Refresh

We added a `refresh` command to make life easier with these shorter-lived tokens:

```bash
qwen-claude refresh
```

This will:
1. Guide you to refresh your OAuth token
2. Update the configuration automatically
3. Restart the `claude-code-router` service

## Troubleshooting Updates

- **Fixed `install` command**: Corrected argument parsing
- **Fixed `setup.sh`**: Restored missing variable definitions
- **Automated Restart**: The tool now automatically restarts the router after installation and refreshes
- **Shifted Recommendation**: We now recommend the **Bearer Token (OAuth)** for personal use — 1,000 requests/day that **resets every day**
