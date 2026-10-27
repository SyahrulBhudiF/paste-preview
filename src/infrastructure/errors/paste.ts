import { Schema } from "effect";

export class PasteNotFoundError extends Schema.TaggedError<PasteNotFoundError>()(
	"PasteNotFoundError",
	{
		message: Schema.String,
		pasteId: Schema.String,
	},
) {}

export class PasteStorageError extends Schema.TaggedError<PasteStorageError>()(
	"PasteStorageError",
	{
		message: Schema.String,
		operation: Schema.String,
	},
) {}
