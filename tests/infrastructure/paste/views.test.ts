import { describe, expect, it } from "vitest";
import { toPasteReadResult, toPublicPaste } from "@/infrastructure/paste/views";
import type { StoredPaste } from "@/infrastructure/schemas/paste";

const storedPaste: StoredPaste = {
	id: "paste-1",
	content: "private content",
	title: "Example",
	language: "text",
	detectedLanguage: "text",
	createdAt: "2026-01-01T00:00:00.000Z",
	expiresAt: "2026-01-02T00:00:00.000Z",
	passwordVerifier: { salt: "aa", hash: "bb", iterations: 100_000 },
};

describe("paste views", () => {
	it("strips the password verifier from the public view", () => {
		const publicPaste = toPublicPaste(storedPaste);

		expect(publicPaste).not.toHaveProperty("passwordVerifier");
		expect(publicPaste).toEqual({
			id: "paste-1",
			content: "private content",
			title: "Example",
			language: "text",
			detectedLanguage: "text",
			createdAt: "2026-01-01T00:00:00.000Z",
			expiresAt: "2026-01-02T00:00:00.000Z",
		});
	});

	it("omits an absent title", () => {
		const withoutTitle: StoredPaste = { ...storedPaste, title: undefined };

		expect(toPublicPaste(withoutTitle)).not.toHaveProperty("title");
	});

	it("locks a paste that has a verifier", () => {
		expect(toPasteReadResult(storedPaste)).toEqual({
			status: "locked",
			expiresAt: storedPaste.expiresAt,
		});
	});

	it("opens a paste without a verifier", () => {
		const openPaste: StoredPaste = { ...storedPaste, passwordVerifier: undefined };

		expect(toPasteReadResult(openPaste)).toEqual({
			status: "open",
			paste: toPublicPaste(openPaste),
		});
	});
});
