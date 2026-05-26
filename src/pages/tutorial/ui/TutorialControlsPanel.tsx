import { TUTORIAL_CONTROL_GROUPS, TUTORIAL_CONTROLS_COPY } from "../config";

import { TutorialCameraModesCard } from "./TutorialCameraModesCard";
import { TutorialControlGroupCard } from "./TutorialControlGroupCard";

export function TutorialControlsPanel() {
	return (
		<section
			aria-labelledby="controls-heading"
			className="grid gap-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)]"
		>
			<div className="space-y-3">
				<h2
					id="controls-heading"
					className="text-2xl font-semibold tracking-tight text-panel-title sm:text-3xl"
				>
					{TUTORIAL_CONTROLS_COPY.SECTION_HEADING}
				</h2>
				<p className="max-w-sm text-sm leading-6 text-panel-body sm:text-base">
					{TUTORIAL_CONTROLS_COPY.SECTION_DESCRIPTION}
				</p>
			</div>

			<div className="space-y-4">
				<div className="grid gap-4 lg:grid-cols-2">
					{TUTORIAL_CONTROL_GROUPS.map((group) => (
						<TutorialControlGroupCard key={group.heading} group={group} />
					))}
				</div>

				<TutorialCameraModesCard />
			</div>
		</section>
	);
}
