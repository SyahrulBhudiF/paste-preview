import { ButtonLink } from "@/components/ui/button";
import { StatusPage } from "@/routes/-status-page";

export function ErrorPage() {
	return (
		<StatusPage
			eyebrow="Error · Something broke"
			title="Could not load this page."
			description="Try again, or go back to the editor."
		>
			<ButtonLink to="/">Back to editor</ButtonLink>
		</StatusPage>
	);
}
