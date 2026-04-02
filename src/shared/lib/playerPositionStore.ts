const playerPosition: [number, number, number] = [0, 0, 0];
let playerPositionSnapshot: [number, number, number] = [0, 0, 0];
let playerPositionInitialized = false;
const teleportTarget: { position: [number, number, number] | null } = {
	position: null,
};
const positionListeners = new Set<() => void>();

export const getPlayerPosition = (): [number, number, number] => playerPosition;

export const getPlayerPositionSnapshot = (): [number, number, number] =>
	playerPositionSnapshot;

export const hasPlayerPosition = (): boolean => playerPositionInitialized;

export const setPlayerPosition = (x: number, y: number, z: number): void => {
	if (
		playerPosition[0] === x &&
		playerPosition[1] === y &&
		playerPosition[2] === z
	) {
		return;
	}

	playerPosition[0] = x;
	playerPosition[1] = y;
	playerPosition[2] = z;
	playerPositionSnapshot = [x, y, z];
	playerPositionInitialized = true;
	positionListeners.forEach((listener) => {
		listener();
	});
};

export const subscribeToPlayerPosition = (
	listener: () => void,
): (() => void) => {
	positionListeners.add(listener);

	return () => {
		positionListeners.delete(listener);
	};
};

export const setPlayerTeleportTarget = (
	x: number,
	y: number,
	z: number,
): void => {
	teleportTarget.position = [x, y, z];
};

export const consumePlayerTeleportTarget = ():
	| [number, number, number]
	| null => {
	const target = teleportTarget.position;
	teleportTarget.position = null;
	return target;
};
