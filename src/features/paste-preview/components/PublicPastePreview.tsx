import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PastePreview } from "./PastePreview";
import { CodePreview } from "./CodePreview";
import { formatExpiry } from "@/libs/utils/time";
import type { StoredPaste } from "@/infrastructure/schemas/paste";

export function PublicPastePreview({ paste }: { paste: StoredPaste }) {
	const [mode, setMode] = useState<"preview" | "source">("preview");
	const language = paste.language === "auto" ? paste.detectedLanguage : paste.language;

	return (
		<main className="min-h-screen bg-background text-foreground">
			<section className="mx-auto w-full max-w-5xl space-y-4 p-4 md:p-6">
				<header className="rounded-lg border bg-card p-4 shadow-sm">
					<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div>
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Shared paste
							</p>
							<h1 className="text-xl font-semibold">{language}</h1>
						</div>
						<div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
							<span>{formatExpiry(paste.expiresAt)}</span>
							<Button
								size="sm"
								variant="outline"
								onClick={() =>
									setMode((current) =>
										current === "preview" ? "source" : "preview",
									)
								}
							>
								{mode === "preview" ? "View Source" : "View Preview"}
							</Button>
						</div>
					</div>
				</header>

				<div className="rounded-lg border bg-card p-4 shadow-sm">
					{mode === "preview" ? (
						<PastePreview content={paste.content} language={language} />
					) : (
						<CodePreview content={paste.content} language={language} />
					)}
				</div>
			</section>
		</main>
	);
}
