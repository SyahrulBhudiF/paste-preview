import { Schema } from "effect";

export class PasteNotFoundError extends Schema.TaggedErrorClass<PasteNotFoundError>()(
	"PasteNotFoundError",
	{
		message: Schema.String,
		pasteId: Schema.String,
	},
) {}

export class PasteStorageError extends Schema.TaggedErrorClass<PasteStorageError>()(
	"PasteStorageError",
	{
		message: Schema.String,
		operation: Schema.String,
	},
) {}
