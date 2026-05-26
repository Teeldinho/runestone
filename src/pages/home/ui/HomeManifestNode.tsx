import { cn } from "@/shared/lib";

import type { HomeManifestNodeViewModel } from "../lib";

type HomeManifestNodeProps = {
	node: HomeManifestNodeViewModel;
};

export function HomeManifestNode({ node }: HomeManifestNodeProps) {
	return (
		<li className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg border border-border/75 bg-background/65 p-4 sm:gap-4 sm:p-5">
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"flex size-8 items-center justify-center rounded-full border bg-background/55 text-[0.7rem] font-bold",
						node.toneClassName,
					)}
				>
					{node.indexLabel}
				</div>
				{node.isLast ? null : <div className="mt-2 h-full w-px bg-border/70" />}
			</div>

			<div className="space-y-1">
				<h3 className="text-sm font-semibold text-panel-title">{node.title}</h3>
				<p className="text-sm leading-6 text-panel-body">{node.description}</p>
			</div>
		</li>
	);
}
