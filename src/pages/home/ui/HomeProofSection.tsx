import { Activity, Box, Braces } from "lucide-react";

import { HOME_COPY, HOME_SECTION_IDS, HOME_SYSTEM_VIEWS } from "../config";

const HOME_SYSTEM_VIEW_ICONS = [Box, Activity, Braces] as const;

export function HomeProofSection() {
	return (
		<section
			id={HOME_SECTION_IDS.HOW_IT_WORKS}
			aria-labelledby="proof-heading"
			className="rounded-3xl border border-panel-border bg-card/50 p-5 shadow-2xl backdrop-blur-sm sm:p-8 lg:p-10"
		>
			<div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:gap-16">
				<figure className="relative overflow-hidden rounded-3xl border border-panel-border bg-background/80 p-2 shadow-2xl">
					<img
						src="/marketing/game-running-bg.webp"
						alt="Runestone showing the 3D dungeon beside a live statechart and run context"
						width="1410"
						height="974"
						loading="eager"
						decoding="async"
						className="aspect-[1.45] w-full rounded-2xl object-cover object-center"
					/>
					<figcaption className="flex items-center justify-between gap-4 px-2 pt-3 font-mono text-xs text-muted-foreground">
						<span>One run, three synchronized views</span>
						<span className="text-dungeon-rune">live</span>
					</figcaption>
				</figure>

				<div className="space-y-8">
					<div className="space-y-4">
						<h2
							id="proof-heading"
							className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
						>
							{HOME_COPY.PROOF_HEADING}
						</h2>
						<p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
							{HOME_COPY.PROOF_SUBTITLE}
						</p>
					</div>

					<ul className="grid gap-3">
						{HOME_SYSTEM_VIEWS.map((view, index) => {
							const Icon = HOME_SYSTEM_VIEW_ICONS[index] ?? Activity;
							return (
								<li
									key={view.label}
									className="grid grid-cols-[2.75rem_1fr] gap-3 rounded-2xl border border-panel-border bg-background/45 p-4"
								>
									<Icon
										aria-hidden="true"
										className="mt-1 size-5 text-dungeon-gold"
									/>
									<div>
										<h3 className="font-semibold">{view.label}</h3>
										<p className="mt-1 text-sm leading-6 text-muted-foreground">
											{view.description}
										</p>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
}
