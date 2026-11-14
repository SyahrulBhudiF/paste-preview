import { memo, useState, useTransition } from "react";
import { CodePreview } from "./code";
import { HtmlPreview } from "./html";
import { MarkdownPreview } from "./markdown";
import { limitPreviewContent } from "@/features/paste-preview/preview-limit";
import { preview } from "@/features/paste-preview/styles/preview";
import { isHtmlLanguage, isMarkdownLanguage, normalizeLanguage } from "@/libs/language";

const styles = preview();

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
		return <p className={styles.empty}>Nothing to preview yet.</p>;
	}

	const previewNode = isMarkdownLanguage(normalized) ? (
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

	if (!truncated || showFull) return previewNode;

	return (
		<div className={styles.limited}>
			<div className={styles.banner}>
				<span>
					Preview limited to the first {limit.toLocaleString()} characters of{" "}
					{content.length.toLocaleString()}.
				</span>
				<button
					className={styles.showFull}
					type="button"
					onClick={() => startTransition(() => setExpandedContent(content))}
				>
					{isPending ? "Rendering full preview..." : "Show full preview"}
				</button>
			</div>
			<div className={styles.body}>{previewNode}</div>
		</div>
	);
});
