import DOMPurify from "dompurify";

function sanitizeDocument(content: string) {
	return DOMPurify.sanitize(content, {
		FORBID_TAGS: ["base", "embed", "form", "iframe", "link", "meta", "object", "script"],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		WHOLE_DOCUMENT: true,
		RETURN_TRUSTED_TYPE: false,
	});
}

export function HtmlPreview({
	content,
	fullHeight = false,
}: {
	content: string;
	fullHeight?: boolean;
}) {
	const heightClass = fullHeight ? "h-[calc(100dvh-12rem)]" : "h-[32rem]";

	return (
		<iframe
			className={`block w-full overflow-auto border-0 bg-white ${heightClass}`}
			title="HTML preview sandbox"
			sandbox=""
			srcDoc={sanitizeDocument(content)}
		/>
	);
}
