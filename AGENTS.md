# Paste Preview — Agent Rules

Cloudflare Worker app: TanStack Start + Effect-TS + Tailwind v4. Paste snippets
are stored in KV and shared through public URLs.

Read [.agents/CONTEXT.md](.agents/CONTEXT.md) for architecture and domain
decisions. Use the matching workflow in `.agents/skills/` when building server
features, web features, or verifying changes.

## Commands

- `vp dev` — dev server
- `vp build` — production build
- `vp run check` — format check + lint
- `vp run test:run` — run tests once (vitest)
- Lint falls back to built-in rules with a warning if oxlint's JS plugin host crashes (SIGABRT); the anti-slop rules are skipped in that case.
- `vp run doctor --verbose` — React Doctor full scan
- `vp run doctor --verbose --scope changed` — React Doctor changed-files scan
- `vp run lint:fix` — auto-fix lint issues
- Single test: `vp run test:run -- path/to/file.test.ts`
- Pre-commit (husky): `vp run check && vp run test:run`

## Toolchain

- **Package manager**: pnpm via Vite+ (`vp install`, NOT `pnpm install`)
- **Linter**: oxlint (`.oxlintrc.json`)
- **Formatter**: oxfmt (`.oxfmtrc.json`)
- **Test**: vitest (`tests/**/*.test.ts`)
- **React diagnostics**: react-doctor (`vp run doctor --verbose`)
- **No Bun commands**

## Folder Contract

```
src/apis/                 Server functions
src/components/ui/        Shared UI primitives (Base UI)
src/features/             Feature modules
src/infrastructure/       Effect services, errors, schemas, config
src/libs/                 Client utils, schemas
src/routes/               TanStack file routes (keep thin)
src/styles/app.css        Tailwind theme tokens
```

## TypeScript

- Strict mode. ES2022 target. Bundler module resolution.
- Path alias: `@/*` → `./src/*`
- Use `import type` for type-only imports.

## Naming

- Components: `PascalCase`
- Hooks: `useXxx`
- Server functions: verb-noun (`createPaste`, `getPaste`)
- Schemas: `XxxSchema`, `ParseXxxInput`
- Non-component files: `kebab-case.ts`
- Errors: `XxxError` (TaggedErrorClass)

## Effect-TS Pattern

**v4 beta — use `Context.Service` (NOT ServiceMap).**

```ts
import { Context, Effect, Layer } from "effect";

export class MyService extends Context.Service<MyService>()("MyService", {
	make: Effect.gen(function* () {
		// inject dependencies via yield*
		return { methodA, methodB };
	}),
}) {
	static readonly layer = Layer.effect(this, this.make);
}
```

- Register layers in `src/infrastructure/services/index.ts`
- Run via `runEffect()` from `src/infrastructure/runtime`

## Error Handling

- Use `Schema.TaggedErrorClass` from effect
- Never throw generic `Error` in domain services
- Catch with `Effect.catchTag` / `catchTags`
- UI: inline error banners, never lose editor content

```ts
export class MyError extends Schema.TaggedErrorClass<MyError>()("MyError", {
	message: Schema.String,
}) {}
```

## Server Functions

- TanStack Start `createServerFn` in `src/apis/*`
- Validate with Schema at `.validator()`
- Wrap Effect services in `runEffect()`
- Rate limiting via middleware

## UI

- Prefer theme tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`
- Use `cn()` from `@/libs/utils/cn` for conditional classes
- Shared UI primitives in `src/components/ui/` use Base UI
- Feature components in `src/features/*/components/`
- Route components stay thin — delegate to features
- Use Sonner for user-facing business-process success and failure feedback; keep actionable form errors inline

## Validation

- Effect Schema for runtime validation
- Schemas live in `src/libs/schemas/` or `src/infrastructure/schemas/`
- Parse at server function and form boundaries

## Testing

- Vitest, node environment
- Tests in `tests/` mirroring src structure
- Import test utils from vitest: `describe`, `it`, `expect`
- Run single: `vp run test:run -- tests/path/to.test.ts`

## Git

- Pre-commit hook: format check + lint + tests
