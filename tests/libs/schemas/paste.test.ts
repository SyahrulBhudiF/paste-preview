import { describe, expect, it } from "vitest";
import {
	parseCreatePasteInput,
	parseGetPasteInput,
	parsePasteDraft,
	parseUnlockPasteInput,
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

	it("parses paste id", () => {
		expect(parseGetPasteInput({ id: "abcd" })).toEqual({ id: "abcd" });
	});
});
