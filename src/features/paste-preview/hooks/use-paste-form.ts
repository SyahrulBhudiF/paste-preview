import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPaste } from "@/apis/paste";
import {
	detectPasteLanguage,
	normalizeLanguage,
	PasteLanguages,
	type PasteLanguage,
} from "@/libs/language";

const DraftStorageKey = "paste-preview:draft";

export interface PasteFormValues {
	content: string;
	language: PasteLanguage;
}

const defaultValues: PasteFormValues = {
	content: "",
	language: "auto",
};

export function usePasteForm() {
	const queryClient = useQueryClient();
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
			void queryClient.invalidateQueries({ queryKey: ["paste"] });
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

	const updateContent = (value: string) => {
		setContent(value);

		if (!value.trim()) {
			setLanguage("auto");
			form.setFieldValue("language", "auto");
		}
	};

	return {
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
		setContent: updateContent,
		setLanguage,
		shareUrl,
	};
}
