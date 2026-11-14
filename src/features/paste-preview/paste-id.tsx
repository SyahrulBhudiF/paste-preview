import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { css } from "@styled/css";
import { ButtonLink } from "@/components/ui/button";
import {
	LockedPastePanel,
	PasteWorkspace,
} from "@/features/paste-preview/components/paste-workspace";
import { UnlockPasteDialog } from "@/features/paste-preview/components/unlock-paste-dialog";
import {
	newPasteLinkStyles,
	pageMainStyles,
	pageTitleStyles,
} from "@/features/paste-preview/styles/paste-id";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import type { PasteReadResult, PublicPaste } from "@/infrastructure/schemas/paste";
import { PasteLanguages } from "@/libs/language";

const chrome = workspaceChrome();

const getPasteDisplayTitle = (paste: PublicPaste) => {
	if (paste.title) return paste.title;

	const language = paste.language === "auto" ? paste.detectedLanguage : paste.language;
	return PasteLanguages.find((item) => item.value === language)?.label ?? language;
};

export function PasteIdPage({ paste, pasteId }: { paste: PasteReadResult; pasteId: string }) {
	const [unlockedPaste, setUnlockedPaste] = useState<PublicPaste | null>(
		paste.status === "open" ? paste.paste : null,
	);
	const [unlockDialogOpen, setUnlockDialogOpen] = useState(paste.status === "locked");
	const pageContent =
		paste.status === "open"
			? { status: "open" as const, paste: paste.paste }
			: unlockedPaste
				? { status: "open" as const, paste: unlockedPaste }
				: { status: "locked" as const, expiresAt: paste.expiresAt };
	const title =
		pageContent.status === "open"
			? getPasteDisplayTitle(pageContent.paste)
			: "Password protected paste";

	return (
		<main className={css(pageMainStyles)}>
			<header className={chrome.header}>
				<Link className={chrome.wordmark} to="/">
					paste<span>/</span>preview
				</Link>
				<h1 className={css(pageTitleStyles)}>{title}</h1>
				<ButtonLink className={css(newPasteLinkStyles)} size="sm" to="/">
					New paste
				</ButtonLink>
			</header>
			{pageContent.status === "open" ? (
				<PasteWorkspace paste={pageContent.paste} />
			) : (
				<LockedPastePanel
					expiresAt={pageContent.expiresAt}
					dialogOpen={unlockDialogOpen}
					onUnlock={() => setUnlockDialogOpen(true)}
				/>
			)}
			{paste.status === "locked" ? (
				<UnlockPasteDialog
					expiresAt={paste.expiresAt}
					open={unlockDialogOpen}
					onOpenChange={setUnlockDialogOpen}
					onUnlocked={setUnlockedPaste}
					pasteId={pasteId}
				/>
			) : null}
		</main>
	);
}
