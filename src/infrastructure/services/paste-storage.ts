import { env } from "cloudflare:workers";
import { Context, DateTime, Effect, Layer, Schema } from "effect";
import { nanoid } from "nanoid";
import { PasteExpirySeconds } from "@/infrastructure/config/paste";
import { createPasswordVerifier } from "@/infrastructure/crypto/password";
import { PasteNotFoundError, PasteStorageError } from "@/infrastructure/errors/paste";
import { createPasteRecord, isExpired, toCreatedPaste } from "@/infrastructure/paste/records";
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
	create: (
		input: CreatePasteInput,
		origin: string,
	) => Effect.Effect<CreatedPaste, PasteStorageError>;
	getById: (id: string) => Effect.Effect<StoredPaste, PasteNotFoundError | PasteStorageError>;
	unlock: (input: UnlockPasteInput) => Effect.Effect<PasteUnlockResult, PasteStorageError>;
}

const pasteKey = (id: string) => `paste:${id}`;
const DevPasteStore = new Map<string, string>();

const create: PasteStorageServiceContract["create"] = (input, origin) =>
	Effect.tryPromise({
		try: async () => {
			const now = DateTime.nowUnsafe();
			const expiresIn = input.expiresIn ?? DefaultPasteExpiry;
			const expirationTtl = PasteExpirySeconds[expiresIn];
			const passwordVerifier = input.password
				? await createPasswordVerifier(input.password)
				: undefined;
			const paste = createPasteRecord(input, {
				id: nanoid(10),
				now,
				passwordVerifier,
			});

			if (env.PASTES) {
				await env.PASTES.put(pasteKey(paste.id), JSON.stringify(paste), {
					expirationTtl,
				});
			} else {
				DevPasteStore.set(pasteKey(paste.id), JSON.stringify(paste));
			}

			return toCreatedPaste(paste, origin);
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
			if (isExpired(parsed, DateTime.nowUnsafe())) {
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
