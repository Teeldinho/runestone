import { cn } from "@/shared/lib";
import { Badge } from "@/shared/ui";

import {
	TUTORIAL_FIRST_RUN_TONE_CLASS_NAMES,
	TUTORIAL_FIRST_RUN_TONES,
} from "../config";
import type { TutorialPageViewModel } from "../lib";

type TutorialFirstRunPanelProps = TutorialPageViewModel["firstRunSectionProps"];

export function TutorialFirstRunPanel({
	heading,
	steps,
}: TutorialFirstRunPanelProps) {
	return (
		<section aria-labelledby="first-run-heading" className="space-y-6">
			<div className="flex items-center gap-4">
				<h2
					id="first-run-heading"
					className="text-2xl font-semibold text-foreground sm:text-3xl"
				>
					{heading}
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
			</div>

			<ol className="grid gap-4">
				{steps.map((step, index) => (
					<li
						key={step.label}
						className="grid grid-cols-[auto_minmax(0,1fr)] gap-4"
					>
						<div className="flex flex-col items-center pt-1">
							<div
								className={cn(
									"flex size-8 items-center justify-center rounded-full border text-[0.7rem] font-bold",
									index === 0
										? "border-dungeon-gold/45 bg-dungeon-gold/10 text-dungeon-gold"
										: "border-border bg-card/70 text-muted-foreground",
								)}
							>
								{String(index + 1).padStart(2, "0")}
							</div>
							{index < steps.length - 1 ? (
								<div className="mt-2 h-full w-px flex-1 bg-border/80" />
							) : null}
						</div>

						<div className="group relative overflow-hidden rounded-lg border border-border/75 bg-card/70 p-5 transition-colors hover:border-dungeon-gold/50 sm:p-6">
							<div className="absolute top-0 left-0 h-full w-1 bg-dungeon-gold opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="space-y-3">
								<h3 className="text-sm font-semibold text-foreground sm:text-base">
									{step.label}
								</h3>
								<div className="flex flex-wrap gap-2">
									{step.tokens.map((token) => (
										<Badge
											key={token.label}
											variant="outline"
											className={cn(
												"rounded-sm border bg-background/40 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
												TUTORIAL_FIRST_RUN_TONE_CLASS_NAMES[token.tone],
												token.tone === TUTORIAL_FIRST_RUN_TONES.SEALED
													? "border-dungeon-rune-sealed/30"
													: token.tone === TUTORIAL_FIRST_RUN_TONES.SUCCESS
														? "border-success/30"
														: "border-dungeon-gold/30",
											)}
										>
											{token.label}
										</Badge>
									))}
								</div>
								<p className="text-sm leading-6 text-panel-body sm:text-base">
									{step.detail}
								</p>
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
