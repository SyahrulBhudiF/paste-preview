import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/libs/utils/cn";

export const Combobox = ComboboxPrimitive.Root;

export function ComboboxInput({
	className,
	...props
}: ComboboxPrimitive.Input.Props & { className?: string }) {
	return (
		<div className="relative">
			<ComboboxPrimitive.Input
				className={cn(
					"flex h-11 w-full rounded-2xl border border-input bg-background/80 px-3 pr-9 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
			<ComboboxPrimitive.Trigger className="absolute inset-y-0 right-2 flex items-center text-muted-foreground">
				<ChevronDownIcon className="size-4" />
			</ComboboxPrimitive.Trigger>
		</div>
	);
}

export function ComboboxContent({
	className,
	...props
}: ComboboxPrimitive.Popup.Props & { className?: string }) {
	return (
		<ComboboxPrimitive.Portal>
			<ComboboxPrimitive.Positioner sideOffset={6} className="z-50">
				<ComboboxPrimitive.Popup
					className={cn(
						"max-h-96 w-[var(--anchor-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
						className,
					)}
					{...props}
				/>
			</ComboboxPrimitive.Positioner>
		</ComboboxPrimitive.Portal>
	);
}

export function ComboboxList({
	className,
	...props
}: ComboboxPrimitive.List.Props & { className?: string }) {
	return (
		<ComboboxPrimitive.List
			className={cn("max-h-72 overflow-y-auto p-1", className)}
			{...props}
		/>
	);
}

export function ComboboxItem({
	className,
	children,
	...props
}: ComboboxPrimitive.Item.Props & { className?: string }) {
	return (
		<ComboboxPrimitive.Item
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
			<ComboboxPrimitive.ItemIndicator className="absolute right-2 flex size-4 items-center justify-center">
				<CheckIcon className="size-4" />
			</ComboboxPrimitive.ItemIndicator>
		</ComboboxPrimitive.Item>
	);
}

export function ComboboxEmpty({
	className,
	...props
}: ComboboxPrimitive.Empty.Props & { className?: string }) {
	return (
		<ComboboxPrimitive.Empty
			className={cn("py-2 text-center text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
