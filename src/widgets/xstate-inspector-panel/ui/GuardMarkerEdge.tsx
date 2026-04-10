import {
	BaseEdge,
	type Edge,
	EdgeLabelRenderer,
	type EdgeProps,
} from "@xyflow/react";
import type {
	InspectorFlowEdgeData,
	InspectorFlowEdgeGuardMarker,
} from "../lib";
import { useGuardMarkerEdge } from "../model";
import { GuardMarker } from "./GuardMarker";

export function GuardMarkerEdge(props: EdgeProps<Edge<InspectorFlowEdgeData>>) {
	const edge = useGuardMarkerEdge(props);

	return (
		<>
			<BaseEdge
				id={props.id}
				path={edge.edgePath}
				markerEnd={props.markerEnd}
				style={props.style}
			/>
			{edge.hasMarkers ? (
				<EdgeLabelRenderer>
					<div className="pointer-events-none absolute inset-0">
						{edge.markers.map(
							(
								guardMarker: InspectorFlowEdgeGuardMarker,
								markerIndex: number,
							) => (
								<GuardMarker
									key={guardMarker.id}
									guardMarker={guardMarker}
									collisionSeed={guardMarker.id}
									isSelfLoopTransition={props.source === props.target}
									markerIndex={markerIndex}
									markerCount={edge.markerCount}
									markerLaneOffset={edge.markerLaneOffset}
									labelX={edge.labelX}
									labelY={edge.labelY}
									sourceX={props.sourceX}
									sourceY={props.sourceY}
									targetX={props.targetX}
									targetY={props.targetY}
									sourcePosition={props.sourcePosition}
									targetPosition={props.targetPosition}
								/>
							),
						)}
					</div>
				</EdgeLabelRenderer>
			) : null}
		</>
	);
}
