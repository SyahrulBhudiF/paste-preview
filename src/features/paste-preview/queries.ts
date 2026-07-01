import { queryOptions } from "@tanstack/react-query";
import { getPaste } from "@/apis/paste";

export const pasteQueryOptions = (pasteId: string) =>
  queryOptions({
    queryKey: ["paste", pasteId],
    queryFn: () => getPaste({ data: { id: pasteId } }),
  });
