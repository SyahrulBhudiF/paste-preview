import { sva } from "@styled/css";

export const preview = sva({
	slots: ["empty", "limited", "banner", "showFull", "body"],
	base: {
		empty: {
			px: "3",
			py: "2",
			fontSize: "xs",
			lineHeight: "1rem",
			color: "muted-foreground",
		},
		limited: { display: "flex", h: "full", minH: "0", flexDirection: "column" },
		banner: {
			display: "flex",
			flexShrink: 0,
			alignItems: "center",
			justifyContent: "space-between",
			gap: "3",
			borderBottom: "1px solid {colors.border}",
			bg: "secondary/40",
			px: "3",
			py: "1.5",
			fontSize: "xs",
			lineHeight: "1rem",
			color: "muted-foreground",
		},
		showFull: {
			flexShrink: 0,
			textDecoration: "underline",
			textUnderlineOffset: "2px",
			_hover: { color: "foreground" },
		},
		body: { minH: "0", flex: "1" },
	},
});
