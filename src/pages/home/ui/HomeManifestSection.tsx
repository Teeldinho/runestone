import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import {
	HOME_COPY,
	HOME_MANIFEST_FOCUS_ITEM,
	HOME_MANIFEST_MAP_NODES,
	HOME_MANIFEST_TONE_CLASS_NAMES,
} from "../config";

export function HomeManifestSection() {
	return (
		<section aria-labelledby="manifest-map-heading" className="space-y-5">
			<h2 id="manifest-map-heading" className="sr-only">
				{HOME_COPY.MANIFEST_PATH_HEADING}
			</h2>

			<div className="overflow-hidden rounded-xl border border-border bg-card/80 p-5 backdrop-blur sm:p-6">
				<div className="grid md:grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
					<div className="relative hidden min-h-[32rem] overflow-hidden lg:flex lg:items-center lg:justify-center">
						<div className="relative h-[28rem] w-full overflow-hidden lg:h-[32rem]">
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-[url('/marketing/game-running-bg.png')] bg-cover bg-center opacity-30 saturate-125 brightness-75 contrast-110 blur-sm scale-105"
							/>
							<img
								aria-hidden="true"
								alt=""
								className="absolute inset-0 h-full w-full object-contain object-center opacity-85 saturate-125 brightness-90 contrast-110"
								src="/marketing/game-running-bg.png"
							/>
							<div className="absolute inset-0 bg-gradient-to-br from-background/36 via-background/18 to-background/02" />
							<div className="relative h-full w-full">
								<div
									aria-hidden="true"
									className="absolute top-[118px] left-[180px] h-px w-[96px] bg-border/80"
								/>
								<div
									aria-hidden="true"
									className="absolute top-[118px] left-[276px] h-px w-[114px] bg-border/80"
								/>
								<div
									aria-hidden="true"
									className="absolute top-[118px] left-[276px] h-[92px] w-px bg-border/80"
								/>

								{HOME_MANIFEST_MAP_NODES.map((node) => (
									<div
										key={node.label}
										className={cn(
											"absolute rounded-md border border-border bg-background/75 p-4 text-center text-sm font-semibold text-panel-title shadow-lg transition-colors hover:border-dungeon-gold/50",
											node.position,
											node.tone === "sealed"
												? "border-dungeon-rune-sealed/50 shadow-[0_0_15px_color-mix(in_srgb,var(--color-dungeon-rune-sealed)_18%,transparent)]"
												: "",
										)}
									>
										<div className="space-y-1">
											<div
												className={cn(
													"text-sm",
													HOME_MANIFEST_TONE_CLASS_NAMES[node.tone],
												)}
											>
												{node.label}
											</div>
											<div className="text-xs font-normal text-panel-body">
												{node.detail}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="border-t border-border bg-background/90 p-5 lg:border-l lg:border-t-0 lg:bg-background/95 lg:p-6">
						<div className="mb-4 border-b border-border pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-dungeon-gold">
							Node Inspector
						</div>
						<h3 className="text-2xl font-semibold text-panel-title">
							{HOME_MANIFEST_FOCUS_ITEM.label}
						</h3>
						<Badge
							variant="outline"
							className={cn(
								"mt-3 w-fit border-accent/30 bg-accent/10 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-accent",
								"rounded-sm",
							)}
						>
							{HOME_MANIFEST_FOCUS_ITEM.badge}
						</Badge>
						<p className="mt-4 text-sm leading-6 text-panel-body">
							{HOME_MANIFEST_FOCUS_ITEM.detail}
						</p>

						<div className="mt-6 grid gap-3 lg:hidden">
							{HOME_MANIFEST_MAP_NODES.map((node) => (
								<div
									key={node.label}
									className={cn(
										"rounded-lg border border-border bg-card/80 p-4",
										node.tone === "sealed"
											? "border-dungeon-rune-sealed/40"
											: "",
									)}
								>
									<div
										className={cn(
											"text-sm font-semibold",
											HOME_MANIFEST_TONE_CLASS_NAMES[node.tone],
										)}
									>
										{node.label}
									</div>
									<p className="mt-1 text-xs text-panel-body">{node.detail}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
