import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button-variants";
import {
	LockedPastePanel,
	PasteWorkspace,
} from "@/features/paste-preview/components/paste-workspace";
import { UnlockPasteDialog } from "@/features/paste-preview/components/unlock-paste-dialog";
import type { PasteReadResult, PublicPaste } from "@/infrastructure/schemas/paste";
import { PasteLanguages } from "@/libs/language";

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
		<main className="flex h-dvh min-w-0 flex-col overflow-hidden bg-background px-2 pb-2 text-foreground sm:px-3 sm:pb-3">
			<header className="app-header">
				<Link className="app-wordmark" to="/">
					paste<span>/</span>preview
				</Link>
				<h1 className="min-w-0 truncate text-xs text-muted-foreground">{title}</h1>
				<Link
					className={buttonVariants({ size: "sm", className: "ml-auto shrink-0" })}
					to="/"
				>
					New paste
				</Link>
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
