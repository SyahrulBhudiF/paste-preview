import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
	preflight: true,
	include: ["./src/**/*.{ts,tsx}"],
	exclude: [],
	outdir: "styled-system",
	outExtension: "js",
	jsxFramework: "react",
	jsxStyleProps: "minimal",
	importMap: {
		css: ["@styled/css"],
		recipe: ["@styled/recipes"],
		pattern: ["@styled/patterns"],
		jsx: ["@styled/jsx"],
		tokens: ["@styled/tokens"],
	},
	theme: {
		extend: {
			semanticTokens: {
				colors: {
					background: { value: { base: "#f5f8fc", _dark: "#182330" } },
					foreground: { value: { base: "#314359", _dark: "#dce6f2" } },
					card: { value: { base: "#ffffff", _dark: "#1e2c3c" } },
					"card-foreground": { value: { base: "#314359", _dark: "#dce6f2" } },
					popover: { value: { base: "#ffffff", _dark: "#1e2c3c" } },
					"popover-foreground": { value: { base: "#314359", _dark: "#dce6f2" } },
					primary: { value: { base: "#426f9e", _dark: "#96bce4" } },
					"primary-foreground": { value: { base: "#f8fbff", _dark: "#182b3f" } },
					secondary: { value: { base: "#eaf1f9", _dark: "#283e54" } },
					"secondary-foreground": { value: { base: "#385573", _dark: "#dce6f2" } },
					muted: { value: { base: "#eef3f8", _dark: "#26384b" } },
					"muted-foreground": { value: { base: "#566d85", _dark: "#a1b4c9" } },
					accent: { value: { base: "#e2edfa", _dark: "#304b67" } },
					"accent-foreground": { value: { base: "#314f72", _dark: "#e1edfa" } },
					destructive: {
						value: { base: "#bd3f3f", _dark: "oklch(0.6875 0.142 21.4566)" },
					},
					"destructive-foreground": {
						value: {
							base: "oklch(0.9777 0.0041 301.4256)",
							_dark: "oklch(0.2166 0.0215 292.8474)",
						},
					},
					border: { value: { base: "#d1ddeb", _dark: "#394f66" } },
					input: { value: { base: "#c9d8e8", _dark: "#30475e" } },
					ring: { value: { base: "#6897c6", _dark: "#8db2dc" } },
				},
			},
			tokens: {
				fonts: {
					sans: { value: "Geist, sans-serif" },
					mono: { value: '"Fira Code", "Courier New", monospace' },
					serif: { value: '"Lora", Georgia, serif' },
				},
				radii: {
					sm: { value: "0.075rem" },
					md: { value: "0.1rem" },
					lg: { value: "0.125rem" },
					xl: { value: "0.175rem" },
				},
				shadows: {
					lg: {
						value: "1px 2px 5px 1px hsl(0 0% 0% / 0.06), 1px 4px 6px 0px hsl(0 0% 0% / 0.06)",
					},
				},
			},
		},
	},
	globalCss: {
		html: { fontFamily: "sans" },
		body: { letterSpacing: "normal" },
		"::placeholder": { color: "color-mix(in oklab, currentColor 50%, transparent)" },
		".markdown-body": {
			"--color-canvas-default": "transparent",
			"--color-fg-default": "var(--colors-foreground)",
			"--color-fg-muted": "var(--colors-muted-foreground)",
			"--color-border-default": "var(--colors-border)",
			"--color-border-muted": "var(--colors-border)",
			"--color-canvas-subtle": "var(--colors-muted)",
			"--color-accent-fg": "var(--colors-primary)",
			background: "transparent",
			color: "foreground",
			fontFamily: "sans",
		},
		".markdown-body ul": { listStyleType: "disc", paddingInlineStart: "2em" },
		".markdown-body ol": { listStyleType: "decimal", paddingInlineStart: "2em" },
		".markdown-body pre, .markdown-body code": { fontFamily: "mono" },
		".markdown-body pre": {
			border: "1px solid {colors.border}",
			borderRadius: "0",
			background: "muted",
			padding: "10px",
		},
	},
});
