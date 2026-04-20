import { Progress as ProgressPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/shared/lib/utils";

function Progress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				"relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="size-full flex-1 bg-primary transition-all"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

function HealthProgress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	const isLow = (value ?? 0) < 30;

	return (
		<ProgressPrimitive.Root
			data-slot="health-progress"
			className={cn(
				"relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-panel-border",
				className,
			)}
			aria-label="Health"
			{...props}
			value={value}
		>
			<ProgressPrimitive.Indicator
				data-slot="health-progress-indicator"
				className={cn(
					"size-full flex-1 rounded-full transition-all",
					isLow
						? "bg-gradient-to-r from-red-600 to-red-400"
						: "bg-gradient-to-r from-green-600 to-green-500",
				)}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { HealthProgress, Progress };
