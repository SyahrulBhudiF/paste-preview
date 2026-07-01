# Markdown Paste Preview MVP Implementation Plan

> **IMPORTANT**: Use plan-execute skill to implement this plan task-by-task.

**Goal:** Build a TanStack Start app at `/home/ryuko/Documents/Codes/Javascript/paste-preview` with two-pane Markdown/code preview and 1-week public preview links on Cloudflare.
**Architecture:** TanStack Start runs on Cloudflare Workers. Paste creation/fetching uses server functions in `src/apis/*`, business logic in Effect v4 services under `src/infrastructure/*`, and Cloudflare KV as the first storage backend with native 7-day TTL. Routes stay thin; UI lives in `src/features/paste-preview/*`.
**Tech Stack:** Vite+ `vp`, TypeScript, React 19, TanStack Start/Router/Query/Form, Zod, Effect v4 beta, shadcn/Radix, Tailwind v4, Cloudflare Workers, Cloudflare KV, react-markdown, remark-gfm, rehype-sanitize, rehype-highlight, Vitest, Oxlint, Oxfmt, Husky.

---

## Materials embedded for agent context

Read these first:

- `docs/materials/product-brief.md`
- `docs/materials/reference-code-style.md`
- `docs/materials/stack-research.md`
- `docs/materials/cloudflare-architecture.md`

Key constraints from materials:

```txt
src/apis/                 Server functions
src/components/           Shared UI and layout
src/features/             Feature modules
src/infrastructure/       Effect services, layers, schemas, storage, errors
src/libs/                 Client utilities, hooks, stores, schemas
src/routes/               TanStack routes
src/styles/app.css        Tailwind/theme tokens
```

Reference project:

```txt
/home/ryuko/skripsi/QUIS/apps/web
```

Effect style follows QUIS:

```ts
export class PasteService extends Context.Service<PasteService>()("PasteService", {
	make: Effect.gen(function* () {
		const create = Effect.fn("PasteService.create")(function* (input) {
			// work
		});

		return { create };
	}),
}) {
	static readonly layer = Layer.effect(this, this.make);
}
```

Cloudflare storage decision:

```txt
Use KV first.
Reason: one paste id -> one JSON payload, native TTL, no migrations, free-tier friendly.
TTL: 604800 seconds / 7 days.
```

Preview behavior:

```txt
Markdown: rendered HTML + highlighted fenced code blocks.
Other language: highlighted code only.
Shared link: preview-only, no editor.
```

---

## Phase 0 — Confirm empty app target

### 0.1 Inspect target dir

```bash
cd /home/ryuko/Documents/Codes/Javascript/paste-preview
find . -maxdepth 2 -type f | sort
```

Expected now: docs only.

### 0.2 Keep docs intact

Do not delete `docs/materials/*` or `docs/plan/*`.

---

## Phase 1 — Scaffold TanStack Start app

### 1.1 Create package metadata

Create `package.json` with Vite+ `vp`, Oxlint, Oxfmt, Vitest, and Husky scripts:

```json
{
	"type": "module",
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

### 1.2 Install dependencies

Use Vite+ as toolchain entrypoint. Install Vite+ once if missing:

```bash
curl -fsSL https://vite.plus | bash
vp help
```

Add dependencies to `package.json`, then install through Vite+:

```bash
vp install
```

Dependencies:

```txt
react
react-dom
@vitejs/plugin-react
vite
typescript
vite-tsconfig-paths
@tanstack/react-start
@tanstack/react-router
@tanstack/react-query
@tanstack/react-form
zod
effect
@cloudflare/vite-plugin
wrangler
react-markdown
remark-gfm
rehype-sanitize
rehype-highlight
highlight.js
nanoid
class-variance-authority
clsx
tailwind-merge
lucide-react
@radix-ui/react-slot
@radix-ui/react-select
@radix-ui/react-scroll-area
@radix-ui/react-separator
@radix-ui/react-tooltip
tailwindcss
@tailwindcss/vite
tw-animate-css
```

Dev dependencies:

```txt
@types/react
@types/react-dom
vitest
oxlint
oxfmt
husky
```

### 1.3 Add TypeScript/Oxlint/Oxfmt configs

Create:

- `tsconfig.json`
- `.oxlintrc.json`
- `.oxfmt.json`
- `vite.config.ts`
- `wrangler.jsonc`
- `components.json`

Rules:

- tabs,
- double quotes,
- `@/*` path alias,
- Oxlint as only linter,
- Oxfmt as only formatter,
- Cloudflare Vite plugin before TanStack Start plugin,
- `nodejs_compat` compatibility flag.

---

## Phase 2 — Base app shell

### 2.1 Create source tree

```txt
src/apis/
src/components/ui/
src/features/paste-preview/components/
src/features/paste-preview/hooks/
src/infrastructure/config/
src/infrastructure/errors/
src/infrastructure/layers/
src/infrastructure/runtime/
src/infrastructure/schemas/
src/infrastructure/services/
src/libs/schemas/
src/libs/utils/
src/routes/
src/styles/
```

### 2.2 Add Tailwind/theme base

Create `src/styles/app.css` with theme tokens.

Keep simple. No heavy visual redesign.

### 2.3 Add root route

Create `src/routes/__root.tsx`:

- imports `app.css`,
- uses `createRootRouteWithContext`,
- includes `<Outlet />`, `<HeadContent />`, `<Scripts />`,
- includes TanStack Query context type.

### 2.4 Add router setup

Create standard TanStack Start entry files:

- `src/router.tsx`
- `src/routeTree.gen.ts` generated later by plugin,
- `src/client.tsx` if required by scaffold,
- `src/ssr.tsx` if required by scaffold.

Follow TanStack Start current scaffold shape.

---

## Phase 3 — Domain schemas and errors

### 3.1 Add paste schemas

Create `src/libs/schemas/paste.ts` using Zod:

```ts
export const PasteLanguageSchema = z.enum([
	"auto",
	"markdown",
	"typescript",
	"javascript",
	"json",
	"html",
	"css",
	"bash",
	"text",
]);

export const CreatePasteInputSchema = z.object({
	content: z.string().min(1).max(200_000),
	language: PasteLanguageSchema,
	detectedLanguage: z.string().optional(),
});

export const GetPasteInputSchema = z.object({
	id: z.string().min(4).max(64),
});
```

### 3.2 Add infrastructure schema

Create `src/infrastructure/schemas/paste.ts`:

```ts
export interface StoredPaste {
	id: string;
	content: string;
	language: string;
	detectedLanguage: string;
	createdAt: string;
	expiresAt: string;
}
```

Keep JSON shape stable. No DB schema yet.

### 3.3 Add typed errors

Create `src/infrastructure/errors/paste.ts` with Effect v4 `Schema.TaggedErrorClass`:

- `PasteNotFoundError`
- `PasteStorageError`
- `PasteValidationError`

---

## Phase 4 — Cloudflare KV service

### 4.1 Add storage service

Create `src/infrastructure/services/paste-storage.ts`.

Responsibilities:

- create id,
- serialize payload,
- write KV with `expirationTtl: 604800`,
- read KV by id,
- parse JSON,
- map KV errors to typed errors.

Service shape:

```ts
export class PasteStorageService extends Context.Service<PasteStorageService>()(
	"PasteStorageService",
	{
		make: Effect.gen(function* () {
			const create = Effect.fn("PasteStorageService.create")(function* (input) {});
			const getById = Effect.fn("PasteStorageService.getById")(function* (id) {});
			return { create, getById };
		}),
	},
) {
	static readonly layer = Layer.effect(this, this.make);
}
```

Implementation note:

```ts
import { env } from "cloudflare:workers";
```

KV key:

```ts
const key = `paste:${id}`;
```

TTL:

```ts
const PasteTtlSeconds = 60 * 60 * 24 * 7;
```

### 4.2 Add runtime layer

Create `src/infrastructure/services/index.ts` and `src/infrastructure/runtime/index.ts`.

Pattern from QUIS:

```ts
const AppLayer = AllServicesLive;
const AppRuntime = ManagedRuntime.make(AppLayer as Layer.Layer<unknown, never, never>);

export const runEffect = <A, E, R>(effect: Effect.Effect<A, E, R>): Promise<A> =>
	AppRuntime.runPromise(effect as Effect.Effect<A, E, never>);
```

---

## Phase 5 — Server functions

### 5.1 Add `src/apis/paste.ts`

Functions:

```ts
export const createPaste = createServerFn({ method: "POST" })
	.inputValidator((input) => CreatePasteInputSchema.parse(input))
	.handler(async ({ data }) => runEffect(...));

export const getPaste = createServerFn({ method: "GET" })
	.inputValidator((input) => GetPasteInputSchema.parse(input))
	.handler(async ({ data }) => runEffect(...));
```

Return safe shape:

```ts
{
	id: string;
	url: string;
	expiresAt: string;
}
```

For get:

```ts
StoredPaste | null;
```

No auth.

No CSRF yet for MVP because paste creation is public and has no session. Add origin/rate-limit later if abuse appears.

---

## Phase 6 — Preview engine

### 6.1 Add language utilities

Create `src/features/paste-preview/language.ts`.

Functions:

- `detectPasteLanguage(content: string): string`
- `isMarkdownLanguage(language: string): boolean`
- `normalizeLanguage(language: string): string`

Rules:

- manual selection wins,
- markdown heuristic before generic auto-detect,
- fallback `text`.

### 6.2 Add Markdown renderer

Create `src/features/paste-preview/components/MarkdownPreview.tsx`.

Use:

- `react-markdown`,
- `remark-gfm`,
- `rehype-sanitize`,
- `rehype-highlight`.

Do not render raw HTML without sanitization.

### 6.3 Add code renderer

Create `src/features/paste-preview/components/CodePreview.tsx`.

For MVP:

- render `<pre><code className={`language-${language}`}>`,
- rely on highlight CSS,
- preserve whitespace,
- support horizontal scroll.

### 6.4 Add unified preview

Create `src/features/paste-preview/components/PastePreview.tsx`.

Logic:

```txt
if markdown -> MarkdownPreview
else -> CodePreview
```

---

## Phase 7 — Editor route `/`

### 7.1 Add editor component

Create `src/features/paste-preview/components/PasteEditor.tsx`.

State:

- `content`,
- `language`,
- `detectedLanguage`,
- `shareUrl`,
- `isSaving`,
- `error`.

Use textarea first. Do not add Monaco/CodeMirror in MVP.

### 7.2 Add language select

Use shadcn/Radix Select.

Options:

- Auto,
- Markdown,
- TypeScript,
- JavaScript,
- JSON,
- HTML,
- CSS,
- Bash,
- Text.

### 7.3 Add create/share action

On click:

- validate non-empty content,
- resolve detected language,
- call `createPaste`,
- show generated link,
- copy link button.

### 7.4 Add route

Create `src/routes/index.tsx`.

Thin route:

```tsx
export const Route = createFileRoute("/")({
	component: PastePreviewPage,
});
```

Page component can live in feature module.

---

## Phase 8 — Public preview route `/p/$pasteId`

### 8.1 Add route

Create `src/routes/p/$pasteId.tsx`.

Loader fetches paste via `getPaste`.

If missing:

- show expired/not found message,
- link back to `/`.

If found:

- render preview-only page,
- no editor,
- show small metadata: language + expiry date.

### 8.2 Keep source hidden by default

Shared route displays preview only.

No raw source panel unless future toggle is requested.

---

## Phase 9 — Cloudflare infra via Alchemy

### 9.1 Install Alchemy

```bash
vp install alchemy
```

### 9.2 Create `alchemy/alchemy.run.ts`

```ts
import { Effect } from "effect";
import { Alchemy, Cloudflare } from "alchemy/cloudflare";

export default Alchemy.Stack(
	"paste-preview",
	{ providers: Cloudflare.providers() },
	Effect.gen(function* () {
		const PASTES = yield* Cloudflare.KV.Namespace("PASTES");

		const rateLimit = Cloudflare.RateLimit({
			namespace_id: 1001,
			simple: { limit: 10, period: 60 },
		});

		const worker = yield* Cloudflare.Worker("paste-preview", {
			entrypoint: "./src/worker.ts",
			domains: ["preview.ryuko.my.id"],
			env: { PASTES, RATE_LIMIT: rateLimit },
		});

		return { url: worker.url };
	}),
);
```

### 9.3 Login to Cloudflare

```bash
alchemy login
```

Stores credentials in `~/.alchemy/profiles.json`. Do not export env vars.

### 9.4 Deploy infra

```bash
alchemy deploy alchemy/alchemy.run.ts
```

This creates:

- KV namespace `PASTES`
- Worker with TanStack Start entrypoint
- Custom domain `preview.ryuko.my.id`
- Rate limit binding (10 req/min per IP)

### 9.5 Generate types

After first deploy, generate Cloudflare types:

```bash
vp run cf-typegen
```

---

## Phase 10 — Husky hooks, tests, checks

### 10.1 Add Husky pre-commit hook

Initialize Husky:

```bash
vp run prepare
```

Create `.husky/pre-commit`:

```sh
vp check
vp run test:run
```

### 10.2 Unit tests

Add tests for:

- markdown detection,
- language normalization,
- paste schema validation,
- expiry date calculation.

### 10.3 Manual checks

Run:

```bash
vp check
vp build
vp dev
```

Manual scenarios:

1. Paste Markdown, preview renders headings/list/code.
2. Paste JSON, preview shows highlighted JSON block.
3. Select `markdown` manually, preview renders Markdown.
4. Select `text`, preview does not render Markdown.
5. Create share link.
6. Open `/p/:id`, preview-only page works.
7. Unknown id shows expired/not found.

---

## Phase 11 — Future lanes, not MVP

- CodeMirror editor.
- More language packs.
- D1 metadata table for analytics/listing.
- Rate limiting by IP.
- Abuse report/delete admin tool.
- Private links or password-protected paste.
- Raw/source toggle on preview page.
- Custom expiration choices.

---

## Unresolved questions

1. Custom domain now or only `*.workers.dev` first?
2. Max paste size: keep `200_000` chars or lower?
3. Shared preview page should have “view source” toggle later or never?

## Concrete steps

1. Scaffold TanStack Start files in target dir.
2. Install dependencies with Vite+ `vp install`.
3. Add Cloudflare Vite/Wrangler config.
4. Build root route/app shell.
5. Add Zod paste schemas.
6. Add Effect v4 paste storage service using KV TTL 7 days.
7. Add `createPaste` and `getPaste` server functions.
8. Add language detection utilities.
9. Add Markdown and code preview components.
10. Add two-pane editor route `/`.
11. Add preview-only route `/p/$pasteId`.
12. Create KV namespaces and generate Cloudflare types.
13. Add Husky pre-commit hook.
14. Run check/build/manual preview tests.
