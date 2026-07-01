import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPaste } from "@/apis/paste";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { PastePreview } from "./components/PastePreview";
import {
	detectPasteLanguage,
	normalizeLanguage,
	PasteLanguages,
	type PasteLanguage,
} from "@/features/paste-preview/language";

const DraftStorageKey = "paste-preview:draft";

interface PasteFormValues {
	content: string;
	language: PasteLanguage;
}

const defaultValues: PasteFormValues = {
	content: "",
	language: "auto",
};

export function PastePreviewFeature() {
	const [content, setContent] = useState(defaultValues.content);
	const [language, setLanguage] = useState<PasteLanguage>(defaultValues.language);
	const [activePane, setActivePane] = useState<"editor" | "preview">("editor");
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const selectedLanguage = language || "auto";
	const detectedLanguage = useMemo(() => detectPasteLanguage(content), [content]);
	const previewLanguage = selectedLanguage === "auto" ? detectedLanguage : selectedLanguage;
	const detectedLanguageLabel =
		PasteLanguages.find((item) => item.value === detectedLanguage)?.label ?? detectedLanguage;
	const languageLabel =
		selectedLanguage === "auto"
			? `Auto: ${detectedLanguageLabel}`
			: (PasteLanguages.find((item) => item.value === previewLanguage)?.label ??
				previewLanguage);
	const hasContent = content.trim().length > 0;

	const createPasteMutation = useMutation({
		mutationFn: (value: PasteFormValues) =>
			createPaste({
				data: {
					content: value.content,
					language: value.language,
					detectedLanguage:
						value.language === "auto"
							? detectPasteLanguage(value.content)
							: value.language,
				},
			}),
		onSuccess: (result) => {
			setShareUrl(result.url);
			localStorage.removeItem(DraftStorageKey);
		},
		onError: () => {
			setError("Could not save paste. Your editor content is still here.");
			toast.error("Could not save paste");
		},
	});

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			setError(null);
			setShareUrl(null);

			if (!value.content.trim()) {
				setError("Paste content is required.");
				return;
			}

			await createPasteMutation.mutateAsync(value);
		},
	});

	useEffect(() => {
		const raw = localStorage.getItem(DraftStorageKey);
		if (!raw) return;

		try {
			const draft = JSON.parse(raw) as Partial<PasteFormValues>;
			const draftContent = draft.content ?? "";
			const draftLanguage = draft.language ? normalizeLanguage(draft.language) : "auto";

			setContent(draftContent);
			setLanguage(draftLanguage);
			form.setFieldValue("content", draftContent);
			form.setFieldValue("language", draftLanguage);
		} catch {
			localStorage.removeItem(DraftStorageKey);
		}
	}, [form]);

	useEffect(() => {
		const handle = window.setTimeout(() => {
			localStorage.setItem(
				DraftStorageKey,
				JSON.stringify({ content, language: selectedLanguage }),
			);
		}, 500);
		return () => window.clearTimeout(handle);
	}, [content, selectedLanguage]);

	const copyShareUrl = async () => {
		if (!shareUrl) return;

		try {
			await navigator.clipboard.writeText(shareUrl);
			toast.success("Link copied");
		} catch {
			toast.error("Could not copy link");
		}
	};

	return (
		<main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_34rem),linear-gradient(135deg,var(--background),color-mix(in_oklch,var(--secondary)_38%,var(--background)))] text-foreground">
			<form
				className="mx-auto flex min-h-dvh min-w-0 w-full max-w-[1500px] flex-col gap-4 overflow-x-hidden px-4 py-4 md:h-dvh md:min-h-0 md:gap-5 md:overflow-hidden md:px-6 md:py-5 lg:px-8"
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					void form.handleSubmit();
				}}
			>
				{shareUrl ? (
					<div className="rounded-3xl border border-border/80 bg-card/90 p-3 shadow-sm">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="min-w-0 flex-1">
								<p className="text-xs font-medium text-muted-foreground">
									Public preview link
								</p>
								<Link
									className="block truncate text-sm text-primary underline-offset-4 hover:underline"
									to={shareUrl}
								>
									{shareUrl}
								</Link>
							</div>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								className="h-9 rounded-2xl px-4"
								onClick={copyShareUrl}
							>
								Copy link
							</Button>
						</div>
					</div>
				) : null}

				{error ? (
					<p className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</p>
				) : null}

				<div className="grid grid-cols-2 gap-2 rounded-2xl border bg-card/70 p-1 md:hidden">
					<Button
						type="button"
						variant={activePane === "editor" ? "default" : "ghost"}
						className="rounded-xl"
						onClick={() => setActivePane("editor")}
					>
						Editor
					</Button>
					<Button
						type="button"
						variant={activePane === "preview" ? "default" : "ghost"}
						className="rounded-xl"
						onClick={() => setActivePane("preview")}
					>
						Preview
					</Button>
				</div>

				<div className="flex flex-col gap-3 rounded-3xl border border-border/80 bg-card/80 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
					<form.Field name="language">
						{(field) => (
							<Select
								value={selectedLanguage}
								onValueChange={(value) => {
									const next = value as PasteLanguage;
									field.handleChange(next);
									setLanguage(next);
								}}
							>
								<SelectTrigger className="h-11 w-full rounded-2xl bg-background/80 sm:w-56">
									<span className="truncate">{languageLabel}</span>
								</SelectTrigger>
								<SelectContent>
									{PasteLanguages.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</form.Field>
					<Button
						type="submit"
						disabled={createPasteMutation.isPending || !hasContent}
						className="h-11 w-full rounded-2xl px-5 shadow-sm transition-transform active:scale-[0.98] sm:w-auto"
					>
						{createPasteMutation.isPending ? "Saving..." : "Save & share"}
					</Button>
				</div>

				<div className="grid min-h-[min(34rem,calc(100dvh-14rem))] min-w-0 flex-1 gap-5 md:min-h-0 md:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
					<section
						className={
							activePane === "preview"
								? "hidden md:flex md:min-h-0 md:min-w-0 md:flex-col"
								: "flex min-h-0 min-w-0 flex-col"
						}
					>
						<div className="mb-3">
							<label className="text-sm font-semibold" htmlFor="paste-content">
								Paste Preview
							</label>
							<p className="text-xs text-muted-foreground">
								Source · expires in 7 days
							</p>
						</div>

						<form.Field name="content">
							{(field) => (
								<textarea
									id="paste-content"
									value={field.state.value}
									onChange={(event) => {
										field.handleChange(event.target.value);
										setContent(event.target.value);
									}}
									className="min-h-0 flex-1 resize-none overflow-auto rounded-3xl border border-border/80 bg-card/90 p-5 font-mono text-sm leading-7 shadow-sm outline-none ring-offset-background transition focus:border-primary/70 focus:ring-4 focus:ring-primary/15"
									placeholder="Paste code, Markdown, JSON, shell commands, or notes..."
									spellCheck={false}
								/>
							)}
						</form.Field>
					</section>

					<section
						className={
							activePane === "editor"
								? "hidden md:flex md:min-h-0 md:min-w-0 md:flex-col"
								: "flex min-h-0 min-w-0 flex-col"
						}
					>
						<div className="mb-3">
							<h2 className="text-sm font-semibold">Preview</h2>
							<p className="text-xs text-muted-foreground">
								{content.length.toLocaleString()} chars
							</p>
						</div>
						<div className="min-h-0 min-w-0 max-w-full flex-1 overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-sm backdrop-blur">
							<PastePreview content={content} language={previewLanguage} />
						</div>
					</section>
				</div>
			</form>
		</main>
	);
}
