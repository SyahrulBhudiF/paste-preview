import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodeOptions } from "@/features/paste-preview/components/code-options";
import { CodePreview } from "@/features/paste-preview/components/code";
import { PastePreview } from "@/features/paste-preview/components/preview";
import { pasteWorkspace } from "@/features/paste-preview/styles/paste-workspace";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import type { PublicPaste } from "@/infrastructure/schemas/paste";
import { downloadText, getDownloadName } from "@/libs/download";
import { isHtmlLanguage, isMarkdownLanguage, normalizeLanguage } from "@/libs/language";
import { formatExpiry } from "@/libs/utils/time";

const styles = pasteWorkspace();
const chrome = workspaceChrome({ toolbarWrap: true });
const floatingChrome = workspaceChrome({ statusFloating: true });

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

	const downloadSource = () => {
		downloadText(paste.content, getDownloadName(normalizeLanguage(language)));
	};

	return (
		<>
			<section className={styles.root} aria-label="Shared paste">
				<div className={chrome.toolbar}>
					<span className={chrome.label}>{showSource ? "Source" : "Preview"}</span>
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
							className={chrome.action}
							type="button"
							onClick={() =>
								setMode((current) => (current === "preview" ? "source" : "preview"))
							}
						>
							{showSource ? "View preview" : "View source"}
						</button>
					) : null}
					<button className={chrome.action} type="button" onClick={copySource}>
						Copy source
					</button>
					<button className={chrome.action} type="button" onClick={downloadSource}>
						Download
					</button>
				</div>
				<div className={styles.body}>
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
			<footer className={chrome.status}>
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
		<section className={styles.lockedRoot}>
			<h2 className={styles.lockedTitle}>This paste is password-protected</h2>
			<p className={styles.lockedDescription}>
				Enter the password shared by the paste’s creator to view its contents.
			</p>
			<Button type="button" onClick={onUnlock}>
				Enter password
			</Button>
			{!dialogOpen ? (
				<footer className={floatingChrome.status}>
					<span>{formatExpiry(expiresAt)}</span>
				</footer>
			) : null}
		</section>
	);
}
