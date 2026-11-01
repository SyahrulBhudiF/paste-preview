# Project context

Read this with the root `AGENTS.md` before making architectural changes.

## What

Paste Preview is a single TanStack Start application deployed as a Cloudflare
Worker. It stores snippets in Cloudflare KV and serves them through public paste
URLs.

## Architecture decisions

1. **Keep routes thin.** Route files load data and render feature modules from
   `src/features/`; page behavior belongs in the feature.
2. **Use Effect where it earns its keep.** Pure rules stay plain functions. Use
   `Context.Service`, `Layer`, and `Effect` for dependencies, asynchronous work,
   and typed failures. Server functions run effects through `runEffect()`.
3. **Schemas define boundaries.** Parse server-function inputs and persisted KV
   records with Effect Schema. Keep client schemas in `src/libs/schemas/` and
   infrastructure schemas in `src/infrastructure/schemas/`.
4. **Keep private paste data private.** `StoredPaste` may contain a password
   verifier; public responses use `PublicPaste` and must never expose it.
5. **Password protection is an access gate, not encryption.** The server stores
   a salted PBKDF2 verifier and checks it before returning paste content.
6. **Paste options remain optional.** Title, custom expiry, and password are
   opt-in. The default expiry is seven days.
7. **Use the shared UI boundary.** Primitives under `src/components/ui/` wrap
   Base UI. Feature UI belongs under `src/features/`. Use Sonner for business
   process feedback and inline messages for actionable form errors.
