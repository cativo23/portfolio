# Quick Fixes Checklist

A prioritized list of quick fixes from the code review. Estimated total time: ~1-2 hours.

**Status**: ✅ ALL COMPLETED (December 4, 2025)

---

## 🔴 Critical (Fix Immediately)

### 1. ✅ HTML Syntax Error - app.vue
**Status**: Already fixed  
**Time**: 1 minute

```diff
- <main class="container mx-auto p-4 flex-grow"">
+ <main class="container mx-auto p-4 flex-grow">
```

### 2. ✅ Remove Console Log - blog/[...slug].vue
**Status**: Already fixed  
**Time**: 1 minute

```diff
- console.log('Blog Post:', blogPost.value);
```

### 3. ✅ Disable Debug in Production - nuxt.config.ts
**Status**: Already fixed  
**Time**: 2 minutes

```diff
- debug: true,
+ debug: process.env.NODE_ENV !== 'production',
```

---

## 🟡 Medium Priority (This Week)

### 4. ✅ Fix Composable Filename
**Status**: Completed  
**Time**: 1 minute

Renamed: `src/composables/usePageTitle.js.ts` → `src/composables/usePageTitle.ts`

### 5. ✅ Make Footer Social Links Clickable - Footer.vue
**Status**: Completed  
**Time**: 10 minutes

Social icons are now wrapped in proper anchor links with:
- Correct href URLs
- `target="_blank"` and `rel="noopener noreferrer"` for security
- `aria-label` for accessibility
- Hover transition effects

### 6. ✅ Add ARIA Labels - Header.vue
**Status**: Completed  
**Time**: 5 minutes

Mobile menu button now includes:
- `aria-label="Toggle navigation menu"`
- `:aria-expanded="isMenuOpen"`
- `aria-hidden="true"` on the icon

### 7. ✅ Unify Language to English - Contact.vue (home component)
**Status**: Completed  
**Time**: 5 minutes

Changed "Enviar mensaje" → "Send message"
(Other labels were already in English)

---

## 🟢 Low Priority (When Time Permits)

### 8. ✅ Remove Duplicate Font Import
**Status**: Completed  
**Time**: 2 minutes

Removed Fira Code import from `main.css`, now using Source Code Pro consistently (matches `tailwind.config.js`).

### 9. ✅ Create .dockerignore
**Status**: Completed  
**Time**: 2 minutes

Created `.dockerignore` with proper exclusions:
```
node_modules
.git
.nuxt
.output
.env
.env.*
*.md
.vscode
.idea
```

### 10. ✅ Update Project URLs - projects.vue
**Status**: Completed  
**Time**: 5 minutes

Replaced `johndoe` with `cativo23` in all GitHub URLs.

---

## Verification Commands

After making fixes, run these commands:

```bash
# Check for TypeScript errors
yarn run typecheck

# Start dev server and verify no console errors
yarn run dev

# Build for production (catches many issues)
yarn run build
```

---

## Next Steps After Quick Fixes

1. **Create TypeScript interfaces** for props (see CODE_REVIEW.md section 3)
2. **Implement contact form** functionality
3. **Extract duplicate data** into shared files
4. **Add loading and error states** for async content
