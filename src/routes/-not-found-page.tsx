import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button-variants";

export function NotFoundPage() {
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
							<Link className={buttonVariants()} to="/">
								Create new paste
							</Link>
							<Link className={buttonVariants({ variant: "secondary" })} to="/">
								Back to editor
							</Link>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
