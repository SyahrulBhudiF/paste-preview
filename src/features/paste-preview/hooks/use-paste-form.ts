import { useForm, useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { createPaste } from "@/apis/paste";
import { clearDraft, usePasteDraft } from "@/features/paste-preview/hooks/use-paste-draft";
import { getPasteLanguageView } from "@/features/paste-preview/paste-language-view";
import { getShareLink, type SavedPaste } from "@/features/paste-preview/share-link";
import { detectPasteLanguage } from "@/libs/language";
import {
	DefaultPasteExpiry,
	PasteFormStandardSchema,
	type CreatePasteInput,
	type PasteFormValues,
} from "@/libs/schemas/paste";

const defaultValues: PasteFormValues = {
	content: "",
	language: "auto",
	title: "",
	expiresIn: DefaultPasteExpiry,
	password: "",
};

const toCreatePasteInput = (value: PasteFormValues): CreatePasteInput =>
	Object.assign(
		{
			content: value.content,
			language: value.language,
			title: value.title,
			expiresIn: value.expiresIn,
			detectedLanguage:
				value.language === "auto" ? detectPasteLanguage(value.content) : value.language,
		},
		value.password ? { password: value.password } : undefined,
	);

const toSavedPaste = (input: CreatePasteInput, url: string): SavedPaste => ({
	url,
	passwordProtected: Boolean(input.password),
	content: input.content,
	language: input.language,
	title: input.title ?? "",
	expiresIn: input.expiresIn ?? DefaultPasteExpiry,
});

export type PasteFormApi = ReturnType<typeof usePasteForm>["form"];

export function usePasteForm() {
	const queryClient = useQueryClient();
	const createPasteMutation = useMutation({
		mutationFn: async (input: CreatePasteInput) => {
			const result = await createPaste({ data: input });
			return { ...result, saved: toSavedPaste(input, result.url) };
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["paste"] });
			clearDraft();
			toast.success("Paste saved");
		},
		onError: () => {
			toast.error("Could not save paste");
		},
	});
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: PasteFormStandardSchema,
		},
		onSubmit: ({ value, formApi }) => {
			if (createPasteMutation.isPending) return;

			createPasteMutation.mutate(toCreatePasteInput(value), {
				onSuccess: () => formApi.setFieldValue("password", ""),
			});
		},
	});
	const content = useSelector(form.store, (state) => state.values.content);
	const language = useSelector(form.store, (state) => state.values.language);
	const title = useSelector(form.store, (state) => state.values.title);
	const expiresIn = useSelector(form.store, (state) => state.values.expiresIn);
	const password = useSelector(form.store, (state) => state.values.password);
	const languageView = useMemo(
		() => getPasteLanguageView(content, language),
		[content, language],
	);
	const hasContent = content.trim().length > 0;
	const savedPaste = createPasteMutation.data?.saved ?? null;
	const shareLink = getShareLink(savedPaste, {
		content,
		language,
		title,
		expiresIn,
		password,
	});

	usePasteDraft({ form, content, language, title, expiresIn });

	const copyShareUrl = async () => {
		if (!shareLink.shareUrl) return;

		try {
			await navigator.clipboard.writeText(shareLink.shareUrl);
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
		content,
		copyShareUrl,
		expiresIn,
		form,
		hasContent,
		isSaving: createPasteMutation.isPending,
		languageLabel: languageView.languageLabel,
		password,
		previewLanguage: languageView.previewLanguage,
		selectedLanguage: language,
		setPassword: (value: string) => form.setFieldValue("password", value),
		setContent: updateContent,
		sharePasswordProtected: shareLink.passwordProtected,
		shareUrl: shareLink.shareUrl,
	};
}
