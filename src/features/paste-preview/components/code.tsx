import { useEffect, useState } from "react";
import { normalizeLanguage } from "@/libs/language";
import { highlighter, isHighlightSupported, toHighlightLanguage } from "@/libs/highlight";

const ShikiLanguageMap = {
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
} satisfies Record<string, string>;

const escapeHtml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");

interface CodePreviewProps {
	content: string;
	language: string;
	showLineNumbers?: boolean;
	wrap?: boolean;
}

function CodeFrame({
	html,
	showLineNumbers,
	wrap,
}: {
	html: string;
	showLineNumbers: boolean;
	wrap: boolean;
}) {
	return (
		<div
			className="code-viewer"
			data-line-numbers={showLineNumbers}
			data-wrap={wrap}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

function ShikiCode({ content, language, showLineNumbers = true, wrap = false }: CodePreviewProps) {
	const fallbackHtml = `<pre><code>${content
		.split("\n")
		.map((line) => `<span class="line">${escapeHtml(line)}</span>`)
		.join("\n")}</code></pre>`;
	const [highlighted, setHighlighted] = useState<{
		content: string;
		language: string;
		html: string;
	} | null>(null);

	useEffect(() => {
		let cancelled = false;

		const highlight = async () => {
			const { codeToHtml } = await import("shiki");
			const html = await codeToHtml(content, {
				lang: language,
				theme: "github-light",
			});

			if (!cancelled) setHighlighted({ content, language, html });
		};

		void highlight().catch(() => {
			if (!cancelled) setHighlighted(null);
		});

		return () => {
			cancelled = true;
		};
	}, [content, language]);

	const html =
		highlighted?.content === content && highlighted.language === language
			? highlighted.html
			: fallbackHtml;

	return <CodeFrame html={html} showLineNumbers={showLineNumbers} wrap={wrap} />;
}

export function CodePreview({
	content,
	language,
	showLineNumbers = true,
	wrap = false,
}: CodePreviewProps) {
	const normalized = normalizeLanguage(language);
	const shikiLanguage = ShikiLanguageMap[normalized] ?? "text";

	if (isHighlightSupported(normalized)) {
		const html = highlighter.highlightToHtml(content, {
			lang: toHighlightLanguage(normalized),
			lineNumbers: true,
		});
		const numberedHtml = content.endsWith("\n")
			? html.replace("</code>", '<span class="th-line"></span></code>')
			: html;

		return <CodeFrame html={numberedHtml} showLineNumbers={showLineNumbers} wrap={wrap} />;
	}

	return (
		<ShikiCode
			content={content}
			language={shikiLanguage}
			showLineNumbers={showLineNumbers}
			wrap={wrap}
		/>
	);
}
