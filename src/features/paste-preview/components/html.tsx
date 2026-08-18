import { SafeHtmlPreview } from "html-preview-sandbox/react";

export function HtmlPreview({
	content,
	fullHeight = false,
}: {
	content: string;
	fullHeight?: boolean;
}) {
	const heightClass = fullHeight
		? "min-h-[calc(100dvh-12rem)] [&>iframe]:!min-h-[calc(100dvh-12rem)]"
		: "min-h-[32rem] [&>iframe]:!min-h-[32rem]";

	return (
		<SafeHtmlPreview
			className={`h-full w-full overflow-auto ${heightClass} [&>iframe]:!h-full`}
			csp="offline"
			sanitize={{ allowScripts: false, allowInlineEvents: false }}
			source={content}
		/>
	);
}
