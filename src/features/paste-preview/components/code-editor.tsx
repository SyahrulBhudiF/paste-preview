import { useMemo, useRef } from "react";
import { MaxPasteContentLength } from "@/libs/schemas/paste";

const buildLineNumbers = (lineCount: number) =>
	Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");

export function CodeEditor({
	content,
	onChange,
	showLineNumbers,
	wrap,
}: {
	content: string;
	onChange: (content: string) => void;
	showLineNumbers: boolean;
	wrap: boolean;
}) {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const gutterRef = useRef<HTMLPreElement>(null);
	const lineCount = content.split("\n").length;
	const lineNumbers = useMemo(() => buildLineNumbers(lineCount), [lineCount]);

	return (
		<div className="code-editor" data-line-numbers={showLineNumbers} data-wrap={wrap}>
			{showLineNumbers ? (
				<pre ref={gutterRef} className="source-gutter" aria-hidden="true">
					{lineNumbers}
				</pre>
			) : null}
			<textarea
				ref={editorRef}
				id="paste-content"
				aria-label="Paste content"
				value={content}
				maxLength={MaxPasteContentLength}
				onChange={(event) => onChange(event.target.value)}
				onScroll={(event) => {
					if (gutterRef.current)
						gutterRef.current.scrollTop = event.currentTarget.scrollTop;
				}}
				placeholder="Paste code, Markdown, HTML, or notes..."
				spellCheck={false}
				wrap={wrap ? "soft" : "off"}
			/>
		</div>
	);
}
