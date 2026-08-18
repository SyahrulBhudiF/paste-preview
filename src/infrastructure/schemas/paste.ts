import { Schema } from "effect";

export const StoredPasteSchema = Schema.Struct({
	id: Schema.String,
	content: Schema.String,
	language: Schema.String,
	detectedLanguage: Schema.String,
	createdAt: Schema.String,
	expiresAt: Schema.String,
});
export type StoredPaste = Schema.Schema.Type<typeof StoredPasteSchema>;

export const CreatedPasteSchema = Schema.Struct({
	id: Schema.String,
	url: Schema.String,
	expiresAt: Schema.String,
});
export type CreatedPaste = Schema.Schema.Type<typeof CreatedPasteSchema>;
