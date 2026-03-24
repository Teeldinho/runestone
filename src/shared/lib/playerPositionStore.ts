const playerPosition: [number, number, number] = [0, 0, 0];
const teleportTarget: { position: [number, number, number] | null } = {
	position: null,
};

export const getPlayerPosition = (): [number, number, number] => playerPosition;

export const setPlayerPosition = (x: number, y: number, z: number): void => {
	playerPosition[0] = x;
	playerPosition[1] = y;
	playerPosition[2] = z;
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
