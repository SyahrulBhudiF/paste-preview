# Cloudflare Architecture

## First version architecture

```txt
Browser
  │
  ├─ /                         editor + preview
  ├─ /p/:pasteId               preview-only shared link
  │
TanStack Start on Cloudflare Workers
  │
  ├─ server function: createPaste
  ├─ server function: getPaste
  │
Cloudflare KV: PASTES
```

## Why KV first

KV matches the product shape:

- one id maps to one paste payload,
- no relational queries needed,
- public links expire automatically,
- 1-week expiry supported by native TTL,
- no database migration needed.

## KV data model

Key:

```txt
paste:{id}
```

Value JSON:

```json
{
	"id": "abc123",
	"content": "# Hello",
	"language": "markdown",
	"detectedLanguage": "markdown",
	"createdAt": "2026-07-02T00:00:00.000Z",
	"expiresAt": "2026-07-09T00:00:00.000Z"
}
```

TTL:

```txt
604800 seconds
```

## Server functions

```txt
src/apis/paste.ts
  createPaste(input) -> { id, url, expiresAt }
  getPaste({ id }) -> paste | null
```

`createPaste` writes to KV with expiration TTL.

`getPaste` reads from KV. If missing, return not found/expired state.

## Infrastructure as Code: Alchemy

Use Alchemy v2 for all Cloudflare infra. No manual dashboard setup.

Resources managed by Alchemy:

- `Cloudflare.Worker` — TanStack Start worker,
- `Cloudflare.KV.Namespace` — PASTES KV namespace,
- `Cloudflare.CustomDomain` — `preview.ryuko.my.id`,
- `Cloudflare.RateLimit` — 10 requests/min per IP.

Stack file: `alchemy/alchemy.run.ts`.

Deploy: `alchemy deploy alchemy/alchemy.run.ts`
Destroy: `alchemy destroy alchemy/alchemy.run.ts`
Local dev: `alchemy dev alchemy/alchemy.run.ts`

Alchemy stores credentials in `~/.alchemy/profiles.json` via `alchemy login`. Do not export `CLOUDFLARE_ACCOUNT_ID` or `CLOUDFLARE_API_TOKEN`.

## Bindings

Bindings are declared in `alchemy/alchemy.run.ts`, not in `wrangler.jsonc`.

Type access:

```ts
import { env } from "cloudflare:workers";

await env.PASTES.put(key, value, { expirationTtl: 604800 });
```

## ID generation

Use short URL-safe ids.

Options:

- `crypto.randomUUID()` then shorten not ideal,
- `nanoid` package,
- custom base62 from `crypto.getRandomValues`.

First milestone: use `nanoid` if dependency acceptable.

## Expiry behavior

When paste expires:

- KV returns `null`,
- preview route shows “Paste not found or expired”,
- no separate cleanup job required.

## Free-tier notes

Cloudflare free is enough for a small paste app, but quotas still apply.

Cost pressure points later:

- high reads on popular public links,
- very large paste values,
- too many writes,
- syntax highlighting performed server-side for every request.

Mitigation:

- render preview client-side for first version,
- keep max paste size,
- cache public route with normal Worker caching later if needed.

## Future upgrade path

Move to D1 if requirements appear:

- owner accounts,
- paste list/history,
- moderation/admin dashboard,
- analytics,
- search,
- manual deletion.

Move large content to R2 if:

- paste size exceeds KV comfort zone,
- attachments are added,
- image/file preview appears.
