import { Background, Controls, ReactFlow } from "@xyflow/react";
import type { CSSProperties } from "react";

import type { MachineGraphSection } from "@/features/state-visualizer";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui";
import {
	INSPECTOR_COPY,
	INSPECTOR_FLOW_BACKGROUND,
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_FLOW_EDGE_VISUALS,
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
		<div className="flex min-h-0 flex-col gap-y-6 lg:h-full lg:gap-y-4">
			<div
				className="hidden flex-wrap items-center justify-between gap-2 border-b px-3 py-1.5 lg:flex lg:px-4 lg:py-3"
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
					{INSPECTOR_COPY.PANEL_TITLE}
				</h2>
			</div>

			<div
				className="mb-5 border-b px-4 py-2 max-xl:border-0 max-xl:px-0"
				style={{ borderColor: "var(--panel-border)" }}
			>
				<Tabs
					value={inspectorPanel.selectedSectionId}
					onValueChange={inspectorPanel.handleSelectedSectionIdChange}
				>
					<TabsList
						className="grid h-auto w-full gap-1 p-1"
						style={inspectorPanel.tabsListStyles}
					>
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
				{inspectorPanel.hasGuardIndicators && inspectorPanel.selectedSection ? (
					<div className="mt-5 grid grid-cols-1 gap-2 max-xl:landscape:grid-cols-2">
						<p className="col-span-full mb-1 border-panel-border/30 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground max-xl:border-b">
							{INSPECTOR_COPY.GUARDS_HEADING}
						</p>
						<p className="col-span-full -mt-1 mb-1 text-[10px] text-muted-foreground/80">
							{INSPECTOR_COPY.GUARDS_DIRECTION_HINT}
						</p>
						{inspectorPanel.selectedSection.guardIndicators.map(
							(guardIndicator) => (
								<div
									key={guardIndicator.id}
									className="flex items-start gap-2 rounded border border-panel-border bg-background px-2.5 py-1.5"
								>
									<span
										className="mt-0.5 inline-block rounded-full"
										style={guardIndicator.legendDotStyles}
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

			<div
				className="flex-1 p-3 max-xl:flex-none max-xl:p-0 max-xl:landscape:h-(--mobile-landscape-graph-height)"
				style={
					{
						"--mobile-landscape-graph-height": `${INSPECTOR_FLOW_EDGE_LAYOUT.MOBILE_LANDSCAPE_GRAPH_HEIGHT_PX}px`,
					} as CSSProperties
				}
			>
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
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
						style={{
							background: "var(--background)",
							width: "100%",
							height: "100%",
						}}
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
						{INSPECTOR_COPY.EMPTY_GRAPH_MESSAGE}
					</div>
				)}
			</div>
		</div>
	);
}
