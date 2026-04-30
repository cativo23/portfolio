---
phase: release-1.6.0-review
reviewed: 2026-04-14T00:00:00Z
depth: deep
files_reviewed: 9
files_reviewed_list:
  - src/composables/useAdminAuth.ts
  - src/plugins/admin-auth-interceptor.ts
  - src/server/api/admin/logout.post.ts
  - src/server/api/admin/blog.post.ts
  - src/pages/health.vue
  - src/server/api/admin/users/index.post.ts
  - src/server/api/admin/mdc/parse.post.ts
  - src/server/api/admin/login.post.ts
  - src/server/middleware/admin-auth.ts
  - tests/composables/useAdminAuth.test.ts
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Release 1.6.0 Code Review Report

**Reviewed:** 2026-04-14
**Depth:** deep
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Reviewed all changes in PR #70 (release/1.6.0) which addresses six findings from a prior security/code review. The fixes for the critical issues (httpOnly cookie handling, user rehydration on refresh) and suggestions (YAML serialization, health check deduplication, auth checks, body size limits) are fundamentally correct and address the root causes.

Four warnings were found, primarily around the interaction between the new logout endpoint and the existing admin-auth middleware (potential recursive 401 loop), and a couple of leftover artifacts from the health.vue refactor. All fixes were verified against their original findings and deemed adequate.

## Verification of Original Fixes

| Fix | Finding | Status | Notes |
|-----|---------|--------|-------|
| #1 | user not rehydrated after refresh | Fixed | `ensureInitialized()` correctly calls `/api/admin/me` on client init. Module-scope guard prevents duplicate calls. |
| #2 | httpOnly cookie deletion from JS fails silently | Fixed | New `/api/admin/logout` endpoint uses `deleteCookie()` server-side. Both interceptor and composable call it. |
| #3 | incomplete YAML escaping | Fixed | `yaml` npm package handles all edge cases properly. Dynamic import is acceptable for admin-only path. |
| #4 | health check called twice (SSR + client) | Fixed | `useAsyncData` handles deduplication. Manual SSR/client branching removed. |
| #5 | users/index.post.ts missing auth check | Fixed | Cookie validation added before forwarding to upstream API. |
| #6 | mdc/parse.post.ts no body size limit | Fixed | 64KB limit and type validation added. |

## Warnings

### WR-01: admin-auth middleware does not exclude logout endpoint, enabling potential recursive 401 loop

**File:** `src/server/middleware/admin-auth.ts:1-11` and `src/plugins/admin-auth-interceptor.ts:3-12`

**Issue:** The interceptor calls `$fetch('/api/admin/logout')` on any 401 from `/api/admin/*` routes. The middleware checks all `/api/admin/*` paths except `/api/admin/login` -- it does NOT exclude `/api/admin/logout`. If the logout endpoint is called when the cookie is already absent, the middleware returns 401 before the handler runs, which triggers the interceptor again, which calls logout again. In practice the `navigateTo('/admin/login')` cancels the loop, but this is a fragile invariant.

**Fix:** Add logout to the middleware allowlist:

```ts
// src/server/middleware/admin-auth.ts
if (event.path === '/api/admin/login') return
if (event.path === '/api/admin/logout') return  // add this line
```

Alternatively, exclude the logout URL in the interceptor:

```ts
if (response?.status === 401 && urlString.includes('/api/admin/') && !urlString.includes('/api/admin/logout')) {
```

### WR-02: health.vue -- `watch` used but not explicitly imported

**File:** `src/pages/health.vue:171-173`

**Issue:** `watch` is called on lines 171-173 but is not in the import statement on line 91 (`import { ref, computed, onMounted } from 'vue'`). This relies on Nuxt's auto-import feature, which works at runtime but is inconsistent with the explicit imports for `ref`, `computed`, and `onMounted` in the same file. If auto-imports are ever disabled or misconfigured, this will be a runtime error.

**Fix:** Add `watch` to the import:

```ts
import { ref, computed, onMounted, watch } from 'vue'
```

### WR-03: health.vue -- `onMounted` imported but unused (dead code)

**File:** `src/pages/health.vue:91`

**Issue:** `onMounted` is imported but no longer used. The old code `onMounted(() => loadHealth())` was removed during the `useAsyncData` refactor (Fix #4). This is leftover dead code.

**Fix:** Remove `onMounted` from the import statement:

```ts
import { ref, computed, watch } from 'vue'
```

### WR-04: useAdminAuth.ts -- logout interface type does not match implementation

**File:** `src/composables/useAdminAuth.ts:14`

**Issue:** The interface declares `logout: () => void` but the implementation is `async function logout()` which returns `Promise<void>`. TypeScript allows this assignment because `void` is compatible with any return type, but callers have no type signal that `logout()` is async. The test correctly uses `await logout()` (line 70 of the test), but other callers might not.

**Fix:** Update the interface to reflect the async nature:

```ts
interface UseAdminAuthReturn {
  // ...
  logout: () => Promise<void>
}
```

## Info

### IN-01: users/index.post.ts auth check is redundant with middleware

**File:** `src/server/api/admin/users/index.post.ts:8-10`

**Issue:** The cookie check `if (!cookie) throw createError(...)` duplicates the check already performed by `src/server/middleware/admin-auth.ts`. The middleware runs on all `/api/admin/*` routes and throws 401 if the cookie is missing, so this endpoint handler is never reached without a valid cookie.

**Assessment:** Acceptable as defense-in-depth. If the middleware is ever removed or modified, this check still protects the endpoint. No action required, but worth documenting.

### IN-02: blog.post.ts frontmatter key mismatch during tab switch

**File:** `src/pages/health.vue:159-168`

**Issue:** The `useAsyncData` key `() => \`health-${selectedTab.value}\`` is evaluated once at setup time, so it stays fixed (e.g., `health-basic`) even when `selectedTab` changes. The `refresh()` call re-fetches with the correct endpoint because the fetcher reads `selectedTab.value` at fetch time, but the key used for Nuxt's internal deduplication cache does not update.

**Assessment:** Works correctly in practice since the component has only one `useAsyncData` instance and deduplication within a single tab is unaffected. For correctness, the key should ideally reflect the current state, but this is cosmetic.

### IN-03: mdc/parse.post.ts returns null instead of error for invalid input

**File:** `src/server/api/admin/mdc/parse.post.ts:6-8`

**Issue:** Invalid body types, missing content, and oversized payloads all return `null` rather than a 400 error with a descriptive message. This makes debugging harder for the admin UI.

**Fix suggestion:**

```ts
if (typeof rawBody !== 'object' || rawBody === null) {
  throw createError({ statusCode: 400, statusMessage: 'Request body must be a JSON object' })
}
if (!content || typeof content !== 'string') {
  throw createError({ statusCode: 400, statusMessage: 'content field is required and must be a string' })
}
if (content.length > 65536) {
  throw createError({ statusCode: 413, statusMessage: 'Content exceeds 64KB limit' })
}
```

### IN-04: useAdminAuth.ts clears user state before server logout completes

**File:** `src/composables/useAdminAuth.ts:55-63`

**Issue:** `user.value = null` runs before `await $fetch('/api/admin/logout')`. If the server call fails, the user appears logged out locally while the cookie still exists on the browser. The next page load would rehydrate via `ensureInitialized()`, so there is no permanent inconsistency, but there is a brief window where the UI shows "logged out" while the session is still active.

**Assessment:** Acceptable trade-off. Clearing user first provides a faster perceived logout. The `ensureInitialized()` mechanism (Fix #1) acts as a safety net to reconcile state on the next navigation.

---

_Reviewed: 2026-04-14_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
