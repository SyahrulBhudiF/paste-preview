import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { copyLinkButtonStyles, shareLink } from "@/features/paste-preview/styles/form";

const styles = shareLink();

interface ShareLinkBannerProps {
	shareUrl: string;
	passwordProtected: boolean;
	onCopy: () => void;
}

export function ShareLinkBanner({ shareUrl, passwordProtected, onCopy }: ShareLinkBannerProps) {
	return (
		<output className={styles.banner}>
			<span className={styles.label}>
				{passwordProtected ? "Password protected" : "Public link"}
			</span>
			<Link className={styles.link} to={shareUrl}>
				{shareUrl}
			</Link>
			<Button
				type="button"
				size="sm"
				variant="ghost"
				css={copyLinkButtonStyles}
				onClick={onCopy}
			>
				Copy link
			</Button>
			{passwordProtected ? (
				<span className={styles.note}>Share the password separately.</span>
			) : null}
		</output>
	);
}
