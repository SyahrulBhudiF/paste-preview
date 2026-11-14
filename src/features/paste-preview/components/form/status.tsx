import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import { PasteExpiryOptions, type PasteExpiry } from "@/libs/schemas/paste";

const styles = workspaceChrome();

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
		<footer className={styles.status}>
			<span>
				{lineCount.toLocaleString()} lines · {content.length.toLocaleString()} characters ·
				UTF-8
			</span>
			<span className={styles.language}>{languageLabel}</span>
			<span className={styles.expiry}>Expires in {expiryLabel}</span>
		</footer>
	);
}
