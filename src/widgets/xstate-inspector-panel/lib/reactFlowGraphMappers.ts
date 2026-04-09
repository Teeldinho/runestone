import type { Edge, Node } from "@xyflow/react";

import type {
	MachineGraphEdge,
	MachineGraphNodeKind,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";
import { getMachineGraphGuardLabel } from "@/features/state-visualizer";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_FLOW_EDGE_VISUALS,
	INSPECTOR_FLOW_NODE_VISUALS,
} from "../config";
import { createGuardColorByKey } from "./guardMarkerPalette";

type InspectorFlowNodeData = {
	isActive: boolean;
	kind: MachineGraphNodeKind;
	label: string;
};

type InspectorFlowEdgeData = {
	eventType: string;
	guard: string | null;
	guardMarkers: InspectorFlowEdgeGuardMarker[];
	markerLaneOffset: number;
};

type InspectorFlowEdgeGuardMarker = {
	id: string;
	guardKey: string;
	guardLabel: string;
	color: string;
	showDirectionIndicator: boolean;
};

type InspectorFlowNode = Node<InspectorFlowNodeData>;
type InspectorFlowEdge = Edge<InspectorFlowEdgeData>;

const getEdgePairKey = (source: string, target: string): string => {
	return source < target ? `${source}|${target}` : `${target}|${source}`;
};

const splitGuardKeys = (guard: string | null): string[] => {
	if (!guard) {
		return [];
	}

	return guard
		.split(" & ")
		.map((guardKey) => guardKey.trim())
		.filter(Boolean);
};

const createGuardKeySetByDirectionKey = (
	graphEdges: MachineGraphEdge[],
): Map<string, Set<string>> => {
	const guardKeySetByDirectionKey = new Map<string, Set<string>>();

	for (const graphEdge of graphEdges) {
		const directionKey = `${graphEdge.source}|${graphEdge.target}`;
		const guardKeySet =
			guardKeySetByDirectionKey.get(directionKey) ?? new Set();

		for (const guardKey of splitGuardKeys(graphEdge.guard)) {
			guardKeySet.add(guardKey);
		}

		guardKeySetByDirectionKey.set(directionKey, guardKeySet);
	}

	return guardKeySetByDirectionKey;
};

const mapGuardMarkers = (
	edgeId: string,
	source: string,
	target: string,
	guard: string | null,
	guardKeySetByDirectionKey: Map<string, Set<string>>,
	guardColorByKey: Record<string, string>,
): InspectorFlowEdgeGuardMarker[] => {
	const guardKeys = splitGuardKeys(guard);
	const reverseDirectionGuardKeySet =
		guardKeySetByDirectionKey.get(`${target}|${source}`) ?? new Set();

	return guardKeys.map((guardKey, index) => ({
		id: `${edgeId}:${guardKey}`,
		guardKey,
		guardLabel: getMachineGraphGuardLabel(guardKey),
		color:
			guardColorByKey[guardKey] ??
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS[
				index % INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS.length
			],
		showDirectionIndicator: reverseDirectionGuardKeySet.has(guardKey),
	}));
};

const createEdgeLaneOffsetById = (
	graphEdges: MachineGraphEdge[],
): Map<string, number> => {
	const edgeIdsByPairKey = new Map<string, string[]>();

	for (const graphEdge of graphEdges) {
		const pairKey = getEdgePairKey(graphEdge.source, graphEdge.target);
		const edgeIds = edgeIdsByPairKey.get(pairKey) ?? [];

		edgeIds.push(graphEdge.id);
		edgeIdsByPairKey.set(pairKey, edgeIds);
	}

	const edgeLaneOffsetById = new Map<string, number>();

	for (const edgeIds of edgeIdsByPairKey.values()) {
		const laneCenter = (edgeIds.length - 1) / 2;

		edgeIds.forEach((edgeId, edgeIndex) => {
			const laneOffset =
				edgeIds.length % 2 === 0
					? (edgeIndex - laneCenter) * 2
					: edgeIndex - laneCenter;

			edgeLaneOffsetById.set(
				edgeId,
				laneOffset * INSPECTOR_FLOW_EDGE_LAYOUT.LANE_OFFSET_STEP,
			);
		});
	}

	return edgeLaneOffsetById;
};

const getFlowNodeClassName = (
	kind: MachineGraphNodeKind,
	isActive: boolean,
): string => {
	const activeClassName = isActive
		? ` ${INSPECTOR_FLOW_NODE_VISUALS.ACTIVE_CLASS_NAME}`
		: "";

	return `${INSPECTOR_FLOW_NODE_VISUALS.BASE_CLASS_NAME} ${INSPECTOR_FLOW_NODE_VISUALS.CLASS_NAME_BY_KIND[kind]}${activeClassName}`;
};

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
	const edgeLaneOffsetById = createEdgeLaneOffsetById(graphEdges);
	const guardKeySetByDirectionKey = createGuardKeySetByDirectionKey(graphEdges);
	const guardColorByKey = createGuardColorByKey(
		graphEdges.flatMap((edge) => splitGuardKeys(edge.guard)),
	);

	return graphEdges.map((graphEdge) => {
		const laneOffset = edgeLaneOffsetById.get(graphEdge.id) ?? 0;

		return {
			id: graphEdge.id,
			source: graphEdge.source,
			target: graphEdge.target,
			pathOptions: {
				offset: Math.abs(laneOffset),
			},
			label: "",
			style: graphEdge.guard
				? {
						stroke: INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_COLOR,
						strokeDasharray:
							INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_DASHARRAY,
						strokeOpacity: 0.55,
					}
				: {
						stroke: INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_COLOR,
						strokeOpacity: 0.32,
					},
			data: {
				eventType: graphEdge.eventType,
				guard: graphEdge.guard,
				guardMarkers: mapGuardMarkers(
					graphEdge.id,
					graphEdge.source,
					graphEdge.target,
					graphEdge.guard,
					guardKeySetByDirectionKey,
					guardColorByKey,
				),
				markerLaneOffset: laneOffset,
			},
			type: INSPECTOR_FLOW_EDGE_VISUALS.TYPE,
			animated: false,
			selectable: false,
		};
	});
};

export type {
	InspectorFlowEdge,
	InspectorFlowEdgeData,
	InspectorFlowEdgeGuardMarker,
	InspectorFlowNode,
	InspectorFlowNodeData,
};
