import { Background, Controls, ReactFlow } from "@xyflow/react";

import type { MachineGraphSection } from "@/features/state-visualizer";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";
import {
	INSPECTOR_FLOW_BACKGROUND,
	INSPECTOR_FLOW_EDGE_VISUALS,
	INSPECTOR_GUARD_LEGEND_LAYOUT,
} from "../config";

import "@xyflow/react/dist/style.css";

import { useXStateInspectorPanel } from "../model";
import { GuardMarkerEdge } from "./GuardMarkerEdge";

type XStateInspectorPanelProps = {
	sections: MachineGraphSection[];
};

const inspectorEdgeTypes = {
	[INSPECTOR_FLOW_EDGE_VISUALS.TYPE]: GuardMarkerEdge,
};

export function XStateInspectorPanel({ sections }: XStateInspectorPanelProps) {
	const inspectorPanel = useXStateInspectorPanel({ sections });

	return (
		<div className="flex h-full min-h-0 flex-col">
			<div
				className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<h2
					id="xstate-inspector-heading"
					className="text-xs font-semibold uppercase tracking-widest"
					style={{
						color: "var(--dungeon-gold)",
						fontFamily: "Space Grotesk, sans-serif",
					}}
				>
					Statechart Visualizer (XState)
				</h2>
			</div>

			<div
				className="border-b px-4 py-2"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<Tabs
					value={inspectorPanel.selectedSectionId}
					onValueChange={inspectorPanel.handleSelectedSectionIdChange}
				>
					<TabsList className="grid h-auto w-full grid-cols-4 gap-1 p-1">
						{inspectorPanel.sectionTabs.map((sectionTab) => (
							<TabsTrigger
								key={sectionTab.id}
								value={sectionTab.id}
								className="h-7 text-[10px]"
							>
								{sectionTab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
				{inspectorPanel.selectedSection?.guardIndicators.length ? (
					<div className="mt-2 grid gap-1.5">
						<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
							Guards
						</p>
						{inspectorPanel.selectedSection.guardIndicators.map(
							(guardIndicator) => (
								<div
									key={guardIndicator.id}
									className="flex items-start gap-2 rounded border border-panel-border bg-background px-2.5 py-1.5"
								>
									<span
										className="mt-0.5 inline-block rounded-full"
										style={{
											width: `${INSPECTOR_GUARD_LEGEND_LAYOUT.DOT_SIZE_PX}px`,
											height: `${INSPECTOR_GUARD_LEGEND_LAYOUT.DOT_SIZE_PX}px`,
											backgroundColor: guardIndicator.color,
										}}
									/>
									<span className="min-w-0 flex-1 text-[11px] leading-snug text-panel-title">
										{guardIndicator.label}
									</span>
									<span className="ml-auto inline-flex shrink-0 items-center rounded border border-panel-border/80 bg-panel px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-muted-foreground">
										{guardIndicator.transitionCount}{" "}
										{guardIndicator.transitionCountLabel}
									</span>
								</div>
							),
						)}
					</div>
				) : null}
			</div>

			<div className="min-h-0 flex-1 p-3">
				{inspectorPanel.selectedSection ? (
					<ReactFlow
						key={inspectorPanel.selectedSectionId}
						colorMode="dark"
						edgeTypes={inspectorEdgeTypes}
						edges={inspectorPanel.selectedSection.flowEdges}
						elementsSelectable={false}
						fitView
						fitViewOptions={{
							padding: inspectorPanel.selectedFlowFitViewPadding,
						}}
						maxZoom={inspectorPanel.reactFlowDefaults.MAX_ZOOM}
						minZoom={inspectorPanel.reactFlowDefaults.MIN_ZOOM}
						nodeOrigin={inspectorPanel.reactFlowDefaults.NODE_ORIGIN}
						nodes={inspectorPanel.selectedSection.flowNodes}
						nodesConnectable={false}
						nodesDraggable={false}
						proOptions={{ hideAttribution: true }}
						style={{ background: "var(--background)" }}
					>
						<Background
							gap={INSPECTOR_FLOW_BACKGROUND.GAP_PX}
							size={INSPECTOR_FLOW_BACKGROUND.SIZE_PX}
							color="var(--panel-border)"
						/>
						<Controls position="bottom-right" showInteractive={false} />
					</ReactFlow>
				) : (
					<div
						className="flex h-full items-center justify-center rounded border text-xs"
						style={{
							borderColor: "var(--panel-border)",
							color: "var(--muted-foreground)",
						}}
					>
						No machine graph available.
					</div>
				)}
			</div>
		</div>
	);
}
