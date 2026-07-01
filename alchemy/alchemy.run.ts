import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
	"paste-preview",
	{
		providers: Cloudflare.providers(),
		state: Cloudflare.state(),
	},
	Effect.gen(function* () {
		const PASTES = yield* Cloudflare.KV.Namespace("PASTES", {
			title: "paste-preview-pastes",
		});

		const RATE_LIMIT = Cloudflare.RateLimit("RATE_LIMIT", {
			namespaceId: 1001,
			simple: { limit: 10, period: 60 },
		});

		const worker = yield* Cloudflare.Website.Vite("paste-preview", {
			name: "paste-preview",
			env: {
				PASTES,
				RATE_LIMIT,
			},
			domain: ["preview.ryuko.my.id"],
			compatibility: {
				flags: ["nodejs_compat"],
			},
			observability: { enabled: true },
		});

		return {
			pastesNamespaceId: PASTES.namespaceId,
			workerId: worker.workerId,
		};
	}),
);
