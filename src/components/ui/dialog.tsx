import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { css } from "@styled/css";
import type { SystemStyleObject } from "@styled/types";
import { dialogRecipe } from "./dialog.styles";

const slotStyles = dialogRecipe.raw();

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
	css: styles,
	children,
	...props
}: Omit<DialogPrimitive.Popup.Props, "className"> & { css?: SystemStyleObject }) {
	return (
		<DialogPrimitive.Portal>
			<DialogPrimitive.Backdrop className={css(slotStyles.backdrop)} />
			<DialogPrimitive.Popup className={css(slotStyles.popup, styles)} {...props}>
				{children}
			</DialogPrimitive.Popup>
		</DialogPrimitive.Portal>
	);
}

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
