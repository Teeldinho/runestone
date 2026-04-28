import type { Vector3Tuple } from "@/shared/lib";

import { computeSquaredDistance } from "./computeSquaredDistance";

type ShouldSyncEnemyPlayerPositionInput = {
	elapsedMs: number;
	lastSentPosition: Vector3Tuple;
	nextPosition: Vector3Tuple;
	positionThreshold: number;
	updateIntervalMs: number;
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
