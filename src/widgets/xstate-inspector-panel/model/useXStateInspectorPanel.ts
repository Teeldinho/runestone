import { useMemo } from "react";

import type {
	MachineGraphEdge,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";

import { INSPECTOR_REACT_FLOW_DEFAULTS } from "../config";
import {
	type InspectorFlowEdge,
	type InspectorFlowNode,
	mapGraphEdgesToFlowEdges,
	mapGraphNodesToFlowNodes,
} from "../lib";

type UseXStateInspectorPanelInput = {
	activeStateLabel: string;
	graphEdges: MachineGraphEdge[];
	graphNodes: PositionedMachineGraphNode[];
};

type XStateInspectorPanelViewModel = {
	activeStateLabel: string;
	flowEdges: InspectorFlowEdge[];
	flowNodes: InspectorFlowNode[];
	graphEdges: MachineGraphEdge[];
	graphNodes: PositionedMachineGraphNode[];
	reactFlowDefaults: typeof INSPECTOR_REACT_FLOW_DEFAULTS;
};

export const useXStateInspectorPanel = ({
	activeStateLabel,
	graphEdges,
	graphNodes,
}: UseXStateInspectorPanelInput): XStateInspectorPanelViewModel => {
	const flowNodes = useMemo(
		() => mapGraphNodesToFlowNodes(graphNodes),
		[graphNodes],
	);

	const flowEdges = useMemo(
		() => mapGraphEdgesToFlowEdges(graphEdges),
		[graphEdges],
	);

	return {
		activeStateLabel,
		flowEdges,
		flowNodes,
		graphEdges,
		graphNodes,
		reactFlowDefaults: INSPECTOR_REACT_FLOW_DEFAULTS,
	};
};

export type { UseXStateInspectorPanelInput, XStateInspectorPanelViewModel };
