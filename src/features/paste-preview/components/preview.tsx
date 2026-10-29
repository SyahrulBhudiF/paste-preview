import { CodePreview } from "./code";
import { HtmlPreview } from "./html";
import { MarkdownPreview } from "./markdown";
import { isHtmlLanguage, isMarkdownLanguage, normalizeLanguage } from "@/libs/language";

export function PastePreview({
	content,
	language,
	showLineNumbers = true,
	wrap = false,
}: {
	content: string;
	language: string;
	showLineNumbers?: boolean;
	wrap?: boolean;
}) {
	const normalized = normalizeLanguage(language);

	if (!content.trim()) {
		return <p className="px-3 py-2 text-xs text-muted-foreground">Nothing to preview yet.</p>;
	}

	if (isMarkdownLanguage(normalized)) return <MarkdownPreview content={content} />;
	if (isHtmlLanguage(normalized)) return <HtmlPreview content={content} />;
	return (
		<CodePreview
			content={content}
			language={normalized}
			showLineNumbers={showLineNumbers}
			wrap={wrap}
		/>
	);
}
