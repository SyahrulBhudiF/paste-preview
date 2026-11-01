import type { PasswordVerifier } from "@/infrastructure/schemas/paste";

const DerivationRounds = 100_000;
const SaltBytes = 16;
const HashBytes = 32;
const HexPattern = /^[\da-f]+$/i;

const bytesToHex = (bytes: Uint8Array) =>
	Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const hexToBytes = (hex: string) => {
	if (hex.length % 2 !== 0 || !HexPattern.test(hex)) return null;
	return Uint8Array.from(hex.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16));
};

const deriveHash = async (password: string, salt: Uint8Array, iterations: number) => {
	const saltBytes = Uint8Array.from(salt);
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{ name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations },
		key,
		HashBytes * 8,
	);
	return new Uint8Array(bits);
};

export const createPasswordVerifier = async (password: string): Promise<PasswordVerifier> => {
	const salt = crypto.getRandomValues(new Uint8Array(SaltBytes));
	const hash = await deriveHash(password, salt, DerivationRounds);
	return {
		salt: bytesToHex(salt),
		hash: bytesToHex(hash),
		iterations: DerivationRounds,
	};
};

export const verifyPassword = async (
	password: string,
	verifier: PasswordVerifier,
): Promise<boolean> => {
	const salt = hexToBytes(verifier.salt);
	const expected = hexToBytes(verifier.hash);
	if (
		!salt ||
		salt.length !== SaltBytes ||
		!expected ||
		expected.length !== HashBytes ||
		!Number.isSafeInteger(verifier.iterations) ||
		verifier.iterations < 10_000 ||
		verifier.iterations > 1_000_000
	) {
		return false;
	}

	const actual = await deriveHash(password, salt, verifier.iterations);
	let difference = 0;
	for (let index = 0; index < expected.length; index += 1) {
		difference |= expected[index] ^ actual[index];
	}
	return difference === 0;
};
