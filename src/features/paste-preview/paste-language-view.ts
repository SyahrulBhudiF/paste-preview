import { detectPasteLanguage, PasteLanguages } from "@/libs/language";
import type { PasteLanguage } from "@/libs/schemas/paste";

export const getPasteLanguageView = (content: string, language: PasteLanguage) => {
	const detectedLanguage = detectPasteLanguage(content);
	const previewLanguage = language === "auto" ? detectedLanguage : language;
	const detectedLanguageLabel =
		PasteLanguages.find((item) => item.value === detectedLanguage)?.label ?? detectedLanguage;
	const languageLabel =
		language === "auto"
			? `Auto: ${detectedLanguageLabel}`
			: (PasteLanguages.find((item) => item.value === previewLanguage)?.label ??
				previewLanguage);

	return { previewLanguage, languageLabel };
};
