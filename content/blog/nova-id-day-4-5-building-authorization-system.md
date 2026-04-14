---
title: "Nova ID - Day 4-5: Building the Authorization System"
created_at: 2026-01-18T09:00:00Z
updated_at: 2026-01-19T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 4-5 of Nova ID — Implementing RBAC with Ory Keto subject sets, the 403 permission check problem, and automatic rank synchronization."
tags: ["rbac", "keto", "permissions", "zero-trust", "nova-id"]
---

We need a Role-Based Access Control system. I decided to use a military-style rank hierarchy: General, Colonel, Major, Captain, Lieutenant, Sergeant, Corporal, Private.

## Discovering Keto Subject Sets

Instead of granting permissions directly to users:
```
users:management#view_users@user:123
users:management#add_users@user:123
... (many more)
```

You grant permissions to roles, and then assign users to roles:
```
users:management#view_users@rank:General#member
rank:General#member@user:123
```

**The Magic**: When you check if `user:123` can `view_users`, Keto automatically resolves the chain. Change a user's rank, and all their permissions update automatically.

**Before**: Change rank = update 10+ permission tuples
**After**: Change rank = update 1 membership tuple

## The 403 Problem

Frontend was checking permissions, but getting 403 errors. Treated them as failures.

**Problem**: Keto returns HTTP 403 with `{"allowed": false}` for denied permissions. This is a **valid** response, not an error!

**Solution**: Parse the JSON response even on 403 status:

```javascript
const response = await fetch(url)
const data = await response.json() // Works even on 403

if (data.hasOwnProperty('allowed')) {
  return data.allowed === true // Valid permission check
}
```

## The Caching Decision

I initially cached permission checks for 5 minutes. But then I realized: what if a user's rank changes? The UI would show wrong permissions for 5 minutes.

**Decision**: Remove caching. Make all checks real-time. For admin operations, accuracy is more important than performance.

## The General User Problem

"General user can't manage users." The user had `rank: "General"` in Kratos, but wasn't assigned to `rank:General` in Keto.

**Solution**: Created `syncRankPermissions()` function that removes from old rank and assigns to new rank, called automatically when creating or updating users.

## What I Learned

1. Subject sets are powerful — use them
2. 403 responses can be valid (not errors)
3. Caching permissions is risky — prefer accuracy
4. Always sync rank membership when rank changes
5. Diagnostic tools are essential
