---
name: building-web-features
description: Adds or changes TanStack Start UI in the paste-preview feature using thin routes, feature-owned components and hooks, Base UI wrappers, and Sonner business-process feedback. Use for work in src/routes or src/features.
---

# Building web features

Read the root `AGENTS.md` and `.agents/CONTEXT.md` first. Follow the existing
single-app feature layout rather than introducing a second UI architecture.

## Layout

- Keep `src/routes/` focused on route definitions, loaders, and rendering a
  feature page.
- Put paste-preview page behavior in `src/features/paste-preview/`.
- Keep reusable presentation in `components/` and shared feature state/data
  behavior in `hooks/`.
- Put shared UI primitives in `src/components/ui/`; those wrappers use Base UI.
  Build on these wrappers when a primitive already exists.

## Interaction rules

- Use theme tokens and the existing Tailwind v4 conventions.
- Use semantic controls and labels; preserve keyboard and screen-reader access.
- Keep actionable validation or request errors next to the relevant control.
- Use Sonner for meaningful business-process success and failure feedback, not
  as a replacement for inline error details.
- Preserve paste content when saving fails. Title, expiry, and password options
  are optional.
- Password protection gates access to a paste; it does not encrypt the paste
  contents.

## Workflow

1. Find the owning feature and reuse its components, hooks, and schema types.
2. Keep route loaders and server calls at their current boundaries; do not move
   storage or password policy into a React component.
3. Add or update tests for behavior that can be verified through a stable
   interface.
4. For rendered UI changes, inspect the running page and exercise affected
   states as described in `.agents/skills/verifying-paste-preview/SKILL.md`.
