import { sva } from "@styled/css";

export const htmlPreview = sva({
	slots: ["placeholder", "frame"],
	base: {
		placeholder: {
			display: "flex",
			h: "full",
			w: "full",
			alignItems: "center",
			justifyContent: "center",
			bg: "white",
			fontSize: "xs",
			lineHeight: "1rem",
			color: "muted-foreground",
		},
		frame: { display: "block", h: "full", w: "full", borderWidth: "0", bg: "white" },
	},
});
