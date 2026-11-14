import { sva } from "@styled/css";
import type { SystemStyleObject } from "@styled/types";

export const formShellStyles: SystemStyleObject = {
	display: "flex",
	h: "full",
	minH: "0",
	minW: "0",
	flexDirection: "column",
	px: "2",
	pb: "2",
	sm: { px: "3", pb: "3" },
};

export const optionsBarStyles: SystemStyleObject = {
	display: "flex",
	minW: "0",
	flexWrap: "wrap",
	alignItems: "center",
	gap: "2",
	borderInlineWidth: "1px",
	borderColor: "border",
	bg: "card",
	px: "2",
	py: "2",
	sm: { px: "3" },
};

export const fieldStyles: SystemStyleObject = {
	h: "8",
	borderWidth: "1px",
	borderColor: "input",
	bg: "background",
	px: "2",
	fontSize: "xs",
	lineHeight: "1rem",
	outline: "none",
	_focus: { borderColor: "ring", boxShadow: "0 0 0 1px {colors.ring}" },
};

export const titleFieldStyles: SystemStyleObject = {
	display: "flex",
	minW: "28",
	flex: "1",
	flexDirection: "column",
};

export const titleInputStyles: SystemStyleObject = {
	...fieldStyles,
	w: "full",
	_placeholder: { color: "muted-foreground" },
};

export const expirySelectStyles: SystemStyleObject = {
	...fieldStyles,
	w: "28",
};

export const languageInputStyles: SystemStyleObject = {
	w: "6.5rem",
	"@media (min-width: 380px)": { w: "8rem" },
	sm: { w: "11rem" },
};

export const saveButtonStyles: SystemStyleObject = {
	marginInlineStart: "auto",
	flexShrink: 0,
	sm: { marginInlineStart: "0" },
};

export const lockIconStyles: SystemStyleObject = { boxSize: "3.5" };

export const copyLinkButtonStyles: SystemStyleObject = { flexShrink: 0 };

export const shareLink = sva({
	slots: ["banner", "label", "link", "note"],
	base: {
		banner: {
			mb: "2",
			display: "flex",
			minW: "0",
			flexWrap: "wrap",
			alignItems: "center",
			columnGap: "3",
			rowGap: "1",
			borderWidth: "1px",
			borderColor: "border",
			bg: "secondary",
			px: "3",
			py: "1.5",
			fontSize: "xs",
			lineHeight: "1rem",
		},
		label: { flexShrink: 0, color: "muted-foreground" },
		link: {
			minW: "0",
			flex: "1",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			color: "primary",
			textDecoration: "underline",
			textUnderlineOffset: "4px",
		},
		note: { flexBasis: "full", color: "muted-foreground" },
	},
});
