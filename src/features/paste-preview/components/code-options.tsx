export function CodeOptions({
	showLineNumbers,
	onLineNumbersChange,
	wrap,
	onWrapChange,
}: {
	showLineNumbers: boolean;
	onLineNumbersChange: (value: boolean) => void;
	wrap: boolean;
	onWrapChange: (value: boolean) => void;
}) {
	return (
		<div className="flex items-center divide-x divide-border">
			<button
				className="code-action"
				type="button"
				aria-pressed={showLineNumbers}
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
