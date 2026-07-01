export interface StoredPaste {
	id: string;
	content: string;
	language: string;
	detectedLanguage: string;
	createdAt: string;
	expiresAt: string;
}

export interface CreatedPaste {
	id: string;
	url: string;
	expiresAt: string;
}
