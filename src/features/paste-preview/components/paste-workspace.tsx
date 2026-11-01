import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { CodePreview } from "@/features/paste-preview/components/code";
import { PastePreview } from "@/features/paste-preview/components/preview";
import type { PublicPaste } from "@/infrastructure/schemas/paste";
import { isHtmlLanguage, isMarkdownLanguage } from "@/libs/language";
import { formatExpiry } from "@/libs/utils/time";

export function PasteWorkspace({ paste }: { paste: PublicPaste }) {
	const [mode, setMode] = useState<"preview" | "source">("preview");
	const [showLineNumbers, setShowLineNumbers] = useState(true);
	const [wrap, setWrap] = useState(false);
	const language = paste.language === "auto" ? paste.detectedLanguage : paste.language;
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
		<>
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
		</>
	);
}

export function LockedPastePanel({
	expiresAt,
	dialogOpen,
	onUnlock,
}: {
	expiresAt: string;
	dialogOpen: boolean;
	onUnlock: () => void;
}) {
	return (
		<section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 border border-border bg-card px-4 text-center">
			<h2 className="text-sm font-semibold">This paste is password-protected</h2>
			<p className="max-w-sm text-sm text-muted-foreground">
				Enter the password shared by the paste’s creator to view its contents.
			</p>
			<Button type="button" onClick={onUnlock}>
				Enter password
			</Button>
			{!dialogOpen ? (
				<footer className="workspace-status absolute bottom-2 left-3 right-3">
					<span>{formatExpiry(expiresAt)}</span>
				</footer>
			) : null}
		</section>
	);
}
