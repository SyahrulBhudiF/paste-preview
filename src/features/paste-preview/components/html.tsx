import DOMPurify from "dompurify";
import { useMemo, useSyncExternalStore } from "react";
import { htmlPreview } from "@/features/paste-preview/styles/html";

const styles = htmlPreview();

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function sanitizeDocument(content: string) {
	return DOMPurify.sanitize(content, {
		FORBID_TAGS: ["base", "embed", "form", "iframe", "link", "meta", "object", "script"],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		WHOLE_DOCUMENT: true,
		RETURN_TRUSTED_TYPE: false,
	});
}

export function HtmlPreview({ content }: { content: string }) {
	const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
	const sanitized = useMemo(
		() => (isClient ? sanitizeDocument(content) : null),
		[isClient, content],
	);

	if (sanitized === null) {
		return <div className={styles.placeholder}>HTML preview loads in the browser.</div>;
	}

	return (
		<iframe
			className={styles.frame}
			title="HTML preview sandbox"
			sandbox=""
			srcDoc={sanitized}
		/>
	);
}
