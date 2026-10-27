import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Alchemy injects its own resource-aware Cloudflare plugin into `alchemy deploy`.
// Registering the config-file instance alongside it builds two plugin stacks
// that fail on cross-plugin lookups, so this one stands down during that build.
const isAlchemyBuild = process.env.ALCHEMY_CLOUDFLARE_VITE_INJECTED === "1";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		isAlchemyBuild ? null : cloudflare({ viteEnvironment: { name: "ssr" } }),
		tanstackStart(),
		tailwindcss(),
		react(),
	],
});
