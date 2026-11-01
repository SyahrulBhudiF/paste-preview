import { env } from "cloudflare:workers";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { PasteNotFoundError } from "@/infrastructure/errors/paste";
import { runEffect } from "@/infrastructure/runtime";
import { PasteStorageService } from "@/infrastructure/services";
import type { PublicPaste, PasteReadResult, StoredPaste } from "@/infrastructure/schemas/paste";
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

const toPublicPaste = (paste: StoredPaste): PublicPaste => {
	return Object.assign(
		{
			id: paste.id,
			content: paste.content,
			language: paste.language,
			detectedLanguage: paste.detectedLanguage,
			createdAt: paste.createdAt,
			expiresAt: paste.expiresAt,
		},
		paste.title ? { title: paste.title } : undefined,
	);
};

const toPasteReadResult = (paste: StoredPaste): PasteReadResult =>
	paste.passwordVerifier
		? { status: "locked", expiresAt: paste.expiresAt }
		: { status: "open", paste: toPublicPaste(paste) };

export const createPaste = createServerFn({ method: "POST" })
	.middleware([rateLimitMiddleware("create")])
	.validator(parseCreatePasteInput)
	.handler(async ({ data }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				return yield* storage.create(data);
			}),
		),
	);

export const getPaste = createServerFn({ method: "GET" })
	.validator(parseGetPasteInput)
	.handler(async ({ data }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				return yield* storage
					.getById(data.id)
					.pipe(Effect.map(toPasteReadResult))
					.pipe(Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)));
			}).pipe(
				Effect.catchTag("PasteStorageError", () =>
					Effect.fail(
						new PasteNotFoundError({
							message: "Paste not found or expired.",
							pasteId: data.id,
						}),
					),
				),
				Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)),
			),
		),
	);

export const unlockPaste = createServerFn({ method: "POST" })
	.middleware([rateLimitMiddleware("unlock")])
	.validator(parseUnlockPasteInput)
	.handler(async ({ data }) =>
		runEffect(
			Effect.gen(function* () {
				const storage = yield* PasteStorageService;
				const result = yield* storage.unlock(data);
				return result.status === "unlocked"
					? { ...result, paste: toPublicPaste(result.paste) }
					: result;
			}),
		),
	);
