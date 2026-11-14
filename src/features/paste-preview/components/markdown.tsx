import { Markdown, type MarkdownComponents } from "@tanstack/markdown/react";
import { Check, Copy } from "lucide-react";
import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import { css, cx } from "@styled/css";
import { highlightMarkdownCode } from "@/libs/highlight";
import { markdown, markdownIconStyles } from "@/features/paste-preview/styles/markdown";

const styles = markdown();

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
		<div className={styles.copyWrap}>
			<button
				aria-label={copied ? "Code copied" : "Copy code"}
				className={styles.copyButton}
				onClick={() => void copyCode()}
				type="button"
			>
				{copied ? (
					<Check className={css(markdownIconStyles)} />
				) : (
					<Copy className={css(markdownIconStyles)} />
				)}
				<span>{copied ? "Copied" : "Copy"}</span>
			</button>
			<pre ref={preRef} className={cx(styles.codeBlock, className)} {...props} />
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
		<article className={cx("markdown-renderer markdown-body", styles.article)}>
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
