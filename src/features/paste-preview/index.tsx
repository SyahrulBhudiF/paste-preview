import { PasteForm } from "./components/form";

export function PastePreviewFeature() {
	return (
		<main className="min-h-dvh overflow-x-hidden bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_34rem),linear-gradient(135deg,var(--background),color-mix(in_oklch,var(--secondary)_38%,var(--background)))] text-foreground">
			<PasteForm />
		</main>
	);
}
