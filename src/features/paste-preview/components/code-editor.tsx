import { useRef } from "react";

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
	const mirrorRef = useRef<HTMLPreElement>(null);

	return (
		<div className="code-editor" data-line-numbers={showLineNumbers} data-wrap={wrap}>
			{showLineNumbers ? (
				<pre
					ref={(element) => {
						mirrorRef.current = element;
						if (element) element.scrollTop = editorRef.current?.scrollTop ?? 0;
					}}
					className="source-mirror"
					aria-hidden="true"
				>
					{content.split("\n").map((line, index) => (
						<span className="source-line" key={index + 1}>
							{line || "\u200b"}
						</span>
					))}
				</pre>
			) : null}
			<textarea
				ref={editorRef}
				id="paste-content"
				aria-label="Paste content"
				value={content}
				onChange={(event) => onChange(event.target.value)}
				onScroll={(event) => {
					if (mirrorRef.current)
						mirrorRef.current.scrollTop = event.currentTarget.scrollTop;
				}}
				placeholder="Paste code, Markdown, HTML, or notes..."
				spellCheck={false}
				wrap={wrap ? "soft" : "off"}
			/>
		</div>
	);
}
