import { css } from "@styled/css";
import { ButtonLink } from "@/components/ui/button";
import { StatusPage } from "@/routes/-status-page";
import { statusActionsRowStyles } from "@/routes/-status-page.styles";

export function NotFoundPage() {
	return (
		<StatusPage
			eyebrow="404 · Preview unavailable"
			title="Page not found."
			description="This link may be wrong, deleted, or past its expiry window."
		>
			<div className={css(statusActionsRowStyles)}>
				<ButtonLink to="/">Create new paste</ButtonLink>
				<ButtonLink variant="secondary" to="/">
					Back to editor
				</ButtonLink>
			</div>
		</StatusPage>
	);
}
