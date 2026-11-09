import { describe, expect, it } from "vitest";
import {
	PasteFormStandardSchema,
	parseCreatePasteInput,
	parseGetPasteInput,
	parsePasteDraft,
	parseUnlockPasteInput,
	serializePasteDraft,
} from "@/libs/schemas/paste";

const validPassword = ["Alpha", "Bravo", "Charlie", "1234"].join("-");

describe("paste schemas", () => {
	it("parses valid create input", () => {
		expect(parseCreatePasteInput({ content: "hello", language: "text" })).toEqual({
			content: "hello",
			language: "text",
		});
	});

	it("rejects empty content", () => {
		expect(() => parseCreatePasteInput({ content: "", language: "text" })).toThrow(/content/i);
	});

	it("rejects whitespace-only content", () => {
		expect(() => parseCreatePasteInput({ content: "   ", language: "text" })).toThrow(
			/content/i,
		);
	});

	it("validates the form through a Standard Schema", () => {
		const result = PasteFormStandardSchema["~standard"].validate({
			content: "   ",
			language: "text",
			title: "",
			expiresIn: "7d",
			password: "",
		});

		expect(result instanceof Promise).toBe(false);
		if (result instanceof Promise) throw new Error("expected sync validation");
		expect(result.issues?.[0]?.message).toBe("Paste content is required.");
	});

	it("allows an empty form password", () => {
		const result = PasteFormStandardSchema["~standard"].validate({
			content: "hello",
			language: "text",
			title: "",
			expiresIn: "7d",
			password: "",
		});

		if (result instanceof Promise) throw new Error("expected sync validation");
		expect(result.issues).toBeUndefined();
	});

	it("rejects a short form password", () => {
		const result = PasteFormStandardSchema["~standard"].validate({
			content: "hello",
			language: "text",
			title: "",
			expiresIn: "7d",
			password: "short",
		});

		if (result instanceof Promise) throw new Error("expected sync validation");
		expect(result.issues?.[0]?.message).toBe("The password must be at least 8 characters.");
	});

	it("rejects an unknown detected language", () => {
		expect(() =>
			parseCreatePasteInput({
				content: "hello",
				language: "auto",
				detectedLanguage: "not-a-language",
			}),
		).toThrow(/detectedLanguage/i);
	});

	it("parses optional title, expiry, and password", () => {
		expect(
			parseCreatePasteInput({
				content: "hello",
				language: "text",
				title: "Example",
				expiresIn: "1d",
				password: validPassword,
			}),
		).toEqual({
			content: "hello",
			language: "text",
			title: "Example",
			expiresIn: "1d",
			password: validPassword,
		});
	});

	it("rejects unsupported expiry and short passwords", () => {
		expect(() =>
			parseCreatePasteInput({ content: "hello", language: "text", expiresIn: "never" }),
		).toThrow(/expiresIn/i);
		expect(() =>
			parseCreatePasteInput({ content: "hello", language: "text", password: "short" }),
		).toThrow(/password/i);
	});

	it("parses password unlock input", () => {
		expect(parseUnlockPasteInput({ id: "abcd", password: validPassword })).toEqual({
			id: "abcd",
			password: validPassword,
		});
	});

	it("parses persisted draft metadata", () => {
		expect(
			parsePasteDraft({
				content: "saved",
				language: "text",
				title: "Example",
				expiresIn: "30d",
			}),
		).toEqual({ content: "saved", language: "text", title: "Example", expiresIn: "30d" });
		expect(() => parsePasteDraft({ title: 42 })).toThrow(/title/i);
	});

	it("round-trips a serialized draft", () => {
		const draft = {
			content: "saved",
			language: "text",
			title: "Example",
			expiresIn: "30d",
		} as const;

		expect(parsePasteDraft(JSON.parse(serializePasteDraft(draft)))).toEqual(draft);
	});

	it("parses paste id", () => {
		expect(parseGetPasteInput({ id: "abcd" })).toEqual({ id: "abcd" });
	});
});
