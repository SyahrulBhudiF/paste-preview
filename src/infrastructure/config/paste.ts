import type { PasteExpiry } from "@/libs/schemas/paste";

export const PasteExpirySeconds = {
	"1h": 60 * 60,
	"1d": 60 * 60 * 24,
	"7d": 60 * 60 * 24 * 7,
	"30d": 60 * 60 * 24 * 30,
} satisfies Record<PasteExpiry, number>;
