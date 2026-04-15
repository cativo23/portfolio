---
title: "They Nerfed the Free Tier: Building a CLI Before the Quota Ran Out"
created_at: 2026-02-08T16:18:00Z
updated_at: 2026-02-08T16:18:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Qwen cut their free tier in half overnight. I found out the hard way, then turned my messy scripts into a real CLI tool."
tags: ["cli", "qwen", "ai", "open-source", "quotas"]
---

If you've been following this series — from [building the initial Qwen setup](/blog/free-claude-code-routing-the-cli-through-qwens-free-tier) to [debugging the web search fiasco](/blog/qwen-was-having-an-identity-crisis) — you know I'd been running Claude Code through Qwen's free tier and feeling pretty good about it.

Then Qwen pulled the rug.

## The Quota Nerf

I was mid-session, deep in a refactor, in the zone. You know that feeling where your brain and the AI are in sync and code is just flowing? Yeah. That got interrupted by this:

```json
{
  "error": {
    "code": "insufficient_quota",
    "message": "Free allocated quota exceeded.",
    "type": "invalid_request_error"
  }
}
```

I checked the time. It was barely afternoon. I'd been working for maybe four hours. There was no way I'd burned through 2,000 requests already.

Turns out, I hadn't. Because it wasn't 2,000 anymore.

> **Qwen quietly reduced the free tier from 2,000 to 1,000 requests per day.**

One thousand. Half of what it was. No announcement I could find, no migration period, no heads up. Just — boom, you're done for the day. Thanks for playing.

I'm not going to pretend I wasn't pissed. I'd built an entire toolchain around a 2,000 request daily limit. I'd told other developers about it. I'd written a whole blog post about it. And now the foundation had shifted under my feet.

This is why you don't build your workflow on someone else's free tier without a backup plan. Lesson learned the hard way.

### If You're Hitting This

If you're using `portal.qwen.ai` with a Bearer Token and you suddenly start seeing `insufficient_quota` errors way earlier than expected — this is why. The cap is 1,000 now. It resets daily, but that's a lot less runway than it used to be.

### The Alternatives

1. **Alibaba Model Studio (Free Tier)** — Generous free tier for new users, valid for 60-90 days. Decent option if you're just getting started.
2. **Paid API Key** — The paid API via `dashscope-intl.aliyuncs.com` is more stable with higher rate limits. If this is a tool you rely on daily, it might be worth the investment.

Neither option felt great. But at least there were options.

## Growing Up: From Scripts to a Real CLI

The quota drama forced me to look at my project with fresh eyes. And honestly? The codebase was a mess. I had `install.sh` over here, `refresh.sh` over there, distro-specific scripts scattered around, and every time something needed to change, I was editing three different files and hoping I didn't break something.

It was the kind of code you write when you're just trying to make something work and "I'll clean it up later." Spoiler: "later" had arrived.

So I refactored the whole thing into a proper CLI tool: `qwen-claude`.

```bash
qwen-claude install   # Setup everything
qwen-claude refresh   # Update OAuth tokens & restart services
qwen-claude help      # Show usage
```

One command. One entry point. No more hunting through directories for the right script. No more remembering which script does what. It felt like going from a pile of loose wires to an actual circuit board.

### The Refresh Command

With shorter-lived tokens and the reduced quota, refreshing credentials became something I needed to do more often. The new `refresh` command handles it cleanly:

```bash
qwen-claude refresh
```

This does three things:
1. Walks you through refreshing your OAuth token
2. Updates the configuration automatically
3. Restarts the `claude-code-router` service

Before this, refreshing meant manually editing config files, extracting tokens from JSON, and restarting services by hand. I was doing this often enough that it was driving me insane. Automating it felt like taking off shoes that were two sizes too small.

## The Bug Fixes Nobody Talks About

While I was refactoring, I found some embarrassing bugs:

- **The `install` command had broken argument parsing** — It worked if you ran it the "right" way, but any variation would silently fail. The kind of bug that only surfaces when someone who isn't you tries to use your tool.
- **`setup.sh` was missing variable definitions** — Copy-paste error from when I split things into modules. Worked on my machine because the variables were in my environment. Didn't work anywhere else. Classic.
- **No automatic restart** — After installing or refreshing, you had to manually restart the router. Why? No good reason. I just forgot to add it. Now it restarts automatically.

### Where I Landed

After everything — the quota cut, the refactor, the bug fixes — my recommendation shifted. I now suggest the **Bearer Token (OAuth)** approach for personal use. It gives you 1,000 requests per day that reset every day. Not as generous as it used to be, but it's consistent, it's free, and it's enough for most development sessions if you're not going crazy with it.

Is 1,000 enough? Some days, barely. Other days, plenty. It depends on what you're building and how much you're leaning on the AI. But it's free, and free is free.

The quota reduction stung. But it forced me to build a better tool and think more carefully about how I use my requests. Sometimes the thing that pisses you off the most is the thing that makes you level up.
