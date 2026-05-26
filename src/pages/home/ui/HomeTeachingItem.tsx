import { cn } from "@/shared/lib";

import type { HomeTeachingFeatureViewModel } from "../lib";

type HomeTeachingItemProps = {
	feature: HomeTeachingFeatureViewModel;
};

export function HomeTeachingItem({ feature }: HomeTeachingItemProps) {
	return (
		<article
			className={cn(
				"group relative flex h-full cursor-default flex-col overflow-hidden rounded-lg border border-border/75 bg-card/70 p-5 transition-colors sm:p-6",
				feature.isSealed
					? "hover:border-dungeon-rune-sealed/40"
					: "hover:border-dungeon-gold/40",
			)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-md border bg-background/50",
						feature.iconClassName,
					)}
				>
					<feature.Icon aria-hidden="true" className="size-4" />
				</div>

				<div className="space-y-2">
					<h3 className="text-base font-semibold text-panel-title sm:text-lg">
						{feature.title}
					</h3>
					<p className="text-sm leading-6 text-panel-body sm:text-base">
						{feature.description}
					</p>
				</div>
			</div>
		</article>
	);
}
