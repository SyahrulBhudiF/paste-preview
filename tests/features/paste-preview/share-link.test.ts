import { describe, expect, it } from "vitest";
import { getShareLink, isSamePaste, type SavedPaste } from "@/features/paste-preview/share-link";
import type { PasteFormValues } from "@/libs/schemas/paste";

const values: PasteFormValues = {
	content: "const x = 1;",
	language: "auto",
	title: "Example",
	expiresIn: "7d",
	password: "",
};

const saved: SavedPaste = {
	content: values.content,
	language: values.language,
	title: values.title,
	expiresIn: values.expiresIn,
	url: "https://example.test/p/abcd",
	passwordProtected: true,
};

describe("share link", () => {
	it("is current when the saved values match", () => {
		expect(isSamePaste(saved, { ...values })).toBe(true);
		expect(getShareLink(saved, values)).toEqual({
			shareUrl: saved.url,
			passwordProtected: true,
		});
	});

	it("hides the link when content, language, or expiry changes", () => {
		expect(getShareLink(saved, { ...values, content: "changed" }).shareUrl).toBeNull();
		expect(getShareLink(saved, { ...values, language: "markdown" }).shareUrl).toBeNull();
		expect(getShareLink(saved, { ...values, expiresIn: "1d" }).shareUrl).toBeNull();
	});

	it("ignores surrounding title whitespace", () => {
		expect(getShareLink(saved, { ...values, title: "  Example  " }).shareUrl).toBe(saved.url);
	});

	it("returns no link without a saved paste", () => {
		expect(getShareLink(null, values)).toEqual({
			shareUrl: null,
			passwordProtected: false,
		});
	});
});
