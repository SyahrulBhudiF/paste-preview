import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { CodeEditor } from "@/features/paste-preview/components/code-editor";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { PastePreview } from "@/features/paste-preview/components/preview";
import { usePasteForm } from "@/features/paste-preview/hooks/use-paste-form";
import { PasteLanguages } from "@/libs/language";
import { cn } from "@/libs/utils/cn";

export function PasteForm() {
	const {
		activePane,
		content,
		copyShareUrl,
		createPasteMutation,
		error,
		form,
		hasContent,
		languageLabel,
		previewLanguage,
		selectedLanguage,
		setActivePane,
		setContent,
		setLanguage,
		shareUrl,
	} = usePasteForm();
	const [showLineNumbers, setShowLineNumbers] = useState(true);
	const [wrap, setWrap] = useState(false);
	const lineCount = content.split("\n").length;

	const copySource = async () => {
		try {
			await navigator.clipboard.writeText(content);
			toast.success("Source copied");
		} catch {
			toast.error("Could not copy source");
		}
	};

	return (
		<form
			className="flex h-full min-h-0 min-w-0 flex-col px-2 pb-2 sm:px-3 sm:pb-3"
			action={() => void form.handleSubmit()}
		>
			<header className="app-header">
				<h1 className="app-wordmark">
					paste<span>/</span>preview
				</h1>
				<form.Field name="language">
					{(field) => (
						<Combobox
							items={PasteLanguages}
							value={
								PasteLanguages.find((item) => item.value === selectedLanguage) ??
								null
							}
							itemToStringLabel={(item) =>
								item.value === "auto" && selectedLanguage === "auto"
									? languageLabel
									: item.label
							}
							itemToStringValue={(item) => item.label}
							onValueChange={(item) => {
								if (!item) return;
								const next = item.value;
								field.handleChange(next);
								setLanguage(next);
							}}
						>
							<ComboboxInput
								aria-label="Language"
								placeholder={languageLabel}
								className="w-26 min-[380px]:w-32 sm:w-44"
							/>
							<ComboboxContent>
								<ComboboxEmpty>No languages found.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem key={item.value} value={item}>
											{item.label}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
					)}
				</form.Field>
				<span className="ml-auto hidden text-xs text-muted-foreground sm:block">
					Expires in 7 days
				</span>
				<Button
					type="submit"
					size="sm"
					disabled={createPasteMutation.isPending || !hasContent}
					className="ml-auto shrink-0 sm:ml-0"
				>
					{createPasteMutation.isPending ? "Saving..." : "Save & share"}
				</Button>
			</header>

			{shareUrl ? (
				<output className="mb-2 flex min-w-0 items-center gap-3 border border-border bg-secondary px-3 py-1.5 text-xs">
					<span className="shrink-0 text-muted-foreground">Public link</span>
					<Link
						className="min-w-0 flex-1 truncate text-primary underline underline-offset-4"
						to={shareUrl}
					>
						{shareUrl}
					</Link>
					<Button type="button" size="sm" variant="ghost" onClick={copyShareUrl}>
						Copy link
					</Button>
				</output>
			) : null}
			{error ? (
				<p
					role="alert"
					className="mb-2 border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
				>
					{error}
				</p>
			) : null}

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
							onWrapChange={setWrap}
						/>
					</div>
					<form.Field name="content">
						{(field) => (
							<CodeEditor
								content={field.state.value}
								onChange={(value) => {
									field.handleChange(value);
									setContent(value);
								}}
								showLineNumbers={showLineNumbers}
								wrap={wrap}
							/>
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
							content={content}
							language={previewLanguage}
							showLineNumbers={showLineNumbers}
							wrap={wrap}
						/>
					</div>
				</section>
			</div>
			<footer className="workspace-status">
				<span>
					{lineCount.toLocaleString()} lines · {content.length.toLocaleString()}{" "}
					characters · UTF-8
				</span>
				<span className="hidden sm:inline">{languageLabel}</span>
				<span className="sm:hidden">Expires in 7 days</span>
			</footer>
		</form>
	);
}
