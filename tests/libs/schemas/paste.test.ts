import { describe, expect, it } from "vitest";
import { parseCreatePasteInput, parseGetPasteInput } from "@/libs/schemas/paste";

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

  it("parses paste id", () => {
    expect(parseGetPasteInput({ id: "abcd" })).toEqual({ id: "abcd" });
  });
});
