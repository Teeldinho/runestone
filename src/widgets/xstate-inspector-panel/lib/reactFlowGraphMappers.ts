import type { Edge, Node } from "@xyflow/react";

import type {
	MachineGraphEdge,
	MachineGraphNodeKind,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";

import {
	INSPECTOR_EDGE_LABELS,
	INSPECTOR_FLOW_EDGE_VISUALS,
	INSPECTOR_FLOW_NODE_VISUALS,
} from "../config";

type InspectorFlowNodeData = {
	isActive: boolean;
	kind: MachineGraphNodeKind;
	label: string;
};

type InspectorFlowEdgeData = {
	guard: string | null;
};

type InspectorFlowNode = Node<InspectorFlowNodeData>;
type InspectorFlowEdge = Edge<InspectorFlowEdgeData>;

const getFlowNodeClassName = (
	kind: MachineGraphNodeKind,
	isActive: boolean,
): string => {
	const activeClassName = isActive
		? ` ${INSPECTOR_FLOW_NODE_VISUALS.ACTIVE_CLASS_NAME}`
		: "";

	return `${INSPECTOR_FLOW_NODE_VISUALS.BASE_CLASS_NAME} ${INSPECTOR_FLOW_NODE_VISUALS.CLASS_NAME_BY_KIND[kind]}${activeClassName}`;
};

const getFlowEdgeLabel = (guard: string | null): string =>
	guard ?? INSPECTOR_EDGE_LABELS.NO_GUARD;

export const mapGraphNodesToFlowNodes = (
	graphNodes: PositionedMachineGraphNode[],
): InspectorFlowNode[] => {
	return graphNodes.map((graphNode) => ({
		id: graphNode.id,
		position: graphNode.position,
		data: {
			isActive: graphNode.isActive,
			kind: graphNode.kind,
			label: graphNode.label,
		},
		className: getFlowNodeClassName(graphNode.kind, graphNode.isActive),
		draggable: false,
		selectable: false,
	}));
};

export const mapGraphEdgesToFlowEdges = (
	graphEdges: MachineGraphEdge[],
): InspectorFlowEdge[] => {
	return graphEdges.map((graphEdge) => ({
		id: graphEdge.id,
		source: graphEdge.source,
		target: graphEdge.target,
		label: getFlowEdgeLabel(graphEdge.guard),
		data: {
			guard: graphEdge.guard,
		},
		type: INSPECTOR_FLOW_EDGE_VISUALS.TYPE,
		animated: graphEdge.guard !== null,
		selectable: false,
	}));
};

export type {
	InspectorFlowEdge,
	InspectorFlowEdgeData,
	InspectorFlowNode,
	InspectorFlowNodeData,
};
