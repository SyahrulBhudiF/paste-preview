import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface ShareLinkBannerProps {
	shareUrl: string;
	passwordProtected: boolean;
	onCopy: () => void;
}

export function ShareLinkBanner({ shareUrl, passwordProtected, onCopy }: ShareLinkBannerProps) {
	return (
		<output className="mb-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 border border-border bg-secondary px-3 py-1.5 text-xs">
			<span className="shrink-0 text-muted-foreground">
				{passwordProtected ? "Password protected" : "Public link"}
			</span>
			<Link
				className="min-w-0 flex-1 truncate text-primary underline underline-offset-4"
				to={shareUrl}
			>
				{shareUrl}
			</Link>
			<Button type="button" size="sm" variant="ghost" className="shrink-0" onClick={onCopy}>
				Copy link
			</Button>
			{passwordProtected ? (
				<span className="basis-full text-muted-foreground">
					Share the password separately.
				</span>
			) : null}
		</output>
	);
}
