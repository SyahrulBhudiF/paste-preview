import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { dialogRecipe } from "@/components/ui/dialog.styles";

const styles = dialogRecipe();

interface PasswordDialogProps {
	open: boolean;
	isProtected: boolean;
	onOpenChange: (open: boolean) => void;
	onPasswordChange: (password: string) => void;
}

export function PasswordDialog({
	open,
	isProtected,
	onOpenChange,
	onPasswordChange,
}: PasswordDialogProps) {
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			setPassword("");
			setConfirmation("");
			setError(null);
		}
		onOpenChange(nextOpen);
	};

	const savePassword = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		if (password !== confirmation) {
			setError("Passwords do not match.");
			return;
		}
		if (password && password.length < 8) {
			setError("Use at least 8 characters.");
			return;
		}
		if (password.length > 128) {
			setError("Use no more than 128 characters.");
			return;
		}

		onPasswordChange(password);
		handleOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<div className={styles.header}>
					<DialogTitle className={styles.title}>Password-protect paste</DialogTitle>
					<DialogDescription className={styles.description}>
						Readers need this password to open the paste. Share it separately from the
						link. The password is an access gate, not encryption.
					</DialogDescription>
				</div>
				<form className={styles.form} onSubmit={savePassword}>
					<label className={styles.label} htmlFor="paste-password">
						<span>Password</span>
						<input
							className={styles.input}
							autoComplete="new-password"
							id="paste-password"
							maxLength={128}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="At least 8 characters"
							type="password"
							value={password}
						/>
					</label>
					<label className={styles.label} htmlFor="paste-password-confirmation">
						<span>Confirm password</span>
						<input
							className={styles.input}
							autoComplete="new-password"
							id="paste-password-confirmation"
							maxLength={128}
							onChange={(event) => setConfirmation(event.target.value)}
							placeholder="Re-enter password"
							type="password"
							value={confirmation}
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
						<Button type="submit">
							{password
								? "Set password"
								: isProtected
									? "Remove password"
									: "Continue without password"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
