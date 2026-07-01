import { CodePreview } from "./CodePreview";
import { MarkdownPreview } from "./MarkdownPreview";
import { isMarkdownLanguage, normalizeLanguage } from "@/features/paste-preview/language";

export function PastePreview({ content, language }: { content: string; language: string }) {
	const normalized = normalizeLanguage(language);

	if (!content.trim()) {
		return <p className="p-5 text-sm text-muted-foreground">Nothing to preview yet.</p>;
	}

	if (isMarkdownLanguage(normalized)) return <MarkdownPreview content={content} />;
	return <CodePreview content={content} language={normalized} />;
}
