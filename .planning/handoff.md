# Handoff - Proyecto Portfolio

**Fecha:** 2026-03-18
**Branch actual:** `fix/project-card-links`
**Contexto restante:** ~24%

---

## ✅ Completado

### 1. API Integration
- [x] Cambiado header de autenticación de `Authorization: ApiKey` a `x-api-key`
- [x] Configuradas variables de entorno `NUXT_API_BASE_URL` y `NUXT_API_TOKEN` en compose.yml
- [x] Creados endpoints proxy:
  - `src/server/api/projects.get.ts` - Lista de proyectos
  - `src/server/api/projects/[id].get.ts` - Proyecto individual
  - `src/server/api/health.get.ts` - Health check
  - `src/server/api/index.get.ts` - API info

### 2. Páginas Nuevas
- [x] `src/pages/projects/[id].vue` - Vista individual de proyecto
- [x] `src/pages/health.vue` - Página de health check
- [x] Sección de API info en `/about`

### 3. Componentes
- [x] `src/components/ui/HealthBadge.vue` - Badge de estado en footer
- [x] `src/components/base/Card.vue` - Agregados props `to`, `href`, `external`
- [x] `src/components/home/portfolio/FeatureProjectCard.vue` - Card clicable
- [x] `src/components/home/blog/LatestBlogPostCard.vue` - Agregado `name` option

### 4. Fixes de Hydration/TypeScript
- [x] Retorno de valor en `loadProjects()` para `useAsyncData`
- [x] Single root node en `[id].vue`
- [x] Fix de `health.version` → `apiInfo.version`
- [x] BaseBadge size `lg` → `md`

---

## ❌ Pendiente / Problemas Conocidos

### CRÍTICO: Ruta dinámica no funciona
**Problema:** `/projects/7` muestra la lista de proyectos en lugar de la vista individual.

**Causa:** Nuxt no regeneró las rutas después de crear `[id].vue`. El SSR está cacheando la ruta `/projects` y no reconoce la ruta dinámica.

**Ubicación del archivo:** `src/pages/projects/[id].vue` (existe y está correcto)

**Posibles soluciones:**
1. Borrar `.nuxt/` y reiniciar el dev server
2. Renombrar el archivo temporalmente para forzar hot reload
3. Hacer un build completo en lugar de dev mode

**Comando recomendado:**
```bash
docker compose down
rm -rf .nuxt node_modules/.cache
docker compose up -d
```

---

## 📁 Archivos Modificados/Creados

### Nuevos
```
src/pages/projects/[id].vue
src/pages/health.vue
src/components/ui/HealthBadge.vue
src/server/api/health.get.ts
src/server/api/index.get.ts
src/server/api/projects.get.ts
```

### Modificados
```
src/components/base/Card.vue
src/components/home/Contact.vue
src/components/home/blog/BlogSection.vue
src/components/home/blog/LatestBlogPostCard.vue
src/components/home/portfolio/FeatureProjectCard.vue
src/components/home/portfolio/PortfolioSection.vue
src/components/main/Footer.vue
src/pages/about.vue
src/pages/projects.vue
src/server/api/projects/[id].get.ts
compose.yml
nuxt.config.ts
```

---

## 🚀 Próximos Pasos

1. **URGENTE:** Fix de ruta dinámica (ver arriba)
2. Commit y push de cambios pendientes en `fix/project-card-links`
3. Crear PR a `develop`
4. Testear en producción

---

## 📝 Commits en la Branch

```
6d9d1c6 fix: hydration mismatch and useAsyncData return value
adbd237 fix: make project cards clickable to navigate to detail page
```

**Estado:** Commits locales listos para push (algunos ya pusheados)

---

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
docker compose logs -f app

# Reiniciar dev server
docker compose restart app

# Clean rebuild
docker compose down && rm -rf .nuxt && docker compose up -d

# Git
git status
git push origin fix/project-card-links
```
