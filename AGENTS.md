# AI-FIT Frontend Working Rules

Use this repository as a mobile product UI, not a marketing page.

## Default flow
- When a task touches user-facing UI, load `$frontend-polish`.
- When a task restructures a route or turns a large page into smaller parts, load `$screen-refactor`.
- Before claiming a screen is polished, load `$visual-qa`.
- When a change affects viewport fit, sticky actions, bottom tabs, or tap targets, load `$mobile-fit-check`.

## Visual direction
- Product-style mobile UI with medium-high information density.
- One primary accent color with restrained secondary tones.
- Prefer sections and bands over pages made from floating cards.
- Use icons in action controls when they improve scan speed.
- Motion should be quiet and purposeful.

## Implementation guardrails
- Reuse tokens from `src/lib/design-system.ts`.
- All user-facing UI changes must first align with `docs/design-tokens.md`.
- Reuse components from `src/components/ui/*` and `src/components/app/*` before creating new ones.
- Prefer Tailwind utilities; keep custom CSS in `src/index.css` small and systemic.
- Avoid adding remote-image dependencies to core flows that are covered by visual tests.

## Validation
- Run `npm run build`, `npm run lint`, and `npm run test:e2e` for substantial UI work.
- Check desktop and mobile screenshots before signoff.
- Do not say a screen is finished if text clips, actions jump, or hierarchy feels muddy.
