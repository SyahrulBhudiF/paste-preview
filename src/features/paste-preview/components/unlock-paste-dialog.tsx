import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { unlockPaste } from "@/apis/paste";
import type { PublicPaste } from "@/infrastructure/schemas/paste";
import { formatExpiry } from "@/libs/utils/time";

interface UnlockPasteDialogProps {
	open: boolean;
	expiresAt: string;
	pasteId: string;
	onOpenChange: (open: boolean) => void;
	onUnlocked: (paste: PublicPaste) => void;
}

export function UnlockPasteDialog({
	open,
	expiresAt,
	pasteId,
	onOpenChange,
	onUnlocked,
}: UnlockPasteDialogProps) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isUnlocking, setIsUnlocking] = useState(false);

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) setError(null);
		onOpenChange(nextOpen);
	};

	const unlock = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setError(null);
		setIsUnlocking(true);

		try {
			const result = await unlockPaste({ data: { id: pasteId, password } });
			if (result.status === "invalid") {
				setError("Paste not found or password incorrect.");
				toast.error("Paste not found or password incorrect.");
				return;
			}

			if (result.status === "rate-limited") {
				setError("Too many attempts. Please try again shortly.");
				toast.error("Too many unlock attempts");
				return;
			}

			onUnlocked(result.paste);
			setPassword("");
			onOpenChange(false);
			toast.success("Paste unlocked");
		} catch {
			setError("Could not unlock this paste. Please try again.");
			toast.error("Could not unlock paste");
		} finally {
			setIsUnlocking(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<div className="mb-4 space-y-1">
					<DialogTitle className="text-base font-semibold">
						Password-protected paste
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Enter the password to unlock and view this paste.
					</DialogDescription>
					<p className="text-xs text-muted-foreground">{formatExpiry(expiresAt)}</p>
				</div>
				<form className="space-y-3" onSubmit={(event) => void unlock(event)}>
					<label
						className="block space-y-1 text-xs font-medium"
						htmlFor="unlock-password"
					>
						<span>Password</span>
						<input
							autoComplete="current-password"
							className="h-9 w-full border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
							id="unlock-password"
							maxLength={128}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Paste password"
							type="password"
							value={password}
						/>
					</label>
					{error ? (
						<p className="text-sm text-destructive" role="alert">
							{error}
						</p>
					) : null}
					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit" disabled={isUnlocking || !password}>
							{isUnlocking ? "Checking..." : "Unlock paste"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
