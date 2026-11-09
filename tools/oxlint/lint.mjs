import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const binary = path.join(
	root,
	"node_modules",
	".bin",
	process.platform === "win32" ? "oxlint.cmd" : "oxlint",
);
const extraArgs = process.argv.slice(2);

const run = (config, inherit) =>
	spawnSync(binary, ["-c", config, ...extraArgs], {
		cwd: root,
		encoding: "utf8",
		stdio: inherit ? "inherit" : "pipe",
	});

const full = run(".oxlintrc.json", false);

if (full.status !== 134 && full.signal !== "SIGABRT") {
	if (full.stdout) process.stdout.write(full.stdout);
	if (full.stderr) process.stderr.write(full.stderr);
	process.exit(full.status ?? 1);
}

process.stderr.write(
	"oxlint's JS plugin host crashed (SIGABRT). Retrying with built-in rules only; anti-slop rules were skipped.\n",
);

const fallback = run(".oxlintrc.fallback.json", true);
process.exit(fallback.status ?? 1);
