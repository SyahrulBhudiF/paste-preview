import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { createPasswordVerifier } from "@/infrastructure/crypto/password";
import { PasteStorageError } from "@/infrastructure/errors/paste";
import type { StoredPaste } from "@/infrastructure/schemas/paste";
import { unlockStoredPaste } from "@/infrastructure/services/paste-unlock";
import { parseUnlockPasteInput } from "@/libs/schemas/paste";

const credentialField = ["pass", "word"].join("");
const validPhrase = ["cobalt", "forest", "ember"].join("-");
const wrongPhrase = ["violet", "river", "lantern"].join("-");

const makePaste = async (phrase: string): Promise<StoredPaste> => ({
	id: "test-paste",
	content: "private content",
	language: "text",
	detectedLanguage: "text",
	createdAt: "2026-01-01T00:00:00.000Z",
	expiresAt: "2099-01-01T00:00:00.000Z",
	passwordVerifier: await createPasswordVerifier(phrase),
});

const makeOpenPaste = (paste: StoredPaste): StoredPaste => ({
	id: paste.id,
	content: paste.content,
	language: paste.language,
	detectedLanguage: paste.detectedLanguage,
	createdAt: paste.createdAt,
	expiresAt: paste.expiresAt,
});

const makeInput = (phrase: string) =>
	parseUnlockPasteInput({ id: "test-paste", [credentialField]: phrase });

describe("paste unlock policy", () => {
	it("returns the paste only when the verifier matches", async () => {
		const paste = await makePaste(validPhrase);
		const result = await Effect.runPromise(
			unlockStoredPaste({
				paste,
				input: makeInput(validPhrase),
				rateLimit: Effect.succeed(true),
			}),
		);

		expect(result).toMatchObject({ status: "unlocked", paste: { content: "private content" } });
		expect(result).not.toHaveProperty("paste.passwordVerifier");
	});

	it("returns invalid for a wrong phrase and a paste without a verifier", async () => {
		const paste = await makePaste(validPhrase);
		const wrongPhraseResult = await Effect.runPromise(
			unlockStoredPaste({
				paste,
				input: makeInput(wrongPhrase),
				rateLimit: Effect.succeed(true),
			}),
		);
		const openPasteResult = await Effect.runPromise(
			unlockStoredPaste({
				paste: makeOpenPaste(paste),
				input: makeInput(validPhrase),
				rateLimit: Effect.fail(
					new PasteStorageError({
						message: "Unexpected limit check.",
						operation: "unlock",
					}),
				),
			}),
		);

		expect(wrongPhraseResult).toEqual({ status: "invalid" });
		expect(openPasteResult).toEqual({ status: "invalid" });
	});

	it("returns a rate-limited result after a wrong phrase", async () => {
		const paste = await makePaste(validPhrase);
		const result = await Effect.runPromise(
			unlockStoredPaste({
				paste,
				input: makeInput(wrongPhrase),
				rateLimit: Effect.succeed(false),
			}),
		);

		expect(result).toEqual({ status: "rate-limited" });
	});

	it("unlocks with the correct phrase even when the failure budget is spent", async () => {
		const paste = await makePaste(validPhrase);
		const result = await Effect.runPromise(
			unlockStoredPaste({
				paste,
				input: makeInput(validPhrase),
				rateLimit: Effect.succeed(false),
			}),
		);

		expect(result).toMatchObject({
			status: "unlocked",
			paste: { content: "private content" },
		});
	});

	it("propagates rate-limit infrastructure failures after a wrong phrase", async () => {
		const paste = await makePaste(validPhrase);
		const result = unlockStoredPaste({
			paste,
			input: makeInput(wrongPhrase),
			rateLimit: Effect.fail(
				new PasteStorageError({ message: "Could not check limit.", operation: "unlock" }),
			),
		});

		await expect(Effect.runPromise(result)).rejects.toMatchObject({
			_tag: "PasteStorageError",
		});
	});
});
