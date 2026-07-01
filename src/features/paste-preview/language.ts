import type { PasteLanguage } from "@/libs/schemas/paste";

export type { PasteLanguage } from "@/libs/schemas/paste";

export const PasteLanguages: Array<{ value: PasteLanguage; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "markdown", label: "Markdown" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
  { value: "text", label: "Text" },
];

export const normalizeLanguage = (language: string): PasteLanguage => {
  const value = language.toLowerCase().trim();
  if (value === "ts") return "typescript";
  if (value === "js") return "javascript";
  if (value === "shell" || value === "sh") return "bash";
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
  if (/^\s*[[{]/.test(trimmed)) return "json";
  if (/^\s*<(html|div|section|article|main|script|style|p|h\d)\b/i.test(trimmed)) return "html";
  if (
    /\b(import\s+.+\s+from|export\s+(function|const|class|type|interface)|interface\s+\w+|type\s+\w+\s*=)\b/.test(
      trimmed,
    )
  )
    return "typescript";
  if (/\b(function|const|let|var|=>)\b/.test(trimmed)) return "javascript";
  if (/^\s*(npm|pnpm|vp|git|cd|mkdir|curl|echo)\b/m.test(trimmed)) return "bash";
  if (/[.#][\w-]+\s*\{/.test(trimmed)) return "css";
  if (looksLikeMarkdown(trimmed)) return "markdown";
  return "text";
};
