import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Link } from "@tanstack/react-router";
import { cva } from "@styled/css";
import { styled } from "@styled/jsx";
import type { RecipeVariantProps } from "@styled/types";

const buttonRecipe = cva({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: "2",
		rounded: "sm",
		fontSize: "sm",
		lineHeight: "1.25rem",
		fontWeight: "medium",
		transition: "colors",
		_focusVisible: { outline: "2px solid {colors.ring}", outlineOffset: "2px" },
		_disabled: { pointerEvents: "none", opacity: 0.5 },
	},
	variants: {
		variant: {
			default: {
				bg: "primary",
				color: "primary-foreground",
				_hover: { bg: "primary/90" },
			},
			secondary: {
				bg: "secondary",
				color: "secondary-foreground",
				_hover: { bg: "secondary/80" },
			},
			ghost: {
				_hover: { bg: "accent", color: "accent-foreground" },
			},
			outline: {
				border: "1px solid {colors.input}",
				bg: "background",
				_hover: { bg: "accent", color: "accent-foreground" },
			},
			destructive: {
				bg: "destructive",
				color: "destructive-foreground",
				_hover: { bg: "destructive/90" },
			},
		},
		size: {
			default: { h: "9", px: "3", py: "1.5" },
			sm: { h: "8", px: "3", fontSize: "xs", lineHeight: "1rem" },
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>;

export type ButtonVariant = NonNullable<ButtonVariantProps["variant"]>;
export type ButtonSize = NonNullable<ButtonVariantProps["size"]>;

export const Button = styled(ButtonPrimitive, buttonRecipe);
export const ButtonLink = styled(Link, buttonRecipe);
