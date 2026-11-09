import { DateTime, Duration, Option } from "effect";
import { PasteExpirySeconds } from "@/infrastructure/config/paste";
import type { CreatedPaste, PasswordVerifier, StoredPaste } from "@/infrastructure/schemas/paste";
import { DefaultPasteExpiry, type CreatePasteInput, type PasteExpiry } from "@/libs/schemas/paste";

export const getExpiresAt = (expiresIn: PasteExpiry, now: DateTime.DateTime): string =>
	DateTime.formatIso(DateTime.addDuration(now, Duration.seconds(PasteExpirySeconds[expiresIn])));

interface CreatePasteRecordContext {
	id: string;
	now: DateTime.DateTime;
	passwordVerifier?: PasswordVerifier;
}

export const createPasteRecord = (
	input: CreatePasteInput,
	context: CreatePasteRecordContext,
): StoredPaste => {
	const expiresIn = input.expiresIn ?? DefaultPasteExpiry;
	const title = input.title?.trim();

	return Object.assign(
		{
			id: context.id,
			content: input.content,
			language: input.language,
			detectedLanguage: input.detectedLanguage ?? input.language,
			createdAt: DateTime.formatIso(context.now),
			expiresAt: getExpiresAt(expiresIn, context.now),
		},
		title ? { title } : undefined,
		context.passwordVerifier ? { passwordVerifier: context.passwordVerifier } : undefined,
	);
};

export const isExpired = (paste: StoredPaste, now: DateTime.DateTime): boolean => {
	const expiresAt = DateTime.make(paste.expiresAt);
	if (Option.isNone(expiresAt)) return true;
	return DateTime.isLessThanOrEqualTo(expiresAt.value, now);
};

export const toCreatedPaste = (paste: StoredPaste, origin: string): CreatedPaste => ({
	id: paste.id,
	url: `${origin}/p/${paste.id}`,
	expiresAt: paste.expiresAt,
});
