import { css } from "@styled/css";
import { optionsGroupStyles } from "@/features/paste-preview/styles/code-options";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";

const styles = workspaceChrome({ actionBlocked: true });

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
		<div className={css(optionsGroupStyles)}>
			<button
				className={styles.action}
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
				className={styles.action}
				type="button"
				aria-pressed={wrap}
				onClick={() => onWrapChange(!wrap)}
			>
				Wrap: {wrap ? "on" : "off"}
			</button>
		</div>
	);
}
