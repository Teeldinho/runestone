import { type Edge, type EdgeProps, getSmoothStepPath } from "@xyflow/react";
import { useMemo } from "react";
import type {
	InspectorFlowEdgeData,
	InspectorFlowEdgeGuardMarker,
} from "../lib";

type GuardMarkerEdgeViewModel = {
	edgePath: string;
	labelX: number;
	labelY: number;
	markerCount: number;
	markerLaneOffset: number;
	hasMarkers: boolean;
	markers: InspectorFlowEdgeGuardMarker[];
};

export function useGuardMarkerEdge({
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	pathOptions,
	data,
}: EdgeProps<Edge<InspectorFlowEdgeData>>): GuardMarkerEdgeViewModel {
	const markers = useMemo(() => data?.guardMarkers ?? [], [data?.guardMarkers]);
	const markerCount = markers.length;
	const markerLaneOffset = data?.markerLaneOffset ?? 0;

	const smoothStepPathOptions = useMemo(
		() =>
			(pathOptions ?? {}) as {
				borderRadius?: number;
				offset?: number;
			},
		[pathOptions],
	);

	const [edgePath, labelX, labelY] = useMemo(
		() =>
			getSmoothStepPath({
				sourceX,
				sourceY,
				targetX,
				targetY,
				sourcePosition,
				targetPosition,
				borderRadius: smoothStepPathOptions.borderRadius,
				offset: smoothStepPathOptions.offset,
			}),
		[
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition,
			smoothStepPathOptions,
		],
	);

	return {
		edgePath,
		labelX,
		labelY,
		markerCount,
		markerLaneOffset,
		hasMarkers: markerCount > 0,
		markers,
	};
}
