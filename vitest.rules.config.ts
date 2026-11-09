import { defineConfig } from "vitest/config";

// oxlint's RuleTester uses a ~6 GiB raw-transfer buffer. Run the rule tests in
// one worker so only one buffer is alive at a time.
export default defineConfig({
	resolve: { tsconfigPaths: true },
	test: {
		environment: "node",
		include: ["tools/oxlint/anti-slop/rules/**/*.test.ts"],
		globals: true,
		fileParallelism: false,
		isolate: false,
		maxWorkers: 1,
	},
});
