import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { buttonVariants, type ButtonSize, type ButtonVariant } from "./button-variants";

type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "render"> & {
	className?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
	({ className, variant = "default", size = "default", ...props }, ref) => (
		<ButtonPrimitive
			ref={ref}
			className={buttonVariants({ className, variant, size })}
			{...props}
		/>
	),
);

Button.displayName = "Button";
