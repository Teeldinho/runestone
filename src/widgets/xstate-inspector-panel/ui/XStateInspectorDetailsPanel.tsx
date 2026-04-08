import type { MachineGraphSection } from "@/features/state-visualizer";
import { STATE_VISUALIZER_DETAILS_COPY } from "@/features/state-visualizer";
import { Badge, ScrollArea, Separator } from "@/shared/ui";

import { useXStateInspectorPanel } from "../model";

type XStateInspectorDetailsPanelProps = {
	sections: MachineGraphSection[];
};

export function XStateInspectorDetailsPanel({
	sections,
}: XStateInspectorDetailsPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div
				className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<h2 className="rune-text">State Details</h2>
				{inspectorPanel.selectedSection ? (
					<Badge variant="outline" className="text-[10px]">
						{inspectorPanel.selectedSection.label}
					</Badge>
				) : null}
			</div>

			<ScrollArea className="min-h-0 flex-1">
				{inspectorPanel.selectedSection ? (
					<div className="space-y-4 p-4">
						<section className="space-y-1">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								{STATE_VISUALIZER_DETAILS_COPY.ACTIVE_STATE_LABEL}
							</p>
							<p className="text-sm font-semibold text-panel-title">
								{inspectorPanel.selectedSection.activeStateLabel}
							</p>
							<p className="text-xs text-muted-foreground">
								{inspectorPanel.selectedSection.activeStateSummary}
							</p>
							<p className="text-xs text-muted-foreground">
								{inspectorPanel.selectedSection.sectionDescription}
							</p>
						</section>

						<Separator />

						<section className="space-y-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground">
								States in this machine
							</p>
							<ul className="grid gap-1.5 sm:grid-cols-2">
								{inspectorPanel.selectedSection.stateDetails.map(
									(stateDetail) => (
										<li
											key={stateDetail.id}
											className="flex items-center justify-between rounded border px-2 py-1.5 text-xs"
											style={{
												borderColor: stateDetail.isActive
													? "var(--primary)"
													: "var(--panel-border)",
												background: stateDetail.isActive
													? "color-mix(in srgb, var(--primary) 9%, transparent)"
													: "var(--background)",
											}}
										>
											<span>{stateDetail.label}</span>
											{stateDetail.isActive ? (
												<Badge variant="outline" className="text-[9px]">
													Active
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
												className="rounded border border-panel-border bg-background px-2 py-1.5 text-xs text-muted-foreground"
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
												className="rounded border border-panel-border bg-background px-2.5 py-2"
											>
												<p className="text-xs font-semibold text-foreground">
													{transitionDetail.eventLabel}
												</p>
												<p className="mt-1 text-[11px] text-muted-foreground">
													{STATE_VISUALIZER_DETAILS_COPY.TRANSITION_FLOW_PREFIX}
													: {transitionDetail.flowLabel}
												</p>
												<p className="mt-1 text-[11px] text-muted-foreground">
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
