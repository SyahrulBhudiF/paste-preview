import { Button } from "@/components/ui/button";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { FieldErrors } from "@/features/paste-preview/components/form/field-errors";
import type { PasteFormApi } from "@/features/paste-preview/hooks/use-paste-form";
import { languageInputStyles, saveButtonStyles } from "@/features/paste-preview/styles/form";
import { workspaceChrome } from "@/features/paste-preview/styles/workspace";
import { PasteLanguages } from "@/libs/language";
import type { PasteFormValues } from "@/libs/schemas/paste";

const styles = workspaceChrome();

interface PasteFormHeaderProps {
	form: PasteFormApi;
	languageLabel: string;
	selectedLanguage: PasteFormValues["language"];
	isSaving: boolean;
	hasContent: boolean;
}

export function PasteFormHeader({
	form,
	languageLabel,
	selectedLanguage,
	isSaving,
	hasContent,
}: PasteFormHeaderProps) {
	return (
		<header className={styles.header}>
			<h1 className={styles.wordmark}>
				paste<span>/</span>preview
			</h1>
			<form.Field name="language">
				{(field) => (
					<div className={styles.fieldColumn}>
						<Combobox
							items={PasteLanguages}
							value={
								PasteLanguages.find((item) => item.value === selectedLanguage) ??
								null
							}
							itemToStringLabel={(item) =>
								item.value === "auto" && selectedLanguage === "auto"
									? languageLabel
									: item.label
							}
							itemToStringValue={(item) => item.label}
							onValueChange={(item) => {
								if (!item) return;
								field.handleChange(item.value);
							}}
						>
							<ComboboxInput
								aria-label="Language"
								placeholder={languageLabel}
								css={languageInputStyles}
							/>
							<ComboboxContent>
								<ComboboxEmpty>No languages found.</ComboboxEmpty>
								<ComboboxList>
									{(item) => (
										<ComboboxItem key={item.value} value={item}>
											{item.label}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxContent>
						</Combobox>
						<FieldErrors errors={field.state.meta.errors} />
					</div>
				)}
			</form.Field>
			<Button
				type="submit"
				size="sm"
				disabled={isSaving || !hasContent}
				css={saveButtonStyles}
			>
				{isSaving ? "Saving..." : "Save & share"}
			</Button>
		</header>
	);
}
