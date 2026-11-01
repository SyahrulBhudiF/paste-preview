import { Effect } from "effect";
import { verifyPassword } from "@/infrastructure/crypto/password";
import { PasteStorageError } from "@/infrastructure/errors/paste";
import type { PasteUnlockResult, StoredPaste } from "@/infrastructure/schemas/paste";
import type { UnlockPasteInput } from "@/libs/schemas/paste";

interface UnlockStoredPasteInput {
	paste: StoredPaste | null;
	input: UnlockPasteInput;
	rateLimit: Effect.Effect<boolean, PasteStorageError>;
}

export const unlockStoredPaste: (
	input: UnlockStoredPasteInput,
) => Effect.Effect<PasteUnlockResult, PasteStorageError> = Effect.fn("PasteStorageService.unlock")(
	function* ({ paste, input, rateLimit }) {
		const verifier = paste?.passwordVerifier;
		if (!paste || !verifier) return { status: "invalid" };

		if (!(yield* rateLimit)) return { status: "rate-limited" };

		const passwordMatches = yield* Effect.tryPromise({
			try: () => verifyPassword(input.password, verifier),
			catch: () =>
				new PasteStorageError({
					message: "Could not verify paste password.",
					operation: "unlock",
				}),
		});
		return passwordMatches ? { status: "unlocked", paste } : { status: "invalid" };
	},
);
