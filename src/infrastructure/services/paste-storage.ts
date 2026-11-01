import { env } from "cloudflare:workers";
import { Context, Effect, Layer, Schema } from "effect";
import { nanoid } from "nanoid";
import { PasteExpirySeconds, ProductionOrigin } from "@/infrastructure/config/paste";
import { createPasswordVerifier } from "@/infrastructure/crypto/password";
import { PasteNotFoundError, PasteStorageError } from "@/infrastructure/errors/paste";
import { unlockStoredPaste } from "@/infrastructure/services/paste-unlock";
import {
	DefaultPasteExpiry,
	type CreatePasteInput,
	type UnlockPasteInput,
} from "@/libs/schemas/paste";
import {
	StoredPasteSchema,
	type CreatedPaste,
	type PasteUnlockResult,
	type StoredPaste,
} from "@/infrastructure/schemas/paste";

export interface PasteStorageServiceContract {
	create: (input: CreatePasteInput) => Effect.Effect<CreatedPaste, PasteStorageError>;
	getById: (id: string) => Effect.Effect<StoredPaste, PasteNotFoundError | PasteStorageError>;
	unlock: (input: UnlockPasteInput) => Effect.Effect<PasteUnlockResult, PasteStorageError>;
}

const pasteKey = (id: string) => `paste:${id}`;
const DevPasteStore = new Map<string, string>();

const getOrigin = () => ("location" in globalThis ? globalThis.location.origin : ProductionOrigin);

const create: PasteStorageServiceContract["create"] = (input) =>
	Effect.tryPromise({
		try: async () => {
			const id = nanoid(10);
			const createdAt = new Date();
			const expiresIn = input.expiresIn ?? DefaultPasteExpiry;
			const expirationTtl = PasteExpirySeconds[expiresIn];
			const expiresAt = new Date(createdAt.getTime() + expirationTtl * 1000);
			const detectedLanguage = input.detectedLanguage ?? input.language;
			const title = input.title?.trim();
			const passwordVerifier = input.password
				? await createPasswordVerifier(input.password)
				: undefined;
			const paste: StoredPaste = Object.assign(
				{
					id,
					content: input.content,
					language: input.language,
					detectedLanguage,
					createdAt: createdAt.toISOString(),
					expiresAt: expiresAt.toISOString(),
				},
				title ? { title } : undefined,
				passwordVerifier ? { passwordVerifier } : undefined,
			);

			if (env.PASTES) {
				await env.PASTES.put(pasteKey(id), JSON.stringify(paste), {
					expirationTtl,
				});
			} else {
				DevPasteStore.set(pasteKey(id), JSON.stringify(paste));
			}

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

const getById: PasteStorageServiceContract["getById"] = (id) =>
	Effect.tryPromise({
		try: async () => {
			const value = env.PASTES
				? await env.PASTES.get(pasteKey(id))
				: DevPasteStore.get(pasteKey(id));
			if (!value) {
				throw new PasteNotFoundError({
					message: "Paste not found or expired.",
					pasteId: id,
				});
			}

			const parsed = Schema.decodeUnknownSync(StoredPasteSchema)(JSON.parse(value));
			if (Date.parse(parsed.expiresAt) <= Date.now()) {
				DevPasteStore.delete(pasteKey(id));
				throw new PasteNotFoundError({
					message: "Paste not found or expired.",
					pasteId: id,
				});
			}
			return parsed;
		},
		catch: (cause) => {
			if (cause instanceof PasteNotFoundError) return cause;
			return new PasteStorageError({
				message: "Could not read paste.",
				operation: "getById",
			});
		},
	});

const unlock: PasteStorageServiceContract["unlock"] = Effect.fn("PasteStorageService.unlock")(
	function* (input) {
		const paste = yield* getById(input.id).pipe(
			Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)),
		);

		const binding = env.PASTE_UNLOCK_RATE_LIMIT;
		const rateLimit = binding
			? Effect.tryPromise({
					try: () => binding.limit({ key: `paste:${input.id}` }),
					catch: () =>
						new PasteStorageError({
							message: "Could not check paste unlock limit.",
							operation: "unlock",
						}),
				}).pipe(Effect.map(({ success }) => success))
			: Effect.succeed(true);

		return yield* unlockStoredPaste({ paste, input, rateLimit });
	},
);

export class PasteStorageService extends Context.Service<
	PasteStorageService,
	PasteStorageServiceContract
>()("PasteStorageService", {
	make: Effect.succeed({ create, getById, unlock }),
}) {
	static readonly layer = Layer.effect(this, this.make);
}
