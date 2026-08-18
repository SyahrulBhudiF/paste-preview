import { SafeHtmlPreview } from "html-preview-sandbox/react";

export function HtmlPreview({ content }: { content: string }) {
	return (
		<SafeHtmlPreview
			className="h-full min-h-[32rem] w-full overflow-auto"
			csp="offline"
			sanitize={{ allowScripts: false, allowInlineEvents: false }}
			source={content}
		/>
	);
}
