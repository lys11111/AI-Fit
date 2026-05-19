---
name: frontend-polish
description: Use when improving or creating user-facing pages in this repository, especially when the task involves stronger visual hierarchy, spacing, typography, accent usage, component consistency, motion restraint, or turning vague "make it nicer" requests into polished mobile product UI.
---

# Frontend Polish

Use this skill for any user-facing surface in AI-FIT.

## Goals
- Keep the app feeling like a capable mobile product.
- Improve hierarchy before decoration.
- Make first-view usability obvious on narrow screens.

## Workflow
1. Read `src/lib/design-system.ts` and reuse existing tokens.
2. Reuse `src/components/ui/*` and `src/components/app/*` before adding new primitives.
3. Tighten copy, spacing, and section order before adding ornament.
4. Use one strong accent and restrained supporting tones.
5. Use motion only for screen entry, button feedback, or one layout transition.
6. Before signoff, run `$visual-qa`.

## Visual rules
- Prefer clean product surfaces over stacked decorative cards.
- Keep buttons and tool controls dimensionally stable.
- Do not let labels wrap awkwardly inside controls.
- Avoid gradients as the main story unless they support a specific status or hero moment.
- On mobile, keep primary actions in the thumb zone when possible.
