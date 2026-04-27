import type { Position } from "@xyflow/react";

import { INSPECTOR_GUARD_MARKER_INTERACTION } from "../config";

type GuardMarkerDirectionIndicatorMode =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE];

type GuardMarkerSelfLoopClearanceAxis =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS];

export type GuardMarkerCenterPoint = {
	x: number;
	y: number;
};

export type GuardMarkerNodeCenter = {
	x: number;
	y: number;
};

export type ResolveGuardMarkerNodeCenterFromHandleInput = {
	handleX: number;
	handleY: number;
	handlePosition: Position | undefined;
	nodeHalfWidth: number;
	nodeHalfHeight: number;
};

export type ResolveGuardMarkerInferredNodeCenterFromHandleInput = {
	handleX: number;
	handleY: number;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	isSourceNode: boolean;
	isHorizontal: boolean;
	nodeHalfWidth: number;
	nodeHalfHeight: number;
};

export type GuardMarkerNodeClearanceInput = {
	markerCenterX: number;
	markerCenterY: number;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourceNodeCenter?: GuardMarkerNodeCenter;
	targetNodeCenter?: GuardMarkerNodeCenter;
	additionalNodeCenters?: GuardMarkerNodeCenter[];
	isSelfLoopTransition?: boolean;
	sourcePosition?: Position;
	targetPosition?: Position;
	isHorizontal: boolean;
	directionSign: 1 | -1;
	fallbackDirectionSign: 1 | -1;
	directionIndicatorMode: GuardMarkerDirectionIndicatorMode;
	selfLoopClearanceAxisPreference?: GuardMarkerSelfLoopClearanceAxis;
	markerSize: number;
	nodeClearanceOffset: number;
};

export type ResolveGuardMarkerNodeOverlapClearanceInput = {
	markerCenter: GuardMarkerCenterPoint;
	nodeCenter?: GuardMarkerNodeCenter | null;
	expandedHalfWidth: number;
	expandedHalfHeight: number;
	fallbackDirectionSign: 1 | -1;
};

export type ResolveGuardMarkerDirectionalNodeClearanceInput = {
	markerCenter: GuardMarkerCenterPoint;
	sourceNodeCenter?: GuardMarkerNodeCenter | null;
	targetNodeCenter?: GuardMarkerNodeCenter | null;
	expandedHalfWidth: number;
	expandedHalfHeight: number;
	isHorizontal: boolean;
	directionSign: 1 | -1;
};

export type ResolveGuardMarkerSelfLoopClearanceInput = {
	markerCenter: GuardMarkerCenterPoint;
	sourceNodeCenter?: GuardMarkerNodeCenter | null;
	targetNodeCenter?: GuardMarkerNodeCenter | null;
	expandedHalfWidth: number;
	expandedHalfHeight: number;
	isHorizontal: boolean;
	directionSign: 1 | -1;
	fallbackDirectionSign: 1 | -1;
	directionIndicatorMode: GuardMarkerDirectionIndicatorMode;
	selfLoopClearanceAxisPreference?: GuardMarkerSelfLoopClearanceAxis;
};

export type ResolveGuardMarkerAdditionalNodeClearanceInput = {
	markerCenter: GuardMarkerCenterPoint;
	additionalNodeCenters?: GuardMarkerNodeCenter[];
	expandedHalfWidth: number;
	expandedHalfHeight: number;
	fallbackDirectionSign: 1 | -1;
};

const resolveNodeCenterFromHandle = (
	handleX: number,
	handleY: number,
	handlePosition: Position | undefined,
	nodeHalfWidth: number,
	nodeHalfHeight: number,
): GuardMarkerNodeCenter | null => {
	if (!handlePosition) {
		return null;
	}

	switch (handlePosition) {
		case "top":
			return { x: handleX, y: handleY + nodeHalfHeight };
		case "bottom":
			return { x: handleX, y: handleY - nodeHalfHeight };
		case "left":
			return { x: handleX + nodeHalfWidth, y: handleY };
		case "right":
			return { x: handleX - nodeHalfWidth, y: handleY };
		default:
			return null;
	}
};

const resolveInferredNodeCenterFromHandle = ({
	handleX,
	handleY,
	sourceX,
	sourceY,
	targetX,
	targetY,
	isSourceNode,
	isHorizontal,
	nodeHalfWidth,
	nodeHalfHeight,
}: ResolveGuardMarkerInferredNodeCenterFromHandleInput): GuardMarkerNodeCenter => {
	const isDegenerateEdge = sourceX === targetX && sourceY === targetY;

	if (isDegenerateEdge) {
		return {
			x: handleX,
			y: handleY,
		};
	}

	if (isHorizontal) {
		const isPositiveDirection = sourceX <= targetX;
		const handleToCenterX = isSourceNode
			? isPositiveDirection
				? -nodeHalfWidth
				: nodeHalfWidth
			: isPositiveDirection
				? nodeHalfWidth
				: -nodeHalfWidth;

		return {
			x: handleX + handleToCenterX,
			y: handleY,
		};
	}

	const isPositiveDirection = sourceY <= targetY;
	const handleToCenterY = isSourceNode
		? isPositiveDirection
			? -nodeHalfHeight
			: nodeHalfHeight
		: isPositiveDirection
			? nodeHalfHeight
			: -nodeHalfHeight;

	return {
		x: handleX,
		y: handleY + handleToCenterY,
	};
};

const isMarkerInsideNodeBounds = (
	markerCenter: GuardMarkerCenterPoint,
	nodeCenter: GuardMarkerNodeCenter,
	expandedHalfWidth: number,
	expandedHalfHeight: number,
): boolean => {
	return (
		Math.abs(markerCenter.x - nodeCenter.x) < expandedHalfWidth &&
		Math.abs(markerCenter.y - nodeCenter.y) < expandedHalfHeight
	);
};

const applyAxisBoundary = (
	markerValue: number,
	nodeAxisCenter: number,
	expandedHalfAxis: number,
	axisDirection: 1 | -1,
): number => {
	const boundaryValue = nodeAxisCenter + axisDirection * expandedHalfAxis;

	if (axisDirection > 0 && markerValue < boundaryValue) {
		return boundaryValue;
	}

	if (axisDirection < 0 && markerValue > boundaryValue) {
		return boundaryValue;
	}

	return markerValue;
};

const resolveSignedDirection = (
	deltaValue: number,
	fallbackDirection: 1 | -1,
): 1 | -1 => {
	if (deltaValue > 0) {
		return 1;
	}

	if (deltaValue < 0) {
		return -1;
	}

	return fallbackDirection;
};

export const resolveGuardMarkerNodeCenterFromHandle = ({
	handleX,
	handleY,
	handlePosition,
	nodeHalfWidth,
	nodeHalfHeight,
}: ResolveGuardMarkerNodeCenterFromHandleInput): GuardMarkerNodeCenter | null => {
	return resolveNodeCenterFromHandle(
		handleX,
		handleY,
		handlePosition,
		nodeHalfWidth,
		nodeHalfHeight,
	);
};

export const resolveGuardMarkerInferredNodeCenterFromHandle = (
	input: ResolveGuardMarkerInferredNodeCenterFromHandleInput,
): GuardMarkerNodeCenter => {
	return resolveInferredNodeCenterFromHandle(input);
};

export const resolveGuardMarkerNodeOverlapClearance = ({
	markerCenter,
	nodeCenter,
	expandedHalfWidth,
	expandedHalfHeight,
	fallbackDirectionSign,
}: ResolveGuardMarkerNodeOverlapClearanceInput): GuardMarkerCenterPoint => {
	if (
		!nodeCenter ||
		!isMarkerInsideNodeBounds(
			markerCenter,
			nodeCenter,
			expandedHalfWidth,
			expandedHalfHeight,
		)
	) {
		return markerCenter;
	}

	const deltaX = markerCenter.x - nodeCenter.x;
	const deltaY = markerCenter.y - nodeCenter.y;
	const overlapX = expandedHalfWidth - Math.abs(deltaX);
	const overlapY = expandedHalfHeight - Math.abs(deltaY);

	if (overlapX <= overlapY) {
		return {
			x: applyAxisBoundary(
				markerCenter.x,
				nodeCenter.x,
				expandedHalfWidth,
				resolveSignedDirection(deltaX, fallbackDirectionSign),
			),
			y: markerCenter.y,
		};
	}

	return {
		x: markerCenter.x,
		y: applyAxisBoundary(
			markerCenter.y,
			nodeCenter.y,
			expandedHalfHeight,
			resolveSignedDirection(deltaY, fallbackDirectionSign),
		),
	};
};

export const resolveGuardMarkerDirectionalNodeClearance = ({
	markerCenter,
	sourceNodeCenter,
	targetNodeCenter,
	expandedHalfWidth,
	expandedHalfHeight,
	isHorizontal,
	directionSign,
}: ResolveGuardMarkerDirectionalNodeClearanceInput): GuardMarkerCenterPoint => {
	let nextMarkerCenter = markerCenter;

	if (
		sourceNodeCenter &&
		isMarkerInsideNodeBounds(
			nextMarkerCenter,
			sourceNodeCenter,
			expandedHalfWidth,
			expandedHalfHeight,
		)
	) {
		nextMarkerCenter = isHorizontal
			? {
					x: applyAxisBoundary(
						nextMarkerCenter.x,
						sourceNodeCenter.x,
						expandedHalfWidth,
						directionSign,
					),
					y: nextMarkerCenter.y,
				}
			: {
					x: nextMarkerCenter.x,
					y: applyAxisBoundary(
						nextMarkerCenter.y,
						sourceNodeCenter.y,
						expandedHalfHeight,
						directionSign,
					),
				};
	}

	if (
		targetNodeCenter &&
		isMarkerInsideNodeBounds(
			nextMarkerCenter,
			targetNodeCenter,
			expandedHalfWidth,
			expandedHalfHeight,
		)
	) {
		const oppositeDirection = (directionSign * -1) as 1 | -1;

		nextMarkerCenter = isHorizontal
			? {
					x: applyAxisBoundary(
						nextMarkerCenter.x,
						targetNodeCenter.x,
						expandedHalfWidth,
						oppositeDirection,
					),
					y: nextMarkerCenter.y,
				}
			: {
					x: nextMarkerCenter.x,
					y: applyAxisBoundary(
						nextMarkerCenter.y,
						targetNodeCenter.y,
						expandedHalfHeight,
						oppositeDirection,
					),
				};
	}

	return nextMarkerCenter;
};

export const resolveGuardMarkerSelfLoopClearance = ({
	markerCenter,
	sourceNodeCenter,
	targetNodeCenter,
	expandedHalfWidth,
	expandedHalfHeight,
	isHorizontal,
	directionSign,
	fallbackDirectionSign,
	directionIndicatorMode,
	selfLoopClearanceAxisPreference,
}: ResolveGuardMarkerSelfLoopClearanceInput): GuardMarkerCenterPoint => {
	const referenceNodeCenter = sourceNodeCenter ?? targetNodeCenter;

	if (!referenceNodeCenter) {
		return markerCenter;
	}

	const isMarkerInsideSelfLoopNodeBounds = isMarkerInsideNodeBounds(
		markerCenter,
		referenceNodeCenter,
		expandedHalfWidth,
		expandedHalfHeight,
	);

	if (
		directionIndicatorMode ===
		INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE.NONE
	) {
		const shouldApplyOutOfBoundsSelfLoopClearance =
			!!selfLoopClearanceAxisPreference;

		if (
			!isMarkerInsideSelfLoopNodeBounds &&
			!shouldApplyOutOfBoundsSelfLoopClearance
		) {
			return markerCenter;
		}

		const selfLoopClearanceAxis =
			selfLoopClearanceAxisPreference ??
			(isHorizontal
				? INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.Y
				: INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X);

		const perpendicularDirection = fallbackDirectionSign;

		return selfLoopClearanceAxis ===
			INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X
			? {
					x: applyAxisBoundary(
						markerCenter.x,
						referenceNodeCenter.x,
						expandedHalfWidth,
						perpendicularDirection,
					),
					y: markerCenter.y,
				}
			: {
					x: markerCenter.x,
					y: applyAxisBoundary(
						markerCenter.y,
						referenceNodeCenter.y,
						expandedHalfHeight,
						perpendicularDirection,
					),
				};
	}

	if (!isMarkerInsideSelfLoopNodeBounds) {
		return markerCenter;
	}

	return isHorizontal
		? {
				x: applyAxisBoundary(
					markerCenter.x,
					referenceNodeCenter.x,
					expandedHalfWidth,
					directionSign,
				),
				y: markerCenter.y,
			}
		: {
				x: markerCenter.x,
				y: applyAxisBoundary(
					markerCenter.y,
					referenceNodeCenter.y,
					expandedHalfHeight,
					directionSign,
				),
			};
};

export const resolveGuardMarkerAdditionalNodeClearance = ({
	markerCenter,
	additionalNodeCenters = [],
	expandedHalfWidth,
	expandedHalfHeight,
	fallbackDirectionSign,
}: ResolveGuardMarkerAdditionalNodeClearanceInput): GuardMarkerCenterPoint => {
	let nextMarkerCenter = markerCenter;

	for (const additionalNodeCenter of additionalNodeCenters) {
		nextMarkerCenter = resolveGuardMarkerNodeOverlapClearance({
			markerCenter: nextMarkerCenter,
			nodeCenter: additionalNodeCenter,
			expandedHalfWidth,
			expandedHalfHeight,
			fallbackDirectionSign,
		});
	}

	return nextMarkerCenter;
};

export type {
	GuardMarkerDirectionIndicatorMode,
	GuardMarkerSelfLoopClearanceAxis,
};
