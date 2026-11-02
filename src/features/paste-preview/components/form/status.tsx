import { PasteExpiryOptions, type PasteExpiry } from "@/libs/schemas/paste";

interface PasteStatusFooterProps {
	content: string;
	languageLabel: string;
	expiresIn: PasteExpiry;
}

export function PasteStatusFooter({ content, languageLabel, expiresIn }: PasteStatusFooterProps) {
	const lineCount = content.split("\n").length;
	const expiryLabel =
		PasteExpiryOptions.find((option) => option.value === expiresIn)?.label ?? "7 days";

	return (
		<footer className="workspace-status">
			<span>
				{lineCount.toLocaleString()} lines · {content.length.toLocaleString()} characters ·
				UTF-8
			</span>
			<span className="hidden sm:inline">{languageLabel}</span>
			<span className="sm:hidden">Expires in {expiryLabel}</span>
		</footer>
	);
}
