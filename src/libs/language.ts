import type { PasteLanguage } from "@/libs/schemas/paste";

export type { PasteLanguage } from "@/libs/schemas/paste";

const languageOptions = [
	["auto", "Auto"],
	["text", "Text"],
	["markdown", "Markdown"],
	["log", "Log"],
	["diff", "Diff"],
	["env", "ENV"],
	["ini", "INI"],
	["toml", "TOML"],
	["yaml", "YAML"],
	["json", "JSON"],
	["xml", "XML"],
	["html", "HTML"],
	["css", "CSS"],
	["scss", "SCSS"],
	["less", "Less"],
	["javascript", "JavaScript"],
	["typescript", "TypeScript"],
	["jsx", "JSX"],
	["tsx", "TSX"],
	["vue", "Vue"],
	["astro", "Astro"],
	["svelte", "Svelte"],
	["graphql", "GraphQL"],
	["http", "HTTP"],
	["bash", "Bash"],
	["powershell", "PowerShell"],
	["dockerfile", "Dockerfile"],
	["nginx", "Nginx"],
	["terraform", "Terraform"],
	["makefile", "Makefile"],
	["sql", "SQL"],
	["go", "Go"],
	["rust", "Rust"],
	["python", "Python"],
	["php", "PHP"],
	["ruby", "Ruby"],
	["java", "Java"],
	["kotlin", "Kotlin"],
	["swift", "Swift"],
	["scala", "Scala"],
	["lua", "Lua"],
	["perl", "Perl"],
	["nix", "Nix"],
	["haskell", "Haskell"],
	["zig", "Zig"],
	["c", "C"],
	["c++", "C++"],
	["c#", "C#"],
] satisfies Array<readonly [PasteLanguage, string]>;

export const PasteLanguages: Array<{ value: PasteLanguage; label: string }> = languageOptions.map(
	([value, label]) => ({ value, label }),
);

const PasteLanguageValues = new Set<PasteLanguage>(PasteLanguages.map((item) => item.value));

const LanguageAliases: Record<string, PasteLanguage> = {
	cc: "c++",
	cpp: "c++",
	cs: "c#",
	csharp: "c#",
	cxx: "c++",
	docker: "dockerfile",
	dotenv: "env",
	gql: "graphql",
	golang: "go",
	hs: "haskell",
	js: "javascript",
	make: "makefile",
	ps: "powershell",
	ps1: "powershell",
	py: "python",
	rs: "rust",
	sh: "bash",
	shell: "bash",
	tf: "terraform",
	ts: "typescript",
	yml: "yaml",
	zsh: "bash",
};

export const normalizeLanguage = (language: string): PasteLanguage => {
	const value = language.toLowerCase().trim();
	const alias = LanguageAliases[value];
	if (alias) return alias;
	if (PasteLanguageValues.has(value as PasteLanguage)) return value as PasteLanguage;
	return "text";
};

export const isMarkdownLanguage = (language: string) => normalizeLanguage(language) === "markdown";

const looksLikeMarkdown = (content: string) => {
	const trimmed = content.trim();
	if (!trimmed) return false;
	return [
		/^#{1,6}\s+/m,
		/```[\s\S]*```/m,
		/\[[^\]]+\]\([^)]+\)/m,
		/^\s*[-*+]\s+/m,
		/^\s*\d+\.\s+/m,
		/^\|.+\|$/m,
		/^\s*>\s+\S+/m,
	].some((pattern) => pattern.test(trimmed));
};

export const detectPasteLanguage = (content: string): PasteLanguage => {
	const trimmed = content.trim();
	if (!trimmed) return "text";

	if (/^diff --git\b|^@@\s+-\d+,\d+\s+\+\d+,\d+\s+@@/m.test(trimmed)) return "diff";
	if (/^[A-Z_][A-Z0-9_]*=.*/m.test(trimmed)) return "env";
	if (
		/^<\?xml\b|^<(?!(?:html|div|section|article|main|script|style|p|h\d)\b)([A-Za-z_][\w.-]*)(?:\s[^>]*)?>[\s\S]*<\/\1>$/i.test(
			trimmed,
		)
	)
		return "xml";
	if (/^(?:\s*#.*\n)*\s*FROM\s+\S+/i.test(trimmed)) return "dockerfile";
	if (/^\s*resource\s+"[^"]+"\s+"[^"]+"|^\s*provider\s+"[^"]+"/m.test(trimmed))
		return "terraform";
	if (/^\s*server\s*\{|^\s*location\s+\S+\s*\{/m.test(trimmed)) return "nginx";
	if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+\s+HTTP\/\d(?:\.\d)?/m.test(trimmed))
		return "http";
	if (/\b(query|mutation|fragment)\s+\w*\s*(\([^)]*\))?\s*\{/m.test(trimmed)) return "graphql";
	if (/^[\w./-]+:\s*(?:\n|$)|^\s*\.PHONY:/m.test(trimmed)) return "makefile";
	if (/\bimport\s+<nixpkgs>|\bmkDerivation\b|\bbuildInputs\s*=|\bpkgs\.\w+/m.test(trimmed))
		return "nix";
	if (/\b(#include\s+<\w+>|std::|using\s+namespace\s+std)\b/.test(trimmed)) return "c++";
	if (/\b#include\s+[<"]\w+\.h[>"]|\bint\s+main\s*\(/.test(trimmed)) return "c";
	if (/^---[\s\S]*---\s*\n[\s\S]*<\w+|<\w+[\s\S]*\bclient:(load|idle|visible)\b/.test(trimmed))
		return "astro";
	if (/\{#(if|each|await)\b|\bon:click=|\bclass:/.test(trimmed)) return "svelte";
	if (/<template[\s\S]*>[\s\S]*<\/template>|defineProps\s*\(|defineEmits\s*\(/i.test(trimmed))
		return "vue";

	const hasJsx = /<\w[\w.]*[\s\S]*>|<\/\w+>/.test(trimmed);
	if (
		hasJsx &&
		(/\b(interface\s+\w+|type\s+\w+\s*=|:\s*[A-Za-z_$][\w$<>]*(\[\])?\b)/.test(trimmed) ||
			/\}\s*:\s*\{/.test(trimmed))
	)
		return "tsx";
	if (hasJsx && /\b(import|export|const|function|return)\b/.test(trimmed)) return "jsx";

	if (/\b(SELECT|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE)\b/i.test(trimmed))
		return "sql";
	if (/\b(ERROR|WARN|INFO|DEBUG)\b.*\d{2}:\d{2}:\d{2}|^\[[A-Z]+\]\s+/m.test(trimmed))
		return "log";
	if (/^\s*;.+$/m.test(trimmed)) return "ini";
	if (
		/\b(module\s+\w+\s+where|\w+\s*::|\bwhere\b|\bderiving\s+\(|putStrLn\b)|^(?!(?:const|local|function|let|val)\b)\w+\s+\w+\s*=/m.test(
			trimmed,
		)
	)
		return "haskell";
	if (/@[\w-]+:\s*[^;]+;/.test(trimmed)) return "less";
	if (/\$[\w-]+:\s*[^;]+;|[.#][\w-]+\s*\{[\s\S]*&[\s\S]*\}/.test(trimmed)) return "scss";
	if (/\b(fun\s+main\s*\(|data\s+class\s+\w+|val\s+\w+\s*:)/m.test(trimmed)) return "kotlin";
	if (/\b(object\s+\w+|val\s+\w+\s*=)/m.test(trimmed)) return "scala";
	if (/\b(class\s+\w+\s*<|puts\s+)|#\{[^}]+\}/m.test(trimmed)) return "ruby";
	if (/^#!.*\bpython\b|\bdef\s+\w+\s*\(|\bfrom\s+\w+\s+import\b/m.test(trimmed)) return "python";
	if (/^\s*\[[\w.-]+\]\s*$|^\s*[\w.-]+\s*=\s*.+$/m.test(trimmed)) return "toml";
	if (/^\s*[\w.-]+:\s+.+$/m.test(trimmed)) return "yaml";
	if (/^\s*\$\w+\s*=|\bWrite-Host\b|\bGet-\w+\b/.test(trimmed)) return "powershell";
	if (/\bimport\s+Swift\b|\bfunc\s+\w+\s*\([^)]*\)\s*\{[\s\S]*\bprint\s*\(/m.test(trimmed))
		return "swift";
	if (/\b(const\s+std\s*=\s*@import\("std"\)|pub\s+fn\s+main\s*\()/m.test(trimmed)) return "zig";
	if (/^#!.*\bperl\b|\buse\s+strict;|\bmy\s+\$\w+/m.test(trimmed)) return "perl";
	if (/^<\?php\b|\b(namespace|use)\s+[A-Z_a-z\\][\w\\]*;|\$[A-Za-z_]\w*\s*=/.test(trimmed))
		return "php";
	if (/\b(package\s+main|func\s+\w+\s*\(|fmt\.Print|go\s+func\s*\()/m.test(trimmed)) return "go";
	if (/\b(fn\s+\w+\s*\(|let\s+mut\s+|impl\s+\w+|use\s+[\w:]+;|println!\s*\()/m.test(trimmed))
		return "rust";
	if (
		/\b(public\s+class\s+\w+|public\s+static\s+void\s+main|System\.out\.println)\b/.test(
			trimmed,
		)
	)
		return "java";
	if (/\b(require\s*\(|local\s+\w+\s*=|function\s+\w+\s*\([^)]*\)[\s\S]*\bend\b)/m.test(trimmed))
		return "lua";
	if (/\b(using\s+System;|namespace\s+\w+|Console\.WriteLine)\b/.test(trimmed)) return "c#";

	if (/^\s*[[{]/.test(trimmed)) return "json";
	if (/^\s*<(html|div|section|article|main|script|style|p|h\d)\b/i.test(trimmed)) return "html";
	if (
		/\b(import\s+.+\s+from|export\s+(function|const|class|type|interface)|interface\s+\w+|type\s+\w+\s*=)\b/.test(
			trimmed,
		)
	)
		return "typescript";
	if (/\b(function|const|let|var|=>)\b/.test(trimmed)) return "javascript";
	if (/^\s*(npm|pnpm|vp|git|cd|mkdir|curl|echo|go|cargo|rustc|php)\b/m.test(trimmed))
		return "bash";
	if (/[.#][\w-]+\s*\{/.test(trimmed)) return "css";
	if (looksLikeMarkdown(trimmed)) return "markdown";
	return "text";
};
