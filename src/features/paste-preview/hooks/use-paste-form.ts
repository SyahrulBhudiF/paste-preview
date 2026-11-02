import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createPaste } from "@/apis/paste";
import {
	detectPasteLanguage,
	normalizeLanguage,
	PasteLanguages,
	type PasteLanguage,
} from "@/libs/language";
import {
	DefaultPasteExpiry,
	MaxPasteContentLength,
	parsePasteDraft,
	PasteExpiryOptions,
	type CreatePasteInput,
	type PasteExpiry,
} from "@/libs/schemas/paste";

const DraftStorageKey = "paste-preview:draft";

export interface PasteFormValues {
	content: string;
	language: PasteLanguage;
	title: string;
	expiresIn: PasteExpiry;
}

interface SavedPaste extends PasteFormValues {
	url: string;
	passwordProtected: boolean;
}

const defaultValues: PasteFormValues = {
	content: "",
	language: "auto",
	title: "",
	expiresIn: DefaultPasteExpiry,
};

export function usePasteForm() {
	const queryClient = useQueryClient();
	const [activePane, setActivePane] = useState<"editor" | "preview">("editor");
	const [password, setPassword] = useState("");
	const [savedPaste, setSavedPaste] = useState<SavedPaste | null>(null);
	const [error, setError] = useState<string | null>(null);

	const createPasteMutation = useMutation({
		mutationFn: (value: PasteFormValues & { password: string }) => {
			const data: CreatePasteInput = Object.assign(
				{
					content: value.content,
					language: value.language,
					title: value.title,
					expiresIn: value.expiresIn,
					detectedLanguage:
						value.language === "auto"
							? detectPasteLanguage(value.content)
							: value.language,
				},
				value.password ? { password: value.password } : undefined,
			);
			return createPaste({ data });
		},
		onSuccess: (result, value) => {
			void queryClient.invalidateQueries({ queryKey: ["paste"] });
			setSavedPaste({
				url: result.url,
				passwordProtected: Boolean(value.password),
				content: value.content,
				language: value.language,
				title: value.title,
				expiresIn: value.expiresIn,
			});
			setPassword("");
			localStorage.removeItem(DraftStorageKey);
			toast.success("Paste saved");
		},
		onError: () => {
			setError("Could not save paste. Your editor content is still here.");
			toast.error("Could not save paste");
		},
	});
	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			if (createPasteMutation.isPending) return;

			setError(null);

			if (!value.content.trim()) {
				setError("Paste content is required.");
				return;
			}

			if (value.content.length > MaxPasteContentLength) {
				setError(
					`Paste is too long. The limit is ${MaxPasteContentLength.toLocaleString()} characters.`,
				);
				return;
			}

			try {
				await createPasteMutation.mutateAsync({ ...value, password });
			} catch {
				// onError already surfaced the failure and kept the editor content.
			}
		},
	});
	const content = useStore(form.store, (state) => state.values.content);
	const language = useStore(form.store, (state) => state.values.language);
	const title = useStore(form.store, (state) => state.values.title);
	const expiresIn = useStore(form.store, (state) => state.values.expiresIn);
	const expiryLabel =
		PasteExpiryOptions.find((option) => option.value === expiresIn)?.label ?? "7 days";
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
	const currentSavedPaste =
		savedPaste &&
		savedPaste.content === content &&
		savedPaste.language === selectedLanguage &&
		savedPaste.title.trim() === title.trim() &&
		savedPaste.expiresIn === expiresIn
			? savedPaste
			: null;
	const shareUrl = currentSavedPaste?.url ?? null;
	const sharePasswordProtected = currentSavedPaste?.passwordProtected ?? false;

	useEffect(() => {
		const raw = localStorage.getItem(DraftStorageKey);
		if (!raw) return;

		try {
			const draft = parsePasteDraft(JSON.parse(raw));
			const draftContent = draft.content ?? "";
			const draftLanguage = draft.language ? normalizeLanguage(draft.language) : "auto";
			const draftTitle = draft.title ?? "";
			const draftExpiry = PasteExpiryOptions.find(
				(option) => option.value === draft.expiresIn,
			);

			form.setFieldValue("content", draftContent);
			form.setFieldValue("language", draftLanguage);
			form.setFieldValue("title", draftTitle);
			form.setFieldValue("expiresIn", draftExpiry?.value ?? DefaultPasteExpiry);
		} catch {
			localStorage.removeItem(DraftStorageKey);
		}
	}, [form]);

	useEffect(() => {
		const handle = window.setTimeout(() => {
			localStorage.setItem(
				DraftStorageKey,
				JSON.stringify({
					content,
					language: selectedLanguage,
					title,
					expiresIn,
				}),
			);
		}, 500);
		return () => window.clearTimeout(handle);
	}, [content, expiresIn, selectedLanguage, title]);

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
		form.setFieldValue("content", value);

		if (!value.trim()) {
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
		expiryLabel,
		expiresIn,
		previewLanguage,
		password,
		setPassword,
		selectedLanguage,
		sharePasswordProtected,
		title,
		setActivePane,
		setContent: updateContent,
		shareUrl,
	};
}
