import type { TutorialPageViewModel } from "../lib";

import { TutorialCameraModesCard } from "./TutorialCameraModesCard";
import { TutorialControlGroupCard } from "./TutorialControlGroupCard";

type TutorialControlsPanelProps = TutorialPageViewModel["controlsSectionProps"];

export function TutorialControlsPanel({
	cameraHeading,
	cameraModes,
	controlGroups,
	description,
	heading,
}: TutorialControlsPanelProps) {
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
					{heading}
				</h2>
				<p className="max-w-sm text-sm leading-6 text-panel-body sm:text-base">
					{description}
				</p>
			</div>

			<div className="space-y-4">
				<div className="grid gap-4 lg:grid-cols-2">
					{controlGroups.map((group) => (
						<TutorialControlGroupCard key={group.heading} group={group} />
					))}
				</div>

				<TutorialCameraModesCard
					cameraHeading={cameraHeading}
					cameraModes={cameraModes}
				/>
			</div>
		</section>
	);
}
