import { useEffect } from "react";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { normalizeLanguage } from "@/libs/language";
import {
	DefaultPasteExpiry,
	parsePasteDraft,
	PasteExpiryOptions,
	serializePasteDraft,
	type PasteDraft,
	type PasteFormValues,
} from "@/libs/schemas/paste";

const DraftStorageKey = "paste-preview:draft";

export const clearDraft = () => localStorage.removeItem(DraftStorageKey);

interface PasteDraftInput {
	form: PasteFormApi;
	content: string;
	language: PasteFormValues["language"];
	title: string;
	expiresIn: PasteFormValues["expiresIn"];
}

export function usePasteDraft({ form, content, language, title, expiresIn }: PasteDraftInput) {
	useEffect(() => {
		const raw = localStorage.getItem(DraftStorageKey);
		if (!raw) return;

		try {
			const draft = parsePasteDraft(JSON.parse(raw));
			form.setFieldValue("content", draft.content ?? "");
			form.setFieldValue(
				"language",
				draft.language ? normalizeLanguage(draft.language) : "auto",
			);
			form.setFieldValue("title", draft.title ?? "");
			const draftExpiry = PasteExpiryOptions.find(
				(option) => option.value === draft.expiresIn,
			);
			form.setFieldValue("expiresIn", draftExpiry?.value ?? DefaultPasteExpiry);
		} catch {
			localStorage.removeItem(DraftStorageKey);
		}
	}, [form]);

	useEffect(() => {
		const handle = window.setTimeout(() => {
			const draft: PasteDraft = { content, language, title, expiresIn };
			localStorage.setItem(DraftStorageKey, serializePasteDraft(draft));
		}, 500);
		return () => window.clearTimeout(handle);
	}, [content, expiresIn, language, title]);
}
