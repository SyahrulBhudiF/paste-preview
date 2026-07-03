import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { ErrorPage } from "@/routes/error-page";
import { NotFoundPage } from "@/routes/not-found-page";
import "github-markdown-css/github-markdown-light.css";
import "@/styles/app.css";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Paste Preview" },
		],
		links: [
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon_io/favicon-16x16.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon_io/favicon-32x32.png",
			},
			{ rel: "apple-touch-icon", href: "/favicon_io/apple-touch-icon.png" },
			{ rel: "manifest", href: "/favicon_io/site.webmanifest" },
		],
	}),
	notFoundComponent: NotFoundPage,
	errorComponent: ErrorPage,
	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Outlet />
				<Toaster position="bottom-right" richColors />
				<Scripts />
			</body>
		</html>
	);
}
