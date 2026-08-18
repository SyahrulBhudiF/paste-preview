import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ErrorPage() {
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
