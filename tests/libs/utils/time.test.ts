import { Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import { formatExpiry } from "@/libs/utils/time";

describe("formatExpiry", () => {
	it.effect("shows days plus exact date", () =>
		Effect.sync(() => {
			expect(
				formatExpiry("2026-07-09T00:00:00.000Z", new Date("2026-07-06T00:00:00.000Z")),
			).toContain("Expires in 3 days");
		}),
	);

	it.effect("shows soon under one hour", () =>
		Effect.sync(() => {
			expect(
				formatExpiry("2026-07-06T00:30:00.000Z", new Date("2026-07-06T00:00:00.000Z")),
			).toContain("Expires soon");
		}),
	);
});
