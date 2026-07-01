import type { PasteLanguage } from "@/libs/schemas/paste";

export type { PasteLanguage } from "@/libs/schemas/paste";

export const PasteLanguages: Array<{ value: PasteLanguage; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "markdown", label: "Markdown" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tsx", label: "TSX" },
  { value: "jsx", label: "JSX" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "vue", label: "Vue" },
  { value: "astro", label: "Astro" },
  { value: "svelte", label: "Svelte" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "text", label: "Text" },
];

export const normalizeLanguage = (language: string): PasteLanguage => {
  const value = language.toLowerCase().trim();
  if (value === "ts") return "typescript";
  if (value === "js") return "javascript";
  if (value === "shell" || value === "sh" || value === "zsh") return "bash";
  if (value === "golang") return "go";
  if (value === "rs") return "rust";
  if (value === "tsx" || value === "jsx") return value;
  if (PasteLanguages.some((item) => item.value === value)) return value as PasteLanguage;
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

  if (/^<\?php\b|\b(namespace|use)\s+[A-Z_a-z\\][\w\\]*;|\$[A-Za-z_]\w*\s*=/.test(trimmed))
    return "php";
  if (/\b(package\s+main|func\s+\w+\s*\(|fmt\.Print|go\s+func\s*\()/m.test(trimmed)) return "go";
  if (/\b(fn\s+\w+\s*\(|let\s+mut\s+|impl\s+\w+|use\s+[\w:]+;|println!\s*\()/m.test(trimmed))
    return "rust";
  if (/^---[\s\S]*---\s*\n[\s\S]*<\w+|<\w+[\s\S]*\bclient:(load|idle|visible)\b/.test(trimmed))
    return "astro";
  if (/\{#(if|each|await)\b|\bon:click=|\bclass:/.test(trimmed)) return "svelte";
  if (/<template[\s\S]*>[\s\S]*<\/template>|defineProps\s*\(|defineEmits\s*\(/i.test(trimmed))
    return "vue";
  if (/^\s*[[{]/.test(trimmed)) return "json";

  const hasJsx = /<\w[\w.]*[\s\S]*>|<\/\w+>/.test(trimmed);
  if (
    hasJsx &&
    (/\b(interface\s+\w+|type\s+\w+\s*=|:\s*[A-Za-z_$][\w$<>]*(\[\])?\b)/.test(trimmed) ||
      /\}\s*:\s*\{/.test(trimmed))
  )
    return "tsx";
  if (hasJsx && /\b(import|export|const|function|return)\b/.test(trimmed)) return "jsx";
  if (/^\s*<(html|div|section|article|main|script|style|p|h\d)\b/i.test(trimmed)) return "html";
  if (
    /\b(import\s+.+\s+from|export\s+(function|const|class|type|interface)|interface\s+\w+|type\s+\w+\s*=)\b/.test(
      trimmed,
    )
  )
    return "typescript";
  if (/\b(function|const|let|var|=>)\b/.test(trimmed)) return "javascript";
  if (/^\s*(npm|pnpm|vp|git|cd|mkdir|curl|echo|go|cargo|rustc|php)\b/m.test(trimmed)) return "bash";
  if (/[.#][\w-]+\s*\{/.test(trimmed)) return "css";
  if (looksLikeMarkdown(trimmed)) return "markdown";
  return "text";
};
