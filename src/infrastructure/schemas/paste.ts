import { Schema } from "effect";

export const PasswordVerifierSchema = Schema.Struct({
	salt: Schema.String,
	hash: Schema.String,
	iterations: Schema.Number,
});
export type PasswordVerifier = Schema.Schema.Type<typeof PasswordVerifierSchema>;

export const StoredPasteSchema = Schema.Struct({
	id: Schema.String,
	content: Schema.String,
	title: Schema.optional(Schema.String),
	language: Schema.String,
	detectedLanguage: Schema.String,
	createdAt: Schema.String,
	expiresAt: Schema.String,
	passwordVerifier: Schema.optional(PasswordVerifierSchema),
});
export type StoredPaste = Schema.Schema.Type<typeof StoredPasteSchema>;

export const PublicPasteSchema = Schema.Struct({
	id: Schema.String,
	content: Schema.String,
	title: Schema.optional(Schema.String),
	language: Schema.String,
	detectedLanguage: Schema.String,
	createdAt: Schema.String,
	expiresAt: Schema.String,
});
export type PublicPaste = Schema.Schema.Type<typeof PublicPasteSchema>;

export const PasteReadResultSchema = Schema.Union([
	Schema.Struct({ status: Schema.Literal("open"), paste: PublicPasteSchema }),
	Schema.Struct({ status: Schema.Literal("locked"), expiresAt: Schema.String }),
]);
export type PasteReadResult = Schema.Schema.Type<typeof PasteReadResultSchema>;

export const PasteUnlockResultSchema = Schema.Union([
	Schema.Struct({ status: Schema.Literal("unlocked"), paste: StoredPasteSchema }),
	Schema.Struct({ status: Schema.Literal("invalid") }),
	Schema.Struct({ status: Schema.Literal("rate-limited") }),
]);
export type PasteUnlockResult = Schema.Schema.Type<typeof PasteUnlockResultSchema>;

export const CreatedPasteSchema = Schema.Struct({
	id: Schema.String,
	url: Schema.String,
	expiresAt: Schema.String,
});
export type CreatedPaste = Schema.Schema.Type<typeof CreatedPasteSchema>;
