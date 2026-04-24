import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { INSPECTOR_DETAILS_PANEL_IDS } from "../config";
import type { InspectorMachineSectionViewModel } from "../lib";
import { XStateInspectorDetailsPanelSection } from "./XStateInspectorDetailsPanelSection";

type XStateInspectorDetailsPanelActiveStateSectionProps = {
	section: InspectorMachineSectionViewModel;
};

export function XStateInspectorDetailsPanelActiveStateSection({
	section,
}: XStateInspectorDetailsPanelActiveStateSectionProps) {
	return (
		<XStateInspectorDetailsPanelSection
			className="space-y-1"
			id={INSPECTOR_DETAILS_PANEL_IDS.ACTIVE_STATE}
			title={STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_LABEL}
		>
			<p className="break-words text-sm font-semibold text-panel-title">
				{section.activeStateLabel}
			</p>
			<p className="break-words text-xs text-muted-foreground">
				{section.activeStateSummary}
			</p>
			<p className="break-words text-xs text-muted-foreground">
				{section.sectionDescription}
			</p>
		</XStateInspectorDetailsPanelSection>
	);
}
