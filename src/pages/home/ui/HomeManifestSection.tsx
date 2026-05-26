import { Badge } from "@/shared/ui";

import type { HomeManifestNodeViewModel } from "../lib";

import { HomeManifestNode } from "./HomeManifestNode";

type HomeManifestSectionProps = {
	focusItem: {
		badge: string;
		description: string;
		title: string;
		toneClassName: string;
	};
	heading: string;
	nodes: readonly HomeManifestNodeViewModel[];
	subtitle: string;
};

export function HomeManifestSection({
	focusItem,
	heading,
	nodes,
	subtitle,
}: HomeManifestSectionProps) {
	return (
		<section aria-labelledby="manifest-map-heading" className="space-y-6">
			<div className="space-y-2">
				<h2
					id="manifest-map-heading"
					className="text-2xl font-semibold tracking-tight text-panel-title sm:text-3xl"
				>
					{heading}
				</h2>
				<p className="max-w-2xl text-sm leading-6 text-panel-body sm:text-base">
					{subtitle}
				</p>
			</div>

			<div className="overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur">
				<div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
					<div className="relative min-h-72 overflow-hidden p-5 sm:p-6 lg:min-h-96">
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-[url('/marketing/game-running-bg.png')] bg-cover bg-center opacity-20 saturate-125 brightness-75 contrast-110"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/45 to-background/20"
						/>
						<div className="relative z-10 flex h-full items-center justify-center">
							<ol className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
								{nodes.map((node) => (
									<HomeManifestNode key={node.id} node={node} />
								))}
							</ol>
						</div>
					</div>

					<aside className="border-border border-t bg-background/90 p-5 lg:border-l lg:border-t-0 lg:p-6">
						<div className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-dungeon-gold">
							Node Inspector
						</div>

						<div className="mt-5 space-y-4">
							<div>
								<h3 className="text-2xl font-semibold text-panel-title">
									{focusItem.title}
								</h3>
								<Badge
									variant="outline"
									className={[
										"mt-3 w-fit rounded-sm bg-background/50 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
										focusItem.toneClassName,
									].join(" ")}
								>
									{focusItem.badge}
								</Badge>
							</div>

							<p className="text-sm leading-6 text-panel-body">
								{focusItem.description}
							</p>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
