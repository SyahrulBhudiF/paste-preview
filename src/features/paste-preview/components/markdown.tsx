import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import { Check, Copy } from "lucide-react";
import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { highlightMarkdownCode } from "@/libs/highlight";

function CopyableCodeBlock({ className, ...props }: ComponentPropsWithoutRef<"pre">) {
	const preRef = useRef<HTMLPreElement>(null);
	const [copied, setCopied] = useState(false);

	const copyCode = async () => {
		const code = preRef.current?.querySelector("code")?.textContent?.trimEnd() ?? "";
		if (!navigator.clipboard || !code) return;

		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="group relative">
			<button
				aria-label={copied ? "Code copied" : "Copy code"}
				className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-border bg-card/90 px-2 py-1 text-xs text-muted-foreground opacity-70 shadow-sm backdrop-blur transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				onClick={() => void copyCode()}
				type="button"
			>
				{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
				<span>{copied ? "Copied" : "Copy"}</span>
			</button>
			<pre ref={preRef} className={`${className ?? ""} pr-20`} {...props} />
		</div>
	);
}

const components = {
	pre: CopyableCodeBlock,
	a({ children, ...props }) {
		const hasProtocol = /^[a-z][a-z0-9+.-]*:/i.test(props.href || "");
		const allowed = !hasProtocol || /^(https?:|mailto:)/i.test(props.href || "");
		const href = allowed ? props.href : undefined;
		const external = /^https?:\/\//i.test(href || "");

		return (
			<a
				{...props}
				href={href}
				rel={external ? "nofollow noopener noreferrer" : props.rel}
				target={external ? "_blank" : props.target}
			>
				{children}
			</a>
		);
	},
} satisfies MarkdownComponents;

export function MarkdownPreview({ content }: { content: string }) {
	return (
		<article className="markdown-renderer markdown-body h-full max-w-none overflow-auto p-5">
			<Markdown
				highlighter={highlightMarkdownCode}
				codeLineNumbers
				components={components}
				frontmatter={false}
				headingIds={false}
			>
				{content}
			</Markdown>
		</article>
	);
}
