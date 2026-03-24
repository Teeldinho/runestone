import type { Vector3Tuple } from "@/shared/types";

export const getFloorTilePositions = (
	roomWidth: number,
	roomDepth: number,
	tileSize: number,
): Vector3Tuple[] => {
	const cols = Math.round(roomWidth / tileSize);
	const rows = Math.round(roomDepth / tileSize);
	const positions: Vector3Tuple[] = [];

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const x = -roomWidth / 2 + tileSize / 2 + col * tileSize;
			const z = -roomDepth / 2 + tileSize / 2 + row * tileSize;
			positions.push([x, 0, z]);
		}
	}

	return positions;
};

export const getColumnPlacements = (
	roomWidth: number,
	roomDepth: number,
): Vector3Tuple[] => {
	const insetX = roomWidth * 0.3;
	const insetZ = roomDepth * 0.3;

	return [
		[-insetX, 0, -insetZ],
		[insetX, 0, -insetZ],
		[-insetX, 0, insetZ],
		[insetX, 0, insetZ],
	];
};
