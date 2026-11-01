import { createFileRoute, notFound } from "@tanstack/react-router";
import { PasteIdPage } from "@/features/paste-preview/paste-id";
import { pasteQueryOptions } from "@/features/paste-preview/queries";

export const Route = createFileRoute("/p/$pasteId")({
	loader: async ({ context, params }) => {
		const paste = await context.queryClient.ensureQueryData(pasteQueryOptions(params.pasteId));
		if (!paste) throw notFound();
		return paste;
	},
	component: PasteRoute,
});

function PasteRoute() {
	const { pasteId } = Route.useParams();
	const paste = Route.useLoaderData();

	return <PasteIdPage key={pasteId} paste={paste} pasteId={pasteId} />;
}
