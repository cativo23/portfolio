---
title: "Nova ID - Day 9-15: The Problem-Solving Marathon"
created_at: 2026-01-23T09:00:00Z
updated_at: 2026-01-29T23:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 9-15 of Nova ID — Email delivery saga, CSRF nightmare, password reset bugs, permission check issues, and CORS conflicts."
tags: ["debugging", "zero-trust", "ory", "nova-id", "lessons-learned"]
---

This was a marathon. So many problems, but we solved them all.

## Day 10: The Email Delivery Saga

Emails weren't being sent. Users couldn't recover passwords.

1. **First fix**: Added `--watch-courier` flag to Kratos
2. **Second fix**: Added `?disable_starttls=true` to SMTP URI
3. **Discovery**: Kratos doesn't send recovery emails for non-existent addresses (anti-enumeration security feature)

**Test**: Used an existing user. Email sent!

## Day 11: The CSRF Nightmare

Mixing API and browser flows caused CSRF errors. Kratos has two types of flows:
- **Browser flows**: `/self-service/login/browser` — for web apps
- **API flows**: `/self-service/login/api` — for mobile apps, programmatic access

You can't mix them. Browser flows handle CSRF automatically. API flows don't.

## Day 12: The Password Reset That Didn't Reset

"Changed my password, but I can't log in with the new one. Old password still works."

**Root Cause**: We were sending profile fields (email, name, rank) along with password fields. Kratos determines the flow type based on which fields are present.

**Fix**: Only send password-related fields:

```javascript
const passwordFormData = new FormData()
passwordFormData.set('method', 'password')
passwordFormData.set('password', passwordValue.value)
passwordFormData.set('password_confirm', passwordConfirm.value)
passwordFormData.set('csrf_token', csrfToken)
// Don't include profile fields!
```

## Day 13: The Permission Check 403 Problem

Keto returns HTTP 403 with `{"allowed": false}` for denied permissions. Parse the JSON and check the `allowed` field.

## Day 14: The General User Access Denied

User had `rank: "General"` in Kratos, but wasn't assigned to `rank:General` in Keto. Created `syncRankPermissions()` to fix this automatically.

## Day 15: The Keto Direct Access Security Issue

Frontend was directly accessing Keto APIs. This violates Zero Trust! Routed all Keto requests through Oathkeeper.

## The CORS Conflict

After routing Keto through Oathkeeper, we got CORS errors. Keto was STILL sending CORS headers even with the section removed.

**Solution**: Remove the entire `cors:` section completely, not just set `enabled: false`.

## The OPTIONS Method Error

Oathkeeper doesn't allow `OPTIONS` in `allowed_methods`. But it handles OPTIONS automatically when CORS is enabled. Remove it from the list.

## The Unnecessary Preflight

GET requests were triggering CORS preflight because the frontend was sending `Content-Type: application/json`. GET requests don't need it.

**Fix**: Remove `Content-Type` header from GET requests.

## Problems Solved

- Path stripping (Oathkeeper handles it)
- Email delivery (courier worker + STARTTLS)
- CSRF (browser vs API flows)
- Password reset (method field)
- Permission checks (403 parsing)
- Rank sync (automatic sync function)
- Keto security (route through Oathkeeper)
- CORS conflicts (remove from backend)
- OPTIONS method (automatic handling)
- Unnecessary preflight (remove Content-Type)
