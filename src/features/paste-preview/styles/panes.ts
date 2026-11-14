import { sva } from "@styled/css";

export const panes = sva({
	slots: ["switch", "grid", "editorPane", "previewPane", "editorBody", "previewBody"],
	base: {
		switch: {
			display: "flex",
			minW: "0",
			flexShrink: 0,
			borderInlineWidth: "1px",
			borderTopWidth: "1px",
			borderBottomWidth: "0",
			borderColor: "border",
			bg: "secondary/50",
			md: { display: "none" },
		},
		grid: {
			display: "grid",
			minH: "0",
			minW: "0",
			flex: "1",
			borderWidth: "1px",
			borderColor: "border",
			bg: "card",
			md: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
		},
		editorPane: {
			minH: "0",
			minW: "0",
			flexDirection: "column",
			md: { display: "flex" },
		},
		previewPane: {
			minH: "0",
			minW: "0",
			flexDirection: "column",
			md: { display: "flex", borderLeftWidth: "1px", borderColor: "border" },
		},
		editorBody: {
			display: "flex",
			minH: "0",
			minW: "0",
			flex: "1",
			flexDirection: "column",
		},
		previewBody: { minH: "0", minW: "0", flex: "1", overflow: "hidden" },
	},
	variants: {
		pane: {
			editor: { editorPane: { display: "flex" }, previewPane: { display: "none" } },
			preview: { editorPane: { display: "none" }, previewPane: { display: "flex" } },
		},
	},
	defaultVariants: { pane: "editor" },
});
