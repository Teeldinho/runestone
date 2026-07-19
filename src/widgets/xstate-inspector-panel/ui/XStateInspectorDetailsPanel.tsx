import type { MachineGraphSection } from "@/features/state-visualizer";
import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { Badge, ScrollArea, Separator } from "@/shared/ui";

import { INSPECTOR_COPY, INSPECTOR_DETAILS_PANEL_IDS } from "../config";
import { useXStateInspectorPanel } from "../model";
import { XStateInspectorDetailsPanelActiveStateSection } from "./XStateInspectorDetailsPanelActiveStateSection";
import { XStateInspectorDetailsPanelGuardsSection } from "./XStateInspectorDetailsPanelGuardsSection";
import { XStateInspectorDetailsPanelStatesSection } from "./XStateInspectorDetailsPanelStatesSection";
import { XStateInspectorDetailsPanelTransitionsSection } from "./XStateInspectorDetailsPanelTransitionsSection";

type XStateInspectorDetailsPanelProps = {
	sections: MachineGraphSection[];
};

export function XStateInspectorDetailsPanel({
	sections,
}: XStateInspectorDetailsPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<section
			aria-labelledby={INSPECTOR_DETAILS_PANEL_IDS.ROOT}
			className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
		>
			<header className="flex flex-wrap items-center justify-between gap-2 border-panel-border/60 border-b bg-background/25 px-4 py-2.5">
				<h2 id={INSPECTOR_DETAILS_PANEL_IDS.ROOT} className="rune-text">
					{INSPECTOR_COPY.DETAILS_PANEL_TITLE}
				</h2>
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
					<Badge
						variant="outline"
						className="border-dungeon-rune/40 bg-dungeon-rune/10 font-mono text-[10px] text-panel-title"
					>
						{inspectorPanel.selectedSection.label}
					</Badge>
				) : null}
			</header>

			<Separator className="bg-panel-border/50" />

			<ScrollArea className="min-h-0 flex-1">
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
					<div className="min-w-0 space-y-4 overflow-x-hidden p-4">
						<XStateInspectorDetailsPanelActiveStateSection
							section={inspectorPanel.selectedSection}
						/>

						<Separator />

						<XStateInspectorDetailsPanelStatesSection
							section={inspectorPanel.selectedSection}
						/>

						<Separator />

						<XStateInspectorDetailsPanelGuardsSection
							section={inspectorPanel.selectedSection}
						/>

						<Separator />

						<XStateInspectorDetailsPanelTransitionsSection
							section={inspectorPanel.selectedSection}
						/>
					</div>
				) : (
					<div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
						{STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_FALLBACK}
					</div>
				)}
			</ScrollArea>
		</section>
	);
}
