import type { PasteFormValues } from "@/libs/schemas/paste";

export interface SavedPaste extends Omit<PasteFormValues, "password"> {
	url: string;
	passwordProtected: boolean;
}

export const isSamePaste = (saved: SavedPaste, values: PasteFormValues) =>
	saved.content === values.content &&
	saved.language === values.language &&
	saved.title.trim() === values.title.trim() &&
	saved.expiresIn === values.expiresIn;

export const getShareLink = (savedPaste: SavedPaste | null, values: PasteFormValues) => {
	const current = savedPaste && isSamePaste(savedPaste, values) ? savedPaste : null;

	return {
		shareUrl: current?.url ?? null,
		passwordProtected: current?.passwordProtected ?? false,
	};
};
