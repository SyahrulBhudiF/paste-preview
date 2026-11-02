import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HtmlPreview } from "@/features/paste-preview/components/html";

describe("HtmlPreview", () => {
	it("renders a server-safe placeholder instead of sanitizing during SSR", () => {
		const html = renderToString(createElement(HtmlPreview, { content: "<h1>hi</h1>" }));

		expect(html).toContain("HTML preview loads in the browser.");
		expect(html).not.toContain("<iframe");
	});
});
