import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import { highlightMarkdownCode } from "@/libs/highlight";

const components = {
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
