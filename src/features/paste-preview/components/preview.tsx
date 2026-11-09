import { memo, useState, useTransition } from "react";
import { CodePreview } from "./code";
import { HtmlPreview } from "./html";
import { MarkdownPreview } from "./markdown";
import { limitPreviewContent } from "@/features/paste-preview/preview-limit";
import { isHtmlLanguage, isMarkdownLanguage, normalizeLanguage } from "@/libs/language";

interface PastePreviewProps {
	content: string;
	language: string;
	showLineNumbers?: boolean;
	wrap?: boolean;
	characterLimit?: number;
}

export const PastePreview = memo(function PastePreview({
	content,
	language,
	showLineNumbers = true,
	wrap = false,
	characterLimit,
}: PastePreviewProps) {
	const normalized = normalizeLanguage(language);
	const [expandedContent, setExpandedContent] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const limit = characterLimit ?? Number.POSITIVE_INFINITY;
	const truncated = content.length > limit;
	const showFull = expandedContent === content;
	const previewContent = truncated && !showFull ? limitPreviewContent(content, limit) : content;

	if (!previewContent.trim()) {
		return <p className="px-3 py-2 text-xs text-muted-foreground">Nothing to preview yet.</p>;
	}

	const preview = isMarkdownLanguage(normalized) ? (
		<MarkdownPreview content={previewContent} />
	) : isHtmlLanguage(normalized) ? (
		<HtmlPreview content={previewContent} />
	) : (
		<CodePreview
			content={previewContent}
			language={normalized}
			showLineNumbers={showLineNumbers}
			wrap={wrap}
		/>
	);

	if (!truncated || showFull) return preview;

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground">
				<span>
					Preview limited to the first {limit.toLocaleString()} characters of{" "}
					{content.length.toLocaleString()}.
				</span>
				<button
					className="shrink-0 underline underline-offset-2 hover:text-foreground"
					type="button"
					onClick={() => startTransition(() => setExpandedContent(content))}
				>
					{isPending ? "Rendering full preview..." : "Show full preview"}
				</button>
			</div>
			<div className="min-h-0 flex-1">{preview}</div>
		</div>
	);
});
