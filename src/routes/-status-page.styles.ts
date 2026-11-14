import { sva } from "@styled/css";
import type { SystemStyleObject } from "@styled/types";

export const statusActionsRowStyles: SystemStyleObject = {
	display: "flex",
	flexDirection: "column",
	gap: "3",
	sm: { flexDirection: "row" },
};

export const statusPage = sva({
	slots: [
		"main",
		"container",
		"section",
		"content",
		"eyebrow",
		"title",
		"description",
		"actions",
	],
	base: {
		main: {
			minH: "100dvh",
			bg: "background",
			px: "4",
			py: "6",
			color: "foreground",
		},
		container: {
			marginInline: "auto",
			display: "flex",
			minH: "calc(100dvh - 3rem)",
			maxW: "5xl",
			alignItems: "center",
		},
		section: {
			w: "full",
			borderBlockWidth: "1px",
			borderColor: "border",
			py: "10",
			sm: { py: "14" },
		},
		content: { maxW: "xl" },
		eyebrow: {
			fontSize: "xs",
			lineHeight: "1rem",
			fontWeight: "medium",
			textTransform: "uppercase",
			letterSpacing: "0.18em",
			color: "muted-foreground",
		},
		title: {
			mt: "4",
			fontSize: "3xl",
			lineHeight: "2.25rem",
			fontWeight: "semibold",
			letterSpacing: "tight",
			sm: { fontSize: "5xl", lineHeight: "1" },
		},
		description: {
			mt: "4",
			maxW: "md",
			fontSize: "base",
			lineHeight: "1.75rem",
			color: "muted-foreground",
		},
		actions: { mt: "8" },
	},
});
