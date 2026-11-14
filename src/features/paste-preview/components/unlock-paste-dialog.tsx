import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { dialogRecipe } from "@/components/ui/dialog.styles";
import { unlockPaste } from "@/apis/paste";
import type { PublicPaste } from "@/infrastructure/schemas/paste";
import { formatExpiry } from "@/libs/utils/time";

const styles = dialogRecipe();

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
		if (!nextOpen) setPassword("");
		setError(null);
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
			handleOpenChange(false);
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
				<div className={styles.header}>
					<DialogTitle className={styles.title}>Password-protected paste</DialogTitle>
					<DialogDescription className={styles.description}>
						Enter the password to unlock and view this paste.
					</DialogDescription>
					<p className={styles.hint}>{formatExpiry(expiresAt)}</p>
				</div>
				<form className={styles.form} onSubmit={(event) => void unlock(event)}>
					<label className={styles.label} htmlFor="unlock-password">
						<span>Password</span>
						<input
							className={styles.input}
							autoComplete="current-password"
							id="unlock-password"
							maxLength={128}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Paste password"
							type="password"
							value={password}
						/>
					</label>
					{error ? (
						<p className={styles.error} role="alert">
							{error}
						</p>
					) : null}
					<div className={styles.actions}>
						<Button
							type="button"
							variant="ghost"
							onClick={() => handleOpenChange(false)}
						>
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
