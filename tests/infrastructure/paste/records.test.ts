import { DateTime } from "effect";
import { describe, expect, it } from "vitest";
import {
	createPasteRecord,
	getExpiresAt,
	isExpired,
	toCreatedPaste,
} from "@/infrastructure/paste/records";

const now = DateTime.makeUnsafe("2026-01-01T00:00:00.000Z");
const input = { content: "hello", language: "text" } as const;

describe("paste records", () => {
	it("computes each expiry option from the injected time", () => {
		expect(getExpiresAt("1h", now)).toBe("2026-01-01T01:00:00.000Z");
		expect(getExpiresAt("1d", now)).toBe("2026-01-02T00:00:00.000Z");
		expect(getExpiresAt("7d", now)).toBe("2026-01-08T00:00:00.000Z");
		expect(getExpiresAt("30d", now)).toBe("2026-01-31T00:00:00.000Z");
	});

	it("builds a record with the default expiry and detected language", () => {
		expect(createPasteRecord(input, { id: "paste-1", now })).toEqual({
			id: "paste-1",
			content: "hello",
			language: "text",
			detectedLanguage: "text",
			createdAt: "2026-01-01T00:00:00.000Z",
			expiresAt: "2026-01-08T00:00:00.000Z",
		});
	});

	it("keeps an explicit detected language and trims the title", () => {
		const record = createPasteRecord(
			{
				content: "hello",
				language: "auto",
				detectedLanguage: "typescript",
				title: "  Example  ",
			},
			{ id: "paste-1", now },
		);

		expect(record.detectedLanguage).toBe("typescript");
		expect(record.title).toBe("Example");
	});

	it("includes the verifier only when one is provided", () => {
		const passwordVerifier = { salt: "aa", hash: "bb", iterations: 100_000 };

		expect(
			createPasteRecord(input, { id: "paste-1", now, passwordVerifier }).passwordVerifier,
		).toEqual(passwordVerifier);
		expect(createPasteRecord(input, { id: "paste-1", now })).not.toHaveProperty(
			"passwordVerifier",
		);
	});

	it("expires at the boundary and treats an invalid date as expired", () => {
		const record = createPasteRecord(input, { id: "paste-1", now });

		expect(isExpired(record, DateTime.makeUnsafe("2026-01-07T23:59:59.999Z"))).toBe(false);
		expect(isExpired(record, DateTime.makeUnsafe("2026-01-08T00:00:00.000Z"))).toBe(true);
		expect(isExpired({ ...record, expiresAt: "not-a-date" }, now)).toBe(true);
	});

	it("builds the created response with the public URL", () => {
		const record = createPasteRecord(input, { id: "paste-1", now });

		expect(toCreatedPaste(record, "https://example.com")).toEqual({
			id: "paste-1",
			url: "https://example.com/p/paste-1",
			expiresAt: record.expiresAt,
		});
	});
});
