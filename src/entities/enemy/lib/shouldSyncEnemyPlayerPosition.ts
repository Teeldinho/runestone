import type { Vector3Tuple } from "@/shared/types";

type ShouldSyncEnemyPlayerPositionInput = {
	elapsedMs: number;
	lastSentPosition: Vector3Tuple;
	nextPosition: Vector3Tuple;
	positionThreshold: number;
	updateIntervalMs: number;
};

const computeSquaredDistance = (
	[leftX, leftY, leftZ]: Vector3Tuple,
	[rightX, rightY, rightZ]: Vector3Tuple,
): number => {
	const deltaX = leftX - rightX;
	const deltaY = leftY - rightY;
	const deltaZ = leftZ - rightZ;

	return deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
};

export const shouldSyncEnemyPlayerPosition = ({
	elapsedMs,
	lastSentPosition,
	nextPosition,
	positionThreshold,
	updateIntervalMs,
}: ShouldSyncEnemyPlayerPositionInput): boolean => {
	if (elapsedMs < updateIntervalMs) {
		return false;
	}

	return (
		computeSquaredDistance(lastSentPosition, nextPosition) >=
		positionThreshold * positionThreshold
	);
};

export type { ShouldSyncEnemyPlayerPositionInput };
