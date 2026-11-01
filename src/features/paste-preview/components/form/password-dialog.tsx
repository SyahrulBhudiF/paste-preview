import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

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
				<div className="mb-4 space-y-1">
					<DialogTitle className="text-base font-semibold">
						Password-protect paste
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						Readers need this password to open the paste. Share it separately from the
						link. The password is an access gate, not encryption.
					</DialogDescription>
				</div>
				<form className="space-y-3" onSubmit={savePassword}>
					<label className="block space-y-1 text-xs font-medium" htmlFor="paste-password">
						<span>Password</span>
						<input
							autoComplete="new-password"
							className="h-9 w-full border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
							id="paste-password"
							maxLength={128}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="At least 8 characters"
							type="password"
							value={password}
						/>
					</label>
					<label
						className="block space-y-1 text-xs font-medium"
						htmlFor="paste-password-confirmation"
					>
						<span>Confirm password</span>
						<input
							autoComplete="new-password"
							className="h-9 w-full border border-input bg-background px-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
							id="paste-password-confirmation"
							maxLength={128}
							onChange={(event) => setConfirmation(event.target.value)}
							placeholder="Re-enter password"
							type="password"
							value={confirmation}
						/>
					</label>
					{error ? (
						<p className="text-sm text-destructive" role="alert">
							{error}
						</p>
					) : null}
					<div className="flex justify-end gap-2 pt-2">
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
