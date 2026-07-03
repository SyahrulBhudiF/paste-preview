import { Effect } from "effect";
import { describe, expect, it } from "@effect/vitest";
import { detectPasteLanguage, normalizeLanguage, PasteLanguages } from "@/libs/language";

const positiveCases = [
	["markdown", "# Hello\n\n- one"],
	["text", "plain notes only"],
	["log", "[ERROR] 12:00:00 failed"],
	["diff", "diff --git a/a.ts b/a.ts\n@@ -1,1 +1,1 @@"],
	["env", "API_KEY=secret"],
	["ini", "; comment\n[app]\nname=value"],
	["toml", '[package]\nname = "app"'],
	["yaml", "name: app"],
	["json", '{ "ok": true }'],
	["xml", "<app>\n  <name>PastePreview</name>\n  <port>3000</port>\n</app>"],
	["html", "<main>Hi</main>"],
	["css", ".card { color: red; }"],
	["scss", "$color: red;\n.card { color: $color; }"],
	["less", "@color: red;\n.card { color: @color; }"],
	["javascript", "const x = () => 1;"],
	["typescript", "interface User { id: string }"],
	["jsx", "export function View() { return <div>{content}</div>; }"],
	[
		"tsx",
		"export function View({ content }: { content: string }) { return <div>{content}</div>; }",
	],
	[
		"vue",
		"<template><p>{{ msg }}</p></template>\n<script setup>defineProps({ msg: String })</script>",
	],
	["astro", "---\ntitle: Hi\n---\n<div>Astro</div>"],
	["svelte", "{#if count}<p>{count}</p>{/if}"],
	["graphql", "query User($id: ID!) { user(id: $id) { id } }"],
	["http", "GET /api/pastes HTTP/1.1"],
	["bash", "git status"],
	["powershell", "$Name = 'Ryuko'\nWrite-Host $Name"],
	["dockerfile", "FROM node:22\nRUN npm install"],
	["nginx", "server {\n  location / { proxy_pass http://app; }\n}"],
	["terraform", 'resource "cloudflare_worker" "app" {}'],
	["makefile", "build:\n\techo hi"],
	["sql", "SELECT id, name, email\nFROM users\nWHERE active = true"],
	["go", 'package main\n\nfunc main() {\n  fmt.Println("hi")\n}'],
	["rust", 'fn main() {\n  println!("hi");\n}'],
	["python", "def main():\n    print('hi')"],
	["php", "<?php\n$name = 'Ryuko';"],
	["ruby", "puts 'hi'"],
	[
		"java",
		'public class Main { public static void main(String[] args) { System.out.println("hi"); } }',
	],
	["kotlin", 'fun main() { println("hi") }'],
	["swift", 'import Swift\nfunc greet() { print("hi") }'],
	["scala", 'object Main { def main(args: Array[String]) = println("hi") }'],
	["lua", "local message = 'hi'"],
	["perl", "use strict;\nmy $name = 'hi';"],
	["nix", 'with import <nixpkgs> {}; mkDerivation { name = "app"; }'],
	["haskell", 'main :: IO ()\nmain = putStrLn "hi"'],
	["zig", 'const std = @import("std");\npub fn main() void {}'],
	["c", "#include <stdio.h>\nint main() { return 0; }"],
	["c++", '#include <iostream>\nint main() { std::cout << "hi"; }'],
	["c#", 'using System;\nConsole.WriteLine("hi");'],
] as const;

const conflictCases = [
	["sql beats dockerfile FROM", "SELECT id, name\nFROM users\nWHERE active = true", "sql"],
	["scss beats yaml colon", "$primary: #6366f1;\n.button {\n  background: $primary;\n}", "scss"],
	["less beats yaml colon", "@primary: #6366f1;\n.button { color: @primary; }", "less"],
	["html beats generic xml", "<main>HTML, not XML</main>", "html"],
	["xml works without declaration", "<app>\n  <name>PastePreview</name>\n</app>", "xml"],
	["astro beats yaml frontmatter", "---\ntitle: Hi\n---\n<div>Astro</div>", "astro"],
	[
		"jsx beats python import and markdown blockquote",
		'import ReactMarkdown from "react-markdown";\n\nexport function View() {\n  return <ReactMarkdown>{content}</ReactMarkdown>;\n}',
		"jsx",
	],
	[
		"tsx beats lua function and xml tags",
		"export function View({ content }: { content: string }) {\n  return <ReactMarkdown>{content}</ReactMarkdown>;\n}",
		"tsx",
	],
	["makefile beats yaml target", "build:\n\techo hi", "makefile"],
	["haskell beats toml equals", 'main :: IO ()\nmain = putStrLn "hi"', "haskell"],
	["haskell function equation beats toml", "greet name = putStrLn name", "haskell"],
	["zig beats rust fn", 'const std = @import("std");\npub fn main() void {}', "zig"],
	["perl beats php dollar assignment", "use strict;\nmy $name = 'hi';", "perl"],
	["ruby beats python def", 'def greet(name)\n  puts "Hello #{name}"\nend', "ruby"],
	["swift beats go func", 'func greet() {\n  print("hi")\n}', "swift"],
	[
		"kotlin beats scala val",
		'val name: String = "Kotlin"\nfun main() { println(name) }',
		"kotlin",
	],
	["lua beats javascript function", 'function greet(name)\n  print("hi")\nend', "lua"],
	[
		"nix beats toml assignment",
		"{ pkgs ? import <nixpkgs> {} }:\npkgs.mkShell { buildInputs = []; }",
		"nix",
	],
	[
		"python beats toml assignment",
		'name = "Python"\n\ndef greet():\n    print(f"Hello {name}")\n\ngreet()',
		"python",
	],
	["plain sentence with colon stays text", "plain key: value inside a sentence", "text"],
] as const;

const aliasCases = [
	["ts", "typescript"],
	["sh", "bash"],
	["rs", "rust"],
	["golang", "go"],
	["cpp", "c++"],
	["cs", "c#"],
	["py", "python"],
	["unknown", "text"],
] as const;

describe("language utilities", () => {
	for (const [language, content] of positiveCases) {
		it.effect(`detects ${language}`, () =>
			Effect.sync(() => {
				expect(detectPasteLanguage(content)).toBe(language);
			}),
		);
	}

	it.effect("has a detection fixture for every non-auto language", () =>
		Effect.sync(() => {
			const tested = new Set(positiveCases.map(([language]) => language));
			const missing = PasteLanguages.map((item) => item.value).filter(
				(language) => language !== "auto" && !tested.has(language),
			);

			expect(missing).toEqual([]);
		}),
	);

	for (const [name, content, language] of conflictCases) {
		it.effect(`handles conflict: ${name}`, () =>
			Effect.sync(() => {
				expect(detectPasteLanguage(content)).toBe(language);
			}),
		);
	}

	it.effect("keeps generic text as text", () =>
		Effect.sync(() => {
			expect(detectPasteLanguage("nothing special here")).toBe("text");
		}),
	);

	for (const [alias, language] of aliasCases) {
		it.effect(`normalizes ${alias} to ${language}`, () =>
			Effect.sync(() => {
				expect(normalizeLanguage(alias)).toBe(language);
			}),
		);
	}
});
