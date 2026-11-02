import { PasteFormHeader } from "@/features/paste-preview/components/form/header";
import { PasteOptionsBar } from "@/features/paste-preview/components/form/options";
import { PasteEditorPanes } from "@/features/paste-preview/components/form/panes";
import { ShareLinkBanner } from "@/features/paste-preview/components/form/share-link";
import { PasteStatusFooter } from "@/features/paste-preview/components/form/status";
import { usePasteForm } from "@/features/paste-preview/hooks/use-paste-form";

export function PasteForm() {
	const {
		content,
		copyShareUrl,
		expiresIn,
		form,
		hasContent,
		isSaving,
		languageLabel,
		password,
		previewLanguage,
		selectedLanguage,
		setPassword,
		setContent,
		sharePasswordProtected,
		shareUrl,
	} = usePasteForm();

	return (
		<form
			className="flex h-full min-h-0 min-w-0 flex-col px-2 pb-2 sm:px-3 sm:pb-3"
			action={() => void form.handleSubmit()}
		>
			<PasteFormHeader
				form={form}
				languageLabel={languageLabel}
				selectedLanguage={selectedLanguage}
				isSaving={isSaving}
				hasContent={hasContent}
			/>
			<PasteOptionsBar form={form} password={password} onPasswordChange={setPassword} />
			{shareUrl ? (
				<ShareLinkBanner
					shareUrl={shareUrl}
					passwordProtected={sharePasswordProtected}
					onCopy={copyShareUrl}
				/>
			) : null}
			<PasteEditorPanes
				form={form}
				content={content}
				previewLanguage={previewLanguage}
				hasContent={hasContent}
				onContentChange={setContent}
			/>
			<PasteStatusFooter
				content={content}
				languageLabel={languageLabel}
				expiresIn={expiresIn}
			/>
		</form>
	);
}
