import { env } from "cloudflare:workers";
import { Context, Effect, Layer } from "effect";
import { nanoid } from "nanoid";
import { PasteTtlSeconds, ProductionOrigin } from "@/infrastructure/config/paste";
import { PasteNotFoundError, PasteStorageError } from "@/infrastructure/errors/paste";
import type { CreatePasteInput } from "@/libs/schemas/paste";
import type { CreatedPaste, StoredPaste } from "@/infrastructure/schemas/paste";

export interface PasteStorageServiceShape {
	create: (input: CreatePasteInput) => Effect.Effect<CreatedPaste, PasteStorageError>;
	getById: (id: string) => Effect.Effect<StoredPaste, PasteNotFoundError | PasteStorageError>;
}

const pasteKey = (id: string) => `paste:${id}`;

const getOrigin = () => {
	if (typeof location !== "undefined") return location.origin;
	return ProductionOrigin;
};

const create: PasteStorageServiceShape["create"] = (input) =>
	Effect.tryPromise({
		try: async () => {
			const id = nanoid(10);
			const createdAt = new Date();
			const expiresAt = new Date(createdAt.getTime() + PasteTtlSeconds * 1000);
			const detectedLanguage = input.detectedLanguage ?? input.language;
			const paste: StoredPaste = {
				id,
				content: input.content,
				language: input.language,
				detectedLanguage,
				createdAt: createdAt.toISOString(),
				expiresAt: expiresAt.toISOString(),
			};

			await env.PASTES.put(pasteKey(id), JSON.stringify(paste), {
				expirationTtl: PasteTtlSeconds,
			});

			return {
				id,
				url: `${getOrigin()}/p/${id}`,
				expiresAt: paste.expiresAt,
			};
		},
		catch: () =>
			new PasteStorageError({
				message: "Could not save paste.",
				operation: "create",
			}),
	});

const getById: PasteStorageServiceShape["getById"] = (id) =>
	Effect.tryPromise({
		try: async () => {
			const value = await env.PASTES.get(pasteKey(id));
			if (!value) {
				throw new PasteNotFoundError({
					message: "Paste not found or expired.",
					pasteId: id,
				});
			}

			return JSON.parse(value) as StoredPaste;
		},
		catch: (cause) => {
			if (cause instanceof PasteNotFoundError) return cause;
			return new PasteStorageError({
				message: "Could not read paste.",
				operation: "getById",
			});
		},
	});

export class PasteStorageService extends Context.Service<
	PasteStorageService,
	PasteStorageServiceShape
>()("PasteStorageService", {
	make: Effect.succeed({ create, getById }),
}) {
	static readonly layer = Layer.effect(this, this.make);
}
