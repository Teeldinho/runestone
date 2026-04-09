import {
	BaseEdge,
	EdgeLabelRenderer,
	type EdgeProps,
	getSmoothStepPath,
} from "@xyflow/react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";
import { INSPECTOR_FLOW_EDGE_LAYOUT } from "../config";
import type {
	InspectorFlowEdgeData,
	InspectorFlowEdgeGuardMarker,
} from "../lib";

export function GuardMarkerEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	markerEnd,
	style,
	pathOptions,
	data,
}: EdgeProps) {
	const edgeData = data as InspectorFlowEdgeData | undefined;
	const smoothStepPathOptions = (pathOptions ?? {}) as {
		borderRadius?: number;
		offset?: number;
	};

	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		borderRadius: smoothStepPathOptions.borderRadius,
		offset: smoothStepPathOptions.offset,
	});

	const markerCount = edgeData?.guardMarkers.length ?? 0;
	const markerLaneOffset = edgeData?.markerLaneOffset ?? 0;
	const isDownwardDirection = sourceY <= targetY;

	return (
		<>
			<BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
			{markerCount > 0 ? (
				<EdgeLabelRenderer>
					<div className="pointer-events-none absolute inset-0">
						{edgeData?.guardMarkers.map(
							(
								guardMarker: InspectorFlowEdgeGuardMarker,
								markerIndex: number,
							) => {
								const markerDirectionOffset = guardMarker.showDirectionIndicator
									? isDownwardDirection
										? INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_DIRECTION_OFFSET_PX
										: -INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_DIRECTION_OFFSET_PX
									: 0;
								const markerArrowOffset =
									INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX / 2 + 4;

								return (
									<HoverCard
										openDelay={80}
										closeDelay={60}
										key={guardMarker.id}
									>
										<HoverCardTrigger asChild>
											<button
												type="button"
												className="pointer-events-auto nodrag nopan absolute flex items-center justify-center rounded-full"
												style={{
													width: `${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_HIT_AREA_PX}px`,
													height: `${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_HIT_AREA_PX}px`,
													left:
														labelX +
														markerLaneOffset *
															INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_LANE_SEPARATION_FACTOR +
														(markerIndex - (markerCount - 1) / 2) *
															INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GAP_PX,
													top: labelY + markerDirectionOffset,
													transform: "translate(-50%, -50%)",
												}}
												aria-label={guardMarker.guardLabel}
											>
												<span
													className="rounded-full border border-panel-border shadow-sm"
													style={{
														width: `${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX}px`,
														height: `${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX}px`,
														backgroundColor: guardMarker.color,
														boxShadow: `0 0 0 1px ${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RING_COLOR}`,
													}}
												/>
												{guardMarker.showDirectionIndicator ? (
													<span
														className="pointer-events-none absolute text-[9px] font-semibold leading-none text-panel-title"
														style={{
															left: "50%",
															top: isDownwardDirection
																? `calc(50% + ${markerArrowOffset}px)`
																: `calc(50% - ${markerArrowOffset}px)`,
															transform: "translate(-50%, -50%)",
														}}
													>
														{isDownwardDirection ? "↓" : "↑"}
													</span>
												) : null}
											</button>
										</HoverCardTrigger>
										<HoverCardContent className="w-72">
											<p className="text-[11px] font-semibold text-panel-title">
												Guard
											</p>
											<p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
												{guardMarker.guardLabel}
											</p>
											{guardMarker.showDirectionIndicator ? (
												<p className="mt-1 text-[10px] text-muted-foreground/80">
													Direction: {isDownwardDirection ? "down" : "up"}
												</p>
											) : null}
										</HoverCardContent>
									</HoverCard>
								);
							},
						)}
					</div>
				</EdgeLabelRenderer>
			) : null}
		</>
	);
}
