import { createHighlighter } from "@tanstack/highlight/core";
import {
	css,
	diff,
	dockerfile,
	env,
	html,
	http,
	js,
	json,
	jsx,
	markdown,
	nginx,
	plaintext,
	python,
	shell,
	sql,
	svelte,
	toml,
	ts,
	tsx,
	vue,
	yaml,
} from "@tanstack/highlight/languages";
import { createTanStackMarkdownHighlighter } from "@tanstack/highlight/markdown";
import { createThemeCss } from "@tanstack/highlight/theme";
import { githubDarkTheme } from "@tanstack/highlight/themes/github-dark";
import { githubLightTheme } from "@tanstack/highlight/themes/github-light";
import type { CodeHighlighter } from "@tanstack/markdown";
import type { PasteLanguage } from "@/libs/schemas/paste";

export const highlighter = createHighlighter({
	fallbackLanguage: "plaintext",
	languages: [
		plaintext,
		markdown,
		diff,
		env,
		toml,
		yaml,
		json,
		html,
		css,
		js,
		ts,
		jsx,
		tsx,
		vue,
		svelte,
		http,
		shell,
		dockerfile,
		nginx,
		sql,
		python,
	],
});

export const highlightMarkdownCode: CodeHighlighter =
	createTanStackMarkdownHighlighter(highlighter);

// App languages covered by TanStack Highlight. Anything else falls back to Shiki.
const HighlightLanguageMap: Partial<Record<PasteLanguage, string>> = {
	text: "plaintext",
	markdown: "markdown",
	diff: "diff",
	env: "env",
	toml: "toml",
	yaml: "yaml",
	json: "json",
	html: "html",
	css: "css",
	javascript: "js",
	typescript: "ts",
	jsx: "jsx",
	tsx: "tsx",
	vue: "vue",
	svelte: "svelte",
	http: "http",
	bash: "shell",
	dockerfile: "dockerfile",
	nginx: "nginx",
	sql: "sql",
	python: "python",
};

export const isHighlightSupported = (language: string) => language in HighlightLanguageMap;

export const toHighlightLanguage = (language: string) =>
	HighlightLanguageMap[language as PasteLanguage] ?? "plaintext";

// Theme CSS: defaults target pre.th-code for standalone blocks; the
// .markdown-renderer rules target Markdown-owned code containers.
export const highlightThemeCss = [
	createThemeCss({ light: githubLightTheme, dark: githubDarkTheme }),
	createThemeCss({
		light: githubLightTheme,
		dark: githubDarkTheme,
		codeBlockSelector: ".markdown-renderer pre.tm-code",
		lineNumbersSelector: ".markdown-renderer .tm-code--line-numbers",
	}),
].join("\n");
