import { sva } from "@styled/css";

export const codeEditor = sva({
	slots: ["root", "gutter", "textarea"],
	base: {
		root: {
			position: "relative",
			minH: "0",
			flex: "1",
			overflow: "hidden",
			bg: "card",
		},
		gutter: {
			position: "absolute",
			inset: "0 auto 0 0",
			w: "44px",
			m: "0",
			overflow: "hidden",
			py: "8px",
			pe: "10px",
			ps: "0",
			color: "muted-foreground",
			fontFamily: "mono",
			fontSize: "11px",
			lineHeight: "22px",
			textAlign: "right",
			pointerEvents: "none",
		},
		textarea: {
			position: "absolute",
			inset: "0 0 0 auto",
			w: "100%",
			h: "100%",
			borderWidth: "0",
			rounded: "0",
			resize: "none",
			bg: "card",
			p: "8px 10px",
			color: "foreground",
			fontFamily: "mono",
			fontSize: "13px",
			lineHeight: "22px",
			tabSize: 2,
			scrollbarGutter: "stable",
			outline: "none",
			_focusVisible: { outline: "1px solid {colors.ring}", outlineOffset: "-1px" },
		},
	},
	variants: {
		lineNumbers: {
			true: {
				root: {
					"&::before": {
						position: "absolute",
						inset: "0 auto 0 0",
						w: "44px",
						borderRight: "1px solid {colors.border}",
						bg: "muted",
						content: '""',
					},
				},
				textarea: { w: "calc(100% - 44px)" },
			},
		},
		wrap: {
			true: { textarea: { overflowWrap: "anywhere", whiteSpace: "pre-wrap" } },
		},
	},
});
