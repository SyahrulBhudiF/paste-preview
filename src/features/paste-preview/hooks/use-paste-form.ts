import { useForm, useSelector } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { createPaste } from "@/apis/paste";
import { useDebouncedValue } from "@/features/paste-preview/hooks/use-debounced-value";
import { clearDraft, usePasteDraft } from "@/features/paste-preview/hooks/use-paste-draft";
import { toCreatePasteInput, toSavedPaste } from "@/features/paste-preview/paste-commands";
import { getPasteLanguageView } from "@/features/paste-preview/paste-language-view";
import { getShareLink } from "@/features/paste-preview/share-link";
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
	const previewContent = useDebouncedValue(content, 150);
	const languageView = useMemo(
		() => getPasteLanguageView(previewContent, language),
		[previewContent, language],
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
		previewContent,
		previewLanguage: languageView.previewLanguage,
		selectedLanguage: language,
		setPassword: (value: string) => form.setFieldValue("password", value),
		setContent: updateContent,
		sharePasswordProtected: shareLink.passwordProtected,
		shareUrl: shareLink.shareUrl,
	};
}
