# Technical Debt Tracker

Long-term improvements and architectural changes to address over time.

---

## Architecture Refactoring

### 1. Centralized Data Management

**Current State**: Project and blog data hardcoded in multiple components  
**Target State**: Single source of truth for all data

**Tasks**:
- [ ] Create `src/data/projects.ts` with typed project data
- [ ] Update `PortfolioSection.vue` to import from data file
- [ ] Update `projects.vue` to import from data file
- [ ] Consider using Nuxt Content for projects too

**Estimated Effort**: 2 hours

---

### 2. Form Component Library

**Current State**: Form elements with repeated long class strings  
**Target State**: Reusable form components

**Tasks**:
- [ ] Create `components/base/BaseInput.vue`
- [ ] Create `components/base/BaseTextarea.vue`
- [ ] Create `components/base/BaseButton.vue`
- [ ] Create `components/base/BaseLabel.vue`
- [ ] Refactor existing forms to use new components

**Estimated Effort**: 3 hours

**Example Component**:
```vue
<!-- components/base/BaseInput.vue -->
<template>
  <input
    :type="type"
    :id="id"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-3 py-2 bg-tokyo-night-bg text-tokyo-night-text 
           border border-tokyo-night-gray rounded focus:outline-none 
           focus:ring-2 focus:ring-tokyo-night-cyan font-mono 
           placeholder-tokyo-night-muted transition"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  type?: string;
  id?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
```

---

### 3. Contact Form Backend

**Current State**: Form submits to console/alert  
**Target State**: Functional email sending

**Options**:
1. **Resend** (recommended for Nuxt) - Simple email API
2. **SendGrid** - Enterprise email delivery
3. **Formspree** - No-backend form handling
4. **NuxtHub** - Already in project, has built-in form handling

**Tasks**:
- [ ] Choose email service
- [ ] Create API route: `server/api/contact.post.ts`
- [ ] Add validation with zod
- [ ] Add rate limiting
- [ ] Implement toast notifications
- [ ] Add loading state to form

**Estimated Effort**: 4-6 hours

---

### 4. TypeScript Strict Mode

**Current State**: Loose TypeScript with many `any` and `Object` types  
**Target State**: Strict TypeScript with proper interfaces

**Tasks**:
- [ ] Create interfaces in `types/` directory
- [ ] Enable strict mode in tsconfig
- [ ] Fix all TypeScript errors
- [ ] Add prop validation to all components

**Estimated Effort**: 4 hours

**Interfaces to Create**:
```typescript
// types/project.ts
export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
  image?: string;
}

// types/blog.ts
export interface BlogPost {
  title: string;
  description?: string;
  created_at: Date;
  image?: string;
  author: string;
  tags?: string[];
  path: string;
}

// types/skill.ts
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  name: string;
  level: SkillLevel;
}
```

---

### 5. Image Optimization Pipeline

**Current State**: Static images served without optimization  
**Target State**: Optimized, lazy-loaded WebP images

**Tasks**:
- [ ] Install `@nuxt/image` module
- [ ] Configure image optimization
- [ ] Replace `<img>` with `<NuxtImg>`
- [ ] Add proper alt text to all images
- [ ] Add width/height to prevent CLS

**Estimated Effort**: 2 hours

---

### 6. Testing Infrastructure

**Current State**: No tests  
**Target State**: Unit and E2E test coverage

**Tasks**:
- [ ] Set up Vitest for unit tests
- [ ] Set up Playwright for E2E tests
- [ ] Write tests for composables
- [ ] Write tests for utility functions
- [ ] Write E2E tests for critical paths (navigation, blog, contact)

**Estimated Effort**: 8 hours initial setup, ongoing

---

### 7. Error Handling & Loading States

**Current State**: No consistent error/loading UI  
**Target State**: Graceful error handling throughout

**Tasks**:
- [ ] Create `components/base/LoadingSpinner.vue`
- [ ] Create `components/base/ErrorMessage.vue`
- [ ] Create `error.vue` for global error page
- [ ] Add loading states to all async components
- [ ] Add error boundaries

**Estimated Effort**: 3 hours

---

### 8. Internationalization (i18n)

**Current State**: Mixed English/Spanish content  
**Target State**: Proper i18n support (if needed)

**Options**:
1. Keep English only (simplest)
2. Add `@nuxtjs/i18n` for multi-language support

**If keeping English only**:
- [ ] Audit all text for Spanish remnants
- [ ] Create a copy document for all UI text

---

### 9. SEO & Analytics

**Tasks**:
- [ ] Add JSON-LD structured data
- [ ] Configure sitemap generation (`@nuxtjs/sitemap`)
- [ ] Add RSS feed for blog
- [ ] Set up analytics (Plausible, Umami, or GA)
- [ ] Add OpenGraph images per page

**Estimated Effort**: 4 hours

---

### 10. Docker Production Optimization

**Current State**: Single-stage Dockerfile with issues  
**Target State**: Optimized multi-stage build

**Tasks**:
- [ ] Create `.dockerignore`
- [ ] Implement multi-stage Dockerfile
- [ ] Add health check endpoint
- [ ] Configure proper caching layers
- [ ] Set up GitHub Actions for CI/CD

**Estimated Effort**: 3 hours

---

## Priority Matrix

| Item | Impact | Effort | Priority |
|------|--------|--------|----------|
| Contact Form Backend | High | Medium | 1 |
| TypeScript Strict Mode | Medium | Medium | 2 |
| Centralized Data | Medium | Low | 3 |
| Error/Loading States | High | Low | 4 |
| Image Optimization | Medium | Low | 5 |
| Form Components | Low | Medium | 6 |
| Testing | High | High | 7 |
| Docker Optimization | Medium | Low | 8 |
| SEO & Analytics | Medium | Medium | 9 |
| i18n | Low | High | 10 |

---

## Maintenance Schedule

### Weekly
- Review and fix any new linting errors
- Update dependencies (minor versions)

### Monthly
- Security audit of dependencies (`yarn audit`)
- Performance testing (Lighthouse)
- Accessibility audit

### Quarterly
- Major dependency updates
- Code quality review
- Technical debt assessment

---

*Track progress by checking off items as they're completed. Update priorities based on project needs.*

