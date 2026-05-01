import { Target } from "lucide-react";

import { Badge } from "@/shared/ui";

import { TUTORIAL_COPY, TUTORIAL_OBJECTIVES } from "../config";

export function TutorialObjectivesCard() {
	return (
		<section className="px-5 py-5 sm:px-6">
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dungeon-gold/30 text-dungeon-gold">
					<Target className="size-4" />
				</div>
				<div className="space-y-1">
					<h2 className="text-sm font-semibold text-panel-title">
						{TUTORIAL_COPY.OBJECTIVES_HEADING}
					</h2>
					<p className="text-sm leading-6 text-panel-body">
						{TUTORIAL_COPY.OBJECTIVES_DESCRIPTION}
					</p>
				</div>
			</div>

			<ol className="mt-4 space-y-3">
				{TUTORIAL_OBJECTIVES.map(({ step, label, detail }) => (
					<li key={step} className="flex items-start gap-3">
						<Badge
							variant="outline"
							className="mt-0.5 border-panel-border/80 text-panel-title"
						>
							{step}
						</Badge>
						<div className="space-y-1">
							<p className="text-sm font-medium text-panel-title">{label}</p>
							<p className="text-sm leading-6 text-panel-body">{detail}</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
