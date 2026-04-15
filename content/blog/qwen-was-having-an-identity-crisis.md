---
title: "Qwen Was Having an Identity Crisis (And Breaking Web Search)"
created_at: 2026-02-02T19:00:00Z
updated_at: 2026-02-02T19:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Qwen could search the web just fine — until I ran it through Claude Code. Turns out the fix was a casing bug and an existential crisis."
tags: ["ai", "middleware", "debugging", "qwen", "claude-code"]
---

Right after getting the Qwen setup working ([see my previous post](/blog/free-claude-code-routing-the-cli-through-qwens-free-tier)), I hit another wall.

Web search was broken. Completely, silently broken.

When I used the standalone `qwen` CLI and asked it to search the web, it worked perfectly. But the exact same query through the `claude` CLI — same model, same router, same everything — gave me this:

> "I don't have direct access to web search capabilities..."

Bullshit you don't. You literally just did it five seconds ago through a different CLI. Same brain, different front door. What the hell?

## The Detective Work

### First Theory: Wrong, But Reasonable

My first thought was that the `claude` CLI wasn't exposing the web search tool to the model. Made sense, right? Maybe Claude Code just doesn't pass that tool along.

Wrong.

I dug into the router logs and there it was — the `WebSearch` tool was absolutely being sent to the Qwen API. The model was receiving the tool. It just... wasn't using it. Like handing someone a perfectly good screwdriver and watching them try to use their fingernails instead.

### The Casing Clue

I started writing test scripts to hit the Qwen API directly. One with PascalCase tool names (the way Claude sends them), one with snake_case (the way Qwen's own CLI does it):

```javascript
// Test 1: PascalCase (as sent by claude CLI)
tools: [{ function: { name: "WebSearch" } }]

// Test 2: snake_case (as used by qwen CLI)
tools: [{ function: { name: "web_search" } }]
```

**Guess which one worked.**

The snake_case version. Every time. Reliably. The PascalCase version? The model would just... pretend the tool didn't exist. Like a cat ignoring you when you call its name.

That was my first breakthrough. Qwen was trained on `snake_case` tool names. When it sees `WebSearch`, it doesn't recognize it as something it can use. It's the software equivalent of speaking Spanish to someone who only understands Portuguese — close enough to be confusing, different enough to not work.

### The Existential Crisis (No, Really)

But the casing fix alone wasn't enough. I kept digging and found something that genuinely made me laugh out loud.

The `claude` CLI identifies itself as "Claude Code" in its system prompt. So picture this: Qwen, a model made by Alibaba, receiving a system prompt that says "You are Claude." The model was having a goddamn identity crisis. It was being told it was Claude while actually being Qwen, and this confusion was making it hesitant to use its own native capabilities.

Qwen was essentially thinking: "Well, I'm Claude apparently, and I don't know if Claude has web search, so... I guess I don't have web search?"

I cannot make this shit up.

## The Root Cause (Two Bugs For the Price of One)

1. **Tool Naming Convention**: Qwen models are trained to recognize tools in `snake_case` format (`web_search`), while the Claude CLI sends them in `PascalCase` (`WebSearch`). Qwen just ignores tools it doesn't recognize by name.
2. **System Prompt Identity Crisis**: The Claude CLI's system prompt tells the model "You are Claude Code," which confused Qwen about what capabilities it actually has. An AI having an existential crisis because another AI told it who it was. We're living in the future.

## The Fix: A Transformer That Translates

The `claude-code-router` has a transformer system — middleware that can modify requests before they hit the API and responses before they come back. It was the perfect tool for the job.

### Requests Going Out

```javascript
async transformRequestIn(req) {
    // 1. Rename WebSearch → web_search
    if (Array.isArray(req.tools)) {
        req.tools = req.tools.map(tool => {
            if (tool.function?.name === "WebSearch") {
                return {
                    ...tool,
                    function: { ...tool.function, name: "web_search" }
                };
            }
            return tool;
        });
    }
    // 2. Add helpful reminder to system prompt
    const reminder = "\n[System Reminder]: You have access to a `web_search` tool.";
    // Inject into system messages...
    return req;
}
```

### Responses Coming Back

```javascript
async transformResponseOut(res) {
    // Rename web_search → WebSearch (back to Claude's format)
    if (toolCall.function?.name === "web_search") {
        toolCall.function.name = "WebSearch";
    }
    return transformedResponse;
}
```

The request transformer renames `WebSearch` to `web_search` before Qwen sees it, and adds a gentle reminder that the tool exists. The response transformer does the reverse — renames `web_search` back to `WebSearch` before Claude Code sees the response. Neither side knows the other exists. Everybody's happy.

### The Streaming Headache

Of course it couldn't be that simple. The transformer also needed to handle Server-Sent Events (SSE) streams — the way most AI APIs send back responses in real time. For streaming, I had to read chunks, parse SSE data events, detect tool calls buried in delta messages, rename `web_search` back to `WebSearch`, and re-encode the whole thing without breaking the stream protocol.

It was fiddly as hell but it worked.

## The Moment of Truth

```bash
$ claude -p "give me the latest laravel version"
```

And there it was. The model recognized `web_search`, called it with proper parameters, came back with actual results and proper citations. I might have fist-pumped. Alone. In my office. At midnight.

Don't judge me.

## What This Taught Me

1. **Tool naming matters more than you'd think** — Different AI models have different training conventions. Something as dumb as casing can completely break tool discovery.
2. **System prompts have real power** — The way you describe a model to itself actually changes its behavior. Tell Qwen it's Claude, and it starts doubting its own capabilities. That's wild.
3. **Middleware patterns are underrated** — The transformer approach gave me a clean way to bridge two incompatible systems without modifying either one. Both sides think they're talking to their native format.
4. **Stream processing will humble you** — When you're modifying SSE streams on the fly, one wrong byte and the whole thing falls apart. Respect the protocol.

The fix shipped as version **1.0.3** of the `qwen-claude-setup` project and gets deployed automatically during installation. If you're using the setup from [the previous post](/blog/free-claude-code-routing-the-cli-through-qwens-free-tier), you already have it.
