import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { CodePreview } from "@/features/paste-preview/components/code";
import { PastePreview } from "@/features/paste-preview/components/preview";
import { isHtmlLanguage, isMarkdownLanguage, PasteLanguages } from "@/libs/language";
import { formatExpiry } from "@/libs/utils/time";
import type { StoredPaste } from "@/infrastructure/schemas/paste";

export function PasteIdPage({ paste }: { paste: StoredPaste }) {
	const [mode, setMode] = useState<"preview" | "source">("preview");
	const [showLineNumbers, setShowLineNumbers] = useState(true);
	const [wrap, setWrap] = useState(false);
	const language = paste.language === "auto" ? paste.detectedLanguage : paste.language;
	const languageLabel = PasteLanguages.find((item) => item.value === language)?.label ?? language;
	const hasRenderedPreview = isHtmlLanguage(language) || isMarkdownLanguage(language);
	const showSource = mode === "source" || !hasRenderedPreview;

	const copySource = async () => {
		try {
			await navigator.clipboard.writeText(paste.content);
			toast.success("Source copied");
		} catch {
			toast.error("Could not copy source");
		}
	};

	return (
		<main className="flex h-dvh min-w-0 flex-col overflow-hidden bg-background px-2 pb-2 text-foreground sm:px-3 sm:pb-3">
			<header className="app-header">
				<Link className="app-wordmark" to="/">
					paste<span>/</span>preview
				</Link>
				<h1 className="min-w-0 truncate text-xs text-muted-foreground">{languageLabel}</h1>
				<Button asChild size="sm" className="ml-auto shrink-0">
					<Link to="/">New paste</Link>
				</Button>
			</header>
			<section
				className="flex min-h-0 min-w-0 flex-1 flex-col border border-border bg-card"
				aria-label="Shared paste"
			>
				<div className="pane-toolbar flex-wrap">
					<span className="pane-label">{showSource ? "Source" : "Preview"}</span>
					{showSource ? (
						<CodeOptions
							showLineNumbers={showLineNumbers}
							onLineNumbersChange={setShowLineNumbers}
							wrap={wrap}
							onWrapChange={setWrap}
						/>
					) : null}
					{hasRenderedPreview ? (
						<button
							className="code-action"
							type="button"
							onClick={() =>
								setMode((current) => (current === "preview" ? "source" : "preview"))
							}
						>
							{showSource ? "View preview" : "View source"}
						</button>
					) : null}
					<button className="code-action" type="button" onClick={copySource}>
						Copy source
					</button>
				</div>
				<div className="min-h-0 min-w-0 flex-1 overflow-hidden">
					{showSource ? (
						<CodePreview
							content={paste.content}
							language={language}
							showLineNumbers={showLineNumbers}
							wrap={wrap}
						/>
					) : (
						<PastePreview content={paste.content} language={language} />
					)}
				</div>
			</section>
			<footer className="workspace-status">
				<span>
					{paste.content.split("\n").length.toLocaleString()} lines ·{" "}
					{paste.content.length.toLocaleString()} characters
				</span>
				<span>{formatExpiry(paste.expiresAt)}</span>
			</footer>
		</main>
	);
}
