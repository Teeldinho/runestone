import { ROOM_ENTITY_CONFIG } from "@/entities/room/config";
import type { Vector3Tuple } from "@/shared/types";

import { getColumnPlacements } from "./roomGltfLayout";

type CuboidColliderSettings = {
	args: [number, number, number];
	position: Vector3Tuple;
};

export const getTreasuryChestPosition = (roomDepth: number): Vector3Tuple => {
	return [
		0,
		0,
		-roomDepth * ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.POSITION_Z_RATIO,
	];
};

export const getTreasuryChestCollider = (
	roomDepth: number,
): CuboidColliderSettings => {
	const chestPosition = getTreasuryChestPosition(roomDepth);

	return {
		args: [
			ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_WIDTH,
			ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_HEIGHT,
			ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.HALF_DEPTH,
		],
		position: [
			chestPosition[0],
			ROOM_ENTITY_CONFIG.COLLIDERS.TREASURY_CHEST.POSITION_Y,
			chestPosition[2],
		],
	};
};

export const getRoomColumnColliderSettings = (
	roomWidth: number,
	roomDepth: number,
): CuboidColliderSettings[] => {
	const columnPositions = getColumnPlacements(roomWidth, roomDepth);

	return columnPositions.map(([x, , z]) => ({
		args: [
			ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_WIDTH,
			ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_HEIGHT,
			ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.HALF_DEPTH,
		],
		position: [x, ROOM_ENTITY_CONFIG.COLLIDERS.COLUMN.POSITION_Y, z],
	}));
};

export type { CuboidColliderSettings };
