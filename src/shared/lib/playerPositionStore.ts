const playerPosition: [number, number, number] = [0, 0, 0];

export const getPlayerPosition = (): [number, number, number] => playerPosition;

export const setPlayerPosition = (x: number, y: number, z: number): void => {
	playerPosition[0] = x;
	playerPosition[1] = y;
	playerPosition[2] = z;
};
