import { DoorOpen, Lock, Package, Workflow, Zap } from "lucide-react";

import { cn } from "@/shared/lib";

import {
	HOME_COPY,
	HOME_FEATURES,
	HOME_TEACHING_TONE_CLASS_NAMES,
} from "../config";

const HOME_FEATURE_ICONS = {
	"Actors stay isolated": Workflow,
	"Context changes paths": Package,
	"Events move the system": Zap,
	"Guards control progression": Lock,
	"States become rooms": DoorOpen,
} as const;

export function HomeTeachingSection() {
	return (
		<section aria-labelledby="teaching-heading" className="space-y-6">
			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-border/70" />
				<h2
					id="teaching-heading"
					className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
				>
					{HOME_COPY.FEATURES_HEADING}
				</h2>
				<div className="h-px flex-1 bg-border/70" />
			</div>

			<ul className="grid gap-4 lg:grid-cols-3">
				{HOME_FEATURES.map((feature) => {
					const FeatureIcon = HOME_FEATURE_ICONS[feature.title];
					const isSealed = feature.tone === "sealed";

					return (
						<li key={feature.title} className={cn(feature.span, "h-full")}>
							<article
								className={cn(
									"group relative flex h-full cursor-default flex-col overflow-hidden rounded-lg border border-border/75 bg-card/70 p-5 transition-colors sm:p-6",
									isSealed
										? "hover:border-dungeon-rune-sealed/40"
										: "hover:border-dungeon-gold/40",
								)}
							>
								<div className="flex items-start gap-3">
									<div
										className={cn(
											"flex size-9 shrink-0 items-center justify-center rounded-md border bg-background/50",
											isSealed
												? "border-dungeon-rune-sealed/30 text-dungeon-rune-sealed"
												: "border-dungeon-gold/30 text-dungeon-gold",
										)}
									>
										<FeatureIcon aria-hidden="true" className="size-4" />
									</div>

									<div className="space-y-2">
										<h3
											className={cn(
												"text-base font-semibold sm:text-lg",
												HOME_TEACHING_TONE_CLASS_NAMES[feature.tone],
											)}
										>
											{feature.title}
										</h3>
										<p className="text-sm leading-6 text-panel-body sm:text-base">
											{feature.detail}
										</p>
									</div>
								</div>
							</article>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
