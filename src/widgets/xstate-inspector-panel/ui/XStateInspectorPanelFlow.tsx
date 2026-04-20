import { Background, Controls, ReactFlow } from "@xyflow/react";

import {
	INSPECTOR_COPY,
	INSPECTOR_FLOW_BACKGROUND,
	INSPECTOR_FLOW_EDGE_VISUALS,
	type INSPECTOR_REACT_FLOW_DEFAULTS,
} from "../config";
import type { InspectorMachineSectionViewModel } from "../lib";
import { GuardMarkerEdge } from "./GuardMarkerEdge";

import "@xyflow/react/dist/style.css";

const inspectorEdgeTypes = {
	[INSPECTOR_FLOW_EDGE_VISUALS.TYPE]: GuardMarkerEdge,
};

type XStateInspectorPanelFlowProps = {
	hasSelectedSection: boolean;
	reactFlowDefaults: typeof INSPECTOR_REACT_FLOW_DEFAULTS;
	selectedFlowFitViewPadding: number;
	selectedSection: InspectorMachineSectionViewModel | null;
	selectedSectionId: string;
};

export function XStateInspectorPanelFlow({
	hasSelectedSection,
	reactFlowDefaults,
	selectedFlowFitViewPadding,
	selectedSection,
	selectedSectionId,
}: XStateInspectorPanelFlowProps) {
	if (!hasSelectedSection || !selectedSection) {
		return (
			<div className="flex h-full items-center justify-center rounded-md text-xs text-muted-foreground">
				{INSPECTOR_COPY.EMPTY_GRAPH_MESSAGE}
			</div>
		);
	}

	return (
		<ReactFlow
			className="h-full w-full bg-background"
			key={selectedSectionId}
			colorMode="dark"
			edgeTypes={inspectorEdgeTypes}
			edges={selectedSection.flowEdges}
			elementsSelectable={false}
			fitView
			fitViewOptions={{
				padding: selectedFlowFitViewPadding,
			}}
			maxZoom={reactFlowDefaults.MAX_ZOOM}
			minZoom={reactFlowDefaults.MIN_ZOOM}
			nodeOrigin={reactFlowDefaults.NODE_ORIGIN}
			nodes={selectedSection.flowNodes}
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
	);
}

export type { XStateInspectorPanelFlowProps };
