import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { css } from "@styled/css";
import { Button } from "@/components/ui/button";
import { FieldErrors } from "@/features/paste-preview/components/form/field-errors";
import { PasswordDialog } from "@/features/paste-preview/components/form/password-dialog";
import {
	expirySelectStyles,
	lockIconStyles,
	optionsBarStyles,
	titleFieldStyles,
	titleInputStyles,
} from "@/features/paste-preview/styles/form";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { PasteExpiryOptions } from "@/libs/schemas/paste";

const styles = workspaceChrome();

interface PasteOptionsBarProps {
	form: PasteFormApi;
	password: string;
	onPasswordChange: (password: string) => void;
}

export function PasteOptionsBar({ form, password, onPasswordChange }: PasteOptionsBarProps) {
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

	return (
		<div className={css(optionsBarStyles)}>
			<form.Field name="title">
				{(field) => (
					<div className={css(titleFieldStyles)}>
						<input
							aria-label="Paste title (optional)"
							className={css(titleInputStyles)}
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
					<div className={styles.fieldColumn}>
						<select
							aria-label="Paste expiry"
							className={css(expirySelectStyles)}
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
					<div className={styles.fieldColumn}>
						<Button
							type="button"
							size="sm"
							variant={password ? "secondary" : "outline"}
							onClick={() => setPasswordDialogOpen(true)}
						>
							<LockKeyhole className={css(lockIconStyles)} aria-hidden="true" />
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
