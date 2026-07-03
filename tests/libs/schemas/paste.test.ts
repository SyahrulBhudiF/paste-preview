import { Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import { parseCreatePasteInput, parseGetPasteInput } from "@/libs/schemas/paste";

describe("paste schemas", () => {
	it.effect("parses valid create input", () =>
		Effect.sync(() => {
			expect(parseCreatePasteInput({ content: "hello", language: "text" })).toEqual({
				content: "hello",
				language: "text",
			});
		}),
	);

	it.effect("rejects empty content", () =>
		Effect.sync(() => {
			expect(() => parseCreatePasteInput({ content: "", language: "text" })).toThrow(
				/content/i,
			);
		}),
	);

	it.effect("parses paste id", () =>
		Effect.sync(() => {
			expect(parseGetPasteInput({ id: "abcd" })).toEqual({ id: "abcd" });
		}),
	);
});
