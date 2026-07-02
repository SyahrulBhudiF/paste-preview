import {
	HeadContent,
	Link,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
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

function NotFoundPage() {
	return (
		<main className="min-h-dvh bg-background px-4 py-6 text-foreground">
			<div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl items-center">
				<section className="w-full border-y border-border py-10 sm:py-14">
					<div className="max-w-xl">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							404 · Preview unavailable
						</p>
						<h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
							Page not found.
						</h1>
						<p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
							This link may be wrong, deleted, or past its expiry window.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild className="rounded-2xl px-5">
								<Link to="/">Create new paste</Link>
							</Button>
							<Button asChild variant="secondary" className="rounded-2xl px-5">
								<Link to="/">Back to editor</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

function ErrorPage() {
	return (
		<main className="min-h-dvh bg-background px-4 py-6 text-foreground">
			<div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl items-center">
				<section className="w-full border-y border-border py-10 sm:py-14">
					<div className="max-w-xl">
						<p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
							Error · Something broke
						</p>
						<h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
							Could not load this page.
						</h1>
						<p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
							Try again, or go back to the editor.
						</p>
						<Button asChild className="mt-8 rounded-2xl px-5">
							<Link to="/">Back to editor</Link>
						</Button>
					</div>
				</section>
			</div>
		</main>
	);
}
