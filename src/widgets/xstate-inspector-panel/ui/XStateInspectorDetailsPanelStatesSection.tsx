import { Badge } from "@/shared/ui";
import { INSPECTOR_COPY, INSPECTOR_DETAILS_PANEL_IDS } from "../config";
import type { InspectorMachineSectionViewModel } from "../lib";
import { XStateInspectorDetailsPanelSection } from "./XStateInspectorDetailsPanelSection";

type XStateInspectorDetailsPanelStatesSectionProps = {
	section: InspectorMachineSectionViewModel;
};

export function XStateInspectorDetailsPanelStatesSection({
	section,
}: XStateInspectorDetailsPanelStatesSectionProps) {
	return (
		<XStateInspectorDetailsPanelSection
			className="space-y-2"
			id={INSPECTOR_DETAILS_PANEL_IDS.STATES}
			title={INSPECTOR_COPY.STATES_IN_MACHINE_LABEL}
		>
			<ul className="grid gap-1.5 sm:grid-cols-2">
				{section.stateDetails.map((stateDetail) => (
					<li
						key={stateDetail.id}
						className={`flex items-center justify-between rounded-md px-2 py-1.5 text-xs ${stateDetail.isActive ? "bg-[color-mix(in_srgb,var(--primary)_9%,transparent)]" : "bg-background"}`}
					>
						<span className="min-w-0 break-words">{stateDetail.label}</span>
						{stateDetail.isActive ? (
							<Badge variant="outline" className="text-[9px]">
								{INSPECTOR_COPY.ACTIVE_LABEL}
							</Badge>
						) : null}
					</li>
				))}
			</ul>
		</XStateInspectorDetailsPanelSection>
	);
}
