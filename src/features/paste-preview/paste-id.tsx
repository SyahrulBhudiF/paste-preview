import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CodePreview } from "@/features/paste-preview/components/code";
import { PastePreview } from "@/features/paste-preview/components/preview";
import { formatExpiry } from "@/libs/utils/time";
import type { StoredPaste } from "@/infrastructure/schemas/paste";

export function PasteIdPage({ paste }: { paste: StoredPaste }) {
	const [mode, setMode] = useState<"preview" | "source">("preview");
	const language = paste.language === "auto" ? paste.detectedLanguage : paste.language;

	const copySource = async () => {
		try {
			await navigator.clipboard.writeText(paste.content);
			toast.success("Source copied");
		} catch {
			toast.error("Could not copy source");
		}
	};

	return (
		<main className="min-h-dvh bg-background text-foreground">
			<section className="mx-auto w-full max-w-5xl space-y-5 px-4 py-4 md:px-6 md:py-5 lg:px-8">
				<header className="rounded-3xl border border-border/80 bg-card/85 px-5 py-4 shadow-sm backdrop-blur">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="min-w-0">
							<p className="text-xs font-medium text-muted-foreground">
								Shared paste · {formatExpiry(paste.expiresAt)}
							</p>
							<h1 className="truncate text-xl font-semibold">{language}</h1>
						</div>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<Button
								type="button"
								size="sm"
								variant="secondary"
								className="h-9 rounded-2xl px-4"
								onClick={copySource}
							>
								<Copy className="size-4" />
								Copy source
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="h-9 rounded-2xl px-4"
								onClick={() =>
									setMode((current) =>
										current === "preview" ? "source" : "preview",
									)
								}
							>
								{mode === "preview" ? "View source" : "View preview"}
							</Button>
						</div>
					</div>
				</header>

				<section className="rounded-3xl border border-border/80 bg-card/85 shadow-sm backdrop-blur">
					{mode === "preview" ? (
						<div className="p-5">
							<PastePreview content={paste.content} language={language} />
						</div>
					) : (
						<CodePreview content={paste.content} language={language} />
					)}
				</section>
			</section>
		</main>
	);
}
