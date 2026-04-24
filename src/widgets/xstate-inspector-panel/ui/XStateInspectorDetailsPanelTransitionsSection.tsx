import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { INSPECTOR_DETAILS_PANEL_IDS } from "../config";
import type { InspectorMachineSectionViewModel } from "../lib";
import { XStateInspectorDetailsPanelSection } from "./XStateInspectorDetailsPanelSection";

type XStateInspectorDetailsPanelTransitionsSectionProps = {
	section: InspectorMachineSectionViewModel;
};

export function XStateInspectorDetailsPanelTransitionsSection({
	section,
}: XStateInspectorDetailsPanelTransitionsSectionProps) {
	return (
		<XStateInspectorDetailsPanelSection
			className="space-y-2"
			id={INSPECTOR_DETAILS_PANEL_IDS.TRANSITIONS}
			title={STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_LABEL}
		>
			{section.transitionDetails.length > 0 ? (
				<ul className="space-y-2">
					{section.transitionDetails.map((transitionDetail) => (
						<li
							key={transitionDetail.id}
							className="rounded-md bg-background px-2.5 py-2"
						>
							<p className="break-words text-xs font-semibold text-foreground">
								{transitionDetail.eventLabel}
							</p>
							<p className="mt-1 break-words text-[11px] text-muted-foreground">
								{STATE_VISUALIZER_DETAILS_COPY.TRANSITION_FLOW_PREFIX}:{" "}
								{transitionDetail.flowLabel}
							</p>
							<p className="mt-1 break-words text-[11px] text-muted-foreground">
								{transitionDetail.summary}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p className="text-xs text-muted-foreground">
					{STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_EMPTY}
				</p>
			)}
		</XStateInspectorDetailsPanelSection>
	);
}
