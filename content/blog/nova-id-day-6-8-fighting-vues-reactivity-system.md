---
title: "Nova ID - Day 6-8: Fighting Vue's Reactivity System"
created_at: 2026-01-20T09:00:00Z
updated_at: 2026-01-22T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Vue 3 + Kratos UI nodes sounded clean on paper. Then form fields started clearing themselves mid-keystroke, and I lost three hours to Vue's reactivity system fighting me."
tags: ["vue", "frontend", "kratos", "nova-id", "debugging"]
---

After spending [Day 4-5 wrestling Keto into a working RBAC system](/blog/nova-id-day-4-5-when-a-general-gets-a-403), I figured the frontend would be a nice change of pace. Vue 3 + Vite. Should be straightforward, right?

Ha.

## The Setup

I'll give Vite this: it's fast. The dev server starts instantly. HMR actually works without randomly breaking. I spent some time wiring up Tailwind with Tokyo Night colors — dark background, high contrast, easy on the eyes during those inevitably long debugging sessions.

That was the last easy thing that happened for three days.

## Working with Kratos UI Nodes

Here's the deal with Kratos: it doesn't just give you a login form like a normal auth system. It returns forms as "UI nodes" — structured JSON blobs that describe what fields should be in the form. The idea is you render them dynamically. No hardcoding.

On paper? Pretty cool. In practice? The structure is verbose as hell. You need utility functions just to figure out what a node actually *is*. I ended up writing a whole set of helpers: `getNodeName()`, `getNodeType()`, `getNodeValue()`, `getNodeLabel()`, and a few more. Without them, every form component turns into a mess of nested property access that makes you question your career choices.

But once those helpers are in place, things start clicking. You can render login, registration, settings — all from the same component logic, just fed different node trees. That part is genuinely elegant.

## The Password Validation Requirement

Users wanted the whole experience:
- Password confirmation field
- Real-time validation (length, uppercase, lowercase, number, special char)
- Visual checklist that updates as you type
- Checkmark when passwords match

Fair enough. Created computed properties for the password rules and match checking. Users get immediate feedback as they type. This part was actually satisfying to build — the kind of frontend work that feels *useful* instead of just moving pixels around.

## The Form Field Clearing Nightmare

And then everything went sideways.

I'm typing a password. Mid-keystroke, the email field clears. The name field clears. The rank field — gone. I type in the email again. Start on the password. Everything clears again.

I stared at the screen for a solid minute, convinced I was losing my mind.

This went on for *hours*. I'd fix one thing, and another field would start blanking out. I'm adding `console.log` statements everywhere, watching values appear and vanish like some kind of cursed magic trick. I tried `v-model`, I tried direct binding, I tried `watch` — nothing. Every fix just moved the problem somewhere else.

**Root Cause**: Vue was re-rendering the entire form every time `node.attributes.value` changed. When I typed in a password field, it triggered a re-render. That re-render pulled fresh values from the Kratos nodes — which didn't have the values I'd been typing into the *other* fields, because those were only stored in the DOM, not in reactive state.

In other words: the UI was at war with itself. The Kratos nodes said "these fields are empty" and Vue said "yes sir" and wiped everything the user had typed.

**Solution**: Decouple form state from Kratos flow nodes entirely. Store all field values in a reactive object that Vue actually controls:

```javascript
const fieldValues = reactive({})

onMounted(() => {
  flow.value?.ui?.nodes?.forEach(node => {
    const name = getNodeName(node)
    fieldValues[name] = getNodeValue(node) || ''
  })
})
```

**Key Insight**: The nodes are for *submission* — that's the data Kratos needs back. But the form state is for the *UI* — that's what the user is interacting with. These are two different things and they need to live in two different places. Mixing them was the source of every weird bug in this form.

Three hours. Three hours of my life for what turned out to be a conceptual problem, not a code problem. I should've seen it sooner. I didn't.

## The Password Visibility Toggle Problem

Just when I thought I was done with form nightmares: clicking the eye icon to toggle password visibility cleared the password value.

Of course it did.

Same root cause, different flavor. Vue re-rendered the input when the `type` attribute changed from `password` to `text`. Re-render pulled the value from... you guessed it... the Kratos node, which had nothing.

**Solution**: Store the password value in a dedicated ref and bind the input to that instead of `getNodeValue(node)`. Same principle as above — own your form state, don't let Kratos own it for you.

## What I Learned

The technical takeaways are straightforward:

1. **Kratos UI nodes are powerful but verbose** — invest in good helper functions early, you'll thank yourself later
2. **Vue reactivity will bite you if you're sloppy about state ownership** — if you don't explicitly control where values live, Vue will make assumptions that ruin your day
3. **Form state and API state are not the same thing** — this one cost me three hours and I will never forget it
4. **Real-time validation is worth the effort** — users notice the polish, even if they can't articulate why
5. **Small UI details matter** — the password toggle, the validation checklist, these aren't features anyone puts on a roadmap, but they're the difference between "this feels janky" and "this feels solid"

The bigger lesson? Most of the hard bugs in frontend work aren't about code. They're about mental models. I had the wrong model of how data flowed through the form, and no amount of `console.log` was going to fix that. I had to step back, draw it out, and realize I was fighting the framework instead of working with it.

---

*Next up: [Day 9-15](/blog/nova-id-day-9-15-seven-days-of-everything-breaking) — where everything I thought was working decided to break simultaneously.*
