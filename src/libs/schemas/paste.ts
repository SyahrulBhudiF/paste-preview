import { Schema } from "effect";

export const PasteLanguageSchema = Schema.Union([
  Schema.Literal("auto"),
  Schema.Literal("markdown"),
  Schema.Literal("typescript"),
  Schema.Literal("javascript"),
  Schema.Literal("json"),
  Schema.Literal("html"),
  Schema.Literal("css"),
  Schema.Literal("bash"),
  Schema.Literal("text"),
]);

export type PasteLanguage = Schema.Schema.Type<typeof PasteLanguageSchema>;

export const CreatePasteInputSchema = Schema.Struct({
  content: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(200_000)),
  language: PasteLanguageSchema,
  detectedLanguage: Schema.optional(Schema.String),
});

export type CreatePasteInput = Schema.Schema.Type<typeof CreatePasteInputSchema>;

export const GetPasteInputSchema = Schema.Struct({
  id: Schema.String.check(Schema.isMinLength(4), Schema.isMaxLength(64)),
});

export type GetPasteInput = Schema.Schema.Type<typeof GetPasteInputSchema>;

export const parseCreatePasteInput = Schema.decodeUnknownSync(CreatePasteInputSchema);
export const parseGetPasteInput = Schema.decodeUnknownSync(GetPasteInputSchema);
