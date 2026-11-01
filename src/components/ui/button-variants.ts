import { cn } from "@/libs/utils/cn";

export type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "destructive";
export type ButtonSize = "default" | "sm";

const variants = {
	default: "bg-primary text-primary-foreground hover:bg-primary/90",
	secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
	ghost: "hover:bg-accent hover:text-accent-foreground",
	outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
	destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
} satisfies Record<ButtonVariant, string>;

const sizes = {
	default: "h-9 px-3 py-1.5",
	sm: "h-8 px-3 text-xs",
} satisfies Record<ButtonSize, string>;

export const buttonVariants = ({
	className,
	variant = "default",
	size = "default",
}: {
	className?: string;
	variant?: ButtonVariant;
	size?: ButtonSize;
} = {}) =>
	cn(
		"inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
		variants[variant],
		sizes[size],
		className,
	);
