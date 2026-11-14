import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { css } from "@styled/css";
import type { SystemStyleObject } from "@styled/types";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
	ComboboxEmptyRoot,
	ComboboxInputRoot,
	ComboboxItemIndicatorRoot,
	ComboboxItemRoot,
	ComboboxListRoot,
	ComboboxPopupRoot,
	ComboboxPositionerRoot,
	ComboboxRelative,
	ComboboxTriggerRoot,
	comboboxIconStyles,
} from "./combobox.styles";

export const Combobox = ComboboxPrimitive.Root;

type WithStyles<Props> = Omit<Props, "className"> & { css?: SystemStyleObject };

export function ComboboxInput({
	css: styles,
	...props
}: WithStyles<ComboboxPrimitive.Input.Props>) {
	return (
		<ComboboxRelative>
			<ComboboxInputRoot css={styles} {...props} />
			<ComboboxTriggerRoot aria-label="Choose language">
				<ChevronDownIcon className={css(comboboxIconStyles)} />
			</ComboboxTriggerRoot>
		</ComboboxRelative>
	);
}

export function ComboboxContent({
	css: styles,
	...props
}: WithStyles<ComboboxPrimitive.Popup.Props>) {
	return (
		<ComboboxPrimitive.Portal>
			<ComboboxPositionerRoot sideOffset={6}>
				<ComboboxPopupRoot css={styles} {...props} />
			</ComboboxPositionerRoot>
		</ComboboxPrimitive.Portal>
	);
}

export function ComboboxList({ css: styles, ...props }: WithStyles<ComboboxPrimitive.List.Props>) {
	return <ComboboxListRoot css={styles} {...props} />;
}

export function ComboboxItem({
	css: styles,
	children,
	...props
}: WithStyles<ComboboxPrimitive.Item.Props>) {
	return (
		<ComboboxItemRoot css={styles} {...props}>
			{children}
			<ComboboxItemIndicatorRoot>
				<CheckIcon className={css(comboboxIconStyles)} />
			</ComboboxItemIndicatorRoot>
		</ComboboxItemRoot>
	);
}

export function ComboboxEmpty({
	css: styles,
	...props
}: WithStyles<ComboboxPrimitive.Empty.Props>) {
	return <ComboboxEmptyRoot css={styles} {...props} />;
}
