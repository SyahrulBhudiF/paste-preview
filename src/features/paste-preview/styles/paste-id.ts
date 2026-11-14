import type { SystemStyleObject } from "@styled/types";

export const pageMainStyles: SystemStyleObject = {
	display: "flex",
	h: "100dvh",
	minW: "0",
	flexDirection: "column",
	overflow: "hidden",
	bg: "background",
	px: "2",
	pb: "2",
	color: "foreground",
	sm: { px: "3", pb: "3" },
};

export const pageTitleStyles: SystemStyleObject = {
	minW: "0",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	fontSize: "xs",
	lineHeight: "1rem",
	color: "muted-foreground",
};

export const newPasteLinkStyles: SystemStyleObject = {
	marginInlineStart: "auto",
	flexShrink: 0,
};
