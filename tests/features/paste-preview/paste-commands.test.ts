import { describe, expect, it } from "vitest";
import { toCreatePasteInput, toSavedPaste } from "@/features/paste-preview/paste-commands";
import type { PasteFormValues } from "@/libs/schemas/paste";

const values: PasteFormValues = {
	content: "const x = 1;",
	language: "auto",
	title: " Example ",
	expiresIn: "7d",
	password: "",
};

describe("paste commands", () => {
	it("detects the language for auto and omits an empty password", () => {
		expect(toCreatePasteInput(values)).toEqual({
			content: "const x = 1;",
			language: "auto",
			title: " Example ",
			expiresIn: "7d",
			detectedLanguage: "javascript",
		});
	});

	it("keeps an explicit language", () => {
		expect(toCreatePasteInput({ ...values, language: "typescript" }).detectedLanguage).toBe(
			"typescript",
		);
	});

	it("includes a non-empty password", () => {
		const password = ["Alpha", "Bravo", "Charlie", "1234"].join("-");

		expect(toCreatePasteInput({ ...values, password }).password).toBe(password);
	});

	it("snapshots the saved paste", () => {
		const input = toCreatePasteInput({ ...values, language: "text", title: "" });

		expect(toSavedPaste(input, "https://example.com/p/abcd")).toEqual({
			url: "https://example.com/p/abcd",
			passwordProtected: false,
			content: "const x = 1;",
			language: "text",
			title: "",
			expiresIn: "7d",
		});
	});
});
