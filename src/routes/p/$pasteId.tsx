import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPaste } from "@/features/paste-preview/components/NotFoundPaste";
import { PublicPastePreview } from "@/features/paste-preview/components/PublicPastePreview";
import { pasteQueryOptions } from "@/features/paste-preview/queries";

export const Route = createFileRoute("/p/$pasteId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(pasteQueryOptions(params.pasteId)),
  component: PasteRoute,
});

function PasteRoute() {
  const { pasteId } = Route.useParams();
  const { data: paste } = useSuspenseQuery(pasteQueryOptions(pasteId));

  if (!paste) return <NotFoundPaste />;
  return <PublicPastePreview paste={paste} />;
}
