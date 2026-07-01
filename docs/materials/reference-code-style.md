# Reference Code Style — DualCam Studio / QUIS

Source project inspected locally:

```txt
/home/ryuko/skripsi/QUIS/apps/web
```

## Package/runtime style

- Toolchain entrypoint: Vite+ `vp`.
- Do not use Bun commands in docs/scripts.
- Install Vite+ globally once: `curl -fsSL https://vite.plus | bash`, then open new shell and run `vp help`.
- Dependency install flow: edit `package.json`, then run `vp install`.
- TypeScript strict.
- React 19.
- TanStack Start.
- TanStack Router file routes.
- TanStack Query for server/client data coordination.
- TanStack Form for non-trivial forms.
- shadcn/Radix UI primitives.
- Tailwind v4 tokens in `src/styles/app.css`.
- Vitest for tests.
- Oxlint for linting.
- Oxfmt for formatting.
- Husky for pre-commit checks.
- Alchemy v2 for Cloudflare infra as code.

Reference scripts for this project:

```json
{
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "start": "vp dev --host 0.0.0.0",
    "deploy": "alchemy deploy alchemy/alchemy.run.ts",
    "destroy": "alchemy destroy alchemy/alchemy.run.ts",
    "infra:dev": "alchemy dev alchemy/alchemy.run.ts",
    "cf-typegen": "wrangler types",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt",
    "format:check": "oxfmt --check",
    "check": "vp check",
    "test": "vitest",
    "test:run": "vitest run",
    "prepare": "husky"
  }
}
```

Tooling facts from docs:

- Vite+ unifies runtime/package manager/frontend flow behind `vp env`, `vp install`, `vp dev`, `vp check`, `vp build`, `vp run`, and `vp test`.
- `vp check` runs formatting, linting, and type checks using Oxfmt, Oxlint, and tsgo.
- Oxlint supports JS/TS/JSX/TSX and has ESLint-compatible rule coverage, automatic fixes, type-aware linting, and multi-file analysis.
- Oxfmt supports JS/TS/JSON/YAML/HTML/Vue/Svelte/CSS/Markdown/MDX/GraphQL and is Prettier-compatible for JS/TS workflows.

## Folder contract

Use this exact shape:

```txt
src/apis/                 Server functions
src/components/           Shared UI and layout
src/features/             Feature modules
src/infrastructure/       Effect services, layers, schemas, storage, errors
src/libs/                 Client utilities, hooks, stores, schemas
src/routes/               TanStack routes
src/styles/app.css        Tailwind/theme tokens
```

## Architecture rules copied from QUIS

- Route files stay thin.
- Server functions live in `src/apis/*`.
- Business logic/storage work lives in `src/infrastructure/services/*`.
- Cross-cutting config/runtime/errors/schemas live in `src/infrastructure/*`.
- Validation stays close to server function and form boundaries.
- UI logic belongs in `src/features/*`, not routes.
- Use shadcn/Radix default behavior unless there is a clear reason not to.

## Effect v4 style

**This project uses `Context.Service`.**

Reason: npm `effect@4.0.0-beta.92` does not export `ServiceMap`; current v4 beta still exposes class-style services through `Context.Service`.

```ts
import { Context, Effect, Layer } from "effect";

export class PasteService extends Context.Service<PasteService>()("PasteService", {
  make: Effect.gen(function* () {
    const create = Effect.fn("PasteService.create")(function* (input) {
      // service work
    });

    return { create };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
```

Use:

```ts
const service = yield * PasteService;
```

## Error style

Use specific errors.

Pattern:

```ts
import { Schema } from "effect";

export class PasteNotFoundError extends Schema.TaggedErrorClass<PasteNotFoundError>(
  "PasteNotFoundError",
)({
  message: Schema.String,
  pasteId: Schema.String,
}) {}
```

Rules:

- no generic `Error` in domain service,
- preserve causes for logs,
- show safe messages in UI,
- use `catchTag` / `catchTags` where branching is needed.

## UI style

- Prefer theme tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`.
- Avoid hardcoded color classes unless feature-specific.
- Keep route components small.
- Keep preview/editor components in `src/features/paste-preview/components/*`.

## Imports/naming

- Prefer `@/*` aliases.
- Use `import type` for type-only imports.
- React components: `PascalCase`.
- Hooks: `useXxx`.
- Server functions: verb-noun names, e.g. `createPaste`, `getPaste`.
- Schemas: `PasteSchema`, `CreatePasteInputSchema`.
- Non-component files: `kebab-case.ts`.
