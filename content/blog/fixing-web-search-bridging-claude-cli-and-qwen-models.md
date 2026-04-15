---
title: "Fixing Web Search: Bridging Claude CLI and Qwen Models"
created_at: 2026-02-02T19:00:00Z
updated_at: 2026-02-02T19:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "How I discovered and fixed a tool naming incompatibility between Claude CLI and Qwen models using custom transformer middleware."
tags: ["ai", "middleware", "debugging", "qwen", "claude-code"]
---

When integrating the Qwen AI model with Anthropic's Claude Code CLI through the `claude-code-router`, we encountered a frustrating issue: **web search simply didn't work**. While the standalone `qwen` CLI could successfully access web search, the same queries through the `claude` CLI would return:

> "I don't have direct access to web search capabilities..."

Both CLIs were configured to use the same Qwen model through the same router. Why would one work and the other fail?

## The Investigation

### Initial Hypothesis

Our first thought was that this might be a tool availability issue — perhaps the `claude` CLI wasn't exposing the web search tool to the model. However, examining the router logs revealed something interesting: **the `WebSearch` tool was being sent to the Qwen API**, but the model simply wasn't using it.

### Testing Tool Naming Sensitivity

We created test scripts to directly query the Qwen API with different tool naming conventions:

```javascript
// Test 1: PascalCase (as sent by claude CLI)
tools: [{ function: { name: "WebSearch" } }]

// Test 2: snake_case (as used by qwen CLI)
tools: [{ function: { name: "web_search" } }]
```

**Result**: The Qwen model responded much more reliably when tools were named in `snake_case`. This was our first breakthrough.

### The System Prompt Confusion

Digging deeper, we discovered a second issue: the `claude` CLI identifies itself as "Claude Code" in its system prompt. This created cognitive dissonance for the Qwen model — it was being told it was Claude while actually being Qwen! This confusion likely contributed to the model's reluctance to use its own native capabilities.

## The Root Cause

1. **Tool Naming Convention**: Qwen models are trained to recognize tools in `snake_case` format (`web_search`), while the Claude CLI sends them in `PascalCase` (`WebSearch`).
2. **System Prompt Identity Crisis**: The Claude CLI's system prompt confused the Qwen model about its own capabilities.

## The Solution: A Custom Transformer

The `claude-code-router` architecture provided the perfect solution through its **transformer system** — middleware that can modify requests before they reach the API and responses before they return to the client.

### Request Transformation

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

### Response Transformation

```javascript
async transformResponseOut(res) {
    // Rename web_search → WebSearch (back to Claude's format)
    if (toolCall.function?.name === "web_search") {
        toolCall.function.name = "WebSearch";
    }
    return transformedResponse;
}
```

### Handling Streaming Responses

The transformer needed to handle both standard JSON responses and Server-Sent Events (SSE) streams. For streaming responses, we read chunks, parse SSE data events, detect tool calls in delta messages, rename `web_search` back to `WebSearch`, and re-encode the modified stream.

## Verification

Testing the fix:

```bash
$ claude -p "give me the latest laravel version"
```

**Success!** The model now recognizes the `web_search` tool, calls it with appropriate parameters, and returns results with proper citations.

## Key Takeaways

1. **Tool Naming Matters** — Different AI models have different training conventions
2. **System Prompts Have Power** — The way you describe a model to itself affects its behavior
3. **Middleware Patterns Work** — The transformer pattern provides a clean way to bridge incompatible systems
4. **Stream Processing Requires Care** — When working with SSE streams, preserve protocol integrity while modifying content

The fix is now part of version **1.0.3** of the `qwen-claude-setup` project, automatically deployed during installation.
