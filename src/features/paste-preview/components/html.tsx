import DOMPurify from "dompurify";

function sanitizeDocument(content: string) {
	return DOMPurify.sanitize(content, {
		FORBID_TAGS: ["base", "embed", "form", "iframe", "link", "meta", "object", "script"],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		WHOLE_DOCUMENT: true,
		RETURN_TRUSTED_TYPE: false,
	});
}

export function HtmlPreview({ content }: { content: string }) {
	return (
		<iframe
			className="block h-full w-full border-0 bg-white"
			title="HTML preview sandbox"
			sandbox=""
			srcDoc={sanitizeDocument(content)}
		/>
	);
}
