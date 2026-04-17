import type { Position } from "@xyflow/react";
import type { CSSProperties } from "react";
import { cn } from "@/shared/lib";

import {
	INSPECTOR_FLOW_EDGE_LAYOUT,
	INSPECTOR_GUARD_MARKER_INTERACTION,
} from "../config";
import { resolveGuardMarkerNodeClearance } from "./guardMarkerNodeClearance";
import type { InspectorFlowNodePosition } from "./reactFlowGraphMappers";

type GuardMarkerDirectionIndicatorMode =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE];

type GuardMarkerEdgeLayoutInput = {
	sourceY: number;
	targetY: number;
	sourceX: number;
	targetX: number;
	isSelfLoopTransition?: boolean;
	collisionSeed?: string;
	collisionOrder?: number;
	collisionGroupSize?: number;
	sourcePosition?: Position;
	targetPosition?: Position;
	sourceNodePosition?: InspectorFlowNodePosition;
	targetNodePosition?: InspectorFlowNodePosition;
	nearbyNodePositions?: InspectorFlowNodePosition[];
	markerLaneOffset: number;
	markerIndex: number;
	markerCount: number;
	labelX: number;
	labelY: number;
	directionIndicatorMode: GuardMarkerDirectionIndicatorMode;
	markerColor: string;
};

type GuardMarkerEdgeLayoutEnvironment = {
	isDesktopLayout: boolean;
	isLandscape: boolean;
};

type GuardMarkerArrow = {
	id: string;
	symbol: string;
	styles: CSSProperties;
};

type GuardMarkerEdgeLayoutViewModel = {
	markerSize: number;
	markerGap: number;
	hitAreaSize: number;
	markerButtonStyles: CSSProperties;
	markerBubbleStyles: CSSProperties;
	markerArrows: GuardMarkerArrow[];
	bubbleClassName: string;
	arrowClassName: string;
	hasDirectionIndicators: boolean;
};

const resolveCollisionHash = (collisionSeed: string): number => {
	let hash = 0;

	for (let index = 0; index < collisionSeed.length; index += 1) {
		hash = (hash * 31 + collisionSeed.charCodeAt(index)) >>> 0;
	}

	return hash;
};

export const createGuardMarkerEdgeLayoutViewModel = ({
	sourceX,
	sourceY,
	targetX,
	targetY,
	isSelfLoopTransition,
	collisionSeed,
	collisionOrder = 0,
	collisionGroupSize = 1,
	sourcePosition,
	targetPosition,
	sourceNodePosition,
	targetNodePosition,
	nearbyNodePositions,
	markerLaneOffset,
	markerIndex,
	markerCount,
	labelX,
	labelY,
	directionIndicatorMode,
	markerColor,
	isDesktopLayout,
	isLandscape,
}: GuardMarkerEdgeLayoutInput &
	GuardMarkerEdgeLayoutEnvironment): GuardMarkerEdgeLayoutViewModel => {
	const isMobileTabletLandscape = !isDesktopLayout && isLandscape;

	const {
		markerSize,
		markerGap,
		hitAreaSize,
		directionOffset: baseDirectionOffset,
		noDirectionOffset,
		nodeClearanceOffset,
	} = isMobileTabletLandscape
		? {
				markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_SIZE_PX,
				markerGap: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_GAP_PX,
				hitAreaSize:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_HIT_AREA_PX,
				directionOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_DIRECTION_OFFSET_PX,
				noDirectionOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_NO_DIRECTION_OFFSET_PX,
				nodeClearanceOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RESPONSIVE_NODE_CLEARANCE_OFFSET_PX,
			}
		: {
				markerSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_SIZE_PX,
				markerGap: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GAP_PX,
				hitAreaSize: INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_HIT_AREA_PX,
				directionOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_DIRECTION_OFFSET_PX,
				noDirectionOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NO_DIRECTION_OFFSET_PX,
				nodeClearanceOffset:
					INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_NODE_CLEARANCE_OFFSET_PX,
			};

	const deltaX = Math.abs(targetX - sourceX);
	const deltaY = Math.abs(targetY - sourceY);
	const isHorizontal = deltaX > deltaY;

	const isPositiveDirection = isHorizontal
		? sourceX <= targetX
		: sourceY <= targetY;

	const directionArrow = isHorizontal
		? isPositiveDirection
			? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL
					.POS
			: INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL
					.NEG
		: isPositiveDirection
			? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.POS
			: INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.NEG;
	const reverseDirectionArrow = isHorizontal
		? isPositiveDirection
			? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL
					.NEG
			: INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.HORIZONTAL
					.POS
		: isPositiveDirection
			? INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.NEG
			: INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_BY_AXIS.VERTICAL.POS;
	const directionSign = isPositiveDirection ? 1 : -1;
	const fallbackDirectionSign = markerIndex % 2 === 0 ? 1 : -1;

	const markerDirectionOffsetValue =
		directionIndicatorMode ===
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE
			? directionSign * baseDirectionOffset
			: fallbackDirectionSign * noDirectionOffset;
	const collisionHash = collisionSeed ? resolveCollisionHash(collisionSeed) : 0;
	const collisionJitterRatio =
		collisionSeed && collisionHash !== 0
			? (collisionHash / 0xffffffff) * 2 - 1
			: 0;
	const desktopVerticalCollisionJitter =
		isDesktopLayout && !isHorizontal
			? collisionJitterRatio *
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_DESKTOP_COLLISION_JITTER_PX
			: 0;
	const markerAxisOffset = markerDirectionOffsetValue;

	const markerIndexOffset = (markerIndex - (markerCount - 1) / 2) * markerGap;
	const perpendicularOffset =
		markerLaneOffset +
		markerIndexOffset *
			INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_LANE_SEPARATION_FACTOR;
	const markerXOffset = isHorizontal ? markerAxisOffset : perpendicularOffset;
	const markerYOffset = isHorizontal ? perpendicularOffset : markerAxisOffset;
	const selfLoopClearanceAxisPreference = isDesktopLayout
		? INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X
		: undefined;
	const desktopGlobalCollisionOffset =
		isDesktopLayout && collisionGroupSize > 1
			? (collisionOrder - (collisionGroupSize - 1) / 2) *
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GLOBAL_COLLISION_STEP_PX
			: 0;
	const mobileTabletGlobalCollisionOffset =
		!isDesktopLayout && collisionGroupSize > 1
			? (collisionOrder - (collisionGroupSize - 1) / 2) *
				INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_GLOBAL_COLLISION_STEP_PX
			: 0;
	const globalCollisionOffset = isDesktopLayout
		? !isHorizontal
			? desktopGlobalCollisionOffset
			: 0
		: mobileTabletGlobalCollisionOffset;
	const clearedMarkerCenter = resolveGuardMarkerNodeClearance({
		markerCenterX: labelX + markerXOffset + desktopVerticalCollisionJitter,
		markerCenterY: labelY + markerYOffset,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourceNodeCenter: sourceNodePosition,
		targetNodeCenter: targetNodePosition,
		additionalNodeCenters: nearbyNodePositions,
		isSelfLoopTransition,
		sourcePosition,
		targetPosition,
		isHorizontal,
		directionSign: directionSign as 1 | -1,
		fallbackDirectionSign: fallbackDirectionSign as 1 | -1,
		directionIndicatorMode,
		selfLoopClearanceAxisPreference,
		markerSize,
		nodeClearanceOffset,
	});
	const resolvedMarkerCenter = isHorizontal
		? {
				x: clearedMarkerCenter.x,
				y: clearedMarkerCenter.y + globalCollisionOffset,
			}
		: {
				x: clearedMarkerCenter.x + globalCollisionOffset,
				y: clearedMarkerCenter.y,
			};

	const markerArrowPositionOffset =
		markerSize / 2 +
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_ARROW_OFFSET_EXTRA_PX;
	const singleArrowLeft = isHorizontal
		? isPositiveDirection
			? `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} + ${markerArrowPositionOffset}px)`
			: `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} - ${markerArrowPositionOffset}px)`
		: INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT;
	const singleArrowTop = isHorizontal
		? INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT
		: isPositiveDirection
			? `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} + ${markerArrowPositionOffset}px)`
			: `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} - ${markerArrowPositionOffset}px)`;
	const dualForwardArrowLeft = isHorizontal
		? `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} + ${markerArrowPositionOffset}px)`
		: INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT;
	const dualForwardArrowTop = isHorizontal
		? INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT
		: `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} + ${markerArrowPositionOffset}px)`;
	const dualReverseArrowLeft = isHorizontal
		? `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} - ${markerArrowPositionOffset}px)`
		: INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT;
	const dualReverseArrowTop = isHorizontal
		? INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT
		: `calc(${INSPECTOR_GUARD_MARKER_INTERACTION.POSITION_CENTER_PERCENT} - ${markerArrowPositionOffset}px)`;

	const markerArrows: GuardMarkerArrow[] =
		directionIndicatorMode ===
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.SINGLE
			? [
					{
						id: "single",
						symbol: directionArrow,
						styles: {
							left: singleArrowLeft,
							top: singleArrowTop,
							transform: INSPECTOR_GUARD_MARKER_INTERACTION.TRANSLATE_CENTER,
						},
					},
				]
			: directionIndicatorMode ===
					INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.DUAL
				? [
						{
							id: "forward",
							symbol: directionArrow,
							styles: {
								left: dualForwardArrowLeft,
								top: dualForwardArrowTop,
								transform: INSPECTOR_GUARD_MARKER_INTERACTION.TRANSLATE_CENTER,
							},
						},
						{
							id: "reverse",
							symbol: reverseDirectionArrow,
							styles: {
								left: dualReverseArrowLeft,
								top: dualReverseArrowTop,
								transform: INSPECTOR_GUARD_MARKER_INTERACTION.TRANSLATE_CENTER,
							},
						},
					]
				: [];

	return {
		markerSize,
		markerGap,
		hitAreaSize,
		markerButtonStyles: {
			width: `${hitAreaSize}px`,
			height: `${hitAreaSize}px`,
			left: resolvedMarkerCenter.x,
			top: resolvedMarkerCenter.y,
			transform: INSPECTOR_GUARD_MARKER_INTERACTION.TRANSLATE_CENTER,
			zIndex: 20,
		},
		markerBubbleStyles: {
			width: `${markerSize}px`,
			height: `${markerSize}px`,
			backgroundColor: markerColor,
			boxShadow: `0 0 0 1px ${INSPECTOR_FLOW_EDGE_LAYOUT.GUARD_MARKER_RING_COLOR}`,
		},
		markerArrows,
		bubbleClassName:
			"rounded-full border border-panel-border shadow-sm animate-pulse",
		arrowClassName: cn(
			"pointer-events-none absolute font-semibold leading-none text-panel-title",
			isMobileTabletLandscape ? "text-[7px]" : "text-[9px]",
		),
		hasDirectionIndicators: markerArrows.length > 0,
	};
};

export type {
	GuardMarkerArrow,
	GuardMarkerDirectionIndicatorMode,
	GuardMarkerEdgeLayoutEnvironment,
	GuardMarkerEdgeLayoutInput,
	GuardMarkerEdgeLayoutViewModel,
};
