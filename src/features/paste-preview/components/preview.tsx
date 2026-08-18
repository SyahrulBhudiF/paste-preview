import { CodePreview } from "./code";
import { HtmlPreview } from "./html";
import { MarkdownPreview } from "./markdown";
import { isHtmlLanguage, isMarkdownLanguage, normalizeLanguage } from "@/libs/language";

export function PastePreview({
	content,
	language,
	fullHeight = false,
}: {
	content: string;
	language: string;
	fullHeight?: boolean;
}) {
	const normalized = normalizeLanguage(language);

	if (!content.trim()) {
		return <p className="p-5 text-sm text-muted-foreground">Nothing to preview yet.</p>;
	}

	if (isMarkdownLanguage(normalized)) return <MarkdownPreview content={content} />;
	if (isHtmlLanguage(normalized))
		return <HtmlPreview content={content} fullHeight={fullHeight} />;
	return <CodePreview content={content} language={normalized} />;
}
