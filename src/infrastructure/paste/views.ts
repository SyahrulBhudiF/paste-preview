import type { PasteReadResult, PublicPaste, StoredPaste } from "@/infrastructure/schemas/paste";

/**
 * Explicit projection from the stored record to the public response. Storage-only
 * fields such as `passwordVerifier` must never be added here.
 */
export const toPublicPaste = (paste: StoredPaste): PublicPaste =>
	Object.assign(
		{
			id: paste.id,
			content: paste.content,
			language: paste.language,
			detectedLanguage: paste.detectedLanguage,
			createdAt: paste.createdAt,
			expiresAt: paste.expiresAt,
		},
		paste.title ? { title: paste.title } : undefined,
	);

export const toPasteReadResult = (paste: StoredPaste): PasteReadResult =>
	paste.passwordVerifier
		? { status: "locked", expiresAt: paste.expiresAt }
		: { status: "open", paste: toPublicPaste(paste) };
