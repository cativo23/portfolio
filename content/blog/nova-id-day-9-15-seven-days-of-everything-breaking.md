---
title: "Nova ID - Day 9-15: Seven Days of Everything Breaking"
created_at: 2026-01-23T09:00:00Z
updated_at: 2026-01-29T23:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Seven days. Seven completely different problems. CSRF nightmares, a password reset that didn't actually reset, and the discovery that my frontend was violating its own security model."
tags: ["debugging", "zero-trust", "ory", "nova-id", "lessons-learned"]
---

Seven days. Seven different problems. Each one more annoying than the last.

If you've been following along since [Day 1](/blog/nova-id-day-1-why-traditional-security-is-bullshit), you know this project has a way of humbling me right when I think I've got it figured out. [Day 6-8's frontend work](/blog/nova-id-day-6-8-fighting-vues-reactivity-system) ended on a high note — forms working, validation smooth, Vue playing nice. I thought the hard part was over.

I was so wrong.

## Day 10: The Email Saga Continues

Remember the email delivery headaches from [Day 2-3](/blog/nova-id-day-2-3-docker-compose-hell)? The courier worker flag, the STARTTLS thing? Yeah, I thought that was done. Turns out there were more layers to that onion.

Users couldn't recover passwords. I'm watching the logs, emails are supposedly sending, but nothing arrives. I'm testing with a random address — nothing. Testing with another random address — nothing. I'm starting to wonder if Mailpit just decided to stop working.

Then I try an *existing* user. Email sent instantly.

Turns out Kratos won't send recovery emails to non-existent addresses. On purpose. It's an anti-enumeration security feature — if an attacker tries to figure out which emails are registered by requesting password resets, they get silence either way. Smart security. Terrible debugging experience. I burned an embarrassing amount of time on this before reading the docs more carefully.

## Day 11: The CSRF Nightmare

This one made me want to throw my laptop.

I was mixing API and browser flows. Kratos has two types:
- **Browser flows**: `/self-service/login/browser` — for web apps, handles cookies and CSRF automatically
- **API flows**: `/self-service/login/api` — for mobile apps, programmatic access, no CSRF

You cannot mix them. I was using browser flows for some things and API flows for others, and the CSRF tokens were losing their minds. Random 403s. Forms that worked once and then didn't. The kind of intermittent bug that makes you question reality.

The fix was conceptually simple: pick one. We're building a web app, so browser flows. All of them. Consistently. But finding that this was the problem? That took me a full day of reading Kratos source code and forum posts, because the error messages don't say "hey, you're mixing flow types, dummy." They just say "CSRF token invalid" and leave you to figure out why.

## Day 12: The Password Reset That Didn't Reset

"I changed my password, but I can't log in with the new one. The old password still works."

Read that again. The user went through the entire password change flow. Got the success message. Tried to log in with the new password. Rejected. Tried the old one. Worked fine.

The password reset *didn't actually reset*.

I spent a while staring at network requests before I found it. We were sending *all* form fields when submitting the settings page — email, name, rank, *and* the password. Kratos determines which flow type to execute based on which fields are present in the submission. When it sees profile fields alongside password fields, it gets confused about what you're actually trying to do.

**Fix**: Only send password-related fields when changing the password:

```javascript
const passwordFormData = new FormData()
passwordFormData.set('method', 'password')
passwordFormData.set('password', passwordValue.value)
passwordFormData.set('password_confirm', passwordConfirm.value)
passwordFormData.set('csrf_token', csrfToken)
// Don't include profile fields!
```

This is the kind of bug that seems obvious in retrospect. Of course you shouldn't send profile data with a password change request. But when you've got one unified settings page with all the fields right there, it's the most natural thing in the world to just submit everything. Kratos doesn't warn you. It just silently ignores the password change. Lovely.

## Day 13-14: Old Friends, New Contexts

Remember the [403 permission check problem from Day 4-5](/blog/nova-id-day-4-5-when-a-general-gets-a-403)? Where Keto returns HTTP 403 with `{"allowed": false}` and I was treating it as an error instead of parsing the response? And the [rank sync issue](/blog/nova-id-day-4-5-when-a-general-gets-a-403) where a user had the right rank in Kratos but wasn't assigned to it in Keto?

Both of those bit me again. Different contexts, same root causes. As I built out more features that relied on permission checks, I kept hitting edge cases where the original fixes from Day 4-5 needed to be applied more broadly. The `syncRankPermissions()` function I wrote back then became even more critical — turns out there were more code paths that could create users or update ranks without triggering the sync.

I won't rehash the solutions — go read the [Day 4-5 post](/blog/nova-id-day-4-5-when-a-general-gets-a-403) if you need the details. The lesson here was different: **when you find a bug, assume it exists everywhere, not just where you found it.** I should have done a full audit of every place that touches ranks and permissions after Day 4-5. I didn't, and I paid for it with two more days of the same shit.

## Day 15: The Keto Direct Access Security Issue

This was the one that genuinely bothered me.

I discovered that the frontend was directly accessing Keto APIs. Not through Oathkeeper. Directly. The whole point of this project — the *entire reason* it exists — is Zero Trust architecture. Every request goes through the gateway. Nothing is accessed directly. That's the rule. And here I was violating it in my own code.

The fix was straightforward: route all Keto requests through Oathkeeper, same as everything else. But finding this felt like discovering you left your front door unlocked while writing a blog post about home security. Embarrassing.

## The CORS Conflict

Of course, routing Keto through Oathkeeper immediately broke something else. CORS errors everywhere.

The problem was subtle. I had removed the `cors:` section from Keto's config back on [Day 2-3](/blog/nova-id-day-2-3-docker-compose-hell), or so I thought. But Keto was STILL sending CORS headers. Turns out setting `enabled: false` is not the same as removing the section entirely. If the `cors:` section exists at all — even disabled — Keto does... something with headers that conflicts with Oathkeeper's CORS handling.

**Solution**: Delete the entire `cors:` section. Not disable it. Not comment it out. Delete it. Gone. Scorched earth.

## The OPTIONS Method Error

Next domino: Oathkeeper doesn't allow `OPTIONS` in the `allowed_methods` list of access rules. I had it in there because, you know, CORS preflight requests use OPTIONS. Seems logical.

But Oathkeeper handles OPTIONS automatically when CORS is properly configured. Adding it to `allowed_methods` actually breaks things. Remove it from the list, let Oathkeeper do its thing.

## The Unnecessary Preflight

Last one. GET requests were triggering CORS preflight. That shouldn't happen — simple GET requests don't need preflight. Unless you add headers that make them "not simple."

The frontend was sending `Content-Type: application/json` on GET requests. GET requests don't have a body. They don't need a Content-Type. But that header makes the browser think "this is a complex request, better do a preflight check."

**Fix**: Remove the `Content-Type` header from GET requests. That's it. A one-line fix that took me an hour to diagnose because I was looking at the server side when the problem was in the client.

## Looking Back at the Marathon

Seven days. Here's what actually mattered:

- **CSRF** — pick browser or API flows, never mix them. The error messages won't help you figure this out.
- **Password reset** — only send the fields relevant to what you're changing. Kratos won't tell you when you're doing it wrong.
- **Security audit your own code** — I was violating Zero Trust in a Zero Trust project. Audit early, audit often.
- **CORS is a hydra** — you cut one head, two more grow back. Remove configs entirely instead of disabling them.
- **Preflight requests** — understand what triggers them. A single unnecessary header can cause cascading issues.

The problems I'd already solved in earlier posts? They came back. Different code paths, same root causes. The new problems? Each one was a lesson in reading docs more carefully, questioning assumptions, and not trusting that "it works on my machine" means it actually works.

---

*After all this, I needed to step back and look at the big picture. [Day 16](/blog/nova-id-day-16-is-this-thing-production-ready-no) is where I assess what we actually built — and what's still missing.*
