import { describe, expect, it } from "vitest";
import { detectPasteLanguage, normalizeLanguage } from "@/features/paste-preview/language";

describe("language utilities", () => {
	it("detects markdown before generic text", () => {
		expect(detectPasteLanguage("# Hello\n\n- one")).toBe("markdown");
	});

	it("detects json", () => {
		expect(detectPasteLanguage('{ "ok": true }')).toBe("json");
	});

	it("detects JSX before Markdown blockquote syntax", () => {
		expect(
			detectPasteLanguage(
				'import ReactMarkdown from "react-markdown";\n\nexport function View() {\n  return <ReactMarkdown>{content}</ReactMarkdown>;\n}',
			),
		).toBe("jsx");
	});

	it("detects TSX when JSX contains TypeScript annotations", () => {
		expect(
			detectPasteLanguage(
				"export function View({ content }: { content: string }) {\n  return <ReactMarkdown>{content}</ReactMarkdown>;\n}",
			),
		).toBe("tsx");
	});

	it("detects framework and systems languages", () => {
		expect(detectPasteLanguage("---\ntitle: Hi\n---\n<div>Astro</div>")).toBe("astro");
		expect(
			detectPasteLanguage(
				'<script lang="ts">\nconst count = 0\n</script>\n{#if count}<p>{count}</p>{/if}',
			),
		).toBe("svelte");
		expect(detectPasteLanguage('package main\n\nfunc main() {\n  fmt.Println("hi")\n}')).toBe(
			"go",
		);
		expect(detectPasteLanguage('fn main() {\n  println!("hi");\n}')).toBe("rust");
		expect(detectPasteLanguage("<?php\n$name = 'Ryuko';")).toBe("php");
	});

	it("normalizes aliases", () => {
		expect(normalizeLanguage("ts")).toBe("typescript");
		expect(normalizeLanguage("sh")).toBe("bash");
		expect(normalizeLanguage("rs")).toBe("rust");
		expect(normalizeLanguage("golang")).toBe("go");
	});
});
