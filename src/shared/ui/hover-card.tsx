import { HoverCard as HoverCardPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/shared/lib";

function HoverCard({
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
	return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
	return (
		<HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
	);
}

function HoverCardContent({
	className,
	align = "center",
	sideOffset = 6,
	...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
	return (
		<HoverCardPrimitive.Portal>
			<HoverCardPrimitive.Content
				data-slot="hover-card-content"
				align={align}
				sideOffset={sideOffset}
				className={cn(
					"z-50 w-64 rounded-md border border-panel-border bg-panel px-3 py-2 text-xs text-panel-title shadow-md outline-none",
					className,
				)}
				{...props}
			/>
		</HoverCardPrimitive.Portal>
	);
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
