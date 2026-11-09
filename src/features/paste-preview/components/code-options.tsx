export function CodeOptions({
	showLineNumbers,
	onLineNumbersChange,
	wrap,
	onWrapChange,
	lineNumbersDisabled = false,
}: {
	showLineNumbers: boolean;
	onLineNumbersChange: (value: boolean) => void;
	wrap: boolean;
	onWrapChange: (value: boolean) => void;
	lineNumbersDisabled?: boolean;
}) {
	return (
		<div className="flex items-center divide-x divide-border">
			<button
				className="code-action disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				aria-pressed={showLineNumbers}
				disabled={lineNumbersDisabled}
				title={
					lineNumbersDisabled
						? "Line numbers are unavailable while wrapping is on."
						: undefined
				}
				onClick={() => onLineNumbersChange(!showLineNumbers)}
			>
				Line numbers: {showLineNumbers ? "on" : "off"}
			</button>
			<button
				className="code-action"
				type="button"
				aria-pressed={wrap}
				onClick={() => onWrapChange(!wrap)}
			>
				Wrap: {wrap ? "on" : "off"}
			</button>
		</div>
	);
}
