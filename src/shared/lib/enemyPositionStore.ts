import type { Vector3Tuple } from "@/shared/types";

const enemyPositionsById = new Map<string, Vector3Tuple>();
let enemyPositionsSnapshot: readonly Vector3Tuple[] = [];
const enemyPositionListeners = new Set<() => void>();

const syncEnemyPositionSnapshot = (): void => {
	enemyPositionsSnapshot = Array.from(enemyPositionsById.values());
};

const notifyEnemyPositionListeners = (): void => {
	enemyPositionListeners.forEach((listener) => {
		listener();
	});
};

export const getEnemyPositions = (): readonly Vector3Tuple[] =>
	enemyPositionsSnapshot;

export const setEnemyPosition = (
	id: string,
	x: number,
	y: number,
	z: number,
): void => {
	const nextPosition: Vector3Tuple = [x, y, z];
	const previousPosition = enemyPositionsById.get(id);

	if (
		previousPosition &&
		previousPosition[0] === nextPosition[0] &&
		previousPosition[1] === nextPosition[1] &&
		previousPosition[2] === nextPosition[2]
	) {
		return;
	}

	enemyPositionsById.set(id, nextPosition);
	syncEnemyPositionSnapshot();
	notifyEnemyPositionListeners();
};

export const removeEnemyPosition = (id: string): void => {
	if (!enemyPositionsById.delete(id)) {
		return;
	}

	syncEnemyPositionSnapshot();
	notifyEnemyPositionListeners();
};

export const subscribeToEnemyPositions = (
	listener: () => void,
): (() => void) => {
	enemyPositionListeners.add(listener);

	return () => {
		enemyPositionListeners.delete(listener);
	};
};

export const clearEnemyPositions = (): void => {
	if (enemyPositionsById.size === 0) {
		return;
	}

	enemyPositionsById.clear();
	syncEnemyPositionSnapshot();
	notifyEnemyPositionListeners();
};
