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

		const passwordMatches = yield* Effect.tryPromise({
			try: () => verifyPassword(input.password, verifier),
			catch: () =>
				new PasteStorageError({
					message: "Could not verify paste password.",
					operation: "unlock",
				}),
		});
		if (passwordMatches) return { status: "unlocked", paste };

		if (!(yield* rateLimit)) return { status: "rate-limited" };
		return { status: "invalid" };
	},
);
