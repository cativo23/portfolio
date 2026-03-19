# AGENTS.md

> **This file contains all guidelines, conventions, and workflows for this project.**

---

## Git & Commits

### Gitmoji + Conventional Commits

Use [Gitmoji](https://gitmoji.dev/) emojis in commit messages and PR titles.

**API Response Structure:**
```json
{
  "$schema": "...",
  "gitmojis": [
    {
      "emoji": "✨",
      "entity": "&#x2728;",
      "code": ":sparkles:",
      "description": "Introduce new features",
      "name": "sparkles",
      "semver": "minor"
    }
  ]
}
```

**Common Gitmojis:**

| Emoji | Code | Type | Description |
|-------|------|------|-------------|
| ✨ | `:sparkles:` | `feat` | New feature |
| 🐛 | `:bug:` | `fix` | Bug fix |
| 📝 | `:memo:` | `docs` | Documentation |
| ♻️ | `:recycle:` | `refactor` | Refactoring |
| ✅ | `:white_check_mark:` | `test` | Tests |
| ⚙️ | `:gear:` | `chore` | Configuration |
| 🔒️ | `:lock:` | Security | Security fixes |
| 🚀 | `:rocket:` | Deploy | Deployment/release |
| 🔥 | `:fire:` | Remove | Removing code |
| 🎨 | `:art:` | Style | Code style/format |

**Format:**
```
<emoji> <type>(<scope>): <description>
```

**Examples:**
```
✨ feat(home): add hero section animation
🐛 fix(blog): resolve pagination edge case
📝 docs: update README with setup instructions
♻️ refactor(composables): simplify usePageTitle logic
✅ test(components): add unit tests for ProjectCard
⚙️ chore(deps): update Nuxt dependencies
🔒️ fix(security): patch XSS vulnerability
🚀 release: v1.0.0
```

### Branch Naming

```
<type>/<short-description>
```

Examples:
- `feature/about-page`
- `fix/blog-pagination`
- `docs/api-integration`
- `refactor/composables`
- `release/1.0.0`
- `hotfix/1.0.1`

### Commit Guidelines

- One concern per commit
- Write in imperative mood: "add feature" not "added feature"
- Focus on WHY, not WHAT (the diff shows the what)
- Keep commits atomic and reversible

---

## GitFlow Workflow

```
main (production-ready)
  ↑
develop (integration branch)
  ↑
feature/* ────┘
```

### Feature Flow

```bash
# Create feature
git checkout develop && git pull
git checkout -b feature/name

# Work, commit, push (use gitmoji + conventional commit)
git add . && git commit -m "✨ feat: description"
git push origin feature/name

# Create PR (include gitmoji in title)
gh pr create --base develop --head feature/name --title "✨ feat: title" --body "..."

# After merge
git checkout develop && git pull && git branch -d feature/name
```

### Release Flow

```bash
# Create release branch
git checkout develop && git pull
git checkout -b release/1.0.0

# Prepare: update CHANGELOG.md, version, test
git add . && git commit -m "⚙️ chore: prepare release 1.0.0"
git push origin release/1.0.0

# Create PR to main
gh pr create --base main --head release/1.0.0 --title "🚀 Release 1.0.0"

# Al mergear → auto-release workflow crea el GitHub Release → deploy automático

# Post-release: merge back to develop
git checkout develop && git merge main --no-ff && git push
```

### Hotfix Flow

```bash
# Create hotfix from main
git checkout main && git pull
git checkout -b hotfix/1.0.1

# Apply fix + update CHANGELOG.md
git add . && git commit -m "🐛 fix: description"
git push origin hotfix/1.0.1

# Create PR to main
gh pr create --base main --head hotfix/1.0.1 --title "🔥 Hotfix 1.0.1"

# Al mergear → auto-release → deploy automático
```

---

## Release Workflow

For detailed release workflow documentation, see [./docs/RELEASE_WORKFLOW.md](./docs/RELEASE_WORKFLOW.md).

### Quick Summary

| Step | Action |
|------|--------|
| 1 | Create `release/x.y.z` branch from `develop` |
| 2 | Update `CHANGELOG.md` with release notes |
| 3 | Create PR to `main` |
| 4 | Merge PR → **Auto-release workflow** creates GitHub Release |
| 5 | **Deploy workflow** detects release → deploys to production |
| 6 | Merge `main` back to `develop` |

---

## Project Conventions

### Code Style

- TypeScript strict mode
- ESLint + Prettier (auto-format on save)
- Vue 3 Composition API with `<script setup>` syntax
- Imports organizados: Vue → Nuxt → Composables → Components → Assets

### Testing

- TDD workflow: Red → Green → Refactor
- Test naming: `should_<expected_behavior>`
- Vitest para unit tests, Playwright para E2E
- Coverage threshold: 80%

### Security

- No secrets in code (use environment variables)
- Sanitize all user input
- XSS prevention en renderizado de markdown
- CSP headers configurados en `nuxt.config.ts`

### Nuxt 3 Specific Patterns

- Usar `useFetch` / `useAsyncData` para data fetching
- Composables en `src/composables/` con prefijo `use`
- Components auto-imported desde `src/components/`
- Pages auto-imported desde `src/pages/`

---

## Architecture Quick Reference

```
src/
├── app.vue                # Root component
├── app.config.ts          # App configuration
├── pages/                 # File-based routing
│   ├── index.vue
│   ├── about/
│   ├── blog/
│   └── projects/
├── components/            # Auto-imported components
│   ├── ui/                # Reusable UI components
│   ├── home/              # Home page components
│   ├── about/             # About page components
│   ├── blog/              # Blog components
│   └── projects/          # Projects components
├── composables/           # Reusable composables
│   ├── usePageTitle.ts
│   ├── useProjects.ts
│   └── useMeta.ts
├── types/                 # TypeScript types
│   ├── Project.ts
│   ├── BlogPost.ts
│   └── PaginationMeta.ts
├── assets/
│   └── css/               # Global styles
└── utils/                 # Utility functions
```

### Key Patterns

| Pattern | Implementation |
|---------|----------------|
| Data fetching | `useFetch` / `useAsyncData` |
| State management | Pinia (si aplica) |
| SEO | `useHead` / `useSeoMeta` |
| Error handling | `useError` / `createError` |
| API integration | `useProjects` composable |

---

## Development Quick Reference

```bash
# Install
yarn install

# Development
yarn dev

# Build
yarn build
yarn preview

# Generate static site
yarn generate

# Type check
vue-tsc --noEmit

# Lint & format
yarn lint
yarn format

# Tests
yarn test
yarn test:watch
yarn test:cov
```

---

## Documentation

- [./CLAUDE.md](./CLAUDE.md) - Quick reference
- [./docs/RELEASE_WORKFLOW.md](./docs/RELEASE_WORKFLOW.md) - Detailed release process
- [./code-review/CODE_REVIEW.md](./code-review/CODE_REVIEW.md) - Code review findings
- [./README.md](./README.md) - Project overview
