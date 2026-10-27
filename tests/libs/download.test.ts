import { describe, expect, it } from "vitest";
import { getDownloadName } from "@/libs/download";

describe("getDownloadName", () => {
	it.each([
		["markdown", "paste.md"],
		["typescript", "paste.ts"],
		["c++", "paste.cpp"],
		["c#", "paste.cs"],
		["env", ".env"],
		["dockerfile", "Dockerfile"],
		["makefile", "Makefile"],
		["text", "paste.txt"],
	] as const)("maps %s to %s", (language, filename) => {
		expect(getDownloadName(language)).toBe(filename);
	});
});
