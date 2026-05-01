import { Lightbulb } from "lucide-react";

import { TUTORIAL_COPY, TUTORIAL_TIPS } from "../config";

export function TutorialTipsCard() {
	return (
		<section className="px-5 py-5 sm:px-6">
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dungeon-gold/30 text-dungeon-gold">
					<Lightbulb className="size-4" />
				</div>
				<div className="space-y-1">
					<h2 className="text-sm font-semibold text-panel-title">
						{TUTORIAL_COPY.TIPS_HEADING}
					</h2>
					<p className="text-sm leading-6 text-panel-body">
						{TUTORIAL_COPY.TIPS_DESCRIPTION}
					</p>
				</div>
			</div>

			<ul className="mt-4 space-y-2">
				{TUTORIAL_TIPS.map((tip) => (
					<li
						key={tip}
						className="flex gap-2 text-sm leading-6 text-panel-body"
					>
						<span
							aria-hidden="true"
							className="mt-2 size-1.5 shrink-0 rounded-full bg-dungeon-gold/70"
						/>
						<span>{tip}</span>
					</li>
				))}
			</ul>
		</section>
	);
}
