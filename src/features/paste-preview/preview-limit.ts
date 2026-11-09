export const LivePreviewCharacterLimit = 16_000;

export const limitPreviewContent = (content: string, limit: number) =>
	content.length > limit ? content.slice(0, limit) : content;
