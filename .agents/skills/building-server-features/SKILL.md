---
name: building-server-features
description: Adds or changes TanStack Start server functions and Effect v4 paste-storage services using the repository's schema, error, rate-limit, and public-response boundaries. Use for work in src/apis or src/infrastructure/services.
---

# Building server features

Read the root `AGENTS.md` and `.agents/CONTEXT.md` first. This skill describes
how this application connects server functions to Effect services.

## Boundaries

- Define and parse request inputs with Effect Schema in `src/libs/schemas/`.
- Keep TanStack Start `createServerFn` handlers in `src/apis/`. Validate with
  `.validator()` and run Effect programs through `runEffect()`.
- Put KV access and other external effects in
  `src/infrastructure/services/`. Use `Context.Service` and `Layer` when a
  service owns dependencies or typed failures; keep pure policy functions plain.
- Define domain failures in `src/infrastructure/errors/` with tagged Effect
  errors. Map expected failures at the server boundary rather than throwing
  generic errors from domain services.
- Validate records read from KV with schemas in
  `src/infrastructure/schemas/`.
- Map stored records to public response types explicitly. Never return
  `passwordVerifier` or other storage-only fields.
- Keep Cloudflare bindings and resource configuration in the existing
  infrastructure/configuration boundary; do not reach for them from UI code.

## Workflow

1. Read the closest implementation, such as `src/apis/paste.ts` and
   `src/infrastructure/services/paste-storage.ts`.
2. Add or update the schema before wiring the server function.
3. Keep HTTP validation and rate limiting in the server-function boundary;
   keep storage and domain policy in the service layer.
4. Add tests under `tests/` mirroring the source path. Exercise public behavior
   and meaningful failure outcomes.
5. Run the relevant test, then the verification workflow in
   `.agents/skills/verifying-paste-preview/SKILL.md`.
