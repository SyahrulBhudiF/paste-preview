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

const CreatePasteInputSchema = Schema.Struct({
	content: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(200_000)),
	language: PasteLanguageSchema,
	detectedLanguage: Schema.optional(Schema.String),
});

export type CreatePasteInput = Schema.Schema.Type<typeof CreatePasteInputSchema>;

const GetPasteInputSchema = Schema.Struct({
	id: Schema.String.check(Schema.isMinLength(4), Schema.isMaxLength(64)),
});

export type GetPasteInput = Schema.Schema.Type<typeof GetPasteInputSchema>;

export const parseCreatePasteInput = Schema.decodeUnknownSync(CreatePasteInputSchema);
export const parseGetPasteInput = Schema.decodeUnknownSync(GetPasteInputSchema);
