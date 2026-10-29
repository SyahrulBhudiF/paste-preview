import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/libs/utils/cn";

export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
	return <TabsPrimitive.Root className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
	return (
		<TabsPrimitive.List
			className={cn(
				"inline-flex h-9 items-center border-b border-border bg-secondary/50 text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
	return (
		<TabsPrimitive.Tab
			className={cn(
				"inline-flex h-9 items-center justify-center border-b-2 border-transparent px-3 text-xs font-medium outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-active:border-primary data-active:text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
	return (
		<TabsPrimitive.Panel className={cn("min-h-0 flex-1 outline-none", className)} {...props} />
	);
}
