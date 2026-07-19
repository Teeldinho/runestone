import type { MachineGraphSection } from "@/features/state-visualizer";
import { Separator, Tabs, TabsContent } from "@/shared/ui";

import { useXStateInspectorPanel } from "../model";
import { XStateInspectorPanelFlow } from "./XStateInspectorPanelFlow";
import { XStateInspectorPanelGuards } from "./XStateInspectorPanelGuards";
import { XStateInspectorPanelHeader } from "./XStateInspectorPanelHeader";
import { XStateInspectorPanelTabs } from "./XStateInspectorPanelTabs";

type XStateInspectorPanelProps = {
	minZoom?: number;
	sections: MachineGraphSection[];
};

export function XStateInspectorPanel({
	minZoom,
	sections,
}: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<Tabs
			className="@container/inspector flex h-full min-h-0 min-w-0 flex-col gap-y-2 overflow-hidden"
			value={inspectorPanel.selectedSectionId}
			onValueChange={inspectorPanel.handleSelectedSectionIdChange}
		>
			<XStateInspectorPanelHeader />

			<Separator className="max-xl:hidden bg-panel-border/50" />

			<div className="mb-2 min-w-0 px-3 py-2 max-xl:mb-0 max-xl:px-2">
				<XStateInspectorPanelTabs
					sectionTabs={inspectorPanel.sectionTabs}
					tabsListStyles={inspectorPanel.tabsListStyles}
				/>

				{inspectorPanel.hasGuardIndicators && inspectorPanel.selectedSection ? (
					<XStateInspectorPanelGuards
						guardIndicators={inspectorPanel.selectedSection.guardIndicators}
					/>
				) : null}
			</div>

			{inspectorPanel.sectionTabs.map((sectionTab) => (
				<TabsContent
					key={sectionTab.id}
					value={sectionTab.id}
					forceMount
					className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 data-[state=inactive]:hidden max-xl:p-0"
				>
					{sectionTab.id === inspectorPanel.selectedSectionId ? (
						<XStateInspectorPanelFlow
							hasSelectedSection={inspectorPanel.hasSelectedSection}
							reactFlowDefaults={inspectorPanel.reactFlowDefaults}
							selectedFlowFitViewPadding={
								inspectorPanel.selectedFlowFitViewPadding
							}
							selectedSection={inspectorPanel.selectedSection}
							selectedSectionId={inspectorPanel.selectedSectionId}
							minZoom={minZoom}
						/>
					) : null}
				</TabsContent>
			))}

			{inspectorPanel.sectionTabs.length === 0 ? (
				<div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 max-xl:p-0">
					<XStateInspectorPanelFlow
						hasSelectedSection={inspectorPanel.hasSelectedSection}
						reactFlowDefaults={inspectorPanel.reactFlowDefaults}
						selectedFlowFitViewPadding={
							inspectorPanel.selectedFlowFitViewPadding
						}
						selectedSection={inspectorPanel.selectedSection}
						selectedSectionId={inspectorPanel.selectedSectionId}
						minZoom={minZoom}
					/>
				</div>
			) : null}
		</Tabs>
	);
}

export type { XStateInspectorPanelProps };
