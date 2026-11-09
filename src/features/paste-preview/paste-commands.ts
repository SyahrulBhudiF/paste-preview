import type { SavedPaste } from "@/features/paste-preview/share-link";
import { detectPasteLanguage } from "@/libs/language";
import {
	DefaultPasteExpiry,
	type CreatePasteInput,
	type PasteFormValues,
} from "@/libs/schemas/paste";

export const toCreatePasteInput = (value: PasteFormValues): CreatePasteInput =>
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

export const toSavedPaste = (input: CreatePasteInput, url: string): SavedPaste => ({
	url,
	passwordProtected: Boolean(input.password),
	content: input.content,
	language: input.language,
	title: input.title ?? "",
	expiresIn: input.expiresIn ?? DefaultPasteExpiry,
});
