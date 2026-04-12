import type { MachineGraphSection } from "@/features/state-visualizer";
import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { Badge, ScrollArea, Separator } from "@/shared/ui";

import { INSPECTOR_COPY } from "../config";
import { useXStateInspectorPanel } from "../model";

type XStateInspectorDetailsPanelProps = {
	sections: MachineGraphSection[];
};

export function XStateInspectorDetailsPanel({
	sections,
}: XStateInspectorDetailsPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-panel-border/50 px-4 py-2">
				<h2 className="rune-text">{INSPECTOR_COPY.DETAILS_PANEL_TITLE}</h2>
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
					<Badge variant="outline" className="text-[10px]">
						{inspectorPanel.selectedSection.label}
					</Badge>
				) : null}
			</div>

			<Separator className="bg-panel-border/50" />

			<ScrollArea className="min-h-0 flex-1">
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
					<div className="min-w-0 space-y-4 overflow-x-hidden p-4">
						<section className="space-y-1">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								{STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_LABEL}
							</p>
							<p className="break-words text-sm font-semibold text-panel-title">
								{inspectorPanel.selectedSection.activeStateLabel}
							</p>
							<p className="break-words text-xs text-muted-foreground">
								{inspectorPanel.selectedSection.activeStateSummary}
							</p>
							<p className="break-words text-xs text-muted-foreground">
								{inspectorPanel.selectedSection.sectionDescription}
							</p>
						</section>

						<Separator />

						<section className="space-y-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								{INSPECTOR_COPY.STATES_IN_MACHINE_LABEL}
							</p>
							<ul className="grid gap-1.5 sm:grid-cols-2">
								{inspectorPanel.selectedSection.stateDetails.map(
									(stateDetail) => (
										<li
											key={stateDetail.id}
											className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs"
											style={{
												background: stateDetail.isActive
													? "color-mix(in srgb, var(--primary) 9%, transparent)"
													: "var(--background)",
											}}
										>
											<span className="min-w-0 break-words">
												{stateDetail.label}
											</span>
											{stateDetail.isActive ? (
												<Badge variant="outline" className="text-[9px]">
													{INSPECTOR_COPY.ACTIVE_LABEL}
												</Badge>
											) : null}
										</li>
									),
								)}
							</ul>
						</section>

						<Separator />

						<section className="space-y-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								{STATE_VISUALIZER_DETAILS_COPY.GUARDS_LABEL}
							</p>
							{inspectorPanel.selectedSection.guardDetails.length > 0 ? (
								<ul className="space-y-1.5">
									{inspectorPanel.selectedSection.guardDetails.map(
										(guardDetail) => (
											<li
												key={guardDetail.id}
												className="rounded-md bg-background px-2 py-1.5 text-xs text-muted-foreground break-words"
											>
												{guardDetail.label}
											</li>
										),
									)}
								</ul>
							) : (
								<p className="text-xs text-muted-foreground">
									{STATE_VISUALIZER_DETAILS_COPY.GUARDS_EMPTY}
								</p>
							)}
						</section>

						<Separator />

						<section className="space-y-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								{STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_LABEL}
							</p>
							{inspectorPanel.selectedSection.transitionDetails.length > 0 ? (
								<ul className="space-y-2">
									{inspectorPanel.selectedSection.transitionDetails.map(
										(transitionDetail) => (
											<li
												key={transitionDetail.id}
												className="rounded-md bg-background px-2.5 py-2"
											>
												<p className="break-words text-xs font-semibold text-foreground">
													{transitionDetail.eventLabel}
												</p>
												<p className="mt-1 break-words text-[11px] text-muted-foreground">
													{STATE_VISUALIZER_DETAILS_COPY.TRANSITION_FLOW_PREFIX}
													: {transitionDetail.flowLabel}
												</p>
												<p className="mt-1 break-words text-[11px] text-muted-foreground">
													{transitionDetail.summary}
												</p>
											</li>
										),
									)}
								</ul>
							) : (
								<p className="text-xs text-muted-foreground">
									{STATE_VISUALIZER_DETAILS_COPY.TRANSITIONS_EMPTY}
								</p>
							)}
						</section>
					</div>
				) : (
					<div className="flex h-full items-center justify-center p-4 text-xs text-muted-foreground">
						{STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_FALLBACK}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}
