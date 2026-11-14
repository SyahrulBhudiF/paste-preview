import { useState } from "react";
import { toast } from "sonner";
import { CodeEditor } from "@/features/paste-preview/components/code-editor";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { FieldErrors } from "@/features/paste-preview/components/form/field-errors";
import { PastePreview } from "@/features/paste-preview/components/preview";
import { panes } from "@/features/paste-preview/styles/panes";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { LivePreviewCharacterLimit } from "@/features/paste-preview/preview-limit";
import type { PasteFormValues } from "@/libs/schemas/paste";

const chrome = workspaceChrome();

interface PasteEditorPanesProps {
	form: PasteFormApi;
	content: string;
	previewContent: string;
	previewLanguage: PasteFormValues["language"];
	hasContent: boolean;
	onContentChange: (content: string) => void;
}

export function PasteEditorPanes({
	form,
	content,
	previewContent,
	previewLanguage,
	hasContent,
	onContentChange,
}: PasteEditorPanesProps) {
	const [activePane, setActivePane] = useState<"editor" | "preview">("editor");
	const [showLineNumbers, setShowLineNumbers] = useState(true);
	const [wrap, setWrap] = useState(false);
	const styles = panes({ pane: activePane });

	const toggleWrap = () => {
		const next = !wrap;
		setWrap(next);
		if (next) setShowLineNumbers(false);
	};

	const copySource = async () => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success("Source copied");
		} catch {
			toast.error("Could not copy source");
		}
	};

	return (
		<>
			<fieldset className={styles.switch} aria-label="Visible pane">
				<button
					className={chrome.tab}
					type="button"
					aria-pressed={activePane === "editor"}
					onClick={() => setActivePane("editor")}
				>
					Source
				</button>
				<button
					className={chrome.tab}
					type="button"
					aria-pressed={activePane === "preview"}
					onClick={() => setActivePane("preview")}
				>
					Preview
				</button>
			</fieldset>
			<div className={styles.grid}>
				<section className={styles.editorPane} aria-label="Source editor">
					<div className={chrome.toolbar}>
						<label className={chrome.label} htmlFor="paste-content">
							Source
						</label>
						<CodeOptions
							showLineNumbers={showLineNumbers}
							onLineNumbersChange={setShowLineNumbers}
							wrap={wrap}
							onWrapChange={toggleWrap}
							lineNumbersDisabled={wrap}
						/>
					</div>
					<form.Field name="content">
						{(field) => (
							<div className={styles.editorBody}>
								<CodeEditor
									content={field.state.value}
									onChange={onContentChange}
									showLineNumbers={showLineNumbers}
									wrap={wrap}
								/>
								<FieldErrors errors={field.state.meta.errors} />
							</div>
						)}
					</form.Field>
				</section>
				<section className={styles.previewPane} aria-label="Live preview">
					<div className={chrome.toolbar}>
						<h2 className={chrome.label}>Preview</h2>
						<button
							className={chrome.action}
							type="button"
							onClick={copySource}
							disabled={!hasContent}
						>
							Copy
						</button>
					</div>
					<div className={styles.previewBody}>
						<PastePreview
							content={previewContent}
							language={previewLanguage}
							showLineNumbers={showLineNumbers}
							wrap={wrap}
							characterLimit={LivePreviewCharacterLimit}
						/>
					</div>
				</section>
			</div>
		</>
	);
}
