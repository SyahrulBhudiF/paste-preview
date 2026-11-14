# Paste Preview — Agent Rules

Cloudflare Worker app: TanStack Start + Effect-TS + Panda CSS. Paste snippets
are stored in KV and shared through public URLs.

Read [.agents/CONTEXT.md](.agents/CONTEXT.md) for architecture and domain
decisions. Use the matching workflow in `.agents/skills/` when building server
features, web features, or verifying changes.

## Commands

- `vp dev` — dev server
- `vp build` — production build
- `vp run check` — format check + lint
- `vp run test:run` — run tests once (vitest)
- `vp run test:rules` — anti-slop rule tests (needs ~6 GiB virtual memory; CI only)
- Lint falls back to built-in rules with a warning if oxlint's JS plugin host crashes (SIGABRT); the anti-slop rules are skipped in that case.
- `vp run doctor --verbose` — React Doctor full scan
- `vp run doctor --verbose --scope changed` — React Doctor changed-files scan
- `vp run lint:fix` — auto-fix lint issues
- `vp run codegen` — regenerate `styled-system/` after changing `panda.config.ts`
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
panda.config.ts           Panda theme: semantic colors, fonts, radii, text styles
src/apis/                 Server functions
src/components/ui/        Shared UI primitives (Base UI) and their `.styles.ts`
src/features/             Feature modules; styles live in `styles/` or beside components
src/infrastructure/       Effect services, errors, schemas, config
src/libs/                 Client utils, schemas
src/routes/               TanStack file routes (keep thin)
src/styles/app.css        Panda cascade layer entry only
styled-system/            Generated Panda runtime (gitignored; `vp run codegen`)
```

## TypeScript

- Strict mode. ES2022 target. Bundler module resolution.
- Path aliases: `@/*` → `./src/*`, `@styled/*` → `./styled-system/*`
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

- Styling uses Panda CSS. Tokens come from `panda.config.ts`; never hard-code the palette.
- Use `css()` for one-off styles, `cva` for single-element variants, and `sva` for multi-part components.
- Keep style declarations in dedicated style modules: sibling `.styles.ts` files for UI primitives and `src/features/*/styles/` for feature styles. `.tsx` files only reference generated classes or style objects.
- Shared UI primitives in `src/components/ui/` use Base UI; feature components live in `src/features/*/components/`.
- Route components stay thin — delegate to features.
- Use Sonner for user-facing business-process success and failure feedback; keep actionable form errors inline.

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
