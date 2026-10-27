import type { PasteLanguage } from "@/libs/schemas/paste";

const DownloadNames = {
	auto: "paste.txt",
	markdown: "paste.md",
	typescript: "paste.ts",
	javascript: "paste.js",
	jsx: "paste.jsx",
	tsx: "paste.tsx",
	json: "paste.json",
	python: "paste.py",
	ruby: "paste.rb",
	php: "paste.php",
	java: "paste.java",
	kotlin: "paste.kt",
	swift: "paste.swift",
	scala: "paste.scala",
	lua: "paste.lua",
	perl: "paste.pl",
	rust: "paste.rs",
	"c++": "paste.cpp",
	"c#": "paste.cs",
	c: "paste.c",
	css: "paste.css",
	scss: "paste.scss",
	less: "paste.less",
	yaml: "paste.yaml",
	env: ".env",
	xml: "paste.xml",
	html: "paste.html",
	sql: "paste.sql",
	diff: "paste.diff",
	log: "paste.log",
	bash: "paste.sh",
	powershell: "paste.ps1",
	nix: "paste.nix",
	toml: "paste.toml",
	ini: "paste.ini",
	graphql: "paste.graphql",
	terraform: "paste.tf",
	nginx: "paste.conf",
	http: "paste.http",
	zig: "paste.zig",
	haskell: "paste.hs",
	astro: "paste.astro",
	vue: "paste.vue",
	svelte: "paste.svelte",
	go: "paste.go",
	text: "paste.txt",
} satisfies Partial<Record<PasteLanguage, string>>;

export const getDownloadName = (language: PasteLanguage) => {
	if (language === "dockerfile") return "Dockerfile";
	if (language === "makefile") return "Makefile";
	return DownloadNames[language] ?? `paste.${language}`;
};

export const downloadText = (content: string, filename: string) => {
	const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	setTimeout(() => URL.revokeObjectURL(url), 0);
};
