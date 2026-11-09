import { describe, expect, it } from "vitest";
import { limitPreviewContent } from "@/features/paste-preview/preview-limit";

describe("live preview limit", () => {
	it("keeps content at or below the limit", () => {
		expect(limitPreviewContent("abc", 3)).toBe("abc");
		expect(limitPreviewContent("abc", 4)).toBe("abc");
	});

	it("truncates content above the limit", () => {
		expect(limitPreviewContent("abcdef", 3)).toBe("abc");
	});
});
