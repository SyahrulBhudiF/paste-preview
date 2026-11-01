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

const defaultValues: PasteFormValues = {
	content: "",
	language: "auto",
	title: "",
	expiresIn: DefaultPasteExpiry,
};

export function usePasteForm() {
	const queryClient = useQueryClient();
	const [activePane, setActivePane] = useState<"editor" | "preview">("editor");
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const [password, setPassword] = useState("");
	const [sharePasswordProtected, setSharePasswordProtected] = useState(false);
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
			setShareUrl(result.url);
			setSharePasswordProtected(Boolean(value.password));
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
			setError(null);
			setShareUrl(null);

			if (!value.content.trim()) {
				setError("Paste content is required.");
				return;
			}

			await createPasteMutation.mutateAsync({ ...value, password });
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
