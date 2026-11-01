import { describe, expect, it } from "vitest";
import { createPasswordVerifier, verifyPassword } from "@/infrastructure/crypto/password";

describe("paste password verifier", () => {
	it("verifies the original password and rejects a different one", async () => {
		const verifier = await createPasswordVerifier("correct horse battery staple");

		expect(await verifyPassword("correct horse battery staple", verifier)).toBe(true);
		expect(await verifyPassword("incorrect horse battery staple", verifier)).toBe(false);
		expect(verifier).not.toHaveProperty("password");
	});

	it("uses a unique salt for each paste", async () => {
		const [first, second] = await Promise.all([
			createPasswordVerifier("same password"),
			createPasswordVerifier("same password"),
		]);

		expect(first.salt).not.toBe(second.salt);
		expect(first.hash).not.toBe(second.hash);
	});

	it("rejects malformed or unreasonably expensive verifier parameters", async () => {
		const verifier = await createPasswordVerifier("correct horse battery staple");

		expect(
			await verifyPassword("correct horse battery staple", { ...verifier, salt: "bad" }),
		).toBe(false);
		expect(
			await verifyPassword("correct horse battery staple", {
				...verifier,
				iterations: 1_000_001,
			}),
		).toBe(false);
	});
});
