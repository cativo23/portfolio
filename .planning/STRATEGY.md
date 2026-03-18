# Branching Strategy

**Base branch:** `feat/implement-projects`
**Merge flow:** feature branch → `feat/implement-projects` → `develop` → `main`

## Tasks (ordered by dependencies)

- [x] **#25** — `fix/docker-optimization` — Agregar `.dockerignore` y optimizar Dockerfile de producción
- [x] **#35** — `feat/ui-components` — Consolidar patrones Tailwind en componentes UI reutilizables
- [ ] **#29** — `feat/reusable-form-components` — Crear componentes de form (BaseInput, BaseTextarea, BaseButton)
- [ ] **#28** — `feat/toast-component` — Reemplazar `alert()` con toast accesible
- [ ] **#33 + #36** — `fix/accessibility` — Auditoría a11y: ARIA labels, focus states, error UI en PortfolioSection
- [ ] **#26** — `feat/image-optimization` — Optimización de imágenes con lazy loading y responsive sizes
- [ ] **#32** — `feat/seo-enhancements` — SEO: sitemap, RSS feed, structured data
- [ ] **#31 + #34** — `chore/ci-setup` — GitHub Actions CI + testing con Vitest y Playwright

## Blocked (esperando API)

- [ ] **#23** — Agregar interfaces TypeScript para Project y BlogPost
- [ ] **#24** — Centralizar datos de proyecto y blog
- [ ] **#27** — Validación server-side contacto + anti-spam
- [ ] **#30** — Error handling y loading states
