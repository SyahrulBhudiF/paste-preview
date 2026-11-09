import { env } from "cloudflare:workers";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { toPasteReadResult } from "@/infrastructure/paste/views";
import { runEffect } from "@/infrastructure/runtime";
import { PasteStorageService } from "@/infrastructure/services";
import {
	parseCreatePasteInput,
	parseGetPasteInput,
	parseUnlockPasteInput,
} from "@/libs/schemas/paste";

const rateLimitMiddleware = (scope: string) =>
	createMiddleware({ type: "request" }).server(async ({ request, next }) => {
		const ip =
			request.headers.get("CF-Connecting-IP") ??
			request.headers.get("x-forwarded-for") ??
			"unknown";
		if (!env.RATE_LIMIT) return next();

		const { success } = await env.RATE_LIMIT.limit({ key: `${scope}:${ip}` });

		if (!success) {
			return new Response("Rate limit exceeded", { status: 429 });
		}

		return next();
	});

const requestContextMiddleware = createMiddleware({ type: "request" }).server(
	async ({ request, next }) => next({ context: { origin: new URL(request.url).origin } }),
);

export const createPaste = createServerFn({ method: "POST" })
	.middleware([requestContextMiddleware, rateLimitMiddleware("create")])
	.validator(parseCreatePasteInput)
	.handler(async ({ data, context }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				return yield* storage.create(data, context.origin);
			}),
		),
	);

export const getPaste = createServerFn({ method: "GET" })
	.validator(parseGetPasteInput)
	.handler(async ({ data }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				return yield* storage.getById(data.id).pipe(
					Effect.map(toPasteReadResult),
					Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)),
				);
			}),
		),
	);

export const unlockPaste = createServerFn({ method: "POST" })
	.middleware([rateLimitMiddleware("unlock")])
	.validator(parseUnlockPasteInput)
	.handler(async ({ data }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				return yield* storage.unlock(data);
			}),
		),
	);
