import { describe, expect, it } from "vitest";
import { formatExpiry } from "@/libs/utils/time";

describe("formatExpiry", () => {
	it("shows days plus exact date", () => {
		expect(
			formatExpiry("2026-07-09T00:00:00.000Z", new Date("2026-07-06T00:00:00.000Z")),
		).toContain("Expires in 3 days");
	});

	it("shows soon under one hour", () => {
		expect(
			formatExpiry("2026-07-06T00:30:00.000Z", new Date("2026-07-06T00:00:00.000Z")),
		).toContain("Expires soon");
	});

	it("formats the exact date in UTC", () => {
		expect(
			formatExpiry("2026-11-08T20:00:00.000Z", new Date("2026-11-08T00:00:00.000Z")),
		).toContain("Nov 8, 2026");
	});
});
