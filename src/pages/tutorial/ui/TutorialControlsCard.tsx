import { Keyboard } from "lucide-react";

import { Badge } from "@/shared/ui";

import { TUTORIAL_CONTROLS, TUTORIAL_COPY } from "../config";

export function TutorialControlsCard() {
	return (
		<section className="px-5 py-5 sm:px-6">
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dungeon-gold/30 text-dungeon-gold">
					<Keyboard className="size-4" />
				</div>
				<div className="space-y-1">
					<h2 className="text-sm font-semibold text-panel-title">
						{TUTORIAL_COPY.CONTROLS_HEADING}
					</h2>
					<p className="text-sm leading-6 text-panel-body">
						{TUTORIAL_COPY.CONTROLS_DESCRIPTION}
					</p>
				</div>
			</div>

			<dl className="mt-4 divide-y divide-panel-border/70">
				{TUTORIAL_CONTROLS.map(({ detail, keyLabel, label }) => (
					<div
						key={keyLabel}
						className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
					>
						<div className="space-y-1">
							<dt className="text-sm font-medium text-panel-title">{label}</dt>
							<dd className="text-sm leading-6 text-panel-body">{detail}</dd>
						</div>
						<Badge
							variant="outline"
							className="border-dungeon-gold/30 text-dungeon-gold"
						>
							{keyLabel}
						</Badge>
					</div>
				))}
			</dl>
		</section>
	);
}
