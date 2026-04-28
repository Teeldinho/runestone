import { MACHINE_GRAPH_LAYOUT } from "@/features/state-visualizer";

import {
	type GuardMarkerCenterPoint,
	type GuardMarkerNodeCenter,
	type GuardMarkerNodeClearanceInput,
	type ResolveGuardMarkerNodeCenterInput,
	resolveGuardMarkerAdditionalNodeClearance,
	resolveGuardMarkerDirectionalNodeClearance,
	resolveGuardMarkerInferredNodeCenterFromHandle,
	resolveGuardMarkerNodeCenterFromHandle,
	resolveGuardMarkerSelfLoopClearance,
} from "./guardMarkerNodeClearanceHelpers";

const areNodeCentersEqual = (
	firstNodeCenter: GuardMarkerNodeCenter,
	secondNodeCenter: GuardMarkerNodeCenter,
): boolean => {
	return (
		firstNodeCenter.x === secondNodeCenter.x &&
		firstNodeCenter.y === secondNodeCenter.y
	);
};

const resolveGuardMarkerNodeCenter = (
	nodeCenter: GuardMarkerNodeCenter | undefined,
	handleInput: ResolveGuardMarkerNodeCenterInput,
): GuardMarkerNodeCenter | undefined => {
	return (
		nodeCenter ??
		resolveGuardMarkerNodeCenterFromHandle({
			handleX: handleInput.handleX,
			handleY: handleInput.handleY,
			handlePosition: handleInput.handlePosition,
			nodeHalfWidth: handleInput.nodeHalfWidth,
			nodeHalfHeight: handleInput.nodeHalfHeight,
		}) ??
		resolveGuardMarkerInferredNodeCenterFromHandle({
			handleX: handleInput.handleX,
			handleY: handleInput.handleY,
			sourceX: handleInput.sourceX,
			sourceY: handleInput.sourceY,
			targetX: handleInput.targetX,
			targetY: handleInput.targetY,
			isSourceNode: handleInput.isSourceNode,
			isHorizontal: handleInput.isHorizontal,
			nodeHalfWidth: handleInput.nodeHalfWidth,
			nodeHalfHeight: handleInput.nodeHalfHeight,
		})
	);
};

export const resolveGuardMarkerNodeClearance = ({
	markerCenterX,
	markerCenterY,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourceNodeCenter: sourceNodeCenterInput,
	targetNodeCenter: targetNodeCenterInput,
	additionalNodeCenters = [],
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

	const sourceNodeCenter = resolveGuardMarkerNodeCenter(sourceNodeCenterInput, {
		handleX: sourceX,
		handleY: sourceY,
		handlePosition: sourcePosition,
		isSourceNode: true,
		isHorizontal,
		sourceX,
		sourceY,
		targetX,
		targetY,
		nodeHalfWidth,
		nodeHalfHeight,
	});

	const targetNodeCenter = resolveGuardMarkerNodeCenter(targetNodeCenterInput, {
		handleX: targetX,
		handleY: targetY,
		handlePosition: targetPosition,
		isSourceNode: false,
		isHorizontal,
		sourceX,
		sourceY,
		targetX,
		targetY,
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

	if (shouldTreatAsSelfLoop) {
		const selfLoopMarkerCenter = resolveGuardMarkerSelfLoopClearance({
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
		});

		return resolveGuardMarkerAdditionalNodeClearance({
			markerCenter: selfLoopMarkerCenter,
			additionalNodeCenters,
			expandedHalfWidth,
			expandedHalfHeight,
			fallbackDirectionSign,
		});
	}

	const directionalMarkerCenter = resolveGuardMarkerDirectionalNodeClearance({
		markerCenter,
		sourceNodeCenter,
		targetNodeCenter,
		expandedHalfWidth,
		expandedHalfHeight,
		isHorizontal,
		directionSign,
	});

	return resolveGuardMarkerAdditionalNodeClearance({
		markerCenter: directionalMarkerCenter,
		additionalNodeCenters,
		expandedHalfWidth,
		expandedHalfHeight,
		fallbackDirectionSign,
	});
};

export type { GuardMarkerCenterPoint, GuardMarkerNodeClearanceInput };
