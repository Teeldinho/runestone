import { Background, Controls, ReactFlow } from "@xyflow/react";

import type { MachineGraphSection } from "@/features/state-visualizer";
import { Separator, Tabs, TabsList, TabsTrigger } from "@/shared/ui";
import {
	INSPECTOR_COPY,
	INSPECTOR_FLOW_BACKGROUND,
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
		<div className="flex h-full min-h-0 min-w-0 flex-col gap-y-2 overflow-hidden">
			<div className="hidden flex-wrap items-center justify-between gap-2 border-b border-panel-border/50 px-3 py-1.5 lg:flex lg:px-4 lg:py-3">
				<h2
					id="xstate-inspector-heading"
					className="rune-text text-xs font-semibold tracking-widest text-dungeon-gold"
				>
					{INSPECTOR_COPY.PANEL_TITLE}
				</h2>
			</div>

			<Separator className="max-xl:hidden bg-panel-border/50" />

			<div className="mb-2 min-w-0 px-3 py-2 max-xl:mb-0 max-xl:px-2">
				<Tabs
					className="min-w-0"
					value={inspectorPanel.selectedSectionId}
					onValueChange={inspectorPanel.handleSelectedSectionIdChange}
				>
					<TabsList
						className="grid h-auto w-full min-w-0 gap-1 p-1"
						style={inspectorPanel.tabsListStyles}
					>
						{inspectorPanel.sectionTabs.map((sectionTab) => (
							<TabsTrigger
								key={sectionTab.id}
								value={sectionTab.id}
								className="h-7 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-[10px]"
							>
								{sectionTab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
				{inspectorPanel.hasGuardIndicators && inspectorPanel.selectedSection ? (
					<>
						<Separator className="my-2" />
						<div className="grid grid-cols-1 gap-2 max-xl:landscape:grid-cols-2">
							<p className="col-span-full text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
								{INSPECTOR_COPY.GUARDS_HEADING}
							</p>
							<p className="col-span-full -mt-1 text-[10px] text-muted-foreground/80">
								{INSPECTOR_COPY.GUARDS_DIRECTION_HINT}
							</p>
							{inspectorPanel.selectedSection.guardIndicators.map(
								(guardIndicator) => (
									<div
										key={guardIndicator.id}
										className="flex items-start gap-2 rounded-md bg-background px-2.5 py-1.5"
									>
										<span
											className="mt-0.5 inline-block rounded-full"
											style={guardIndicator.legendDotStyles}
										/>
										<span className="min-w-0 flex-1 text-[11px] leading-snug text-panel-title">
											{guardIndicator.label}
										</span>
										<span className="ml-auto inline-flex shrink-0 items-center rounded bg-panel px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-muted-foreground">
											{guardIndicator.transitionCount}{" "}
											{guardIndicator.transitionCountLabel}
										</span>
									</div>
								),
							)}
						</div>
					</>
				) : null}
			</div>

			<div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 max-xl:p-0">
				{inspectorPanel.hasSelectedSection && inspectorPanel.selectedSection ? (
					<ReactFlow
						className="h-full w-full bg-background"
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
					>
						<Background
							gap={INSPECTOR_FLOW_BACKGROUND.GAP_PX}
							size={INSPECTOR_FLOW_BACKGROUND.SIZE_PX}
							color="var(--panel-border)"
						/>
						<Controls position="bottom-right" showInteractive={false} />
					</ReactFlow>
				) : (
					<div className="flex h-full items-center justify-center rounded-md text-xs text-muted-foreground">
						{INSPECTOR_COPY.EMPTY_GRAPH_MESSAGE}
					</div>
				)}
			</div>
		</div>
	);
}
