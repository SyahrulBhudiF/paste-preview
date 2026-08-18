import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";

const RESIZE_MESSAGE = "paste-preview:html-resize";
const MAX_HEIGHT = 1_000_000;

function buildDocument(content: string) {
	const sanitized = DOMPurify.sanitize(content, {
		FORBID_TAGS: ["base", "embed", "form", "iframe", "link", "meta", "object"],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		WHOLE_DOCUMENT: true,
		RETURN_TRUSTED_TYPE: false,
	});
	const bridge = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; script-src 'unsafe-inline';">
<script>
(() => {
  const type = ${JSON.stringify(RESIZE_MESSAGE)};
  let lastHeight = 0;
  const report = () => {
    const root = document.documentElement;
    const body = document.body;
    const height = Math.ceil(Math.max(root?.scrollHeight || 0, root?.offsetHeight || 0, body?.scrollHeight || 0, body?.offsetHeight || 0));
    if (height > 0 && height !== lastHeight) {
      lastHeight = height;
      parent.postMessage({ type, height }, '*');
    }
  };
  new ResizeObserver(report).observe(document.documentElement);
  addEventListener('load', report);
  report();
})();
</scr${"ipt"}>`;
	return sanitized.includes("</head>")
		? sanitized.replace("</head>", `${bridge}</head>`)
		: `${sanitized}${bridge}`;
}

export function HtmlPreview({
	content,
	fullHeight = false,
}: {
	content: string;
	fullHeight?: boolean;
}) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const heightClass = fullHeight ? "min-h-[calc(100dvh-12rem)]" : "min-h-[32rem]";

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.source !== iframeRef.current?.contentWindow) return;
			if (event.data?.type !== RESIZE_MESSAGE) return;
			const height = Number(event.data.height);
			if (Number.isFinite(height) && height >= 1 && height <= MAX_HEIGHT) {
				iframeRef.current!.style.height = `${Math.ceil(height)}px`;
			}
		};
		addEventListener("message", handleMessage);
		return () => removeEventListener("message", handleMessage);
	}, []);

	return (
		<iframe
			ref={iframeRef}
			className={`block h-full w-full border-0 bg-white ${heightClass}`}
			title="HTML preview sandbox"
			sandbox="allow-scripts"
			srcDoc={buildDocument(content)}
		/>
	);
}
