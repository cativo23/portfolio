---
title: "Nova ID - Day 4-5: When a General Gets a 403"
created_at: 2026-01-18T09:00:00Z
updated_at: 2026-01-19T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "I built an RBAC system with military ranks, discovered that 403 doesn't always mean failure, almost cached my way into a bug, and watched a General get locked out of his own system."
tags: ["rbac", "keto", "permissions", "zero-trust", "nova-id"]
---

After surviving [the infrastructure gauntlet of Days 2-3](/blog/nova-id-day-2-3-docker-compose-hell), I was ready for something more interesting. Time to build the authorization system. Time to decide who gets to do what.

I needed a Role-Based Access Control system, and I wanted the hierarchy to be immediately obvious to anyone looking at it. So naturally, I went with military ranks: General, Colonel, Major, Captain, Lieutenant, Sergeant, Corporal, Private. Because if you're going to build a permission system, you might as well make it fun. Also, "Private user can't delete records" reads way better in a bug report than "Role_ID_7 lacks permission DELETE_RECORDS."

## Discovering Keto Subject Sets

Here's where Keto gets genuinely cool. My first instinct was to grant permissions directly to users:

```
users:management#view_users@user:123
users:management#add_users@user:123
... (many more)
```

That's the brute force approach. User 123 gets ten permissions? That's ten tuples. Change their rank? Delete all ten, create ten new ones. It works, but it's the kind of "works" that slowly becomes a maintenance nightmare.

Then I discovered subject sets. Instead of granting permissions to users, you grant permissions to *roles*, and then assign users to roles:

```
users:management#view_users@rank:General#member
rank:General#member@user:123
```

**The magic**: When you check if `user:123` can `view_users`, Keto automatically resolves the chain. User 123 is a member of General. General can view_users. Therefore, user 123 can view_users. Change a user's rank, and every single permission updates automatically.

**Before**: Change rank = update 10+ permission tuples
**After**: Change rank = update 1 membership tuple

That's the difference between a system that works and a system that doesn't make you want to quit your job.

## The 403 Problem

This one was subtle and almost made it to production.

The frontend was checking permissions by calling Keto's API. Permission granted? Great, show the button. Permission denied? Keto returns HTTP 403. And the frontend treated every 403 as a *failure*. Error handler fires. UI breaks. User sees a generic error message.

But here's the thing — Keto's 403 isn't an error. It's an answer. The question is "can this user do this?" and the answer is "no." That's a valid response. The body even tells you:

```javascript
const response = await fetch(url)
const data = await response.json() // Works even on 403

if (data.hasOwnProperty('allowed')) {
  return data.allowed === true // Valid permission check
}
```

The 403 status code carries `{"allowed": false}` in the body. It's not "something went wrong" — it's "no, they can't do that." Once I parsed the JSON instead of treating the status code as an error, everything clicked. But man, the instinct to treat 4xx as "broken" is deeply wired. I had to actively fight it.

## The Caching Decision

I initially cached permission checks for 5 minutes. Seemed reasonable. Fewer network calls. Faster UI. What's not to like?

Then I thought about it for more than thirty seconds.

What happens when you promote someone from Captain to Colonel? For up to 5 minutes, the UI still shows Captain-level permissions. The user clicks a button they should now have access to. It doesn't work. They click it again. Still nothing. They message you: "I thought you said you promoted me?"

For a user-facing admin panel, stale permissions are worse than slow permissions. You can explain a half-second delay. You can't explain "wait 5 minutes after a rank change for your permissions to kick in."

**Decision**: Remove caching. All permission checks are real-time. For admin operations, accuracy beats performance every time. If this ever becomes a bottleneck, I'll add a cache with aggressive invalidation. But not today. Today, correctness wins.

## The General User Problem

This is my favorite bug in the entire project so far. Picture this: I create a user. I give them the rank "General" — the highest rank in the system, full access to everything. I log in as them. I try to manage users.

403. Access denied.

The *General* can't manage users. The highest-ranking user in the entire system is locked out. The irony was not lost on me.

Here's what happened: when I created the user in Kratos, I set their rank metadata to "General." But Kratos and Keto are separate systems. Kratos knows the user's rank. Keto knows what ranks can do. But nobody told Keto that this user *belongs* to the General rank. The rank existed in two places and was connected in zero places.

**The fix**: I created a `syncRankPermissions()` function that runs automatically whenever a user is created or updated. It removes them from their old rank in Keto and assigns them to their new rank. One function. Called in two places. Solves the problem forever.

But I'll never forget the moment a five-star General got a 403. That's the kind of bug that keeps you humble.

## What I Learned Building Authorization

1. **Subject sets are powerful — use them.** They turn a nightmare of individual permission tuples into a clean hierarchy that manages itself.
2. **403 responses can be valid answers, not errors.** Your HTTP error handler and your permission checker are two different things. Don't let one hijack the other.
3. **Think twice before caching permissions.** Stale permissions create bugs that look like your system is broken when it's actually working exactly as (incorrectly) designed.
4. **Always sync state between systems.** If two services need to agree on something, make the synchronization automatic and mandatory. Manual syncing is just a bug waiting to happen.
5. **Diagnostic tools aren't optional.** When your General gets a 403, you need to be able to trace exactly why, right now, without deploying anything.

---

*This is part 3 of the Nova ID series. The rank hierarchy is working, permissions are real-time, and even the General can manage users now. Next up: building out the frontend that actually uses all this authorization.*
