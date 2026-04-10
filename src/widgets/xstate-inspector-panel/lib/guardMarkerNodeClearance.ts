import type { Position } from "@xyflow/react";

import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";

import { INSPECTOR_GUARD_MARKER_INTERACTION } from "../config";

type GuardMarkerDirectionIndicatorMode =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.DIRECTION_INDICATOR_MODE];

type GuardMarkerSelfLoopClearanceAxis =
	(typeof INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS)[keyof typeof INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS];

type GuardMarkerNodeClearanceInput = {
	markerCenterX: number;
	markerCenterY: number;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
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

type GuardMarkerCenterPoint = {
	x: number;
	y: number;
};

type GuardMarkerNodeCenter = {
	x: number;
	y: number;
};

type InferredNodeCenterInput = {
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
}: InferredNodeCenterInput): GuardMarkerNodeCenter => {
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
		Math.abs(markerCenter.x - nodeCenter.x) <= expandedHalfWidth &&
		Math.abs(markerCenter.y - nodeCenter.y) <= expandedHalfHeight
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

const areNodeCentersEqual = (
	firstNodeCenter: GuardMarkerNodeCenter,
	secondNodeCenter: GuardMarkerNodeCenter,
): boolean => {
	return (
		firstNodeCenter.x === secondNodeCenter.x &&
		firstNodeCenter.y === secondNodeCenter.y
	);
};

export const resolveGuardMarkerNodeClearance = ({
	markerCenterX,
	markerCenterY,
	sourceX,
	sourceY,
	targetX,
	targetY,
	isSelfLoopTransition,
	sourcePosition,
	targetPosition,
	isHorizontal,
	directionSign,
	fallbackDirectionSign,
	directionIndicatorMode,
	selfLoopClearanceAxisPreference,
	markerSize,
	nodeClearanceOffset,
}: GuardMarkerNodeClearanceInput): GuardMarkerCenterPoint => {
	const nodeHalfWidth = MACHINE_GRAPH_LAYOUT.NODE_WIDTH / 2;
	const nodeHalfHeight = MACHINE_GRAPH_LAYOUT.NODE_HEIGHT / 2;
	const markerHalfSize = markerSize / 2;
	const expandedHalfWidth =
		nodeHalfWidth + markerHalfSize + nodeClearanceOffset;
	const expandedHalfHeight =
		nodeHalfHeight + markerHalfSize + nodeClearanceOffset;
	const sourceNodeCenter =
		resolveNodeCenterFromHandle(
			sourceX,
			sourceY,
			sourcePosition,
			nodeHalfWidth,
			nodeHalfHeight,
		) ??
		resolveInferredNodeCenterFromHandle({
			handleX: sourceX,
			handleY: sourceY,
			sourceX,
			sourceY,
			targetX,
			targetY,
			isSourceNode: true,
			isHorizontal,
			nodeHalfWidth,
			nodeHalfHeight,
		});
	const targetNodeCenter =
		resolveNodeCenterFromHandle(
			targetX,
			targetY,
			targetPosition,
			nodeHalfWidth,
			nodeHalfHeight,
		) ??
		resolveInferredNodeCenterFromHandle({
			handleX: targetX,
			handleY: targetY,
			sourceX,
			sourceY,
			targetX,
			targetY,
			isSourceNode: false,
			isHorizontal,
			nodeHalfWidth,
			nodeHalfHeight,
		});

	const markerCenter = {
		x: markerCenterX,
		y: markerCenterY,
	};
	const isSelfLoopNodeCenter =
		!!sourceNodeCenter &&
		!!targetNodeCenter &&
		areNodeCentersEqual(sourceNodeCenter, targetNodeCenter);
	const shouldTreatAsSelfLoop =
		isSelfLoopTransition === true || isSelfLoopNodeCenter;
	const selfLoopReferenceNodeCenter = sourceNodeCenter ?? targetNodeCenter;

	if (shouldTreatAsSelfLoop && selfLoopReferenceNodeCenter) {
		const isMarkerInsideSelfLoopNodeBounds = isMarkerInsideNodeBounds(
			markerCenter,
			selfLoopReferenceNodeCenter,
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

			const perpendicularDirection = fallbackDirectionSign;
			const selfLoopClearanceAxis =
				selfLoopClearanceAxisPreference ??
				(isHorizontal
					? INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.Y
					: INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X);

			return selfLoopClearanceAxis ===
				INSPECTOR_GUARD_MARKER_INTERACTION.SELF_LOOP_CLEARANCE_AXIS.X
				? {
						x: applyAxisBoundary(
							markerCenter.x,
							selfLoopReferenceNodeCenter.x,
							expandedHalfWidth,
							perpendicularDirection,
						),
						y: markerCenter.y,
					}
				: {
						x: markerCenter.x,
						y: applyAxisBoundary(
							markerCenter.y,
							selfLoopReferenceNodeCenter.y,
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
						selfLoopReferenceNodeCenter.x,
						expandedHalfWidth,
						directionSign,
					),
					y: markerCenter.y,
				}
			: {
					x: markerCenter.x,
					y: applyAxisBoundary(
						markerCenter.y,
						selfLoopReferenceNodeCenter.y,
						expandedHalfHeight,
						directionSign,
					),
				};
	}

	let nextMarkerCenter = { ...markerCenter };

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

export type { GuardMarkerCenterPoint, GuardMarkerNodeClearanceInput };
