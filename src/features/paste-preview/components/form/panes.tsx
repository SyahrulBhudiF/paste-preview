import { useState } from "react";
import { toast } from "sonner";
import { CodeEditor } from "@/features/paste-preview/components/code-editor";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { FieldErrors } from "@/features/paste-preview/components/form/field-errors";
import { PastePreview } from "@/features/paste-preview/components/preview";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { LivePreviewCharacterLimit } from "@/features/paste-preview/preview-limit";
import { cn } from "@/libs/utils/cn";
import type { PasteFormValues } from "@/libs/schemas/paste";

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
			<fieldset
				className="flex min-w-0 shrink-0 border border-b-0 border-border bg-secondary/50 md:hidden"
				aria-label="Visible pane"
			>
				<button
					className="pane-tab"
					type="button"
					aria-pressed={activePane === "editor"}
					onClick={() => setActivePane("editor")}
				>
					Source
				</button>
				<button
					className="pane-tab"
					type="button"
					aria-pressed={activePane === "preview"}
					onClick={() => setActivePane("preview")}
				>
					Preview
				</button>
			</fieldset>
			<div className="grid min-h-0 min-w-0 flex-1 border border-border bg-card md:grid-cols-2">
				<section
					aria-label="Source editor"
					className={cn(
						"min-h-0 min-w-0 flex-col md:flex",
						activePane === "editor" ? "flex" : "hidden",
					)}
				>
					<div className="pane-toolbar">
						<label className="pane-label" htmlFor="paste-content">
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
							<div className="flex min-h-0 min-w-0 flex-1 flex-col">
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
				<section
					aria-label="Live preview"
					className={cn(
						"min-h-0 min-w-0 flex-col md:flex md:border-l md:border-border",
						activePane === "preview" ? "flex" : "hidden",
					)}
				>
					<div className="pane-toolbar">
						<h2 className="pane-label">Preview</h2>
						<button
							className="code-action"
							type="button"
							onClick={copySource}
							disabled={!hasContent}
						>
							Copy
						</button>
					</div>
					<div className="min-h-0 min-w-0 flex-1 overflow-hidden">
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
