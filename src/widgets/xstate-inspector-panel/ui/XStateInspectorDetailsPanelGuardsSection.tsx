import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { INSPECTOR_DETAILS_PANEL_IDS } from "../config";
import type { InspectorMachineSectionViewModel } from "../lib";
import { XStateInspectorDetailsPanelSection } from "./XStateInspectorDetailsPanelSection";

type XStateInspectorDetailsPanelGuardsSectionProps = {
	section: InspectorMachineSectionViewModel;
};

export function XStateInspectorDetailsPanelGuardsSection({
	section,
}: XStateInspectorDetailsPanelGuardsSectionProps) {
	return (
		<XStateInspectorDetailsPanelSection
			className="space-y-2"
			id={INSPECTOR_DETAILS_PANEL_IDS.GUARDS}
			title={STATE_VISUALIZER_DETAILS_COPY.GUARDS_LABEL}
		>
			{section.guardDetails.length > 0 ? (
				<ul className="space-y-1.5">
					{section.guardDetails.map((guardDetail) => (
						<li
							key={guardDetail.id}
							className="rounded-md bg-background px-2 py-1.5 text-xs text-muted-foreground break-words"
						>
							{guardDetail.label}
						</li>
					))}
				</ul>
			) : (
				<p className="text-xs text-muted-foreground">
					{STATE_VISUALIZER_DETAILS_COPY.GUARDS_EMPTY}
				</p>
			)}
		</XStateInspectorDetailsPanelSection>
	);
}
