import { Schema } from "effect";

const PasteLanguageSchema = Schema.Union([
	Schema.Literal("auto"),
	Schema.Literal("markdown"),
	Schema.Literal("typescript"),
	Schema.Literal("javascript"),
	Schema.Literal("jsx"),
	Schema.Literal("tsx"),
	Schema.Literal("json"),
	Schema.Literal("html"),
	Schema.Literal("yaml"),
	Schema.Literal("env"),
	Schema.Literal("xml"),
	Schema.Literal("java"),
	Schema.Literal("nix"),
	Schema.Literal("haskell"),
	Schema.Literal("zig"),
	Schema.Literal("c"),
	Schema.Literal("c++"),
	Schema.Literal("c#"),
	Schema.Literal("python"),
	Schema.Literal("sql"),
	Schema.Literal("dockerfile"),
	Schema.Literal("toml"),
	Schema.Literal("ini"),
	Schema.Literal("diff"),
	Schema.Literal("log"),
	Schema.Literal("scss"),
	Schema.Literal("less"),
	Schema.Literal("graphql"),
	Schema.Literal("nginx"),
	Schema.Literal("http"),
	Schema.Literal("ruby"),
	Schema.Literal("kotlin"),
	Schema.Literal("swift"),
	Schema.Literal("scala"),
	Schema.Literal("lua"),
	Schema.Literal("perl"),
	Schema.Literal("terraform"),
	Schema.Literal("makefile"),
	Schema.Literal("powershell"),
	Schema.Literal("vue"),
	Schema.Literal("astro"),
	Schema.Literal("svelte"),
	Schema.Literal("css"),
	Schema.Literal("bash"),
	Schema.Literal("go"),
	Schema.Literal("rust"),
	Schema.Literal("php"),
	Schema.Literal("text"),
]);

export type PasteLanguage = Schema.Schema.Type<typeof PasteLanguageSchema>;

const PasteExpirySchema = Schema.Union([
	Schema.Literal("1h"),
	Schema.Literal("1d"),
	Schema.Literal("7d"),
	Schema.Literal("30d"),
]);

export type PasteExpiry = Schema.Schema.Type<typeof PasteExpirySchema>;
export const DefaultPasteExpiry: PasteExpiry = "7d";

export const PasteExpiryOptions: Array<{ value: PasteExpiry; label: string }> = [
	{ value: "1h", label: "1 hour" },
	{ value: "1d", label: "1 day" },
	{ value: "7d", label: "7 days" },
	{ value: "30d", label: "30 days" },
];

const PasteDraftSchema = Schema.Struct({
	content: Schema.optional(Schema.String),
	language: Schema.optional(Schema.String),
	title: Schema.optional(Schema.String),
	expiresIn: Schema.optional(PasteExpirySchema),
});

export const parsePasteDraft = Schema.decodeUnknownSync(PasteDraftSchema);

export const MaxPasteContentLength = 200_000;

const PasteContentSchema = Schema.String.check(
	Schema.isMinLength(1, { message: "Paste content is required." }),
	Schema.isMaxLength(MaxPasteContentLength, {
		message: `Paste is too long. The limit is ${MaxPasteContentLength.toLocaleString()} characters.`,
	}),
	Schema.isPattern(/\S/, { message: "Paste content is required." }),
);

const PasteTitleSchema = Schema.String.check(
	Schema.isMaxLength(120, { message: "The title must be 120 characters or fewer." }),
);

const PastePasswordSchema = Schema.String.check(
	Schema.isMinLength(8, { message: "The password must be at least 8 characters." }),
	Schema.isMaxLength(128, { message: "The password must be 128 characters or fewer." }),
);

const PasteFormPasswordSchema = Schema.String.check(
	Schema.isMaxLength(128, { message: "The password must be 128 characters or fewer." }),
	Schema.isPattern(/^$|^.{8,}$/, { message: "The password must be at least 8 characters." }),
);

const PasteFormSchema = Schema.Struct({
	content: PasteContentSchema,
	language: PasteLanguageSchema,
	title: PasteTitleSchema,
	expiresIn: PasteExpirySchema,
	password: PasteFormPasswordSchema,
});

export type PasteFormValues = Schema.Schema.Type<typeof PasteFormSchema>;

export const PasteFormStandardSchema = Schema.toStandardSchemaV1(PasteFormSchema);

const CreatePasteInputSchema = Schema.Struct({
	content: PasteContentSchema,
	language: PasteLanguageSchema,
	detectedLanguage: Schema.optional(PasteLanguageSchema),
	title: Schema.optional(PasteTitleSchema),
	expiresIn: Schema.optional(PasteExpirySchema),
	password: Schema.optional(PastePasswordSchema),
});

export type CreatePasteInput = Schema.Schema.Type<typeof CreatePasteInputSchema>;

const GetPasteInputSchema = Schema.Struct({
	id: Schema.String.check(Schema.isMinLength(4), Schema.isMaxLength(64)),
});

export type GetPasteInput = Schema.Schema.Type<typeof GetPasteInputSchema>;

const UnlockPasteInputSchema = Schema.Struct({
	id: GetPasteInputSchema.fields.id,
	password: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(128)),
});

export type UnlockPasteInput = Schema.Schema.Type<typeof UnlockPasteInputSchema>;

export const parseCreatePasteInput = Schema.decodeUnknownSync(CreatePasteInputSchema);
export const parseGetPasteInput = Schema.decodeUnknownSync(GetPasteInputSchema);
export const parseUnlockPasteInput = Schema.decodeUnknownSync(UnlockPasteInputSchema);
