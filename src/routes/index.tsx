import { createFileRoute } from "@tanstack/react-router";
import { PastePreviewFeature } from "@/features/paste-preview";

export const Route = createFileRoute("/")({
  component: PastePreviewFeature,
});
