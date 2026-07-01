import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

export function MarkdownPreview({ content }: { content: string }) {
	return (
		<article className="max-w-none space-y-4 wrap-break-word p-5 leading-7 [&_a]:text-primary [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-6 [&_ol]:list-decimal [&_pre_code]:bg-transparent [&_ul]:list-disc">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize, rehypeHighlight]}
			>
				{content}
			</ReactMarkdown>
		</article>
	);
}
