declare module "cloudflare:workers" {
	export const env: Env;
}

interface RateLimitBinding {
	limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
	PASTES: KVNamespace;
	RATE_LIMIT: RateLimitBinding;
}
