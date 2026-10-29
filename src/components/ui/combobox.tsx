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
					"flex h-8 w-full rounded-sm border border-input bg-card px-2 pr-7 text-xs outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
			<ComboboxPrimitive.Trigger
				aria-label="Choose language"
				className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
			>
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
						"max-h-96 min-w-44 w-[var(--anchor-width)] overflow-hidden rounded-sm border border-border bg-popover text-popover-foreground",
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
