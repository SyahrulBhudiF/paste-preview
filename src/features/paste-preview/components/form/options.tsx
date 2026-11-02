import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldErrors } from "@/features/paste-preview/components/form/field-errors";
import { PasswordDialog } from "@/features/paste-preview/components/form/password-dialog";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { PasteExpiryOptions } from "@/libs/schemas/paste";

interface PasteOptionsBarProps {
	form: PasteFormApi;
	password: string;
	onPasswordChange: (password: string) => void;
}

export function PasteOptionsBar({ form, password, onPasswordChange }: PasteOptionsBarProps) {
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

	return (
		<div className="flex min-w-0 flex-wrap items-center gap-2 border-x border-border bg-card px-2 py-2 sm:px-3">
			<form.Field name="title">
				{(field) => (
					<div className="flex min-w-0 flex-1 flex-col">
						<input
							aria-label="Paste title (optional)"
							className="h-8 w-full min-w-28 border border-input bg-background px-2 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
							maxLength={120}
							placeholder="Title (optional)"
							value={field.state.value}
							onChange={(event) => field.handleChange(event.target.value)}
						/>
						<FieldErrors errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="expiresIn">
				{(field) => (
					<div className="flex min-w-0 flex-col">
						<select
							aria-label="Paste expiry"
							className="h-8 w-28 border border-input bg-background px-2 text-xs outline-none focus:border-ring focus:ring-1 focus:ring-ring"
							value={field.state.value}
							onChange={(event) => {
								const selected = PasteExpiryOptions.find(
									(option) => option.value === event.target.value,
								);
								if (selected) field.handleChange(selected.value);
							}}
						>
							{PasteExpiryOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						<FieldErrors errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<form.Field name="password">
				{(field) => (
					<div className="flex min-w-0 flex-col">
						<Button
							type="button"
							size="sm"
							variant={password ? "secondary" : "outline"}
							onClick={() => setPasswordDialogOpen(true)}
						>
							<LockKeyhole className="size-3.5" aria-hidden="true" />
							{password ? "Password on" : "Add password"}
						</Button>
						<PasswordDialog
							open={passwordDialogOpen}
							isProtected={Boolean(password)}
							onOpenChange={setPasswordDialogOpen}
							onPasswordChange={onPasswordChange}
						/>
						<FieldErrors errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
		</div>
	);
}
