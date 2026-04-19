import type { MachineGraphSection } from "@/features/state-visualizer";
import { Separator } from "@/shared/ui";

import { useXStateInspectorPanel } from "../model";
import { XStateInspectorPanelFlow } from "./XStateInspectorPanelFlow";
import { XStateInspectorPanelGuards } from "./XStateInspectorPanelGuards";
import { XStateInspectorPanelHeader } from "./XStateInspectorPanelHeader";
import { XStateInspectorPanelTabs } from "./XStateInspectorPanelTabs";

type XStateInspectorPanelProps = {
	sections: MachineGraphSection[];
};

export function XStateInspectorPanel({ sections }: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<div className="flex h-full min-h-0 min-w-0 flex-col gap-y-2 overflow-hidden">
			<XStateInspectorPanelHeader />

			<Separator className="max-xl:hidden bg-panel-border/50" />

			<div className="mb-2 min-w-0 px-3 py-2 max-xl:mb-0 max-xl:px-2">
				<XStateInspectorPanelTabs
					handleSelectedSectionIdChange={
						inspectorPanel.handleSelectedSectionIdChange
					}
					sectionTabs={inspectorPanel.sectionTabs}
					selectedSectionId={inspectorPanel.selectedSectionId}
					tabsListStyles={inspectorPanel.tabsListStyles}
				/>

				{inspectorPanel.hasGuardIndicators && inspectorPanel.selectedSection ? (
					<XStateInspectorPanelGuards
						guardIndicators={inspectorPanel.selectedSection.guardIndicators}
					/>
				) : null}
			</div>

			<div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 max-xl:p-0">
				<XStateInspectorPanelFlow
					hasSelectedSection={inspectorPanel.hasSelectedSection}
					reactFlowDefaults={inspectorPanel.reactFlowDefaults}
					selectedFlowFitViewPadding={inspectorPanel.selectedFlowFitViewPadding}
					selectedSection={inspectorPanel.selectedSection}
					selectedSectionId={inspectorPanel.selectedSectionId}
				/>
			</div>
		</div>
	);
}

export type { XStateInspectorPanelProps };
