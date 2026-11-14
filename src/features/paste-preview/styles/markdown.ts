import { sva } from "@styled/css";
import type { SystemStyleObject } from "@styled/types";

export const markdownIconStyles: SystemStyleObject = { boxSize: "3.5" };

export const markdown = sva({
	slots: ["article", "copyWrap", "copyButton", "codeBlock"],
	base: {
		article: { h: "full", maxW: "none", overflow: "auto", p: "3", sm: { p: "4" } },
		copyWrap: { position: "relative" },
		copyButton: {
			position: "absolute",
			right: "2",
			top: "2",
			zIndex: "10",
			display: "inline-flex",
			alignItems: "center",
			gap: "1.5",
			borderWidth: "1px",
			borderColor: "border",
			bg: "card",
			px: "2",
			py: "1",
			fontSize: "xs",
			lineHeight: "1rem",
			color: "muted-foreground",
			opacity: 0.7,
			transition: "opacity",
			_hover: { opacity: 1 },
			_focusVisible: {
				opacity: 1,
				outline: "none",
				boxShadow: "0 0 0 2px {colors.ring}",
			},
		},
		codeBlock: { pe: "20" },
	},
});
