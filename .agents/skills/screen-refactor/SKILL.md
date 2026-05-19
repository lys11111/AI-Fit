---
name: screen-refactor
description: Use when converting a large or messy route into smaller page components, shared app composites, and reusable UI primitives in this repository, especially when a screen should move from monolithic JSX or CSS into the src/screens, src/components/app, and src/components/ui structure.
---

# Screen Refactor

Use this skill when a route needs structural cleanup.

## Workflow
1. Keep route behavior intact while moving page-level code into `src/screens/*`.
2. Extract repeated presentation into `src/components/app/*`.
3. Extract reusable controls into `src/components/ui/*` only when they are generic enough to appear across multiple screens.
4. Keep content data in `src/mockData.ts` unless the task explicitly requires a new source.
5. Avoid introducing parallel styling systems or large new global CSS blocks.

## Guardrails
- Preserve route paths and broad content intent.
- Favor behavior-level reuse over prematurely abstract helpers.
- Do not hide simple layout decisions behind over-engineered APIs.
