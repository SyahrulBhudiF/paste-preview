import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPaste() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <section className="max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold">Paste not found or expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Shared links are public and expire after 7 days.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Create a new paste</Link>
        </Button>
      </section>
    </main>
  );
}
