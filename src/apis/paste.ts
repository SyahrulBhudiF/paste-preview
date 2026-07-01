import { env } from "cloudflare:workers";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { PasteNotFoundError } from "@/infrastructure/errors/paste";
import { runEffect } from "@/infrastructure/runtime";
import { PasteStorageService } from "@/infrastructure/services";
import { parseCreatePasteInput, parseGetPasteInput } from "@/libs/schemas/paste";

const rateLimitMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    const ip =
      request.headers.get("CF-Connecting-IP") ??
      request.headers.get("x-forwarded-for") ??
      "unknown";
    const { success } = await env.RATE_LIMIT.limit({ key: ip });

    if (!success) {
      return new Response("Rate limit exceeded", { status: 429 });
    }

    return next();
  },
);

export const createPaste = createServerFn({ method: "POST" })
  .middleware([rateLimitMiddleware])
  .validator(parseCreatePasteInput)
  .handler(async ({ data }) =>
    runEffect(
      Effect.gen(function* () {
        const storage = yield* PasteStorageService;
        return yield* storage.create(data);
      }),
    ),
  );

export const getPaste = createServerFn({ method: "GET" })
  .validator(parseGetPasteInput)
  .handler(async ({ data }) =>
    runEffect(
      Effect.gen(function* () {
        const storage = yield* PasteStorageService;
        return yield* storage
          .getById(data.id)
          .pipe(Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)));
      }).pipe(
        Effect.catchTag("PasteStorageError", () =>
          Effect.fail(
            new PasteNotFoundError({
              message: "Paste not found or expired.",
              pasteId: data.id,
            }),
          ),
        ),
        Effect.catchTag("PasteNotFoundError", () => Effect.succeed(null)),
      ),
    ),
  );
