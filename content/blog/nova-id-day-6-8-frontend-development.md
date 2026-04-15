---
title: "Nova ID - Day 6-8: Frontend Development"
created_at: 2026-01-20T09:00:00Z
updated_at: 2026-01-22T21:00:00Z
image: "/img/blog/alexander-grigoryev-YSEp8dLK8K8-unsplash.jpg"
author: "Carlos Cativo"
description: "Day 6-8 of Nova ID — Vue 3 setup, working with Kratos UI nodes, password validation, and the form field clearing nightmare."
tags: ["vue", "frontend", "kratos", "nova-id", "debugging"]
---

Vue 3 + Vite. Should be straightforward, right?

## The Setup

Vite is fast. The dev server starts instantly. HMR works perfectly. Spent some time configuring Tailwind with Tokyo Night colors — dark background, high contrast, easy on the eyes.

## Working with Kratos UI Nodes

Kratos returns forms as "UI nodes" — structured JSON that describes form fields. This is actually pretty cool — we can render forms dynamically without hardcoding.

But it's also annoying. The structure is complex, and we need utility functions to extract values.

Created helper functions: `getNodeName()`, `getNodeType()`, `getNodeValue()`, `getNodeLabel()`, etc. These make working with UI nodes bearable.

## The Password Validation Requirement

Users wanted:
- Password confirmation field
- Real-time validation (length, uppercase, lowercase, number, special char)
- Visual checklist
- Checkmark when passwords match

Created computed properties for password rules and match checking. Users get immediate feedback.

## The Form Field Clearing Nightmare

When typing in password fields, other form fields (email, name, rank) were being cleared. This was infuriating.

**Root Cause**: Vue was re-rendering the form when `node.attributes.value` changed. Password input triggered a re-render, which reset other fields that weren't properly bound to reactive state.

**Solution**: Store all field values in a reactive object:

```javascript
const fieldValues = reactive({})

onMounted(() => {
  flow.value?.ui?.nodes?.forEach(node => {
    const name = getNodeName(node)
    fieldValues[name] = getNodeValue(node) || ''
  })
})
```

**Key Insight**: Separate form state from Kratos flow nodes. The nodes are for submission, but the form state is for the UI.

## The Password Visibility Toggle Problem

Clicking the eye icon to toggle password visibility cleared the password value. Vue re-rendered the input when the `type` attribute changed from `password` to `text`.

**Solution**: Store password value in a ref and bind the input to it instead of `getNodeValue(node)`.

## What I Learned

1. Kratos UI nodes are powerful but verbose
2. Vue reactivity requires careful state management
3. Form state should be separate from Kratos nodes
4. Real-time validation improves UX significantly
5. Small UI details matter
