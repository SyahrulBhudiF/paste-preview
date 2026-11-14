import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { styled } from "@styled/jsx";
import type { SystemStyleObject } from "@styled/types";

export const ComboboxRelative = styled("div", {
	base: { position: "relative" },
});

export const ComboboxInputRoot = styled(ComboboxPrimitive.Input, {
	base: {
		display: "flex",
		h: "8",
		w: "full",
		rounded: "sm",
		borderWidth: "1px",
		borderColor: "input",
		bg: "card",
		px: "2",
		pe: "7",
		fontSize: "xs",
		lineHeight: "1rem",
		outline: "none",
		_placeholder: { color: "muted-foreground" },
		_focus: { borderColor: "ring", boxShadow: "0 0 0 1px {colors.ring}" },
		_disabled: { cursor: "not-allowed", opacity: 0.5 },
	},
});

export const ComboboxTriggerRoot = styled(ComboboxPrimitive.Trigger, {
	base: {
		position: "absolute",
		insetBlock: "0",
		right: "2",
		display: "flex",
		alignItems: "center",
		color: "muted-foreground",
	},
});

export const ComboboxPositionerRoot = styled(ComboboxPrimitive.Positioner, {
	base: { zIndex: "50" },
});

export const ComboboxPopupRoot = styled(ComboboxPrimitive.Popup, {
	base: {
		maxH: "96",
		minW: "44",
		w: "var(--anchor-width)",
		overflow: "hidden",
		rounded: "sm",
		borderWidth: "1px",
		borderColor: "border",
		bg: "popover",
		color: "popover-foreground",
	},
});

export const ComboboxListRoot = styled(ComboboxPrimitive.List, {
	base: { maxH: "72", overflowY: "auto", p: "1" },
});

export const ComboboxItemRoot = styled(ComboboxPrimitive.Item, {
	base: {
		position: "relative",
		display: "flex",
		cursor: "default",
		userSelect: "none",
		alignItems: "center",
		rounded: "sm",
		py: "1.5",
		ps: "2",
		pe: "8",
		fontSize: "sm",
		lineHeight: "1.25rem",
		outline: "none",
		_highlighted: { bg: "accent", color: "accent-foreground" },
		_disabled: { pointerEvents: "none", opacity: 0.5 },
	},
});

export const ComboboxItemIndicatorRoot = styled(ComboboxPrimitive.ItemIndicator, {
	base: {
		position: "absolute",
		right: "2",
		display: "flex",
		boxSize: "4",
		alignItems: "center",
		justifyContent: "center",
	},
});

export const ComboboxEmptyRoot = styled(ComboboxPrimitive.Empty, {
	base: {
		py: "2",
		textAlign: "center",
		fontSize: "sm",
		lineHeight: "1.25rem",
		color: "muted-foreground",
	},
});

export const comboboxIconStyles: SystemStyleObject = { boxSize: "4" };
