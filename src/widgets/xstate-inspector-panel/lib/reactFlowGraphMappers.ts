import type { Edge, Node } from "@xyflow/react";

import type {
	MachineGraphEdge,
	MachineGraphNodeKind,
	PositionedMachineGraphNode,
} from "@/features/state-visualizer";
import {
	getMachineGraphGuardLabel,
	STATE_VISUALIZER_GRAPH_SYNTAX,
} from "@/features/state-visualizer";
import { cn } from "@/shared/lib";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_FLOW_EDGE_VISUALS,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";
import { createGuardColorByKey } from "./guardMarkerPalette";

type GuardMarkerDirectionIndicatorMode =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE];

type InspectorFlowNodeData = {
	isActive: boolean;
	kind: MachineGraphNodeKind;
	label: string;
};

type InspectorFlowNodePosition = {
	x: number;
	y: number;
};

type InspectorFlowEdgeData = {
	eventType: string;
	guard: string | null;
	guardMarkers: InspectorFlowEdgeGuardMarker[];
	markerLaneOffset: number;
	sourceNodePosition?: InspectorFlowNodePosition;
	targetNodePosition?: InspectorFlowNodePosition;
	nearbyNodePositions?: InspectorFlowNodePosition[];
};

type InspectorFlowEdgeGuardMarker = {
	id: string;
	guardKey: string;
	guardLabel: string;
	color: string;
	directionIndicatorMode: GuardMarkerDirectionIndicatorMode;
	collisionOrder: number;
	collisionGroupSize: number;
};

type InspectorFlowNode = Node<InspectorFlowNodeData>;
type InspectorFlowEdge = Edge<InspectorFlowEdgeData>;

const getEdgePairKey = (source: string, target: string): string => {
	return source < target
		? `${source}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_PAIR_SEPARATOR}${target}`
		: `${target}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_PAIR_SEPARATOR}${source}`;
};

const getDirectionKey = (source: string, target: string): string => {
	return `${source}${STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_PAIR_SEPARATOR}${target}`;
};

const splitGuardKeys = (guard: string | null): string[] => {
	if (!guard) {
		return [];
	}

	return guard
		.split(STATE_VISUALIZER_GRAPH_SYNTAX.GUARD_DELIMITER)
		.map((guardKey) => guardKey.trim())
		.filter(Boolean);
};

const createGuardKeySetByDirectionKey = (
	graphEdges: MachineGraphEdge[],
): Map<string, Set<string>> => {
	const guardKeySetByDirectionKey = new Map<string, Set<string>>();

	for (const graphEdge of graphEdges) {
		const directionKey = getDirectionKey(graphEdge.source, graphEdge.target);
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
	const directionKey = getDirectionKey(source, target);
	const reverseDirectionKey = getDirectionKey(target, source);
	const reverseDirectionGuardKeySet =
		guardKeySetByDirectionKey.get(reverseDirectionKey) ?? new Set();

	return guardKeys.flatMap((guardKey, index) => {
		const isBidirectionalGuard =
			source !== target && reverseDirectionGuardKeySet.has(guardKey);
		const directionIndicatorMode =
			source === target
				? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE
				: isBidirectionalGuard
					? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.DUAL
					: INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE;
		const shouldHideDuplicateBidirectionalMarker =
			isBidirectionalGuard && directionKey > reverseDirectionKey;

		if (shouldHideDuplicateBidirectionalMarker) {
			return [];
		}

		return [
			{
				id: [edgeId, guardKey].join(
					STATE_VISUALIZER_GRAPH_SYNTAX.EDGE_ID_SEGMENT_SEPARATOR,
				),
				guardKey,
				guardLabel: getMachineGraphGuardLabel(guardKey),
				color:
					guardColorByKey[guardKey] ??
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS[
						index % INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_COLORS.length
					],
				directionIndicatorMode,
				collisionOrder: 0,
				collisionGroupSize: 1,
			},
		];
	});
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

const createNodePositionById = (
	graphNodes: PositionedMachineGraphNode[],
): Map<string, { x: number; y: number }> => {
	return new Map(
		graphNodes.map((graphNode) => [graphNode.id, graphNode.position]),
	);
};

const getGuardMarkerCollisionBucketKey = (
	flowEdge: InspectorFlowEdge,
	nodePositionById: Map<string, { x: number; y: number }>,
): string | null => {
	const sourcePosition = nodePositionById.get(flowEdge.source);
	const targetPosition = nodePositionById.get(flowEdge.target);

	if (!sourcePosition || !targetPosition) {
		return null;
	}

	const deltaX = Math.abs(targetPosition.x - sourcePosition.x);
	const deltaY = Math.abs(targetPosition.y - sourcePosition.y);
	const isHorizontal = deltaX > deltaY;
	const midpointX = (sourcePosition.x + targetPosition.x) / 2;
	const midpointY = (sourcePosition.y + targetPosition.y) / 2;
	const collisionBucketSize =
		INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GLOBAL_COLLISION_BUCKET_PX;
	const bucketX = Math.round(midpointX / collisionBucketSize);
	const bucketY = Math.round(midpointY / collisionBucketSize);

	return `${isHorizontal ? "h" : "v"}:${bucketX}:${bucketY}`;
};

const applyGuardMarkerCollisionGroups = (
	flowEdges: InspectorFlowEdge[],
	nodePositionById: Map<string, { x: number; y: number }>,
): InspectorFlowEdge[] => {
	if (nodePositionById.size === 0) {
		return flowEdges;
	}

	const markerIdsByCollisionBucket = new Map<string, string[]>();

	for (const flowEdge of flowEdges) {
		const flowEdgeData = flowEdge.data as InspectorFlowEdgeData;
		const collisionBucketKey = getGuardMarkerCollisionBucketKey(
			flowEdge,
			nodePositionById,
		);

		if (!collisionBucketKey) {
			continue;
		}

		const markerIds = markerIdsByCollisionBucket.get(collisionBucketKey) ?? [];

		for (const marker of flowEdgeData.guardMarkers) {
			markerIds.push(marker.id);
		}

		markerIdsByCollisionBucket.set(collisionBucketKey, markerIds);
	}

	const collisionMetaByMarkerId = new Map<
		string,
		{
			order: number;
			size: number;
		}
	>();

	for (const markerIds of markerIdsByCollisionBucket.values()) {
		const orderedMarkerIds = [...new Set(markerIds)];
		const markerGroupSize = orderedMarkerIds.length;

		orderedMarkerIds.forEach((markerId, markerIndex) => {
			collisionMetaByMarkerId.set(markerId, {
				order: markerIndex,
				size: markerGroupSize,
			});
		});
	}

	return flowEdges.map((flowEdge) => {
		const flowEdgeData = flowEdge.data as InspectorFlowEdgeData;

		return {
			...flowEdge,
			data: {
				eventType: flowEdgeData.eventType,
				guard: flowEdgeData.guard,
				markerLaneOffset: flowEdgeData.markerLaneOffset,
				sourceNodePosition: flowEdgeData.sourceNodePosition,
				targetNodePosition: flowEdgeData.targetNodePosition,
				nearbyNodePositions: flowEdgeData.nearbyNodePositions,
				guardMarkers: flowEdgeData.guardMarkers.map((marker) => {
					const collisionMeta = collisionMetaByMarkerId.get(marker.id);

					return {
						...marker,
						collisionOrder: collisionMeta?.order ?? 0,
						collisionGroupSize: collisionMeta?.size ?? 1,
					};
				}),
			},
		};
	});
};

const getFlowNodeClassName = (
	kind: MachineGraphNodeKind,
	isActive: boolean,
): string => {
	return cn(
		"rounded-md border text-xs font-semibold tracking-wide shadow-sm transition-colors",
		kind === "initial" && "border-cyan-300/80 bg-cyan-500/15 text-cyan-100",
		kind === "state" && "border-slate-300/60 bg-slate-500/20 text-slate-100",
		kind === "final" && "border-amber-300/80 bg-amber-500/15 text-amber-100",
		isActive && "ring-2 ring-cyan-300/80 ring-offset-1 ring-offset-transparent",
	);
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
	graphNodes: PositionedMachineGraphNode[] = [],
): InspectorFlowEdge[] => {
	const nodePositionById = createNodePositionById(graphNodes);
	const edgeLaneOffsetById = createEdgeLaneOffsetById(graphEdges);
	const guardKeySetByDirectionKey = createGuardKeySetByDirectionKey(graphEdges);
	const guardColorByKey = createGuardColorByKey(
		graphEdges.flatMap((edge) => splitGuardKeys(edge.guard)),
	);
	const flowEdges = graphEdges.map((graphEdge) => {
		const laneOffset = edgeLaneOffsetById.get(graphEdge.id) ?? 0;
		const sourceNodePosition = nodePositionById.get(graphEdge.source);
		const targetNodePosition = nodePositionById.get(graphEdge.target);
		const nearbyNodePositions = graphNodes
			.filter(
				(graphNode) =>
					graphNode.id !== graphEdge.source &&
					graphNode.id !== graphEdge.target,
			)
			.map((graphNode) => graphNode.position);

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
						strokeOpacity:
							INSPECTOR_FLOW_EDGE_LAYOUT.GUARDED_EDGE_STROKE_OPACITY,
					}
				: {
						stroke: INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_COLOR,
						strokeOpacity:
							INSPECTOR_FLOW_EDGE_LAYOUT.UNGUARDED_EDGE_STROKE_OPACITY,
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
				sourceNodePosition,
				targetNodePosition,
				nearbyNodePositions,
			},
			type: INSPECTOR_FLOW_EDGE_VISUALS.TYPE,
			animated: false,
			selectable: false,
		};
	});

	return applyGuardMarkerCollisionGroups(flowEdges, nodePositionById);
};

export type {
	InspectorFlowEdge,
	InspectorFlowEdgeData,
	InspectorFlowEdgeGuardMarker,
	InspectorFlowNode,
	InspectorFlowNodeData,
	InspectorFlowNodePosition,
};
