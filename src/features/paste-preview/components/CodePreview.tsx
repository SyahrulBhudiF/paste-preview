import { useEffect, useMemo, useState } from "react";
import { normalizeLanguage } from "@/features/paste-preview/language";

const ShikiLanguageMap: Record<string, string> = {
	auto: "text",
	text: "text",
	markdown: "markdown",
	typescript: "typescript",
	javascript: "javascript",
	tsx: "tsx",
	jsx: "jsx",
	json: "json",
	html: "html",
	vue: "vue",
	astro: "astro",
	svelte: "svelte",
	css: "css",
	bash: "bash",
	go: "go",
	rust: "rust",
	php: "php",
};

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

export function CodePreview({ content, language }: { content: string; language: string }) {
	const normalized = normalizeLanguage(language);
	const shikiLanguage = ShikiLanguageMap[normalized] ?? "text";
	const fallbackHtml = useMemo(
		() => `<pre class="shiki"><code>${escapeHtml(content)}</code></pre>`,
		[content],
	);
	const [highlightedHtml, setHighlightedHtml] = useState(fallbackHtml);

	useEffect(() => {
		let cancelled = false;

		const highlight = async () => {
			const { codeToHtml } = await import("shiki");
			const html = await codeToHtml(content, {
				lang: shikiLanguage,
				theme: "github-light",
			});

			if (!cancelled) setHighlightedHtml(html);
		};

		setHighlightedHtml(fallbackHtml);
		void highlight().catch(() => {
			if (!cancelled) setHighlightedHtml(fallbackHtml);
		});

		return () => {
			cancelled = true;
		};
	}, [content, fallbackHtml, shikiLanguage]);

	return (
		<div
			className="w-full max-w-full overflow-x-auto p-5 font-mono text-sm leading-7 [&_.shiki]:bg-transparent! [&_.shiki]:outline-none [&_code]:font-mono [&_pre]:m-0 [&_pre]:w-max [&_pre]:min-w-full"
			dangerouslySetInnerHTML={{ __html: highlightedHtml }}
		/>
	);
}
