import { useEffect, useState } from "react";
import { normalizeLanguage } from "@/libs/language";

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
	yaml: "yaml",
	env: "dotenv",
	xml: "xml",
	java: "java",
	nix: "nix",
	haskell: "haskell",
	zig: "zig",
	c: "c",
	"c++": "cpp",
	"c#": "csharp",
	python: "python",
	sql: "sql",
	dockerfile: "dockerfile",
	toml: "toml",
	ini: "ini",
	diff: "diff",
	log: "log",
	scss: "scss",
	less: "less",
	graphql: "graphql",
	nginx: "nginx",
	http: "http",
	ruby: "ruby",
	kotlin: "kotlin",
	swift: "swift",
	scala: "scala",
	lua: "lua",
	perl: "perl",
	terraform: "terraform",
	makefile: "makefile",
	powershell: "powershell",
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
	const fallbackHtml = `<pre class="shiki"><code>${escapeHtml(content)}</code></pre>`;
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
		<div className="h-full w-full max-w-full overflow-auto p-5 font-mono text-sm leading-7">
			<div
				className="min-w-max [&_.shiki]:bg-transparent! [&_.shiki]:outline-none [&_code]:font-mono [&_pre]:m-0"
				dangerouslySetInnerHTML={{ __html: highlightedHtml }}
			/>
		</div>
	);
}
