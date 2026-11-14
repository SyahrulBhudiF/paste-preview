import { sva } from "@styled/css";

export const pasteWorkspace = sva({
	slots: ["root", "body", "lockedRoot", "lockedTitle", "lockedDescription"],
	base: {
		root: {
			display: "flex",
			minH: "0",
			minW: "0",
			flex: "1",
			flexDirection: "column",
			borderWidth: "1px",
			borderColor: "border",
			bg: "card",
		},
		body: { minH: "0", minW: "0", flex: "1", overflow: "hidden" },
		lockedRoot: {
			display: "flex",
			minH: "0",
			flex: "1",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: "3",
			borderWidth: "1px",
			borderColor: "border",
			bg: "card",
			px: "4",
			textAlign: "center",
		},
		lockedTitle: { fontSize: "sm", lineHeight: "1.25rem", fontWeight: "semibold" },
		lockedDescription: {
			maxW: "sm",
			fontSize: "sm",
			lineHeight: "1.25rem",
			color: "muted-foreground",
		},
	},
});
