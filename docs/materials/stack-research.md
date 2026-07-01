# Stack Research Notes

## TanStack Start

TanStack Start is a full-stack React framework on top of TanStack Router. Relevant capabilities:

- SSR / streaming,
- file-based routes,
- server functions,
- typed route params/search params,
- deployable to Cloudflare Workers through Vite.

Use Start because the app needs both UI and server-side paste creation/fetching.

## Cloudflare Workers deployment

Cloudflare docs support TanStack Start on Workers with:

```ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), tanstackStart(), react()],
});
```

Wrangler shape:

```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json",
	"name": "paste-preview",
	"compatibility_date": "2026-07-01",
	"compatibility_flags": ["nodejs_compat"],
	"main": "@tanstack/react-start/server-entry",
	"observability": { "enabled": true },
}
```

Cloudflare bindings can be used inside server functions:

```ts
import { env } from "cloudflare:workers";
```

## Storage choice

### KV

Best fit for first version.

Reasons:

- simple key-value by paste id,
- native expiration TTL,
- enough for text pastes,
- no migrations,
- works on Cloudflare free tier subject to quota,
- easy preview fetch by id.

Use:

```ts
await env.PASTES.put(key, value, { expirationTtl: 604800 });
const value = await env.PASTES.get(key);
```

### D1

Useful later if need listing, ownership, analytics, or moderation.

Not needed for first milestone because no accounts and no list page.

### R2

Useful later for large files/assets. Not needed for text-only paste preview.

## Markdown rendering

Recommended libraries:

- `react-markdown`
- `remark-gfm`
- `rehype-sanitize`
- `rehype-highlight` or `shiki`

First milestone preference:

- `react-markdown` for rendering,
- `remark-gfm` for tables/task lists,
- `rehype-sanitize` for safety,
- `rehype-highlight` for code blocks.

Security rule:

- never render raw HTML from user input without sanitization,
- disable raw HTML unless explicitly sanitized.

## Syntax highlighting

Needs two modes:

1. Markdown mode: render Markdown and highlight fenced code blocks.
2. Code mode: render one highlighted code block.

Library options:

| Library                 | Pros                          | Cons                              |
| ----------------------- | ----------------------------- | --------------------------------- |
| highlight.js / lowlight | simple, auto-detect available | larger if importing all languages |
| Shiki                   | high quality themes           | heavier, async setup              |
| Prism                   | mature                        | manual language loading           |

First milestone preference:

- use `highlight.js` / `rehype-highlight` for speed,
- restrict language list later if bundle needs trimming.

## Language detection

Detection strategy:

1. If user selects language manually, trust it.
2. If mode is `auto`, detect Markdown first using heuristics.
3. Otherwise detect code language from highlight library.
4. Fallback to `text`.

Markdown heuristic examples:

- heading line starts with `# `,
- fenced block exists: ```,
- links: `[text](url)`,
- tables: `| col |`,
- lists with `- ` / `1. `,
- emphasis markers combined with paragraphs.

Avoid over-detecting Markdown for plain logs/code.

## TanStack Query

Use TanStack Query for fetching shared paste by id on preview route if client refetch/state is needed.

For SSR consistency, route loader can prefetch with query client. In first pass, route loader can call server function directly and keep page simple.

## TanStack Form

Use TanStack Form for future metadata/settings form if needed.

For first milestone, textarea state can stay local unless implementing share form validation around language/title.

## Zod

Use Zod for server function input validation.

Schemas:

```ts
const CreatePasteInputSchema = z.object({
	content: z.string().min(1).max(200_000),
	language: z.string().min(1),
	detectedLanguage: z.string().optional(),
});
```

Keep Effect Schema for domain/storage errors if useful, but user specifically requested Zod, so API input validation uses Zod.

## Tooling: Vite+, Oxlint, Oxfmt, Vitest, Husky

Use Vite+ `vp` as the only command entrypoint in docs and day-to-day workflow.

Reasons from Vite+ docs:

- one CLI for runtime, package manager, and frontend stack,
- standard commands: `vp env`, `vp install`, `vp dev`, `vp check`, `vp build`, `vp run`, `vp test`,
- `vp check` runs formatting, linting, and type-checking in one pass,
- powered by Oxfmt, Oxlint, and tsgo,
- Vitest integration reuses app resolve/transform config.

Use Oxlint as linter.

Reasons from Oxlint docs:

- dedicated high-performance JS/TS linter,
- 50–100x faster than ESLint in published Oxc benchmarks,
- supports JavaScript, TypeScript, JSX, TSX, and script blocks in Vue/Svelte/Astro,
- has ESLint-compatible rule coverage, React/Jest/Vitest/import/unicorn/jsx-a11y coverage, automatic fixes, type-aware linting, and multi-file analysis.

Use Oxfmt as formatter.

Reasons from Oxfmt docs:

- high-performance formatter on Oxc stack,
- supports JS/TS/JSON/YAML/HTML/Vue/Svelte/CSS/Markdown/MDX/GraphQL and more,
- Prettier-compatible workflow for JS/TS,
- has import sorting, Tailwind class sorting, `package.json` field sorting, and embedded formatting,
- about 30x faster than Prettier in published Oxc benchmarks.

Use Vitest for tests.

- Unit tests run via `vitest run`.
- Watch mode runs via `vitest`.
- Vite+ also exposes `vp test`; scripts still call Vitest directly for clarity.

Use Husky hooks.

Pre-commit should run:

```sh
vp check
vp run test:run
```

No Bun commands in docs. If a package-manager operation is needed, edit `package.json` then run `vp install`.

## Infrastructure: Alchemy (IaC)

Use Alchemy v2 for Cloudflare infrastructure as code.

Why:

- TypeScript + Effect based IaC, matches project stack,
- manages Workers, KV, custom domains, rate limits in one program,
- `alchemy deploy` / `alchemy destroy` for predictable lifecycle,
- `alchemy dev` for local development with hot reload,
- Alchemy stores Cloudflare credentials in `~/.alchemy/profiles.json` via `alchemy login`,
- no manual dashboard setup for infra resources.

Resources used:

- `Cloudflare.Worker` — Worker deployment with entrypoint and bindings,
- `Cloudflare.KV.Namespace` — KV namespace for paste storage,
- `Cloudflare.CustomDomain` — custom domain `preview.ryuko.my.id` on Worker,
- `Cloudflare.RateLimit` — Worker-level rate limiting binding (free tier).

Rate limiting approach:

- Use `Cloudflare.RateLimit` binding instead of WAF dashboard rule,
- rate limit set at Worker level, e.g. 10 requests per minute per IP,
- free on Cloudflare Workers free plan,
- enforced in Worker fetch handler via `env.RATE_LIMIT.limit({ key })`.

Custom domain approach:

- Use `domains: ["preview.ryuko.my.id"]` on Worker resource,
- Alchemy infers zone ID from domain,
- SSL provisioned automatically by Cloudflare.

Stack file: `alchemy/alchemy.run.ts`.

Typical shape:

```ts
import { Effect } from "effect";
import { Worker, KV, RateLimit } from "alchemy/cloudflare";

export default Alchemy.Stack(
	"paste-preview",
	{ providers: Cloudflare.providers() },
	Effect.gen(function* () {
		const PASTES = yield* KV.Namespace("PASTES");

		const rateLimit = RateLimit({
			namespace_id: 1001,
			simple: { limit: 10, period: 60 },
		});

		const worker = yield* Worker("paste-preview", {
			entrypoint: "./src/worker.ts",
			domains: ["preview.ryuko.my.id"],
			env: { PASTES, RATE_LIMIT: rateLimit },
		});

		return { url: worker.url };
	}),
);
```

Deploy: `alchemy deploy alchemy/alchemy.run.ts`
Destroy: `alchemy destroy alchemy/alchemy.run.ts`
Local dev: `alchemy dev alchemy/alchemy.run.ts`
