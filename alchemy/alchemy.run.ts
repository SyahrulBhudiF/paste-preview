import alchemy from "alchemy";
import { KVNamespace, RateLimit, TanStackStart } from "alchemy/cloudflare";

const app = await alchemy("paste-preview");

const PASTES = await KVNamespace("PASTES", {
  title: "paste-preview-pastes",
  adopt: true,
});

const RATE_LIMIT = RateLimit({
  namespace_id: 1001,
  simple: { limit: 10, period: 60 },
});

export const worker = await TanStackStart("paste-preview", {
  name: "paste-preview",
  bindings: {
    PASTES,
    RATE_LIMIT,
  },
  domains: ["preview.ryuko.my.id"],
  compatibilityFlags: ["nodejs_compat"],
  observability: { enabled: true },
  build: "vp build",
  dev: "vp dev",
});

await app.finalize();
